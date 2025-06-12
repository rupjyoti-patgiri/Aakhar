import apiClient from './api'; // Or use axios directly: import axios from 'axios'; const API_URL = process.env.REACT_APP_API_BASE_URL;

// If not using apiClient, define API_URL for each service
// const POST_API_URL = `${process.env.REACT_APP_API_BASE_URL}/posts`;

export const getAllPosts = async () => {
  try {
    // const response = await axios.get(`${POST_API_URL}/getPosts`);
    const response = await apiClient.get('/posts/getPosts'); // Path relative to baseURL
    return response.data.posts; // As per your backend getPost controller
  } catch (error) {
    console.error("Error fetching posts:", error.response?.data || error.message);
    throw error.response?.data || new Error("Server error fetching posts");
  }
};

export const createPost = async (postData) => { // {title, body}
  try {
    const response = await apiClient.post('/posts/createPost', postData);
    return response.data; // { success: true, data: response, message: "..." }
  } catch (error) {
    console.error("Error creating post:", error.response?.data || error.message);
    throw error.response?.data || new Error("Server error creating post");
  }
};

export const updatePost = async (id, postData) => { // {title, body}
  try {
    const response = await apiClient.put(`/posts/updatePost/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error.response?.data || error.message);
    throw error.response?.data || new Error("Server error updating post");
  }
};

export const deletePost = async (id) => {
  try {
    const response = await apiClient.delete(`/posts/deletePost/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error.response?.data || error.message);
    throw error.response?.data || new Error("Server error deleting post");
  }
};