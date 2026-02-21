import { COLOR_MAP, formatDate, timeToDisplay } from "services/helpers/listsHelper";
import OutsideAlerter from "services/hooks/OutsideAlerter";

import PastPomodoroComponent from "components/features/tasks/PastPomodoroComponent";
import UpdateTaskComponent from "components/features/tasks/UpdateTaskComponent";
import TaskDueDateComponent from "components/features/tasks/TaskDueDateComponent";
import MapTagComponent from "components/features/tags/MapTagComponent";
import { TaskStats } from "components/features/tasks/TaskStats";
import { motion, Reorder, useDragControls } from "framer-motion";
import { useRef, useState } from "react";
import { resetProjectTaskPrioritiesApi, updateTaskApi, updateTaskPriorityApi } from "services/api/TaskApiService";
import moment from "moment";

export default function SortableTask({
    task,
    index,
    tasks,
    setTasks,
    onCreateNewPomodoro,
    onUpdateTaskStatus,
    tags,
    setTasksReload,
    setPomodorosListReload,
    project,
    setShowCommentsId,
    markCompleted,
    setAllTasksReload
}) {
    const controls = useDragControls();
    const activeIdRef = useRef(null); // The real moved item

    const [showUpdatePopupId, setShowUpdatePopupId] = useState(-1);

    const [showUpdateTaskId, setShowUpdateTaskId] = useState(-1)

    const [showCreatePastPomodoro, setShowCreatePastPomodoro] = useState(-1);
    const [showTaskStats, setShowTaskStats] = useState(-1);
    const [showUpdateDueDate, setShowUpdateDueDate] = useState(-1);
    const [showMapTags, setShowMapTags] = useState(-1);

    const handleDragStart = ({ id, index }) => {
        // console.debug('drag start', { id, index });
        // Capture the id & index before the user starts moving the item
        activeIdRef.current = { id, index };
    };

    const handleDragEnd = ({ id, index }) => {
        // console.debug('drag end', { id, index });
        // If dropped in the same position, do nothing
        if (activeIdRef.current.id === id && activeIdRef.current.index === index)
            return;

        // Get the neighbors for the Integer Gap calculation
        const prevItem = tasks[index - 1];
        const nextItem = tasks[index + 1];

        const prevOrder = prevItem ? prevItem.priority : null;
        const nextOrder = nextItem ? nextItem.priority : null;
        // console.debug(`Item ${id} moved. Neighbors:`, { prevOrder, nextOrder });

        // if no space is left between prevOrder and nextOrder, call an API to reset order
        if (prevOrder !== null && nextOrder !== null && prevOrder + 1 >= nextOrder) {
            resetProjectTaskPrioritiesApi({ id: project.id })
                .then(() => {
                    window.alert("Failed to update task order. Please try again.");
                    setTasksReload(prevReload => prevReload + 1);
                    return;
                })
            return;
        }

        // API Call: Send only the specific data for the gap update
        updateTaskPriorityApi({ id, map: { prevOrder, nextOrder } })
            .then(response => {
                setTasks(prevTasks => prevTasks.map(task => {
                    if (task.id === id) {
                        return { ...task, priority: response.data.priority };
                    }
                    return task;
                }));
            })
            .catch(error => console.error(error.message))
        // Reset ref
        activeIdRef.current = null;
    };

    function updateCommentsPopupData(task) {
        setShowCommentsId(task.id)
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

    return (
        <Reorder.Item
            key={task.id}
            layout
            className={"update-list-row" + (showUpdatePopupId === task.id ? " update-list-row-selected" : "")}
            value={task}
            onDragStart={() => handleDragStart({ id: task.id, index })} // Mark the "Old" state
            onDragEnd={() => handleDragEnd({ id: task.id, index })} // Handle the "New" state and API call
            dragListener={false} // only allow drag when in project page, otherwise it will cause bug of dragging across projects
            dragControls={controls} // Links this item to our custom controls
            // Apply the "Pop" effect to the whole row when dragged
            whileDrag={{
                scale: 0.98,
                boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
            }}
        >
            <div className="d-flex justify-content-start">
                {
                    project &&
                    <motion.div
                        className="my-auto px-1 text-start"
                        onPointerDown={(e) => {
                            controls.start(e)
                            e.preventDefault();
                        }} // Starts drag on click
                        style={{ cursor: "grab", touchAction: "none" }}
                    >
                        <i className="bi bi-grip-vertical" />
                    </motion.div>
                }

                <div className={(!project ? "ms-2 " : "") + "me-2 flex-grow-1 text-start update-popup-container"}>

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

                            {
                                task.commentsCount !== undefined &&
                                <span className="me-1" onClick={() => updateCommentsPopupData(task)}>
                                    <span>
                                        <i className="bi bi-journal-text" style={{ paddingRight: "0.1rem", color: "green" }} />
                                    </span>
                                    {task.commentsCount}
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
                                        Notes ({task.commentsCount !== undefined ? task.commentsCount : 0}) <i className="bi bi-journal-text" />
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
        </Reorder.Item >
    );
}