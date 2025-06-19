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
    if (token && !useAuthStore.getState().user) {
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

        {/* These routes require the user to be logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* This route is further protected and only accessible by users with the 'author' or 'admin' role */}
          <Route element={<ProtectedRoute roles={['author', 'admin']} />}>
            <Route path="/create-post" element={<CreatePostPage />} />
          </Route>
          
          {/* Only accessible by 'reader' role */}
          <Route element={<ProtectedRoute roles={['reader']} />}>
            <Route path="/request-author-role" element={<RoleRequestPage />} />
          </Route>

          {/* Only accessible by 'admin' role */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
             <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
        
        {/* Add a fallback for any page not found */}
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Layout>
  )
}

export default App;