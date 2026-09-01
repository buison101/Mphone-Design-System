// material-ui
import Link from '@mui/material/Link';

// third-party
import { FormattedMessage } from 'react-intl';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  const footerLinkProps = { target: '_blank', variant: 'caption', sx: { color: 'text.primary' } };
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between', p: '24px 16px 0px', mt: 'auto' }}
    >
      <Typography variant="caption">
        <FormattedMessage id="footer.copyright" values={{ year: new Date().getFullYear() }} />
      </Typography>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          <FormattedMessage id="footer.lab" />
        </Typography>
        <Link href="https://call.mphone.vn/p/" {...footerLinkProps}>
          <FormattedMessage id="footer.livePortal" />
        </Link>
      </Stack>
    </Stack>
  );
}
