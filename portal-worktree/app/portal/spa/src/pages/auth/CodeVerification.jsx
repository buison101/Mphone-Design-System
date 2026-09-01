import PropTypes from 'prop-types';

// project imports
import MainCard from 'components/MainCard';
import StandaloneLayout from 'components/patterns/StandaloneLayout';
import CodeVerificationForm from 'sections/auth/CodeVerificationForm';

// ==============================|| PAGE - CODE VERIFICATION ||============================== //

export default function CodeVerification({ email, onSubmit, onResend, error, submitting, cooldown, banner }) {
  return (
    <StandaloneLayout banner={banner}>
      <MainCard contentSX={{ p: { xs: 3, sm: 4 } }}>
        <CodeVerificationForm
          email={email}
          onSubmit={onSubmit}
          onResend={onResend}
          error={error}
          submitting={submitting}
          cooldown={cooldown}
        />
      </MainCard>
    </StandaloneLayout>
  );
}

CodeVerification.propTypes = {
  email: PropTypes.string,
  onSubmit: PropTypes.func,
  onResend: PropTypes.func,
  error: PropTypes.string,
  submitting: PropTypes.bool,
  cooldown: PropTypes.number,
  banner: PropTypes.node
};
