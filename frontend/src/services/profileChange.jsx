export const updateEmail = async (email) => {
  const response = await fetch('http://localhost:8000/api/email', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return response;
};

export const updatePassword = async (password) => {
  const response = await fetch('http://localhost:8000/api/password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return response;
};

export const updateFirstname = async (firstname) => {
  const response = await fetch('http://localhost:8000/api/firstname', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstname }),
  });
  return response;
};

export const updateLastname = async (lastname) => {
  const response = await fetch('http://localhost:8000/api/lastname', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lastname }),
  });
  return response;
};
