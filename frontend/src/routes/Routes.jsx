import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import { useAuth } from '@/providers/authProvider';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import Login from '@pages/Login';
import Logout from '@pages/Logout';
import Register from '@/pages/Register';
import ErrorPage from '@pages/ErrorPage';
import Profile from '@pages/Profile';
import ConfirmEmail from '@pages/ConfirmEmail';
import ConfirmedEmail from '@pages/ConfirmedEmail';

const Routes = () => {
  const { token } = useAuth();

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: '/',
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          index: true,
          element: <Navigate to="/profile" />, // Redirect to profile page
        },
        {
          path: '/profile',
          element: <Profile />,
        },
        {
          path: '/logout',
          element: <Logout />,
        },
        {
          path: '*',
          element: <ErrorPage />,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: '/',
      element: <GuestRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          index: true,
          element: <Navigate to="/login" />, // Redirect to login page
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/register',
          element: <Register />,
        },
        { path: 'confirm/:email', element: <ConfirmEmail /> },
        { path: 'confirmed', element: <ConfirmedEmail /> },
        {
          path: '*',
          element: <ErrorPage />,
        },
      ],
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;
