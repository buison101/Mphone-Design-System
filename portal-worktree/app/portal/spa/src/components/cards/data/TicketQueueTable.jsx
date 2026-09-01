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

// ==============================|| DATA CARDS - TICKET QUEUE ||============================== //
//
// Work with a clock on it. The remaining time is the first thing in the row and
// the largest thing in its cell, because it is the only column that decides
// what to pick up next.
//
// The unit sits under the number rather than after it. "12 hours" set on one
// line makes the number and the word compete at the same size; stacked, the
// figure is what the eye lands on and the unit is still there to read.
//
// The description is clamped to two lines instead of being cut with an ellipsis
// mid-token: a truncated subject that ends in "the" tells the reader nothing,
// and these rows are read at a glance.

const AVATAR_TONES = ['primary', 'info', 'success', 'warning'];

function initialsOf(name = '') {
  const words = String(name).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
}

export default function TicketQueueTable({ title, action, headers = {}, rows = [], ariaLabel, state, emptyTitle, emptyDetail }) {
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
                <TableCell align="center">{headers.due}</TableCell>
                <TableCell>{headers.owner}</TableCell>
                <TableCell>{headers.subject}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id ?? index} hover>
                  <TableCell align="center" sx={{ width: 88 }}>
                    <Typography variant="h5" component="p">
                      {row.dueValue}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {row.dueUnit}
                    </Typography>
                  </TableCell>
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
                      <Typography variant="subtitle2" noWrap>
                        {row.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ gap: 0.25, minWidth: 0 }}>
                      <Typography variant="subtitle2">{row.subject}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {row.detail}
                      </Typography>
                    </Stack>
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

TicketQueueTable.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  headers: PropTypes.shape({ due: PropTypes.node, owner: PropTypes.node, subject: PropTypes.node }),
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      dueValue: PropTypes.node,
      dueUnit: PropTypes.node,
      name: PropTypes.string,
      subject: PropTypes.node,
      detail: PropTypes.node,
      color: PropTypes.string
    })
  ),
  ariaLabel: PropTypes.string,
  state: PropTypes.oneOf(['loading', 'empty', 'error', 'ready']),
  emptyTitle: PropTypes.node,
  emptyDetail: PropTypes.node
};
