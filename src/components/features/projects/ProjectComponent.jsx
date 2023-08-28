import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { createProjectApi, retrieveProjectApi, updateProjectApi } from 'services/api/ProjectApiService'
import { retrieveAllProjectCategoriesApi } from "services/api/ProjectCategoryApiService";

import { Formik, ErrorMessage, Field } from 'formik'

export default function ProjectComponent() {

    const { id } = useParams()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [projectCategoryId, setProjectCategoryId] = useState(0)   // value for disabled option in dropdown
    const [color, setColor] = useState('#228B22')
    const [pomodoroLength, setPomodoroLength] = useState(0)
    const [priority, setPriority] = useState(1)
    const [projectCategories, setProjectCategories] = useState([])

    const navigate = useNavigate()
    const { state } = useLocation();

    useEffect(
        () => {
            (() => {
                // console.debug('re-render ProjectComponents')
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
            .catch(error => console.error(error.message))
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
                setPriority(response.data.priority)
                // todo: set project projectCategory id: done
                setProjectCategoryId(response.data.projectCategoryId)
            })
            .catch(error => console.error(error.message))
    }

    function onSubmit(values) {
        // console.debug({ name, description, projectCategoryId, color, pomodoroLength })
        // console.debug(values)
        const project = {
            id,
            name: values.name,
            description: values.description,
            color: values.color,
            pomodoroLength: values.pomodoroLength,
            priority: values.priority,
            projectCategoryId: values.project_category_id
        }

        if (parseInt(id) === -1) {
            createProjectApi(project)
                .then(response => {
                    // console.debug(response)
                    state.project = response.data;
                    navigate('/projects', { state, replace: true })
                })
                .catch(error => console.error(error.message))
        } else {
            updateProjectApi(id, project)
                .then(response => {
                    // console.debug(response)
                    navigate('/projects', { state: { project: response.data }, replace: true })
                })
                .catch(error => console.error(error.message))
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
        <div className="container">
            <h6>Enter Project Details </h6>
            <div>
                <Formik initialValues={{ name, description, color, pomodoroLength, priority, project_category_id: projectCategoryId }}
                    enableReinitialize={true}
                    onSubmit={onSubmit}
                    validate={validate}
                    validateOnChange={false}
                    validateOnBlur={false}
                >
                    {
                        ({ errors, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="row small text-start text-secondary">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="name">Project Name</label>
                                        <Field type="text" className="form-control form-control-sm" id="name" name="name" placeholder="Project Name" />
                                        <ErrorMessage name="name" component="div" className="small text-danger" />
                                    </div>
                                    <div className="col-md-8 mb-3">
                                        <label htmlFor="description">Description</label>
                                        <Field type="text" className="form-control form-control-sm" id="description" name="description" placeholder="Description" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="color">Project Color</label>
                                        <Field type="color" className="form-control form-control-sm" id="color" name="color" placeholder="color" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="pomodoroLength">Default Pomodoro Length <i className="bi bi-hourglass" /></label>
                                        <Field type="number" className="form-control form-control-sm" min="0" id="pomodoroLength" name="pomodoroLength" placeholder="Default Pomodoro Length" />
                                        <small>(To use general settings, set length to zero)</small>
                                        {errors.pomodoroLength && <div className="text-danger small">{errors.pomodoroLength}</div>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="priority">Priority <i className="bi bi-arrow-up" /></label>
                                        <Field type="number" className="form-control form-control-sm" min="1" id="priority" name="priority" placeholder="Priority" />
                                        {errors.priority && <div className="text-danger small">{errors.priority}</div>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="project_category_id">Project Category <i className="bi bi-link-45deg" /></label>
                                        <Field as="select" className="form-select form-select-sm" id="project_category_id" name="project_category_id">
                                            {/* disabled option with value 0 for dropdown to avoid confusion of initial selection */}
                                            <option value="0" disabled>Select a Category</option>
                                            {
                                                projectCategories.map(
                                                    projectCategory => (
                                                        <option key={projectCategory.id} value={projectCategory.id}>{projectCategory.name}</option>
                                                    )
                                                )
                                            }
                                        </Field>
                                        {errors.project_category_id && <div className="text-danger small">{errors.project_category_id}</div>}
                                        {/* <ErrorMessage name="project_category_id" component="div" className="text-danger small" /> */}
                                    </div>
                                    <div className="col-md-12 mb-3 text-end">
                                        <button className="me-2 btn btn-sm btn-outline-secondary" type="button" onClick={() => navigate('/projects', { state, replace: true })}>Cancel</button>
                                        <button className="btn btn-sm btn-outline-success" type="submit">Save Project</button>
                                    </div>
                                </div>
                            </form>
                        )
                    }
                </Formik>
            </div>
        </div>
    )
}