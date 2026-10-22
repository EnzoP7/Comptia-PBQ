import React from 'react';
import {
  ShieldAlert,
  Search,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Server,
  Lock,
  Cpu,
  FileCode,
  Radio
} from 'lucide-react';
import { MitreThreatHuntingState } from '../../types/pbq';

interface MitreThreatHuntingPBQProps {
  state: MitreThreatHuntingState;
  onChange: (newState: MitreThreatHuntingState) => void;
  onReset: () => void;
}

export const MitreThreatHuntingPBQ: React.FC<MitreThreatHuntingPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (
    caseId: string,
    field: 'mitreCode' | 'telemetrySource' | 'remediationControl',
    value: string
  ) => {
    const updated = state.scenarios.map((sc) => {
      if (sc.id === caseId) {
        return {
          ...sc,
          [field]: value,
        };
      }
      return sc;
    });
    onChange({ scenarios: updated });
  };

  const mitreCodeOptions = [
    { value: '', label: 'Seleccionar Técnica MITRE...' },
    { value: 'T1058', label: 'T1058: Kerberoasting (Ticket Granting Service Requests)' },
    { value: 'T1003', label: 'T1003: OS Credential Dumping (LSASS Memory Mimikatz)' },
    { value: 'T1557.001', label: 'T1557.001: Adversary-in-the-Middle (LLMNR / NBT-NS Poisoning)' },
    { value: 'T1558.001', label: 'T1558.001: Golden Ticket (KRBTGT Kerberos Forgery)' },
    { value: 'T1059.001', label: 'T1059.001: Command and Scripting Interpreter (PowerShell Ofuscado)' },
  ];

  const telemetryOptions = [
    { value: '', label: 'Seleccionar Fuente de Telemetría SIEM / Event ID...' },
    { value: 'event_4769_rc4', label: 'Security Event ID 4769: Solicitud TGS con cifrado débil 0x17 (RC4-HMAC)' },
    { value: 'event_4624_type9_lsass', label: 'Event ID 4624 Logon Type 9 (NewCredentials) + Acceso directo a lsass.exe' },
    { value: 'event_4625_responder', label: 'Event ID 4625 ráfagas fallidas + Tráfico UDP 5355 LLMNR Broadcast anómalo' },
    { value: 'event_4768_forged_tgt', label: 'Event ID 4768: TGT con validez anormal de 10 años sin pre-autenticación' },
    { value: 'event_4104_scriptblock', label: 'Event ID 4104: Script Block Logging con comandos codificados Base64 (-EncodedCommand)' },
  ];

  const remediationOptions = [
    { value: '', label: 'Seleccionar Mitigación Oficial CompTIA...' },
    { value: 'gmsa_aes256', label: 'Implementar gMSA (Group Managed Service Accounts) forzando AES-256' },
    { value: 'credential_guard_lsa', label: 'Habilitar Windows Defender Credential Guard con VBS y LSA Protection' },
    { value: 'disable_llmnr_smb_signing', label: 'Deshabilitar LLMNR y NetBIOS vía GPO + Exigir SMB Signing en la LAN' },
    { value: 'krbtgt_double_reset', label: 'Resetear dos veces consecutivas la contraseña de la cuenta KRBTGT' },
    { value: 'clm_wdac_applocker', label: 'Configurar Constrained Language Mode (CLM) + WDAC / AppLocker' },
  ];

  return (
    <div className="space-y-6">
      {/* Context banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Threat Hunting, Telemetría de Active Directory y Matriz MITRE ATT&CK - SY0-701</span>
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
          Como analista del SOC / Threat Hunter, investigas 5 incidentes críticos en la infraestructura de Active Directory corporativa. Para cada escenario, identifica la <strong className="text-white">Técnica MITRE ATT&CK</strong>, la <strong className="text-cyan-300">Fuente de Telemetría o Windows Event ID</strong> correspondiente, y la <strong className="text-emerald-300">Contramedida Oficial</strong> prescrita por CompTIA Security+.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="space-y-4">
        {state.scenarios.map((sc, index) => (
          <div
            key={sc.id}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700/80 transition-colors space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-rose-400">
                  {index + 1}
                </span>
                <span className="text-xs font-bold text-white">
                  {sc.techniqueName}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* MITRE Code */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Técnica MITRE ATT&CK:
                </label>
                <select
                  value={sc.mitreCode}
                  onChange={(e) => handleChange(sc.id, 'mitreCode', e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                >
                  {mitreCodeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Telemetry Source */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                  Telemetría / Event ID SIEM:
                </label>
                <select
                  value={sc.telemetrySource}
                  onChange={(e) => handleChange(sc.id, 'telemetrySource', e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {telemetryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remediation */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                  Contramedida / Mitigación CompTIA:
                </label>
                <select
                  value={sc.remediationControl}
                  onChange={(e) => handleChange(sc.id, 'remediationControl', e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {remediationOptions.map((opt) => (
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
