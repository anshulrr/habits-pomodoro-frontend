import { useEffect, useState } from 'react'

import moment from 'moment'

import { COLOR_MAP } from 'services/helpers/listsHelper'

import { SwitchProjectComponent } from './SwitchProjectComponent'
import DueDateInputComponent from './DueDateInputComponent'
import { putItemToCache } from 'services/db/dbService'

export default function UpdateTaskComponent({
    task,
    setShowUpdateTaskId,
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

    const [projectId, setProjectId] = useState(task.projectId);
    const [switchProject, setSwitchProject] = useState(false);

    const [showLoader, setShowLoader] = useState(true)

    useEffect(
        () => retrieveTask()
        , []  // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveTask() {
        setDescription(task.description)
        setPomodoroLength(task.pomodoroLength)
        setStatus(task.status)
        setType(task.type)
        if (task.dueDate) {
            setDueDate(moment(task.dueDate).toDate())
        }
        if (task.repeatDays !== 0) {
            setRepeat(true)
        }
        setRepeatDays(task.repeatDays)
        setDailyLimit(task.dailyLimit)
        setEnableNotifications(task.enableNotifications)
        setShowLoader(false)
    }

    function onSubmit(error) {
        error.preventDefault();

        // console.debug(values)
        const updated_task = {
            ...task,
            id: task.id,
            description,
            pomodoroLength,
            status,
            type,
            dueDate,
            repeatDays: repeat ? repeatDays : 0,
            dailyLimit: dailyLimit,
            enableNotifications,
            projectId,
        }

        if (!validate(updated_task)) {
            return;
        }

        // TODO: Note: make sure numbers are correctly formatted, as form inputs return string values, storing them as string in cache will cause issues with validation and calculations in other parts of the app.
        // console.debug('update task:', { updated_task });
        putItemToCache('tasks', updated_task);

        // cleanup
        setShowUpdateTaskId(-1)
    }

    function validate(task) {
        // make sure numbers are not in string format
        // console.debug('validating task:', { task });
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
                                            onChange={(e) => setPomodoroLength(parseInt(e.target.value))}
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
                                            onChange={(e) => setDailyLimit(parseInt(e.target.value))}
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