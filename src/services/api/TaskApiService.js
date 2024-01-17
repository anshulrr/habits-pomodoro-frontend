import { apiClient } from "./ApiClient";

export const getTasksCountApi
    = ({ projectId, status, startDate, searchTaskString, endDate, tagId }) => {
        let url = `/tasks/count?status=${status}`;
        if (startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        } else if (searchTaskString) {
            url += `&searchedTaskString=${searchTaskString}`;
        } else if (tagId) {
            url += `&tagId=${tagId}`
        } else {
            url += `&projectId=${projectId}`
        }
        return apiClient.get(url)
    }

export const retrieveAllTasksApi
    = ({ projectId, status, startDate, endDate, searchTaskString, limit, offset, tagId, subject }) => {
        let url = `/tasks?status=${status}&limit=${limit}&offset=${offset}`;
        if (startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        } else if (searchTaskString) {
            url += `&searchedTaskString=${searchTaskString}`;
        } else if (tagId) {
            url += `&tagId=${tagId}`
        } else {
            url += `&projectId=${projectId}`
        }
        if (subject) {
            url += `&subjectId=${subject.id}`
        }
        return apiClient.get(url)
    }

export const createTaskApi
    = ({ projectId, task }) => apiClient.post(`/tasks?projectId=${projectId}`, task)

export const retrieveTaskApi
    = ({ id }) => apiClient.get(`/tasks/${id}`)

export const updateTaskApi
    = ({ id, task }) => apiClient.put(`/tasks/${id}`, task)

export const getTasksTimeElapsedApi
    = ({ startDate, endDate, taskIds }) => apiClient.get(`/tasks/pomodoros/time-elapsed?startDate=${startDate}&endDate=${endDate}&taskIds=${taskIds}`)