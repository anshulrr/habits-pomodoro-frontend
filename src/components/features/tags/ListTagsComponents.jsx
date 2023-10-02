import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";

import { retrieveAllTagsApi, getTagsCountApi } from "services/api/TagApiService";
import Pagination from "services/pagination/Pagination"
import { useAuth } from "services/auth/AuthContext";

import CreateTagComponent from "./CreateTagComponent";
import UpdateTagComponent from "./UpdateTagComponent";

export default function ListTagsComponent({ setProject, tag, setTag }) {
    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const navigate = useNavigate()
    const { state } = useLocation();

    const tagsListElement = useRef(null);

    // for first time login default value is needed
    const PAGESIZE = userSettings.pageTagsCount || 5;

    const [tagsCount, setTagsCount] = useState(-1)
    const [tags, setTags] = useState([])

    const [showTags, setShowTags] = useState(false);

    const [showCreateTag, setShowCreateTag] = useState(false)
    const [showUpdateTag, setShowUpdateTag] = useState(-1)

    // state might not be preset (eg. opening url in a new tab)
    // const [tag, setTag] = useState(state && state.tag)
    const [currentPage, setCurrentPage] = useState((state && state.currentTagsPage) || 1)

    useEffect(
        () => {
            getTagsCount()
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    useEffect(
        () => {
            // console.debug('re-render ListTagsComponents')
            refreshTags()
        }, [currentPage] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshTags() {
        setTags([]);
        retrieveAllTagsApi({ limit: PAGESIZE, offset: (currentPage - 1) * PAGESIZE })
            .then(response => {
                // console.debug(response)
                setTags(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function getTagsCount() {
        getTagsCountApi()
            .then(response => {
                setTagsCount(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function onUpdateTag(tg) {
        setProject(null);
        if (tag && tag.id === tg.id) {
            return;
        }
        setTag(tg);
        // udpate state: to be passed with further navigations
    }

    return (
        <div className="mt-3 mb-3">
            {/* {message && <div className="alert alert-warning">{message}</div>} */}
            <div>
                <div className="d-flex justify-content-between">
                    <h6 className="d-flex justify-content-start">
                        <span>
                            Tags
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
                    <div className="input-group justify-content-end">
                        {
                            showTags && !showCreateTag &&
                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-2" onClick={() => setShowCreateTag(true)}>
                                <i className="bi bi-plus-circle" />
                            </button>
                        }
                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-2" onClick={() => setShowTags(!showTags)}>
                            {
                                !showTags &&
                                <i className="bi bi-eye" />
                            }
                            {
                                showTags &&
                                <i className="bi bi-eye-slash" />
                            }
                        </button>
                    </div>

                </div>

                {
                    showTags && showCreateTag &&
                    <div className="row">
                        <CreateTagComponent
                            setTags={setTags}
                            setShowCreateTag={setShowCreateTag}
                            setTagsCount={setTagsCount}
                        />
                    </div>
                }
                {
                    showTags && tagsCount === 0 &&
                    <div className="alert alert-light py-1 mt-1 small">
                        <i className="pe-1 bi bi-clipboard-data" />
                        Nothing to display
                    </div>
                }
                {
                    showTags && tagsCount !== 0 && tags.length === 0 &&
                    <div className="loader-container" style={{ height: tagsListElement.current ? tagsListElement.current.offsetHeight : 0 }}>
                        <div className="loader"></div>
                    </div>
                }
                {
                    showTags &&
                    <div>
                        <div id="tags-list" ref={tagsListElement}>
                            {
                                tags.map(
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
                                                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => setShowUpdateTag(tg.id)}>
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                showUpdateTag === tg.id &&
                                                <UpdateTagComponent
                                                    tag={tg}
                                                    setTags={setTags}
                                                    setShowUpdateTag={setShowUpdateTag}
                                                />
                                            }
                                        </div>
                                    )
                                )
                            }
                        </div>

                        <Pagination
                            className="pagination-bar mb-0 ps-0"
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