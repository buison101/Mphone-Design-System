// third-party
import { Navigate, useParams } from 'react-router-dom';

// project imports
import Maintenance from './Maintenance';
import AuthPreviewBanner from 'sections/auth/AuthPreviewBanner';

// ==============================|| PAGE - MAINTENANCE PREVIEW ||============================== //
//
// Registered only when VITE_PORTAL_PREVIEW is set, so the four screens can be
// looked at without breaking something first.
//
// Three of them do have a production path — the router's catch-all, the error
// boundary, and a 503 from the session endpoint — but none of those is a route,
// and none can be reached on purpose. The fourth has no path at all yet.

const VARIANTS = {
  404: 'notFound',
  500: 'serverError',
  'under-construction': 'underMaintenance',
  'coming-soon': 'comingSoon'
};

export default function MaintenancePreview() {
  const { variant } = useParams();
  const resolved = VARIANTS[variant];

  if (!resolved) return <Navigate to="/maintenance/404" replace />;

  return <Maintenance variant={resolved} banner={<AuthPreviewBanner />} onRetry={() => {}} />;
}
