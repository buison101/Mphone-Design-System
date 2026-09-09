import PropTypes from 'prop-types';
import { lazy, Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Drawer from './Drawer';
import Header from './Header';
import Footer from './Footer';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import AuthGuard from 'utils/route-guard/AuthGuard';

import { DRAWER_WIDTH, MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { isMphoneUiWorkspace } from 'mphone-ui/workspace';

const AddCustomer = lazy(() => import('sections/apps/customer/AddCustomer'));
const HorizontalBar = lazy(() => import('./Drawer/HorizontalBar'));

// ==============================|| MAIN LAYOUT ||============================== //

export default function DashboardLayout({ unguarded = false }) {
  const { pathname } = useLocation();
  const { menuMasterLoading } = useGetMenuMaster();
  const downXL = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const { state } = useConfig();

  const isContainer = state.container;
  const isMphoneUi = isMphoneUiWorkspace(pathname);
  const isHorizontal = !isMphoneUi && state.menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // set media wise responsive drawer
  useEffect(() => {
    if (state.menuOrientation !== MenuOrientation.MINI_VERTICAL) {
      handlerDrawerOpen(!downXL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downXL]);

  if (menuMasterLoading) return <Loader />;

  const layout = (
    <Stack direction="row" sx={{ width: 1 }}>
      <Header />
      {!isHorizontal ? (
        <Drawer />
      ) : (
        <Suspense fallback={null}>
          <HorizontalBar />
        </Suspense>
      )}

      <Box component="main" sx={{ width: `calc(100% - ${DRAWER_WIDTH}px)`, flexGrow: 1, py: 4, px: { xs: 2, sm: 4 } }}>
        <Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit' }} />
        <Container
          maxWidth={isContainer ? 'xl' : false}
          disableGutters
          sx={{
            position: 'relative',
            minHeight: 'calc(100vh - 110px)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {!isMphoneUi && pathname !== '/apps/profiles/account/my-account' && <Breadcrumbs />}
          <Outlet />
          <Footer />
        </Container>
      </Box>
      {!isMphoneUi && (
        <Suspense fallback={null}>
          <AddCustomer />
        </Suspense>
      )}
    </Stack>
  );

  return unguarded ? layout : <AuthGuard>{layout}</AuthGuard>;
}

DashboardLayout.propTypes = { unguarded: PropTypes.bool };
