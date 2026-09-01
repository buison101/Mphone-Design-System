import PropTypes from 'prop-types';

// third-party
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// project imports
import AuthFooter from 'components/cards/AuthFooter';
import Logo from 'components/logo';
import AuthCard from './AuthCard';
import LoginProvider from './LoginProvider';

import useAuth from 'hooks/useAuth';

// assets
import AuthBackground from './AuthBackground';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }) {
  const { isLoggedIn } = useAuth();

  const [searchParams] = useSearchParams();
  const authParam = searchParams.get('auth') || '';

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AuthBackground />
      <Stack sx={{ minHeight: '100vh', justifyContent: 'flex-end' }}>
        <Box sx={{ px: 3, mt: 3 }}>
          <Logo to="/" />
        </Box>
        <Box>
          <Grid
            container
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: { xs: 'calc(100vh - 210px)', sm: 'calc(100vh - 134px)', md: 'calc(100vh - 132px)' }
            }}
          >
            <Grid>
              {!isLoggedIn && authParam && (
                <Box sx={{ maxWidth: { xs: 400, lg: 475 }, margin: { xs: 2.5, md: 3 }, '& > *': { flexGrow: 1, flexBasis: '50%' } }}>
                  <Alert variant="border" color="primary" icon={<ExclamationCircleOutlined />}>
                    <Typography variant="h5">
                      <FormattedMessage id="auth.demo.title" />
                    </Typography>
                    <Typography variant="h6">
                      <FormattedMessage id="auth.demo.body" />
                    </Typography>
                  </Alert>
                </Box>
              )}
              <AuthCard>{children}</AuthCard>
              {!isLoggedIn && (
                <Box sx={{ maxWidth: { xs: 400, sm: 475 }, margin: { xs: 2.5, md: 3 }, '& > *': { flexGrow: 1, flexBasis: '50%' } }}>
                  <Grid size={12}>
                    <Divider sx={{ mb: 3 }}>
                      <Typography variant="caption">
                        {' '}
                        <FormattedMessage id="auth.demo.hint" />{' '}
                      </Typography>
                    </Divider>
                  </Grid>
                  <Grid size={12}>
                    <LoginProvider currentLoginWith={authParam} />
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
        <AuthFooter />
      </Stack>
    </Box>
  );
}

AuthWrapper.propTypes = { children: PropTypes.node };
