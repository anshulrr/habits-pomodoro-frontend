import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProjectApi, retrieveProjectApi, updateProjectApi } from '../services/api/ProjectApiService'
import { retrieveAllProjectCategoriesApi } from "../services/api/ProjectCategoryApiService";
import { Formik, Form, ErrorMessage, Field } from 'formik'

export default function ProjectComponent() {

    const { id } = useParams()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [projectCategoryId, setProjectCategoryId] = useState(0)
    const [color, setColor] = useState('#00FFFF')
    const [pomodoroLength, setPomodoroLength] = useState(0)
    const [projectCategories, setProjectCategories] = useState([])

    const navigate = useNavigate()

    useEffect(
        () => {
            (() => {
                // console.log('re-render ProjectComponents')
                retrieveProjectCategories()
                retrieveProject()
            })();
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveProjectCategories() {
        // TODO: decide limit
        retrieveAllProjectCategoriesApi(10, 0)
            .then(response => {
                setProjectCategories(response.data)
            })
            .catch(response => console.log(response))
    }

    function retrieveProject() {

        if (parseInt(id) === -1) {
            return;
        }

        retrieveProjectApi(id)
            .then(response => {
                setDescription(response.data.description)
                setName(response.data.name)
                setColor(response.data.color)
                setPomodoroLength(response.data.pomodoroLength)
                // todo: set project projectCategory id: done
                setProjectCategoryId(response.data.projectCategoryId)
            })
            .catch(error => console.log(error))
    }

    function onSubmit(values) {
        // console.log({ name, description, projectCategoryId, color, pomodoroLength })
        // console.log(values)
        const project = {
            id,
            name: values.name,
            description: values.description,
            color: values.color,
            pomodoroLength: values.pomodoroLength
        }

        if (parseInt(id) === -1) {
            createProjectApi(project, values.project_category_id)
                .then(response => {
                    console.log(response)
                    navigate('/projects', { state: { project: response.data } })
                })
                .catch(error => console.log(error))
        } else {
            updateProjectApi(id, project, values.project_category_id)
                .then(response => {
                    // console.log(response)
                    navigate('/projects', { state: { project: response.data } })
                })
                .catch(error => console.log(error))
        }
    }

    function validate(values) {
        let errors = {}
        if (values.name.length < 2) {
            errors.name = 'Enter atleast 2 characters'
        }
        if (values.project_category_id === 0) {
            errors.project_category_id = 'Select a category'
        }
        // console.log(values)
        return errors
    }

    return (
        <div className="container">
            <h1>Enter Project Details </h1>
            <div>
                <Formik initialValues={{ name, description, color, pomodoroLength, project_category_id: projectCategoryId }}
                    enableReinitialize={true}
                    onSubmit={onSubmit}
                    validate={validate}
                    validateOnChange={false}
                    validateOnBlur={false}

                >
                    {
                        ({ errors }) => (
                            <Form>
                                <fieldset className="form-group">
                                    <label>Project Name</label>
                                    <Field type="text" className="form-control" name="name" />
                                </fieldset>
                                <ErrorMessage name="name" component="div" className="small text-danger" />
                                <fieldset className="form-group">
                                    <label>Description</label>
                                    <Field type="text" className="form-control" name="description" />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Color</label>
                                    <Field type="color" className="form-control" name="color" />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Default Pomodoro Length </label>
                                    <Field type="number" className="form-control" name="pomodoroLength" />
                                    <small>(Set it to zero, if you want to use general pomodoro settings)</small>
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Category</label>
                                    <Field as="select" defaultValue="0" className="form-select" name="project_category_id">
                                        {/* default disabled value for dropdown to avoid confusion of initial selection */}
                                        <option value="0" disabled>Select a Category</option>
                                        {
                                            projectCategories.map(
                                                projectCategory => (
                                                    <option key={projectCategory.id} value={projectCategory.id}>{projectCategory.name}</option>
                                                )
                                            )
                                        }
                                    </Field>
                                </fieldset>
                                {errors.project_category_id && <div className="text-danger small">{errors.project_category_id}</div>}
                                {/* <ErrorMessage name="project_category_id" component="div" className="text-danger small" /> */}

                                <button className="btn btn-success m-5" type="submit">Save</button>
                            </Form>
                        )
                    }
                </Formik>
            </div>
        </div>
    )
}