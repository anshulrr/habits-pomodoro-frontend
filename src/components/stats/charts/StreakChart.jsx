import { useEffect, useState } from 'react';
import moment from 'moment';

import { getStatsPomodorosCountApi } from 'services/api/PomodoroApiService';
import { retrieveAllProjectsApi } from 'services/api/ProjectApiService';
import { retrieveAllTasksApi } from 'services/api/TaskApiService';
import { CalendarChart } from './CalendarChart';
import { useAuth } from 'services/auth/AuthContext';

export const StreakChart = ({ subject, categories, includeCategories }) => {

    const authContext = useAuth();
    const userSettings = authContext.userSettings;

    const [startDate, setStartDate] = useState(moment().add(window.innerWidth <= 992 ? -0.5 : -1, 'y').toISOString());
    const [endDate, setEndDate] = useState(moment().toISOString());
    const [categoryId, setCategoryId] = useState('0');
    const [updatedCategories, setUpdatedCategories] = useState([]);
    const [projectId, setProjectId] = useState('0');
    const [projects, setProjects] = useState([]);
    const [projectsMap, setProjectsMap] = useState(null);
    const [taskId, setTaskId] = useState('0');
    const [tasks, setTasks] = useState([]);
    const [tasksMap, setTasksMap] = useState(null);
    const [chartData, setChartData] = useState({ label: '', labels: [], data: [], colors: [] })
    const [reloadData, setReloadData] = useState({ dataType: 'user', dataTypeId: '0' });

    const [showLoader, setShowLoader] = useState(false);

    useEffect(
        () => {
            updateIncludedCategories()
            retrieveStatsPomodorosCount('user')
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

    const retrieveStatsPomodorosCount = (dataType, dataTypeId = 0) => {
        setShowLoader(true);
        setStartDate(startDate);
        setEndDate(endDate);
        getStatsPomodorosCountApi({ startDate, endDate, type: dataType, typeId: dataTypeId, subject, includeCategories })
            .then(response => {
                const updated_data = {
                    data: [],
                    // label: `Project Categories (${label})`
                }
                response.data.forEach((element, i) => {
                    // console.debug(element);
                    updated_data.data.push({
                        date: element[1],
                        count: element[0]
                    })
                });
                // console.debug(updated_data);
                setChartData(updated_data)
                // console.debug("retrieved updated data: ", chartData);
                setShowLoader(false);
                setReloadData({
                    dataType,
                    dataTypeId: parseInt(dataTypeId)
                });
            })
            .catch(error => console.error(error.message))
    }

    function refreshProjects(categoryId) {
        setProjects([]);
        retrieveAllProjectsApi({ categoryId, subject })
            .then(response => {
                // console.debug(response)
                setProjects(response.data);
                setProjectsMap(new Map(response.data.map(project => {
                    project.pomodoroLength = project.pomodoroLength || userSettings.pomodoroLength;
                    return [project.id, project];
                })))
            })
            .catch(error => console.error(error.message))
    }

    function refreshTasks(projectId) {
        setTasks([]);
        retrieveAllTasksApi({ subject, projectId, status: 'current', limit: 100, offset: 0 })
            .then(response => {
                // console.debug(response)
                const localTasks1 = response.data;
                setTasks(response.data);

                retrieveAllTasksApi({ subject, projectId, status: 'archived', limit: 100, offset: 0 })
                    .then(response => {
                        // console.debug(response)
                        const localTasks2 = localTasks1.concat(response.data);
                        setTasks(localTasks2);
                        setTasksMap(new Map(localTasks2.map(task => {
                            task.pomodoroLength = task.pomodoroLength || projectsMap.get(task.project.id).pomodoroLength;
                            return [task.id, task];
                        })))
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
            retrieveStatsPomodorosCount('user')
            setProjects([]);
        } else {
            retrieveStatsPomodorosCount('category', id);
            refreshProjects(id);
        }
        setTasks([]);
    }

    function updateProject(id) {
        setProjectId(id);
        setTaskId('0');
        if (id === '0') {
            retrieveStatsPomodorosCount('category', categoryId);
            setTasks([]);
        } else {
            retrieveStatsPomodorosCount('project', id);
            refreshTasks(id);
        }
    }

    function updateTask(id) {
        setTaskId(id);
        if (id === '0') {
            retrieveStatsPomodorosCount('project', projectId);
        } else {
            retrieveStatsPomodorosCount('task', id);
        }
    }

    return (
        <div>

            <div className="row">
                <div className="col-lg-12 mb-1">
                    <h6 className='mb-0'>
                        Daily Streak<wbr />
                        <span className="loader-container-2" >
                            <span className="ms-1 loader-2" style={{ display: showLoader ? "inline" : "none" }}></span>
                        </span>
                    </h6>
                </div>

                <div className="col-6 px-0 mb-1">
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

                <div className="col-6 px-0 mb-1">
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

                <div className="col-12 px-0 mb-1">
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
            </div>

            <CalendarChart
                chartData={chartData}
                startDate={startDate}
                endDate={endDate}
                reloadData={reloadData}
                tasksMap={tasksMap}
                projectsMap={projectsMap}
                showLoader={showLoader}
            />

        </div >
    )
}

