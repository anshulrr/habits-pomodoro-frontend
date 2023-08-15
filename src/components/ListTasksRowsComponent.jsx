import { useState } from "react";

import { useAuth } from "../services/auth/AuthContext";
import PastPomodoroComponent from "./PastPomodoroComponent";

export default function ListTasksRowsComponent({
    project,
    tasks,
    createNewPomodoro,
    updateTask,
    setPomodorosListReload,
}) {
    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const [showCreatePastPomodoro, setShowCreatePastPomodoro] = useState(-1);

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

    return (
        <>
            {
                tasks.map(
                    task => (
                        <div
                            key={task.id}
                            className="row py-2 task-list-row"
                        >
                            <div className="col-9 text-start">
                                {
                                    task.status === 'added' &&
                                    <i className="bi bi-play-circle" onClick={() => createNewPomodoro(task, project)}></i>
                                }
                                <span className={task.status === 'completed' ? "text-secondary" : ""}>
                                    {' ' + task.description}
                                </span>
                            </div>

                            <div className="col text-secondary text-truncate text-end">
                                <span>
                                    <small>{timeToDisplay(task.pomodorosTimeElapsed / 60)} / {timeToDisplay(task.pomodoroLength || project.pomodoroLength || userSettings.pomodoroLength)} </small>
                                </span>
                            </div>
                            {
                                <div className="col-1 px-0 text-secondary text-end task-list-button">
                                    {
                                        task.status === 'added' &&
                                        <i className="bi bi-calendar-plus" onClick={() => setShowCreatePastPomodoro(task.id)}></i>
                                    }
                                    &nbsp;<i className="bi bi-pencil-square" onClick={() => updateTask(task.id)}></i>
                                </div>
                            }
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
        </>
    )
}