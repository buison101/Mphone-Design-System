import { useMemo } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import HeaderContent from './HeaderContent';
import IconButton from 'components/@extended/IconButton';
import Logo from 'components/logo';

import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { MenuOrientation, DRAWER_WIDTH, HEADER_HEIGHT } from 'config';
import frostedSurface from 'utils/frosted';

// assets
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { state } = useConfig();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const isHorizontal = state.menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // The separating shadow appears only once the page has actually moved, so the
  // header reads as flat at rest and lifted while content slides under it.
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  // header content
  const headerContent = useMemo(() => <HeaderContent />, []);

  // drawer toggle - rendered once, placed to the left of the logo on desktop and
  // ahead of the header content below `lg`, where no logo band exists. No `edge`
  // prop: MUI's edge="start" pulls the button out of its container with
  // margin-left: -12px, which misaligns it in both placements.
  const drawerToggle = (
    <IconButton
      aria-label="open drawer"
      onClick={() => handlerDrawerOpen(!drawerOpen)}
      color="secondary"
      variant="light"
      sx={(theme) => ({
        color: 'text.primary',
        bgcolor: drawerOpen ? 'transparent' : 'grey.100',
        ...theme.applyStyles('dark', { bgcolor: drawerOpen ? 'transparent' : 'background.default' })
      })}
    >
      {!drawerOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </IconButton>
  );

  // common header
  const mainHeader = (
    <Toolbar disableGutters sx={{ minHeight: HEADER_HEIGHT }}>
      {!downLG && (
        <Box
          sx={{
            width: isHorizontal ? 424 : DRAWER_WIDTH,
            alignSelf: 'stretch',
            pl: 2,
            pr: 3,
            gap: 1,
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          {!isHorizontal && drawerToggle}
          <Logo />
        </Box>
      )}

      <Box sx={{ minWidth: 0, px: { xs: 2, sm: 4 }, display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        {downLG && drawerToggle}
        {headerContent}
      </Box>
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: (theme) => ({
      zIndex: theme.zIndex.drawer + 1,
      width: '100%',
      ...frostedSurface(theme),
      transition: theme.transitions.create('box-shadow', { duration: theme.transitions.duration.shorter }),
      ...(scrolled && { boxShadow: theme.vars.customShadows.z1 })
    })
  };

  return <AppBar {...appBar}>{mainHeader}</AppBar>;
}
