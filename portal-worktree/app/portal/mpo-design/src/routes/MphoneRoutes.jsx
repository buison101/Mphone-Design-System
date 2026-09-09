import { lazy } from 'react';

import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

const MphoneLabDashboard = Loadable(lazy(() => import('mphone-lab/MphoneLabDashboard')));
const MphoneLabAnalytics = Loadable(lazy(() => import('mphone-lab/MphoneLabAnalytics')));
const MphoneLabData = Loadable(lazy(() => import('mphone-lab/MphoneLabData')));
const MphoneLabComponents = Loadable(lazy(() => import('mphone-lab/MphoneLabComponents')));
const MphoneLabSettings = Loadable(lazy(() => import('mphone-lab/MphoneLabSettings')));

const MphoneRoutes = {
  path: '/mphone',
  element: <DashboardLayout />,
  children: [
    { index: true, element: <MphoneLabDashboard /> },
    { path: 'analytics', element: <MphoneLabAnalytics /> },
    { path: 'data', element: <MphoneLabData /> },
    { path: 'components', element: <MphoneLabComponents /> },
    { path: 'settings', element: <MphoneLabSettings /> }
  ]
};

export default MphoneRoutes;
