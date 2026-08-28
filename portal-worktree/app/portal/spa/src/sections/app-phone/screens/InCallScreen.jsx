import PropTypes from 'prop-types';

// material-ui
import Stack from '@mui/material/Stack';

// project imports
import CallPanel from 'components/webphone/CallPanel';

// ==============================|| APP PHONE - IN CALL ||============================== //
//
// The active call, using the portal's own CallPanel. Same reason as the
// conversation screen: a control surface that needs a separate mobile
// implementation is a control surface that will drift.
//
// Biased below centre rather than centred. On a phone this screen is held
// one-handed and every element on it is a target, so the controls belong in the
// lower half where a thumb actually reaches.

export default function InCallScreen({ call, onHangup, onToggleMute, onToggleHold, onDigit }) {
  return (
    <Stack sx={{ flexGrow: 1, minHeight: 0, p: 3, pt: 12, justifyContent: 'center', overflowY: 'auto' }}>
      <CallPanel call={call} onHangup={onHangup} onToggleMute={onToggleMute} onToggleHold={onToggleHold} onDigit={onDigit} />
    </Stack>
  );
}

InCallScreen.propTypes = {
  call: PropTypes.object,
  onHangup: PropTypes.func,
  onToggleMute: PropTypes.func,
  onToggleHold: PropTypes.func,
  onDigit: PropTypes.func
};
