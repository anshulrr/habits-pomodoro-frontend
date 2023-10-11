import { useState } from 'react';

import ListCommentsComponent from './ListCommentsComponents';

export default function UserCommentsComponent({ tags }) {
    const [showComments, setShowComments] = useState(-1);

    return (
        <div>
            <span className="user-comments-icon">
                <button type="button" className="btn btn-sm btn-success" onClick={() => setShowComments(-showComments)}>
                    <i className="bi bi-chat-right-text" />
                </button>
            </span>
            {
                showComments === 1 &&
                <span className="user-comments-overlay">
                    <ListCommentsComponent
                        filterBy={'user'}
                        setShowCommentsId={setShowComments}
                        title={'All Comments'}
                        tags={tags}
                    />
                </span>
            }
        </div>
    )
}