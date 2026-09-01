import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

// third-party
import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// project imports
import StandaloneLayout from 'components/patterns/StandaloneLayout';
import ResultCard from 'components/patterns/ResultCard';
import { APP_DEFAULT_PATH } from 'config';

// assets
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import SafetyCertificateOutlined from '@ant-design/icons/SafetyCertificateOutlined';

// ==============================|| PAGE - VERIFY EMAIL ||============================== //
//
// The page the link in a verification email opens. It has no form: the token is
// in the URL, the browser hands it over on arrival, and the reader's only job is
// to find out whether it worked.
//
// Three states, and the pending one is not a formality. The token is checked
// against an upstream identity service over the network, so there is a real
// moment where the answer is not known yet, and a screen that renders "verified"
// optimistically would be lying for as long as that takes.
//
// The expired state offers a new link rather than an apology. Bước 3 makes these
// tokens single-use and short-lived, so arriving here too late is ordinary — the
// second time an old email is opened, it is the only outcome.

const VIEW = {
  pending: { icon: SafetyCertificateOutlined, tone: 'primary' },
  verified: { icon: CheckCircleOutlined, tone: 'success' },
  expired: { icon: ClockCircleOutlined, tone: 'warning' }
};

export default function VerifyEmail({ state = 'pending', onResend, cooldown = 0, banner }) {
  const view = VIEW[state] ?? VIEW.pending;

  return (
    <StandaloneLayout banner={banner}>
      <ResultCard
        icon={view.icon}
        tone={view.tone}
        title={<FormattedMessage id={`verify.${state}.title`} />}
        description={<FormattedMessage id={`verify.${state}.description`} />}
      >
        {state === 'pending' && <CircularProgress size={24} aria-hidden="true" />}

        {state === 'verified' && (
          <Button component={RouterLink} to={APP_DEFAULT_PATH} variant="contained" fullWidth>
            <FormattedMessage id="verify.verified.action" />
          </Button>
        )}

        {state === 'expired' && (
          <>
            <Button variant="contained" onClick={onResend} disabled={cooldown > 0} fullWidth>
              <FormattedMessage id={cooldown > 0 ? 'code.resendIn' : 'verify.expired.action'} values={{ seconds: cooldown }} />
            </Button>
            <Button component={RouterLink} to="/auth/login" variant="text" fullWidth>
              <FormattedMessage id="checkMail.backToLogin" />
            </Button>
          </>
        )}
      </ResultCard>
    </StandaloneLayout>
  );
}

VerifyEmail.propTypes = {
  state: PropTypes.oneOf(['pending', 'verified', 'expired']),
  onResend: PropTypes.func,
  cooldown: PropTypes.number,
  banner: PropTypes.node
};
