import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import { addItemToCache } from 'services/db/dbService';

export default function CreateTaskComponent({
    project,
    tasksCount,
    setCurrentPage
}) {

    const navigate = useNavigate()
    const { state } = useLocation()

    const [description, setDescription] = useState('')

    function handleSubmit(error) {
        error.preventDefault();

        const task = {
            description,
            pomodoroLength: 0,
            projectId: project.id,
            status: 'current',
            // default values for offline create and update
            priority: -tasksCount * 1000,
            type: "neutral",
            repeatDays: 0,
            dailyLimit: 1,
        }

        // TODO: handle scenario when a task is created while offline, and then updated while still offline
        // TODO: make sure to add extra data for view such as projectName
        // console.debug('create a task:', { task });
        addItemToCache('tasks', task);

        // cleanup
        setDescription('')
        setCurrentPage(1)
        updateAppState()
    }

    function updateAppState() {
        state.currentTasksPage = 1;
        navigate(`/`, { state, replace: true })
    }

    return (
        <div className="createTask mb-1">
            <form onSubmit={handleSubmit}>
                <div className="contianer">
                    <div className="row">

                        <div className="col-12">
                            <div className="input-group text-end">
                                <input
                                    type="text"
                                    name="task"
                                    className="form-control form-control-sm"
                                    value={description}
                                    placeholder="Add New Task"
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                                <button className="btn btn-sm btn-outline-secondary" type="submit">
                                    <i className="align-middle bi bi-plus-circle" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    )
}