// create a context
// Put some state in the context
// Share the created context with other components

import { createContext, useContext, useEffect, useState } from "react";
import { executeJwtAuthenticationService, startApi } from "../api/AuthApiService";
import { apiClient } from "../api/ApiClient";

import { auth, provider, signInWithPopup } from '../firebaseConfig';

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
                // console.debug('adding interceptors after refresh')
                // note: it doesn't executes for first API call
                // so we need to set it seperately, even before useEffect
                addInterceptors(localStorage.getItem('token'));
                setUsername(localStorage.getItem('token') ? parseJwt(localStorage.getItem('token')).name : null);
            }
        }, []   // eslint-disable-line react-hooks/exhaustive-deps
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
        // console.debug(parsedJwt)
        // console.debug(parsedJwt.exp, Date.now() / 1000)
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
    //             console.debug('success')
    //             setAuthenticated(true);
    //             setUsername(username)
    //             setToken(baToken)

    //             apiClient.interceptors.request.use(
    //                 (config) => {
    //                     // console.debug('intercepting and adding a token')
    //                     config.headers.Authorization = baToken
    //                     return config
    //                 }
    //             )

    //             return true;
    //         } else {
    //             console.debug('bad creds')
    //             logout();
    //             return false;
    //         }
    //     } catch (error) {
    //         console.debug('error in api')
    //         logout();
    //         return false;
    //     }
    // }

    async function login(username, password) {
        try {
            // remove interceptors before login to avoid bearer token attached
            // console.debug('removing interceptors before login')
            apiClient.interceptors.request.eject(requestInterceptor)
            apiClient.interceptors.response.eject(responseInterceptor)

            // we also need to remove header added from local storage
            // scenario: after refresh if first API call
            // console.debug(apiClient.defaults)
            delete apiClient.defaults.headers.common['Authorization'];

            // todo: implement better fix for case sensitive username 
            const response = await executeJwtAuthenticationService(username.toLowerCase(), password)

            if (response.status === 200) {
                // console.debug('login success')

                const jwtToken = 'Bearer ' + response.data.token;

                setAuthenticated(true);
                setUsername(username)
                setToken(jwtToken)

                // add interceptors
                // console.debug('adding interceptors after login')
                addInterceptors(jwtToken)

                return true;
            } else {
                console.error('bad creds')
                logout();
                return false;
            }
        } catch (error) {
            console.error('error in login api')
            logout();
            return false;
        }
    }

    async function googleSignIn(token) {
        // console.debug('login success')
        const jwtToken = 'Bearer ' + token;

        const parsedJwt = parseJwt(jwtToken)
        // console.debug(parsedJwt)

        setAuthenticated(true);
        setUsername(parsedJwt.name)
        setToken(jwtToken)

        // for page reload
        localStorage.setItem('token', jwtToken)

        // add interceptors
        // console.debug('adding interceptors after login')
        addInterceptors(jwtToken)

        // if new user; save it in the backend
        const response = await startApi();
        if (response.status === 200) {
            // console.info("if new user; saved in the backend")
        }

        return true;
    }

    function addInterceptors(jwtToken) {
        // console.debug('adding interceptors. Old interceptors: ', requestInterceptor, responseInterceptor);
        // remove old interceptors before adding new one
        apiClient.interceptors.request.eject(requestInterceptor)
        apiClient.interceptors.response.eject(responseInterceptor)
        // console.debug('ejected interceptors')

        // to set headers on each API call
        const myRequestInterceptor = apiClient.interceptors.request.use(
            async (config) => {
                // console.debug('from added request interceptor. Old interceptors: ', requestInterceptor, responseInterceptor);

                // Check jwt expiry, get a new token if required
                // console.debug(parseJwt(jwtToken).exp - (Date.now() / 1000));
                if (parseJwt(jwtToken).exp - (Date.now() / 1000) <= 60) {
                    // todo: handle error response gracefully
                    jwtToken = 'Bearer ' + await auth.currentUser.getIdToken(/* forceRefresh */ true);
                    // update local storage
                    localStorage.setItem('token', jwtToken)
                    // console.debug(parseJwt(jwtToken).exp - (Date.now() / 1000));
                }

                config.headers.Authorization = jwtToken;
                // localStorage.setItem('token', jwtToken) don't set it on every api call
                return config
            }
        )

        setRequestInterceptor(myRequestInterceptor);

        const myResponseInterceptor = apiClient.interceptors.response.use(function (response) {
            // console.debug('from added response interceptor. Old interceptors: ', requestInterceptor, responseInterceptor);
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            // console.debug('from interceptor', response);
            return response;
        }, function (error) {
            // console.debug('from added response interceptor error. Old interceptors: ', requestInterceptor, responseInterceptor);
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            // console.error('from interceptor', error)
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
        // console.debug('logging out ' + username)
        localStorage.removeItem('token')

        // console.debug(apiClient.defaults.headers.common["Authorization"])
        // delete apiClient.defaults.headers.common["Authorization"];

        /* one working solution to remove authorization header from app for each call
         * But it doesn't work with response interceptor internal call 
         * (will have id's of previous interceptors)
         * hence user might need to login two times (in case of invalid jwt)
         */
        // console.debug(requestInterceptor, responseInterceptor)
        // apiClient.interceptors.request.eject(requestInterceptor)
        // apiClient.interceptors.response.eject(responseInterceptor)
        // console.debug('removed request interceptors after logout')

        setAuthenticated(false)
        setUsername(null)
        setToken(null)

        // second working solution to remove authorization header from app
        // window.location.reload()
    }

    const valuesToBeShared = { isAuthenticated, login, logout, username, token, googleSignIn }

    return (
        <AuthContext.Provider value={valuesToBeShared}>
            {children}
        </AuthContext.Provider>
    )
}