import { apiClient } from "./ApiClient";

export const retrieveAllTasks
    = (project_id) => apiClient.get(`/projects/${project_id}/tasks`)

export const createTaskApi
    = (project_id, task) => apiClient.post(`/projects/${project_id}/tasks`, task)
