import React from 'react';
import { ServiceItem, SecurityPolicyItem } from '../../types/pbq';
import {
  Server,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Lock,
  Cpu,
  KeyRound,
  Radio,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { useHints } from '../../context/HintsContext';

interface Props {
  services: ServiceItem[];
  policies: SecurityPolicyItem[];
  onServicesChange: (newServices: ServiceItem[]) => void;
  onPoliciesChange: (newPolicies: SecurityPolicyItem[]) => void;
  onReset: () => void;
  title?: string;
  subtitle?: string;
}

export const EndpointHardeningPBQ: React.FC<Props> = ({
  services,
  policies,
  onServicesChange,
  onPoliciesChange,
  onReset,
  title = 'Consola de Endurecimiento de Endpoint (Security Baseline Manager)',
  subtitle = 'Aplica el principio de deshabilitación de servicios innecesarios y directivas de seguridad CIS/NIST.',
}) => {
  const hints = useHints();
  const handleServiceToggle = (id: string) => {
    sound.playToggle();
    const updated = services.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          currentStatus: s.currentStatus === 'running' ? ('stopped' as const) : ('running' as const),
        };
      }
      return s;
    });
    onServicesChange(updated);
  };

  const handlePolicyChange = (id: string, value: any) => {
    sound.playClick();
    const updated = policies.map((p) => {
      if (p.id === id) {
        return { ...p, currentValue: value };
      }
      return p;
    });
    onPoliciesChange(updated);
  };

  // Calculate live dynamic compliance health score
  const totalItems = services.length + policies.length;
  const compliantServices = services.filter((s) => s.currentStatus === s.targetStatus).length;
  const compliantPolicies = policies.filter((p) => {
    if (p.type === 'number_slider') return Number(p.currentValue) >= Number(p.targetValue);
    return p.currentValue === p.targetValue;
  }).length;
  const compliancePoints = totalItems > 0 ? Math.round(((compliantServices + compliantPolicies) / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner with Compliance Meter */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              {title}
            </h4>
            <p className="text-xs text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {hints && <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Cumplimiento de Línea Base
            </div>
            <div className="flex items-center gap-2">
              <div className="w-28 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    compliancePoints >= 80
                      ? 'bg-emerald-400'
                      : compliancePoints >= 50
                      ? 'bg-amber-400'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${compliancePoints}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-white">
                {compliancePoints}%
              </span>
            </div>
          </div>}

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PANEL 1: Services Manager */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Servicios del Sistema y Daemons de Red</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Total: {services.length} servicios
            </span>
          </div>

          <div className="space-y-3">
            {services.map((svc) => {
              const isRunning = svc.currentStatus === 'running';

              return (
                <div
                  key={svc.id}
                  className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                    hints && isRunning && svc.isVulnerable
                      ? 'border-rose-900/60 bg-rose-950/15'
                      : hints && !isRunning && svc.isVulnerable
                      ? 'border-emerald-900/50 bg-emerald-950/10'
                      : 'border-slate-800 bg-slate-900/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        {svc.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                        {svc.protocol}/{svc.port}
                      </span>
                      {hints && svc.isVulnerable && isRunning && (
                        <span className="text-[10px] font-semibold text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Inseguro
                        </span>
                      )}
                    </div>
                    {hints && <p className="text-[11px] text-slate-400 leading-tight">{svc.description}</p>}
                  </div>

                  <button
                    onClick={() => handleServiceToggle(svc.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 font-mono ${
                      isRunning
                        ? 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                    }`}
                  >
                    {isRunning ? 'RUNNING (Detener)' : 'STOPPED (Iniciar)'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL 2: Local Security Policies (GPO) */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Directivas de Seguridad Local (GPO & Account Policies)</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">CIS Benchmark</span>
          </div>

          <div className="space-y-4">
            {policies.map((policy) => {
              return (
                <div
                  key={policy.id}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      {policy.name}
                    </span>
                    {policy.type === 'toggle' && (
                      <button
                        onClick={() =>
                          handlePolicyChange(policy.id, !policy.currentValue)
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-colors ${
                          policy.currentValue
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {policy.currentValue ? 'ENABLED' : 'DISABLED'}
                      </button>
                    )}
                  </div>

                  {hints && <p className="text-[11px] text-slate-400 leading-tight">{policy.description}</p>}

                  {/* Slider Type */}
                  {policy.type === 'number_slider' && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-mono">
                          Mínimo: {policy.min}
                        </span>
                        <span className="font-mono font-bold text-cyan-400 text-sm">
                          {policy.currentValue} {policy.unit}
                        </span>
                        <span className="text-slate-500 font-mono">
                          Máximo: {policy.max}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={policy.min}
                        max={policy.max}
                        step={policy.step || 1}
                        value={policy.currentValue}
                        onChange={(e) =>
                          handlePolicyChange(policy.id, Number(e.target.value))
                        }
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                      {hints && <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Débil (6-10)</span>
                        <span>Aceptable (12)</span>
                        <span className="text-emerald-400 font-bold">Recomendado NIST (≥14)</span>
                      </div>}
                    </div>
                  )}

                  {/* Select Type */}
                  {policy.type === 'select' && (
                    <div className="pt-1">
                      <select
                        value={policy.currentValue}
                        onChange={(e) =>
                          handlePolicyChange(policy.id, Number(e.target.value))
                        }
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500"
                      >
                        {policy.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
