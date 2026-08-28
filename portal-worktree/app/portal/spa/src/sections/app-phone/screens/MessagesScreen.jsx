import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import { useIntl } from 'react-intl';

// project imports
import Avatar from 'components/@extended/Avatar';
import PresenceBadge from 'components/@extended/PresenceBadge';

// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';

// ==============================|| APP PHONE - MESSAGES ||============================== //
//
// The conversation list, unread first by weight rather than by order: reordering
// the list when a message arrives moves the row the reader was reaching for.
//
// Presence rides on the avatar and repeats in the subtitle when there is no
// preview, so the state is never carried by the ring alone.

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length
    ? parts
        .slice(-2)
        .map((p) => p.charAt(0).toUpperCase())
        .join('')
    : '?';
}

export default function MessagesScreen({ threads = [], onOpen }) {
  const intl = useIntl();
  const presenceLabel = (presence) => intl.formatMessage({ id: `chat.presence.${presence || 'unknown'}` });

  return (
    <Stack sx={{ flexGrow: 1, minHeight: 0 }}>
      <Box sx={{ p: 1.5 }}>
        <TextField
          fullWidth
          size="small"
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
      </Box>

      <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto' }}>
        <List sx={{ p: 0 }}>
          {threads.map((row, index) => (
            <ListItemButton
              key={row.id}
              divider={index < threads.length - 1}
              onClick={() => onOpen?.(row)}
              sx={{ px: 2, py: 1.5, gap: 1.5 }}
            >
              <PresenceBadge presence={row.presence} label={presenceLabel(row.presence)}>
                <Avatar color="primary" size="sm">
                  {initials(row.name)}
                </Avatar>
              </PresenceBadge>
              <Stack sx={{ minWidth: 0, flexGrow: 1, gap: 0.25 }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, alignItems: 'baseline' }}>
                  <Typography variant="subtitle2" noWrap sx={{ fontWeight: row.unread ? 700 : undefined }}>
                    {row.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
                    {row.time}
                  </Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
                  <Typography
                    variant="caption"
                    noWrap
                    sx={{ color: row.unread ? 'text.primary' : 'text.secondary', minWidth: 0, fontWeight: row.unread ? 600 : undefined }}
                  >
                    {row.preview || presenceLabel(row.presence)}
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
      </Box>
    </Stack>
  );
}

MessagesScreen.propTypes = { threads: PropTypes.array, onOpen: PropTypes.func };
