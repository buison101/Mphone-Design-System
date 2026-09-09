import PropTypes from 'prop-types';
import { createContext, useContext } from 'react';

const DataProviderContext = createContext(undefined);

export function MphoneDataProvider({ children, provider }) {
  return <DataProviderContext.Provider value={provider}>{children}</DataProviderContext.Provider>;
}

export function useMphoneDataProvider() {
  const context = useContext(DataProviderContext);
  if (!context) throw new Error('useMphoneDataProvider must be used inside MphoneDataProvider');
  return context;
}

MphoneDataProvider.propTypes = {
  children: PropTypes.node,
  provider: PropTypes.shape({ mode: PropTypes.string.isRequired, getDashboard: PropTypes.func.isRequired }).isRequired
};
