import { useState } from 'react';
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

function ProfileEmail() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmail(email);
      setEmail('');
      setSuccessMessage('Email updated successfully!');
    } catch (err) {
      setError('Failed to update email.');
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-2xl">Vaihda sähköposti</CardTitle>
        <CardDescription>Anna uusi sähköposti</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Sähköposti</Label>
              <Input
                id="email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Päivitä
            </Button>
          </div>
        </form>
      </CardContent>
      <CardContent>
        {error && <div className="text-red-500">{error}</div>}
        {successMessage && (
          <div className="text-green-500">{successMessage}</div>
        )}
      </CardContent>
    </div>
  );
}

export default ProfileEmail;
