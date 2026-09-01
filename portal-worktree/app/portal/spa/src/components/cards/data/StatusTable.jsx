import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// project imports
import MainCard from 'components/MainCard';
import DataTableContainer from 'components/patterns/DataTableContainer';
import ContentState from 'components/states/ContentState';

// ==============================|| DATA CARDS - STATUS TABLE ||============================== //
//
// A plain list of requests with their state at the end. The state is an outlined
// chip in one neutral colour, which is Mantis's own choice here and the right
// one: open, in progress and closed are stages of the same thing, not three
// severities, and painting them red, amber and green would spend the page's
// loudest signal on a queue that is behaving normally.
//
// The word is therefore the whole message, so it is never abbreviated and never
// replaced by an icon.

export default function StatusTable({ title, action, headers = {}, rows = [], ariaLabel, state, emptyTitle, emptyDetail }) {
  const empty = !rows || rows.length === 0;

  return (
    <MainCard title={title} secondary={action} content={false}>
      {state === 'loading' && <ContentState state="loading" title={emptyTitle} compact />}

      {state !== 'loading' && empty && <ContentState state="empty" title={emptyTitle} detail={emptyDetail} compact />}

      {state !== 'loading' && !empty && (
        <DataTableContainer ariaLabel={ariaLabel}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{headers.subject}</TableCell>
                <TableCell>{headers.department}</TableCell>
                <TableCell>{headers.date}</TableCell>
                <TableCell align="right">{headers.status}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id ?? index} hover>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.date}</TableCell>
                  <TableCell align="right">
                    <Chip size="small" variant="outlined" color="secondary" label={row.statusLabel} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableContainer>
      )}
    </MainCard>
  );
}

StatusTable.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  headers: PropTypes.shape({
    subject: PropTypes.node,
    department: PropTypes.node,
    date: PropTypes.node,
    status: PropTypes.node
  }),
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      subject: PropTypes.node,
      department: PropTypes.node,
      date: PropTypes.node,
      statusLabel: PropTypes.node
    })
  ),
  ariaLabel: PropTypes.string,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
