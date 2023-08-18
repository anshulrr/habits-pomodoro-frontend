import { apiClient } from "./ApiClient";

// export const retrieveAllCommentsApi
//     = ({ limit, offset, filterBy }) => apiClient.get(`/comments?limit=${limit}&offset=${offset}`)

// export const getCommentsCountApi
//     = ({ filterBy }) => apiClient.get(`/comments/count?filter-by=${filterBy}`)

export const retrieveAllCommentsApi
    = ({ limit, offset, filterBy, id }) => {
        if (filterBy === 'user')
            return apiClient.get(`/comments?limit=${limit}&offset=${offset}`)
        else if (filterBy === 'project-categories')
            return apiClient.get(`project-categories/${id}/comments?limit=${limit}&offset=${offset}`)
        else if (filterBy === 'projects')
            return apiClient.get(`projects/${id}/comments?limit=${limit}&offset=${offset}`)
        else if (filterBy === 'tasks')
            return apiClient.get(`tasks/${id}/comments?limit=${limit}&offset=${offset}`)
        else if (filterBy === 'pomodoros')
            return apiClient.get(`pomodoros/${id}/comments?limit=${limit}&offset=${offset}`)
    }

export const getCommentsCountApi
    = ({ filterBy, id }) => {
        if (filterBy === 'user')
            return apiClient.get(`/comments/count`)
        else if (filterBy === 'project-categories')
            return apiClient.get(`project-categories/${id}/comments/count`)
        else if (filterBy === 'projects')
            return apiClient.get(`projects/${id}/comments/count`)
        else if (filterBy === 'tasks')
            return apiClient.get(`tasks/${id}/comments/count`)
        else if (filterBy === 'pomodoros')
            return apiClient.get(`pomodoros/${id}/comments/count`)
    }

export const createCommentApi
    = (comment) => apiClient.post(`comments`, comment)
