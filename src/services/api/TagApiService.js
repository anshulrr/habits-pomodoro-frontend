import { apiClient } from "./ApiClient";

export const retrieveAllTagsApi
    = (limit, offset) => apiClient.get(`/tags?limit=${limit}&offset=${offset}`)

export const getTagsCountApi
    = () => apiClient.get(`/tags/count`)

export const retrieveTagApi
    = (id) => apiClient.get(`/tags/${id}`)

export const updateTagApi
    = (id, tag) => apiClient.put(`tags/${id}`, tag)

export const createTagApi
    = (tag) => apiClient.post(`tags`, tag)
