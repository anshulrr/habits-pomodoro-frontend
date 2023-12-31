import { useState } from 'react';

import ListCommentsPopupComponent from './ListCommentsPopupComponent';

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
                    <ListCommentsPopupComponent
                        filterBy={'user'}
                        setShowCommentsId={setShowComments}
                        title={'All Notes'}
                    />
                </span>
            }
        </div>
    )
}