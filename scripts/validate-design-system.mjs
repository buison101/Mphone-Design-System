import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const readJson = async (relative) => JSON.parse(await readFile(path.join(root, relative), 'utf8'));
const pkg = await readJson('package.json');
const core = await readJson('tokens/core.json');
const semantic = await readJson('tokens/semantic.json');
const registry = await readJson('registry/components.json');
const pageContract = await readJson('contracts/page.schema.json');
const vi = await readJson('portal-worktree/app/portal/spa/src/locales/vi.json');
const en = await readJson('portal-worktree/app/portal/spa/src/locales/en.json');

const visitCore = (node, trail = []) => {
  for (const [key, value] of Object.entries(node)) {
    if (key === '$schema') continue;
    const next = [...trail, key];
    if (value && typeof value === 'object' && '$value' in value) {
      if (!value.$type) errors.push(`Token ${next.join('.')} is missing $type`);
      if (value.$value === '') errors.push(`Token ${next.join('.')} has an empty value`);
    } else if (value && typeof value === 'object') visitCore(value, next);
    else errors.push(`Token ${next.join('.')} is not a valid token/group`);
  }
};
visitCore(core);

for (const mode of ['light', 'dark']) {
  for (const group of ['text', 'surface', 'border', 'action']) {
    if (!semantic?.[mode]?.color?.[group]) errors.push(`Semantic tokens missing ${mode}.color.${group}`);
  }
}

const viKeys = new Set(Object.keys(vi));
const enKeys = new Set(Object.keys(en));
for (const key of viKeys) if (!enKeys.has(key)) errors.push(`English locale missing ${key}`);
for (const key of enKeys) if (!viKeys.has(key)) errors.push(`Vietnamese locale missing ${key}`);

if (registry.designSystemVersion !== pkg.version) errors.push('Registry version does not match package version');
for (const field of ['name', 'goal', 'roles', 'permissions', 'data', 'actions', 'states', 'responsive', 'locales']) {
  if (!pageContract.required?.includes(field)) errors.push(`AI page contract is missing required field ${field}`);
}
const generatedCss = await readFile(path.join(root, 'dist/tokens.css'), 'utf8');
if (!generatedCss.includes(`v${pkg.version}`)) errors.push('Generated token CSS version does not match package version');
const names = new Set();
for (const component of registry.components) {
  if (names.has(component.name)) errors.push(`Duplicate component ${component.name}`);
  names.add(component.name);
  if (!['experimental', 'stable', 'deprecated'].includes(component.status)) errors.push(`Invalid status for ${component.name}`);
  try { await access(path.join(root, component.path)); } catch { errors.push(`Missing source for ${component.name}: ${component.path}`); }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}
console.log(`Design System v${pkg.version} valid: ${names.size} components, ${viKeys.size} bilingual messages.`);
