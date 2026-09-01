import PropTypes from 'prop-types';
import { useEffect, useId, useState } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

// material-ui
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage } from 'react-intl';

// project imports
import NavItem from './NavItem';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import DownOutlined from '@ant-design/icons/DownOutlined';

function containsActiveRoute(item, pathname) {
  if (item.url) return !!matchPath({ path: item.url, end: false }, pathname);
  return (item.children ?? []).some((child) => containsActiveRoute(child, pathname));
}

// ==============================|| NAVIGATION - COLLAPSE ||============================== //
//
// The free Mantis template renders "collapse - only available in paid version"
// where a nested menu should be. This is that level, written for this portal.
//
// Three behaviours are what make a collapse worth having rather than a folder
// that hides things:
//
//   It opens itself when one of its children is the current route. Landing on
//   /auth/check-mail from a link and finding its section shut, with no clue
//   which section it lives in, is the usual way a nested menu loses people.
//   The effect re-runs on navigation, so it also reopens after a route change.
//
//   Closing it while a child is active is allowed. The auto-open sets the
//   initial state; it does not fight the reader for it afterwards.
//
//   In the mini drawer there is nowhere to put children, so the header opens the
//   drawer first and expands on the way. Mantis Pro floats a popper out of the
//   rail instead; a popper anchored to a 36px icon needs its own focus trap and
//   its own dismissal rules, and getting those subtly wrong is worse than one
//   extra frame of drawer animation.
//
// The chevron is aria-hidden and the state lives on aria-expanded, so a screen
// reader is told the section is collapsed rather than told there is a triangle.

export default function NavCollapse({ item, level = 1 }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const { pathname } = useLocation();
  const listId = useId();

  const hasActiveChild = (item.children ?? []).some((child) => containsActiveRoute(child, pathname));

  const [open, setOpen] = useState(hasActiveChild);

  useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [hasActiveChild]);

  const Icon = item.icon;
  const selected = hasActiveChild && !open;

  const toggle = () => {
    // the rail has no room for children; open the drawer and expand together
    if (!drawerOpen) {
      handlerDrawerOpen(true);
      setOpen(true);
      return;
    }
    setOpen((prev) => !prev);
  };

  return (
    <>
      <ListItemButton
        onClick={toggle}
        selected={selected}
        aria-expanded={drawerOpen ? open : false}
        aria-controls={listId}
        sx={(theme) => ({
          zIndex: 1201,
          pl: drawerOpen ? `${level * 28}px` : 1.5,
          py: !drawerOpen && level === 1 ? 1.25 : 1,
          ...(drawerOpen && {
            '&:hover': {
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              '& .MuiListItemIcon-root, & .MuiTypography-root': { color: 'primary.main' }
            },
            '&.Mui-selected': {
              bgcolor: 'primary.lighter',
              borderRight: '2px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.lighter',
                '& .MuiListItemIcon-root, & .MuiTypography-root': { color: 'primary.main' }
              }
            }
          }),
          ...(!drawerOpen && {
            '&:hover': { bgcolor: 'transparent' },
            '&.Mui-selected': { '&:hover': { bgcolor: 'transparent' }, bgcolor: 'transparent' }
          }),
          ...(drawerOpen &&
            theme.applyStyles('dark', {
              '& .MuiListItemIcon-root, & .MuiTypography-root': { color: theme.vars.palette.grey[600] },
              '&:hover': {
                backgroundColor: theme.vars.palette.divider,
                '& .MuiTypography-root': { color: theme.vars.palette.text.primary },
                '& .MuiListItemIcon-root': { color: theme.vars.palette.primary.main }
              },
              '&.Mui-selected': {
                backgroundColor: theme.vars.palette.divider,
                borderColor: theme.vars.palette.primary.main,
                '& .MuiTypography-root': { color: theme.vars.palette.text.primary },
                '& .MuiListItemIcon-root': { color: theme.vars.palette.primary.main }
              }
            })),
          ...(!drawerOpen &&
            theme.applyStyles('dark', {
              '& .MuiListItemIcon-root': { color: theme.vars.palette.grey[600] },
              '&:hover .MuiListItemIcon-root, &.Mui-selected .MuiListItemIcon-root': {
                backgroundColor: theme.vars.palette.divider,
                color: theme.vars.palette.primary.main
              }
            }))
        })}
      >
        {Icon && (
          <ListItemIcon
            sx={{
              minWidth: 28,
              color: selected || open ? 'primary.main' : 'text.primary',
              ...(!drawerOpen && {
                borderRadius: 1.5,
                width: 36,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                '.MuiListItemButton-root:hover &': { bgcolor: 'primary.lighter', color: 'primary.main' }
              }),
              ...(!drawerOpen && selected && { bgcolor: 'primary.lighter' })
            }}
          >
            <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} />
          </ListItemIcon>
        )}

        {drawerOpen && (
          <>
            <ListItemText
              primary={
                <Typography variant="h6" sx={{ color: selected || open ? 'primary.main' : 'text.primary' }}>
                  <FormattedMessage id={item.title} defaultMessage={item.title} />
                </Typography>
              }
            />
            <DownOutlined
              aria-hidden="true"
              style={{
                fontSize: '0.625rem',
                transform: open ? 'rotate(-180deg)' : 'rotate(0deg)',
                transition: 'transform 0.25s ease-in-out'
              }}
            />
          </>
        )}
      </ListItemButton>

      {/* timeout="auto" measures the list, so adding a child never means
          revisiting a hard-coded duration; unmountOnExit keeps a closed section's
          links out of the tab order */}
      <Collapse in={drawerOpen && open} timeout="auto" unmountOnExit>
        <List id={listId} disablePadding sx={{ '& .MuiListItemButton-root': { pl: `${(level + 1) * 28}px` } }}>
          {(item.children ?? []).map((child) =>
            child.type === 'collapse' ? (
              <NavCollapse key={child.id} item={child} level={level + 1} />
            ) : (
              <NavItem key={child.id} item={child} level={level + 1} />
            )
          )}
        </List>
      </Collapse>
    </>
  );
}

NavCollapse.propTypes = { item: PropTypes.any, level: PropTypes.number };
