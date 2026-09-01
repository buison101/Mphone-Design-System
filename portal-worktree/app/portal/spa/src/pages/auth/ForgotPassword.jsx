import PropTypes from 'prop-types';

// project imports
import MainCard from 'components/MainCard';
import StandaloneLayout from 'components/patterns/StandaloneLayout';
import ForgotPasswordForm from 'sections/auth/ForgotPasswordForm';

// ==============================|| PAGE - FORGOT PASSWORD ||============================== //

export default function ForgotPassword({ onSubmit, error, submitting, banner }) {
  return (
    <StandaloneLayout banner={banner}>
      <MainCard contentSX={{ p: { xs: 3, sm: 4 } }}>
        <ForgotPasswordForm onSubmit={onSubmit} error={error} submitting={submitting} />
      </MainCard>
    </StandaloneLayout>
  );
}

ForgotPassword.propTypes = { onSubmit: PropTypes.func, error: PropTypes.string, submitting: PropTypes.bool, banner: PropTypes.node };
