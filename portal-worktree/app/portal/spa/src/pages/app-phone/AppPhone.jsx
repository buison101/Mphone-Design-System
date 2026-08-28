import { useMemo, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import PageHeader from 'components/patterns/PageHeader';
import IconButton from 'components/@extended/IconButton';
import PhoneFrame from 'components/app-phone/PhoneFrame';
import AppTopBar from 'components/app-phone/AppTopBar';
import AppBottomNav from 'components/app-phone/AppBottomNav';
import LoginScreen from 'sections/app-phone/screens/LoginScreen';
import CallsScreen from 'sections/app-phone/screens/CallsScreen';
import MessagesScreen from 'sections/app-phone/screens/MessagesScreen';
import ConversationScreen from 'sections/app-phone/screens/ConversationScreen';
import DialerScreen from 'sections/app-phone/screens/DialerScreen';
import InCallScreen from 'sections/app-phone/screens/InCallScreen';
import ExtensionsScreen from 'sections/app-phone/screens/ExtensionsScreen';
import SettingsScreen from 'sections/app-phone/screens/SettingsScreen';
import { ACCOUNT, CALLS, EXTENSIONS, MESSAGES, THREADS } from 'sections/app-phone/appPhoneSample';

// assets
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import NumberOutlined from '@ant-design/icons/NumberOutlined';
import ApartmentOutlined from '@ant-design/icons/ApartmentOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import MoreOutlined from '@ant-design/icons/MoreOutlined';

// ==============================|| PAGE - APP PHONE ||============================== //
//
// The Mphone app rebuilt in Mantis, at the reference size, inside the portal.
//
// It is a reconstruction, not a second copy of the portal. Where a screen exists
// on both — messages, calls, settings — the app version is the one the phone
// needs, and it reuses the portal's own components rather than forking them. If
// MessageThread and CallPanel could not render at 360px the design system would
// have a hole in it, and this page is where that gets checked.
//
// The rail on the left is a screen index, not app navigation. App navigation is
// the bottom bar inside the frame, and the two must not be confused: picking
// "Chi tiết tin nhắn" in the rail jumps straight to a screen the app only
// reaches through a conversation row.

const SCREENS = [
  { value: 'login', group: 'auth', chrome: 'bare' },
  { value: 'calls', group: 'main', chrome: 'full', nav: 'calls' },
  { value: 'messages', group: 'main', chrome: 'full', nav: 'messages' },
  { value: 'dialer', group: 'main', chrome: 'full', nav: 'dialer' },
  { value: 'extensions', group: 'main', chrome: 'full', nav: 'extensions' },
  { value: 'settings', group: 'main', chrome: 'full', nav: 'settings' },
  { value: 'conversation', group: 'detail', chrome: 'detail' },
  { value: 'incall', group: 'detail', chrome: 'bare' }
];

const GROUPS = ['auth', 'main', 'detail'];

export default function AppPhone() {
  const intl = useIntl();
  const [screen, setScreen] = useState('calls');
  const [extension, setExtension] = useState('x1');

  const t = (id) => intl.formatMessage({ id });
  const current = SCREENS.find((row) => row.value === screen) ?? SCREENS[1];

  // fixed so the call timer starts at zero every time this screen is opened
  const demoCall = useMemo(
    () => ({ name: 'Trần Minh Quân', number: '1014', state: 'active', muted: false, answeredAt: new Date().toISOString() }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [screen === 'incall']
  );

  const navItems = [
    { value: 'calls', label: t('appPhone.nav.calls'), icon: PhoneOutlined },
    { value: 'messages', label: t('appPhone.nav.messages'), icon: MessageOutlined, badge: 2 },
    { value: 'dialer', label: t('appPhone.nav.dialer'), icon: NumberOutlined },
    { value: 'extensions', label: t('appPhone.nav.extensions'), icon: ApartmentOutlined },
    { value: 'settings', label: t('appPhone.nav.settings'), icon: SettingOutlined }
  ];

  const body = {
    login: <LoginScreen onSubmit={() => setScreen('calls')} />,
    calls: <CallsScreen calls={CALLS} onCall={() => setScreen('incall')} />,
    messages: <MessagesScreen threads={THREADS} onOpen={() => setScreen('conversation')} />,
    conversation: <ConversationScreen messages={MESSAGES} />,
    dialer: <DialerScreen directory={EXTENSIONS} onDial={() => setScreen('incall')} />,
    incall: <InCallScreen call={demoCall} onHangup={() => setScreen('calls')} />,
    extensions: <ExtensionsScreen extensions={EXTENSIONS} selected={extension} onSelect={(row) => setExtension(row.id)} />,
    settings: <SettingsScreen account={ACCOUNT} />
  }[screen];

  const topBar = {
    calls: {
      title: t('appPhone.screen.calls'),
      actions: (
        <IconButton size="small" color="secondary" aria-label={t('chat.search')}>
          <SearchOutlined />
        </IconButton>
      )
    },
    messages: { title: t('appPhone.screen.messages') },
    dialer: { title: t('appPhone.screen.dialer') },
    extensions: { title: t('appPhone.screen.extensions') },
    settings: { title: t('appPhone.screen.settings') },
    conversation: {
      title: 'Trần Minh Quân',
      subtitle: `${intl.formatMessage({ id: 'chat.extensionLine' }, { extension: '1014' })} · ${t('chat.presence.available')}`,
      onBack: () => setScreen('messages'),
      actions: (
        <Stack direction="row" sx={{ gap: 0.5 }}>
          <IconButton size="small" color="success" variant="light" onClick={() => setScreen('incall')} aria-label={t('webphone.call')}>
            <PhoneOutlined />
          </IconButton>
          <IconButton size="small" color="secondary" aria-label={t('appPhone.more')}>
            <MoreOutlined />
          </IconButton>
        </Stack>
      )
    }
  }[screen];

  return (
    <Stack sx={{ gap: 2.5 }}>
      <PageHeader title={<FormattedMessage id="appPhone.title" />} description={<FormattedMessage id="appPhone.description" />} />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <MainCard title={<FormattedMessage id="appPhone.screens" />} content={false}>
            {GROUPS.map((group) => (
              <Box key={group}>
                <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', px: 2, pt: 1.5 }}>
                  <FormattedMessage id={`appPhone.group.${group}`} />
                </Typography>
                <List sx={{ p: 0 }}>
                  {SCREENS.filter((row) => row.group === group).map((row) => (
                    <ListItemButton key={row.value} selected={screen === row.value} onClick={() => setScreen(row.value)} sx={{ px: 2 }}>
                      <Stack sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2">
                          <FormattedMessage id={`appPhone.screen.${row.value}`} />
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          <FormattedMessage id={`appPhone.hint.${row.value}`} />
                        </Typography>
                      </Stack>
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            ))}
          </MainCard>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <MainCard sx={{ bgcolor: 'grey.50' }}>
            <Stack sx={{ alignItems: 'center', py: 2 }}>
              <PhoneFrame label={<FormattedMessage id={`appPhone.screen.${screen}`} />}>
                {current.chrome !== 'bare' && topBar && <AppTopBar {...topBar} backLabel={t('chat.back')} />}
                {body}
                {current.chrome === 'full' && <AppBottomNav items={navItems} value={current.nav} onChange={(next) => setScreen(next)} />}
              </PhoneFrame>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
