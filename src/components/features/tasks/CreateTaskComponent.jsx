import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import { addItemToCache } from 'services/dbService';

export default function CreateTaskComponent({ project }) {

    const navigate = useNavigate()
    const { state } = useLocation()

    const [description, setDescription] = useState('')

    function handleSubmit(error) {
        error.preventDefault();

        const task = {
            id: -1,
            publicId: window.crypto.randomUUID(),
            description,
            pomodoroLength: 0,
            projectId: project.id,
            status: 'current',
        }

        // TODO: handle scenario when a task is created while offline, and then updated while still offline
        // TODO: make sure to add extra data for view such as projectName
        console.debug('create task:', { task });
        addItemToCache('tasks', task);

        // cleanup
        setDescription('')
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