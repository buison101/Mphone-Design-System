import UserOutlined from '@ant-design/icons/UserOutlined';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

import Avatar from 'components/@extended/Avatar';
import { useGetMenuMaster } from 'api/menu';
import usePortalSession from '../hooks/usePortalSession';

export default function MphoneUiDrawerUser() {
  const { menuMaster } = useGetMenuMaster();
  const { session } = usePortalSession();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <Box sx={{ p: 1.25, px: drawerOpen ? 3 : 1.25, borderTop: '1px solid', borderTopColor: 'divider' }}>
      <ListItem disablePadding>
        <ListItemAvatar>
          <Avatar color="primary" type="filled" sx={{ ...(drawerOpen && { width: 42, height: 42 }) }}>
            <UserOutlined />
          </Avatar>
        </ListItemAvatar>
        {drawerOpen && (
          <ListItemText
            primary={session?.user?.username || 'Mphone'}
            secondary={session?.domain?.domain_name || 'Design preview'}
            slotProps={{ primary: { noWrap: true }, secondary: { noWrap: true } }}
          />
        )}
      </ListItem>
    </Box>
  );
}
