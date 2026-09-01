import { Link, useSearchParams } from 'react-router-dom';

// third-party
import { FormattedMessage } from 'react-intl';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import useAuth from 'hooks/useAuth';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/jwt/AuthLogin';

// ================================|| JWT - LOGIN ||================================ //

export default function Login() {
  const { isLoggedIn } = useAuth();

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth');

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">
              <FormattedMessage id="auth.login.title" />
            </Typography>
            <Typography
              component={Link}
              to={isLoggedIn ? '/auth/register' : auth ? `/${auth}/register?auth=jwt` : '/register'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              <FormattedMessage id="auth.login.noAccount" />
            </Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <AuthLogin isDemo={isLoggedIn} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
