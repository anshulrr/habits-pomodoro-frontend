import { apiClient } from "./ApiClient";

export const retrieveAllProjectsApi
    = ({ limit, offset, categoryId }) => {
        if (categoryId) {
            return apiClient.get(`/projects?categoryId=${categoryId}`)
        } else {
            return apiClient.get(`/projects?limit=${limit}&offset=${offset}`)
        }
    }

export const getProjectsCountApi
    = () => apiClient.get(`/projects/count`)

export const retrieveProjectApi
    = (id) => apiClient.get(`/projects/${id}`)

export const updateProjectApi
    = (id, project) => apiClient.put(`projects/${id}`, project)

export const createProjectApi
    = (project) => apiClient.post(`projects`, project)
