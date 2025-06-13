import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '../../api/api';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { useState } from 'react';

const updateDetails = async (formData) => {
    const { data } = await apiClient.put('/api/v1/users/updatedetails', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

const UpdateProfileForm = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [avatarPreview, setAvatarPreview] = useState(user.avatar?.imageUrl);

    const { register, handleSubmit, watch, setValue, formState: { errors, isDirty } } = useForm({
        defaultValues: {
            bio: user.bio || '',
            imageFile: null,
            twitter: user.socialLinks?.twitter || '',
            github: user.socialLinks?.github || '',
            linkedin: user.socialLinks?.linkedin || '',
            website: user.socialLinks?.website || '',
        }
    });

    const mutation = useMutation({
        mutationFn: updateDetails,
        onSuccess: () => {
            toast.success('Profile updated successfully!');
            queryClient.invalidateQueries(['user', 'me']); // This will trigger a re-fetch in useAuthStore
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        }
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue('imageFile', file, { shouldDirty: true });
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        if (data.imageFile) {
            formData.append('imageFile', data.imageFile);
        }
        formData.append('bio', data.bio);
        formData.append('socialLinks[twitter]', data.twitter);
        formData.append('socialLinks[github]', data.github);
        formData.append('socialLinks[linkedin]', data.linkedin);
        formData.append('socialLinks[website]', data.website);
        
        mutation.mutate(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Update your personal information and social links.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={avatarPreview} />
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1.5">
                            <Label htmlFor="picture">Profile Picture</Label>
                            <Input id="picture" type="file" onChange={handleAvatarChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Tell us about yourself" {...register('bio')} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="twitter">Twitter URL</Label>
                            <Input id="twitter" placeholder="https://twitter.com/username" {...register('twitter')} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="github">GitHub URL</Label>
                            <Input id="github" placeholder="https://github.com/username" {...register('github')} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn URL</Label>
                            <Input id="linkedin" placeholder="https://linkedin.com/in/username" {...register('linkedin')} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="website">Website URL</Label>
                            <Input id="website" placeholder="https://your-website.com" {...register('website')} />
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <Button type="submit" disabled={mutation.isLoading || !isDirty}>
                            {mutation.isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default UpdateProfileForm;