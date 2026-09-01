// material-ui
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// project imports
import MainCard from 'components/MainCard';

const examples = [
  'Theme Variants',
  'Regional Map',
  'Markers & Popups',
  'Draggable Marker',
  'Geo JSON Animation',
  'Clusters',
  'Interaction',
  'Viewport Animation',
  'Highlight By Filter',
  'Heatmap'
];

function LocalMapPreview() {
  return (
    <Box
      sx={{
        minHeight: 260,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 1,
        bgcolor: 'grey.100',
        backgroundImage: (theme) =>
          `linear-gradient(${theme.vars.palette.divider} 1px, transparent 1px), linear-gradient(90deg, ${theme.vars.palette.divider} 1px, transparent 1px)`,
        backgroundSize: '28px 28px'
      }}
    >
      <Stack sx={{ alignItems: 'center', gap: 1, p: 3, textAlign: 'center' }}>
        <Typography variant="h5">Local map simulation</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 420 }}>
          Map composition is preserved without loading remote tiles or geographic datasets.
        </Typography>
      </Stack>
    </Box>
  );
}

// ==============================|| MAPLIBRE - MAP ||============================== //

export default function Map() {
  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Alert color="info">Local UI Lab preview. External map services are disabled.</Alert>
      </Grid>
      {examples.map((title, index) => (
        <Grid key={title} size={{ xs: 12, md: index > 1 ? 6 : 12 }}>
          <MainCard title={title}>
            <LocalMapPreview />
          </MainCard>
        </Grid>
      ))}
    </Grid>
  );
}
