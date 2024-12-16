import axios from 'axios';

const login = async (email, password) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/login/`,
    {
      email: email,
      password: password,
    }
  );
  return response;
};

export default login;
