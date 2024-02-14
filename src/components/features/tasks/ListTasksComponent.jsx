import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";

import { createPomodoroApi } from "services/api/PomodoroApiService";
import { getTasksCountApi } from "services/api/TaskApiService";

import ListTasksRowsComponent from "components/features/tasks/ListTasksRowsComponent";
import CreateTaskComponent from "components/features/tasks/CreateTaskComponent";
import PomodoroComponent from "components/features/pomodoros/PomodoroComponent";
import ListCommentsComponent from "components/features/comments/ListCommentsComponent";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export default function ListTasksComponent({
    project,
    projects,
    tags,
    startDate,
    endDate,
    searchString,
    isReversed,
    title,
    tag,
    setPomodorosListReload,
    pomodoro,
    setPomodoro
}) {

    const navigate = useNavigate()

    const { state } = useLocation();

    const [tasksCount, setTasksCount] = useState(-1)

    const [currentTasksHeight, setCurrentTasksHeight] = useState(0);
    const [archivedTasksHeight, setArchivedTasksHeight] = useState(0);

    const [archivedTasksCount, setArchivedTasksCount] = useState(0)
    const [showArchived, setShowArchived] = useState(false)

    const [pomodoroStatus, setPomodoroStatus] = useState(null)

    const [currentTasksReload, setCurrentTasksReload] = useState(0)
    const [archivedTasksReload, setArchivedTasksReload] = useState(0)
    const [allTasksReload, setAllTasksReload] = useState(0)

    const [message, setMessage] = useState('')

    const [showCreateTask, setShowCreateTask] = useState(true)

    const [showProjectCommentsId, setShowProjectCommentsId] = useState(-1);

    useEffect(
        () => {
            // need to set it in useEffect, instead of top level, 
            // complete component won't reload
            // as project is not a key during component call
            setShowArchived(state.showArchivedTasks || false)

            // console.debug('re-render ListTasksComponents')
            getTasksCount('current', setTasksCount)
            getTasksCount('archived', setArchivedTasksCount)
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
        } else if (startDate) {
            taskData.startDate = startDate;
            taskData.endDate = endDate;
        } else {
            taskData.searchString = searchString;
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

    const updateProject = (id) => {
        navigate(`/projects/${id}`, { state })
    }

    return (
        <div className="">
            <div className="row">

                <div className="col-lg-12 py-3">

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
                                !project && !tag && startDate &&
                                <span>
                                    <i className={(title === "Overdue" ? "text-danger " : "") + "px-1 bi bi-calendar2-event"} />
                                    {title} Tasks
                                </span>
                            }
                            {
                                !project && !tag && !startDate &&
                                <span>
                                    <i className="px-1 bi bi-search" />
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
                            {
                                project &&
                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 ms-1" onClick={() => updateProject(project.id)}>
                                    <i className="bi bi-pencil-square" />
                                </button>
                            }
                            {
                                project &&
                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 ms-1" onClick={() => setShowProjectCommentsId(project.id)}>
                                    <i className="bi bi-journal-text" />
                                </button>
                            }
                        </h6>
                        <div>
                            {
                                project && !showCreateTask &&
                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-2" onClick={() => setShowCreateTask(!showCreateTask)}>
                                    <i className="bi bi-plus-circle" />
                                </button>
                            }
                        </div>
                    </div>

                    {
                        showProjectCommentsId !== -1 &&
                        <div className="comments-overlay">
                            <div className="comments-popup">
                                <div className="close-popup m-2">
                                    <i className="p-1 bi bi-x-lg" onClick={() => setShowProjectCommentsId(-1)}></i>
                                </div>
                                <div className="container mt-4">
                                    {
                                        (project.description &&
                                            <div className="text-start">
                                                <div className="small text-secondary">
                                                    Project Description
                                                </div>
                                                <div className="border rounded text-wrap px-2 py-1 small comments-list-card comments-markdown">
                                                    <ReactMarkdown
                                                        children={project.description}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }
                                    <ListCommentsComponent
                                        filterBy={'project'}
                                        id={showProjectCommentsId}
                                    />
                                </div >
                            </div>
                        </div>
                    }

                    {
                        showCreateTask && project &&
                        <CreateTaskComponent
                            setShowCreateTask={setShowCreateTask}
                            project={project}
                            setTasksReload={setCurrentTasksReload}
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
                                status={'current'}
                                tasksCount={tasksCount}
                                project={project}
                                tag={tag}
                                tags={tags}
                                projects={projects}
                                createNewPomodoro={createNewPomodoro}
                                setPomodorosListReload={setPomodorosListReload}
                                setTasksReload={setCurrentTasksReload}
                                setAllTasksReload={setAllTasksReload}
                                elementHeight={currentTasksHeight}
                                setElementHeight={setCurrentTasksHeight}
                                startDate={startDate}
                                endDate={endDate}
                                searchString={searchString}
                                isReversed={isReversed}
                            />
                        }

                        <div className="my-1">
                            {
                                archivedTasksCount !== 0 &&
                                <div className="d-flex justify-content-center">
                                    <div
                                        onClick={() => {
                                            state.showArchivedTasks = !showArchived;
                                            setShowArchived(!showArchived);
                                            navigate(`/`, { state, replace: true })
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <span className="badge text-bg-light">
                                            Archived
                                            <span className="text-secondary ps-1" >
                                                {!showArchived && <i className="bi bi-chevron-down" />}
                                                {showArchived && <i className="bi bi-chevron-left" />}
                                            </span>
                                        </span>
                                        <span className="badge rounded-pill text-bg-secondary">
                                            {archivedTasksCount}
                                            <i className="ms-1 bi bi-list-ul" />
                                        </span>
                                    </div>
                                </div>
                            }

                            {
                                showArchived && archivedTasksCount !== 0 &&
                                <div className="mt-1">
                                    <ListTasksRowsComponent
                                        key={[archivedTasksCount, archivedTasksReload, allTasksReload]}
                                        status={'archived'}
                                        tasksCount={archivedTasksCount}
                                        project={project}
                                        tag={tag}
                                        tags={tags}
                                        projects={projects}
                                        createNewPomodoro={createNewPomodoro}
                                        setTasksReload={setArchivedTasksReload}
                                        setAllTasksReload={setAllTasksReload}
                                        elementHeight={archivedTasksHeight}
                                        setElementHeight={setArchivedTasksHeight}
                                        startDate={startDate}
                                        endDate={endDate}
                                        searchString={searchString}
                                        isReversed={isReversed}
                                    />
                                </div>
                            }
                        </div>
                    </div >

                    <div className="d-flex justify-content-around">
                        {
                            pomodoro !== null && message &&
                            <div className="alert alert-danger mt-3 mb-1 py-0 px-2 small">{message}</div>
                        }
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