import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const core = JSON.parse(await readFile(path.join(root, 'tokens/core.json'), 'utf8'));
const semantic = JSON.parse(await readFile(path.join(root, 'tokens/semantic.json'), 'utf8'));
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));

const flatten = (node, prefix = [], output = {}) => {
  for (const [key, value] of Object.entries(node)) {
    if (key === '$schema') continue;
    const next = [...prefix, key];
    if (value && typeof value === 'object' && '$value' in value) output[next.join('-')] = value.$value;
    else if (value && typeof value === 'object') flatten(value, next, output);
  }
  return output;
};

const lines = [`/* @mphone/design-system v${pkg.version} — generated; do not edit */`, ':root {'];
for (const [name, value] of Object.entries(flatten(core))) lines.push(`  --mphone-${name}: ${value};`);
lines.push('}');
for (const mode of ['light', 'dark']) {
  lines.push(`[data-mphone-theme="${mode}"] {`);
  const values = flatten(semantic[mode]);
  for (const [name, value] of Object.entries(values)) lines.push(`  --mphone-${name}: ${value};`);
  lines.push('}');
}

await mkdir(path.join(root, 'dist'), { recursive: true });
await writeFile(path.join(root, 'dist/tokens.css'), `${lines.join('\n')}\n`);
await writeFile(path.join(root, 'dist/tokens.json'), `${JSON.stringify({ version: pkg.version, core, semantic }, null, 2)}\n`);
console.log(`Built @mphone/design-system tokens v${pkg.version}`);
