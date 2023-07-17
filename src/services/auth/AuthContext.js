// create a context
// Put some state in the context
// Share the created context with other components

import { createContext, useContext, useEffect, useState } from "react";
import { executeJwtAuthenticationService } from "../api/AuthApiService";
import { apiClient } from "../api/ApiClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {

    // Todo: how to set username after page refresh
    const [username, setUsername] = useState(null)

    const [requestInterceptor, setRequestInterceptor] = useState(null)

    const [responseInterceptor, setResponseInterceptor] = useState(null)

    const [isAuthenticated, setAuthenticated] = useState(checkAuthenticationLocally());

    const [token, setToken] = useState(null)

    useEffect(
        () => {
            // to set header on page refresh
            if (isAuthenticated) {
                // console.log('adding interceptors after refresh')
                // note: it doesn't executes for first API call
                // so we need to set it seperately, even before useEffect
                addInterceptors(localStorage.getItem('token'));
            }
        }, []
    )

    // to use jwt token on page refresh
    function checkAuthenticationLocally() {
        // check if token is present in local storage
        // parse the token
        // check if it is expired
        // if expired: delete from local storage
        // TODO: make an api call to authenticate using refresh token
        const jwt = localStorage.getItem('token');
        if (jwt === null) {
            return false;
        }

        const parsedJwt = parseJwt(jwt);
        // console.log(parsedJwt)
        // console.log(parsedJwt.exp, Date.now() / 1000)
        const isExpired = parsedJwt.exp < (Date.now() / 1000);

        if (isExpired === true) {
            localStorage.removeItem('token');
            return false;
        }

        return true;
    }

    function parseJwt(token) {
        if (token === null)
            return false;
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    // async function login(username, password) {

    //     const baToken = 'Basic ' + window.btoa(username + ":" + password)

    //     try {
    //         const response = await executeBasicAuthenticationService(baToken)

    //         if (response.status === 200) {
    //             console.log('success')
    //             setAuthenticated(true);
    //             setUsername(username)
    //             setToken(baToken)

    //             apiClient.interceptors.request.use(
    //                 (config) => {
    //                     // console.log('intercepting and adding a token')
    //                     config.headers.Authorization = baToken
    //                     return config
    //                 }
    //             )

    //             return true;
    //         } else {
    //             console.log('bad creds')
    //             logout();
    //             return false;
    //         }
    //     } catch (error) {
    //         console.log('error in api')
    //         logout();
    //         return false;
    //     }
    // }

    async function login(username, password) {
        try {
            // remove interceptors before login to avoid bearer token attached
            // console.log('removing interceptors before login')
            apiClient.interceptors.request.eject(requestInterceptor)
            apiClient.interceptors.response.eject(responseInterceptor)

            // we also need to remove header added from local storage
            // scenario: after refresh if first API call
            // console.log(apiClient.defaults)
            delete apiClient.defaults.headers.common['Authorization'];

            const response = await executeJwtAuthenticationService(username, password)

            if (response.status === 200) {
                console.log('login success')

                const jwtToken = 'Bearer ' + response.data.token;

                setAuthenticated(true);
                setUsername(username)
                setToken(jwtToken)

                // add interceptors
                console.log('adding interceptors after login')
                addInterceptors(jwtToken)

                return true;
            } else {
                console.log('bad creds')
                logout();
                return false;
            }
        } catch (error) {
            console.log('error in login api')
            logout();
            return false;
        }
    }

    function addInterceptors(jwtToken) {
        // console.log('adding interceptors. Old interceptors: ', requestInterceptor, responseInterceptor);
        // remove old interceptors before adding new one
        apiClient.interceptors.request.eject(requestInterceptor)
        apiClient.interceptors.response.eject(responseInterceptor)
        // console.log('ejected interceptors')

        // to set headers on each API call
        const myRequestInterceptor = apiClient.interceptors.request.use(
            (config) => {
                // console.log('from added request interceptor. Old interceptors: ', requestInterceptor, responseInterceptor);
                config.headers.Authorization = jwtToken
                localStorage.setItem('token', jwtToken)
                return config
            }
        )

        setRequestInterceptor(myRequestInterceptor);

        const myResponseInterceptor = apiClient.interceptors.response.use(function (response) {
            // console.log('from added response interceptor. Old interceptors: ', requestInterceptor, responseInterceptor);
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response;
        }, function (error) {
            // console.log('from added response interceptor error. Old interceptors: ', requestInterceptor, responseInterceptor);
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            // console.log("from interceptor", error)
            if (error.response && error.response.status === 401) {
                console.error('jwt is not valid')
                // I think there is no easy way to pass current interceptors id's to this login function.
                // Hence it is better to do removal in login instead of logout
                logout();
            }
            return Promise.reject(error);
        });

        setResponseInterceptor(myResponseInterceptor);
    }

    function logout() {
        console.log('logging out ' + username)
        localStorage.removeItem('token')

        // console.log(apiClient.defaults.headers.common["Authorization"])
        // delete apiClient.defaults.headers.common["Authorization"];

        /* one working solution to remove authorization header from app for each call
         * But it doesn't work with response interceptor internal call 
         * (will have id's of previous interceptors)
         * hence user might need to login two times (in case of invalid jwt)
         */
        // console.log(requestInterceptor, responseInterceptor)
        // apiClient.interceptors.request.eject(requestInterceptor)
        // apiClient.interceptors.response.eject(responseInterceptor)
        // console.log('removed request interceptors after logout')

        setAuthenticated(false)
        setUsername(null)
        setToken(null)

        // second working solution to remove authorization header from app
        // window.location.reload()
    }

    const valuesToBeShared = { isAuthenticated, login, logout, username, token }

    return (
        <AuthContext.Provider value={valuesToBeShared}>
            {children}
        </AuthContext.Provider>
    )
}