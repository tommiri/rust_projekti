import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from './LoadingSpinner';
import verifyEmail from '@/services/verifyEmail';

const VerifiedEmailCard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState({
    success: false,
    message: 'Vahvistetaan sähköpostia...',
  });

  useEffect(() => {
    const verifyEmailHandler = async () => {
      try {
        console.log('Verifyemailhandler');
        const response = await verifyEmail(token);
        console.log('Repsonse got');

        setVerificationStatus({
          success: true,
        });
      } catch (error) {
        console.log('Error in verifyEmailHandler', error);
        setVerificationStatus({
          success: false,
          message: 'Sähköpostin vahvistaminen epäonnistui.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    verifyEmailHandler();
  }, [token]);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sähköposti vahvistettu</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <p>Vahvistetaan sähköpostia...</p>
            <LoadingSpinner />
          </>
        ) : (
          <>
            {verificationStatus.success ? (
              <>
                <p>Sähköpostiosoite on vahvistettu.</p>
                <p className="mt-2">Voit nyt kirjautua sisään.</p>
                <div className="mt-4">
                  <Button
                    className="w-full md:w-auto"
                    onClick={() => navigate('/login')}
                  >
                    Kirjaudu sisään
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p>{verificationStatus.message}</p>
                <p className="mt-2">Yritä rekisteröityä uudelleen.</p>
                <div className="mt-4">
                  <Button
                    className="w-full md:w-auto"
                    onClick={() => navigate('/register')}
                  >
                    Rekisteröidy
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifiedEmailCard;
