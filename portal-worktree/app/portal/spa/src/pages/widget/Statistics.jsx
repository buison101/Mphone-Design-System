import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
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
import PageHeader from 'components/patterns/PageHeader';
import SparkStatCard from 'components/cards/statistics/SparkStatCard';
import HeroStatCard from 'components/cards/statistics/HeroStatCard';
import PeriodStatCard from 'components/cards/statistics/PeriodStatCard';
import StatusStatCard from 'components/cards/statistics/StatusStatCard';
import MetricTile from 'components/cards/widgets/MetricTile';
import FeatureMetricCard from 'components/cards/widgets/FeatureMetricCard';
import ChannelTile from 'components/cards/widgets/ChannelTile';
import IllustratedMetricCard from 'components/cards/widgets/IllustratedMetricCard';

// assets
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import NumberOutlined from '@ant-design/icons/NumberOutlined';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';
import DesktopOutlined from '@ant-design/icons/DesktopOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined';
import AudioOutlined from '@ant-design/icons/AudioOutlined';
import CloudServerOutlined from '@ant-design/icons/CloudServerOutlined';

// ==============================|| PAGE - WIDGET STATISTICS ||============================== //
//
// A rack of statistic cards, one specimen per component, in the order Mantis's
// Widget > Statistics lays them out — so a card can be picked off this page and
// applied to a real screen later.
//
// Mantis's fills are kept exactly, because they are the Ant Design ramp this
// portal already ships: blue is primary.main, amber warning.main, green
// success.main, teal info.main, red error.main. Not one hex is hard-coded here.
//
// The ink is not kept. Mantis sets white on all six fills and on four of them
// that is unreadable — 1.90 on amber, 2.21 on teal, 2.27 on green, 3.27 on red.
// widgetInk.js carries the measurements and the one rule that follows from them:
// a light fill takes dark ink, a dark fill takes white. No hue moves.
//
// The illustrations are drawn as inline SVG rather than shipped as files, both
// because docs/12 rule 6 forbids copying Mantis Pro assets and because these are
// coloured surfaces whose artwork cannot be allowed to arrive late.

const SPARK_CALLS = [268, 312, 295, 341, 388, 164, 92];
const SPARK_MISSED = [24, 31, 19, 28, 44, 12, 6];
const SPARK_ANSWER = [88, 91, 90, 93, 92, 94, 92];

const CHOICE_ROWS = ['hero', 'plain', 'spark', 'period', 'status'];

export default function WidgetStatistics() {
  const intl = useIntl();
  const [period, setPeriod] = useState('month');

  const number = (value) => intl.formatNumber(value);
  const money = (value) =>
    intl.formatNumber(value, { style: 'currency', currency: 'VND', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 });
  const periodLabel = intl.formatMessage({ id: period === 'month' ? 'widget.period.month' : 'widget.period.week' });

  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <PageHeader title={<FormattedMessage id="widget.stats.title" />} description={<FormattedMessage id="widget.stats.description" />} />
      </Grid>

      {/* row 1 — MetricTile */}
      <Grid size={12}>
        <Section name="MetricTile" id="widget.section.plain" noteId="widget.section.plain.note" />
      </Grid>
      {[
        { id: 'extensions', value: 42, icon: TeamOutlined },
        { id: 'numbers', value: 3, icon: NumberOutlined },
        { id: 'queues', value: 5, icon: CustomerServiceOutlined },
        { id: 'devices', value: 38, icon: DesktopOutlined }
      ].map((tile) => (
        <Grid key={tile.id} size={{ xs: 6, md: 3 }}>
          <MetricTile value={number(tile.value)} label={intl.formatMessage({ id: `widget.plain.${tile.id}` })} icon={tile.icon} />
        </Grid>
      ))}

      {/* row 2 — FeatureMetricCard */}
      <Grid size={12}>
        <Section name="FeatureMetricCard" id="widget.section.feature" noteId="widget.section.feature.note" />
      </Grid>
      {[
        // the title renders at 16px, under the large-text threshold the v2.12 note
        // assumed, so white on primary.main is 4.10 against a 4.5 bar. Measured on
        // the page; `strong` is the fix widgetInk documents.
        { tone: 'primary', id: 'calls', value: number(1641), icon: PhoneOutlined, strong: true },
        { tone: 'warning', id: 'minutes', value: number(486), icon: ClockCircleOutlined },
        { tone: 'success', id: 'answered', value: number(1516), icon: CheckCircleOutlined }
      ].map((card) => (
        <Grid key={card.id} size={{ xs: 12, md: 4 }}>
          <FeatureMetricCard
            tone={card.tone}
            strong={card.strong}
            icon={card.icon}
            title={intl.formatMessage({ id: `widget.feature.${card.id}` })}
            value={card.value}
            footer={intl.formatMessage({ id: `widget.feature.${card.id}.footer` })}
          />
        </Grid>
      ))}

      {/* row 3 — ChannelTile */}
      <Grid size={12}>
        <Section name="ChannelTile" id="widget.section.channel" noteId="widget.section.channel.note" />
      </Grid>
      {[
        // 20px value and a 12px caption on the blue fill: both are "small text",
        // which white on primary.main misses (4.10 / 3.39). `strong` is the measured
        // way out — see widgetInk.js.
        { tone: 'primary', id: 'hotline', value: '1.165 +', icon: PhoneOutlined, strong: true },
        { tone: 'info', id: 'internal', value: '780 +', icon: TeamOutlined },
        { tone: 'dark', id: 'recordings', value: '998 +', icon: AudioOutlined },
        { tone: 'error', id: 'missed', value: '650 +', icon: CloseCircleOutlined }
      ].map((tile) => (
        <Grid key={tile.id} size={{ xs: 12, sm: 6, lg: 3 }}>
          <ChannelTile
            tone={tile.tone}
            strong={tile.strong}
            icon={tile.icon}
            value={tile.value}
            label={intl.formatMessage({ id: `widget.channel.${tile.id}` })}
          />
        </Grid>
      ))}

      {/* row 4 — PeriodStatCard */}
      <Grid size={12}>
        <Section name="PeriodStatCard" id="widget.section.period" noteId="widget.section.period.note" />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <PeriodStatCard
          title={<FormattedMessage id="widget.period.talkTime" />}
          value={intl.formatMessage({ id: 'widget.period.talkTimeValue' })}
          period={periodLabel}
          icon={ClockCircleOutlined}
          onAction={() => setPeriod((prev) => (prev === 'month' ? 'week' : 'month'))}
          actionLabel={intl.formatMessage({ id: 'widget.period.toggle' })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <PeriodStatCard
          title={<FormattedMessage id="widget.period.answered" />}
          value={number(7014)}
          period={periodLabel}
          icon={PhoneOutlined}
          color="info"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <PeriodStatCard
          title={<FormattedMessage id="widget.period.cost" />}
          value={money(4850000)}
          period={periodLabel}
          icon={WalletOutlined}
          color="warning"
        />
      </Grid>

      {/* row 5 — SparkStatCard */}
      <Grid size={12}>
        <Section name="SparkStatCard" id="widget.section.spark" noteId="widget.section.spark.note" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SparkStatCard
          title={<FormattedMessage id="widget.spark.calls" />}
          value={number(7614)}
          delta="12,4%"
          variant="bar"
          data={SPARK_CALLS}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SparkStatCard
          title={<FormattedMessage id="widget.spark.missed" />}
          value={number(620)}
          delta="8,2%"
          isLoss
          color="error"
          variant="area"
          data={SPARK_MISSED}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SparkStatCard
          title={<FormattedMessage id="widget.spark.answerRate" />}
          value="92,4%"
          delta="1,8%"
          color="success"
          variant="line"
          data={SPARK_ANSWER}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <SparkStatCard
          title={<FormattedMessage id="widget.spark.avgWait" />}
          value={intl.formatMessage({ id: 'widget.spark.avgWaitValue' })}
          caption={periodLabel}
        />
      </Grid>

      {/* row 6 — IllustratedMetricCard */}
      <Grid size={12}>
        <Section name="IllustratedMetricCard" id="widget.section.illustrated" noteId="widget.section.illustrated.note" />
      </Grid>
      {[
        { tone: 'success', motif: 'waves', id: 'concurrent', value: number(1658) },
        // small label on a blue fill needs the darker step; see widgetInk.js
        { tone: 'primary', motif: 'nodes', id: 'registered', value: '1K', strong: true },
        { tone: 'warning', motif: 'grid', id: 'monthly', value: number(5678) }
      ].map((card) => (
        <Grid key={card.id} size={{ xs: 12, md: 4 }}>
          <IllustratedMetricCard
            tone={card.tone}
            motif={card.motif}
            strong={card.strong}
            value={card.value}
            label={intl.formatMessage({ id: `widget.illustrated.${card.id}` })}
          />
        </Grid>
      ))}

      {/* the two shapes Mantis has no equivalent for */}
      <Grid size={12}>
        <Section name="HeroStatCard · StatusStatCard" id="widget.section.mphone" noteId="widget.section.mphone.note" />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <HeroStatCard
          filled
          icon={CloudServerOutlined}
          title={<FormattedMessage id="widget.hero.title" />}
          value={number(1641)}
          caption={<FormattedMessage id="widget.hero.caption" />}
          compare={<FormattedMessage id="widget.hero.compare" />}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
        <StatusStatCard
          tone="error"
          icon={CloseCircleOutlined}
          title={<FormattedMessage id="widget.status.unregistered" />}
          value={number(2)}
          statusLabel={<FormattedMessage id="widget.status.actionNeeded" />}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
        <StatusStatCard
          tone="warning"
          icon={WarningOutlined}
          title={<FormattedMessage id="widget.status.longestWait" />}
          value="4:12"
          statusLabel={<FormattedMessage id="widget.status.overThreshold" />}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
        <StatusStatCard
          tone="success"
          icon={CheckCircleOutlined}
          title={<FormattedMessage id="widget.status.quality" />}
          value="4,6 / 5"
          statusLabel={<FormattedMessage id="widget.status.healthy" />}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
        <StatusStatCard
          tone="neutral"
          icon={MinusCircleOutlined}
          title={<FormattedMessage id="widget.status.callbacks" />}
          value={number(0)}
          statusLabel={<FormattedMessage id="widget.status.nothing" />}
        />
      </Grid>

      {/* the decision table */}
      <Grid size={12}>
        <MainCard title={<FormattedMessage id="widget.choice.title" />} content={false}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="widget.choice.card" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="widget.choice.question" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="widget.choice.rule" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CHOICE_ROWS.map((row) => (
                <TableRow key={row}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="subtitle2">
                      <FormattedMessage id={`widget.choice.${row}.card`} />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id={`widget.choice.${row}.question`} />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    <FormattedMessage id={`widget.choice.${row}.rule`} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </MainCard>
      </Grid>
    </Grid>
  );
}

// Each row is labelled with the component that draws it, because the point of
// this page is to be shopped from: a reader who likes a card needs its name
// without opening the file.
function Section({ name, id, noteId }) {
  return (
    <Stack sx={{ gap: 0.25, pt: 1 }}>
      <Stack direction="row" sx={{ gap: 1.25, alignItems: 'baseline', flexWrap: 'wrap' }}>
        <Typography variant="h5">
          <FormattedMessage id={id} />
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
          {name}
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 820 }}>
        <FormattedMessage id={noteId} />
      </Typography>
    </Stack>
  );
}

Section.propTypes = { name: PropTypes.string, id: PropTypes.string, noteId: PropTypes.string };
