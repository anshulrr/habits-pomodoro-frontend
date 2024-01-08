import { useEffect, useState } from 'react'

import ReactDatePicker from 'react-datepicker'

import moment from 'moment'

import { retrieveTaskApi, updateTaskApi } from 'services/api/TaskApiService'
import { filterPastTime } from 'services/helpers/helper'
import { COLOR_MAP } from 'services/helpers/listsHelper'

import { SwitchProjectComponent } from './SwitchProjectComponent'

export default function UpdateTaskComponent({
    task,
    setShowUpdateTaskId,
    setTasksReload
}) {

    const [description, setDescription] = useState('')
    const [pomodoroLength, setPomodoroLength] = useState(0)    // todo: get this from user settings
    const [priority, setPriority] = useState(1)
    const [dueDate, setDueDate] = useState(null)
    const [status, setStatus] = useState('current')
    const [type, setType] = useState('neutral')

    const [repeat, setRepeat] = useState(false)
    const [repeatDays, setRepeatDays] = useState(0)
    const [dailyLimit, setDailyLimit] = useState(1)

    const [enableNotifications, setEnableNotifications] = useState(false)

    const [errors, setErrors] = useState({})

    const [projectId, setProjectId] = useState(task.project.id);
    const [switchProject, setSwitchProject] = useState(false);

    const [showLoader, setShowLoader] = useState(true)

    useEffect(
        () => retrieveTask()
        , []  // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveTask() {
        retrieveTaskApi({ id: task.id })
            .then(response => {
                const data = response.data
                setDescription(data.description)
                setPomodoroLength(data.pomodoroLength)
                setPriority(data.priority)
                setStatus(data.status)
                setType(data.type)
                if (data.dueDate) {
                    setDueDate(moment(data.dueDate).toDate())
                }
                if (data.repeatDays !== 0) {
                    setRepeat(true)
                }
                setRepeatDays(data.repeatDays)
                setDailyLimit(data.dailyLimit)
                setEnableNotifications(data.enableNotifications)
                setShowLoader(false)
            })
            .catch(error => console.error(error.message))
    }

    function onSubmit(error) {
        error.preventDefault();

        // console.debug(values)
        const updated_task = {
            id: task.id,
            description,
            pomodoroLength,
            priority,
            status,
            type,
            dueDate,
            repeatDays: repeat ? repeatDays : 0,
            dailyLimit,
            enableNotifications,
            projectId
        }

        if (!validate(updated_task)) {
            return;
        }

        updateTaskApi({ id: task.id, task: updated_task })
            .then(response => {
                // console.debug(response)
                // navigate(-1, { state })
                setShowUpdateTaskId(-1)
                setTasksReload(prevReload => prevReload + 1)
            })
            .catch(error => console.error(error.message))
    }

    function validate(task) {
        let errors = {}
        let validated = true;
        if (task.description.length < 2) {
            errors.description = 'Enter atleast 2 characters'
            validated = false;
        }
        if (task.pomodoroLength === '' || task.pomodoroLength < 0) {
            errors.pomodoroLength = 'Enter zero or positive value'
            validated = false;
        }
        if (task.priority === '' || task.priority < 1) {
            errors.priority = 'Enter positive value'
            validated = false;
        }
        if (dueDate && repeat && (repeatDays === '' || repeatDays < 1)) {
            errors.repeatDays = 'Enter positive value'
            validated = false;
        }
        if (dailyLimit === '' || dailyLimit < 0) {
            errors.dailyLimit = 'Enter zero or positive value'
            validated = false;
        }
        if (!task.projectId) {
            validated = false;
        }
        setErrors(errors);
        // console.debug(errors)
        return validated;
    }

    return (
        <div className="task-overlay">
            <div className="task-popup">
                <div className="task-close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowUpdateTaskId(-1)}></i>
                </div>
                <div className="container mt-3">
                    <h6>
                        Update Task Details
                        {
                            showLoader &&
                            <span className="loader-container-2" >
                                <span className="ms-1 loader-2"></span>
                            </span>
                        }
                    </h6>

                    {
                        !showLoader &&
                        <div>
                            <form onSubmit={onSubmit}>
                                <div className="row small text-start text-secondary">
                                    <div className="col-lg-12 mb-3">
                                        <label htmlFor="description">Task Description</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="description"
                                            name="description"
                                            placeholder="Description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <div className="text-danger small">{errors.description}</div>
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                        <label htmlFor="type">
                                            Habit Type
                                            <i className={"ms-1 bi bi-list-ul text-" + COLOR_MAP[type]} />
                                        </label>
                                        <select
                                            className="form-select form-select-sm"
                                            id="type"
                                            name="type"
                                            value={type}
                                            onChange={(e) => {
                                                const type = e.target.value;
                                                setType(type);
                                                if (type === 'bad') {
                                                    setEnableNotifications(false);
                                                }
                                            }}
                                        >
                                            <option value="neutral">Neutral</option>
                                            <option value="good">Good</option>
                                            <option value="bad">Bad</option>
                                        </select>
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                        <label htmlFor="pomodoroLength">Pomodoro Length (mins) <i className="bi bi-hourglass" /></label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            min="0"
                                            id="pomodoroLength"
                                            name="pomodoroLength"
                                            placeholder="Default Pomodoro Length (mins)"
                                            required
                                            value={pomodoroLength}
                                            onChange={(e) => setPomodoroLength(e.target.value)}
                                        />
                                        <small>(To use Default Pomodoro Length of the Project, set value to zero)</small>
                                        <div className="text-danger small">{errors.pomodoroLength}</div>
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                        <label htmlFor="type">Pomodoros Count (Daily Required / Daily Limit)</label>
                                        <input
                                            type="number"
                                            name="dailyLimit"
                                            className="form-control form-control-sm"
                                            min={0}
                                            placeholder="Expected Count"
                                            required
                                            value={dailyLimit}
                                            onChange={(e) => setDailyLimit(e.target.value)}
                                        />
                                        <div className="text-danger small">{errors.dailyLimit}</div>
                                    </div>
                                    <div className="col-lg-4 col-6 mb-3">
                                        <div>
                                            <label htmlFor="updateDueDate">{type === 'bad' ? 'Restrain untill' : 'Due by'} <i className={type === 'bad' ? "bi bi-calendar-x" : "bi bi-calendar-check"} /></label>
                                        </div>
                                        <ReactDatePicker
                                            className="form-control form-control-sm"
                                            id="updateDueDate"
                                            selected={dueDate}
                                            dateFormat="yyyy MMM dd, HH:mm"
                                            minDate={new Date()}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            filterTime={filterPastTime}
                                            onFocus={e => e.target.blur()}      // fix for keyboard open on focus on mobile devide
                                            onSelect={(date) => setDueDate(moment(date).endOf('date').toDate())}
                                            onChange={(date) => setDueDate(date)}
                                        />
                                    </div>
                                    <div className="col-lg-4 col-6 mb-3">
                                        <label htmlFor="repeatDueDate">Repeat after (days) <i className="bi bi-arrow-repeat" /></label>
                                        <div className="input-group input-group-sm">

                                            <div className="input-group-text px-1">
                                                <input
                                                    type="checkbox"
                                                    name="repeat"
                                                    id="repeatDueDate"
                                                    className="form-check-input mt-0"
                                                    checked={repeat}
                                                    disabled={dueDate === null}
                                                    onChange={(e) => {
                                                        const val = e.target.checked;
                                                        setRepeat(val)
                                                        setRepeatDays(val ? 1 : 0);
                                                    }}
                                                />
                                                <label className="lh-1 my-auto" htmlFor="repeatDueDate">
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
                                            />
                                        </div>
                                        <div className="text-danger small">{errors.repeatDays}</div>
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                        <label htmlFor="enableNotifications">
                                            Enable Notification for Due Time <i className="bi bi-bell"></i>
                                        </label>
                                        <div className="input-group input-group-sm mb-2">
                                            <div className="input-group-text px-1">
                                                <input
                                                    type="checkbox"
                                                    name="enableNotifications"
                                                    className="form-check-input mt-0"
                                                    disabled={dueDate === null || type === 'bad'}
                                                    checked={enableNotifications}
                                                    onChange={(e) => setEnableNotifications(e.target.checked)}
                                                    id="enableNotifications"
                                                />
                                                <label className="" htmlFor="enableNotifications">
                                                    <i className="ms-1 bi bi-bell"></i>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                        <label htmlFor="priority">Order <i className="bi bi-arrow-up" /></label>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            min="1"
                                            id="priority"
                                            name="priority"
                                            placeholder="Order"
                                            required
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value)}
                                        />
                                        <small>(Lower numbered tasks appears at the top of the list)</small>
                                        <div className="text-danger small">{errors.priority}</div>
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                        <label htmlFor="status">Status</label>
                                        <select
                                            className="form-select form-select-sm"
                                            id="status"
                                            name="status"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            {/* disabled option with value 0 for dropdown to avoid confusion of initial selection */}
                                            <option value="current">Current</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>

                                    {
                                        !switchProject &&
                                        <div className="col-12">
                                            Switch Project
                                            <button className="btn btn-sm btn-outline-secondary py-0 px-1 ms-1" type="button" onClick={() => setSwitchProject(true)}>
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                        </div>
                                    }

                                    <div className="col-12 mb-3">
                                        {
                                            switchProject &&
                                            <SwitchProjectComponent
                                                projectId={projectId}
                                                setProjectId={setProjectId}
                                            />
                                        }
                                    </div>


                                    <div className="col-lg-12 mb-3 text-end">
                                        <button className="me-2 btn btn-sm btn-outline-secondary" type="button" onClick={() => setShowUpdateTaskId(-1)}>Cancel</button>
                                        <button className="btn btn-sm btn-outline-success" type="submit">Save Task</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}