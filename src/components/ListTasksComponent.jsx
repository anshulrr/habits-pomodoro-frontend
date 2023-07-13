import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { createPomodoroApi } from "../services/api/PomodoroApiService";
import { getRunningPomodoroApi } from '../services/api/PomodoroApiService';
import { retrieveAllTasks } from "../services/api/TaskApiService";
import PomodoroComponent from "./PomodoroComponent";

export default function ListTasksComponent({ project }) {

    // const authContext = useAuth()

    // const username = authContext.username

    const navigate = useNavigate()

    const [tasks, setTasks] = useState([])

    const [pomodoro, setPomodoro] = useState(null)

    const [message, setMessage] = useState('')

    useEffect(
        () => {
            // console.log('re-render ListTasksComponents')
            refreshTasks()
        }, [project] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshTasks() {
        retrieveAllTasks(project.id)
            .then(response => {
                // console.log(response)
                setTasks(response.data)
            })
            .catch(response => console.log(response))
    }

    function addNewTask() {
        navigate(`/projects/${project.id}/tasks/-1`, { state: { project } })
    }

    function createNewPomodoro(task) {
        // console.log(task.id)

        if (pomodoro !== null) {
            setMessage('Please complete the already running pomodoro');
            return;
        }

        const pomodoro_data = {
            startTime: new Date(),
            // length: 1
        }

        createPomodoroApi(pomodoro_data, task.id)
            .then(response => {
                // console.log(response)
                task.project = project
                response.data.task = task
                // console.log(response.data)
                setPomodoro(response.data)
                setMessage('')
                // navigate(`/tasks/${task.id}/pomodoros/${response.data.id}/${response.data.length}`, { state: { project: project, task } })
            })
            .catch(error => {
                console.error('error: ', error, error.response)
                if (error.response && error.response.status === 400) {
                    setMessage('Please complete the already running pomodoro');
                }
            })
    }

    const getRunningPomodoro = () => {
        // first unload the timer component
        setPomodoro(null);
        getRunningPomodoroApi()
            .then(response => {
                // console.log(response)
                const running_pomodoro = response.data;
                running_pomodoro.task = response.data.task;
                running_pomodoro.task.project = response.data.project;
                setPomodoro(running_pomodoro);
                setMessage('');
            })
            .catch(error => {
                console.error('error: ', error, error.response)
                if (error.response && error.response.status === 400) {
                    setMessage('No running pomodoro');
                }
            })
    }

    return (
        <div>
            <h5>{project.name}</h5>
            <div>
                <small>
                    {
                        tasks.length === 0 &&
                        <div className="alert alert-warning">No task is added to this project</div>
                    }
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

                <div>
                    <small className="text-danger">{message} </small>
                    <i className="bi bi-arrow-clockwise" onClick={() => getRunningPomodoro()}></i>
                </div>

                <div className="btn btn-outline-success btn-sm my-2" onClick={addNewTask}>Add New Task</div>
            </div>

            {
                pomodoro !== null &&
                <PomodoroComponent
                    pomodoro={pomodoro}
                    setPomodoro={setPomodoro}
                    createNewPomodoro={createNewPomodoro}
                    setTasksMessage={setMessage}
                ></PomodoroComponent>
            }
        </div>
    )
}