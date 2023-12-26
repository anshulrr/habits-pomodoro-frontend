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

    const [errorMessage, setErrorMessage] = useState('')

    const [date, setDate] = useState(moment().toDate())

    const [minutesElapsed, setMinutesElapsed] = useState(task.pomodoroLength || task.project.pomodoroLength || userSettings.pomodoroLength)

    function handleOnChange(fun, val) {
        setErrorMessage('')
        if (val === '' || val <= 0 || val > (task.pomodoroLength || task.project.pomodoroLength || userSettings.pomodoroLength)) {
            setErrorMessage("mintues for past pomodoro must be less than task settings")
        }

        fun(val)
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
        <div className="update-popup-2">
            <div className="row m-0 px-1 py-1">
                <div className="col-12 small px-0 text-start fw-bold">
                    Add Past Pomodoro
                </div>
                <div className="col-6 px-0 text-start">
                    <DatePicker
                        className="form-control form-control-sm"
                        selected={date}
                        dateFormat="dd/MM/yyyy HH:mm"
                        maxDate={new Date()}
                        showTimeSelect
                        timeFormat="HH:mm"
                        filterTime={filterFutureTime}
                        onFocus={e => e.target.blur()}      // fix for keyboard open on focus on mobile device
                        onChange={(date) => setDate(date)}
                        autoFocus
                    />
                </div>

                <div className="col-6 px-0 text-start">
                    <div className="input-group justify-content-end">
                        <input
                            type="number"
                            name="minutesElpased"
                            className="form-control form-control-sm"
                            value={minutesElapsed}
                            min={1}
                            placeholder="Past Pomodoro Minutes"
                            onChange={(e) => handleOnChange(setMinutesElapsed, e.target.value)}
                        />
                        <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setShowCreatePastPomodoro(-1)}>
                            <i className="bi bi-x-lg" />
                        </button>
                        <button className="btn btn-sm btn-outline-success" type="button" onClick={() => createPastPomodoro()}>
                            Save
                        </button>
                    </div>
                </div>
                {errorMessage && <div className="alert alert-danger mt-1 mb-0 py-0 px-2 text-center"><small>{errorMessage}</small></div>}
            </div>
        </div>
    )
}