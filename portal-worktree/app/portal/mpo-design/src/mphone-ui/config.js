export const PORTAL_BASE_PATH = import.meta.env.VITE_APP_BASE_NAME || '/p-next/';
export const DATA_PROVIDER = import.meta.env.VITE_DATA_PROVIDER || 'mock';

export const SESSION_URL = '/app/portal/service/session.php';
export const IDENTITY_URL = '/app/portal/service/identity.php';
export const DASHBOARD_URL = '/app/portal/service/dashboard.php';
export const SETTINGS_URL = '/app/portal/service/settings.php';
export const MISSED_CALLS_URL = '/app/portal/service/missed_calls.php';

export const DASHBOARD_REFRESH_INTERVAL = 60000;
export const EXTENSIONS_REFRESH_INTERVAL = 30000;
