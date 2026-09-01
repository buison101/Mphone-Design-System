import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';

// project imports
import Drawer from './Drawer';
import ScrollTop from 'components/ScrollTop';
import { DRAWER_WIDTH } from 'config';

// components content
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
  minHeight: `calc(100vh - 188px)`,
  width: `calc(100% - ${DRAWER_WIDTH}px)`,
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  paddingLeft: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    paddingLeft: theme.spacing(0)
  },
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        })
      }
    }
  ]
}));

export default function PromptsLayoutMain({ drawerOpen, onCloseDrawer }) {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Stack direction="row" sx={{ width: '100%', pt: { xs: 0, md: 3, xl: 5.5 } }}>
      <ScrollTop />
      <Drawer open={drawerOpen} onClose={onCloseDrawer} />
      <Main open={!downMD}>
        <Outlet />
      </Main>
    </Stack>
  );
}

PromptsLayoutMain.propTypes = { drawerOpen: PropTypes.bool, onCloseDrawer: PropTypes.func };
