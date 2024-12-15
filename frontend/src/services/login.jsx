import axios from 'axios';

const login = async (email, password) => {
  const response = await axios.post('http://localhost:8000/api/login', {
    email: email,
    password: password,
  });
  const token = response.data;
  return token;
};

export default login;
