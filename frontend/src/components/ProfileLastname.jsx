import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateLastname } from '@/services/profileChange';

function ProfileLastname() {
  const [lastname, setLastname] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleLastnameSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLastname(lastname);
      setLastname('');
      setSuccessMessage('Last name updated successfully!');
    } catch (err) {
      setError('Failed to update Last name.');
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-2xl">Vaihda sukunimi</CardTitle>
        <CardDescription>Anna uusi sukunimi</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLastnameSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Sukunimi</Label>
              <Input
                id="name"
                type="name"
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

export default ProfileLastname;
