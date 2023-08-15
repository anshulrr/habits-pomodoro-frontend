import { apiClient } from "./ApiClient";

export const startApi
    = () => apiClient.get(`/`)

export const getUserSettingsApi
    = () => apiClient.get(`/user-settings`)

export const putUserSettingsApi
    = (settings) => apiClient.put(`/user-settings`, settings)