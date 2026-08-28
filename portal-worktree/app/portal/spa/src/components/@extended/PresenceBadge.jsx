import PropTypes from 'prop-types';

// material-ui
import Badge from '@mui/material/Badge';

// ==============================|| EXTENDED - PRESENCE BADGE ||============================== //
//
// The status ring on an avatar. Wraps whatever avatar is passed rather than
// drawing one, so the same badge works on a 32px list row and a 72px header.
//
// Presence is never colour alone: every caller also renders the state as text
// next to the name. A green ring on its own is unreadable to a red-green reader
// and invisible in a monochrome screenshot.
//
// The states are the ones a PBX actually reports. "Unknown" is deliberate and
// common — an extension the server has not heard from is not the same as one it
// knows to be offline, and pretending otherwise makes the list lie.

const PRESENCE_COLOR = {
  available: 'success',
  ringing: 'warning',
  busy: 'error',
  away: 'warning',
  offline: 'secondary',
  unknown: 'secondary'
};

export default function PresenceBadge({ presence = 'unknown', label, children, size = 10 }) {
  const color = PRESENCE_COLOR[presence] || 'secondary';
  const hollow = presence === 'offline' || presence === 'unknown';

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      // the label is the accessible half of the state; the ring is decoration
      badgeContent={<span aria-label={label} role={label ? 'img' : undefined} />}
      sx={{
        '& .MuiBadge-badge': {
          minWidth: size,
          width: size,
          height: size,
          padding: 0,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: 'background.paper',
          bgcolor: hollow ? 'background.paper' : `${color}.main`,
          boxShadow: hollow ? (theme) => `inset 0 0 0 2px ${theme.vars.palette[color].main}` : 'none'
        }
      }}
    >
      {children}
    </Badge>
  );
}

PresenceBadge.propTypes = {
  presence: PropTypes.oneOf(['available', 'ringing', 'busy', 'away', 'offline', 'unknown']),
  label: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.number
};
