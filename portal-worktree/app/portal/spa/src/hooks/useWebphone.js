import { useContext } from 'react';

// project imports
import { WebphoneContext } from 'contexts/WebphoneContext';

// ==============================|| HOOKS - WEBPHONE ||============================== //

export default function useWebphone() {
  const context = useContext(WebphoneContext);
  if (!context) throw new Error('useWebphone must be used inside WebphoneProvider');
  return context;
}
