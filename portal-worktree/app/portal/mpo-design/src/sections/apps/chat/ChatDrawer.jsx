import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import UserList from './UserList';
import { drawerWidth } from 'pages/apps/chat';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';

// assets
import SearchOutlined from '@ant-design/icons/SearchOutlined';

export default function ChatDrawer({ handleDrawerOpen, openChatDrawer, setUser, selectedUser }) {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const [search, setSearch] = useState('');
  const handleSearch = async (event) => {
    const newString = event?.target.value;
    setSearch(newString);
  };

  return (
    <Drawer
      sx={{
        mt: { xs: 7.5, lg: 0 },
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: openChatDrawer ? 'block' : 'none', lg: 'block' },
        zIndex: { xs: openChatDrawer ? 1100 : -1, lg: 0 }
      }}
      variant={downLG ? 'temporary' : 'persistent'}
      anchor="left"
      open={openChatDrawer}
      ModalProps={{ keepMounted: true }}
      slotProps={{ paper: { sx: { height: 1, width: drawerWidth, boxSizing: 'border-box', position: 'relative', border: 'none' } } }}
      onClose={handleDrawerOpen}
    >
      <MainCard
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '4px 0 0 4px',
          borderRight: 'none',
          height: 1,
          '& div:nth-of-type(2)': { height: 'auto' }
        }}
        border={false}
        content={false}
      >
        <Box sx={{ px: 2, pt: 2.5, pb: 0.5 }}>
          <Stack sx={{ gap: 2 }}>
            <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
              <Typography variant="h5" sx={{ color: 'inherit' }}>
                Messages
              </Typography>
              <Chip
                label="9"
                color="secondary"
                slotProps={{ label: { sx: { px: 0.5 } } }}
                sx={{ width: 20, height: 20, borderRadius: '50%' }}
              />
            </Stack>

            <OutlinedInput
              fullWidth
              id="input-search-header"
              placeholder="Search"
              value={search}
              onChange={handleSearch}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' } }}
              slotProps={{ input: { sx: { py: 1 } } }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchOutlined style={{ fontSize: 'small' }} />
                </InputAdornment>
              }
            />
          </Stack>
        </Box>

        <SimpleBar
          sx={{
            overflowX: 'hidden',
            height: downLG ? 'calc(100vh - 354px)' : 'calc(100vh - 406px)',
            minHeight: downLG ? 0 : 420
          }}
        >
          <Box sx={{ width: 1 }}>
            <UserList setUser={setUser} search={search} selectedUser={selectedUser} />
          </Box>
        </SimpleBar>
      </MainCard>
    </Drawer>
  );
}

ChatDrawer.propTypes = {
  handleDrawerOpen: PropTypes.func,
  openChatDrawer: PropTypes.oneOfType([PropTypes.any, PropTypes.bool]),
  setUser: PropTypes.func,
  selectedUser: PropTypes.oneOfType([PropTypes.any, PropTypes.string])
};
