import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmActionDialog({ open, title, description, cancelLabel, confirmLabel, onCancel, onConfirm, busy = false }) {
  return (
    <Dialog open={open} onClose={busy ? undefined : onCancel} aria-labelledby="confirm-action-title" maxWidth="xs" fullWidth>
      <DialogTitle id="confirm-action-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="inherit" onClick={onCancel} disabled={busy}>
          {cancelLabel}
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={busy} autoFocus>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmActionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  cancelLabel: PropTypes.node.isRequired,
  confirmLabel: PropTypes.node.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  busy: PropTypes.bool
};
