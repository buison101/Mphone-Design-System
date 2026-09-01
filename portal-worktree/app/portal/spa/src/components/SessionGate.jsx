import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage } from 'react-intl';

// project imports
import Loader from 'components/Loader';
import Login from 'pages/auth/Login';
import Maintenance from 'pages/maintenance/Maintenance';
import useSession from 'hooks/useSession';
import { loginErrorMessage, RECOVERABLE_LOGIN_ERRORS } from 'sections/auth/loginErrors';
import { ADMIN_URL } from 'config';

// ==============================|| SESSION GATE ||============================== //
//
// Nothing is routed until the server has confirmed who is signed in. An
// unauthorised session renders the sign-in screen in place of the application;
// refused and unreachable are the other two ways in.

function Message({ title, detail, action }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Stack sx={{ gap: 1.5, maxWidth: 420, textAlign: 'center', alignItems: 'center' }}>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {detail}
        </Typography>
        {action}
      </Stack>
    </Box>
  );
}

Message.propTypes = { title: PropTypes.node, detail: PropTypes.node, action: PropTypes.node };

// The container: it owns the attempt, the screen owns none of it.
function IdentityLogin() {
  const { login, reload } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(undefined);

  const submit = async (email, password) => {
    setSubmitting(true);
    setError(undefined);
    try {
      const result = await login(email, password);
      if (result.ok) return;

      setError(loginErrorMessage(result.error));

      // A stale login token is the one failure the browser can clear by itself.
      // Re-reading the session endpoint mints a fresh one, so by the time the
      // reader has finished reading "please try again", trying again works.
      if (RECOVERABLE_LOGIN_ERRORS.includes(result.error)) await reload();
    } catch {
      setError(loginErrorMessage('unavailable'));
    } finally {
      setSubmitting(false);
    }
  };

  return <Login onSubmit={submit} error={error} submitting={submitting} />;
}

export default function SessionGate({ children }) {
  const { session, loading, error, reload } = useSession();

  if (loading) return <Loader />;

  if (error === 'unauthorized') return <IdentityLogin />;

  // Planned downtime reads differently from an unreachable server, and the
  // advice that follows from each is different too.
  if (error === 'maintenance') return <Maintenance variant="underMaintenance" onRetry={reload} />;

  if (error === 'forbidden') {
    return (
      <Message
        title={<FormattedMessage id="gate.forbidden.title" />}
        detail={<FormattedMessage id="gate.forbidden.detail" />}
        action={
          <Button variant="contained" href={ADMIN_URL}>
            <FormattedMessage id="gate.forbidden.action" />
          </Button>
        }
      />
    );
  }

  if (error || !session) {
    return (
      <Message
        title={<FormattedMessage id="gate.unreachable.title" />}
        detail={<FormattedMessage id="gate.unreachable.detail" />}
        action={
          <Button variant="contained" onClick={reload}>
            <FormattedMessage id="gate.unreachable.action" />
          </Button>
        }
      />
    );
  }

  return children;
}

SessionGate.propTypes = { children: PropTypes.node };
