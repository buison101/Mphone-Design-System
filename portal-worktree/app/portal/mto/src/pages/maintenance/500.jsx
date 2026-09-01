import { Link } from 'react-router-dom';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

import useMediaQuery from '@mui/material/useMediaQuery';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import { APP_DEFAULT_PATH } from 'config';

// assets
import error500 from 'assets/images/maintenance/Error500.png';

// ==============================|| ERROR 500 - MAIN ||============================== //

export default function Error500() {
  const intl = useIntl();
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', px: 2 }}>
      <Box sx={{ width: { xs: 350, sm: 396 }, my: 2 }}>
        <CardMedia component="img" src={error500} alt={intl.formatMessage({ id: 'maintenance.500.illustrationAlt' })} />
      </Box>
      <Typography variant={downSM ? 'h2' : 'h1'}>
        <FormattedMessage id="maintenance.500.title" />
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', width: { xs: '73%', sm: '70%' }, mt: 1 }}>
        <FormattedMessage id="maintenance.500.body" />
      </Typography>
      <Button component={Link} to={APP_DEFAULT_PATH} variant="contained" sx={{ textTransform: 'none', mt: 4 }}>
        <FormattedMessage id="maintenance.backHome" />
      </Button>
    </Stack>
  );
}
