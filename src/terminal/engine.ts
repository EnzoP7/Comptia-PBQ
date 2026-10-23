/**
 * Minimal Linux shell simulator for terminal PBQs. `runCommand` takes the current server
 * state and one command line, and returns a new state with the output appended.
 * Supports pipes, `sudo`, and stderr redirections to /dev/null.
 */
import { TerminalState, VNode } from './types';
import { toSymbolic } from '../utils/linuxPermissions';
import { ipMatches } from '../utils/firewallSim';

const MAX_LINES = 400;

interface Result {
  out: string;
  err?: string;
}
type Cmd = (args: string[], ctx: Ctx) => Result;
interface Ctx {
  s: TerminalState;
  stdin: string | null;
}

// ---------- helpers ----------

/** Deterministic stand-in for a digest: stable per content, different when content changes. */
export function fakeHash(content: string, length: 64 | 32 = 64): string {
  let out = '';
  let seed = 0x811c9dc5;
  while (out.length < length) {
    let h = seed;
    for (let i = 0; i < content.length; i++) {
      h ^= content.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    out += h.toString(16).padStart(8, '0');
    seed = (seed + 0x9e3779b9) >>> 0;
  }
  return out.slice(0, length);
}

export function resolvePath(cwd: string, p?: string): string {
  if (!p) return cwd;
  let path = p;
  if (path === '~' || path.startsWith('~/')) path = '/root' + path.slice(1);
  const abs = path.startsWith('/') ? path : `${cwd}/${path}`;
  const parts: string[] = [];
  for (const part of abs.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') parts.pop();
    else parts.push(part);
  }
  return '/' + parts.join('/');
}

const parentOf = (p: string) => (p === '/' ? '/' : p.slice(0, p.lastIndexOf('/')) || '/');
const baseName = (p: string) => p.slice(p.lastIndexOf('/') + 1) || '/';
const childrenOf = (s: TerminalState, dir: string) => Object.keys(s.fs).filter((k) => k !== dir && parentOf(k) === dir).sort();
const descendantsOf = (s: TerminalState, dir: string) =>
  Object.keys(s.fs).filter((k) => k === dir || k.startsWith(dir === '/' ? '/' : dir + '/')).sort();

function tokenize(line: string): string[] {
  const tokens: string[] = [];
  let cur = '';
  let quote: string | null = null;
  let has = false;
  for (const ch of line) {
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      has = true;
    } else if (/\s/.test(ch)) {
      if (cur || has) tokens.push(cur);
      cur = '';
      has = false;
    } else {
      cur += ch;
    }
  }
  if (cur || has) tokens.push(cur);
  return tokens;
}

function splitPipes(line: string): string[] {
  const parts: string[] = [];
  let cur = '';
  let quote: string | null = null;
  for (const ch of line) {
    if (quote) {
      if (ch === quote) quote = null;
      cur += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      cur += ch;
    } else if (ch === '|') {
      parts.push(cur);
      cur = '';
    } else cur += ch;
  }
  parts.push(cur);
  return parts.map((p) => p.trim());
}

const flagsOf = (args: string[]) => args.filter((a) => a.startsWith('-') && a.length > 1).join('');
const operands = (args: string[]) => args.filter((a) => !(a.startsWith('-') && a.length > 1));
const lines = (text: string) => (text === '' ? [] : text.replace(/\n$/, '').split('\n'));
const readInput = (ctx: Ctx, files: string[], cmd: string): Result & { text?: string } => {
  if (!files.length) return { out: '', text: ctx.stdin ?? '' };
  let text = '';
  for (const f of files) {
    const node = ctx.s.fs[resolvePath(ctx.s.cwd, f)];
    if (!node) return { out: '', err: `${cmd}: ${f}: No such file or directory` };
    if (node.type === 'dir') return { out: '', err: `${cmd}: ${f}: Is a directory` };
    text += (node.content ?? '').replace(/\n?$/, '\n');
  }
  return { out: '', text };
};

/** Parses -n N / -N for head and tail; the rest are files. */
function countArgs(args: string[]): { n: number; files: string[] } {
  let n = 10;
  const files: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-n') n = Number(args[++i]);
    else if (/^-\d+$/.test(args[i])) n = Number(args[i].slice(1));
    else if (/^-n\d+$/.test(args[i])) n = Number(args[i].slice(2));
    else files.push(args[i]);
  }
  return { n: Number.isFinite(n) ? n : 10, files };
}

// ---------- commands ----------

const HELP = `Comandos disponibles en este servidor simulado:
  Archivos:   ls [-la] · cd · pwd · cat · head [-n N] · tail [-n N] · find · rm [-rf]
  Texto:      grep [-i -v -c -n -r] · sort [-n -r] · uniq [-c] · cut -d X -f N · awk '{print $N}' · wc [-l] · echo
  Permisos:   chmod (octal o simbólico, ej. 640, u-s, o-rwx) · chown usuario[:grupo]
  Procesos:   ps aux · kill [-9] PID · pkill NOMBRE
  Red:        netstat -tulpn · ss -tunap · ip a
  Seguridad:  sha256sum · md5sum · iptables · ufw · crontab -l/-r [-u usuario]
  Servicios:  systemctl status|stop|start|disable|enable SERVICIO
  Cuentas:    usermod -L · passwd -l · userdel · id · whoami
  Shell:      history · clear · sudo · tuberías con |   (↑/↓ historial, Tab autocompleta)`;

function lsLine(name: string, node: VNode) {
  const size = node.type === 'dir' ? 4096 : (node.content ?? '').length;
  return `${toSymbolic(node.mode, node.type === 'dir')} 1 ${node.owner.padEnd(8)} ${node.group.padEnd(8)} ${String(size).padStart(6)} Oct 22 09:14 ${name}`;
}

function parseSymbolic(spec: string, mode: number): number | null {
  let next = mode;
  for (const clause of spec.split(',')) {
    const m = clause.match(/^([ugoa]*)([+\-=])([rwxst]*)$/);
    if (!m) return null;
    const who = m[1] === '' || m[1].includes('a') ? 'ugo' : m[1];
    let bits = 0;
    let clear = 0;
    for (const w of who) {
      const shift = w === 'u' ? 6 : w === 'g' ? 3 : 0;
      clear |= 7 << shift;
      for (const p of m[3]) {
        if (p === 'r') bits |= 4 << shift;
        if (p === 'w') bits |= 2 << shift;
        if (p === 'x') bits |= 1 << shift;
        if (p === 's' && w === 'u') bits |= 0o4000;
        if (p === 's' && w === 'g') bits |= 0o2000;
        if (p === 't') bits |= 0o1000;
      }
      if (m[2] === '=') {
        if (w === 'u') clear |= 0o4000;
        if (w === 'g') clear |= 0o2000;
        if (w === 'o') clear |= 0o1000;
      }
    }
    if (m[2] === '+') next |= bits;
    else if (m[2] === '-') next &= ~bits;
    else next = (next & ~clear) | bits;
  }
  return next;
}

function permMatcher(spec: string): ((mode: number) => boolean) | null {
  const symbolic: Record<string, number> = { 'u=s': 0o4000, 'u+s': 0o4000, 'g=s': 0o2000, 'g+s': 0o2000, 'o+w': 0o002, 'o=w': 0o002, 'a+w': 0o222 };
  const prefix = spec[0] === '-' || spec[0] === '/' ? spec[0] : '';
  const body = prefix ? spec.slice(1) : spec;
  const bits = symbolic[body] ?? (/^[0-7]{1,4}$/.test(body) ? parseInt(body, 8) : NaN);
  if (Number.isNaN(bits)) return null;
  if (prefix === '-') return (m) => (m & bits) === bits;
  if (prefix === '/') return (m) => (m & bits) !== 0;
  return (m) => (m & 0o7777) === bits;
}

function firewallList(s: TerminalState): string {
  const rows = s.firewall.map(
    (r) => `${r.target.padEnd(8)} ${(r.proto ?? 'all').padEnd(5)} --  ${r.source.padEnd(18)} 0.0.0.0/0${r.dport ? `   dpt:${r.dport}` : ''}`
  );
  return ['Chain INPUT (policy ACCEPT)', 'target   prot opt source             destination', ...rows].join('\n');
}

const COMMANDS: Record<string, Cmd> = {
  help: () => ({ out: HELP }),
  man: () => ({ out: 'No hay páginas de manual en el simulador. Escribe "help" para ver los comandos disponibles.' }),
  pwd: (_a, { s }) => ({ out: s.cwd }),
  whoami: () => ({ out: 'root' }),
  hostname: (_a, { s }) => ({ out: s.host }),
  id: (args, { s }) => {
    const user = operands(args)[0] ?? 'root';
    const u = s.users[user];
    if (!u) return { out: '', err: `id: '${user}': no such user` };
    return { out: `uid=${u.uid}(${user}) gid=${u.uid}(${user}) groups=${u.uid}(${user})` };
  },
  echo: (args) => ({ out: args.join(' ') }),
  clear: () => ({ out: '' }),
  history: (_a, { s }) => ({ out: s.history.map((h, i) => `${String(i + 1).padStart(5)}  ${h}`).join('\n') }),
  'ip': () => ({
    out: '1: lo: <LOOPBACK,UP> inet 127.0.0.1/8\n2: eth0: <BROADCAST,MULTICAST,UP> inet 10.0.5.20/24 brd 10.0.5.255',
  }),
  ifconfig: () => ({ out: 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  inet 10.0.5.20  netmask 255.255.255.0' }),

  cd: (args, { s }) => {
    const target = resolvePath(s.cwd, operands(args)[0] ?? '/root');
    const node = s.fs[target];
    if (!node) return { out: '', err: `cd: ${operands(args)[0]}: No such file or directory` };
    if (node.type !== 'dir') return { out: '', err: `cd: ${operands(args)[0]}: Not a directory` };
    s.cwd = target;
    return { out: '' };
  },

  ls: (args, { s }) => {
    const f = flagsOf(args);
    const long = f.includes('l');
    const all = f.includes('a');
    const targets = operands(args).length ? operands(args) : [s.cwd];
    const out: string[] = [];
    for (const t of targets) {
      const path = resolvePath(s.cwd, t);
      const node = s.fs[path];
      if (!node) return { out: out.join('\n'), err: `ls: cannot access '${t}': No such file or directory` };
      if (node.type === 'file') {
        out.push(long ? lsLine(t, node) : t);
        continue;
      }
      if (targets.length > 1) out.push(`${t}:`);
      const kids = childrenOf(s, path).filter((k) => all || !baseName(k).startsWith('.'));
      if (long) {
        out.push(`total ${kids.length * 4}`);
        if (all) out.push(lsLine('.', node));
        out.push(...kids.map((k) => lsLine(baseName(k), s.fs[k])));
      } else out.push(kids.map(baseName).join('  '));
    }
    return { out: out.join('\n') };
  },

  cat: (args, ctx) => {
    const r = readInput(ctx, operands(args), 'cat');
    return r.err ? r : { out: (r.text ?? '').replace(/\n$/, '') };
  },
  head: (args, ctx) => {
    const { n, files } = countArgs(args);
    const r = readInput(ctx, files, 'head');
    return r.err ? r : { out: lines(r.text ?? '').slice(0, n).join('\n') };
  },
  tail: (args, ctx) => {
    const { n, files } = countArgs(args);
    const r = readInput(ctx, files, 'tail');
    const all = lines(r.text ?? '');
    return r.err ? r : { out: all.slice(Math.max(0, all.length - n)).join('\n') };
  },

  grep: (args, ctx) => {
    const f = flagsOf(args);
    const ops = operands(args);
    const pattern = ops[0];
    if (pattern === undefined) return { out: '', err: 'Uso: grep [-i -v -c -n -r] PATRÓN [ARCHIVO...]' };
    let re: RegExp;
    try {
      re = new RegExp(pattern, f.includes('i') ? 'i' : '');
    } catch {
      re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), f.includes('i') ? 'i' : '');
    }
    const invert = f.includes('v');
    let sources: Array<{ name: string; text: string }> = [];
    if (ops.length > 1) {
      for (const file of ops.slice(1)) {
        const path = resolvePath(ctx.s.cwd, file);
        const node = ctx.s.fs[path];
        if (!node) return { out: '', err: `grep: ${file}: No such file or directory` };
        if (node.type === 'dir') {
          if (!f.includes('r')) return { out: '', err: `grep: ${file}: Is a directory` };
          for (const p of descendantsOf(ctx.s, path)) if (ctx.s.fs[p].type === 'file') sources.push({ name: p, text: ctx.s.fs[p].content ?? '' });
        } else sources.push({ name: file, text: node.content ?? '' });
      }
    } else sources = [{ name: '', text: ctx.stdin ?? '' }];
    const multi = sources.length > 1;
    const out: string[] = [];
    for (const src of sources) {
      const matched = lines(src.text)
        .map((l, i) => ({ l, i }))
        .filter(({ l }) => re.test(l) !== invert);
      if (f.includes('c')) out.push(multi ? `${src.name}:${matched.length}` : String(matched.length));
      else for (const { l, i } of matched) out.push(`${multi ? src.name + ':' : ''}${f.includes('n') ? i + 1 + ':' : ''}${l}`);
    }
    return { out: out.join('\n') };
  },
  sort: (args, ctx) => {
    const f = flagsOf(args);
    const r = readInput(ctx, operands(args), 'sort');
    if (r.err) return r;
    const items = lines(r.text ?? '');
    items.sort(f.includes('n') ? (a, b) => parseFloat(a) - parseFloat(b) : (a, b) => a.localeCompare(b));
    if (f.includes('r')) items.reverse();
    return { out: items.join('\n') };
  },
  uniq: (args, ctx) => {
    const r = readInput(ctx, operands(args), 'uniq');
    if (r.err) return r;
    const out: Array<[string, number]> = [];
    for (const l of lines(r.text ?? '')) {
      if (out.length && out[out.length - 1][0] === l) out[out.length - 1][1]++;
      else out.push([l, 1]);
    }
    return { out: out.map(([l, c]) => (flagsOf(args).includes('c') ? `${String(c).padStart(7)} ${l}` : l)).join('\n') };
  },
  wc: (args, ctx) => {
    const r = readInput(ctx, operands(args), 'wc');
    if (r.err) return r;
    const text = r.text ?? '';
    const n = lines(text).length;
    if (flagsOf(args).includes('l')) return { out: String(n) };
    return { out: `${n} ${text.split(/\s+/).filter(Boolean).length} ${text.length}` };
  },
  cut: (args, ctx) => {
    let delim = '\t';
    let field = 1;
    const files: string[] = [];
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-d') delim = args[++i] ?? '\t';
      else if (a.startsWith('-d')) delim = a.slice(2);
      else if (a === '-f') field = Number(args[++i]);
      else if (a.startsWith('-f')) field = Number(a.slice(2));
      else files.push(a);
    }
    const r = readInput(ctx, files, 'cut');
    if (r.err) return r;
    return { out: lines(r.text ?? '').map((l) => l.split(delim)[field - 1] ?? '').join('\n') };
  },
  awk: (args, ctx) => {
    const program = args[0] ?? '';
    const m = program.match(/^\{\s*print\s+((?:\$\d+\s*,?\s*)+)\}$/);
    if (!m) return { out: '', err: "awk: en el simulador solo se admite la forma '{print $N}' (o varios campos: '{print $1, $7}')" };
    const fields = [...m[1].matchAll(/\$(\d+)/g)].map((x) => Number(x[1]));
    const r = readInput(ctx, args.slice(1), 'awk');
    if (r.err) return r;
    return {
      out: lines(r.text ?? '')
        .map((l) => {
          const parts = l.trim().split(/\s+/);
          return fields.map((n) => (n === 0 ? l : parts[n - 1] ?? '')).join(' ');
        })
        .join('\n'),
    };
  },

  find: (args, { s }) => {
    const start = resolvePath(s.cwd, args[0] && !args[0].startsWith('-') ? args[0] : '.');
    if (!s.fs[start]) return { out: '', err: `find: '${args[0]}': No such file or directory` };
    const tests: Array<(p: string, n: VNode) => boolean> = [];
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      const v = args[i + 1];
      if (a === '-type') { tests.push((_p, n) => (v === 'd' ? n.type === 'dir' : n.type === 'file')); i++; }
      else if (a === '-name' || a === '-iname') {
        const re = new RegExp('^' + v.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', a === '-iname' ? 'i' : '');
        tests.push((p) => re.test(baseName(p)));
        i++;
      } else if (a === '-perm') {
        const match = permMatcher(v);
        if (!match) return { out: '', err: `find: invalid mode '${v}'` };
        tests.push((_p, n) => match(n.mode));
        i++;
      } else if (a === '-user') { tests.push((_p, n) => n.owner === v); i++; }
    }
    const found = descendantsOf(s, start).filter((p) => tests.every((t) => t(p, s.fs[p])));
    return { out: found.join('\n') };
  },

  chmod: (args, { s }) => {
    const ops = operands(args);
    if (ops.length < 2) return { out: '', err: 'Uso: chmod MODO ARCHIVO' };
    const [spec, ...files] = ops;
    for (const f of files) {
      const path = resolvePath(s.cwd, f);
      const node = s.fs[path];
      if (!node) return { out: '', err: `chmod: cannot access '${f}': No such file or directory` };
      const targets = flagsOf(args).includes('R') ? descendantsOf(s, path) : [path];
      for (const t of targets) {
        const n = s.fs[t];
        const next = /^[0-7]{3,4}$/.test(spec) ? parseInt(spec, 8) : parseSymbolic(spec, n.mode);
        if (next === null) return { out: '', err: `chmod: invalid mode: '${spec}'` };
        n.mode = next;
      }
    }
    return { out: '' };
  },
  chown: (args, { s }) => {
    const ops = operands(args);
    if (ops.length < 2) return { out: '', err: 'Uso: chown USUARIO[:GRUPO] ARCHIVO' };
    const [spec, ...files] = ops;
    const [owner, group] = spec.split(':');
    for (const f of files) {
      const path = resolvePath(s.cwd, f);
      if (!s.fs[path]) return { out: '', err: `chown: cannot access '${f}': No such file or directory` };
      const targets = flagsOf(args).includes('R') ? descendantsOf(s, path) : [path];
      for (const t of targets) {
        if (owner) s.fs[t].owner = owner;
        if (group) s.fs[t].group = group;
      }
    }
    return { out: '' };
  },
  rm: (args, { s }) => {
    const f = flagsOf(args);
    for (const target of operands(args)) {
      const path = resolvePath(s.cwd, target);
      const node = s.fs[path];
      if (path === '/') return { out: '', err: "rm: it is dangerous to operate recursively on '/'" };
      if (!node) {
        if (f.includes('f')) continue;
        return { out: '', err: `rm: cannot remove '${target}': No such file or directory` };
      }
      if (node.type === 'dir' && !f.includes('r') && !f.includes('R')) return { out: '', err: `rm: cannot remove '${target}': Is a directory` };
      for (const p of descendantsOf(s, path)) delete s.fs[p];
    }
    return { out: '' };
  },

  sha256sum: (args, ctx) => hashCmd(args, ctx, 64, 'sha256sum'),
  md5sum: (args, ctx) => hashCmd(args, ctx, 32, 'md5sum'),

  ps: (_a, { s }) => ({
    out: [
      'USER       PID %CPU %MEM COMMAND',
      ...s.processes.map((p) => `${p.user.padEnd(9)} ${String(p.pid).padStart(5)} ${p.cpu.toFixed(1).padStart(4)} ${p.mem.toFixed(1).padStart(4)} ${p.command}`),
    ].join('\n'),
  }),
  kill: (args, { s }) => {
    const pids = operands(args).filter((a) => /^\d+$/.test(a)).map(Number);
    if (!pids.length) return { out: '', err: 'Uso: kill [-9] PID' };
    const errs: string[] = [];
    for (const pid of pids) {
      if (!s.processes.some((p) => p.pid === pid)) errs.push(`bash: kill: (${pid}) - No such process`);
      else killPid(s, pid);
    }
    return { out: '', err: errs.join('\n') || undefined };
  },
  pkill: (args, { s }) => {
    const name = operands(args)[0];
    if (!name) return { out: '', err: 'Uso: pkill NOMBRE' };
    const pids = s.processes.filter((p) => p.command.includes(name)).map((p) => p.pid);
    pids.forEach((pid) => killPid(s, pid));
    return { out: '' };
  },
  netstat: (args, { s }) => socketList(args, s),
  ss: (args, { s }) => socketList(args, s),

  crontab: (args, { s }) => {
    const f = flagsOf(args);
    const uIdx = args.indexOf('-u');
    const user = uIdx >= 0 ? args[uIdx + 1] : 'root';
    if (!s.users[user]) return { out: '', err: `crontab: user '${user}' unknown` };
    if (f.includes('e')) return { out: '', err: 'crontab: no hay editor en el simulador. Lista con "crontab -l" y elimina con "crontab -r".' };
    if (f.includes('r')) {
      delete s.crontabs[user];
      return { out: '' };
    }
    const tab = s.crontabs[user];
    return tab?.length ? { out: tab.join('\n') } : { out: '', err: `no crontab for ${user}` };
  },

  systemctl: (args, { s }) => {
    const [action, rawName] = operands(args);
    if (action === 'list-units' || !action) {
      return {
        out: Object.entries(s.services)
          .map(([n, v]) => `${(n + '.service').padEnd(26)} loaded ${v.active ? 'active   running' : 'inactive dead   '} ${v.description}`)
          .join('\n'),
      };
    }
    const name = (rawName ?? '').replace(/\.(service|socket)$/, '');
    const svc = s.services[name];
    if (!svc) return { out: '', err: `Unit ${rawName ?? ''}.service could not be found.` };
    switch (action) {
      case 'status':
        return {
          out: `● ${name}.service - ${svc.description}\n     Loaded: loaded (/lib/systemd/system/${name}.service; ${svc.enabled ? 'enabled' : 'disabled'})\n     Active: ${svc.active ? 'active (running)' : 'inactive (dead)'}${svc.active && svc.pid ? `\n   Main PID: ${svc.pid}` : ''}`,
        };
      case 'stop':
        svc.active = false;
        if (svc.pid) killPid(s, svc.pid);
        return { out: '' };
      case 'start':
      case 'restart':
        svc.active = true;
        return { out: '' };
      case 'disable':
        svc.enabled = false;
        return { out: `Removed /etc/systemd/system/multi-user.target.wants/${name}.service.` };
      case 'enable':
        svc.enabled = true;
        return { out: '' };
      case 'is-active':
        return { out: svc.active ? 'active' : 'inactive' };
      case 'is-enabled':
        return { out: svc.enabled ? 'enabled' : 'disabled' };
      default:
        return { out: '', err: `systemctl: acción no soportada en el simulador: ${action}` };
    }
  },
  service: (args, ctx) => COMMANDS.systemctl([args[1], args[0]].filter(Boolean), ctx),

  iptables: (args, { s }) => {
    if (args.includes('-L') || args.includes('-S')) return { out: firewallList(s) };
    if (args.includes('-F')) {
      s.firewall = [];
      return { out: '' };
    }
    const val = (flag: string) => {
      const i = args.indexOf(flag);
      return i >= 0 ? args[i + 1] : undefined;
    };
    const chain = val('-A') ?? val('-I');
    const target = val('-j')?.toUpperCase() as 'DROP' | 'REJECT' | 'ACCEPT' | undefined;
    if (!chain || !target || !['DROP', 'REJECT', 'ACCEPT'].includes(target)) {
      return { out: '', err: 'Uso: iptables -A|-I INPUT [-p tcp] [-s IP] [--dport N] -j DROP|REJECT|ACCEPT' };
    }
    const rule = { chain: chain.toUpperCase(), target, source: val('-s') ?? '0.0.0.0/0', proto: val('-p'), dport: val('--dport') };
    if (args.includes('-I')) s.firewall.unshift(rule);
    else s.firewall.push(rule);
    return { out: '' };
  },
  ufw: (args, { s }) => {
    const ops = args.filter((a) => a !== 'insert' && !/^\d+$/.test(a));
    if (ops[0] === 'enable') {
      s.ufwActive = true;
      return { out: 'Firewall is active and enabled on system startup' };
    }
    if (ops[0] === 'status') {
      return {
        out: `Status: ${s.ufwActive ? 'active' : 'inactive'}\n\nTo                         Action      From\n--                         ------      ----\n${s.firewall
          .map((r) => `${(r.dport ? r.dport : 'Anywhere').padEnd(26)} ${r.target === 'ACCEPT' ? 'ALLOW IN' : r.target === 'REJECT' ? 'REJECT IN' : 'DENY IN '}    ${r.source === '0.0.0.0/0' ? 'Anywhere' : r.source}`)
          .join('\n')}`,
      };
    }
    if (['deny', 'reject', 'allow'].includes(ops[0])) {
      const fromIdx = ops.indexOf('from');
      const portIdx = ops.indexOf('port');
      const source = fromIdx >= 0 ? ops[fromIdx + 1] : '0.0.0.0/0';
      const target = ops[0] === 'allow' ? 'ACCEPT' : ops[0] === 'reject' ? 'REJECT' : 'DROP';
      const rule = { via: 'ufw' as const, chain: 'INPUT', target: target as 'DROP' | 'REJECT' | 'ACCEPT', source: source === 'any' ? '0.0.0.0/0' : source, dport: portIdx >= 0 ? ops[portIdx + 1] : fromIdx < 0 ? ops[1] : undefined };
      if (args.includes('insert')) s.firewall.unshift(rule);
      else s.firewall.push(rule);
      return { out: s.ufwActive ? 'Rule added' : 'Rule added (ufw inactivo: ejecuta "ufw enable" para aplicarla)' };
    }
    return { out: '', err: 'Uso: ufw enable | ufw status | ufw deny from IP [to any port N]' };
  },

  usermod: (args, { s }) => lockUser(s, operands(args)[0], args.includes('-L') || args.includes('--lock'), 'usermod'),
  passwd: (args, { s }) => {
    const user = operands(args)[0] ?? 'root';
    if (args.includes('-S')) {
      const u = s.users[user];
      return u ? { out: `${user} ${u.locked ? 'L' : 'P'} 10/01/2026 0 99999 7 -1` } : { out: '', err: `passwd: user '${user}' does not exist` };
    }
    return lockUser(s, user, args.includes('-l'), 'passwd');
  },
  userdel: (args, { s }) => {
    const user = operands(args)[0];
    if (!user || !s.users[user]) return { out: '', err: `userdel: user '${user ?? ''}' does not exist` };
    delete s.users[user];
    delete s.crontabs[user];
    return { out: '' };
  },
};

function hashCmd(args: string[], ctx: Ctx, length: 64 | 32, name: string): Result {
  const out: string[] = [];
  for (const f of operands(args)) {
    const node = ctx.s.fs[resolvePath(ctx.s.cwd, f)];
    if (!node) return { out: out.join('\n'), err: `${name}: ${f}: No such file or directory` };
    if (node.type === 'dir') return { out: out.join('\n'), err: `${name}: ${f}: Is a directory` };
    out.push(`${fakeHash(node.content ?? '', length)}  ${f}`);
  }
  return { out: out.join('\n') };
}

function killPid(s: TerminalState, pid: number) {
  s.processes = s.processes.filter((p) => p.pid !== pid);
  s.sockets = s.sockets.filter((x) => x.pid !== pid);
  for (const svc of Object.values(s.services)) if (svc.pid === pid) svc.active = false;
}

function socketList(args: string[], s: TerminalState): Result {
  const showPid = flagsOf(args).includes('p');
  const listenOnly = flagsOf(args).includes('l');
  const rows = s.sockets
    .filter((x) => !listenOnly || x.state === 'LISTEN')
    .map((x) => `${x.proto.padEnd(5)} ${x.local.padEnd(22)} ${x.remote.padEnd(22)} ${x.state.padEnd(12)} ${showPid ? `${x.pid}/${x.program}` : '-'}`);
  return { out: ['Proto Local Address          Foreign Address        State        PID/Program name', ...rows].join('\n') };
}

function lockUser(s: TerminalState, user: string | undefined, lock: boolean, cmd: string): Result {
  if (!user || !s.users[user]) return { out: '', err: `${cmd}: user '${user ?? ''}' does not exist` };
  if (!lock) return { out: '', err: `${cmd}: en el simulador solo se admite bloquear la cuenta (${cmd === 'passwd' ? 'passwd -l' : 'usermod -L'} USUARIO)` };
  s.users[user].locked = true;
  return { out: cmd === 'passwd' ? `passwd: password expiry information changed.` : '' };
}

export const COMMAND_NAMES = Object.keys(COMMANDS).concat('sudo');

export function prompt(s: TerminalState): string {
  const dir = s.cwd === '/root' ? '~' : s.cwd.startsWith('/root/') ? '~' + s.cwd.slice(5) : s.cwd;
  return `root@${s.host}:${dir}#`;
}

export function runCommand(state: TerminalState, rawLine: string): TerminalState {
  const s: TerminalState = structuredClone(state);
  const line = rawLine.trim();
  s.lines.push({ kind: 'in', text: `${prompt(state)} ${rawLine}` });
  if (!line) return s;
  s.history.push(line);

  let stdin: string | null = null;
  for (const segment of splitPipes(line)) {
    const tokens = tokenize(segment).filter((t) => !/^\d?>&?\d?$/.test(t) && t !== '/dev/null' && !/^2>/.test(t));
    if (tokens[0] === 'sudo') tokens.shift();
    const [name, ...args] = tokens;
    if (!name) continue;
    if (name === 'clear') {
      s.lines = [];
      stdin = null;
      continue;
    }
    const cmd = COMMANDS[name];
    if (!cmd) {
      s.lines.push({ kind: 'err', text: `${name}: command not found` });
      stdin = null;
      break;
    }
    const result = cmd(args, { s, stdin });
    if (result.err) {
      s.lines.push({ kind: 'err', text: result.err });
      if (!result.out) {
        stdin = null;
        break;
      }
    }
    stdin = result.out;
  }
  if (stdin) s.lines.push(...stdin.split('\n').map((text) => ({ kind: 'out' as const, text })));
  if (s.lines.length > MAX_LINES) s.lines = s.lines.slice(-MAX_LINES);
  return s;
}

/** Tab completion: command names for the first word, paths otherwise. */
export function complete(s: TerminalState, input: string): string {
  const parts = input.split(' ');
  const last = parts[parts.length - 1];
  const firstWord = parts.length === 1 || (parts.length === 2 && parts[0] === 'sudo');
  let candidates: string[];
  if (firstWord) candidates = COMMAND_NAMES.filter((c) => c.startsWith(last));
  else {
    const slash = last.lastIndexOf('/');
    const dirPart = slash >= 0 ? last.slice(0, slash + 1) : '';
    const dir = resolvePath(s.cwd, dirPart || '.');
    candidates = childrenOf(s, dir)
      .map((p) => dirPart + baseName(p) + (s.fs[p].type === 'dir' ? '/' : ''))
      .filter((c) => c.startsWith(last));
  }
  if (candidates.length === 0) return input;
  let common = candidates[0];
  for (const c of candidates) while (!c.startsWith(common)) common = common.slice(0, -1);
  parts[parts.length - 1] = candidates.length === 1 && !common.endsWith('/') && firstWord ? common + ' ' : common;
  return parts.join(' ');
}

/** True when an INPUT rule drops/rejects traffic from `ip` (exact address or a CIDR containing it). */
export function isBlocked(s: TerminalState, ip: string): boolean {
  return s.firewall.some(
    (r) => (r.via !== 'ufw' || s.ufwActive) && r.chain === 'INPUT' && r.target !== 'ACCEPT' && !r.dport && r.source !== '0.0.0.0/0' && ipMatches(r.source, ip)
  );
}
