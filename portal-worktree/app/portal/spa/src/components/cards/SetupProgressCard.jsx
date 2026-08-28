import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| CARDS - SETUP PROGRESS ||============================== //
//
// A single completion figure with the work still outstanding named underneath.
// It is a prompt, not a metric: it leaves the page once the tenant reaches 100%,
// which is why it never lands in the stat row with numbers that stay.
//
// Filled with brand colour like the banner, so a page cannot end up with two
// competing "look here" surfaces at different strengths.

export default function SetupProgressCard({ title, description, value = 0, valueLabel, remaining = [] }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <MainCard
      border={false}
      content={false}
      sx={{
        height: '100%',
        color: 'primary.contrastText',
        bgcolor: 'primary.main',
        backgroundImage: (theme) =>
          `linear-gradient(135deg, ${theme.vars.palette.primary.dark} 0%, ${theme.vars.palette.primary.main} 100%)`
      }}
    >
      <Stack sx={{ gap: 2, p: 2.75, height: '100%', justifyContent: 'space-between' }}>
        <Stack sx={{ gap: 1 }}>
          <Typography variant="h5" sx={{ color: 'inherit' }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.84 }}>
              {description}
            </Typography>
          )}
        </Stack>

        <Stack sx={{ gap: 1 }}>
          <Typography variant="h3" sx={{ color: 'inherit' }}>
            {valueLabel ?? `${clamped}%`}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={clamped}
            aria-label={typeof title === 'string' ? title : undefined}
            sx={{
              bgcolor: 'rgba(255,255,255,0.24)',
              '& .MuiLinearProgress-bar': { bgcolor: 'primary.contrastText' }
            }}
          />
          {remaining.length > 0 && (
            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.25 }}>
              {remaining.map((step, index) => (
                <Typography key={index} component="li" variant="caption" sx={{ color: 'inherit', opacity: 0.84 }}>
                  {step}
                </Typography>
              ))}
            </Box>
          )}
        </Stack>
      </Stack>
    </MainCard>
  );
}

SetupProgressCard.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  value: PropTypes.number,
  valueLabel: PropTypes.node,
  remaining: PropTypes.array
};
