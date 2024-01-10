import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import DatePicker from "react-datepicker";

import moment from 'moment';

import { retrieveCommentApi, updateCommentApi } from 'services/api/CommentApiService'
import { truncateParagraph } from 'services/helpers/listsHelper';
import { calculateTextAreaRows, filterPastTime } from 'services/helpers/helper';
import InsertLinkComponent from './InsertLinkComponent';

export default function UpdateCommentComponent({ setComments, id, setShowUpdateComment }) {

    const [description, setDescription] = useState('')
    const [reviseDate, setReviseDate] = useState(null)

    const [showInput, setShowInput] = useState(true)
    const [showLoader, setShowLoader] = useState(true)

    const [showInsertLink, setShowInsertLink] = useState(false);

    const [errorMessage, setErrorMessage] = useState('')

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
            reviseDate
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
        <div className="task-overlay">
            <div className="task-popup">
                <div className="task-close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowUpdateComment(-1)}></i>
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
                        <p className="small pt-1 mb-1 text-secondary">Update note</p>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-6">
                                    <div className="input-group">
                                        <button type="button" className={"btn btn-sm btn-outline-secondary " + (showInput ? "active" : "")} onClick={() => setShowInput(true)}>
                                            <label htmlFor="updateTextArea">
                                                Write
                                            </label>
                                        </button>
                                        <button type="button" className={"btn btn-sm btn-outline-secondary " + (!showInput ? "active" : "")} onClick={() => setShowInput(false)}>Preview</button>
                                        {
                                            showLoader &&
                                            <span className="loader-container-2" >
                                                <span className="ms-2 loader-2"></span>
                                            </span>
                                        }
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
                                        id="updateTextArea"
                                        className="form-control form-control-sm"
                                        name="description"
                                        rows={calculateTextAreaRows(description)}
                                        value={description}
                                        placeholder="Update note"
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                            setErrorMessage("Click on Update to save");
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
                                            onClick={() => setShowUpdateComment(-1)}
                                        ><i className="bi bi-x-lg" /></button>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-outline-success ms-1"
                                        >Update</button>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    {errorMessage && <div className="alert alert-info mt-1 mb-0 py-0 text-center"><small>{errorMessage}</small></div>}
                                </div>
                            </div>
                        </form>
                    </div >
                </div >
            </div >
        </div>
    )
}