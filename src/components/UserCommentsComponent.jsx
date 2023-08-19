import { useState } from 'react';

import ListCommentsComponent from './ListCommentsComponents';

export default function UserCommentsComponent() {
    const [showComments, setShowComments] = useState(-1);

    return (
        <div style={{ position: 'fixed', right: '1rem', bottom: '1rem', zIndex: 100 }}>
            <i className="bi bi-chat-right-text" onClick={() => setShowComments(1)}></i>
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