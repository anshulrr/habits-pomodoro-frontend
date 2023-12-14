import { useEffect, useState } from 'react';

import { retrieveAllProjectsApi, retrieveProjectApi } from 'services/api/ProjectApiService';
import { retrieveAllProjectCategoriesApi } from 'services/api/ProjectCategoryApiService';

export const SwitchProjectComponent = ({ projectId, setProjectId }) => {

    const [categoryId, setCategoryId] = useState(0);
    const [categories, setCategories] = useState([]);
    const [projects, setProjects] = useState([]);

    const [showLoader, setShowLoader] = useState(false);

    useEffect(
        () => {
            refreshProjectCategories();
            getProject();
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function getProject() {
        setShowLoader(true)
        retrieveProjectApi(projectId)
            .then(response => {
                setCategoryId(response.data.projectCategoryId);
                refreshProjects(response.data.projectCategoryId);
                setShowLoader(false)
            })
            .catch(error => console.error(error.message))
    }

    function refreshProjectCategories() {
        setShowLoader(true)
        retrieveAllProjectCategoriesApi(100, 0)
            .then(response => {
                setCategories(response.data)
                setShowLoader(false)
            })
            .catch(error => console.error(error.message))
    }

    function refreshProjects(categoryId) {
        setShowLoader(true)
        setProjects([]);
        retrieveAllProjectsApi({ categoryId })
            .then(response => {
                setProjects(response.data)
                setShowLoader(false)
            })
            .catch(error => console.error(error.message))
    }

    function updateCategory(id) {
        setCategoryId(parseInt(id));
        setProjectId(0);
        refreshProjects(id);
    }

    function updateProject(id) {
        setProjectId(parseInt(id));
    }

    return (
        <div className="container">

            <div className="row">

                <div className="col-12 px-0">
                    Switch Project
                    <span className="loader-container-2" >
                        <span className="ms-1 loader-2" style={{ display: showLoader ? "inline" : "none" }}></span>
                    </span>
                </div>

                <div className="col-6 px-0 mb-1">
                    <select
                        className="form-select form-select-sm"
                        id="project_category_id"
                        name="project_category_id"
                        value={categoryId}
                        onChange={(e) => updateCategory(e.target.value)}
                    >
                        <option value="0" disabled>Select Category</option>
                        {
                            categories.map(
                                projectCategory => (
                                    <option key={projectCategory.id} value={projectCategory.id}>{projectCategory.name}</option>
                                )
                            )
                        }
                    </select>
                </div>

                <div className="col-6 px-0 mb-1">
                    <select
                        className="form-select form-select-sm"
                        id="project_id"
                        name="project_id"
                        value={projectId}
                        onChange={(e) => updateProject(e.target.value)}
                    >
                        <option value="0" disabled>Select Project</option>
                        {
                            projects.map(
                                project => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
                                )
                            )
                        }
                    </select>
                    {projectId === 0 && <div className="text-danger small">Select a project</div>}
                </div>
            </div>

        </div >
    )
}

