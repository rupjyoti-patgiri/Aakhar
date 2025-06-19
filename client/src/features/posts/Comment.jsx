import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/api';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Trash2 } from 'lucide-react';

const deleteComment = async ({ postId, commentId }) => {
    const { data } = await apiClient.delete(`/comments/deleteComment/${postId}/${commentId}`);
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

// import { useState } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useAuth } from '../../hooks/useAuth';
// import apiClient from '../../api/api';
// import toast from 'react-hot-toast';
// import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
// import { Button } from '../../components/ui/button';
// import { Textarea } from '../../components/ui/textarea';
// import { Trash2, Edit, X, Check } from 'lucide-react';
// import { useForm } from 'react-hook-form';

// // --- API Functions ---
// const deleteComment = ({ postId, commentId }) => apiClient.delete(`/comments/deleteComment/${postId}/${commentId}`);
// const updateComment = ({ commentId, body, user }) => apiClient.put(`/comments/updateComment/${commentId}`, { body, user: user.username });

// // --- The Component ---
// const Comment = ({ comment, postId, postAuthorId }) => {
//     const { user, isAdmin } = useAuth();
//     const queryClient = useQueryClient();
//     const [isEditing, setIsEditing] = useState(false);
//     const { register, handleSubmit, formState: { isDirty } } = useForm({ defaultValues: { body: comment.body } });

//     const handleMutation = (mutationFn, { successMessage }) => {
//         return useMutation({
//             mutationFn,
//             onSuccess: () => {
//                 toast.success(successMessage);
//                 queryClient.invalidateQueries({ queryKey: ['post', postId] });
//             },
//             onError: (err) => toast.error(err.response?.data?.message || "An error occurred."),
//         });
//     };

//     const deleteMutation = handleMutation(deleteComment, { successMessage: "Comment deleted" });
//     const updateMutation = handleMutation(updateComment, { successMessage: "Comment updated" });

//     // Event Handlers
//     const handleDelete = () => deleteMutation.mutate({ postId, commentId: comment._id });
//     const onUpdateSubmit = (data) => {
//         if (!isDirty) return setIsEditing(false);
//         updateMutation.mutate({ commentId: comment._id, body: data.body, user }, {
//             onSuccess: () => setIsEditing(false),
//         });
//     };

//     const commentAuthor = comment.user;
//     if (!commentAuthor) {
//         return <div className="text-sm text-muted-foreground italic p-4 border rounded-md">This comment has been removed.</div>;
//     }

//     // Permissions Logic: Who can do what?
//     const isCommentOwner = user?.id === commentAuthor._id;
//     const isPostOwner = user?.id === postAuthorId;
//     const canDelete = isCommentOwner || isPostOwner || isAdmin;
//     const canEdit = isCommentOwner;

//     return (
//         <div className="flex gap-4">
//             <Avatar>
//                 <AvatarImage src={commentAuthor.avatar?.imageUrl} />
//                 <AvatarFallback>{commentAuthor.username.charAt(0).toUpperCase()}</AvatarFallback>
//             </Avatar>
//             <div className="flex-grow">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <span className="font-semibold">{commentAuthor.username}</span>
//                         <span className="text-xs text-muted-foreground ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
//                     </div>
//                     {(canEdit || canDelete) && !isEditing && (
//                         <div className="flex items-center">
//                             {canEdit && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /></Button>}
//                             {canDelete && <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-red-500" onClick={handleDelete} disabled={deleteMutation.isLoading}><Trash2 className="h-4 w-4" /></Button>}
//                         </div>
//                     )}
//                 </div>
                
//                 {!isEditing ? (
//                     <p className="text-sm mt-1 whitespace-pre-wrap">{comment.body}</p>
//                 ) : (
//                     <form onSubmit={handleSubmit(onUpdateSubmit)} className="mt-2 space-y-2">
//                         <Textarea {...register("body", { required: true })} />
//                         <div className="flex gap-2">
//                             <Button size="sm" type="submit" disabled={updateMutation.isLoading || !isDirty}><Check className="h-4 w-4 mr-1"/>{updateMutation.isLoading ? "Saving..." : "Save"}</Button>
//                             <Button size="sm" variant="ghost" type="button" onClick={() => setIsEditing(false)}><X className="h-4 w-4 mr-1"/>Cancel</Button>
//                         </div>
//                     </form>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Comment;
