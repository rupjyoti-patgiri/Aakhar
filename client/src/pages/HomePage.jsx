import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/api';
import PostCard, { PostCardSkeleton } from '../features/posts/PostCard';

const fetchPosts = async () => {
    // Note: your backend route returns { posts: [...] }
    const { data } = await apiClient.get('/posts/getPosts');
    return data.posts;
};

export default function HomePage() {
    const { data: posts, isLoading, isError, error } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 border-b pb-4">Latest Posts</h1>
            
            {isError && (
                 <div className="text-center py-10 text-red-500">
                    <p>Failed to load posts.</p>
                    <p>{error.message}</p>
                 </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading && (
                    Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)
                )}
                {posts?.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>

            {!isLoading && posts?.length === 0 && (
                <div className="text-center col-span-full py-10 text-muted-foreground">
                    No posts have been created yet.
                </div>
            )}
        </div>
    );
}