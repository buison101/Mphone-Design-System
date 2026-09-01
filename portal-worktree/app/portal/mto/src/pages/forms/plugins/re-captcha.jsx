import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| PLUGIN - RECAPTCHA ||============================== //

export default function RecaptchaPage() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 12, lg: 6 }}>
        <MainCard title="Human verification example">
          <Alert color="info" sx={{ mb: 2 }}>
            Local UI Lab simulation. No data is sent to an external verification service.
          </Alert>
          <FormControlLabel control={<Checkbox />} label="I am not a robot" />
        </MainCard>
      </Grid>
    </Grid>
  );
}
