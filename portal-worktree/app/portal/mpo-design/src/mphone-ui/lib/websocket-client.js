const AUTH_REQUIRED_CODE = 407;

export default class WebsocketClient {
  constructor({ url, token, onStatus, onEvent, onAuthenticated, onTokenRejected }) {
    this.url = url;
    this.token = token;
    this.onStatus = onStatus || (() => {});
    this.onEvent = onEvent || (() => {});
    this.onAuthenticated = onAuthenticated || (() => {});
    this.onTokenRejected = onTokenRejected || (() => {});
    this.ws = null;
    this.nextId = 1;
    this.pending = new Map();
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.closedByUs = false;
  }

  connect() {
    this.closedByUs = false;
    this.onStatus('connecting');

    try {
      this.ws = new WebSocket(this.url);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.addEventListener('open', () => {
      this.reconnectAttempts = 0;
      this.onStatus('connected');
    });
    this.ws.addEventListener('message', (event) => this.handleMessage(event));
    this.ws.addEventListener('close', () => {
      this.onStatus('disconnected');
      if (!this.closedByUs) this.scheduleReconnect();
    });
    this.ws.addEventListener('error', () => this.onStatus('error'));
  }

  scheduleReconnect() {
    if (this.reconnectTimer) return;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    this.reconnectAttempts += 1;
    this.onStatus('reconnecting');
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  handleMessage(event) {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch {
      return;
    }

    if (message.status_code === AUTH_REQUIRED_CODE && message.service_name === 'authentication') {
      this.request('authentication')
        .then(() => this.onAuthenticated())
        .catch(() => this.onTokenRejected());
      return;
    }

    const requestId = message.request_id ?? null;
    if (requestId && this.pending.has(requestId)) {
      const { resolve, reject } = this.pending.get(requestId);
      this.pending.delete(requestId);
      const code = message.code ?? 200;
      const status = message.status ?? 'ok';

      if (status === 'ok' && code >= 200 && code < 300) resolve(message);
      else {
        const error = new Error(`WebSocket request failed (${code})`);
        error.code = code;
        reject(error);
        return;
      }

      if (message.topic && message.payload && typeof message.payload === 'object') this.onEvent(message.topic, message.payload, message);
      return;
    }

    if (message.topic && message.payload && typeof message.payload === 'object') this.onEvent(message.topic, message.payload, message);
  }

  request(service, topic = null, payload = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return Promise.reject(new Error('WebSocket is not open'));
    const requestId = String(this.nextId++);
    this.ws.send(JSON.stringify({ request_id: requestId, service, ...(topic !== null ? { topic } : {}), token: this.token, payload }));
    return new Promise((resolve, reject) => this.pending.set(requestId, { resolve, reject }));
  }

  close() {
    this.closedByUs = true;
    if (this.reconnectTimer) window.clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    if (this.ws) this.ws.close();
    this.ws = null;
  }
}
