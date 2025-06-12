import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostContext } from '../context/PostContext.jsx'; // Corrected import
import PostForm from '../components/Post/PostForm.jsx';   // Corrected import
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'; // Corrected import
import ErrorMessage from '../components/common/ErrorMessage.jsx';   // Corrected import

function EditPostPage() {
    const { id: postId } = useParams();
    const navigate = useNavigate();
    const { posts, updateExistingPost, loading: postsLoading, error: postsError, fetchPosts } = useContext(PostContext);
    const [currentPost, setCurrentPost] = useState(null);
    const [formError, setFormError] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setPageLoading(true);
        const postFromContext = posts.find(p => p._id === postId);
        if (postFromContext) {
            setCurrentPost(postFromContext);
            setPageLoading(false);
        } else if (!postsLoading && (posts.length > 0 || postsError)) {
            setFormError("Post not found or error loading posts context.");
            setPageLoading(false);
        } else if (postsLoading) {
            // Wait for global posts
        } else if (!postsLoading && posts.length === 0 && !postsError) {
            fetchPosts().finally(() => setPageLoading(false));
        }
    }, [postId, posts, postsLoading, postsError, fetchPosts]);


    const handleUpdatePost = async (postData) => {
        setFormError(null);
        setSubmitting(true);
        try {
            const response = await updateExistingPost(postId, postData);
            if(response.success){ // Assuming updateExistingPost from context returns the backend response structure
                navigate(`/post/${postId}`);
            } else {
                setFormError(response.message || "An unknown error occurred during update.");
            }
        } catch (err) {
            setFormError(err.message || "Failed to update post. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (pageLoading && !currentPost) return <LoadingSpinner />;
    if (formError && !currentPost) return <ErrorMessage message={formError} />;
    if (!currentPost && !pageLoading) return <ErrorMessage message="Post data not available for editing."/>;
    if (!currentPost) return <LoadingSpinner/>; // Should be caught by above, but as a fallback

    return (
        <div className="edit-post-page">
            <h1>Edit Post</h1>
            {formError && <ErrorMessage message={formError} />}
            <PostForm
                onSubmit={handleUpdatePost}
                initialData={{ title: currentPost.title, body: currentPost.body }}
                isEdit={true}
                submitting={submitting}
            />
        </div>
    );
}

export default EditPostPage;