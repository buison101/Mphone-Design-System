import PropTypes from 'prop-types';
import { useEffect } from 'react';

// material-ui
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

// third-party
import rtlPlugin from 'stylis-plugin-rtl';

// project imports
import { ThemeDirection } from 'config';
import useConfig from 'hooks/useConfig';

const emotionInsertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');

const rtlCache = createCache({
  key: 'muirtl',
  insertionPoint: emotionInsertionPoint,
  stylisPlugins: [rtlPlugin]
});

const ltrCache = createCache({
  key: 'mui',
  insertionPoint: emotionInsertionPoint
});

export default function RTLLayout({ children }) {
  const { state } = useConfig();

  useEffect(() => {
    document.dir = state.themeDirection;
  }, [state.themeDirection]);

  return <CacheProvider value={state.themeDirection === ThemeDirection.RTL ? rtlCache : ltrCache}>{children}</CacheProvider>;
}

RTLLayout.propTypes = { children: PropTypes.node };
