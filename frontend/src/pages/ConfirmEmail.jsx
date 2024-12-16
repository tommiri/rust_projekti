import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const { email } = useParams();

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Vahvista sähköpostiosoite</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Vahvistusviesti on lähetetty osoitteeseen{' '}
          <strong>{decodeURIComponent(email)}</strong>.
        </p>{' '}
        <p className="mt-2">Tarkista myös roskapostikansio.</p>{' '}
        <p className="mt-4">Tili jo vahvistettu?</p>
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

export default ConfirmEmail;
