import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'components/MainCard';

export default function MetricCard({ caption, color = 'primary', icon, title, value }) {
  return (
    <MainCard>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Stack sx={{ minWidth: 0, gap: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </Typography>
          {caption && (
            <Typography variant="caption" color="text.secondary">
              {caption}
            </Typography>
          )}
        </Stack>
        <Avatar variant="rounded" sx={{ color: `${color}.main`, bgcolor: `${color}.lighter`, width: 42, height: 42 }}>
          {icon}
        </Avatar>
      </Stack>
    </MainCard>
  );
}

MetricCard.propTypes = {
  caption: PropTypes.node,
  color: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};
