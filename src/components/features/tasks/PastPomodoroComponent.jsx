import { useState } from 'react'

import moment from 'moment';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useAuth } from 'services/auth/AuthContext';
import { createPastPomodoroApi } from "services/api/PomodoroApiService";

export default function PastPomodoroComponent({
    setShowCreatePastPomodoro,
    task,
    setPomodorosListReload,
    setTasksReload
}) {
    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const [date, setDate] = useState(moment().toDate())

    const [minutesElapsed, setMinutesElapsed] = useState(task.pomodoroLength || task.project.pomodoroLength || userSettings.pomodoroLength)

    function handleOnChange(fun, val) {
        fun(val)
    }

    function handleSubmit(error) {
        error.preventDefault();

        if (minutesElapsed === '' || minutesElapsed <= 0 || minutesElapsed > (task.pomodoroLength || task.project.pomodoroLength || userSettings.pomodoroLength)) {
            return;
        }

        createPastPomodoro();
    }

    function createPastPomodoro() {
        const pomodoro_data = {
            startTime: date,
            endTime: date,
            timeElapsed: minutesElapsed * 60
        }

        createPastPomodoroApi(pomodoro_data, task.id)
            .then(response => {
                // console.debug(response)
                setShowCreatePastPomodoro(-1)
                setPomodorosListReload(prevReload => prevReload + 1)
                setTasksReload(prevReload => prevReload + 1)
            })
            .catch(error => {
                console.error(error.message)
            })
    }

    const filterFutureTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        return currentDate.getTime() > selectedDate.getTime();
    };

    return (
        <div className="task-overlay">
            <div className="task-popup">
                <div className="task-close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowCreatePastPomodoro(-1)}></i>
                </div>
                <div className="container my-3">
                    <div className="">
                        <div className="">
                            <h6 className="ms-2 text-center">
                                <i className="me-1 bi bi-list-ul" />
                                {task.description}
                            </h6>
                            <form onSubmit={handleSubmit}>
                                <div className="row px-1 py-1 small text-secondary">
                                    <div className="col-lg-4 text-start mb-3">
                                        <div>
                                            <label htmlFor="endTime">Add Past Pomodoro (End Time)</label>
                                        </div>

                                        <DatePicker
                                            className="form-control form-control-sm"
                                            id="endTime"
                                            selected={date}
                                            dateFormat="yyyy MMM d, HH:mm"
                                            maxDate={new Date()}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            filterTime={filterFutureTime}
                                            onFocus={e => e.target.blur()}      // fix for keyboard open on focus on mobile device
                                            onChange={(date) => setDate(date)}
                                            autoFocus
                                        />
                                    </div>

                                    <div className="col-lg-4 text-start mb-3">
                                        <div>
                                            <label htmlFor="timeSpend">Time Spent (mins) <i className="bi bi-hourglass" /></label>
                                        </div>
                                        <input
                                            type="number"
                                            name="minutesElpased"
                                            className="form-control form-control-sm"
                                            value={minutesElapsed}
                                            min={1}
                                            max={task.pomodoroLength || task.project.pomodoroLength || userSettings.pomodoroLength}
                                            required
                                            placeholder="Past Pomodoro Minutes"
                                            onChange={(e) => handleOnChange(setMinutesElapsed, e.target.value)}
                                        />
                                    </div>
                                    <div className="col-12 text-end">
                                        <button className="me-2 btn btn-sm btn-outline-secondary" type="button" onClick={() => setShowCreatePastPomodoro(-1)}>
                                            Cancel
                                        </button>
                                        <button className="btn btn-sm btn-outline-success" type="submit">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}