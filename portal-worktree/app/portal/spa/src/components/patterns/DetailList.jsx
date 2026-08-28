import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// ==============================|| PATTERN - DETAIL LIST ||============================== //
//
// Read-only facts about one record: label above value, two per row on a wide
// screen and one per row on a phone.
//
// Label above rather than beside, because Vietnamese labels are long enough that
// a side-by-side layout either truncates them or leaves the values on a ragged
// left edge that is hard to scan down.
//
// A missing value prints an em dash. Hiding the row instead would make two
// accounts with different data look like different pages.

export default function DetailList({ items = [], columns = 2, dense = false }) {
  const span = Math.max(1, Math.round(12 / columns));

  return (
    <Grid container spacing={dense ? 1.5 : 2.5}>
      {items.map((item, index) => (
        <Grid key={item.id ?? index} size={{ xs: 12, sm: item.full ? 12 : span }}>
          <Stack sx={{ gap: 0.25, minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {item.label}
            </Typography>
            {typeof item.value === 'string' || typeof item.value === 'number' ? (
              <Typography variant="body1">{item.value === '' ? '—' : item.value}</Typography>
            ) : (
              (item.value ?? <Typography variant="body1">—</Typography>)
            )}
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}

DetailList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.node,
      value: PropTypes.node,
      full: PropTypes.bool
    })
  ),
  columns: PropTypes.oneOf([1, 2, 3]),
  dense: PropTypes.bool
};
