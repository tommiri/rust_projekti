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

function ProfileForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Vaihda sähköpostiosoite</CardTitle>
        <CardDescription>
          Anna uusi sähköpostiosoitteesi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Sähköposti</Label>
            <Input id="email" type="email" />
          </div>
          <Button type="submit" className="w-full">
            Vaihda
          </Button>
        </div>
      </CardContent>

      <CardHeader>
        <CardTitle className="text-2xl">Vaihda salasana</CardTitle>
        <CardDescription>
          Anna uusi salasana
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Salasana</Label>
            <Input id="passwond" type="password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Salasana uudestaan</Label>
            <Input id="passwond" type="password" />
          </div>
          <Button type="submit" className="w-full">
            Vaihda
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileForm;
