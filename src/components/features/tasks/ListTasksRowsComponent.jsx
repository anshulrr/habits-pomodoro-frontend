import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";

import moment from "moment";

import { Reorder } from "framer-motion";

import { useAuth } from "services/auth/AuthContext";
import Pagination from "services/pagination/Pagination";
import { getTasksCommentsCountApi, getTasksTimeElapsedApi } from "services/api/TaskApiService";
import { generateDateColor } from "services/helpers/listsHelper";
import { getTasksTagsApi } from "services/api/TagApiService";

import ListCommentsComponent from "components/features/comments/ListCommentsComponent";
import SortableTask from "./SortableTask";
import { getProjectTasksFromCache, modifyItemInCache, putItemToCache } from "services/dbService";

export default function ListTasksRowsComponent({
    project,
    tag,
    tags,
    projects,
    status,
    tasksCount,
    createNewPomodoro,
    setPomodorosListReload,
    pomodoroStatus,
    tasksReload,
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

    useEffect(
        () => {
            refreshTasks(status);
        }, [currentPage, tasksReload, pomodoroStatus] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const handleResize = () => {
        if (listElement.current !== null && listElement.current.offsetHeight !== 0) {
            // console.debug(currentPage, listElement.current.offsetHeight);
            setElementHeight(listElement.current.offsetHeight);
        }
    };

    function refreshTasks(status) {
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

        // retrieve task data today's time elapsed, total time elapsed and tags
        const taskIds = tasks.map(task => task.id);

        // TODO: find way to get all data together and without for loop
        getTasksTodaysTimeElapsed(taskIds);
        getTasksTotalTimeElapsed(taskIds);
        getTasksTags(taskIds);
        getTasksCommentsCount(taskIds);
    }

    function updateProjectData(tasks) {
        const projectsMap = new Map(projects.map(project => [project.id, project]));
        for (const i in tasks) {
            tasks[i].project = projectsMap.get(tasks[i].projectId);
            tasks[i].tags = [];
        }
        return tasks;
    }

    function getTasksTags(taskIds) {
        if (tags.size === 0) {
            return;
        }

        const map = new Map(tasks.map(task => {
            task.tags = [];
            return [task.id, task];
        }));
        getTasksTagsApi(taskIds)
            .then(response => {
                // using Map for easy access and update
                for (let i = 0; i < response.data.length; i++) {
                    map.get(response.data[i][0]).tags.push(tags.get(response.data[i][1]))
                }

                for (const task of map.values()) {
                    modifyItemInCache('tasks', task.id, { tags: task.tags })
                }
            })
            .catch(error => console.error(error.message))
    }

    function getTasksCommentsCount(taskIds) {
        getTasksCommentsCountApi(taskIds)
            .then(response => {
                // using Map for easy access and update
                for (let i = 0; i < response.data.length; i++) {
                    // TODO: find way to update commentsCount for all task together instead of updating one by one
                    modifyItemInCache('tasks', response.data[i][0], { commentsCount: parseInt(response.data[i][1]) })
                }
            })
            .catch(error => console.error(error.message))
    }

    function getTasksTodaysTimeElapsed(taskIds) {
        const startDate = moment().startOf('day').toISOString();
        const endDate = moment().toISOString();

        getTasksTimeElapsedApi({ startDate, endDate, taskIds })
            .then(response => {
                // using Map for easy access and update
                for (let i = 0; i < response.data.length; i++) {
                    modifyItemInCache('tasks', response.data[i][0], { todaysTimeElapsed: parseInt(response.data[i][1]) })
                }
                updateTasksDueDateColor();
            })
            .catch(error => console.error(error.message))
    }

    function getTasksTotalTimeElapsed(taskIds) {
        // TODO: decide start date
        const startDate = moment().add(-10, 'y').toISOString();
        const endDate = moment().toISOString();

        getTasksTimeElapsedApi({ startDate, endDate, taskIds })
            .then(response => {
                // using Map for easy access and update
                for (let i = 0; i < response.data.length; i++) {
                    modifyItemInCache('tasks', response.data[i][0], { totalTimeElapsed: parseInt(response.data[i][1]) })
                }
            })
            .catch(error => console.error(error.message))
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

    function updateTasksDueDateColor() {
        tasks.map(task => {
            const color = generateDueDateColor(task);
            // console.log({ color, taskId: task.id });
            modifyItemInCache('tasks', task.id, { dueDateColor: 'text-' + color })
            modifyItemInCache('tasks', task.id, { dueDateButtonColor: 'btn-outline-' + color })
        });

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