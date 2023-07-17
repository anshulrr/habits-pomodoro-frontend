import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { createTaskApi, retrieveTaskApi, updateTaskApi } from '../services/api/TaskApiService'
import { Formik, Form, ErrorMessage, Field } from 'formik'

export default function TaskComponent() {

    const { project_id, id } = useParams()

    const { state } = useLocation();

    const [description, setDescription] = useState('')

    const [pomodoroLength, setPomodoroLength] = useState(0)    // todo: get this from user settings

    const [status, setStatus] = useState('added')

    const navigate = useNavigate()

    useEffect(
        () => retrieveTask()
        , []  // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveTask() {
        if (parseInt(id) === -1) {
            return;
        }

        retrieveTaskApi(project_id, id)
            .then(response => {
                setDescription(response.data.description)
                setPomodoroLength(response.data.pomodoroLength)
                setStatus(response.data.status)
            })
            .catch(error => console.error(error.message))
    }

    function onSubmit(values) {
        // console.log(values, id)
        const task = {
            id,
            description: values.description,
            pomodoroLength: values.pomodoroLength,
            status: values.status
        }

        if (parseInt(id) === -1) {
            createTaskApi(project_id, task)
                .then(response => {
                    // console.log(response)
                    navigate(`/projects`, { state: { project: state.project } })
                })
                .catch(error => console.error(error.message))
        } else {
            updateTaskApi(project_id, id, task)
                .then(response => {
                    // console.log(response)
                    navigate(`/projects`, { state: { project: state.project } })
                })
                .catch(error => console.error(error.message))
        }
    }

    function validate(values) {
        let errors = {}
        if (values.description.length < 2) {
            errors.description = 'Enter atleast 2 characters'
        }
        if (values.pomodoroLength === '' || values.pomodoroLength < 0) {
            errors.pomodoroLength = 'Enter zero or positive value'
        }
        // console.log(values)
        return errors
    }

    return (
        <div className="container">
            <h4>{state.project.name}</h4>
            <div>
                <Formik initialValues={{ description, pomodoroLength, status }}
                    enableReinitialize={true}
                    onSubmit={onSubmit}
                    validate={validate}
                    validateOnChange={false}
                    validateOnBlur={false}
                >
                    {
                        (props) => (
                            <Form>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <Field type="text" className="form-control form-control-sm" name="description" placeholder="Description" />
                                        <ErrorMessage name="description" component="small" className="text-danger small" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <Field type="number" className="form-control form-control-sm" name="pomodoroLength" placeholder="Default Pomodoro Length" />
                                        <small>(To use project's settings, set length to zero)</small>
                                        {props.errors.pomodoroLength && <div className="text-danger small">{props.errors.pomodoroLength}</div>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <Field as="select" className="form-select form-select-sm" name="status">
                                            {/* disabled option with value 0 for dropdown to avoid confusion of initial selection */}
                                            <option value="added">added</option>
                                            <option value="completed">completed</option>
                                        </Field>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <button className="btn btn-sm btn-success" type="submit">Save Task</button>
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