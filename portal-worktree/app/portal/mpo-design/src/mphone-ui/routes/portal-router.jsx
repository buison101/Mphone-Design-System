import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';

import DashboardLayout from 'layout/Dashboard';
import DashboardPage from '../pages/DashboardPage';
import ActiveCallsPage from '../pages/ActiveCallsPage';
import MissedCallsPage from '../pages/MissedCallsPage';
import PortalRouteError from '../components/PortalRouteError';
import PortalSessionGate from '../components/PortalSessionGate';
import { PORTAL_BASE_PATH } from '../config';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <DashboardLayout unguarded />,
      errorElement: <PortalRouteError />,
      children: [
        {
          element: (
            <PortalSessionGate>
              <Outlet />
            </PortalSessionGate>
          ),
          children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: 'dashboard', element: <DashboardPage /> },
            { path: 'calls/active', element: <ActiveCallsPage /> },
            { path: 'missed-calls', element: <MissedCallsPage /> },
            { path: '*', element: <Navigate to="/dashboard" replace /> }
          ]
        }
      ]
    }
  ],
  { basename: PORTAL_BASE_PATH }
);

export default router;
