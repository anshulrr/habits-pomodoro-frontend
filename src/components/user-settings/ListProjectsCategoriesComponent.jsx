import { useEffect, useState } from "react"

import { retrieveAllProjectCategoriesApi, getProjectCategoriesCountApi } from "services/api/ProjectCategoryApiService";
import Pagination from "services/pagination/Pagination"

import ProjectCategoryComponent from "components/user-settings/ProjectCategoryComponent";

const PAGESIZE = 5;

export default function ListProjectCategoriesComponent() {

    const [currentPage, setCurrentPage] = useState(1)

    const [categoriesCount, setCategoriesCount] = useState(-1)
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState(null)

    const [isNewCategory, setNewCategory] = useState(false)

    const [showLoader, setShowLoader] = useState(true)

    const [reload, setReload] = useState(0)

    useEffect(
        () => getProjectCategoriesCount(),
        [reload]
    )

    useEffect(
        () => {
            refreshProjectCategories()
        }, [currentPage, reload] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshProjectCategories() {
        retrieveAllProjectCategoriesApi(PAGESIZE, (currentPage - 1) * PAGESIZE)
            .then(response => {
                // console.debug(response)
                setCategories(response.data)
                setShowLoader(false)
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
    }

    function addNewProjectCategory() {
        setCategory(null)
        setNewCategory(true)
    }


    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div>
                        <div className="row px-0">
                            <div className="col-10 text-start px-0">
                                <h6>
                                    Project Categories
                                    {
                                        categoriesCount !== -1 &&
                                        <span className="ms-1 badge rounded-pill text-bg-secondary">
                                            {categoriesCount}
                                            <i className="ms-1 bi bi-link-45deg" />
                                        </span>
                                    }
                                    {
                                        showLoader &&
                                        <span className="loader-container-2" >
                                            <span className="ms-2 loader-2"></span>
                                        </span>
                                    }
                                </h6>
                            </div>
                            <div className="col-2 px-0 text-end">
                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-1" onClick={addNewProjectCategory}>
                                    <i className="bi bi-plus-circle" />
                                </button>
                            </div>
                        </div>
                        <div className="row small border rounded">
                            <div className="col-12">
                                <div className="row py-1 fw-bold">
                                    <div className="col-9 ps-1 pe-0 text-start">
                                        Category Name
                                    </div>
                                    <div className="col-1 ps-0 pe-1 text-end">
                                        <i className="bi bi-arrow-up" />
                                    </div>
                                    <div className="col-1 ps-0 pe-1 text-end">
                                        <i className="bi bi-graph-up" />
                                    </div>
                                    <div className="col-1 ps-0 pe-1 text-end">
                                        <i className="bi bi-person-fill" />
                                    </div>
                                </div>
                                {
                                    categories.map(
                                        cat => (
                                            <div
                                                key={cat.id}
                                                className={(category && cat.id === category.id ? "list-selected " : "") + "row py-1 list-row"}
                                                onClick={() => updateProjectCategory(cat)}
                                            >
                                                {/* todo: decide better solution for maxWidth */}
                                                <div className="col-9 ps-1 pe-0 text-truncate text-start">
                                                    <span style={{ color: cat.color }}>
                                                        <i className="me-1 bi bi-link-45deg" />
                                                    </span>
                                                    <span>{cat.name}</span>
                                                </div>
                                                <div className="col-1 ps-0 pe-1 text-secondary text-end">
                                                    {cat.level}&nbsp;
                                                </div>
                                                <div className="col-1 ps-0 pe-1 text-secondary text-end">
                                                    <span>
                                                        <input className="form-check-input" type="checkbox" checked={cat.statsDefault} disabled />
                                                    </span>
                                                </div>
                                                <div className="col-1 ps-0 pe-1 text-secondary text-end">
                                                    <span>
                                                        <input className="ms-1 form-check-input" type="checkbox" checked={cat.visibleToPartners} disabled />
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <Pagination
                            className="pagination-bar pagination-scroll mb-0 ps-0"
                            currentPage={currentPage}
                            totalCount={categoriesCount}
                            pageSize={PAGESIZE}
                            onPageChange={page => setCurrentPage(page)}
                        />
                    </div>
                </div>
                <div className="col-lg-12 mt-2">
                    {
                        (category || isNewCategory) &&
                        <ProjectCategoryComponent
                            key={category}
                            category={category}
                            setCategory={setCategory}
                            setNewCategory={setNewCategory}
                            setReload={setReload}
                        />
                    }
                </div>
            </div>

        </div>
    )
}