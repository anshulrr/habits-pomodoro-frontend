import { useEffect, useState } from "react";

import { useAuth } from "../services/auth/AuthContext";
import Pagination from "../services/pagination/Pagination";
import PastPomodoroComponent from "./PastPomodoroComponent";
import { retrieveAllTasksApi } from "../services/api/TaskApiService";
import ListCommentsComponent from "./ListCommentsComponents";

export default function ListTasksRowsComponent({
    project,
    status,
    tasksCount,
    createNewPomodoro,
    updateTask,
    setPomodorosListReload,
}) {
    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const PAGESIZE = window.innerWidth <= 768 ? userSettings.pageTasksCount : 15;

    const [tasks, setTasks] = useState([])

    const [currentPage, setCurrentPage] = useState(1)

    const [showCreatePastPomodoro, setShowCreatePastPomodoro] = useState(-1);

    const [showCommentsId, setShowCommentsId] = useState(-1);
    const [commentsTitle, setCommentsTitle] = useState('')

    useEffect(
        () => {
            refreshTasks(status)
        }, [currentPage]
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
                        <div
                            key={task.id}
                            className="row py-2 task-list-row"
                        >
                            <div className="col text-start">
                                {
                                    task.status === 'added' &&
                                    <i className="p-1 me-1 bi bi-play-circle" onClick={() => createNewPomodoro(task, project)}></i>
                                }
                                <span className={task.status === 'completed' ? "text-secondary" : ""}>
                                    {task.description}
                                </span>
                            </div>

                            <div className="col-3 px-0 text-secondary text-end small text-truncate task-list-details">
                                <span>
                                    <small className="bi bi-clock-fill" />
                                    {timeToDisplay(task.pomodorosTimeElapsed / 60)}
                                </span>
                                <span>
                                    <small className="ms-1 bi bi-hourglass-top" />
                                    {timeToDisplay(task.pomodoroLength || project.pomodoroLength || userSettings.pomodoroLength)}
                                </span>
                            </div>
                            <div className="col-4 px-0 text-secondary text-end task-list-buttons">
                                <i className="p-1 me-1 bi bi-chat-right-text" onClick={() => updateCommentsData(task)} />

                                {
                                    task.status === 'added' &&
                                    <i className="p-1 me-1 bi bi-calendar-plus" onClick={() => setShowCreatePastPomodoro(task.id)}></i>
                                }
                                <i className="p-1 bi bi-pencil-square" onClick={() => updateTask(task.id)}></i>
                            </div>
                            {
                                task.status === 'added' &&
                                <PastPomodoroComponent
                                    showCreatePastPomodoro={showCreatePastPomodoro}
                                    setShowCreatePastPomodoro={setShowCreatePastPomodoro}
                                    task={task}
                                    project={project}
                                    setPomodorosListReload={setPomodorosListReload}
                                />
                            }
                        </div>
                    )
                )
            }

            <Pagination
                className="pagination-bar mt-3"
                currentPage={currentPage}
                totalCount={tasksCount}
                pageSize={PAGESIZE}
                onPageChange={page => setCurrentPage(page)}
            />

            {
                showCommentsId !== -1 &&
                <div className="comments-overlay">
                    <div className="comments-popup">
                        <div className="text-end p-3">
                            <i className="bi bi-x-lg" onClick={() => setShowCommentsId(-1)}></i>
                        </div>
                        <ListCommentsComponent
                            filterBy={'task'}
                            id={showCommentsId}
                            title={commentsTitle}
                        />
                    </div>
                </div>
            }
        </>
    )
}