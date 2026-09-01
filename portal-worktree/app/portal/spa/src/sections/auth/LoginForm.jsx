import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import { Link as RouterLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// project imports
import PasswordField from 'components/auth/PasswordField';

// ==============================|| AUTH - LOGIN FORM ||============================== //
//
// Email, password, one button.
//
// Three controls from the Mantis original are not here, and each is missing for
// the same reason: `app/portal/service/identity.php` answers exactly two actions,
// `login` and `logout`. Nothing behind it can register an account, reset a
// password or extend a session.
//
//   - "Don't have an account?" — an extension is issued by whoever runs the
//     tổng đài. Nobody signs themselves up for a phone system, so the link would
//     be wrong even if an endpoint existed.
//   - "Forgot Password?" — the recovery flow is designed (Bước 3 of the identity
//     plan) and its screens exist under /auth, but identity.php proxies no
//     recovery action yet. The link is here because that flow is the portal's
//     committed answer, and the screen it opens says plainly that it is waiting
//     on the server rather than pretending to send anything.
//   - "Keep me sign in" — session lifetime is decided by the PHP session, and a
//     checkbox that silently does nothing is a promise about someone's security.
//
// The reveal toggle is here because it needs no server at all, and it is the one
// control that helps most: this password is typed on a phone keyboard often
// enough that "wrong password" is usually a typo the reader cannot see.

export default function LoginForm({ onSubmit, error, submitting = false, autoFocus = true }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (submitting) return;
    onSubmit?.(email, password);
  };

  return (
    <Stack component="form" onSubmit={submit} sx={{ gap: 2.25 }}>
      <Stack sx={{ gap: 0.75 }}>
        <Typography component="h1" variant="h3">
          <FormattedMessage id="login.title" />
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <FormattedMessage id="login.subtitle" />
        </Typography>
      </Stack>

      {/* the alert is rendered above the fields and inside the form, so a screen
          reader moving through the form meets the reason before the inputs it
          refers to */}
      {error && (
        <Alert severity="error" role="alert">
          <FormattedMessage id={error} />
        </Alert>
      )}

      <TextField
        type="email"
        name="email"
        autoComplete="username"
        autoFocus={autoFocus}
        label={<FormattedMessage id="login.email" />}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        fullWidth
      />

      <PasswordField
        name="password"
        autoComplete="current-password"
        label={<FormattedMessage id="login.password" />}
        value={password}
        onChange={setPassword}
        required
      />

      <Button type="submit" variant="contained" size="large" disabled={submitting} fullWidth>
        <FormattedMessage id={submitting ? 'login.submitting' : 'login.submit'} />
      </Button>

      <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
        <Link component={RouterLink} to="/auth/forgot-password" variant="caption">
          <FormattedMessage id="login.forgot" />
        </Link>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          <FormattedMessage id="login.forgotHelp" />
        </Typography>
      </Stack>
    </Stack>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
  error: PropTypes.string,
  submitting: PropTypes.bool,
  autoFocus: PropTypes.bool
};
