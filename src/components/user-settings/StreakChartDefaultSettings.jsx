import { useEffect, useState } from 'react';

import { retrieveAllProjectsApi } from 'services/api/ProjectApiService';
import { retrieveAllProjectCategoriesApi } from 'services/api/ProjectCategoryApiService';
import { retrieveAllTasksApi } from 'services/api/TaskApiService';

export const StreakChartDefaultSettings = ({
    categoryId,
    projectId,
    taskId,
    setCategoryId,
    setProjectId,
    setTaskId
}) => {

    const [categories, setCategories] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(
        () => {
            refreshProjectCategories();
            updateCategory(categoryId);
            updateProject(projectId);
            updateTask(taskId);
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshProjectCategories() {
        retrieveAllProjectCategoriesApi(1000, 0)
            .then(response => {
                setCategories(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function refreshProjects(categoryId) {
        setProjects([]);
        retrieveAllProjectsApi({ categoryId })
            .then(response => {
                // console.debug(response)
                setProjects(response.data);
            })
            .catch(error => console.error(error.message))
    }

    function refreshTasks(projectId) {
        setTasks([]);
        retrieveAllTasksApi({ projectId, status: 'current', limit: 100, offset: 0 })
            .then(response => {
                // console.debug(response)
                const localTasks1 = response.data;
                setTasks(response.data);

                retrieveAllTasksApi({ projectId, status: 'archived', limit: 100, offset: 0 })
                    .then(response => {
                        // console.debug(response)
                        const localTasks2 = localTasks1.concat(response.data);
                        setTasks(localTasks2);
                    })
                    .catch(error => console.error(error.message))
            })
            .catch(error => console.error(error.message))
    }

    function updateCategory(id) {
        setCategoryId(id);
        setProjectId(0);
        setTaskId(0);
        if (id === 0) {
            setProjects([]);
        } else {
            refreshProjects(id);
        }
        setTasks([]);
    }

    function updateProject(id) {
        setProjectId(id);
        setTaskId(0);
        if (id === 0) {
            setTasks([]);
        } else {
            refreshTasks(id);
        }
    }

    function updateTask(id) {
        setTaskId(id);
    }

    return (
        <div>

            <div className="row">

                <div className="col-6 pe-0 mb-1">
                    <select
                        className="form-select form-select-sm"
                        id="project_category_id"
                        name="project_category_id"
                        value={categoryId}
                        onChange={(e) => updateCategory(parseInt(e.target.value))}
                    >
                        <option value="0">Select Category</option>
                        {
                            categories.map(
                                projectCategory => (
                                    <option key={projectCategory.id} value={projectCategory.id}>{projectCategory.name}</option>
                                )
                            )
                        }
                    </select>
                </div>

                <div className="col-6 ps-0 mb-1">
                    <select
                        className="form-select form-select-sm"
                        id="project_id"
                        name="project_id"
                        value={projectId}
                        onChange={(e) => updateProject(parseInt(e.target.value))}
                    >
                        <option value="0">Select Category's Project</option>
                        {
                            projects.map(
                                project => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
                                )
                            )
                        }
                    </select>
                </div>

                <div className="col-12 mb-1">
                    <select
                        className="form-select form-select-sm"
                        id="task_id"
                        name="task_id"
                        value={taskId}
                        onChange={(e) => updateTask(parseInt(e.target.value))}
                    >
                        <option value="0">Select Project's Task</option>
                        {
                            tasks.map(
                                task => (
                                    <option key={task.id} value={task.id}>{task.description}</option>
                                )
                            )
                        }
                    </select>
                </div>
            </div>

        </div >
    )
}

