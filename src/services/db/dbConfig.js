import {
    createProjectCategoryApi,
    getProjectCategoriesCountApi,
    retrieveAllProjectCategoriesApi,
    retrieveSyncProjectCategoriesApi,
    updateProjectCategoryApi
} from '../api/ProjectCategoryApiService';
import {
    createProjectApi,
    updateProjectApi,
    retrieveAllProjectsApi,
    getProjectsCountApi
} from '../api/ProjectApiService';
import {
    updateTaskApi,
    createTaskApi,
    getSyncAllTasksCountApi,
    retrieveSyncAllTasksApi,
} from '../api/TaskApiService';
import {
    createPastPomodoroApi,
    getPomodorosApi,
    updatePomodoroApi
} from '../api/PomodoroApiService';
import {
    createTagApi,
    getTagsCountApi,
    getTasksTagsApi,
    retrieveAllTagsApi,
    updateTagApi
} from '../api/TagApiService';
import {
    createCommentApi,
    getCommentsCountApi,
    retrieveSyncAllCommentsApi,
    updateCommentApi
} from '../api/CommentApiService';

export const apiMap = {
    'categories': {
        createApi: createProjectCategoryApi,
        updateApi: updateProjectCategoryApi,
        retrieveAllApi: retrieveAllProjectCategoriesApi,
        retrieveSyncAllApi: retrieveSyncProjectCategoriesApi,
        getCountApi: getProjectCategoriesCountApi
    },
    'projects': {
        createApi: createProjectApi,
        updateApi: updateProjectApi,
        retrieveAllApi: retrieveAllProjectsApi,
        retrieveSyncAllApi: retrieveAllProjectsApi,
        getCountApi: getProjectsCountApi
    },
    'tasks': {
        createApi: createTaskApi,
        updateApi: updateTaskApi,
        retrieveAllApi: retrieveSyncAllTasksApi,
        retrieveSyncAllApi: retrieveSyncAllTasksApi,
        getCountApi: getSyncAllTasksCountApi,
    },
    'pomodoros': {
        createApi: createPastPomodoroApi,
        updateApi: updatePomodoroApi,
        retrieveAllApi: getPomodorosApi,
        retrieveSyncAllApi: getPomodorosApi,
        getCountApi: () => {
            // console.info('getCountApi is not supported for pomodoros')
            return { data: -1 };
        }
    },
    'tags': {
        createApi: createTagApi,
        updateApi: updateTagApi,
        retrieveAllApi: retrieveAllTagsApi,
        retrieveSyncAllApi: retrieveAllTagsApi,
        getCountApi: getTagsCountApi
    },
    'comments': {
        createApi: createCommentApi,
        updateApi: updateCommentApi,
        retrieveAllApi: retrieveSyncAllCommentsApi,
        retrieveSyncAllApi: retrieveSyncAllCommentsApi,
        getCountApi: getCommentsCountApi
    }
};