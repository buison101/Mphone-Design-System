import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';

// ==============================|| DATA CARDS - MEDIA LIST ||============================== //
//
// A short list of things to watch or read, each with a thumbnail. Mantis ships
// three photographs here; this draws a tinted block with the type's icon in it
// instead, for two reasons. docs/12 rule 6 forbids copying Mantis Pro assets,
// and a thumbnail that arrives late leaves three holes in a card whose whole
// job is to look like a shelf.
//
// The block is decoration: it is hidden from assistive technology and the row's
// type is written in the caption beside the title, so nothing depends on
// recognising the glyph.

export default function MediaListCard({ title, action, items = [], state, emptyTitle, emptyDetail }) {
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
              <Stack key={item.id ?? index} direction="row" sx={{ gap: 2, alignItems: 'center' }}>
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 90,
                    height: 80,
                    flexShrink: 0,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    bgcolor: `${tone}.lighter`,
                    color: `${tone}.dark`
                  }}
                >
                  {Icon ? <Icon /> : null}
                </Box>
                <Stack sx={{ gap: 0.5, minWidth: 0 }}>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {item.meta}
                  </Typography>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      )}
    </MainCard>
  );
}

MediaListCard.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.node,
      meta: PropTypes.node,
      icon: PropTypes.elementType,
      color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info'])
    })
  ),
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
