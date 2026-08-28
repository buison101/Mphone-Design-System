import PropTypes from 'prop-types';

// material-ui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| PATTERN - DANGER ACTION ||============================== //
//
// One irreversible action, with its consequence spelled out beside it rather
// than only inside the confirmation that follows. A reader who has understood
// the row before clicking is a reader who cannot be surprised by the dialog.
//
// The button is outlined, not contained: this is never the primary action of a
// page, and a filled red button competes with the real one.
//
// The component does not confirm anything itself — pair it with
// ConfirmActionDialog, which owns the second step and its wording.

export default function DangerAction({ title, description, actionLabel, onAction, busy = false, disabled = false }) {
  return (
    <MainCard sx={{ borderColor: 'error.light' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <Stack sx={{ gap: 0.25, minWidth: 0 }}>
          <Typography variant="subtitle1">{title}</Typography>
          {description && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {description}
            </Typography>
          )}
        </Stack>
        <Button
          color="error"
          variant="outlined"
          onClick={onAction}
          disabled={disabled || busy}
          sx={{ flexShrink: 0, alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          {actionLabel}
        </Button>
      </Stack>
    </MainCard>
  );
}

DangerAction.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  actionLabel: PropTypes.node.isRequired,
  onAction: PropTypes.func.isRequired,
  busy: PropTypes.bool,
  disabled: PropTypes.bool
};
