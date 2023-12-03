import { useEffect, useState } from 'react'

import { Formik, ErrorMessage, Field } from 'formik'

import { createProjectCategoryApi, retrieveProjectCategoryApi, updateProjectCategoryApi } from 'services/api/ProjectCategoryApiService'

export default function ProjectCategoryComponent({
    category,
    categories,
    setCategories,
    setCategory,
    setNewCategory
}) {

    const [name, setName] = useState('')
    const [statsDefault, setStatsDefault] = useState(false)
    const [visibleToPartners, setVisibleToPartners] = useState(true)
    const [level, setLevel] = useState('')

    // const [errorMessage, setErrorMessage] = useState('')

    useEffect(
        () => {
            retrieveProjectCategory(category)
        }, [category] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveProjectCategory(category) {

        if (category === null) {
            return;
        }

        retrieveProjectCategoryApi(category.id)
            .then(response => {
                setStatsDefault(response.data.statsDefault)
                setVisibleToPartners(response.data.visibleToPartners)
                setName(response.data.name)
                setLevel(response.data.level)
            })
            .catch(error => console.error(error.message))
    }

    function onSubmit(values) {
        // console.debug({ name, description, projectCategoryId, level, pomodoroLength })
        // setErrorMessage("")
        const project_category = {
            id: category?.id,
            name: values.name,
            statsDefault: values.statsDefault,
            visibleToPartners: values.visibleToPartners,
            level: values.level,
        }

        if (category === null) {
            createProjectCategoryApi(project_category)
                .then(response => {
                    // console.debug(response)
                    setCategories([
                        response.data,
                        ...categories
                    ])
                    setNewCategory(false)
                })
                .catch(error => {
                    console.error(error.message)
                    // if (error.response.status === 409) {
                    //     setErrorMessage("Priority must be unique")
                    // }
                })
        } else {
            updateProjectCategoryApi(category.id, project_category)
                .then(response => {
                    // console.debug(response)
                    setCategories(categories.map((c) => {
                        if (category.id === c.id) {
                            return response.data;
                        } else {
                            return c;
                        }
                    }));
                    setCategory(null)
                })
                .catch(error => {
                    console.error(error.message)
                    // if (error.response.status === 409) {
                    //     setErrorMessage("Priority must be unique")
                    // }
                })
        }
    }

    function validate(values) {
        let errors = {}
        if (values.name.length < 2) {
            errors.name = 'Enter atleast 2 characters'
        }
        return errors
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

                            <p>Enter Project Category Details </p>
                            <div>
                                <Formik initialValues={{ name, level, statsDefault, visibleToPartners }}
                                    enableReinitialize={true}
                                    onSubmit={onSubmit}
                                    validate={validate}
                                    validateOnChange={false}
                                    validateOnBlur={false}
                                >
                                    {
                                        ({ errors, handleSubmit }) => (
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-12 mb-2">
                                                        <Field type="text" className="form-control form-control-sm" name="name" placeholder="Project Category Name" required />
                                                        <ErrorMessage name="name" component="div" className="small text-danger" />
                                                    </div>
                                                    <div className="col-12 mb-2">
                                                        <div className="input-group input-group-sm">
                                                            <label className="input-group-text" htmlFor="level">
                                                                Priority
                                                                <i className="ps-1 bi bi-arrow-up" />
                                                            </label>
                                                            <Field
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                name="level"
                                                                id="level"
                                                                placeholder="Priority Level"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 mb-2">
                                                        <div className="input-group input-group-sm">
                                                            <div className="input-group-text">
                                                                <Field
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    name="statsDefault"
                                                                    id="statsDefault"
                                                                />
                                                            </div>
                                                            <label className="input-group-text" htmlFor="statsDefault">
                                                                <i className="pe-1 bi bi-graph-up" />
                                                                Stats List Default
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 mb-2">
                                                        <div className="input-group input-group-sm">
                                                            <div className="input-group-text">
                                                                <Field
                                                                    type="checkbox"
                                                                    className="form-check-input"
                                                                    name="visibleToPartners"
                                                                    id="visibleToPartners"
                                                                />
                                                            </div>
                                                            <label className="input-group-text" htmlFor="visibleToPartners">
                                                                <i className="pe-1 bi bi-person-fill" />
                                                                Visible to Accountability Partners
                                                            </label>
                                                        </div>
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
                                        )
                                    }
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}