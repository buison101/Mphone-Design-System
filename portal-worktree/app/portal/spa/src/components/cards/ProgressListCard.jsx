import PropTypes from 'prop-types';

// material-ui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';

// ==============================|| CARDS - PROGRESS LIST ||============================== //
//
// Several parts of one whole, each read as a proportion. The bars share a track
// so the eye compares lengths on a common baseline; that is the only reason to
// prefer this over four separate meters.
//
// Every bar carries its own aria-label and its percentage in text beside it.
// A progress bar with the number only in the fill is unreadable to anyone who
// cannot see the fill.
//
// Two layouts, one component. `inline` puts the label, the bar and the figure on
// one line, which is the denser of the two and the right one beside other rows
// of text. `stacked` lifts the label and figure above a full-width bar, which is
// what a card gives the bars when their labels are long enough that an inline
// label would squeeze every bar into the last third of the card.

export default function ProgressListCard({
  title,
  action,
  subheader,
  layout = 'inline',
  items = [],
  footer,
  state,
  emptyTitle,
  emptyDetail
}) {
  const empty = !items || items.length === 0;
  const stacked = layout === 'stacked';

  return (
    <MainCard title={title} secondary={action} subheader={subheader}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <Stack sx={{ gap: 2.25 }}>
          {items.map((item, index) => {
            const bar = (
              <LinearProgress
                variant="determinate"
                value={Math.max(0, Math.min(100, item.value ?? 0))}
                color={item.color || 'primary'}
                aria-label={item.ariaLabel || undefined}
              />
            );
            const figure = item.display ?? `${item.value ?? 0}%`;

            if (stacked) {
              return (
                <Stack key={item.id ?? index} sx={{ gap: 1 }}>
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                      {figure}
                    </Typography>
                  </Stack>
                  <Box>{bar}</Box>
                </Stack>
              );
            }

            return (
              <Stack key={item.id ?? index} direction={{ xs: 'column', sm: 'row' }} sx={{ gap: { xs: 0.75, sm: 2 }, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ width: { sm: 180 }, flexShrink: 0, alignSelf: { xs: 'flex-start', sm: 'center' } }}>
                  {item.label}
                </Typography>
                <Box sx={{ flexGrow: 1, width: '100%' }}>{bar}</Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', width: 44, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
                >
                  {figure}
                </Typography>
              </Stack>
            );
          })}

          {footer && (
            <>
              <Divider sx={{ mt: 0.5 }} />
              <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                {footer.icon && (
                  <Avatar sx={{ color: `${footer.color || 'primary'}.main`, bgcolor: `${footer.color || 'primary'}.lighter` }}>
                    <footer.icon />
                  </Avatar>
                )}
                <Stack sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1">{footer.title}</Typography>
                  {footer.description && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {footer.description}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </>
          )}
        </Stack>
      )}
    </MainCard>
  );
}

ProgressListCard.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  subheader: PropTypes.node,
  layout: PropTypes.oneOf(['inline', 'stacked']),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.node,
      value: PropTypes.number,
      display: PropTypes.node,
      ariaLabel: PropTypes.string,
      color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info'])
    })
  ),
  footer: PropTypes.shape({
    icon: PropTypes.elementType,
    color: PropTypes.string,
    title: PropTypes.node,
    description: PropTypes.node
  }),
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
