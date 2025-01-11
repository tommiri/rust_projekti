import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { register } from '@/services/auth';
import { LoadingSpinner } from './LoadingSpinner';

const FormSchema = z.object({
  firstName: z.string().min(1, 'Etunimi on pakollinen'),
  lastName: z.string().min(1, 'Sukunimi on pakollinen'),
  email: z
    .string()
    .min(1, 'Sähköposti on pakollinen')
    .email('Virheellinen sähköpostiosoite'),
  password: z.string().min(8, 'Salasanan on oltava vähintään 8 merkkiä pitkä'),
});

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const handleRegister = async (values) => {
    setIsLoading(true);
    const firstName = values.firstName;
    const lastName = values.lastName;
    const email = values.email;
    const password = values.password;
    try {
      const response = await register(firstName, lastName, email, password);
      if (
        response.data.message == 'Validation failed' ||
        response.data.message == 'Invalid email or password' ||
        response.data.message == 'Email address is already in use'
      ) {
        throw new Error(response.data.message);
      }
      navigate(`/verify/${encodeURIComponent(email)}`);
    } catch (error) {
      setRegisterError(
        error.message || 'Rekisteröityminen epäonnistui. Yritä uudelleen.'
      );
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)}>
        <div className="grid gap-4">
          {registerError && (
            <Alert variant="destructive">
              <AlertDescription>{registerError}</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="firstName">Etunimi</FormLabel>
                    <FormControl>
                      <Input id="firstName" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="lastName">Sukunimi</FormLabel>
                    <FormControl>
                      <Input id="lastName" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Sähköposti</FormLabel>
                  <FormControl>
                    <Input id="email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Salasana</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="on"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
      </form>
    </Form>
  );
};

export default RegisterForm;
