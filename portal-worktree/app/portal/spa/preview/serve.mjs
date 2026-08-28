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
  permissions: { call_history: true, recordings: true, reports: true, contacts: true, missed_calls: true, settings: true },
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

const html = fs.readFileSync(PAGE);

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];

  // the portal's PHP endpoints: a session that lets the app render, and an empty
  // payload for every data call so each page falls into its own empty state
  if (url.startsWith('/app/portal/service/')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    if (url.includes('session.php')) return res.end(JSON.stringify(SESSION));
    if (url.includes('account.php')) return res.end(JSON.stringify(ACCOUNT));
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
