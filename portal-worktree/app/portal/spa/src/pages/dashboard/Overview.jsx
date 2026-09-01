import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import PageHeader from 'components/patterns/PageHeader';
import SparkStatCard from 'components/cards/statistics/SparkStatCard';
import ActivityListCard from 'components/cards/ActivityListCard';
import SupportCard from 'components/cards/SupportCard';
import CallVolumeChart from 'sections/dashboard/CallVolumeChart';
import AnswerRateCard from 'sections/dashboard/AnswerRateCard';
import CallOutcomeCard from 'sections/dashboard/CallOutcomeCard';
import RecentCallsTable from 'sections/analytics/RecentCallsTable';
import QualityReportCard from 'sections/analytics/QualityReportCard';
import useDashboard from 'hooks/useDashboard';
import useActiveCalls from 'hooks/useActiveCalls';

// assets
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import ApiOutlined from '@ant-design/icons/ApiOutlined';

// ==============================|| PAGE - OVERVIEW ||============================== //
//
// The default dashboard, rebuilt on the Mantis Default composition: a stat row,
// then 8/4 pairs that put the period's chart on the left and the figure that
// explains it on the right.
//
// Section titles stay inside their cards. Mantis Default hangs them above the
// card instead; every other page in this portal titles inside a MainCard, and
// one page spelling the same idea differently costs more than the extra air
// buys.
//
// Outcomes are bars, not the pie this page used to carry. Seven outcomes is past
// what a pie can be read at, and the question — how many ended this way versus
// that way — is a length comparison, which is what a pie is worst at.
//
// Everything here is real: dashboard.php for the period, the websocket for the
// live count. No placeholder data on this page, which is why the empty states
// matter more here than anywhere else.

const RANGES = [
  { value: 24, labelId: 'overview.range.24h' },
  { value: 168, labelId: 'overview.range.7d' },
  { value: 720, labelId: 'overview.range.30d' },
  { value: 2160, labelId: 'overview.range.90d' }
];

const DIRECTIONS = [
  { value: '', labelId: 'history.direction.all' },
  { value: 'inbound', labelId: 'direction.inbound' },
  { value: 'outbound', labelId: 'direction.outbound' },
  { value: 'local', labelId: 'direction.local' }
];

const STATUS_CHART_COLOR = {
  answered: '#1677ff',
  missed: '#ff4d4f',
  no_answer: '#8c8c8c',
  busy: '#faad14',
  voicemail: '#13c2c2',
  cancelled: '#722ed1',
  failed: '#d4380d'
};

function formatCallLength(seconds) {
  const value = Number(seconds) || 0;
  if (value === 0) return '—';
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

function formatTime(locale, iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function Overview() {
  const intl = useIntl();
  const [hours, setHours] = useState(24);
  const [direction, setDirection] = useState('');
  const { data, error, isLoading } = useDashboard(hours, direction);
  const { calls, status } = useActiveCalls();

  const totals = data?.totals;
  const hourly = data?.hourly ?? [];
  const unavailable = data && data.available === false;
  const loading = isLoading && !data;
  const number = (value) => (value === null || value === undefined ? '—' : intl.formatNumber(value));

  // Answered is excluded on purpose — see the note in CallOutcomeCard.
  const outcomes = Object.entries(data?.statuses ?? {})
    .filter(([name, value]) => value > 0 && name !== 'answered')
    .map(([name, value]) => ({
      label: intl.formatMessage({ id: `callState.${name}`, defaultMessage: name }),
      value,
      color: STATUS_CHART_COLOR[name] || STATUS_CHART_COLOR.no_answer
    }));

  const recent = (data?.recent ?? []).map((row) => ({
    id: row.uuid,
    time: formatTime(intl.locale, row.start_stamp),
    caller: row.caller_id_name || '—',
    callerNumber: row.caller_id_number || '',
    extension: row.destination_number || '—',
    status: row.status,
    duration: row.billsec
  }));

  // Only genuinely live rows belong under a "right now" heading. Talk time and
  // unconnected calls are period figures and sat here in the first draft, which
  // made the card lie about what it was showing.
  const live = [
    {
      id: 'active',
      icon: PhoneOutlined,
      color: status === 'subscribed' ? 'success' : 'warning',
      primary: <FormattedMessage id="overview.activeCalls" />,
      secondary: intl.formatMessage({ id: 'overview.live.hint' }),
      value: calls.length
    },
    {
      id: 'link',
      icon: ApiOutlined,
      color: status === 'subscribed' ? 'success' : 'error',
      primary: <FormattedMessage id="overview.live.link" />,
      secondary: intl.formatMessage({ id: 'overview.live.linkHint' }),
      value: intl.formatMessage({ id: `status.${status}` })
    }
  ];

  const hourLabel = (iso) => {
    const date = new Date(iso);
    return hours > 48 ? `${date.getDate()}/${date.getMonth() + 1}` : `${String(date.getHours()).padStart(2, '0')}:00`;
  };

  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <PageHeader
          title={<FormattedMessage id="overview.title" />}
          description={<FormattedMessage id="overview.description" />}
          actions={
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={direction}
                onChange={(event, next) => next !== null && setDirection(next)}
                aria-label={intl.formatMessage({ id: 'table.direction' })}
              >
                {DIRECTIONS.map((item) => (
                  <ToggleButton key={item.value || 'all'} value={item.value} sx={{ textTransform: 'none' }}>
                    <FormattedMessage id={item.labelId} />
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={hours}
                onChange={(event, next) => next && setHours(next)}
                aria-label={intl.formatMessage({ id: 'overview.title' })}
              >
                {RANGES.map((range) => (
                  <ToggleButton key={range.value} value={range.value} sx={{ textTransform: 'none', px: 1.75 }}>
                    <FormattedMessage id={range.labelId} />
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          }
        />
      </Grid>

      {/* row 1 — the period in four numbers */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SparkStatCard
          title={<FormattedMessage id="overview.totalCalls" />}
          value={number(totals?.calls)}
          caption={<FormattedMessage id="overview.stat.periodNote" />}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SparkStatCard
          title={<FormattedMessage id="overview.answered" />}
          value={number(totals?.answered)}
          color="success"
          caption={
            <FormattedMessage
              id="overview.stat.inboundOutbound"
              values={{ inbound: number(totals?.inbound), outbound: number(totals?.outbound) }}
            />
          }
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SparkStatCard
          title={<FormattedMessage id="overview.missed" />}
          value={number(totals?.missed)}
          color="error"
          caption={<FormattedMessage id="overview.stat.unconnected" values={{ count: number(totals?.unconnected) }} />}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SparkStatCard
          title={<FormattedMessage id="overview.activeCalls" />}
          value={calls.length}
          color={status === 'subscribed' ? 'success' : 'warning'}
          caption={intl.formatMessage({ id: status === 'subscribed' ? 'status.subscribed' : 'status.disconnected' })}
        />
      </Grid>

      {/* row 2 — the shape of the period, and the ratio that judges it */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <MainCard title={intl.formatMessage({ id: 'overview.volume' })} contentSX={{ p: 1 }}>
          {unavailable ? (
            <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                <FormattedMessage id="overview.volume.forbidden" />
              </Typography>
            </Box>
          ) : (
            <CallVolumeChart hourly={hourly} hours={hours} />
          )}
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <AnswerRateCard
          title={intl.formatMessage({ id: 'overview.summary' })}
          label={<FormattedMessage id="overview.answerRate" />}
          value={totals?.answer_rate === null || totals?.answer_rate === undefined ? '—' : `${totals.answer_rate}%`}
          hourly={hourly}
          state={loading ? 'loading' : 'ready'}
          emptyTitle={<FormattedMessage id="table.loading" />}
        />
      </Grid>

      {/* row 3 — the calls themselves, and how the period is trending */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <RecentCallsTable
          title={intl.formatMessage({ id: 'overview.recent' })}
          rows={recent}
          thirdColumnLabelId="table.destination"
          state={loading ? 'loading' : error ? 'error' : 'ready'}
          formatDuration={formatCallLength}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        {/* The answer rate is the headline of the card directly above this one,
            so it is deliberately absent here: repeating it would spend the most
            valuable row on a number the reader has already read. */}
        <QualityReportCard
          title={intl.formatMessage({ id: 'analytics.quality.title' })}
          metrics={[
            { id: 'missed', label: <FormattedMessage id="overview.missed" />, value: number(totals?.missed), tone: 'error' },
            { id: 'unconnected', label: <FormattedMessage id="overview.unconnected" />, value: number(totals?.unconnected) },
            { id: 'average', label: <FormattedMessage id="overview.averageTalk" />, value: formatCallLength(totals?.average_talk_seconds) }
          ]}
          labels={hourly.map((row) => hourLabel(row.bucket))}
          series={hourly.map((row) => row.missed ?? 0)}
          state={loading ? 'loading' : 'ready'}
          emptyTitle={<FormattedMessage id="overview.volume.empty" />}
        />
      </Grid>

      {/* row 4 — how calls ended, and what is happening now */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <CallOutcomeCard
          title={intl.formatMessage({ id: 'overview.outcome.title' })}
          totalLabel={<FormattedMessage id="overview.totalCalls" />}
          total={number(totals?.calls)}
          note={
            <FormattedMessage
              id="overview.outcome.note"
              values={{
                answered: number(totals?.answered),
                rate: totals?.answer_rate === null || totals?.answer_rate === undefined ? '—' : `${totals.answer_rate}%`
              }}
            />
          }
          outcomes={outcomes}
          state={loading ? 'loading' : 'ready'}
          emptyTitle={<FormattedMessage id="overview.volume.empty" />}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <Stack sx={{ gap: 2.5 }}>
          <ActivityListCard
            title={intl.formatMessage({ id: 'overview.live' })}
            items={live}
            emptyTitle={<FormattedMessage id="table.empty" />}
          />
          <SupportCard
            title={<FormattedMessage id="analytics.support.title" />}
            caption={<FormattedMessage id="analytics.support.caption" />}
            people={['Nguyễn Thu Hà', 'Trần Minh Quân', 'Lê Bảo Ngọc']}
          />
        </Stack>
      </Grid>

      {data?.scope === 'extensions' && (
        <Grid size={12}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            <FormattedMessage id="overview.scopeNote" />
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
