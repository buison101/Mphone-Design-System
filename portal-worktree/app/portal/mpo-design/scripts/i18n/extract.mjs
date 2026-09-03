#!/usr/bin/env node
// i18n:extract — propose display-string candidates for human review.
// It never writes the keymap. A person chooses the key and writes the context;
// that review step is where translation quality comes from (§4.7).
//
//   node scripts/i18n/extract.mjs [--scope src/pages/maintenance] [--out i18n/proposals.json]

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, walkFiles, rel, collectCandidates, readFile, loadKeymap, keymapByFile, isIdOnlyFile, isDataOnlyFile } from './lib.mjs';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : d;
};

const scope = arg('--scope', 'src');
const out = arg('--out', 'i18n/proposals.json');
const scopeDir = path.join(ROOT, scope);

if (!fs.existsSync(scopeDir)) {
  console.error(`scope not found: ${scope}`);
  process.exit(2);
}

const km = loadKeymap();
const byFile = keymapByFile(km);

const camel = (s) =>
  s
    .replace(/[^A-Za-z0-9 ]+/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join('') || 'text';

// Suggest a key from the file path. A suggestion only — the reviewer decides.
const suggestKey = (relFile, source) => {
  const parts = relFile
    .replace(/^src\//, '')
    .replace(/\.(jsx|js)$/, '')
    .split('/');
  if (parts[parts.length - 1] === 'index') parts.pop();
  const domain = parts
    .filter((p) => !['pages', 'sections', 'components'].includes(p) || parts.indexOf(p) > 0)
    .map((p) => camel(p))
    .slice(-3)
    .join('.');
  return `${domain}.${camel(source)}`;
};

const roleOf = (occurrence) => {
  if (occurrence === 'prop:placeholder') return 'placeholder';
  if (occurrence === 'prop:aria-label' || occurrence === 'prop:ariaLabel') return 'a11y';
  if (occurrence === 'prop:helperText') return 'helper';
  if (occurrence.startsWith('prop:')) return occurrence.slice(5);
  return 'text';
};

const proposals = [];
let scanned = 0;
let covered = 0;

for (const file of walkFiles(scopeDir)) {
  const relFile = rel(file);
  // Message ids, not display strings. See i18n/id-files.json.
  if (isIdOnlyFile(relFile) || isDataOnlyFile(relFile)) continue;
  const code = readFile(file);
  const candidates = collectCandidates(code);
  if (!candidates.length) continue;
  scanned += 1;
  const existing = byFile.get(relFile) ?? [];
  for (const c of candidates) {
    // Array elements are reported by i18n:scan but never proposed by default:
    // bare string arrays are often technical. Pass --arrays to include them.
    if (c.occurrence === 'arr' && !argv.includes('--arrays')) continue;
    const already = existing.some(
      (e) => e.occurrence === c.occurrence && e.source === c.source && (e.index === undefined || e.index === c.index)
    );
    if (already) {
      covered += 1;
      continue;
    }
    proposals.push({
      file: relFile,
      occurrence: c.occurrence,
      source: c.source,
      index: c.index,
      line: c.line,
      suggestedKey: suggestKey(relFile, c.source),
      kind: 'message',
      role: roleOf(c.occurrence),
      context: '',
      routes: [],
      maxLength: null
    });
  }
}

fs.mkdirSync(path.dirname(path.join(ROOT, out)), { recursive: true });
fs.writeFileSync(path.join(ROOT, out), JSON.stringify({ scope, generated: new Date().toISOString(), proposals }, null, 2) + '\n');

const distinct = new Set(proposals.map((p) => p.source)).size;
console.log(`scope        ${scope}`);
console.log(`files        ${scanned} with candidates`);
console.log(`already in keymap  ${covered}`);
console.log(`proposals    ${proposals.length} positions, ${distinct} distinct strings`);
console.log(`written to   ${out}`);
console.log('');
console.log('Review each entry: set the key, write context, set maxLength where space is tight,');
console.log('and mark vendor names/companies/emails as kind "sampleIdentity" (§4.8).');
