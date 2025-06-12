import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PostContext } from '../context/PostContext.jsx'; // Corrected import
import PostList from '../components/Post/PostList.jsx';   // Corrected import
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'; // Corrected import
import ErrorMessage from '../components/common/ErrorMessage.jsx';   // Corrected import

function HomePage() {
    const { posts, loading, error, currentUser, setCurrentUser } = useContext(PostContext);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="home-page">
            <h1>Welcome to the Blog</h1>
            <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
                <label htmlFor="currentUser" style={{ marginRight: '10px', fontWeight: 'bold' }}>Current User: </label>
                <input
                    type="text"
                    id="currentUser"
                    value={currentUser}
                    onChange={(e) => setCurrentUser(e.target.value)}
                    placeholder="Enter username for actions"
                    style={{ padding: '5px', marginRight: '5px' }}
                />
                <small> (This name will be used for Likes/Comments)</small>
            </div>
            <Link to="/create-post" className="btn btn-primary" style={{ marginBottom: '20px', display: 'inline-block' }}>
                Create New Post
            </Link>
            {posts.length === 0 && !loading ? (
                <p>No posts yet. Be the first to create one!</p>
            ) : (
                <PostList posts={posts} />
            )}
        </div>
    );
}

export default HomePage;