import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import Layout from './components/shared/Layout';
import ProtectedRoute from './components/shared/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import VerifyOtpPage from './features/auth/VerifyOtpPage';
import SinglePostPage from './pages/SinglePostPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import RoleRequestPage from './pages/RoleRequestPage';

function App() {
  const { token, fetchUser } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/post/:id" element={<SinglePostPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-post" element={<CreatePostPage roles={['author', 'admin']} />} />
          <Route path="/request-author-role" element={<RoleRequestPage roles={['reader']} />} />
          <Route path="/admin" element={<AdminPage roles={['admin']} />} />
        </Route>

      </Routes>
    </Layout>
  )
}

export default App;