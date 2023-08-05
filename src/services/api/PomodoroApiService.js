import { apiClient } from "./ApiClient";

export const createPomodoroApi
    = (pomodoro, task_id) => apiClient.post(`/pomodoros?task_id=${task_id}`, pomodoro)

// export const updatePomodoroApi
//     = (id, pomodoro) => apiClient.put(`/pomodoros/${id}`, pomodoro)

const to = new Date().getTimezoneOffset();

// passing data as params
export const updatePomodoroApi
    = (id, pomodoro) => apiClient.put(`/pomodoros/${id}?timeElapsed=${pomodoro.timeElapsed}&status=${pomodoro.status}`)

export const getPomodorosApi
    = (offset, ic) => apiClient.get(`/pomodoros?offset=${offset}&include_categories=${ic}&timezone_offset=${to}`)

export const getRunningPomodoroApi
    = () => apiClient.get(`/pomodoros/running`)

export const getTasksPomodorosApi
    = (limit, offset, ic) => apiClient.get(`/stats/tasks-time?limit=${limit}&offset=${offset}&include_categories=${ic}&timezone_offset=${to}`)

export const getProjectsPomodorosApi
    = (limit, offset, ic) => apiClient.get(`/stats/projects-time?limit=${limit}&offset=${offset}&include_categories=${ic}&timezone_offset=${to}`)

export const getTotalPomodorosApi
    = (limit, offset, ic) => apiClient.get(`/stats/total-time?limit=${limit}&offset=${offset}&include_categories=${ic}&timezone_offset=${to}`)