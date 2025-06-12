import React from 'react';

function CommentItem({ comment, onDeleteComment, currentUser }) {
    // A comment can be deleted if the currentUser matches the comment's user.
    const canDelete = comment.user === currentUser;

    const handleDelete = () => {
        onDeleteComment(comment._id);
    };

    return (
        <div className="comment-item" style={{ borderBottom: '1px solid #eee', padding: '10px 0', marginBottom: '10px' }}>
            <p style={{margin: '0 0 5px 0'}}>
                <strong style={{color: '#007bff'}}>{comment.user || 'Anonymous'}:</strong>
            </p>
            <p style={{margin: '0 0 5px 0'}}>{comment.body}</p>
            <small style={{color: '#6c757d'}}>
                Posted on: {new Date(comment.createdAt).toLocaleString()}
            </small>
            {canDelete && (
                <button
                    onClick={handleDelete}
                    className="btn btn-danger btn-sm" // Assuming you have some basic button styling
                    style={{ marginLeft: '15px', fontSize: '0.8em', padding: '2px 5px' }}
                    title="Delete this comment"
                >
                    Delete
                </button>
            )}
        </div>
    );
}

export default CommentItem;