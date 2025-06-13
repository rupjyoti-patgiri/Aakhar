import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '../api/api';
import { useAuth } from '../hooks/useAuth';
import { Skeleton } from '../components/ui/skeleton';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import Comment from '../features/posts/Comment';
import { useForm } from 'react-hook-form';


const fetchPostById = async (id) => {
    const { data } = await apiClient.get(`/api/v1/posts/getPost/${id}`);
    // This is a workaround because the getPostById controller returns a post inside a `data` field
    // while the getPosts controller returns an array of posts in a `posts` field.
    // For consistency, we should aim for one format. Here we adapt to the API's current state.
    const { data: postData } = await apiClient.get(`/api/v1/posts/getPost/${id}`);
    
    const commentsResponse = await apiClient.get(`/api/v1/comments/getCommentByPost/${id}`);

    return { ...postData.data, comments: commentsResponse.data.comments || [] };
};

const likePost = async (postId) => {
  const { data } = await apiClient.post('/api/v1/likes/createLike', { postId });
  return data;
};

const createComment = async ({ postId, body }) => {
    const { data } = await apiClient.post('/api/v1/comments/createComment', { postId, body });
    return data;
};

export default function SinglePostPage() {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { isAuthenticated, user } = useAuth();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    
    const { data: post, isLoading, isError, error } = useQuery({
        queryKey: ['post', id],
        queryFn: () => fetchPostById(id),
    });

    const likeMutation = useMutation({
        mutationFn: () => likePost(id),
        onSuccess: () => {
            toast.success('Post liked!');
            queryClient.invalidateQueries(['post', id]);
            queryClient.invalidateQueries(['posts']);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Couldn't like post.");
        }
    });

    const commentMutation = useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            toast.success('Comment added!');
            queryClient.invalidateQueries(['post', id]);
            reset();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Couldn't add comment.");
        }
    });

    const onCommentSubmit = (data) => {
        commentMutation.mutate({ postId: id, body: data.commentBody });
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-8" />
                <div className="space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                </div>
            </div>
        );
    }

    if (isError) {
        return <div className="text-center text-red-500">Error: {error.message}</div>;
    }

    return (
        <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{post.title}</h1>
            <div className="text-muted-foreground mb-8">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="prose dark:prose-invert max-w-none mb-8">
                {post.body}
            </div>

            <div className="flex items-center gap-4 border-t border-b py-4 mb-8">
                <Button 
                    variant="outline" 
                    onClick={() => likeMutation.mutate()}
                    disabled={likeMutation.isLoading || !isAuthenticated}
                >
                    <ThumbsUp className="mr-2 h-4 w-4" /> 
                    Like ({post.likes.length})
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="h-5 w-5" />
                    <span>{post.comments.length} Comments</span>
                </div>
            </div>

            <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Comments</h2>
                {isAuthenticated ? (
                    <form onSubmit={handleSubmit(onCommentSubmit)} className="mb-8">
                        <Textarea 
                            placeholder="Write a comment..."
                            {...register("commentBody", { required: "Comment cannot be empty."})}
                        />
                         {errors.commentBody && <p className="text-red-500 text-sm mt-1">{errors.commentBody.message}</p>}
                        <Button type="submit" className="mt-2" disabled={commentMutation.isLoading}>
                            {commentMutation.isLoading ? "Posting..." : "Post Comment"}
                        </Button>
                    </form>
                ) : (
                    <p className="text-muted-foreground mb-8">
                        <Link to="/login" className="underline">Log in</Link> to post a comment.
                    </p>
                )}

                <div className="space-y-6">
                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map(comment => <Comment key={comment._id} comment={comment} postId={post._id}/>)
                    ) : (
                        <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </section>
        </article>
    );
}