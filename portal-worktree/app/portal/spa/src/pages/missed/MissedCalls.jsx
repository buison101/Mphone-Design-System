import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { FormattedMessage, useIntl } from 'react-intl';

import MainCard from 'components/MainCard';
import StatCard from 'components/cards/statistics/StatCard';
import DataPagination from 'components/patterns/DataPagination';
import DataTableContainer from 'components/patterns/DataTableContainer';
import FilterBar from 'components/patterns/FilterBar';
import PageHeader from 'components/patterns/PageHeader';
import ContentState from 'components/states/ContentState';
import useAnalytics from 'hooks/useAnalytics';
import useSession from 'hooks/useSession';
import { CLICK_TO_CALL_URL, MISSED_CALLS_URL } from 'config';

const today = new Date().toISOString().slice(0, 10);
const initialFrom = new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
const initialFilters = { from: initialFrom, to: today, page: 1, page_size: 20 };
const duration = (seconds) => `${Math.floor((seconds || 0) / 60)}:${String((seconds || 0) % 60).padStart(2, '0')}`;

export default function MissedCalls() {
  const intl = useIntl();
  const { session, can } = useSession();
  const [filters, setFilters] = useState(initialFilters);
  const [feedback, setFeedback] = useState(null);
  const { data, error, isLoading, isValidating, refresh } = useAnalytics(MISSED_CALLS_URL, filters);
  const rows = data?.rows ?? [];
  const update = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value, page: 1 }));
  const callBack = async (row) => {
    setFeedback(null);
    try {
      const response = await fetch(CLICK_TO_CALL_URL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': session.csrf },
        body: JSON.stringify({ extension_uuid: row.extension_uuid, destination: row.caller_number })
      });
      setFeedback({
        severity: response.ok ? 'success' : 'error',
        message: intl.formatMessage({ id: response.ok ? 'clickToCall.accepted' : 'clickToCall.failed' })
      });
    } catch {
      setFeedback({ severity: 'error', message: intl.formatMessage({ id: 'clickToCall.failed' }) });
    }
  };

  return (
    <Stack sx={{ gap: 2.5 }}>
      <PageHeader title={<FormattedMessage id="missed.title" />} description={<FormattedMessage id="missed.description" />} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <StatCard title={intl.formatMessage({ id: 'missed.open' })} count={data?.kpis?.open ?? '—'} color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <StatCard title={intl.formatMessage({ id: 'missed.calledBack' })} count={data?.kpis?.called_back ?? '—'} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <StatCard title={intl.formatMessage({ id: 'missed.resolved' })} count={data?.kpis?.resolved ?? '—'} color="success" />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <StatCard title={intl.formatMessage({ id: 'missed.overdue' })} count={data?.kpis?.overdue ?? '—'} color="error" />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <MainCard title={intl.formatMessage({ id: 'missed.byDay' })}>
            <LineChart
              height={250}
              xAxis={[{ scaleType: 'time', data: (data?.daily ?? []).map((row) => new Date(row.bucket)) }]}
              series={[
                {
                  data: (data?.daily ?? []).map((row) => row.calls),
                  label: intl.formatMessage({ id: 'overview.missed' }),
                  color: '#ff4d4f'
                }
              ]}
            />
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <MainCard title={intl.formatMessage({ id: 'missed.byHour' })}>
            <BarChart
              height={250}
              xAxis={[{ scaleType: 'band', data: (data?.hourly ?? []).map((row) => row.hour) }]}
              series={[{ data: (data?.hourly ?? []).map((row) => row.calls), color: '#1677ff' }]}
            />
          </MainCard>
        </Grid>
      </Grid>
      <MainCard content={false}>
        <FilterBar
          ariaLabel={intl.formatMessage({ id: 'filter.label' })}
          busy={isValidating && Boolean(data)}
          busyLabel={<FormattedMessage id="filter.updating" />}
          resetLabel={<FormattedMessage id="action.resetFilters" />}
          resetDisabled={filters.from === initialFrom && filters.to === today}
          onReset={() => setFilters(initialFilters)}
        >
          <TextField
            size="small"
            type="date"
            label={intl.formatMessage({ id: 'filter.from' })}
            value={filters.from}
            onChange={update('from')}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            size="small"
            type="date"
            label={intl.formatMessage({ id: 'filter.to' })}
            value={filters.to}
            onChange={update('to')}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          {feedback && (
            <Alert severity={feedback.severity} sx={{ flexGrow: 1 }}>
              {feedback.message}
            </Alert>
          )}
        </FilterBar>
        {isLoading && !data ? (
          <ContentState state="loading" title={<FormattedMessage id="table.loading" />} />
        ) : error ? (
          <ContentState
            state="error"
            title={<FormattedMessage id="table.error" />}
            actionLabel={<FormattedMessage id="action.retry" />}
            onAction={refresh}
          />
        ) : rows.length === 0 ? (
          <ContentState state="empty" title={<FormattedMessage id="missed.empty" />} />
        ) : (
          <DataTableContainer ariaLabel={intl.formatMessage({ id: 'missed.title' })}>
            <Table size="small" sx={{ minWidth: 820 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormattedMessage id="table.time" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="table.caller" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="table.extension" />
                  </TableCell>
                  <TableCell align="right">
                    <FormattedMessage id="missed.attempts" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="missed.callback" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="table.state" />
                  </TableCell>
                  <TableCell align="right">
                    <FormattedMessage id="table.actions" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.uuid} hover>
                    <TableCell>{new Date(row.start_stamp).toLocaleString(intl.locale)}</TableCell>
                    <TableCell>
                      {row.caller_name || row.caller_number}
                      <Typography variant="caption" display="block" color="text.secondary">
                        {row.caller_number}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.extension || '—'}</TableCell>
                    <TableCell align="right">{row.attempts}</TableCell>
                    <TableCell>
                      {row.callback_stamp
                        ? `${new Date(row.callback_stamp).toLocaleString(intl.locale)} · ${duration(row.callback_seconds)}`
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={
                          row.overdue ? 'error' : row.state === 'resolved' ? 'success' : row.state === 'called_back' ? 'primary' : 'warning'
                        }
                        label={intl.formatMessage({ id: `missed.state.${row.state}` })}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" disabled={!can('click_to_call_call')} onClick={() => callBack(row)}>
                        <FormattedMessage id="missed.callBack" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTableContainer>
        )}
        <DataPagination
          page={data?.page ?? filters.page}
          pageSize={data?.page_size ?? filters.page_size}
          total={data?.total ?? 0}
          busy={isValidating}
          onChange={(event, page) => setFilters((current) => ({ ...current, page }))}
        />
      </MainCard>
      <MainCard title={intl.formatMessage({ id: 'reports.definitions' })}>
        <Typography variant="body2">
          <FormattedMessage id="missed.definition" />
        </Typography>
        <Typography variant="body2">
          <FormattedMessage id="missed.averageCallback" values={{ value: duration(data?.kpis?.average_callback_seconds) }} />
        </Typography>
      </MainCard>
    </Stack>
  );
}
