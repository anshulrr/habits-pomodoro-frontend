import { useEffect, useRef, useState } from "react"

import ReactMarkdown from 'react-markdown'

import moment from "moment";

import { useAuth } from "services/auth/AuthContext";
import { retrieveAllCommentsApi, getCommentsCountApi } from "services/api/CommentApiService";
import Pagination from "services/pagination/Pagination"

import CommentComponent from "./CommentComponent";
import UpdateCommentComponent from "./UpdateCommentComponent";

export default function ListCommentsComponent({ filterBy, id, title, setShowCommentsId }) {

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
        retrieveAllCommentsApi({ limit: PAGESIZE, offset: (currentPage - 1) * PAGESIZE, filterBy, id })
            .then(response => {
                // console.debug(response)
                setComments(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function getCommentsCount() {
        getCommentsCountApi({ filterBy, id })
            .then(response => {
                setCommentsCount(response.data)
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="comments-overlay">
            <div className="comments-popup">
                <div className="close-popup m-2">
                    <i className="p-2 bi bi-x-lg" onClick={() => setShowCommentsId(-1)}></i>
                </div>

                <div className="container mt-5">

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

                            <div className="row">
                                <div className="col-10 text-start">
                                    <h6>
                                        {
                                            (filterBy === 'category' &&
                                                <i className="me-1 bi bi-link-45deg" />
                                            ) ||
                                            (filterBy === 'project' &&
                                                <span className="me-1">&#9632;</span>
                                            ) ||
                                            (filterBy === 'task' &&
                                                <span className="badge rounded-pill text-bg-light">
                                                    <i className="bi bi-list-ul" />
                                                </span>
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
                                </div>
                                <div className="col-2 text-end">
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
                                            <div key={comment.id} className="row comments-list-row">
                                                <div className="col-10 text-truncate text-start">
                                                    <div className="badge text-bg-secondary fw-normal text-start text-wrap" style={{ fontSize: '0.7rem' }}>
                                                        <span>{
                                                            moment(comment.createdAt).fromNow(true)
                                                        }</span>
                                                        {
                                                            comment.category &&
                                                            <span>
                                                                <i className="ms-2 bi bi-link-45deg" />
                                                                {comment.category}
                                                            </span>
                                                        }

                                                        {
                                                            comment.project &&
                                                            <span>
                                                                <span className="ms-2 me-1" style={{ color: comment.color }}>&#9632;</span>
                                                                {comment.project}
                                                            </span>
                                                        }
                                                        {
                                                            comment.task &&
                                                            <span>
                                                                <i className="ms-2 me-1 bi bi-list-ul" />
                                                                {comment.task}
                                                            </span>
                                                        }
                                                        {
                                                            comment.reviseDate &&
                                                            <span>
                                                                <i className="ms-2 me-1 bi bi-calendar3-event" />
                                                                {moment(comment.reviseDate).format("DD/MM/yyyy")}
                                                            </span>
                                                        }
                                                    </div>

                                                </div>
                                                {
                                                    showUpdateComment !== comment.id &&
                                                    <div className="col-2 ps-0 text-end comments-list-update">
                                                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 lh-sm" onClick={() => setShowUpdateComment(comment.id)}>
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                    </div>
                                                }

                                                {
                                                    showUpdateComment !== comment.id &&
                                                    <div className="col-12 text-truncate text-start mb-3">
                                                        <div className="border rounded text-wrap ps-2 py-1 small">
                                                            <ReactMarkdown
                                                                children={comment.description}
                                                            />
                                                        </div>
                                                    </div>
                                                }

                                                {
                                                    showUpdateComment === comment.id &&
                                                    <div className="col-12 text-truncate text-start mb-3">
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

            </div>
        </div>
    )
}