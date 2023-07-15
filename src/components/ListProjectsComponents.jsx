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
            <div className="row">
                <div className="col-md-4">
                    {/* {message && <div className="alert alert-warning">{message}</div>} */}
                    <div>
                        <div className="row">
                            <div className="col-11">
                                <h5>Projects</h5>
                            </div>
                            <div className="col-1 text-end">
                                <i className="bi bi-plus-square" onClick={addNewProject}></i>
                            </div>
                        </div>
                        <table className="table table-hover">
                            <tbody>
                                {
                                    projects.map(
                                        proj => (
                                            <tr
                                                key={proj.id}
                                                className={project && proj.id === project.id ? "bg-info" : ""}
                                                onClick={() => setProject(proj)}
                                            >
                                                {/* todo: decide better solution for maxWidth */}
                                                <td align="left" className="text-truncate" style={{ maxWidth: '100px' }}>
                                                    {/* <Link to={"/projects/" + proj.id + "/tasks"} state={{ proj }}>{proj.name}</Link> */}
                                                    <span style={{ color: proj.color }}>&#9632; </span>
                                                    <span>{proj.name}</span>
                                                </td>
                                                <td align="right" className="text-secondary text-truncate">
                                                    <small>{proj.pomodoroLength || 25} </small>
                                                    <small>{proj.category} </small>
                                                    <i className="bi bi-pencil-square" onClick={() => updateProject(proj.id)}></i>
                                                </td>
                                            </tr>
                                        )
                                    )
                                }
                            </tbody>

                        </table>

                        <Pagination
                            className="pagination-bar"
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