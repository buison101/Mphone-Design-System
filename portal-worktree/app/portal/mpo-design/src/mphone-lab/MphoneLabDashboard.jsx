import { useIntl } from 'react-intl';

import DashboardDefault from 'mphone-lab/dashboard-default/MphoneDashboardBase';

export default function MphoneLabDashboard() {
  const intl = useIntl();
  const message = (id) => intl.formatMessage({ id });

  const content = {
    title: message('mphoneLab.dashboard.title'),
    metrics: [
      message('mphoneLab.dashboard.metric.totalCalls'),
      message('mphoneLab.dashboard.metric.answered'),
      message('mphoneLab.dashboard.metric.missed'),
      message('mphoneLab.dashboard.metric.cost')
    ],
    captionPrefix: message('mphoneLab.dashboard.comparisonPrefix'),
    captionSuffix: message('mphoneLab.dashboard.comparisonSuffix'),
    visitorTitle: message('mphoneLab.dashboard.callTrend'),
    month: message('mphoneLab.dashboard.period.monthly'),
    week: message('mphoneLab.dashboard.period.weekly'),
    trendSeries: [message('mphoneLab.dashboard.inboundCalls'), message('mphoneLab.dashboard.outboundCalls')],
    incomeTitle: message('mphoneLab.dashboard.usageOverview'),
    weekStatistics: message('mphoneLab.dashboard.thisWeek'),
    recentTitle: message('mphoneLab.dashboard.recentCalls'),
    exportActions: [
      message('mphoneLab.dashboard.export.csv'),
      message('mphoneLab.dashboard.export.excel'),
      message('mphoneLab.dashboard.export.print')
    ],
    table: {
      headings: {
        tracking: message('mphoneLab.dashboard.table.callId'),
        name: message('mphoneLab.dashboard.table.contact'),
        total: message('mphoneLab.dashboard.table.duration'),
        status: message('mphoneLab.dashboard.table.status'),
        amount: message('mphoneLab.dashboard.table.charge')
      },
      statuses: {
        pending: message('mphoneLab.dashboard.status.noAnswer'),
        approved: message('mphoneLab.dashboard.status.answered'),
        rejected: message('mphoneLab.dashboard.status.missed'),
        none: message('mphoneLab.dashboard.status.noAnswer')
      },
      rows: [
        { tracking_no: 84564564, name: message('mphoneLab.dashboard.sample.customer'), fat: 40, carbs: 2, protein: 40570 },
        { tracking_no: 98764564, name: message('mphoneLab.dashboard.sample.sales'), fat: 300, carbs: 0, protein: 180139 },
        { tracking_no: 98756325, name: message('mphoneLab.dashboard.sample.support'), fat: 355, carbs: 1, protein: 90989 },
        { tracking_no: 98652366, name: message('mphoneLab.dashboard.sample.reception'), fat: 50, carbs: 1, protein: 10239 },
        { tracking_no: 13286564, name: message('mphoneLab.dashboard.sample.customerCare'), fat: 100, carbs: 1, protein: 83348 },
        { tracking_no: 86739658, name: message('mphoneLab.dashboard.sample.partner'), fat: 99, carbs: 0, protein: 410780 },
        { tracking_no: 13256498, name: message('mphoneLab.dashboard.sample.customer'), fat: 125, carbs: 2, protein: 70999 },
        { tracking_no: 98753263, name: message('mphoneLab.dashboard.sample.sales'), fat: 89, carbs: 2, protein: 10570 },
        { tracking_no: 98753275, name: message('mphoneLab.dashboard.sample.support'), fat: 185, carbs: 1, protein: 98063 },
        { tracking_no: 98753291, name: message('mphoneLab.dashboard.sample.reception'), fat: 100, carbs: 0, protein: 14001 }
      ],
      currencyPrefix: message('mphoneLab.dashboard.currencyPrefix')
    },
    analyticsTitle: message('mphoneLab.dashboard.serviceHealth'),
    analyticsPeriods: [
      message('mphoneLab.dashboard.healthPeriod.week'),
      message('mphoneLab.dashboard.healthPeriod.month'),
      message('mphoneLab.dashboard.healthPeriod.year')
    ],
    analyticsRows: [
      message('mphoneLab.dashboard.quality.answerRate'),
      message('mphoneLab.dashboard.quality.missedRate'),
      message('mphoneLab.dashboard.quality.connectionQuality')
    ],
    low: message('mphoneLab.dashboard.quality.good'),
    salesTitle: message('mphoneLab.dashboard.costReport'),
    salesPeriods: [
      message('mphoneLab.dashboard.costPeriod.today'),
      message('mphoneLab.dashboard.costPeriod.month'),
      message('mphoneLab.dashboard.costPeriod.year')
    ],
    salesChart: {
      net: message('mphoneLab.dashboard.estimatedCost'),
      income: message('mphoneLab.dashboard.cost.voice'),
      cost: message('mphoneLab.dashboard.cost.services'),
      valuePrefix: '',
      valueSuffix: message('mphoneLab.dashboard.chartUnit')
    },
    transactionTitle: message('mphoneLab.dashboard.accountActivity'),
    transactions: [
      { title: message('mphoneLab.dashboard.activity.topUp'), time: message('mphoneLab.dashboard.activityTime.today') },
      { title: message('mphoneLab.dashboard.activity.renewal'), time: message('mphoneLab.dashboard.activityTime.august') },
      { title: message('mphoneLab.dashboard.activity.newNumber'), time: message('mphoneLab.dashboard.activityTime.hoursAgo') }
    ],
    supportTitle: message('mphoneLab.dashboard.support.title'),
    supportResponse: message('mphoneLab.dashboard.support.response'),
    supportAction: message('mphoneLab.dashboard.support.action'),
    supportNames: ['Ngọc Trâm', 'Bảo Nam', 'Minh Quân', 'Quỳnh Hoa']
  };

  return <DashboardDefault content={content} />;
}
