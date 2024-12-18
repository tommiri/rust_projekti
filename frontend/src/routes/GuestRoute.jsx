import { Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/authProvider';
import RootLayout from '@/pages/RootLayout';

export const GuestRoute = () => {
  const { token } = useAuth();

  // Check if the user is authenticated
  if (token) {
    // If authenticated, redirect to the profile page
    return <Navigate to="/profile" />;
  }

  // If authenticated, render the child routes
  return <RootLayout />;
};
