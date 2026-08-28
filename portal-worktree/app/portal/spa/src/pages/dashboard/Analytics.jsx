import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import PageHeader from 'components/patterns/PageHeader';
import WelcomeBanner from 'components/cards/WelcomeBanner';
import SparkStatCard from 'components/cards/statistics/SparkStatCard';
import RankedListCard from 'components/cards/RankedListCard';
import ActivityListCard from 'components/cards/ActivityListCard';
import ProgressListCard from 'components/cards/ProgressListCard';
import SupportCard from 'components/cards/SupportCard';
import SetupProgressCard from 'components/cards/SetupProgressCard';
import CallTrendCard from 'sections/analytics/CallTrendCard';
import RecentCallsTable from 'sections/analytics/RecentCallsTable';
import QualityReportCard from 'sections/analytics/QualityReportCard';
import CostReportCard from 'sections/analytics/CostReportCard';
import ChannelMixCard from 'sections/analytics/ChannelMixCard';
import {
  ACTIVITIES,
  CHANNELS,
  COST,
  QUALITY,
  QUEUE_HEALTH,
  RECENT_CALLS,
  SETUP,
  STATS,
  SUPPORT_TEAM,
  TOP_EXTENSIONS,
  TREND
} from 'sections/analytics/analyticsSample';

// assets
import AudioOutlined from '@ant-design/icons/AudioOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import ApiOutlined from '@ant-design/icons/ApiOutlined';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';

// ==============================|| PAGE - ANALYTICS ||============================== //
//
// The wide-screen analytics composition: one banner, a stat row, then 8/4 pairs
// that put the chart on the left and its supporting list on the right. On a
// phone the pairs unstack in that same order, so the reader never meets a list
// before the number it explains.
//
// Data comes from sections/analytics/analyticsSample until the analytics
// endpoint lands; every card already accepts loading, empty and error so the
// swap changes the page's imports and nothing about its markup.

const ACTIVITY_ICON = {
  recording: AudioOutlined,
  missed: PhoneOutlined,
  queue: ClockCircleOutlined
};

// Axis labels are built from the reader's locale rather than shipped as text, so
// the same bucket reads "T2" in Vietnamese and "Mon" in English without a second
// data set.
function weekdayLabels(locale, days) {
  const format = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  // 2024-01-07 was a Sunday, so adding the day index lands on that weekday
  return days.map((day) => format.format(new Date(Date.UTC(2024, 0, 7 + day))));
}

function monthLabels(locale, months) {
  const format = new Intl.DateTimeFormat(locale, { month: 'short' });
  return months.map((month) => format.format(new Date(Date.UTC(2024, month, 1))));
}

function formatDuration(intl, seconds) {
  const value = Number(seconds) || 0;
  if (value === 0) return '—';
  const minutes = Math.floor(value / 60);
  const rest = value % 60;
  if (minutes < 60) return `${minutes}:${String(rest).padStart(2, '0')}`;
  return intl.formatMessage({ id: 'duration.hoursMinutes' }, { hours: Math.floor(minutes / 60), minutes: minutes % 60 });
}

export default function Analytics() {
  const intl = useIntl();
  const [range, setRange] = useState('week');
  const [measure, setMeasure] = useState('calls');
  const [costPeriod, setCostPeriod] = useState('month');

  const money = (value) =>
    intl.formatNumber(value, {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    });
  const number = (value) => intl.formatNumber(value);
  const percent = (value) => `${intl.formatNumber(value, { maximumFractionDigits: 1 })}%`;

  const weekIndex = (n) => intl.formatMessage({ id: 'analytics.weekIndex' }, { n });
  const quarterIndex = (n) => intl.formatMessage({ id: 'analytics.quarterIndex' }, { n });

  const trend = TREND[range];
  const trendLabels = trend.days ? weekdayLabels(intl.locale, trend.days) : trend.weeks.map(weekIndex);

  const cost = COST[costPeriod];
  const costLabels = cost.labels ?? (cost.weeks ? cost.weeks.map(weekIndex) : cost.quarters.map(quarterIndex));

  const statLabels = {
    total: 'analytics.stat.totalCalls',
    missed: 'analytics.stat.missed',
    talkTime: 'analytics.stat.talkTime',
    answerRate: 'analytics.stat.answerRate'
  };

  const statValue = (stat) => {
    if (stat.id === 'answerRate') return percent(stat.value);
    if (stat.id === 'talkTime') return intl.formatMessage({ id: 'duration.hours' }, { count: Math.round(stat.value / 3600) });
    return number(stat.value);
  };

  const extensions = TOP_EXTENSIONS.map((row) => ({
    id: row.id,
    primary: row.name,
    secondary: intl.formatMessage({ id: 'analytics.extensionLine' }, { extension: row.extension }),
    value: number(row.calls),
    share: percent(row.share)
  }));

  const activities = ACTIVITIES.map((item) => ({
    id: item.id,
    icon: ACTIVITY_ICON[item.kind],
    color: item.color,
    primary: <FormattedMessage id={`analytics.activity.${item.kind}`} />,
    secondary: intl.formatMessage({ id: 'analytics.activity.at' }, { time: item.at }),
    value: item.calls === undefined ? item.value : intl.formatMessage({ id: 'analytics.callCount' }, { count: item.calls }),
    meta: item.meta
  }));

  const queue = QUEUE_HEALTH.map((item) => ({
    id: item.id,
    label: <FormattedMessage id={`analytics.queue.${item.id}`} />,
    value: item.value,
    color: item.color,
    ariaLabel: intl.formatMessage({ id: `analytics.queue.${item.id}` })
  }));

  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        {/* no eyebrow: the insights group is already called "Phân tích" in
            Vietnamese, so an eyebrow here would repeat the H1 word for word */}
        <PageHeader title={<FormattedMessage id="analytics.title" />} description={<FormattedMessage id="analytics.description" />} />
      </Grid>

      {/* row 1 — orientation */}
      <Grid size={12}>
        <WelcomeBanner
          title={<FormattedMessage id="analytics.banner.title" />}
          description={<FormattedMessage id="analytics.banner.description" />}
          actionLabel={<FormattedMessage id="analytics.banner.action" />}
          onAction={() => setRange('month')}
        />
      </Grid>

      {/* row 2 — headline numbers */}
      {STATS.map((stat) => (
        <Grid key={stat.id} size={{ xs: 12, sm: 6, lg: 3 }}>
          <SparkStatCard
            title={<FormattedMessage id={statLabels[stat.id]} />}
            value={statValue(stat)}
            delta={percent(stat.delta)}
            isLoss={stat.isLoss}
            color={stat.color}
            variant={stat.variant}
            data={stat.data}
          />
        </Grid>
      ))}

      {/* row 3 — trend and who carried it */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <CallTrendCard
          title={<FormattedMessage id="analytics.trend.title" />}
          total={number(trend.total)}
          delta={percent(trend.delta)}
          isLoss={trend.isLoss}
          compareLabel={<FormattedMessage id="analytics.trend.compare" />}
          range={range}
          onRangeChange={setRange}
          ranges={[
            {
              value: 'week',
              label: intl.formatMessage({ id: 'analytics.range.week' })
            },
            {
              value: 'month',
              label: intl.formatMessage({ id: 'analytics.range.month' })
            }
          ]}
          measure={measure}
          onMeasureChange={setMeasure}
          measures={[
            {
              value: 'calls',
              label: intl.formatMessage({ id: 'analytics.measure.calls' })
            },
            {
              value: 'duration',
              label: intl.formatMessage({ id: 'analytics.measure.duration' })
            }
          ]}
          labels={trendLabels}
          answered={trend.answered}
          missed={trend.missed}
          answeredLabel={intl.formatMessage({ id: 'chart.answered' })}
          missedLabel={intl.formatMessage({ id: 'chart.missed' })}
          emptyLabel={<FormattedMessage id="overview.volume.empty" />}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <RankedListCard
          title={<FormattedMessage id="analytics.topExtensions.title" />}
          items={extensions}
          emptyTitle={<FormattedMessage id="analytics.topExtensions.empty" />}
        />
      </Grid>

      {/* row 4 — the calls behind the trend */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <RecentCallsTable
          title={<FormattedMessage id="overview.recent" />}
          rows={RECENT_CALLS.map((row) => ({
            ...row,
            caller: row.caller ?? intl.formatMessage({ id: 'analytics.unknownCaller' })
          }))}
          formatDuration={(value) => formatDuration(intl, value)}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <QualityReportCard
          title={<FormattedMessage id="analytics.quality.title" />}
          metrics={[
            {
              id: 'answerRate',
              label: <FormattedMessage id="overview.answerRate" />,
              value: percent(QUALITY.answerRate),
              tone: 'success'
            },
            {
              id: 'missRate',
              label: <FormattedMessage id="analytics.quality.missRate" />,
              value: percent(QUALITY.missRate)
            },
            {
              id: 'risk',
              label: <FormattedMessage id="analytics.quality.risk" />,
              value: <FormattedMessage id={`analytics.risk.${QUALITY.risk}`} />
            }
          ]}
          labels={monthLabels(intl.locale, QUALITY.months)}
          series={QUALITY.series}
          emptyTitle={<FormattedMessage id="analytics.quality.empty" />}
        />
      </Grid>

      {/* row 5 — money and what just happened */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <CostReportCard
          title={<FormattedMessage id="analytics.cost.title" />}
          totalLabel={<FormattedMessage id="analytics.cost.total" />}
          total={money(cost.total)}
          period={costPeriod}
          onPeriodChange={setCostPeriod}
          periods={[
            {
              value: 'today',
              label: intl.formatMessage({ id: 'analytics.period.today' })
            },
            {
              value: 'month',
              label: intl.formatMessage({ id: 'analytics.period.month' })
            },
            {
              value: 'year',
              label: intl.formatMessage({ id: 'analytics.period.year' })
            }
          ]}
          labels={costLabels}
          internal={cost.internal}
          external={cost.external}
          internalLabel={intl.formatMessage({ id: 'analytics.cost.internal' })}
          externalLabel={intl.formatMessage({ id: 'analytics.cost.external' })}
          valueFormatter={(value) => money(value)}
          axisFormatter={(value) =>
            intl.formatNumber(value, {
              notation: 'compact',
              maximumFractionDigits: 1
            })
          }
          emptyTitle={<FormattedMessage id="analytics.cost.empty" />}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <ActivityListCard
          title={<FormattedMessage id="analytics.activity.title" />}
          items={activities}
          emptyTitle={<FormattedMessage id="analytics.activity.empty" />}
        />
      </Grid>

      {/* row 6 — queue health and where calls arrive */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <ProgressListCard
          title={<FormattedMessage id="analytics.queue.title" />}
          items={queue}
          footer={{
            icon: WalletOutlined,
            color: 'primary',
            title: <FormattedMessage id="analytics.queue.footerTitle" />,
            description: <FormattedMessage id="analytics.queue.footerDescription" />
          }}
          emptyTitle={<FormattedMessage id="analytics.queue.empty" />}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <ChannelMixCard
          title={<FormattedMessage id="analytics.channels.title" />}
          labels={weekdayLabels(intl.locale, CHANNELS.days)}
          channels={[
            {
              id: 'hotline',
              label: intl.formatMessage({ id: 'analytics.channel.hotline' }),
              data: CHANNELS.hotline
            },
            {
              id: 'mobile',
              label: intl.formatMessage({ id: 'analytics.channel.mobile' }),
              data: CHANNELS.mobile
            },
            {
              id: 'internal',
              label: intl.formatMessage({ id: 'analytics.channel.internal' }),
              data: CHANNELS.internal
            }
          ]}
          highlights={[
            {
              id: 'route',
              icon: ApiOutlined,
              color: 'primary',
              primary: <FormattedMessage id="analytics.channels.topRoute" />,
              secondary: CHANNELS.topRoute.name,
              value: number(CHANNELS.topRoute.calls),
              meta: percent(CHANNELS.topRoute.share)
            },
            {
              id: 'queue',
              icon: CustomerServiceOutlined,
              color: 'warning',
              primary: <FormattedMessage id="analytics.channels.topQueue" />,
              secondary: CHANNELS.topQueue.name,
              value: number(CHANNELS.topQueue.calls),
              meta: percent(CHANNELS.topQueue.share)
            }
          ]}
          emptyTitle={<FormattedMessage id="analytics.channels.empty" />}
        />
      </Grid>

      {/* row 7 — what is still unfinished, and who to ask */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <SetupProgressCard
          title={<FormattedMessage id="analytics.setup.title" />}
          description={<FormattedMessage id="analytics.setup.description" />}
          value={SETUP.value}
          remaining={SETUP.remaining.map((id) => intl.formatMessage({ id: `analytics.${id}` }))}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <SupportCard
          title={<FormattedMessage id="analytics.support.title" />}
          caption={<FormattedMessage id="analytics.support.caption" />}
          people={SUPPORT_TEAM}
        />
      </Grid>
    </Grid>
  );
}
