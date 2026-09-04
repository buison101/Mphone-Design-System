import { useMemo } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// project imports
import Search from './Search';
import Chat from './Chat';
import Profile from './Profile';
import Localization from './Localization';
import Notification from './Notification';
import Customization from './Customization';
import MobileSection from './MobileSection';
import MegaMenuSection from './MegaMenuSection';
import PortalAreaSwitcher from 'mphone-lab/PortalAreaSwitcher';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const localization = useMemo(() => <Localization />, []);

  const megaMenu = useMemo(() => <MegaMenuSection />, []);

  return (
    <>
      <Stack direction="row" sx={{ gap: { xs: 1, lg: 2 }, ml: 1, alignItems: 'center' }}>
        {!downLG && (
          <>
            <Search />
            <Divider orientation="vertical" flexItem sx={{ height: 22, alignSelf: 'center' }} />
          </>
        )}
        <PortalAreaSwitcher compact={downLG} />
      </Stack>
      <Box sx={{ width: 1, ml: 1 }} />

      <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
        {!downLG && megaMenu}
        {localization}
        <Notification />
        <Chat />
        <Customization />
        {!downLG && <Profile />}
        {downLG && <MobileSection />}
      </Stack>
    </>
  );
}
