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
    = (startDate, endDate, ic) => apiClient.get(`/pomodoros?startDate=${startDate}&endDate=${endDate}&include_categories=${ic}`)

export const getRunningPomodoroApi
    = () => apiClient.get(`/pomodoros/running`)

export const getTasksPomodorosApi
    = (startDate, endDate, ic) => apiClient.get(`/stats/tasks-time?startDate=${startDate}&endDate=${endDate}&include_categories=${ic}`)

export const getProjectsPomodorosApi
    = (startDate, endDate, ic) => apiClient.get(`/stats/projects-time?startDate=${startDate}&endDate=${endDate}&include_categories=${ic}`)

export const getTotalPomodorosApi
    = ({ limit, startDate, endDate, includeCategories: ic }) => apiClient.get(`/stats/total-time?limit=${limit}&startDate=${startDate}&endDate=${endDate}&include_categories=${ic}&timezone=${to}`)