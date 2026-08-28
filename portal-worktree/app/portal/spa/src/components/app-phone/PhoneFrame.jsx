import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ==============================|| APP PHONE - DEVICE FRAME ||============================== //
//
// A fixed 360 × 780 viewport, the reference device in the app's own UI audit.
// Designing app screens at desktop width and hoping they survive the phone is
// how the two products drift apart; this makes the constraint visible while the
// screen is being drawn.
//
// The frame is a bezel, not a photograph of a handset. A realistic device shell
// invites people to judge the picture instead of the screen inside it, and it
// dates the moment the reference phone changes.
//
// Content scrolls inside the frame, never the page. The status strip is fake and
// says so by carrying the screen's own label rather than a pretend clock and
// battery — nobody should mistake it for a real capture.

const WIDTH = 360;
const HEIGHT = 780;

export default function PhoneFrame({ label, children }) {
  return (
    <Stack sx={{ alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: WIDTH,
          height: HEIGHT,
          maxWidth: '100%',
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: (theme) => theme.vars.customShadows.z1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {children}
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label} · {WIDTH} × {HEIGHT}
      </Typography>
    </Stack>
  );
}

PhoneFrame.propTypes = { label: PropTypes.node, children: PropTypes.node };
