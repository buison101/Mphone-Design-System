import { useState } from 'react';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

// project imports
import Avatar from 'components/@extended/Avatar';
import useAuth from 'hooks/useAuth';
import { useGetMenuMaster } from 'api/menu';

// assets
import RightOutlined from '@ant-design/icons/RightOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';

const ExpandMore = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'theme' && prop !== 'expand' && prop !== 'drawerOpen'
})(({ theme }) => ({
  transform: 'rotate(-90deg)',
  marginLeft: 'auto',
  color: theme.vars.palette.secondary.dark,
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: { transform: 'rotate(0deg)' }
    },
    {
      props: ({ drawerOpen }) => !drawerOpen,
      style: { opacity: 0, width: 50, height: 50 }
    }
  ]
}));

// ==============================|| DRAWER - USER ||============================== //

export default function NavUser() {
  const intl = useIntl();
  const navigate = useNavigate();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { logout, user } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate(`/login`, {
        state: {
          from: ''
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 1.25, px: !drawerOpen ? 1.25 : 3, borderTop: '2px solid', borderTopColor: 'divider' }}>
      <List disablePadding>
        <ListItem
          disablePadding
          secondaryAction={
            <ExpandMore
              expand={open}
              drawerOpen={drawerOpen}
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              aria-label={intl.formatMessage({ id: 'profile.showMore' })}
            >
              <RightOutlined style={{ fontSize: '0.625rem' }} />
            </ExpandMore>
          }
          sx={{ '& .MuiListItemSecondaryAction-root': { right: !drawerOpen ? -20 : -16 } }}
        >
          <ListItemAvatar>
            <Avatar
              alt={intl.formatMessage({ id: 'profile.avatarAlt' })}
              src={avatar1}
              sx={{ ...(drawerOpen && { width: 46, height: 46 }) }}
            />
          </ListItemAvatar>
          {user && <ListItemText primary={user?.name} secondary={intl.formatMessage({ id: 'profile.role' })} />}
        </ListItem>
      </List>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{ list: { 'aria-labelledby': 'basic-button' } }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MenuItem onClick={handleLogout}>
          <FormattedMessage id="profile.logout" />
        </MenuItem>
        <MenuItem component={Link} to="/apps/profiles/user/personal" onClick={handleClose}>
          <FormattedMessage id="profile.viewProfile" />
        </MenuItem>
        <MenuItem component={Link} to="/apps/profiles/account/my-account" onClick={handleClose}>
          <FormattedMessage id="profile.myAccount" />
        </MenuItem>
      </Menu>
    </Box>
  );
}
