import { useEffect, useRef, useState } from "react"

import ReactMarkdown from 'react-markdown'

import moment from "moment";

import { useAuth } from "services/auth/AuthContext";
import { retrieveAllCommentsApi, getCommentsCountApi } from "services/api/CommentApiService";
import Pagination from "services/pagination/Pagination"

import CommentComponent from "./CommentComponent";
import UpdateCommentComponent from "./UpdateCommentComponent";

export default function ListFilteredCommentsComponent({
    filterBy,
    id,
    title,
    projectColor,
    categoryIds,
    withReviseDate
}) {

    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const PAGESIZE = userSettings?.pageCommentsCount || 10;

    const [currentPage, setCurrentPage] = useState(1)

    const [commentsCount, setCommentsCount] = useState(-1)
    const [comments, setComments] = useState([])

    const [showCreateComment, setShowCreateComment] = useState(false)
    const [showUpdateComment, setShowUpdateComment] = useState(false)

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
        retrieveAllCommentsApi({ limit: PAGESIZE, offset: (currentPage - 1) * PAGESIZE, filterBy, id, categoryIds, withReviseDate })
            .then(response => {
                // console.debug(response)
                setComments(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function getCommentsCount() {
        getCommentsCountApi({ filterBy, id, categoryIds, withReviseDate })
            .then(response => {
                setCommentsCount(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function generateDateColor(comment) {
        if (moment().diff(moment(comment.reviseDate)) > 0) {
            return "text-danger";
        } else {
            return "text-secondary";
        }
    }

    return (
        <div className="">

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

            <div className="row mb-3">
                <div className="col-lg-12">

                    <div className="d-flex justify-content-between">
                        <h6>
                            {
                                (filterBy === 'category' &&
                                    <i className="me-1 bi bi-link-45deg" />
                                ) ||
                                (filterBy === 'project' &&
                                    <span className="me-1" style={{ color: projectColor }}>&#9632;</span>
                                ) ||
                                (filterBy === 'task' &&
                                    <i className="me-1 bi bi-list-ul" />
                                ) ||
                                (filterBy === 'pomodoro' &&
                                    <i className="me-1 bi bi-hourglass" />
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
                        </div>
                    </div>

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
                                                    <span className={generateDateColor(comment)}>
                                                        <i className="bi bi-calendar3-event" style={{ paddingRight: "0.1rem" }} />
                                                        {moment(comment.reviseDate).format("DD/MM/yyyy")}
                                                    </span>
                                                </div>
                                            }
                                        </div>

                                        <div className="d-flex justify-content-end">
                                            {
                                                showUpdateComment !== comment.id &&
                                                <div className="comments-list-update">
                                                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" style={{ marginRight: "2px" }} onClick={() => setShowUpdateComment(comment.id)}>
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
                                                        children={comment.description}
                                                    />
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