import { apiClient } from "./ApiClient";

export const getTasksCountApi
    = (project_id, status) => apiClient.get(`/projects/${project_id}/tasks/count?status=${status}`)

export const retrieveAllTasksApi
    = (project_id, status, limit, offset) => apiClient.get(`/projects/${project_id}/tasks?status=${status}&limit=${limit}&offset=${offset}`)

export const createTaskApi
    = (project_id, task) => apiClient.post(`/projects/${project_id}/tasks`, task)

export const retrieveTaskApi
    = (project_id, id) => apiClient.get(`/projects/${project_id}/tasks/${id}`)

export const updateTaskApi
    = (project_id, id, task) => apiClient.put(`projects/${project_id}/tasks/${id}`, task)