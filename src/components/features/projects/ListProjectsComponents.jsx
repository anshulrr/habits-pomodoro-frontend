import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";

import Pagination from "services/pagination/Pagination"
import { useAuth } from "services/auth/AuthContext";
import { COLOR_MAP, timeToDisplay, truncateString } from "services/helpers/listsHelper";
import { isEmpty } from "services/helpers/helper";
import { useData } from "services/DataContext";

export default function ListProjectsComponent({
    project,
    setProject,
    setTag,
    setShowLeftMenu,
}) {
    const dataContext = useData();

    const projects = [...dataContext.projectsMap.values()];
    const projectsCount = projects.length;

    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const navigate = useNavigate()
    const { state } = useLocation();

    const projectsListElement = useRef(null);

    // for first time login default value is needed
    const PAGESIZE = userSettings.pageProjectsCount || 5;

    // for first time login default value is needed
    const IS_PROJECTS_DEFAULT = isEmpty(userSettings) || userSettings.homePageDefaultList === 'projects';

    // state might not be preset (eg. opening url in a new tab)
    // const [project, setProject] = useState(state && state.project)
    const [currentPage, setCurrentPage] = useState((state && state.currentProjectsPage) || 1)

    /*
        if project is not set 
            eg. opening url in a new tab
                or if it's first time login and home page default list is projects,
            set it to the first project in the list, 
                and update state for further navigations. 
        This is needed because project is used in other components, 
            and also for page refresh to set it right away.
    */
    useEffect(
        () => {
            if (IS_PROJECTS_DEFAULT && isEmpty(state) && !project && projects.length > 0) {
                setProject(projects[0]);
                // udpate state for first time load
                updateAppStates(projects[0]);
            }
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    // using useMemo to make sure displayProjects is always recomputed when projects or currentPage changes, to improve performance
    const displayProjects = useMemo(() => {
        // console.debug('recomputing displayProjects, project length is ', projects.length, { projects, currentPage })
        const firstPageIndex = (currentPage - 1) * PAGESIZE;
        const lastPageIndex = firstPageIndex + PAGESIZE;
        return projects.slice(firstPageIndex, lastPageIndex);
    }, [projects, currentPage])

    function addNewProject() {
        navigate(`/projects/create`, { state })
    }

    function onUpdateProject(proj) {
        setTag(null);
        if (project && project.id === proj.id) {
            return;
        }
        setProject(proj);
        // udpate state: to be passed with further navigations
        updateAppStates(proj);
        setShowLeftMenu(false);
    }

    function updateAppStates(proj) {
        // fix for directly opening url in a new tab
        let local_state = {};
        if (state) {
            local_state = { ...state };
        }
        local_state.project = proj;
        local_state.tag = null;
        local_state.filters = null;
        local_state.currentTasksPage = 1;
        local_state.currentArchivedTasksPage = 1;
        local_state.showArchivedTasks = false;
        // for page refresh: set it right away
        navigate('/', { state: local_state, replace: true });
    }

    const generateTimeElapsedColor = (project) => {
        if (project.type === 'bad') {
            if (project.timeElapsed / 60 > (project.pomodoroLength) * project.dailyLimit) {
                return "text-danger";
            }
        } else if (project.type === 'good') {
            if (project.timeElapsed / 60 >= (project.pomodoroLength) * project.dailyLimit) {
                return "text-success";
            }
        }
        return "";
    }

    return (
        <div className="mt-3 mb-3">
            {/* {message && <div className="alert alert-warning">{message}</div>} */}
            <div>
                <div className="d-flex justify-content-between">
                    <h6>
                        <span>
                            Projects
                        </span>
                        {
                            projectsCount !== -1 &&
                            <span className="ms-1 badge rounded-pill text-bg-secondary">
                                {projectsCount}
                                <span className="ms-1">&#9632;</span>
                            </span>
                        }
                    </h6>
                    <div>
                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-2" onClick={addNewProject}>
                            <i className="bi bi-plus-circle" ></i>
                        </button>
                    </div>
                </div>
                {
                    projects.length === 0 &&
                    <div className="loader-container" style={{ height: projectsListElement.current ? projectsListElement.current.offsetHeight : 0 }}>
                        <div className="loader"></div>
                    </div>
                }
                {
                    <div>
                        <div id="projects-list" ref={projectsListElement}>
                            {
                                displayProjects.map(
                                    proj => {
                                        proj.pomodoroLength = proj.pomodoroLength || userSettings.pomodoroLength;
                                        return (
                                            <div
                                                key={proj.id}
                                                className={(project && proj.id === project.id ? "list-selected " : "") + "row py-2 list-row"}
                                                onClick={() => onUpdateProject(proj)}
                                            >
                                                {/* todo: decide better solution for maxWidth */}
                                                <div className="col-8 text-truncate text-start">
                                                    {/* <Link to={"/projects/" + proj.id + "/tasks"} state={{ proj }}>{proj.name}</Link> */}
                                                    <span style={{ color: proj.color }}>&#9632; </span>
                                                    <span className={"project-name text-" + COLOR_MAP[proj.type]}>
                                                        {proj.name}
                                                    </span>
                                                </div>
                                                <div className="col-4 ps-0 subscript text-secondary text-truncate text-end">

                                                    {
                                                        proj.timeElapsed &&
                                                        <span>

                                                            <span className={generateTimeElapsedColor(proj)}>
                                                                <i className="bi bi-clock-fill" style={{ paddingRight: "0.1rem" }} />
                                                            </span>
                                                            <span style={{ fontVariantNumeric: "tabular-nums" }}>
                                                                {timeToDisplay(Math.round(proj.timeElapsed / 60))}
                                                            </span>
                                                        </span>
                                                    }
                                                    <span className="">
                                                        <i className="ps-1 bi bi-link-45deg" style={{ paddingRight: '0.1rem', color: proj.categoryColor }} />
                                                        {truncateString(proj.category, 8)}
                                                    </span>
                                                    <span className="ps-1">
                                                        <span>
                                                            {proj.dailyLimit !== 1 && proj.dailyLimit}<i className="bi bi-hourglass" />
                                                        </span>
                                                        {timeToDisplay(proj.pomodoroLength)}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>

                        <Pagination
                            className="pagination-bar pagination-scroll mt-1 mb-0 ps-0"
                            currentPage={currentPage}
                            totalCount={projectsCount}
                            pageSize={PAGESIZE}
                            onPageChange={page => {
                                setCurrentPage(page);
                                state.currentProjectsPage = page;
                                navigate(`/`, { state, replace: true });
                            }}
                        />
                    </div>
                }
            </div>
        </div>
    )
}