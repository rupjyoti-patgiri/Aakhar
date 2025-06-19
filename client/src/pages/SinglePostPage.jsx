import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../api/api';
import { useAuth } from '../hooks/useAuth';
import { Skeleton } from '../components/ui/skeleton';
import { ThumbsUp, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import Comment from '../features/posts/Comment';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '../components/ui/dialog';

// --- API Functions ---
const fetchPost = async (id) => apiClient.get(`/posts/getPost/${id}`).then(res => res.data.data);
const fetchComments = async (id) => apiClient.get(`/comments/getCommentByPost/${id}`).then(res => res.data.comments || []).catch(() => []);

const toggleLike = async ({ postId, user, hasLiked, likeId }) => {
    if (hasLiked) {
        return apiClient.delete(`/likes/deleteLike/${postId}/${likeId}`);
    }
    return apiClient.post('/likes/createLike', { postId, user: user.username });
};

const createComment = async ({ postId, body, user }) => apiClient.post('/comments/createComment', { postId, body, user: user.username });
const updatePost = async ({ postId, title, body }) => apiClient.put(`/posts/updatePost/${postId}`, { title, body });
const deletePost = async (postId) => apiClient.delete(`/posts/deletePost/${postId}`);

// --- The Component ---
export default function SinglePostPage() {
    const { id: postId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, isAuthor, isAdmin } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const { data: post, isLoading: isLoadingPost } = useQuery({ queryKey: ['post', postId], queryFn: () => fetchPost(postId) });
    const { data: comments, isLoading: isLoadingComments } = useQuery({ queryKey: ['comments', postId], queryFn: () => fetchComments(postId) });

    const commentForm = useForm();
    const editForm = useForm();

    const handleMutation = (mutationFn, successMessage) => {
        return useMutation({
            mutationFn,
            onSuccess: () => {
                toast.success(successMessage);
                queryClient.invalidateQueries({ queryKey: ['post', postId] });
                queryClient.invalidateQueries({ queryKey: ['comments', postId] });
                queryClient.invalidateQueries({ queryKey: ['posts'] });
            },
            onError: (err) => toast.error(err.response?.data?.message || "An error occurred."),
        });
    };

    const likeMutation = handleMutation(toggleLike, "Success!");
    const commentMutation = handleMutation(createComment, "Comment posted!");
    const updatePostMutation = handleMutation(updatePost, "Post updated!");
    const deletePostMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            toast.success("Post deleted!");
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            navigate('/');
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to delete post."),
    });

    const currentUserLike = post?.likes.find(like => like.user === user?.username);

    const onToggleLike = () => {
        if (!user) return;
        likeMutation.mutate({ postId, user, hasLiked: !!currentUserLike, likeId: currentUserLike?._id });
    };

    const onCommentSubmit = (data) => {
        commentMutation.mutate({ postId, body: data.commentBody, user }, { onSuccess: () => commentForm.reset() });
    };

    const onEditSubmit = (data) => {
        updatePostMutation.mutate({ postId, ...data }, { onSuccess: () => setIsEditing(false) });
    };

    const onDeleteConfirm = () => deletePostMutation.mutate(postId);

    const isLoading = isLoadingPost || isLoadingComments;

    if (isLoading) return <div><Skeleton className="h-96 w-full" /></div>;
    if (!post) return <div className="text-center py-10">Post not found.</div>;

    // A user can edit/delete if they are an admin, or if they are an author AND the post belongs to them.
    // NOTE: Your Post model doesn't store the author's ID, so we can't reliably check ownership.
    // For now, ANY author or admin can edit/delete. This should be fixed in the backend by adding `authorId` to the Post model.
    const canManagePost = isAdmin || isAuthor;

    return (
        <>
            <article className="max-w-4xl mx-auto">
                {/* --- Post Header --- */}
                <div className="flex justify-between items-start gap-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{post.title}</h1>
                    {canManagePost && (
                        <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="icon" onClick={() => { setIsEditing(true); editForm.reset({ title: post.title, body: post.body }); }}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Are you sure?</DialogTitle></DialogHeader>
                                    <p>This action cannot be undone. This will permanently delete the post.</p>
                                    <DialogFooter>
                                        <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                        <Button variant="destructive" onClick={onDeleteConfirm}>Delete</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
                <div className="text-muted-foreground mb-8">Published on {new Date(post.createdAt).toLocaleDateString()}</div>
                
                {/* --- Post Body --- */}
                <div className="prose dark:prose-invert max-w-none mb-8 whitespace-pre-wrap">{post.body}</div>

                {/* --- Like & Comment Count --- */}
                <div className="flex items-center gap-4 border-t border-b py-4 mb-8">
                    <Button variant={currentUserLike ? "default" : "outline"} onClick={onToggleLike} disabled={!user || likeMutation.isLoading}>
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        {currentUserLike ? 'Liked' : 'Like'} ({post.likes.length})
                    </Button>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageCircle className="h-5 w-5" />
                        <span>{comments?.length || 0} Comments</span>
                    </div>
                </div>

                {/* --- Comments Section --- */}
                <section className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Comments</h2>
                    {user ? (
                        <form onSubmit={commentForm.handleSubmit(onCommentSubmit)} className="mb-8">
                            <Textarea placeholder="Write a comment..." {...commentForm.register("commentBody", { required: true })} />
                            <Button type="submit" className="mt-2" disabled={commentMutation.isLoading}>Post Comment</Button>
                        </form>
                    ) : (
                        <p className="text-muted-foreground mb-8"><Link to="/login" className="underline font-semibold">Log in</Link> to comment.</p>
                    )}
                    <div className="space-y-6">
                        {comments?.slice().reverse().map(comment => <Comment key={comment._id} comment={comment} postId={postId} />)}
                    </div>
                </section>
            </article>

            {/* --- Edit Post Dialog --- */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader><DialogTitle>Edit Post</DialogTitle></DialogHeader>
                    <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="font-medium">Title</label>
                            <Input id="title" {...editForm.register("title", { required: true })} />
                        </div>
                        <div>
                            <label htmlFor="body" className="font-medium">Content</label>
                            <Textarea id="body" rows={12} {...editForm.register("body", { required: true })} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button type="submit" disabled={updatePostMutation.isLoading}>Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}



