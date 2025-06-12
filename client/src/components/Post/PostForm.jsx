import React, { useState, useEffect } from 'react';

function PostForm({ onSubmit, initialData = { title: '', body: '' }, isEdit = false, submitting = false }) {
    const [title, setTitle] = useState(initialData.title);
    const [body, setBody] = useState(initialData.body);

    useEffect(() => {
        setTitle(initialData.title || ''); // Ensure defaults if initialData parts are undefined
        setBody(initialData.body || '');
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) {
            alert("Title and body are required.");
            return;
        }
        onSubmit({ title, body });
    };

    return (
        <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
                <label htmlFor="postTitle">Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength="50"
                    disabled={submitting}
                />
            </div>
            <div className="form-group">
                <label htmlFor="postBody">Body:</label>
                <textarea
                    id="postBody"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    maxLength="1000"
                    rows="10"
                    disabled={submitting}
                />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Post' : 'Create Post')}
            </button>
        </form>
    );
}

export default PostForm;