import PropTypes from 'prop-types';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';

// ==============================|| CARDS - RANKED LIST ||============================== //
//
// A leaderboard: the same measure repeated down a column so the reader compares
// rows, not values. The share is a caption under the count rather than a second
// column, because at 390px a four-column row breaks before the text does.
//
// Rows are only interactive when onSelect is given — a ListItemButton that goes
// nowhere is a lie the keyboard user finds first.

export default function RankedListCard({ title, action, items = [], onSelect, state, emptyTitle, emptyDetail }) {
  const empty = !items || items.length === 0;

  return (
    <MainCard title={title} secondary={action} content={false}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 1.75, px: 2.5 } }}>
          {items.map((item, index) => (
            <ListItemButton
              key={item.id ?? item.primary}
              divider={index < items.length - 1}
              disableRipple={!onSelect}
              {...(onSelect ? { onClick: () => onSelect(item) } : { component: 'div', sx: { cursor: 'default' } })}
            >
              <ListItemText
                primary={<Typography variant="subtitle1">{item.primary}</Typography>}
                secondary={item.secondary}
                slotProps={{ secondary: { variant: 'caption', color: 'text.secondary', noWrap: true } }}
                sx={{ minWidth: 0, pr: 2 }}
              />
              <Stack sx={{ alignItems: 'flex-end', flexShrink: 0 }}>
                <Typography variant="h5" sx={{ color: 'primary.main' }}>
                  {item.value}
                </Typography>
                {item.share && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {item.share}
                  </Typography>
                )}
              </Stack>
            </ListItemButton>
          ))}
        </List>
      )}
    </MainCard>
  );
}

RankedListCard.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      primary: PropTypes.node,
      secondary: PropTypes.node,
      value: PropTypes.node,
      share: PropTypes.node
    })
  ),
  onSelect: PropTypes.func,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
