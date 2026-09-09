import { useState } from 'react';
import { useIntl } from 'react-intl';

import BellOutlined from '@ant-design/icons/BellOutlined';
import ContactsOutlined from '@ant-design/icons/ContactsOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import SafetyCertificateOutlined from '@ant-design/icons/SafetyCertificateOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import Breadcrumbs from 'components/@extended/Breadcrumbs';
import MainCard from 'components/MainCard';

const initialChecked = [
  'email',
  'summary',
  'usage-report',
  'maintenance',
  'missed-call',
  'recording-ready',
  'new-device',
  'service-interruption',
  'billing-action'
];

export default function MphoneLabSettings() {
  const intl = useIntl();
  const message = (id) => intl.formatMessage({ id });
  const [checked, setChecked] = useState(initialChecked);
  const [savedChecked, setSavedChecked] = useState(initialChecked);

  const handleToggle = (value) => () => {
    setChecked((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  };

  const renderSwitchRow = (value, labelId, disabled = false) => {
    const labelElementId = `mphone-settings-${value}`;

    return (
      <ListItem>
        <ListItemText
          id={labelElementId}
          primary={<Typography sx={{ color: disabled ? 'secondary.light' : 'secondary.main' }}>{message(labelId)}</Typography>}
        />
        <Switch
          edge="end"
          onChange={handleToggle(value)}
          checked={checked.includes(value)}
          disabled={disabled}
          slotProps={{ input: { 'aria-labelledby': labelElementId } }}
        />
      </ListItem>
    );
  };

  const renderCheckboxRow = (value, labelId) => (
    <ListItem>
      <ListItemText
        id={`mphone-settings-${value}`}
        primary={<Typography sx={{ color: 'secondary.main' }}>{message(labelId)}</Typography>}
      />
      <Checkbox
        checked={checked.includes(value)}
        onChange={handleToggle(value)}
        slotProps={{ input: { 'aria-labelledby': `mphone-settings-${value}` } }}
      />
    </ListItem>
  );

  return (
    <>
      <Breadcrumbs
        custom
        heading="mphoneLab.settings.heading"
        links={[
          { title: 'mphoneLab.settings.breadcrumb.home', to: '/mphone' },
          { title: 'mphoneLab.settings.breadcrumb.account' },
          { title: 'mphoneLab.settings.tab.notifications' }
        ]}
      />
      <MainCard border={false} boxShadow>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={5} variant="scrollable" scrollButtons="auto" aria-label={message('mphoneLab.settings.tabsAria')}>
            <Tab label={message('mphoneLab.settings.tab.profile')} icon={<UserOutlined />} iconPosition="start" />
            <Tab label={message('mphoneLab.settings.tab.contact')} icon={<ContactsOutlined />} iconPosition="start" />
            <Tab label={message('mphoneLab.settings.tab.account')} icon={<PhoneOutlined />} iconPosition="start" />
            <Tab label={message('mphoneLab.settings.tab.security')} icon={<SafetyCertificateOutlined />} iconPosition="start" />
            <Tab label={message('mphoneLab.settings.tab.access')} icon={<TeamOutlined />} iconPosition="start" />
            <Tab label={message('mphoneLab.settings.tab.notifications')} icon={<BellOutlined />} iconPosition="start" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 2.5 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <MainCard title={message('mphoneLab.settings.channels.title')}>
                    <Stack sx={{ gap: 2.5 }}>
                      <Typography variant="subtitle1">{message('mphoneLab.settings.channels.subtitle')}</Typography>
                      <List sx={{ p: 0, '& .MuiListItem-root': { p: 0, py: 0.25 } }}>
                        {renderSwitchRow('email', 'mphoneLab.settings.channels.email')}
                        {renderSwitchRow('personal-email', 'mphoneLab.settings.channels.personalEmail')}
                      </List>
                    </Stack>
                  </MainCard>
                </Grid>

                <Grid size={12}>
                  <MainCard title={message('mphoneLab.settings.preferences.title')}>
                    <Stack sx={{ gap: 2.5 }}>
                      <Typography variant="subtitle1">{message('mphoneLab.settings.preferences.subtitle')}</Typography>
                      <List sx={{ p: 0, '& .MuiListItem-root': { p: 0, py: 0.25 } }}>
                        {renderCheckboxRow('summary', 'mphoneLab.settings.preferences.summary')}
                        {renderCheckboxRow('usage-report', 'mphoneLab.settings.preferences.usageReport')}
                        {renderCheckboxRow('maintenance', 'mphoneLab.settings.preferences.maintenance')}
                        {renderCheckboxRow('product-updates', 'mphoneLab.settings.preferences.productUpdates')}
                        {renderCheckboxRow('guides', 'mphoneLab.settings.preferences.guides')}
                      </List>
                    </Stack>
                  </MainCard>
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <MainCard title={message('mphoneLab.settings.activity.title')}>
                <Stack sx={{ gap: 2.5 }}>
                  <Typography variant="subtitle1">{message('mphoneLab.settings.activity.subtitle')}</Typography>
                  <List sx={{ p: 0, '& .MuiListItem-root': { p: 0, py: 0.25 } }}>
                    {renderSwitchRow('missed-call', 'mphoneLab.settings.activity.missedCall')}
                    {renderSwitchRow('voicemail', 'mphoneLab.settings.activity.voicemail')}
                    {renderSwitchRow('recording-ready', 'mphoneLab.settings.activity.recordingReady')}
                  </List>
                  <Divider />
                  <Typography variant="subtitle1">{message('mphoneLab.settings.critical.subtitle')}</Typography>
                  <List sx={{ p: 0, '& .MuiListItem-root': { p: 0, py: 0.25 } }}>
                    {renderSwitchRow('new-device', 'mphoneLab.settings.critical.newDevice', true)}
                    {renderSwitchRow('service-interruption', 'mphoneLab.settings.critical.serviceInterruption', true)}
                    {renderSwitchRow('billing-action', 'mphoneLab.settings.critical.billingAction')}
                  </List>
                </Stack>
              </MainCard>
            </Grid>

            <Grid size={12}>
              <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="secondary" onClick={() => setChecked(savedChecked)}>
                  {message('mphoneLab.settings.action.cancel')}
                </Button>
                <Button variant="contained" onClick={() => setSavedChecked(checked)}>
                  {message('mphoneLab.settings.action.save')}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </MainCard>
    </>
  );
}
