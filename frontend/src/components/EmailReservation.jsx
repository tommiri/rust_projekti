import { useState, useEffect } from 'react';
import { set, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoadingSpinner } from './LoadingSpinner';
import { reserveEmail, deleteEmail, getDomain } from '@/services/email';

const FormSchema = z.object({
  email: z
    .string()
    .min(1, 'Sähköpostin alkuosa on pakollinen')
    .max(64, 'Sähköpostin alkuosa saa olla enintään 64 merkkiä')
    .regex(
      /^[a-zA-Z0-9!#$%&'*+\-/=?^_`.{|}~]+(?:\.[a-zA-Z0-9!#$%&'*+\-/=?^_`.{|}~]+)*$/,
      'Sähköpostin alkuosa sisältää virheellisiä merkkejä'
    )
    .refine(
      (value) => !value.startsWith('.'),
      'Sähköpostin alkuosa ei voi alkaa pisteellä'
    )
    .refine(
      (value) => !value.endsWith('.'),
      'Sähköpostin alkuosa ei voi päättyä pisteeseen'
    )
    .refine(
      (value) => !value.includes('..'),
      'Sähköpostin alkuosa ei voi sisältää peräkkäisiä pisteitä'
    ),
});

const EmailReservation = () => {
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reserveState, setReserveState] = useState();
  const [deleteState, setDeleteState] = useState();
  const [domain, setDomain] = useState('');

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    const fetchDomain = async () => {
      const response = await getDomain();
      console.log('Domain', response.data);
      setDomain(response.data);
    };
    fetchDomain();
  }, []);

  const reserveEmailHandler = async (values) => {
    setLoading(true);
    try {
      const email_to_reserve = values.email;
      await reserveEmail(email_to_reserve);
      setReserveState({
        success: true,
        message: 'Varaus onnistui',
      });

      setEmail(email_to_reserve + '@' + domain);
      console.log('Email reserved', email);
    } catch (error) {
      setReserveState({
        success: false,
        message: 'Varaaminen epäonnistui',
      });
    } finally {
      setDeleteState(null);
      setLoading(false);
    }
  };

  const deleteEmailHandler = async () => {
    setLoading(true);
    try {
      await deleteEmail();
      setDeleteState({
        success: true,
        message: 'Sähköposti poistettu',
      });
      setEmail(null);
    } catch (error) {
      setDeleteState({
        success: false,
        message: 'Poistaminen epäonnistui',
      });
    } finally {
      setReserveState(null);
      setLoading(false);
    }
  };

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
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(reserveEmailHandler)}
          >
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">
                        Varaa sähköpostiosoite
                      </FormLabel>

                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="Käyttäjänimi"
                            className="rounded-r-none border-r-0"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex h-10 items-center rounded-r-lg border bg-gray-50 px-3 font-medium text-gray-500">
                          @{domain}
                        </div>
                      </div>
                      <FormMessage className="mt-1 text-sm text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="mt-4 w-full">
                Varaa
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default EmailReservation;
