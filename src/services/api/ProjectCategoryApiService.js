import { apiClient } from "./ApiClient";

export const retrieveAllProjectCategoriesApi
    = (limit, offset, subject) => {
        const url = `/project-categories?limit=${limit}&offset=${offset}`;
        if (!subject) {
            return apiClient.get(url)
        } else {
            return apiClient.get(url + `&subjectId=${subject.id}`)
        }
    }

export const getProjectCategoriesCountApi
    = () => apiClient.get(`/project-categories/count`)

export const retrieveProjectCategoryApi
    = (id) => apiClient.get(`/project-categories/${id}`)

export const updateProjectCategoryApi
    = (id, project_category) => apiClient.put(`/project-categories/${id}`, project_category)

export const createProjectCategoryApi
    = (project_category) => apiClient.post(`/project-categories`, project_category)
