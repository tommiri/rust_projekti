import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ProfileEmail from './ProfileEmail';
import ProfileFirstName from '@/components/ProfileFirstname';
import ProfileLastName from '@/components/ProfileLastname';
import ProfilePassword from '@/components/ProfilePassword';
import EmailReservation from '@/components/EmailReservation';

const ProfileCard = () => {
  return (
    <div className="flex justify-center">
      <Card className="mb-4 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Profiili</CardTitle>
          <CardDescription>Omat tiedot</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:max-w-sm">
          <div className="max-w-sm">
            <ProfileFirstName />
          </div>
          <ProfileLastName />
          <ProfileEmail />
          <ProfilePassword />
          <EmailReservation />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCard;
