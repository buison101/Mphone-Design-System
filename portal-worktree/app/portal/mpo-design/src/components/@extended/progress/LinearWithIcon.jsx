import PropTypes from 'prop-types';

// material-ui
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// ==============================|| PROGRESS - LINEAR ICON ||============================== //

export default function LinearWithIcon({ icon, value, ...others }) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
      <LinearProgress variant="determinate" value={value} sx={{ flex: 1 }} {...others} />
      <Box sx={{ minWidth: 35 }}>{icon}</Box>
    </Stack>
  );
}

LinearWithIcon.propTypes = { icon: PropTypes.any, value: PropTypes.any, others: PropTypes.any };
