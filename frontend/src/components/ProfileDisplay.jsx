import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProfileData } from '@/services/ProfileData';

const ProfileDisplay = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleDataPull = async () => {
    try {
      const fetchedData = await ProfileData();
      setData(fetchedData);
      setError(null);
    } catch (err) {
      setError('Failed to pull data.');
      setData(null);
    }
  };

  useEffect(() => {
    handleDataPull();
  }, []);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Nykyiset tiedot</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <CardDescription className="text-red-500">{error}</CardDescription>}
        {data ? (
          <CardDescription>
            {/* Render data */}
            <p>Name: {data.name}</p>
            <p>Email: {data.email}</p>
          </CardDescription>
        ) : (
          <CardDescription>Loading...</CardDescription>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileDisplay;
