import PropTypes from 'prop-types';

import { MphoneDataProvider } from './contexts/DataProviderContext';
import { PortalActiveCallsProvider } from './contexts/PortalActiveCallsContext';
import { PortalSessionProvider } from './contexts/PortalSessionContext';
import fusionpbxProvider from './providers/fusionpbx';

export default function RuntimeProviders({ children }) {
  return (
    <PortalSessionProvider>
      <MphoneDataProvider provider={fusionpbxProvider}>
        <PortalActiveCallsProvider>{children}</PortalActiveCallsProvider>
      </MphoneDataProvider>
    </PortalSessionProvider>
  );
}

RuntimeProviders.propTypes = {
  children: PropTypes.node
};
