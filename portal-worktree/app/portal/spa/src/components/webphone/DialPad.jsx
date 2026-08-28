import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project imports
import IconButton from 'components/@extended/IconButton';

// assets
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import BackwardOutlined from '@ant-design/icons/BackwardOutlined';

// ==============================|| WEBPHONE - DIAL PAD ||============================== //
//
// Twelve keys and a number field. The field is editable and pasteable, because
// most numbers reach a portal by copy rather than by typing, and a pad that only
// accepts taps forces the reader to read a number aloud to themselves.
//
// Keys carry their letters like a desk phone. They are what makes a vanity
// number or a spelled-out extension findable, and they cost nothing to draw.
//
// The pad emits a digit and a number; it never places a call itself. Whoever
// owns the SIP session owns dialling, so the same pad works in the portal, in a
// dialog and inside a live call as a DTMF keypad.

const KEYS = [
  ['1', ''],
  ['2', 'ABC'],
  ['3', 'DEF'],
  ['4', 'GHI'],
  ['5', 'JKL'],
  ['6', 'MNO'],
  ['7', 'PQRS'],
  ['8', 'TUV'],
  ['9', 'WXYZ'],
  ['*', ''],
  ['0', '+'],
  ['#', '']
];

export default function DialPad({ value, onChange, onDial, onDigit, dialLabel, disabled = false, compact = false }) {
  const intl = useIntl();
  const [internal, setInternal] = useState('');
  const controlled = value !== undefined;
  const number = controlled ? value : internal;

  const set = (next) => {
    if (controlled) onChange?.(next);
    else setInternal(next);
  };

  const press = (digit) => {
    onDigit?.(digit);
    set(number + digit);
  };

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
        <TextField
          fullWidth
          value={number}
          onChange={(event) => set(event.target.value)}
          placeholder={intl.formatMessage({ id: 'webphone.numberPlaceholder' })}
          aria-label={intl.formatMessage({ id: 'webphone.number' })}
          disabled={disabled}
          slotProps={{ htmlInput: { inputMode: 'tel', style: { fontSize: 20, letterSpacing: 1, textAlign: 'center' } } }}
        />
        <IconButton
          color="secondary"
          onClick={() => set(number.slice(0, -1))}
          disabled={disabled || number.length === 0}
          aria-label={intl.formatMessage({ id: 'webphone.backspace' })}
        >
          <BackwardOutlined />
        </IconButton>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: compact ? 0.75 : 1 }}>
        {KEYS.map(([digit, letters]) => (
          <Button
            key={digit}
            variant="outlined"
            color="secondary"
            onClick={() => press(digit)}
            disabled={disabled}
            sx={{ flexDirection: 'column', py: compact ? 0.75 : 1.25, minWidth: 0 }}
          >
            <Typography variant="h5" sx={{ color: 'text.primary', lineHeight: 1.2 }}>
              {digit}
            </Typography>
            {letters && (
              <Typography aria-hidden="true" variant="caption" sx={{ color: 'text.secondary', letterSpacing: 1, lineHeight: 1 }}>
                {letters}
              </Typography>
            )}
          </Button>
        ))}
      </Box>

      {onDial && (
        <Button
          fullWidth
          size="large"
          variant="contained"
          color="success"
          startIcon={<PhoneOutlined />}
          onClick={() => onDial(number)}
          disabled={disabled || number.trim().length === 0}
        >
          {dialLabel || intl.formatMessage({ id: 'webphone.call' })}
        </Button>
      )}
    </Stack>
  );
}

DialPad.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onDial: PropTypes.func,
  onDigit: PropTypes.func,
  dialLabel: PropTypes.node,
  disabled: PropTypes.bool,
  compact: PropTypes.bool
};
