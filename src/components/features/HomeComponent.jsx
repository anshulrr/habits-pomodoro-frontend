import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'

import moment from 'moment';

import ListProjectsComponent from 'components/features/projects/ListProjectsComponents';
import ListTasksComponent from 'components/features/tasks/ListTasksComponent';
import ListPomodorosComponent from 'components/stats/ListPomodorosComponent';
import ListTagsComponent from 'components/features/tags/ListTagsComponents';

import OutsideAlerter from 'services/hooks/OutsideAlerter';
import { useAuth } from 'services/auth/AuthContext';
import { isEmpty } from 'services/helpers/helper';
import { retrieveAllProjectCategoriesApi } from 'services/api/ProjectCategoryApiService';
import { toast } from 'react-toastify';
import { getTasksCountApi } from 'services/api/TaskApiService';
import SearchTaskComponent from './tasks/SearchTaskComponent';

export default function HomeComponent({ setReloadHome }) {

    const { state } = useLocation();

    const navigate = useNavigate();

    const authContext = useAuth();
    const userSettings = authContext.userSettings;
    const IS_FILTERS_DEFAULT = userSettings.homePageDefaultList === 'filters';

    const [todaysPomodorosMap, setTodaysPomodorosMap] = useState(null);
    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState(state && state.project);
    const [tag, setTag] = useState(state && state.tag);
    const [tags, setTags] = useState(null);

    const [tasksComponentReload, setTasksComponentReload] = useState(0)

    const [tasksFilter, setTasksFilter] = useState((state && state.filters) || (isEmpty(state) && IS_FILTERS_DEFAULT && 'Overdue'));
    const [searchString, setSearchString] = useState((state && state.searchString) || '')

    const [showLeftMenu, setShowLeftMenu] = useState(window.innerWidth <= 992 ? false : true);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isReversed, setReversed] = useState(false);

    const [pomodorosHeight, setPomodorosHeight] = useState(0);
    const [pomodorosListReload, setPomodorosListReload] = useState(0)

    const [categoryIds, setCategoryIds] = useState([]);

    useEffect(
        () => {
            document.title = 'Habits Pomodoro';
            // console.debug("home", authContext.userSettings)
            if (tasksFilter) {
                fetchTasks(tasksFilter);
            }

            retrieveAllProjectCategoriesApi(100, 0)
                .then(response => {
                    setCategoryIds(response.data.map(c => c.id));
                })
                .catch(error => console.error(error.message))

            retrieveOverdewTasksCount();
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveOverdewTasksCount() {
        const taskData = {
            status: 'current',
            startDate: moment().add(-10, 'y').toISOString(),
            endDate: moment().toISOString()
        }
        getTasksCountApi(taskData)
            .then(response => {
                if (response.data > 0) {
                    toast.error(`Overdue Tasks: ${response.data}`, { autoClose: 2 * 1000, position: "bottom-left" });
                }
            })
            .catch(error => console.error(error.message))
    }

    function fetchTasksAndUpdateAppStates(filter) {
        fetchTasks(filter);
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
        } else if (filter === 'Searched') {
            setStartDate(null)
            setEndDate(null)
        }
        updateAppStates(filter);
        setTasksComponentReload(prev => prev + 1);
    }

    function updateAppStates(filter) {
        // fix for directly opening url in a new tab
        let local_state = {};
        if (state) {
            local_state = { ...state };
        }
        local_state.project = null;
        local_state.tag = null;
        local_state.filters = filter;
        local_state.currentTasksPage = 1;
        local_state.currentArchivedTasksPage = 1;
        local_state.showArchivedTasks = false;
        local_state.searchString = searchString;
        // for page refresh: set it right away
        navigate('/', { state: local_state, replace: true });
    }

    return (
        <div className="container">
            <div className="row border-bottom border-2">
                <div className="col-lg-4 px-0 text-start">

                    <span className="refresh-icon">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setReloadHome(prev => prev + 1)}>
                            <i className="bi bi-arrow-clockwise" />
                        </button>
                    </span>

                    <div className="left-menu-icon">
                        <button type="button" className="btn btn-success" onClick={() => setShowLeftMenu(!showLeftMenu)}>
                            <i className="px-4 bi bi-list" />
                        </button>
                    </div>

                    <div className={showLeftMenu ? "left-menu-container" : ""}>
                        <div className={"left-menu-overlay " + (showLeftMenu ? "left-menu-enter" : "left-menu-exit")} >
                            <div id="outside-alerter-parent">
                                <OutsideAlerter handle={() => setShowLeftMenu(false)}>
                                    <div className="left-menu-popup">

                                        <div className="container">
                                            <ListProjectsComponent
                                                projects={projects}
                                                setProjects={setProjects}
                                                project={project}
                                                setProject={setProject}
                                                setTag={setTag}
                                                setShowLeftMenu={setShowLeftMenu}
                                                todaysPomodorosMap={todaysPomodorosMap}
                                            />

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

                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <h6>
                                                        Tasks Filters
                                                    </h6>
                                                </div>
                                                {
                                                    <div>
                                                        <div className={(!project && !tag && tasksFilter === "Overdue" ? "list-selected " : "") + "py-2 small row list-row"} onClick={() => fetchTasksAndUpdateAppStates('Overdue')}>
                                                            <div className="col-12">
                                                                <i className="pe-1 bi bi-calendar-check text-danger" />
                                                                Overdue
                                                            </div>
                                                        </div>
                                                        <div className={(!project && !tag && tasksFilter === "Upcoming" ? "list-selected " : "") + "py-2 small row list-row"} onClick={() => fetchTasksAndUpdateAppStates('Upcoming')}>
                                                            <div className="col-12">
                                                                <i className="pe-1 bi bi-calendar-check" />
                                                                Upcoming
                                                            </div>
                                                        </div>
                                                        <div className={(!project && !tag && tasksFilter === "Searched" ? "list-selected " : "") + "py-2 small row list-row"} >
                                                            <div className="col-12" style={{ pointerEvents: 'all' }}>
                                                                <SearchTaskComponent
                                                                    searchString={searchString}
                                                                    setSearchString={setSearchString}
                                                                    fetchTasksAndUpdateAppStates={fetchTasksAndUpdateAppStates}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>

                                        </div>

                                    </div>
                                </OutsideAlerter>
                            </div>
                        </div>
                    </div>
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
                                    projects={projects}
                                    setPomodorosListReload={setPomodorosListReload}
                                />
                            }
                            {
                                !project && !tag && tasksFilter &&
                                <ListTasksComponent
                                    key={[tasksComponentReload]}
                                    projects={projects}
                                    tags={tags}
                                    startDate={startDate}
                                    endDate={endDate}
                                    searchString={searchString}
                                    isReversed={isReversed}
                                    title={tasksFilter}
                                    setPomodorosListReload={setPomodorosListReload}
                                />
                            }

                            {
                                !project && tag &&
                                <ListTasksComponent
                                    key={[project, tag.id, tasksComponentReload]}
                                    projects={projects}
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
                        {
                            categoryIds.length === 0 &&
                            <span className="loader-container mt-5" >
                                <span className="loader"></span>
                            </span>
                        }
                        {
                            categoryIds.length > 0 &&
                            <ListPomodorosComponent
                                key={[pomodorosListReload]}
                                includeCategories={categoryIds}
                                title={"Today's Pomodoros"}
                                elementHeight={pomodorosHeight}
                                setElementHeight={setPomodorosHeight}
                                setTasksComponentReload={setTasksComponentReload}
                                setProjects={setProjects}
                                setTodaysPomodorosMap={setTodaysPomodorosMap}
                            />
                        }
                    </div >
                </div >
            </div>

        </div >
    )
}