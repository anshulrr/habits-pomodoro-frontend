// create a context
// Put some state in the context
// Share the created context with other components

import { createContext, useContext, useState } from "react";
import { executeBasicAuthenticationService, executeJwtAuthenticationService } from "../api/AuthApiService";
import { apiClient } from "../api/ApiClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {

    const [isAuthenticated, setAuthenticated] = useState(false);

    const [username, setUsername] = useState(null)

    const [token, setToken] = useState(null)

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