import axios from 'axios';

export const login = async (email, password) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/login/`,
    {
      email: email,
      password: password,
    }
  );
  return response;
};

export const register = async (first_name, last_name, email, password) => {
  const response = await axios.post(
    'import.meta.env.VITE_API_URL}/api/register',
    {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
    }
  );
  return response;
};

export const validateToken = async (token) => {
  if (!token) return false;

  try {
    await axios.get('import.meta.env.VITE_API_URL}/api/protected', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    return false;
  }
};
