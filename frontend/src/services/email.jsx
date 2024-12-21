import axios from 'axios';

export const verifyEmail = async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/verify/${token}`
  );
  return response;
};

export const getEmail = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/email/`);
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const reserveEmail = async (email) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/email`,
    {
      email: email,
    }
  );
};

export const deleteEmail = async () => {
  const response = await axios.delete(
    `${import.meta.env.VITE_API_URL}/api/email/`
  );
  return response;
};

export const getDomain = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/domain`
  );
  return response;
};
