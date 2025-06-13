import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, logout, setToken } = useAuthStore();
  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';
  const isAuthor = user?.role === 'author';
  const isReader = user?.role === 'reader';

  return { user, token, isAuthenticated, isAdmin, isAuthor, isReader, logout, setToken };
};