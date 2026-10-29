import React from 'react';
import { IncidentResponseActionItem } from '../../types/pbq';
import {
  LifeBuoy,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  actions: IncidentResponseActionItem[];
  onChange: (actions: IncidentResponseActionItem[]) => void;
  onReset: () => void;
}

export const NIST_PHASES = [
  { id: '1_preparation', short: '1. Preparación', label: '1. Preparación (Preparation)', color: 'border-blue-700 bg-blue-950/40 text-blue-300' },
  { id: '2_detection', short: '2. Detección y análisis', label: '2. Detección y Análisis (Detection & Analysis)', color: 'border-cyan-700 bg-cyan-950/40 text-cyan-300' },
  { id: '3_containment', short: '3. Contención', label: '3. Contención (Containment)', color: 'border-amber-700 bg-amber-950/40 text-amber-300' },
  { id: '4_eradication', short: '4. Erradicación', label: '4. Erradicación (Eradication)', color: 'border-rose-700 bg-rose-950/40 text-rose-300' },
  { id: '5_recovery', short: '5. Recuperación', label: '5. Recuperación (Recovery)', color: 'border-emerald-700 bg-emerald-950/40 text-emerald-300' },
  { id: '6_lessons_learned', short: '6. Lecciones aprendidas', label: '6. Lecciones Aprendidas (Lessons Learned)', color: 'border-purple-700 bg-purple-950/40 text-purple-300' },
];

export const IncidentResponsePBQ: React.FC<Props> = ({
  actions,
  onChange,
  onReset,
}) => {
  const handleAssignPhase = (actionId: string, phaseId: string) => {
    sound.playClick();
    const updated = actions.map((act) =>
      act.id === actionId ? { ...act, assignedPhase: phaseId } : act
    );
    onChange(updated);
  };

  const answeredCount = actions.filter((a) => a.assignedPhase !== '').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <LifeBuoy className="w-4 h-4 text-cyan-400" />
            Ciclo de Vida de Respuesta a Incidentes (NIST SP 800-61r2)
          </div>
          <p className="text-xs text-slate-400">
            Clasifica cada una de las 6 acciones tácticas en la fase oficial de respuesta a incidentes de NIST que le corresponde.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
            Fases Asignadas:{' '}
            <strong className={answeredCount === actions.length ? 'text-emerald-400' : 'text-cyan-400'}>
              {answeredCount} / {actions.length}
            </strong>
          </div>
          <button
            onClick={() => {
              sound.playToggle();
              onReset();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>
      </div>

      {/* NIST Phases Reference Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Fases Secuenciales NIST SP 800-61r2:
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          {NIST_PHASES.map((p, i) => (
            <React.Fragment key={p.id}>
              <span className={`px-2 py-0.5 rounded-md border ${p.color}`}>
                {p.label}
              </span>
              {i < NIST_PHASES.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Actions Assignment List */}
      <div className="space-y-3.5">
        {actions.map((action, idx) => {
          const isConfigured = action.assignedPhase !== '';
          const currentPhaseObj = NIST_PHASES.find((p) => p.id === action.assignedPhase);

          return (
            <div
              key={action.id}
              className={`p-4 rounded-2xl border transition-all ${
                isConfigured
                  ? 'bg-slate-900/90 border-slate-700 shadow-md'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center border border-slate-700">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-white">Acción Táctica de Seguridad:</span>
                </div>

                {isConfigured && currentPhaseObj && (
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${currentPhaseObj.color}`}>
                    Fase: {currentPhaseObj.label}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 font-sans leading-relaxed mb-3">
                {action.actionText}
              </p>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Selecciona la Fase Correspondiente:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {NIST_PHASES.map((phase) => {
                    const isSelected = action.assignedPhase === phase.id;

                    return (
                      <button
                        key={phase.id}
                        onClick={() => handleAssignPhase(action.id, phase.id)}
                        className={`p-2 rounded-xl border text-center text-[11px] font-medium transition-all ${
                          isSelected
                            ? `${phase.color} shadow-md ring-1 ring-cyan-400/50 font-bold scale-[1.02]`
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {phase.short}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
