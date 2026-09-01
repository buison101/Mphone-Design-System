// material-ui
import List from '@mui/material/List';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AcquisitionChart from './AcquisitionChart';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';

// assets
import FundProjectionScreenOutlined from '@ant-design/icons/FundProjectionScreenOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| ANALYTICS - ACQUISITION CHANNELS ||============================== //

export default function AcquisitionChannels() {
  const intl = useIntl();
  return (
    <MainCard content={false}>
      <Stack>
        <List sx={{ p: 0, '& .MuiListItemButton-root': { pt: 2, pb: 0 } }}>
          <ListItemButton sx={{ '&:hover': { bgcolor: 'transparent' }, cursor: 'text' }}>
            <ListItemText
              primary={
                <Typography variant="subtitle1">
                  <FormattedMessage id="dashboard.acquisition.title" />
                </Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'inline' }}>
                  <FormattedMessage id="dashboard.acquisition.marketing" />
                </Typography>
              }
            />
            <Typography variant="h5" sx={{ color: 'primary.main' }}>
              +128
            </Typography>
          </ListItemButton>
        </List>
        <Box>
          <AcquisitionChart />
        </Box>

        <List
          component="nav"
          sx={{
            p: 0,
            '& .MuiListItemButton-root': {
              py: 1.5,
              px: 2,
              '& .MuiAvatar-root': avatarSX,
              '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
            }
          }}
        >
          <ListItem
            component={ListItemButton}
            divider
            secondaryAction={
              <Stack sx={{ alignItems: 'flex-end' }}>
                <Typography variant="subtitle1" noWrap>
                  + $1,430
                </Typography>
                <Typography variant="h6" sx={{ color: 'secondary.main' }} noWrap>
                  35%
                </Typography>
              </Stack>
            }
          >
            <ListItemAvatar>
              <Avatar type="combined" color="secondary" sx={{ border: 'none', color: 'text.primary', bgcolor: 'secondary.200' }}>
                <FundProjectionScreenOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle1">
                  <FormattedMessage id="dashboard.acquisition.topChannels" />
                </Typography>
              }
              secondary={intl.formatMessage({ id: 'dashboard.transaction.today' }, { time: '02:00' })}
            />
          </ListItem>
          <ListItem
            divider
            component={ListItemButton}
            secondaryAction={
              <Stack sx={{ alignItems: 'flex-end' }}>
                <Typography variant="subtitle1" noWrap>
                  - $1430
                </Typography>
                <Typography variant="h6" sx={{ color: 'secondary.main' }} noWrap>
                  35%
                </Typography>
              </Stack>
            }
          >
            <ListItemAvatar>
              <Avatar type="combined" sx={{ border: 'none' }}>
                <FileTextOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="subtitle1">
                  <FormattedMessage id="dashboard.acquisition.topPages" />
                </Typography>
              }
              secondary={intl.formatMessage({ id: 'dashboard.transaction.today' }, { time: '06:00' })}
            />
          </ListItem>
        </List>
      </Stack>
    </MainCard>
  );
}
