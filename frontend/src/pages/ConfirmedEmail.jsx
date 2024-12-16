import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ConfirmedEmail = () => {
  const navigate = useNavigate();
  const { email } = useParams();

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sähköposti vahvistettu</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Sähköpostiosoite on vahvistettu.</p>
        <p className='mt-2'>Voit nyt kirjautua sisään.</p>
        <div className="mt-4">
          <Button
            className="w-full md:w-auto"
            onClick={() => navigate('/login')}
          >
            Kirjaudu sisään
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfirmedEmail;
