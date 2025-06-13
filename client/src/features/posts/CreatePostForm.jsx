import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import apiClient from '../../api/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';

const createPost = async (postData) => {
    const { data } = await apiClient.post('/api/v1/posts/createPost', postData);
    return data;
};

const CreatePostForm = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const mutation = useMutation({
        mutationFn: createPost,
        onSuccess: (data) => {
            toast.success('Post created successfully!');
            queryClient.invalidateQueries(['posts']);
            navigate(`/post/${data.data._id}`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create post.');
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create a New Post</CardTitle>
                    <CardDescription>Share your thoughts with the world.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input 
                                id="title"
                                placeholder="Your post title"
                                {...register('title', { required: "Title is required." })}
                            />
                            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="body">Content</Label>
                            <Textarea 
                                id="body"
                                placeholder="Write your post content here..."
                                rows={10}
                                {...register('body', { required: "Content is required." })}
                            />
                            {errors.body && <p className="text-sm text-red-500">{errors.body.message}</p>}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={mutation.isLoading}>
                                {mutation.isLoading ? 'Publishing...' : 'Publish Post'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CreatePostForm;