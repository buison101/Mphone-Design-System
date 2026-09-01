import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import { INVOICE_STATUS_COLOR, INVOICE_STATUS_ICON } from 'utils/invoiceStatus';

// ==============================|| BILLING - INVOICE FILTER GRID ||============================== //
//
// Mantis puts a grid of icon tiles here and calls them shortcuts. Two of its six
// are not filters at all — "Reports" is a sidebar destination and "Draft" is a
// state only the party issuing the invoice can see — so a reader learns that a
// tile in this grid might navigate, or might filter, and has to click to find
// out. Here every tile does the same thing: it filters the list beside it.
//
// Each tile carries its count. Mantis's tiles are unlabelled beyond their name,
// which means the reader clicks "Overdue" to discover whether there is anything
// overdue. The count answers that before the click, and makes an empty state
// something the reader chose rather than something they hit.
//
// The tiles are real buttons with aria-pressed, not clickable boxes: this is a
// filter group, and a keyboard reader has to be able to tell which one is on.

export default function InvoiceFilterGrid({ title, items = [], value = 'all', onChange }) {
  const theme = useTheme();

  return (
    <MainCard title={title} contentSX={{ p: 2.5 }}>
      <Grid container spacing={1.5}>
        {items.map((item) => {
          const Icon = INVOICE_STATUS_ICON[item.id];
          const tone = INVOICE_STATUS_COLOR[item.id];
          const active = value === item.id;

          return (
            // "all" takes the full row: it is the reset, not a fifth status, and
            // the four states below it then sit as a tidy 2 x 2 with no orphan
            <Grid key={item.id} size={item.id === 'all' ? 12 : 6}>
              <Stack
                component="button"
                type="button"
                aria-pressed={active}
                onClick={() => onChange?.(item.id)}
                sx={{
                  width: '100%',
                  gap: 0.75,
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  px: 1,
                  py: item.id === 'all' ? 1.5 : 2,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  border: `1px solid ${active ? theme.vars.palette[tone].main : theme.vars.palette.divider}`,
                  // the active tile is marked by its border and a tint, never by
                  // colour alone: aria-pressed carries it for anyone not seeing
                  // either
                  ...(active && { bgcolor: theme.vars.palette[tone].lighter }),
                  transition: 'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out',
                  '&:hover': { borderColor: theme.vars.palette[tone].main },
                  '&:focus-visible': { outline: `2px solid ${theme.vars.palette.primary.main}`, outlineOffset: 2 }
                }}
              >
                <Avatar alt={item.label} type="filled" color={tone} size="sm">
                  {Icon ? <Icon /> : null}
                </Avatar>
                <Typography variant="h5" sx={{ lineHeight: 1.1 }}>
                  {item.count}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {item.label}
                </Typography>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </MainCard>
  );
}

InvoiceFilterGrid.propTypes = {
  title: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.node,
      count: PropTypes.node
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func
};
