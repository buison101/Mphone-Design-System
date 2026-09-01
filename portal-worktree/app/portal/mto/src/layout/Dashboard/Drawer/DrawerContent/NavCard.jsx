// material-ui
import Button from '@mui/material/Button';

// third-party
import { FormattedMessage } from 'react-intl';
import Link from '@mui/material/Link';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import MainCard from 'components/MainCard';

// assets
import avatar from 'assets/images/users/avatar-group.png';

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

export default function NavCard() {
  return (
    <MainCard sx={{ bgcolor: 'grey.50', m: 3 }}>
      <Stack sx={{ gap: 2.5, alignItems: 'center' }}>
        <CardMedia component="img" image={avatar} />
        <Stack sx={{ alignItems: 'center' }}>
          <Typography variant="h5">
            <FormattedMessage id="drawer.help.title" />
          </Typography>
          <Typography variant="h6" sx={{ color: 'secondary.main' }}>
            <FormattedMessage id="drawer.help.body" />
          </Typography>
        </Stack>
        <AnimateButton>
          <Button variant="shadow" size="small" component={Link} href="/contact-us">
            <FormattedMessage id="drawer.help.action" />
          </Button>
        </AnimateButton>
      </Stack>
    </MainCard>
  );
}
