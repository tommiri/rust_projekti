
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

// Import a service function to handle email updates
import { updateEmail } from '@/services/profileChange';
import { useAuth } from '@/providers/authProvider';

function ProfileCardEmail() {

  const { token } = useAuth(); // Use the useAuth hook to get the authentication token
  const [email, setEmail] = useState('');

  // State to store any error message if the email update fails
  const [error, setError] = useState(null);

  // State to store a success message if the email update succeeds
  const [successMessage, setSuccessMessage] = useState(null);

  // Event handler for form submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('You must be logged in to update your email.');
      return;
    }

    try {
      // Attempt to update the email via the updateEmail service
      await updateEmail(email);

      // Reset the email input field and set a success message
      setEmail('');
      setSuccessMessage('Email updated successfully!');
      setError(null);
    } catch (err) {
      // Handle errors by displaying an error message
      setError('Failed to update email.');
      setSuccessMessage(null);
    }
  };

  return (

    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Update Email</CardTitle>
      </CardHeader>

      {/* Card content containing the email input form */}
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
