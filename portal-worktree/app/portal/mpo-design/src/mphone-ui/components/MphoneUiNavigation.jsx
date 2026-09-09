import { FormattedMessage } from 'react-intl';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import { useGetMenuMaster } from 'api/menu';
import NavItem from 'layout/Dashboard/Drawer/DrawerContent/Navigation/NavItem';
import mphoneUiMenu from '../menu-items';

export default function MphoneUiNavigation() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const group = mphoneUiMenu.items[0];

  return (
    <Box sx={{ pt: drawerOpen ? 2 : 0, '& > ul:first-of-type': { mt: 0 } }}>
      <List
        subheader={
          drawerOpen ? (
            <Box sx={{ pl: 3, mb: 1 }}>
              <Typography variant="body2" component="h6" sx={{ color: 'text.secondary' }}>
                <FormattedMessage id={group.title} />
              </Typography>
            </Box>
          ) : null
        }
        sx={{ mt: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
      >
        {group.children.map((item) => (
          <NavItem key={item.id} item={item} level={1} />
        ))}
      </List>
    </Box>
  );
}
