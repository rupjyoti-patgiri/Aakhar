import { motion } from 'framer-motion';
import UpdateProfileForm from '../features/profile/UpdateProfileForm';

const ProfilePage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <motion.h1 
                className="text-3xl font-bold mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                My Profile
            </motion.h1>
            <UpdateProfileForm />
        </div>
    );
};

export default ProfilePage;