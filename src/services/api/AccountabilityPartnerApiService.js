import { apiClient } from "./ApiClient";

export const retrieveAccountabilitySubjectsApi
    = () => apiClient.get(`/accountability-subjects`)
