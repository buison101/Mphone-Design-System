import PropTypes from 'prop-types';
import { useMemo } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

// project imports
import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';
import MiniDrawerStyled from './MiniDrawerStyled';

import { DRAWER_WIDTH } from 'config';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import frostedSurface from 'utils/frosted';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

export default function MainDrawer({ window }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  // responsive drawer container
  const container = window !== undefined ? () => window().document.body : undefined;

  // header content
  const drawerContent = useMemo(() => <DrawerContent />, []);
  const mobileDrawerHeader = useMemo(() => <DrawerHeader open={true} />, []);

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
        zIndex: (theme) => (!downLG ? theme.zIndex.drawer + 2 : theme.zIndex.drawer),
        // On desktop this nav column is a full-height flex item stacked above the
        // AppBar, so it swallows clicks on the header band it covers. Only the
        // drawer paper below the header needs to receive them.
        ...(!downLG && { pointerEvents: 'none' })
      }}
      aria-label="mailbox folders"
    >
      {!downLG ? (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {drawerContent}
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(!drawerOpen)}
          ModalProps={{
            keepMounted: true,
            // A nav drawer is not a blocking dialog. MUI's scroll lock hides the
            // body scrollbar and compensates by padding `body` and every
            // `.mui-fixed` element - the fixed AppBar - by the scrollbar width
            // (15px on Windows), which reads as a stray right gutter below `lg`.
            disableScrollLock: true
          }}
          sx={{ display: { xs: drawerOpen ? 'block' : 'none', lg: 'none' }, zIndex: (theme) => theme.zIndex.drawer + 2 }}
          slotProps={{
            paper: {
              sx: (theme) => ({
                ...frostedSurface(theme),
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
                boxShadow: 'inherit',
                top: 0,
                height: '100%'
              })
            }
          }}
        >
          {mobileDrawerHeader}
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
}

MainDrawer.propTypes = { window: PropTypes.func };
