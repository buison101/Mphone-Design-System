import { Link } from 'react-router-dom';

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
  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh', py: 2, gap: 2 }}>
      <Box sx={{ width: { xs: 300, sm: 480 }, my: 2 }}>
        <CardMedia component="img" src={construction} alt="mantis" sx={{ height: 'auto' }} />
      </Box>
      <Typography variant="h1" sx={{ textAlign: 'center' }}>
        Under Construction
      </Typography>
      <Typography sx={{ color: 'text.secondary', width: '85%', textAlign: 'center' }}>
        Hey! Please check out this site later. We are doing some maintenance on it right now.
      </Typography>
      <Button component={Link} to={APP_DEFAULT_PATH} variant="contained">
        Back To Home
      </Button>
    </Stack>
  );
}
