import { useState } from 'react'

import { createTaskApi } from '../services/api/TaskApiService';

export default function CreateTaskComponent({ setShowCreateTask, project, setTasksReload }) {

    const [description, setDescription] = useState('')

    function handleSubmit(error) {
        error.preventDefault();

        const task = {
            description,
            pomodoroLength: 0,
            status: 'added'
        }

        createTaskApi(project.id, task)
            .then(response => {
                console.debug(response)
                setTasksReload(prev => prev + 1);
                setShowCreateTask(false)
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="createTask">
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
                                    placeholder="Task Description"
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                                <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setShowCreateTask(false)}>
                                    <i className="bi bi-x-lg" />
                                </button>
                                <button className="btn btn-sm btn-outline-success" type="submit">
                                    <i className="bi bi-plus-circle" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    )
}