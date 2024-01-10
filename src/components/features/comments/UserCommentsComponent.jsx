import { useState } from 'react';

export default function UserCommentsComponent() {
    const [showComments, setShowComments] = useState(-1);

    return (
        <div>
            <span className="user-comments-icon">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowComments(-showComments)}>
                    <i className="bi bi-journal-text" />
                </button>
            </span>
            {
                <span className="user-comments-overlay" style={{ display: (showComments === 1 ? "block" : "none") }} >

                    <div className="comments-overlay">
                        <div className="comments-popup">
                            <div className="close-popup m-2">
                                <i className="p-1 bi bi-x-lg" onClick={() => setShowComments(-1)}></i>
                            </div>

                            <div className="container mt-4">
                                <ListCommentsComponent
                                    filterBy={'user'}
                                    id={id}
                                    project={project}
                                />
                            </div >

                        </div>
                    </div>
                </span>
            }
        </div>
    )
}