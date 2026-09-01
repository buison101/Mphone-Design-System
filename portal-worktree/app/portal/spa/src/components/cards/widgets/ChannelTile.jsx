import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import { widgetSurface } from './widgetInk';

// ==============================|| WIDGET - CHANNEL TILE ||============================== //
//
// Mantis's third row: a filled tile with a count, a label, and a glyph in a
// rounded square on the right. In the original the four are Facebook, Twitter,
// LinkedIn and YouTube, and their colours are those brands'.
//
// The layout and the fills are kept exactly. What they are *for* changes: a PBX
// tenant has no social accounts, and the shape is a good one for the things it
// does have several of — extensions, numbers, queues, devices. So the colour is
// a prop rather than a brand, and the caller decides whether it means anything.
//
// The glyph square uses a translucent white or black rather than a second
// colour, so a tile stays one hue no matter which icon it carries.

export default function ChannelTile({ value, label, tone = 'primary', strong = false, icon: Icon }) {
  const surface = widgetSurface(tone, { strong });

  return (
    <MainCard contentSX={{ p: 2.25 }} sx={surface.card} darkSX={surface.cardDark}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Stack sx={{ gap: 0.25, minWidth: 0 }}>
          <Typography variant="h4" sx={{ color: 'inherit', lineHeight: 1.15 }}>
            {value}
          </Typography>
          {/* 0.85 took white on the blue fill to 4.2 in dark mode; the label is
              12px, so it needs the full ink */}
          <Typography variant="caption" sx={{ color: 'inherit', fontWeight: 500 }}>
            {label}
          </Typography>
        </Stack>

        {Icon && (
          <Box
            aria-hidden="true"
            sx={(theme) => ({
              flexShrink: 0,
              width: 40,
              height: 40,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: 'inherit',
              ...surface.watermarkFill(theme)
            })}
          >
            <Icon />
          </Box>
        )}
      </Stack>
    </MainCard>
  );
}

ChannelTile.propTypes = {
  value: PropTypes.node,
  label: PropTypes.node,
  tone: PropTypes.oneOf(['primary', 'warning', 'success', 'info', 'error', 'dark']),
  strong: PropTypes.bool,
  icon: PropTypes.elementType
};
