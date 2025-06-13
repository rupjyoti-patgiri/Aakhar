import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/api';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Trash2 } from 'lucide-react';

const deleteComment = async ({ postId, commentId }) => {
    const { data } = await apiClient.delete(`/api/v1/comments/deleteComment/${postId}/${commentId}`);
    return data;
};

const Comment = ({ comment, postId }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            toast.success("Comment deleted");
            queryClient.invalidateQueries(['post', postId]);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Could not delete comment.");
        }
    });

    const handleDelete = () => {
        mutation.mutate({ postId, commentId: comment._id });
    };

    // The 'user' field in the comment is just a string in your model.
    // In a more advanced setup, you would populate this with user details.
    // For now, we display the username string directly.
    const authorUsername = comment.user;
    
    return (
        <div className="flex gap-4">
            <Avatar>
                {/* A default avatar based on the username initial */}
                <AvatarImage src={`https://api.dicebear.com/5.x/initials/svg?seed=${authorUsername}`} />
                <AvatarFallback>{authorUsername.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-semibold">{authorUsername}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                            {new Date(comment.createdAt).toLocaleString()}
                        </span>
                    </div>
                    {/* Your Comment model doesn't store the user's ID, just their name.
                        To enable deletion, we'd ideally check if comment.userId === user.id.
                        For now, we'll allow a user to delete a comment if their username matches.
                        This is less secure but works with the current backend model structure. */}
                    {user?.username === authorUsername && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            disabled={mutation.isLoading}
                        >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                        </Button>
                    )}
                </div>
                <p className="text-sm mt-1">{comment.body}</p>
            </div>
        </div>
    );
};

export default Comment;