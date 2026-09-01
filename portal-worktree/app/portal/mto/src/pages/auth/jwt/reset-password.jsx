// material-ui
import Grid from '@mui/material/Grid';

// third-party
import { FormattedMessage } from 'react-intl';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthResetPassword from 'sections/auth/jwt/AuthResetPassword';

// ================================|| JWT - RESET PASSWORD ||================================ //

export default function ResetPassword() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack sx={{ gap: 1, mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">
              <FormattedMessage id="auth.reset.title" />
            </Typography>
            <Typography sx={{ color: 'secondary.main' }}>
              <FormattedMessage id="auth.reset.body" />
            </Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <AuthResetPassword />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
