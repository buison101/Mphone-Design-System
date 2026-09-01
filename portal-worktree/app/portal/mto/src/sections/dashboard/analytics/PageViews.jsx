// material-ui
import List from '@mui/material/List';

// third-party
import { FormattedMessage } from 'react-intl';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| PAGE VIEWS BY PAGE TITLE ||============================== //

export default function PageViews() {
  return (
    <>
      <Typography variant="h5">
        <FormattedMessage id="dashboard.pageViews.title" />
      </Typography>

      <MainCard sx={{ mt: 2 }} content={false}>
        <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
          <ListItemButton divider>
            <ListItemText
              primary={<FormattedMessage id="nav.dashboard.dashboard" />}
              secondary="/dashboard/default"
              slotProps={{
                primary: { variant: 'subtitle1' },
                secondary: { variant: 'body1', sx: { display: 'inline', color: 'text.secondary' } }
              }}
            />
            <Stack sx={{ alignItems: 'flex-end' }}>
              <Typography variant="h5" sx={{ color: 'primary.main' }}>
                7755
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                31.74% (-100.00%)
              </Typography>
            </Stack>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText
              primary={<FormattedMessage id="nav.dashboard.analytics" />}
              secondary="/dashboard/analytics"
              slotProps={{
                primary: { variant: 'subtitle1' },
                secondary: { variant: 'body1', sx: { display: 'inline', color: 'text.secondary' } }
              }}
            />
            <Stack sx={{ alignItems: 'flex-end' }}>
              <Typography variant="h5" sx={{ color: 'primary.main' }}>
                5215
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', display: 'block' }}>
                28.53% (-100.00%)
              </Typography>
            </Stack>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText
              primary={<FormattedMessage id="nav.apps.customer" />}
              secondary="/apps/customer/customer-list"
              slotProps={{
                primary: { variant: 'subtitle1' },
                secondary: { variant: 'body1', sx: { display: 'inline', color: 'text.secondary' } }
              }}
            />
            <Stack sx={{ alignItems: 'flex-end' }}>
              <Typography variant="h5" sx={{ color: 'primary.main' }}>
                4848
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', display: 'block' }}>
                25.35% (-100.00%)
              </Typography>
            </Stack>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText
              primary={<FormattedMessage id="nav.apps.invoice" />}
              secondary="/apps/invoice/list"
              slotProps={{
                primary: { variant: 'subtitle1' },
                secondary: { variant: 'body1', sx: { display: 'inline', color: 'text.secondary' } }
              }}
            />
            <Stack sx={{ alignItems: 'flex-end' }}>
              <Typography variant="h5" sx={{ color: 'primary.main' }}>
                3275
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', display: 'block' }}>
                23.17% (-100.00%)
              </Typography>
            </Stack>
          </ListItemButton>
          <ListItemButton divider>
            <ListItemText
              primary={<FormattedMessage id="nav.apps.chat" />}
              secondary="/apps/chat"
              slotProps={{
                primary: { variant: 'subtitle1' },
                secondary: { variant: 'body1', sx: { display: 'inline', color: 'text.secondary' } }
              }}
            />
            <Stack sx={{ alignItems: 'flex-end' }}>
              <Typography variant="h5" sx={{ color: 'primary.main' }}>
                3003
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', display: 'block' }}>
                22.21% (-100.00%)
              </Typography>
            </Stack>
          </ListItemButton>
        </List>
      </MainCard>
    </>
  );
}
