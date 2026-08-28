// ==============================|| PREVIEW REFRESH ||============================== //
//
// Rebuilds portal.html from the current source.
//
//   npm run preview:build
//
// Vite emits three files into preview/.out; this inlines the stylesheet and the
// script into the document so the preview is a single file with no requests of
// its own. Fonts are already data URIs — assetsInlineLimit in the preview config
// is set above their size on purpose.

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const HERE = import.meta.dirname;
const SPA = path.resolve(HERE, '..');
const OUT = path.join(HERE, '.out');
const PAGE = path.join(HERE, 'portal.html');

const build = spawnSync('npx', ['vite', 'build', '--config', 'preview/vite.config.mjs'], {
  cwd: SPA,
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

if (build.status !== 0) {
  console.error('\nThe preview build failed. portal.html was left as it was.');
  process.exit(build.status ?? 1);
}

// A closing tag inside the bundle would end the element early, so the two
// sequences that can do that are escaped. The browser unescapes them; JSON
// strings and regular expressions in the bundle are unaffected.
const guard = (text, tag) => text.replace(new RegExp(`</(${tag})`, 'gi'), '<\\/$1');

const read = (name) => fs.readFileSync(path.join(OUT, name), 'utf8');

// Each tag must actually be found and replaced. Searching the finished document
// for "app.js" would not work as a check — the bundle mentions its own filenames
// in places, so the test has to be that the substitution changed something.
// The replacement is passed as a function, not a string. A string replacement
// would have "$&", "$'" and friends interpreted by String.replace, and the
// bundle contains those sequences in ordinary code — React's own
// `c.replace(A, "$&/")` is enough to splice the <script> tag back into the
// middle of the bundle and break the document.
function substitute(html, tag, replacement) {
  const next = html.replace(tag, () => replacement);
  if (next === html) {
    console.error(`The build output no longer contains:\n  ${tag}\nportal.html was left as it was.`);
    process.exit(1);
  }
  return next;
}

let html = read('index.html').replace('<link rel="icon" href="favicon.ico" />\n', '');
html = substitute(html, '<link rel="stylesheet" crossorigin href="/p/app.css">', `<style>\n${guard(read('app.css'), 'style')}\n</style>`);
html = substitute(
  html,
  '<script type="module" crossorigin src="/p/app.js"></script>',
  `<script type="module">\n${guard(read('app.js'), 'script')}\n</script>`
);

fs.writeFileSync(PAGE, html, 'utf8');
fs.rmSync(OUT, { recursive: true, force: true });

const mb = (Buffer.byteLength(html) / 1024 / 1024).toFixed(2);
console.log(`\nportal.html rebuilt (${mb} MB). Run "npm run preview:open" to open it.`);
