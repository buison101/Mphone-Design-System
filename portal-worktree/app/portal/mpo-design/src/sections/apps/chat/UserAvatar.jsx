import PropTypes from 'prop-types';
// material-ui
import Badge from '@mui/material/Badge';

// project imports
import AvatarStatus from './AvatarStatus';
import Avatar from 'components/@extended/Avatar';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';

export default function UserAvatar({ user, size }) {
  return (
    <Badge
      overlap="circular"
      badgeContent={<AvatarStatus status={user.online_status} />}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiBox-root': { width: 6, height: 6 },
        padding: 0,
        minWidth: 12,
        '& svg': { bgcolor: 'common.white', borderRadius: '50%' }
      }}
    >
      <Avatar
        alt={user.name}
        src={user.avatar && getImageUrl(`${user.avatar}`, ImagePath.USERS)}
        sx={size ? { width: size, height: size } : undefined}
      />
    </Badge>
  );
}

UserAvatar.propTypes = { user: PropTypes.any, size: PropTypes.number };
