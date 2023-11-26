import { apiClient } from "./ApiClient";

export const createPomodoroApi
    = (pomodoro, task_id) => apiClient.post(`/pomodoros?task_id=${task_id}`, pomodoro)

export const createPastPomodoroApi
    = (pomodoro, task_id) => apiClient.post(`/pomodoros/past?task_id=${task_id}`, pomodoro)

export const deletePastPomodoroApi
    = (pomodoro_id) => apiClient.delete(`/pomodoros/past/${pomodoro_id}`)

// export const updatePomodoroApi
//     = (id, pomodoro) => apiClient.put(`/pomodoros/${id}`, pomodoro)

const to = Intl.DateTimeFormat().resolvedOptions().timeZone;

// passing data as params
export const updatePomodoroApi
    = (id, pomodoro) => apiClient.put(`/pomodoros/${id}`, pomodoro)

export const getPomodorosApi
    = ({ startDate, endDate, includeCategories, subject }) => {
        const url = `/pomodoros?startDate=${startDate}&endDate=${endDate}&include_categories=${includeCategories}`;
        if (!subject) {
            return apiClient.get(url);
        } else {
            return apiClient.get(url + `&subjectId=${subject.id}`)
        }
    }

export const getRunningPomodoroApi
    = () => apiClient.get(`/pomodoros/running`)

export const getTasksPomodorosApi
    = ({ startDate, endDate, includeCategories, subject }) => {
        const url = `/stats/tasks-time?startDate=${startDate}&endDate=${endDate}&include_categories=${includeCategories}`;
        if (!subject) {
            return apiClient.get(url);
        } else {
            return apiClient.get(url + `&subjectId=${subject.id}`)
        }
    }

export const getProjectsPomodorosApi
    = ({ startDate, endDate, includeCategories, subject }) => {
        const url = `/stats/projects-time?startDate=${startDate}&endDate=${endDate}&include_categories=${includeCategories}`;
        if (!subject) {
            return apiClient.get(url)
        } else {
            return apiClient.get(url + `&subjectId=${subject.id}`)
        }
    }

export const getTotalPomodorosApi
    = ({ limit, startDate, endDate, includeCategories, subject }) => {
        const url = `/stats/total-time?limit=${limit}&startDate=${startDate}&endDate=${endDate}&include_categories=${includeCategories}&timezone=${to}`;
        if (!subject) {
            return apiClient.get(url);
        } else {
            return apiClient.get(url + `&subjectId=${subject.id}`)
        }
    }