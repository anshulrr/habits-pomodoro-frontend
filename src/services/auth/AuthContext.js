// create a context
// Put some state in the context
// Share the created context with other components

import { createContext, useContext, useEffect, useState } from "react";
import { getUserSettingsApi } from "../api/AuthApiService";
import { apiClient } from "../api/ApiClient";
import FirebaseAuthService from "./FirebaseAuthService";
import { disableToken } from "services/FirebaseFirestoreService";
import { db } from "services/db";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext)

const TIME_WINDOW_FOR_REFRESH_JWT = parseInt(process.env.REACT_APP_JWT_REFRESH_WINDOW) || 60;

export default function AuthProvider({ children }) {

    const [requestInterceptor, setRequestInterceptor] = useState(null)
    const [responseInterceptor, setResponseInterceptor] = useState(null)

    const [isAuthenticated, setAuthenticated] = useState(false)
    const [isFirebaseAuthLoaded, setFirebaseAuthLoaded] = useState(false)
    const [user, setUser] = useState(null)
    const [userSettings, setUserSettings] = useState(null)

    useEffect(
        () => {
            // to set interceptors after page refresh
            FirebaseAuthService.subscribeToAuthChanges({ setFirebaseAuthLoaded, setAuthenticated, addInterceptors, setUser });

            // create deviceId for firebase firestore
            if (!localStorage.getItem('deviceId')) {
                localStorage.setItem('deviceId', crypto.randomUUID());
            }

            const storageSettings = JSON.parse(localStorage.getItem('habits_pomodoro'));
            if (storageSettings) {
                setUserSettings(storageSettings);
            } else {
                // logout user if settings are deleted
                logout();
            }
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

    async function getUserSettings() {
        // if new user; save it in the backend
        // get user settings
        const response = await getUserSettingsApi();
        if (response.status === 200) {
            updateUserSettings(response.data)
        }

        return response.data;
    }

    function updateUserSettings(data) {
        localStorage.setItem('habits_pomodoro', JSON.stringify(data));
        setUserSettings(data);
    }

    function addInterceptors(token) {
        let jwtToken = 'Bearer ' + token;

        // console.debug('adding interceptors. Old interceptors: ', requestInterceptor, responseInterceptor);
        // remove old interceptors before adding new one
        // console.debug("ejecting if present", requestInterceptor)
        apiClient.interceptors.request.eject(requestInterceptor)
        apiClient.interceptors.response.eject(responseInterceptor)
        // console.debug('ejected interceptors')

        // to set headers on each API call
        const myRequestInterceptor = apiClient.interceptors.request.use(
            async (config) => {
                // console.debug('from added request interceptor. Old interceptors: ', requestInterceptor, responseInterceptor);
                // Check jwt expiry, get a new token if required
                // console.debug(parseJwt(jwtToken).exp - (Date.now() / 1000));
                if (parseJwt(jwtToken).exp - (Date.now() / 1000) <= TIME_WINDOW_FOR_REFRESH_JWT) {
                    // todo: handle error response gracefully
                    jwtToken = 'Bearer ' + await FirebaseAuthService.getRefreshedToken();
                }

                config.headers.Authorization = jwtToken;
                return config
            }
        )

        // console.debug("setting", myRequestInterceptor)
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
        // remove old interceptors, otherwise app will be able to make calls until page refresh
        // console.debug("ejecting", requestInterceptor)
        apiClient.interceptors.request.eject(requestInterceptor)
        apiClient.interceptors.response.eject(responseInterceptor)

        // remove user settings from local storage and AuthProvider
        localStorage.removeItem('habits_pomodoro')
        setUserSettings(null)

        // set firebase notifications to disabled
        if (user) {
            await disableToken(user.uid);
        }

        // sign out from firebase: removes data from firebaseLocalStorageDb
        try {
            await FirebaseAuthService.signOutUser();
            // console.debug("signed out from firebase successfully")
            // console.debug('logging out ' + user)
        } catch (error) {
            console.error(error);
        }

        try {
            // database delete won't work as then creation flow is difficult. 
            // need to reload the page
            // or during login create new database
            await db.delete();
            // console.debug("deleted dexie database successfully")
        } catch (error) {
            console.error(error);
        }
    }

    const valuesToBeShared = { isAuthenticated, logout, user, getUserSettings, userSettings, updateUserSettings }

    return (
        isFirebaseAuthLoaded &&
        <AuthContext.Provider value={valuesToBeShared}>
            {children}
        </AuthContext.Provider>
    )
}