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
import { updateFirstname } from '@/services/profileChange';

function ProfileFirstname() {
  const [firstname, setFirstname] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleFirstnameSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFirstname(firstname);
      setFirstname('');
      setSuccessMessage('First name updated successfully!');
    } catch (err) {
      setError('Failed to update First name.');
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-2xl">Vaihda etunimi</CardTitle>
        <CardDescription>Anna uusi etunimi</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFirstnameSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Etunimi</Label>
              <Input
                id="name"
                type="name"
                value={firstname}
                required
                onChange={(e) => setFirstname(e.target.value)}
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

export default ProfileFirstname;
