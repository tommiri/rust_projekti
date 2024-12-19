import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EmailReservation = () => {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(true);
  const [reserveState, reserveAction] = useState();
  /*
  {
    success: true,
    message: 'Varaus onnistui',
  }
    */
  const [deleteState, deleteAction] = useState();

  return (
    <>
      {(reserveState || deleteState) && (
        <Alert
          variant={
            reserveState?.success || deleteState?.success
              ? 'default'
              : 'destructive'
          }
          className="w-full"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {reserveState?.success || deleteState?.success
              ? 'Hyväksytty'
              : 'Virhe'}
          </AlertTitle>
          <AlertDescription>
            {reserveState?.message || deleteState?.message}
          </AlertDescription>
        </Alert>
      )}
      {email ? (
        <div className="flex flex-col items-center">
          <div className="mb-4 flex items-center space-x-10">
            <div className="space-y-1">
              <p>Sähköpostiosoite:</p>
              <p>
                <strong>{email}</strong>
              </p>
            </div>
            <Button type="submit" variant="destructive">
              Poista sähköposti
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Sähhköpostiosoite</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Anna sähköpostiosoite"
                required
              />
            </div>
          </div>
          <Button type="submit" className="mt-4 w-full">
            Varaa sähköpostiosoite
          </Button>
        </>
      )}
    </>
  );
};

export default EmailReservation;
