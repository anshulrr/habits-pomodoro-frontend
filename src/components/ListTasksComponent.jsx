import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { createPomodoroApi } from "../services/api/PomodoroApiService";
import { getRunningPomodoroApi } from '../services/api/PomodoroApiService';
import { retrieveAllTasks } from "../services/api/TaskApiService";
import ListTasksRowsComponent from "./ListTasksRowsComponent";
import PomodoroComponent from "./PomodoroComponent";
import StopwatchComponent from "./StopwatchComponent";
import ListPomodorosComponent from "./ListPomodorosComponent";

export default function ListTasksComponent({ project }) {

    const navigate = useNavigate()

    const [tasks, setTasks] = useState([])

    const [completedTasks, setCompletedTasks] = useState([])
    const [showCompleted, setShowCompleted] = useState(false)

    const [archivedTasks, setArchivedTasks] = useState([])
    const [showArchived, setShowArchived] = useState(false)

    const [pomodoro, setPomodoro] = useState(null)

    const [pomodoroStatus, setPomodoroStatus] = useState(null)

    const [message, setMessage] = useState('')

    useEffect(
        () => {
            // console.debug('re-render ListTasksComponents')
            refreshTasks('added', setTasks)
            refreshTasks('archived', setArchivedTasks)
            refreshTasks('completed', setCompletedTasks)
            if (pomodoro === null) {
                getRunningPomodoro()
            }
        }, [project] // eslint-disable-line react-hooks/exhaustive-deps
    )

    useEffect(
        // need to rerender tasks list after completion of tasks to update pomodorosTimeElapsed
        () => {
            if (pomodoroStatus === 'completed') {
                // console.debug('re-render ListTasksComponents for completed pomodoro')
                refreshTasks('added', setTasks)
            }
        }, [pomodoroStatus] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshTasks(status, setContainer) {
        retrieveAllTasks(project.id, status)
            .then(response => {
                // console.debug(response)
                setContainer(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function updateTask(id) {
        navigate(`/projects/${project.id}/tasks/${id}`, { state: { project } })
    }

    function addNewTask() {
        navigate(`/projects/${project.id}/tasks/-1`, { state: { project } })
    }

    function createNewPomodoro(pomodoro_task, task_project, start_again = false) {
        // console.debug(pomodoro_task.id)
        if (pomodoro !== null && !start_again && pomodoroStatus != 'completed') {
            setMessage('Please complete the already running pomodoro');
            return;
        }
        // if break is running, first remove the component
        setPomodoro(null);

        const pomodoro_data = {
            startTime: new Date(),
            // length: 1
        }

        createPomodoroApi(pomodoro_data, pomodoro_task.id)
            .then(response => {
                // console.debug(response)
                pomodoro_task.project = task_project
                response.data.task = pomodoro_task
                // console.debug(response.data)
                setPomodoro(response.data)
                setPomodoroStatus('started')
                setMessage('')
                // navigate(`/tasks/${task.id}/pomodoros/${response.data.id}/${response.data.length}`, { state: { project: project, task } })
            })
            .catch(error => {
                console.error(error.message)
                if (error.response && error.response.status === 405) {
                    setMessage('Please complete the already running pomodoro');
                    // getRunningPomodoro();    // atomation is a bit confusing for user
                }
            })
    }

    const getRunningPomodoro = () => {
        // first unload the timer component
        setPomodoro(null);
        getRunningPomodoroApi()
            .then(response => {
                // console.debug(response)
                if (response.status === 204) {
                    setMessage('No running pomodoro');
                    return;
                }
                const running_pomodoro = response.data;
                running_pomodoro.task = response.data.task;
                running_pomodoro.task.project = response.data.project;
                setPomodoro(running_pomodoro);
                setMessage('');
            })
            .catch(error => {
                console.error(error.message)
            })
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-11">
                    <h6>{project.name} ({tasks.length})</h6>
                </div>
                <div className="col-1 text-end">
                    <i className="bi bi-plus-circle" onClick={addNewTask}></i>
                </div>
            </div>
            {/* fix for x scroll: px-3 */}
            <div className="overflow-scroll bg-white px-3" style={{ maxHeight: "25vh" }}>
                {
                    tasks.length === 0 &&
                    <div className="alert alert-warning">No task is added to this project</div>
                }
                <ListTasksRowsComponent
                    key={tasks}
                    tasks={tasks}
                    project={project}
                    createNewPomodoro={createNewPomodoro}
                    updateTask={updateTask}
                />

                <div>
                    <span className="badge text-bg-light mt-3" style={{ cursor: "pointer" }} onClick={() => setShowArchived(!showArchived)}>
                        {!showArchived && <span>Show Archived Tasks ({archivedTasks.length})<i className="bi bi-arrow-down"></i></span>}
                        {showArchived && <span>Hide Archived Tasks ({archivedTasks.length})<i className="bi bi-arrow-up"></i></span>}
                    </span>
                    <small>
                        {
                            showArchived &&
                            <ListTasksRowsComponent
                                key={archivedTasks}
                                tasks={archivedTasks}
                                project={project}
                                createNewPomodoro={createNewPomodoro}
                                updateTask={updateTask}
                            />
                        }
                    </small>
                </div>

                <div>
                    <span className="badge text-bg-light mt-3" style={{ cursor: "pointer" }} onClick={() => setShowCompleted(!showCompleted)}>
                        {!showCompleted && <span>Show Completed Tasks ({completedTasks.length})<i className="bi bi-arrow-down"></i></span>}
                        {showCompleted && <span>Hide Completed Tasks ({completedTasks.length})<i className="bi bi-arrow-up"></i></span>}
                    </span>
                    <small>
                        {
                            showCompleted &&
                            <ListTasksRowsComponent
                                key={completedTasks}
                                tasks={completedTasks}
                                project={project}
                                createNewPomodoro={createNewPomodoro}
                                updateTask={updateTask}
                            />
                        }
                    </small>
                </div>
            </div >

            <div className="row my-3">
                <div className="col-11 text-start">
                    <small className="text-danger">{message} </small>
                </div>
                <div className="col-1 text-end">
                    <i className="bi bi-arrow-clockwise" onClick={() => getRunningPomodoro()}></i>
                </div>
            </div>

            {
                pomodoro !== null &&
                <PomodoroComponent
                    pomodoro={pomodoro}
                    setPomodoro={setPomodoro}
                    setPomodoroStatus={setPomodoroStatus}
                    createNewPomodoro={createNewPomodoro}
                    setTasksMessage={setMessage}
                ></PomodoroComponent>
            }

            {
                pomodoro === null &&
                <StopwatchComponent message={'Start a new task'} />
            }

            <div className="overflow-scroll bg-white mt-3 px-3" style={{ maxHeight: "25vh" }}>
                <ListPomodorosComponent
                    key={pomodoroStatus}
                />
            </div >

        </div >
    )
}