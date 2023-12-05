import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import DatePicker from "react-datepicker";

import moment from 'moment';

import { retrieveCommentApi, updateCommentApi } from 'services/api/CommentApiService'
import { truncateParagraph } from 'services/helpers/listsHelper';

export default function UpdateCommentComponent({ setComments, id, setShowUpdateComment }) {

    const [description, setDescription] = useState('')
    const [reviseDate, setReviseDate] = useState(null)

    const [showInput, setShowInput] = useState(true)
    const [showLoader, setShowLoader] = useState(true)

    useEffect(
        () => retrieveComment()
        , []  // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveComment() {
        retrieveCommentApi({ id })
            .then(response => {
                setDescription(response.data.description)
                setReviseDate(response.data.reviseDate ? moment(response.data.reviseDate).toDate() : null)
                setShowLoader(false)
            })
            .catch(error => console.error(error.message))
    }

    function handleSubmit(error) {
        error.preventDefault();

        const comment = {
            description,
            reviseDate: moment(reviseDate).endOf('date').toDate()
        }

        updateCommentApi({ comment, id })
            .then(response => {
                // console.debug(response)
                setComments(comments => comments.map(comment => {
                    if (comment.id === id) {
                        comment.description = response.data.description;
                        comment.reviseDate = response.data.reviseDate;
                        [comment.truncated_description, comment.truncated] = truncateParagraph(response.data.description);
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
                    <div className="col-lg-12 mb-2">
                        <div className="input-group">
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowInput(true)}>Write</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowInput(false)}>Preview</button>
                            {
                                showLoader &&
                                <span className="loader-container-2" >
                                    <span className="ms-2 loader-2"></span>
                                </span>
                            }
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
                            >Update</button>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary ms-1"
                                onClick={() => setShowUpdateComment(-1)}
                            >Cancel</button>
                        </div>
                    </div>
                </div>
            </form>
        </div >
    )
}