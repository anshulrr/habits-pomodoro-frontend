import { useEffect, useRef, useState } from "react"

import ReactMarkdown from 'react-markdown'

import moment from "moment";

import { useAuth } from "services/auth/AuthContext";
import { retrieveAllCommentsApi, getCommentsCountApi, getCommentsTagsApi } from "services/api/CommentApiService";
import Pagination from "services/pagination/Pagination"
import { formatDate, generateDateColor, truncateParagraph } from "services/helpers/listsHelper";

import CommentComponent from "./CommentComponent";
import UpdateCommentComponent from "./UpdateCommentComponent";
import MapCommentTagsComponent from "../tags/MapCommentTagsComponent";

export default function ListFilteredCommentsComponent({
    filterBy,
    id,
    title,
    projectColor,
    categoryIds,
    filterWithReviseDate,
    tags
}) {

    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const PAGESIZE = userSettings?.pageCommentsCount || 10;

    const [currentPage, setCurrentPage] = useState(1)

    const [commentsCount, setCommentsCount] = useState(-1)
    const [comments, setComments] = useState([])

    const [showCreateComment, setShowCreateComment] = useState(false)
    const [showUpdateComment, setShowUpdateComment] = useState(false)
    const [showMapTags, setShowMapTags] = useState(-1);

    const [showMoreId, setShowMoreId] = useState(-1);

    const listElement = useRef(null);
    const [elementHeight, setElementHeight] = useState(0);

    useEffect(
        () => {
            getCommentsCount()

            const observer = new ResizeObserver(handleResize);
            observer.observe(listElement.current);
            return () => {
                // Cleanup the observer by unobserving all elements
                observer.disconnect();
            };
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    useEffect(
        () => {
            // console.debug('re-render ListCommentsComponents')
            refreshComments()
        }, [currentPage] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const handleResize = () => {
        if (listElement.current !== null && listElement.current.offsetHeight !== 0) {
            // console.debug(currentPage, listElement.current.offsetHeight);
            setElementHeight(listElement.current.offsetHeight);
        }
    };

    function refreshComments() {
        setComments([]);
        retrieveAllCommentsApi({ limit: PAGESIZE, offset: (currentPage - 1) * PAGESIZE, filterBy, id, categoryIds, filterWithReviseDate })
            .then(response => {
                // console.debug(response)
                const truncated_comments = truncateComments(response.data);
                setComments(truncated_comments);
                getCommentsTags(truncated_comments);
            })
            .catch(error => console.error(error.message))
    }

    function truncateComments(comments) {
        for (const element of comments) {
            [element.truncated_description, element.truncated] = truncateParagraph(element.description);
        }
        return comments;
    }

    function getCommentsCount() {
        getCommentsCountApi({ filterBy, id, categoryIds, filterWithReviseDate })
            .then(response => {
                setCommentsCount(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function getCommentsTags(comments) {
        // console.debug(tags)
        if (!tags || tags.size === 0) {
            return;
        }

        const commentIds = comments.map(comment => comment.id);
        const map = new Map(comments.map(comment => {
            comment.tags = [];
            return [comment.id, comment];
        }));

        getCommentsTagsApi(commentIds)
            .then(response => {
                // using Map for easy access and update
                for (let i = 0; i < response.data.length; i++) {
                    map.get(response.data[i][0]).tags.push(tags.get(response.data[i][1]))
                }
                setComments([...map.values()]);
            })
            .catch(error => console.error(error.message))
    }

    function reloadComments() {
        getCommentsCount();
        refreshComments();
    }

    return (
        <div className="">


            <div className="row mb-3">
                <div className="col-lg-12">

                    <div className="d-flex justify-content-between">
                        <h6>
                            {
                                (filterBy === 'project' &&
                                    <span className="me-1" style={{ color: projectColor }}>&#9632;</span>
                                ) ||
                                (filterBy === 'task' &&
                                    <i className="me-1 bi bi-list-ul" />
                                )

                            }
                            {title}
                            {
                                commentsCount !== -1 &&
                                <span className="ms-1 badge rounded-pill text-bg-secondary">
                                    {commentsCount}
                                    <i className="ms-1 bi bi-chat-right-text" />
                                </span>
                            }
                        </h6>
                        <div>
                            {
                                !showCreateComment &&
                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => setShowCreateComment(true)}>
                                    <i className="bi bi-plus-circle"></i>
                                </button>
                            }
                            {
                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 ms-1" onClick={() => reloadComments()}>
                                    <i className="bi bi-arrow-clockwise" />
                                </button>
                            }
                        </div>
                    </div>


                    {
                        showCreateComment &&
                        <div className="row">
                            <CommentComponent
                                setComments={setComments}
                                filterBy={filterBy}
                                id={id}
                                title={title}
                                setShowCreateComment={setShowCreateComment}
                                setCommentsCount={setCommentsCount}
                            />
                        </div>
                    }

                    {
                        commentsCount === 0 &&
                        <div className="alert alert-light text-center small mb-0">
                            <i className="pe-1 bi bi-clipboard-data" />
                            Nothing to display
                        </div>
                    }

                    {
                        commentsCount !== 0 && comments.length === 0 &&
                        <div className="loader-container" style={{ height: elementHeight }}>
                            <div className="loader"></div>
                        </div>
                    }

                    <div id="comments-list" ref={listElement}>
                        {
                            comments.map(
                                comment => (
                                    <div key={comment.id} className="comments-list-row">

                                        <div className="d-flex justify-content-between flex-wrap comments-subscript">
                                            <div className="d-flex justify-content-start flex-wrap comments-subscript">
                                                <div className="me-2 text-secondary fw-normal text-start">
                                                    {
                                                        moment(comment.createdAt).fromNow(false)
                                                    }
                                                </div>
                                                {
                                                    comment.category &&
                                                    <div className="me-2 text-secondary fw-normal text-start">
                                                        <i className="bi bi-link-45deg" />
                                                        {comment.category}
                                                    </div>
                                                }
                                                {
                                                    comment.project &&
                                                    <div className="me-2 text-secondary fw-normal text-start">
                                                        <span style={{ color: comment.color, paddingRight: "0.1rem" }}>&#9632;</span>
                                                        {comment.project}
                                                    </div>
                                                }
                                                {
                                                    comment.task &&
                                                    <div className="me-2 text-secondary fw-normal text-start">
                                                        <i className="bi bi-list-ul" style={{ paddingRight: "0.1rem" }} />
                                                        {comment.task}
                                                    </div>
                                                }
                                                {
                                                    comment.reviseDate &&
                                                    <div className="me-2 fw-normal text-start">
                                                        <span className={generateDateColor(comment.reviseDate)}>
                                                            <i className="bi bi-calendar3-event" style={{ paddingRight: "0.1rem" }} />
                                                            {formatDate(comment.reviseDate)}
                                                        </span>
                                                    </div>
                                                }
                                            </div>

                                            <div className="justify-content-end text-secondary">
                                                {
                                                    comment.tags && comment.tags.length > 0 &&
                                                    comment.tags.map(
                                                        (tag, tag_index) => (
                                                            <span key={tag_index} className="me-1">
                                                                <i className="bi bi-tag-fill" style={{ color: tag.color, paddingRight: "0.1rem" }} />
                                                                {tag.name}
                                                            </span>
                                                        )
                                                    )
                                                }
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-end">
                                            {
                                                showUpdateComment !== comment.id &&
                                                <div className="comments-list-update">
                                                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => setShowMapTags(comment.id)}>
                                                        <i className="bi bi-tags" />
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 ms-1" style={{ marginRight: "2px" }} onClick={() => setShowUpdateComment(comment.id)}>
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                </div>
                                            }
                                        </div>

                                        {
                                            showUpdateComment !== comment.id &&
                                            <div className="text-truncate text-start mb-3">
                                                <div className="border rounded text-wrap px-2 py-1 small comments-list-card">
                                                    <ReactMarkdown
                                                        children={showMoreId === comment.id ? comment.description : comment.truncated_description}
                                                    />

                                                    {
                                                        comment.truncated &&
                                                        <div className="d-flex justify-content-end mb-1">
                                                            {
                                                                showMoreId !== comment.id &&
                                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => setShowMoreId(comment.id)}>
                                                                    <i className="bi bi-arrow-down" />
                                                                </button>
                                                            }
                                                            {
                                                                showMoreId === comment.id &&
                                                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => setShowMoreId(-1)}>
                                                                    <i className="bi bi-arrow-up" />
                                                                </button>
                                                            }
                                                        </div>
                                                    }
                                                </div>

                                            </div>
                                        }

                                        {
                                            showUpdateComment === comment.id &&
                                            <div className="text-truncate text-start mb-3">
                                                <UpdateCommentComponent
                                                    setComments={setComments}
                                                    id={comment.id}
                                                    setShowUpdateComment={setShowUpdateComment}
                                                />
                                            </div>
                                        }

                                        {
                                            showMapTags === comment.id &&
                                            <MapCommentTagsComponent
                                                id={comment.id}
                                                setComments={setComments}
                                                tagsMap={tags}
                                                setShowMapTags={setShowMapTags}
                                            />
                                        }

                                    </div>
                                )
                            )
                        }
                    </div>

                    <Pagination
                        className="pagination-bar ps-0"
                        currentPage={currentPage}
                        totalCount={commentsCount}
                        pageSize={PAGESIZE}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            </div>

        </div >
    )
}