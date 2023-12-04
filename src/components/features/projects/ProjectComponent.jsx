import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { createProjectApi, retrieveProjectApi, updateProjectApi } from 'services/api/ProjectApiService'
import { retrieveAllProjectCategoriesApi } from "services/api/ProjectCategoryApiService";

export default function ProjectComponent() {

    const { id } = useParams()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [projectCategoryId, setProjectCategoryId] = useState(0)   // value for disabled option in dropdown
    const [color, setColor] = useState('#818181')
    const [pomodoroLength, setPomodoroLength] = useState(0)
    const [priority, setPriority] = useState(1)
    const [projectCategories, setProjectCategories] = useState([])
    const [categoryColor, setCategoryColor] = useState('818181');
    const [errors, setErrors] = useState({})

    const navigate = useNavigate()
    const { state } = useLocation();

    useEffect(
        () => {
            (() => {
                // console.debug('re-render ProjectComponents')
                retrieveProjectCategories()
            })();
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveProjectCategories() {
        // TODO: decide limit
        retrieveAllProjectCategoriesApi(10, 0)
            .then(response => {
                setProjectCategories(response.data)
                retrieveProject(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function retrieveProject(categories) {

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
                setProjectCategoryId(response.data.projectCategoryId)
                for (const category of categories) {
                    if (category.id === response.data.projectCategoryId) {
                        setCategoryColor(category.color);
                    }
                }
            })
            .catch(error => console.error(error.message))
    }

    function handleSubmit(error) {
        error.preventDefault();

        // console.debug({ name, description, projectCategoryId, color, pomodoroLength })
        // console.debug(values)
        const project = {
            id,
            name,
            description,
            color,
            pomodoroLength,
            priority,
            projectCategoryId
        }

        if (!validate(project)) {
            return;
        }

        if (parseInt(id) === -1) {
            createProjectApi(project)
                .then(response => {
                    // console.debug(response)
                    state.project = response.data;
                    navigate('/', { state })
                    // navigate(-1, { state }) // NOTE: passing state with -1 doesn't work
                })
                .catch(error => console.error(error.message))
        } else {
            updateProjectApi(id, project)
                .then(response => {
                    // console.debug(response)
                    state.project = response.data;
                    navigate('/', { state })
                })
                .catch(error => console.error(error.message))
        }
    }

    function validate(project) {
        let errors = {}
        let result = true;
        if (project.name.length < 2) {
            errors.name = 'Enter atleast 2 characters'
            result = false;
        }
        if (project.projectCategoryId === 0) {
            errors.projectCategoryId = 'Select a category'
            result = false;
        }
        if (project.pomodoroLength === '' || project.pomodoroLength < 0) {
            errors.pomodoroLength = 'Enter zero or positive value'
            result = false;
        }
        if (project.priority === '' || project.priority < 1) {
            errors.priority = 'Enter positive value'
            result = false;
        }
        setErrors(errors);
        // console.debug(errors)
        return result;
    }

    return (
        <div className="container mt-3">
            <h6>Enter Project Details </h6>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="row small text-start text-secondary">
                        <div className="col-lg-4 mb-3">
                            <label htmlFor="name">Project Name</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                id="name"
                                name="name"
                                placeholder="Project Name"
                                value={name}
                                required
                                onChange={(e) => setName(e.target.value)}
                            />
                            <div className="text-danger"><small>{errors.name}</small></div>
                        </div>
                        <div className="col-lg-8 mb-3">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                id="description"
                                name="description"
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label htmlFor="color">Project Color</label>
                            <input
                                type="color"
                                className="form-control form-control-sm"
                                id="color"
                                name="color"
                                placeholder="color"
                                value={color}
                                required
                                onChange={(e) => setColor(e.target.value)}
                            />
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label htmlFor="pomodoroLength">Default Pomodoro Length <i className="bi bi-hourglass" /></label>
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                min="0" id="pomodoroLength"
                                name="pomodoroLength"
                                placeholder="Default Pomodoro Length"
                                value={pomodoroLength}
                                required
                                onChange={(e) => setPomodoroLength(e.target.value)}
                            />
                            <small>(To use general settings, set length to zero)</small>
                            <div className="text-danger small">{errors.pomodoroLength}</div>
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label htmlFor="priority">Priority <i className="bi bi-arrow-up" /></label>
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                min="1" id="priority"
                                name="priority"
                                placeholder="Priority"
                                value={priority}
                                required
                                onChange={(e) => setPriority(e.target.value)}
                            />
                            <div className="text-danger small">{errors.priority}</div>
                        </div>
                        <div className="col-lg-4 mb-3">
                            <label htmlFor="projectCategoryId">
                                Project Category
                                <i className="ms-1 bi bi-link-45deg" style={{ color: categoryColor }} />
                            </label>
                            <select
                                className="form-select form-select-sm"
                                id="projectCategoryId"
                                name="projectCategoryId"
                                value={projectCategoryId}
                                onChange={(e) => {
                                    const id = e.target.value;
                                    setProjectCategoryId(id)
                                    for (const category of projectCategories) {
                                        if (category.id === parseInt(id)) {
                                            setCategoryColor(category.color);
                                        }
                                    }
                                }}
                            >
                                {/* disabled option with value 0 for dropdown to avoid confusion of initial selection */}
                                <option value="0" disabled>Select a Category</option>
                                {
                                    projectCategories.map(
                                        projectCategory => (
                                            <option key={projectCategory.id} value={projectCategory.id}>{projectCategory.name}</option>
                                        )
                                    )
                                }
                            </select>
                            <div className="text-danger small">{errors.projectCategoryId}</div>
                            {/* <ErrorMessage name="projectCategoryId" component="div" className="text-danger small" /> */}
                        </div>
                        <div className="col-lg-12 mb-3 text-end">
                            <button className="me-2 btn btn-sm btn-outline-secondary" type="button" onClick={() => navigate(-1, { state })}>Cancel</button>
                            <button className="btn btn-sm btn-outline-success" type="submit">Save Project</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}