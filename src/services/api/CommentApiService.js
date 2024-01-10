import { apiClient } from "./ApiClient";

// export const retrieveAllCommentsApi
//     = ({ limit, offset, filterBy }) => apiClient.get(`/comments?limit=${limit}&offset=${offset}`)

// export const getCommentsCountApi
//     = ({ filterBy }) => apiClient.get(`/comments/count?filter-by=${filterBy}`)

// export const createCommentApi
//     = (comment) => apiClient.post(`comments`, comment)

export const retrieveAllCommentsApi
    = ({ limit, offset, filterBy, id, categoryIds, filterWithReviseDate }) => {
        if (filterBy === 'user')
            return apiClient.get(`/comments?limit=${limit}&offset=${offset}&categoryIds=${categoryIds}&filterWithReviseDate=${filterWithReviseDate}`)
        else if (filterBy === 'category')
            return apiClient.get(`project-categories/${id}/comments?limit=${limit}&offset=${offset}`)
        else if (filterBy === 'project')
            return apiClient.get(`projects/${id}/comments?limit=${limit}&offset=${offset}`)
        else if (filterBy === 'task')
            return apiClient.get(`tasks/${id}/comments?limit=${limit}&offset=${offset}`)
    }

export const getCommentsCountApi
    = ({ filterBy, id, categoryIds, filterWithReviseDate }) => {
        if (filterBy === 'user')
            return apiClient.get(`/comments/count?categoryIds=${categoryIds}&filterWithReviseDate=${filterWithReviseDate}`)
        else if (filterBy === 'category')
            return apiClient.get(`project-categories/${id}/comments/count`)
        else if (filterBy === 'project')
            return apiClient.get(`projects/${id}/comments/count`)
        else if (filterBy === 'task')
            return apiClient.get(`tasks/${id}/comments/count`)
    }

export const createCommentApi
    = ({ filterBy, comment, id }) => {
        if (filterBy === 'user')
            return apiClient.post(`comments`, comment)
        else if (filterBy === 'project')
            return apiClient.post(`projects/${id}/comments`, comment)
        else if (filterBy === 'task')
            return apiClient.post(`tasks/${id}/comments`, comment)
    }

export const retrieveCommentApi
    = ({ id }) => apiClient.get(`/comments/${id}`)

export const updateCommentApi
    = ({ id, comment }) => apiClient.put(`comments/${id}`, comment)

export const getCommentsTagsApi
    = (commentIds) => apiClient.get(`comments/tags?commentIds=${commentIds}`)