import { useState } from 'react'

import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";

import { updateTaskApi } from 'services/api/TaskApiService';
import DueDateInputComponent from './DueDateInputComponent';

export default function TaskDueDateComponent({
    setShowUpdateDueDate,
    task,
    setTasksReload
}) {

    const [dueDate, setDueDate] = useState(task.dueDate ? moment(task.dueDate).toDate() : null);

    const [repeat, setRepeat] = useState(task.repeatDays !== 0)
    const [repeatDays, setRepeatDays] = useState(task.repeatDays)

    const [enableNotifications, setEnableNotifications] = useState(task.enableNotifications)

    const [error, setError] = useState('')

    function handleSubmit(error) {
        error.preventDefault();

        setError('');
        if (!dueDate) {
            setError('Select date')
            return;
        }
        if (dueDate && repeat && (repeatDays === '' || repeatDays < 1)) {
            setError('Enter positive value')
            return;
        }

        updateDueDate();
    }

    function updateDueDate() {
        task.dueDate = dueDate;
        task.repeatDays = repeat ? repeatDays : 0;
        task.enableNotifications = enableNotifications;

        updateTaskApi({ id: task.id, task })
            .then(response => {
                // console.debug(response)
                setShowUpdateDueDate(-1)
                setTasksReload(prevReload => prevReload + 1)
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="task-overlay">
            <div className="task-popup">
                <div className="task-close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowUpdateDueDate(-1)}></i>
                </div>
                <div className="container my-4">
                    <div className="">
                        <div className="">
                            <h6 className="text-center">
                                <i className="me-1 bi bi-list-ul" />
                                {task.description}
                            </h6>
                            <form onSubmit={handleSubmit}>
                                <DueDateInputComponent
                                    type={task.type}
                                    dueDate={dueDate}
                                    setDueDate={setDueDate}
                                    repeat={repeat}
                                    setRepeat={setRepeat}
                                    repeatDays={repeatDays}
                                    setRepeatDays={setRepeatDays}
                                    enableNotifications={enableNotifications}
                                    setEnableNotifications={setEnableNotifications}
                                    autoFocus={true}
                                    required={true}
                                    popupNumber={1}
                                />
                                <div className="row px-1 py-1 small text-secondary text-start">
                                    <div className="col-12 text-end">
                                        <button className="me-2 btn btn-sm btn-outline-secondary" type="button" onClick={() => setShowUpdateDueDate(-1)}>
                                            Cancel
                                        </button>
                                        <button className="btn btn-sm btn-outline-success" type="submit">
                                            Save
                                        </button>
                                    </div>
                                    {error && <div className="alert alert-danger mt-1 mb-0 py-0 px-2 text-center"><small>{error}</small></div>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}