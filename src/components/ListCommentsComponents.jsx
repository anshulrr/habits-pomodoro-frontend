import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import ReactMarkdown from 'react-markdown'

import { retrieveAllCommentsApi, getCommentsCountApi } from "../services/api/CommentApiService";
import Pagination from "../services/pagination/Pagination"

import moment from "moment";
import CommentComponent from "./CommentComponent";

export default function ListCommentsComponent({ filterBy, id, title }) {
    const navigate = useNavigate()

    const PAGESIZE = 10;

    const [currentPage, setCurrentPage] = useState(1)

    const [commentsCount, setCommentsCount] = useState(0)
    const [comments, setComments] = useState([])

    useEffect(
        () => getCommentsCount(),
        []
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

    function addNewComment() {
        navigate(`/comments/-1`)
    }

    return (
        <div className="container">
            <div className="row">
                <CommentComponent
                    setComments={setComments}
                    filterBy={filterBy}
                    id={id}
                    title={title}
                />
            </div>

            <hr />

            <div className="row mb-3">
                <div className="col-md-12">
                    <div>
                        <div className="row">
                            <div className="col-12">
                                <h6>
                                    {
                                        filterBy === 'category' &&
                                        <span className="me-1 badge rounded-pill text-bg-secondary">
                                            <span className="bi bi-link-45deg" />
                                        </span> ||
                                        filterBy === 'project' &&
                                        <span className="me-1 badge rounded-pill text-bg-secondary">
                                            <span className="bi bi-folder-plus" />
                                        </span> ||
                                        filterBy === 'task' &&
                                        <span className="me-1 badge rounded-pill text-bg-secondary">
                                            <span className="bi bi-list-ul" />
                                        </span> ||
                                        filterBy === 'pomodoro' &&
                                        <span className="me-1 badge rounded-pill text-bg-secondary">
                                            <span className="bi bi-hourglass-bottom" />
                                        </span>

                                    }
                                    {title}
                                    <span className="ms-1 badge rounded-pill text-bg-secondary">
                                        {commentsCount}
                                        <span className="ms-1 bi bi-chat-right-text" />
                                    </span>
                                </h6>
                            </div>
                        </div>
                        {
                            comments.map(
                                comment => (
                                    <div key={comment.id}>
                                        <div className="col-12 text-truncate text-start">
                                            <div className="badge rounded-pill text-bg-secondary text-wrap ps-2" style={{ fontSize: '0.7rem' }}>
                                                <span>{moment(comment.createdAt).fromNow()}</span>
                                                {
                                                    comment.category &&
                                                    <span>
                                                        <span className="ms-2 bi bi-link-45deg" />
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
                                            <div className="ps-2">
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
            </div>

        </div >
    )
}