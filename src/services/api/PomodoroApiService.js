import { apiClient } from "./ApiClient";

export const createPomodoroApi
    = (pomodoro, task_id) => apiClient.post(`/pomodoros?task_id=${task_id}`, pomodoro)

// export const updatePomodoroApi
//     = (id, pomodoro) => apiClient.put(`/pomodoros/${id}`, pomodoro)

// passing data as params
export const updatePomodoroApi
    = (id, pomodoro) => apiClient.put(`/pomodoros/${id}?timeElapsed=${pomodoro.timeElapsed}&status=${pomodoro.status}`)

export const getPomodorosApi
    = (offset, include_categories) => apiClient.get(`/pomodoros?offset=${offset}&include_categories=${include_categories}`)

export const getRunningPomodoroApi
    = () => apiClient.get(`/pomodoros/running`)

export const getTasksPomodorosApi
    = (limit, offset, include_categories) => apiClient.get(`/stats/tasks-time?limit=${limit}&offset=${offset}&include_categories=${include_categories}`)

export const getProjectsPomodorosApi
    = (limit, offset, include_categories) => apiClient.get(`/stats/projects-time?limit=${limit}&offset=${offset}&include_categories=${include_categories}`)

export const getTotalPomodorosApi
    = (limit, offset, include_categories) => apiClient.get(`/stats/total-time?limit=${limit}&offset=${offset}&include_categories=${include_categories}`)