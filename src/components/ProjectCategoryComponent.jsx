import { useEffect, useState } from 'react'
import { createProjectCategoryApi, retrieveProjectCategoryApi, updateProjectCategoryApi } from '../services/api/ProjectCategoryApiService'
import { Formik, ErrorMessage, Field } from 'formik'

export default function ProjectCategoryComponent({ category, categories, setCategories }) {

    const [name, setName] = useState('')
    const [statsDefault, setStatsDefault] = useState(false)
    const [level, setLevel] = useState(0)

    const [errorMessage, setErrorMessage] = useState('')

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
                setName(response.data.name)
                setLevel(response.data.level)
            })
            .catch(error => console.error(error.message))
    }

    function onSubmit(values) {
        // console.debug({ name, description, projectCategoryId, level, pomodoroLength })
        setErrorMessage("")
        const project_category = {
            id: category?.id,
            name: values.name,
            statsDefault: values.statsDefault,
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
                })
                .catch(error => {
                    console.error(error.message)
                    if (error.response.status === 409) {
                        setErrorMessage("Level must be unique")
                    }
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
                })
                .catch(error => {
                    console.error(error.message)
                    if (error.response.status === 409) {
                        setErrorMessage("Level must be unique")
                    }
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
        <div>
            <p>Enter Project Category Details </p>
            <div>
                <Formik initialValues={{ name, level, statsDefault }}
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
                                    <div className="col-md-6 mb-3">
                                        <Field type="text" className="form-control form-control-sm" name="name" placeholder="Project Category Name" />
                                        <ErrorMessage name="name" component="div" className="small text-danger" />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <Field type="number" className="form-control form-control-sm" name="level" placeholder="Level" />
                                        {/* <small>(All categories must have different levels)</small> */}
                                        {errors.level && <div className="text-danger small">{errors.level}</div>}
                                        {<div className="text-danger small">{errorMessage}</div>}
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <div className="form-check">
                                            <Field type="checkbox" className="form-check-input" name="statsDefault" id="flexCheck" />
                                            <label className="form-check-label" htmlFor="flexCheck">
                                                <small>
                                                    Stats List Default
                                                </small>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        {
                                            category &&
                                            <button className="btn btn-sm btn-outline-primary" type="submit">Update Project Category</button>
                                        }
                                        {
                                            !category &&
                                            <button className="btn btn-sm btn-outline-success" type="submit">Create Project Category</button>
                                        }
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