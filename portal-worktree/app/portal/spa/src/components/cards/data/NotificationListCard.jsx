import PropTypes from 'prop-types';

// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import ContentState from 'components/states/ContentState';

// ==============================|| DATA CARDS - NOTIFICATION LIST ||============================== //
//
// What happened, oldest habit of every dashboard. The time sits in its own left
// gutter rather than trailing the sentence, which is what lets four rows of very
// different lengths line up as a column a reader can scan down.
//
// The gutter is a fixed width and the text wraps beside it. At 390px the gutter
// is what would break the row, so it collapses above the message there instead
// of squeezing every headline into four words.

export default function NotificationListCard({ title, action, items = [], state, emptyTitle, emptyDetail }) {
  const empty = !items || items.length === 0;

  return (
    <MainCard title={title} secondary={action}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <Stack sx={{ gap: 2.5 }}>
          {items.map((item, index) => {
            const Icon = item.icon;
            const tone = item.color || 'primary';

            return (
              <Stack
                key={item.id ?? index}
                direction={{ xs: 'column', sm: 'row' }}
                sx={{ gap: { xs: 0.75, sm: 2 }, alignItems: { sm: 'flex-start' } }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', width: { sm: 72 }, flexShrink: 0, pt: { sm: 1.25 }, whiteSpace: 'nowrap' }}
                >
                  {item.time}
                </Typography>
                <Stack direction="row" sx={{ gap: 1.5, alignItems: 'flex-start', minWidth: 0 }}>
                  <Avatar color={tone} sx={{ flexShrink: 0 }}>
                    {Icon ? <Icon aria-hidden="true" /> : null}
                  </Avatar>
                  <Stack sx={{ gap: 0.25, minWidth: 0 }}>
                    <Typography variant="subtitle1">{item.primary}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {item.secondary}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      )}
    </MainCard>
  );
}

NotificationListCard.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      time: PropTypes.node,
      icon: PropTypes.elementType,
      color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
      primary: PropTypes.node,
      secondary: PropTypes.node
    })
  ),
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
