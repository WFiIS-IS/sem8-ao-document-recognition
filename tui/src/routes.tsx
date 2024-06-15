import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Error } from './shared/components/error/Error';
import { Layout } from '@/Layout.tsx';
import { Home, UserRoundPlus } from 'lucide-react';

// use the same as above but as array of elements

export const pathToTitleArray = [
  {
    path: '/',
    title: 'Dashboard',
    icon: <Home />
  },
  {
    path: '/add_person',
    title: 'Add Person',
    icon: <UserRoundPlus />
  }
];

export const router = createBrowserRouter(
  [
    {
      path: '/',
      errorElement: <Error />,
      children: [
        {
          path: '/404',
          lazy: () => import('./pages/NotFound').then((module) => ({ Component: module.NotFound }))
        },
        {
          path: '/',
          element: <Layout />,
          children: [
            {
              path: '/',
              lazy: () =>
                import('./pages/Dashboard').then((module) => ({ Component: module.Dashboard }))
            },
            {
              path: '/add_person',
              lazy: () =>
                import('./pages/AddPerson').then((module) => ({ Component: module.AddPerson }))
            },
            {
              path: '/person/:id',
              lazy: () =>
                import('./pages/PersonInfo').then((module) => ({ Component: module.PersonInfo }))
            }
          ]
        },
        {
          path: '*',
          element: <Navigate to="/404" />
        }
      ]
    }
  ],
  { basename: '/' }
);
