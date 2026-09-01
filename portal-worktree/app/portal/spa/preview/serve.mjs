// ==============================|| PREVIEW SERVER ||============================== //
//
// Serves portal.html with a stubbed portal session, so the whole app can be
// opened on this machine with no FusionPBX, no PHP and no network.
//
//   npm run preview:open
//
// Node 18+, no dependencies. Every route under /p/ returns the same document and
// the router takes it from there.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PAGE = path.join(import.meta.dirname, 'portal.html');
const PORT = Number(process.env.PORT || 4321);
const ROUTE = process.env.ROUTE || '/p/dashboard/analytics';

if (!fs.existsSync(PAGE)) {
  console.error('portal.html is missing. Build it first:  npm run preview:build');
  process.exit(1);
}

// Enough of a session for the app to get past its gate. Nothing here reaches a
// real server, so the values only have to be the right shape.
const SESSION = {
  csrf: 'preview',
  user: { name: 'Người xem thử', email: 'preview@example.vn', extension: '1001', extensions: ['1001'], admin: false },
  // the keys session.php actually exposes, so the pages that branch on a
  // permission take the same path here as they do on a real server
  permissions: {
    call_history: true,
    recordings: true,
    reports: true,
    contacts: true,
    missed_calls: true,
    settings: true,
    contact_view: true,
    contact_domain_view: true,
    click_to_call_view: true,
    click_to_call_call: true,
    extension_view: true
  },
  branding: { name: 'Mphone' },
  domain: { domain_name: 'thaison.mphone.vn' },
  // Account renders its identity-required gate without this, which hides the
  // page the reviewer came to look at
  identity: {
    primary_email: 'preview@example.vn',
    email_verified_at: '2026-08-01T09:00:00Z'
  },
  customer: { display_name: 'Khách hàng xem thử' }
};

// account.php has its own shape, and an empty payload would leave the Account
// page showing four dashes and no devices — the one page whose whole point is
// the data. Ended sessions and an unmanaged extension are included so the
// history toggle and the outlined permission chip both have something to draw.
const now = Date.now();
const ago = (minutes) => new Date(now - minutes * 60000).toISOString();

const ACCOUNT = {
  identity: { primary_email: 'preview@example.vn', email_verified_at: ago(60 * 24 * 30) },
  customer: { display_name: 'Công ty Thái Sơn' },
  membership: { role: 'Quản trị viên' },
  extensions: [
    { extension_uuid: 'e1', extension: '1001', display_name: 'Nguyễn Thu Hà', can_use: true, can_manage: true },
    { extension_uuid: 'e2', extension: '1014', display_name: 'Tổng đài chăm sóc khách hàng', can_use: true, can_manage: false }
  ],
  devices: [
    {
      session_id: 's1',
      device_name: 'Chrome trên Windows',
      client_type: 'web',
      app_version: '2.1.0',
      current: true,
      created_at: ago(90),
      last_seen_at: ago(1),
      expires_at: ago(-60 * 24 * 14)
    },
    {
      session_id: 's2',
      device_name: 'Mphone iPhone 15',
      client_type: 'ios',
      app_version: '1.8.2',
      current: false,
      created_at: ago(60 * 24 * 3),
      last_seen_at: ago(140),
      expires_at: ago(-60 * 24 * 10)
    },
    {
      session_id: 's3',
      device_name: 'Máy bàn lễ tân',
      client_type: 'desktop',
      app_version: '1.7.0',
      current: false,
      created_at: ago(60 * 24 * 21),
      last_seen_at: ago(60 * 24 * 9),
      revoked_at: ago(60 * 24 * 8)
    }
  ]
};

// dashboard.php drives the default Overview. An empty payload would show every
// empty state at once, which is a legitimate screen but not the one a reviewer
// opened the page to see.
const hours = Array.from({ length: 24 }, (_, index) => {
  const base = index >= 8 && index <= 18 ? 26 : 6;
  return {
    bucket: new Date(now - (23 - index) * 3600000).toISOString(),
    answered: Math.round(base + Math.sin(index / 2) * 8),
    missed: Math.max(0, Math.round(base / 8 + Math.cos(index / 3) * 2)),
    unconnected: Math.max(0, Math.round(base / 12 + Math.sin(index / 4) * 2))
  };
});

const DASHBOARD = {
  available: true,
  scope: 'domain',
  totals: {
    calls: 486,
    answered: 412,
    missed: 41,
    unconnected: 33,
    inbound: 268,
    outbound: 218,
    talk_seconds: 41520,
    average_talk_seconds: 101,
    answer_rate: 91.8
  },
  statuses: { answered: 412, missed: 41, no_answer: 18, busy: 9, voicemail: 4, cancelled: 2 },
  hourly: hours,
  recent: [
    {
      uuid: 'r1',
      start_stamp: ago(4),
      caller_id_name: 'Nguyễn Văn Bình',
      caller_id_number: '0903118224',
      destination_number: '1001',
      status: 'answered',
      billsec: 214
    },
    {
      uuid: 'r2',
      start_stamp: ago(9),
      caller_id_name: '',
      caller_id_number: '0288776512',
      destination_number: '1014',
      status: 'missed',
      billsec: 0
    },
    {
      uuid: 'r3',
      start_stamp: ago(16),
      caller_id_name: 'Công ty Thái Sơn',
      caller_id_number: '0243556118',
      destination_number: '1007',
      status: 'answered',
      billsec: 486
    },
    {
      uuid: 'r4',
      start_stamp: ago(22),
      caller_id_name: 'Lê Thị Mai',
      caller_id_number: '0912445003',
      destination_number: '1022',
      status: 'voicemail',
      billsec: 38
    },
    {
      uuid: 'r5',
      start_stamp: ago(35),
      caller_id_name: '',
      caller_id_number: '0356774991',
      destination_number: '1001',
      status: 'busy',
      billsec: 0
    },
    {
      uuid: 'r6',
      start_stamp: ago(48),
      caller_id_name: 'Trần Quốc Huy',
      caller_id_number: '0987220641',
      destination_number: '1030',
      status: 'answered',
      billsec: 122
    }
  ]
};

// contacts.php drives Customer > Cards and the Contacts list. An empty payload
// leaves both at their empty state, which hides the screens a reviewer opened
// them to see. The shape is the endpoint's own: name, title, organization, type
// and the contact's numbers, primary first, plus the extensions a call could be
// placed from and whether this identity may place one.
const CONTACT_SEED = [
  [
    'Nguyễn Thu Hà',
    'Trưởng phòng mua hàng',
    'Công ty CP Thương mại Bình Minh',
    'customer',
    [
      ['work', '024 3736 8686', '1201', true],
      ['mobile', '0912 345 678', '', false]
    ]
  ],
  [
    'Trần Minh Quân',
    'Giám đốc kỹ thuật',
    'Công ty TNHH Giải pháp Sao Việt',
    'partner',
    [
      ['work', '028 3820 1188', '2105', true],
      ['mobile', '0908 221 344', '', false],
      ['fax', '028 3820 1189', '', false]
    ]
  ],
  ['Lê Hoài An', 'Chuyên viên chăm sóc khách hàng', 'Công ty CP Dịch vụ Thái Sơn', 'customer', [['work', '024 3200 4567', '1408', true]]],
  [
    'Phạm Gia Bảo',
    'Quản trị hệ thống',
    'Trung tâm Dữ liệu Miền Bắc',
    'vendor',
    [
      ['work', '024 7300 8686', '3011', true],
      ['mobile', '0987 654 321', '', false]
    ]
  ],
  [
    'Đỗ Khánh Linh',
    'Trưởng nhóm hỗ trợ',
    'Công ty CP Thương mại Bình Minh',
    'customer',
    [
      ['mobile', '0903 456 789', '', true],
      ['work', '024 3736 8688', '1207', false]
    ]
  ],
  ['Vũ Thanh Mai', 'Kế toán trưởng', 'Công ty TNHH Nam Phong', 'customer', [['work', '0236 3820 456', '', true]]],
  ['Ngô Đức Huy', 'Nhân viên kinh doanh', 'Công ty CP Vận tải Đại Dương', 'lead', [['mobile', '0938 112 233', '', true]]],
  [
    'Bùi Thu Trang',
    'Giám đốc điều hành',
    'Công ty TNHH Thiết bị Hoàng Gia',
    'partner',
    [
      ['work', '028 7300 1234', '4002', true],
      ['mobile', '0977 445 566', '', false]
    ]
  ],
  ['Đặng Hoài Nam', 'Kỹ thuật viên tổng đài', 'Mphone', 'employee', [['work', '1900 1080', '1001', true]]],
  [
    'Hoàng Mỹ Linh',
    'Trợ lý giám đốc',
    'Công ty CP Xây dựng Tân Á',
    'customer',
    [
      ['work', '024 3555 7788', '1502', true],
      ['home', '024 3555 7789', '', false]
    ]
  ],
  [
    'Lý Trường Sơn',
    'Trưởng bộ phận IT',
    'Ngân hàng TMCP Đông Hải',
    'customer',
    [
      ['work', '028 3911 2345', '6120', true],
      ['mobile', '0913 888 999', '', false]
    ]
  ],
  ['Chu Hải Yến', 'Nhân viên lễ tân', 'Khách sạn Biển Ngọc', 'customer', [['work', '0258 3567 890', '', true]]],
  ['Tạ Quang Dũng', 'Giám sát kho', 'Công ty CP Vận tải Đại Dương', 'customer', [['mobile', '0965 334 221', '', true]]],
  ['Mai Phương Thảo', 'Chuyên viên nhân sự', 'Công ty TNHH Nam Phong', 'customer', [['work', '0236 3820 458', '', true]]],
  ['Trịnh Văn Kiên', 'Kỹ sư hạ tầng', 'Trung tâm Dữ liệu Miền Bắc', 'vendor', [['work', '024 7300 8690', '3015', true]]],
  ['Nguyễn Bảo Châu', 'Nhân viên bán hàng', 'Công ty TNHH Thiết bị Hoàng Gia', 'lead', [['mobile', '0906 778 899', '', true]]],
  [
    'Phan Đình Long',
    'Trưởng chi nhánh',
    'Ngân hàng TMCP Đông Hải',
    'customer',
    [
      ['work', '028 3911 2400', '6200', true],
      ['mobile', '0918 246 800', '', false]
    ]
  ],
  ['Lâm Ngọc Anh', 'Điều phối viên', 'Công ty CP Dịch vụ Thái Sơn', 'customer', [['work', '024 3200 4570', '1412', true]]],
  ['Hồ Việt Anh', 'Quản lý dự án', 'Công ty TNHH Giải pháp Sao Việt', 'partner', [['work', '028 3820 1190', '2110', true]]],
  ['Dương Thuỳ Dung', 'Chuyên viên marketing', 'Công ty CP Xây dựng Tân Á', 'customer', [['mobile', '0949 335 771', '', true]]],
  ['Cao Minh Tuấn', 'Nhân viên kỹ thuật', 'Mphone', 'employee', [['work', '1900 1081', '1015', true]]],
  ['Đinh Thị Hạnh', 'Thu ngân', 'Khách sạn Biển Ngọc', 'customer', [['work', '0258 3567 895', '', true]]],
  [
    'Nguyễn Hữu Phước',
    'Giám đốc kinh doanh',
    'Công ty CP Thương mại Bình Minh',
    'customer',
    [
      ['work', '024 3736 8700', '1210', true],
      ['mobile', '0902 133 557', '', false]
    ]
  ],
  ['Trương Gia Hân', 'Trợ lý kỹ thuật', 'Công ty TNHH Nam Phong', 'lead', [['mobile', '0925 668 114', '', true]]]
];

const CONTACTS = CONTACT_SEED.map(([name, title, organization, type, phones], index) => ({
  uuid: `contact-${index + 1}`,
  name,
  title,
  organization,
  type,
  phones: phones.map(([label, number, extension, primary]) => ({ label, number, extension, primary }))
}));

const CONTACT_EXTENSIONS = [
  { extension_uuid: 'e1', extension: '1001', effective_caller_id_name: 'Nguyễn Thu Hà' },
  { extension_uuid: 'e2', extension: '1014', effective_caller_id_name: 'Tổng đài chăm sóc khách hàng' }
];

function contactsPayload(rawUrl) {
  const query = new URLSearchParams(rawUrl.split('?')[1] || '');
  const needle = (query.get('q') || '').trim().toLowerCase();
  const size = [20, 50, 100].includes(Number(query.get('page_size'))) ? Number(query.get('page_size')) : 20;
  const matched = needle
    ? CONTACTS.filter((contact) =>
        [contact.name, contact.organization, ...contact.phones.map((phone) => phone.number)].join(' ').toLowerCase().includes(needle)
      )
    : CONTACTS;
  const pages = Math.max(1, Math.ceil(matched.length / size));
  const page = Math.min(Math.max(1, Number(query.get('page') || 1)), pages);
  return {
    available: true,
    scope: 'domain',
    page,
    page_size: size,
    pages,
    total: matched.length,
    contacts: matched.slice((page - 1) * size, page * size),
    extensions: CONTACT_EXTENSIONS,
    capabilities: { click_to_call: true }
  };
}

const html = fs.readFileSync(PAGE);

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];

  // the portal's PHP endpoints: a session that lets the app render, and an empty
  // payload for every data call so each page falls into its own empty state
  if (url.startsWith('/app/portal/service/')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    if (url.includes('session.php')) return res.end(JSON.stringify(SESSION));
    if (url.includes('account.php')) return res.end(JSON.stringify(ACCOUNT));
    if (url.includes('dashboard.php')) return res.end(JSON.stringify(DASHBOARD));
    if (url.includes('contacts.php')) return res.end(JSON.stringify(contactsPayload(req.url || '')));
    // click-to-call has no switch behind it here; the screen's success path is
    // worth reviewing and its failure paths are reachable from the real server
    if (url.includes('click_to_call.php')) return res.end(JSON.stringify({ accepted: true }));
    return res.end('{}');
  }

  if (url === '/favicon.ico') {
    res.writeHead(204);
    return res.end();
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(html);
});

function openBrowser(url) {
  const command =
    process.platform === 'win32'
      ? ['cmd', ['/c', 'start', '', url]]
      : process.platform === 'darwin'
        ? ['open', [url]]
        : ['xdg-open', [url]];
  try {
    spawn(command[0], command[1], { stdio: 'ignore', detached: true }).unref();
  } catch {
    // no desktop session, or no browser registered — the printed URL still works
  }
}

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is busy. Close what is using it, or:  set PORT=4322 && npm run preview:open`);
    process.exit(1);
  }
  throw error;
});

server.listen(PORT, () => {
  const base = `http://localhost:${PORT}`;
  console.log(`Portal preview   ${base}${ROUTE}`);
  console.log(`Sidebar reaches every route, including ${base}/p/design-system`);
  console.log('The session is stubbed and data endpoints return empty, so pages without sample data show their empty state.');
  console.log('Ctrl+C to stop.');
  if (!process.env.NO_OPEN) openBrowser(base + ROUTE);
});
