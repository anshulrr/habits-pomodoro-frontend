import { useState } from 'react'

import moment from 'moment';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { updateTaskApi } from 'services/api/TaskApiService';
import { filterPastTime } from 'services/helpers/helper';

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
                <div className="container my-3">
                    <div className="">
                        <div className="">
                            <h6 className="ms-2 text-center">
                                <i className="me-1 bi bi-list-ul" />
                                {task.description}
                            </h6>
                            <form onSubmit={handleSubmit}>
                                <div className="row px-1 py-1 small text-secondary text-start">
                                    <div className="col-lg-4 col-6 text-start mb-3">
                                        <div>
                                            <label htmlFor="dueDate">{task.type === 'bad' ? 'Restrain' : 'Due'} Time <i className={task.type === 'bad' ? "bi bi-calendar-x" : "bi bi-calendar-check"} /></label>
                                        </div>
                                        <DatePicker
                                            className="form-control form-control-sm"
                                            selected={dueDate}
                                            dateFormat="yyyy MMM d, HH:mm"
                                            minDate={new Date()}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            filterTime={filterPastTime}
                                            onFocus={e => e.target.blur()}      // fix for keyboard open on focus on mobile device
                                            onSelect={(date) => setDueDate(moment(date).endOf('date').toDate())}
                                            onChange={(date) => setDueDate(date)}
                                            autoFocus
                                            required
                                        />
                                    </div>

                                    <div className="col-lg-4 col-6 text-start mb-3">
                                        <label htmlFor="repeat">Repeat after (days) <i className="bi bi-arrow-repeat" /></label>
                                        <div className="input-group input-group-sm justify-content-start">
                                            <div className="input-group-text px-1">
                                                <input
                                                    type="checkbox"
                                                    name="repeat"
                                                    id="repeat"
                                                    className="form-check-input mt-0"
                                                    checked={repeat}
                                                    disabled={dueDate === null}
                                                    onChange={(e) => {
                                                        const val = e.target.checked;
                                                        setRepeat(val)
                                                        setRepeatDays(val ? 1 : 0);
                                                    }}
                                                />
                                                <label className="my-auto lh-1" htmlFor="repeat">
                                                    <i className="ms-1 bi bi-arrow-repeat" />
                                                </label>
                                            </div>
                                            <input
                                                type="number"
                                                name="repeatDays"
                                                className="form-control"
                                                value={repeatDays}
                                                min={1}
                                                placeholder="Days"
                                                disabled={!repeat}
                                                onChange={(e) => setRepeatDays(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>


                                    {
                                        task.type !== 'bad' &&
                                        <div className="col-lg-4 text-start mb-3">
                                            <label htmlFor="enableNotifications">
                                                Enable Notification for Due Time <i className="bi bi-bell"></i>
                                            </label>
                                            <div className="input-group input-group-sm justify-content-start">

                                                <div className="input-group-text px-1">
                                                    <input
                                                        type="checkbox"
                                                        name="eNotifications"
                                                        className="form-check-input mt-0"
                                                        disabled={dueDate === null}
                                                        checked={enableNotifications}
                                                        onChange={(e) => setEnableNotifications(e.target.checked)}
                                                        id="eNotifications"
                                                    />
                                                    <label className="" htmlFor="eNotifications">
                                                        <i className="ms-1 bi bi-bell" />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    }
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