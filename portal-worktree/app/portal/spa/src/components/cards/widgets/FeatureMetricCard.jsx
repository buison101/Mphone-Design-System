import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import { widgetSurface } from './widgetInk';

// ==============================|| WIDGET - FEATURE METRIC CARD ||============================== //
//
// Mantis's second row: a filled card with a large watermark glyph on the left,
// the title and a 56px value ranged right, and a darker footer strip carrying a
// supporting figure.
//
// Layout kept as the original draws it, including the footer band — that band is
// not decoration, it is what lets the caption clear contrast on the blue fill
// (4.10 on the flat colour, 5.69 on the band).
//
// The title ships at weight 600. At 20px regular it is "small text" and needs
// 4.5:1, which white on primary misses; at 20px semibold it clears the
// large-text bar of 3:1 that the same pair passes. One weight step, no hue
// change. Ink selection is in widgetInk.js with the measurements behind it.

export default function FeatureMetricCard({ title, value, footer, tone = 'primary', strong = false, icon: Icon }) {
  const surface = widgetSurface(tone, { strong });

  return (
    <MainCard
      content={false}
      darkSX={surface.cardDark}
      sx={(theme) => ({ position: 'relative', overflow: 'hidden', ...surface.card(theme) })}
    >
      {Icon && (
        <Box
          aria-hidden="true"
          sx={[{ position: 'absolute', left: -10, bottom: -18, fontSize: 132, lineHeight: 1, pointerEvents: 'none' }, surface.watermarkInk]}
        >
          <Icon />
        </Box>
      )}

      <Stack sx={{ position: 'relative', px: 2.75, pt: 2.5, pb: 2.25, alignItems: 'flex-end', gap: 0.5 }}>
        <Typography variant="h5" sx={{ color: 'inherit', fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography component="p" variant="h1" sx={{ color: 'inherit', fontSize: '3.5rem', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          {value}
        </Typography>
      </Stack>

      {footer && (
        <Box sx={[{ position: 'relative', px: 2.75, py: 1.25, textAlign: 'right' }, surface.band]}>
          <Typography variant="body2" sx={{ color: 'inherit' }}>
            {footer}
          </Typography>
        </Box>
      )}
    </MainCard>
  );
}

FeatureMetricCard.propTypes = {
  title: PropTypes.node,
  value: PropTypes.node,
  footer: PropTypes.node,
  tone: PropTypes.oneOf(['primary', 'warning', 'success', 'info', 'error', 'dark']),
  strong: PropTypes.bool,
  icon: PropTypes.elementType
};
