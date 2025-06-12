import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostContext } from '../context/PostContext.jsx'; // Corrected import
import PostForm from '../components/Post/PostForm.jsx';   // Corrected import
import ErrorMessage from '../components/common/ErrorMessage.jsx'; // Corrected import

function CreatePostPage() {
    const { addPost } = useContext(PostContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleCreatePost = async (postData) => {
        setError(null);
        setSubmitting(true);
        try {
            const response = await addPost(postData);
            if (response.success) { // Assuming addPost from context returns the backend response structure
                // Navigate to the new post using the ID from the response data
                // Backend createPost response: { success: true, data: createdPost, message: "..." }
                navigate(`/post/${response.data._id}`);
            } else {
                setError(response.message || "An unknown error occurred while creating the post.");
            }
        } catch (err) {
            setError(err.message || "Failed to create post. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="create-post-page">
            <h1>Create New Post</h1>
            {error && <ErrorMessage message={error} />}
            <PostForm onSubmit={handleCreatePost} submitting={submitting} />
        </div>
    );
}

export default CreatePostPage;