import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'

import moment from 'moment';

import ListProjectsComponent from './projects/ListProjectsComponents';
import ListTasksComponent from './tasks/ListTasksComponent';
import ListPomodorosComponent from 'components/stats/ListPomodorosComponent';
import ListTagsComponent from './tasks/ListTagsComponents';

export default function HomeComponent() {

    const { state } = useLocation();

    const navigate = useNavigate()

    const [project, setProject] = useState(state && state.project);
    const [tag, setTag] = useState(null);

    const [tasksTitle, setTasksTitle] = useState('');
    const [showTasksFilters, setShowTasksFilters] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isReversed, setReversed] = useState(false);

    const [pomodorosHeight, setPomodorosHeight] = useState(0);
    const [pomodorosListReload, setPomodorosListReload] = useState(0)

    function fetchUpcomingTasks() {
        setTasksTitle('Upcoming')
        setProject(null);
        setTag(null);

        setReversed(false); // temporary fix: might need better api response
        setStartDate(moment().toISOString());
        setEndDate(moment().add(10, 'y').toISOString());
        updateAppStates();
    }

    function fetchOverdueTasks() {
        setTasksTitle('Overdue')
        setProject(null);
        setTag(null);

        setReversed(false);
        setStartDate(moment().add(-10, 'y').toISOString());
        setEndDate(moment().toISOString());
        updateAppStates();
    }

    function updateAppStates() {
        let local_state = { ...state };
        // local_state.project = null;
        local_state.currentTasksPage = 1;
        local_state.currentCompletedTasksPage = 1;
        local_state.currentArchivedTasksPage = 1;
        local_state.showCompletedTasks = false;
        local_state.showArchivedTasks = false;
        // for page refresh: set it right away
        navigate('/', { state: local_state, replace: true });
    }

    return (
        <div className="container">
            <div className="row border-bottom border-2">
                <div className="col-lg-4 text-start">
                    <ListProjectsComponent
                        project={project}
                        setProject={setProject}
                        setTag={setTag}
                    />

                    <div className="mb-3">
                        <div className="d-flex justify-content-between">
                            <h6>
                                Tasks Filters
                            </h6>
                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-2" onClick={() => setShowTasksFilters(!showTasksFilters)}>
                                <i className="bi bi-pencil-square" />
                            </button>
                        </div>
                        {
                            showTasksFilters &&
                            <div>
                                <div className={(!project && !tag && tasksTitle === "Upcoming" ? "list-selected " : "") + "py-1 small row list-row"} onClick={fetchUpcomingTasks}>
                                    <div className="col-12">
                                        <i className="pe-1 bi bi-calendar-check" />
                                        Upcoming
                                    </div>
                                </div>
                                <div className={(!project && !tag && tasksTitle === "Overdue" ? "list-selected " : "") + "py-1 small row list-row"} onClick={fetchOverdueTasks}>
                                    <div className="col-12">
                                        <i className="pe-1 bi bi-calendar-check text-danger" />
                                        Overdue
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="mb-3">
                        <ListTagsComponent
                            setProject={setProject}
                            tag={tag}
                            setTag={setTag}
                        />
                    </div>

                </div>

                <div className="col-lg-4">
                    {
                        project &&
                        <ListTasksComponent
                            key={project.id}
                            project={project}
                            setPomodorosListReload={setPomodorosListReload}
                        />
                    }
                    {
                        !project && !tag && startDate &&
                        <ListTasksComponent
                            key={[startDate, endDate]}
                            startDate={startDate}
                            endDate={endDate}
                            isReversed={isReversed}
                            title={tasksTitle}
                            setPomodorosListReload={setPomodorosListReload}
                        />
                    }

                    {
                        !project && tag &&
                        <ListTasksComponent
                            key={[tag.id]}
                            tag={tag}
                            setPomodorosListReload={setPomodorosListReload}
                        />
                    }
                </div>

                <div className="col-lg-4">
                    <div className="mt-3 bg-white text-start text-secondary">
                        <ListPomodorosComponent
                            key={[pomodorosListReload]}
                            title={"Today's Pomodoros"}
                            elementHeight={pomodorosHeight}
                            setElementHeight={setPomodorosHeight}
                            setPomodorosListReload={setPomodorosListReload}
                        />
                    </div >
                </div >
            </div>

        </div>
    )
}