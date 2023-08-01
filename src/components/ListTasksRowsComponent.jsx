export default function ListTasksRowsComponent({ project, tasks, createNewPomodoro, updateTask }) {

    function timeToDisplay(total_minutes) {
        if (total_minutes < 60) {
            return Math.floor(total_minutes);
        }
        const minutes = Math.floor(total_minutes % 60);
        const hours = Math.floor(total_minutes / 60);
        // console.log(total, minutes, hours);

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

                            <div className="col text-secondary text-end">
                                <span className="text-truncate">
                                    <small>{timeToDisplay(task.pomodorosTimeElapsed / 60)} / {timeToDisplay(task.pomodoroLength || project.pomodoroLength || 25)} </small>
                                </span>
                                {
                                    task.status !== 'completed' &&
                                    <span className="task-list-button">
                                        <i className="bi bi-pencil-square" onClick={() => updateTask(task.id)}></i>
                                    </span>
                                }
                            </div>
                        </div>
                    )
                )
            }
        </>
    )
}