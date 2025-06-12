import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PostContext } from '../../context/PostContext.jsx'; // Corrected import
import LikeButton from '../Like/LikeButton.jsx';         // Corrected import

function PostItem({ post }) {
    const { toggleLike, currentUser } = useContext(PostContext);

    const handleToggleLike = async () => {
        if (!currentUser.trim()) {
            alert("Please set a username on the Home page to like a post.");
            return;
        }
        try {
            await toggleLike(post._id);
        } catch (err) {
            // Error is usually handled/displayed by the context or page component
            console.error(`Failed to update like for post ${post._id}: ${err.message}`);
        }
    };

    const userHasLiked = post.likes?.some(like => like.user === currentUser);

    return (
        <article className="post-item" style={{ border: '1px solid #ddd', margin: '15px 0', padding: '15px', borderRadius: '4px' }}>
            <h2><Link to={`/post/${post._id}`} style={{textDecoration: 'none', color: '#007bff'}}>{post.title}</Link></h2>
            <p className="post-excerpt">{post.body?.substring(0, 150)}...</p>
            <div className="post-meta-item" style={{fontSize: '0.9em', color: '#666', marginBottom: '10px'}}>
                <span>Likes: {post.likes?.length || 0}</span>
                <span style={{ marginLeft: '15px' }}>Comments: {post.comments?.length || 0}</span>
            </div>
            <div className="post-item-actions">
                <LikeButton
                    likeCount={post.likes?.length || 0}
                    isLiked={userHasLiked}
                    onLike={handleToggleLike}
                    disabled={!currentUser.trim()}
                />
                <Link to={`/post/${post._id}`} className="btn btn-secondary btn-sm" style={{marginLeft: '10px'}}>Read More & Comment</Link>
            </div>
        </article>
    );
}

export default PostItem;