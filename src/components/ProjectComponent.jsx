import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProjectApi, retrieveProjectApi, updateProjectApi } from '../services/api/ProjectApiService'
import { retrieveAllProjectCategoriesApi } from "../services/api/ProjectCategoryApiService";
import { Formik, Form, ErrorMessage, Field } from 'formik'

export default function ProjectComponent() {

    const { id } = useParams()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [color, setColor] = useState('#00FFFF')
    const [categories, setCategories] = useState([])

    const navigate = useNavigate()

    useEffect(
        () => {
            (async function () {
                try {
                    // using async await for correct initialization of categoryId
                    await retrieveProjectCategories()
                    await retrieveProject()
                } catch (e) {
                    console.error(e)
                }
            })();
        },
        [id]
    )

    async function retrieveProjectCategories() {
        // TODO: decide limit
        retrieveAllProjectCategoriesApi(10, 0)
            .then(response => {
                setCategories(response.data)
                setCategoryId(response.data[0].id)
            })
            .catch(response => console.log(response))
    }

    async function retrieveProject() {

        if (id == -1) {
            return;
        }

        retrieveProjectApi(id)
            .then(response => {
                setDescription(response.data.description)
                setName(response.data.name)
                setColor(response.data.color)
                // todo: set project category id: done
                setCategoryId(response.data.projectCategory.id)
            })
            .catch(error => console.log(error))
    }

    function onSubmit(values) {
        console.log(values)
        const project = {
            id,
            name: values.name,
            description: values.description,
            color: values.color
        }

        if (id == -1) {
            createProjectApi(project, values.category_id)
                .then(response => {
                    console.log(response)
                    navigate('/projects', { state: { project: response.data } })
                })
                .catch(error => console.log(error))
        } else {
            updateProjectApi(id, project)
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

        // console.log(values)
        return errors
    }

    return (
        <div className="container">
            <h1>Enter Project Details </h1>
            <div>
                <Formik initialValues={{ name, description, color, category_id: categoryId }}
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
                                    <label>Project Name</label>
                                    <Field type="text" className="form-control" name="name" />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Description</label>
                                    <Field type="text" className="form-control" name="description" />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Color</label>
                                    <Field type="color" className="form-control" name="color" />
                                </fieldset>
                                <fieldset className="form-group">
                                    <label>Category</label>
                                    <Field as="select" className="form-select" name="category_id">
                                        {
                                            categories.map(
                                                category => (
                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                )
                                            )
                                        }
                                    </Field>
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