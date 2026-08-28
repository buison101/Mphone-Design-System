import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import Avatar from 'components/@extended/Avatar';
import Dot from 'components/@extended/Dot';
import ContentState from 'components/states/ContentState';

// assets
import DesktopOutlined from '@ant-design/icons/DesktopOutlined';
import MobileOutlined from '@ant-design/icons/MobileOutlined';
import TabletOutlined from '@ant-design/icons/TabletOutlined';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';

// ==============================|| ACCOUNT - DEVICES TAB ||============================== //
//
// Where this identity is currently signed in, one row per session, newest
// activity first. A list rather than the six-column table this page used to
// carry: on a phone that table scrolled sideways past the only thing the reader
// came for, which is the sign-out button.
//
// The device this browser is using is labelled and has no sign-out control. It
// cannot revoke itself through this endpoint, and offering a button that logs
// the reader out mid-review would be a trap.
//
// Ended sessions stay available behind a toggle rather than on screen. They
// matter when something looks wrong, and are noise the rest of the time.

const CLIENT_ICON = {
  desktop: DesktopOutlined,
  web: GlobalOutlined,
  browser: GlobalOutlined,
  mobile: MobileOutlined,
  android: MobileOutlined,
  ios: MobileOutlined,
  tablet: TabletOutlined
};

function deviceIcon(clientType = '') {
  const key = String(clientType).toLowerCase();
  return CLIENT_ICON[key] || DesktopOutlined;
}

export default function AccountDevicesTab({ devices = [], showHistory, onToggleHistory, onRevoke, busy = '' }) {
  const intl = useIntl();

  const active = devices.filter((device) => !device.revoked_at);
  const ended = devices.filter((device) => device.revoked_at);
  const visible = showHistory ? devices : active;
  const when = (value) => (value ? intl.formatDate(value, { dateStyle: 'medium', timeStyle: 'short' }) : '—');

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5">
          <FormattedMessage id="account.devices.activeTitle" />
        </Typography>
        {ended.length > 0 && (
          <Button size="small" color="secondary" onClick={onToggleHistory}>
            <FormattedMessage
              id={showHistory ? 'account.devices.hideHistory' : 'account.devices.showHistory'}
              values={{ count: ended.length }}
            />
          </Button>
        )}
      </Stack>

      {active.length === 0 && !showHistory ? (
        <ContentState state="empty" title={<FormattedMessage id="account.devices.empty" />} compact />
      ) : (
        <List sx={{ p: 0 }}>
          {visible.map((device, index) => {
            const Icon = deviceIcon(device.client_type);
            const revoked = Boolean(device.revoked_at);
            return (
              <ListItem key={device.session_id} divider={index < visible.length - 1} disableGutters sx={{ py: 1.75 }}>
                {/* The row lays itself out instead of using ListItemText with a
                    secondaryAction. MUI positions that action absolutely, and at
                    390px it lands on top of the wrapped "last active" line. */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  sx={{ width: '100%', gap: 1.5, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
                >
                  <Stack direction="row" sx={{ gap: 1.5, alignItems: 'flex-start', minWidth: 0, flexGrow: 1 }}>
                    <Avatar color={revoked ? 'secondary' : 'primary'} size="md">
                      <Icon />
                    </Avatar>
                    <Stack sx={{ gap: 0.5, minWidth: 0 }}>
                      <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1">
                          {device.device_name || intl.formatMessage({ id: 'account.devices.unknown' })}
                        </Typography>
                        {device.current && (
                          <Chip
                            size="small"
                            variant="combined"
                            color="primary"
                            label={intl.formatMessage({ id: 'account.devices.current' })}
                          />
                        )}
                      </Stack>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {[device.client_type, device.app_version].filter(Boolean).join(' · ') || '—'}
                      </Typography>
                      <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center' }}>
                        <Dot color={revoked ? 'secondary' : 'success'} />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {revoked ? (
                            <FormattedMessage id="account.devices.endedAt" values={{ time: when(device.revoked_at) }} />
                          ) : (
                            <FormattedMessage id="account.devices.lastSeenAt" values={{ time: when(device.last_seen_at) }} />
                          )}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  {!revoked && !device.current && (
                    <Button
                      color="error"
                      size="small"
                      disabled={busy !== ''}
                      onClick={() => onRevoke(device)}
                      sx={{ flexShrink: 0, alignSelf: { xs: 'flex-start', sm: 'center' }, ml: { xs: 6.5, sm: 0 } }}
                    >
                      <FormattedMessage id="account.devices.revoke" />
                    </Button>
                  )}
                </Stack>
              </ListItem>
            );
          })}
        </List>
      )}

      <Divider />

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        <FormattedMessage id="account.devices.note" />
      </Typography>
    </Stack>
  );
}

AccountDevicesTab.propTypes = {
  devices: PropTypes.array,
  showHistory: PropTypes.bool,
  onToggleHistory: PropTypes.func,
  onRevoke: PropTypes.func,
  busy: PropTypes.string
};
