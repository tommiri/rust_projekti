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
import { updatePassword } from '@/services/profileChange';

function ProfilePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    try {
      await updatePassword(password);
      setPassword('');
      setConfirmPassword('');
      setSuccessMessage('Password updated successfully!');
    } catch (err) {
      setError('Failed to update password.');
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-2xl">Vaihda salasana</CardTitle>
        <CardDescription>Anna uusi salasana</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Salasana</Label>
              <Input
                id="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Varmista salasana</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ProfilePassword;
