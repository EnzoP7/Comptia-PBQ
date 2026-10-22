import React from 'react';
import {
  Zap,
  Activity,
  Terminal,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  Cpu,
  Clock,
  Layers
} from 'lucide-react';
import { SoarAutomationState } from '../../types/pbq';
import { shuffled } from '../../utils/shuffle';

interface Props {
  state: SoarAutomationState;
  onChange: (newState: SoarAutomationState) => void;
  onReset: () => void;
}

export const SoarAutomationPBQ: React.FC<Props> = ({ state, onChange, onReset }) => {
  const handleChange = (
    scenarioId: string,
    field: 'correlationTrigger' | 'automatedSoarAction',
    val: string
  ) => {
    const updated = state.scenarios.map((sc) => {
      if (sc.id === scenarioId) {
        return {
          ...sc,
          [field]: val,
        };
      }
      return sc;
    });
    onChange({ scenarios: updated });
  };

  const triggerOptions = [
    { value: '', label: '-- Seleccionar Regla de Correlación SIEM --' },
    { value: 'impossible_travel_anomaly', label: 'Detección de Viaje Imposible / Anomalía de Velocidad Geográfica en ventana de 10 min' },
    { value: 'mass_file_entropy_vss_wipe', label: 'Umbral crítico de I/O en disco (>200 ops/s) + Ejecución de vssadmin delete shadows' },
    { value: 'office_child_process_powershell_network', label: 'Proceso hijo PowerShell/CMD invocado por suite de Office con socket de red WAN' },
    { value: 'ssh_failed_auth_threshold_burst', label: 'Ráfaga de >50 intentos fallidos de autenticación SSH en menos de 60 segundos' },
    { value: 'unauthorized_domain_admin_escalation_offhours', label: 'Event ID 4728: Adición de cuenta a grupo Domain Admins fuera de horario laboral' },
    // Distractors
    { value: 'ntp_clock_drift', label: 'Más de 5 inicios de sesión fallidos de un usuario en 24 horas' },
    { value: 'dhcp_lease_renewal', label: 'Detección antivirus del archivo de prueba EICAR' }
  ];

  const actionOptions = [
    { value: '', label: '-- Seleccionar Acción Automatizada SOAR --' },
    { value: 'revoke_session_prompt_mfa_disable', label: 'Revocar tokens de sesión en IdP, forzar cambio de contraseña y exigir desafío MFA FIDO2' },
    { value: 'quarantine_host_edr_block_c2_perimeter', label: 'Aislar host de red mediante agente EDR y bloquear IP de baliza C2 en NGFW perimetral' },
    { value: 'kill_tree_quarantine_attachment_purge_mailboxes', label: 'Terminar árbol de procesos, aislar host y purgar el correo de todos los buzones por API' },
    { value: 'push_temporary_block_ngfw_ban', label: 'Insertar regla de denegación temporal (IP Ban) en la lista dinámica del NGFW perimetral' },
    { value: 'remove_member_disable_account_page_oncall', label: 'Eliminar usuario de Domain Admins, deshabilitar cuenta y alertar al analista de guardia' },
    // Distractors
    { value: 'log_and_close_ticket', label: 'Registrar la incidencia como falsa alarma y cerrar ticket automáticamente' },
    { value: 'reboot_domain_controller', label: 'Enviar un correo al usuario pidiéndole que cambie su contraseña' }
  ];

  return (
    <div className="space-y-6">
      {/* Context Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
            <Zap className="w-4 h-4" />
            <span>Reglas de Correlación SIEM & Automatización SOAR — SY0-701</span>
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
          En el <strong className="text-white">Dominio 4 de CompTIA Security+ SY0-701</strong> (Operaciones de Seguridad), los centros de operaciones (SOC) utilizan Security Orchestration, Automation, and Response (SOAR) para acelerar el tiempo medio de respuesta (MTTR). Correlaciona cada patrón de telemetría SIEM con su <strong className="text-amber-300">Condición de Disparo</strong> y prescribe la <strong className="text-cyan-300">Acción del Playbook Automatizado</strong> correspondiente.
        </p>
      </div>

      {/* Scenarios List */}
      <div className="space-y-5">
        {state.scenarios.map((sc, index) => (
          <div
            key={sc.id}
            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700/80 transition-colors space-y-4 shadow-lg"
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-400 flex items-center justify-center shrink-0">
                #{index + 1}
              </span>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white tracking-wide">
                  {sc.incidentTitle}
                </h4>
              </div>
            </div>

            {/* SIEM Log Pattern / Event box */}
            <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-800/80 font-mono text-[11px] text-cyan-300 flex items-start gap-2.5">
              <Terminal className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-slate-300 w-full">
                <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px] mb-1">
                  Patrón de Telemetría Registrado en SIEM:
                </span>
                <pre className="text-amber-200 font-mono text-[11px] leading-relaxed">
                  {sc.siemLogPattern}
                </pre>
              </div>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Condición de Disparo de Correlación SIEM:</span>
                </label>
                <select
                  value={sc.correlationTrigger}
                  onChange={(e) => handleChange(sc.id, 'correlationTrigger', e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 font-sans"
                >
                  {shuffled(triggerOptions).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Acción de Playbook Automatizado SOAR:</span>
                </label>
                <select
                  value={sc.automatedSoarAction}
                  onChange={(e) => handleChange(sc.id, 'automatedSoarAction', e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500 font-sans"
                >
                  {shuffled(actionOptions).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
