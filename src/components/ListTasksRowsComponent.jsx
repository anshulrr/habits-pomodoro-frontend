export default function ListTasksRowsComponent({ project, tasks, createNewPomodoro, updateTask }) {

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
                                <span>
                                    {' ' + task.description}
                                </span>
                            </div>

                            <div className="col text-secondary text-truncate text-end">
                                <small>{task.pomodoroLength || project.pomodoroLength || 25} </small>
                                <span className="task-list-button">
                                    <i className="bi bi-pencil-square" onClick={() => updateTask(task.id)}></i>
                                </span>
                            </div>
                        </div>
                    )
                )
            }
        </>
    )
}