import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { retrieveAllProjectsApi, getProjectsCountApi } from "../services/api/ProjectApiService";
// import { useAuth } from "../services/auth/AuthContext";
import Pagination from "../services/pagination/Pagination"

let PageSize = 5;

export default function ListProjectsComponent() {

    // const authContext = useAuth()
    // const username = authContext.username

    const navigate = useNavigate()

    const [projects, setProjects] = useState([])

    const [currentPage, setCurrentPage] = useState(1)

    const [projectsCount, setProjectsCount] = useState(0)

    useEffect(
        () => getProjectsCount(),
        []
    )

    useEffect(
        () => refreshProjects(),
        [currentPage]
    )

    function refreshProjects() {
        retrieveAllProjectsApi(PageSize, (currentPage - 1) * PageSize)
            .then(response => {
                console.log(response)
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
            <h1>My Projects!</h1>
            {/* {message && <div className="alert alert-warning">{message}</div>} */}
            <div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Description</th>
                            <th>Color</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            projects.map(
                                project => (
                                    <tr key={project.id}>
                                        <td>
                                            <Link to={"/projects/" + project.id + "/tasks"} state={{ project }}>{project.name}</Link>
                                        </td>
                                        <td>{project.description}</td>
                                        <td>{project.color}</td>
                                        <td> <button className="btn btn-success"
                                            onClick={() => updateProject(project.id)}>Update</button> </td>
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
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />

                <div className="btn btn-success m-5" onClick={addNewProject}>Add New Project</div>
            </div>
        </div>
    )
}