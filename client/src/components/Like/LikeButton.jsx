import React from 'react';

function LikeButton({ likeCount, isLiked, onLike, disabled = false }) {
    return (
        <button
            onClick={onLike}
            className={`btn ${isLiked ? 'btn-liked' : 'btn-outline'}`} // Assumes you have CSS classes
            disabled={disabled}
            title={disabled ? "Set username on Home page to like" : (isLiked ? "Unlike this post" : "Like this post")}
        >
            {isLiked ? 'Unlike' : 'Like'} ({likeCount})
        </button>
    );
}

export default LikeButton;