import { apiClient } from "./ApiClient";

export const retrieveAllProjectCategoriesApi
    = (limit, offset) => apiClient.get(`/project-categories?limit=${limit}&offset=${offset}`)

// export const getProjectCategoriesCountApi
//     = () => apiClient.get(`/project-categories/count`)

// export const retrieveProjectCategoryApi
//     = (id) => apiClient.get(`/project-categories/${id}`)

// export const updateProjectCategoryApi
//     = (id, project_category) => apiClient.put(`/project-categories/${id}`, project_category)

// export const createProjectCategoryApi
//     = (project_category) => apiClient.post(`/project-categories`, project_category)
