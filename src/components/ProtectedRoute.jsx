import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, requiredRole, requiredPermission }) => {
  const { user, hasRole, hasPermission, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    toast.error(`Accès refusé. Rôle ${requiredRole} requis.`);
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    toast.error(`Accès refusé. Permission ${requiredPermission} requise.`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;