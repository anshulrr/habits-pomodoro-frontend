import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { retrieveAllProjects } from "../services/api/ProjectApiService";
import { useAuth } from "../services/auth/AuthContext";

export default function ListProjectsComponent() {

    const authContext = useAuth()

    const username = authContext.username

    const navigate = useNavigate()

    const [projects, setProjects] = useState([])

    // const [message, setMessage] = useState(null)

    useEffect(
        () => refreshProjects(),
        []
    )

    function refreshProjects() {
        retrieveAllProjects()
            .then(response => {
                console.log(response)
                setProjects(response.data)
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
                                            <Link to={"/projects/" + project.id + "/tasks"}>{project.name}</Link>
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
                <div className="btn btn-success m-5" onClick={addNewProject}>Add New Project</div>
            </div>
        </div>
    )
}