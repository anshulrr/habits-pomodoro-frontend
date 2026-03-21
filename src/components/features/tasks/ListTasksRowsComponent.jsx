import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import moment from "moment";

import { Reorder } from "framer-motion";

import { toast } from "react-toastify";

import { useAuth } from "services/auth/AuthContext";
import Pagination from "services/pagination/Pagination";
import { generateDateColor } from "services/helpers/listsHelper";

import ListCommentsComponent from "components/features/comments/ListCommentsComponent";
import SortableTask from "./SortableTask";
import { putItemToCache } from "services/dbService";
import { useData } from "services/DataContext";

export default function ListTasksRowsComponent({
    project,
    tag,
    status,
    tasksCount,
    createNewPomodoro,
    setPomodorosListReload,
    startDate,
    endDate,
    searchString,
    currentPage,
    setCurrentPage
}) {
    const navigate = useNavigate()
    const { state } = useLocation();

    const dataContext = useData();
    const pomodoros = dataContext.pomodoros;

    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const PAGESIZE = userSettings.pageTasksCount;
    const elementHeight = Math.min(tasksCount, PAGESIZE) * 60.6; // required when showing loader while changing project
    const [showLoader, setShowLoader] = useState(true);

    const [sortableTasks, setSortableTasks] = useState([]);

    const [showCommentsId, setShowCommentsId] = useState(-1);

    const [timeoutIdObj, setTimeoutIdObj] = useState({ id: 0 });

    useEffect(
        () => {
            // console.debug('re-render ListTasksRowsComponents')
            return () => {
                clearTimeout(timeoutIdObj.id);
            };
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const getTasksFromInMemory = async function ({
        status,
        projectId,
        tagId,
        startDate,
        endDate,
        searchString
    }) {
        const taskIds = dataContext.tasks_tags
            .filter((row => row.tagId === tagId))
            .map(row => row.taskId);
        const tasks = [...dataContext.tasksMap.values()]
            .filter(task => {
                if (task.status != status) {
                    return false;
                }
                if (!!projectId) {
                    return task.projectId === projectId
                } else if (!!tagId) {
                    return taskIds.includes(task.id)
                } else if (!!endDate) {
                    return moment(task.dueDate).isSameOrBefore(endDate) && moment(task.dueDate).isSameOrAfter(startDate)
                } else {
                    const regex = new RegExp(searchString, 'i');
                    return regex.test(task.description);
                }
            })
            .sort((a, b) => // Sort by category first, then project, then task priority
                a.categoryPriority - b.categoryPriority
                || a.projectPriority - b.projectPriority
                || a.priority - b.priority)

        const startIndex = (currentPage - 1) * PAGESIZE;
        const endIndex = startIndex + PAGESIZE;
        return tasks.slice(startIndex, endIndex);
    }

    const prevDeps = useRef({ cachedTasks: dataContext.tasksMap, pomodoros, currentPage });

    const tasks = useMemo(async () => {
        const changed = [];

        if (prevDeps.current.cachedTasks !== dataContext.tasksMap) changed.push('cachedTasks');
        if (prevDeps.current.pomodoros !== pomodoros) changed.push('pomodoros');
        if (prevDeps.current.currentPage !== currentPage) changed.push('currentPage');

        if (changed.length > 0) {
            console.log('Changed dependencies:', changed.join(', '));
        }

        // Update the ref for the next render
        prevDeps.current = { cachedTasks: dataContext.tasksMap, pomodoros, currentPage };


        setShowLoader(true);
        const startTime = new Date().getTime();
        console.log('useMemo', startTime);
        let retrievedTasks = await getTasksFromInMemory({
            status,
            projectId: project?.id,
            tagId: tag?.id,
            startDate,
            endDate,
            searchString
        })
        // log for performance check
        const endTime = new Date().getTime();
        const duration = endTime - startTime;
        if (duration > 40) {
            toast.info(`Tasks QueryDuration: ${duration} ms`, { position: "bottom-right" });
        }
        // console.debug(`Retrieved ${status} tasks from cache after update:`, { retrievedTasks });

        setSortableTasks(retrievedTasks);

        // calculate data for view
        updateTasksTimeElpased(retrievedTasks);
        updateTasksDueDateColor(retrievedTasks);

        setShowLoader(false);

        // log for performance check
        const endTime2 = new Date().getTime();
        const duration2 = endTime2 - startTime;
        if (duration2 > 50) {
            toast.info(`View Update duration: ${duration2} ms`, { position: "bottom-right" });
        }
        return retrievedTasks;
    }, [dataContext.tasksMap, pomodoros, currentPage]);

    function updateTasksTimeElpased(retrievedTasks) {
        retrievedTasks.forEach(task => {
            task.todaysTimeElapsed = 0;
            task.totalTimeElapsed = 0;
            return task;
        })
        const tasksMap = new Map(retrievedTasks.map(item => [item.id, item]));
        for (const pomodoro of pomodoros) {
            if (tasksMap.has(pomodoro.taskId)) {
                const task = tasksMap.get(pomodoro.taskId);
                if (moment(pomodoro.endTime).isAfter(moment().startOf('day'))) {
                    task.todaysTimeElapsed += pomodoro.timeElapsed;
                }
                task.totalTimeElapsed += pomodoro.timeElapsed;
            }
        }
    }

    function onUpdateTaskStatus(task, status) {
        if (!window.confirm(`Press OK to move task to ${status}.`)) {
            return;
        }
        task.status = status;

        // console.debug('onUpdateTaskStatus task:', { task });
        putItemToCache('tasks', task);
    }

    function updateOnPageChange(page) {
        setCurrentPage(page)
        status === 'current' && (state.currentTasksPage = page);
        status === 'archived' && (state.currentArchivedTasksPage = page);
        navigate(`/`, { state, replace: true })
    }

    function onCreateNewPomodoro(task) {
        createNewPomodoro(task, dataContext.projectsMap.get(task.projectId))
    }

    function updateTasksDueDateColor(tasks) {
        for (const i in tasks) {
            const color = generateDueDateColor(tasks[i]);
            tasks[i].dueDateColor = 'text-' + color;
            tasks[i].dueDateButtonColor = 'btn-outline-' + color;
        }

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

    const handleReorder = (newOrder) => {
        // console.debug({ newOrder });
        setSortableTasks(newOrder);
    }

    // to prevent rendering the page before tasks are loaded from cache db while project changed
    if (showLoader && !tasks)
        return (
            <div className="loader-container my-1" style={{ height: elementHeight }}>
                <div className="loader"></div>
            </div >
        )

    return (
        <>
            {
                showLoader &&
                <span className="loader-container-2" >
                    <span className="my-5 loader-2"></span>
                </span>
            }
            <Reorder.Group
                id="tasks-list"
                axis="y"
                values={sortableTasks}
                onReorder={handleReorder}
                style={{ listStyleType: "none", padding: 0, margin: 0 }}
            >
                {
                    sortableTasks.map(
                        (task, index) => {
                            // TODO: find better way to handle this
                            task.pomodoroLength = task.pomodoroLength || dataContext.projectsMap.get(task.projectId).pomodoroLength || userSettings.pomodoroLength;
                            return (
                                <SortableTask
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    sortableTasks={sortableTasks}
                                    onCreateNewPomodoro={onCreateNewPomodoro}
                                    onUpdateTaskStatus={onUpdateTaskStatus}
                                    setPomodorosListReload={setPomodorosListReload}
                                    project={project}
                                    setShowCommentsId={setShowCommentsId}
                                />
                            )
                        }
                    )
                }
            </Reorder.Group>

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