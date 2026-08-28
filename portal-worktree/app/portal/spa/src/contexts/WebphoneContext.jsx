import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// project imports
import IncomingCallDialog from 'components/webphone/IncomingCallDialog';
import useSession from 'hooks/useSession';
import { WEBPHONE_URL } from 'config';

// ==============================|| WEBPHONE CONTEXT ||============================== //
//
// One call for the whole portal. A softphone mounted per page would let two
// screens each hold a session, and a reader who navigated away mid-call would
// lose it — so registration and the current call live here and every surface
// reads the same state.
//
// Two drivers behind one shape. When the server exposes SIP credentials the
// context loads SIP.js and talks to the PBX; when it does not, it runs a demo
// that walks the same states on timers so the UI stays reviewable. `mode` says
// which is running and the UI shows it, because a fake call that looks real is
// the worst thing this file could produce.
//
// The remote audio element is created once, here. Media has to outlive any
// single page for a call to survive navigation.

export const WebphoneContext = createContext(undefined);

const DIAL_MS = 900;
const RING_MS = 2600;

export function WebphoneProvider({ children }) {
  const { session } = useSession();
  // whichever extension the portal signed in as; the server decides which one
  // the SIP credentials belong to
  const extension = session?.user?.extension || session?.user?.extensions?.[0] || '';
  const [mode, setMode] = useState('demo');
  const [registration, setRegistration] = useState('connecting');
  const [number, setNumber] = useState('');
  const [call, setCall] = useState(null);
  const sip = useRef(null);
  const audio = useRef(null);
  const timers = useRef([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  // one audio sink for the life of the session
  useEffect(() => {
    const element = document.createElement('audio');
    element.autoplay = true;
    element.setAttribute('data-webphone', 'remote');
    document.body.appendChild(element);
    audio.current = element;
    return () => {
      element.srcObject = null;
      element.remove();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      let config = null;
      try {
        const response = await fetch(WEBPHONE_URL, { credentials: 'same-origin', headers: { Accept: 'application/json' } });
        if (response.ok) {
          const payload = await response.json();
          if (payload?.available && payload.server && payload.username) config = payload;
        }
      } catch {
        // no endpoint yet: the demo driver below is the intended fallback
      }

      if (cancelled) return;

      if (!config) {
        setMode('demo');
        const timer = setTimeout(() => setRegistration('registered'), 600);
        timers.current.push(timer);
        return;
      }

      // the SIP stack is only fetched when it is actually going to be used
      const { default: SipSession } = await import('sections/webphone/sipSession');
      if (cancelled) return;

      setMode('sip');
      const session = new SipSession({
        config,
        audioElement: audio.current,
        on: (event) => {
          if (event.registration) setRegistration(event.registration);
          if ('call' in event) setCall(event.call);
          if (event.callState) setCall((current) => (current ? { ...current, state: event.callState } : current));
          if (event.answeredAt) setCall((current) => (current ? { ...current, answeredAt: event.answeredAt } : current));
          if (event.callName) setCall((current) => (current ? { ...current, name: event.callName } : current));
          if ('muted' in event) setCall((current) => (current ? { ...current, muted: event.muted } : current));
        }
      });
      sip.current = session;
      session.start();
    }

    boot();

    return () => {
      cancelled = true;
      clearTimers();
      sip.current?.stop();
      sip.current = null;
    };
  }, [clearTimers]);

  const dial = useCallback(
    (target, name) => {
      const dialled = String(target || '').trim();
      if (!dialled) return;
      if (sip.current) {
        sip.current.dial(dialled, name);
        return;
      }
      clearTimers();
      setCall({ number: dialled, name, direction: 'outbound', state: 'dialing', muted: false });
      timers.current.push(setTimeout(() => setCall((current) => (current ? { ...current, state: 'ringing' } : current)), DIAL_MS));
      timers.current.push(
        setTimeout(
          () => setCall((current) => (current ? { ...current, state: 'active', answeredAt: new Date().toISOString() } : current)),
          RING_MS
        )
      );
    },
    [clearTimers]
  );

  const hangup = useCallback(() => {
    if (sip.current) sip.current.hangup();
    clearTimers();
    setCall(null);
    setNumber('');
  }, [clearTimers]);

  const answer = useCallback(() => {
    if (sip.current) {
      sip.current.answer();
      return;
    }
    setCall((current) => (current ? { ...current, state: 'active', answeredAt: new Date().toISOString() } : current));
  }, []);

  const reject = useCallback(() => {
    if (sip.current) sip.current.reject();
    setCall(null);
  }, []);

  const toggleMute = useCallback(() => {
    setCall((current) => {
      if (!current) return current;
      const muted = !current.muted;
      sip.current?.setMuted(muted);
      return { ...current, muted };
    });
  }, []);

  const toggleHold = useCallback(() => {
    setCall((current) => {
      if (!current) return current;
      const held = current.state !== 'held';
      sip.current?.setHold(held);
      return { ...current, state: held ? 'held' : 'active' };
    });
  }, []);

  const sendDigit = useCallback((digit) => sip.current?.sendDigit(digit), []);

  // A demo call that says nothing about being a demo would be a lie the first
  // time someone showed this to a customer.
  const value = useMemo(
    () => ({
      mode,
      simulated: mode === 'demo',
      registration,
      extension,
      number,
      setNumber,
      call,
      incoming: call?.state === 'incoming' ? call : null,
      dial,
      answer,
      reject,
      hangup,
      toggleMute,
      toggleHold,
      sendDigit
    }),
    [mode, registration, extension, number, call, dial, answer, reject, hangup, toggleMute, toggleHold, sendDigit]
  );

  return (
    <WebphoneContext.Provider value={value}>
      {children}
      {/* the ringing dialog lives with the session, not with a page, so a call
          reaches the reader wherever they happen to be */}
      <IncomingCallDialog call={value.incoming} onAnswer={answer} onReject={reject} />
    </WebphoneContext.Provider>
  );
}

WebphoneProvider.propTypes = { children: PropTypes.node };
