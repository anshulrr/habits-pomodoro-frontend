import { apiClient } from "./ApiClient";

export const createPomodoroApi
    = (pomodoro, task_id) => apiClient.post(`/pomodoros?task_id=${task_id}`, pomodoro)

// export const pausePomodoroApi
//     = (id, pomodoro) => apiClient.put(`/pomodoros/${id}`, pomodoro)

// passing data as params
export const pausePomodoroApi
    = (id, pomodoro) => apiClient.put(`/pomodoros/${id}?timeElapsed=${pomodoro.timeElapsed}&status=${pomodoro.status}`)

export const getPomodorosApi
    = () => apiClient.get(`/pomodoros`)

export const getTasksPomodorosApi
    = (limit) => apiClient.get(`/pomodoros/tasks-time?limit=${limit}`)

export const getProjectsPomodorosApi
    = (limit) => apiClient.get(`/pomodoros/projects-time?limit=${limit}`)

export const getTotalPomodorosApi
    = (limit) => apiClient.get(`/pomodoros/total-time?limit=${limit}`)