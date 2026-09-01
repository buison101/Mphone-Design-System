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
import CodeInput from 'components/auth/CodeInput';

// ==============================|| AUTH - CODE VERIFICATION FORM ||============================== //
//
// Six digits from an email, and a way to ask for six more.
//
// The address is shown partly masked. Mantis prints "jone. ****@company.com",
// which hides the part that identifies the mailbox and shows the part that
// identifies the person — backwards. Here the local part keeps its first
// character and the domain is left intact, so a reader can tell which of their
// accounts this is without the screen reading the address out to whoever is
// behind them.
//
// Resend is disabled while its countdown runs. Bước 3 asks for rate limits on
// resend, and a limit the reader cannot see is a button that works until it
// suddenly does not.

export default function CodeVerificationForm({ email, onSubmit, onResend, error, submitting = false, cooldown = 0, length = 6 }) {
  const [code, setCode] = useState('');
  const complete = code.length === length;

  const submit = (event) => {
    event.preventDefault();
    if (submitting || !complete) return;
    onSubmit?.(code);
  };

  return (
    <Stack component="form" onSubmit={submit} sx={{ gap: 2.25 }}>
      <Stack sx={{ gap: 0.75 }}>
        <Typography component="h1" variant="h3">
          <FormattedMessage id="code.title" />
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <FormattedMessage id="code.subtitle" values={{ email: <strong>{email}</strong> }} />
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" role="alert">
          <FormattedMessage id={error} />
        </Alert>
      )}

      <CodeInput length={length} value={code} onChange={setCode} disabled={submitting} />

      <Button type="submit" variant="contained" size="large" disabled={submitting || !complete} fullWidth>
        <FormattedMessage id={submitting ? 'code.submitting' : 'code.submit'} />
      </Button>

      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          <FormattedMessage id="code.noEmail" />
        </Typography>
        <Button size="small" onClick={onResend} disabled={cooldown > 0}>
          <FormattedMessage id={cooldown > 0 ? 'code.resendIn' : 'code.resend'} values={{ seconds: cooldown }} />
        </Button>
      </Stack>
    </Stack>
  );
}

CodeVerificationForm.propTypes = {
  email: PropTypes.string,
  onSubmit: PropTypes.func,
  onResend: PropTypes.func,
  error: PropTypes.string,
  submitting: PropTypes.bool,
  cooldown: PropTypes.number,
  length: PropTypes.number
};
