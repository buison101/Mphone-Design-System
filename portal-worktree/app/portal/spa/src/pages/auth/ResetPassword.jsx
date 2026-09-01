import PropTypes from 'prop-types';

// material-ui
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

// ==============================|| PAGE - RESET PASSWORD ||============================== //
//
// Reached from a link in an email, which means it is reached with a token that
// may already be spent or out of date. Bước 3 requires that token to be
// single-use and short-lived, so the dead-link state is not an edge case here —
// it is what this screen shows every second time somebody opens an old email.
//
// Mantis has no such state; its reset screen is only ever the form. Adding it
// is the difference between a reader who requests a new link and one who types
// a new password twice and is told nothing.

export default function ResetPassword({ state = 'form', onSubmit, error, submitting, banner }) {
  if (state === 'expired') {
    return (
      <StandaloneLayout banner={banner}>
        <ResultCard
          icon={ClockCircleOutlined}
          tone="warning"
          title={<FormattedMessage id="reset.expired.title" />}
          description={<FormattedMessage id="reset.expired.description" />}
        >
          <Button component={RouterLink} to="/auth/forgot-password" variant="contained" fullWidth>
            <FormattedMessage id="reset.expired.action" />
          </Button>
          <Button component={RouterLink} to="/auth/login" variant="text" fullWidth>
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
          titleId="reset.title"
          subtitleId="reset.subtitle"
          submitId="reset.submit"
          submittingId="reset.submitting"
          onSubmit={onSubmit}
          error={error}
          submitting={submitting}
        />
      </MainCard>
    </StandaloneLayout>
  );
}

ResetPassword.propTypes = {
  state: PropTypes.oneOf(['form', 'expired']),
  onSubmit: PropTypes.func,
  error: PropTypes.string,
  submitting: PropTypes.bool,
  banner: PropTypes.node
};
