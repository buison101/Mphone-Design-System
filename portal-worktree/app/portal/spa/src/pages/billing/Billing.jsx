import { useState } from 'react';

// material-ui
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// third-party
import { FormattedMessage, useIntl } from 'react-intl';

// project imports
import PageHeader from 'components/patterns/PageHeader';
import SparkStatCard from 'components/cards/statistics/SparkStatCard';
import ActivityListCard from 'components/cards/ActivityListCard';
import BilledTrendCard from 'sections/billing/BilledTrendCard';
import InvoiceFilterGrid from 'sections/billing/InvoiceFilterGrid';
import InvoiceListCard from 'sections/billing/InvoiceListCard';
import CostBreakdownCard from 'sections/billing/CostBreakdownCard';
import { BILLING, CURRENCIES } from 'sections/billing/billingSample';
import { INVOICE_STATUSES } from 'utils/invoiceStatus';

// assets
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';

// ==============================|| PAGE - BILLING ||============================== //
//
// The tenant's side of Mantis's Invoice dashboard: what the tổng đài costs,
// period by period, and what is still owed.
//
// Three things this page fixes about the screen it is rebuilt from:
//
// 1. Mantis prices its stat tiles in £ and its invoice list and expenses card in
//    $, on one screen. Currency here is a single page-level choice and every
//    figure below it follows, so no two numbers on screen are ever in different
//    units and no total is ever a sum of two currencies.
// 2. Mantis's four tiles all read £5678.09 and its chart has no relationship to
//    any of them. Here the twelve bars sum to the Total tile, paid + pending +
//    overdue sum to it as well, and the four breakdown lines sum to the current
//    period's invoice. A reader who adds them up finds them consistent.
// 3. Mantis decorates every tile with a percentage. A "-4.7%" over five overdue
//    invoices is a statistic computed to fill a slot. Only the total carries a
//    delta here, because it is the only figure on the page where comparing this
//    window to the last one means something; the rest carry their count.
//
// Nothing on this page can be acted on — no Pay, no Download, no invoice detail
// — because `app/portal/service/` has no billing endpoint behind any of them.
// See sections/billing/billingSample.js.

const ACTIVITY_ICON = {
  issued: FileTextOutlined,
  payment: CheckCircleOutlined,
  overdue: ExclamationCircleOutlined,
  usage: RiseOutlined,
  change: TeamOutlined
};

const ACTIVITY_COLOR = {
  issued: 'primary',
  payment: 'success',
  overdue: 'error',
  usage: 'warning',
  change: 'info'
};

const DAY = 86400000;

// Vietnamese's short month is "Tháng 9", and twelve of those will not fit an
// axis at any width this card is ever given. Each language gets its own axis
// convention through one message instead: "T9" against "Sep".
function monthAxisLabels(intl, months) {
  const name = new Intl.DateTimeFormat(intl.locale, { month: 'short', timeZone: 'UTC' });
  return months.map((month) =>
    intl.formatMessage({ id: 'chart.monthShort' }, { month: month + 1, name: name.format(new Date(Date.UTC(2024, month, 1))) })
  );
}

export default function Billing() {
  const intl = useIntl();
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [status, setStatus] = useState('all');

  const data = BILLING[currency];

  // Switching currency switches account, and a filter carried across can leave
  // the reader on an empty list with no visible cause.
  const changeCurrency = (next) => {
    setCurrency(next);
    setStatus('all');
  };

  const money = (value) =>
    intl.formatNumber(value, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: currency === 'VND' ? 0 : 2
    });
  const percent = (value) => `${intl.formatNumber(value, { maximumFractionDigits: 1 })}%`;
  const count = (value) => intl.formatMessage({ id: 'billing.count' }, { count: value });
  const period = ({ year, month }) => intl.formatMessage({ id: 'billing.period' }, { month: String(month + 1).padStart(2, '0'), year });
  const day = (iso) => intl.formatDate(new Date(iso), { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });

  const summary = data.summary;

  const tiles = [
    {
      id: 'total',
      value: money(summary.total.amount),
      delta: percent(summary.total.delta),
      isLoss: summary.total.isLoss,
      caption: `${intl.formatMessage({ id: 'billing.summary.compare' })} · ${count(summary.total.count)}`
    },
    { id: 'paid', value: money(summary.paid.amount), caption: count(summary.paid.count) },
    { id: 'pending', value: money(summary.pending.amount), caption: count(summary.pending.count) },
    {
      id: 'overdue',
      value: money(summary.overdue.amount),
      // The overdue tile has no colour of its own, so the consequence has to be
      // in the words: how many, and how late the worst of them is.
      caption:
        summary.overdue.count === 0
          ? intl.formatMessage({ id: 'billing.summary.noOverdue' })
          : `${count(summary.overdue.count)} · ${intl.formatMessage(
              { id: 'billing.invoices.overdueBy' },
              {
                days: Math.max(
                  0,
                  Math.floor(
                    (Date.now() - Math.min(...data.invoices.filter((row) => row.status === 'overdue').map((row) => Date.parse(row.due)))) /
                      DAY
                  )
                )
              }
            )}`
    }
  ];

  const labels = monthAxisLabels(intl, data.months);
  const billed = data.series.map((row) => row.amount);

  const counts = {
    all: data.invoices.length,
    ...Object.fromEntries(INVOICE_STATUSES.map((id) => [id, data.invoices.filter((row) => row.status === id).length]))
  };

  const filters = ['all', ...INVOICE_STATUSES].map((id) => ({
    id,
    label: intl.formatMessage({ id: id === 'all' ? 'billing.filter.all' : `billing.status.${id}` }),
    count: intl.formatNumber(counts[id])
  }));

  const matched = status === 'all' ? data.invoices : data.invoices.filter((row) => row.status === status);
  const SHOWN = 6;

  const meta = (row) => {
    if (row.status === 'paid') return intl.formatMessage({ id: 'billing.invoices.settledOn' }, { date: day(row.settled) });
    if (row.status === 'pending') return intl.formatMessage({ id: 'billing.invoices.due' }, { date: day(row.due) });
    if (row.status === 'overdue') {
      return intl.formatMessage(
        { id: 'billing.invoices.overdueBy' },
        { days: Math.max(0, Math.floor((Date.now() - Date.parse(row.due)) / DAY)) }
      );
    }
    return undefined;
  };

  const invoices = matched.slice(0, SHOWN).map((row) => ({
    id: row.id,
    period: intl.formatMessage({ id: 'billing.invoices.period' }, { period: period(row.period) }),
    note: row.replacedBy ? intl.formatMessage({ id: 'billing.invoices.replaced' }, { replacement: row.replacedBy }) : undefined,
    amount: money(row.amount),
    status: row.status,
    statusLabel: intl.formatMessage({ id: `billing.status.${row.status}` }),
    meta: meta(row)
  }));

  const breakdownTotal = data.breakdown.reduce((sum, row) => sum + row.amount, 0);
  const breakdown = data.breakdown.map((row) => ({
    id: row.id,
    label: intl.formatMessage({ id: `billing.cost.${row.id}` }),
    value: row.amount,
    amount: money(row.amount),
    share: percent((row.amount / breakdownTotal) * 100)
  }));

  const activities = data.activity.map((item) => ({
    id: item.id,
    icon: ACTIVITY_ICON[item.kind],
    color: ACTIVITY_COLOR[item.kind],
    primary: intl.formatMessage({ id: `billing.activity.${item.kind}` }),
    secondary: [item.invoice, intl.formatMessage({ id: 'billing.activity.daysAgo' }, { days: item.days })].filter(Boolean).join(' · '),
    value: money(item.amount),
    meta:
      item.kind === 'usage'
        ? percent(item.meta)
        : item.kind === 'change'
          ? intl.formatMessage({ id: 'billing.activity.extensions' }, { count: item.meta })
          : undefined
  }));

  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        {/* no eyebrow: the sidebar entry is already "Hoá đơn", and an eyebrow
            here would repeat the H1 word for word */}
        <PageHeader
          title={<FormattedMessage id="billing.title" />}
          description={<FormattedMessage id="billing.description" />}
          actions={
            CURRENCIES.length > 1 && (
              <TextField
                select
                size="small"
                value={currency}
                onChange={(event) => changeCurrency(event.target.value)}
                label={intl.formatMessage({ id: 'billing.currency.label' })}
                sx={{ minWidth: 140 }}
              >
                {CURRENCIES.map((code) => (
                  <MenuItem key={code} value={code}>
                    {code}
                  </MenuItem>
                ))}
              </TextField>
            )
          }
        />
      </Grid>

      {/* This notice comes off with billingSample.js and not before. Money that
          is not money has to say so where the money is. */}
      <Grid size={12}>
        <Alert severity="info">
          <AlertTitle sx={{ mb: 0.25 }}>
            <FormattedMessage id="billing.sample.title" />
          </AlertTitle>
          <FormattedMessage id="billing.sample.detail" />
        </Alert>
      </Grid>

      {/* row 1 — where the account stands */}
      {tiles.map((tile) => (
        <Grid key={tile.id} size={{ xs: 12, sm: 6, lg: 3 }}>
          <SparkStatCard
            title={<FormattedMessage id={`billing.summary.${tile.id}`} />}
            value={tile.value}
            delta={tile.delta}
            isLoss={tile.isLoss}
            caption={tile.caption}
          />
        </Grid>
      ))}

      {/* row 2 — the twelve periods behind those totals, and the way into them */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <BilledTrendCard
          title={<FormattedMessage id="billing.trend.title" />}
          caption={<FormattedMessage id="billing.trend.caption" />}
          labels={labels}
          data={billed}
          valueFormatter={(value) => (value === null ? '' : money(value))}
          axisFormatter={(value) =>
            value >= 10000
              ? intl.formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })
              : intl.formatNumber(value, { maximumFractionDigits: 0 })
          }
          emptyTitle={<FormattedMessage id="billing.trend.empty" />}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <InvoiceFilterGrid title={<FormattedMessage id="billing.filter.title" />} items={filters} value={status} onChange={setStatus} />
      </Grid>

      {/* row 3 — the invoices themselves, what made them, and what just moved */}
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <InvoiceListCard
          title={<FormattedMessage id="billing.invoices.title" />}
          items={invoices}
          footer={
            matched.length > SHOWN ? (
              <FormattedMessage id="billing.invoices.showing" values={{ shown: invoices.length, total: matched.length }} />
            ) : undefined
          }
          emptyTitle={<FormattedMessage id="billing.invoices.empty" />}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <CostBreakdownCard
          title={<FormattedMessage id="billing.cost.title" />}
          subheader={period(data.period)}
          totalLabel={<FormattedMessage id="billing.cost.total" />}
          total={money(breakdownTotal)}
          items={breakdown}
          valueFormatter={money}
          emptyTitle={<FormattedMessage id="billing.cost.empty" />}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }}>
        <ActivityListCard
          title={<FormattedMessage id="billing.activity.title" />}
          items={activities}
          emptyTitle={<FormattedMessage id="billing.activity.empty" />}
        />
      </Grid>
    </Grid>
  );
}
