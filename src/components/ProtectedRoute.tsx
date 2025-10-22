import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('ProtectedRoute: isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('ProtectedRoute: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nail-purple mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('ProtectedRoute: Rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
