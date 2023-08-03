import { apiClient } from "./ApiClient";

export const startApi
    = () => apiClient.get(`/`)

export const putChangePasswordApi
    = (password) => apiClient.put(`/users/change-password`, { password })