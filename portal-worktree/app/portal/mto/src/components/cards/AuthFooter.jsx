// material-ui
import Link from '@mui/material/Link';

// third-party
import { FormattedMessage } from 'react-intl';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// project imports
import ContainerWrapper from 'components/ContainerWrapper';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

export default function AuthFooter() {
  return (
    <ContainerWrapper>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 2, justifyContent: { xs: 'center', sm: 'space-between' }, textAlign: { xs: 'center', sm: 'inherit' }, py: 2 }}
      >
        <Typography variant="subtitle2" sx={{ color: 'secondary.main' }}>
          <FormattedMessage id="authFooter.copyright" values={{ year: new Date().getFullYear() }} />
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: { xs: 1, sm: 3 }, textAlign: { xs: 'center', sm: 'inherit' } }}>
          <Typography variant="subtitle2" component={Link} href="/faqs" underline="hover" sx={{ color: 'secondary.main' }}>
            <FormattedMessage id="authFooter.faqs" />
          </Typography>
          <Typography variant="subtitle2" component={Link} href="/contact-us" underline="hover" sx={{ color: 'secondary.main' }}>
            <FormattedMessage id="authFooter.contact" />
          </Typography>
        </Stack>
      </Stack>
    </ContainerWrapper>
  );
}
