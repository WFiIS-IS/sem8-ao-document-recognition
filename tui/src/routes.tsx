import { createBrowserRouter, Navigate } from 'react-router-dom';

import { env } from '$env';
import { Error } from './shared/components/error/Error';
import { Layout } from '@/Layout.tsx';
import { Home, LineChart, Package, Users } from 'lucide-react';

export const pathToTitleMap: Map<string, string> = new Map([
  ['/', 'Dashboard'],
  ['/activities', 'Activities'],
  ['/projects', 'Projects'],
  ['/customers', 'Customers']
]);

// use the same as above but as array of elements

export const pathToTitleArray = [
  {
    path: '/',
    title: 'Dashboard',
    icon: <Home />
  },
  {
    path: '/activities',
    title: 'Activities',
    icon: <LineChart />
  },
  {
    path: '/projects',
    title: 'Projects',
    icon: <Package />
  },
  {
    path: '/customers',
    title: 'Customers',
    icon: <Users />
  }
];

export const router = createBrowserRouter(
  [
    {
      path: '/',
      errorElement: <Error />,
      children: [
        {
          path: '/logged-in',
          lazy: () => import('./pages/LoggedIn').then((module) => ({ Component: module.Login }))
        },
        {
          path: '/logout',
          lazy: () => import('./pages/Logout').then((module) => ({ Component: module.Logout }))
        },
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
              path: '/activities',
              lazy: () =>
                import('./pages/activities/Activities.tsx').then((module) => ({
                  Component: module.Activities
                }))
            },
            {
              path: '/projects',
              lazy: () =>
                import('./pages/projects/Projects').then((module) => ({
                  Component: module.Projects
                }))
            },
            {
              path: '/customers',
              lazy: () =>
                import('@/pages/customers/Customers.tsx').then((module) => ({
                  Component: module.Customers
                }))
            }
          ]
        },
        // {
        //   path: '/dashboard',
        //   lazy: () =>
        //     import('./pages/Dashboard').then((module) => ({ Component: module.Dashboard }))
        // },
        {
          path: '*',
          element: <Navigate to="/404" />
        }
      ]
    }
  ],
  { basename: env.PUBLIC_APP_PREFIX }
);
