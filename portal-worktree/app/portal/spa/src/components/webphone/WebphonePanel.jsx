import PropTypes from 'prop-types';

// material-ui
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';

// assets
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import DialPad from './DialPad';
import CallPanel from './CallPanel';

// ==============================|| WEBPHONE - PANEL ||============================== //
//
// The softphone as one dockable surface: a pad when there is no call, the call
// when there is. One component so the portal has exactly one place a call can be
// controlled from, wherever that surface happens to be mounted — a rail on the
// chat screen today, a global drawer or a floating panel later.
//
// The registration state sits in the header rather than in an alert, because it
// is true all the time and an alert that never goes away stops being read. It
// becomes an alert only when it blocks dialling.
//
// This component owns no SIP stack. Everything it knows arrives as props and
// every intent leaves as a callback, which is what will let a real SIP.js
// session, a click-to-call bridge, or the preview's stub drive the same UI.

const REGISTRATION_COLOR = { registered: 'success', connecting: 'warning', unregistered: 'secondary', failed: 'error' };

export default function WebphonePanel({
  dialPad = true,
  idleHint,
  registration = 'unregistered',
  extension,
  call,
  number,
  onNumberChange,
  onDial,
  onHangup,
  onToggleMute,
  onToggleHold,
  onTransfer,
  onDigit
}) {
  const intl = useIntl();
  const ready = registration === 'registered';

  return (
    <MainCard
      content={false}
      title={<FormattedMessage id="webphone.title" />}
      secondary={
        <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center' }}>
          <Dot color={REGISTRATION_COLOR[registration] || 'secondary'} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            <FormattedMessage id={`webphone.registration.${registration}`} />
          </Typography>
        </Stack>
      }
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Stack sx={{ p: 2.5, gap: 2, flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
        {call ? (
          <CallPanel
            call={call}
            onHangup={onHangup}
            onToggleMute={onToggleMute}
            onToggleHold={onToggleHold}
            onTransfer={onTransfer}
            onDigit={onDigit}
          />
        ) : (
          <>
            {!ready && (
              <Alert severity={registration === 'failed' ? 'error' : 'info'}>
                <FormattedMessage id={registration === 'failed' ? 'webphone.registerFailed' : 'webphone.registerPending'} />
              </Alert>
            )}

            {extension && (
              <>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {intl.formatMessage({ id: 'webphone.callingAs' }, { extension })}
                </Typography>
                <Divider />
              </>
            )}

            {/* A screen that already offers a keypad elsewhere must not show a
                second one here — two pads on one page is two places to type the
                same number and no way to tell which one is live. */}
            {dialPad ? (
              <DialPad value={number} onChange={onNumberChange} onDial={onDial} onDigit={onDigit} disabled={!ready} />
            ) : (
              <Stack sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: 6, gap: 1 }}>
                <PhoneOutlined style={{ fontSize: 28, opacity: 0.35 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 240 }}>
                  {idleHint}
                </Typography>
              </Stack>
            )}
          </>
        )}
      </Stack>
    </MainCard>
  );
}

WebphonePanel.propTypes = {
  dialPad: PropTypes.bool,
  idleHint: PropTypes.node,
  registration: PropTypes.oneOf(['registered', 'connecting', 'unregistered', 'failed']),
  extension: PropTypes.string,
  call: PropTypes.object,
  number: PropTypes.string,
  onNumberChange: PropTypes.func,
  onDial: PropTypes.func,
  onHangup: PropTypes.func,
  onToggleMute: PropTypes.func,
  onToggleHold: PropTypes.func,
  onTransfer: PropTypes.func,
  onDigit: PropTypes.func
};
