import PropTypes from 'prop-types';
import { useCallback, useMemo, useState, cloneElement } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// material-ui
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';

// project imports
import AIPromptsMenu from './AIPromptsMenu';
import MegaMenuSection from './MegaMenuSection';

import AnimateButton from 'components/@extended/AnimateButton';
import AnimateSparkle from 'components/@extended/AnimateSparkle';
import IconButton from 'components/@extended/IconButton';
import ContainerWrapper from 'components/ContainerWrapper';
import Logo from 'components/logo';

import { APP_DEFAULT_PATH } from 'config';
import useAuth from 'hooks/useAuth';

// assets
import FileSearchOutlined from '@ant-design/icons/FileSearchOutlined';
import GithubOutlined from '@ant-design/icons/GithubOutlined';
import GoldOutlined from '@ant-design/icons/GoldOutlined';
import LineOutlined from '@ant-design/icons/LineOutlined';
import MenuOutlined from '@ant-design/icons/MenuOutlined';

// ==============================|| ELEVATION SCROLL COMPONENT ||============================== //

function ElevationScroll({ children, window }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
    target: window ? window() : undefined
  });

  return cloneElement(children, {
    style: {
      ...(!trigger && { background: 'transparent' })
    }
  });
}

// ==============================|| COMMON HEADER COMPONENT ||============================== //

export default function Header({
  variant = 'simple',
  enableElevationScroll = false,
  enableComponentDrawer = false,
  onComponentDrawerToggle,
  isComponentDrawerOpened = false
}) {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();

  const [drawerToggle, setDrawerToggle] = useState(false);

  /** Method called on multiple components with different event types */
  const drawerToggler = useCallback(
    (open) => (event) => {
      if (event?.type === 'keydown' && (event?.key === 'Tab' || event?.key === 'Shift')) {
        return;
      }
      setDrawerToggle(open);
    },
    []
  );

  const handleComponentDrawerToggle = useCallback(() => {
    if (enableComponentDrawer && onComponentDrawerToggle) {
      onComponentDrawerToggle(!isComponentDrawerOpened);
    }
  }, [enableComponentDrawer, onComponentDrawerToggle, isComponentDrawerOpened]);

  const isComponent = variant === 'component';

  const desktopLinks = useMemo(() => {
    const Wrapper = isComponent ? Stack : Box;
    return (
      <Wrapper sx={{ '& .header-link': { px: 2, '&:hover': { color: 'primary.main' } }, display: { xs: 'none', md: 'block' } }}>
        <AIPromptsMenu />
        <Link
          className="header-link"
          component={RouterLink}
          to={isLoggedIn ? APP_DEFAULT_PATH : '/login'}
          target="_blank"
          underline="none"
          sx={{ color: 'common.white' }}
        >
          Dashboard
        </Link>
        <MegaMenuSection />
        <Link
          className="header-link"
          component={RouterLink}
          to="/components-overview"
          underline="none"
          sx={{ color: isComponent ? 'primary.main' : 'common.white' }}
        >
          Components
        </Link>
        <Link
          className="header-link"
          href="https://codedthemes.gitbook.io/mantis/"
          target="_blank"
          underline="none"
          sx={{ color: 'common.white' }}
        >
          Documentation
        </Link>
        <Link
          className="header-link"
          href="https://github.com/codedthemes/mantis-free-react-admin-template"
          target="_blank"
          underline="none"
          sx={{ color: 'common.white', fontSize: 24, verticalAlign: 'middle' }}
        >
          <GithubOutlined />
        </Link>
        <Box sx={{ display: 'inline-block', ml: 1 }}>
          <AnimateButton>
            <Button
              component={Link}
              href="https://mui.com/store/items/mantis-react-admin-dashboard-template/"
              target="_blank"
              disableElevation
              color="primary"
              variant="contained"
            >
              Purchase Now
            </Button>
          </AnimateButton>
        </Box>
      </Wrapper>
    );
  }, [isComponent, isLoggedIn]);

  const mobileMenu = useMemo(() => {
    return (
      <Stack direction="row" sx={{ gap: { xs: 0.25, sm: 0.5, md: 1 }, alignItems: 'center' }}>
        <AIPromptsMenu />
        <MegaMenuSection />/
        <Button
          variant="outlined"
          size="small"
          color="warning"
          component={RouterLink}
          to={isComponent ? (isLoggedIn ? APP_DEFAULT_PATH : '/login') : '/components-overview'}
          {...(isComponent && { target: '_blank' })}
          sx={{ height: 28, display: { xs: 'none', sm: 'block' } }}
        >
          {isComponent ? 'Dashboard' : 'All Components'}
        </Button>
        {(isComponent || variant === 'prompts') && enableComponentDrawer && (
          <IconButton size="small" variant="contained" onClick={handleComponentDrawerToggle} sx={{ ml: { xs: 0, sm: 1 } }}>
            {variant === 'prompts' ? <FileSearchOutlined style={{ fontSize: 18 }} /> : <GoldOutlined style={{ fontSize: 18 }} />}
          </IconButton>
        )}
        <IconButton
          color="secondary"
          onClick={drawerToggler(true)}
          sx={(theme) => ({
            color: 'grey.100',
            '&:hover': { bgcolor: 'secondary.dark', color: 'grey.100' },
            ...theme.applyStyles('dark', { color: 'inherit', '&:hover': { bgcolor: 'secondary.lighter' } })
          })}
        >
          <MenuOutlined />
        </IconButton>
      </Stack>
    );
  }, [isComponent, isLoggedIn, handleComponentDrawerToggle, enableComponentDrawer, variant, drawerToggler]);

  const getDrawerContent = () => {
    return (
      <Drawer anchor="top" open={drawerToggle} onClose={drawerToggler(false)}>
        <Box
          sx={{ width: 'auto', '& .MuiListItemIcon-root': { fontSize: '1rem', minWidth: 28 } }}
          role="presentation"
          onClick={drawerToggler(false)}
          onKeyDown={drawerToggler(false)}
        >
          <List>
            <Link underline="none" component={RouterLink} to="/ai">
              <ListItemButton selected={pathname.includes('/ai')}>
                <ListItemIcon>
                  <LineOutlined />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <>
                      AI <AnimateSparkle triggered={true}>✨</AnimateSparkle>
                    </>
                  }
                  slotProps={{ primary: { variant: 'h6', color: 'text.primary' } }}
                />
                <Chip size="small" label="New" color="error" />
              </ListItemButton>
            </Link>
            <Link underline="none" component={RouterLink} to="/prompts-overview">
              <ListItemButton selected={pathname.includes('prompts-overview')}>
                <ListItemIcon>
                  <LineOutlined />
                </ListItemIcon>
                <ListItemText primary="Browse Prompts" slotProps={{ primary: { variant: 'h6', color: 'text.primary' } }} />
              </ListItemButton>
            </Link>
            <Link underline="none" href={isLoggedIn ? APP_DEFAULT_PATH : '/login'} target="_blank">
              <ListItemButton>
                <ListItemIcon>
                  <LineOutlined />
                </ListItemIcon>
                <ListItemText primary="Dashboard" slotProps={{ primary: { variant: 'h6', color: 'text.primary' } }} />
              </ListItemButton>
            </Link>
            <Link underline="none" href="/components-overview" target="_blank">
              <ListItemButton>
                <ListItemIcon>
                  <LineOutlined />
                </ListItemIcon>
                <ListItemText primary="All Components" slotProps={{ primary: { variant: 'h6', color: 'text.primary' } }} />
              </ListItemButton>
            </Link>
            <Link underline="none" href="https://github.com/codedthemes/mantis-free-react-admin-template" target="_blank">
              <ListItemButton>
                <ListItemIcon>
                  <LineOutlined />
                </ListItemIcon>
                <ListItemText primary="Free Version" slotProps={{ primary: { variant: 'h6', color: 'text.primary' } }} />
              </ListItemButton>
            </Link>
            <Link underline="none" href="https://codedthemes.gitbook.io/mantis/" target="_blank">
              <ListItemButton>
                <ListItemIcon>
                  <LineOutlined />
                </ListItemIcon>
                <ListItemText primary="Documentation" slotProps={{ primary: { variant: 'h6', color: 'text.primary' } }} />
              </ListItemButton>
            </Link>
            <Link underline="none" href="https://mui.com/store/items/mantis-react-admin-dashboard-template/" target="_blank">
              <ListItemButton>
                <ListItemIcon>
                  <LineOutlined />
                </ListItemIcon>
                <ListItemText primary="Purchase Now" slotProps={{ primary: { variant: 'h6', color: 'text.primary' } }} />
                <Chip color="primary" label={import.meta.env.VITE_APP_VERSION} size="small" />
              </ListItemButton>
            </Link>
          </List>
        </Box>
      </Drawer>
    );
  };

  const headerContent = (
    <AppBar
      sx={(theme) => ({
        bgcolor: 'grey.800',
        color: 'text.primary',
        boxShadow: 'none',
        ...theme.applyStyles('dark', { bgcolor: theme.vars.palette.grey[50] })
      })}
    >
      <ContainerWrapper>
        <Toolbar disableGutters sx={{ py: 2 }}>
          <Stack direction="row" sx={{ alignItems: 'center', flexGrow: 1, display: { xs: 'none', md: 'block' } }}>
            <Typography sx={{ textAlign: 'left', display: 'inline-block' }}>
              <Logo reverse to="/" />
            </Typography>
          </Stack>
          {desktopLinks}
          <Box sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', display: { xs: 'flex', md: 'none' } }}>
            <Typography sx={{ textAlign: 'left', display: 'inline-block' }}>
              <Logo reverse to="/" />
            </Typography>
            {mobileMenu}
            {getDrawerContent()}
          </Box>
        </Toolbar>
      </ContainerWrapper>
    </AppBar>
  );

  if (enableElevationScroll) {
    return <ElevationScroll>{headerContent}</ElevationScroll>;
  }

  return headerContent;
}

ElevationScroll.propTypes = { children: PropTypes.node, window: PropTypes.func };

Header.propTypes = {
  variant: PropTypes.oneOf(['simple', 'component', 'prompts']),
  enableElevationScroll: PropTypes.bool,
  enableComponentDrawer: PropTypes.bool,
  onComponentDrawerToggle: PropTypes.func,
  isComponentDrawerOpened: PropTypes.bool
};
