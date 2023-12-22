import { useEffect, useState } from 'react';
import moment from 'moment';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { getStatsPomodorosCountApi } from 'services/api/PomodoroApiService';
import { retrieveAllProjectsApi } from 'services/api/ProjectApiService';
import { timeToDisplay } from 'services/helpers/listsHelper';
import { retrieveAllTasksApi } from 'services/api/TaskApiService';

export const CalendarChart = ({ subject, categories }) => {

    const [startDate, setStartDate] = useState(moment().add(window.innerWidth <= 992 ? -0.5 : -1, 'y').toISOString());
    const [endDate, setEndDate] = useState(moment().toISOString());
    const [categoryId, setCategoryId] = useState('0');
    const [projectId, setProjectId] = useState('0');
    const [projects, setProjects] = useState([]);
    const [taskId, setTaskId] = useState('0');
    const [tasks, setTasks] = useState([]);
    const [chartData, setChartData] = useState({ label: '', labels: [], data: [], colors: [] })

    const [showLoader, setShowLoader] = useState(false);

    useEffect(
        () => {
            retrieveStatsPomodorosCount('user')
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const retrieveStatsPomodorosCount = (type, typeId = 0) => {
        setShowLoader(true);
        setStartDate(startDate);
        setEndDate(endDate);
        getStatsPomodorosCountApi({ startDate, endDate, type, typeId, subject })
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
            })
            .catch(error => console.error(error.message))
    }

    function refreshProjects(categoryId) {
        setProjects([]);
        retrieveAllProjectsApi({ categoryId, subject })
            .then(response => {
                // console.debug(response)
                setProjects(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function refreshTasks(projectId) {
        setTasks([]);

        retrieveAllTasksApi({ subject, projectId, status: 'current', limit: 100, offset: 0 })
            .then(response => {
                // console.debug(response)
                setTasks(prev => prev.concat(response.data))
            })
            .catch(error => console.error(error.message))

        retrieveAllTasksApi({ subject, projectId, status: 'archived', limit: 100, offset: 0 })
            .then(response => {
                // console.debug(response)
                setTasks(prev => prev.concat(response.data))
            })
            .catch(error => console.error(error.message))
    }

    function updateCategory(id) {
        setCategoryId(id);
        setProjectId('0');
        if (id === '0') {
            retrieveStatsPomodorosCount('user')
            setProjects([]);
            setTasks([]);
        } else {
            retrieveStatsPomodorosCount('category', id);
            refreshProjects(id);
        }
    }

    function updateProject(id) {
        setProjectId(id);
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
                            categories.map(
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

            <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={chartData.data}
                showWeekdayLabels={true}
                classForValue={(value) => {
                    if (!value) {
                        return 'color-empty';
                    }
                    // time spent above 12 hours has darkest color
                    const max = 12 * 60;
                    let range = Math.round(value.count / max * 10) * 10;
                    range = range <= 100 ? range : 100;
                    return `color-good-${range}`;
                }}
                tooltipDataAttrs={value => {
                    if (!value || !value.date) {
                        return null;
                    }
                    return {
                        'data-tooltip-id': 'streak-tooltip',
                        'data-tooltip-content': `${value.date}: ${timeToDisplay(value.count, true)}`
                    };
                }}
            />
            <Tooltip id="streak-tooltip" />

        </div >
    )
}

