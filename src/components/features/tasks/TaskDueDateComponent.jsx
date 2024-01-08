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
        <form onSubmit={handleSubmit}>
            <div className="row m-0 px-1 py-1">
                <div className="col-6 px-0 text-start">
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

                <div className="col-2 px-0 text-center">
                    <div className="input-group input-group-sm justify-content-center">
                        {
                            task.type !== 'bad' &&
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
                        }
                    </div>
                </div>

                <div className="col-4 px-0 text-end">
                    <div className="input-group input-group-sm justify-content-end">
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
                <div className="col-12 px-0 text-end">
                    <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setShowUpdateDueDate(-1)}>
                        <i className="bi bi-x-lg" />
                    </button>
                    <button className="btn btn-sm btn-outline-success" type="submit">
                        Save
                    </button>
                </div>
                {error && <div className="alert alert-danger mt-1 mb-0 py-0 px-2 text-center"><small>{error}</small></div>}
            </div>
        </form>
    )
}