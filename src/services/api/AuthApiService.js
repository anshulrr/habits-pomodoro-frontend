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

export const startApi
    = () => apiClient.get(`/`)

export const putChangePasswordApi
    = (password) => apiClient.put(`/users/change-password`, { password })