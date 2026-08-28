import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// ==============================|| CARDS - PROFILE SUMMARY ||============================== //
//
// The identity rail beside a detail view: who this is, in one column, so the
// reader keeps the subject in sight while the panel next to it changes.
//
// Initials, not a photograph. A PBX tenant has no avatar store, and a stock face
// would put a stranger on the customer's own account page.
//
// The counts are the two or three numbers worth carrying at all times. Anything
// that needs a unit, a trend or a filter belongs in a panel, not here.

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export default function ProfileSummaryCard({ name, subtitle, badge, badgeColor = 'primary', stats = [], meta = [] }) {
  return (
    <MainCard>
      <Stack sx={{ gap: 2.5 }}>
        <Stack sx={{ alignItems: 'center', gap: 1, textAlign: 'center' }}>
          <Avatar alt={typeof name === 'string' ? name : undefined} size="xl" color="primary">
            {initials(typeof name === 'string' ? name : '')}
          </Avatar>
          <Stack sx={{ gap: 0.25 }}>
            <Typography variant="h5" sx={{ wordBreak: 'break-word' }}>
              {name}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                {subtitle}
              </Typography>
            )}
          </Stack>
          {badge && <Chip size="small" variant="combined" color={badgeColor} label={badge} />}
        </Stack>

        {stats.length > 0 && (
          <>
            <Divider />
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} sx={{ justifyContent: 'space-around' }}>
              {stats.map((stat, index) => (
                <Stack key={stat.id ?? index} sx={{ alignItems: 'center', gap: 0.25, px: 1, minWidth: 0 }}>
                  <Typography variant="h5">{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    {stat.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </>
        )}

        {meta.length > 0 && (
          <>
            <Divider />
            <Stack sx={{ gap: 1.5 }}>
              {meta.map((row, index) => {
                const Icon = row.icon;
                return (
                  <Stack key={row.id ?? index} direction="row" sx={{ gap: 1.25, alignItems: 'flex-start', minWidth: 0 }}>
                    {Icon && (
                      <Box aria-hidden="true" sx={{ color: 'text.secondary', lineHeight: 1, mt: '2px' }}>
                        <Icon />
                      </Box>
                    )}
                    <Typography variant="body2" sx={{ wordBreak: 'break-word', minWidth: 0 }}>
                      {row.text}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </>
        )}
      </Stack>
    </MainCard>
  );
}

ProfileSummaryCard.propTypes = {
  name: PropTypes.node,
  subtitle: PropTypes.node,
  badge: PropTypes.node,
  badgeColor: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.node,
      value: PropTypes.node
    })
  ),
  meta: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      icon: PropTypes.elementType,
      text: PropTypes.node
    })
  )
};
