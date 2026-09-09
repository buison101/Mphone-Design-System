import { lazy, Suspense } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import SimpleBar from 'components/third-party/SimpleBar';
import { useGetMenuMaster } from 'api/menu';
import MphoneUiDrawerUser from 'mphone-ui/components/MphoneUiDrawerUser';
import MphoneUiNavigation from 'mphone-ui/components/MphoneUiNavigation';
import { isMphoneUiWorkspace } from 'mphone-ui/workspace';
import { useLocation } from 'react-router-dom';

const NavUser = lazy(() => import('./NavUser'));
const NavCard = lazy(() => import('./NavCard'));
const Navigation = lazy(() => import('./Navigation'));

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {
  const { pathname } = useLocation();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const isMphoneUi = isMphoneUiWorkspace(pathname);

  return (
    <>
      <SimpleBar sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
        {isMphoneUi ? (
          <MphoneUiNavigation />
        ) : (
          <Suspense fallback={null}>
            <Navigation />
            {drawerOpen && !downLG && <NavCard />}
          </Suspense>
        )}
      </SimpleBar>
      {isMphoneUi ? (
        <MphoneUiDrawerUser />
      ) : (
        <Suspense fallback={null}>
          <NavUser />
        </Suspense>
      )}
    </>
  );
}
