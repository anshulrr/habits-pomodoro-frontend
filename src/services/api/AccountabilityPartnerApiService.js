import { apiClient } from "./ApiClient";

export const retrieveAccountabilitySubjectsApi
    = () => apiClient.get(`/accountability-subjects`)

export const retrieveAccountabilityPartnerssApi
    = () => apiClient.get(`/accountability-partners`)

export const addAccountabilityPartnerssApi
    = (partner) => apiClient.post(`/accountability-partners`, partner)

export const removeAccountabilityPartnerssApi
    = (partner) => apiClient.delete(`/accountability-partners/${partner.id}`)
