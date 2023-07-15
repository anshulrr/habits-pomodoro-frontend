// create a context
// Put some state in the context
// Share the created context with other components

import { createContext, useContext, useState } from "react";
import { executeJwtAuthenticationService } from "../api/AuthApiService";
import { apiClient } from "../api/ApiClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {

    const [isAuthenticated, setAuthenticated] = useState(checkAuthentication());

    // Todo: how to set username after page refresh
    const [username, setUsername] = useState(null)

    const [token, setToken] = useState(null)

    function checkAuthentication() {
        // check if token is present in local storage
        // parse the token
        // check if it is expired
        // if expired: delete from local storage
        // TODO: make an api call to authenticate using refresh token
        const jwt = localStorage.getItem('token');
        if (jwt == null) {
            return false;
        }

        // console.log(parseJwt(jwt).exp, Date.now() / 1000)
        const expiry = parseJwt(jwt).exp;
        const isExpired = expiry < (Date.now() / 1000);

        if (isExpired == true) {
            localStorage.setItem('item', null);
        }

        return !isExpired;
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
            const response = await executeJwtAuthenticationService(username, password)

            if (response.status === 200) {
                console.log('success')

                const jwtToken = 'Bearer ' + response.data.token;

                setAuthenticated(true);
                setUsername(username)
                setToken(jwtToken)

                apiClient.interceptors.request.use(
                    (config) => {
                        // console.log('intercepting and adding a token')
                        config.headers.Authorization = jwtToken
                        localStorage.setItem('token', jwtToken)
                        return config
                    }
                )

                return true;
            } else {
                console.log('bad creds')
                logout();
                return false;
            }
        } catch (error) {
            console.log('error in api')
            logout();
            return false;
        }
    }

    function logout() {
        delete apiClient.defaults.headers.common["Authorization"];
        console.log('logging out ' + username)
        localStorage.removeItem('token')
        setAuthenticated(false)
        setUsername(null)
        setToken(null)
    }

    const valuesToBeShared = { isAuthenticated, login, logout, username, token }

    return (
        <AuthContext.Provider value={valuesToBeShared}>
            {children}
        </AuthContext.Provider>
    )
}