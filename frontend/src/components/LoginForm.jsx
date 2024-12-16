import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
} from '@/components/ui/form';
import login from '@/services/login';
import { useAuth } from '@/providers/authProvider';

const FormSchema = z.object({
  email: z
    .string()
    .min(0, 'Sähköposti on pakollinen')
    .email('Virheellinen sähköpostiosoite'),
  password: z.string().min(1, 'Salasana on pakollinen.'),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (values) => {
    const email = values.email;
    const password = values.password;
    const data = await login(email, password);
    auth.setToken(data.data);
    navigate('/profile');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Sähköposti</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
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
                  <div className="flex items-center">
                    <FormLabel htmlFor="password">Salasana</FormLabel>
                    <Link
                      to="#"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Unohditko salasanasi?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" autoComplete="on" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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
      </form>
    </Form>
  );
};

export default LoginForm;
