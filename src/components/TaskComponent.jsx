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
            <h4>{state.project.name}</h4>
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

                                <div className="row">
                                    <div className="col-sm-6 mb-3">
                                        <Field type="text" className="form-control form-control-sm" name="description" placeholder="Description" />
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <Field type="number" className="form-control form-control-sm" name="pomodoroLength" placeholder="Default Pomodoro Length" />
                                        <small>(Set default pomodoro length to zero, if you want to use project's settings)</small>
                                    </div>
                                    <div className="col-sm-12 mb-3">
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