import { useEffect, useState } from "react"
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { createPomodoroApi } from "../services/api/PomodoroApiService";
import { retrieveAllTasks } from "../services/api/TaskApiService";
import { useAuth } from "../services/auth/AuthContext";

export default function ListTasksComponent() {

    const { project_id } = useParams()

    const { state } = useLocation();
    // console.log(useLocation());

    const authContext = useAuth()

    const username = authContext.username

    const navigate = useNavigate()

    const [tasks, setTasks] = useState([])

    // const [message, setMessage] = useState(null)

    useEffect(
        () => refreshTasks(),
        []
    )

    function refreshTasks() {
        retrieveAllTasks(project_id)
            .then(response => {
                console.log(response)
                setTasks(response.data)
            })
            .catch(response => console.log(response))
    }

    function addNewTask() {
        navigate(`/projects/${project_id}/tasks/-1`, { state })
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
                navigate(`/tasks/${task.id}/pomodoros/${response.data.id}/${response.data.length}`, { state: { project: state.project, task } })
            })
            .catch(error => console.log(error))
    }

    return (
        <div className="container">
            <h1>{state.project.name}</h1>
            {/* {message && <div className="alert alert-warning">{message}</div>} */}
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Tasks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tasks.map(
                                task => (
                                    <tr key={task.id}>
                                        <td className="text-start">
                                            <i className="bi bi-play-circle" onClick={() => createNewPomodoro(task)}></i>
                                            {' ' + task.description}
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>

                </table>
                <div className="btn btn-success m-5" onClick={addNewTask}>Add New Task</div>
            </div>
        </div>
    )
}