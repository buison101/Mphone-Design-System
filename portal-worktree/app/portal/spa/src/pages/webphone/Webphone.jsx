import { useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import PageHeader from 'components/patterns/PageHeader';
import TabbedCard from 'components/patterns/TabbedCard';
import Avatar from 'components/@extended/Avatar';
import Dot from 'components/@extended/Dot';
import PresenceBadge from 'components/@extended/PresenceBadge';
import DialPad from 'components/webphone/DialPad';
import WebphonePanel from 'components/webphone/WebphonePanel';
import ContentState from 'components/states/ContentState';
import useWebphone from 'hooks/useWebphone';
import { DIRECTORY, RECENT } from 'sections/webphone/webphoneSample';

// assets
import NumberOutlined from '@ant-design/icons/NumberOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';

// ==============================|| PAGE - WEBPHONE ||============================== //
//
// The app's Bàn phím screen on the web: three ways to reach a number on the
// left, the call itself on the right.
//
// Keypad, recent and directory are tabs rather than one scrolling column,
// because they are three answers to the same question — who am I calling — and
// the reader only uses one of them per call.
//
// The right column stays mounted across tabs. A call must not disappear because
// the reader went to look up another number, and this is where that reflex gets
// tested.

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export default function Webphone() {
  const intl = useIntl();
  const phone = useWebphone();
  const [tab, setTab] = useState('keypad');

  const presenceLabel = (presence) => intl.formatMessage({ id: `chat.presence.${presence || 'unknown'}` });

  const recentTab = () =>
    RECENT.length === 0 ? (
      <ContentState state="empty" title={<FormattedMessage id="webphone.recent.empty" />} compact />
    ) : (
      <List sx={{ p: 0 }}>
        {RECENT.map((row, index) => (
          <ListItemButton
            key={row.id}
            divider={index < RECENT.length - 1}
            onClick={() => phone.dial(row.number, row.name)}
            sx={{ px: 1, py: 1.5, gap: 1.5 }}
          >
            <Dot color={row.status === 'missed' ? 'error' : 'success'} />
            <Stack sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {row.name || row.number}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                <FormattedMessage id={`chat.direction.${row.direction}`} /> · {row.number} · {row.time}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
              {row.duration}
            </Typography>
          </ListItemButton>
        ))}
      </List>
    );

  const directoryTab = () => (
    <List sx={{ p: 0 }}>
      {DIRECTORY.map((row, index) => (
        <ListItemButton
          key={row.id}
          divider={index < DIRECTORY.length - 1}
          onClick={() => phone.dial(row.extension, row.name)}
          sx={{ px: 1, py: 1.5, gap: 1.5 }}
        >
          <PresenceBadge presence={row.presence} label={presenceLabel(row.presence)}>
            <Avatar color="primary" size="sm">
              {initials(row.name)}
            </Avatar>
          </PresenceBadge>
          <Stack sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {row.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {intl.formatMessage({ id: 'chat.extensionLine' }, { extension: row.extension })} · {presenceLabel(row.presence)}
            </Typography>
          </Stack>
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Stack sx={{ gap: 2.5 }}>
      <PageHeader title={<FormattedMessage id="webphone.pageTitle" />} description={<FormattedMessage id="webphone.pageDescription" />} />

      {/* A simulated call that does not say so would be discovered by a customer
          rather than by us. */}
      {phone.simulated && (
        <Alert severity="info">
          <FormattedMessage id="webphone.simulated" />
        </Alert>
      )}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <TabbedCard
            value={tab}
            onChange={setTab}
            ariaLabel={intl.formatMessage({ id: 'webphone.tabsLabel' })}
            tabs={[
              {
                value: 'keypad',
                label: intl.formatMessage({ id: 'webphone.tab.keypad' }),
                icon: NumberOutlined,
                content: () => (
                  <Stack sx={{ maxWidth: 360, mx: 'auto' }}>
                    <DialPad
                      value={phone.number}
                      onChange={phone.setNumber}
                      onDial={(value) => phone.dial(value)}
                      onDigit={phone.call ? phone.sendDigit : undefined}
                      disabled={phone.registration !== 'registered'}
                    />
                  </Stack>
                )
              },
              {
                value: 'recent',
                label: intl.formatMessage({ id: 'webphone.tab.recent' }),
                icon: ClockCircleOutlined,
                content: recentTab
              },
              {
                value: 'directory',
                label: intl.formatMessage({ id: 'webphone.tab.directory' }),
                icon: TeamOutlined,
                content: directoryTab
              }
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <WebphonePanel
            dialPad={false}
            idleHint={<FormattedMessage id="webphone.idleHint" />}
            registration={phone.registration}
            extension={phone.extension}
            call={phone.call}
            number={phone.number}
            onNumberChange={phone.setNumber}
            onDial={(value) => phone.dial(value)}
            onHangup={phone.hangup}
            onToggleMute={phone.toggleMute}
            onToggleHold={phone.toggleHold}
            onDigit={phone.sendDigit}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
