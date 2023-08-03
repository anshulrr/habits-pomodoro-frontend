// create a context
// Put some state in the context
// Share the created context with other components

import { createContext, useContext, useEffect, useState } from "react";
import { startApi } from "../api/AuthApiService";
import { apiClient } from "../api/ApiClient";

import { auth } from '../firebaseConfig';
import FirebaseAuthService from "./FirebaseAuthService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {

    const [requestInterceptor, setRequestInterceptor] = useState(null)
    const [responseInterceptor, setResponseInterceptor] = useState(null)

    const [isAuthenticated, setAuthenticated] = useState(false)
    const [isFirebaseAuthLoaded, setFirebaseAuthLoaded] = useState(false)
    const [username, setUsername] = useState(null)

    useEffect(
        () => {
            // to set interceptors after page refresh
            FirebaseAuthService.subscribeToAuthChanges({ setFirebaseAuthLoaded, setAuthenticated, addInterceptors, setUsername });
        }, []   // eslint-disable-line react-hooks/exhaustive-deps
    )

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

    async function jwtSignIn(token) {
        // console.debug('login success')
        // add interceptors
        addInterceptors(token)

        setUsername(parseJwt('Bearer ' + token).name)
        setAuthenticated(true);

        // if new user; save it in the backend
        const response = await startApi();
        if (response.status === 200) {
            // console.info("if new user; saved in the backend")
        }

        return true;
    }

    function addInterceptors(token) {
        let jwtToken = 'Bearer ' + token;

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
                if (parseJwt(jwtToken).exp - (Date.now() / 1000) <= 3560) {
                    // todo: handle error response gracefully
                    jwtToken = 'Bearer ' + await auth.currentUser.getIdToken(/* forceRefresh */ true);
                }

                config.headers.Authorization = jwtToken;
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

    async function logout() {
        try {
            await FirebaseAuthService.signOutUser();
            console.debug("sign out successfully")
            // console.debug('logging out ' + username)
            setAuthenticated(false)
            setUsername(null)
        } catch (error) {
            console.error(error);
        }
    }

    const valuesToBeShared = { isAuthenticated, logout, username, jwtSignIn }

    return (
        isFirebaseAuthLoaded &&
        <AuthContext.Provider value={valuesToBeShared}>
            {children}
        </AuthContext.Provider>
    )
}