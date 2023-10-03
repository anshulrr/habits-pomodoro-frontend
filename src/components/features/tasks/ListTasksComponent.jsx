import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";

import { createPomodoroApi, getRunningPomodoroApi } from "services/api/PomodoroApiService";
import { getTasksCountApi } from "services/api/TaskApiService";

import ListTasksRowsComponent from "components/features/tasks/ListTasksRowsComponent";
import CreateTaskComponent from "components/features/tasks/CreateTaskComponent";
import PomodoroComponent from "components/features/pomodoros/PomodoroComponent";
import StopwatchComponent from "components/features/pomodoros/StopwatchComponent";

export default function ListTasksComponent({
    project,
    tags,
    startDate,
    endDate,
    isReversed,
    title,
    tag,
    setPomodorosListReload
}) {

    const navigate = useNavigate()

    const { state } = useLocation();

    const [tasksCount, setTasksCount] = useState(-1)

    const [currentTasksHeight, setCurrentTasksHeight] = useState(0);
    const [completedTasksHeight, setCompletedTasksHeight] = useState(0);
    const [archivedTasksHeight, setArchivedTasksHeight] = useState(0);

    const [completedTasksCount, setCompletedTasksCount] = useState(0)
    const [showCompleted, setShowCompleted] = useState(false)

    const [archivedTasksCount, setArchivedTasksCount] = useState(0)
    const [showArchived, setShowArchived] = useState(false)

    const [pomodoro, setPomodoro] = useState(null)

    const [pomodoroStatus, setPomodoroStatus] = useState(null)

    const [currentTasksReload, setCurrentTasksReload] = useState(0)
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
        const taskData = {
            status
        }
        if (project) {
            taskData.projectId = project.id;
        } else if (tag) {
            taskData.tagId = tag.id;
        } else {
            taskData.startDate = startDate;
            taskData.endDate = endDate;
        }
        getTasksCountApi(taskData)
            .then(response => {
                setContainer(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function createNewPomodoro(pomodoro_task, task_project, start_again = false) {
        // console.debug(pomodoro_task.id)
        if (pomodoro !== null && !start_again && pomodoroStatus !== 'completed') {
            setMessage('Please finish the already running pomodoro');
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
                    setMessage('Please finish the already running pomodoro');
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

    const refreshAllTaskAndPomodoros = () => {
        setAllTasksReload(prevReload => prevReload + 1)
        setPomodorosListReload(prevReload => prevReload + 1)
        getRunningPomodoro()
    }

    return (
        <div className="">
            <div className="row">

                <div className="col-lg-12 py-3" style={{ backgroundColor: "#e9ecef" }}>

                    <div className="d-flex justify-content-between">
                        <h6>
                            {
                                project &&
                                <span>
                                    <span className="me-1" style={{ color: project.color }}>&#9632;</span>
                                    <span>
                                        {project.name}
                                    </span>
                                </span>
                            }
                            {
                                !project && tag &&
                                <span>
                                    <i className="bi bi-tag-fill me-1" style={{ color: tag.color }}></i>
                                    {tag.name}
                                </span>
                            }
                            {
                                !project && !tag &&
                                <span>
                                    <i className={(title === "Overdue" ? "text-danger " : "") + "px-1 bi bi-calendar-check"} />
                                    {title} Tasks
                                </span>
                            }
                            {
                                tasksCount !== -1 &&
                                <span className="ms-1 badge rounded-pill text-bg-secondary">
                                    {tasksCount}
                                    <i className="ms-1 bi bi-list-ul" />
                                </span>
                            }
                        </h6>
                        {
                            !showCreateTask && project &&
                            <div>
                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-2" onClick={() => setShowCreateTask(!showCreateTask)}>
                                    <i className="bi bi-plus-circle" />
                                </button>
                            </div>
                        }
                    </div>

                    {
                        showCreateTask && project &&
                        <CreateTaskComponent
                            setShowCreateTask={setShowCreateTask}
                            project={project}
                            setCurrentTasksReload={setCurrentTasksReload}
                            setTasksCount={setTasksCount}
                        ></CreateTaskComponent>
                    }

                    <div className="">
                        {
                            tasksCount === 0 &&
                            <div className="alert alert-light py-1 mt-1 small">
                                <i className="pe-1 bi bi-clipboard-data" />
                                Nothing to display
                            </div>
                        }

                        {
                            tasksCount > 0 &&
                            <ListTasksRowsComponent
                                key={[pomodoroStatus, currentTasksReload, allTasksReload]}    // re-render ListTasksComponents for completed pomodoro'
                                status={'added'}
                                tasksCount={tasksCount}
                                project={project}
                                tag={tag}
                                tags={tags}
                                createNewPomodoro={createNewPomodoro}
                                setPomodorosListReload={setPomodorosListReload}
                                setCurrentTasksReload={setCurrentTasksReload}
                                setAllTasksReload={setAllTasksReload}
                                elementHeight={currentTasksHeight}
                                setElementHeight={setCurrentTasksHeight}
                                startDate={startDate}
                                endDate={endDate}
                                isReversed={isReversed}
                            />
                        }

                        <div className="my-1">
                            {
                                completedTasksCount !== 0 &&
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
                                        navigate(`/`, { state, replace: true })
                                    }}>
                                        {!showCompleted && <i className="bi bi-arrow-down" />}
                                        {showCompleted && <i className="bi bi-arrow-up" />}
                                    </button>
                                </div>
                            }

                            {
                                showCompleted && completedTasksCount !== 0 &&
                                <div className="mt-1">
                                    <ListTasksRowsComponent
                                        key={[completedTasksCount, allTasksReload]}
                                        status={'completed'}
                                        tasksCount={completedTasksCount}
                                        project={project}
                                        tags={tags}
                                        createNewPomodoro={createNewPomodoro}
                                        setAllTasksReload={setAllTasksReload}
                                        elementHeight={completedTasksHeight}
                                        setElementHeight={setCompletedTasksHeight}
                                        startDate={startDate}
                                        endDate={endDate}
                                        isReversed={isReversed}
                                    />
                                </div>
                            }
                        </div>

                        <div className="my-1">
                            {
                                archivedTasksCount !== 0 &&
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
                                        navigate(`/`, { state, replace: true })
                                    }}>
                                        {!showArchived && <i className="bi bi-arrow-down" />}
                                        {showArchived && <i className="bi bi-arrow-up" />}
                                    </button>
                                </div>
                            }

                            {
                                showArchived && archivedTasksCount !== 0 &&
                                <div className="mt-1">
                                    <ListTasksRowsComponent
                                        key={[archivedTasksCount, allTasksReload]}
                                        status={'archived'}
                                        tasksCount={archivedTasksCount}
                                        project={project}
                                        tags={tags}
                                        createNewPomodoro={createNewPomodoro}
                                        setAllTasksReload={setAllTasksReload}
                                        elementHeight={archivedTasksHeight}
                                        setElementHeight={setArchivedTasksHeight}
                                        startDate={startDate}
                                        endDate={endDate}
                                        isReversed={isReversed}
                                    />
                                </div>
                            }
                        </div>
                    </div >

                    <div className="d-flex justify-content-between mt-3">
                        {
                            pomodoro !== null &&
                            <small className="text-danger">{message} </small>
                        }

                        {
                            pomodoro === null &&
                            <StopwatchComponent message={'Start a new pomodoro?'} />
                        }
                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => refreshAllTaskAndPomodoros()}>
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
                            setPomodorosListReload={setPomodorosListReload}
                        ></PomodoroComponent>
                    }
                </div>

            </div>

        </div >
    )
}