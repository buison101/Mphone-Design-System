import { DASHBOARD_URL, MISSED_CALLS_URL, SETTINGS_URL } from '../config';

export class PortalApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'PortalApiError';
    this.status = status;
  }
}

async function getJson(url) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) throw new PortalApiError(`Portal request failed (${response.status})`, response.status);
  return response.json();
}

const fusionpbxProvider = {
  mode: 'fusionpbx',
  async getDashboard({ hours = 24, direction = '' } = {}) {
    const parameters = new URLSearchParams({ hours: String(hours) });
    if (direction) parameters.set('direction', direction);
    return getJson(`${DASHBOARD_URL}?${parameters}`);
  },
  async getExtensions() {
    return getJson(SETTINGS_URL);
  },
  async getMissedCalls(parameters = {}) {
    const query = new URLSearchParams(parameters);
    return getJson(`${MISSED_CALLS_URL}?${query}`);
  }
};

export default fusionpbxProvider;
