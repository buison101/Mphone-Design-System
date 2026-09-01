import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// third-party
import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// project imports
import StandaloneLayout from 'components/patterns/StandaloneLayout';
import ResultCard from 'components/patterns/ResultCard';

// assets
import MailOutlined from '@ant-design/icons/MailOutlined';

// ==============================|| PAGE - CHECK MAIL ||============================== //
//
// Where the recovery form always lands, whether or not the address belongs to
// anyone. The wording carries that: "if this address belongs to an Mphone
// account" is true in both cases, and it is the only phrasing that keeps this
// screen from being a way to find out which addresses are registered.
//
// For the same reason the address is echoed but never confirmed. Printing it
// back proves nothing except that the reader typed it, which is exactly the
// amount this screen is allowed to know.
//
// The spam-folder line lives here rather than on the form before it, where
// Mantis puts it. A reader cannot check a spam folder for a message that has
// not been sent.

export default function CheckMail({ email, onResend, cooldown = 0, banner }) {
  return (
    <StandaloneLayout banner={banner}>
      <ResultCard
        icon={MailOutlined}
        tone="primary"
        title={<FormattedMessage id="checkMail.title" />}
        description={<FormattedMessage id="checkMail.description" values={{ email: <strong>{email}</strong> }} />}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          <FormattedMessage id="checkMail.spam" />
        </Typography>

        <Button variant="outlined" onClick={onResend} disabled={cooldown > 0} fullWidth>
          <FormattedMessage id={cooldown > 0 ? 'code.resendIn' : 'checkMail.resend'} values={{ seconds: cooldown }} />
        </Button>

        <Button component={RouterLink} to="/auth/login" variant="contained" fullWidth>
          <FormattedMessage id="checkMail.backToLogin" />
        </Button>
      </ResultCard>
    </StandaloneLayout>
  );
}

CheckMail.propTypes = { email: PropTypes.string, onResend: PropTypes.func, cooldown: PropTypes.number, banner: PropTypes.node };
