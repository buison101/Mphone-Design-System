import PropTypes from 'prop-types';

// material-ui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

// third-party
import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import StandaloneLayout from 'components/patterns/StandaloneLayout';
import SetPasswordForm from 'sections/auth/SetPasswordForm';
import ResultCard from 'components/patterns/ResultCard';

// assets
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';

// ==============================|| PAGE - ACTIVATE ACCOUNT ||============================== //
//
// This is where Mantis puts Register, and it is deliberately not that.
//
// On this platform an Identity is created by an operator, who then assigns it an
// Extension — that is the whole model in PHASE_2_CUSTOMER_ASSIGNMENT. Somebody
// who signed themselves up would land in a portal with no phone, no customer and
// nothing to look at, so the screen at this address is the second half of the
// operator's action instead: the invited person arrives from an emailed link and
// sets their first password.
//
// The address is shown and cannot be edited. It is what the invitation was sent
// to and what the token is bound to; an editable field here would suggest the
// reader can activate a different account than the one they were invited to.
//
// Mantis also collects first name, last name and company. None of those are
// asked for. The operator already owns customer and membership data, and a
// second place to type a company name is a second version of it that nobody
// reconciles.
//
// No terms-and-conditions line either: the portal has no terms page and no
// privacy page to link to, and a checkbox agreeing to documents that do not
// exist is worth less than nothing.

export default function Activate({ state = 'form', email, onSubmit, error, submitting, banner }) {
  if (state === 'expired') {
    return (
      <StandaloneLayout banner={banner}>
        <ResultCard
          icon={ClockCircleOutlined}
          tone="warning"
          title={<FormattedMessage id="activate.expired.title" />}
          description={<FormattedMessage id="activate.expired.description" />}
        >
          <Button component={RouterLink} to="/auth/login" variant="contained" fullWidth>
            <FormattedMessage id="checkMail.backToLogin" />
          </Button>
        </ResultCard>
      </StandaloneLayout>
    );
  }

  return (
    <StandaloneLayout banner={banner}>
      <MainCard contentSX={{ p: { xs: 3, sm: 4 } }}>
        <SetPasswordForm
          titleId="activate.title"
          subtitleId="activate.subtitle"
          note={
            <Alert severity="info" icon={false}>
              <FormattedMessage id="activate.invitedAs" values={{ email: <strong>{email}</strong> }} />
            </Alert>
          }
          submitId="activate.submit"
          submittingId="activate.submitting"
          onSubmit={onSubmit}
          error={error}
          submitting={submitting}
        />
      </MainCard>
    </StandaloneLayout>
  );
}

Activate.propTypes = {
  state: PropTypes.oneOf(['form', 'expired']),
  email: PropTypes.string,
  onSubmit: PropTypes.func,
  error: PropTypes.string,
  submitting: PropTypes.bool,
  banner: PropTypes.node
};
