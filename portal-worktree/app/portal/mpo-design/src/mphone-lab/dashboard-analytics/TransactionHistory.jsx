import PropTypes from 'prop-types';

// material-ui
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';

// assets
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';

import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

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

// ==============================|| TRANSACTION HISTORY ||============================== //

export default function TransactionHistory({ content = {} }) {
  const items = content.items || [
    { title: 'Payment from #002434', time: 'Today, 2:00 AM', value: '+ $1,430', change: '78%' },
    { title: 'Payment from #002434', time: 'Today 6:00 AM', value: '+ $302', change: '8%' },
    { title: 'Pending from #002435', time: 'Today 2:00 AM', value: '+ $682', change: '16%' }
  ];

  return (
    <>
      <Typography variant="h5">{content.title || 'Transaction History'}</Typography>
      <MainCard border={false} sx={{ mt: 2 }} content={false}>
        <List
          component="nav"
          sx={{
            px: 0,
            py: 0,
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
                  {items[0].value}
                </Typography>
                <Typography variant="h6" sx={{ color: 'secondary.main' }} noWrap>
                  {items[0].change}
                </Typography>
              </Stack>
            }
          >
            <ListItemAvatar>
              <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                <CheckOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={<Typography variant="subtitle1">{items[0].title}</Typography>} secondary={items[0].time} />
          </ListItem>
          <ListItem
            component={ListItemButton}
            divider
            secondaryAction={
              <Stack sx={{ alignItems: 'flex-end' }}>
                <Typography variant="subtitle1" noWrap>
                  {items[1].value}
                </Typography>
                <Typography variant="h6" sx={{ color: 'secondary.main' }} noWrap>
                  {items[1].change}
                </Typography>
              </Stack>
            }
          >
            <ListItemAvatar>
              <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                <CloseOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={<Typography variant="subtitle1">{items[1].title}</Typography>} secondary={items[1].time} />
          </ListItem>
          <ListItem
            component={ListItemButton}
            secondaryAction={
              <Stack sx={{ alignItems: 'flex-end' }}>
                <Typography variant="subtitle1" noWrap>
                  {items[2].value}
                </Typography>
                <Typography variant="h6" sx={{ color: 'secondary.main' }} noWrap>
                  {items[2].change}
                </Typography>
              </Stack>
            }
          >
            <ListItemAvatar>
              <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                <ClockCircleOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={<Typography variant="subtitle1">{items[2].title}</Typography>} secondary={items[2].time} />
          </ListItem>
        </List>
      </MainCard>
      <MainCard border={false} sx={{ mt: 2 }}>
        <Stack sx={{ gap: 3 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack>
              <Typography variant="h5" noWrap>
                {content.support?.title || 'Help & Support Chat'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'secondary.main' }} noWrap>
                {content.support?.response || 'Typical replay within 5 min'}
              </Typography>
            </Stack>
            <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
              <Avatar alt={content.support?.names?.[0] || 'Remy Sharp'} src={avatar1} />
              <Avatar alt={content.support?.names?.[1] || 'Travis Howard'} src={avatar2} />
              <Avatar alt={content.support?.names?.[2] || 'Cindy Baker'} src={avatar3} />
              <Avatar alt={content.support?.names?.[3] || 'Agnes Walker'} src={avatar4} />
            </AvatarGroup>
          </Stack>
          <Button size="small" variant="contained" sx={{ maxWidth: 'max-content', px: 2.25, py: 0.75 }}>
            {content.support?.action || 'Need Help?'}
          </Button>
        </Stack>
      </MainCard>
    </>
  );
}

TransactionHistory.propTypes = { content: PropTypes.object };
