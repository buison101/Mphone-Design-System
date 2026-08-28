import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import DialPad from 'components/webphone/DialPad';

// ==============================|| APP PHONE - DIALER ||============================== //
//
// The keypad fills the screen because it is the only thing on it. The app's own
// audit has the pad as a bottom sheet over a list; that costs a tap before every
// manual call, and manual dialling is the one case where the reader has already
// decided what they want.
//
// As digits arrive the directory is matched and the name appears above the pad.
// It is a hint, not a selection — the call still goes to the digits typed, which
// is what someone dialling an external number needs.

export default function DialerScreen({ directory = [], onDial }) {
  const intl = useIntl();
  const [number, setNumber] = useState('');

  const match = number.length >= 2 ? directory.find((row) => String(row.extension).startsWith(number)) : null;

  return (
    <Stack sx={{ flexGrow: 1, minHeight: 0, p: 2, gap: 1.5, justifyContent: 'center' }}>
      <Box sx={{ minHeight: 32, textAlign: 'center' }}>
        {match ? (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {match.label || match.name} · {intl.formatMessage({ id: 'chat.extensionLine' }, { extension: match.extension })}
          </Typography>
        ) : (
          number.length > 0 && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              <FormattedMessage id="appPhone.dialer.external" />
            </Typography>
          )
        )}
      </Box>

      <DialPad value={number} onChange={setNumber} onDial={(value) => onDial?.(value, match?.label || match?.name)} />
    </Stack>
  );
}

DialerScreen.propTypes = { directory: PropTypes.array, onDial: PropTypes.func };
