import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateLastname } from '@/services/profileChange';
import { useAuth } from '@/providers/authProvider';

function ProfileCardLastname() {
  const { token } = useAuth(); // Use the useAuth hook to get the authentication token
  const [lastname, setLastname] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleLastnameSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('You must be logged in to update your last name.');
      return;
    }

    try {
      await updateLastname(lastname, token);
      setLastname('');
      setSuccessMessage('Last name updated successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to update last name.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Vaihda sukunimi</CardTitle>
        <CardDescription>Anna uusi sukunimi</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLastnameSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lastname">Sukunimi</Label>
              <Input
                id="lastname"
                type="text"
                value={lastname}
                required
                onChange={(e) => setLastname(e.target.value)}
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
        {successMessage && <div className="text-green-500">{successMessage}</div>}
      </CardContent>
    </div>
  );
}

export default ProfileCardLastname;
