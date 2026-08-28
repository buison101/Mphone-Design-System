import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import DetailList from 'components/patterns/DetailList';
import DangerAction from 'components/patterns/DangerAction';

// ==============================|| ACCOUNT - SECURITY TAB ||============================== //
//
// The state a reader checks when something feels wrong, and the one control that
// answers it. Facts first, then the irreversible action — never the reverse, so
// nobody signs every device out before reading how many there are.
//
// Only actions the server actually exposes appear here. Password change and
// notification preferences are in the Mantis original and deliberately absent:
// the portal has no endpoint for either, and a control that cannot work is worse
// than a missing one.

export default function AccountSecurityTab({ identity, activeDevices = 0, otherDevices = 0, onSignOutOthers, busy = '' }) {
  const intl = useIntl();
  const verified = Boolean(identity?.email_verified_at);
  const when = (value) => (value ? intl.formatDate(value, { dateStyle: 'medium', timeStyle: 'short' }) : '—');

  return (
    <Stack sx={{ gap: 2.5 }}>
      <Stack sx={{ gap: 1.5 }}>
        <Typography variant="h5">
          <FormattedMessage id="account.security.title" />
        </Typography>
        <DetailList
          items={[
            {
              id: 'verification',
              label: <FormattedMessage id="account.security.emailTitle" />,
              value: (
                <Chip
                  size="small"
                  variant="combined"
                  color={verified ? 'success' : 'warning'}
                  label={intl.formatMessage({ id: verified ? 'account.verified' : 'account.unverified' })}
                  sx={{ alignSelf: 'flex-start' }}
                />
              )
            },
            {
              id: 'verifiedAt',
              label: <FormattedMessage id="account.security.verifiedAt" />,
              value: verified ? when(identity.email_verified_at) : '—'
            },
            {
              id: 'sessions',
              label: <FormattedMessage id="account.security.sessionsTitle" />,
              value: intl.formatMessage({ id: 'account.deviceCount' }, { count: activeDevices })
            },
            {
              id: 'email',
              label: <FormattedMessage id="account.email" />,
              value: identity?.primary_email || '—'
            }
          ]}
        />
      </Stack>

      {!verified && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <FormattedMessage id="account.security.unverifiedDetail" />
        </Typography>
      )}

      <DangerAction
        title={<FormattedMessage id="account.logoutAll" />}
        description={<FormattedMessage id="account.logoutAllHelp" />}
        actionLabel={<FormattedMessage id="account.logoutAll" />}
        onAction={onSignOutOthers}
        busy={busy !== ''}
        disabled={otherDevices === 0}
      />

      {otherDevices === 0 && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          <FormattedMessage id="account.security.noOtherDevices" />
        </Typography>
      )}
    </Stack>
  );
}

AccountSecurityTab.propTypes = {
  identity: PropTypes.object,
  activeDevices: PropTypes.number,
  otherDevices: PropTypes.number,
  onSignOutOthers: PropTypes.func,
  busy: PropTypes.string
};
