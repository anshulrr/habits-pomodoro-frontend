import { useEffect, useState } from 'react'

import ReactMarkdown from 'react-markdown'

import { retrieveCommentApi, updateCommentApi } from 'services/api/CommentApiService'

export default function UpdateCommentComponent({ setComments, id, setShowUpdateComment }) {

    const [description, setDescription] = useState('')

    const [showInput, setShowInput] = useState(true)

    useEffect(
        () => retrieveComment()
        , []  // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveComment() {
        retrieveCommentApi({ id })
            .then(response => {
                setDescription(response.data.description)
            })
            .catch(error => console.error(error.message))
    }

    function handleSubmit(error) {
        error.preventDefault();

        const comment = {
            description,
        }

        updateCommentApi({ comment, id })
            .then(response => {
                // console.debug(response)
                setComments(comments => comments.map(comment => {
                    if (comment.id === id) {
                        comment.description = response.data.description
                    }
                    return comment;
                }))
                setShowUpdateComment(-1)
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="text-start">
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-12 mb-2">
                        <div className="input-group">
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowInput(true)}>Write</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowInput(false)}>Preview</button>
                        </div>
                        {
                            showInput &&
                            <textarea
                                className="form-control form-control-sm"
                                name="description"
                                rows='5'
                                value={description}
                                placeholder="Description"
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        }
                        {
                            !showInput &&
                            <div className="small overflow-scroll border rounded-1 border-2 p-2" style={{ height: "8rem" }}>
                                <ReactMarkdown
                                    children={description}
                                />
                            </div>
                        }
                    </div>
                    <div className="col-md-12 text-end">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => setShowUpdateComment(-1)}
                        >Cancel</button>
                        <button
                            type="submit"
                            className="btn btn-sm btn-outline-success"
                        >Update Comment</button>
                    </div>
                </div>
            </form>
        </div >
    )
}