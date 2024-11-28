import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/providers/authProvider';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
    };
    handleLogout();
  }, [logout]);

  return <LoadingSpinner />;
};

export default Logout;
