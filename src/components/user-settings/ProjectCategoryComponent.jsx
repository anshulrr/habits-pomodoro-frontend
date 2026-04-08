import { useState } from 'react'

import { addItemToCache, putItemToCache } from 'services/dbService'

export default function ProjectCategoryComponent({
    category,
    setCategory,
    setNewCategory,
    setCurrentPage
}) {

    const [name, setName] = useState(category?.name || '')
    const [statsDefault, setStatsDefault] = useState(category?.statsDefault || false)
    const [visibleToPartners, setVisibleToPartners] = useState(category?.visibleToPartners || false)
    const [level, setLevel] = useState(category?.level || 1)
    const [color, setColor] = useState(category?.color || '#a1a1a1')

    const [errors, setErrors] = useState({})

    function onSubmit(error) {
        error.preventDefault();
        // console.debug({ name, description, projectCategoryId, level, pomodoroLength })
        // setErrorMessage("")
        const project_category = {
            id: category?.id,
            name,
            statsDefault,
            visibleToPartners,
            level,
            color,
        }

        if (!validate(project_category)) {
            return;
        }

        if (category === null) {
            addItemToCache('categories', project_category)
            setNewCategory(false)
            setCurrentPage(1);

        } else {
            putItemToCache('categories', project_category);
            setCategory(null);
        }
    }

    function validate(category) {
        let errors = {}
        let validated = true;
        if (category.name.length < 2) {
            errors.name = 'Enter atleast 2 characters'
            validated = false;
        }
        setErrors(errors);
        return validated;
    }

    return (
        <div className="task-overlay">
            <div className="task-popup">
                <div className="task-close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => {
                        setCategory(null);
                        setNewCategory(false);
                    }}></i>
                </div>
                <div className="container my-3">

                    <div className="row">
                        <div className="col-lg-4 offset-lg-4">

                            {
                                category === null &&
                                <h6>Add New Project Category</h6>
                            }
                            {
                                category !== null &&
                                <h6>
                                    Update Project Category Details
                                </h6>
                            }

                            {
                                <div>
                                    <form onSubmit={onSubmit}>
                                        <div className="row">
                                            <div className="col-12 mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    name="name"
                                                    placeholder="Project Category Name"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                                <div className="text-danger small">{errors.name}</div>
                                            </div>

                                            <div className="col-12 mb-2">
                                                <div className="input-group input-group-sm">
                                                    <label className="input-group-text" htmlFor="color">
                                                        Category Color
                                                    </label>
                                                    <input
                                                        type="color"
                                                        className="form-control form-control-sm"
                                                        name="color"
                                                        id="color"
                                                        placeholder="Color"
                                                        required
                                                        value={color}
                                                        onChange={(e) => setColor(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12 mb-2">
                                                <div className="input-group input-group-sm">
                                                    <label className="input-group-text" htmlFor="level">
                                                        Order
                                                        <i className="ps-1 bi bi-arrow-up" />
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        name="level"
                                                        id="level"
                                                        placeholder="Order"
                                                        required
                                                        value={level}
                                                        onChange={(e) => setLevel(e.target.value)}
                                                    />
                                                </div>
                                                <small>
                                                    <small className="text-secondary">(Lower numbered categories appears at the top of the list)</small>
                                                </small>

                                            </div>

                                            <div className="col-12 mb-2">
                                                <div className="input-group input-group-sm">
                                                    <div className="input-group-text">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="statsDefault"
                                                            id="statsDefault"
                                                            checked={statsDefault}
                                                            onChange={(e) => setStatsDefault(e.target.checked)}
                                                        />
                                                    </div>
                                                    <label className="input-group-text" htmlFor="statsDefault">
                                                        <i className="pe-1 bi bi-graph-up" />
                                                        Stats Default
                                                    </label>
                                                </div>
                                                <small>
                                                    <small className="text-secondary">(If selected, by default this category stats will be shown in the stats page at every first visit)</small>
                                                </small>
                                            </div>

                                            <div className="col-12 mb-2">
                                                <div className="input-group input-group-sm">
                                                    <div className="input-group-text">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="visibleToPartners"
                                                            id="visibleToPartners"
                                                            checked={visibleToPartners}
                                                            onChange={(e) => setVisibleToPartners(e.target.checked)}
                                                        />
                                                    </div>
                                                    <label className="input-group-text" htmlFor="visibleToPartners">
                                                        <i className="pe-1 bi bi-person-fill" />
                                                        Visible to Accountability Partners
                                                    </label>
                                                </div>
                                                <small>
                                                    <small className="text-secondary">(If selected, Accountability Partners will have access to the stats of this category)</small>
                                                </small>
                                            </div>

                                            <div className="col-lg-12">
                                                {
                                                    category &&
                                                    <span>
                                                        <button className="me-2 btn btn-sm btn-outline-secondary" type="button" onClick={() => setCategory(null)}>Cancel</button>
                                                        <button className="btn btn-sm btn-outline-success" type="submit">Update Project Category</button>
                                                    </span>
                                                }
                                                {
                                                    !category &&
                                                    <span>
                                                        <button className="me-2 btn btn-sm btn-outline-secondary" type="button" onClick={() => setNewCategory(false)}>Cancel</button>
                                                        <button className="btn btn-sm btn-outline-success" type="submit">Create Project Category</button>
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}