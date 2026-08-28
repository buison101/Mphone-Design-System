import PropTypes from 'prop-types';

// material-ui
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import SimpleBar from 'components/third-party/SimpleBar';
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import Avatar from 'components/@extended/Avatar';
import PresenceBadge from 'components/@extended/PresenceBadge';
import ContentState from 'components/states/ContentState';

// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';

// ==============================|| CHAT - CONVERSATION LIST ||============================== //
//
// The rail: who you are talking to, most recent first. Each row carries the one
// thing that decides whether the reader opens it — the last message — and the
// two that decide whether they open it now: unread count and presence.
//
// Search filters the rail rather than opening a results page. A directory of a
// few hundred extensions does not need a search screen, and losing the list
// while looking for a name in it is the wrong trade.
//
// Presence is drawn as a ring and stated in the subtitle line, never colour
// alone.

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export default function ConversationList({
  conversations = [],
  selectedId,
  onSelect,
  query = '',
  onQueryChange,
  state = 'ready',
  emptyTitle,
  emptyDetail
}) {
  const intl = useIntl();
  const unreadTotal = conversations.reduce((total, row) => total + (row.unread || 0), 0);

  return (
    <Stack sx={{ height: '100%', minHeight: 0 }}>
      <Stack sx={{ p: 2, gap: 1.5 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <Typography variant="h5">
            <FormattedMessage id="chat.title" />
          </Typography>
          {unreadTotal > 0 && <Badge color="error" badgeContent={unreadTotal} sx={{ ml: 1.5 }} />}
        </Stack>
        <TextField
          size="small"
          fullWidth
          value={query}
          onChange={(event) => onQueryChange?.(event.target.value)}
          placeholder={intl.formatMessage({ id: 'chat.search' })}
          aria-label={intl.formatMessage({ id: 'chat.search' })}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              )
            }
          }}
        />
      </Stack>

      <Divider />

      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <SimpleBar sx={{ height: '100%' }}>
          {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

          {state !== 'loading' && conversations.length === 0 && (
            <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />
          )}

          {state !== 'loading' && conversations.length > 0 && (
            <List sx={{ p: 0 }}>
              {conversations.map((row) => (
                <ListItemButton
                  key={row.id}
                  selected={row.id === selectedId}
                  onClick={() => onSelect?.(row)}
                  sx={{ px: 2, py: 1.5, gap: 1.5, alignItems: 'flex-start' }}
                >
                  <PresenceBadge presence={row.presence} label={row.presenceLabel}>
                    <Avatar color="primary" size="sm">
                      {initials(row.name)}
                    </Avatar>
                  </PresenceBadge>

                  <Stack sx={{ minWidth: 0, flexGrow: 1, gap: 0.25 }}>
                    <Stack direction="row" sx={{ gap: 1, alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" noWrap sx={{ minWidth: 0 }}>
                        {row.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
                        {row.time}
                      </Typography>
                    </Stack>
                    <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" noWrap sx={{ color: 'text.secondary', minWidth: 0 }}>
                        {row.preview || row.presenceLabel}
                      </Typography>
                      {row.unread > 0 && (
                        <Box
                          sx={{
                            flexShrink: 0,
                            minWidth: 18,
                            height: 18,
                            px: 0.5,
                            borderRadius: 9,
                            bgcolor: 'error.main',
                            color: 'error.contrastText',
                            fontSize: 11,
                            lineHeight: '18px',
                            textAlign: 'center'
                          }}
                        >
                          {row.unread}
                        </Box>
                      )}
                    </Stack>
                  </Stack>
                </ListItemButton>
              ))}
            </List>
          )}
        </SimpleBar>
      </Box>
    </Stack>
  );
}

ConversationList.propTypes = {
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      preview: PropTypes.string,
      time: PropTypes.string,
      unread: PropTypes.number,
      presence: PropTypes.string,
      presenceLabel: PropTypes.string
    })
  ),
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func,
  query: PropTypes.string,
  onQueryChange: PropTypes.func,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
