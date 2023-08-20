import { useEffect, useState } from "react"

import ReactMarkdown from 'react-markdown'

import { useAuth } from "../services/auth/AuthContext";
import { retrieveAllCommentsApi, getCommentsCountApi } from "../services/api/CommentApiService";
import Pagination from "../services/pagination/Pagination"

import moment from "moment";
import CommentComponent from "./CommentComponent";

export default function ListCommentsComponent({ filterBy, id, title, setShowCommentsId }) {

    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const PAGESIZE = userSettings?.pageCommentsCount || 10;

    const [currentPage, setCurrentPage] = useState(1)

    const [commentsCount, setCommentsCount] = useState(0)
    const [comments, setComments] = useState([])

    const [showCreateComment, setShowCreateComment] = useState(false)

    useEffect(
        () => getCommentsCount(),
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    useEffect(
        () => {
            // console.debug('re-render ListCommentsComponents')
            refreshComments()
        }, [currentPage] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshComments() {
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
                            />
                        </div>
                    }

                    <div className="row mb-3">
                        <div className="col-md-12">

                            <div className="row">
                                <div className="col-10">
                                    <h6>
                                        {
                                            (filterBy === 'category' &&
                                                <span className="me-1 bi bi-link-45deg" />
                                            ) ||
                                            (filterBy === 'project' &&
                                                <span className="me-1 bi bi-folder-plus" />
                                            ) ||
                                            (filterBy === 'task' &&
                                                <span className="me-1 bi bi-list-ul" />
                                            ) ||
                                            (filterBy === 'pomodoro' &&
                                                <span className="me-1 bi bi-hourglass" />
                                            )

                                        }
                                        {title}
                                        <span className="ms-1 badge rounded-pill text-bg-secondary">
                                            {commentsCount}
                                            <span className="ms-1 bi bi-chat-right-text" />
                                        </span>
                                    </h6>
                                </div>
                                <div className="col-2 text-end">
                                    {
                                        !showCreateComment &&
                                        <i className="p-1 bi bi-plus-square" onClick={() => setShowCreateComment(true)}></i>
                                    }
                                </div>
                            </div>

                            {
                                comments.map(
                                    comment => (
                                        <div key={comment.id} className="row">
                                            <div className="col-12 text-truncate text-start mb-2">
                                                <div className="badge text-bg-secondary text-start text-wrap ps-2" style={{ fontSize: '0.7rem' }}>
                                                    <span>{moment(comment.createdAt).fromNow()}</span>
                                                    {
                                                        comment.category &&
                                                        <span>
                                                            <span className="ms-2 me-1 bi bi-link-45deg" />
                                                            {comment.category}
                                                        </span>
                                                    }

                                                    {
                                                        comment.project &&
                                                        <span>
                                                            <span className="ms-2 me-1 bi bi-folder-plus" />
                                                            {comment.project}
                                                        </span>
                                                    }
                                                    {
                                                        comment.task &&
                                                        <span>
                                                            <span className="ms-2 me-1 bi bi-list-ul" />
                                                            {comment.task}
                                                        </span>
                                                    }
                                                </div>
                                                <div className="border rounded text-wrap ps-2">
                                                    <ReactMarkdown
                                                        children={comment.description}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )
                            }

                            <Pagination
                                className="pagination-bar mt-3"
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