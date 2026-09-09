import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'components/MainCard';
import usePortalSession from '../hooks/usePortalSession';

export default function PortalSessionGate({ children }) {
  const intl = useIntl();
  const { session, loading, error, reload } = usePortalSession();

  if (loading) {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 180px)', display: 'grid', placeItems: 'center' }}>
        <CircularProgress
          color="inherit"
          aria-label={intl.formatMessage({ id: 'mphoneUi.session.loading' })}
          sx={{ color: 'text.secondary' }}
        />
      </Box>
    );
  }

  if (!session) {
    const unauthorized = error === 'unauthorized';
    return (
      <Box sx={{ minHeight: 'calc(100vh - 180px)', display: 'grid', placeItems: 'center', p: 2 }}>
        <MainCard sx={{ width: '100%', maxWidth: 520 }}>
          <Stack sx={{ gap: 2.5 }}>
            <Stack sx={{ gap: 0.75 }}>
              <Typography variant="h3">
                <FormattedMessage id={unauthorized ? 'mphoneUi.session.required.title' : 'mphoneUi.session.error.title'} />
              </Typography>
              <Typography color="text.secondary">
                <FormattedMessage id={unauthorized ? 'mphoneUi.session.required.description' : 'mphoneUi.session.error.description'} />
              </Typography>
            </Stack>
            {error === 'forbidden' && (
              <Alert severity="warning">
                <FormattedMessage id="mphoneUi.session.forbidden" />
              </Alert>
            )}
            <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
              {unauthorized && (
                <Button variant="contained" href="/p/">
                  <FormattedMessage id="mphoneUi.session.signIn" />
                </Button>
              )}
              <Button
                variant={unauthorized ? 'outlined' : 'contained'}
                onClick={reload}
                aria-label={intl.formatMessage({ id: 'mphoneUi.action.retry' })}
              >
                <FormattedMessage id="mphoneUi.action.retry" />
              </Button>
            </Stack>
          </Stack>
        </MainCard>
      </Box>
    );
  }

  return children;
}

PortalSessionGate.propTypes = { children: PropTypes.node };
