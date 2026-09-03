// Shared helpers for the MPO Design i18n toolchain.
// See docs/15-mpo-design-implementation-plan.vi.md §4.7.
//
// Nothing here guesses. The extractor PROPOSES candidates for a human to
// approve; the plugin only ever substitutes positions listed in the keymap.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';

const traverse = _traverse.default ?? _traverse;

export const ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
export const SRC = path.join(ROOT, 'src');
export const KEYMAP_PATH = path.join(ROOT, 'i18n', 'keymap.json');
export const CATALOG_DIR = path.join(ROOT, 'src', 'locales-mphone');
export const VENDOR_CATALOG_DIR = path.join(ROOT, 'src', 'utils', 'locales');

// Project-owned directories: never scanned, never substituted.
const SKIP_DIRS = new Set(['node_modules', 'locales-mphone', 'i18n']);

// Attribute names whose string value reaches a user. Curated on purpose:
// widening this list is a decision, not a convenience.
export const DISPLAY_PROPS = new Set([
  'title',
  'label',
  'placeholder',
  'helperText',
  'subheading',
  'secondary',
  'primary',
  'caption',
  'description',
  'heading',
  'subtitle',
  'buttonText',
  'tooltip',
  'alt',
  'header',
  'message',
  'emptyText',
  // <EmptyTable msg="No Data" /> — the vendor's own empty-state prop.
  'msg',
  // Pre-filled sample values in the profile forms: names, an address, a bio.
  // Numbers, emails and URLs in the same prop are filtered out by
  // looksLikeDisplayString, so this does not drag data in.
  'defaultValue',
  // The statistics widgets pass their sub-caption as `content`. MainCard's
  // boolean `content={false}` is an expression, not a string, so it is ignored.
  'content',
  'aria-label',
  'ariaLabel'
]);

// Object-property names that hold display strings in vendor data arrays, e.g.
//   const layouts = [{ value: ..., label: 'Mini Drawer', img: ... }]
// These are detected so that coverage is honest, but they are NOT substituted
// at build time: such arrays are usually evaluated once at module scope, so a
// substituted call would freeze the first language it saw and never react to a
// locale change. Each needs a per-case decision — see docs/15 §4.7.
export const DISPLAY_OBJECT_PROPS = new Set([
  'label',
  'title',
  'name',
  'text',
  'caption',
  'description',
  'subtitle',
  'placeholder',
  'heading',
  'message',
  // react-table and MUI DataGrid column definitions. Without these the whole
  // column header row of every react-table page stayed invisible to the
  // scanner and rendered in English while coverage reported 100%.
  'header',
  'footer',
  'headerName',
  // The FAQ dataset: sixteen questions sitting in plain sight on the page and
  // invisible to every rule until these two lines existed.
  'question',
  'answer',
  // Job titles in the organisation-chart dataset. ARIA values like
  // role: 'button' are all-lowercase and already filtered out by
  // looksLikeDisplayString.
  'role'
]);

/** Display-string candidate: has a letter AND (an uppercase letter OR a space). */
export function looksLikeDisplayString(value, opts = {}) {
  const v = String(value).trim();
  // The upper bound is a guard against code samples, not against prose. At 200
  // it silently swallowed the profile bio — a 235-character paragraph sitting
  // in plain sight on the account page — so it is set where a real paragraph
  // still fits and a source listing does not.
  if (v.length < 2 || v.length > 700) return false;
  if (!/[A-Za-z]/.test(v)) return false;
  if (/^(https?:|\/|#|data:|mailto:)/.test(v)) return false;
  // A sample email address is a vendor sample identity (§4.8), and every rule
  // below would throw it away: no capital, no space, all lowercase.
  if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v)) return true;
  // A single all-lowercase word is normally an identifier, a css value or a
  // file name — except in JSX text, which is rendered prose by definition.
  // `browse` inside `click <span>browse</span> through your machine` is a word
  // a reader sees, and dropping it leaves an English island mid-sentence.
  if (opts.jsxText && /^[a-z]+$/.test(v)) return true;
  if (/^[a-z0-9._-]+$/.test(v)) return false;
  return /[A-Z]/.test(v) || /\s/.test(v);
}

export function walkFiles(dir = SRC) {
  // A scope may be a single file, not only a directory.
  if (fs.existsSync(dir) && fs.statSync(dir).isFile()) {
    return /\.(jsx|js)$/.test(dir) ? [dir] : [];
  }
  const out = [];
  (function rec(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (!SKIP_DIRS.has(e.name)) rec(path.join(d, e.name));
      } else if (/\.(jsx|js)$/.test(e.name)) {
        out.push(path.join(d, e.name));
      }
    }
  })(dir);
  return out.sort();
}

export function rel(file, root = ROOT) {
  return path.relative(root, file).split(path.sep).join('/');
}

export function parseFile(code) {
  return parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'importAttributes', 'topLevelAwait'],
    errorRecovery: true
  });
}

/**
 * Collect every display-string candidate in one file.
 * Returns [{ occurrence, source, start, end, line, index }]; start/end are the
 * offsets of the exact text to replace, index the ordinal of this
 * (occurrence, source) pair within the file.
 */
const WS_ENTITY = '(?:\\s|&nbsp;|&#160;|&#xa0;|&#xA0;|&emsp;|&ensp;|&thinsp;)';
const EDGE_WS_START = new RegExp('^' + WS_ENTITY + '*');
const EDGE_WS_END = new RegExp(WS_ENTITY + '*$');

const DATA_FILES_PATH = path.join(ROOT, 'i18n', 'data-files.json');
const DATA_ONLY_PATHS = fs.existsSync(DATA_FILES_PATH) ? Object.keys(JSON.parse(fs.readFileSync(DATA_FILES_PATH, 'utf8')).paths ?? {}) : [];

/**
 * True when a file holds reference or sample data rather than interface text —
 * a country list, a film catalogue, a set of coordinates. Translating those is
 * a data decision for the product stage, and a wrong one is a data error, not a
 * wording error. See i18n/data-files.json for the reason on each path.
 */
export function isDataOnlyFile(relFile) {
  return DATA_ONLY_PATHS.some((prefix) => relFile === prefix || relFile.startsWith(prefix + '/'));
}

const ID_FILES_PATH = path.join(ROOT, 'i18n', 'id-files.json');
const ID_ONLY_PATHS = fs.existsSync(ID_FILES_PATH) ? Object.keys(JSON.parse(fs.readFileSync(ID_FILES_PATH, 'utf8')).paths ?? {}) : [];

/**
 * True when a file's display-looking strings are message ids rather than
 * display text — a menu definition, for instance, whose `title` is handed
 * straight to <FormattedMessage id={...} />. Translating those in source does
 * not translate anything; it breaks the lookup and puts a raw id on screen.
 */
export function isIdOnlyFile(relFile) {
  return ID_ONLY_PATHS.some((prefix) => relFile === prefix || relFile.startsWith(prefix + '/'));
}

const CALL_ARGS_PATH = path.join(ROOT, 'i18n', 'call-arguments.json');
const CALL_ARG_FUNCTIONS = fs.existsSync(CALL_ARGS_PATH)
  ? new Set(Object.keys(JSON.parse(fs.readFileSync(CALL_ARGS_PATH, 'utf8')).functions ?? {}))
  : new Set();

/**
 * A template literal in a display position becomes one message with named ICU
 * arguments: `${selected} row(s) selected` -> `{selected} row(s) selected`,
 * carrying the expression source so the plugin can pass the value back in.
 *
 * Rejected when the static halves hold no words — `${percentage}%` and
 * `${title} ${name}` are punctuation and data, not a sentence to translate.
 */
function readTemplate(node, code) {
  const expressions = node.expressions ?? [];
  if (!expressions.length) return null;
  const quasis = (node.quasis ?? []).map((q) => q.value.cooked ?? q.value.raw);
  const staticText = quasis.join(' ').trim();
  if (!/[A-Za-z]{2}/.test(staticText)) return null;
  // `${code.toLowerCase()}.png` is a file name, not a sentence.
  if (/^\.[A-Za-z]{2,4}$/.test(staticText)) return null;

  const args = [];
  const taken = new Set();
  let message = '';
  for (let i = 0; i < quasis.length; i += 1) {
    message += quasis[i];
    const expression = expressions[i];
    if (!expression) continue;
    const source = code.slice(expression.start, expression.end);
    const words = source
      .replace(/[^A-Za-z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    let name = words.length
      ? words[0].toLowerCase() +
        words
          .slice(1)
          .map((w) => w[0].toUpperCase() + w.slice(1))
          .join('')
      : 'value' + i;
    if (/^[0-9]/.test(name) || !name) name = 'value' + i;
    while (taken.has(name)) name += 'X';
    taken.add(name);
    args.push({ name, source });
    message += '{' + name + '}';
  }
  // ICU treats an apostrophe before `{`, `}` or `#` as the start of a quoted
  // run, so `Category '{category}'` would render the braces literally instead
  // of substituting. Doubling it is the ICU escape and still prints one quote.
  return { message: message.trim().replace(/'(?=[{}#])/g, "''"), args };
}

export function collectCandidates(code) {
  let ast;
  try {
    ast = parseFile(code);
  } catch {
    return [];
  }
  const found = [];
  const seen = new Map();

  // Identifiers that end up on screen: anything named inside a JSX expression
  // container. `let title; switch (status) { case 2: title = 'Rejected'; }`
  // renders through `{title}`, and without this pass the whole status vocabulary
  // of the dashboard stayed invisible to the scanner.
  const renderedIdentifiers = new Set();
  traverse(ast, {
    JSXExpressionContainer(p) {
      p.traverse({
        Identifier(q) {
          renderedIdentifiers.add(q.node.name);
        }
      });
      if (p.node.expression?.type === 'Identifier') renderedIdentifiers.add(p.node.expression.name);
    }
  });

  const push = (occurrence, source, start, end, line, extra) => {
    const k = occurrence + ' ' + source;
    const index = seen.get(k) ?? 0;
    seen.set(k, index + 1);
    found.push(Object.assign({ occurrence, source, start, end, line, index }, extra));
  };

  traverse(ast, {
    JSXText(p) {
      // node.value is HTML-entity DECODED, so its length does not match the
      // source span. Offsets must come from the raw slice, or a text like
      // `Don&apos;t have an account?` gets truncated mid-word on substitution.
      const trimmed = p.node.value.trim();
      if (!looksLikeDisplayString(trimmed, { jsxText: true })) return;
      // `&nbsp;` decodes to whitespace, so node.value.trim() drops it while a
      // plain trimStart/trimEnd on the raw slice keeps its six literal
      // characters inside the span. The replacement then eats the space:
      // `Drop files here or click&nbsp;` renders as `bấm chọnbrowse`.
      // Whitespace entities therefore trim like the whitespace they are.
      const rawSlice = code.slice(p.node.start, p.node.end);
      const lead = (rawSlice.match(EDGE_WS_START) ?? [''])[0].length;
      const trail = (rawSlice.match(EDGE_WS_END) ?? [''])[0].length;
      push('text', trimmed, p.node.start + lead, p.node.end - trail, p.node.loc?.start.line ?? 0);
    },
    JSXAttribute(p) {
      const name = p.node.name?.name;
      const value = p.node.value;
      if (!name || !value) return;
      if (!DISPLAY_PROPS.has(name)) return;
      if (value.type === 'StringLiteral') {
        if (!looksLikeDisplayString(value.value)) return;
        push('prop:' + name, value.value, value.start, value.end, p.node.loc?.start.line ?? 0);
        return;
      }
      if (value.type === 'JSXExpressionContainer' && value.expression?.type === 'TemplateLiteral') {
        const tpl = readTemplate(value.expression, code);
        if (!tpl || !looksLikeDisplayString(tpl.message)) return;
        push('tpl:' + name, tpl.message, value.expression.start, value.expression.end, p.node.loc?.start.line ?? 0, {
          args: tpl.args
        });
        return;
      }
      // `title={atTop ? 'Pagination at Top' : 'Pagination at Bottom'}` — the
      // same ternary blind spot as in children position, one level in. Only the
      // literal's own span is substituted, without braces.
      if (value.type !== 'JSXExpressionContainer') return;
      const inFunction = p.getFunctionParent() != null;
      const walk = (n, depth) => {
        if (!n || depth > 4) return;
        if (n.type === 'StringLiteral') {
          if (!looksLikeDisplayString(n.value)) return;
          push('cond:' + name, n.value, n.start, n.end, n.loc?.start.line ?? 0, { moduleScope: !inFunction });
          return;
        }
        if (n.type === 'ConditionalExpression') {
          walk(n.consequent, depth + 1);
          walk(n.alternate, depth + 1);
          return;
        }
        if (n.type === 'LogicalExpression') walk(n.right, depth + 1);
      };
      walk(value.expression, 0);
    },
    ArrayExpression(p) {
      // A bare array of display strings, e.g. ['One End Product', 'JavaScript'].
      // Detected so coverage stops overstating; NOT proposed automatically,
      // because such arrays are often technical (timestamps, enum tokens). A
      // person opts each one into the keymap. See docs/15 §4.7.
      const els = p.node.elements ?? [];
      if (els.length < 2) return;
      if (!els.every((e) => e && e.type === 'StringLiteral')) return;
      if (!els.every((e) => looksLikeDisplayString(e.value))) return;
      const inFunction = p.getFunctionParent() != null;
      for (const e of els) {
        push('arr', e.value, e.start, e.end, e.loc?.start.line ?? 0, { moduleScope: !inFunction, arrayElement: true });
      }
    },
    CallExpression(p) {
      // Sample-data factories opted into i18n/call-arguments.json, e.g.
      // createData('Camera Lens', 40, 2). Display text that sits in no JSX,
      // object or array position, so nothing else here would ever see it.
      const callee = p.node.callee;
      if (callee?.type !== 'Identifier' || !CALL_ARG_FUNCTIONS.has(callee.name)) return;
      const inFunction = p.getFunctionParent() != null;
      for (const arg of p.node.arguments ?? []) {
        if (arg?.type !== 'StringLiteral') continue;
        if (!looksLikeDisplayString(arg.value)) continue;
        push('call:' + callee.name, arg.value, arg.start, arg.end, arg.loc?.start.line ?? 0, {
          moduleScope: !inFunction
        });
      }
    },
    AssignmentExpression(p) {
      // `title = 'Rejected';` inside a function, where `title` is rendered.
      if (p.node.operator !== '=') return;
      const left = p.node.left;
      const right = p.node.right;
      if (left?.type !== 'Identifier' || right?.type !== 'StringLiteral') return;
      if (!renderedIdentifiers.has(left.name)) return;
      if (!p.getFunctionParent()) return;
      if (!looksLikeDisplayString(right.value)) return;
      push('assign:' + left.name, right.value, right.start, right.end, p.node.loc?.start.line ?? 0);
    },
    ObjectProperty(p) {
      const k = p.node.key;
      const v = p.node.value;
      const name = k?.name ?? k?.value;
      if (!name || !DISPLAY_OBJECT_PROPS.has(name)) return;
      if (!v || v.type !== 'StringLiteral') return;
      if (!looksLikeDisplayString(v.value)) return;
      const inFunction = p.getFunctionParent() != null;
      push('obj:' + name, v.value, v.start, v.end, p.node.loc?.start.line ?? 0, { moduleScope: !inFunction });
    },
    JSXExpressionContainer(p) {
      const ex = p.node.expression;
      if (!ex) return;
      if (p.parent?.type !== 'JSXElement' && p.parent?.type !== 'JSXFragment') return;
      if (ex.type === 'StringLiteral') {
        if (!looksLikeDisplayString(ex.value)) return;
        push('expr', ex.value, p.node.start, p.node.end, p.node.loc?.start.line ?? 0);
        return;
      }
      if (ex.type === 'TemplateLiteral') {
        const tpl = readTemplate(ex, code);
        if (!tpl || !looksLikeDisplayString(tpl.message)) return;
        push('tpl', tpl.message, ex.start, ex.end, p.node.loc?.start.line ?? 0, { args: tpl.args });
        return;
      }
      // `{done ? 'Place order' : 'Next'}` — a ternary or `&&` chain in children
      // position. Each string branch is its own display string with its own
      // context, and the whole container cannot be replaced because the
      // condition has to keep running. Only the literal's own span is
      // substituted, and without braces: it already sits inside the container.
      const inFunction = p.getFunctionParent() != null;
      const walk = (n, depth) => {
        if (!n || depth > 4) return;
        if (n.type === 'StringLiteral') {
          if (!looksLikeDisplayString(n.value)) return;
          push('cond', n.value, n.start, n.end, n.loc?.start.line ?? 0, { moduleScope: !inFunction });
          return;
        }
        if (n.type === 'ConditionalExpression') {
          walk(n.consequent, depth + 1);
          walk(n.alternate, depth + 1);
          return;
        }
        if (n.type === 'LogicalExpression') {
          walk(n.right, depth + 1);
        }
      };
      walk(ex, 0);
    }
  });

  return found;
}

export function loadKeymap() {
  if (!fs.existsSync(KEYMAP_PATH)) return { version: 1, entries: [] };
  return JSON.parse(fs.readFileSync(KEYMAP_PATH, 'utf8'));
}

export function saveKeymap(km) {
  fs.mkdirSync(path.dirname(KEYMAP_PATH), { recursive: true });
  fs.writeFileSync(KEYMAP_PATH, JSON.stringify(km, null, 2) + '\n');
}

/** Group keymap entries by vendor file path. */
export function keymapByFile(km) {
  const m = new Map();
  for (const e of km.entries ?? []) {
    if (!m.has(e.file)) m.set(e.file, []);
    m.get(e.file).push(e);
  }
  return m;
}

/**
 * Match keymap entries against candidates found in a file.
 * An entry applies to every candidate sharing its (occurrence, source),
 * unless it pins a specific `index`.
 */
export function matchEntries(entries, candidates) {
  const hits = [];
  const unmatched = [];
  for (const e of entries) {
    const found = candidates.filter(
      (c) => c.occurrence === e.occurrence && c.source === e.source && (e.index === undefined || c.index === e.index)
    );
    if (found.length === 0) unmatched.push(e);
    for (const c of found) hits.push({ entry: e, candidate: c });
  }
  return { hits, unmatched };
}

export function loadCatalog(locale) {
  const p = path.join(CATALOG_DIR, locale + '.json');
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function saveCatalog(locale, obj) {
  fs.mkdirSync(CATALOG_DIR, { recursive: true });
  const sorted = Object.fromEntries(
    Object.keys(obj)
      .sort()
      .map((k) => [k, obj[k]])
  );
  fs.writeFileSync(path.join(CATALOG_DIR, locale + '.json'), JSON.stringify(sorted, null, 2) + '\n');
}

export function readFile(f) {
  return fs.readFileSync(f, 'utf8');
}

/**
 * Collect string literals used as IDENTIFIERS in a file: object keys, and
 * operands of === / !== comparisons.
 *
 * A display string that also appears here is load-bearing: translating it
 * silently breaks whatever looks it up. This is how `SalesChart` lost every
 * series in Vietnamese — its visibility state was keyed by the series label.
 */
export function collectIdentifierUses(code) {
  let ast;
  try {
    ast = parseFile(code);
  } catch {
    return new Set();
  }
  const out = new Set();
  traverse(ast, {
    ObjectProperty(p) {
      const k = p.node.key;
      if (k?.type === 'StringLiteral') out.add(k.value);
      else if (k?.type === 'Identifier' && !p.node.computed) out.add(k.name);
    },
    MemberExpression(p) {
      if (p.node.computed && p.node.property?.type === 'StringLiteral') out.add(p.node.property.value);
    },
    BinaryExpression(p) {
      if (!['===', '!==', '==', '!='].includes(p.node.operator)) return;
      for (const side of [p.node.left, p.node.right]) {
        if (side?.type === 'StringLiteral') out.add(side.value);
      }
    }
  });
  return out;
}
