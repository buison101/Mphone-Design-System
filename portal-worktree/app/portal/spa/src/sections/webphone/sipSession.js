// ==============================|| WEBPHONE - SIP SESSION ||============================== //
//
// A thin wrapper over SIP.js. Everything that knows the word "SIP" in this
// portal lives here; the context above it and the components below it deal only
// in plain state and callbacks.
//
// WARNING, read before trusting this file: it has never talked to a real
// FreeSWITCH. It is written from the SIP.js 0.21 API and the browser-phone
// reference in this repository, and it will need a session against the real PBX
// before anyone relies on it. The demo driver stays the default until the
// server exposes the credentials endpoint documented in
// docs/13-app-screen-map.md.
//
// Media is deliberately minimal: one <audio> element for the remote stream,
// created by the caller and handed in. No video, no device picker, no ringback
// generation — those are separate decisions and none of them belong in the
// transport.

import { UserAgent, Registerer, Inviter, SessionState, RegistererState } from 'sip.js';

function remoteStreamFrom(session) {
  const stream = new MediaStream();
  session.sessionDescriptionHandler?.peerConnection?.getReceivers()?.forEach((receiver) => {
    if (receiver.track) stream.addTrack(receiver.track);
  });
  return stream;
}

export default class SipSession {
  // `on` receives every state change as a plain object; the context turns it
  // into React state and never sees a SIP.js type.
  constructor({ config, audioElement, on }) {
    this.config = config;
    this.audio = audioElement;
    this.on = on || (() => {});
    this.ua = null;
    this.registerer = null;
    this.session = null;
  }

  async start() {
    const { server, username, password, realm } = this.config;
    const uri = UserAgent.makeURI(`sip:${username.includes('@') ? username : `${username}@${realm}`}`);
    if (!uri) {
      this.on({ registration: 'failed', error: 'invalid_uri' });
      return;
    }

    this.ua = new UserAgent({
      uri,
      authorizationUsername: username.split('@')[0],
      authorizationPassword: password,
      transportOptions: { server },
      sessionDescriptionHandlerFactoryOptions: {
        iceGatheringTimeout: 3000,
        peerConnectionConfiguration: {
          iceServers: [...(this.config.stun || []).map((urls) => ({ urls })), ...(this.config.turn || [])]
        }
      },
      delegate: {
        onInvite: (invitation) => this.attachSession(invitation, 'inbound')
      }
    });

    this.ua.transport.stateChange.addListener((state) => {
      if (state === 'Disconnected') this.on({ registration: 'unregistered' });
    });

    this.on({ registration: 'connecting' });

    try {
      await this.ua.start();
    } catch {
      this.on({ registration: 'failed', error: 'transport' });
      return;
    }

    this.registerer = new Registerer(this.ua);
    this.registerer.stateChange.addListener((state) => {
      if (state === RegistererState.Registered) this.on({ registration: 'registered' });
      if (state === RegistererState.Unregistered) this.on({ registration: 'unregistered' });
      if (state === RegistererState.Terminated) this.on({ registration: 'failed' });
    });

    try {
      await this.registerer.register();
    } catch {
      this.on({ registration: 'failed', error: 'register' });
    }
  }

  async stop() {
    try {
      await this.session?.bye?.();
    } catch {
      // the session may already be gone; stopping the agent is what matters
    }
    try {
      await this.registerer?.unregister();
    } catch {
      // same
    }
    await this.ua?.stop();
    this.ua = null;
    this.registerer = null;
    this.session = null;
  }

  // Not a #private method: the project's ESLint parser does not accept private
  // class syntax, and a build that lints is worth more than the encapsulation.
  attachSession(session, direction) {
    this.session = session;
    const remote = session.remoteIdentity;

    this.on({
      call: {
        direction,
        number: remote?.uri?.user || '',
        name: remote?.displayName || '',
        state: direction === 'inbound' ? 'incoming' : 'dialing',
        muted: false
      }
    });

    session.stateChange.addListener((state) => {
      if (state === SessionState.Establishing) this.on({ callState: direction === 'inbound' ? 'incoming' : 'ringing' });
      if (state === SessionState.Established) {
        if (this.audio) {
          this.audio.srcObject = remoteStreamFrom(session);
          this.audio.play?.().catch(() => {
            // autoplay can be refused until the page has been interacted with;
            // the call is up either way and the next gesture starts the audio
          });
        }
        this.on({ callState: 'active', answeredAt: new Date().toISOString() });
      }
      if (state === SessionState.Terminated) {
        if (this.audio) this.audio.srcObject = null;
        this.session = null;
        this.on({ call: null });
      }
    });
  }

  dial(target, name) {
    if (!this.ua) return;
    const uri = UserAgent.makeURI(`sip:${target}@${this.config.realm}`);
    if (!uri) return;
    const inviter = new Inviter(this.ua, uri, {
      sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } }
    });
    this.attachSession(inviter, 'outbound');
    if (name) this.on({ callName: name });
    inviter.invite().catch(() => this.on({ call: null, error: 'invite' }));
  }

  answer() {
    this.session?.accept?.({ sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } } });
  }

  reject() {
    this.session?.reject?.();
  }

  hangup() {
    const session = this.session;
    if (!session) return;
    // which method ends a call depends on how far it got, and calling the wrong
    // one throws rather than hanging up
    if (session.state === SessionState.Initial || session.state === SessionState.Establishing) {
      session.cancel?.() ?? session.reject?.();
    } else {
      session.bye?.();
    }
  }

  senders() {
    return this.session?.sessionDescriptionHandler?.peerConnection?.getSenders?.() || [];
  }

  setMuted(muted) {
    this.senders().forEach((sender) => {
      if (sender.track && sender.track.kind === 'audio') sender.track.enabled = !muted;
    });
    this.on({ muted });
  }

  setHold(held) {
    const session = this.session;
    if (!session) return;
    session
      .invite({ sessionDescriptionHandlerOptions: { hold: held } })
      .then(() => this.on({ callState: held ? 'held' : 'active' }))
      .catch(() => this.on({ error: 'hold' }));
  }

  sendDigit(digit) {
    this.session?.info?.({
      requestOptions: {
        body: { contentDisposition: 'render', contentType: 'application/dtmf-relay', content: `Signal=${digit}\r\nDuration=100` }
      }
    });
  }
}
