import React, { useState } from 'react';
import {
  FirewallRule,
  RuleAction,
  RuleProtocol,
  FirewallPacketTest,
} from '../../types/pbq';
import {
  INITIAL_FIREWALL_RULES,
  FIREWALL_PACKET_TESTS,
} from '../../data/pbqsData';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { useHints } from '../../context/HintsContext';

interface Props {
  rules: FirewallRule[];
  onRulesChange: (newRules: FirewallRule[]) => void;
  packetTests?: FirewallPacketTest[];
  initialRules?: FirewallRule[];
  helperText?: string;
}

export const FirewallAclPBQ: React.FC<Props> = ({
  rules,
  onRulesChange,
  packetTests = FIREWALL_PACKET_TESTS,
  initialRules = INITIAL_FIREWALL_RULES,
  helperText = 'Audita el orden y parámetros de la tabla ACL. Recuerda que la evaluación es First-Match (de arriba hacia abajo).',
}) => {
  const hints = useHints();
  const [packetResults, setPacketResults] = useState<{
    [testId: string]: { matchedRule: FirewallRule | null; action: RuleAction };
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'rules' | 'simulator'>('rules');
  const [showReference, setShowReference] = useState<boolean>(false);

  const handleActionChange = (id: string, action: RuleAction) => {
    sound.playToggle();
    onRulesChange(
      rules.map((r) => (r.id === id ? { ...r, action } : r))
    );
  };

  const handleProtocolChange = (id: string, protocol: RuleProtocol) => {
    sound.playClick();
    onRulesChange(
      rules.map((r) => (r.id === id ? { ...r, protocol } : r))
    );
  };

  const handleInputChange = (id: string, field: keyof FirewallRule, value: any) => {
    onRulesChange(
      rules.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleToggleEnabled = (id: string) => {
    sound.playToggle();
    onRulesChange(
      rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    sound.playClick();
    const newRules = [...rules];
    const temp = newRules[index];
    newRules[index] = newRules[index - 1];
    newRules[index - 1] = temp;
    onRulesChange(newRules);
  };

  const handleMoveDown = (index: number) => {
    if (index === rules.length - 1) return;
    sound.playClick();
    const newRules = [...rules];
    const temp = newRules[index];
    newRules[index] = newRules[index + 1];
    newRules[index + 1] = temp;
    onRulesChange(newRules);
  };

  const handleDeleteRule = (id: string) => {
    sound.playToggle();
    onRulesChange(rules.filter((r) => r.id !== id));
  };

  const handleAddRule = () => {
    sound.playClick();
    const newRule: FirewallRule = {
      id: `rule-${Date.now()}`,
      ruleNumber: (rules.length + 1) * 10,
      action: 'PERMIT',
      protocol: 'TCP',
      sourceIp: '10.1.0.0/24',
      sourcePort: 'ANY',
      destIp: '192.168.2.10',
      destPort: '443',
      description: 'Nueva regla personalizada',
      enabled: true,
    };
    onRulesChange([...rules, newRule]);
  };

  const handleReset = () => {
    sound.playToggle();
    onRulesChange(initialRules);
    setPacketResults(null);
  };

  // Run live simulation of packets through current rulebase
  const runTrafficSimulation = () => {
    sound.playSuccess();
    const results: {
      [testId: string]: { matchedRule: FirewallRule | null; action: RuleAction };
    } = {};

    packetTests.forEach((test) => {
      let matched: FirewallRule | null = null;
      let decidedAction: RuleAction = 'DENY'; // Default implicit deny

      for (const rule of rules) {
        if (!rule.enabled) continue;

        // Protocol check
        const protoMatches =
          rule.protocol === 'ANY' || rule.protocol === test.protocol;

        const checkIpMatch = (ruleIp: string, targetIp: string) => {
          const r = ruleIp.trim().toUpperCase();
          const t = targetIp.trim();
          if (r === '0.0.0.0/0' || r === 'ANY' || r === '*') return true;
          if (ruleIp.trim() === t) return true;
          if (ruleIp.includes('/24')) {
            const prefix = ruleIp.trim().split('.').slice(0, 3).join('.');
            return t.startsWith(prefix + '.');
          }
          if (ruleIp.includes('/16')) {
            const prefix = ruleIp.trim().split('.').slice(0, 2).join('.');
            return t.startsWith(prefix + '.');
          }
          return false;
        };

        // Source IP check
        const srcMatches = checkIpMatch(rule.sourceIp, test.sourceIp);

        // Dest IP check
        const dstMatches = checkIpMatch(rule.destIp, test.destIp);

        // Dest Port check
        const portMatches =
          rule.destPort.trim().toUpperCase() === 'ANY' ||
          rule.destPort.trim() === test.destPort.trim();

        if (protoMatches && srcMatches && dstMatches && portMatches) {
          matched = rule;
          decidedAction = rule.action;
          break; // First match principle!
        }
      }

      results[test.id] = {
        matchedRule: matched,
        action: decidedAction,
      };
    });

    setPacketResults(results);
    setActiveTab('simulator');
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm">
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-300 text-xs md:text-sm">
            {helperText}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddRule}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Regla
          </button>
          {hints && (<button
            onClick={runTrafficSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-700/80 hover:bg-emerald-900 rounded-lg transition-colors shrink-0"
          >
            <Play className="w-3.5 h-3.5" />
            Simular Paquetes
          </button>)}
          {hints && (<button
            onClick={() => {
              sound.playClick();
              setShowReference(!showReference);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
              showReference
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guía Puertos CompTIA</span>
          </button>)}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer
          </button>
        </div>
      </div>

      {/* Collapsible CompTIA Port Reference Panel */}
      {hints && showReference && (
        <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 space-y-3 shadow-xl animate-in fade-in">
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

      {/* Segmented View Switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'rules'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Tabla de Reglas Firewall ({rules.length})
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'simulator'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Play className="w-3 h-3" />
          Probador de Tráfico (Simulator)
          {packetResults && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>
      </div>

      {activeTab === 'rules' ? (
        /* Rules Table */
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-3 w-14 text-center">Orden</th>
                <th className="py-3 px-3 w-24">Acción</th>
                <th className="py-3 px-3 w-20">Protocolo</th>
                <th className="py-3 px-3">IP Origen</th>
                <th className="py-3 px-3 w-20">Puerto Org</th>
                <th className="py-3 px-3">IP Destino</th>
                <th className="py-3 px-3 w-24">Puerto Dst</th>
                <th className="py-3 px-3">Descripción / Propósito</th>
                <th className="py-3 px-3 w-16 text-center">Estado</th>
                <th className="py-3 px-3 w-28 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {rules.map((rule, idx) => {
                const isSshOpenAny =
                  hints &&
                  rule.destPort === '22' &&
                  rule.action === 'PERMIT' &&
                  rule.sourceIp.includes('0.0.0.0');

                const isDenyTooHigh =
                  hints &&
                  rule.action === 'DENY' &&
                  rule.sourceIp.includes('0.0.0.0') &&
                  rule.destIp.includes('0.0.0.0') &&
                  idx < rules.length - 1;

                return (
                  <tr
                    key={rule.id}
                    className={`hover:bg-slate-900/60 transition-colors ${
                      !rule.enabled ? 'opacity-40 bg-slate-950/40' : ''
                    } ${isSshOpenAny || isDenyTooHigh ? 'bg-amber-950/15' : ''}`}
                  >
                    {/* Index & Reorder */}
                    <td className="py-2.5 px-3 text-center text-slate-500 font-sans">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-mono text-slate-400">#{idx + 1}</span>
                      </div>
                    </td>

                    {/* Action Select */}
                    <td className="py-2.5 px-3">
                      <select
                        value={rule.action}
                        onChange={(e) =>
                          handleActionChange(rule.id, e.target.value as RuleAction)
                        }
                        className={`w-full px-2 py-1 rounded text-xs font-bold border ${
                          rule.action === 'PERMIT'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                            : 'bg-rose-950/80 text-rose-300 border-rose-700'
                        }`}
                      >
                        <option value="PERMIT">PERMIT</option>
                        <option value="DENY">DENY</option>
                      </select>
                    </td>

                    {/* Protocol Select */}
                    <td className="py-2.5 px-3">
                      <select
                        value={rule.protocol}
                        onChange={(e) =>
                          handleProtocolChange(rule.id, e.target.value as RuleProtocol)
                        }
                        className="w-full px-2 py-1 rounded bg-slate-900 text-slate-200 border border-slate-700 text-xs"
                      >
                        <option value="TCP">TCP</option>
                        <option value="ANY">ANY</option>
                        <option value="UDP">UDP</option>
                        <option value="ICMP">ICMP</option>
                      </select>
                    </td>

                    {/* Source IP */}
                    <td className="py-2.5 px-3">
                      <div className="relative">
                        <input
                          type="text"
                          value={rule.sourceIp}
                          onChange={(e) =>
                            handleInputChange(rule.id, 'sourceIp', e.target.value)
                          }
                          className={`w-full px-2.5 py-1 rounded bg-slate-900 border text-xs text-white ${
                            isSshOpenAny
                              ? 'border-amber-500 focus:ring-1 focus:ring-amber-500'
                              : 'border-slate-700 focus:border-cyan-500'
                          }`}
                          placeholder="e.g. 10.1.0.0/24 o 0.0.0.0/0"
                        />
                        {isSshOpenAny && (
                          <span
                            title="¡Vulnerabilidad! SSH expuesto a 0.0.0.0/0 (Internet). Restringe a 10.1.0.0/24"
                            className="absolute right-2 top-1.5 text-amber-400"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Source Port */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={rule.sourcePort}
                        onChange={(e) =>
                          handleInputChange(rule.id, 'sourcePort', e.target.value)
                        }
                        className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300"
                        placeholder="ANY"
                      />
                    </td>

                    {/* Dest IP */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={rule.destIp}
                        onChange={(e) =>
                          handleInputChange(rule.id, 'destIp', e.target.value)
                        }
                        className="w-full px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-500"
                        placeholder="e.g. 192.168.2.10"
                      />
                    </td>

                    {/* Dest Port */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={rule.destPort}
                        onChange={(e) =>
                          handleInputChange(rule.id, 'destPort', e.target.value)
                        }
                        className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-semibold"
                        placeholder="22, 443, 53, ANY"
                      />
                    </td>

                    {/* Description */}
                    <td className="py-2.5 px-3 font-sans">
                      <input
                        type="text"
                        value={rule.description}
                        onChange={(e) =>
                          handleInputChange(rule.id, 'description', e.target.value)
                        }
                        className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300"
                        placeholder="Motivo de la regla..."
                      />
                    </td>

                    {/* Enabled Toggle */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleToggleEnabled(rule.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rule.enabled
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {rule.enabled ? 'ON' : 'OFF'}
                      </button>
                    </td>

                    {/* Action buttons (Move Up, Down, Delete) */}
                    <td className="py-2.5 px-3 text-center font-sans">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveUp(idx)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800"
                          title="Subir prioridad (Move Up)"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === rules.length - 1}
                          onClick={() => handleMoveDown(idx)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-800"
                          title="Bajar prioridad (Move Down)"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-1 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/60"
                          title="Eliminar regla"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table Footer with Implicit Deny note */}
          <div className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-mono text-slate-500">
              [Regla Implícita Final: DENY ANY ANY en la última posición]
            </span>
            <span className="text-slate-400">
              Total de Reglas Activas: {rules.filter((r) => r.enabled).length} de {rules.length}
            </span>
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
