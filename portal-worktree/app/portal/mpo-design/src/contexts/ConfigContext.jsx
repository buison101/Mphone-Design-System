import PropTypes from 'prop-types';
import { createContext, useEffect, useMemo, useRef } from 'react';

// project imports
import config from 'config';
import { useLocalStorage } from 'hooks/useLocalStorage';

// ==============================|| CONFIG CONTEXT ||============================== //

export const ConfigContext = createContext(undefined);

// ==============================|| CONFIG PROVIDER ||============================== //

export function ConfigProvider({ children }) {
  const { state, setState, setField, resetState } = useLocalStorage('mantis-react-js-config', config);
  const defaultsMigrated = useRef(false);

  useEffect(() => {
    if (defaultsMigrated.current) return;

    defaultsMigrated.current = true;
    setState((current) => ({
      ...current,
      ...(current.fontFamily === `'Public Sans', sans-serif` && { fontFamily: `'Inter', sans-serif` }),
      ...(current.container === true && { container: false }),
      ...(current.presetColor === 'default' && { presetColor: 'mphone1' })
    }));
  }, [setState]);

  const memoizedValue = useMemo(() => ({ state, setState, setField, resetState }), [state, setField, setState, resetState]);

  return <ConfigContext.Provider value={memoizedValue}>{children}</ConfigContext.Provider>;
}

ConfigProvider.propTypes = { children: PropTypes.node };
