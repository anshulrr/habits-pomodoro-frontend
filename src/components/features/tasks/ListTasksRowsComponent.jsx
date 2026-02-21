import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import moment from "moment";

import { Reorder } from "framer-motion";

import { useAuth } from "services/auth/AuthContext";
import Pagination from "services/pagination/Pagination";
import { getTasksCommentsCountApi, getTasksTimeElapsedApi, retrieveAllTasksApi, updateTaskApi } from "services/api/TaskApiService";
import { generateDateColor } from "services/helpers/listsHelper";
import { getTasksTagsApi } from "services/api/TagApiService";

import ListCommentsComponent from "components/features/comments/ListCommentsComponent";
import SortableTask from "./SortableTask";

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
    searchString
}) {
    const navigate = useNavigate()
    const { state } = useLocation();

    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const listElement = useRef(null);

    const PAGESIZE = userSettings.pageTasksCount;

    const [tasks, setTasks] = useState([]);

    const [currentPage, setCurrentPage] = useState(
        (status === 'current' && state?.currentTasksPage) ||
        (status === 'archived' && state?.currentArchivedTasksPage) ||
        1
    )

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
                getTasksCommentsCount(taskIds, map);
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

    function getTasksCommentsCount(taskIds, map) {
        getTasksCommentsCountApi(taskIds)
            .then(response => {
                // using Map for easy access and update
                for (let i = 0; i < response.data.length; i++) {
                    map.get(response.data[i][0]).commentsCount = parseInt(response.data[i][1]);
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


    const handleReorder = (newOrder) => {
        setTasks(newOrder);
    }

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
                values={tasks}
                onReorder={handleReorder}
                style={{ listStyleType: "none", padding: 0, margin: 0 }}
            >
                {
                    tasks.map(
                        (task, index) => {
                            // TODO: find better way to handle this
                            task.pomodoroLength = task.pomodoroLength || task.project.pomodoroLength || userSettings.pomodoroLength;
                            return (
                                <SortableTask
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    tasks={tasks}
                                    setTasks={setTasks}
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