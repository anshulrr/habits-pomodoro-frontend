import { apiClient } from "./ApiClient";

// export const executeBasicAuthenticationService
//     = (token) => apiClient.get(`/`, {
//         headers: {
//             Authorization: token
//         }
//     })

// export const executeJwtAuthenticationService
//     = (username, password) => apiClient.post(`/authenticate`, {}, {
//         headers: {
//             Authorization: 'Basic ' + window.btoa(username + ":" + password)
//         }
//     })

export const executeJwtAuthenticationService
    = (username, password) => apiClient.post(`/authenticate`, { username, password })