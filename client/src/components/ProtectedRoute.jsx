import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  // If somehow an admin hits a user route, send to admin panel
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
}
