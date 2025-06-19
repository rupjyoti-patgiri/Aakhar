import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the route requires specific roles and the user's role is not included,
  // redirect them to the home page.
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and (no roles are required or user has the required role), render the child component.
  return <Outlet />;
};

export default ProtectedRoute;