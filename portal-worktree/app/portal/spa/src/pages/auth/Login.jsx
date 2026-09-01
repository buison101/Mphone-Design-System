import PropTypes from 'prop-types';

// project imports
import MainCard from 'components/MainCard';
import StandaloneLayout from 'components/patterns/StandaloneLayout';
import LoginForm from 'sections/auth/LoginForm';

// ==============================|| PAGE - LOGIN ||============================== //
//
// The signed-out screen, rebuilt on the Mantis auth composition: mark top left,
// one card centred, footer at the bottom.
//
// It holds no state and calls no endpoint. The gate owns the session and passes
// the submit handler in, which is what lets the same screen be reviewed in the
// preview build without a way to sign anybody in.

export default function Login({ onSubmit, error, submitting, banner }) {
  return (
    <StandaloneLayout banner={banner}>
      <MainCard contentSX={{ p: { xs: 3, sm: 4 } }}>
        <LoginForm onSubmit={onSubmit} error={error} submitting={submitting} />
      </MainCard>
    </StandaloneLayout>
  );
}

Login.propTypes = { onSubmit: PropTypes.func, error: PropTypes.string, submitting: PropTypes.bool, banner: PropTypes.node };
