import { useEffect, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { calculateTextAreaRows } from 'services/helpers/helper';
import { COLOR_MAP } from 'services/helpers/listsHelper';

import { addItemToCache, getItemFromCache, putItemToCache } from 'services/dbService';
import { useData } from 'services/DataContext';

export default function ProjectComponent() {

    const dataContext = useData();

    const { id } = useParams()

    // To store all project details together for easy access of non updatable details
    const [project, setProject] = useState(null);

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [projectCategoryId, setProjectCategoryId] = useState(0)   // value for disabled option in dropdown
    const [color, setColor] = useState('#ffffff')
    const [pomodoroLength, setPomodoroLength] = useState(0)
    const [priority, setPriority] = useState(1)
    const [type, setType] = useState('neutral')
    const [dailyLimit, setDailyLimit] = useState(1)

    const categoriesMap = dataContext.categoriesMap;
    const projectCategories = [...categoriesMap.values()];
    const [errors, setErrors] = useState({ color: projectCategoryId === 0 ? 'To select a color, first select a project category' : '' })
    const [showLoader, setShowLoader] = useState(id !== 'create')

    const [showInput, setShowInput] = useState(true)

    const navigate = useNavigate()
    const { state } = useLocation();

    useEffect(
        () => {
            (() => {
                // console.debug('re-render ProjectComponents')
                retrieveProject()
            })();
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    // set project details for form fields
    async function retrieveProject() {
        if (id === 'create') {
            return;
        }

        const project = await getItemFromCache('projects', id);
        // console.debug({ project })
        setProject(project)

        setDescription(project.description)
        setName(project.name)
        setColor(project.color)
        setPomodoroLength(project.pomodoroLength)
        setPriority(project.priority)
        setType(project.type)
        setDailyLimit(project.dailyLimit)
        setProjectCategoryId(project.projectCategoryId)
        errors.color = ''
        setShowLoader(false)
    }

    function handleSubmit(error) {
        error.preventDefault();

        // console.debug({ name, description, projectCategoryId, color, pomodoroLength })
        // console.debug(values)

        const category = projectCategories.find(category => category.id === projectCategoryId);

        const updatedProject = {
            ...project,     // don't miss any existing details like timeElapsed, publicId etc. while updating the project
            name,
            description,
            color,
            pomodoroLength,
            priority,
            type,
            dailyLimit,
            projectCategoryId,
            // NOTE: make sure to add category details in project itself for new project
            // TODO: decide way to add schema for cached data to avoid such issues
            category: category.name,
            categoryColor: category.color,
            categoryPriority: category.level,
        }

        if (!validate(updatedProject)) {
            return;
        }

        if (id === 'create') {
            addItemToCache('projects', updatedProject);
            // new project will be added to start of the ordered projects list
            state.currentProjectsPage = 1;
        } else {
            putItemToCache('projects', updatedProject);
        }
        // console.debug({ updatedProject, state })

        state.project = updatedProject;
        navigate('/', { state })
        // navigate(-1, { state }) // NOTE: passing state with -1 doesn't work
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
        if (project.dailyLimit === '' || project.dailyLimit < 0) {
            errors.dailyLimit = 'Enter zero or positive value'
            result = false;
        }
        setErrors(errors);
        // console.debug(errors)
        return result;
    }

    return (
        <div className="container mt-3">

            {
                id === 'create' &&
                <h6>
                    Add New Project
                </h6>
            }
            {
                id !== 'create' &&
                <h6>
                    Update Project Details
                    {
                        showLoader &&
                        <span className="loader-container-2" >
                            <span className="ms-1 loader-2"></span>
                        </span>
                    }
                </h6>
            }
            {
                !showLoader &&
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
                            <div className="col-lg-4 mb-3">
                                <label htmlFor="projectCategoryId">
                                    Project Category
                                    <i className="ms-1 bi bi-link-45deg" style={{ color: categoriesMap.has(projectCategoryId) ? categoriesMap.get(projectCategoryId).color : '#818181' }} />
                                </label>
                                <select
                                    className="form-select form-select-sm"
                                    id="projectCategoryId"
                                    name="projectCategoryId"
                                    value={projectCategoryId}
                                    onChange={(e) => {
                                        const id = e.target.value;
                                        setProjectCategoryId(id)
                                        setColor(categoriesMap.get(id).color)
                                        errors.color = '';
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
                            <div className="col-lg-4 mb-3">
                                <label htmlFor="color">Project Color</label>
                                <input
                                    type="color"
                                    className="form-control form-control-sm"
                                    id="color"
                                    name="color"
                                    placeholder="Color"
                                    value={color}
                                    required
                                    disabled={projectCategoryId === 0}
                                    onChange={(e) => setColor(e.target.value)}
                                />
                                <div className="text-danger small">{errors.color}</div>
                            </div>

                            <div className="col-lg-4 mb-3">
                                <label htmlFor="type">Habit Type</label>
                                <select
                                    className={"form-select form-select-sm text-" + COLOR_MAP[type]}
                                    id="type"
                                    name="type"
                                    value={type}
                                    onChange={(e) => { setType(e.target.value) }}
                                >
                                    <option value="neutral">Neutral</option>
                                    <option value="good">Good</option>
                                    <option value="bad">Bad</option>
                                </select>
                            </div>

                            <div className="col-lg-4 mb-3">
                                <label htmlFor="pomodoroLength">Default Pomodoro Length (mins) <i className="bi bi-hourglass" /></label>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    min="0"
                                    id="pomodoroLength"
                                    name="pomodoroLength"
                                    placeholder="Default Pomodoro Length (mins)"
                                    value={pomodoroLength}
                                    required
                                    onChange={(e) => setPomodoroLength(e.target.value)}
                                />
                                <small>(To use Default Pomodoro Length of General Settings, set value to zero)</small>
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
                                    onChange={(e) => setDailyLimit(e.target.value)}
                                />
                                <div className="text-danger small">{errors.dailyLimit}</div>
                            </div>
                            <div className="col-lg-4 mb-3">
                                <label htmlFor="priority">Order <i className="bi bi-arrow-up" /></label>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    min="1" id="priority"
                                    name="priority"
                                    placeholder="Order"
                                    value={priority}
                                    required
                                    onChange={(e) => setPriority(e.target.value)}
                                />
                                <small>(Lower numbered projects appears at the top of the list)</small>
                                <div className="text-danger small">{errors.priority}</div>
                            </div>


                            <div className="col-lg-12 mb-3">
                                <div className="input-group">
                                    <button type="button" className={"btn btn-sm btn-outline-secondary " + (showInput ? "active" : "")} onClick={() => setShowInput(true)}>
                                        <label htmlFor="description">
                                            Write
                                        </label>
                                    </button>
                                    <button type="button" className={"btn btn-sm btn-outline-secondary " + (!showInput ? "active" : "")} onClick={() => setShowInput(false)}>Preview</button>
                                </div>
                                <textarea
                                    id="description"
                                    className="form-control form-control-sm"
                                    name="description"
                                    rows={description ? calculateTextAreaRows(description) : 5}
                                    value={description}
                                    placeholder="Description"
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    style={{ display: showInput ? 'block' : 'none' }}
                                />
                                <div
                                    className="text-wrap bg-white border rounded-1 border-2 p-2 comments-markdown text-dark"
                                    style={{ display: !showInput ? 'block' : 'none', minHeight: "8rem" }}>
                                    <ReactMarkdown
                                        children={description}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-12 mb-3 text-end">
                                <button className="me-2 btn btn-sm btn-outline-secondary" type="button" onClick={() => navigate(-1, { state })}>Cancel</button>
                                <button className="btn btn-sm btn-outline-success" type="submit">Save Project</button>
                            </div>
                        </div>
                    </form>
                </div>
            }
        </div>
    )
}