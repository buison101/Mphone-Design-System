import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// assets
import QrcodeOutlined from '@ant-design/icons/QrcodeOutlined';

// ==============================|| APP PHONE - LOGIN ||============================== //
//
// One primary way in and one alternative, not the six the app's assistant flow
// currently offers. QR pairing is kept because it is the only path that does not
// ask someone to type a SIP password on a phone keyboard; registration, external
// SIP and account recovery belong behind "Cần trợ giúp".
//
// The brand mark carries the domain under it. A tenant who has been handed the
// wrong server finds out here, not after three failed sign-ins.

export default function LoginScreen({ onSubmit }) {
  const intl = useIntl();

  return (
    <Stack sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', p: 3, gap: 3, justifyContent: 'center' }}>
      <Stack sx={{ alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText'
          }}
        >
          <Typography variant="h4" sx={{ color: 'inherit' }}>
            M
          </Typography>
        </Box>
        <Typography variant="h4">Mphone</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          thaison.mphone.vn
        </Typography>
      </Stack>

      <Stack component="form" sx={{ gap: 2 }} onSubmit={(event) => event.preventDefault()}>
        <TextField
          fullWidth
          label={intl.formatMessage({ id: 'appPhone.login.account' })}
          defaultValue="ha.nguyen@example.vn"
          autoComplete="username"
        />
        <TextField
          fullWidth
          type="password"
          label={intl.formatMessage({ id: 'appPhone.login.password' })}
          autoComplete="current-password"
        />
        <Button fullWidth size="large" variant="contained" onClick={onSubmit}>
          <FormattedMessage id="appPhone.login.submit" />
        </Button>
        <Link component="button" type="button" variant="body2" sx={{ alignSelf: 'center' }}>
          <FormattedMessage id="appPhone.login.forgot" />
        </Link>
      </Stack>

      <Divider>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          <FormattedMessage id="appPhone.login.or" />
        </Typography>
      </Divider>

      <Stack sx={{ gap: 1.5 }}>
        <Button fullWidth size="large" variant="outlined" color="secondary" startIcon={<QrcodeOutlined />}>
          <FormattedMessage id="appPhone.login.qr" />
        </Button>
        <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          <FormattedMessage id="appPhone.login.help" />
        </Typography>
      </Stack>
    </Stack>
  );
}

LoginScreen.propTypes = { onSubmit: PropTypes.func };
