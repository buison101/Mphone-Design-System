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

export default function ProgressListCard({ title, action, items = [], footer, state, emptyTitle, emptyDetail }) {
  const empty = !items || items.length === 0;

  return (
    <MainCard title={title} secondary={action}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <Stack sx={{ gap: 2.25 }}>
          {items.map((item, index) => (
            <Stack key={item.id ?? index} direction={{ xs: 'column', sm: 'row' }} sx={{ gap: { xs: 0.75, sm: 2 }, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ width: { sm: 180 }, flexShrink: 0, alignSelf: { xs: 'flex-start', sm: 'center' } }}>
                {item.label}
              </Typography>
              <Box sx={{ flexGrow: 1, width: '100%' }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(0, Math.min(100, item.value ?? 0))}
                  color={item.color || 'primary'}
                  aria-label={item.ariaLabel || undefined}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', width: 44, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
              >
                {item.display ?? `${item.value ?? 0}%`}
              </Typography>
            </Stack>
          ))}

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
