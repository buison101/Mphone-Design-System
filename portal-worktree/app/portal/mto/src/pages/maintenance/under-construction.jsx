import { Link } from 'react-router-dom';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// material-ui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import { APP_DEFAULT_PATH } from 'config';

// assets
import construction from 'assets/images/maintenance/under-construction.svg';

// ==============================|| UNDER CONSTRUCTION - MAIN ||============================== //

export default function UnderConstruction() {
  const intl = useIntl();
  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh', py: 2, gap: 2 }}>
      <Box sx={{ width: { xs: 300, sm: 480 }, my: 2 }}>
        <CardMedia
          component="img"
          src={construction}
          alt={intl.formatMessage({ id: 'maintenance.construction.illustrationAlt' })}
          sx={{ height: 'auto' }}
        />
      </Box>
      <Typography variant="h1" sx={{ textAlign: 'center' }}>
        <FormattedMessage id="maintenance.construction.title" />
      </Typography>
      <Typography sx={{ color: 'text.secondary', width: '85%', textAlign: 'center' }}>
        <FormattedMessage id="maintenance.construction.body" />
      </Typography>
      <Button component={Link} to={APP_DEFAULT_PATH} variant="contained">
        <FormattedMessage id="maintenance.backHome" />
      </Button>
    </Stack>
  );
}
