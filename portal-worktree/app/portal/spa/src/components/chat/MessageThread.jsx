import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import SimpleBar from 'components/third-party/SimpleBar';
import { FormattedMessage } from 'react-intl';

// project imports
import ContentState from 'components/states/ContentState';

// assets
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';

// ==============================|| CHAT - MESSAGE THREAD ||============================== //
//
// The conversation, oldest at the top, pinned to the bottom on arrival. Own
// messages sit right in the brand colour, the other party sits left on the
// surface — the asymmetry does the attribution, so no message needs a name
// label above it.
//
// Bubbles cap at 72% of the column. A full-width bubble loses the side that
// tells the reader who is speaking, and long lines are harder to read anyway.
//
// A call event is a row in the same timeline, not a bubble. On a PBX the call
// and the message are one conversation, and splitting them into two histories
// is how a colleague misses the callback.

const STATUS_ICON = { sending: ClockCircleOutlined, sent: CheckOutlined, failed: ExclamationCircleOutlined };

function DayDivider({ label }) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5, my: 1 }}>
      <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
    </Stack>
  );
}

DayDivider.propTypes = { label: PropTypes.node };

function CallEvent({ message }) {
  return (
    <Stack direction="row" sx={{ justifyContent: 'center', my: 0.5 }}>
      <Chip
        size="small"
        variant="combined"
        color={message.outcome === 'missed' ? 'error' : 'secondary'}
        icon={<PhoneOutlined />}
        label={`${message.text} · ${message.time}`}
      />
    </Stack>
  );
}

CallEvent.propTypes = { message: PropTypes.object };

function Bubble({ message }) {
  const own = message.own;
  const Status = own ? STATUS_ICON[message.status || 'sent'] : null;

  return (
    <Stack sx={{ alignItems: own ? 'flex-end' : 'flex-start', gap: 0.25 }}>
      <Box
        sx={{
          maxWidth: '72%',
          px: 1.75,
          py: 1.25,
          borderRadius: 2,
          ...(own
            ? { bgcolor: 'primary.main', color: 'primary.contrastText', borderBottomRightRadius: 4 }
            : { bgcolor: 'grey.100', color: 'text.primary', borderBottomLeftRadius: 4 })
        }}
      >
        <Typography variant="body2" sx={{ color: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {message.text}
        </Typography>
      </Box>
      <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center', px: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {message.time}
        </Typography>
        {Status && (
          <Box
            aria-label={message.statusLabel}
            role={message.statusLabel ? 'img' : undefined}
            sx={{ display: 'flex', fontSize: 12, color: message.status === 'failed' ? 'error.main' : 'text.secondary' }}
          >
            <Status />
          </Box>
        )}
      </Stack>
    </Stack>
  );
}

Bubble.propTypes = { message: PropTypes.object };

export default function MessageThread({ messages = [], state = 'ready', emptyTitle, emptyDetail }) {
  const anchor = useRef(null);

  // a new message must land in view; without this the reader has to scroll down
  // to discover the reply they were waiting for
  useEffect(() => {
    anchor.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  if (state === 'loading') return <ContentState state="loading" title={emptyTitle} />;
  if (messages.length === 0) return <ContentState state="empty" title={emptyTitle} detail={emptyDetail} />;

  return (
    <SimpleBar sx={{ height: '100%' }}>
      <Stack sx={{ gap: 1.5, p: 2.5 }}>
        {messages.map((message) =>
          message.kind === 'day' ? (
            <DayDivider key={message.id} label={message.text} />
          ) : message.kind === 'call' ? (
            <CallEvent key={message.id} message={message} />
          ) : (
            <Bubble key={message.id} message={message} />
          )
        )}
        <Box ref={anchor} aria-hidden="true" />
      </Stack>
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', pb: 1.5, color: 'text.secondary' }}>
        <FormattedMessage id="chat.threadNote" />
      </Typography>
    </SimpleBar>
  );
}

MessageThread.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      kind: PropTypes.oneOf(['message', 'day', 'call']),
      text: PropTypes.string,
      time: PropTypes.string,
      own: PropTypes.bool,
      status: PropTypes.oneOf(['sending', 'sent', 'failed']),
      statusLabel: PropTypes.string,
      outcome: PropTypes.string
    })
  ),
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
