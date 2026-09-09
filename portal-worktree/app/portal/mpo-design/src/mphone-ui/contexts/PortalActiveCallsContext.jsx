import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import WebsocketClient from '../lib/websocket-client';
import usePortalSession from '../hooks/usePortalSession';

export const PortalActiveCallsContext = createContext(undefined);

const CALL_EVENTS = ['CHANNEL_CREATE', 'CHANNEL_CALLSTATE', 'CHANNEL_EXECUTE', 'CALL_UPDATE', 'CHANNEL_DESTROY'];

function normalizeState(call, fromRequest) {
  const state = String(call.answer_state ?? '').toLowerCase();
  return state === 'ringing' && fromRequest ? 'answered' : state;
}

function deriveDirection(call, previous) {
  const applicationData = call.application_data ?? '';
  if (applicationData === 'app.lua voicemail') return 'voicemail';
  if (applicationData === 'call_direction=outbound') return 'outbound';
  if (applicationData === 'call_direction=inbound') return 'inbound';
  if (applicationData === 'call_direction=local') return 'local';
  if (call.variable_user_exists === 'true' && call.variable_from_user_exists === 'true') return 'local';
  if ((call.other_leg_rdnis ?? '') !== '') return 'inbound';
  return call.variable_call_direction || call.call_direction || previous?.direction || '';
}

export function PortalActiveCallsProvider({ children }) {
  const { session } = usePortalSession();
  const [calls, setCalls] = useState(() => new Map());
  const [status, setStatus] = useState('idle');
  const clientRef = useRef(null);

  const applyEvent = useCallback((topic, payload) => {
    if (!CALL_EVENTS.includes(topic) || !payload.unique_id) return;
    const fromRequest = payload.__from_request === true;
    const state = normalizeState(payload, fromRequest);

    setCalls((current) => {
      const next = new Map(current);
      if (topic === 'CHANNEL_DESTROY' || state === 'hangup') {
        next.delete(payload.unique_id);
        return next;
      }
      const previous = next.get(payload.unique_id);
      next.set(payload.unique_id, {
        ...previous,
        ...payload,
        unique_id: payload.unique_id,
        answer_state: state || previous?.answer_state || '',
        direction: deriveDirection(payload, previous),
        created_time: previous?.created_time ?? Number(payload.caller_channel_created_time ?? 0)
      });
      return next;
    });
  }, []);

  useEffect(() => {
    if (!session?.websocket) return undefined;
    const client = new WebsocketClient({
      url: session.websocket.url,
      token: session.websocket.token,
      onStatus: setStatus,
      onEvent: applyEvent,
      onAuthenticated: () => {
        setStatus('subscribed');
        client.request('active.calls', 'in.progress').catch(() => setStatus('error'));
      },
      onTokenRejected: () => setStatus('unauthorized')
    });
    clientRef.current = client;
    client.connect();
    return () => {
      client.close();
      clientRef.current = null;
      setCalls(new Map());
    };
  }, [applyEvent, session]);

  const hangup = useCallback((uniqueId) => {
    const client = clientRef.current;
    if (!client) return Promise.reject(new Error('not connected'));
    return client.request('active.calls', 'hangup', { unique_id: uniqueId });
  }, []);

  const list = useMemo(() => Array.from(calls.values()).sort((a, b) => (b.created_time || 0) - (a.created_time || 0)), [calls]);
  const value = useMemo(() => ({ calls: list, status, hangup }), [list, status, hangup]);
  return <PortalActiveCallsContext.Provider value={value}>{children}</PortalActiveCallsContext.Provider>;
}

PortalActiveCallsProvider.propTypes = {
  children: PropTypes.node
};
