/**
 * MTO string inventory (migration stage 2).
 *
 * Walks src/ and reports every candidate user-visible string, grouped by area,
 * so localization waves can be planned and coverage measured between waves.
 *
 *   node scripts/i18n-inventory.mjs           # summary to stdout
 *   node scripts/i18n-inventory.mjs --json    # machine-readable report
 *
 * A "candidate" is a JSX text node or a string literal in a prop that renders
 * to the screen. The scan is deliberately generous: a false positive costs one
 * line of review, a missed string ships an untranslated screen.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SRC = 'src';
const SKIP_DIRS = new Set(['node_modules', 'locales']);
const CODE_EXT = /\.(js|jsx)$/;

// Props whose string value is read by a person, not by the machine.
const TEXT_PROPS = [
  'title', 'label', 'placeholder', 'helperText', 'header', 'subheader', 'subtitle', 'caption',
  'heading', 'description', 'buttonText', 'alt', 'tooltip', 'message', 'primary', 'secondary',
  'content', 'emptyText', 'noOptionsText', 'confirmText', 'cancelText', 'submitText'
];
const PROP_RE = new RegExp(`\\b(${TEXT_PROPS.join('|')})\\s*=\\s*['"\`]([^'"\`]{2,})['"\`]`, 'g');
const JSX_TEXT_RE = />\s*([A-Za-z][A-Za-z0-9 ,.'\-!?&%()/:;+]{2,})\s*</g;

// Strings that look like prose but are not shown to anyone.
const NOT_COPY = [
  /^[a-z]+([A-Z][a-z]*)+$/,          // camelCase identifiers
  /^[a-z0-9-]+$/,                     // slugs, css classes, ids
  /^https?:\/\//,
  /^\d[\d\s.,:/-]*$/,                 // bare numbers and dates
  /^[A-Z_]+$/,                        // CONSTANTS
  /\.(js|jsx|json|png|jpg|svg|css)$/i
];

const isCopy = (s) => {
  const t = s.trim();
  if (t.length < 2) return false;
  if (!/[A-Za-z]/.test(t)) return false;
  return !NOT_COPY.some((re) => re.test(t));
};

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (CODE_EXT.test(name)) out.push(p);
  }
  return out;
}

/** Area = the first two path segments under src/, e.g. "pages/auth". */
function areaOf(file) {
  const parts = relative(SRC, file).split(sep);
  return parts.length > 1 ? `${parts[0]}/${parts[1]}` : parts[0];
}

const files = walk(SRC).sort();
const report = { generatedAt: new Date().toISOString(), totals: {}, areas: {}, files: {} };

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const localized = /FormattedMessage|useIntl|formatMessage/.test(source);
  const found = new Set();

  for (const m of source.matchAll(PROP_RE)) if (isCopy(m[2])) found.add(m[2].trim());
  for (const m of source.matchAll(JSX_TEXT_RE)) if (isCopy(m[1])) found.add(m[1].trim());

  const area = areaOf(file);
  const key = relative(SRC, file).split(sep).join('/');
  report.areas[area] ??= { strings: 0, files: 0, localizedFiles: 0 };
  report.areas[area].files += 1;
  if (localized) report.areas[area].localizedFiles += 1;
  if (!found.size) continue;
  report.areas[area].strings += found.size;
  report.files[key] = { area, localized, strings: found.size, samples: [...found].slice(0, 5) };
}

report.totals = {
  files: files.length,
  filesWithCopy: Object.keys(report.files).length,
  strings: Object.values(report.files).reduce((n, f) => n + f.strings, 0),
  localizedFiles: Object.values(report.files).filter((f) => f.localized).length
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const { totals } = report;
  console.log(`files scanned      ${totals.files}`);
  console.log(`files with copy    ${totals.filesWithCopy}`);
  console.log(`candidate strings  ${totals.strings}`);
  console.log(`files on react-intl ${totals.localizedFiles}\n`);
  const rows = Object.entries(report.areas)
    .filter(([, a]) => a.strings)
    .sort((a, b) => b[1].strings - a[1].strings);
  console.log('strings  files  intl  area');
  for (const [area, a] of rows) {
    console.log(`${String(a.strings).padStart(7)}  ${String(a.files).padStart(5)}  ${String(a.localizedFiles).padStart(4)}  ${area}`);
  }
}
