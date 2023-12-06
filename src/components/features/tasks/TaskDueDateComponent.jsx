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

    function createPastPomodoro() {
        task.dueDate = dueDate;

        updateTaskApi({ id: task.id, task })
            .then(response => {
                // console.debug(response)
                setShowUpdateDueDate(-1)
                setTasksReload(prevReload => prevReload + 1)
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="d-flex justify-content-end px-1 py-1">
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
            <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setShowUpdateDueDate(-1)}>
                <i className="bi bi-x-lg" />
            </button>
            <button className="btn btn-sm btn-outline-success" type="button" onClick={() => createPastPomodoro()}>
                Set Due Date
            </button>
        </div>
    )
}