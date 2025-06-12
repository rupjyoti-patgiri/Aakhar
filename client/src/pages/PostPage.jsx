import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PostContext } from '../context/PostContext.jsx'; // Corrected import
import CommentList from '../components/Comment/CommentList.jsx'; // Corrected import
import CommentForm from '../components/Comment/CommentForm.jsx'; // Corrected import
import LikeButton from '../components/Like/LikeButton.jsx';     // Corrected import
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'; // Corrected import
import ErrorMessage from '../components/common/ErrorMessage.jsx';   // Corrected import

function PostPage() {
    const { id: postId } = useParams();
    const navigate = useNavigate();
    const {
        posts,
        loading: postsLoading,
        error: postsError,
        fetchPosts,
        removePost,
        addComment,
        removeComment,
        toggleLike,
        currentUser
    } = useContext(PostContext);

    const [currentPost, setCurrentPost] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState(null);

    useEffect(() => {
        setPageLoading(true);
        const postFromContext = posts.find(p => p._id === postId);

        if (postFromContext) {
            setCurrentPost(postFromContext);
            setPageLoading(false);
            setPageError(null);
        } else if (!postsLoading && posts.length > 0) {
            setPageError("Post not found.");
            setPageLoading(false);
        } else if (!postsLoading && postsError) {
             setPageError(postsError);
             setPageLoading(false);
        } else if (postsLoading) {
            // Waiting for global posts
        } else if (!postsLoading && posts.length === 0 && !postsError) {
             fetchPosts().finally(() => {
                // After refetch, try to find the post again from the 'posts' state
                // Note: 'posts' in this scope might not be updated immediately after fetchPosts
                // This part might need refinement based on how fetchPosts updates and re-renders
                // For now, we rely on the next render cycle to pick up the updated 'posts'
                setPageLoading(false); // Stop loading, next effect run will check `posts`
             });
        }
    }, [postId, posts, postsLoading, postsError, fetchPosts]);

    useEffect(() => { // This effect ensures currentPost is updated if the global 'posts' array changes
        if (currentPost) { // Only if we already have a currentPost to compare against
            const updatedPostFromContext = posts.find(p => p._id === currentPost._id);
            if (updatedPostFromContext && JSON.stringify(updatedPostFromContext) !== JSON.stringify(currentPost)) {
                setCurrentPost(updatedPostFromContext);
            }
        } else { // If currentPost is null, try to set it if available in posts
            const postFromContext = posts.find(p => p._id === postId);
            if (postFromContext) {
                 setCurrentPost(postFromContext);
                 setPageLoading(false); // If we found it, we are not loading this page anymore
                 setPageError(null);
            } else if (!postsLoading && posts.length === 0 && !postsError) {
                 setPageError("Post not found after initial load."); // If posts are loaded but still not found
                 setPageLoading(false);
            }
        }
    }, [posts, postId, currentPost, postsLoading, postsError]);


    const handleDeletePost = async () => {
        if (window.confirm(`Are you sure you want to delete "${currentPost?.title}"?`)) {
            try {
                await removePost(postId);
                navigate('/');
            } catch (err) {
                alert(`Failed to delete post: ${err.message}`);
            }
        }
    };

    const handleAddComment = async (commentBody) => {
        if (!currentUser.trim()) {
            alert("Please set a username on the Home page to comment.");
            return;
        }
        try {
            await addComment({ body: commentBody.body, postId });
        } catch (err) {
            alert(`Failed to add comment: ${err.message}`);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await removeComment(postId, commentId);
            } catch (err) {
                alert(`Failed to delete comment: ${err.message}`);
            }
        }
    };

    const handleToggleLike = async () => {
        if (!currentUser.trim()) {
            alert("Please set a username on the Home page to like a post.");
            return;
        }
        try {
            await toggleLike(postId);
        } catch (err) {
            alert(`Failed to update like: ${err.message}`);
        }
    };

    if (pageLoading || (postsLoading && !currentPost)) return <LoadingSpinner />;
    if (pageError) return <ErrorMessage message={pageError} />;
    if (!currentPost && !pageLoading) return <ErrorMessage message="Post not found or has been removed." />;
    if (!currentPost) return <LoadingSpinner />; // Fallback if still somehow null

    const userHasLiked = currentPost.likes?.some(like => like.user === currentUser);

    return (
        <div className="post-page-container">
            <Link to="/" className="back-link">&larr; Back to All Posts</Link>
            <article className="post-detail">
                <h1>{currentPost.title}</h1>
                <p className="post-meta">
                    Created: {new Date(currentPost.createdAt).toLocaleDateString()} |
                    Last Updated: {new Date(currentPost.updatedAt).toLocaleDateString()}
                </p>
                <div className="post-body" dangerouslySetInnerHTML={{ __html: currentPost.body?.replace(/\n/g, '<br />') }} />

                <div className="post-actions">
                    <LikeButton
                        likeCount={currentPost.likes?.length || 0}
                        isLiked={userHasLiked}
                        onLike={handleToggleLike}
                        disabled={!currentUser.trim()}
                    />
                    <Link to={`/edit-post/${currentPost._id}`} className="btn btn-secondary">Edit Post</Link>
                    <button onClick={handleDeletePost} className="btn btn-danger">Delete Post</button>
                </div>
            </article>

            <section className="comments-section">
                <h2>Comments ({currentPost.comments?.length || 0})</h2>
                <CommentForm postId={currentPost._id} onSubmit={handleAddComment} />
                <CommentList comments={currentPost.comments || []} onDeleteComment={handleDeleteComment} currentUser={currentUser} />
            </section>
        </div>
    );
}

export default PostPage;