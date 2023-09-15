import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import moment from "moment";

import { useAuth } from "services/auth/AuthContext";
import Pagination from "services/pagination/Pagination";
import { retrieveAllTasksApi, updateTaskApi } from "services/api/TaskApiService";
import { timeToDisplay } from "services/helpers/listsHelper";

import PastPomodoroComponent from "components/features/tasks/PastPomodoroComponent";
import ListCommentsComponent from "components/features/comments/ListCommentsComponents";
import OutsideAlerter from "services/hooks/OutsideAlerter";
import UpdateTaskComponent from "components/features/tasks/UpdateTaskComponent";
import TaskDueDateComponent from "./TaskDueDateComponent";

export default function ListTasksRowsComponent({
    project,
    status,
    tasksCount,
    createNewPomodoro,
    setPomodorosListReload,
    setCurrentTasksReload,
    setAllTasksReload,
    elementHeight,
    setElementHeight,
    startDate,
    endDate,
    isReversed
}) {
    const navigate = useNavigate()
    const { state } = useLocation();

    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const [showUpdatePopupId, setShowUpdatePopupId] = useState(-1);

    const listElement = useRef(null);

    const PAGESIZE = userSettings.pageTasksCount;

    const [tasks, setTasks] = useState([])

    const [currentPage, setCurrentPage] = useState(
        (status === 'added' && state.currentTasksPage) ||
        (status === 'completed' && state.currentCompletedTasksPage) ||
        (status === 'archived' && state.currentArchivedTasksPage) ||
        1
    )

    const [showCreatePastPomodoro, setShowCreatePastPomodoro] = useState(-1);
    const [showUpdateDueDate, setShowUpdateDueDate] = useState(-1);

    const [showUpdateTaskId, setShowUpdateTaskId] = useState(-1)

    const [showCommentsId, setShowCommentsId] = useState(-1);
    const [commentsTitle, setCommentsTitle] = useState('')

    useEffect(
        () => {
            const observer = new ResizeObserver(handleResize);
            observer.observe(listElement.current);
            return () => {
                // Cleanup the observer by unobserving all elements
                observer.disconnect();
            };
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    useEffect(
        () => {
            refreshTasks(status);
        }, [currentPage] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const handleResize = () => {
        if (listElement.current !== null && listElement.current.offsetHeight !== 0) {
            // console.debug(currentPage, listElement.current.offsetHeight);
            setElementHeight(listElement.current.offsetHeight);
        }
    };

    function refreshTasks(status) {
        setTasks([]);
        const taskData = {
            status,
            limit: PAGESIZE,
            offset: (currentPage - 1) * PAGESIZE
        }
        if (project) {
            taskData.projectId = project.id;
        } else {
            taskData.startDate = startDate;
            taskData.endDate = endDate;
        }
        retrieveAllTasksApi(taskData)
            .then(response => {
                // console.debug(response)
                if (isReversed) {
                    setTasks(response.data.toReversed())
                } else {
                    setTasks(response.data)
                }
            })
            .catch(error => console.error(error.message))
    }

    function updateCommentsPopupData(task) {
        setShowCommentsId(task.id)
        setCommentsTitle(task.description)
    }

    function onUpdateTaskStatus(task, status) {
        // setElementHeight(listElement.current.offsetHeight)

        let statusString = status === 'added' ? 'current' : status;
        if (!window.confirm(`Press OK to mark task as ${statusString}.`)) {
            return;
        }
        task.status = status;

        updateTaskApi({ id: task.id, task })
            .then(() => {
                setAllTasksReload(prevReload => prevReload + 1)
            })
            .catch(error => console.error(error.message))
    }

    function onCreatePastPomodoro(task) {
        setShowUpdateDueDate(-1)
        setShowUpdatePopupId(-1);
        // setElementHeight(listElement.current.offsetHeight);
        setShowCreatePastPomodoro(task.id);
    }

    function onUpdateDueDate(task) {
        setShowCreatePastPomodoro(-1)
        setShowUpdatePopupId(-1);
        // setElementHeight(listElement.current.offsetHeight);
        setShowUpdateDueDate(task.id);
    }

    function updateOnPageChange(page) {
        // setElementHeight(listElement.current.offsetHeight)
        setCurrentPage(page)
        status === 'added' && (state.currentTasksPage = page);
        status === 'completed' && (state.currentCompletedTasksPage = page);
        status === 'archived' && (state.currentArchivedTasksPage = page);
        navigate(`/`, { state, replace: true })
    }

    function onCreateNewPomodoro(task) {
        // setElementHeight(listElement.current.offsetHeight)
        createNewPomodoro(task, task.project)
    }

    function generateDueDateClass(task) {
        if (task.status === 'added') {
            if (moment().diff(moment(task.dueDate)) > 0) {
                return "text-danger";
            } else {
                return "text-secondary";
            }
        } else {
            return "text-success";
        }
    }

    return (
        <>
            {
                tasks.length === 0 &&
                <div className="loader-container my-1" style={{ height: elementHeight }}>
                    <div className="loader"></div>
                </div>
            }
            <div id="tasks-list" ref={listElement}>
                {
                    tasks.map(
                        task => (
                            <div key={task.id} className={"update-list-row" + (showUpdatePopupId === task.id ? " update-list-row-selected" : "")}>
                                <div className="d-flex justify-content-start">
                                    {
                                        task.status === 'added' &&
                                        <div className="my-auto ms-2 text-start">
                                            <button type="button" className="btn btn-sm btn-outline-success px-1 py-0 align-middle" onClick={() => onCreateNewPomodoro(task)}>
                                                <i className="bi bi-play-circle"></i>
                                            </button>
                                        </div>
                                    }
                                    <div className="mx-2 flex-grow-1 text-start update-popup-container">

                                        <div className="py-2" onClick={() => setShowUpdatePopupId(task.id)}>
                                            <div className={(task.status === 'archived' ? "text-secondary" : "") + " description"}>
                                                {task.description}
                                            </div>
                                            <div className="subscript text-secondary">
                                                <span>
                                                    <i className="bi bi-arrow-up" />
                                                    {task.priority}
                                                </span>
                                                <span>
                                                    <i className="ps-1 bi bi-hourglass" />
                                                    {timeToDisplay(task.pomodoroLength || task.project.pomodoroLength || userSettings.pomodoroLength)}
                                                </span>
                                                {
                                                    task.dueDate &&
                                                    <span className={generateDueDateClass(task)}>
                                                        <i className="ps-1 bi bi-calendar-check" style={{ paddingRight: "0.1rem" }} />
                                                        {moment(task.dueDate).format("DD/MM/yyyy")}
                                                    </span>
                                                }
                                                <span>
                                                    <i className="ps-1 bi bi-clock" style={{ paddingRight: "0.1rem" }} />
                                                    {timeToDisplay(task.pomodorosTimeElapsed / 60)}
                                                </span>

                                                {
                                                    !project &&
                                                    <span>
                                                        <span className="ps-1" style={{ color: task.project.color, paddingRight: "0.1rem" }}>&#9632;</span>
                                                        {task.project.name}
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                        {
                                            showUpdatePopupId === task.id &&
                                            <OutsideAlerter handle={() => setShowUpdatePopupId(-1)}>
                                                <span className="">
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
                                                        {
                                                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => setShowUpdateTaskId(task.id)}>
                                                                Update Task <i className="bi bi-pencil-square" />
                                                            </button>
                                                        }
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
                                                        {
                                                            task.status === 'added' &&
                                                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => onUpdateDueDate(task)}>
                                                                Set Due Date <i className="ps-1 bi bi-calendar-check" />
                                                            </button>
                                                        }
                                                    </div>
                                                </span>
                                            </OutsideAlerter>
                                        }
                                    </div>
                                </div>
                                {
                                    task.status === 'added' && showCreatePastPomodoro === task.id &&
                                    <PastPomodoroComponent
                                        setShowCreatePastPomodoro={setShowCreatePastPomodoro}
                                        task={task}
                                        setPomodorosListReload={setPomodorosListReload}
                                        setTasksReload={setCurrentTasksReload}
                                    />
                                }

                                {
                                    showUpdateDueDate === task.id &&
                                    <TaskDueDateComponent
                                        setShowUpdateDueDate={setShowUpdateDueDate}
                                        task={task}
                                        setTasksReload={setCurrentTasksReload}
                                    />
                                }

                                {
                                    showUpdateTaskId === task.id &&
                                    <UpdateTaskComponent
                                        task={task}
                                        setShowUpdateTaskId={setShowUpdateTaskId}
                                        setTasksReload={setAllTasksReload}
                                    />
                                }
                            </div >
                        )
                    )
                }
            </div>

            <Pagination
                className="pagination-bar ps-0"
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