import { useEffect, useState } from 'react'

import { Formik, Form, ErrorMessage, Field } from 'formik'
import ReactDatePicker from 'react-datepicker'

import moment from 'moment'

import { retrieveTaskApi, updateTaskApi } from 'services/api/TaskApiService'
import { filterPastTime } from 'services/helpers/helper'

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
                setShowLoader(false)
            })
            .catch(error => console.error(error.message))
    }

    function onSubmit(values) {
        if (!projectId) {
            return;
        }
        // console.debug(values)
        const updated_task = {
            id: task.id,
            description: values.description,
            pomodoroLength: values.pomodoroLength,
            priority: values.priority,
            status: values.status,
            type: values.type,
            dueDate: dueDate,
            repeatDays: repeat ? repeatDays : 0,
            projectId: projectId
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

    function validate(values) {
        let errors = {}
        if (values.description.length < 2) {
            errors.description = 'Enter atleast 2 characters'
        }
        if (values.pomodoroLength === '' || values.pomodoroLength < 0) {
            errors.pomodoroLength = 'Enter zero or positive value'
        }
        if (values.priority === '' || values.priority < 1) {
            errors.priority = 'Enter positive value'
        }
        if (dueDate && repeat && (repeatDays === '' || repeatDays < 1)) {
            errors.repeatDays = 'Enter positive value'
        }
        // console.debug(values)
        return errors
    }

    return (
        <div className="task-overlay">
            <div className="task-popup">
                <div className="task-close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowUpdateTaskId(-1)}></i>
                </div>
                <div className="container mt-3">
                    <h6>
                        <span className="me-1" style={{ color: task.project.color }}>&#9632;</span>
                        {task.project.name}
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
                            <Formik initialValues={{ description, pomodoroLength, priority, status, type, dueDate }}
                                enableReinitialize={true}
                                onSubmit={onSubmit}
                                validate={validate}
                                validateOnChange={false}
                                validateOnBlur={false}
                            >
                                {
                                    (props) => (
                                        <Form>
                                            <div className="row small text-start text-secondary">
                                                <div className="col-lg-12 mb-3">
                                                    <label htmlFor="description">Task Description</label>
                                                    <Field type="text" className="form-control form-control-sm" id="description" name="description" placeholder="Description" />
                                                    <ErrorMessage name="description" component="small" className="text-danger small" />
                                                </div>
                                                <div className="col-lg-4 mb-3">
                                                    <label htmlFor="pomodoroLength">Default Pomodoro Length <i className="bi bi-hourglass" /></label>
                                                    <Field type="number" className="form-control form-control-sm" min="0" id="pomodoroLength" name="pomodoroLength" placeholder="Default Pomodoro Length" />
                                                    <small>(To use project's settings, set length to zero)</small>
                                                    {props.errors.pomodoroLength && <div className="text-danger small">{props.errors.pomodoroLength}</div>}
                                                </div>
                                                <div className="col-lg-4 mb-3">
                                                    <label htmlFor="priority">Priority <i className="bi bi-arrow-up" /></label>
                                                    <Field type="number" className="form-control form-control-sm" min="0" id="priority" name="priority" placeholder="Priority" />
                                                    {props.errors.priority && <div className="text-danger small">{props.errors.priority}</div>}
                                                </div>
                                                <div className="col-lg-4 mb-3">
                                                    <label htmlFor="status">Status</label>
                                                    <Field as="select" className="form-select form-select-sm" id="status" name="status">
                                                        {/* disabled option with value 0 for dropdown to avoid confusion of initial selection */}
                                                        <option value="current">current</option>
                                                        <option value="archived">archived</option>
                                                    </Field>
                                                </div>
                                                <div className="col-lg-4 mb-3">
                                                    <label htmlFor="type">Habit Type</label>
                                                    <Field as="select" className="form-select form-select-sm" id="type" name="type" onChange={(e) => { setType(e.target.value) }}>
                                                        <option value="neutral">neutral</option>
                                                        <option value="good">good</option>
                                                        <option value="bad">bad</option>
                                                    </Field>
                                                </div>
                                                <div className="col-lg-4 col-6 mb-3">
                                                    <div>
                                                        <label htmlFor="dueDate">{type === 'bad' ? 'Restrain' : 'Due'} Time <i className="bi bi-calendar-check" /></label>
                                                    </div>
                                                    <ReactDatePicker
                                                        className="form-control form-control-sm"
                                                        id="dueDate"
                                                        selected={dueDate}
                                                        dateFormat="dd/MM/yyyy HH:mm"
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
                                                    <label htmlFor="repeat">Repeat after (days) <i className="bi bi-arrow-repeat" /></label>
                                                    <div className="input-group input-group-sm">

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
                                                    </div>
                                                    <div className="text-danger small">{props.errors.repeatDays}</div>
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
                                        </Form>
                                    )
                                }
                            </Formik>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}