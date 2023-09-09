import { apiClient } from "./ApiClient";

export const getTasksCountApi
    = ({ projectId, status, startDate, endDate }) => {
        let url = `/tasks/count?status=${status}`;
        if (startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        } else {
            url += `&projectId=${projectId}`
        }
        return apiClient.get(url)
    }

export const retrieveAllTasksApi
    = ({ projectId, status, startDate, endDate, limit, offset }) => {
        let url = `/tasks?status=${status}&limit=${limit}&offset=${offset}`;
        if (startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        } else {
            url += `&projectId=${projectId}`
        }
        return apiClient.get(url)
    }

export const createTaskApi
    = ({ projectId, task }) => apiClient.post(`/tasks?projectId=${projectId}`, task)

export const retrieveTaskApi
    = ({ id }) => apiClient.get(`/tasks/${id}`)

export const updateTaskApi
    = ({ id, task }) => apiClient.put(`/tasks/${id}`, task)