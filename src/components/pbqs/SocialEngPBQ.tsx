import React from 'react';
import {
  Users,
  ShieldAlert,
  Brain,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  PhoneCall,
  Mail,
  HardDrive
} from 'lucide-react';
import { SocialEngState } from '../../types/pbq';

interface SocialEngPBQProps {
  state: SocialEngState;
  onChange: (newState: SocialEngState) => void;
  onReset: () => void;
}

export const SocialEngPBQ: React.FC<SocialEngPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleCaseChange = (
    caseId: string,
    field: 'identifiedTrigger' | 'primaryDefense',
    val: string
  ) => {
    const updated = state.cases.map((c) =>
      c.id === caseId ? { ...c, [field]: val } : c
    );
    onChange({
      ...state,
      cases: updated,
    });
  };

  return (
    <div className="space-y-6">
      {/* Scenario Context Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
            <Users className="w-4 h-4" />
            <span>Matriz de Ingeniería Social y Factores de Persuasión CompTIA SY0-701</span>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          El equipo de Red Team y el SOC han registrado cinco incidentes dirigidos contra distintas áreas de la empresa. Para cada caso, diagnostica el <span className="text-cyan-300 font-semibold">disparador psicológico</span> (Psychological Reason / Trigger) explotado por el atacante según los principios de Robert Cialdini evaluados en CompTIA, y asigna la <span className="text-emerald-300 font-semibold">contramedida técnica y procedimental primaria</span>.
        </p>
      </div>

      {/* Attacks Grid */}
      <div className="space-y-4">
        {state.cases.map((item, idx) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center text-[10px] text-rose-300">
                  {idx + 1}
                </span>
                {item.techniqueName}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Vector: {item.id}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-sans">
              "{item.scenarioText}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Psychological Trigger */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-amber-400" />
                  Disparador Psicológico de Persuasión (Cialdini):
                </label>
                <select
                  value={item.identifiedTrigger}
                  onChange={(e) =>
                    handleCaseChange(item.id, 'identifiedTrigger', e.target.value)
                  }
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="unselected">-- Seleccionar Disparador Psicológico --</option>
                  <option value="consensus">
                    Consenso / Prueba Social (Consensus / Social Proof: Todos los demás en el sector lo están haciendo)
                  </option>
                  <option value="authority">
                    Autoridad (Authority: Simular alto rango ejecutivo o directiva legal)
                  </option>
                  <option value="familiarity">
                    Familiaridad / Simpatía (Familiarity / Liking: Fingir cercanía con un colega o proveedor común)
                  </option>
                  <option value="intimidation">
                    Intimidación (Intimidation: Amenaza de despido, sanción disciplinaria o denuncia)
                  </option>
                  <option value="scarcity">
                    Escasez / Curiosidad (Scarcity: Oportunidad exclusiva o acceso a datos confidenciales limitados)
                  </option>
                  <option value="urgency">
                    Urgencia (Urgency: Presión de tiempo límite inmediato para evitar reflexión)
                  </option>
                </select>
              </div>

              {/* Primary Defense */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Contramedida Primaria Oficial (Técnica / Procedimiento):
                </label>
                <select
                  value={item.primaryDefense}
                  onChange={(e) =>
                    handleCaseChange(item.id, 'primaryDefense', e.target.value)
                  }
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="unselected">-- Seleccionar Contramedida --</option>
                  <option value="dmarc_out_of_band">
                    DMARC estricto + Verificación Fuera de Banda (Out-of-Band Call) antes de transferencias financieras
                  </option>
                  <option value="anti_vishing_call_back">
                    Procedimiento de Devolución de Llamada a Número Corporativo Oficial (Call-back Verification)
                  </option>
                  <option value="security_awareness_training">
                    Programa continuo de Concienciación en Seguridad y Simulación periódica de Phishing
                  </option>
                  <option value="disable_usb_mass_storage">
                    Deshabilitar almacenamiento masivo USB mediante Directiva de Grupo (GPO / EDR Device Control)
                  </option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
