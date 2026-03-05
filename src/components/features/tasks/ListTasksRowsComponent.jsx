import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";

import moment from "moment";

import { Reorder } from "framer-motion";

import { useAuth } from "services/auth/AuthContext";
import Pagination from "services/pagination/Pagination";
import { generateDateColor } from "services/helpers/listsHelper";

import ListCommentsComponent from "components/features/comments/ListCommentsComponent";
import SortableTask from "./SortableTask";
import { getProjectTasksFromCache, putItemToCache } from "services/dbService";

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
    currentPage,
    setCurrentPage
}) {
    const navigate = useNavigate()
    const { state } = useLocation();

    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const listElement = useRef(null);

    const PAGESIZE = userSettings.pageTasksCount;

    const [sortableTasks, setSortableTasks] = useState([]);

    const tasks = useLiveQuery(async () => {
        const retrievedTasks = await getProjectTasksFromCache({ projectId: project?.id, status, limit: PAGESIZE, offset: (currentPage - 1) * PAGESIZE })
        console.log(`Retrieved ${status} tasks from cache after update:`, { retrievedTasks });
        setSortableTasks(retrievedTasks);
        return updateProjectData(retrievedTasks);
    }, [currentPage]);

    const [showCommentsId, setShowCommentsId] = useState(-1);

    const [timeoutIdObj, setTimeoutIdObj] = useState({ id: 0 });

    useEffect(
        () => {
            console.debug('re-render ListTasksRowsComponents')
            // TODO: decide if Resize observer is required after caching all data
            const observer = new ResizeObserver(handleResize);
            // observer.observe(listElement.current);
            return () => {
                // Cleanup the observer by unobserving all elements
                observer.disconnect();
                // console.debug(timeoutIdObj);
                clearTimeout(timeoutIdObj.id);
            };
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const handleResize = () => {
        if (listElement.current !== null && listElement.current.offsetHeight !== 0) {
            // console.debug(currentPage, listElement.current.offsetHeight);
            setElementHeight(listElement.current.offsetHeight);
        }
    };

    async function refreshTasks(status) {
        console.debug('Refreshing tasks...', { status, tasks });
        if (!tasks) {
            return;
        }
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
    }

    function updateProjectData(tasks) {
        const projectsMap = new Map(projects.map(project => [project.id, project]));
        for (const i in tasks) {
            tasks[i].project = projectsMap.get(tasks[i].projectId);
        }
        updateTasksDueDateColor(tasks);
        return tasks;
    }

    function onUpdateTaskStatus(task, status) {
        // setElementHeight(listElement.current.offsetHeight)

        if (!window.confirm(`Press OK to move task to ${status}.`)) {
            return;
        }
        task.status = status;

        console.debug('onUpdateTaskStatus task:', { task });
        putItemToCache('tasks', task);
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

    if (!tasks)
        return <div>Loading initial data for tasks...</div>;

    return (
        <>
            {
                tasks.length === 0 &&
                <div className="loader-container my-1" style={{ height: elementHeight }}>
                    <div className="loader"></div>
                </div>
            }
            <Reorder.Group
                id="tasks-list"
                ref={listElement}
                axis="y"
                values={sortableTasks}
                onReorder={handleReorder}
                style={{ listStyleType: "none", padding: 0, margin: 0 }}
            >
                {
                    sortableTasks.map(
                        (task, index) => {
                            // TODO: find better way to handle this
                            task.pomodoroLength = task.pomodoroLength || task.project.pomodoroLength || userSettings.pomodoroLength;
                            return (
                                <SortableTask
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    sortableTasks={sortableTasks}
                                    onCreateNewPomodoro={onCreateNewPomodoro}
                                    onUpdateTaskStatus={onUpdateTaskStatus}
                                    tags={tags}
                                    setTasksReload={setTasksReload}
                                    setPomodorosListReload={setPomodorosListReload}
                                    project={project}
                                    setShowCommentsId={setShowCommentsId}
                                    setAllTasksReload={setAllTasksReload}
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