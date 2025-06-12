import React from 'react';
import PostItem from './PostItem.jsx'; // Corrected import

function PostList({ posts }) {
    if (!posts || posts.length === 0) {
        return <p>No posts to display at the moment.</p>;
    }

    return (
        <div className="post-list">
            {posts.map(post => (
                <PostItem key={post._id} post={post} />
            ))}
        </div>
    );
}

export default PostList;