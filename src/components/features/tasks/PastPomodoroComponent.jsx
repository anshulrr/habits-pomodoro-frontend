import { useState } from 'react'

import moment from 'moment';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useAuth } from 'services/auth/AuthContext';
import { createPastPomodoroApi } from "services/api/PomodoroApiService";

export default function PastPomodoroComponent({ showCreatePastPomodoro, setShowCreatePastPomodoro, task, project, setPomodorosListReload, setTasksReload }) {
    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const [errorMessage, setErrorMessage] = useState('')

    const [date, setDate] = useState(moment().startOf('date').toDate())

    const [minutesElapsed, setMinutesElapsed] = useState(task.pomodoroLength || project.pomodoroLength || userSettings.pomodoroLength)

    function handleOnChange(fun, val) {
        setErrorMessage('')
        if (val === '' || val <= 0 || val > (task.pomodoroLength || project.pomodoroLength || userSettings.pomodoroLength)) {
            setErrorMessage("mintues for past pomodoro must be less than task length")
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

    return (
        showCreatePastPomodoro === task.id &&
        <div className="row m-0 px-0 pt-1">
            <div className="col-4 px-0 text-end">
                <DatePicker
                    className="form-control form-control-sm"
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => setDate(date)}
                />
            </div>

            <div className="col-8 px-0 text-end">
                <div className="input-group text-end">
                    <input
                        type="number"
                        name="minutesElpased"
                        className="form-control form-control-sm"
                        value={minutesElapsed}
                        min={1}
                        placeholder="Minutes"
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
            <div className="text-danger"><small>{errorMessage}</small></div>
        </div>
    )
}