import './Error.scss';

import { useRouteError } from 'react-router-dom';

export function Error() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = useRouteError();

  return (
    <div className="error-page">
      <h1>Oops</h1>
      <div className="error-description">
        <p className="error-sorry">Sorry, an unexpected error has occurred.</p>
        <p className="error-reason">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}
