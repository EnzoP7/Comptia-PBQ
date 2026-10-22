import React from 'react';
import {
  ShieldAlert,
  Cpu,
  Layers,
  Activity,
  RotateCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ZeroTrustState } from '../../types/pbq';
import { useHints } from '../../context/HintsContext';
import { shuffled } from '../../utils/shuffle';

interface ZeroTrustPBQProps {
  state: ZeroTrustState;
  onChange: (state: ZeroTrustState) => void;
  onReset: () => void;
}

export const ZeroTrustPBQ: React.FC<ZeroTrustPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const hints = useHints();
  const updateField = (field: keyof ZeroTrustState, value: string) => {
    onChange({ ...state, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CompTIA Security+ • Arquitectura de Seguridad Moderna
              </span>
              <span className="text-slate-400 text-xs">NIST SP 800-207 Standard</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              Arquitectura Zero Trust (ZTA) y Microsegmentación
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              La organización está abandonando el modelo tradicional de castillo y foso (perímetro único confiable) para adoptar Zero Trust ("Nunca confiar, siempre verificar").
              Diseña los pilares arquitectónicos definiendo el motor de decisión (PDP), el punto de aplicación (PEP), la política de tráfico lateral y la verificación continua.
            </p>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-xs font-semibold transition self-start md:self-center"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Policy Decision Point / Engine */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-800/80 rounded-lg text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Pilar 1: Cerebro Lógico de Decisión</div>
              <h4 className="text-base font-bold text-white">Policy Decision Point (PDP / PE)</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ¿Cuál es el rol y comportamiento del Policy Engine (PE) dentro del Policy Decision Point según NIST SP 800-207?
          </p>

          <div className="space-y-2">
            {shuffled([
              { id: 'pdp_pe_continuous', label: 'PDP / Policy Engine con evaluación contextual en tiempo real', desc: 'Evalúa la identidad del usuario, telemetría del dispositivo, ubicación y postura de seguridad para emitir la decisión de acceso.' },
              { id: 'pdp_static_lan', label: 'Confianza implícita basada en si la IP proviene de la LAN corporativa', desc: 'Modelo perimetral heredado vulnerable; viola el primer principio de Zero Trust.' },
              { id: 'pdp_admin_manual', label: 'Aprobación manual por correo de cada solicitud de acceso', desc: 'No escala y no permite respuesta adaptativa en tiempo real ante amenazas.' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateField('policyDecisionEngine', opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  state.policyDecisionEngine === opt.id
                    ? 'bg-emerald-950/80 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="text-xs font-bold text-emerald-300">{opt.label}</div>
                {hints && <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Pillar 2: Policy Enforcement Point */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/80 border border-blue-800/80 rounded-lg text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Pilar 2: Control de Aplicación</div>
              <h4 className="text-base font-bold text-white">Policy Enforcement Point (PEP)</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ¿Dónde y cómo opera el Policy Enforcement Point (PEP) para restringir el acceso a los recursos empresariales?
          </p>

          <div className="space-y-2">
            {shuffled([
              { id: 'pep_edge_microperimeter', label: 'PEP situado en el microperímetro del recurso (Gateway / Agente)', desc: 'Intercepta, autoriza o finaliza la conexión hacia el recurso específico siguiendo estrictamente las instrucciones del PDP.' },
              { id: 'pep_perimeter_router_only', label: 'Únicamente en el router de borde hacia Internet', desc: 'Deja el interior de la red desprotegido ante movimientos laterales.' },
              { id: 'pep_client_dns_cache', label: 'En el archivo hosts local de cada estación de trabajo', desc: 'Fácilmente evadible por atacantes locales.' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateField('policyEnforcementLocation', opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  state.policyEnforcementLocation === opt.id
                    ? 'bg-blue-950/80 border-blue-500 ring-1 ring-blue-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="text-xs font-bold text-blue-300">{opt.label}</div>
                {hints && <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Pillar 3: Microsegmentation East-West */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-950/80 border border-violet-800/80 rounded-lg text-violet-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-violet-400 uppercase tracking-wider">Pilar 3: Movimiento Lateral</div>
              <h4 className="text-base font-bold text-white">Microsegmentación de Red Este-Oeste</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Si un servidor web en la DMZ resulta vulnerado, ¿qué política de tráfico Este-Oeste impide que el atacante pivotee hacia las bases de datos internas?
          </p>

          <div className="space-y-2">
            {shuffled([
              { id: 'microsegmentation_least_privilege', label: 'Microsegmentación basada en software con principio de mínimo privilegio', desc: 'Aisla cargas de trabajo individuales; el servidor web solo puede hablar con el puerto de BD autorizado, bloqueando todo lo demás.' },
              { id: 'flat_vlan_allow_all', label: 'Red plana o VLAN compartida sin filtrado interno', desc: 'Permite a un atacante escanear y comprometer cualquier otro servidor interno.' },
              { id: 'port_mirroring_only', label: 'Solo monitoreo pasivo por Port Mirroring (SPAN)', desc: 'Solo observa pasivamente sin bloquear el movimiento lateral.' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateField('networkTrafficControl', opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  state.networkTrafficControl === opt.id
                    ? 'bg-violet-950/80 border-violet-500 ring-1 ring-violet-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="text-xs font-bold text-violet-300">{opt.label}</div>
                {hints && <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Pillar 4: Continuous Adaptive Evaluation */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-950/80 border border-amber-800/80 rounded-lg text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pilar 4: Confianza Dinámica</div>
              <h4 className="text-base font-bold text-white">Validación Continua de Riesgo</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ¿Cómo gestiona Zero Trust la validez de una sesión activa si el dispositivo cambia de red o desactiva su antivirus durante el día?
          </p>

          <div className="space-y-2">
            {shuffled([
              { id: 'continuous_adaptive_risk_validation', label: 'Validación continua adaptativa de riesgo durante toda la sesión', desc: 'Si la postura del endpoint se degrada (antivirus apagado o IP anómala), el PDP revoca de inmediato los tokens activos.' },
              { id: 'session_trust_infinite', label: 'Confiar indefinidamente una vez completado el MFA matutino', desc: 'Ignora si el endpoint fue infectado 5 minutos después del login.' },
              { id: 'reauth_only_after_8_hours', label: 'Reautenticación fija cada 8 horas sin importar eventos intermedios', desc: 'Inadecuado ante incidentes activos en tiempo real.' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateField('continuousTrustEvaluation', opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  state.continuousTrustEvaluation === opt.id
                    ? 'bg-amber-950/80 border-amber-500 ring-1 ring-amber-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="text-xs font-bold text-amber-300">{opt.label}</div>
                {hints && <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
