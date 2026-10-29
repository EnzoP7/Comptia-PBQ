/**
 * Translation tooling for the ES → EN dictionary in src/i18n/en.json.
 *
 *   node scripts/i18n.mjs check            list Spanish strings in src/ without a translation (exit 1 if any)
 *   node scripts/i18n.mjs export <file>    write the missing strings as "id<TAB>text" lines
 *   node scripts/i18n.mjs merge <export> <translations>   merge "id<TAB>translation" lines for an export
 *   node scripts/i18n.mjs prune            drop dictionary entries whose Spanish source no longer exists
 *
 * Lines translated as "=" are already valid in English (commands, product names, log lines) and are
 * recorded in scripts/i18n-keep.json so the check stops reporting them.
 *
 * Strings are collected from the source AST: string literals, JSX text, template literals and
 * '+' concatenations. Interpolations become {0}, {1}… placeholders, which the runtime
 * translator (src/i18n/translator.ts) matches as patterns.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAst } from 'rolldown/parseAst';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DICT = path.join(SRC, 'i18n', 'en.json');

export const norm = (s) => s.replace(/\s+/g, ' ').trim();

const ENTITIES = { quot: '"', amp: '&', lt: '<', gt: '>', apos: "'", nbsp: ' ', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’' };
/** JSX text keeps HTML entities in the AST; the DOM shows them decoded. */
const decodeEntities = (s) =>
  s.replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (m, e) =>
    e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENTITIES[e] ?? m
  );

const KEEP = path.join(ROOT, 'scripts', 'i18n-keep.json');

/** Identifiers, CSS class lists, kebab/snake ids and similar strings that are never shown as prose. */
const SPANISH_WORDS = /\b(de|del|la|el|los|las|en|y|o|sin|con|para|por|que|queda|otros|todos|archivo|archivos|solo|acceso|relacionado)\b/;

export function isCode(s) {
  const tokens = s.split(' ');
  if (tokens.length === 1 && /^[a-z][a-zA-Z0-9_]*$/.test(s)) return true;
  if (tokens.length > 1 && SPANISH_WORDS.test(s)) return false;
  return tokens.every((t) => /^[a-z0-9!:/[\]().%_#{}=>-]+$/.test(t)) && tokens.some((t) => /[-:_/{]/.test(t));
}

const SKIP_ATTRS = new Set(['className', 'key', 'id', 'type', 'href', 'src', 'htmlFor', 'name', 'role', 'value', 'd', 'viewBox', 'fill', 'stroke', 'strokeWidth', 'style', 'xmlns', 'autoComplete', 'inputMode', 'spellCheck', 'target', 'rel', 'translate']);

function walk(node, visit, parent) {
  if (!node || typeof node.type !== 'string') return;
  if (visit(node, parent) === false) return;
  for (const key in node) {
    if (key === 'type' || key === 'start' || key === 'end' || key === 'range' || key === 'loc') continue;
    const v = node[key];
    if (Array.isArray(v)) v.forEach((c) => c && typeof c === 'object' && walk(c, visit, node));
    else if (v && typeof v === 'object') walk(v, visit, node);
  }
}

/** Flattens a '+' chain into string parts and placeholders, or null when it has no string literal. */
function concatParts(node) {
  const parts = [];
  const flat = (n) => {
    if (n.type === 'BinaryExpression' && n.operator === '+') {
      flat(n.left);
      flat(n.right);
    } else if (n.type === 'Literal' && typeof n.value === 'string') parts.push({ s: n.value });
    else if (n.type === 'TemplateLiteral') {
      n.quasis.forEach((q, i) => {
        parts.push({ s: q.value.cooked ?? q.value.raw });
        if (i < n.expressions.length) parts.push(null);
      });
    } else parts.push(null);
  };
  flat(node);
  if (!parts.some((p) => p && p.s.trim())) return null;
  let i = 0;
  return parts.map((p) => (p ? p.s : `{${i++}}`)).join('');
}

function collectFile(file, out) {
  const code = fs.readFileSync(file, 'utf8');
  const ast = parseAst(code, { lang: file.endsWith('.tsx') ? 'tsx' : 'ts' }, file);
  // JSX text is always shown to the user, so it skips the identifier filter.
  const add = (s, jsx = false) => {
    const k = norm(s);
    if (!k || !(jsx ? /[a-zA-ZáéíóúñÁÉÍÓÚÑ]/ : /[a-zA-ZáéíóúñÁÉÍÓÚÑ]{2}/).test(k) || (!jsx && isCode(k))) return;
    if (!out.has(k)) out.set(k, path.relative(ROOT, file).replace(/\\/g, '/'));
  };
  walk(ast, (node, parent) => {
    if (node.type === 'ImportDeclaration' || node.type === 'ExportAllDeclaration') return false;
    if (node.type === 'JSXAttribute' && SKIP_ATTRS.has(node.name?.name)) return false;
    if (node.type === 'Property' && parent && node.key && !node.computed) {
      const keyName = node.key.name ?? node.key.value;
      if (keyName === 'id' || keyName === 'className' || keyName === 'value' && typeof node.value?.value === 'string' && !/\s/.test(node.value.value)) return false;
    }
    if (node.type === 'BinaryExpression' && node.operator === '+') {
      const p = concatParts(node);
      if (p !== null) {
        add(p);
        return false;
      }
    }
    if (node.type === 'TemplateLiteral') {
      const p = concatParts(node);
      if (p !== null) add(p);
      return true; // nested expressions may hold more strings
    }
    if (node.type === 'Literal' && typeof node.value === 'string') add(node.value);
    if (node.type === 'JSXText') add(decodeEntities(node.value), true);
    return true;
  });
}

export function collect() {
  const out = new Map();
  const files = [];
  const scan = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) scan(p);
      else if (/\.tsx?$/.test(e.name) && !e.name.endsWith('.d.ts')) files.push(p);
    }
  };
  scan(SRC);
  files.sort().forEach((f) => collectFile(f, out));
  return out;
}

const loadDict = () => (fs.existsSync(DICT) ? JSON.parse(fs.readFileSync(DICT, 'utf8')) : {});
const saveDict = (d) => {
  const sorted = Object.fromEntries(Object.keys(d).sort().map((k) => [k, d[k]]));
  fs.writeFileSync(DICT, JSON.stringify(sorted, null, 1) + '\n');
};

const [cmd, arg] = process.argv.slice(2);
const strings = collect();
const dict = loadDict();
const keep = new Set(fs.existsSync(KEEP) ? JSON.parse(fs.readFileSync(KEEP, 'utf8')) : []);
const saveKeep = () => fs.writeFileSync(KEEP, JSON.stringify([...keep].filter((k) => strings.has(k)).sort(), null, 1) + '\n');
const missing = [...strings.entries()].filter(([k]) => !(k in dict) && !keep.has(k));

if (cmd === 'check') {
  for (const [k, f] of missing) console.log(`${f}: ${k.slice(0, 140)}`);
  console.log(`\n${strings.size} strings, ${missing.length} missing, ${Object.keys(dict).length} in dictionary`);
  process.exit(missing.length ? 1 : 0);
} else if (cmd === 'export') {
  const lines = missing.map(([k, f], i) => `${i}\t${f}\t${k}`);
  fs.writeFileSync(arg, lines.join('\n') + '\n');
  console.log(`exported ${missing.length} strings to ${arg}`);
} else if (cmd === 'merge') {
  const exported = new Map();
  for (const l of fs.readFileSync(arg, 'utf8').split('\n').filter(Boolean)) {
    const [id, , ...rest] = l.split('\t');
    exported.set(id, rest.join('\t'));
  }
  let n = 0;
  for (const l of fs.readFileSync(process.argv[4], 'utf8').split(/\r?\n/)) {
    const m = l.match(/^(\d+)[\t|](.*)$/);
    if (!m || !exported.has(m[1])) continue;
    const value = m[2].trim();
    if (value === '=' || value === exported.get(m[1])) keep.add(exported.get(m[1]));
    else dict[exported.get(m[1])] = value;
    n++;
  }
  saveDict(dict);
  saveKeep();
  console.log(`merged ${n} translations`);
} else if (cmd === 'prune') {
  let n = 0;
  for (const k of Object.keys(dict)) if (!strings.has(k)) (delete dict[k], n++);
  saveDict(dict);
  saveKeep();
  console.log(`pruned ${n} entries`);
} else {
  console.log('usage: node scripts/i18n.mjs check|export <file>|merge <export> <translations>|prune');
}
