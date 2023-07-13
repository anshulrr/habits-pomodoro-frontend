import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { createTaskApi } from '../services/api/TaskApiService'
import { Formik, Form, ErrorMessage, Field } from 'formik'

export default function TaskComponent() {

    const { project_id, id } = useParams()

    const { state } = useLocation();

    const [description] = useState('')

    const [pomodoroLength] = useState(state.project.pomodoroLength)    // todo: get this from user settings

    const navigate = useNavigate()

    function onSubmit(values) {
        // console.log(values, id)
        const task = {
            id,
            description: values.description,
            pomodoroLength: values.pomodoroLength
        }

        if (parseInt(id) === -1) {
            createTaskApi(project_id, task)
                .then(response => {
                    // console.log(response)
                    navigate(`/projects`, { state: { project: state.project } })
                })
                .catch(error => console.log(error))
        }
    }

    function validate(values) {
        let errors = {}

        if (values.description.length < 2) {
            errors.description = 'Enter atleast 2 characters'
        }

        // console.log(values)
        return errors
    }

    return (
        <div className="container">
            <h1>{state.project.name}</h1>
            <h6>Provide Task Details</h6>
            <div>
                <Formik initialValues={{ description, pomodoroLength }}
                    enableReinitialize={true}
                    onSubmit={onSubmit}
                    validate={validate}
                    validateOnChange={false}
                    validateOnBlur={false}
                >
                    {
                        (props) => (
                            <Form>
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="alert alert-warning"
                                />

                                <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="alert alert-warning"
                                />

                                <fieldset className="form-group">
                                    <label>Description</label>
                                    <Field type="text" className="form-control" name="description" />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Default Pomodoro Length </label>
                                    <Field type="number" className="form-control" name="pomodoroLength" />
                                    <small>(Set it to zero, if you want to use project's settings)</small>
                                </fieldset>
                                <div>
                                    <button className="btn btn-success m-5" type="submit">Save</button>
                                </div>
                            </Form>
                        )
                    }
                </Formik>
            </div>
        </div>
    )
}