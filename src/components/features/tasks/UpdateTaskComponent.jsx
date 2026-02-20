import { useEffect, useState } from 'react'

import moment from 'moment'

import { retrieveTaskApi, updateTaskApi } from 'services/api/TaskApiService'
import { COLOR_MAP } from 'services/helpers/listsHelper'

import { SwitchProjectComponent } from './SwitchProjectComponent'
import DueDateInputComponent from './DueDateInputComponent'

export default function UpdateTaskComponent({
    task,
    setShowUpdateTaskId,
    setTasksReload
}) {

    const [description, setDescription] = useState('')
    const [pomodoroLength, setPomodoroLength] = useState(0)    // todo: get this from user settings
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
                <div className="container mt-4">
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
                                </div>

                                <DueDateInputComponent
                                    type={type}
                                    dueDate={dueDate}
                                    setDueDate={setDueDate}
                                    repeat={repeat}
                                    setRepeat={setRepeat}
                                    repeatDays={repeatDays}
                                    setRepeatDays={setRepeatDays}
                                    enableNotifications={enableNotifications}
                                    setEnableNotifications={setEnableNotifications}
                                    autofocus={false}
                                    required={false}
                                    updatePopup={2}
                                />

                                <div className="row small text-secondary text-start">
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