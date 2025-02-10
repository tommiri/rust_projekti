export const ProfileData = async (data) => {
    const response = await fetch('http://localhost:8000/api/profiledata', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    return response;
  };