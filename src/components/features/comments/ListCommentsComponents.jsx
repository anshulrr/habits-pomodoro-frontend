import { useEffect, useState } from "react"

import { retrieveAllProjectCategoriesApi } from "services/api/ProjectCategoryApiService"

import CategoryChecklistComponent from "components/stats/CategoryChecklistComponent"
import ListFilteredCommentsComponent from "./ListFilteredCommentsComponents"

export default function ListCommentsComponent({
    filterBy,
    id,
    title,
    projectColor,
    setShowCommentsId
}) {

    const [categories, setCategories] = useState([])
    const [includedCategoryIds, setIncludedCategoryIds] = useState([])

    const [showIncludeCategories, setShowIncludeCategories] = useState(false)

    const [reload, setReload] = useState(0)

    const [filterWithReviseDate, setFilterWithReviseDate] = useState(false)

    useEffect(
        () => {
            if (filterBy === 'user') {
                retrieveProjectCategories();
            }
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveProjectCategories() {
        retrieveAllProjectCategoriesApi(10, 0)
            .then(response => {
                // console.debug(response)
                setCategories(response.data
                    .map(c => {
                        c.statsDefault = true;
                        return c;
                    })
                );
                setIncludedCategoryIds(response.data
                    .filter(c => c.statsDefault === true)
                    .map(c => c.id)
                );
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="comments-overlay">
            <div className="comments-popup">
                <div className="close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowCommentsId(-1)}></i>
                </div>

                <div className="container mt-5">

                    {
                        filterBy === 'user' &&
                        <div className="row border rounded py-1 my-2">
                            <div className="col-lg-4 text-start text-secondary">
                                <div className="d-flex justify-content-between">
                                    <div className="text-secondary">
                                        Included Project Categories
                                        <span className="ms-1 badge rounded-pill text-bg-secondary">
                                            {includedCategoryIds.length}
                                            <i className="ms-1 bi bi-link-45deg" />
                                        </span>
                                    </div>
                                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => setShowIncludeCategories(!showIncludeCategories)}>
                                        <i className="bi bi-pencil-square" />
                                    </button>
                                </div>
                                <div style={{ display: showIncludeCategories ? "block" : "none" }} >
                                    <CategoryChecklistComponent
                                        key={categories}
                                        categories={categories}
                                        setIncludeCategories={setIncludedCategoryIds}
                                        reload={reload}
                                        setReload={setReload}
                                        setShowIncludeCategories={setShowIncludeCategories}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-8 text-end">
                                <button className="btn btn-sm btn-outline-secondary py-0" type="button" onClick={() => setFilterWithReviseDate(!filterWithReviseDate)}>
                                    {!filterWithReviseDate && "Filter comments with revise date"}
                                    {filterWithReviseDate && "Fetch all comments"}
                                </button>
                            </div>
                        </div>
                    }

                    {
                        (filterBy !== 'user' || includedCategoryIds.length !== 0) &&
                        <ListFilteredCommentsComponent
                            key={[includedCategoryIds, filterWithReviseDate]}
                            filterBy={filterBy}
                            id={id}
                            title={title}
                            projectColor={projectColor}
                            categoryIds={includedCategoryIds}
                            filterWithReviseDate={filterWithReviseDate}
                        />
                    }

                </div >

            </div>
        </div>
    )
}