import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage } from 'react-intl';

// project imports
import PasswordField from 'components/auth/PasswordField';
import PasswordStrengthMeter from 'components/auth/PasswordStrengthMeter';
import PasswordRules, { passwordMeetsRules } from 'components/auth/PasswordRules';

// ==============================|| AUTH - SET PASSWORD FORM ||============================== //
//
// The same form serves resetting a forgotten password and setting the first one
// from an invitation. The two differ in how the reader arrived and what the
// heading says, not in what they do, so they share this.
//
// The confirmation mismatch is reported under the second field rather than as an
// alert at the top. It is the one error on these screens the reader caused half
// a second ago, at a field still under their caret; sending them to the top of
// the card to read about it is a trip for nothing.
//
// Submit stays disabled until the rules pass and the two fields agree. That is a
// convenience, not the check: PasswordRules and the server both hold the real
// rule, and the list above the button says what is still missing so the disabled
// button is never a mystery.
//
// The SIP note is not filler. A customer password and an extension's SIP
// password are different secrets on this platform, and Bước 3 states that
// changing one must not change the other. Someone resetting their password
// because a desk phone stopped registering needs to know this screen is not
// the fix.

export default function SetPasswordForm({ titleId, subtitleId, note, submitId, submittingId, onSubmit, error, submitting = false }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState(false);

  const mismatch = touched && confirm.length > 0 && password !== confirm;
  const ready = passwordMeetsRules(password) && password === confirm;

  const submit = (event) => {
    event.preventDefault();
    if (submitting || !ready) return;
    onSubmit?.(password);
  };

  return (
    <Stack component="form" onSubmit={submit} sx={{ gap: 2.25 }}>
      <Stack sx={{ gap: 0.75 }}>
        <Typography component="h1" variant="h3">
          <FormattedMessage id={titleId} />
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <FormattedMessage id={subtitleId} />
        </Typography>
      </Stack>

      {note}

      {error && (
        <Alert severity="error" role="alert">
          <FormattedMessage id={error} />
        </Alert>
      )}

      <Stack sx={{ gap: 1.25 }}>
        <PasswordField
          name="password"
          autoComplete="new-password"
          autoFocus
          label={<FormattedMessage id="password.new" />}
          value={password}
          onChange={setPassword}
          required
        />
        <PasswordStrengthMeter value={password} />
      </Stack>

      <PasswordField
        name="confirm"
        autoComplete="new-password"
        label={<FormattedMessage id="password.confirm" />}
        value={confirm}
        onChange={(next) => {
          setConfirm(next);
          setTouched(true);
        }}
        error={mismatch}
        helperText={mismatch ? <FormattedMessage id="password.mismatch" /> : undefined}
        required
      />

      <PasswordRules value={password} />

      <Button type="submit" variant="contained" size="large" disabled={submitting || !ready} fullWidth>
        <FormattedMessage id={submitting ? submittingId : submitId} />
      </Button>

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        <FormattedMessage id="password.sipNote" />
      </Typography>
    </Stack>
  );
}

SetPasswordForm.propTypes = {
  titleId: PropTypes.string,
  subtitleId: PropTypes.string,
  note: PropTypes.node,
  submitId: PropTypes.string,
  submittingId: PropTypes.string,
  onSubmit: PropTypes.func,
  error: PropTypes.string,
  submitting: PropTypes.bool
};
