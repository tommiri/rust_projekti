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

function ProfileForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const emailData = { email };
    fetch('http://localhost:8000/email', {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(emailData),
    })
      .then(() => {
        setEmail('');
        console.log(emailData);
      })
      .catch(() => {
        alert('Vaihto epäonnistui!');
      });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const passwordData = { password };
    if (password === passwordCheck) {
      fetch('http://localhost:8000/pswrd', {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(passwordData),
      })
        .then(() => {
          setPassword('');
          setPasswordCheck('');
          console.log('salana vaihdettu');
        })
        .catch(() => {
          alert('Vaihto epäonnistui!');
        });
    } else {
      alert('Salasanat eivät täsmää!');
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Vaihda sähköpostiosoite</CardTitle>
        <CardDescription>Anna uusi sähköpostiosoitteesi</CardDescription>
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
              Vaihda
            </Button>
          </div>
        </form>
      </CardContent>

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
              <Label htmlFor="password">Salasana uudestaan</Label>
              <Input
                id="passwordCheck"
                type="password"
                value={passwordCheck}
                required
                onChange={(e) => setPasswordCheck(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Vaihda
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProfileForm;
