// Offline cache for the vendor mock API.
//
// The original Mantis 4.2.0 reads its data from CodedThemes' public mock API
// (VITE_APP_API_URL). That is the source of truth here and nothing is
// reconstructed. This module only keeps a copy of what that API already
// answered, so the lab still renders when the machine is offline or the host
// is unreachable.
//
// Two layers, in order:
//   1. localStorage — every successful GET is remembered verbatim.
//   2. SEED — one payload captured from the vendor API on 2026-09-02, for the
//      sidebar, so a cold start with no network still shows the real menu
//      (including the Components entry, which lives only in the API response).

const PREFIX = 'mantis-offline:';

// Captured verbatim from https://mock-data-api-nextjs.vercel.app/api/menu/dashboard
const SEED = {
  'api/menu/dashboard': {
    dashboard: {
      id: 'group-dashboard',
      title: 'dashboard',
      type: 'group',
      icon: 'dashboard',
      children: [
        {
          id: 'dashboard',
          title: 'dashboard',
          type: 'collapse',
          icon: 'dashboard',
          children: [
            { id: 'default', title: 'default', type: 'item', url: '/dashboard/default', breadcrumbs: false },
            { id: 'analytics', title: 'analytics', type: 'item', url: '/dashboard/analytics', breadcrumbs: false }
          ]
        },
        {
          id: 'components',
          title: 'components',
          type: 'item',
          url: '/components-overview',
          icon: 'components',
          target: true,
          chip: { label: 'new', color: 'primary', size: 'small', variant: 'combined' }
        }
      ]
    }
  }
};

function key(url) {
  return PREFIX + String(url).replace(/^\/+/, '');
}

export function remember(url, data) {
  if (data === undefined) return;
  try {
    localStorage.setItem(key(url), JSON.stringify(data));
  } catch {
    // storage full, disabled, or a private window — the cache is optional
  }
}

export function recall(url) {
  try {
    const hit = localStorage.getItem(key(url));
    if (hit) return JSON.parse(hit);
  } catch {
    // unreadable entry — fall through to the seed
  }
  return SEED[String(url).replace(/^\/+/, '')];
}

// A request that never reached the server: no response, or a gateway-class status.
export function isOffline(error) {
  const status = error?.response?.status;
  return status === undefined || status === 0 || status === 502 || status === 503 || status === 504;
}
