import { useEffect, useState } from 'react';
import moment from 'moment';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

import { getStatsPomodorosCountApi } from 'services/api/PomodoroApiService';
import { retrieveAllProjectsApi } from 'services/api/ProjectApiService';

export const CalendarChart = ({ subject, categories }) => {

    const [startDate, setStartDate] = useState(moment().add(window.innerWidth <= 992 ? -0.5 : -1, 'y').toISOString());
    const [endDate, setEndDate] = useState(moment().toISOString());
    const [categoryId, setCategoryId] = useState('0');
    const [projectId, setProjectId] = useState('0');
    const [projects, setProjects] = useState([]);
    const [chartData, setChartData] = useState({ label: '', labels: [], data: [], colors: [] })

    useEffect(
        () => {
            retrieveStatsPomodorosCount('user')
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const retrieveStatsPomodorosCount = (type, typeId = 0) => {
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

    function updateCategory(id) {
        setCategoryId(id);
        if (id === '0') {
            retrieveStatsPomodorosCount('user')
        } else {
            retrieveStatsPomodorosCount('category', id);
            refreshProjects(id);
        }
    }

    function updateProject(id) {
        setProjectId(id);
        if (id === '0') {
            retrieveStatsPomodorosCount('category', categoryId);
        } else {
            retrieveStatsPomodorosCount('project', id);
        }
    }

    return (
        <div>

            <div className="row">
                <div className="col-lg-4 px-4 mb-1">
                    <select
                        className="form-select form-select-sm"
                        id="project_category_id"
                        name="project_category_id"
                        value={categoryId}
                        onChange={(e) => updateCategory(e.target.value)}
                    >
                        <option value="0">All Categories</option>
                        {
                            categories.map(
                                projectCategory => (
                                    <option key={projectCategory.id} value={projectCategory.id}>{projectCategory.name}</option>
                                )
                            )
                        }
                    </select>
                </div>

                <div className="col-lg-4 px-4 mb-1">
                    <select
                        className="form-select form-select-sm"
                        id="project_id"
                        name="project_id"
                        value={projectId}
                        onChange={(e) => updateProject(e.target.value)}
                    >
                        <option value="0">All Category Projects</option>
                        {
                            projects.map(
                                project => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
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
            />
        </div >
    )
}

