import { lazy } from 'react';

import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

const MphoneLabPage = Loadable(lazy(() => import('mphone-lab/MphoneLabPage')));

const MphoneRoutes = {
  path: '/mphone',
  element: <DashboardLayout />,
  children: [
    { index: true, element: <MphoneLabPage surface="overview" /> },
    { path: 'calls', element: <MphoneLabPage surface="calls" /> },
    { path: 'contacts', element: <MphoneLabPage surface="contacts" /> },
    { path: 'webphone', element: <MphoneLabPage surface="webphone" /> },
    { path: 'app-phone', element: <MphoneLabPage surface="appPhone" /> },
    { path: 'analytics', element: <MphoneLabPage surface="analytics" /> },
    { path: 'design-system', element: <MphoneLabPage surface="designSystem" /> }
  ]
};

export default MphoneRoutes;
