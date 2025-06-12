import React, { useState, useContext } from 'react';
import { PostContext } from '../../context/PostContext.jsx'; // Corrected import

function CommentForm({ postId, onSubmit }) {
    const [body, setBody] = useState('');
    const { currentUser } = useContext(PostContext);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser || !currentUser.trim()) {
             alert("Please set a username on the Home page to post a comment.");
            return;
        }
        if (!body.trim()) {
            alert("Comment body cannot be empty.");
            return;
        }
        setSubmitting(true);
        try {
            // onSubmit is provided by PostPage, which calls addComment from context
            await onSubmit({ body });
            setBody('');
        } catch (error) {
            // Error handling is typically done in the calling component (PostPage)
            // or by the context itself.
            console.error("Error submitting comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form" style={{ margin: '20px 0' }}>
            <div className="form-group">
                <label htmlFor={`commentBody-${postId}`}>
                    Your Comment (as <strong>{currentUser || "Guest"}</strong>):
                </label>
                <textarea
                    id={`commentBody-${postId}`}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    maxLength="100"
                    rows="3"
                    disabled={submitting || !currentUser || !currentUser.trim()}
                    placeholder={!currentUser || !currentUser.trim() ? "Set a username on Home page to comment" : "Write your comment..."}
                />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting || !currentUser || !currentUser.trim()}>
                {submitting ? 'Submitting...' : 'Add Comment'}
            </button>
             {(!currentUser || !currentUser.trim()) &&
                <p style={{color: "red", fontSize: "0.9em", marginTop: "5px"}}>
                    Please set a username on the Home page to enable commenting.
                </p>
            }
        </form>
    );
}

export default CommentForm;