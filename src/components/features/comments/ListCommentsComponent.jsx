import { useEffect, useState } from "react"

import { retrieveAllProjectCategoriesApi } from "services/api/ProjectCategoryApiService"

import ListFilteredCommentsComponent from "./ListFilteredCommentsComponents"
import OutsideAlerter from "services/hooks/OutsideAlerter"
import { retrieveAllTagsApi } from "services/api/TagApiService"
import { CommentsFilterComponent } from "./CommentsFilterComponent"
import SearchCommentComponent from "./SearchCommentComponent"

export default function ListCommentsComponent({
    filterBy = 'user',
    id,
}) {
    const ALL_TAGS_PAGESIZE = 1000;
    const [tags, setTags] = useState(null);

    const [categories, setCategories] = useState([])
    const [includedCategoryIds, setIncludedCategoryIds] = useState([])

    const [reload, setReload] = useState(0)

    const [filterWithReviseDate, setFilterWithReviseDate] = useState(false)
    const [showSearched, setShowSearched] = useState(false)
    const [searchString, setSearchString] = useState('')

    const [filterType, setFilterType] = useState(filterBy);
    const [filterTypeId, setFilterTypeId] = useState(id);

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

    function resetFiltersAndReload(type) {
        if (type === 'fetch') {
            setShowSearched(false);
            setSearchString('');
            setFilterWithReviseDate(false);
        } else if (type === 'revise') {
            setShowSearched(false);
            setSearchString('');
            setFilterWithReviseDate(!filterWithReviseDate);
        } else if (type === 'search') {
            setFilterWithReviseDate(false);
            setShowSearched(true);
        }
        setReload(prev => prev + 1);
    }

    return (
        <div className={"comments-list " + (filterBy === 'user' ? 'container' : '')} style={{ backgroundColor: "#e9ecef" }}>
            <div className="row">
                {
                    filterBy === 'user' &&
                    <div className="col-lg-4 px-0 text-start bg-white">
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

                                            <div className="container pt-3 pb-1 border-bottom">
                                                <CommentsFilterComponent
                                                    key={[categories]}
                                                    categories={categories}
                                                    includeCategories={includedCategoryIds}
                                                    setFilterType={setFilterType}
                                                    setFilterTypeId={setFilterTypeId}
                                                    resetFiltersAndReload={resetFiltersAndReload}
                                                />
                                            </div>

                                            {
                                                filterType === 'user' &&
                                                <div>
                                                    <div className="container py-1 border-bottom">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="text-end">
                                                                    <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => {
                                                                        resetFiltersAndReload("revise")
                                                                    }}>
                                                                        {!filterWithReviseDate && "Filter All Notes with Revise Date"}
                                                                        {filterWithReviseDate && "Fetch All Notes"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="container py-1 border-bottom">
                                                        <SearchCommentComponent
                                                            searchString={searchString}
                                                            setSearchString={setSearchString}
                                                            resetFiltersAndReload={resetFiltersAndReload}
                                                        />
                                                    </div>
                                                </div>
                                            }

                                        </div >
                                    </OutsideAlerter>
                                </div>
                            </div>
                        </div>

                    </div >
                }

                {
                    !tags &&
                    <span className="loader-container col-lg-8 mt-5" style={{ backgroundColor: "#e9ecef" }}>
                        <span className="loader"></span>
                    </span>
                }
                {
                    tags &&
                    <div className={"pt-3 col-lg-8 " + (filterBy !== 'user' ? "offset-lg-2" : "")} style={{ backgroundColor: "#e9ecef" }}>
                        <ListFilteredCommentsComponent
                            key={[reload]}
                            filterBy={filterType}
                            id={filterTypeId}
                            categoryIds={includedCategoryIds}
                            filterWithReviseDate={filterWithReviseDate}
                            searchString={searchString}
                            showSearched={showSearched}
                            tags={tags}
                        />
                    </div >
                }
            </div >
        </div >
    )
}