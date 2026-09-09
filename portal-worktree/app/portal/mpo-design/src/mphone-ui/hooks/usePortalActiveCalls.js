import { useContext } from 'react';

import { PortalActiveCallsContext } from '../contexts/PortalActiveCallsContext';

export default function usePortalActiveCalls() {
  const context = useContext(PortalActiveCallsContext);
  if (!context) throw new Error('usePortalActiveCalls must be used inside PortalActiveCallsProvider');
  return context;
}
