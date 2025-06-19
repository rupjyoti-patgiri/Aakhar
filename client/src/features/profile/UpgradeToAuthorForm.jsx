import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '../../api/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';

const submitRequest = async (requestData) => {
    const { data } = await apiClient.post('/requests', requestData);
    return data;
};

const UpgradeToAuthorForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const mutation = useMutation({
        mutationFn: submitRequest,
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Couldn't submit request.");
        }
    });

    const onSubmit = (data) => {
        // The backend expects `links` as an array. We'll split by comma for simplicity.
        const requestData = {
            ...data,
            links: data.links ? data.links.split(',').map(link => link.trim()) : [],
        };
        mutation.mutate(requestData);
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Request to Become an Author</CardTitle>
                <CardDescription>
                    Fill out the form below to apply. Our admins will review your request.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Request</Label>
                        <Textarea 
                            id="reason"
                            placeholder="Why do you want to become an author on BlogVerse?"
                            {...register('reason', { required: "This field is required." })}
                        />
                        {errors.reason && <p className="text-sm text-red-500">{errors.reason.message}</p>}
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="experience">Writing Experience</Label>
                        <Textarea 
                            id="experience"
                            placeholder="Describe your previous writing experience."
                            {...register('experience', { required: "This field is required." })}
                        />
                        {errors.experience && <p className="text-sm text-red-500">{errors.experience.message}</p>}
                    </div>

                     <div className="space-y-2">
                        <Label htmlFor="links">Portfolio Links</Label>
                        <Input 
                            id="links"
                            placeholder="e.g., https://my-blog.com, https://medium.com/@me (comma-separated)"
                            {...register('links')}
                        />
                         <p className="text-sm text-muted-foreground">
                            Provide comma-separated links to your portfolio, blog, or published articles.
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={mutation.isLoading || mutation.isSuccess}>
                            {mutation.isLoading ? 'Submitting...' : (mutation.isSuccess ? 'Request Submitted' : 'Submit Request')}
                        </Button>
                    </div>
                 </form>
            </CardContent>
        </Card>
    );
};

export default UpgradeToAuthorForm;