import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from 'oidc-react';
import { oidcConfig } from './config/oidc.ts';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
