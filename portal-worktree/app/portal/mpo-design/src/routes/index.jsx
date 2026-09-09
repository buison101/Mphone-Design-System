import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// project imports
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import ComponentsRoutes from './ComponentsRoutes';
import PromptsRoutes from './PromptsRoutes';
import MphoneRoutes from './MphoneRoutes';
import MphoneUiRoutes from './MphoneUiRoutes';
import Loadable from 'components/Loadable';

import { SimpleLayoutType } from 'config';
import SimpleLayout from 'layout/Simple';

// render - landing page
const PagesLanding = Loadable(lazy(() => import('pages/landing')));

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <SimpleLayout layout={SimpleLayoutType.LANDING} enableElevationScroll />,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboard/analytics" replace />
        },
        {
          path: 'landing',
          element: <PagesLanding />
        }
      ]
    },
    LoginRoutes,
    ComponentsRoutes,
    PromptsRoutes,
    MphoneRoutes,
    MphoneUiRoutes,
    MainRoutes
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME }
);

export default router;
