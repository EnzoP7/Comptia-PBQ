import React from 'react';
import { SocialEngineeringCase } from '../../types/pbq';
import {
  Users,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Mail,
  PhoneCall,
  Smartphone,
  HardDrive,
  ShieldAlert,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  cases: SocialEngineeringCase[];
  onChange: (cases: SocialEngineeringCase[]) => void;
  onReset: () => void;
}

export const SocialEngineeringPBQ: React.FC<Props> = ({
  cases,
  onChange,
  onReset,
}) => {
  const handleSelectField = (
    caseId: string,
    field: 'selectedAttackType' | 'selectedInfluencePrinciple' | 'selectedMitigation',
    value: string
  ) => {
    sound.playClick();
    const updated = cases.map((c) =>
      c.id === caseId ? { ...c, [field]: value } : c
    );
    onChange(updated);
  };

  const answeredCount = cases.filter(
    (c) =>
      c.selectedAttackType !== '' &&
      c.selectedInfluencePrinciple !== '' &&
      c.selectedMitigation !== ''
  ).length;

  const getCaseIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Smartphone className="w-4 h-4 text-sky-400" />;
      case 1:
        return <PhoneCall className="w-4 h-4 text-emerald-400" />;
      case 2:
        return <Mail className="w-4 h-4 text-purple-400" />;
      case 3:
        return <HardDrive className="w-4 h-4 text-amber-400" />;
      default:
        return <Users className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-cyan-400" />
            Matriz de Clasificación de Ingeniería Social y Principios de Influencia
          </div>
          <p className="text-xs text-slate-400">
            Analiza los 4 incidentes reportados por empleados e identifica el vector de ataque exacto, el principio psicológico de influencia (Robert Cialdini / SY0-701) y la contramedida adecuada.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
            Completos:{' '}
            <strong className={answeredCount === cases.length ? 'text-emerald-400' : 'text-cyan-400'}>
              {answeredCount} / {cases.length}
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

      {/* Cases list */}
      <div className="space-y-4">
        {cases.map((c, idx) => {
          const isComplete =
            c.selectedAttackType !== '' &&
            c.selectedInfluencePrinciple !== '' &&
            c.selectedMitigation !== '';

          return (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border transition-all ${
                isComplete
                  ? 'bg-slate-900/90 border-slate-700'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center border border-slate-700">
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    {getCaseIcon(idx)}
                    <span>{c.title}</span>
                  </div>
                </div>

                {isComplete && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Analizado
                  </span>
                )}
              </div>

              {/* Scenario quote */}
              <div className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 italic font-sans leading-relaxed mb-4">
                &ldquo;{c.scenarioText}&rdquo;
              </div>

              {/* 3 Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Attack Vector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Tipo de Ataque:
                  </label>
                  <select
                    value={c.selectedAttackType}
                    onChange={(e) =>
                      handleSelectField(c.id, 'selectedAttackType', e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="">-- Seleccionar Ataque --</option>
                    <option value="whaling_bec">Whaling / BEC (Business Email Compromise)</option>
                    <option value="smishing">Smishing (SMS Phishing)</option>
                    <option value="spear_phishing">Spear Phishing genérico</option>
                    <option value="vishing">Vishing (Voice Phishing / Voz)</option>
                    <option value="baiting_usb">Baiting / USB Drop (Señuelo físico)</option>
                  </select>
                </div>

                {/* 2. Influence Principle */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Principio de Influencia (SY0-701):
                  </label>
                  <select
                    value={c.selectedInfluencePrinciple}
                    onChange={(e) =>
                      handleSelectField(c.id, 'selectedInfluencePrinciple', e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="">-- Seleccionar Principio --</option>
                    <option value="trust_consensus">Confianza (Trust)</option>
                    <option value="urgency">Urgencia (Urgency - Actuar de inmediato)</option>
                    <option value="scarcity_curiosity">Escasez / Curiosidad (Scarcity / Curiosity)</option>
                    <option value="authority">Autoridad / Intimidación (Authority / Fear)</option>
                  </select>
                </div>

                {/* 3. Mitigation */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Medida de Mitigación Táctica:
                  </label>
                  <select
                    value={c.selectedMitigation}
                    onChange={(e) =>
                      handleSelectField(c.id, 'selectedMitigation', e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="">-- Seleccionar Mitigación --</option>
                    <option value="verify_out_of_band">Verificación fuera de banda (Out-of-Band Callback a número oficial)</option>
                    <option value="disable_autorun_usb_blocking">Deshabilitar AutoRun / GPO bloqueo de almacenamiento USB masivo</option>
                    <option value="dual_authorization_wire">Doble autorización para transferencias y verificación de cuentas proveedor</option>
                    <option value="security_awareness_smishing">Campañas de simulación y no pulsar enlaces en SMS</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
