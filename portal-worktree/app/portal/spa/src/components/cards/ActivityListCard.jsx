import PropTypes from 'prop-types';

// material-ui
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';

// ==============================|| CARDS - ACTIVITY LIST ||============================== //
//
// What happened, in order, with the outcome on the right. The status lives in
// the avatar's colour and its icon together, never in colour alone — the icon is
// what survives a monochrome print and a red-green reader.
//
// The secondary line carries the time. It is deliberately the smallest thing in
// the row: a reader scanning for the event should not have to read past a
// timestamp to reach it.

const avatarSX = { width: 36, height: 36, fontSize: '1rem' };

const actionSX = { mt: 0.75, ml: 1, top: 'auto', right: 'auto', alignSelf: 'flex-start', transform: 'none', position: 'relative' };

export default function ActivityListCard({ title, action, items = [], onSelect, state, emptyTitle, emptyDetail }) {
  const empty = !items || items.length === 0;

  return (
    <MainCard title={title} secondary={action} content={false}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <List
          component="nav"
          sx={{
            p: 0,
            '& .MuiListItemButton-root': {
              py: 1.5,
              px: 2.5,
              '& .MuiAvatar-root': avatarSX,
              '& .MuiListItemSecondaryAction-root': actionSX
            }
          }}
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            const tone = item.color || 'primary';
            return (
              <ListItem
                key={item.id ?? index}
                component={ListItemButton}
                divider={index < items.length - 1}
                disableRipple={!onSelect}
                {...(onSelect ? { onClick: () => onSelect(item) } : { sx: { cursor: 'default' } })}
                secondaryAction={
                  <Stack sx={{ alignItems: 'flex-end' }}>
                    <Typography variant="subtitle1" noWrap>
                      {item.value}
                    </Typography>
                    {item.meta && (
                      <Typography variant="h6" sx={{ color: 'text.secondary' }} noWrap>
                        {item.meta}
                      </Typography>
                    )}
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ color: `${tone}.main`, bgcolor: `${tone}.lighter` }}>{Icon ? <Icon /> : null}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">{item.primary}</Typography>}
                  secondary={item.secondary}
                  slotProps={{ secondary: { variant: 'caption', color: 'text.secondary' } }}
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </MainCard>
  );
}

ActivityListCard.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      icon: PropTypes.elementType,
      color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
      primary: PropTypes.node,
      secondary: PropTypes.node,
      value: PropTypes.node,
      meta: PropTypes.node
    })
  ),
  onSelect: PropTypes.func,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
