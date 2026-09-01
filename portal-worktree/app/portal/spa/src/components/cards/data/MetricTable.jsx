import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import DataTableContainer from 'components/patterns/DataTableContainer';
import ContentState from 'components/states/ContentState';

// ==============================|| DATA CARDS - METRIC TABLE ||============================== //
//
// A named thing and the numbers that belong to it. Mantis draws this twice -
// once for revenue by product and once for a ranked list with a marker in the
// first column - so the marker is a cell type here rather than a second table.
//
// Numeric columns are right-aligned and set in tabular figures. Ranking by eye
// is the only reason to put numbers in a column at all, and proportional digits
// break that: the decimal points stop lining up and the column stops being
// comparable.
//
// A cell is a node, a two-line pair, or a marker. Nothing here formats a number
// or a date; the caller does that with the reader's locale, because the same
// figure is written differently in Vietnamese and English.

export default function MetricTable({ title, action, columns = [], rows = [], maxHeight, ariaLabel, state, emptyTitle, emptyDetail }) {
  const empty = !rows || rows.length === 0;

  const renderCell = (cell) => {
    if (cell && typeof cell === 'object' && !Array.isArray(cell) && cell.avatar) {
      return (
        <Avatar
          size="sm"
          color={cell.avatar.color || 'primary'}
          alt={cell.avatar.label}
          sx={{ color: `${cell.avatar.color || 'primary'}.darker` }}
        >
          {cell.avatar.text}
        </Avatar>
      );
    }
    if (cell && typeof cell === 'object' && !Array.isArray(cell) && ('primary' in cell || 'secondary' in cell)) {
      return (
        <Stack sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2">{cell.primary}</Typography>
          {cell.secondary && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {cell.secondary}
            </Typography>
          )}
        </Stack>
      );
    }
    return cell;
  };

  const table = (
    <DataTableContainer ariaLabel={ariaLabel}>
      <Table size="small" stickyHeader={!!maxHeight}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={column.id ?? index} align={column.align || 'left'}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id ?? index} hover>
              {row.cells.map((cell, cellIndex) => {
                const column = columns[cellIndex] || {};
                return (
                  <TableCell
                    key={cellIndex}
                    align={column.align || 'left'}
                    sx={column.align === 'right' ? { whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' } : undefined}
                  >
                    {renderCell(cell)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTableContainer>
  );

  return (
    <MainCard title={title} secondary={action} content={false}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (maxHeight ? <Box sx={{ maxHeight, overflowY: 'auto' }}>{table}</Box> : table)}
    </MainCard>
  );
}

MetricTable.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  columns: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, label: PropTypes.node, align: PropTypes.string })),
  rows: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), cells: PropTypes.array })),
  maxHeight: PropTypes.number,
  ariaLabel: PropTypes.string,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
