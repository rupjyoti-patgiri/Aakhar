import apiClient from './api';

// const COMMENT_API_URL = `${process.env.REACT_APP_API_BASE_URL}/comments`;

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await apiClient.get(`/comments/getCommentByPost/${postId}`);
    return response.data.comments; // { success, message, comments }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return []; // No comments found for the post
    }
    console.error("Error fetching comments:", error.response?.data || error.message);
    throw error.response?.data || new Error("Server error fetching comments");
  }
};

export const createComment = async (commentData) => { // {user, body, postId}
  try {
    const response = await apiClient.post('/comments/createComment', commentData);
    return response.data.post; // Backend returns the updated post object
  } catch (error) {
    console.error("Error creating comment:", error.response?.data || error.message);
    throw error.response?.data || new Error("Server error creating comment");
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    const response = await apiClient.delete(`/comments/deleteComment/${postId}/${commentId}`);
    return response.data; // { success: true, message: "..." }
  } catch (error) {
    console.error("Error deleting comment:", error.response?.data || error.message);
    throw error.response?.data || new Error("Server error deleting comment");
  }
};

// updateComment service can be added similarly if needed
// export const updateComment = async (commentId, commentData) => { ... }