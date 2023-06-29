import { apiClient } from "./ApiClient";

export const createPomodoroApi
    = (pomodoro, task_id) => apiClient.post(`/pomodoros?task_id=${task_id}`, pomodoro)

// export const updatePomodoroApi
//     = (id, pomodoro) => apiClient.put(`/pomodoros/${id}`, pomodoro)

// passing data as params
export const updatePomodoroApi
    = (id, pomodoro) => apiClient.put(`/pomodoros/${id}?timeElapsed=${pomodoro.timeElapsed}&status=${pomodoro.status}`)

export const getPomodorosApi
    = () => apiClient.get(`/pomodoros`)

export const getTasksPomodorosApi
    = (limit, offset, include_categories) => apiClient.get(`/pomodoros/tasks-time?limit=${limit}&offset=${offset}&include_categories=${include_categories}`)

export const getProjectsPomodorosApi
    = (limit, offset) => apiClient.get(`/pomodoros/projects-time?limit=${limit}&offset=${offset}`)

export const getTotalPomodorosApi
    = (limit, offset) => apiClient.get(`/pomodoros/total-time?limit=${limit}&offset=${offset}`)