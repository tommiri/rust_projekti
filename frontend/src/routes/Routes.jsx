import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import { useAuth } from '@/providers/authProvider';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import Login from '@pages/Login';
import Logout from '@pages/Logout';
import Register from '@/pages/Register';
import RootLayout from '@/pages/RootLayout';
import ErrorPage from '@pages/ErrorPage';

const Routes = () => {
  const { token } = useAuth();

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: '/',
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Navigate to="/profile" />, // Redirect to profile page
        },
        {
          path: '/profile',
          element: <div>User Profile</div>,
        },
        {
          path: '/logout',
          element: <Logout />,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: '/',
      element: <RootLayout />, // Wrap the component in ProtectedRoute
      errorElement: <ErrorPage />,
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
