import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import Dot from 'components/@extended/Dot';
import ContentState from 'components/states/ContentState';
import { toneFillSX } from './dataInk';

// ==============================|| DATA CARDS - FEED LIST ||============================== //
//
// A stream of small events, each one a line. Mantis draws this twice with two
// different markers - a filled disc holding an icon, and a bare dot - so the
// marker is a prop rather than a second component.
//
// The filled marker takes its ink from dataInk, not from Mantis. An icon is a
// graphical object and needs 3:1 against its own background; white on
// success.main measures 2.27, so a white glyph on the green disc is a shape
// nobody can make out. The disc stays green.
//
// The dot marker never carries meaning on its own. Where the dot is the only
// colour in the row, the row's text says the same thing in words.

export default function FeedListCard({ title, action, items = [], marker = 'avatar', maxHeight, state, emptyTitle, emptyDetail }) {
  const empty = !items || items.length === 0;

  return (
    <MainCard title={title} secondary={action}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <Box sx={maxHeight ? { maxHeight, overflowY: 'auto', mr: -1, pr: 1 } : undefined}>
          <Stack sx={{ gap: marker === 'dot' ? 2 : 2.5 }}>
            {items.map((item, index) => {
              const Icon = item.icon;
              const tone = item.color || 'primary';

              return (
                <Stack key={item.id ?? index} direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                  {marker === 'dot' ? (
                    <Dot color={tone} size={10} sx={{ flexShrink: 0 }} />
                  ) : (
                    <Avatar size="sm" sx={[toneFillSX(tone), { flexShrink: 0 }]}>
                      {Icon ? <Icon aria-hidden="true" /> : null}
                    </Avatar>
                  )}
                  <Typography variant="body2" sx={{ flexGrow: 1, minWidth: 0 }}>
                    {item.primary}
                  </Typography>
                  {item.meta && (
                    <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {item.meta}
                    </Typography>
                  )}
                </Stack>
              );
            })}
          </Stack>
        </Box>
      )}
    </MainCard>
  );
}

FeedListCard.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      icon: PropTypes.elementType,
      color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
      primary: PropTypes.node,
      meta: PropTypes.node
    })
  ),
  marker: PropTypes.oneOf(['avatar', 'dot']),
  maxHeight: PropTypes.number,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
