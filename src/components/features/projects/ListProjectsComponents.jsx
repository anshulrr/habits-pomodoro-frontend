import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";

import { retrieveAllProjectsApi, getProjectsCountApi } from "services/api/ProjectApiService";
import Pagination from "services/pagination/Pagination"
import { useAuth } from "services/auth/AuthContext";
import { truncateString } from "services/helpers/listsHelper";

export default function ListProjectsComponent({ project, setProject, setTag, setShowLeftMenu }) {
    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const navigate = useNavigate()
    const { state } = useLocation();

    const [showProjects, setShowProjects] = useState(true);

    const projectsListElement = useRef(null);

    // for first time login default value is needed
    const PAGESIZE = userSettings.pageProjectsCount || 5;

    const [projectsCount, setProjectsCount] = useState(0)
    const [projects, setProjects] = useState([])

    // state might not be preset (eg. opening url in a new tab)
    // const [project, setProject] = useState(state && state.project)
    const [currentPage, setCurrentPage] = useState((state && state.currentProjectsPage) || 1)

    useEffect(
        () => {
            getProjectsCount()
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    useEffect(
        () => {
            // console.debug('re-render ListProjectsComponents')
            refreshProjects()
        }, [currentPage] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshProjects() {
        setProjects([]);
        retrieveAllProjectsApi(PAGESIZE, (currentPage - 1) * PAGESIZE)
            .then(response => {
                // console.debug(response)
                setProjects(response.data)
                // set project for first time load
                if (isStateEmpty() && !project && response.data.length > 0) {
                    setProject(response.data[0]);
                    // udpate state for first time load
                    updateAppStates(response.data[0]);
                }
            })
            .catch(error => console.error(error.message))
    }

    function isStateEmpty() {
        if (!state) {
            return true;
        }
        for (const prop in state) {
            if (Object.hasOwn(state, prop)) {
                return false;
            }
        }
        return true;
    }

    function getProjectsCount() {
        getProjectsCountApi()
            .then(response => {
                setProjectsCount(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function updateProject(id) {
        navigate(`/projects/${id}`, { state })
    }

    function addNewProject() {
        navigate(`/projects/-1`, { state })
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
        local_state.currentCompletedTasksPage = 1;
        local_state.currentArchivedTasksPage = 1;
        local_state.showCompletedTasks = false;
        local_state.showArchivedTasks = false;
        // for page refresh: set it right away
        navigate('/', { state: local_state, replace: true });
    }

    return (
        <div className="mt-3 mb-3">
            {/* {message && <div className="alert alert-warning">{message}</div>} */}
            <div>
                <div className="d-flex justify-content-between">
                    <h6 className="d-flex justify-content-start">
                        <span>
                            Projects
                        </span>
                        <span className="ms-1 badge rounded-pill text-bg-secondary">
                            {projectsCount}
                            <span className="ms-1">&#9632;</span>
                        </span>
                    </h6>
                    <div className="input-group justify-content-end">
                        {
                            showProjects &&
                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-2" onClick={addNewProject}>
                                <i className="bi bi-plus-circle" ></i>
                            </button>
                        }

                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-2" onClick={() => setShowProjects(!showProjects)}>
                            {
                                !showProjects &&
                                <i className="bi bi-eye" />
                            }
                            {
                                showProjects &&
                                <i className="bi bi-eye-slash" />
                            }
                        </button>
                    </div>
                </div>
                {
                    showProjects && projects.length === 0 &&
                    <div className="loader-container" style={{ height: projectsListElement.current ? projectsListElement.current.offsetHeight : 0 }}>
                        <div className="loader"></div>
                    </div>
                }
                {
                    showProjects &&
                    <div>
                        <div id="projects-list" ref={projectsListElement}>
                            {
                                projects.map(
                                    proj => (
                                        <div
                                            key={proj.id}
                                            className={(project && proj.id === project.id ? "list-selected " : "") + "row py-2 list-row"}
                                            onClick={() => onUpdateProject(proj)}
                                        >
                                            {/* todo: decide better solution for maxWidth */}
                                            <div className="col-8 text-truncate text-start">
                                                {/* <Link to={"/projects/" + proj.id + "/tasks"} state={{ proj }}>{proj.name}</Link> */}
                                                <span style={{ color: proj.color }}>&#9632; </span>
                                                <span className="project-name">
                                                    {proj.name}
                                                </span>
                                            </div>
                                            <div className="col-4 ps-0 subscript text-secondary text-truncate text-end list-details">
                                                <span className="">
                                                    <i className="bi bi-link-45deg" style={{ paddingRight: '0.1rem' }} />
                                                    {truncateString(proj.category, 8)}
                                                </span>
                                                <span className="">
                                                    <i className="ps-1 bi bi-arrow-up" />
                                                    {proj.priority}
                                                </span>
                                                <span className="">
                                                    <i className="ps-1 bi bi-hourglass" />
                                                    {proj.pomodoroLength || userSettings.pomodoroLength}
                                                </span>
                                            </div>
                                            <div className="col-4 ps-0 text-secondary text-end list-button">
                                                <div className="input-group justify-content-end">
                                                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => updateProject(proj.id)}>
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )
                            }
                        </div>

                        <Pagination
                            className="pagination-bar mb-0 ps-0"
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