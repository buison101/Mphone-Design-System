import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// project imports
import Loadable from 'components/Loadable';
import Maintenance from 'pages/maintenance/Maintenance';
import MainRoutes from './MainRoutes';
import { BASE_PATH } from 'config';

// ==============================|| ROUTING RENDER ||============================== //
//
// The portal is served from /p/ so the router is told about the prefix, otherwise
// a refresh on a deep link would not resolve.
//
// Three kinds of route live here.
//
// The application, under DashboardLayout.
//
// The catch-all, which is now a not-found page rather than a redirect to the
// dashboard. A silent redirect told anyone who mistyped a URL, or followed a
// link to a page that has since moved, that nothing had gone wrong. It sits
// outside the layout so it renders as its own page, the way the sign-in screen
// does; a reader who is lost is better served by one clear way back than by a
// dashboard they did not ask for.
//
// The preview-only screens: everything under /auth and /maintenance. In
// production the sign-in screen is rendered by SessionGate, the not-found and
// server-error screens are reached by being wrong rather than by navigating, and
// the rest wait on endpoints that do not exist. A build a customer can reach has
// no route to any of them.

const AuthPreview = Loadable(lazy(() => import('pages/auth/AuthPreview')));
const MaintenancePreview = Loadable(lazy(() => import('pages/maintenance/MaintenancePreview')));

const preview = import.meta.env.VITE_PORTAL_PREVIEW === '1';

// errorElement catches what an ErrorBoundary cannot: a loader that threw, and a
// lazy chunk that no longer exists because the build behind it was replaced.
const NotFound = <Maintenance variant="notFound" />;
const ServerError = <Maintenance variant="serverError" />;

const previewRoutes = [
  { path: 'auth/:screen', element: <AuthPreview />, errorElement: ServerError },
  { path: 'maintenance/:variant', element: <MaintenancePreview />, errorElement: ServerError }
];

const router = createBrowserRouter(
  [...(preview ? previewRoutes : []), { ...MainRoutes, errorElement: ServerError }, { path: '*', element: NotFound }],
  { basename: BASE_PATH }
);

export default router;
