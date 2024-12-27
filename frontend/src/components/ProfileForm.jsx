import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateEmail, updatePassword } from '@/services/profileChange';

function ProfileForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Change Email</CardTitle>
        <CardDescription>Enter your new email address</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Update
            </Button>
          </div>
        </form>
      </CardContent>

      <CardHeader>
        <CardTitle className="text-2xl">Change Password</CardTitle>
        <CardDescription>Enter your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Update
            </Button>
          </div>
        </form>
      </CardContent>
      <CardContent>
        {error && <div className="text-red-500">{error}</div>}
        {successMessage && <div className="text-green-500">{successMessage}</div>}
      </CardContent>
    </Card>
  );
}

export default ProfileForm;
