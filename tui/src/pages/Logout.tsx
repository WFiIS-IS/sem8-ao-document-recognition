import { useAuth } from 'oidc-react';
import { useEffect } from 'react';

export function Logout() {
  const auth = useAuth();

  useEffect(() => {
    console.log('Logging out...');
    void auth.signOutRedirect();
  }, [auth]);

  return (
    <div className="error-page">
      <h1>Success</h1>
      <div className="error-description">
        <p className="error-sorry">Successfully logged out. Wait a sec to be redirected...</p>
      </div>
    </div>
  );
}
