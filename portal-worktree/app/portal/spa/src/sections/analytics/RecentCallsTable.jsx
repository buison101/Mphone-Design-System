import PropTypes from 'prop-types';

// material-ui
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import Dot from 'components/@extended/Dot';
import DataTableContainer from 'components/patterns/DataTableContainer';
import ContentState from 'components/states/ContentState';
import { STATUS_COLOR } from 'utils/callStatus';

// ==============================|| ANALYTICS - RECENT CALLS ||============================== //
//
// The last calls, newest first, as the evidence behind the charts above. It is
// deliberately short: a reader who needs the full log has Call history, and a
// dashboard table that paginates stops being a summary.
//
// Status is a dot plus its name. The dot alone would put the whole outcome in
// colour, which is exactly the failure the design system's data table rules
// call out.

// The third column is the extension on the analytics page and the dialled
// destination on the dashboard. Same column, different question, so the caller
// names it rather than the component guessing.
const columnsFor = (thirdLabel) => [
  { id: 'time', label: 'table.time', align: 'left' },
  { id: 'caller', label: 'table.caller', align: 'left' },
  { id: 'extension', label: thirdLabel, align: 'left' },
  { id: 'status', label: 'table.state', align: 'left' },
  { id: 'duration', label: 'table.duration', align: 'right' }
];

export default function RecentCallsTable({
  title,
  action,
  rows = [],
  state = 'ready',
  onRetry,
  formatDuration,
  thirdColumnLabelId = 'table.extension'
}) {
  const intl = useIntl();
  const COLUMNS = columnsFor(thirdColumnLabelId);
  const empty = !rows || rows.length === 0;

  return (
    <MainCard title={title} secondary={action} content={false}>
      {state === 'loading' && <ContentState state="loading" title={intl.formatMessage({ id: 'table.loading' })} />}

      {state === 'error' && (
        <ContentState
          state="error"
          title={intl.formatMessage({ id: 'table.error' })}
          actionLabel={onRetry ? intl.formatMessage({ id: 'analytics.retry' }) : undefined}
          onAction={onRetry}
        />
      )}

      {state === 'ready' && empty && <ContentState state="empty" title={intl.formatMessage({ id: 'table.empty' })} />}

      {state === 'ready' && !empty && (
        <DataTableContainer ariaLabel={intl.formatMessage({ id: 'analytics.recentCalls.tableLabel' })}>
          <Table size="small" sx={{ minWidth: 640, '& td, & th': { whiteSpace: 'nowrap' } }}>
            <TableHead>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    <FormattedMessage id={column.label} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow hover key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>{row.time}</TableCell>
                  <TableCell>
                    <Stack sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2">{row.caller}</Typography>
                      {row.callerNumber && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                          {row.callerNumber}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>{row.extension ?? '—'}</TableCell>
                  <TableCell>
                    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                      <Dot color={STATUS_COLOR[row.status] || 'primary'} />
                      <Typography variant="body2">
                        <FormattedMessage id={`callState.${row.status}`} defaultMessage={row.status} />
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatDuration ? formatDuration(row.duration) : row.duration}
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

RecentCallsTable.propTypes = {
  title: PropTypes.node,
  action: PropTypes.node,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      time: PropTypes.node,
      caller: PropTypes.node,
      callerNumber: PropTypes.node,
      extension: PropTypes.node,
      status: PropTypes.string,
      duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  state: PropTypes.oneOf(['loading', 'error', 'ready']),
  onRetry: PropTypes.func,
  formatDuration: PropTypes.func,
  thirdColumnLabelId: PropTypes.string
};
