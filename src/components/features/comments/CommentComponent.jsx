import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import DatePicker from "react-datepicker";

import moment from 'moment'

import { createCommentApi } from 'services/api/CommentApiService'
import { truncateParagraph } from 'services/helpers/listsHelper';
import { calculateTextAreaRows, filterPastTime } from 'services/helpers/helper';
import InsertLinkComponent from './InsertLinkComponent';

export default function CommentComponent({ setComments, filterBy, id, title, setShowCreateComment, setCommentsCount }) {

    const [description, setDescription] = useState('')
    const [reviseDate, setReviseDate] = useState(null)

    const [showInput, setShowInput] = useState(true)

    const [showInsertLink, setShowInsertLink] = useState(false);

    const [errorMessage, setErrorMessage] = useState('')

    function handleSubmit(error) {
        error.preventDefault();

        const comment = {
            description,
            reviseDate
        }
        // console.debug({ comment, filterBy, id })

        createCommentApi({ comment, filterBy, id })
            .then(response => {
                // console.debug(response)
                setDescription('')
                const data = response.data
                data[filterBy] = title

                // update truncated description
                const [para, truncated] = truncateParagraph(data.description);
                data.truncated_description = para;
                data.truncated = truncated

                setComments(prevComment => [data, ...prevComment])
                setCommentsCount(count => count + 1)
                setShowInput(true)
                setShowCreateComment(false)
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="task-overlay">
            <div className="task-popup">
                <div className="task-close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowCreateComment(false)}></i>
                </div>
                <div className="container my-4">
                    <div className="text-start">
                        {
                            showInsertLink &&
                            <InsertLinkComponent
                                setDescription={setDescription}
                                setShowInsertLink={setShowInsertLink}
                            />
                        }
                        <div>
                            <p className="small pt-1 mb-1 text-secondary">Add a new note</p>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="input-group">
                                            <button type="button" className={"btn btn-sm btn-outline-secondary " + (showInput ? "active" : "")} onClick={() => setShowInput(true)}>
                                                <label htmlFor="createTextArea">
                                                    Write
                                                </label>
                                            </button>
                                            <button type="button" className={"btn btn-sm btn-outline-secondary " + (!showInput ? "active" : "")} onClick={() => setShowInput(false)}>
                                                Preview
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-6 text-end">
                                        <div className="input-group justify-content-end">
                                            <button type="button" className={"btn btn-sm btn-outline-secondary"} onClick={() => setShowInsertLink(!showInsertLink)}>
                                                <i className="bi bi-link"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-lg-12 mb-2">
                                        <textarea
                                            id="createTextArea"
                                            className="form-control form-control-sm"
                                            name="description"
                                            rows={calculateTextAreaRows(description)}
                                            value={description}
                                            placeholder="Add note"
                                            onChange={(e) => {
                                                setDescription(e.target.value);
                                                setErrorMessage("Click on Save to create note");
                                            }}
                                            required
                                            autoFocus
                                            style={{ display: showInput ? 'block' : 'none' }}
                                        />
                                        <div
                                            className="small text-wrap bg-white border rounded-1 border-2 p-2 comments-markdown"
                                            style={{ display: !showInput ? 'block' : 'none', minHeight: "8rem" }}>
                                            <ReactMarkdown
                                                children={description}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <label htmlFor="reviseDate" className="text-secondary my-auto small">
                                            Revise By<i className="ms-1 me-1 bi bi-calendar3-event" />
                                        </label>
                                        <DatePicker
                                            className="form-control form-control-sm"
                                            id="reviseDate"
                                            selected={reviseDate}
                                            dateFormat="dd/MM/yyyy HH:mm"
                                            minDate={new Date()}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            filterTime={filterPastTime}
                                            onFocus={e => e.target.blur()}      // fix for keyboard open on focus on mobile device
                                            onSelect={(date) => setReviseDate(moment(date).endOf('date').toDate())}
                                            onChange={(date) => setReviseDate(date)}
                                        />
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary ms-1"
                                                onClick={() => setShowCreateComment(false)}
                                            ><i className="bi bi-x-lg" /></button>
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                className="btn btn-sm btn-outline-success ms-1"
                                            >Save</button>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        {errorMessage && <div className="alert alert-info mt-1 mb-0 py-0 text-center"><small>{errorMessage}</small></div>}
                                    </div>
                                </div>
                            </form>
                        </div >
                    </div >
                </div>
            </div>
        </div>
    )
}