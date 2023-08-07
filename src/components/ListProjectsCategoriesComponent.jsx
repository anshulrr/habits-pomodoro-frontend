import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { retrieveAllProjectCategoriesApi, getProjectCategoriesCountApi } from "../services/api/ProjectCategoryApiService";

import Pagination from "../services/pagination/Pagination"
import ProjectCategoryComponent from "./ProjectCategoryComponent";

const PAGESIZE = 5;

export default function ListProjectCategoriesComponent() {

    const [currentPage, setCurrentPage] = useState(1)

    const [categoriesCount, setCategoriesCount] = useState(0)
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState(null)

    const [isNewCategory, setNewCategory] = useState(false)

    useEffect(
        () => getProjectCategoriesCount(),
        []
    )

    useEffect(
        () => {
            refreshProjectCategories()
        }, [currentPage] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshProjectCategories() {
        retrieveAllProjectCategoriesApi(PAGESIZE, (currentPage - 1) * PAGESIZE)
            .then(response => {
                // console.debug(response)
                setCategories(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function getProjectCategoriesCount() {
        getProjectCategoriesCountApi()
            .then(response => {
                setCategoriesCount(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function updateProjectCategory(cat) {
        setCategory(cat)
        setNewCategory(false)
        // navigate(`/categories/${id}`)
    }

    function addNewProjectCategory() {
        setCategory(null)
        setNewCategory(true)
    }


    return (
        <div className="container">
            <div className="row mb-3">
                <div className="col-md-4 mb-3">
                    <div>
                        <div className="row">
                            <div className="col-10">
                                <h6>Project Categories ({categoriesCount})</h6>
                            </div>
                            <div className="col-2 text-end">
                                <i className="bi bi-plus-square" onClick={addNewProjectCategory}></i>
                            </div>
                        </div>
                        <small>
                            {
                                categories.map(
                                    cat => (
                                        <div
                                            key={cat.id}
                                            className={(category && cat.id === category.id ? "list-selected " : "") + "row py-0 list-row"}
                                            onClick={() => updateProjectCategory(cat)}
                                        >
                                            {/* todo: decide better solution for maxWidth */}
                                            <div className="col-8 text-truncate text-start">
                                                {/* <span style={{ color: cat.color }}>&#9632; </span> */}
                                                <span>
                                                    <input className="form-check-input" type="checkbox" checked={cat.statsDefault} disabled />
                                                </span>
                                                <span>&nbsp;{cat.name}</span>
                                            </div>
                                            <div className="col text-secondary text-truncate text-end">
                                                <span>
                                                    {cat.level}&nbsp;
                                                </span>
                                                <span className="list-button">
                                                    <i className="bi bi-pencil-square"></i>
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )
                            }
                        </small>
                        <Pagination
                            className="pagination-bar mt-3"
                            currentPage={currentPage}
                            totalCount={categoriesCount}
                            pageSize={PAGESIZE}
                            onPageChange={page => setCurrentPage(page)}
                        />
                    </div>
                </div>
                <div className="col-md-8">
                    {
                        (category || isNewCategory) &&
                        <ProjectCategoryComponent
                            key={category}
                            category={category}
                            categories={categories}
                            setCategories={setCategories}
                            setCategory={setCategory}
                            setNewCategory={setNewCategory}
                        />
                    }
                </div>
            </div>

        </div>
    )
}