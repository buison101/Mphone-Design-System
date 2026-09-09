import { useContext } from 'react';

import { PortalSessionContext } from '../contexts/PortalSessionContext';

export default function usePortalSession() {
  const context = useContext(PortalSessionContext);
  if (!context) throw new Error('usePortalSession must be used inside PortalSessionProvider');
  return context;
}
