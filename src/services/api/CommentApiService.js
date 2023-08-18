import { apiClient } from "./ApiClient";

// export const retrieveAllCommentsApi
//     = ({ limit, offset, filterBy }) => apiClient.get(`/comments?limit=${limit}&offset=${offset}`)

// export const getCommentsCountApi
//     = ({ filterBy }) => apiClient.get(`/comments/count?filter-by=${filterBy}`)

// export const createCommentApi
//     = (comment) => apiClient.post(`comments`, comment)

export const retrieveAllCommentsApi
    = ({ limit, offset, filterBy, id }) => {
        if (filterBy === 'user')
            return apiClient.get(`/comments?limit=${limit}&offset=${offset}`)
        else if (filterBy === 'category')
            return apiClient.get(`project-categories/${id}/comments?limit=${limit}&offset=${offset}`)
        else if (filterBy === 'project')
            return apiClient.get(`projects/${id}/comments?limit=${limit}&offset=${offset}`)
        else if (filterBy === 'task')
            return apiClient.get(`tasks/${id}/comments?limit=${limit}&offset=${offset}`)
        else if (filterBy === 'pomodoro')
            return apiClient.get(`pomodoros/${id}/comments?limit=${limit}&offset=${offset}`)
    }

export const getCommentsCountApi
    = ({ filterBy, id }) => {
        if (filterBy === 'user')
            return apiClient.get(`/comments/count`)
        else if (filterBy === 'category')
            return apiClient.get(`project-categories/${id}/comments/count`)
        else if (filterBy === 'project')
            return apiClient.get(`projects/${id}/comments/count`)
        else if (filterBy === 'task')
            return apiClient.get(`tasks/${id}/comments/count`)
        else if (filterBy === 'pomodoro')
            return apiClient.get(`pomodoros/${id}/comments/count`)
    }

export const createCommentApi
    = ({ filterBy, comment, id }) => {
        if (filterBy === 'user')
            return apiClient.post(`comments`, comment)
        else if (filterBy === 'category')
            return apiClient.post(`project-categories/${id}/comments`, comment)
        else if (filterBy === 'project')
            return apiClient.post(`projects/${id}/comments`, comment)
        else if (filterBy === 'task')
            return apiClient.post(`tasks/${id}/comments`, comment)
        else if (filterBy === 'pomodoro')
            return apiClient.post(`pomodoros/${id}/comments`, comment)
    }
