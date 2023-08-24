import { useState } from 'react';

import ListCommentsComponent from './ListCommentsComponents';

export default function UserCommentsComponent() {
    const [showComments, setShowComments] = useState(-1);

    return (
        <div>
            <span className="user-comments-icon">
                <button type="button" className="btn btn-sm btn-outline-success py-0 px-1" onClick={() => setShowComments(-showComments)}>
                    <i className="bi bi-chat-right-text" />
                </button>
            </span>
            {
                showComments === 1 &&
                <span className="user-comments-overlay">
                    <ListCommentsComponent
                        filterBy={'user'}
                        setShowCommentsId={setShowComments}
                    />
                </span>
            }
        </div>
    )
}