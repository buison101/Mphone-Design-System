// material-ui
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// ==============================|| LOADER ||============================== //

export default function Loader() {
  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 2001, display: 'grid', placeItems: 'center', bgcolor: 'background.default' }}>
      <CircularProgress color="inherit" sx={{ color: 'text.secondary' }} />
    </Box>
  );
}
