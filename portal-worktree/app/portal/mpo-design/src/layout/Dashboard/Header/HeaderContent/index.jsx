import { lazy, Suspense, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// project imports
import Localization from './Localization';
import Customization from './Customization';
import PortalAreaSwitcher from 'mphone-lab/PortalAreaSwitcher';
import MphoneUiHeaderActions from 'mphone-ui/components/MphoneUiHeaderActions';
import { IS_PORTAL_TARGET, isMphoneUiWorkspace } from 'mphone-ui/workspace';

const Search = lazy(() => import('./Search'));
const Chat = lazy(() => import('./Chat'));
const Profile = lazy(() => import('./Profile'));
const Notification = lazy(() => import('./Notification'));
const MegaMenuSection = lazy(() => import('./MegaMenuSection'));
const MobileSection = lazy(() => import('./MobileSection'));

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const { pathname } = useLocation();
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const isMphoneLab = pathname === '/mphone' || pathname.startsWith('/mphone/');
  const isMphoneUi = isMphoneUiWorkspace(pathname);
  const isMphoneWorkspace = isMphoneLab || isMphoneUi;

  const localization = useMemo(() => <Localization />, []);

  const megaMenu = useMemo(() => <MegaMenuSection />, []);

  return (
    <Suspense fallback={null}>
      <Stack direction="row" sx={{ gap: { xs: 1, lg: 2 }, alignItems: 'center' }}>
        {!IS_PORTAL_TARGET && <PortalAreaSwitcher compact={downLG} />}
        {!downLG && !isMphoneWorkspace && (
          <>
            <Divider orientation="vertical" flexItem sx={{ height: 22, alignSelf: 'center' }} />
            <Search />
          </>
        )}
      </Stack>
      <Box sx={{ width: 1, ml: 1 }} />

      {isMphoneUi ? (
        <MphoneUiHeaderActions />
      ) : (
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
          {!downLG && !isMphoneWorkspace && megaMenu}
          {localization}
          <Notification />
          <Chat />
          <Customization />
          {!downLG && <Profile />}
          {downLG && <MobileSection showSearch={!isMphoneWorkspace} />}
        </Stack>
      )}
    </Suspense>
  );
}
