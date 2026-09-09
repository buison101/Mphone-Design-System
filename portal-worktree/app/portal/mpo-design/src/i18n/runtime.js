// Runtime half of the build-time substitution described in
// docs/15-mpo-design-implementation-plan.vi.md §4.7.
//
// The Vite plugin rewrites the positions listed in i18n/keymap.json into
// __t('key', 'Source English') calls. Nothing is edited in the vendor files on
// disk; this module resolves those calls at runtime.
//
// Because the source English is always passed as the default message, a key
// that is missing from the catalog renders the original English rather than a
// raw message id. §4.5 forbids raw ids reaching the interface.

import { createIntl, createIntlCache } from 'react-intl';

import routeMessageAliases from './route-message-aliases.json';

const cache = createIntlCache();

let intl = null;
let missing = new Set();

/** Called by src/components/Locales.jsx whenever the locale or catalog changes. */
export function setRuntimeIntl(locale, messages) {
  missing = new Set();
  intl = createIntl(
    {
      locale,
      defaultLocale: 'en',
      messages,
      onError: (err) => {
        if (import.meta.env.DEV && err?.code === 'MISSING_TRANSLATION') {
          const id = err.descriptor?.id;
          if (id && !missing.has(id)) {
            missing.add(id);
            console.debug('[i18n] missing message, falling back to source English:', id);
          }
          return;
        }
        if (import.meta.env.DEV) console.debug('[i18n]', err?.message ?? err);
      }
    },
    cache
  );
}

/** Substituted call target. Never throws; falls back to the source English. */
export function __t(id, defaultMessage, values) {
  if (!intl) return defaultMessage;
  try {
    const pathname = typeof window === 'undefined' ? '' : window.location.pathname;
    const resolvedId = routeMessageAliases[pathname]?.[id] ?? id;
    return intl.formatMessage({ id: resolvedId, defaultMessage }, values);
  } catch {
    return defaultMessage;
  }
}

/** Ids that fell back during this session. Development aid only. */
export function missingIds() {
  return [...missing];
}
