import axios from 'axios';

const verifyEmail = async (token) => {

  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/verify/${token}`
  );
  return response;
};

export default verifyEmail;
