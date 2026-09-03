#!/usr/bin/env node
// i18n:scan — display strings still outside the keymap, and message ids that
// would reach the interface as raw text (§4.5 forbids both).
//
//   node scripts/i18n/scan.mjs [--scope src] [--top 20]

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, walkFiles, rel, collectCandidates, readFile, loadKeymap, keymapByFile, isIdOnlyFile, isDataOnlyFile } from './lib.mjs';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : d;
};
const scope = arg('--scope', 'src');
const top = Number(arg('--top', '20'));

const km = loadKeymap();
const byFile = keymapByFile(km);
const RAW_ID = /^[a-z][a-zA-Z0-9]*(\.[a-zA-Z0-9]+){2,}$/;

let total = 0;
let uncovered = 0;
const byArea = new Map();
const distinct = new Map();
const rawIds = [];
let frozen = 0;
let arrayEls = 0;
let arrayExcepted = 0;
const exPath = path.join(ROOT, 'i18n', 'array-exceptions.json');
const arrayExceptions = fs.existsSync(exPath) ? (JSON.parse(fs.readFileSync(exPath, 'utf8')).arrays ?? {}) : {};
const frozenList = [];

// Component Catalog demo payload: positions inside the catalog trees that are
// NOT chrome (card titles, page titles, captions). Gate B2 translated the
// chrome and deliberately left the payload in English so a developer can match
// it against the MUI documentation (docs/15 §4.7b). The exception is pinned to
// a reviewed count per tree: if the real number drifts away from `expected`,
// scan says so, so the exception cannot quietly swallow a new gap.
const catPath = path.join(ROOT, 'i18n', 'catalog-exceptions.json');
const catalogTrees = fs.existsSync(catPath) ? (JSON.parse(fs.readFileSync(catPath, 'utf8')).trees ?? {}) : {};
const catalogSeen = new Map();
let catalogExcepted = 0;

let idOnlyFiles = 0;

for (const file of walkFiles(path.join(ROOT, scope))) {
  const relFile = rel(file);
  // Message ids, not display strings. See i18n/id-files.json.
  if (isIdOnlyFile(relFile) || isDataOnlyFile(relFile)) {
    idOnlyFiles += 1;
    continue;
  }
  const candidates = collectCandidates(readFile(file));
  if (!candidates.length) continue;
  const entries = byFile.get(relFile) ?? [];
  for (const c of candidates) {
    total += 1;
    if (RAW_ID.test(c.source)) rawIds.push(relFile + ':' + c.line + '  ' + c.source);
    const covered = entries.some(
      (e) => e.occurrence === c.occurrence && e.source === c.source && (e.index === undefined || e.index === c.index)
    );
    if (covered) continue;
    uncovered += 1;
    const tree = Object.keys(catalogTrees).find((t) => relFile === t || relFile.startsWith(t + '/'));
    if (tree) {
      catalogExcepted += 1;
      catalogSeen.set(tree, (catalogSeen.get(tree) ?? 0) + 1);
      continue;
    }
    if (c.occurrence === 'arr') {
      if (arrayExceptions[relFile]) {
        arrayExcepted += 1;
        continue;
      }
      arrayEls += 1;
      continue;
    }
    if (c.occurrence.startsWith('obj:') && c.moduleScope) {
      frozen += 1;
      frozenList.push(relFile + ':' + c.line + '  ' + c.occurrence + '  ' + JSON.stringify(c.source));
      continue;
    }
    const area = relFile.split('/').slice(0, 3).join('/');
    byArea.set(area, (byArea.get(area) ?? 0) + 1);
    distinct.set(c.source, (distinct.get(c.source) ?? 0) + 1);
  }
}

console.log('scope            ' + scope);
console.log('display strings  ' + total + ' positions');
console.log('in keymap        ' + (total - uncovered));
console.log('NOT in keymap    ' + uncovered + ' positions');
console.log(
  '  substitutable  ' + (uncovered - frozen - arrayEls - arrayExcepted - catalogExcepted) + ' positions, ' + distinct.size + ' distinct'
);
console.log('  needs decision ' + frozen + ' positions in module-scope object properties (cannot be substituted at build)');
console.log('  array elements ' + arrayEls + ' positions in bare string arrays (opt in per array, often technical)');
if (arrayExcepted) console.log('  array excepted ' + arrayExcepted + ' positions in arrays reviewed and deliberately not translated');
if (catalogExcepted)
  console.log(
    '  catalog payload ' +
      catalogExcepted +
      ' positions of Component Catalog demo payload, reviewed and deliberately kept in English (i18n/catalog-exceptions.json)'
  );
for (const [tree, cfg] of Object.entries(catalogTrees)) {
  const seen = catalogSeen.get(tree) ?? 0;
  if (seen !== cfg.expected)
    console.log(
      '  DRIFT          ' + tree + ': ' + seen + ' positions, the reviewed decision recorded ' + cfg.expected + '. Re-review §4.7b.'
    );
}
if (idOnlyFiles)
  console.log(
    '  skipped files  ' +
      idOnlyFiles +
      ' files skipped: their strings are message ids or reference data, not interface text (i18n/id-files.json, i18n/data-files.json)'
  );
console.log('');
console.log('by area:');
[...byArea.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, top)
  .forEach(([a, n]) => console.log('  ' + String(n).padStart(5) + '  ' + a));
if (frozenList.length && argv.includes('--frozen')) {
  console.log('');
  console.log('module-scope object properties:');
  frozenList.slice(0, 40).forEach((f) => console.log('  ' + f));
}
if (rawIds.length) {
  console.log('');
  console.log('RAW MESSAGE IDS reaching the interface as text (' + rawIds.length + '):');
  rawIds.slice(0, top).forEach((r) => console.log('  ' + r));
}
