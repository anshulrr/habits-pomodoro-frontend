import { useEffect, useState } from "react"
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { createPomodoroApi } from "../services/api/PomodoroApiService";
import { retrieveAllTasks } from "../services/api/TaskApiService";
import { useAuth } from "../services/auth/AuthContext";

export default function ListTasksComponent({ project }) {

    const authContext = useAuth()

    const username = authContext.username

    const navigate = useNavigate()

    const [tasks, setTasks] = useState([])

    // const [message, setMessage] = useState(null)

    useEffect(
        () => refreshTasks(),
        [project]
    )

    function refreshTasks() {
        retrieveAllTasks(project.id)
            .then(response => {
                console.log(response)
                setTasks(response.data)
            })
            .catch(response => console.log(response))
    }

    function addNewTask() {
        navigate(`/projects/${project.id}/tasks/-1`, { state: { project } })
    }

    function createNewPomodoro(task) {
        // console.log(task.id)

        const pomodoro = {
            startTime: new Date(),
            // length: 1
        }

        createPomodoroApi(pomodoro, task.id)
            .then(response => {
                // console.log(response)
                navigate(`/tasks/${task.id}/pomodoros/${response.data.id}/${response.data.length}`, { state: { project: project, task } })
            })
            .catch(error => console.log(error))
    }

    return (
        <div>
            <h5>{project.name}</h5>
            {/* {message && <div className="alert alert-warning">{message}</div>} */}
            <div>
                <small>
                    <table className="table table-hover">
                        <tbody>
                            {
                                tasks.map(
                                    task => (
                                        <tr key={task.id}>
                                            <td className="text-start">
                                                <i className="bi bi-play-circle" onClick={() => createNewPomodoro(task)}></i>
                                                <span>
                                                    {' ' + task.description}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                )
                            }
                        </tbody>
                    </table>
                </small>
                <div className="btn btn-success btn-sm my-5" onClick={addNewTask}>Add New Task</div>
            </div>
        </div>
    )
}