import React, { useEffect, useState } from 'react';
import { FirewallRule, RuleAction, RuleProtocol, FirewallPacketTest, FirewallTokenBank } from '../../types/pbq';
import { INITIAL_FIREWALL_RULES, FIREWALL_PACKET_TESTS, FIREWALL_TOKENS_PBQ2 } from '../../data/pbqsData';
import { Plus, Trash2, ArrowUp, ArrowDown, RotateCcw, Play, CheckCircle2, XCircle, BookOpen, Layers, GripVertical, MousePointerClick } from 'lucide-react';
import { sound } from '../../utils/audio';
import { useHints } from '../../context/HintsContext';
import { simulatePacket } from '../../utils/firewallSim';

interface Props {
  rules: FirewallRule[];
  onRulesChange: (newRules: FirewallRule[]) => void;
  packetTests?: FirewallPacketTest[];
  initialRules?: FirewallRule[];
  tokens?: FirewallTokenBank;
  helperText?: string;
}

type TokenKind = 'action' | 'protocol' | 'address' | 'port';
interface Token {
  kind: TokenKind;
  value: string;
}
type SlotField = 'action' | 'protocol' | 'sourceIp' | 'destIp' | 'destPort';

const FIELD_KIND: Record<SlotField, TokenKind> = {
  action: 'action',
  protocol: 'protocol',
  sourceIp: 'address',
  destIp: 'address',
  destPort: 'port',
};

const COLUMNS: Array<{ field: SlotField; label: string }> = [
  { field: 'action', label: 'Acción' },
  { field: 'protocol', label: 'Protocolo' },
  { field: 'sourceIp', label: 'Origen' },
  { field: 'destIp', label: 'Destino' },
  { field: 'destPort', label: 'Puerto destino' },
];

const ACTIONS: RuleAction[] = ['PERMIT', 'DENY'];
const PROTOCOLS: RuleProtocol[] = ['TCP', 'UDP', 'ICMP', 'ANY'];

const tokenClass = (kind: TokenKind, value: string) => {
  if (kind === 'action') return value === 'PERMIT' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-rose-950 text-rose-300 border-rose-700';
  if (kind === 'protocol') return 'bg-indigo-950 text-indigo-200 border-indigo-700';
  if (kind === 'port') return 'bg-amber-950/70 text-amber-200 border-amber-700';
  return 'bg-slate-800 text-cyan-200 border-slate-600';
};

export const FirewallAclPBQ: React.FC<Props> = ({
  rules,
  onRulesChange,
  packetTests = FIREWALL_PACKET_TESTS,
  initialRules = INITIAL_FIREWALL_RULES,
  tokens = FIREWALL_TOKENS_PBQ2,
  helperText = 'Las reglas se evalúan de arriba hacia abajo y se aplica la primera que coincide.',
}) => {
  const hints = useHints();
  const [packetResults, setPacketResults] = useState<{ [testId: string]: { matchedRule: FirewallRule | null; action: RuleAction } } | null>(null);
  const [activeTab, setActiveTab] = useState<'rules' | 'simulator'>('rules');
  const [showReference, setShowReference] = useState(false);
  // Tap-to-place for touch screens; dragging for mouse. Both share the "active" token.
  const [selected, setSelected] = useState<Token | null>(null);
  const [dragging, setDragging] = useState<Token | null>(null);
  const active = dragging ?? selected;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const groups: Array<{ kind: TokenKind; title: string; values: string[] }> = [
    { kind: 'action', title: 'Acción', values: ACTIONS },
    { kind: 'protocol', title: 'Protocolo', values: PROTOCOLS },
    { kind: 'address', title: 'Direcciones IP / subredes', values: tokens.addresses },
    { kind: 'port', title: 'Puertos', values: tokens.ports },
  ];

  const update = (id: string, patch: Partial<FirewallRule>) => onRulesChange(rules.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const place = (ruleId: string, field: SlotField, token: Token) => {
    if (FIELD_KIND[field] !== token.kind) return;
    sound.playClick();
    update(ruleId, { [field]: token.value } as Partial<FirewallRule>);
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= rules.length) return;
    sound.playClick();
    const next = [...rules];
    [next[index], next[target]] = [next[target], next[index]];
    onRulesChange(next);
  };

  const handleAddRule = () => {
    sound.playClick();
    onRulesChange([
      ...rules,
      {
        id: `rule-${Date.now()}`,
        ruleNumber: (rules.length + 1) * 10,
        action: 'PERMIT',
        protocol: 'TCP',
        sourceIp: '',
        sourcePort: 'ANY',
        destIp: '',
        destPort: '',
        description: 'Nueva regla',
        enabled: true,
      },
    ]);
  };

  const handleReset = () => {
    sound.playToggle();
    onRulesChange(initialRules);
    setPacketResults(null);
    setSelected(null);
  };

  const runTrafficSimulation = () => {
    sound.playSuccess();
    const results: { [testId: string]: { matchedRule: FirewallRule | null; action: RuleAction } } = {};
    packetTests.forEach((test) => {
      results[test.id] = simulatePacket(rules, test);
    });
    setPacketResults(results);
    setActiveTab('simulator');
  };

  const renderSlot = (rule: FirewallRule, field: SlotField) => {
    const value = String(rule[field] ?? '');
    const accepts = active?.kind === FIELD_KIND[field];
    return (
      <div
        role="button"
        tabIndex={0}
        aria-label={`${COLUMNS.find((c) => c.field === field)!.label}: ${value || 'vacío'}`}
        onDragOver={(e) => accepts && e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (dragging) place(rule.id, field, dragging);
          setDragging(null);
        }}
        onClick={() => {
          if (selected && accepts) place(rule.id, field, selected);
          else if (field === 'action') update(rule.id, { action: rule.action === 'PERMIT' ? 'DENY' : 'PERMIT' });
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && selected && accepts) {
            e.preventDefault();
            place(rule.id, field, selected);
          }
        }}
        className={`min-h-[44px] w-full rounded-lg border px-2.5 py-2 flex items-center font-mono text-sm font-semibold transition-all cursor-pointer select-none ${
          accepts ? 'ring-2 ring-cyan-400/70 border-cyan-500 border-dashed bg-cyan-950/30' : ''
        } ${value ? tokenClass(FIELD_KIND[field], value) : 'border-dashed border-slate-600 text-slate-500 bg-slate-950'}`}
      >
        <span className="truncate">{value || 'Soltar aquí'}</span>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-300 text-sm">{helperText}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleAddRule} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-on-accent bg-cyan-600 hover:bg-cyan-500 rounded-lg">
            <Plus className="w-4 h-4" /> Agregar regla
          </button>
          {hints && (
            <button onClick={runTrafficSimulation} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-700/80 hover:bg-emerald-900 rounded-lg">
              <Play className="w-4 h-4" /> Simular paquetes
            </button>
          )}
          {hints && (
            <button
              onClick={() => { sound.playClick(); setShowReference(!showReference); }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg ${showReference ? 'bg-amber-600 text-on-accent' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'}`}
            >
              <BookOpen className="w-4 h-4" /> Guía de puertos
            </button>
          )}
          <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg">
            <RotateCcw className="w-4 h-4" /> Restablecer
          </button>
        </div>
      </div>

      {/* Collapsible CompTIA Port Reference Panel */}
      {hints && showReference && (
        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Matriz Rápida de Puertos & Protocolos Clave (CompTIA SY0-701)</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Evaluación: First-Match (de arriba hacia abajo) • Implicit Deny al final
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-mono font-bold">22 TCP</div>
              <div className="text-white font-medium text-[11px]">SSH / SFTP</div>
              <div className="text-slate-400 text-[10px]">Admin remota cifrada</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-mono font-bold">53 UDP/TCP</div>
              <div className="text-white font-medium text-[11px]">DNS / DNSSEC</div>
              <div className="text-slate-400 text-[10px]">Resolución / TCP 53 AXFR</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-mono font-bold">443 TCP</div>
              <div className="text-white font-medium text-[11px]">HTTPS (TLS)</div>
              <div className="text-slate-400 text-[10px]">Tráfico Web Seguro</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-mono font-bold">25 / 465 / 587</div>
              <div className="text-white font-medium text-[11px]">SMTP / SMTPS</div>
              <div className="text-slate-400 text-[10px]">Pasarelas de correo</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-mono font-bold">636 TCP</div>
              <div className="text-white font-medium text-[11px]">LDAPS</div>
              <div className="text-slate-400 text-[10px]">Directorio Activo TLS</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-mono font-bold">1812 / 1813</div>
              <div className="text-white font-medium text-[11px]">RADIUS</div>
              <div className="text-slate-400 text-[10px]">Auth 1812 / Acct 1813</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-mono font-bold">3306 TCP</div>
              <div className="text-white font-medium text-[11px]">MySQL</div>
              <div className="text-slate-400 text-[10px]">BD LAN / Aislada</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-mono font-bold">5432 TCP</div>
              <div className="text-white font-medium text-[11px]">PostgreSQL</div>
              <div className="text-slate-400 text-[10px]">BD Relacional Segura</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-mono font-bold">3389 TCP</div>
              <div className="text-white font-medium text-[11px]">RDP + NLA</div>
              <div className="text-slate-400 text-[10px]">Solo vía Bastion/VPN</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-mono font-bold">853 TCP</div>
              <div className="text-white font-medium text-[11px]">DoT (DNS over TLS)</div>
              <div className="text-slate-400 text-[10px]">Cifrado DNS dedicado</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-cyan-400 font-mono font-bold">8080 TCP</div>
              <div className="text-white font-medium text-[11px]">HTTP Proxy / SWG</div>
              <div className="text-slate-400 text-[10px]">Salida web corporativa</div>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <div className="text-amber-400 font-mono font-bold">ANY / ANY</div>
              <div className="text-white font-medium text-[11px]">Implicit Deny</div>
              <div className="text-slate-400 text-[10px]">Regla final obligatoria</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 w-fit">
        <button onClick={() => setActiveTab('rules')} className={`px-4 py-2 text-xs font-semibold rounded-lg ${activeTab === 'rules' ? 'bg-cyan-600 text-on-accent' : 'text-slate-400 hover:text-white'}`}>
          Reglas del firewall ({rules.length})
        </button>
        <button onClick={() => setActiveTab('simulator')} className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 ${activeTab === 'simulator' ? 'bg-cyan-600 text-on-accent' : 'text-slate-400 hover:text-white'}`}>
          <Play className="w-3.5 h-3.5" /> Flujos de prueba
          {packetResults && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
        </button>
      </div>

      {activeTab === 'rules' ? (
        <div className="space-y-4">
          {/* Token tray */}
          <div className="p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur border border-slate-700 space-y-2.5 md:sticky md:top-[7.5rem] z-20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-cyan-400" /> Valores disponibles
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5" />
                {selected ? (
                  <span>
                    Toca una casilla para colocar <strong className="text-cyan-300 font-mono">{selected.value}</strong> ·{' '}
                    <button onClick={() => setSelected(null)} className="underline">cancelar</button>
                  </span>
                ) : (
                  <span>Arrastra un valor a una casilla, o tócalo y luego toca la casilla.</span>
                )}
              </div>
            </div>
            {groups.map((g) => (
              <div key={g.kind} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                <div className="text-[11px] font-semibold text-slate-500 sm:w-36 shrink-0">{g.title}</div>
                <div className="flex flex-wrap gap-1.5">
                  {g.values.map((v) => {
                    const isSel = selected?.kind === g.kind && selected.value === v;
                    return (
                      <button
                        key={v}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', v);
                          e.dataTransfer.effectAllowed = 'copy';
                          setDragging({ kind: g.kind, value: v });
                        }}
                        onDragEnd={() => setDragging(null)}
                        onClick={() => { sound.playClick(); setSelected(isSel ? null : { kind: g.kind, value: v }); }}
                        aria-pressed={isSel}
                        className={`px-2.5 py-1.5 rounded-lg border font-mono text-sm font-semibold cursor-grab active:cursor-grabbing transition-all ${tokenClass(g.kind, v)} ${
                          isSel ? 'ring-2 ring-white scale-105' : 'hover:brightness-125'
                        }`}
                      >
                        {v === '0.0.0.0/0' ? '0.0.0.0/0 (any)' : v}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Rules */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="hidden md:grid grid-cols-[3.5rem_repeat(5,minmax(0,1fr))_6.5rem] gap-2 px-3 py-2.5 bg-slate-900 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <span>Orden</span>
              {COLUMNS.map((c) => <span key={c.field}>{c.label}</span>)}
              <span className="text-right">Estado</span>
            </div>
            <ol aria-label="Reglas del firewall" className="divide-y divide-slate-800/80">
              {rules.map((rule, idx) => (
                <li key={rule.id} className={`p-3 space-y-2 ${!rule.enabled ? 'opacity-45' : ''}`}>
                  <div className="grid grid-cols-2 md:grid-cols-[3.5rem_repeat(5,minmax(0,1fr))_6.5rem] gap-2 items-center">
                    <div className="col-span-2 md:col-span-1 flex md:flex-col items-center gap-1">
                      <span className="font-mono text-sm font-bold text-slate-300">#{idx + 1}</span>
                      <div className="flex md:flex-col gap-1">
                        <button onClick={() => move(idx, -1)} disabled={idx === 0} aria-label="Subir regla" className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30">
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button onClick={() => move(idx, 1)} disabled={idx === rules.length - 1} aria-label="Bajar regla" className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30">
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {COLUMNS.map((c) => (
                      <div key={c.field} className="space-y-1">
                        <span className="md:hidden text-[10px] font-semibold uppercase text-slate-500">{c.label}</span>
                        {renderSlot(rule, c.field)}
                      </div>
                    ))}
                    <div className="col-span-2 md:col-span-1 flex md:justify-end items-center gap-1.5">
                      <button
                        onClick={() => { sound.playToggle(); update(rule.id, { enabled: !rule.enabled }); }}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-bold ${rule.enabled ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}
                      >
                        {rule.enabled ? 'ON' : 'OFF'}
                      </button>
                      <button
                        onClick={() => { sound.playToggle(); onRulesChange(rules.filter((r) => r.id !== rule.id)); }}
                        aria-label="Eliminar regla"
                        className="p-1.5 rounded-md bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/60"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 md:pl-[4rem]">{rule.description}</p>
                </li>
              ))}
            </ol>
            <div className="px-3 py-2.5 bg-slate-900/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-mono">Todo lo que no coincide con ninguna regla se deniega (implicit deny).</span>
              <span>Reglas activas: {rules.filter((r) => r.enabled).length} de {rules.length}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Packet Simulator View */
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">
                Verificación de Flujo de Paquetes en Vivo
              </h4>
              <p className="text-xs text-slate-400">
                Evalúa qué regla del Firewall hace coincidencia (Match) primero para cada escenario de tráfico de prueba.
              </p>
            </div>
            {hints && <button
              onClick={runTrafficSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950 border border-emerald-700 rounded-lg"
            >
              <Play className="w-3.5 h-3.5" />
              Re-ejecutar Pruebas
            </button>}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {packetTests.map((test) => {
              const res = hints && packetResults ? packetResults[test.id] : null;
              const isMatchExpected = res ? res.action === test.expectedAction : null;

              return (
                <div
                  key={test.id}
                  className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isMatchExpected === true
                      ? 'border-emerald-800/80 bg-emerald-950/20'
                      : isMatchExpected === false
                      ? 'border-rose-800/80 bg-rose-950/20'
                      : 'border-slate-800 bg-slate-900/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {test.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {test.protocol} {test.sourceIp} ➔ {test.destIp}:{test.destPort}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {test.description}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase">Resultado Actual</div>
                      {res ? (
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            res.action === 'PERMIT'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {res.action}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">No probado</span>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase">Esperado</div>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          test.expectedAction === 'PERMIT'
                            ? 'bg-emerald-950/40 text-emerald-400'
                            : 'bg-rose-950/40 text-rose-400'
                        }`}
                      >
                        {test.expectedAction}
                      </span>
                    </div>

                    {isMatchExpected !== null && (
                      <div className="flex items-center">
                        {isMatchExpected ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
