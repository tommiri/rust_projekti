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

export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account.";

export const iframeHeight = '600px';

export const containerClassName =
  'w-full h-screen flex items-center justify-center px-4';

function LoginForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Kirjaudu sisään</CardTitle>
        <CardDescription>
          Anna sähköpostiosoitteesi ja salasanasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Sähköposti</Label>
            <Input id="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Salasana</Label>
              <Link to="#" className="ml-auto inline-block text-sm underline">
                Unohditko salasanasi?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Kirjaudu sisään
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Eikö sinulla ole tiliä?{' '}
          <Link to="/register" className="underline">
            Rekisteröidy
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
