#!/usr/bin/env node
// i18n:check — catalog parity and translation-quality rules (§4.7, §4.8).
//
// Parity is enforced for en/vi only. fr, ro and zh are unmaintained vendor
// demo catalogs: reported for information, never a failure.
//
//   node scripts/i18n/check.mjs [--strict]

import fs from 'node:fs';
import path from 'node:path';
import { loadKeymap, loadCatalog, VENDOR_CATALOG_DIR, ROOT, readFile, collectIdentifierUses } from './lib.mjs';

const strict = process.argv.includes('--strict');
const km = loadKeymap();
const entries = km.entries ?? [];
const en = loadCatalog('en');
const vi = loadCatalog('vi');

const errors = [];
const warnings = [];
const notes = [];

const byKey = new Map();
for (const e of entries) {
  if (!byKey.has(e.key)) byKey.set(e.key, []);
  byKey.get(e.key).push(e);
}

// 1. every keymap key has complete en and vi content
for (const [key, group] of byKey) {
  const sample = group[0];
  if (!(key in en)) errors.push('missing en: ' + key);
  if (!(key in vi)) errors.push('missing vi: ' + key);
  if (key in en && String(en[key]).trim() === '') errors.push('empty en: ' + key);
  if (key in vi && String(vi[key]).trim() === '') errors.push('empty vi: ' + key);

  // 2. sampleIdentity carries one value across every locale (§4.8)
  if (sample.kind === 'sampleIdentity') {
    if (key in en && key in vi && en[key] !== vi[key]) {
      errors.push('sampleIdentity must be identical in en and vi: ' + key);
    }
    continue;
  }
}

// 4. orphan catalog keys.
// Two legitimate exceptions: vendor key ids, which the vendor's own
// FormattedMessage calls resolve and which therefore need no keymap entry;
// and keys listed in i18n/keep-english.json.
const vendorEnPath = path.join(VENDOR_CATALOG_DIR, 'en.json');
const vendorEn = fs.existsSync(vendorEnPath) ? JSON.parse(fs.readFileSync(vendorEnPath, 'utf8')) : {};
const vendorKeys = new Set(Object.keys(vendorEn));
const keepPath = path.join(path.dirname(VENDOR_CATALOG_DIR), '..', '..', 'i18n', 'keep-english.json');
const keepEnglish = fs.existsSync(keepPath) ? new Set(Object.keys(JSON.parse(fs.readFileSync(keepPath, 'utf8')).keys ?? {})) : new Set();
const known = (key) => byKey.has(key) || vendorKeys.has(key);
for (const key of Object.keys(en)) if (!known(key)) warnings.push('orphan in en catalog: ' + key);
for (const key of Object.keys(vi)) if (!known(key)) warnings.push('orphan in vi catalog: ' + key);
console.log(
  'vendor overrides  ' + Object.keys(vi).filter((k) => vendorKeys.has(k)).length + ' vendor key ids translated in the project vi catalog'
);
console.log('keep-english      ' + keepEnglish.size + ' keys where the approved Vietnamese is the English term');

// 3. vi identical to en, across the whole vi catalog. The English side is the
// project catalog where it defines the key, otherwise the vendor catalog.
const effectiveEn = Object.assign({}, vendorEn, en);
for (const key of Object.keys(vi)) {
  if (keepEnglish.has(key)) continue;
  if (byKey.get(key)?.[0]?.kind === 'sampleIdentity') continue;
  if (key in effectiveEn && effectiveEn[key] === vi[key]) {
    warnings.push('vi identical to en: ' + key + ' = ' + JSON.stringify(vi[key]));
  }
}
for (const key of keepEnglish) {
  if (!(key in vi)) warnings.push('keep-english lists a key with no vi entry: ' + key);
}

// 5. two keys with the same source and role on an overlapping route: merge candidates
// 6. same source translated several ways with no context to justify it
const bySource = new Map();
for (const e of entries) {
  if (e.kind === 'sampleIdentity') continue;
  const k = e.source + ' ' + (e.role ?? '');
  if (!bySource.has(k)) bySource.set(k, []);
  bySource.get(k).push(e);
}
for (const [k, group] of bySource) {
  const keys = [...new Set(group.map((g) => g.key))];
  if (keys.length < 2) continue;
  const parts = k.split(' ');
  const source = parts[0];
  const role = parts[1] || '';
  const routes = group.flatMap((g) => g.routes ?? []);
  if (routes.length !== new Set(routes).size) {
    warnings.push(
      'same source ' +
        JSON.stringify(source) +
        ' role ' +
        role +
        ' on shared routes uses ' +
        keys.length +
        ' keys, consider merging: ' +
        keys.join(', ')
    );
  }
  const translations = [...new Set(keys.filter((x) => x in vi).map((x) => vi[x]))];
  if (translations.length > 1) {
    const noContext = group.filter((g) => !g.context || !g.context.trim()).map((g) => g.key);
    if (noContext.length) {
      warnings.push(
        'same source ' +
          JSON.stringify(source) +
          ' translated ' +
          translations.length +
          ' ways, no context justifies it on: ' +
          noContext.join(', ')
      );
    }
  }
}

// 6b. A translated display string that is ALSO used as an identifier in the
// same file — an object key, a computed member access, or an === operand — is
// load-bearing. Translating it silently breaks whatever looks it up. Set
// `identifierChecked: true` on the entry once a person has confirmed the two
// uses are independent.
const byFileForIds = new Map();
for (const e of entries) {
  if (!e.occurrence.startsWith('obj:')) continue;
  if (e.identifierChecked) continue;
  if (!byFileForIds.has(e.file)) byFileForIds.set(e.file, []);
  byFileForIds.get(e.file).push(e);
}
for (const [file, group] of byFileForIds) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) continue;
  const uses = collectIdentifierUses(readFile(full));
  for (const e of group) {
    if (uses.has(e.source)) {
      warnings.push(
        'display string ' +
          JSON.stringify(e.source) +
          ' is also used as an identifier in ' +
          file +
          ' (' +
          e.key +
          '). Translating it can break a lookup. Confirm the uses are independent, then set identifierChecked: true.'
      );
    }
  }
}

// 6a. `vi` that is still the English word, wearing a different case or a
// dropped plural. The exact-match rule above missed `backlogs`: vendor English
// `Backlogs`, "Vietnamese" `Backlog`. Legitimate loanwords — Widget, Plugin,
// Tab, Prompt — are decisions, and decisions belong in i18n/keep-english.json.
const normaliseWord = (value) => {
  const flat = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
  return flat.length > 3 && flat.endsWith('s') ? flat.slice(0, -1) : flat;
};
for (const key of Object.keys(vi)) {
  if (keepEnglish.has(key)) continue;
  if (byKey.get(key)?.[0]?.kind === 'sampleIdentity') continue;
  const source = key in en ? en[key] : vendorEn[key];
  if (source === undefined) continue;
  if (vi[key] === source) continue; // already reported by the exact rule
  if (normaliseWord(vi[key]) !== normaliseWord(source)) continue;
  warnings.push(
    'vi is the English word with different case or plural: ' +
      key +
      ' = ' +
      JSON.stringify(vi[key]) +
      ' (en ' +
      JSON.stringify(source) +
      ')'
  );
}

// 6c. a translated string that is also a message id somewhere in the catalogs.
// `<FormattedMessage id="prompts" />` and a rendered word `prompts` can coexist
// safely, but only a person can say so; the same shape is how a lookup key gets
// translated by accident. Confirm, then set identifierChecked on the entry.
for (const e of entries) {
  if (e.identifierChecked) continue;
  if (!(e.source in en) && !(e.source in vendorEn)) continue;
  warnings.push(
    'translated string "' +
      e.source +
      '" is also a message id (' +
      e.key +
      ' in ' +
      e.file +
      '). Confirm the two uses are independent, then set identifierChecked: true.'
  );
}

// 6b. one key, one source. An auto-reuse pass once gave `Sort By` and
// `Sort by (` the same key, and the trailing ` (` disappeared from the screen:
// `Sắp xếp theoMặc định)`. Case-only and whitespace-only variants are the
// vendor's own styling (`NAME` beside `Name`) and stay quiet.
const sourcesByKey = new Map();
for (const e of entries) {
  if (!sourcesByKey.has(e.key)) sourcesByKey.set(e.key, new Set());
  sourcesByKey.get(e.key).add(e.source);
}
for (const [key, sources] of sourcesByKey) {
  if (sources.size < 2) continue;
  const normalised = new Set([...sources].map((x) => x.toLowerCase().replace(/\s+/g, ' ').trim()));
  if (normalised.size < 2) continue;
  errors.push('key ' + key + ' is bound to different source strings: ' + [...sources].map((x) => JSON.stringify(x)).join(', '));
}

// 7. vendor demo locales: informational only, never a failure
for (const loc of ['fr', 'ro', 'zh']) {
  const p = path.join(VENDOR_CATALOG_DIR, loc + '.json');
  if (!fs.existsSync(p)) continue;
  const vendor = JSON.parse(fs.readFileSync(p, 'utf8'));
  const missing = [...byKey.keys()].filter((x) => !(x in vendor)).length;
  notes.push(
    loc + ': unmaintained vendor catalog, ' + Object.keys(vendor).length + ' keys; ' + missing + ' project keys fall back to en (expected)'
  );
}

console.log('keymap entries   ' + entries.length);
console.log('distinct keys    ' + byKey.size);
console.log('en catalog       ' + Object.keys(en).length);
console.log('vi catalog       ' + Object.keys(vi).length);
notes.forEach((n) => console.log('note   ' + n));
warnings.forEach((w) => console.log('WARN   ' + w));
errors.forEach((e) => console.log('ERROR  ' + e));
console.log('');
console.log(errors.length + ' error(s), ' + warnings.length + ' warning(s)');
if (errors.length || (strict && warnings.length)) process.exit(1);
