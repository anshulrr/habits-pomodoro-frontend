import { apiClient } from "./ApiClient";

export const createPomodoroApi
    = (pomodoro, task_id) => apiClient.post(`/pomodoros?task_id=${task_id}`, pomodoro)

// export const updatePomodoroApi
//     = (id, pomodoro) => apiClient.put(`/pomodoros/${id}`, pomodoro)

const to = Intl.DateTimeFormat().resolvedOptions().timeZone;

// passing data as params
export const updatePomodoroApi
    = (id, pomodoro) => apiClient.put(`/pomodoros/${id}?timeElapsed=${pomodoro.timeElapsed}&status=${pomodoro.status}`)

export const getPomodorosApi
    = (offset, ic) => apiClient.get(`/pomodoros?offset=${offset}&include_categories=${ic}&timezone=${to}`)

export const getRunningPomodoroApi
    = () => apiClient.get(`/pomodoros/running`)

export const getTasksPomodorosApi
    = (limit, offset, ic) => apiClient.get(`/stats/tasks-time?limit=${limit}&offset=${offset}&include_categories=${ic}&timezone=${to}`)

export const getProjectsPomodorosApi
    = (limit, offset, ic) => apiClient.get(`/stats/projects-time?limit=${limit}&offset=${offset}&include_categories=${ic}&timezone=${to}`)

export const getTotalPomodorosApi
    = (limit, offset, ic) => apiClient.get(`/stats/total-time?limit=${limit}&offset=${offset}&include_categories=${ic}&timezone=${to}`)