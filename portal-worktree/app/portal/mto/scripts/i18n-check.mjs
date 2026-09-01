/**
 * Catalog parity and coverage check (migration stage 2).
 *
 *   node scripts/i18n-check.mjs
 *
 * Fails when Vietnamese and English disagree about which keys exist, when a
 * value is empty, or when the source references a message id no catalog has.
 * Neither language is a fallback for the other, so a key present in one and
 * missing in the other is an error, not a warning.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const LOCALES = join('src', 'utils', 'locales');
const SRC = 'src';
const read = (lang) => JSON.parse(readFileSync(join(LOCALES, `${lang}.json`), 'utf8'));

const vi = read('vi');
const en = read('en');
const errors = [];
const warnings = [];

const viKeys = new Set(Object.keys(vi));
const enKeys = new Set(Object.keys(en));
for (const k of viKeys) if (!enKeys.has(k)) errors.push(`missing in en.json: ${k}`);
for (const k of enKeys) if (!viKeys.has(k)) errors.push(`missing in vi.json: ${k}`);
for (const [lang, cat] of [['vi', vi], ['en', en]]) {
  for (const [k, v] of Object.entries(cat)) {
    if (typeof v !== 'string' || !v.trim()) errors.push(`empty value in ${lang}.json: ${k}`);
  }
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'locales' || name === 'node_modules') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(name)) out.push(p);
  }
  return out;
}

// Literal ids the source asks for: <FormattedMessage id="x" />, formatMessage({ id: 'x' }),
// and the menu data's title/caption/chip label fields, which the nav renders through react-intl.
const ID_PATTERNS = [
  /<FormattedMessage\s+id=["']([^"']+)["']/g,
  /formatMessage\(\s*{\s*id:\s*['"]([^'"]+)['"]/g,
  /\b(?:title|caption|label):\s*['"]((?:nav|app|header|drawer|auth|maintenance|dashboard|error|common)\.[^'"]+)['"]/g
];

const used = new Map();
for (const file of walk(SRC)) {
  const source = readFileSync(file, 'utf8');
  for (const re of ID_PATTERNS) {
    for (const m of source.matchAll(re)) {
      if (!used.has(m[1])) used.set(m[1], file);
    }
  }
}

for (const [id, file] of used) {
  if (!viKeys.has(id)) errors.push(`referenced but not in catalog: ${id}  (${file})`);
}
for (const k of viKeys) {
  if (!used.has(k)) warnings.push(`in catalog but no literal reference: ${k}`);
}

console.log(`vi.json ${viKeys.size} keys · en.json ${enKeys.size} keys · ${used.size} literal ids in src`);
if (warnings.length) {
  console.log(`\n${warnings.length} key(s) with no literal reference (may be built dynamically):`);
  for (const w of warnings.slice(0, 20)) console.log('  ' + w);
  if (warnings.length > 20) console.log(`  … and ${warnings.length - 20} more`);
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log('\nOK — catalogs agree and every referenced id exists.');
