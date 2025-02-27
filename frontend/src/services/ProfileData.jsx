import { useAuth } from '@/providers/authProvider';

export const ProfileData = async () => {
  const { token } = useAuth();

  const response = await fetch('http://localhost:8000/api/profiledata', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile data');
  }

  return response.json();
};