import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| STATISTICS - STAT CARD ||============================== //
//
// The plain tile: a label, a number, and optionally a short chip beside it.
//
// `icon` is the shape Mantis draws in the first row of its statistics page — a
// large, faint glyph in the corner. It is decoration and is hidden from
// assistive technology, because it never says anything the label does not. It
// is a prop rather than a fourth component: a tile with a watermark and a tile
// without one are the same tile, and splitting them would leave two files to
// keep in step.

export default function StatCard({ title, count, color = 'primary', caption, featured = false, icon: Icon }) {
  return (
    <MainCard
      contentSX={{ p: 2.25 }}
      sx={
        featured
          ? {
              position: 'relative',
              overflow: 'hidden',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderColor: 'primary.main',
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0))'
            }
          : { position: 'relative', overflow: 'hidden' }
      }
    >
      {Icon && (
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            right: 10,
            bottom: 6,
            fontSize: 44,
            lineHeight: 1,
            opacity: featured ? 0.24 : 0.18,
            color: featured ? 'inherit' : 'text.secondary',
            pointerEvents: 'none'
          }}
        >
          <Icon />
        </Box>
      )}

      <Stack sx={{ gap: 0.5, position: 'relative' }}>
        <Typography variant="h6" sx={{ color: featured ? 'rgba(255,255,255,0.78)' : 'text.secondary' }}>
          {title}
        </Typography>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25 }}>
          <Typography variant="h4" sx={{ color: 'inherit' }}>
            {count}
          </Typography>
          {caption && (
            <Chip
              variant={featured ? 'filled' : 'combined'}
              color={featured ? 'default' : color}
              label={caption}
              size="small"
              sx={featured ? { bgcolor: 'rgba(255,255,255,0.16)', color: 'inherit' } : undefined}
            />
          )}
        </Stack>
      </Stack>
    </MainCard>
  );
}

StatCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  caption: PropTypes.string,
  featured: PropTypes.bool,
  icon: PropTypes.elementType
};
