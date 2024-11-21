import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';

import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
import Register from './pages/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/login" /> }, // Redirect to login page
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/profile' },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
