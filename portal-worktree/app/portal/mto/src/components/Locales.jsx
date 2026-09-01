import PropTypes from 'prop-types';
import { useEffect, useState, useMemo } from 'react';

// third-party
import { IntlProvider } from 'react-intl';

// project imports
import useConfig from 'hooks/useConfig';

// load locales files
const loadLocaleData = (locale) => {
  switch (locale) {
    case 'en':
      return import('utils/locales/en.json');
    case 'vi':
    default:
      return import('utils/locales/vi.json');
  }
};

// A missing message is a defect, not a fallback: it means a screen ships an id
// instead of a sentence. Surfaced in development, and in a build started with
// VITE_I18N_STRICT=1 so the render check can fail on it.
const STRICT = import.meta.env.DEV || import.meta.env.VITE_I18N_STRICT === '1';

function handleIntlError(error) {
  if (STRICT) console.error('[i18n] ' + error.message);
}

// ==============================|| LOCALIZATION ||============================== //

export default function Locales({ children }) {
  const { state } = useConfig();

  const [messages, setMessages] = useState();
  const localeDataPromise = useMemo(() => loadLocaleData(state.i18n), [state.i18n]);

  useEffect(() => {
    localeDataPromise.then((d) => {
      setMessages(d.default);
    });
  }, [localeDataPromise]);

  return (
    <>
      {messages && (
        <IntlProvider locale={state.i18n} defaultLocale="vi" messages={messages} onError={handleIntlError}>
          {children}
        </IntlProvider>
      )}
    </>
  );
}

Locales.propTypes = { children: PropTypes.node };
