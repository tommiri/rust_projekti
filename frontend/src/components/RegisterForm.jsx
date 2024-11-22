import { Link } from 'react-router-dom';

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

function RegisterForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Rekisteröidy</CardTitle>
        <CardDescription>Anna tietosi tilin luomista varten</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">Etunimi</Label>
              <Input id="first-name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Sukunimi</Label>
              <Input id="last-name" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Sähköposti</Label>
            <Input id="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Salasana</Label>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full">
            Luo tili
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Onko sinulla jo tili?{' '}
          <Link to="/login" className="underline">
            Kirjaudu sisään
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default RegisterForm;
