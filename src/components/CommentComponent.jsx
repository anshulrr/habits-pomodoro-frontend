import { useState } from 'react'
import { createCommentApi } from '../services/api/CommentApiService'

export default function CommentComponent({ setComments, filterBy, id, title }) {

    const [description, setDescription] = useState('')

    function handleSubmit(error) {
        error.preventDefault();

        const comment = {
            description,
        }

        console.debug({ comment, filterBy, id })

        createCommentApi({ comment, filterBy, id })
            .then(response => {
                console.debug(response)
                setDescription('')
                const data = response.data
                data[filterBy] = title
                setComments(prevComment => [data, ...prevComment])
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="text-start">
            <h6>Enter Comment Details</h6>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                name="description"
                                value={description}
                                placeholder="Description"
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-12 text-end">
                            <button
                                type="submit"
                                className="btn btn-sm btn-success"
                            >Save Comment</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}