import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";

import { createPomodoroApi, getRunningPomodoroApi } from "services/api/PomodoroApiService";
import { getTasksCountApi } from "services/api/TaskApiService";

import ListTasksRowsComponent from "components/features/tasks/ListTasksRowsComponent";
import CreateTaskComponent from "components/features/tasks/CreateTaskComponent";
import PomodoroComponent from "components/features/pomodoros/PomodoroComponent";
import StopwatchComponent from "components/features/pomodoros/StopwatchComponent";
import ListPomodorosComponent from "components/stats/ListPomodorosComponent";

export default function ListTasksComponent({ project }) {

    const navigate = useNavigate()

    const { state } = useLocation();

    const [tasksCount, setTasksCount] = useState(0)

    const [currentTasksHeight, setCurrentTasksHeight] = useState(0);
    const [completedTasksHeight, setCompletedTasksHeight] = useState(0);
    const [archivedTasksHeight, setArchivedTasksHeight] = useState(0);

    const [completedTasksCount, setCompletedTasksCount] = useState(0)
    const [showCompleted, setShowCompleted] = useState(false)

    const [archivedTasksCount, setArchivedTasksCount] = useState(0)
    const [showArchived, setShowArchived] = useState(false)

    const [pomodoro, setPomodoro] = useState(null)

    const [pomodoroStatus, setPomodoroStatus] = useState(null)

    const [pomdorosListReload, setPomodorosListReload] = useState(0)
    const [tasksReload, setTasksReload] = useState(0)
    const [allTasksReload, setAllTasksReload] = useState(0)

    const [message, setMessage] = useState('')

    const [showCreateTask, setShowCreateTask] = useState(false)

    useEffect(
        () => {
            // need to set it in useEffect, instead of top level, 
            // complete component won't reload
            // as project is not a key during component call
            setShowCompleted(state.showCompletedTasks || false)
            setShowArchived(state.showArchivedTasks || false)

            // console.debug('re-render ListTasksComponents')
            getTasksCount('added', setTasksCount)
            getTasksCount('archived', setArchivedTasksCount)
            getTasksCount('completed', setCompletedTasksCount)
            if (pomodoro === null) {
                getRunningPomodoro()
            }
        }, [project, allTasksReload] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function getTasksCount(status, setContainer) {
        getTasksCountApi(project.id, status)
            .then(response => {
                setContainer(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function updateTask(id) {
        navigate(`/projects/${project.id}/tasks/${id}`, { state, replace: true })
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

                <div className="col-md-6 pt-3" style={{ backgroundColor: "#e9ecef" }}>

                    <div className="d-flex justify-content-between">
                        <h6>
                            <span className="text-secondary mx-1">
                                <i className="bi bi-folder2" />
                            </span>
                            <span>
                                {project.name}
                            </span>
                            <span className="ms-1 badge rounded-pill text-bg-secondary">
                                {tasksCount}
                                <i className="ms-1 bi bi-list-ul" />
                            </span>
                        </h6>
                        {
                            !showCreateTask &&
                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-1" onClick={() => setShowCreateTask(!showCreateTask)}>
                                <i className="bi bi-plus-circle" />
                            </button>
                        }
                    </div>

                    {
                        showCreateTask &&
                        <CreateTaskComponent
                            setShowCreateTask={setShowCreateTask}
                            project={project}
                            setTasksReload={setTasksReload}
                            setTasksCount={setTasksCount}
                        ></CreateTaskComponent>
                    }

                    {/* fix for x scroll: px-3 */}
                    <div className="px-3">
                        {
                            tasksCount === 0 &&
                            <div className="alert alert-light py-1 mt-1 small">
                                <i className="pe-1 bi bi-clipboard-data" />
                                Nothing to display
                            </div>
                        }

                        {
                            tasksCount !== 0 &&
                            <ListTasksRowsComponent
                                key={[project.id, pomodoroStatus, tasksReload, allTasksReload]}    // re-render ListTasksComponents for completed pomodoro'
                                status={'added'}
                                tasksCount={tasksCount}
                                project={project}
                                createNewPomodoro={createNewPomodoro}
                                updateTask={updateTask}
                                setPomodorosListReload={setPomodorosListReload}
                                setTasksReload={setTasksReload}
                                setAllTasksReload={setAllTasksReload}
                                elementHeight={currentTasksHeight}
                                setElementHeight={setCurrentTasksHeight}
                            />
                        }

                        <div className="my-1">
                            <div className="d-flex justify-content-center">
                                <span className="badge me-1 text-bg-light">
                                    Completed
                                </span>
                                <span className="badge rounded-pill text-bg-secondary">
                                    {completedTasksCount}
                                    <i className="ms-1 bi bi-list-ul" />
                                </span>
                                <button type="button" className="ms-1 btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => {
                                    state.showCompletedTasks = !showCompleted;
                                    setShowCompleted(!showCompleted);
                                    navigate(`/projects`, { state, replace: true })
                                }}>
                                    {!showCompleted && <i className="bi bi-arrow-down" />}
                                    {showCompleted && <i className="bi bi-arrow-up" />}
                                </button>
                            </div>
                            {
                                showCompleted && completedTasksCount !== 0 &&
                                <div className="mt-2 mb-3">
                                    <ListTasksRowsComponent
                                        key={[project.id, completedTasksCount]}
                                        status={'completed'}
                                        tasksCount={completedTasksCount}
                                        project={project}
                                        createNewPomodoro={createNewPomodoro}
                                        updateTask={updateTask}
                                        setTasksReload={setTasksReload}
                                        setAllTasksReload={setAllTasksReload}
                                        elementHeight={completedTasksHeight}
                                        setElementHeight={setCompletedTasksHeight}
                                    />
                                </div>
                            }
                        </div>

                        <div className="my-1">
                            <div className="d-flex justify-content-center">
                                <span className="badge me-1 text-bg-light">
                                    Archived
                                </span>
                                <span className="badge rounded-pill text-bg-secondary">
                                    {archivedTasksCount}
                                    <i className="ms-1 bi bi-list-ul" />
                                </span>
                                <button type="button" className="ms-1 btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => {
                                    state.showArchivedTasks = !showArchived;
                                    setShowArchived(!showArchived);
                                    navigate(`/projects`, { state, replace: true })
                                }}>
                                    {!showArchived && <i className="bi bi-arrow-down" />}
                                    {showArchived && <i className="bi bi-arrow-up" />}
                                </button>
                            </div>

                            {
                                showArchived && archivedTasksCount !== 0 &&
                                <div className="mt-2 mb-3">
                                    <ListTasksRowsComponent
                                        key={[project.id, archivedTasksCount]}
                                        status={'archived'}
                                        tasksCount={archivedTasksCount}
                                        project={project}
                                        createNewPomodoro={createNewPomodoro}
                                        updateTask={updateTask}
                                        setTasksReload={setTasksReload}
                                        setAllTasksReload={setAllTasksReload}
                                        elementHeight={archivedTasksHeight}
                                        setElementHeight={setArchivedTasksHeight}
                                    />
                                </div>
                            }
                        </div>
                    </div >
                </div>

                <div className="col-md-6 mt-3">
                    <div className="d-flex justify-content-between mb-3">
                        <small className="text-danger">{message} </small>
                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-1" onClick={() => getRunningPomodoro()}>
                            <i className="bi bi-arrow-clockwise" />
                        </button>
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

                    <div className="border-top border-1 pt-2 bg-white mt-3 text-start text-secondary">
                        <ListPomodorosComponent
                            key={[pomodoroStatus, pomdorosListReload]}
                        />
                    </div >
                </div>

            </div>

        </div >
    )
}