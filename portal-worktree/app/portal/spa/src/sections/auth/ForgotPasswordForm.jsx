import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// ==============================|| AUTH - FORGOT PASSWORD FORM ||============================== //
//
// One field, one button, and deliberately no way to fail.
//
// Bước 3 of the identity plan states the rule this screen exists to obey:
// "Phản hồi recovery không tiết lộ email có tồn tại hay không." So there is no
// "we could not find that account" message here, and there cannot be one later
// either — submitting always goes to the same confirmation, worded so that it
// is true whether or not the address belongs to anyone. An error state on this
// screen would be an account-enumeration oracle with a friendly tone.
//
// The only failure it can show is one that says nothing about the address: the
// service being unreachable, or the reader being rate limited.
//
// Mantis puts "Do not forgot to check SPAM box." under the field, before
// anything has been sent. Nobody can check a spam folder for a message that
// does not exist yet, so that line moved to the screen after this one.

export default function ForgotPasswordForm({ onSubmit, error, submitting = false }) {
  const [email, setEmail] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (submitting) return;
    onSubmit?.(email);
  };

  return (
    <Stack component="form" onSubmit={submit} sx={{ gap: 2.25 }}>
      <Stack direction="row" sx={{ gap: 2, alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography component="h1" variant="h3">
          <FormattedMessage id="forgot.title" />
        </Typography>
        <Link component={RouterLink} to="/auth/login" variant="body2">
          <FormattedMessage id="forgot.backToLogin" />
        </Link>
      </Stack>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        <FormattedMessage id="forgot.subtitle" />
      </Typography>

      {error && (
        <Typography variant="body2" role="alert" sx={{ color: 'error.main' }}>
          <FormattedMessage id={error} />
        </Typography>
      )}

      <TextField
        type="email"
        name="email"
        autoComplete="username"
        autoFocus
        label={<FormattedMessage id="login.email" />}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        fullWidth
      />

      <Button type="submit" variant="contained" size="large" disabled={submitting} fullWidth>
        <FormattedMessage id={submitting ? 'forgot.submitting' : 'forgot.submit'} />
      </Button>
    </Stack>
  );
}

ForgotPasswordForm.propTypes = { onSubmit: PropTypes.func, error: PropTypes.string, submitting: PropTypes.bool };
