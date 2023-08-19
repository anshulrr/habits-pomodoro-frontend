import { useEffect, useState } from "react"
import { retrieveAllProjectCategoriesApi, getProjectCategoriesCountApi } from "../services/api/ProjectCategoryApiService";

import Pagination from "../services/pagination/Pagination"
import ProjectCategoryComponent from "./ProjectCategoryComponent";
import ListCommentsComponent from "./ListCommentsComponents";

const PAGESIZE = 5;

export default function ListProjectCategoriesComponent() {

    const [currentPage, setCurrentPage] = useState(1)

    const [categoriesCount, setCategoriesCount] = useState(0)
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState(null)

    const [isNewCategory, setNewCategory] = useState(false)

    const [showCommentsId, setShowCommentsId] = useState(-1);

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
            <div className="row">
                <div className="col-md-4">
                    <div>
                        <div className="row">
                            <div className="col-10 text-start">
                                <h6>
                                    Project Categories
                                    <span className="ms-1 badge rounded-pill text-bg-secondary">
                                        {categoriesCount}
                                        <span className="ms-1 bi bi-link-45deg" />
                                    </span>
                                </h6>
                            </div>
                            <div className="col-2 text-end">
                                <i className="p-1 bi bi-plus-square" onClick={addNewProjectCategory}></i>
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
                                            <div className="col-4 text-secondary text-end">
                                                <span>
                                                    {cat.level}&nbsp;
                                                </span>
                                                <span className="list-button">
                                                    <i className="p-1 me-1 bi bi-chat-right-text" onClick={() => setShowCommentsId(cat.id)} />
                                                    <i className="p-1 bi bi-pencil-square"></i>
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )
                            }
                        </small>
                        <Pagination
                            className="pagination-bar mt-2 mb-0"
                            currentPage={currentPage}
                            totalCount={categoriesCount}
                            pageSize={PAGESIZE}
                            onPageChange={page => setCurrentPage(page)}
                        />
                    </div>

                    {
                        showCommentsId !== -1 &&
                        <ListCommentsComponent
                            filterBy={'category'}
                            id={showCommentsId}
                            title={category.name}
                            setShowCommentsId={setShowCommentsId}
                        />
                    }
                </div>
                <div className="col-md-8 mt-2">
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