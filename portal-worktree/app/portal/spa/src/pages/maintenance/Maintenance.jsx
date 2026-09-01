import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';

// third-party
import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// project imports
import StandaloneLayout from 'components/patterns/StandaloneLayout';
import ResultCard from 'components/patterns/ResultCard';
import { APP_DEFAULT_PATH } from 'config';

// assets
import ToolOutlined from '@ant-design/icons/ToolOutlined';
import RocketOutlined from '@ant-design/icons/RocketOutlined';

// ==============================|| PAGE - MAINTENANCE ||============================== //
//
// Four screens, one file, because they differ only in a mark, three strings and
// which way out they offer.
//
// Three of the four are wired to something real, which is unusual for a
// reconstruction here:
//
//   notFound      is the router's catch-all. It used to be a silent redirect to
//                 the dashboard, which told a reader who mistyped a URL that
//                 nothing had gone wrong.
//   serverError   is the router's errorElement and the render-error fallback, so
//                 a thrown component or a stale lazy chunk after a deploy lands
//                 somewhere deliberate instead of on a white page.
//   underMaintenance is what SessionGate shows when the session endpoint answers
//                 503. Nginx returns that on its own when PHP-FPM is down, so it
//                 needs nothing new on the server — and "check your connection"
//                 is the wrong advice to give someone whose connection is fine.
//
//   comingSoon    is not wired to anything and has no route in production. It is
//                 the frame for a feature that ships behind the navigation that
//                 announces it.
//
// Mantis's Coming Soon carries a countdown and an email capture. Both are gone.
// There is no launch date, and a clock counting down to an invented one is the
// same class of thing as an invoice showing invented money; there is no endpoint
// behind the capture either, and taking an address that goes nowhere is worse
// than not asking for it.
//
// serverError offers reload rather than a link home. If the fault is a stale
// bundle, a route change inside the same broken bundle changes nothing.

const VIEW = {
  notFound: { mark: '404', tone: 'primary' },
  serverError: { mark: '500', tone: 'error' },
  underMaintenance: { icon: ToolOutlined, tone: 'warning' },
  comingSoon: { icon: RocketOutlined, tone: 'info' }
};

export default function Maintenance({ variant = 'notFound', onRetry, banner }) {
  const view = VIEW[variant] ?? VIEW.notFound;

  return (
    <StandaloneLayout banner={banner}>
      <ResultCard
        mark={view.mark}
        icon={view.icon}
        tone={view.tone}
        title={<FormattedMessage id={`maintenance.${variant}.title`} />}
        description={<FormattedMessage id={`maintenance.${variant}.description`} />}
      >
        {variant === 'serverError' || variant === 'underMaintenance' ? (
          <Button variant="contained" onClick={onRetry ?? (() => window.location.reload())} fullWidth>
            <FormattedMessage id="maintenance.retry" />
          </Button>
        ) : null}

        {variant !== 'underMaintenance' && (
          <Button component={RouterLink} to={APP_DEFAULT_PATH} variant={variant === 'serverError' ? 'text' : 'contained'} fullWidth>
            <FormattedMessage id="maintenance.backHome" />
          </Button>
        )}
      </ResultCard>
    </StandaloneLayout>
  );
}

Maintenance.propTypes = {
  variant: PropTypes.oneOf(['notFound', 'serverError', 'underMaintenance', 'comingSoon']),
  onRetry: PropTypes.func,
  banner: PropTypes.node
};
