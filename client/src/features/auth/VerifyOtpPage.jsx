import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'sonner';
import apiClient from '../../api/api';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { motion } from 'framer-motion';

const verifyOtp = async (data) => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
};

export default function VerifyOtpPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get('email');
    const { setToken } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { email }
    });

    const mutation = useMutation({
        mutationFn: verifyOtp,
        onSuccess: (data) => {
            toast.success(data.message);
            setToken(data.token);
            navigate('/');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'OTP verification failed.');
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    if (!email) {
        return (
            <div className="text-center">
                <p>No email provided. Please sign up first.</p>
                <Link to="/signup"><Button>Go to Signup</Button></Link>
            </div>
        );
    }
    
    return (
         <motion.div
            className="flex items-center justify-center min-h-[80vh]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Verify Your Email</CardTitle>
                    <CardDescription>An OTP has been sent to <strong>{email}</strong>. Please enter it below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                        <Input type="hidden" {...register('email')} />
                        <div className="grid gap-2">
                            <Label htmlFor="otp">One-Time Password (OTP)</Label>
                            <Input id="otp" {...register('otp', { required: 'OTP is required', minLength: 6, maxLength: 6 })} />
                            {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={mutation.isLoading}>
                            {mutation.isLoading ? 'Verifying...' : 'Verify and Login'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
}