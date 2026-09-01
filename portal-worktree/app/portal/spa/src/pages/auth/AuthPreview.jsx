import { useEffect, useState } from 'react';

// third-party
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

// project imports
import Login from './Login';
import Activate from './Activate';
import ForgotPassword from './ForgotPassword';
import CheckMail from './CheckMail';
import ResetPassword from './ResetPassword';
import VerifyEmail from './VerifyEmail';
import CodeVerification from './CodeVerification';
import AuthPreviewBanner from 'sections/auth/AuthPreviewBanner';
import useResendCooldown from 'sections/auth/useResendCooldown';
import maskEmail from 'sections/auth/maskEmail';

// ==============================|| PAGE - AUTH PREVIEW ||============================== //
//
// One route behind every signed-out screen, registered only when
// VITE_PORTAL_PREVIEW is set.
//
// These screens cannot be reached in the preview any other way: preview/serve.mjs
// stubs an authorised session, so the gate that renders the real sign-in never
// fires, and the rest arrive from links in emails nothing here can send. A
// production build has no route to any of them — the real sign-in is rendered by
// SessionGate, and the others wait on the endpoints Bước 3 will add.
//
// Every handler below fails or waits on purpose. The success path of a sign-in
// navigates away and the success path of a reset ends somewhere else entirely,
// so the half of each screen worth reviewing is the half that stays on screen.
// The one flow wired for real is Quên mật khẩu -> Kiểm tra email, because that
// hand-off is the part of the design a reviewer should be able to walk.

const SCREENS = ['login', 'activate', 'forgot-password', 'check-mail', 'reset-password', 'verify-email', 'code'];

const SAMPLE_EMAIL = 'lan.nguyen@thaison.vn';
const PAUSE = 700;

export default function AuthPreview() {
  const { screen } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();

  const [state, setState] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(undefined);
  const resend = useResendCooldown(45);

  // A different screen is a different set of states, and carrying the previous
  // screen's selection into it would leave the toggle showing a state this
  // screen does not have.
  useEffect(() => {
    setState('');
    setSubmitting(false);
    setError(undefined);
  }, [screen]);

  if (!SCREENS.includes(screen)) return <Navigate to="/auth/login" replace />;

  const label = (id) => intl.formatMessage({ id });

  const fail = (messageId) => {
    setSubmitting(true);
    setError(undefined);
    setTimeout(() => {
      setSubmitting(false);
      setError(messageId);
    }, PAUSE);
  };

  const banner = (states = [], fallback = '') => <AuthPreviewBanner states={states} value={state || fallback} onChange={setState} />;

  const formOrExpired = [
    { value: 'form', label: label('authPreview.state.form') },
    { value: 'expired', label: label('authPreview.state.expired') }
  ];

  switch (screen) {
    case 'activate':
      return (
        <Activate
          state={state || 'form'}
          email={SAMPLE_EMAIL}
          onSubmit={() => fail('activate.error.expired')}
          error={error}
          submitting={submitting}
          banner={banner(formOrExpired, 'form')}
        />
      );

    case 'forgot-password':
      return (
        <ForgotPassword
          onSubmit={() => {
            setSubmitting(true);
            // the one real hand-off in the preview: the form always lands on the
            // confirmation, which is what the no-enumeration rule requires
            setTimeout(() => navigate('/auth/check-mail'), PAUSE);
          }}
          error={error}
          submitting={submitting}
          banner={banner()}
        />
      );

    case 'check-mail':
      return <CheckMail email={SAMPLE_EMAIL} onResend={resend.start} cooldown={resend.remaining} banner={banner()} />;

    case 'reset-password':
      return (
        <ResetPassword
          state={state || 'form'}
          onSubmit={() => fail('reset.error.unavailable')}
          error={error}
          submitting={submitting}
          banner={banner(formOrExpired, 'form')}
        />
      );

    case 'verify-email':
      return (
        <VerifyEmail
          state={state || 'pending'}
          onResend={resend.start}
          cooldown={resend.remaining}
          banner={banner(
            [
              { value: 'pending', label: label('authPreview.state.pending') },
              { value: 'verified', label: label('authPreview.state.verified') },
              { value: 'expired', label: label('authPreview.state.expired') }
            ],
            'pending'
          )}
        />
      );

    case 'code':
      return (
        <CodeVerification
          email={maskEmail(SAMPLE_EMAIL)}
          onSubmit={() => fail('code.error.invalid')}
          onResend={resend.start}
          error={error}
          submitting={submitting}
          cooldown={resend.remaining}
          banner={banner()}
        />
      );

    default:
      return <Login onSubmit={() => fail('login.error.invalid')} error={error} submitting={submitting} banner={banner()} />;
  }
}
