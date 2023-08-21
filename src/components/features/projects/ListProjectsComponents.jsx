import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";

import { retrieveAllProjectsApi, getProjectsCountApi } from "services/api/ProjectApiService";
import Pagination from "services/pagination/Pagination"
import { useAuth } from "services/auth/AuthContext";

import ListTasksComponent from 'components/features/tasks/ListTasksComponent'
import ListCommentsComponent from "components/features/comments/ListCommentsComponents";

export default function ListProjectsComponent() {
    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const navigate = useNavigate()

    const PAGESIZE = window.innerWidth <= 768 ? userSettings.pageProjectsCount : 15;

    const [projects, setProjects] = useState([])

    const [currentPage, setCurrentPage] = useState(1)

    const [projectsCount, setProjectsCount] = useState(0)

    const { state } = useLocation();
    const [project, setProject] = useState(state ? state.project : null)

    const [showCommentsId, setShowCommentsId] = useState(-1);

    useEffect(
        () => getProjectsCount(),
        []
    )

    useEffect(
        () => {
            // console.debug('re-render ListProjectsComponents')
            refreshProjects()
        }, [currentPage] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshProjects() {
        retrieveAllProjectsApi(PAGESIZE, (currentPage - 1) * PAGESIZE)
            .then(response => {
                // console.debug(response)
                setProjects(response.data)
                if (project === null && response.data.length > 0) {
                    setProject(response.data[0])
                }
            })
            .catch(error => console.error(error.message))
    }

    function getProjectsCount() {
        getProjectsCountApi()
            .then(response => {
                setProjectsCount(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function updateProject(id) {
        navigate(`/projects/${id}`)
    }

    function addNewProject() {
        navigate(`/projects/-1`)
    }


    return (
        <div className="container">
            <div className="row mb-3">
                <div className="col-md-4 mt-3 border-bottom border-2">
                    {/* {message && <div className="alert alert-warning">{message}</div>} */}
                    <div>
                        <div className="row">
                            <div className="col-10">
                                <h5>
                                    <span>
                                        Projects
                                    </span>
                                    <span className="ms-1 badge rounded-pill text-bg-secondary">
                                        {projectsCount}
                                        <span className="ms-1 bi bi-folder-plus" />
                                    </span>
                                </h5>
                            </div>
                            <div className="col-2 text-end">
                                <i className="p-1 bi bi-plus-square" onClick={addNewProject}></i>
                            </div>
                        </div>
                        {
                            projects.map(
                                proj => (
                                    <div
                                        key={proj.id}
                                        className={(project && proj.id === project.id ? "list-selected " : "") + "row py-2 list-row"}
                                        onClick={() => setProject(proj)}
                                    >
                                        {/* todo: decide better solution for maxWidth */}
                                        <div className="col-8 text-truncate text-start">
                                            {/* <Link to={"/projects/" + proj.id + "/tasks"} state={{ proj }}>{proj.name}</Link> */}
                                            <span style={{ color: proj.color }}>&#9632; </span>
                                            <span>{proj.name}</span>
                                        </div>
                                        <div className="col-4 px-0 text-secondary text-truncate text-end list-details">
                                            <span className="badge rounded-pill text-bg-light fw-normal">
                                                <small className="bi bi-link-45deg" style={{ paddingRight: '0.1rem' }} />
                                                {proj.category}
                                            </span>
                                            <span className="badge rounded-pill text-bg-light fw-normal">
                                                <small className="bi bi-hourglass" />
                                                {proj.pomodoroLength || userSettings.pomodoroLength}
                                            </span>
                                        </div>
                                        <div className="col-4 px-0 text-secondary text-end list-button">
                                            <i className="p-1 me-1 bi bi-chat-right-text" onClick={() => setShowCommentsId(proj.id)} />
                                            <i className="p-1 bi bi-pencil-square" onClick={() => updateProject(proj.id)}></i>
                                        </div>
                                    </div>
                                )
                            )
                        }

                        <Pagination
                            className="pagination-bar mt-3"
                            currentPage={currentPage}
                            totalCount={projectsCount}
                            pageSize={PAGESIZE}
                            onPageChange={page => setCurrentPage(page)}
                        />
                    </div>
                </div>

                {
                    showCommentsId !== -1 &&
                    <ListCommentsComponent
                        filterBy={'project'}
                        id={showCommentsId}
                        title={project.name}
                        setShowCommentsId={setShowCommentsId}
                    />
                }

                <div className="col-md-8">
                    {
                        project &&
                        <ListTasksComponent project={project} />
                    }
                </div>
            </div>

        </div>
    )
}