import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { IDENTITY_URL, SESSION_URL } from '../config';

export const PortalSessionContext = createContext(undefined);

const RENEW_MARGIN_SECONDS = 60;
const STAFF_HOSTS = new Set(['pbx.mphone.vn', 'fusionpbx']);

function applyFavicon(href) {
  if (!href) return;
  document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']").forEach((node) => node.remove());
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = href;
  document.head.appendChild(link);
}

export function PortalSessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const renewTimer = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(SESSION_URL, { credentials: 'same-origin', headers: { Accept: 'application/json' } });

      if (response.status === 401) {
        if (STAFF_HOSTS.has(window.location.hostname)) {
          const returnPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
          window.location.replace(`/?path=${encodeURIComponent(returnPath)}`);
          return null;
        }
        setSession(null);
        setError('unauthorized');
        return null;
      }

      if (response.status === 403) {
        setSession(null);
        setError('forbidden');
        return null;
      }

      if (!response.ok) {
        setSession(null);
        setError('unavailable');
        return null;
      }

      const nextSession = await response.json();
      applyFavicon(nextSession?.branding?.favicon);
      setSession(nextSession);
      setError(null);
      return nextSession;
    } catch {
      setSession(null);
      setError('unavailable');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (!session) return false;
    const response = await fetch(IDENTITY_URL, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': session.csrf || '' },
      body: JSON.stringify({ action: 'logout' })
    });
    setSession(null);
    setError('unauthorized');
    return response.ok;
  }, [session]);

  useEffect(() => {
    load();
    return () => {
      if (renewTimer.current) window.clearTimeout(renewTimer.current);
    };
  }, [load]);

  useEffect(() => {
    if (!session?.websocket?.expires_in) return undefined;
    const delay = Math.max(session.websocket.expires_in - RENEW_MARGIN_SECONDS, 30) * 1000;
    renewTimer.current = window.setTimeout(load, delay);
    return () => window.clearTimeout(renewTimer.current);
  }, [load, session]);

  const value = useMemo(
    () => ({
      session,
      loading,
      error,
      reload: load,
      logout,
      can: (permission) => Boolean(session?.permissions?.[permission])
    }),
    [error, load, loading, logout, session]
  );

  return <PortalSessionContext.Provider value={value}>{children}</PortalSessionContext.Provider>;
}

PortalSessionProvider.propTypes = {
  children: PropTypes.node
};
