import { apiClient } from "./ApiClient";

export const createPomodoroApi
    = (pomodoro, task_id) => apiClient.post(`/pomodoros?task_id=${task_id}`, pomodoro)

export const pausePomodoroApi
    = (id, pomodoro) => apiClient.put(`/pomodoros/${id}`, pomodoro)