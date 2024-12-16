import axios from 'axios';

const verifyEmail = async (token) => {
  console.log(
    'Api url:',
    `${import.meta.env.VITE_API_URL}/api/verify/${token}`
  );
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/verify/${token}`
  );
  console.log('Verification response:', response);
  return response;
};

export default verifyEmail;
