import { useEffect, useState } from "react"
import { useLiveQuery } from "dexie-react-hooks"

import ListFilteredCommentsComponent from "./ListFilteredCommentsComponents"
import OutsideAlerter from "services/hooks/OutsideAlerter"
import { CommentsFilterComponent } from "./CommentsFilterComponent"
import SearchCommentComponent from "./SearchCommentComponent"
import FooterComponent from "components/FooterComponent"
import { getItemsFromCache } from "services/dbService"

export default function ListCommentsComponent({
    filterBy = 'user',
    id,
}) {
    const ALL_PAGESIZE = 1000;

    const [tagsMap, setTagsMap] = useState();
    const tags = useLiveQuery(async () => {
        const cachedTags = await getItemsFromCache('tags', 1, ALL_PAGESIZE);
        setTagsMap(new Map(cachedTags.map(i => [i.id, i])));
        return cachedTags;
    }, []);

    const [reload, setReload] = useState(0)

    const [filterWithReviseDate, setFilterWithReviseDate] = useState(false)
    const [showSearched, setShowSearched] = useState(false)
    const [searchString, setSearchString] = useState('')

    const [filterType, setFilterType] = useState(filterBy);
    const [filterTypeId, setFilterTypeId] = useState(id);

    const [showLeftMenu, setShowLeftMenu] = useState(window.innerWidth <= 992 ? false : true);

    useEffect(
        () => {
            setShowLeftMenu(false);
        }, [filterWithReviseDate, reload]
    )

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

    if (!tags)
        return <div>Loading initial data...</div>;

    return (
        <div className={"comments-list " + (filterBy === 'user' ? 'container' : '')} style={{ backgroundColor: "#e9ecef" }}>
            <div className="row">
                {
                    filterBy === 'user' &&
                    <div className="col-lg-4 px-0 text-start bg-white">

                        <div className={showLeftMenu ? "left-menu-container" : ""}>
                            <div className={"left-menu-overlay " + (showLeftMenu ? "left-menu-enter" : "left-menu-exit")} >
                                <div id="outside-alerter-parent">
                                    <OutsideAlerter handle={() => setShowLeftMenu(false)}>
                                        <div className="left-menu-popup">

                                            <div className="container pt-3 pb-1 border-bottom">
                                                <CommentsFilterComponent
                                                    setFilterType={setFilterType}
                                                    setFilterTypeId={setFilterTypeId}
                                                    resetFiltersAndReload={resetFiltersAndReload}
                                                />
                                            </div>

                                            {
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
                    tagsMap &&
                    <div className={"pt-3 col-lg-8 " + (filterBy !== 'user' ? "offset-lg-2" : "")} style={{ backgroundColor: "#e9ecef" }}>
                        <ListFilteredCommentsComponent
                            key={[reload]}
                            filterBy={filterType}
                            id={filterTypeId}
                            filterWithReviseDate={filterWithReviseDate}
                            searchString={searchString}
                            showSearched={showSearched}
                            tags={tagsMap}
                        />
                    </div >
                }
            </div >

            <FooterComponent
                setShowLeftMenu={setShowLeftMenu}
                setReload={setReload}
                title={"Notes Filters"}
                isEmpty={false}
            />
        </div >
    )
}