import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { createPomodoroApi, getRunningPomodoroApi } from "../services/api/PomodoroApiService";
import { getTasksCountApi } from "../services/api/TaskApiService";
import ListTasksRowsComponent from "./ListTasksRowsComponent";
import PomodoroComponent from "./PomodoroComponent";
import StopwatchComponent from "./StopwatchComponent";
import ListPomodorosComponent from "./ListPomodorosComponent";

export default function ListTasksComponent({ project }) {

    const navigate = useNavigate()

    const [tasksCount, setTasksCount] = useState(0)

    const [completedTasksCount, setCompletedTasksCount] = useState(0)
    const [showCompleted, setShowCompleted] = useState(false)

    const [archivedTasksCount, setArchivedTasksCount] = useState(0)
    const [showArchived, setShowArchived] = useState(false)

    const [pomodoro, setPomodoro] = useState(null)

    const [pomodoroStatus, setPomodoroStatus] = useState(null)

    const [pomdorosListReload, setPomodorosListReload] = useState(0)

    const [message, setMessage] = useState('')

    useEffect(
        () => {
            // console.debug('re-render ListTasksComponents')
            getTasksCount('added', setTasksCount)
            getTasksCount('archived', setArchivedTasksCount)
            getTasksCount('completed', setCompletedTasksCount)
            if (pomodoro === null) {
                getRunningPomodoro()
            }
        }, [project] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function getTasksCount(status, setContainer) {
        getTasksCountApi(project.id, status)
            .then(response => {
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
        if (pomodoro !== null && !start_again && pomodoroStatus !== 'completed') {
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
        <div className="">
            <div className="row">

                <div className="col-md-6 mt-3 border-bottom border-2">
                    <div className="row">
                        <div className="col-11">
                            <h6>
                                <span className="me-1 badge rounded-pill text-bg-secondary">
                                    <span className="bi bi-folder-plus" />
                                </span>
                                <span>
                                    {project.name}
                                </span>
                                <small className="ms-1 badge rounded-pill text-bg-secondary">
                                    {tasksCount}
                                    <small className="ms-1 bi bi-list-ul" />
                                </small>
                            </h6>
                        </div>
                        <div className="col-1 px-0 text-end">
                            <i className="p-1 bi bi-plus-circle" onClick={addNewTask}></i>
                        </div>
                    </div>
                    {/* fix for x scroll: px-3 */}
                    <div className="overflow-scroll bg-white px-3" style={{ maxHeight: "85vh" }}>
                        {
                            tasksCount === 0 &&
                            <div className="alert alert-warning">No task is added to this project</div>
                        }
                        {
                            tasksCount !== 0 &&
                            <ListTasksRowsComponent
                                key={[project.id, pomodoroStatus]}    // re-render ListTasksComponents for completed pomodoro'
                                status={'added'}
                                tasksCount={tasksCount}
                                project={project}
                                createNewPomodoro={createNewPomodoro}
                                updateTask={updateTask}
                                setPomodorosListReload={setPomodorosListReload}
                            />
                        }

                        <div className="mt-3">
                            <span className="badge text-bg-light" style={{ cursor: "pointer" }} onClick={() => setShowArchived(!showArchived)}>
                                Archived
                                <span className="ms-1 badge rounded-pill text-bg-secondary">
                                    {archivedTasksCount}
                                    <span className="ms-1 bi bi-list-ul" />
                                </span>
                                {!showArchived && <i className="bi bi-arrow-down" />}
                                {showArchived && <i className="bi bi-arrow-up" />}
                            </span>
                            <small>
                                {
                                    showArchived && archivedTasksCount !== 0 &&
                                    <ListTasksRowsComponent
                                        key={project.id}
                                        status={'archived'}
                                        tasksCount={archivedTasksCount}
                                        project={project}
                                        createNewPomodoro={createNewPomodoro}
                                        updateTask={updateTask}
                                    />
                                }
                            </small>
                        </div>

                        <div className="mt-3">
                            <span className="badge text-bg-light" style={{ cursor: "pointer" }} onClick={() => setShowCompleted(!showCompleted)}>
                                Completed
                                <span className="ms-1 badge rounded-pill text-bg-secondary">
                                    {completedTasksCount}
                                    <span className="ms-1 bi bi-list-ul" />
                                </span>
                                {!showCompleted && <i className="bi bi-arrow-down" />}
                                {showCompleted && <i className="bi bi-arrow-up" />}
                            </span>
                            <small>
                                {
                                    showCompleted && completedTasksCount !== 0 &&
                                    <ListTasksRowsComponent
                                        key={project.id}
                                        status={'completed'}
                                        tasksCount={completedTasksCount}
                                        project={project}
                                        createNewPomodoro={createNewPomodoro}
                                        updateTask={updateTask}
                                    />
                                }
                            </small>
                        </div>
                    </div >
                </div>

                <div className="col-md-6 mt-3 border-bottom border-2">
                    <div className="row mb-3">
                        <div className="col-11 text-start">
                            <small className="text-danger">{message} </small>
                        </div>
                        <div className="col-1 px-0 text-end">
                            <i className="p-1 bi bi-arrow-clockwise" onClick={() => getRunningPomodoro()}></i>
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

                    <div className="border-top border-1 pt-2 overflow-scroll bg-white mt-3 px-3" style={{ maxHeight: "55vh" }}>
                        <ListPomodorosComponent
                            key={[pomodoroStatus, pomdorosListReload]}
                            setPomodorosListReload={setPomodorosListReload}
                        />
                    </div >
                </div>

            </div>

        </div >
    )
}