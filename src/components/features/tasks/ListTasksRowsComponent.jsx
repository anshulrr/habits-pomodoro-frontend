import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "services/auth/AuthContext";
import Pagination from "services/pagination/Pagination";
import { retrieveAllTasksApi, updateTaskApi } from "services/api/TaskApiService";
import { timeToDisplay } from "services/helpers/listsHelper";

import PastPomodoroComponent from "components/features/tasks/PastPomodoroComponent";
import ListCommentsComponent from "components/features/comments/ListCommentsComponents";

export default function ListTasksRowsComponent({
    project,
    status,
    tasksCount,
    createNewPomodoro,
    updateTask,
    setPomodorosListReload,
    setTasksReload,
    setAllTasksReload,
    elementHeight,
    setElementHeight,
}) {
    const navigate = useNavigate()
    const { state } = useLocation();

    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const tasksListElement = useRef(null);

    const PAGESIZE = userSettings.pageTasksCount;

    const [tasks, setTasks] = useState([])

    const [currentPage, setCurrentPage] = useState(
        (status === 'added' && state.currentTasksPage) ||
        (status === 'completed' && state.currentCompletedTasksPage) ||
        (status === 'archived' && state.currentArchivedTasksPage) ||
        1
    )

    const [showCreatePastPomodoro, setShowCreatePastPomodoro] = useState(-1);

    const [showCommentsId, setShowCommentsId] = useState(-1);
    const [commentsTitle, setCommentsTitle] = useState('')

    useEffect(
        () => {
            refreshTasks(status)
        }, [currentPage] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshTasks(status) {
        setTasks([]);
        retrieveAllTasksApi(project.id, status, PAGESIZE, (currentPage - 1) * PAGESIZE)
            .then(response => {
                // console.debug(response)
                setTasks(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function updateCommentsPopupData(task) {
        setShowCommentsId(task.id)
        setCommentsTitle(task.description)
    }

    function onUpdateTaskStatus(task, status) {
        setElementHeight(tasksListElement.current.offsetHeight)

        let statusString = status === 'added' ? 'current' : status;
        if (!window.confirm(`Press OK to mark task as ${statusString}.`)) {
            return;
        }
        task.status = status;

        updateTaskApi(project.id, task.id, task)
            .then(() => {
                setAllTasksReload(prevReload => prevReload + 1)
            })
            .catch(error => console.error(error.message))
    }

    function onCreatePastPomodoro(task) {
        setElementHeight(tasksListElement.current.offsetHeight)
        setShowCreatePastPomodoro(task.id)
    }

    function updateOnPageChange(page) {
        setElementHeight(tasksListElement.current.offsetHeight)
        setCurrentPage(page)
        status === 'added' && (state.currentTasksPage = page);
        status === 'completed' && (state.currentCompletedTasksPage = page);
        status === 'archived' && (state.currentArchivedTasksPage = page);
        navigate(`/projects`, { state, replace: true })
    }

    function onCreateNewPomodoro(task) {
        setElementHeight(tasksListElement.current.offsetHeight)
        createNewPomodoro(task, project)
    }

    return (
        <>
            {
                tasks.length === 0 &&
                <div className="loader-container" style={{ height: elementHeight }}>
                    <div className="loader"></div>
                </div>
            }
            <div id="tasks-list" ref={tasksListElement}>
                {
                    tasks.map(
                        task => (
                            <div key={task.id} className="row py-2 update-list-row">
                                {
                                    task.status === 'added' &&
                                    <div className="px-0 col-1 text-start">
                                        <button type="button" className="btn btn-sm btn-outline-success py-0 px-1" onClick={() => onCreateNewPomodoro(task)}>
                                            <i className="bi bi-play-circle"></i>
                                        </button>
                                    </div>
                                }
                                <div className="px-0 col text-start">

                                    <div className={(task.status === 'archived' ? "text-secondary" : "") + " description"}>
                                        {task.description}
                                    </div>
                                    <div className="subscript text-secondary">
                                        <span>
                                            <i className="bi bi-hourglass" />
                                            {timeToDisplay(task.pomodoroLength || project.pomodoroLength || userSettings.pomodoroLength)}
                                        </span>
                                        <span>
                                            <i className="ps-1 bi bi-clock" style={{ paddingRight: "0.1rem" }} />
                                            {timeToDisplay(task.pomodorosTimeElapsed / 60)}
                                        </span>
                                    </div>
                                </div>

                                <div className="px-0 col-1 text-secondary text-end">
                                    {
                                        <span className="update-popup-container">
                                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-0 update-popup-button">
                                                <i className="bi bi-three-dots-vertical" />
                                            </button>
                                            <div className="update-popup">
                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => updateCommentsPopupData(task)}>
                                                    Comments <i className="bi bi-chat-right-text" />
                                                </button>
                                                {
                                                    task.status === 'added' &&
                                                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => onCreatePastPomodoro(task)}>
                                                        Add past Pomodoro <i className="bi bi-calendar-plus" />
                                                    </button>
                                                }
                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => updateTask(task.id)}>
                                                    Update Task <i className="bi bi-pencil-square" />
                                                </button>

                                                {
                                                    task.status !== 'added' &&
                                                    < button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => onUpdateTaskStatus(task, 'added')}>
                                                        Mark as current <i className="bi bi-check2-circle" />
                                                    </button>
                                                }
                                                {
                                                    task.status !== 'completed' &&
                                                    < button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => onUpdateTaskStatus(task, 'completed')}>
                                                        Mark as completed <i className="bi bi-check2-circle" />
                                                    </button>
                                                }
                                                {
                                                    task.status !== 'archived' &&
                                                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => onUpdateTaskStatus(task, 'archived')}>
                                                        Mark as archived <i className="bi bi-archive" />
                                                    </button>
                                                }
                                            </div>
                                        </span>
                                    }
                                </div>

                                {
                                    task.status === 'added' &&
                                    <PastPomodoroComponent
                                        showCreatePastPomodoro={showCreatePastPomodoro}
                                        setShowCreatePastPomodoro={setShowCreatePastPomodoro}
                                        task={task}
                                        project={project}
                                        setPomodorosListReload={setPomodorosListReload}
                                        setTasksReload={setTasksReload}
                                    />
                                }
                            </div >
                        )
                    )
                }
            </div>

            <Pagination
                className="pagination-bar mt-3 ps-0"
                currentPage={currentPage}
                totalCount={tasksCount}
                pageSize={PAGESIZE}
                onPageChange={page => updateOnPageChange(page)}
            />

            {
                showCommentsId !== -1 &&
                <ListCommentsComponent
                    filterBy={'task'}
                    id={showCommentsId}
                    title={commentsTitle}
                    setShowCommentsId={setShowCommentsId}
                />
            }
        </>
    )
}