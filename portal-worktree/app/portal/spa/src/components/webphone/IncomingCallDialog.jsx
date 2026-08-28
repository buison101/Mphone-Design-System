import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import Avatar from 'components/@extended/Avatar';

// assets
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';

// ==============================|| WEBPHONE - INCOMING CALL ||============================== //
//
// A ringing call interrupts whatever page the reader is on, because that is what
// a ringing phone does and a notification they might miss is not good enough.
//
// The dialog cannot be dismissed by clicking away or pressing Escape. Both would
// leave the call ringing with its only controls gone; the two ways out are
// answer and decline.
//
// Decline sits left and outlined, answer sits right and filled green. Reversing
// them is how someone hangs up on a customer by muscle memory.

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export default function IncomingCallDialog({ call, onAnswer, onReject }) {
  const intl = useIntl();
  const open = Boolean(call);

  return (
    <Dialog open={open} disableEscapeKeyDown maxWidth="xs" fullWidth aria-labelledby="incoming-call-title">
      <DialogContent sx={{ p: 4 }}>
        <Stack sx={{ alignItems: 'center', gap: 2.5, textAlign: 'center' }}>
          <Avatar color="success" size="xl">
            {initials(call?.name || call?.number || '')}
          </Avatar>

          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              <FormattedMessage id="webphone.incoming" />
            </Typography>
            <Typography id="incoming-call-title" variant="h4">
              {call?.name || call?.number}
            </Typography>
            {call?.name && call?.number && (
              <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                {call.number}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" sx={{ gap: 1.5, width: '100%' }}>
            <Button
              fullWidth
              size="large"
              variant="outlined"
              color="error"
              onClick={onReject}
              aria-label={intl.formatMessage({ id: 'webphone.decline' })}
            >
              <FormattedMessage id="webphone.decline" />
            </Button>
            <Button
              fullWidth
              size="large"
              variant="contained"
              color="success"
              startIcon={<PhoneOutlined />}
              onClick={onAnswer}
              aria-label={intl.formatMessage({ id: 'webphone.answer' })}
            >
              <FormattedMessage id="webphone.answer" />
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

IncomingCallDialog.propTypes = {
  call: PropTypes.object,
  onAnswer: PropTypes.func,
  onReject: PropTypes.func
};
