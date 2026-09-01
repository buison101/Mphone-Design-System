import { useRef, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popper from '@mui/material/Popper';

// project imports
import AnimateSparkle from 'components/@extended/AnimateSparkle';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';

// utils & constants
import { withAlpha } from 'utils/colorUtils';

// ==============================|| HEADER CONTENT - AI & PROMPTS MENU ||============================== //

export default function AIPromptsMenu() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const downMD = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      {downMD ? (
        <IconButton
          size="small"
          ref={anchorRef}
          onClick={handleToggle}
          {...((open || pathname.includes('ai') || pathname.includes('prompts-overview')) && {
            sx: (theme) => ({ bgcolor: withAlpha(theme.vars.palette.grey[600], 0.4) })
          })}
        >
          <AnimateSparkle triggered={true}>✨</AnimateSparkle>
        </IconButton>
      ) : (
        <Button
          color="secondary"
          variant="light"
          sx={{
            color: open || pathname.includes('ai') || pathname.includes('prompts-overview') ? 'primary.main' : 'white'
          }}
          ref={anchorRef}
          onClick={handleToggle}
        >
          <span style={{ margin: '0 6px' }}>{pathname.includes('prompts-overview') ? 'Prompts' : 'AI'}</span>
          <AnimateSparkle triggered={true}>✨</AnimateSparkle>
        </Button>
      )}
      <Popper
        placement="bottom-start"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 9]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Transitions type="zoom" {...TransitionProps}>
            <MainCard content={false} sx={{ width: 200, borderRadius: 1.5 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <List>
                  <Link underline="none" component={RouterLink} to="/ai">
                    <ListItemButton selected={pathname.includes('ai')} sx={{ px: 2, color: 'text.primary' }}>
                      <ListItemText primary="AI" />
                    </ListItemButton>
                  </Link>
                  <Link underline="none" component={RouterLink} to="/prompts-overview">
                    <ListItemButton selected={pathname.includes('prompts-overview')} sx={{ px: 2, color: 'text.primary' }}>
                      <ListItemText primary="Prompts" />
                    </ListItemButton>
                  </Link>
                </List>
              </ClickAwayListener>
            </MainCard>
          </Transitions>
        )}
      </Popper>
    </>
  );
}
