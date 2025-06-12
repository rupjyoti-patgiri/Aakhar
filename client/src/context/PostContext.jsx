import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as postService from '../services/postService.js';
import * as commentService from '../services/commentService.js';
import * as likeService from '../services/likeService.js';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState("BlogUser1");

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await postService.getAllPosts();
            setPosts(data || []);
        } catch (err) {
            setError(err.message || "Failed to fetch posts");
            setPosts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const addPost = async (postData) => {
        try {
            const newPostResponse = await postService.createPost(postData);
            const newPost = { ...newPostResponse.data, comments: [], likes: [] };
            setPosts(prevPosts => [newPost, ...prevPosts]);
            return newPostResponse;
        } catch (err) {
            setError(err.message || "Failed to create post");
            throw err;
        }
    };

    const removePost = async (postId) => {
        try {
            await postService.deletePost(postId);
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
        } catch (err) {
            setError(err.message || "Failed to delete post");
            throw err;
        }
    };

    const updateExistingPost = async (postId, postData) => {
        try {
            const updatedPostResponse = await postService.updatePost(postId, postData);
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? { ...post, ...updatedPostResponse.data } : post
                )
            );
            return updatedPostResponse;
        } catch (err) {
            setError(err.message || "Failed to update post");
            throw err;
        }
    };

    const addComment = async (commentData) => {
        try {
            const updatedPost = await commentService.createComment({ ...commentData, user: currentUser });
            setPosts(prevPosts =>
                prevPosts.map(p => (p._id === updatedPost._id ? updatedPost : p))
            );
        } catch (err) {
            setError(err.message || "Failed to add comment");
            throw err;
        }
    };

    const removeComment = async (postId, commentId) => {
        try {
            await commentService.deleteComment(postId, commentId);
            const targetPost = posts.find(p => p._id === postId);
            if (targetPost) {
                const updatedComments = targetPost.comments.filter(c => c._id !== commentId);
                const updatedPost = { ...targetPost, comments: updatedComments };
                setPosts(prevPosts => prevPosts.map(p => (p._id === postId ? updatedPost : p)));
            } else {
                await fetchPosts();
            }
        } catch (err) {
            setError(err.message || "Failed to delete comment");
            throw err;
        }
    };

    const toggleLike = async (postId) => {
        const post = posts.find(p => p._id === postId);
        if (!post) return;
        const existingLike = post.likes.find(like => like.user === currentUser);
        try {
            if (existingLike) {
                await likeService.deleteLike(postId, existingLike._id);
                const updatedLikes = post.likes.filter(l => l._id !== existingLike._id);
                const updatedPost = { ...post, likes: updatedLikes };
                setPosts(prevPosts => prevPosts.map(p => (p._id === postId ? updatedPost : p)));
            } else {
                const updatedPostWithNewLike = await likeService.createLike({ user: currentUser, postId });
                setPosts(prevPosts =>
                    prevPosts.map(p => (p._id === updatedPostWithNewLike._id ? updatedPostWithNewLike : p))
                );
            }
        } catch (err) {
            setError(err.message || "Failed to update like status");
            throw err;
        }
    };

    return (
        <PostContext.Provider value={{
            posts,
            loading,
            error,
            currentUser,
            setCurrentUser,
            fetchPosts,
            addPost,
            removePost,
            updateExistingPost,
            addComment,
            removeComment,
            toggleLike
        }}>
            {children}
        </PostContext.Provider>
    );
};