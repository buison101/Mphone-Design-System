import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import DataTableContainer from 'components/patterns/DataTableContainer';
import ContentState from 'components/states/ContentState';

// ==============================|| DATA CARDS - SUMMARY TABLE ||============================== //
//
// Three figures over the rows they came from. The figures answer "how much", the
// rows answer "from what", and putting them in one card is what stops a reader
// having to trust a total printed somewhere else on the page.
//
// The figures are peers, not a hero and two footnotes: they are the same size,
// because a period comparison where one number is drawn larger tells the reader
// which one to care about before they have read either.
//
// The list scrolls inside the card rather than growing it. A card that gets
// taller with every row is a card that decides the height of the whole grid row
// beside it.

export default function SummaryTableCard({
  title,
  action,
  figures = [],
  headers = [],
  rows = [],
  maxHeight = 290,
  ariaLabel,
  state,
  emptyTitle,
  emptyDetail
}) {
  const empty = !rows || rows.length === 0;

  return (
    <MainCard title={title} secondary={action} content={false}>
      {figures.length > 0 && (
        <>
          <Box sx={{ p: 2.5 }}>
            <Grid container spacing={2}>
              {figures.map((figure, index) => (
                <Grid key={figure.id ?? index} size={{ xs: 12, sm: 4 }}>
                  <Stack sx={{ gap: 0.5, alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {figure.label}
                    </Typography>
                    <Typography variant="h5" component="p">
                      {figure.value}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Divider />
        </>
      )}

      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <Box sx={{ maxHeight, overflowY: 'auto' }}>
          <DataTableContainer ariaLabel={ariaLabel}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableCell key={index} align={index === headers.length - 1 ? 'right' : 'left'}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row.id ?? index} hover>
                    {row.cells.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        align={cellIndex === row.cells.length - 1 ? 'right' : 'left'}
                        sx={cellIndex === row.cells.length - 1 ? { whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' } : undefined}
                      >
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTableContainer>
        </Box>
      )}
    </MainCard>
  );
}

SummaryTableCard.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  figures: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, label: PropTypes.node, value: PropTypes.node })),
  headers: PropTypes.arrayOf(PropTypes.node),
  rows: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), cells: PropTypes.array })),
  maxHeight: PropTypes.number,
  ariaLabel: PropTypes.string,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
