import AdminDashboard from '../features/admin/AdminDashboard';
import { motion } from 'framer-motion';

const AdminPage = () => {
    return (
        <div>
            <motion.h1 
                className="text-3xl font-bold mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                Admin Dashboard
            </motion.h1>
            <AdminDashboard />
        </div>
    );
};

export default AdminPage;