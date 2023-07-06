import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom";
import { retrieveAllProjectsApi, getProjectsCountApi } from "../services/api/ProjectApiService";
import ListTasksComponent from './ListTasksComponent'

// import { useAuth } from "../services/auth/AuthContext";
import Pagination from "../services/pagination/Pagination"

const PAGESIZE = 5;

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
        () => refreshProjects(),
        [currentPage]
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
                <div className="col-sm-4">
                    {/* {message && <div className="alert alert-warning">{message}</div>} */}
                    <div>
                        <table className='table table-hover'>
                            <thead>
                                <tr>
                                    <th>Projects</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    projects.map(
                                        project => (
                                            <tr key={project.id} onClick={() => setProject(project)}>
                                                <td align="left">
                                                    {/* <Link to={"/projects/" + project.id + "/tasks"} state={{ project }}>{project.name}</Link> */}
                                                    <span style={{ color: project.color }}>&#9632; </span>
                                                    <span>{project.name}</span>
                                                </td>
                                                <td align="right">
                                                    (<small>{project.projectCategory ? project.projectCategory.name : ''}</small>
                                                    ) <i className="bi bi-pencil-square" onClick={() => updateProject(project.id)}></i>
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

                        <div className="btn btn-outline-success btn-sm my-5" onClick={addNewProject}>Add New Project</div>
                    </div>
                </div>
                <div className="col-sm-8">
                    {
                        project &&
                        <ListTasksComponent project={project} />
                    }
                </div>
            </div>

        </div>
    )
}