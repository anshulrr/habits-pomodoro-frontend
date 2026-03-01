import { apiClient } from "./ApiClient";

export const retrieveAllProjectsApi
    = ({ limit, offset, categoryId, subject, lastSyncTime }) => {
        let url;
        if (categoryId) {
            url = `/projects?categoryId=${categoryId}`;
        } else {
            url = `/projects?limit=${limit}&offset=${offset}`;
        }
        if (subject) {
            url += `&subjectId=${subject.id}`
        }
        if (lastSyncTime) {
            url += `&lastSyncTime=${lastSyncTime}`
        }
        return apiClient.get(url);
    }

export const getProjectsCountApi
    = () => apiClient.get(`/projects/count`)

export const retrieveProjectApi
    = (id) => apiClient.get(`/projects/${id}`)

export const updateProjectApi
    = (id, project) => apiClient.put(`projects/${id}`, project)

export const createProjectApi
    = (project) => apiClient.post(`projects`, project)
