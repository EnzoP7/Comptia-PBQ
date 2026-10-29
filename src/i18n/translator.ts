/**
 * Spanish → English translation of the rendered page.
 *
 * The app is authored in Spanish and its grading logic compares Spanish values, so English is
 * applied to what the user sees instead of to the data: every text node and user-facing
 * attribute is looked up in the dictionary (src/i18n/en.json, built with scripts/i18n.mjs) and
 * rewritten in place. React keeps its own Spanish values, so answers, grading and saved progress
 * are identical in both languages.
 *
 * Keys are whitespace-normalized source strings. Keys with {0}, {1}… placeholders come from
 * template literals and match strings with interpolated values; each captured value is
 * translated too.
 */

type Dictionary = Record<string, string>;

interface Pattern {
  regex: RegExp;
  anchor: string;
  template: string;
}

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

let exact: Map<string, string> | null = null;
let patterns: Pattern[] = [];
const cache = new Map<string, string | null>();

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
}

function compile(dict: Dictionary) {
  exact = new Map();
  patterns = [];
  for (const [key, value] of Object.entries(dict)) {
    if (!/\{\d+\}/.test(key)) {
      exact.set(key, value);
      continue;
    }
    const literals = key.split(/\{\d+\}/);
    const order = [...key.matchAll(/\{(\d+)\}/g)].map((m) => Number(m[1]));
    let source = '^';
    literals.forEach((lit, i) => {
      source += escapeRegex(lit);
      if (i < order.length) source += '([\\s\\S]+?)';
    });
    // Normalize the {n} in the template so they refer to capture positions.
    let template = value;
    order.forEach((n, pos) => {
      template = template.split(`{${n}}`).join(`\u0000${pos}\u0000`);
    });
    patterns.push({
      regex: new RegExp(source + '$'),
      anchor: literals.reduce((a, b) => (b.trim().length > a.length ? b.trim() : a), ''),
      template,
    });
  }
  // Most specific (longest literal text) first.
  patterns.sort((a, b) => b.anchor.length - a.anchor.length);
}

export async function loadDictionary(): Promise<void> {
  if (exact) return;
  const mod = await import('./en.json');
  compile(mod.default as Dictionary);
}

/** English for a Spanish UI string, or null when the dictionary has none. */
export function lookup(text: string, depth = 0): string | null {
  if (!exact) return null;
  const key = norm(text);
  if (!key) return null;
  const direct = exact.get(key);
  if (direct !== undefined) return direct;
  if (cache.has(key)) return cache.get(key)!;
  let result: string | null = null;
  if (depth < 4) {
    for (const p of patterns) {
      if (p.anchor && !key.includes(p.anchor)) continue;
      const m = key.match(p.regex);
      if (!m) continue;
      result = p.template.replace(/\u0000(\d+)\u0000/g, (_, pos) => {
        const captured = m[Number(pos) + 1];
        return lookup(captured, depth + 1) ?? captured;
      });
      break;
    }
    if (result === null) result = lookupComposite(key, depth);
  }
  cache.set(key, result);
  return result;
}

/** Separators used to build feedback out of smaller strings ("label: value", "a · b", "x → y"). */
const SEPARATORS = [' · ', ' → ', ' — ', '. ', ': '];

/**
 * Strings assembled at runtime from translatable pieces: text wrapped in quotes, a trailing
 * counter ("Section #3") or parts joined by a separator. Translates whatever pieces it can.
 */
function lookupComposite(key: string, depth: number): string | null {
  const quoted = key.match(/^(["“'])([\s\S]+)(["”'])$/);
  if (quoted) {
    const inner = lookup(quoted[2], depth + 1);
    return inner === null ? null : quoted[1] + inner + quoted[3];
  }
  const counter = key.match(/^(.*[^\d#\s])(\s*#?\d+)$/);
  if (counter) {
    const head = lookup(counter[1], depth + 1);
    if (head !== null) return head + counter[2];
  }
  for (const sep of SEPARATORS) {
    if (!key.includes(sep)) continue;
    const parts = sep === ': ' ? [key.slice(0, key.indexOf(sep)), key.slice(key.indexOf(sep) + sep.length)] : key.split(sep);
    let changed = false;
    const out = parts.map((part) => {
      const t = lookup(part, depth + 1);
      if (t === null) return part;
      changed = true;
      return t;
    });
    if (changed) return out.join(sep);
  }
  return null;
}

/** Translates each line of a multi-line text on its own; null when no line changed. */
function translateLines(text: string): string | null {
  let changed = false;
  const lines = text.split('\n').map((line) => {
    const tl = line.trim() ? translatePreserving(line) : null;
    if (tl === null) return line;
    changed = true;
    return tl;
  });
  return changed ? lines.join('\n') : null;
}

/**
 * Translates keeping the original leading/trailing whitespace. Multi-line text prefers an exact
 * whole-text entry, then line by line, and only then a partial (composite) whole-text match.
 */
function translatePreserving(text: string): string | null {
  const multiline = text.trim().includes('\n');
  if (multiline && !exact?.has(norm(text))) {
    const byLines = translateLines(text);
    if (byLines !== null) return byLines;
  }
  const t = lookup(text);
  if (t === null) return null;
  const lead = text.match(/^\s*/)![0];
  const trail = text.match(/\s*$/)![0];
  return lead + t + trail;
}

// ---------------------------------------------------------------------------
// DOM
// ---------------------------------------------------------------------------

const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT']);

/** Spanish source of each node we rewrote, and the English we wrote into it. */
const textState = new WeakMap<Text, { source: string; written: string }>();
const attrState = new WeakMap<Element, Record<string, { source: string; written: string }>>();
const touchedText = new Set<WeakRef<Text>>();
const touchedElements = new Set<WeakRef<Element>>();

let observer: MutationObserver | null = null;

function skipped(el: Element | null): boolean {
  for (let e = el; e; e = e.parentElement) {
    if (SKIP_TAGS.has(e.tagName) || e.getAttribute('translate') === 'no' || (e as HTMLElement).isContentEditable) return true;
  }
  return false;
}

function handleText(node: Text) {
  const value = node.nodeValue ?? '';
  const state = textState.get(node);
  if (state && value === state.written) return;
  if (!value.trim() || skipped(node.parentElement)) return;
  const translated = translatePreserving(value);
  if (translated === null || translated === value) {
    textState.delete(node);
    return;
  }
  if (!state) touchedText.add(new WeakRef(node));
  textState.set(node, { source: value, written: translated });
  node.nodeValue = translated;
}

function handleAttr(el: Element, attr: string) {
  const value = el.getAttribute(attr);
  if (value === null || !value.trim()) return;
  const states = attrState.get(el) ?? {};
  if (states[attr] && value === states[attr].written) return;
  const translated = translatePreserving(value);
  if (translated === null || translated === value) {
    delete states[attr];
    return;
  }
  if (!attrState.has(el)) touchedElements.add(new WeakRef(el));
  states[attr] = { source: value, written: translated };
  attrState.set(el, states);
  el.setAttribute(attr, translated);
}

function handleElement(el: Element) {
  if (skipped(el)) return;
  for (const attr of ATTRS) if (el.hasAttribute(attr)) handleAttr(el, attr);
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) =>
      n.nodeType === Node.ELEMENT_NODE && (SKIP_TAGS.has((n as Element).tagName) || (n as Element).getAttribute('translate') === 'no')
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeType === Node.TEXT_NODE) handleText(n as Text);
    else for (const attr of ATTRS) if ((n as Element).hasAttribute(attr)) handleAttr(n as Element, attr);
  }
}

export function startDomTranslation(root: Element = document.body) {
  if (observer || !exact) return;
  handleElement(root);
  observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'characterData') handleText(r.target as Text);
      else if (r.type === 'attributes') handleAttr(r.target as Element, r.attributeName!);
      else
        r.addedNodes.forEach((n) => {
          if (n.nodeType === Node.TEXT_NODE) handleText(n as Text);
          else if (n.nodeType === Node.ELEMENT_NODE) handleElement(n as Element);
        });
    }
  });
  observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
}

/** Stops translating and puts every rewritten string back in Spanish. */
export function stopDomTranslation() {
  observer?.disconnect();
  observer = null;
  for (const ref of touchedText) {
    const node = ref.deref();
    const state = node && textState.get(node);
    if (node && state && node.nodeValue === state.written) node.nodeValue = state.source;
    if (node) textState.delete(node);
  }
  for (const ref of touchedElements) {
    const el = ref.deref();
    const states = el && attrState.get(el);
    if (el && states) {
      for (const [attr, s] of Object.entries(states)) if (el.getAttribute(attr) === s.written) el.setAttribute(attr, s.source);
      attrState.delete(el);
    }
  }
  touchedText.clear();
  touchedElements.clear();
}
