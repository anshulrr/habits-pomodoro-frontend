import { apiClient } from "./ApiClient";

export const retrieveAllTagsApi
    = ({ limit, offset, lastSyncTime }) => {
        let url = `/tags?limit=${limit}&offset=${offset}`;
        if (lastSyncTime) {
            url += `&lastSyncTime=${lastSyncTime}`;
        }
        return apiClient.get(url);
    }

export const getTagsCountApi
    = () => apiClient.get(`/tags/count`)

export const retrieveTagApi
    = (id) => apiClient.get(`/tags/${id}`)

export const updateTagApi
    = (id, tag) => apiClient.put(`tags/${id}`, tag)

export const createTagApi
    = (tag) => apiClient.post(`tags`, tag)

// TODO: remove if not needed
export const mapTagsApi
    = (task_id, data) => apiClient.post(`tasks/${task_id}/tags`, data)

export const getTasksTagsApi
    = (taskIds) => apiClient.post(`tasks/tags`, taskIds)

export const mapCommentTagsApi
    = (comment_id, data) => apiClient.post(`comments/${comment_id}/tags`, data)
