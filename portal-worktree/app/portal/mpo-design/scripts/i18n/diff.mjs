#!/usr/bin/env node
// i18n:diff — compare the keymap against a vendor tree and classify every
// entry: matched, reworded, moved, vanished (§4.7).
//
// This is what makes a Mantis upgrade a report instead of a merge. Run it
// against a freshly extracted vendor tree before touching anything.

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, walkFiles, collectCandidates, readFile, loadKeymap } from './lib.mjs';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : d;
};
const fallback = path.join(ROOT, '..', '..', '..', '..', '.tools', 'mto-stage-20260902', 'full-version');
const vendorRoot = path.resolve(ROOT, arg('--vendor', fallback));
const vendorSrc = path.join(vendorRoot, 'src');

if (!fs.existsSync(vendorSrc)) {
  console.error('vendor tree not found: ' + vendorSrc);
  process.exit(2);
}

const km = loadKeymap();
const entries = km.entries ?? [];
if (!entries.length) {
  console.log('keymap is empty; nothing to compare');
  process.exit(0);
}

// index the vendor tree once
const byFile = new Map();
const bySource = new Map();
for (const f of walkFiles(vendorSrc)) {
  const relFile = path.relative(vendorRoot, f).split(path.sep).join('/');
  const cands = collectCandidates(readFile(f));
  if (!cands.length) continue;
  byFile.set(relFile, cands);
  for (const c of cands) {
    const k = c.occurrence + ' ' + c.source;
    if (!bySource.has(k)) bySource.set(k, []);
    bySource.get(k).push(relFile);
  }
}

const out = { matched: [], reworded: [], moved: [], vanished: [], mphone: [], renamed: [] };

for (const e of entries) {
  // Positions the project added itself never existed in the vendor tree, so
  // comparing them against it is meaningless. They are reported separately.
  if (e.origin === 'mphone') {
    out.mphone.push(e);
    continue;
  }
  // A file this project renamed keeps its vendor path in `vendorFile`, so the
  // comparison lands on the right file instead of reporting every string in it
  // as moved.
  const lookupFile = e.vendorFile ?? e.file;
  if (e.vendorFile) out.renamed.push(e);
  const cands = byFile.get(lookupFile) ?? [];
  const exact = cands.find((c) => c.occurrence === e.occurrence && c.source === e.source && (e.index === undefined || c.index === e.index));
  if (exact) {
    out.matched.push(e);
    continue;
  }
  const elsewhere = bySource.get(e.occurrence + ' ' + e.source) ?? [];
  if (elsewhere.length) {
    out.moved.push({ entry: e, now: elsewhere });
    continue;
  }
  const sameSlot = cands.find((c) => c.occurrence === e.occurrence && c.index === (e.index ?? 0));
  if (sameSlot) {
    out.reworded.push({ entry: e, was: e.source, now: sameSlot.source });
    continue;
  }
  out.vanished.push(e);
}

console.log('vendor tree   ' + path.relative(ROOT, vendorRoot));
console.log('keymap        ' + entries.length + ' entries');
console.log('');
console.log('matched   ' + out.matched.length + '  reuse the translation as is');
console.log('reworded  ' + out.reworded.length + '  keep the key, review the translation');
console.log('moved     ' + out.moved.length + '  update file in the keymap, translation stands');
console.log('vanished  ' + out.vanished.length + '  archive, do not delete from history');
console.log('mphone    ' + out.mphone.length + '  added by this project, not present in any vendor tree');
console.log('renamed   ' + out.renamed.length + '  in a file this project renamed; compared against its vendor path');
console.log('');
for (const r of out.reworded) {
  console.log('REWORDED  ' + r.entry.key);
  console.log('    was: ' + JSON.stringify(r.was));
  console.log('    now: ' + JSON.stringify(r.now));
}
for (const m of out.moved) {
  console.log('MOVED     ' + m.entry.key);
  console.log('    from: ' + m.entry.file);
  console.log('    to:   ' + m.now.join(', '));
}
for (const v of out.vanished) console.log('VANISHED  ' + v.key + '  (' + v.file + ')');

fs.writeFileSync(path.join(ROOT, 'i18n', 'diff-report.json'), JSON.stringify(out, null, 2) + '\n');
console.log('');
console.log('report written to i18n/diff-report.json');
