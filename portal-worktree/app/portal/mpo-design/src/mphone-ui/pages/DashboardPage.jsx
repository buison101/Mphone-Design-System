import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';
import CaretUpOutlined from '@ant-design/icons/CaretUpOutlined';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart, axisClasses, lineClasses } from '@mui/x-charts';

import MainCard from 'components/MainCard';
import AnalyticsDataCard from 'components/cards/statistics/AnalyticsDataCard';
import { withAlpha } from 'utils/colorUtils';
import DashboardContentSkeleton from '../components/DashboardContentSkeleton';
import useDashboardData from '../hooks/useDashboardData';

const RANGES = [24, 168, 720, 2160];

function formatDuration(seconds) {
  const totalMinutes = Math.round(Math.max(Number(seconds) || 0, 0) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function formatHoursMinutes(seconds) {
  const totalMinutes = Math.round(Math.max(Number(seconds) || 0, 0) / 60);
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 };
}

function formatPreviousPeriod(window, generated, hours, locale) {
  const currentEnd = generated ? new Date(generated) : new Date();
  const previousEnd = window?.previous_end ? new Date(window.previous_end) : new Date(currentEnd.getTime() - hours * 60 * 60 * 1000);
  const previousStart = window?.previous_start ? new Date(window.previous_start) : new Date(previousEnd.getTime() - hours * 60 * 60 * 1000);
  const formatDate = (date) => date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', '');

  return `${formatDate(previousStart)} - ${formatDate(previousEnd)}`;
}

function trend(current, previous) {
  const currentValue = Number(current) || 0;
  const previousValue = Number(previous) || 0;
  if (previousValue === 0) return { percentage: 0, isLoss: false };
  const change = ((currentValue - previousValue) / previousValue) * 100;
  return {
    percentage: Math.abs(Number(change.toFixed(1))),
    isLoss: change < 0
  };
}

function rateTrend(current, previous) {
  if (current == null || previous == null) return { percentage: null, isLoss: false };
  const change = Number(current) - Number(previous);
  return {
    percentage: Math.abs(Number(change.toFixed(1))),
    isLoss: change < 0
  };
}

function bucketLabels(rows, locale) {
  return rows.map((row) =>
    new Date(row.bucket).toLocaleString(locale, {
      day: '2-digit',
      month: '2-digit',
      ...(rows.length <= 48 ? { hour: '2-digit' } : {})
    })
  );
}

function MetricChart({ rows, field, label, color, type = 'bar' }) {
  const intl = useIntl();
  const theme = useTheme();
  const values = rows.map((row) => Number(row[field]) || 0);
  const labels = bucketLabels(rows, intl.locale);
  const chartColor = theme.vars.palette[color].main;

  if (type === 'line') {
    const isError = color === 'error';
    const isEmpty = values.every((value) => value === 0);
    const yDomain = field === 'inbound_answer_rate' ? { min: 0, max: 100 } : { min: 0, ...(isEmpty && { max: 1 }) };
    const gradientId = isError ? 'dashboardMissedGradient' : 'dashboardInboundGradient';
    return (
      <LineChart
        hideLegend
        height={100}
        xAxis={[{ scaleType: 'point', data: labels, position: 'none' }]}
        yAxis={[{ position: 'none', ...yDomain }]}
        margin={{ top: 0.75, bottom: 0.75, left: 0, right: 0 }}
        series={[
          {
            ...(!isError && { curve: 'linear' }),
            data: values,
            label,
            showMark: false,
            area: true,
            id: isError ? 'MissedCalls' : 'InboundAnswerRate',
            color: chartColor,
            valueFormatter: (value) => (field === 'inbound_answer_rate' ? `${value}%` : String(value))
          }
        ]}
        slotProps={{ tooltip: { trigger: 'axis', sx: { caption: { display: 'none' } } } }}
        sx={{
          '& g[clip-path]': { clipPath: 'none' },
          [`& .${lineClasses.line}`]: { strokeWidth: 1.5 },
          [`& .${lineClasses.area}`]: { fill: `url('#${gradientId}')`, paintOrder: 'stroke' }
        }}
      >
        <defs>
          <linearGradient id={gradientId} gradientTransform="rotate(90)">
            <stop offset={isError ? '10%' : '0%'} stopColor={withAlpha(chartColor, isError ? 0.4 : 0.2)} />
            <stop offset={isError ? '110%' : '100%'} stopColor={withAlpha(theme.vars.palette.background.default, 0.4)} />
          </linearGradient>
        </defs>
      </LineChart>
    );
  }

  return (
    <BarChart
      hideLegend
      height={100}
      series={[{ data: values, label, color: withAlpha(chartColor, 0.85) }]}
      xAxis={[{ data: labels, scaleType: 'band', position: 'none' }]}
      yAxis={[{ position: 'none' }]}
      axisHighlight={{ x: 'none' }}
      slotProps={{ tooltip: { trigger: 'item', sx: { '& .MuiChartsTooltip-root': { border: '1px solid ', borderColor: 'grey.200' } } } }}
      margin={{ top: -49, bottom: 0, left: 4, right: 4 }}
      sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 } }}
    />
  );
}

MetricChart.propTypes = {
  rows: PropTypes.array.isRequired,
  field: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  color: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['bar', 'line'])
};

export default function DashboardPage() {
  const intl = useIntl();
  const theme = useTheme();
  const [hours, setHours] = useState(24);
  const { data, loading } = useDashboardData(hours);
  const totals = data?.totals ?? {};
  const previous = data?.previous ?? {};
  const hourly = data?.hourly ?? [];
  const subscribers = data?.subscribers ?? [];
  const successfulTrend = trend(totals.answered, previous.answered);
  const missedTrend = trend(totals.missed, previous.missed);
  const durationTrend = trend(totals.talk_seconds, previous.talk_seconds);
  const inboundTrend = rateTrend(totals.answer_rate, previous.answer_rate);
  const outboundTrend = rateTrend(totals.outbound_answer_rate, previous.outbound_answer_rate);
  const outboundRates = hourly.map((row) => Number(row.outbound_answer_rate) || 0);
  const previousPeriod = formatPreviousPeriod(data?.window, data?.generated, hours, intl.locale);

  if (loading && !data) return <DashboardContentSkeleton />;

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      <Grid size={12}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            justifyContent: 'flex-end',
            alignItems: { sm: 'center' },
            gap: 1.5
          }}
        >
          <ToggleButtonGroup
            size="small"
            exclusive
            value={hours}
            onChange={(event, next) => next && setHours(next)}
            aria-label={intl.formatMessage({
              id: 'mphoneUi.dashboard.periodFilter'
            })}
          >
            {RANGES.map((value) => (
              <ToggleButton key={value} value={value} sx={{ textTransform: 'none', px: { xs: 1.25, sm: 1.75 } }}>
                <FormattedMessage id={`mphoneUi.range.${value}`} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticsDataCard
          title={intl.formatMessage({ id: 'mphoneUi.metric.successfulCalls' })}
          count={String(totals.answered ?? 0)}
          {...successfulTrend}
        >
          <MetricChart
            rows={hourly}
            field="answered"
            label={intl.formatMessage({
              id: 'mphoneUi.metric.successfulCalls'
            })}
            color="primary"
          />
        </AnalyticsDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticsDataCard
          title={intl.formatMessage({ id: 'mphoneUi.metric.missedCalls' })}
          count={String(totals.missed ?? 0)}
          color="error"
          {...missedTrend}
        >
          <MetricChart
            rows={hourly}
            field="missed"
            label={intl.formatMessage({ id: 'mphoneUi.metric.missedCalls' })}
            color="error"
            type="line"
          />
        </AnalyticsDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticsDataCard
          title={intl.formatMessage({ id: 'mphoneUi.metric.callDuration' })}
          count={formatDuration(totals.talk_seconds)}
          color="warning"
          {...durationTrend}
        >
          <MetricChart
            rows={hourly}
            field="talk_seconds"
            label={intl.formatMessage({ id: 'mphoneUi.metric.callDuration' })}
            color="warning"
          />
        </AnalyticsDataCard>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 12, lg: 3 }}>
        <AnalyticsDataCard
          title={intl.formatMessage({
            id: 'mphoneUi.metric.inboundAnswerRate'
          })}
          count={totals.answer_rate == null ? '—' : `${totals.answer_rate}%`}
          {...inboundTrend}
        >
          <MetricChart
            rows={hourly}
            field="inbound_answer_rate"
            label={intl.formatMessage({
              id: 'mphoneUi.metric.inboundAnswerRate'
            })}
            color="primary"
            type="line"
          />
        </AnalyticsDataCard>
      </Grid>
      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Typography variant="h5">
          <FormattedMessage id="mphoneUi.dashboard.outboundAnswerRate" />
        </Typography>
        <MainCard border={false} content={false} sx={{ mt: 1.5 }}>
          <Grid>
            <Grid container>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack sx={{ alignItems: { xs: 'center', sm: 'flex-start' }, ml: { xs: 0, sm: 2 }, mt: 3 }}>
                  <Stack
                    direction="row"
                    sx={{
                      gap: 0.5,
                      alignItems: 'center',
                      color: outboundTrend.percentage == null || !outboundTrend.isLoss ? 'success.main' : 'error.main'
                    }}
                  >
                    {outboundTrend.percentage != null && (outboundTrend.isLoss ? <CaretDownOutlined /> : <CaretUpOutlined />)}
                    <Typography>
                      {totals.outbound_answer_rate == null ? '—' : `${totals.outbound_answer_rate}%`}
                      {outboundTrend.percentage != null && ` (${outboundTrend.isLoss ? '-' : '+'}${outboundTrend.percentage}%)`}
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: 'text.secondary', display: 'block' }}>
                    <FormattedMessage id="mphoneUi.dashboard.comparedWithPrevious" values={{ period: previousPeriod }} />
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ width: 1, pt: 1 }}>
            <LineChart
              hideLegend
              grid={{ horizontal: true, vertical: true }}
              height={355}
              xAxis={[
                {
                  data: bucketLabels(hourly, intl.locale),
                  scaleType: 'point',
                  disableLine: true,
                  tickSize: 7
                }
              ]}
              yAxis={[
                {
                  min: 0,
                  max: 105,
                  disableLine: true,
                  tickMaxStep: 20,
                  tickSize: 7,
                  valueFormatter: (value) => String(value)
                }
              ]}
              series={[
                {
                  curve: 'linear',
                  data: outboundRates,
                  label: intl.formatMessage({
                    id: 'mphoneUi.dashboard.outboundAnswerRate'
                  }),
                  valueFormatter: (value) => `${value}%`,
                  showMark: false,
                  area: true,
                  id: 'OutboundAnswerRate',
                  color: theme.vars.palette.primary.main
                }
              ]}
              margin={{ top: 30, bottom: 25, left: 0, right: 22 }}
              sx={{
                [`& .${lineClasses.line}`]: { strokeDasharray: 0, strokeWidth: 1 },
                [`& .${lineClasses.area}`]: { fill: "url('#dashboardOutboundGradient')", paintOrder: 'stroke' },
                [`& .${axisClasses.tick}`]: { stroke: theme.vars.palette.divider },
                [`& .${axisClasses.root}.${axisClasses.directionX} .${axisClasses.tick}`]: { stroke: theme.vars.palette.divider },
                [`& .${axisClasses.root}.${axisClasses.directionY} .${axisClasses.tick}`]: { stroke: 'transparent' }
              }}
            >
              <defs>
                <linearGradient id="dashboardOutboundGradient" gradientTransform="rotate(90)">
                  <stop offset="10%" stopColor={withAlpha(theme.vars.palette.primary.main, 0.2)} />
                  <stop offset="80%" stopColor={withAlpha(theme.vars.palette.background.default, 0.4)} />
                </linearGradient>
              </defs>
            </LineChart>
          </Box>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Typography variant="h5">
          <FormattedMessage id="mphoneUi.dashboard.subscriberPerformance" />
        </Typography>
        <MainCard border={false} sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            {subscribers.map((row, index) => (
              <ListItemButton key={row.number} divider={index < subscribers.length - 1}>
                <ListItemText
                  primary={row.number}
                  secondary={intl.formatMessage({ id: 'mphoneUi.dashboard.callDurationValue' }, formatHoursMinutes(row.talk_seconds))}
                  slotProps={{
                    primary: { variant: 'subtitle1' },
                    secondary: {
                      variant: 'body1',
                      sx: { display: 'inline', color: 'text.secondary' }
                    }
                  }}
                />
                <Stack sx={{ alignItems: 'flex-end' }}>
                  <Typography variant="h5" sx={{ color: 'primary.main' }}>
                    {row.calls}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
                    <FormattedMessage
                      id="mphoneUi.dashboard.answerRateComparison"
                      values={{ rate: row.answer_rate ?? 0, change: `${Number(row.calls_change) > 0 ? '+' : ''}${row.calls_change ?? 0}` }}
                    />
                  </Typography>
                </Stack>
              </ListItemButton>
            ))}
            {subscribers.length === 0 && (
              <Box
                sx={{
                  py: 7,
                  px: 2,
                  textAlign: 'center',
                  color: 'text.secondary'
                }}
              >
                <FormattedMessage id="mphoneUi.dashboard.noSubscriberData" />
              </Box>
            )}
          </List>
        </MainCard>
      </Grid>
    </Grid>
  );
}
