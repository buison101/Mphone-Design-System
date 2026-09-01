// ==============================|| WIDGET DATA - SAMPLE CONTENT ||============================== //
//
// Everything the /widget/data rack draws. It is sample content, and it lives in
// one file so that the day any of these cards is lifted onto a real screen, the
// swap is one import rather than a hunt through the page.
//
// Two rules hold the file together:
//
// - Translatable text is a message id, never a string. Proper nouns, extension
//   numbers, references and amounts are literals, because they read the same in
//   both languages; everything a reader parses as language goes through the
//   locale files.
// - The figures reconcile. The eight recent charges sum to the week's total, the
//   plan rows multiply out to their own totals, and the region shares sum to
//   100. Mantis prints the same amount on four unrelated tiles; a rack that
//   teaches a card also teaches what a reader will assume about its numbers.

// --- To do list -------------------------------------------------------------

export const TODO_ITEMS = [
  { id: 'voicemail', labelId: 'widget.data.todo.voicemail', done: true },
  { id: 'greeting', labelId: 'widget.data.todo.greeting', done: true },
  { id: 'queue', labelId: 'widget.data.todo.queue', done: true },
  { id: 'extension', labelId: 'widget.data.todo.extension', done: false },
  { id: 'hours', labelId: 'widget.data.todo.hours', done: false },
  { id: 'devices', labelId: 'widget.data.todo.devices', done: false },
  { id: 'report', labelId: 'widget.data.todo.report', done: false }
];

// --- Resource usage ---------------------------------------------------------
// Four independent capacity readings, not four shares of one whole, so they are
// not expected to sum. Mantis's second bar is the grey one; the grey here is the
// reading that is a fact rather than a limit - extensions assigned is not a
// ceiling anyone is approaching.

export const USAGE_ROWS = [
  { id: 'channels', labelId: 'widget.data.usage.channels', value: 20, color: 'primary' },
  { id: 'extensions', labelId: 'widget.data.usage.extensions', value: 58, color: 'secondary' },
  { id: 'storage', labelId: 'widget.data.usage.storage', value: 40, color: 'primary' },
  { id: 'minutes', labelId: 'widget.data.usage.minutes', value: 90, color: 'primary' }
];

// --- Team members -----------------------------------------------------------

export const TEAM_ROWS = [
  { id: 'ha', name: 'Nguyễn Thu Hà', roleId: 'widget.data.role.supportLead', metaId: 'widget.data.time.min5', color: 'primary' },
  { id: 'quan', name: 'Trần Minh Quân', roleId: 'widget.data.role.pbxEngineer', metaId: 'widget.data.time.hour1', color: 'info' },
  { id: 'an', name: 'Lê Hoài An', roleId: 'widget.data.role.customerCare', metaId: 'widget.data.time.yesterday', color: 'success' },
  { id: 'bao', name: 'Phạm Gia Bảo', roleId: 'widget.data.role.sysadmin', meta: '02/05/2026', color: 'warning' }
];

// --- Latest notifications ---------------------------------------------------

export const MESSAGE_ROWS = [
  {
    id: 'calls',
    timeId: 'widget.data.time.hour2',
    titleId: 'widget.data.message.calls',
    bodyId: 'widget.data.message.calls.body',
    color: 'info'
  },
  {
    id: 'extensions',
    timeId: 'widget.data.time.hour4',
    titleId: 'widget.data.message.extensions',
    bodyId: 'widget.data.message.extensions.body',
    color: 'error'
  },
  {
    id: 'backup',
    timeId: 'widget.data.time.day1',
    titleId: 'widget.data.message.backup',
    bodyId: 'widget.data.message.backup.body',
    color: 'success'
  },
  {
    id: 'requests',
    timeId: 'widget.data.time.day2',
    titleId: 'widget.data.message.requests',
    bodyId: 'widget.data.message.requests.body',
    color: 'primary'
  }
];

// --- User activity ----------------------------------------------------------

export const ACTIVITY_ROWS = [
  {
    id: 'ha',
    name: 'Nguyễn Thu Hà',
    textId: 'widget.data.activity.ended',
    metaId: 'widget.data.time.now',
    presence: 'available',
    color: 'primary'
  },
  {
    id: 'quan',
    name: 'Trần Minh Quân',
    textId: 'widget.data.activity.transferred',
    metaId: 'widget.data.time.min2',
    presence: 'busy',
    color: 'info'
  },
  {
    id: 'an',
    name: 'Lê Hoài An',
    textId: 'widget.data.activity.signedIn',
    metaId: 'widget.data.time.day1',
    presence: 'away',
    color: 'success'
  },
  {
    id: 'bao',
    name: 'Phạm Gia Bảo',
    textId: 'widget.data.activity.greeting',
    metaId: 'widget.data.time.week3',
    presence: 'offline',
    color: 'warning'
  }
];

// --- Assigned work ----------------------------------------------------------
// Mantis paints its highest priority green and its lowest red. The five fills
// are kept; the scale is turned the right way up.

export const ASSIGNMENT_ROWS = [
  {
    id: 'ivr',
    name: 'Nguyễn Thu Hà',
    roleId: 'widget.data.role.supportLead',
    subjectId: 'widget.data.task.ivr',
    due: '2026-06-26',
    priorityId: 'widget.data.priority.medium',
    priorityTone: 'primary'
  },
  {
    id: 'sbc',
    name: 'Trần Minh Quân',
    roleId: 'widget.data.role.pbxEngineer',
    subjectId: 'widget.data.task.sbc',
    due: '2026-03-31',
    priorityId: 'widget.data.priority.highest',
    priorityTone: 'error'
  },
  {
    id: 'contacts',
    name: 'Lê Hoài An',
    roleId: 'widget.data.role.customerCare',
    subjectId: 'widget.data.task.contacts',
    due: '2026-08-02',
    priorityId: 'widget.data.priority.low',
    priorityTone: 'info'
  },
  {
    id: 'sip',
    name: 'Phạm Gia Bảo',
    roleId: 'widget.data.role.sysadmin',
    subjectId: 'widget.data.task.sip',
    due: '2026-09-22',
    priorityId: 'widget.data.priority.high',
    priorityTone: 'warning'
  },
  {
    id: 'queue',
    name: 'Đỗ Khánh Linh',
    roleId: 'widget.data.role.teamLead',
    subjectId: 'widget.data.task.queue',
    due: '2026-09-22',
    priorityId: 'widget.data.priority.lowest',
    priorityTone: 'success'
  }
];

// --- Service revenue --------------------------------------------------------
// The eight rows are this week's charges and they sum to the week figure printed
// above them. Yesterday's figure is the newest row.

export const CHARGE_ROWS = [
  { id: '2136', nameId: 'widget.data.service.minutes', amount: 926000 },
  { id: '2546', nameId: 'widget.data.service.hotline', amount: 485000 },
  { id: '2681', nameId: 'widget.data.service.extension', amount: 786000 },
  { id: '2756', nameId: 'widget.data.service.storage', amount: 563000 },
  { id: '8765', nameId: 'widget.data.service.ipPhone', amount: 769000 },
  { id: '3652', nameId: 'widget.data.service.headset', amount: 754000 },
  { id: '7456', nameId: 'widget.data.service.trunk', amount: 743000 },
  { id: '6502', nameId: 'widget.data.service.sms', amount: 642000 }
];

export const CHARGE_TOTALS = {
  month: 20569000,
  yesterday: CHARGE_ROWS[0].amount,
  week: CHARGE_ROWS.reduce((total, row) => total + row.amount, 0)
};

// --- Task log ---------------------------------------------------------------

export const TASK_ROWS = [
  { id: 'traffic', time: '8:50', textId: 'widget.data.tasklog.traffic', color: 'success' },
  { id: 'script', timeId: 'widget.data.date.mar05', textId: 'widget.data.tasklog.script', color: 'primary' },
  { id: 'assign', timeId: 'widget.data.date.feb17', textId: 'widget.data.tasklog.assign', color: 'error' },
  { id: 'contacts', timeId: 'widget.data.date.mar18', textId: 'widget.data.tasklog.contacts', color: 'warning' },
  { id: 'test', timeId: 'widget.data.date.mar22', textId: 'widget.data.tasklog.test', color: 'success' }
];

// --- Revenue by plan --------------------------------------------------------
// seats x unit price = total, on every row.

export const PLAN_ROWS = [
  { id: 'enterprise', nameId: 'widget.data.plan.enterprise', descriptionId: 'widget.data.plan.enterprise.note', seats: 132, price: 119000 },
  { id: 'standard', nameId: 'widget.data.plan.standard', descriptionId: 'widget.data.plan.standard.note', seats: 210, price: 59000 },
  { id: 'callcenter', nameId: 'widget.data.plan.callcenter', descriptionId: 'widget.data.plan.callcenter.note', seats: 24, price: 249000 },
  { id: 'starter', nameId: 'widget.data.plan.starter', descriptionId: 'widget.data.plan.starter.note', seats: 86, price: 39000 }
];

// --- Open tickets -----------------------------------------------------------

export const TICKET_QUEUE_ROWS = [
  {
    id: '1183',
    dueValue: 12,
    name: 'Trần Minh Quân',
    reference: '[#1183]',
    subjectId: 'widget.data.ticket.registration',
    detailId: 'widget.data.ticket.registration.note',
    color: 'primary'
  },
  {
    id: '1249',
    dueValue: 16,
    name: 'Lê Hoài An',
    reference: '[#1249]',
    subjectId: 'widget.data.ticket.audio',
    detailId: 'widget.data.ticket.audio.note',
    color: 'info'
  },
  {
    id: '1254',
    dueValue: 40,
    name: 'Đỗ Khánh Linh',
    reference: '[#1254]',
    subjectId: 'widget.data.ticket.queue',
    detailId: 'widget.data.ticket.queue.note',
    color: 'success'
  },
  {
    id: '1261',
    dueValue: 12,
    name: 'Phạm Gia Bảo',
    reference: '[#1261]',
    subjectId: 'widget.data.ticket.recording',
    detailId: 'widget.data.ticket.recording.note',
    color: 'warning'
  }
];

// --- New guides -------------------------------------------------------------

export const GUIDE_ROWS = [
  { id: 'queue', titleId: 'widget.data.guide.queue', timeId: 'widget.data.time.min14', color: 'primary' },
  { id: 'ivr', titleId: 'widget.data.guide.ivr', timeId: 'widget.data.time.hour2', color: 'warning' },
  { id: 'app', titleId: 'widget.data.guide.app', timeId: 'widget.data.time.day1', color: 'success' }
];

// --- Activity feed ----------------------------------------------------------

export const FEED_ROWS = [
  { id: 'pending', textId: 'widget.data.feed.pending', metaId: 'widget.data.time.now', color: 'primary' },
  { id: 'order', textId: 'widget.data.feed.order', metaId: 'widget.data.time.day1', color: 'error' },
  { id: 'unregistered', textId: 'widget.data.feed.unregistered', metaId: 'widget.data.time.week3', color: 'success' },
  { id: 'invoice', textId: 'widget.data.feed.invoice', metaId: 'widget.data.time.month1', color: 'primary' },
  { id: 'cancelled', textId: 'widget.data.feed.cancelled', metaId: 'widget.data.time.month2', color: 'warning' }
];

// --- Top calling regions ----------------------------------------------------
// The nine shares sum to 100.00.

export const REGION_ROWS = [
  { id: 'hanoi', code: '024', nameId: 'widget.data.region.hanoi', number: '024 7300 8686', share: 34.2, color: 'primary' },
  { id: 'hcm', code: '028', nameId: 'widget.data.region.hcm', number: '028 7300 8686', share: 28.6, color: 'info' },
  { id: 'danang', code: '0236', nameId: 'widget.data.region.danang', number: '0236 7300 868', share: 9.45, color: 'success' },
  { id: 'haiphong', code: '0225', nameId: 'widget.data.region.haiphong', number: '0225 7300 868', share: 6.8, color: 'warning' },
  { id: 'cantho', code: '0292', nameId: 'widget.data.region.cantho', number: '0292 7300 868', share: 5.1, color: 'error' },
  { id: 'binhduong', code: '0274', nameId: 'widget.data.region.binhduong', number: '0274 7300 868', share: 4.6, color: 'primary' },
  { id: 'dongnai', code: '0251', nameId: 'widget.data.region.dongnai', number: '0251 7300 868', share: 3.9, color: 'info' },
  { id: 'khanhhoa', code: '0258', nameId: 'widget.data.region.khanhhoa', number: '0258 7300 868', share: 3.55, color: 'success' },
  { id: 'other', code: '···', nameId: 'widget.data.region.other', number: '—', share: 3.8, color: 'secondary' }
];

// --- Recent orders ----------------------------------------------------------

export const ORDER_ROWS = [
  {
    id: '81412314',
    customer: 'Nguyễn Thu Hà',
    reference: '#81412314',
    productId: 'widget.data.product.ipPhone',
    quantity: 10,
    date: '2026-02-17',
    statusId: 'widget.data.status.pending',
    statusTone: 'warning',
    color: 'primary'
  },
  {
    id: '68457898',
    customer: 'Trần Minh Quân',
    reference: '#68457898',
    productId: 'widget.data.product.headset',
    quantity: 16,
    date: '2026-02-20',
    statusId: 'widget.data.status.paid',
    statusTone: 'primary',
    color: 'info'
  },
  {
    id: '45457898',
    customer: 'Lê Hoài An',
    reference: '#45457898',
    productId: 'widget.data.product.dect',
    quantity: 20,
    date: '2026-02-17',
    statusId: 'widget.data.status.done',
    statusTone: 'success',
    color: 'success'
  },
  {
    id: '62446232',
    customer: 'Phạm Gia Bảo',
    reference: '#62446232',
    productId: 'widget.data.product.gateway',
    quantity: 15,
    date: '2026-04-25',
    statusId: 'widget.data.status.failed',
    statusTone: 'error',
    color: 'error'
  }
];

// --- Incoming requests ------------------------------------------------------

export const REQUEST_ROWS = [
  { id: 'callback', textId: 'widget.data.request.callback', color: 'success' },
  { id: 'porting', textId: 'widget.data.request.porting', color: 'error' },
  { id: 'extension', textId: 'widget.data.request.extension', color: 'warning' },
  { id: 'device', textId: 'widget.data.request.device', color: 'primary' },
  { id: 'quota', textId: 'widget.data.request.quota', color: 'success' },
  { id: 'invoice', textId: 'widget.data.request.invoice', color: 'primary' },
  { id: 'recording', textId: 'widget.data.request.recording', color: 'warning' }
];

// --- Traffic change ---------------------------------------------------------
// Minutes against the same window last month. Up is more traffic, which is why
// up is the green one; nothing on this card is money.

export const TRAFFIC_ROWS = [
  { id: 'internal', labelId: 'widget.data.direction.internal', minutes: 1458 },
  { id: 'mobile', labelId: 'widget.data.direction.mobile', minutes: -636 },
  { id: 'landline', labelId: 'widget.data.direction.landline', minutes: 458 },
  { id: 'international', labelId: 'widget.data.direction.international', minutes: -56 },
  { id: 'hotline', labelId: 'widget.data.direction.hotline', minutes: 1204 },
  { id: 'ivr', labelId: 'widget.data.direction.ivr', minutes: -312 },
  { id: 'app', labelId: 'widget.data.direction.app', minutes: 842 },
  { id: 'webphone', labelId: 'widget.data.direction.webphone', minutes: -128 }
];

// --- New contacts -----------------------------------------------------------

export const CONTACT_ROWS = [
  { id: 'mai', name: 'Vũ Thanh Mai', noteId: 'widget.data.note.thanks', presence: 'available', color: 'primary' },
  { id: 'huy', name: 'Ngô Đức Huy', noteId: 'widget.data.note.callback', presence: 'available', color: 'info' },
  { id: 'trang', name: 'Bùi Thu Trang', noteId: 'widget.data.note.quote', metaId: 'widget.data.time.min10', color: 'success' },
  { id: 'nam', name: 'Đặng Hoài Nam', noteId: 'widget.data.note.thanks', metaId: 'widget.data.time.min30', color: 'warning' },
  { id: 'linh', name: 'Hoàng Mỹ Linh', noteId: 'widget.data.note.demo', metaId: 'widget.data.time.hour1', color: 'error' },
  { id: 'son', name: 'Lý Trường Sơn', noteId: 'widget.data.note.callback', metaId: 'widget.data.time.hour2', color: 'primary' },
  { id: 'yen', name: 'Chu Hải Yến', noteId: 'widget.data.note.quote', metaId: 'widget.data.time.day1', color: 'info' }
];

// --- Recent tickets ---------------------------------------------------------

export const TICKET_STATUS_ROWS = [
  {
    id: 't1',
    subjectId: 'widget.data.support.outage',
    deptId: 'widget.data.dept.support',
    timeId: 'widget.data.date.today0200',
    statusId: 'widget.data.state.open'
  },
  {
    id: 't2',
    subjectId: 'widget.data.support.server',
    deptId: 'widget.data.dept.technical',
    timeId: 'widget.data.time.yesterday',
    statusId: 'widget.data.state.progress'
  },
  {
    id: 't3',
    subjectId: 'widget.data.support.keys',
    deptId: 'widget.data.dept.technical',
    timeId: 'widget.data.date.aug27',
    statusId: 'widget.data.state.closed'
  },
  {
    id: 't4',
    subjectId: 'widget.data.support.reset',
    deptId: 'widget.data.dept.support',
    timeId: 'widget.data.date.today0900',
    statusId: 'widget.data.state.open'
  },
  {
    id: 't5',
    subjectId: 'widget.data.support.invoice',
    deptId: 'widget.data.dept.billing',
    timeId: 'widget.data.time.yesterday',
    statusId: 'widget.data.state.progress'
  },
  {
    id: 't6',
    subjectId: 'widget.data.support.porting',
    deptId: 'widget.data.dept.billing',
    timeId: 'widget.data.date.aug27',
    statusId: 'widget.data.state.closed'
  },
  {
    id: 't7',
    subjectId: 'widget.data.support.quality',
    deptId: 'widget.data.dept.technical',
    timeId: 'widget.data.date.today0900',
    statusId: 'widget.data.state.open'
  },
  {
    id: 't8',
    subjectId: 'widget.data.support.training',
    deptId: 'widget.data.dept.support',
    timeId: 'widget.data.date.aug27',
    statusId: 'widget.data.state.closed'
  }
];
