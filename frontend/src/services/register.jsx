import axios from 'axios';

const register = async (first_name, last_name, email, password) => {
  const response = await axios.post('http://localhost:8000/api/register', {
    email: email,
    password: password,
  });
  return response;
};

export default register;
