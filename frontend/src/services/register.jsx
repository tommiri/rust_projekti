import axios from 'axios';

const register = async (first_name, last_name, email, password) => {
  const response = await axios.post('http://localhost:8000/api/register', {
    email,
    password,
    first_name,
    last_name,
  });
  return response;
};

export default register;
