import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient from '../../api/api';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { motion } from 'framer-motion';

const loginUser = async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
};

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setToken } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm();

    // FIXED: Get the "from" location, so we can redirect the user back after login.
    const from = location.state?.from?.pathname || "/";

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            toast.success('Logged in successfully!');
            setToken(data.token);
            // FIXED: Navigate to the page the user was trying to access, or the homepage.
            navigate(from, { replace: true });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <motion.div 
            className="flex items-center justify-center min-h-[80vh]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
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
                            {mutation.isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}