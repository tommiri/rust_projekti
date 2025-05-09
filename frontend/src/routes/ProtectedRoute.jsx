import { Navigate } from 'react-router';
import { useAuth } from '@/providers/authProvider';
import RootLayout from '@/pages/RootLayout';

export const ProtectedRoute = () => {
  const { token } = useAuth();

  // Check if the user is authenticated
  if (!token) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child routes
  return <RootLayout />;
};
