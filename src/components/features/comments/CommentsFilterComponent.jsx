import { useEffect, useState } from 'react';

import { retrieveAllProjectsApi } from 'services/api/ProjectApiService';
import { retrieveAllTasksApi } from 'services/api/TaskApiService';

export const CommentsFilterComponent = ({ categories, includeCategories, setFilterType, setFilterTypeId, setReload, setFilterWithReviseDate }) => {

    const TASKS_COUNT = 100;

    const [categoryId, setCategoryId] = useState('0');
    const [updatedCategories, setUpdatedCategories] = useState([]);
    const [projectId, setProjectId] = useState('0');
    const [projects, setProjects] = useState([]);
    const [taskId, setTaskId] = useState('0');
    const [tasks, setTasks] = useState([]);
    const [reloadData, setReloadData] = useState({ dataType: 'user', dataTypeId: '0' });

    const [errorMessage, setErrorMessage] = useState("");

    const [showLoader, setShowLoader] = useState(false);

    useEffect(
        () => {
            updateIncludedCategories()
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const updateIncludedCategories = () => {
        const localUpdatedCategories = [];
        for (const id of includeCategories) {
            for (const category of categories) {
                if (category.id === id) {
                    localUpdatedCategories.push(category);
                }
            }
        }
        setUpdatedCategories(localUpdatedCategories);
    }

    const updateDataType = (dataType, dataTypeId = 0) => {
        setReloadData({
            dataType,
            dataTypeId
        })
        setErrorMessage(
            "Click on Fetch for "
            + (dataType !== 'user' ? dataType.charAt(0).toUpperCase() + dataType.slice(1) : '')
            + (dataType === 'user' ? 'All' : '')
            + " Notes"
        );
    }

    function fetchFilteredComments() {
        setReload(prev => prev + 1)
        setFilterType(reloadData.dataType)
        setFilterTypeId(reloadData.dataTypeId)
        setFilterWithReviseDate(false)
        setErrorMessage('')
    }

    function refreshProjects(categoryId) {
        setShowLoader(true);
        setProjects([]);
        retrieveAllProjectsApi({ categoryId })
            .then(response => {
                // console.debug(response)
                setProjects(response.data);
                setShowLoader(false);
            })
            .catch(error => console.error(error.message))
    }

    function refreshTasks(projectId) {
        setShowLoader(true);
        setTasks([]);
        retrieveAllTasksApi({ projectId, status: 'current', limit: TASKS_COUNT, offset: 0 })
            .then(response => {
                // console.debug(response)
                const localTasks1 = response.data;
                setTasks(response.data);

                retrieveAllTasksApi({ projectId, status: 'archived', limit: TASKS_COUNT, offset: 0 })
                    .then(response => {
                        // console.debug(response)
                        const localTasks2 = localTasks1.concat(response.data);
                        setTasks(localTasks2);
                        setShowLoader(false);
                    })
                    .catch(error => console.error(error.message))
            })
            .catch(error => console.error(error.message))
    }

    function updateCategory(id) {
        setCategoryId(id);
        setProjectId('0');
        setTaskId('0');
        if (id === '0') {
            updateDataType('user')
            setProjects([]);
        } else {
            updateDataType('category', id);
            refreshProjects(id);
        }
        setTasks([]);
    }

    function updateProject(id) {
        setProjectId(id);
        setTaskId('0');
        if (id === '0') {
            updateDataType('category', categoryId);
            setTasks([]);
        } else {
            updateDataType('project', id);
            refreshTasks(id);
        }
    }

    function updateTask(id) {
        setTaskId(id);
        if (id === '0') {
            updateDataType('project', projectId);
        } else {
            updateDataType('task', id);
        }
    }

    return (
        <div>

            <div className="row">
                <div className="col-lg-12 mb-1">
                    <h6 className='mb-0'>
                        Filter Notes
                        <span className="loader-container-2" >
                            <span className="ms-1 loader-2" style={{ display: showLoader ? "inline" : "none" }}></span>
                        </span>
                    </h6>
                </div>

                <div className="col-12 mb-1">
                    <select
                        className="form-select form-select-sm"
                        id="project_category_id"
                        name="project_category_id"
                        value={categoryId}
                        onChange={(e) => updateCategory(e.target.value)}
                    >
                        <option value="0">Select Category</option>
                        {
                            updatedCategories.map(
                                projectCategory => (
                                    <option key={projectCategory.id} value={projectCategory.id}>{projectCategory.name}</option>
                                )
                            )
                        }
                    </select>
                </div>

                <div className="col-12 mb-1">
                    <select
                        className="form-select form-select-sm"
                        id="project_id"
                        name="project_id"
                        value={projectId}
                        onChange={(e) => updateProject(e.target.value)}
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
                        onChange={(e) => updateTask(e.target.value)}
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

                <div className="col-12 text-end">
                    {errorMessage && <div className="alert alert-info mb-1 mb-0 py-0 px-2 text-center"><small>{errorMessage}</small></div>}
                    <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => fetchFilteredComments()}>
                        Fetch
                    </button>
                </div>
            </div>

        </div >
    )
}

