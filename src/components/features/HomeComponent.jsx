import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'

import moment from 'moment';

import ListProjectsComponent from 'components/features/projects/ListProjectsComponents';
import ListTasksComponent from 'components/features/tasks/ListTasksComponent';
import ListPomodorosComponent from 'components/stats/ListPomodorosComponent';
import ListTagsComponent from 'components/features/tags/ListTagsComponents';
import UserCommentsComponent from './comments/UserCommentsComponent';
import OutsideAlerter from 'services/hooks/OutsideAlerter';

export default function HomeComponent() {

    const { state } = useLocation();

    const navigate = useNavigate()

    const [project, setProject] = useState(state && state.project);
    const [tag, setTag] = useState(state && state.tag);
    const [tags, setTags] = useState(null);

    const [tasksComponentReload, setTasksComponentReload] = useState(0)

    const [tasksFilter, setTasksFilter] = useState(state && state.filters);
    const [showTasksFilters, setShowTasksFilters] = useState(true);

    const [showLeftMenu, setShowLeftMenu] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isReversed, setReversed] = useState(false);

    const [pomodorosHeight, setPomodorosHeight] = useState(0);
    const [pomodorosListReload, setPomodorosListReload] = useState(0)

    useEffect(
        () => {
            document.title = 'Habits Pomodoro';
            if (tasksFilter) {
                fetchTasks(tasksFilter);
            }
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function fetchTasksAndUpdateAppStates(filter) {
        fetchTasks(filter);
        updateAppStates(filter);
        setShowLeftMenu(false);
    }

    function fetchTasks(filter) {
        setTasksFilter(filter);
        setProject(null);
        setTag(null);

        if (filter === 'Upcoming') {
            setReversed(false); // temporary fix: might need better api response
            setStartDate(moment().toISOString());
            setEndDate(moment().add(10, 'y').toISOString());
        } else if (filter === 'Overdue') {
            setReversed(false);
            setStartDate(moment().add(-10, 'y').toISOString());
            setEndDate(moment().toISOString());
        }
    }

    function updateAppStates(filter) {
        let local_state = { ...state };
        local_state.project = null;
        local_state.tag = null;
        local_state.filters = filter;
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

                    <div className="left-menu-icon">
                        {
                            <button type="button" className="btn btn-light bg-white border-secondary mx-2" onClick={() => setShowLeftMenu(!showLeftMenu)}>
                                <i className="px-3 bi bi-list" />
                            </button>
                        }
                    </div>

                    {
                        <div className={"left-menu-overlay " + (showLeftMenu ? "left-menu-enter" : "left-menu-exit")} >
                            <div id="outside-alerter-parent">
                                <OutsideAlerter handle={() => setShowLeftMenu(false)}>
                                    <div className="left-menu-popup">

                                        <ListProjectsComponent
                                            project={project}
                                            setProject={setProject}
                                            setTag={setTag}
                                            setShowLeftMenu={setShowLeftMenu}
                                        />

                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between">
                                                <h6>
                                                    Tasks Filters
                                                </h6>
                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-2" onClick={() => setShowTasksFilters(!showTasksFilters)}>
                                                    {
                                                        !showTasksFilters &&
                                                        <i className="bi bi-eye-slash" />
                                                    }
                                                    {
                                                        showTasksFilters &&
                                                        <i className="bi bi-eye" />
                                                    }
                                                </button>
                                            </div>
                                            {
                                                showTasksFilters &&
                                                <div>
                                                    <div className={(!project && !tag && tasksFilter === "Upcoming" ? "list-selected " : "") + "py-1 small row list-row"} onClick={() => fetchTasksAndUpdateAppStates('Upcoming')}>
                                                        <div className="col-12">
                                                            <i className="pe-1 bi bi-calendar-check" />
                                                            Upcoming
                                                        </div>
                                                    </div>
                                                    <div className={(!project && !tag && tasksFilter === "Overdue" ? "list-selected " : "") + "py-1 small row list-row"} onClick={() => fetchTasksAndUpdateAppStates('Overdue')}>
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
                                                setAllTags={setTags}
                                                setTasksComponentReload={setTasksComponentReload}
                                                setShowLeftMenu={setShowLeftMenu}
                                            />
                                        </div>
                                    </div>
                                </OutsideAlerter>
                            </div>
                        </div>
                    }
                </div>

                <div className="col-lg-4" style={{ backgroundColor: "#e9ecef" }}>
                    {
                        tags !== null &&
                        <div>
                            {
                                project &&
                                <ListTasksComponent
                                    key={[project.id, tag, tasksComponentReload]}
                                    project={project}
                                    tags={tags}
                                    setPomodorosListReload={setPomodorosListReload}
                                />
                            }
                            {
                                !project && !tag && tasksFilter &&
                                <ListTasksComponent
                                    key={[startDate, endDate, tasksComponentReload]}
                                    tags={tags}
                                    startDate={startDate}
                                    endDate={endDate}
                                    isReversed={isReversed}
                                    title={tasksFilter}
                                    setPomodorosListReload={setPomodorosListReload}
                                />
                            }

                            {
                                !project && tag &&
                                <ListTasksComponent
                                    key={[project, tag.id, tasksComponentReload]}
                                    tags={tags}
                                    tag={tag}
                                    setPomodorosListReload={setPomodorosListReload}
                                />
                            }
                        </div>
                    }
                </div>

                <div className="col-lg-4">
                    <div className="mt-3 mb-5 bg-white text-start text-secondary">
                        <ListPomodorosComponent
                            key={[pomodorosListReload]}
                            title={"Today's Pomodoros"}
                            elementHeight={pomodorosHeight}
                            setElementHeight={setPomodorosHeight}
                            setPomodorosListReload={setPomodorosListReload}
                            tags={tags}
                        />
                    </div >
                </div >
            </div>

            <UserCommentsComponent
                tags={tags}
            />

        </div >
    )
}