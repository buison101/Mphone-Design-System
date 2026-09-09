import { FormattedMessage } from 'react-intl';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import MainCard from 'components/MainCard';

export default function PortalRouteError() {
  return (
    <MainCard sx={{ width: '100%', maxWidth: 640, mx: 'auto', mt: 4 }}>
      <Stack sx={{ gap: 2 }}>
        <Alert severity="error">
          <FormattedMessage id="mphoneUi.routeError.description" />
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ alignSelf: 'flex-start' }}>
          <FormattedMessage id="mphoneUi.action.retry" />
        </Button>
      </Stack>
    </MainCard>
  );
}
