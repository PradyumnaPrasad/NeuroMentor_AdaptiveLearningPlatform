import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      // Not logged in, redirect to login
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // If not authenticated, don't render anything (will redirect)
  if (!token || !user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
