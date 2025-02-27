import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateEmail } from '@/services/profileChange';
import { useAuth } from '@/providers/authProvider';

function ProfileCardEmail() {
  const { token } = useAuth(); // Use the useAuth hook to get the authentication token
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('You must be logged in to update your email.');
      return;
    }

    try {
      await updateEmail(email);
      setEmail('');
      setSuccessMessage('Email updated successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to update email.');
      setSuccessMessage(null);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Update Email</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <CardDescription className="text-red-500">{error}</CardDescription>}
        {successMessage && <CardDescription className="text-green-500">{successMessage}</CardDescription>}
        <form onSubmit={handleEmailSubmit}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="mt-4">Update</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProfileCardEmail;
