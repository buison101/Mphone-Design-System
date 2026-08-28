import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import Avatar from 'components/@extended/Avatar';

// assets
import RightOutlined from '@ant-design/icons/RightOutlined';

// ==============================|| APP PHONE - SETTINGS ||============================== //
//
// Grouped by what the setting changes, not by which service owns it. "Chuyển
// tiếp cuộc gọi" and "Không làm phiền" sit together because both answer "what
// happens when someone calls me", even though one is a dialplan and the other a
// presence flag.
//
// Switches act immediately and say so by having no Save button anywhere on the
// screen. Rows with a chevron open a screen; rows with a switch do not. Mixing
// the two affordances on one row is how people toggle something by accident.

function Section({ title, children }) {
  return (
    <Stack sx={{ pt: 2 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', px: 2, pb: 0.5 }}>
        {title}
      </Typography>
      <Divider />
      <List sx={{ p: 0 }}>{children}</List>
    </Stack>
  );
}

Section.propTypes = { title: PropTypes.node, children: PropTypes.node };

function LinkRow({ primary, secondary, last }) {
  return (
    <ListItemButton divider={!last} sx={{ px: 2, py: 1.5 }}>
      <ListItemText
        primary={primary}
        secondary={secondary}
        slotProps={{ primary: { variant: 'body2' }, secondary: { variant: 'caption' } }}
      />
      <Box aria-hidden="true" sx={{ color: 'text.secondary', display: 'flex' }}>
        <RightOutlined />
      </Box>
    </ListItemButton>
  );
}

LinkRow.propTypes = { primary: PropTypes.node, secondary: PropTypes.node, last: PropTypes.bool };

function SwitchRow({ primary, secondary, checked, last }) {
  return (
    <ListItemButton divider={!last} sx={{ px: 2, py: 1 }}>
      <ListItemText
        primary={primary}
        secondary={secondary}
        slotProps={{ primary: { variant: 'body2' }, secondary: { variant: 'caption' } }}
      />
      <Switch defaultChecked={checked} inputProps={{ 'aria-label': typeof primary === 'string' ? primary : undefined }} />
    </ListItemButton>
  );
}

SwitchRow.propTypes = { primary: PropTypes.node, secondary: PropTypes.node, checked: PropTypes.bool, last: PropTypes.bool };

export default function SettingsScreen({ account }) {
  const intl = useIntl();
  const t = (id) => intl.formatMessage({ id });

  return (
    <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
      <Stack direction="row" sx={{ p: 2, gap: 1.5, alignItems: 'center' }}>
        <Avatar color="primary" size="lg">
          {account?.name?.slice(0, 1) || '?'}
        </Avatar>
        <Stack sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap>
            {account?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {intl.formatMessage({ id: 'chat.extensionLine' }, { extension: account?.extension })} · {account?.domain}
          </Typography>
        </Stack>
      </Stack>

      <Section title={<FormattedMessage id="appPhone.settings.calls" />}>
        <SwitchRow primary={t('appPhone.settings.dnd')} secondary={t('appPhone.settings.dndHint')} checked={false} />
        <LinkRow primary={t('appPhone.settings.forwarding')} secondary={t('appPhone.settings.forwardingValue')} />
        <SwitchRow primary={t('appPhone.settings.recording')} secondary={t('appPhone.settings.recordingHint')} checked />
        <LinkRow primary={t('appPhone.settings.voicemail')} secondary={t('appPhone.settings.voicemailValue')} last />
      </Section>

      <Section title={<FormattedMessage id="appPhone.settings.notifications" />}>
        <SwitchRow primary={t('appPhone.settings.missedPush')} checked />
        <SwitchRow primary={t('appPhone.settings.messagePush')} checked />
        <SwitchRow primary={t('appPhone.settings.quietHours')} secondary={t('appPhone.settings.quietHoursValue')} checked={false} last />
      </Section>

      <Section title={<FormattedMessage id="appPhone.settings.device" />}>
        <LinkRow primary={t('appPhone.settings.audio')} secondary={t('appPhone.settings.audioValue')} />
        <LinkRow primary={t('appPhone.settings.language')} secondary="Tiếng Việt" />
        <LinkRow primary={t('appPhone.settings.about')} secondary="Mphone 2.4.0" last />
      </Section>

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          <FormattedMessage id="appPhone.settings.footer" />
        </Typography>
      </Box>
    </Box>
  );
}

SettingsScreen.propTypes = { account: PropTypes.object };
