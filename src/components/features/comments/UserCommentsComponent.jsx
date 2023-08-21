import { useState } from 'react';

import ListCommentsComponent from './ListCommentsComponents';

export default function UserCommentsComponent() {
    const [showComments, setShowComments] = useState(-1);

    return (
        <div>
            <span className="user-comments-icon">
                <i className="bi bi-chat-right-text" onClick={() => setShowComments(-showComments)} />
            </span>
            {
                showComments === 1 &&
                <ListCommentsComponent
                    filterBy={'user'}
                    setShowCommentsId={setShowComments}
                />
            }
        </div>
    )
}