import { useState } from 'react';

import ListCommentsComponent from './ListCommentsComponents';

export default function UserCommentsComponent({ tags }) {
    const [showComments, setShowComments] = useState(-1);

    return (
        <div>
            <span className="user-comments-icon">
                <button type="button" className="btn btn-success" onClick={() => setShowComments(-showComments)}>
                    <i className="bi bi-chat-right-text" />
                </button>
            </span>
            {
                <span className="user-comments-overlay" style={{ display: (showComments === 1 ? "block" : "none") }} >
                    <ListCommentsComponent
                        filterBy={'user'}
                        setShowCommentsId={setShowComments}
                        title={'All Notes'}
                        tags={tags}
                    />
                </span>
            }
        </div>
    )
}