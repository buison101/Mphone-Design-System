import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// project imports
import MainCard from 'components/MainCard';

// table data
const createData = (badgeText, badgeType, subject, dept, date) => ({
  badgeText,
  badgeType,
  subject,
  dept,
  date
});

// Hoisted into a function so the sample rows are rebuilt on every render. As a
// module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
const getRows = () => [
  createData('Complete', 'success', 'Website down for one week', 'Support', 'Today 2:00'),
  createData('Pending', 'primary', 'Loosing control on server', 'Support', 'Yesterday'),
  createData('Canceled', 'error', 'Authorizations keys', 'Support', '27, Aug'),
  createData('Complete', 'success', 'Restoring default settings', 'Support', 'Today 9:00'),
  createData('Pending', 'primary', 'Loosing control on server', 'Support', 'Yesterday'),
  createData('Canceled', 'error', 'Authorizations keys', 'Support', '27, Aug'),
  createData('Complete', 'success', 'Restoring default settings', 'Support', 'Today 9:00'),
  createData('Canceled', 'error', 'Authorizations keys', 'Support', '27, Aug')
];

// ==========================|| DATA WIDGET - RECENT TICKETS CARD ||========================== //

export default function RecentTickets() {
  const rows = getRows();
  return (
    <MainCard
      title="Recent Tickets"
      content={false}
      secondary={
        <Link component={RouterLink} to="#" sx={{ color: 'primary.main' }}>
          View all
        </Link>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subject</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow hover key={index}>
                <TableCell>{row.subject}</TableCell>
                <TableCell>{row.dept}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.date}</TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>
                  <Chip variant="light" color={row.badgeType} label={row.badgeText} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}
