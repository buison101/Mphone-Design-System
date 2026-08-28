import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import DialPad from './DialPad';

// assets
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import AudioMutedOutlined from '@ant-design/icons/AudioMutedOutlined';
import AudioOutlined from '@ant-design/icons/AudioOutlined';
import PauseOutlined from '@ant-design/icons/PauseOutlined';
import PlayCircleOutlined from '@ant-design/icons/PlayCircleOutlined';
import NumberOutlined from '@ant-design/icons/NumberOutlined';
import SwapOutlined from '@ant-design/icons/SwapOutlined';

// ==============================|| WEBPHONE - CALL PANEL ||============================== //
//
// A call in progress: who, what state, how long, and the controls that change
// it. The timer counts from the moment the call was answered, not from when it
// was dialled — a ringing call has no duration, and showing one makes people
// think the far end picked up.
//
// End is the only filled control, and it is red. Every other control toggles
// something the reader can undo, so none of them may compete with it.
//
// The panel holds no SIP session. It renders the state it is handed and reports
// intent upward, which is what lets the same panel serve a browser softphone, a
// click-to-call bridged through the PBX, and a call the reader started on their
// deskphone.

const STATE_LABEL = {
  dialing: 'webphone.state.dialing',
  ringing: 'webphone.state.ringing',
  active: 'webphone.state.active',
  held: 'webphone.state.held',
  ended: 'webphone.state.ended'
};

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function useElapsed(since, running) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running || !since) {
      setSeconds(0);
      return undefined;
    }
    const tick = () => setSeconds(Math.max(0, Math.floor((Date.now() - new Date(since).getTime()) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [since, running]);

  return seconds;
}

function clock(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes < 60) return `${minutes}:${String(rest).padStart(2, '0')}`;
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

export default function CallPanel({ call, onHangup, onToggleMute, onToggleHold, onTransfer, onDigit }) {
  const intl = useIntl();
  const [keypad, setKeypad] = useState(false);
  const answered = call?.state === 'active' || call?.state === 'held';
  const seconds = useElapsed(call?.answeredAt, answered);

  if (!call) return null;

  const control = (key, active, icon, activeIcon, labelId, handler) => (
    <Tooltip key={key} title={intl.formatMessage({ id: labelId })}>
      <span>
        <IconButton
          size="large"
          shape="rounded"
          variant={active ? 'contained' : 'light'}
          color={active ? 'primary' : 'secondary'}
          onClick={handler}
          aria-pressed={active}
          aria-label={intl.formatMessage({ id: labelId })}
        >
          {active ? activeIcon : icon}
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <Stack sx={{ gap: 2.5, alignItems: 'center', width: '100%' }}>
      <Stack sx={{ alignItems: 'center', gap: 1 }}>
        <Avatar color="primary" size="xl">
          {initials(call.name || call.number)}
        </Avatar>
        <Stack sx={{ alignItems: 'center', gap: 0.25 }}>
          <Typography variant="h5">{call.name || call.number}</Typography>
          {call.name && call.number && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
              {call.number}
            </Typography>
          )}
          <Stack direction="row" sx={{ gap: 1, alignItems: 'baseline' }}>
            <Typography variant="body2" sx={{ color: call.state === 'held' ? 'warning.main' : 'text.secondary' }}>
              <FormattedMessage id={STATE_LABEL[call.state] || 'webphone.state.dialing'} />
            </Typography>
            {answered && (
              <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {clock(seconds)}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Stack direction="row" sx={{ gap: 1.25, flexWrap: 'wrap', justifyContent: 'center' }}>
        {control('mute', Boolean(call.muted), <AudioOutlined />, <AudioMutedOutlined />, 'webphone.mute', onToggleMute)}
        {control('hold', call.state === 'held', <PauseOutlined />, <PlayCircleOutlined />, 'webphone.hold', onToggleHold)}
        {control('keypad', keypad, <NumberOutlined />, <NumberOutlined />, 'webphone.keypad', () => setKeypad((open) => !open))}
        {onTransfer && control('transfer', false, <SwapOutlined />, <SwapOutlined />, 'webphone.transfer', onTransfer)}
      </Stack>

      {keypad && (
        <Box sx={{ width: '100%' }}>
          <DialPad compact value="" onChange={() => {}} onDigit={onDigit} />
        </Box>
      )}

      <IconButton
        size="large"
        shape="rounded"
        variant="contained"
        color="error"
        onClick={onHangup}
        aria-label={intl.formatMessage({ id: 'webphone.hangup' })}
        sx={{ transform: 'rotate(135deg)' }}
      >
        <PhoneOutlined />
      </IconButton>
    </Stack>
  );
}

CallPanel.propTypes = {
  call: PropTypes.shape({
    name: PropTypes.string,
    number: PropTypes.string,
    state: PropTypes.oneOf(['dialing', 'ringing', 'active', 'held', 'ended']),
    muted: PropTypes.bool,
    answeredAt: PropTypes.string
  }),
  onHangup: PropTypes.func,
  onToggleMute: PropTypes.func,
  onToggleHold: PropTypes.func,
  onTransfer: PropTypes.func,
  onDigit: PropTypes.func
};
