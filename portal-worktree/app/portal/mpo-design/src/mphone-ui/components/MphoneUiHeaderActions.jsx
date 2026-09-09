import { useIntl } from 'react-intl';

import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import Customization from 'layout/Dashboard/Header/HeaderContent/Customization';
import Localization from 'layout/Dashboard/Header/HeaderContent/Localization';
import usePortalSession from '../hooks/usePortalSession';
import { IS_PORTAL_TARGET } from '../workspace';

export default function MphoneUiHeaderActions() {
  const intl = useIntl();
  const { logout } = usePortalSession();

  const handleLogout = async () => {
    await logout();
    if (IS_PORTAL_TARGET) window.location.assign('/p/');
  };

  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
      <Localization />
      <Customization />
      <Tooltip title={intl.formatMessage({ id: 'mphoneUi.action.logout' })}>
        <IconButton color="inherit" onClick={handleLogout} aria-label={intl.formatMessage({ id: 'mphoneUi.action.logout' })}>
          <LogoutOutlined />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
