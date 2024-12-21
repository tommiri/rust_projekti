import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { validateToken } from '@/services/auth';

// Authentication context to provide the authentication token
const AuthContext = createContext();
let logoutTimer;

// Provider for the authentication context. It provides
// the authentication token, a function to set the token and logout function.
const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem(null));
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const isValid = await validateToken(storedToken);
      if (isValid) {
        setToken_(storedToken);
      } else {
        localStorage.removeItem('token');
      }
    };
    initAuth();
  }, []);

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
    localStorage.setItem('token', newToken);
  };

  // Logout function to clear the authentication token
  const logout = async () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  // Set the authentication token in the axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      setTokenExpirationDate(new Date(new Date().getTime() + 3600 * 1000));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setTokenExpirationDate(null);
    }
  }, [token]);

  // Logout automatically when the token expires
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExpirationDate, logout]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      logout,
    }),
    [token]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook to use the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
