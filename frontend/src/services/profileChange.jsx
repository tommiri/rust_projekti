import { useAuth } from '@/providers/authProvider';

export const updateEmail = async (email, token) => {
  const response = await fetch('http://localhost:8000/api/email', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });
  return response;
};

export const updatePassword = async (password, token) => {
  const response = await fetch('http://localhost:8000/api/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });
  return response;
};

export const updateFirstname = async (firstname, token) => {
  const response = await fetch('http://localhost:8000/api/firstname', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ firstname }),
  });
  return response;
};

export const updateLastname = async (lastname, token) => {

  const response = await fetch('http://localhost:8000/api/lastname', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ lastname }),
  });
  return response;
};
