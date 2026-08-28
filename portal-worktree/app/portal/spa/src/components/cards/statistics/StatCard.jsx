import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| STATISTICS - STAT CARD ||============================== //

export default function StatCard({ title, count, color = 'primary', caption, featured = false }) {
  return (
    <MainCard
      contentSX={{ p: 2.25 }}
      sx={
        featured
          ? {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              borderColor: 'primary.main',
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0))'
            }
          : undefined
      }
    >
      <Stack sx={{ gap: 0.5 }}>
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
  featured: PropTypes.bool
};
