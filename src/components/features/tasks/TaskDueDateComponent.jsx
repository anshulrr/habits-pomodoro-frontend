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

    const [error, setError] = useState('')

    function createPastPomodoro() {
        setError('');
        if (!dueDate) {
            setError('Select date')
            return;
        }
        if (dueDate && repeat && (repeatDays === '' || repeatDays < 1)) {
            setError('Enter positive value')
            return;
        }

        task.dueDate = dueDate;
        task.repeatDays = repeat ? repeatDays : 0;

        updateTaskApi({ id: task.id, task })
            .then(response => {
                // console.debug(response)
                setShowUpdateDueDate(-1)
                setTasksReload(prevReload => prevReload + 1)
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="update-popup-2">
            <div className="row m-0 px-1 py-1">
                <div className="col-12 small px-0 text-start fw-bold">
                    Set {task.type === 'bad' ? 'Restrain' : 'Due'} Time
                </div>
                <div className="col-5 px-0 text-start">
                    <DatePicker
                        className="form-control form-control-sm"
                        selected={dueDate}
                        dateFormat="dd/MM/yyyy HH:mm"
                        minDate={new Date()}
                        showTimeSelect
                        timeFormat="HH:mm"
                        filterTime={filterPastTime}
                        onFocus={e => e.target.blur()}      // fix for keyboard open on focus on mobile device
                        onSelect={(date) => setDueDate(moment(date).endOf('date').toDate())}
                        onChange={(date) => setDueDate(date)}
                        autoFocus
                    />
                </div>

                <div className="col-7 px-0 text-start">
                    <div className="input-group input-group-sm justify-content-start">
                        <div className="input-group-text">
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
                        </div>
                        <label className="input-group-text" htmlFor="repeat">
                            <i className="bi bi-arrow-repeat" />
                        </label>
                        <input
                            type="number"
                            name="repeatDays"
                            className="form-control"
                            value={repeatDays}
                            min={1}
                            placeholder="Days"
                            disabled={!repeat}
                            onChange={(e) => setRepeatDays(e.target.value)}
                        />

                        <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setShowUpdateDueDate(-1)}>
                            <i className="bi bi-x-lg" />
                        </button>
                        <button className="btn btn-sm btn-outline-success" type="button" onClick={() => createPastPomodoro()}>
                            Save
                        </button>
                    </div>
                </div>
                {error && <div className="alert alert-danger mt-1 mb-0 py-0 px-2 text-center"><small>{error}</small></div>}
            </div>
        </div>
    )
}