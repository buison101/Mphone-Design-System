import { useIntl } from 'react-intl';

import DashboardAnalytics from 'mphone-lab/dashboard-analytics/MphoneAnalyticsBase';

export default function MphoneLabAnalytics() {
  const intl = useIntl();
  const message = (id) => intl.formatMessage({ id });

  const content = {
    banner: {
      title: message('mphoneLab.analytics.banner.title'),
      description: message('mphoneLab.analytics.banner.description'),
      action: message('mphoneLab.analytics.banner.action'),
      imageAlt: message('mphoneLab.analytics.banner.imageAlt'),
      arrowAlt: message('mphoneLab.analytics.banner.arrowAlt')
    },
    metrics: [
      {
        title: message('mphoneLab.analytics.metric.answerRate'),
        value: '84.2%',
        chartLabel: message('mphoneLab.analytics.metric.answerRate')
      },
      {
        title: message('mphoneLab.analytics.metric.waitTime'),
        value: message('mphoneLab.analytics.metric.waitTimeValue'),
        chartLabel: message('mphoneLab.analytics.metric.waitTime')
      },
      {
        title: message('mphoneLab.analytics.metric.averageDuration'),
        value: message('mphoneLab.analytics.metric.averageDurationValue'),
        chartLabel: message('mphoneLab.analytics.metric.averageDuration')
      },
      {
        title: message('mphoneLab.analytics.metric.costPerMinute'),
        value: message('mphoneLab.analytics.metric.costPerMinuteValue'),
        chartLabel: message('mphoneLab.analytics.metric.costPerMinute')
      }
    ],
    trend: {
      title: message('mphoneLab.analytics.trend.title'),
      value: '84.2% (+3.8%)',
      comparison: message('mphoneLab.analytics.trend.comparison'),
      week: message('mphoneLab.analytics.period.week'),
      month: message('mphoneLab.analytics.period.month'),
      options: [
        { value: 'volume', label: message('mphoneLab.analytics.trend.volume') },
        { value: 'margin', label: message('mphoneLab.analytics.trend.answerRate') },
        { value: 'sales', label: message('mphoneLab.analytics.trend.waitTime') }
      ],
      chart: {
        label: message('mphoneLab.analytics.trend.chartLabel'),
        valuePrefix: '',
        valueSuffix: '',
        weekLabels: [
          message('mphoneLab.analytics.day.mon'),
          message('mphoneLab.analytics.day.tue'),
          message('mphoneLab.analytics.day.wed'),
          message('mphoneLab.analytics.day.thu'),
          message('mphoneLab.analytics.day.fri'),
          message('mphoneLab.analytics.day.sat'),
          message('mphoneLab.analytics.day.sun')
        ],
        monthLabels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      }
    },
    topLines: {
      title: message('mphoneLab.analytics.lines.title'),
      rows: [
        { title: message('mphoneLab.analytics.line.customerCare'), detail: '1900 232 460', value: '7,755', change: '31.74% (+8.20%)' },
        { title: message('mphoneLab.analytics.line.sales'), detail: '028 7300 1688', value: '5,215', change: '28.53% (+4.10%)' },
        { title: message('mphoneLab.analytics.line.technical'), detail: '1800 6606', value: '4,848', change: '25.35% (-2.40%)' },
        { title: message('mphoneLab.analytics.line.reception'), detail: '028 7300 1689', value: '3,275', change: '23.17% (+1.30%)' },
        { title: message('mphoneLab.analytics.line.vip'), detail: '1900 232 461', value: '3,003', change: '22.21% (-1.80%)' }
      ]
    },
    table: {
      title: message('mphoneLab.analytics.queues.title'),
      actions: [
        message('mphoneLab.analytics.export.csv'),
        message('mphoneLab.analytics.export.excel'),
        message('mphoneLab.analytics.export.print')
      ],
      headings: {
        tracking: message('mphoneLab.analytics.queues.id'),
        name: message('mphoneLab.analytics.queues.name'),
        total: message('mphoneLab.analytics.queues.totalCalls'),
        status: message('mphoneLab.analytics.queues.status'),
        amount: message('mphoneLab.analytics.queues.averageWait')
      },
      statuses: {
        pending: message('mphoneLab.analytics.status.attention'),
        approved: message('mphoneLab.analytics.status.onTarget'),
        rejected: message('mphoneLab.analytics.status.belowTarget'),
        none: message('mphoneLab.analytics.status.noData')
      },
      rows: [
        { tracking_no: 'Q-1001', name: message('mphoneLab.analytics.queue.customerCare'), fat: 1256, carbs: 1, protein: 14 },
        { tracking_no: 'Q-1002', name: message('mphoneLab.analytics.queue.sales'), fat: 864, carbs: 0, protein: 31 },
        { tracking_no: 'Q-1003', name: message('mphoneLab.analytics.queue.technical'), fat: 540, carbs: 1, protein: 12 },
        { tracking_no: 'Q-1004', name: message('mphoneLab.analytics.queue.reception'), fat: 438, carbs: 1, protein: 9 },
        { tracking_no: 'Q-1005', name: message('mphoneLab.analytics.queue.priority'), fat: 326, carbs: 2, protein: 46 },
        { tracking_no: 'Q-1006', name: message('mphoneLab.analytics.queue.partners'), fat: 295, carbs: 0, protein: 28 },
        { tracking_no: 'Q-1007', name: message('mphoneLab.analytics.queue.billing'), fat: 248, carbs: 1, protein: 11 },
        { tracking_no: 'Q-1008', name: message('mphoneLab.analytics.queue.renewals'), fat: 214, carbs: 1, protein: 16 },
        { tracking_no: 'Q-1009', name: message('mphoneLab.analytics.queue.outbound'), fat: 186, carbs: 0, protein: 27 },
        { tracking_no: 'Q-1010', name: message('mphoneLab.analytics.queue.afterHours'), fat: 98, carbs: 2, protein: 52 }
      ],
      valuePrefix: '',
      valueSuffix: message('mphoneLab.analytics.unit.secondsShort')
    },
    quality: {
      title: message('mphoneLab.analytics.quality.title'),
      periods: [
        message('mphoneLab.analytics.period.weekly'),
        message('mphoneLab.analytics.period.monthly'),
        message('mphoneLab.analytics.period.yearly')
      ],
      rows: [
        { label: message('mphoneLab.analytics.quality.connection'), value: '96.4%' },
        { label: message('mphoneLab.analytics.quality.dropped'), value: '0.58%' },
        { label: message('mphoneLab.analytics.quality.risk'), value: message('mphoneLab.analytics.quality.low') }
      ],
      chart: { label: message('mphoneLab.analytics.quality.chartLabel'), valuePrefix: '', valueSuffix: '%' }
    },
    cost: {
      title: message('mphoneLab.analytics.cost.title'),
      periods: [
        message('mphoneLab.analytics.cost.today'),
        message('mphoneLab.analytics.cost.month'),
        message('mphoneLab.analytics.cost.year')
      ],
      chart: {
        summaryLabel: message('mphoneLab.analytics.cost.summary'),
        summaryValue: message('mphoneLab.analytics.cost.summaryValue'),
        primary: message('mphoneLab.analytics.cost.voice'),
        secondary: message('mphoneLab.analytics.cost.services'),
        valuePrefix: '',
        valueSuffix: message('mphoneLab.analytics.unit.thousandDong'),
        weekLabels: [
          message('mphoneLab.analytics.week.one'),
          message('mphoneLab.analytics.week.two'),
          message('mphoneLab.analytics.week.three'),
          message('mphoneLab.analytics.week.four')
        ],
        monthLabels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      }
    },
    alerts: {
      title: message('mphoneLab.analytics.alerts.title'),
      items: [
        {
          title: message('mphoneLab.analytics.alert.answerImproved'),
          time: message('mphoneLab.analytics.time.todayTwo'),
          value: '+3.8%',
          change: '78%'
        },
        {
          title: message('mphoneLab.analytics.alert.waitIncreased'),
          time: message('mphoneLab.analytics.time.todaySix'),
          value: message('mphoneLab.analytics.alert.waitValue'),
          change: '8%'
        },
        {
          title: message('mphoneLab.analytics.alert.costReview'),
          time: message('mphoneLab.analytics.time.todayNine'),
          value: '+16%',
          change: '16%'
        }
      ],
      support: {
        title: message('mphoneLab.analytics.support.title'),
        response: message('mphoneLab.analytics.support.response'),
        action: message('mphoneLab.analytics.support.action'),
        names: ['Ngọc Trâm', 'Bảo Nam', 'Minh Quân', 'Quỳnh Hoa']
      }
    },
    goals: {
      labels: [
        message('mphoneLab.analytics.goal.answerSla'),
        message('mphoneLab.analytics.goal.connectionQuality'),
        message('mphoneLab.analytics.goal.budgetUsed'),
        message('mphoneLab.analytics.goal.queuesOnTarget')
      ],
      title: message('mphoneLab.analytics.goal.title'),
      description: message('mphoneLab.analytics.goal.description'),
      imageAlt: message('mphoneLab.analytics.goal.imageAlt')
    },
    plan: {
      title: message('mphoneLab.analytics.plan.title'),
      description: message('mphoneLab.analytics.plan.description'),
      progress: message('mphoneLab.analytics.plan.progress'),
      nextAction: message('mphoneLab.analytics.plan.nextAction'),
      dueDate: message('mphoneLab.analytics.plan.dueDate'),
      note: message('mphoneLab.analytics.plan.note'),
      imageAlt: message('mphoneLab.analytics.plan.imageAlt'),
      names: ['Ngọc Trâm', 'Bảo Nam', 'Minh Quân', 'Quỳnh Hoa', 'Gia Huy', 'Thu Hà']
    },
    channels: {
      title: message('mphoneLab.analytics.channels.title'),
      subtitle: message('mphoneLab.analytics.channels.subtitle'),
      change: '+128',
      series: [
        message('mphoneLab.analytics.channel.hotline'),
        message('mphoneLab.analytics.channel.webphone'),
        message('mphoneLab.analytics.channel.appPhone')
      ],
      items: [
        {
          title: message('mphoneLab.analytics.channels.growing'),
          time: message('mphoneLab.analytics.time.todayTwo'),
          value: '+1,430',
          share: '35%'
        },
        {
          title: message('mphoneLab.analytics.channels.declining'),
          time: message('mphoneLab.analytics.time.todaySix'),
          value: '-1,430',
          share: '35%'
        }
      ]
    }
  };

  return <DashboardAnalytics content={content} />;
}
