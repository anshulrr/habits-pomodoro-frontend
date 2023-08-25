import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "services/auth/AuthContext";
import Pagination from "services/pagination/Pagination";
import { retrieveAllTasksApi } from "services/api/TaskApiService";

import PastPomodoroComponent from "components/features/tasks/PastPomodoroComponent";
import ListCommentsComponent from "components/features/comments/ListCommentsComponents";

export default function ListTasksRowsComponent({
    project,
    status,
    tasksCount,
    createNewPomodoro,
    updateTask,
    setPomodorosListReload,
    setTasksReload
}) {
    const navigate = useNavigate()
    const { state } = useLocation();

    const authContext = useAuth()
    const userSettings = authContext.userSettings

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

    const [showTaskUpdateId, setShowTaskUpdateId] = useState(-1);

    useEffect(
        () => {
            refreshTasks(status)
        }, [currentPage] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshTasks(status) {
        retrieveAllTasksApi(project.id, status, PAGESIZE, (currentPage - 1) * PAGESIZE)
            .then(response => {
                // console.debug(response)
                setTasks(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function timeToDisplay(total_minutes) {
        if (total_minutes < 60) {
            return Math.floor(total_minutes);
        }
        const minutes = Math.floor(total_minutes % 60);
        const hours = Math.floor(total_minutes / 60);
        // console.debug(total, minutes, hours);

        let time_string = '';
        time_string += hours + ':';
        time_string += minutes > 9 ? minutes : '0' + minutes;

        return time_string;
    }

    function updateCommentsData(task) {
        setShowCommentsId(task.id)
        setCommentsTitle(task.description)
    }

    return (
        <>
            {
                tasks.map(
                    task => (
                        <div key={task.id} className="update-list-row decorated-row">
                            <div className="row-content">
                                {
                                    task.status === 'added' &&
                                    <button type="button" className="btn btn-sm btn-outline-success py-0 px-1 me-1 play-button" onClick={() => createNewPomodoro(task, project)}>
                                        <i className="bi bi-play-circle"></i>
                                    </button>
                                }
                                <span className={task.status === 'archived' ? "text-secondary" : ""}>
                                    {task.description}
                                </span>
                            </div>

                            <div className="text-secondary d-flex">
                                {
                                    <span className="small update-list-details">
                                        <span className="badge rounded-pill text-bg-secondary fw-normal">
                                            {timeToDisplay(task.pomodorosTimeElapsed / 60)}
                                            <i className="ps-1 bi bi-clock" />
                                        </span>
                                        <span className="badge rounded-pill text-bg-light fw-normal">
                                            <i className="bi bi-hourglass" />
                                            {timeToDisplay(task.pomodoroLength || project.pomodoroLength || userSettings.pomodoroLength)}
                                        </span>
                                    </span>
                                }
                                {
                                    <span className="update-popup-container">
                                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-0 update-popup-button">
                                            <i className="bi bi-three-dots-vertical" />
                                        </button>
                                        <div className="update-popup text-end">
                                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => updateCommentsData(task)}>
                                                comments <i className="bi bi-chat-right-text" />
                                            </button>
                                            {
                                                task.status === 'added' &&
                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => setShowCreatePastPomodoro(task.id)}>
                                                    Add Past Pomodoro <i className="bi bi-calendar-plus" />
                                                </button>
                                            }
                                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => updateTask(task.id)}>
                                                Update Task <i className="bi bi-pencil-square" />
                                            </button>
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
                        </div>
                    )
                )
            }

            <Pagination
                className="pagination-bar mt-3 ps-0"
                currentPage={currentPage}
                totalCount={tasksCount}
                pageSize={PAGESIZE}
                onPageChange={page => {
                    setCurrentPage(page)
                    status === 'added' && (state.currentTasksPage = page);
                    status === 'completed' && (state.currentCompletedTasksPage = page);
                    status === 'archived' && (state.currentArchivedTasksPage = page);
                    navigate(`/projects`, { state, replace: true })
                }}
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