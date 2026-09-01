import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import PresenceBadge from 'components/@extended/PresenceBadge';
import ContentState from 'components/states/ContentState';

// ==============================|| DATA CARDS - PEOPLE LIST ||============================== //
//
// People with something beside them: a role, an action they just took, a line
// they wrote. Mantis draws this shape three times on one screen - Team Members,
// User Activity and New Customers - and the three differ only in what the right
// column carries, so this is one component with three sets of data rather than
// three components to keep in step.
//
// Avatars are initials on a tinted disc, not photographs. Nothing here ships an
// image file: a portrait that has not loaded is a hole in a list, and the only
// portraits available would be Mantis Pro's, which docs/12 rule 6 forbids.
//
// Presence is never the ring alone. PresenceBadge draws it, and the row states
// the same thing in words in its right column, because a green dot is invisible
// to a screen reader and ambiguous to a red-green reader.

// The initials are *text*, so the disc has to clear 4.5:1 rather than the 3:1 an
// icon on the same disc would need. The tint stays and the ink steps to the
// ramp's `dark` end - success.main on success.lighter measures 2.21, success.dark
// measures about 9; warning needed the next step down, so the whole set takes
// `darker` for one ink rule rather than five - and because Ant's dark ramp runs light at that end, the same
// token stays legible on the dark tint without a second value here.

const AVATAR_TONES = ['primary', 'info', 'success', 'warning', 'error'];

function initialsOf(name = '') {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function PeopleListCard({ title, action, items = [], maxHeight, state, emptyTitle, emptyDetail }) {
  const empty = !items || items.length === 0;

  return (
    <MainCard title={title} secondary={action}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <Box sx={maxHeight ? { maxHeight, overflowY: 'auto', mr: -1, pr: 1 } : undefined}>
          <List disablePadding sx={{ '& .MuiListItem-root': { px: 0, py: 1.25 } }}>
            {items.map((item, index) => {
              const MetaIcon = item.metaIcon;
              const tone = item.color || AVATAR_TONES[index % AVATAR_TONES.length];
              const avatar = (
                <Avatar alt={item.name} color={tone} sx={{ color: `${tone}.darker` }}>
                  {initialsOf(item.name)}
                </Avatar>
              );

              return (
                <ListItem key={item.id ?? index} disableGutters>
                  <ListItemAvatar>
                    {item.presence ? (
                      <PresenceBadge presence={item.presence} label={item.presenceLabel}>
                        {avatar}
                      </PresenceBadge>
                    ) : (
                      avatar
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="subtitle1">{item.name}</Typography>}
                    secondary={item.secondary}
                    slotProps={{ secondary: { variant: 'caption', color: 'text.secondary', sx: { mt: 0.25 } } }}
                    sx={{ my: 0, pr: 1 }}
                  />
                  {item.meta && (
                    <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center', flexShrink: 0 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                        {item.meta}
                      </Typography>
                      {MetaIcon && (
                        <MetaIcon aria-hidden="true" style={{ fontSize: '0.75rem', color: 'inherit', opacity: 0.7, lineHeight: 1 }} />
                      )}
                    </Stack>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}
    </MainCard>
  );
}

PeopleListCard.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  maxHeight: PropTypes.number,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      secondary: PropTypes.node,
      meta: PropTypes.node,
      metaIcon: PropTypes.elementType,
      presence: PropTypes.string,
      presenceLabel: PropTypes.string,
      color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info'])
    })
  ),
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
