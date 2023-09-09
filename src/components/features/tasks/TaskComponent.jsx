import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'

import { Formik, Form, ErrorMessage, Field } from 'formik'
import ReactDatePicker from 'react-datepicker'

import moment from 'moment'

import { retrieveTaskApi, updateTaskApi } from 'services/api/TaskApiService'

// export default function TaskComponent({ project, task, setTasks, tasks }) {
export default function TaskComponent() {

    const { project_id, id } = useParams()

    const { state } = useLocation();

    const [description, setDescription] = useState('')

    const [pomodoroLength, setPomodoroLength] = useState(0)    // todo: get this from user settings

    const [priority, setPriority] = useState(1)

    const [dueDate, setDueDate] = useState(null)

    const [status, setStatus] = useState('added')

    const navigate = useNavigate()

    useEffect(
        () => retrieveTask()
        , []  // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveTask() {
        retrieveTaskApi(project_id, id)
            .then(response => {
                setDescription(response.data.description)
                setPomodoroLength(response.data.pomodoroLength)
                setPriority(response.data.priority)
                setStatus(response.data.status)
                if (response.data.dueDate) {
                    setDueDate(moment(response.data.dueDate).toDate())
                }
            })
            .catch(error => console.error(error.message))
    }

    function onSubmit(values) {
        // console.debug(values, id)
        const task = {
            id,
            description: values.description,
            pomodoroLength: values.pomodoroLength,
            priority: values.priority,
            status: values.status,
            dueDate: moment(dueDate).endOf('date').toDate(),
        }

        updateTaskApi(project_id, id, task)
            .then(response => {
                // console.debug(response)
                navigate(-1, { state })
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
        // console.debug(values)
        return errors
    }

    return (
        <div className="container mt-3">
            <h6>
                <span className="me-1" style={{ color: state.project.color }}>&#9632;</span>
                {state.project.name}
            </h6>
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
                                        <label htmlFor="description">Description</label>
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
                                        <div>
                                            <label htmlFor="dueDate">Due Date <i className="bi bi-calendar-check" /></label>
                                        </div>
                                        <ReactDatePicker
                                            className="form-control form-control-sm"
                                            id="dueDate"
                                            selected={dueDate}
                                            dateFormat="dd/MM/yyyy"
                                            minDate={new Date()}
                                            onFocus={e => e.target.blur()}      // fix for keyboard open on focus on mobile devide
                                            onChange={(date) => setDueDate(date)}
                                        />
                                    </div>
                                    <div className="col-lg-4 mb-3">
                                        <label htmlFor="status">Status</label>
                                        <Field as="select" className="form-select form-select-sm" id="status" name="status">
                                            {/* disabled option with value 0 for dropdown to avoid confusion of initial selection */}
                                            <option value="added">current</option>
                                            <option value="completed">completed</option>
                                            <option value="archived">archived</option>
                                        </Field>
                                    </div>
                                    <div className="col-lg-12 mb-3 text-end">
                                        <button className="me-2 btn btn-sm btn-outline-secondary" type="button" onClick={() => navigate(-1, { state })}>Cancel</button>
                                        <button className="btn btn-sm btn-outline-success" type="submit">Save Task</button>
                                    </div>
                                </div>
                            </Form>
                        )
                    }
                </Formik>
            </div>
        </div>
    )
}