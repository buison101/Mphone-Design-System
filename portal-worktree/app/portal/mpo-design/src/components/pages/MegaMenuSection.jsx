import { useRef, useState } from 'react';

import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project imports
import MegaMenuContent from './MegaMenuContent';
import Transitions from 'components/@extended/Transitions';

// assets
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';

// ==============================|| HEADER CONTENT - MEGA MENU SECTION ||============================== //

export default function MegaMenuSection() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

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
      <Button
        color="secondary"
        variant="light"
        size="small"
        sx={{ color: open ? 'primary.main' : 'white', height: 36 }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        endIcon={
          <DownOutlined
            style={{ fontSize: 12, transition: 'transform 0.3s ease-in-out', transform: open ? 'rotate(-180deg)' : 'rotate(0deg)' }}
          />
        }
      >
        Pages
      </Button>
      {downMD ? (
        <Drawer
          anchor="right"
          open={open}
          onClose={handleToggle}
          sx={{ '& .MuiDrawer-paper': { width: 320, backgroundImage: 'none' }, zIndex: 1201 }}
        >
          {open && (
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 2 }}>
              <Typography variant="h5">Pages</Typography>
              <IconButton color="secondary" onClick={handleToggle} size="small" sx={{ fontSize: '0.875rem' }}>
                <CloseOutlined />
              </IconButton>
            </Stack>
          )}
          <MegaMenuContent />
        </Drawer>
      ) : (
        <Popper
          placement="bottom"
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          sx={{ width: 1, zIndex: 1201 }}
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: { offset: [0, 9] }
              }
            ]
          }}
        >
          {({ TransitionProps }) => (
            <Transitions type="grow" position="top" in={open} {...TransitionProps}>
              <Paper sx={(theme) => ({ boxShadow: theme.vars.customShadows.z1, width: 860, mx: { xs: 2, sm: 0 } })}>
                <ClickAwayListener onClickAway={handleClose}>
                  {/* Box component is used to ref. or wrap the MegaMenuContent component */}
                  <Box>
                    <MegaMenuContent />
                  </Box>
                </ClickAwayListener>
              </Paper>
            </Transitions>
          )}
        </Popper>
      )}
    </>
  );
}
