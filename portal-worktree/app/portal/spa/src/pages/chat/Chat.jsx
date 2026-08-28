import { useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import PageHeader from 'components/patterns/PageHeader';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import PresenceBadge from 'components/@extended/PresenceBadge';
import ConversationList from 'components/chat/ConversationList';
import MessageThread from 'components/chat/MessageThread';
import MessageComposer from 'components/chat/MessageComposer';
import ContactPanel from 'components/chat/ContactPanel';
import WebphonePanel from 'components/webphone/WebphonePanel';
import useWebphone from 'hooks/useWebphone';
import { CONVERSATIONS, MESSAGES, RECENT_CALLS } from 'sections/chat/chatSample';

// assets
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';

// ==============================|| PAGE - CHAT ||============================== //
//
// The Mantis chat shape fitted to a PBX: rail, thread, and a right column that
// is either the contact or the softphone.
//
// The two right-hand panels share one slot rather than stacking. On this screen
// the reader is doing one of two things — reading about the person or calling
// them — and a column carrying both halves each is worse at both.
//
// Below md the three columns become one. The rail and the thread swap in place
// and the right column becomes a temporary drawer, so a phone never shows a
// 320px column squeezed to nothing.
//
// Messages and presence are placeholder data; the webphone runs on a demo
// driver. Both are named so, and both are swapped by changing an import.

const RAIL_WIDTH = 320;
const PANEL_WIDTH = 340;

export default function Chat() {
  const intl = useIntl();
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedId, setSelectedId] = useState(CONVERSATIONS[0].id);
  const [query, setQuery] = useState('');
  const [panel, setPanel] = useState('contact');
  // Below md the right column is a drawer, and it starts closed. Sharing one
  // piece of state with the desktop column meant opening a conversation on a
  // phone landed the reader on the contact sheet instead of the thread.
  const [drawer, setDrawer] = useState(null);
  const [mobileView, setMobileView] = useState('list');
  const [sent, setSent] = useState({});

  // one session for the whole portal, so a call survives leaving this page
  const webphone = useWebphone();

  const presenceLabel = (presence) => intl.formatMessage({ id: `chat.presence.${presence || 'unknown'}` });

  const conversations = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return CONVERSATIONS.filter((row) => !needle || row.name.toLowerCase().includes(needle) || String(row.extension).includes(needle)).map(
      (row) => ({ ...row, presenceLabel: presenceLabel(row.presence) })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, intl]);

  const contact = CONVERSATIONS.find((row) => row.id === selectedId);
  const messages = [...(MESSAGES[selectedId] ?? []), ...(sent[selectedId] ?? [])];

  const openConversation = (row) => {
    setSelectedId(row.id);
    setMobileView('thread');
  };

  // Locally echoed so the composer can be reviewed end to end. The real service
  // will replace this with an optimistic send that reconciles against the
  // server's own message id.
  const send = (text) => {
    const message = {
      id: `local-${Date.now()}`,
      kind: 'message',
      text,
      time: new Date().toLocaleTimeString(intl.locale, { hour: '2-digit', minute: '2-digit' }),
      own: true,
      status: 'sending',
      statusLabel: intl.formatMessage({ id: 'chat.status.sending' })
    };
    setSent((current) => ({ ...current, [selectedId]: [...(current[selectedId] ?? []), message] }));
  };

  const openPanel = (which) => {
    if (downMD) setDrawer(which);
    else setPanel((current) => (current === which ? 'none' : which));
  };

  const callContact = (target) => {
    if (downMD) setDrawer('webphone');
    else setPanel('webphone');
    webphone.dial(target.extension, target.name);
  };

  const contactPanel = (
    <ContactPanel
      contact={contact ? { ...contact, presenceLabel: presenceLabel(contact.presence), lastSeen: contact.time } : null}
      recentCalls={RECENT_CALLS[selectedId] ?? []}
      onCall={callContact}
    />
  );

  const webphonePanel = (
    <Box sx={{ height: '100%', p: downMD ? 2 : 0 }}>
      <WebphonePanel
        registration={webphone.registration}
        extension={webphone.extension}
        call={webphone.call}
        number={webphone.number}
        onNumberChange={webphone.setNumber}
        onDial={(value) => webphone.dial(value)}
        onHangup={webphone.hangup}
        onToggleMute={webphone.toggleMute}
        onToggleHold={webphone.toggleHold}
      />
    </Box>
  );

  const threadHeader = (
    <Stack direction="row" sx={{ p: 1.5, gap: 1.5, alignItems: 'center' }}>
      {downMD && (
        <IconButton color="secondary" onClick={() => setMobileView('list')} aria-label={intl.formatMessage({ id: 'chat.back' })}>
          <ArrowLeftOutlined />
        </IconButton>
      )}
      <PresenceBadge presence={contact?.presence} label={presenceLabel(contact?.presence)}>
        <Avatar color="primary" size="sm">
          {(contact?.name || '?').slice(0, 1)}
        </Avatar>
      </PresenceBadge>
      <Stack sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography variant="subtitle1" noWrap>
          {contact?.name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
          {intl.formatMessage({ id: 'chat.extensionLine' }, { extension: contact?.extension || '—' })} · {presenceLabel(contact?.presence)}
        </Typography>
      </Stack>
      <Tooltip title={intl.formatMessage({ id: 'webphone.call' })}>
        <span>
          <IconButton
            color="success"
            variant="light"
            onClick={() => contact && callContact(contact)}
            aria-label={intl.formatMessage({ id: 'webphone.call' })}
          >
            <PhoneOutlined />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={intl.formatMessage({ id: 'chat.information' })}>
        <span>
          <IconButton
            color={(downMD ? drawer : panel) === 'contact' ? 'primary' : 'secondary'}
            variant={(downMD ? drawer : panel) === 'contact' ? 'light' : 'text'}
            onClick={() => openPanel('contact')}
            aria-label={intl.formatMessage({ id: 'chat.information' })}
          >
            <InfoCircleOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );

  const thread = (
    <Stack sx={{ height: '100%', minHeight: 0, flexGrow: 1 }}>
      {threadHeader}
      <Divider />
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <MessageThread
          messages={messages}
          emptyTitle={<FormattedMessage id="chat.thread.empty" />}
          emptyDetail={<FormattedMessage id="chat.thread.emptyDetail" />}
        />
      </Box>
      <MessageComposer attachments onSend={send} />
    </Stack>
  );

  return (
    <Stack sx={{ gap: 2.5 }}>
      <PageHeader
        title={<FormattedMessage id="chat.pageTitle" />}
        description={<FormattedMessage id="chat.description" />}
        actions={
          // A call left running behind the contact panel would be invisible, so
          // the toggle carries a dot while one is up.
          <Badge color="error" variant="dot" invisible={!webphone.call}>
            <Button
              variant={(downMD ? drawer : panel) === 'webphone' ? 'contained' : 'outlined'}
              color={(downMD ? drawer : panel) === 'webphone' ? 'primary' : 'secondary'}
              startIcon={<PhoneOutlined />}
              onClick={() => openPanel('webphone')}
            >
              <FormattedMessage id="webphone.title" />
            </Button>
          </Badge>
        }
      />

      <MainCard content={false} sx={{ height: 'calc(100vh - 250px)', minHeight: 480, display: 'flex', overflow: 'hidden' }}>
        {/* rail */}
        {(!downMD || mobileView === 'list') && (
          <Box sx={{ width: { xs: '100%', md: RAIL_WIDTH }, flexShrink: 0, minHeight: 0 }}>
            <ConversationList
              conversations={conversations}
              selectedId={selectedId}
              onSelect={openConversation}
              query={query}
              onQueryChange={setQuery}
              emptyTitle={<FormattedMessage id="chat.list.empty" />}
              emptyDetail={<FormattedMessage id="chat.list.emptyDetail" />}
            />
          </Box>
        )}

        {!downMD && <Divider orientation="vertical" flexItem />}

        {/* thread */}
        {(!downMD || mobileView === 'thread') && thread}

        {/* right column */}
        {!downMD && panel !== 'none' && (
          <>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ width: PANEL_WIDTH, flexShrink: 0, minHeight: 0, bgcolor: panel === 'webphone' ? 'transparent' : undefined }}>
              {panel === 'webphone' ? webphonePanel : contactPanel}
            </Box>
          </>
        )}
      </MainCard>

      {/* on a phone the right column is a drawer rather than a third of nothing */}
      <Drawer
        anchor="right"
        open={downMD && drawer !== null}
        onClose={() => setDrawer(null)}
        slotProps={{ paper: { sx: { width: { xs: '100%', sm: PANEL_WIDTH } } } }}
      >
        <Stack sx={{ height: '100%' }}>
          <Stack direction="row" sx={{ p: 1.5, justifyContent: 'flex-end' }}>
            <IconButton color="secondary" onClick={() => setDrawer(null)} aria-label={intl.formatMessage({ id: 'action.close' })}>
              <CloseOutlined />
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>{drawer === 'webphone' ? webphonePanel : contactPanel}</Box>
        </Stack>
      </Drawer>
    </Stack>
  );
}
