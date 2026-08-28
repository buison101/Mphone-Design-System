import PropTypes from 'prop-types';

// material-ui
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import ProfileSummaryCard from 'components/cards/ProfileSummaryCard';
import DetailList from 'components/patterns/DetailList';

// assets
import MailOutlined from '@ant-design/icons/MailOutlined';
import ShopOutlined from '@ant-design/icons/ShopOutlined';
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';

// ==============================|| ACCOUNT - PROFILE TAB ||============================== //
//
// Who the reader is signed in as, and what that identity is entitled to. The
// rail repeats the email and customer that the detail list also carries: on a
// phone the rail is what stays on screen, and an identity page that scrolls its
// own subject out of view is no use.
//
// An unverified email opens with a warning rather than a quiet grey chip. It is
// the one state on this page that blocks something later — password reset — so
// it earns the interruption.

export default function AccountProfileTab({ identity, customer, membership, extensions = [], activeDevices = 0, domain }) {
  const intl = useIntl();
  const verified = Boolean(identity?.email_verified_at);

  const verificationChip = (
    <Chip
      size="small"
      variant="combined"
      color={verified ? 'success' : 'warning'}
      label={intl.formatMessage({ id: verified ? 'account.verified' : 'account.unverified' })}
      sx={{ alignSelf: 'flex-start' }}
    />
  );

  return (
    <Stack sx={{ gap: 2.5 }}>
      {!verified && (
        <Alert severity="warning">
          <FormattedMessage id="account.security.unverifiedDetail" />
        </Alert>
      )}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ProfileSummaryCard
            name={customer?.display_name || identity?.primary_email || '—'}
            subtitle={membership?.role ? intl.formatMessage({ id: 'account.roleLine' }, { role: membership.role }) : undefined}
            badge={intl.formatMessage({ id: verified ? 'account.verified' : 'account.unverified' })}
            badgeColor={verified ? 'success' : 'warning'}
            stats={[
              { id: 'ext', label: <FormattedMessage id="account.stat.extensions" />, value: extensions.length },
              { id: 'dev', label: <FormattedMessage id="account.stat.devices" />, value: activeDevices }
            ]}
            meta={[
              { id: 'email', icon: MailOutlined, text: identity?.primary_email || '—' },
              { id: 'customer', icon: ShopOutlined, text: customer?.display_name || '—' },
              ...(domain ? [{ id: 'domain', icon: GlobalOutlined, text: domain }] : [])
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack sx={{ gap: 2.5 }}>
            <Stack sx={{ gap: 1.5 }}>
              <Typography variant="h5">
                <FormattedMessage id="account.profile" />
              </Typography>
              <DetailList
                items={[
                  { id: 'email', label: <FormattedMessage id="account.email" />, value: identity?.primary_email || '—' },
                  { id: 'status', label: <FormattedMessage id="account.emailStatus" />, value: verificationChip },
                  { id: 'customer', label: <FormattedMessage id="account.customer" />, value: customer?.display_name || '—' },
                  { id: 'role', label: <FormattedMessage id="account.role" />, value: membership?.role || '—' }
                ]}
              />
            </Stack>

            <Divider />

            <Stack sx={{ gap: 1.5 }}>
              <Typography variant="h5">
                <FormattedMessage id="account.access" />
              </Typography>
              <DetailList
                items={[
                  {
                    id: 'ext',
                    label: <FormattedMessage id="account.extensions" />,
                    value: extensions.length ? extensions.map((row) => row.extension).join(', ') : '—'
                  },
                  {
                    id: 'devices',
                    label: <FormattedMessage id="account.devices" />,
                    value: intl.formatMessage({ id: 'account.deviceCount' }, { count: activeDevices })
                  },
                  ...(domain ? [{ id: 'domain', label: <FormattedMessage id="account.domain" />, value: domain }] : [])
                ]}
              />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

AccountProfileTab.propTypes = {
  identity: PropTypes.object,
  customer: PropTypes.object,
  membership: PropTypes.object,
  extensions: PropTypes.array,
  activeDevices: PropTypes.number,
  domain: PropTypes.string
};
