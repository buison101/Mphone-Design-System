import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import ContentState from 'components/states/ContentState';
import { INVOICE_STATUS_COLOR, INVOICE_STATUS_ICON, isBilled } from 'utils/invoiceStatus';

// ==============================|| BILLING - INVOICE LIST ||============================== //
//
// One row per invoice: what it is on the left, what it costs and where it stands
// on the right.
//
// No avatars. Mantis puts a face on every row because its invoices are addressed
// to people; a tenant's invoices all come from the same provider, so twelve
// copies of one logo would be twelve rows of noise.
//
// No "View All" button. There is no invoice detail route and no invoice archive
// to send the reader to, and a button that goes nowhere is a promise the build
// cannot keep. The footer states how many rows are being held back instead.
//
// Rows are ListItem, not ListItemButton, for the same reason: nothing opens.
//
// The status chip carries an icon and a text label as well as its colour. Paid
// against overdue is the one comparison on this page where getting the colour
// wrong costs the reader money.

const chipIconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

export default function InvoiceListCard({ title, secondary, items = [], footer, state = 'ready', emptyTitle, emptyDetail }) {
  const empty = !items || items.length === 0;

  return (
    <MainCard title={title} secondary={secondary} content={false}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <>
          <List sx={{ p: 0 }}>
            {items.map((item, index) => {
              const tone = INVOICE_STATUS_COLOR[item.status];
              const Icon = INVOICE_STATUS_ICON[item.status];

              return (
                <ListItem key={item.id} divider={index < items.length - 1} sx={{ px: 2.5, py: 1.75, gap: 1.5, alignItems: 'flex-start' }}>
                  <ListItemText
                    sx={{ m: 0, minWidth: 0 }}
                    primary={
                      <Typography variant="subtitle1" noWrap>
                        {item.id}
                      </Typography>
                    }
                    secondary={
                      <>
                        {item.period}
                        {item.note && (
                          <>
                            {' · '}
                            {item.note}
                          </>
                        )}
                      </>
                    }
                    slotProps={{ secondary: { variant: 'caption', color: 'text.secondary' } }}
                  />
                  <Stack sx={{ alignItems: 'flex-end', flexShrink: 0, gap: 0.75 }}>
                    <Typography
                      variant="subtitle1"
                      noWrap
                      // a cancelled amount was never charged; struck through so
                      // it cannot be added up by eye with the rows above it
                      sx={isBilled(item) ? undefined : { color: 'text.secondary', textDecoration: 'line-through' }}
                    >
                      {item.amount}
                    </Typography>
                    <Chip
                      size="small"
                      variant="combined"
                      color={tone}
                      icon={Icon ? <Icon style={chipIconSX} /> : undefined}
                      label={item.statusLabel}
                      sx={{ pl: Icon ? 1 : 0 }}
                    />
                    {item.meta && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                        {item.meta}
                      </Typography>
                    )}
                  </Stack>
                </ListItem>
              );
            })}
          </List>
          {footer && (
            <>
              <Divider />
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', px: 2.5, py: 1.75 }}>
                {footer}
              </Typography>
            </>
          )}
        </>
      )}
    </MainCard>
  );
}

InvoiceListCard.propTypes = {
  title: PropTypes.node,
  secondary: PropTypes.node,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      period: PropTypes.node,
      note: PropTypes.node,
      amount: PropTypes.node,
      status: PropTypes.oneOf(['paid', 'pending', 'overdue', 'cancelled']),
      statusLabel: PropTypes.node,
      meta: PropTypes.node
    })
  ),
  footer: PropTypes.node,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
