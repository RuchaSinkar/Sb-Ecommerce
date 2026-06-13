import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}><div style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTopColor: '#2874f0', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.roles?.includes('ROLE_ADMIN')) return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;
