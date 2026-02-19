import { COLOR_MAP, formatDate, timeToDisplay } from "services/helpers/listsHelper";
import OutsideAlerter from "services/hooks/OutsideAlerter";

import PastPomodoroComponent from "components/features/tasks/PastPomodoroComponent";
import UpdateTaskComponent from "components/features/tasks/UpdateTaskComponent";
import TaskDueDateComponent from "components/features/tasks/TaskDueDateComponent";
import MapTagComponent from "components/features/tags/MapTagComponent";
import { TaskStats } from "components/features/tasks/TaskStats";
import { Reorder, useDragControls } from "framer-motion";

export default function SortableTask({
    task,
    index,
    handleDragStart,
    handleDragEnd,
    showUpdatePopupId,
    setShowUpdatePopupId,
    onUpdateDueDate,
    showUpdateDueDate,
    setShowUpdateDueDate,
    onCreatePastPomodoro,
    showCreatePastPomodoro,
    setShowCreatePastPomodoro,
    onCreateNewPomodoro,
    onUpdateTaskStatus,
    onAddTag,
    showMapTags,
    setShowMapTags,
    tags,
    setTasksReload,
    setPomodorosListReload,
    project,
    updateCommentsPopupData,
    onClickStats,
    showTaskStats,
    setShowTaskStats,
    setShowUpdateTaskId,
    showUpdateTaskId,
    markCompleted,
    generateTimeElapsedColor,
    setAllTasksReload
}) {
    const controls = useDragControls();

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
        >
            <div className="d-flex justify-content-start">
                {
                    project &&
                    <div
                        className="my-auto ms-1 text-start"
                        onPointerDown={(e) => {
                            controls.start(e)
                            e.preventDefault();
                        }} // Starts drag on click
                        style={{ cursor: "grab", touchAction: "none" }}
                    >
                        <i className="bi bi-grip-vertical" />
                    </div>
                }

                <div className="mx-1 flex-grow-1 text-start update-popup-container">

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
                                        <i className="bi bi-journal-text" style={{ paddingRight: "0.1rem" }} />
                                    </span>
                                    {task.commentsCount}
                                </span>
                            }

                            {
                                <span className="me-1">
                                    <span>
                                        <i className="bi bi-arrow-up" style={{ paddingRight: "0.1rem" }} />
                                    </span>
                                    {task.priority}
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