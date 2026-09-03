// Build-time message substitution (§4.7).
//
// The plugin NEVER guesses. It substitutes exactly the positions listed in
// i18n/keymap.json and leaves every other string alone. Adding a heuristic
// here would destroy the property that makes it auditable.
//
// Vendor files on disk are untouched: the rewrite happens in Vite's transform
// step. Edits are spliced by byte offset and the injected import is appended
// (ESM hoists it), so line numbers are preserved and stack traces stay useful.

import path from 'node:path';
import { ROOT, loadKeymap, keymapByFile, collectCandidates, matchEntries, KEYMAP_PATH } from './lib.mjs';

const IMPORT_LINE = "\nimport { __t as __I18N_T } from 'i18n/runtime';\n";
const MARKER = '__I18N_T';

// Positions that already sit in expression context: an object property value,
// a bare array element, and a string branch of a ternary in JSX children or in
// a JSX attribute. Wrapping any of them in braces is a syntax error.
const isExpressionPosition = (candidate) =>
  candidate.occurrence.startsWith('obj:') ||
  candidate.occurrence === 'arr' ||
  candidate.occurrence === 'cond' ||
  candidate.occurrence.startsWith('cond:') ||
  candidate.occurrence.startsWith('assign:') ||
  candidate.occurrence.startsWith('call:') ||
  candidate.occurrence === 'tpl' ||
  candidate.occurrence.startsWith('tpl:');

function replacement(entry, candidate) {
  // A template literal carries its interpolations across as named ICU
  // arguments, so `${selected} row(s) selected` becomes one translatable
  // sentence instead of two fragments a translator cannot reorder.
  const values = candidate.args?.length
    ? ', { ' + candidate.args.map((a) => JSON.stringify(a.name) + ': (' + a.source + ')').join(', ') + ' }'
    : '';
  const call = MARKER + '(' + JSON.stringify(entry.key) + ', ' + JSON.stringify(candidate.source) + values + ')';
  // JSX positions need braces; an object property and a bare array element are
  // already in expression position, and wrapping either would produce
  // `message: {__t(...)}` or `[{__t(...)}]`, which is a syntax error. The build
  // catches it, but only if a build is actually run.
  return isExpressionPosition(candidate) ? call : '{' + call + '}';
}

export default function i18nSubstitute() {
  let byFile = new Map();
  let entryCount = 0;

  const reload = () => {
    const km = loadKeymap();
    byFile = keymapByFile(km);
    entryCount = (km.entries ?? []).length;
    return entryCount;
  };

  return {
    name: 'mpo-i18n-substitute',
    enforce: 'pre',

    buildStart() {
      reload();
      this.info?.('keymap: ' + entryCount + ' entries across ' + byFile.size + ' files');
    },

    configureServer(server) {
      server.watcher.add(KEYMAP_PATH);
      // `add` as well as `change`: a keymap replaced wholesale — restored from a
      // sync archive, or rewritten by a seeding script — arrives as unlink+add,
      // and watching only `change` leaves the server serving the keymap it read
      // at startup while every page looks convincingly translated.
      const onKeymapEvent = (file) => {
        if (path.resolve(file) !== path.resolve(KEYMAP_PATH)) return;
        const n = reload();
        server.config.logger.info('[i18n] keymap reloaded: ' + n + ' entries, reloading page');
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('change', onKeymapEvent);
      server.watcher.on('add', onKeymapEvent);
    },

    transform(code, id) {
      const clean = id.split('?')[0];
      if (!/\.(jsx|js)$/.test(clean)) return null;
      if (clean.includes('/node_modules/')) return null;

      const relFile = path.relative(ROOT, clean).split(path.sep).join('/');
      const entries = byFile.get(relFile);
      if (!entries || entries.length === 0) return null;

      const candidates = collectCandidates(code);
      const { hits, unmatched } = matchEntries(entries, candidates);

      if (unmatched.length) {
        this.warn('keymap entries no longer match ' + relFile + ': ' + unmatched.map((u) => u.key).join(', ') + '. Run i18n:diff.');
      }
      // An object property or bare array element evaluated at module scope
      // cannot be substituted: the call would run once at import time and
      // freeze whichever language was loaded first, never reacting to a locale
      // change. The same positions inside a function body are re-evaluated on
      // render and are safe — that is what the hoist pattern buys (§4.7).
      const frozen = hits.filter((h) => isExpressionPosition(h.candidate) && h.candidate.moduleScope);
      if (frozen.length) {
        this.warn(
          'refusing to substitute module-scope expression positions in ' +
            relFile +
            ': ' +
            frozen.map((h) => h.entry.key).join(', ') +
            '. They would freeze the first locale loaded. See docs/15 §4.7.'
        );
      }
      const safe = hits.filter((h) => !(isExpressionPosition(h.candidate) && h.candidate.moduleScope));
      if (!safe.length) return null;

      const edits = safe
        .map(({ entry, candidate }) => ({ start: candidate.start, end: candidate.end, text: replacement(entry, candidate) }))
        .sort((a, b) => b.start - a.start);

      let out = code;
      let last = Infinity;
      for (const e of edits) {
        if (e.end > last) continue; // overlapping edit, skip defensively
        out = out.slice(0, e.start) + e.text + out.slice(e.end);
        last = e.start;
      }

      return { code: out + IMPORT_LINE, map: null };
    }
  };
}
