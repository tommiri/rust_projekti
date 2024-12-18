import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/authProvider';

const ErrorPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sivua ei löydy</CardTitle>
        <CardDescription>
          Jotain meni pieleen. Etsimääsi sivua ei löytynyt.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!token ? (
          <div className="flex justify-center space-x-6">
            <Button
              className="w-full md:w-auto"
              onClick={() => navigate('/login')}
            >
              Kirjaudu sisään
            </Button>
            <Button
              className="w-full md:w-auto"
              onClick={() => navigate('/register')}
            >
              Rekisteröidy
            </Button>
          </div>
        ) : (
          <div className="flex justify-center space-x-6">
            <Button
              className="w-full md:w-auto"
              onClick={() => navigate('/profile')}
            >
              Oma sivu
            </Button>
            <Button
              className="w-full md:w-auto"
              onClick={() => navigate('/logout')}
            >
              Kirjaudu ulos
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorPage;
