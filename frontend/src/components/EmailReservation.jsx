import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinner } from './LoadingSpinner';
import { reserveEmail, deleteEmail, getDomain } from '@/services/email';

const EmailReservation = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [reserveState, reserveAction] = useState();
  const [deleteState, deleteAction] = useState();
  const domain = getDomain();

  const reserveEmailHandler = async (email) => {
    setLoading(true);
    try {
      await reserveEmail(email);
      reserveAction({
        success: true,
        message: 'Varaus onnistui',
      });
    } catch (error) {
      reserveAction({
        success: false,
        message: 'Varaaminen epäonnistui',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteEmailHandler = async () => {
    setLoading(true);
    try {
      await deleteEmail();
      deleteAction({
        success: true,
        message: 'Sähköposti poistettu',
      });
    } catch (error) {
      deleteAction({
        success: false,
        message: 'Poistaminen epäonnistui',
      });
    } finally {
      setLoading(false);
    }
  };

  /*
  {
    success: true,
    message: 'Varaus onnistui',
  }
    */

  if (loading) {
    return <LoadingSpinner />;
  }

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
            <Button variant="destructive" onClick={deleteEmailHandler}>
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
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <Button className="mt-4 w-full" onClick={reserveEmailHandler}>
              Varaa sähköpostiosoite
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default EmailReservation;
