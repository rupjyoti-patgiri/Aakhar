import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../../api/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { motion } from 'framer-motion';

const signupUser = async (userData) => {
    const { data } = await apiClient.post('/auth/signup', userData);
    return data;
};

export default function SignupPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    // 1. We simplify the useMutation hook declaration.
    // The onSuccess logic will be handled below, where we have the correct data scope.
    const mutation = useMutation({
        mutationFn: signupUser,
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Signup failed.');
        }
    });

    // 2. The onSubmit function is updated to handle the redirect.
    const onSubmit = (formData) => {
        // `formData` here is the object with the user's input, e.g., { email: 'user@test.com', ... }
        // We call `mutate` and pass a second argument for specific options for THIS mutation call.
        mutation.mutate(formData, {
            onSuccess: (apiResponseData) => {
                // apiResponseData is the data returned from the backend, e.g., { message: '...' }
                toast.success(apiResponseData.message);
                // We use `formData.email` which is guaranteed to be correct here.
                navigate(`/verify-otp?email=${formData.email}`);
            }
        });
    };

    return (
        <motion.div
            className="flex items-center justify-center min-h-[80vh]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>Enter your details to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* The form itself remains unchanged */}
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" {...register('username', { required: 'Username is required' })} />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" {...register('email', { required: 'Email is required' })} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register('password', { required: 'Password is required' })} />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={mutation.isLoading}>
                            {mutation.isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}