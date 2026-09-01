import PropTypes from 'prop-types';

// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import WidgetMotif from './WidgetMotif';
import { widgetSurface } from './widgetInk';

// ==============================|| WIDGET - ILLUSTRATED METRIC CARD ||============================== //
//
// Mantis's sixth row: a filled card with the figure centred over a decorative
// field. Layout and fills kept; the illustration is drawn rather than shipped
// (see WidgetMotif), and the ink is chosen by measurement (see widgetInk).
//
// The motif is masked clear of the middle third, so the value and label sit on
// the flat fill. That is what makes the contrast figures in widgetInk.js true of
// the rendered card rather than of a swatch — a pattern drawn between the fill
// and the text would change the number under every glyph.

export default function IllustratedMetricCard({ value, label, tone = 'success', motif = 'waves', strong = false }) {
  const surface = widgetSurface(tone, { strong });

  return (
    <MainCard
      contentSX={{ p: 3 }}
      darkSX={surface.cardDark}
      sx={(theme) => ({ position: 'relative', overflow: 'hidden', ...surface.card(theme) })}
    >
      <WidgetMotif motif={motif} sx={surface.motif} />

      <Stack sx={{ position: 'relative', alignItems: 'center', gap: 0.25, textAlign: 'center' }}>
        <Typography component="p" variant="h2" sx={{ color: 'inherit', lineHeight: 1.1 }}>
          {value}
        </Typography>
        {/* full ink: at 0.88 the label measured 4.39 on the blue fill in dark mode */}
        <Typography variant="body2" sx={{ color: 'inherit' }}>
          {label}
        </Typography>
      </Stack>
    </MainCard>
  );
}

IllustratedMetricCard.propTypes = {
  value: PropTypes.node,
  label: PropTypes.node,
  tone: PropTypes.oneOf(['primary', 'warning', 'success', 'info', 'error', 'dark']),
  strong: PropTypes.bool,
  motif: PropTypes.oneOf(['waves', 'nodes', 'grid'])
};
