import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import moment from "moment";

import { useAuth } from "services/auth/AuthContext";
import Pagination from "services/pagination/Pagination";
import { getTasksTimeElapsedApi, retrieveAllTasksApi, updateTaskApi } from "services/api/TaskApiService";
import { COLOR_MAP, formatDate, generateDateColor, timeToDisplay } from "services/helpers/listsHelper";
import OutsideAlerter from "services/hooks/OutsideAlerter";
import { getTasksTagsApi } from "services/api/TagApiService";

import PastPomodoroComponent from "components/features/tasks/PastPomodoroComponent";
import ListCommentsComponent from "components/features/comments/ListCommentsComponent";
import UpdateTaskComponent from "components/features/tasks/UpdateTaskComponent";
import TaskDueDateComponent from "components/features/tasks/TaskDueDateComponent";
import MapTagComponent from "components/features/tags/MapTagComponent";
import { TaskStats } from "components/features/tasks/TaskStats";

export default function ListTasksRowsComponent({
    project,
    tag,
    tags,
    projects,
    status,
    tasksCount,
    createNewPomodoro,
    setPomodorosListReload,
    setTasksReload,
    setAllTasksReload,
    elementHeight,
    setElementHeight,
    startDate,
    endDate,
    searchString,
    isReversed
}) {
    const navigate = useNavigate()
    const { state } = useLocation();

    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const [showUpdatePopupId, setShowUpdatePopupId] = useState(-1);

    const listElement = useRef(null);

    const PAGESIZE = userSettings.pageTasksCount;

    const [tasks, setTasks] = useState([]);

    const [currentPage, setCurrentPage] = useState(
        (status === 'current' && state?.currentTasksPage) ||
        (status === 'archived' && state?.currentArchivedTasksPage) ||
        1
    )

    const [showCreatePastPomodoro, setShowCreatePastPomodoro] = useState(-1);
    const [showUpdateDueDate, setShowUpdateDueDate] = useState(-1);
    const [showMapTags, setShowMapTags] = useState(-1);
    const [showTaskStats, setShowTaskStats] = useState(-1);

    const [showUpdateTaskId, setShowUpdateTaskId] = useState(-1)

    const [showCommentsId, setShowCommentsId] = useState(-1);

    const [timeoutIdObj, setTimeoutIdObj] = useState({ id: 0 });

    useEffect(
        () => {
            const observer = new ResizeObserver(handleResize);
            observer.observe(listElement.current);
            return () => {
                // Cleanup the observer by unobserving all elements
                observer.disconnect();
                // console.debug(timeoutIdObj);
                clearTimeout(timeoutIdObj.id);
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
        } else if (tag) {
            taskData.tagId = tag.id;
        } else if (startDate) {
            taskData.startDate = startDate;
            taskData.endDate = endDate;
        } else {
            taskData.searchString = searchString;
        }
        retrieveAllTasksApi(taskData)
            .then(response => {
                // console.debug(response)
                // update project data in tasks list
                const updated_tasks = updateProjectData(response.data);
                setTasks(updated_tasks)
                // retrieve task data today's time elapsed, total time elapsed and tags
                const taskIds = updated_tasks.map(task => task.id);

                const map = new Map(updated_tasks.map(task => {
                    task.tags = [];
                    // task.todaysTimeElapsed = 0;
                    // task.totalTimeElapsed = 0;
                    return [task.id, task];
                }));

                getTasksTodaysTimeElapsed(taskIds, map);
                getTasksTotalTimeElapsed(taskIds, map);
                getTasksTags(taskIds, map);
            })
            .catch(error => console.error(error.message))
    }

    function updateProjectData(tasks) {
        const projectsMap = new Map(projects.map(project => [project.id, project]));
        for (const i in tasks) {
            tasks[i].project = projectsMap.get(tasks[i].projectId);
        }
        return tasks;
    }

    function getTasksTags(taskIds, map) {
        if (tags.size === 0) {
            return;
        }
        getTasksTagsApi(taskIds)
            .then(response => {
                // using Map for easy access and update
                for (let i = 0; i < response.data.length; i++) {
                    map.get(response.data[i][0]).tags.push(tags.get(response.data[i][1]))
                }
                setTasks([...map.values()]);
            })
            .catch(error => console.error(error.message))
    }

    function getTasksTodaysTimeElapsed(taskIds, map) {
        const startDate = moment().startOf('day').toISOString();
        const endDate = moment().toISOString();

        getTasksTimeElapsedApi({ startDate, endDate, taskIds })
            .then(response => {
                // using Map for easy access and update
                for (let i = 0; i < response.data.length; i++) {
                    map.get(response.data[i][0]).todaysTimeElapsed = parseInt(response.data[i][1]);
                }
                setTasks([...map.values()]);
                updateTasksDueDateColor();
            })
            .catch(error => console.error(error.message))
    }

    function getTasksTotalTimeElapsed(taskIds, map) {
        // TODO: decide start date
        const startDate = moment().add(-10, 'y').toISOString();
        const endDate = moment().toISOString();

        getTasksTimeElapsedApi({ startDate, endDate, taskIds })
            .then(response => {
                // using Map for easy access and update
                for (let i = 0; i < response.data.length; i++) {
                    map.get(response.data[i][0]).totalTimeElapsed = parseInt(response.data[i][1]);
                }
                setTasks([...map.values()]);
            })
            .catch(error => console.error(error.message))
    }

    function updateCommentsPopupData(task) {
        setShowCommentsId(task.id)
    }

    function onUpdateTaskStatus(task, status) {
        // setElementHeight(listElement.current.offsetHeight)

        if (!window.confirm(`Press OK to move task to ${status}.`)) {
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

    function onAddTag(task) {
        setShowCreatePastPomodoro(-1)
        setShowUpdatePopupId(-1);
        // setElementHeight(listElement.current.offsetHeight);
        setShowMapTags(task.id);
    }

    function onClickStats(task) {
        setShowCreatePastPomodoro(-1)
        setShowUpdatePopupId(-1);
        // setElementHeight(listElement.current.offsetHeight);
        setShowTaskStats(task.id);
    }

    function markCompleted(task) {
        // if (!window.confirm(`Press OK to mark task as completed and update the due date`)) {
        //     return;
        // }
        if (task.repeatDays === 0) {
            task.dueDate = null;
            task.enableNotifications = false;
        } else {
            task.dueDate = moment(task.dueDate).add(task.repeatDays, 'd').toDate();
        }

        updateTaskApi({ id: task.id, task })
            .then(() => {
                setAllTasksReload(prevReload => prevReload + 1)
            })
            .catch(error => console.error(error.message))
    }

    function updateOnPageChange(page) {
        // setElementHeight(listElement.current.offsetHeight)
        setCurrentPage(page)
        status === 'current' && (state.currentTasksPage = page);
        status === 'archived' && (state.currentArchivedTasksPage = page);
        navigate(`/`, { state, replace: true })
    }

    function onCreateNewPomodoro(task) {
        // setElementHeight(listElement.current.offsetHeight)
        createNewPomodoro(task, task.project)
    }

    function updateTasksDueDateColor() {
        setTasks(tasks => tasks.map(task => {
            const color = generateDueDateColor(task);
            task.dueDateColor = 'text-' + color;
            task.dueDateButtonColor = 'btn-outline-' + color;
            return task;
        }))
        // setTimeout to update color every 30 minutes
        const timeRemaining = 3 * 60 - (moment().minutes() % 3) * 60 - moment().seconds();
        const id = (setTimeout(() => updateTasksDueDateColor(), timeRemaining * 1000))
        // console.debug(moment().minutes(), timeRemaining);
        // console.debug(id);
        // NOTE: primitive data type not working hence using obj
        setTimeoutIdObj(prev => {
            prev.id = id;
            return prev;
        });
    }

    const generateDueDateColor = (task) => {
        const date = task.dueDate;
        if (task.type !== 'bad') {
            return generateDateColor(date)
        } else {
            if (moment(date).isSame(new Date(), 'day')) {
                if (moment().diff(moment(date)) > 0) {
                    return "primary";
                } else if (task.todaysTimeElapsed > 0) {
                    return "danger";
                }
            }
        }
        return "secondary";
    }

    const generateTimeElapsedColor = (task) => {
        if (task.type === 'bad') {
            if (task.todaysTimeElapsed / 60 > (task.pomodoroLength) * task.dailyLimit) {
                return "text-danger";
            }
        } else if (task.type === 'good') {
            if (task.todaysTimeElapsed / 60 >= (task.pomodoroLength) * task.dailyLimit) {
                return "text-success";
            }
        }
        return "";
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
                        task => {
                            // TODO: find better way to handle this
                            task.pomodoroLength = task.pomodoroLength || task.project.pomodoroLength || userSettings.pomodoroLength;
                            return (
                                <div key={task.id} className={"update-list-row" + (showUpdatePopupId === task.id ? " update-list-row-selected" : "")}>
                                    <div className="d-flex justify-content-start">

                                        <div className="mx-2 flex-grow-1 text-start update-popup-container">

                                            <div className="py-2" onClick={() => setShowUpdatePopupId(task.id)}>
                                                <div className="description">
                                                    {task.description}
                                                </div>
                                                <div className="subscript text-secondary">
                                                    <span className="me-1">
                                                        <span>
                                                            {
                                                                (task.dailyLimit === 0 || task.dailyLimit > 3) ?
                                                                    <span>
                                                                        {task.dailyLimit}<i className="bi bi-hourglass" />
                                                                    </span>
                                                                    :
                                                                    [...Array(task.dailyLimit)].map((e, i) => <i className="bi bi-hourglass" key={i} />)
                                                            }
                                                        </span>
                                                        {timeToDisplay(task.pomodoroLength)}
                                                    </span>

                                                    {
                                                        task.totalTimeElapsed !== undefined &&
                                                        <span className="me-1">
                                                            <i className="bi bi-clock" style={{ paddingRight: "0.1rem" }} />
                                                            {timeToDisplay(task.totalTimeElapsed / 60)}
                                                        </span>
                                                    }

                                                    {
                                                        task.todaysTimeElapsed !== undefined &&
                                                        <span className="me-1">
                                                            <span className={generateTimeElapsedColor(task)}>
                                                                <i className="bi bi-clock-fill" style={{ paddingRight: "0.1rem" }} />
                                                            </span>
                                                            {timeToDisplay(task.todaysTimeElapsed / 60)}
                                                        </span>
                                                    }

                                                    {
                                                        task.dueDate &&
                                                        <span style={{ paddingRight: "0.1rem" }} >
                                                            <span className={task.dueDateColor}>
                                                                <i className={"bi bi-calendar2-event"} style={{ paddingRight: "0.1rem" }} />
                                                            </span>
                                                            {formatDate(task.dueDate)}
                                                        </span>
                                                    }
                                                    {
                                                        task.dueDate && task.repeatDays !== 0 &&
                                                        <span style={{ paddingRight: "0.1rem" }} >
                                                            <i className="bi bi-arrow-repeat" style={{ paddingRight: "0.1rem" }} />
                                                            {task.repeatDays}
                                                        </span>
                                                    }

                                                    {
                                                        task.dueDate && task.enableNotifications &&
                                                        <span>
                                                            <i className="bi bi-bell" style={{ paddingRight: "0.1rem" }} />
                                                        </span>
                                                    }

                                                    <span style={{ float: "right" }}>
                                                        {
                                                            !project &&
                                                            <span className="me-1">
                                                                <span style={{ color: task.project.color, paddingRight: "0.1rem" }}>&#9632;</span>
                                                                {task.project.name}
                                                            </span>
                                                        }
                                                    </span>
                                                    <span style={{ float: "right" }}>
                                                        {
                                                            task.tags && task.tags.length > 0 &&
                                                            task.tags.map(
                                                                (tag, tag_index) => (
                                                                    <span key={tag_index} className="me-1">
                                                                        <i className="bi bi-tag-fill" style={{ color: tag.color, paddingRight: "0.1rem" }} />
                                                                        {tag.name}
                                                                    </span>
                                                                )
                                                            )
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            {
                                                showUpdatePopupId === task.id &&
                                                <OutsideAlerter handle={() => setShowUpdatePopupId(-1)}>
                                                    <span className="">
                                                        <div className="update-popup">
                                                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => updateCommentsPopupData(task)}>
                                                                Notes <i className="bi bi-journal-text" />
                                                            </button>
                                                            {
                                                                task.status === 'current' &&
                                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => onUpdateDueDate(task)}>
                                                                    Add {task.type === 'bad' ? 'Restrain' : 'Due'} Time <i className={"ps-1 bi bi-calendar2-event"} />
                                                                </button>
                                                            }
                                                            {
                                                                task.status === 'current' &&
                                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => onCreatePastPomodoro(task)}>
                                                                    Add Past Pomodoro
                                                                </button>
                                                            }

                                                            <hr className="my-2" />
                                                            {
                                                                task.dueDate &&
                                                                <button type="button" className={(task.dueDateButtonColor ? task.dueDateButtonColor : "btn-outline-secondary") + " btn btn-sm px-2 py-0 align-middle"} onClick={() => markCompleted(task)}>
                                                                    Mark Completed <i className={`lh-1 bi bi-calendar2-check`} />
                                                                </button>
                                                            }

                                                            {
                                                                task.status === 'current' &&
                                                                <button type="button" className={`btn btn-sm btn-outline-${COLOR_MAP[task.type]} px-2 py-0 align-middle`} onClick={() => onCreateNewPomodoro(task)}>
                                                                    Start Pomodoro <i className="lh-1 bi bi-play-circle"></i>
                                                                </button>
                                                            }

                                                            <hr className="my-2" />
                                                            {
                                                                task.status !== 'current' &&
                                                                < button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => onUpdateTaskStatus(task, 'current')}>
                                                                    Move to Current
                                                                </button>
                                                            }
                                                            {
                                                                task.status !== 'archived' &&
                                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => onUpdateTaskStatus(task, 'archived')}>
                                                                    Move to Archive
                                                                </button>
                                                            }

                                                            {
                                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => setShowUpdateTaskId(task.id)}>
                                                                    Update Task <i className="bi bi-pencil-square" />
                                                                </button>
                                                            }
                                                            {
                                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => onAddTag(task)}>
                                                                    Add Tags <i className="ps-1 bi bi-tag" />
                                                                </button>
                                                            }
                                                            {
                                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => onClickStats(task)}>
                                                                    Stats <i className="ps-1 bi bi-graph-up" />
                                                                </button>
                                                            }
                                                        </div>
                                                    </span>
                                                </OutsideAlerter>
                                            }
                                        </div>

                                        {
                                            task.dueDate &&
                                            <div className="my-auto me-1 text-start">
                                                <button type="button" className={(task.dueDateButtonColor ? task.dueDateButtonColor : "btn-outline-secondary") + " btn btn-sm px-1 py-0 align-middle"} onClick={() => markCompleted(task)}>
                                                    <i className={"bi bi-calendar2-check"} />
                                                </button>
                                            </div>
                                        }
                                        {
                                            task.status === 'current' &&
                                            <div className="my-auto me-2 text-start">
                                                <button type="button" className={`btn btn-sm btn-outline-${COLOR_MAP[task.type]} px-1 py-0 align-middle`} onClick={() => onCreateNewPomodoro(task)}>
                                                    <i className="bi bi-play-circle"></i>
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    {
                                        task.status === 'current' && showCreatePastPomodoro === task.id &&
                                        <PastPomodoroComponent
                                            setShowCreatePastPomodoro={setShowCreatePastPomodoro}
                                            task={task}
                                            setPomodorosListReload={setPomodorosListReload}
                                            setTasksReload={setTasksReload}
                                        />
                                    }

                                    {
                                        showUpdateDueDate === task.id &&
                                        <TaskDueDateComponent
                                            setShowUpdateDueDate={setShowUpdateDueDate}
                                            task={task}
                                            setTasksReload={setTasksReload}
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

                                    {
                                        showMapTags === task.id &&
                                        <MapTagComponent
                                            task={task}
                                            tagsMap={tags}
                                            setShowMapTags={setShowMapTags}
                                            setTasksReload={setTasksReload}
                                        />
                                    }

                                    {
                                        showTaskStats === task.id &&
                                        <TaskStats
                                            task={task}
                                            setShowTaskStats={setShowTaskStats}
                                        />
                                    }
                                </div >
                            )
                        }
                    )
                }
            </div>

            <Pagination
                className="pagination-bar pagination-scroll ps-0"
                currentPage={currentPage}
                totalCount={tasksCount}
                pageSize={PAGESIZE}
                onPageChange={page => updateOnPageChange(page)}
            />

            {
                showCommentsId !== -1 &&
                <div className="comments-overlay">
                    <div className="comments-popup">
                        <div className="close-popup m-2">
                            <i className="p-1 bi bi-x-lg" onClick={() => setShowCommentsId(-1)}></i>
                        </div>
                        <div className="container mt-4">
                            <ListCommentsComponent
                                filterBy={'task'}
                                id={showCommentsId}
                            />
                        </div >
                    </div>
                </div>
            }
        </>
    )
}