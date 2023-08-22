import { useState } from 'react'

import ReactMarkdown from 'react-markdown'

import { createCommentApi } from 'services/api/CommentApiService'

export default function CommentComponent({ setComments, filterBy, id, title, setShowCreateComment }) {

    const [description, setDescription] = useState('')

    const [showInput, setShowInput] = useState(true)

    function handleSubmit(error) {
        error.preventDefault();

        const comment = {
            description,
        }
        // console.debug({ comment, filterBy, id })

        createCommentApi({ comment, filterBy, id })
            .then(response => {
                console.debug(response)
                setDescription('')
                const data = response.data
                data[filterBy] = title
                setComments(prevComment => [data, ...prevComment])
                setShowInput(true)
                setShowCreateComment(false)
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="text-start mb-3">
            <h6>Enter Comment Details</h6>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-12 mb-3">
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
                                onClick={() => setShowCreateComment(false)}
                            >Cancel</button>
                            <button
                                type="submit"
                                className="btn btn-sm btn-outline-success"
                            >Save Comment</button>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    )
}