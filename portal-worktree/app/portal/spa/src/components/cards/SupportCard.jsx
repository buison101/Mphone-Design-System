import PropTypes from 'prop-types';

// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| CARDS - SUPPORT ||============================== //
//
// The escape hatch on a dense page: who is on the other end, how long the wait
// is, and one button. The response time is a promise, so it belongs next to the
// people rather than inside the button label.
//
// Avatars are initials, not photographs. A portal tenant has no avatar store,
// and shipping stock faces would put strangers on a page about the customer's
// own team.

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

const TONES = ['primary', 'success', 'warning', 'info'];

export default function SupportCard({ title, caption, people = [], actionLabel, onAction }) {
  return (
    <MainCard>
      <Stack sx={{ gap: 3 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="h5" noWrap>
              {title}
            </Typography>
            {caption && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {caption}
              </Typography>
            )}
          </Stack>
          {people.length > 0 && (
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.75rem' } }}>
              {people.map((person, index) => {
                const name = typeof person === 'string' ? person : person.name;
                const tone = TONES[index % TONES.length];
                return (
                  <Tooltip key={name} title={name}>
                    <Avatar alt={name} sx={{ color: `${tone}.main`, bgcolor: `${tone}.lighter` }}>
                      {initials(name)}
                    </Avatar>
                  </Tooltip>
                );
              })}
            </AvatarGroup>
          )}
        </Stack>
        {actionLabel && onAction && (
          <Button size="small" variant="contained" onClick={onAction} sx={{ alignSelf: 'flex-start' }}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </MainCard>
  );
}

SupportCard.propTypes = {
  title: PropTypes.node,
  caption: PropTypes.node,
  people: PropTypes.array,
  actionLabel: PropTypes.node,
  onAction: PropTypes.func
};
