import apiClient from './api';

// const LIKE_API_URL = `${process.env.REACT_APP_API_BASE_URL}/likes`;

export const createLike = async (likeData) => { // {user, postId}
  try {
    const response = await apiClient.post('/likes/createLike', likeData);
    return response.data.post; // Backend returns the updated post object
  } catch (error) {
    console.error("Error creating like:", error.response?.data || error.message);
    throw error.response?.data || new Error("Server error creating like");
  }
};

export const deleteLike = async (postId, likeId) => {
  try {
    // Note: Your backend deleteLike returns { success: true, message: "..." }
    // It doesn't return the updated post. The frontend will need to refetch or manually update.
    const response = await apiClient.delete(`/likes/deleteLike/${postId}/${likeId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting like:", error.response?.data || error.message);
    throw error.response?.data || new Error("Server error deleting like");
  }
};