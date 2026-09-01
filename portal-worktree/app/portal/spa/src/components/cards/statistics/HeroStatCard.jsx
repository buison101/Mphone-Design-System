import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import { widgetSurface } from 'components/cards/widgets/widgetInk';

// ==============================|| STATISTICS - HERO STAT CARD ||============================== //
//
// The one number a page leads with. Exactly one per view.
//
// Mantis's statistics page has nineteen numbers at display size and three
// filled cards side by side, each shouting equally. That is not a hierarchy, it
// is nineteen headlines — and a page where everything is emphasised has nothing
// emphasised. This card exists so a page can have a single largest figure and
// everything else can be smaller on purpose.
//
// The value is `component="p"`. `variant="h1"` maps to an <h1> element in MUI,
// which is how a decorative numeral on the maintenance screens ended up as the
// page's accessible name in v2.10.0. Display type is not an outline.
//
// No tabular-nums. Equal-width digits are for columns that align vertically;
// at 48px they make a figure like 1.641 look gap-toothed.
//
// The fill is optional and is the only place this card spends colour. When it is
// filled it is because it is the page's subject, not because a blue card looks
// nice next to an amber one.

export default function HeroStatCard({ title, value, caption, compare, filled = false, icon: Icon }) {
  // `strong`: the filled hero carries 16px and 12px text, and white on
  // primary.main measures 4.10 flat — the large-text allowance does not reach
  // them. primary.dark takes the same white to 6.16, same blue family. In dark
  // mode the fill already measures 5.19, so widgetSurface ignores strong there.
  const surface = widgetSurface('primary', { strong: true });

  return (
    <MainCard
      contentSX={{ p: { xs: 2.5, sm: 3 } }}
      darkSX={filled ? surface.cardDark : undefined}
      sx={(theme) =>
        filled
          ? {
              position: 'relative',
              overflow: 'hidden',
              ...surface.card(theme),
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0))'
            }
          : { position: 'relative', overflow: 'hidden' }
      }
    >
      {/* Mantis watermarks these cards with a large icon. Kept, at an opacity
          that cannot compete with the figure, and hidden from assistive
          technology: it repeats the title and nothing else. */}
      {Icon && (
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            right: -8,
            bottom: -12,
            fontSize: 108,
            lineHeight: 1,
            opacity: filled ? 0.16 : 0.06,
            color: filled ? 'inherit' : 'text.primary',
            pointerEvents: 'none'
          }}
        >
          <Icon />
        </Box>
      )}

      <Stack sx={{ gap: 0.5, position: 'relative' }}>
        <Typography variant="h6" sx={{ color: filled ? 'rgba(255,255,255,0.9)' : 'text.secondary' }}>
          {title}
        </Typography>

        <Typography
          component="p"
          variant="h1"
          sx={{ color: 'inherit', fontSize: { xs: '2.75rem', sm: '3.25rem' }, lineHeight: 1.1, letterSpacing: '-0.02em' }}
        >
          {value}
        </Typography>

        {caption && (
          <Typography variant="body2" sx={{ color: filled ? 'rgba(255,255,255,0.9)' : 'text.secondary' }}>
            {caption}
          </Typography>
        )}

        {compare && (
          <Typography variant="caption" sx={{ mt: 0.5, color: filled ? 'rgba(255,255,255,0.9)' : 'text.secondary' }}>
            {compare}
          </Typography>
        )}
      </Stack>
    </MainCard>
  );
}

HeroStatCard.propTypes = {
  title: PropTypes.node,
  value: PropTypes.node,
  caption: PropTypes.node,
  compare: PropTypes.node,
  filled: PropTypes.bool,
  icon: PropTypes.elementType
};
