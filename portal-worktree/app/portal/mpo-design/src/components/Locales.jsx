import PropTypes from 'prop-types';
import { useMemo } from 'react';

// third-party
import { IntlProvider } from 'react-intl';
import { setDefaultOptions } from 'date-fns';

// project imports
import useConfig from 'hooks/useConfig';
import { setRuntimeIntl } from 'i18n/runtime';
import dateLocaleVi from 'locales-mphone/date-locale-vi';

import projectEn from 'locales-mphone/en.json';
import projectVi from 'locales-mphone/vi.json';
import vendorEn from 'utils/locales/en.json';
import vendorFr from 'utils/locales/fr.json';
import vendorRo from 'utils/locales/ro.json';
import vendorZh from 'utils/locales/zh.json';

// Catalog layering, per docs/15 §4.1 and §4.6 decision 2.
//
//   project en  ->  vendor en  ->  vendor <locale>  ->  project <locale>
//
// The project `en` layer sits underneath everything so that fr, ro and zh —
// unmaintained vendor demo catalogs — fall back to English on project keys
// instead of leaking raw message ids into the interface.
//
// The catalogs are imported statically, not with `import()`. They used to be
// dynamic, resolved in an effect, and that is what made the interface mix the
// two languages on a switch: `state.i18n` flipped in one render while the
// catalog, the runtime singleton and date-fns were still the previous
// language, and React committed that frame. Loading them up front costs about
// 170 kB of JSON in a 3 MB bundle and buys a switch that is a single
// synchronous render.

const VENDOR_CATALOGS = { en: vendorEn, fr: vendorFr, ro: vendorRo, zh: vendorZh };
const PROJECT_CATALOGS = { vi: projectVi };
const DATE_LOCALES = { vi: dateLocaleVi };

const buildMessages = (locale) => Object.assign({}, projectEn, vendorEn, VENDOR_CATALOGS[locale] ?? {}, PROJECT_CATALOGS[locale] ?? {});

// ==============================|| LOCALIZATION ||============================== //

export default function Locales({ children }) {
  const { state } = useConfig();
  const locale = state.i18n;

  // Deliberately a side effect during render, not in an effect. `__t()` reads
  // the runtime singleton while children render, so the singleton has to
  // already hold this catalog by the time they do; an effect runs after the
  // frame is committed, one language too late. date-fns rides along for the
  // same reason. Both calls are idempotent.
  const messages = useMemo(() => {
    const merged = buildMessages(locale);
    setRuntimeIntl(locale, merged);
    setDefaultOptions({ locale: DATE_LOCALES[locale] });
    return merged;
  }, [locale]);

  // The remount on `key` is deliberate too. A component that copies a
  // translated string into state — chart options, a table's rows, a stepper's
  // labels — keeps the old language for as long as it stays mounted, and its
  // effect dependencies almost never mention the locale. Remounting makes that
  // whole class of staleness impossible instead of chasing it one component at
  // a time. The router holds its own state, so the current route survives.
  return (
    <IntlProvider key={locale} locale={locale} defaultLocale="en" messages={messages}>
      {children}
    </IntlProvider>
  );
}

Locales.propTypes = { children: PropTypes.node };
