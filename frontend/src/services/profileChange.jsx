export const updateEmail = async (email) => {
  const response = await fetch('http://localhost:8000/email', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return response;
};

export const updatePassword = async (password) => {
  const response = await fetch('http://localhost:8000/password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return response;
};

export const updateFirstname = async (firstname) => {
  const response = await fetch('http://localhost:8000/Firstname', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstname }),
  });
  return response;
};

export const updateLastname = async (lastname) => {
  const response = await fetch('http://localhost:8000/lastname', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lastname }),
  });
  return response;
};
