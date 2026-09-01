import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import ContentState from 'components/states/ContentState';
import { toneFillSX } from './dataInk';

// ==============================|| DATA CARDS - TASK TIMELINE ||============================== //
//
// The same events as a feed, drawn as a thread. The connector is the whole
// argument for this shape over a plain list: it says these rows are one
// sequence, in order, rather than four unrelated facts that happen to be
// stacked.
//
// The line is decoration and hidden from assistive technology - the order is
// already in the DOM, and a screen reader announcing a rule between every row
// would be reading the drawing rather than the list.
//
// Built from Stack rather than @mui/lab's Timeline: the lab package is not a
// dependency of this portal, and one card is not a reason to add one.

export default function TaskTimelineCard({ title, action, items = [], state, emptyTitle, emptyDetail }) {
  const empty = !items || items.length === 0;

  return (
    <MainCard title={title} secondary={action}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <Stack>
          {items.map((item, index) => {
            const Icon = item.icon;
            const tone = item.color || 'primary';
            const last = index === items.length - 1;

            return (
              <Stack key={item.id ?? index} direction="row" sx={{ gap: 2, position: 'relative', pb: last ? 0 : 2.5 }}>
                {!last && (
                  <Box
                    aria-hidden="true"
                    sx={{ position: 'absolute', left: 15, top: 36, bottom: 4, width: '2px', bgcolor: 'divider', borderRadius: 1 }}
                  />
                )}
                <Avatar size="sm" sx={[toneFillSX(tone), { flexShrink: 0, zIndex: 1 }]}>
                  {Icon ? <Icon aria-hidden="true" /> : null}
                </Avatar>
                <Stack sx={{ gap: 0.25, minWidth: 0, pt: 0.25 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {item.time}
                  </Typography>
                  <Typography variant="body2">{item.primary}</Typography>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      )}
    </MainCard>
  );
}

TaskTimelineCard.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      time: PropTypes.node,
      icon: PropTypes.elementType,
      color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
      primary: PropTypes.node
    })
  ),
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
