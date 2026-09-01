import PropTypes from 'prop-types';

// material-ui
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
import ToneChip from './ToneChip';

// ==============================|| DATA CARDS - ASSIGNMENT TABLE ||============================== //
//
// Who is doing what, by when, and how urgent it is. The person and their role
// share the first cell so the table reads as four columns rather than five, and
// the urgency is the only cell allowed colour.
//
// The five fills are Mantis's; the mapping is not. Mantis paints its highest
// priority green and its lowest red, which is backwards in every convention a
// reader brings to the table - so red runs at the top of the scale here and
// green at the bottom, with the same five chips on screen.
//
// Every chip also carries its word, because a chip that means something only in
// colour means nothing on a monochrome print or to a red-green reader.

const AVATAR_TONES = ['primary', 'info', 'success', 'warning', 'error'];

function initialsOf(name = '') {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
}

export default function AssignmentTable({ title, action, headers = {}, rows = [], ariaLabel, state, emptyTitle, emptyDetail }) {
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
                <TableCell>{headers.assignee}</TableCell>
                <TableCell>{headers.subject}</TableCell>
                <TableCell>{headers.due}</TableCell>
                <TableCell align="right">{headers.priority}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id ?? index} hover>
                  <TableCell>
                    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                      <Avatar
                        size="sm"
                        color={row.color || AVATAR_TONES[index % AVATAR_TONES.length]}
                        alt={row.name}
                        sx={{ color: `${row.color || AVATAR_TONES[index % AVATAR_TONES.length]}.darker` }}
                      >
                        {initialsOf(row.name)}
                      </Avatar>
                      <Stack sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" noWrap>
                          {row.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                          {row.role}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.subject}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.due}</TableCell>
                  <TableCell align="right">
                    <ToneChip tone={row.priorityTone} label={row.priorityLabel} />
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

AssignmentTable.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  headers: PropTypes.shape({
    assignee: PropTypes.node,
    subject: PropTypes.node,
    due: PropTypes.node,
    priority: PropTypes.node
  }),
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      role: PropTypes.node,
      subject: PropTypes.node,
      due: PropTypes.node,
      priorityLabel: PropTypes.node,
      priorityTone: PropTypes.string,
      color: PropTypes.string
    })
  ),
  ariaLabel: PropTypes.string,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
