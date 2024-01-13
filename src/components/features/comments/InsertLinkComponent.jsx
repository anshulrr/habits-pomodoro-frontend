import { useState } from 'react'

export default function InsertLinkComponent({ setDescription, setShowInsertLink }) {

    const [text, setText] = useState('');
    const [link, setLink] = useState('');

    function handleSubmit(error) {
        error.preventDefault();
        setDescription(prev => prev + ` [${text}](${link})`);
        setShowInsertLink(false);
    }

    return (

        <div className="task-overlay">
            <div className="task-popup small-popup">
                <div className="task-close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowInsertLink(false)}></i>
                </div>
                <div className="container my-4">
                    <div className="text-start mb-3">
                        <p className="small mb-1">Insert a Link</p>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-12 mb-2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="linkText"
                                            name="linkText"
                                            placeholder="Link Text"
                                            value={text}
                                            required
                                            onChange={(e) => setText(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-lg-12 mb-2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="noteLink"
                                            name="noteLink"
                                            placeholder="Link"
                                            value={link}
                                            required
                                            onChange={(e) => setLink(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-lg-12 text-end">
                                        <button
                                            type="submit"
                                            className="btn btn-sm btn-outline-success py-1"
                                        >Insert At End</button>
                                    </div>
                                </div>
                            </form>
                        </div >
                    </div >
                </div >
            </div >
        </div >
    )
}