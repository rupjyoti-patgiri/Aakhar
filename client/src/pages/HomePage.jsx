import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import Spinner from '../components/Spinner';
import SkeletonPost from '../components/SkeletonPost';
import { API_BASE_URL } from '../App';

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const placeholderPosts = Array.from({ length: 6 }).map((_, i) => ({
        _id: `placeholder-${i}`,
        title: `Random Post #${i + 1}`,
        summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        author: 'Admin',
        createdAt: new Date().toISOString(),
        coverPhoto: `https://picsum.photos/seed/${i + 1}/400/300`, // random image
      }));
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/posts/getPosts`);
                if (response.ok) {
                    const postsData = await response.json();
                    setPosts(postsData);
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <>
           <div className="text-center mb-12 relative z-10">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter">Stay Curious.</h1>
                <p className="text-lg md:text-xl text-gray-400 mt-4 max-w-2xl mx-auto">Discover stories, thinking, and expertise from writers on any topic.</p>
           </div>
            {loading ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10">
                    <SkeletonPost />
                    <SkeletonPost />
                    <SkeletonPost />
                </div>
            ) : (
                posts.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10">
                        {posts.map(post => <Post key={post._id} {...post} />)}
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10">
                      {placeholderPosts.map(p => (
                        <Post key={p._id} {...p} />
                      ))}
                    </div>
                )
            )}
        </>
    );
}

export default HomePage;
