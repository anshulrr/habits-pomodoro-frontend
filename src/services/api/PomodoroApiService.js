import { apiClient } from "./ApiClient";

export const createPomodoroApi
    = (pomodoro, task_id) => apiClient.post(`/pomodoros?taskId=${task_id}`, pomodoro)

export const createPastPomodoroApi
    = (pomodoro, task_id) => apiClient.post(`/pomodoros/past?taskId=${task_id}`, pomodoro)

export const deletePastPomodoroApi
    = (pomodoro_id) => apiClient.delete(`/pomodoros/${pomodoro_id}`)

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const updatePomodoroApi
    = (id, pomodoro) => apiClient.put(`/pomodoros/${id}`, pomodoro)

export const getPomodorosApi
    = ({ startDate, endDate, includeCategories, subject }) => {
        const url = `/pomodoros?startDate=${startDate}&endDate=${endDate}&categoryIds=${includeCategories}`;
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
        const url = `/stats/tasks-time?startDate=${startDate}&endDate=${endDate}&categoryIds=${includeCategories}`;
        if (!subject) {
            return apiClient.get(url);
        } else {
            return apiClient.get(url + `&subjectId=${subject.id}`)
        }
    }

export const getProjectsPomodorosApi
    = ({ startDate, endDate, includeCategories, subject }) => {
        const url = `/stats/projects-time?startDate=${startDate}&endDate=${endDate}&categoryIds=${includeCategories}`;
        if (!subject) {
            return apiClient.get(url)
        } else {
            return apiClient.get(url + `&subjectId=${subject.id}`)
        }
    }

export const getProjectCategoriesPomodorosApi
    = ({ startDate, endDate, includeCategories, subject }) => {
        const url = `/stats/project-categories-time?startDate=${startDate}&endDate=${endDate}&categoryIds=${includeCategories}`;
        if (!subject) {
            return apiClient.get(url)
        } else {
            return apiClient.get(url + `&subjectId=${subject.id}`)
        }
    }

export const getTotalPomodorosApi
    = ({ limit, startDate, endDate, includeCategories, subject, entity }) => {
        let url;
        if (entity === 'task') {
            url = '/stats/tasks-total-time';
        } else {
            url = '/stats/projects-total-time';
        }
        url += `?limit=${limit}&startDate=${startDate}&endDate=${endDate}&categoryIds=${includeCategories}&timezone=${timezone}`;
        if (!subject) {
            return apiClient.get(url);
        } else {
            return apiClient.get(url + `&subjectId=${subject.id}`)
        }
    }

export const getStatsPomodorosCountApi
    = ({ startDate, endDate, subject, type, typeId, includeCategories }) => {
        let url = `/stats/pomodoros-count?startDate=${startDate}&endDate=${endDate}&timezone=${timezone}&type=${type}&typeId=${typeId}`;
        if (type === 'user') {
            url += `&categoryIds=${includeCategories}`;
        }
        if (subject) {
            url += `&subjectId=${subject.id}`;
        }
        return apiClient.get(url);

    }

export const getTaskPomodorosApi
    = (task_id, limit, offset) => apiClient.get(`/stats/task-pomodoros?taskId=${task_id}&limit=${limit}&offset=${offset}`)

export const getTaskPomodorosCountApi
    = (task_id) => apiClient.get(`/stats/task-pomodoros/count?taskId=${task_id}`)