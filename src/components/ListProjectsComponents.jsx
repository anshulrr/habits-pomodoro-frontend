import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { retrieveAllProjectsApi, getProjectsCountApi } from "../services/api/ProjectApiService";
import ListTasksComponent from './ListTasksComponent'

// import { useAuth } from "../services/auth/AuthContext";
import Pagination from "../services/pagination/Pagination"

// console.log(window.innerWidth);
const PAGESIZE = window.innerWidth <= 768 ? 5 : 15;

export default function ListProjectsComponent() {

    // const authContext = useAuth()
    // const username = authContext.username

    const navigate = useNavigate()

    const [projects, setProjects] = useState([])

    const [currentPage, setCurrentPage] = useState(1)

    const [projectsCount, setProjectsCount] = useState(0)

    const { state } = useLocation();
    const [project, setProject] = useState(state ? state.project : null)

    useEffect(
        () => getProjectsCount(),
        []
    )

    useEffect(
        () => {
            // console.log('re-render ListProjectsComponents')
            refreshProjects()
        }, [currentPage] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshProjects() {
        retrieveAllProjectsApi(PAGESIZE, (currentPage - 1) * PAGESIZE)
            .then(response => {
                // console.log(response)
                setProjects(response.data)
            })
            .catch(response => console.log(response))
    }

    function getProjectsCount() {
        getProjectsCountApi()
            .then(response => {
                setProjectsCount(response.data)
            })
            .catch(response => console.log(response))
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
                <div className="col-md-4 mb-3">
                    {/* {message && <div className="alert alert-warning">{message}</div>} */}
                    <div>
                        <div className="row">
                            <div className="col-10">
                                <h5>Projects ({projectsCount})</h5>
                            </div>
                            <div className="col-2 text-end">
                                <i className="bi bi-plus-square" onClick={addNewProject}></i>
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
                                        <div className="col text-secondary text-truncate text-end">
                                            <small>{proj.pomodoroLength || 25} </small>
                                            <small>{proj.category} </small>
                                        </div>
                                        <div className="col-2 text-secondary text-end list-button">
                                            <i className="bi bi-pencil-square" onClick={() => updateProject(proj.id)}></i>
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