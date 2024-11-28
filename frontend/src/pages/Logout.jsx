import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/providers/authProvider';

const Logout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
    };
    handleLogout();
  }, [logout]);

  return <LoadingSpinner />;
};

export default Logout;
