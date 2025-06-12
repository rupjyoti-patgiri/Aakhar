import React from 'react';
import CommentItem from './CommentItem.jsx'; // Corrected import

function CommentList({ comments, onDeleteComment, currentUser }) {
    if (!comments || comments.length === 0) {
        return <p>No comments yet. Be the first to share your thoughts!</p>;
    }

    return (
        <div className="comment-list" style={{marginTop: '20px'}}>
            {comments.map(comment => (
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    onDeleteComment={onDeleteComment}
                    currentUser={currentUser}
                />
            ))}
        </div>
    );
}

export default CommentList;