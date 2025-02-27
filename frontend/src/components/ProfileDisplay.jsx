import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProfileData } from '@/services/ProfileData';
import { useAuth } from '@/providers/authProvider';

const ProfileDisplay = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDataPull = async () => {
    try {
      const fetchedData = await ProfileData();
      setData(fetchedData);
      setError(null);
    } catch (err) {
      setError('Failed to pull data.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      handleDataPull();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Nykyiset tiedot</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <CardDescription className="text-red-500">{error}</CardDescription>}
        {loading && !error && <CardDescription>Loading...</CardDescription>}
        {data && (
          <CardDescription>
            {/* Render your data here. Adjust the structure based on your data format */}
            <p>Name: {data.name}</p>
            <p>Email: {data.email}</p>
            {/* Add more fields as needed */}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileDisplay;
