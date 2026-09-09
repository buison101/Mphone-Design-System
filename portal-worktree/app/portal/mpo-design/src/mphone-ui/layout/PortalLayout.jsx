import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import LogoMain from 'components/logo/LogoMain';
import useConfig from 'hooks/useConfig';
import usePortalSession from '../hooks/usePortalSession';

const DRAWER_WIDTH = 264;
const navigation = [];

function PortalNavigation({ onNavigate }) {
  const intl = useIntl();

  return (
    <List component="nav" aria-label={intl.formatMessage({ id: 'mphoneUi.navigation.aria' })} sx={{ px: 1.5, py: 2 }}>
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <ListItemButton
            key={item.id}
            component={NavLink}
            to={item.to}
            onClick={onNavigate}
            sx={{ borderRadius: 1, mb: 0.5, '&.active': { color: 'primary.main', bgcolor: 'primary.lighter' } }}
          >
            <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={<FormattedMessage id={`mphoneUi.navigation.${item.id}`} />} />
          </ListItemButton>
        );
      })}
    </List>
  );
}

function DrawerContent({ onNavigate }) {
  const { session } = usePortalSession();
  return (
    <Stack sx={{ height: '100%' }}>
      <Toolbar sx={{ px: 2.5 }}>
        {session?.branding?.logo ? (
          <Box
            component="img"
            src={session.branding.logo}
            alt={session.branding.brand_text || 'Mphone'}
            sx={{ display: 'block', maxWidth: 150, maxHeight: 34 }}
          />
        ) : (
          <LogoMain />
        )}
      </Toolbar>
      <Divider />
      <PortalNavigation onNavigate={onNavigate} />
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack sx={{ px: 2.5, py: 2, gap: 0.25 }}>
        <Typography variant="subtitle2" noWrap>
          {session?.user?.username || '—'}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {session?.domain?.domain_name || '—'}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default function PortalLayout() {
  const intl = useIntl();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { state, setField } = useConfig();
  const { logout } = usePortalSession();

  const handleLogout = async () => {
    await logout();
    window.location.assign('/p/');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` }
        }}
      >
        <Toolbar sx={{ gap: 1.25 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            aria-label={intl.formatMessage({ id: 'mphoneUi.navigation.open' })}
            sx={{ display: { md: 'none' } }}
          >
            <MenuOutlined />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            <FormattedMessage id="mphoneUi.title" />
          </Typography>
          <Stack direction="row" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {['vi', 'en'].map((locale) => (
              <Button
                key={locale}
                size="small"
                color={state.i18n === locale ? 'primary' : 'inherit'}
                onClick={() => setField('i18n', locale)}
                aria-pressed={state.i18n === locale}
              >
                {locale.toUpperCase()}
              </Button>
            ))}
          </Stack>
          <Tooltip title={intl.formatMessage({ id: 'mphoneUi.action.logout' })}>
            <IconButton color="inherit" onClick={handleLogout} aria-label={intl.formatMessage({ id: 'mphoneUi.action.logout' })}>
              <LogoutOutlined />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          <DrawerContent onNavigate={() => setMobileOpen(false)} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
        >
          <DrawerContent />
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Toolbar />
        <Container key={location.pathname} maxWidth="xl" sx={{ py: { xs: 2, md: 3.5 } }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

PortalNavigation.propTypes = { onNavigate: PropTypes.func };
DrawerContent.propTypes = { onNavigate: PropTypes.func };
