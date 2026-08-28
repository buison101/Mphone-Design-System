import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import SimpleBar from 'components/third-party/SimpleBar';
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import Avatar from 'components/@extended/Avatar';
import PresenceBadge from 'components/@extended/PresenceBadge';
import DetailList from 'components/patterns/DetailList';
import Dot from 'components/@extended/Dot';

// assets
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import HistoryOutlined from '@ant-design/icons/HistoryOutlined';

// ==============================|| CHAT - CONTACT PANEL ||============================== //
//
// Who the reader is talking to, and the one action they most often want next:
// call them. On a PBX the message thread is usually the preamble to a call, so
// the call button sits above the details rather than behind an overflow menu.
//
// Mantis fills this rail with shared files and links. This portal has no file
// store behind the chat, so that block is replaced by recent calls with the same
// person — the history that actually exists and that the reader came to check.

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export default function ContactPanel({ contact, recentCalls = [], onCall, onOpenHistory }) {
  const intl = useIntl();

  if (!contact) return null;

  return (
    <SimpleBar sx={{ height: '100%' }}>
      <Stack sx={{ p: 2.5, gap: 2.5 }}>
        <Stack sx={{ alignItems: 'center', gap: 1, textAlign: 'center' }}>
          <PresenceBadge presence={contact.presence} label={contact.presenceLabel} size={14}>
            <Avatar color="primary" size="xl">
              {initials(contact.name)}
            </Avatar>
          </PresenceBadge>
          <Stack sx={{ gap: 0.25 }}>
            <Typography variant="h5">{contact.name}</Typography>
            {contact.title && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {contact.title}
              </Typography>
            )}
          </Stack>
          <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center' }}>
            <Dot color={contact.presence === 'available' ? 'success' : contact.presence === 'busy' ? 'error' : 'secondary'} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {contact.presenceLabel}
            </Typography>
          </Stack>
        </Stack>

        <Button
          variant="contained"
          color="success"
          startIcon={<PhoneOutlined />}
          onClick={() => onCall?.(contact)}
          disabled={!contact.extension}
        >
          {intl.formatMessage({ id: 'chat.callExtension' }, { extension: contact.extension || '—' })}
        </Button>

        <Divider />

        <Stack sx={{ gap: 1.5 }}>
          <Typography variant="h6">
            <FormattedMessage id="chat.information" />
          </Typography>
          <DetailList
            columns={1}
            dense
            items={[
              { id: 'ext', label: <FormattedMessage id="table.extension" />, value: contact.extension || '—' },
              { id: 'dept', label: <FormattedMessage id="chat.department" />, value: contact.department || '—' },
              { id: 'email', label: <FormattedMessage id="account.email" />, value: contact.email || '—' },
              { id: 'seen', label: <FormattedMessage id="chat.lastSeen" />, value: contact.lastSeen || '—' }
            ]}
          />
        </Stack>

        <Divider />

        <Stack sx={{ gap: 1.5 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">
              <FormattedMessage id="chat.recentCalls" />
            </Typography>
            {onOpenHistory && (
              <Button size="small" color="secondary" startIcon={<HistoryOutlined />} onClick={onOpenHistory}>
                <FormattedMessage id="chat.openHistory" />
              </Button>
            )}
          </Stack>

          {recentCalls.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <FormattedMessage id="chat.recentCalls.empty" />
            </Typography>
          ) : (
            <Stack sx={{ gap: 1.25 }}>
              {recentCalls.map((row) => (
                <Stack key={row.id} direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'center', minWidth: 0 }}>
                    <Dot color={row.status === 'missed' ? 'error' : 'success'} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" noWrap>
                        <FormattedMessage id={`chat.direction.${row.direction}`} />
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {row.time}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                    {row.duration}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </SimpleBar>
  );
}

ContactPanel.propTypes = {
  contact: PropTypes.object,
  recentCalls: PropTypes.array,
  onCall: PropTypes.func,
  onOpenHistory: PropTypes.func
};
