import { Link, useSearchParams } from 'react-router-dom';

// third-party
import { FormattedMessage } from 'react-intl';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import useAuth from 'hooks/useAuth';
import AnimateButton from 'components/@extended/AnimateButton';
import AuthWrapper from 'sections/auth/AuthWrapper';

// ================================|| AWS - CHECK MAIL ||================================ //

export default function CheckMail() {
  const { isLoggedIn } = useAuth();

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth'); // get auth and set route based on that

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">
              <FormattedMessage id="auth.checkMail.title" />
            </Typography>
            <Typography sx={{ color: 'secondary.main', mb: 0.5, mt: 1.25 }}>
              <FormattedMessage id="auth.checkMail.body" />
            </Typography>
          </Box>
        </Grid>
        <Grid size={12}>
          <AnimateButton>
            <Button
              component={Link}
              to={isLoggedIn ? '/auth/login' : auth ? `/${auth}/login?auth=aws` : '/login'}
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              <FormattedMessage id="auth.signIn" />
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
