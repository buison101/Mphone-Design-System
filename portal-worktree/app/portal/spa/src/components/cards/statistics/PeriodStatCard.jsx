import PropTypes from 'prop-types';

// material-ui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

// ==============================|| STATISTICS - PERIOD STAT CARD ||============================== //
//
// A figure that is only true for a stated window, with the window written next
// to it.
//
// This is the shape Mantis uses for Impressions, Goal and Impact — and the one
// thing it gets exactly right on that page. "1,563" means nothing; "1,563, May
// 23 – June 01" is a fact. Any number that would change if you asked yesterday
// belongs in this card rather than a plain tile, and on a PBX that is most of
// them: calls, minutes, missed, cost.
//
// The round icon is decorative and hidden from assistive technology. If `onAction`
// is given it becomes a real button instead — a card that only sometimes has an
// action must not leave a dead control behind on the times it does not.

export default function PeriodStatCard({ title, value, period, icon: Icon, color = 'primary', onAction, actionLabel }) {
  const mark = Icon ? <Icon /> : null;

  return (
    <MainCard contentSX={{ p: 2.5 }}>
      <Stack direction="row" sx={{ gap: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Stack sx={{ gap: 0.5, minWidth: 0 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ lineHeight: 1.15 }}>
            {value}
          </Typography>
          {period && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {period}
            </Typography>
          )}
        </Stack>

        {mark &&
          (onAction ? (
            <IconButton color={color} variant="light" size="large" onClick={onAction} aria-label={actionLabel} sx={{ flexShrink: 0 }}>
              {mark}
            </IconButton>
          ) : (
            <Avatar aria-hidden="true" alt="" color={color} size="md" sx={{ flexShrink: 0 }}>
              {mark}
            </Avatar>
          ))}
      </Stack>
    </MainCard>
  );
}

PeriodStatCard.propTypes = {
  title: PropTypes.node,
  value: PropTypes.node,
  period: PropTypes.node,
  icon: PropTypes.elementType,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),
  onAction: PropTypes.func,
  actionLabel: PropTypes.string
};
