import { apiClient } from "./ApiClient";

export const executeBasicAuthenticationService
    = (token) => apiClient.get(`/`, {
        headers: {
            Authorization: token
        }
    })