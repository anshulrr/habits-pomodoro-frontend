import { apiClient } from "./ApiClient";

export const getTasksCountApi
    = ({ projectId, status }) => apiClient.get(`/tasks/count?projectId=${projectId}&status=${status}`)

export const retrieveAllTasksApi
    = ({ projectId, status, limit, offset }) => apiClient.get(`/tasks?projectId=${projectId}&status=${status}&limit=${limit}&offset=${offset}`)

export const createTaskApi
    = ({ projectId, task }) => apiClient.post(`/tasks?projectId=${projectId}`, task)

export const retrieveTaskApi
    = ({ id }) => apiClient.get(`/tasks/${id}`)

export const updateTaskApi
    = ({ id, task }) => apiClient.put(`/tasks/${id}`, task)