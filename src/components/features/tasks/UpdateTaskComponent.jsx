import { useEffect, useState } from 'react'

import { Formik, Form, ErrorMessage, Field } from 'formik'
import ReactDatePicker from 'react-datepicker'

import moment from 'moment'

import { retrieveTaskApi, updateTaskApi } from 'services/api/TaskApiService'
import { filterPastTime } from 'services/helpers/helper'

export default function UpdateTaskComponent({ task, setShowUpdateTaskId, setTasksReload }) {

    const [description, setDescription] = useState('')

    const [pomodoroLength, setPomodoroLength] = useState(0)    // todo: get this from user settings

    const [priority, setPriority] = useState(1)

    const [dueDate, setDueDate] = useState(null)

    const [status, setStatus] = useState('current')

    const [repeat, setRepeat] = useState(false)
    const [repeatDays, setRepeatDays] = useState(0)

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
        // console.debug(values)
        const updated_task = {
            id: task.id,
            description: values.description,
            pomodoroLength: values.pomodoroLength,
            priority: values.priority,
            status: values.status,
            dueDate: dueDate,
            repeatDays: repeat ? repeatDays : 0
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
                            <Formik initialValues={{ description, pomodoroLength, priority, status, dueDate }}
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
                                                <div className="col-lg-4 col-6 mb-3">
                                                    <div>
                                                        <label htmlFor="dueDate">Due Date <i className="bi bi-calendar-check" /></label>
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
                                                {
                                                    dueDate &&
                                                    <div className="col-lg-4 col-6 mb-3">
                                                        <label htmlFor="repeat">Repeat Due Date after Completion <i className="bi bi-arrow-repeat" /></label>
                                                        <div className="input-group input-group-sm">

                                                            <div className="input-group-text">
                                                                <input
                                                                    type="checkbox"
                                                                    name="repeat"
                                                                    className="form-check-input mt-0"
                                                                    checked={repeat}
                                                                    onChange={(e) => {
                                                                        setRepeat(e.target.checked)
                                                                        setRepeatDays(1)
                                                                    }}
                                                                    id="repeat"
                                                                />
                                                            </div>

                                                            {
                                                                repeat &&
                                                                <input
                                                                    type="number"
                                                                    name="repeatDays"
                                                                    className="form-control"
                                                                    value={repeatDays}
                                                                    min={1}
                                                                    placeholder="Repeat After Days"
                                                                    onChange={(e) => setRepeatDays(e.target.value)}
                                                                />
                                                            }
                                                        </div>
                                                        <div className="text-danger small">{props.errors.repeatDays}</div>
                                                    </div>
                                                }


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