import PropTypes from 'prop-types';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router';

// material-ui
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

import useAuth from 'hooks/useAuth';

// assets
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import ExportOutlined from '@ant-design/icons/ExportOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';

// Same entries, routes and external links as Profile/ProfileTab.jsx and
// Profile/SettingTab.jsx; only the grouping and presentation differ.
const SUPPORT_URL = 'https://codedthemes.support-hub.io/';

const GROUPS = [
  {
    id: 'profile',
    titleId: 'common.profile',
    title: 'Profile',
    items: [
      { id: 'edit', labelId: 'shell.profile.edit', label: 'Edit Profile', icon: EditOutlined, route: '/apps/profiles/user/personal' },
      { id: 'view', labelId: 'shell.profile.view', label: 'View Profile', icon: UserOutlined, route: '/apps/profiles/account/basic' },
      {
        id: 'social',
        labelId: 'shell.profile.social',
        label: 'Social Profile',
        icon: ProfileOutlined,
        route: '/apps/profiles/account/personal'
      },
      { id: 'billing', labelId: 'shell.profile.billing', label: 'Billing', icon: WalletOutlined, route: '/apps/invoice/details/1' }
    ]
  },
  {
    id: 'setting',
    titleId: 'shell.profile.settingTab',
    title: 'Setting',
    items: [
      {
        id: 'account-settings',
        labelId: 'shell.profile.accountSettings',
        label: 'Account Settings',
        icon: UserOutlined,
        route: '/apps/profiles/account/settings'
      },
      { id: 'privacy', labelId: 'shell.profile.privacy', label: 'Privacy Center', icon: LockOutlined },
      { id: 'history', labelId: 'shell.profile.history', label: 'History', icon: UnorderedListOutlined }
    ]
  },
  {
    id: 'support',
    titleId: 'common.support',
    title: 'Support',
    items: [
      { id: 'support', labelId: 'common.support', label: 'Support', icon: QuestionCircleOutlined, href: SUPPORT_URL },
      { id: 'feedback', labelId: 'shell.profile.feedback', label: 'Feedback', icon: CommentOutlined, href: SUPPORT_URL }
    ]
  }
];

const ROUTE_TO_ITEM = Object.fromEntries(
  GROUPS.flatMap((group) => group.items.filter((item) => item.route).map((item) => [item.route, item.id]))
);

function ProposalMenuItem({ item, label, selected, onSelect }) {
  const Icon = item.icon;
  const externalProps = item.href ? { component: 'a', href: item.href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <ListItemButton
      {...externalProps}
      selected={selected}
      onClick={() => onSelect(item)}
      sx={{ mx: 1, px: 1.5, py: 0.75, borderRadius: 1, gap: 1.25 }}
    >
      <ListItemIcon sx={{ minWidth: 0, color: selected ? 'primary.main' : 'text.secondary' }}>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} slotProps={{ primary: { variant: 'body1' } }} />
      {item.href && (
        <Box component="span" aria-hidden="true" sx={{ display: 'inline-flex', color: 'text.secondary', fontSize: '0.75rem' }}>
          <ExportOutlined />
        </Box>
      )}
    </ListItemButton>
  );
}

// ==============================|| HEADER CONTENT - PROFILE (PROPOSAL) ||============================== //

export default function ProfileProposal() {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const t = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });

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

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [selectedId, setSelectedId] = useState(undefined);

  useEffect(() => {
    setSelectedId(ROUTE_TO_ITEM[location.pathname]);
  }, [location.pathname]);

  const handleSelect = (item) => {
    setSelectedId(item.id);
    if (item.route) navigate(item.route);
  };

  const logoutLabel = t('common.actions.logout', 'Logout');

  return (
    <Box sx={{ flexShrink: 0, ml: 'auto' }}>
      <Tooltip title={t('common.profile', 'Profile')} disableInteractive>
        <ButtonBase
          sx={(theme) => ({
            p: 0.25,
            borderRadius: 1,
            '&:focus-visible': { outline: `2px solid ${theme.vars.palette.secondary.dark}`, outlineOffset: 2 }
          })}
          aria-label={t('shell.header.openProfileAria', 'open profile')}
          ref={anchorRef}
          aria-controls={open ? 'profile-proposal-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Avatar
            alt={t('shell.profile.avatarAlt', 'profile user')}
            src={avatar1}
            size="sm"
            sx={{ '&:hover': { outline: '1px solid', outlineColor: 'primary.main' } }}
          />
        </ButtonBase>
      </Tooltip>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper
              id="profile-proposal-grow"
              sx={(theme) => ({ boxShadow: theme.vars.customShadows.z1, width: 300, minWidth: 240, maxWidth: { xs: 260, md: 300 } })}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  {user && (
                    <>
                      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', px: 2.5, py: 2.25 }}>
                        <Avatar alt={user.name} src={user.avatar ?? avatar1} sx={{ width: 40, height: 40 }} />
                        <Stack sx={{ minWidth: 0 }}>
                          <Typography variant="h6" noWrap>
                            {user.name}
                          </Typography>
                          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                            {t('shell.user.sampleRole', 'UI/UX Designer')}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Divider />
                    </>
                  )}

                  {GROUPS.map((group) => {
                    const headingId = `profile-proposal-${group.id}`;
                    return (
                      <Fragment key={group.id}>
                        <List
                          component="nav"
                          dense
                          aria-labelledby={headingId}
                          sx={{ py: 1 }}
                          subheader={
                            <ListSubheader
                              id={headingId}
                              disableSticky
                              sx={{
                                bgcolor: 'transparent',
                                lineHeight: 1.5,
                                px: 2.5,
                                pt: 0.5,
                                pb: 0.75,
                                typography: 'caption',
                                fontWeight: 600,
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em'
                              }}
                            >
                              {t(group.titleId, group.title)}
                            </ListSubheader>
                          }
                        >
                          {group.items.map((item) => (
                            <ProposalMenuItem
                              key={item.id}
                              item={item}
                              label={t(item.labelId, item.label)}
                              selected={selectedId === item.id}
                              onSelect={handleSelect}
                            />
                          ))}
                        </List>
                        <Divider />
                      </Fragment>
                    );
                  })}

                  <List dense sx={{ py: 1 }}>
                    <ListItemButton
                      onClick={handleLogout}
                      sx={{ mx: 1, px: 1.5, py: 0.75, borderRadius: 1, gap: 1.25, color: 'error.main' }}
                    >
                      <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>
                        <LogoutOutlined />
                      </ListItemIcon>
                      <ListItemText primary={logoutLabel} slotProps={{ primary: { variant: 'body1' } }} />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}

ProposalMenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired
};
