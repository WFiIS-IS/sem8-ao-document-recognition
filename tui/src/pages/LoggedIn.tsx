import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/api/apollo/hooks/useUser.ts';

export function Login() {
  const navigate = useNavigate();
  const { loading } = useUser();

  useEffect(() => {
    if (loading) {
      return;
    }

    console.log('Logging in...');
    const timeout = setTimeout(() => {
      console.log('Redirecting...');
      navigate('/');
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [navigate, loading]);

  return (
    <div className="error-page">
      <h1>Success</h1>
      <div className="error-description">
        {loading ? (
          <p className="error-sorry">Retrieving user information...</p>
        ) : (
          <p className="error-sorry">Successfully logged in. Wait a sec to be redirected...</p>
        )}
      </div>
    </div>
  );
}
