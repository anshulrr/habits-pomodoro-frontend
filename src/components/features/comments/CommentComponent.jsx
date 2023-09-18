import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import DatePicker from "react-datepicker";

import moment from 'moment'

import { createCommentApi } from 'services/api/CommentApiService'

export default function CommentComponent({ setComments, filterBy, id, title, setShowCreateComment, setCommentsCount }) {

    const [description, setDescription] = useState('')
    const [reviseDate, setReviseDate] = useState(null)

    const [showInput, setShowInput] = useState(true)

    function handleSubmit(error) {
        error.preventDefault();

        const comment = {
            description,
            reviseDate: moment(reviseDate).endOf('date').toDate()
        }
        // console.debug({ comment, filterBy, id })

        createCommentApi({ comment, filterBy, id })
            .then(response => {
                // console.debug(response)
                setDescription('')
                const data = response.data
                data[filterBy] = title
                setComments(prevComment => [data, ...prevComment])
                setCommentsCount(count => count + 1)
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
                        <div className="col-lg-12 mb-2">
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
                                <div className="small overflow-scroll bg-white border rounded-1 border-2 p-2" style={{ height: "8rem" }}>
                                    <ReactMarkdown
                                        children={description}
                                    />
                                </div>
                            }
                        </div>
                        <div className="d-flex justify-content-end">
                            <label htmlFor="reviseDate" className="text-secondary my-auto small">
                                Revise By<i className="ms-1 me-1 bi bi-calendar3-event" />
                            </label>
                            <DatePicker
                                className="form-control form-control-sm"
                                id="reviseDate"
                                selected={reviseDate}
                                dateFormat="dd/MM/yyyy"
                                minDate={new Date()}
                                onFocus={e => e.target.blur()}      // fix for keyboard open on focus on mobile device
                                onChange={(reviseDate) => setReviseDate(reviseDate)}
                            />
                            <div>
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-outline-success ms-1"
                                >Save</button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary ms-1"
                                    onClick={() => setShowCreateComment(false)}
                                >Cancel</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    )
}