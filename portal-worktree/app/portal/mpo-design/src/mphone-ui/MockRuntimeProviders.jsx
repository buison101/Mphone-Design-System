import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { PortalActiveCallsContext } from './contexts/PortalActiveCallsContext';
import { MphoneDataProvider } from './contexts/DataProviderContext';
import { PortalSessionContext } from './contexts/PortalSessionContext';
import mockProvider from './providers/mock';

const mockSession = {
  workspace: { active: true, customer_uuid: 'preview-customer' },
  user_management: { allowed: false, superadmin: false },
  identity: { identity_uuid: 'preview-identity', primary_email: 'preview@example.invalid' },
  customer: { customer_uuid: 'preview-customer' },
  membership: { role: 'owner' },
  user: { user_uuid: 'preview-user', username: 'mphone.preview', extensions: [{ extension: '101', destination: '101' }] },
  domain: { domain_uuid: 'preview-domain', domain_name: 'preview.mphone.vn' },
  permissions: { portal_view: true, xml_cdr_view: true, call_active_view: true },
  entitlements: { call_statistics: { allowed: true } },
  branding: { brand_text: 'Mphone', brand_type: 'text' },
  csrf: 'preview-csrf',
  websocket: null
};

export default function MockRuntimeProviders({ children }) {
  const sessionValue = useMemo(
    () => ({
      session: mockSession,
      loading: false,
      error: null,
      reload: async () => mockSession,
      logout: async () => true,
      can: () => true
    }),
    []
  );
  const activeCallsValue = useMemo(
    () => ({
      calls: [
        { unique_id: 'preview-active-1', answer_state: 'ringing', direction: 'inbound' },
        { unique_id: 'preview-active-2', answer_state: 'answered', direction: 'outbound' }
      ],
      status: 'preview',
      hangup: async () => true
    }),
    []
  );

  return (
    <PortalSessionContext.Provider value={sessionValue}>
      <MphoneDataProvider provider={mockProvider}>
        <PortalActiveCallsContext.Provider value={activeCallsValue}>{children}</PortalActiveCallsContext.Provider>
      </MphoneDataProvider>
    </PortalSessionContext.Provider>
  );
}

MockRuntimeProviders.propTypes = { children: PropTypes.node };
