import { useAuth } from "../services/auth/AuthContext";

export default function ListTasksRowsComponent({ project, tasks, createNewPomodoro, updateTask }) {
    const authContext = useAuth()
    const userSettings = authContext.userSettings

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
                                <div className="col-1 text-secondary text-end task-list-button">
                                    <i className="bi bi-pencil-square" onClick={() => updateTask(task.id)}></i>
                                </div>
                            }
                        </div>
                    )
                )
            }
        </>
    )
}