import axios from 'axios';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Authentication context to provide the authentication token
const AuthContext = createContext();
let logoutTimer;

// Provider for the authentication context. It provides
// the authentication token, a function to set the token and logout function.
const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  // Logout function to clear the authentication token
  const logout = async () => {
    setToken(null);
  };

  // Set the authentication token in the axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      localStorage.setItem('token',token);
      setTokenExpirationDate(new Date(new Date().getTime() + 3600 * 1000));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token')
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
