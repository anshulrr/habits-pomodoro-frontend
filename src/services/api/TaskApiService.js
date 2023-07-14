import { apiClient } from "./ApiClient";

export const retrieveAllTasks
    = (project_id, status) => apiClient.get(`/projects/${project_id}/tasks?status=${status}`)

export const createTaskApi
    = (project_id, task) => apiClient.post(`/projects/${project_id}/tasks`, task)

export const retrieveTaskApi
    = (project_id, id) => apiClient.get(`/projects/${project_id}/tasks/${id}`)

export const updateTaskApi
    = (project_id, id, task) => apiClient.put(`projects/${project_id}/tasks/${id}`, task)