import { apiClient } from "./ApiClient";

export const retrieveAllProjects
    = () => apiClient.get(`/projects`)

export const retrieveProjectApi
    = (id) => apiClient.get(`/projects/${id}`)

export const updateProjectApi
    = (id, project) => apiClient.put(`/projects/${id}`, project)

export const createProjectApi
    = (project) => apiClient.post(`/projects`, project)