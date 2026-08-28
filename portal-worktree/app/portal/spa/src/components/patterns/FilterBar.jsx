import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function FilterBar({
  children,
  ariaLabel,
  collapseAt = 'sm',
  divided = false,
  busy = false,
  busyLabel,
  resetLabel,
  resetDisabled = false,
  onReset
}) {
  return (
    <Stack
      component="section"
      aria-label={ariaLabel}
      direction={{ xs: 'column', [collapseAt]: 'row' }}
      sx={{
        alignItems: { [collapseAt]: 'center' },
        flexWrap: 'wrap',
        gap: 1.5,
        p: 2,
        borderTop: divided ? 1 : 0,
        borderColor: 'divider',
        '& > .MuiFormControl-root': { minWidth: { [collapseAt]: 168 } }
      }}
    >
      {children}
      {busy && (
        <Stack direction="row" role="status" aria-live="polite" sx={{ alignItems: 'center', gap: 0.75 }}>
          <CircularProgress size={16} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {busyLabel}
          </Typography>
        </Stack>
      )}
      {onReset && (
        <Button
          size="small"
          color="inherit"
          disabled={resetDisabled || busy}
          onClick={onReset}
          sx={{ alignSelf: { xs: 'stretch', [collapseAt]: 'center' }, ml: { [collapseAt]: 'auto' } }}
        >
          {resetLabel}
        </Button>
      )}
    </Stack>
  );
}

FilterBar.propTypes = {
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  collapseAt: PropTypes.oneOf(['sm', 'md', 'lg']),
  divided: PropTypes.bool,
  busy: PropTypes.bool,
  busyLabel: PropTypes.node,
  resetLabel: PropTypes.node,
  resetDisabled: PropTypes.bool,
  onReset: PropTypes.func
};
