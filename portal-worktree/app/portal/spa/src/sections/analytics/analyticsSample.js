// ==============================|| ANALYTICS - PLACEHOLDER DATA ||============================== //
//
// Shape-accurate sample data for the Analytics composition.
//
// It exists so the page can be reviewed, screenshotted and accessibility-tested
// before `analytics.php` exists on the server. Every field here matches the
// field the endpoint is expected to return, so wiring the page up is a swap of
// this import for `useAnalytics(ANALYTICS_URL, filters)` and nothing else.
//
// Do not ship a release with this import still in place: a dashboard that shows
// invented traffic is worse than one that shows an empty state.

// Buckets are stored as ordinals, never as pre-rendered labels: the axis text
// has to follow the reader's language, and a hard-coded "T2" would still say T2
// with the portal in English.
export const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0];

export const TREND = {
  week: {
    days: WEEKDAYS,
    answered: [268, 312, 295, 341, 388, 164, 92],
    missed: [24, 31, 19, 28, 44, 12, 6],
    total: 1860,
    delta: 12.4,
    isLoss: false
  },
  month: {
    weeks: [1, 2, 3, 4],
    answered: [1642, 1788, 1710, 1854],
    missed: [148, 132, 176, 164],
    total: 7614,
    delta: 4.1,
    isLoss: false
  }
};

export const STATS = [
  {
    id: 'total',
    value: 7614,
    delta: 12.4,
    isLoss: false,
    color: 'primary',
    variant: 'bar',
    data: [268, 312, 295, 341, 388, 164, 92]
  },
  {
    id: 'missed',
    value: 620,
    delta: 8.2,
    isLoss: true,
    color: 'error',
    variant: 'area',
    data: [24, 31, 19, 28, 44, 12, 6]
  },
  {
    id: 'talkTime',
    value: 41520,
    delta: 6.8,
    isLoss: false,
    color: 'warning',
    variant: 'bar',
    data: [5200, 6100, 5800, 6400, 7100, 3200, 1800]
  },
  {
    id: 'answerRate',
    value: 91.8,
    delta: 2.1,
    isLoss: false,
    color: 'success',
    variant: 'line',
    data: [88, 90, 89, 92, 93, 91, 92]
  }
];

export const TOP_EXTENSIONS = [
  {
    id: '1001',
    name: 'Nguyễn Thu Hà',
    extension: '1001',
    calls: 412,
    share: 21.4
  },
  {
    id: '1014',
    name: 'Trần Minh Quân',
    extension: '1014',
    calls: 366,
    share: 19.0
  },
  {
    id: '1007',
    name: 'Lê Bảo Ngọc',
    extension: '1007',
    calls: 298,
    share: 15.5
  },
  {
    id: '1022',
    name: 'Phạm Đức Anh',
    extension: '1022',
    calls: 244,
    share: 12.7
  },
  {
    id: '1030',
    name: 'Đỗ Hoàng Yến',
    extension: '1030',
    calls: 187,
    share: 9.7
  }
];

export const RECENT_CALLS = [
  {
    id: 'a1',
    time: '14:32',
    caller: 'Nguyễn Văn Bình',
    callerNumber: '0903 118 224',
    extension: '1001',
    status: 'answered',
    duration: 214
  },
  {
    id: 'a2',
    time: '14:28',
    caller: null,
    callerNumber: '0288 776 512',
    extension: '1014',
    status: 'missed',
    duration: 0
  },
  {
    id: 'a3',
    time: '14:21',
    caller: 'Công ty Thái Sơn',
    callerNumber: '0243 556 118',
    extension: '1007',
    status: 'answered',
    duration: 486
  },
  {
    id: 'a4',
    time: '14:15',
    caller: 'Lê Thị Mai',
    callerNumber: '0912 445 003',
    extension: '1022',
    status: 'voicemail',
    duration: 38
  },
  {
    id: 'a5',
    time: '14:02',
    caller: null,
    callerNumber: '0356 774 991',
    extension: '1001',
    status: 'busy',
    duration: 0
  },
  {
    id: 'a6',
    time: '13:54',
    caller: 'Trần Quốc Huy',
    callerNumber: '0987 220 641',
    extension: '1030',
    status: 'answered',
    duration: 122
  },
  {
    id: 'a7',
    time: '13:41',
    caller: 'Kho Bình Tân',
    callerNumber: '1008',
    extension: '1014',
    status: 'answered',
    duration: 65
  },
  {
    id: 'a8',
    time: '13:30',
    caller: null,
    callerNumber: '0777 331 208',
    extension: '1007',
    status: 'no_answer',
    duration: 0
  }
];

export const QUALITY = {
  months: [2, 3, 4, 5, 6, 7],
  series: [3.4, 2.8, 3.9, 2.6, 2.2, 1.9],
  answerRate: 91.8,
  missRate: 8.2,
  risk: 'low'
};

export const COST = {
  today: {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    internal: [120000, 186000, 94000, 210000, 168000, 62000],
    external: [340000, 512000, 288000, 604000, 486000, 174000],
    total: 3244000
  },
  month: {
    weeks: [1, 2, 3, 4],
    internal: [2140000, 2380000, 2260000, 2510000],
    external: [6820000, 7140000, 6960000, 7480000],
    total: 37690000
  },
  year: {
    quarters: [1, 2, 3, 4],
    internal: [28400000, 31200000, 29800000, 33100000],
    external: [84600000, 91200000, 88400000, 96800000],
    total: 483500000
  }
};

export const CHANNELS = {
  days: WEEKDAYS,
  hotline: [186, 214, 198, 232, 268, 118, 64],
  mobile: [92, 108, 96, 124, 138, 46, 22],
  internal: [64, 72, 68, 81, 94, 34, 18],
  topRoute: { name: 'Hotline 1900 6060', calls: 1280, share: 58.4 },
  topQueue: { name: 'Hàng đợi Chăm sóc khách hàng', calls: 742, share: 33.8 }
};

export const QUEUE_HEALTH = [
  { id: 'handled', value: 88, color: 'success' },
  { id: 'waiting', value: 42, color: 'primary' },
  { id: 'abandoned', value: 12, color: 'error' },
  { id: 'slaBreach', value: 6, color: 'warning' }
];

export const ACTIVITIES = [
  {
    id: 'r1',
    kind: 'recording',
    color: 'primary',
    value: '04:26',
    meta: '1007',
    at: '14:21'
  },
  {
    id: 'r2',
    kind: 'missed',
    color: 'error',
    value: '0288 776 512',
    meta: '1014',
    at: '14:28'
  },
  {
    id: 'r3',
    kind: 'queue',
    color: 'warning',
    calls: 6,
    meta: 'SLA',
    at: '13:50'
  }
];

export const SETUP = {
  value: 65,
  remaining: ['setup.step.ivr', 'setup.step.voicemail']
};

export const SUPPORT_TEAM = ['Nguyễn Thu Hà', 'Trần Minh Quân', 'Lê Bảo Ngọc', 'Phạm Đức Anh'];
