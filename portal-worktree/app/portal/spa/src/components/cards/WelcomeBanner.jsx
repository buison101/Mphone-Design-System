import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| CARDS - WELCOME BANNER ||============================== //
//
// The full-width opener of a dashboard: one sentence of orientation and at most
// one action. It is the only surface on the page allowed to fill with brand
// colour, which is what buys the rest of the page its calm.
//
// The artwork is drawn, not imported. A bitmap would need a second file for the
// dark scheme and would pixelate on a 2x display; an inline shape inherits the
// scheme and costs no request.

function BannerArtwork() {
  return (
    <Box
      aria-hidden="true"
      component="svg"
      viewBox="0 0 240 160"
      sx={{ width: { xs: 160, sm: 200, md: 240 }, height: 'auto', flexShrink: 0, opacity: 0.9 }}
    >
      <circle cx="188" cy="52" r="46" fill="rgba(255,255,255,0.12)" />
      <rect x="86" y="34" width="70" height="106" rx="12" fill="rgba(255,255,255,0.18)" />
      <rect x="94" y="46" width="54" height="72" rx="6" fill="rgba(255,255,255,0.28)" />
      <rect x="110" y="126" width="22" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
      {[
        [26, 96, 22],
        [40, 84, 46],
        [54, 72, 70],
        [68, 88, 54]
      ].map(([x, y, h]) => (
        <rect key={x} x={x} y={y} width="8" height={h} rx="4" fill="rgba(255,255,255,0.35)" />
      ))}
      <path d="M164 92c14 0 22-10 30-26" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="196" cy="62" r="6" fill="rgba(255,255,255,0.75)" />
    </Box>
  );
}

export default function WelcomeBanner({ title, description, actionLabel, onAction, artwork = true }) {
  return (
    <MainCard
      border={false}
      content={false}
      sx={{
        overflow: 'hidden',
        color: 'primary.contrastText',
        bgcolor: 'primary.main',
        backgroundImage: (theme) =>
          `linear-gradient(135deg, ${theme.vars.palette.primary.dark} 0%, ${theme.vars.palette.primary.main} 55%, ${theme.vars.palette.primary[400]} 100%)`
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, p: { xs: 2.5, md: 3.5 } }}
      >
        <Stack sx={{ gap: 1.5, maxWidth: 520, minWidth: 0 }}>
          <Typography variant="h3" sx={{ color: 'inherit' }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.86 }}>
              {description}
            </Typography>
          )}
          {actionLabel && onAction && (
            <Box>
              <Button
                variant="contained"
                onClick={onAction}
                sx={{
                  mt: 0.5,
                  bgcolor: 'rgba(255,255,255,0.18)',
                  color: 'inherit',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' }
                }}
              >
                {actionLabel}
              </Button>
            </Box>
          )}
        </Stack>
        {artwork && (
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            <BannerArtwork />
          </Box>
        )}
      </Stack>
    </MainCard>
  );
}

WelcomeBanner.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  actionLabel: PropTypes.node,
  onAction: PropTypes.func,
  artwork: PropTypes.bool
};
