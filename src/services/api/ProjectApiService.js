import { apiClient } from "./ApiClient";

export const retrieveAllProjectsApi
    = (limit, offset) => apiClient.get(`/projects?limit=${limit}&offset=${offset}`)

export const getProjectsCountApi
    = () => apiClient.get(`/projects/count`)

export const retrieveProjectApi
    = (id) => apiClient.get(`/projects/${id}`)

export const updateProjectApi
    = (id, project, category_id) => apiClient.put(`project-categories/${category_id}/projects/${id}`, project)

export const createProjectApi
    = (project, category_id) => apiClient.post(`project-categories/${category_id}/projects`, project)
