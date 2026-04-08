import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";

import Pagination from "services/pagination/Pagination"
import { useAuth } from "services/auth/AuthContext";
import { isEmpty } from "services/helpers/helper";

import CreateTagComponent from "./CreateTagComponent";
import UpdateTagComponent from "./UpdateTagComponent";
import { useData } from "services/db/DataContext";

export default function ListTagsComponent({
    setProject,
    tag,
    setTag,
    setShowLeftMenu
}) {
    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const navigate = useNavigate()
    const { state } = useLocation();

    const dataContext = useData();

    const [tags, setTags] = useState([...dataContext.tagsMap.values()]);
    const tagsCount = tags.length;

    useEffect(
        () => {
            setTags([...dataContext.tagsMap.values()]);
        },
        [dataContext]
    )

    const tagsListElement = useRef(null);

    // for first time login default value is needed
    const PAGESIZE = userSettings.pageTagsCount || 5;

    const IS_TAGS_DEFAULT = userSettings.homePageDefaultList === 'tags';

    // state might not be preset (eg. opening url in a new tab)
    // const [tag, setTag] = useState(state && state.tag)
    const [currentPage, setCurrentPage] = useState((state && state.currentTagsPage) || 1)


    const displayTags = useMemo(() => {
        // console.debug('recomputing displayTags, tag length is ', tags.length, { tags, currentPage })
        const firstPageIndex = (currentPage - 1) * PAGESIZE;
        const lastPageIndex = firstPageIndex + PAGESIZE;
        return tags.slice(firstPageIndex, lastPageIndex);
    }, [tags, currentPage, PAGESIZE])

    const [showCreateTag, setShowCreateTag] = useState(false)
    const [showUpdateTag, setShowUpdateTag] = useState(-1)

    useEffect(
        () => {
            // console.debug('re-render ListTagsComponents')
            if (IS_TAGS_DEFAULT && isEmpty(state) && !tag && !!tags) {
                setTag(tags[0]);
                // udpate state for first time load
                updateAppStates(tags[0]);
            }
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function onUpdateTag(tg) {
        setProject(null);
        if (tag && tag.id === tg.id) {
            return;
        }
        setTag(tg);
        // udpate state: to be passed with further navigations
        updateAppStates(tg);
        setShowLeftMenu(false);
    }

    function updateAppStates(tg) {
        // fix for directly opening url in a new tab
        let local_state = {};
        if (state) {
            local_state = { ...state };
        }
        local_state.project = null;
        local_state.tag = tg;
        local_state.filters = null;
        local_state.currentTasksPage = 1;
        local_state.currentArchivedTasksPage = 1;
        local_state.showArchivedTasks = false;
        // for page refresh: set it right away
        navigate('/', { state: local_state, replace: true });
    }

    return (
        <div className="mt-3 mb-3">
            {/* {message && <div className="alert alert-warning">{message}</div>} */}
            <div>
                <div className="d-flex justify-content-between text-info-emphasis">
                    <h6>
                        <span>
                            TAGS
                        </span>
                        {
                            tagsCount !== -1 &&
                            <span className="ms-1 badge rounded-pill text-bg-secondary">
                                {tagsCount}
                                <span className="ms-1">
                                    <i className="bi bi-tags-fill" />
                                </span>
                            </span>
                        }
                    </h6>
                    <div>
                        {
                            !showCreateTag &&
                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-2" onClick={() => setShowCreateTag(true)}>
                                <i className="bi bi-plus-circle" />
                            </button>
                        }
                    </div>

                </div>

                {
                    showCreateTag &&
                    <div className="row">
                        <CreateTagComponent
                            setShowCreateTag={setShowCreateTag}
                        />
                    </div>
                }
                {
                    tagsCount === 0 &&
                    <div className="alert alert-light py-1 mt-1 small text-center">
                        <i className="pe-1 bi bi-clipboard-data" />
                        Nothing to display
                    </div>
                }
                {
                    tagsCount !== 0 && displayTags.length === 0 &&
                    <div className="loader-container" style={{ height: tagsListElement.current ? tagsListElement.current.offsetHeight : 0 }}>
                        <div className="loader"></div>
                    </div>
                }
                {
                    <div>
                        <div id="tags-list" ref={tagsListElement}>
                            {
                                displayTags.map(
                                    tg => (
                                        <div
                                            key={tg.id}
                                            onClick={() => onUpdateTag(tg)}
                                        >
                                            <div className={(tag && tg.id === tag.id ? "list-selected " : "") + "row py-2 list-row"}>
                                                {/* todo: decide better solution for maxWidth */}
                                                <div className="col-8 text-truncate text-start">
                                                    <span className="project-name">
                                                        <i className="bi bi-tag-fill me-1" style={{ color: tg.color }}></i>
                                                        {tg.name}
                                                    </span>
                                                </div>
                                                <div className="col-4 ps-0 subscript text-secondary text-truncate text-end list-details">
                                                    <span className="">
                                                        <i className="ps-1 bi bi-arrow-up" />
                                                        {tg.priority}
                                                    </span>
                                                </div>
                                                <div className="col-4 ps-0 text-secondary text-end list-button">
                                                    <div className="input-group justify-content-end">
                                                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => setShowUpdateTag(tg.id)}>
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                showUpdateTag === tg.id &&
                                                <UpdateTagComponent
                                                    tag={tg}
                                                    setTag={setTag}
                                                    setShowUpdateTag={setShowUpdateTag}
                                                />
                                            }
                                        </div>
                                    )
                                )
                            }
                        </div>

                        <Pagination
                            className="pagination-bar pagination-scroll mt-1 mb-0 ps-0"
                            currentPage={currentPage}
                            totalCount={tagsCount}
                            pageSize={PAGESIZE}
                            onPageChange={page => {
                                setCurrentPage(page);
                                state.currentTagsPage = page;
                                navigate(`/`, { state, replace: true });
                            }}
                        />
                    </div>
                }

            </div>
        </div>
    )
}