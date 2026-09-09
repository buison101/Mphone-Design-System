export const IS_PORTAL_TARGET = import.meta.env.VITE_APP_TARGET === 'portal';

export function isMphoneUiWorkspace(pathname) {
  return IS_PORTAL_TARGET || pathname === '/mphone-ui' || pathname.startsWith('/mphone-ui/');
}

export function mphoneUiRoute(path = '') {
  const normalized = path === '' ? '' : `/${path.replace(/^\/+/, '')}`;
  return IS_PORTAL_TARGET ? normalized || '/dashboard' : `/mphone-ui${normalized}`;
}
