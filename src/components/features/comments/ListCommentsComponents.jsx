import { useEffect, useState } from "react"

import { retrieveAllProjectCategoriesApi } from "services/api/ProjectCategoryApiService"

import CategoryChecklistComponent from "components/stats/CategoryChecklistComponent"
import ListFilteredCommentsComponent from "./ListFilteredCommentsComponents"
import OutsideAlerter from "services/hooks/OutsideAlerter"
import { retrieveAllTagsApi } from "services/api/TagApiService"

export default function ListCommentsComponent({
    filterBy = 'user',
    id,
    title = 'Notes',
    projectColor
}) {
    const ALL_TAGS_PAGESIZE = 1000;
    const [tags, setTags] = useState(null);

    const [categories, setCategories] = useState([])
    const [includedCategoryIds, setIncludedCategoryIds] = useState([])

    const [showIncludeCategories, setShowIncludeCategories] = useState(true)

    const [reload, setReload] = useState(0)

    const [filterWithReviseDate, setFilterWithReviseDate] = useState(false)

    const [showLoader, setShowLoader] = useState(true)

    const [showLeftMenu, setShowLeftMenu] = useState(window.innerWidth <= 992 ? false : true);

    useEffect(
        () => {
            refreshAllTags();
            if (filterBy === 'user') {
                retrieveProjectCategories();
            }
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    useEffect(
        () => {
            setShowLeftMenu(false);
        }, [filterWithReviseDate, reload]
    )

    function retrieveProjectCategories() {
        retrieveAllProjectCategoriesApi(100, 0)
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
                setReload(prev => prev + 1)
                setShowLoader(false)
            })
            .catch(error => console.error(error.message))
    }

    function refreshAllTags() {
        retrieveAllTagsApi({ limit: ALL_TAGS_PAGESIZE, offset: 0 })
            .then(response => {
                const map = new Map(response.data.map(i => [i.id, i]));
                setTags(map);
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="container" style={{ backgroundColor: "#e9ecef" }}>
            <div className="row">
                {
                    filterBy === 'user' && title !== "All Notes" &&
                    < div className="col-lg-4 text-start">
                        <span className="refresh-icon">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setReload(prev => prev + 1)}>
                                <i className="bi bi-arrow-clockwise" />
                            </button>
                        </span>
                        <div className="left-menu-icon">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowLeftMenu(!showLeftMenu)}>
                                Notes Filters <i className="bi bi-list" />
                            </button>
                        </div>

                        <div className={showLeftMenu ? "left-menu-container" : ""}>
                            <div className={"left-menu-overlay " + (showLeftMenu ? "left-menu-enter" : "left-menu-exit")} >
                                <div id="outside-alerter-parent">
                                    <OutsideAlerter handle={() => setShowLeftMenu(false)}>
                                        <div className="left-menu-popup">

                                            <div className="row mb-2 mt-3">
                                                <div className="col-12 text-start mb-2">

                                                    <div className="d-flex justify-content-between mb-2"
                                                        onClick={() => setShowIncludeCategories(!showIncludeCategories)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <h6 className="mb-0">
                                                            Included Project Categories
                                                            <span className="ms-1 badge rounded-pill text-bg-secondary">
                                                                {includedCategoryIds.length}/{categories.length}
                                                                <i className="ms-1 bi bi-link-45deg" />
                                                            </span>
                                                            {
                                                                showLoader &&
                                                                <span className="loader-container-2" >
                                                                    <span className="ms-2 loader-2"></span>
                                                                </span>
                                                            }
                                                        </h6>
                                                        <div className="text-secondary px-1">
                                                            {
                                                                !showIncludeCategories &&
                                                                <i className="bi bi-eye-slash" />
                                                            }
                                                            {
                                                                showIncludeCategories &&
                                                                <i className="bi bi-eye" />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="" style={{ display: showIncludeCategories ? "block" : "none" }} >
                                                        <CategoryChecklistComponent
                                                            key={categories}
                                                            categories={categories}
                                                            setIncludeCategories={setIncludedCategoryIds}
                                                            setReload={setReload}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 text-end">
                                                    <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setFilterWithReviseDate(!filterWithReviseDate)}>
                                                        {!filterWithReviseDate && "Filter notes with revise date"}
                                                        {filterWithReviseDate && "Fetch all notes"}
                                                    </button>
                                                </div>
                                            </div>


                                        </div >
                                    </OutsideAlerter>
                                </div>
                            </div>
                        </div>

                    </div>
                }

                {
                    !tags &&
                    <span className="loader-container mt-5">
                        <span className="loader"></span>
                    </span>
                }
                {
                    tags &&
                    <div className={"mt-3 col-lg-8 " + (filterBy !== 'user' || title === "All Notes" ? "offset-lg-2" : "")} style={{ backgroundColor: "#e9ecef" }}>
                        <ListFilteredCommentsComponent
                            key={[filterWithReviseDate, reload]}
                            filterBy={filterBy}
                            id={id}
                            title={title}
                            projectColor={projectColor}
                            categoryIds={includedCategoryIds}
                            filterWithReviseDate={filterWithReviseDate}
                            tags={tags}
                        />
                    </div >
                }
            </div>
        </div >
    )
}