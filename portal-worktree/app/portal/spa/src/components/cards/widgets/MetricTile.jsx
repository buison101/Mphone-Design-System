import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| WIDGET - METRIC TILE ||============================== //
//
// Mantis's first row: the value on top, its label underneath, and a large muted
// glyph on the right. A white card, no fill.
//
// Value above label, which is the opposite of the portal's older StatCard. It is
// kept that way here because it is what the original does and because it is the
// better order for a rack of these: the eye runs down a column of numbers first
// and reads the labels only where a number is surprising.
//
// The glyph is decoration and is hidden from assistive technology — it repeats
// the label and nothing more.

export default function MetricTile({ value, label, icon: Icon, iconColor = 'text.secondary' }) {
  return (
    <MainCard contentSX={{ p: 2.5 }} sx={{ position: 'relative', overflow: 'hidden' }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Stack sx={{ gap: 0.25, minWidth: 0 }}>
          <Typography variant="h4" sx={{ lineHeight: 1.2 }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {label}
          </Typography>
        </Stack>

        {Icon && (
          <Box aria-hidden="true" sx={{ fontSize: 32, lineHeight: 1, color: iconColor, opacity: 0.45, flexShrink: 0 }}>
            <Icon />
          </Box>
        )}
      </Stack>
    </MainCard>
  );
}

MetricTile.propTypes = { value: PropTypes.node, label: PropTypes.node, icon: PropTypes.elementType, iconColor: PropTypes.string };
