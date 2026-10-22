import React from 'react';
import {
  Terminal,
  Search,
  ShieldCheck,
  AlertOctagon,
  RotateCcw,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { NmapScanState } from '../../types/pbq';
import { useHints } from '../../context/HintsContext';
import { shuffled } from '../../utils/shuffle';

interface NmapScanPBQProps {
  state: NmapScanState;
  onChange: (state: NmapScanState) => void;
  onReset: () => void;
}

export const NmapScanPBQ: React.FC<NmapScanPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const hints = useHints();
  const updateScanFlag = (value: string) => {
    onChange({ ...state, scanFlagAnswer: value });
  };

  const updateFinding = (id: string, field: 'selectedAnalysis' | 'selectedRemediation', value: string) => {
    const updated = state.portFindings.map((f) => {
      if (f.id === id) {
        return { ...f, [field]: value };
      }
      return f;
    });
    onChange({ ...state, portFindings: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                CompTIA Security Operations • Reconocimiento Nmap
              </span>
              <span className="text-slate-400 text-xs">Análisis Forense de Escaneo de Puertos</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              Interpretación de Escaneo Nmap y Hardening de Puertos
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              Un analista del SOC ha ejecutado una auditoría de reconocimiento activo con Nmap sobre la dirección IP 10.0.5.25.
              Examina la salida de la consola de terminal, identifica la técnica de escaneo empleada y selecciona el análisis de riesgo y la remediación adecuada para cada puerto descubierto.
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

      {/* Terminal Output Display */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="text-xs font-mono text-slate-400 ml-2">soc-analyst@kali: ~ # nmap -sS -sV -sC -O -T4 10.0.5.25</span>
          </div>
          <span className="text-[11px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
            Nmap 7.94 Raw Output
          </span>
        </div>

        <div className="p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto space-y-1">
          <p className="text-slate-500">Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-20 09:14 UTC</p>
          <p className="text-slate-400">Nmap scan report for corp-srv01.local (10.0.5.25)</p>
          <p className="text-slate-500">Host is up (0.00042s latency).</p>
          <p className="text-slate-500">Not shown: 996 closed tcp ports (reset)</p>
          <div className="py-2 text-cyan-300 font-bold border-y border-slate-800/80 my-2">
            PORT     STATE SERVICE     VERSION
            <br />
            21/tcp   open  ftp         vsftpd 2.3.4
            <br />
            | ftp-anon: Anonymous FTP login not allowed.
            <br />
            23/tcp   open  telnet      Linux telnetd (Debian)
            <br />
            445/tcp  open  netbios-ssn Microsoft Windows Server 2008 R2 (SMBv1 enabled)
            <br />
            |_ smb-vuln-ms17-010: VULNERABLE (Remote Code Execution in SMBv1)
            <br />
            3389/tcp open  ms-wbt-server Microsoft Terminal Services (RDP exposed directly)
          </div>
          <p className="text-slate-400">Device type: general purpose</p>
          <p className="text-slate-400">Running: Linux 4.X|5.X, Windows Server</p>
          <p className="text-slate-500">OS details: Microsoft Windows Server 2008 R2 SP1, Linux 4.15</p>
          <p className="text-purple-400 font-semibold mt-2">Nmap done: 1 IP address (1 host up) scanned in 4.31 seconds</p>
        </div>
      </div>

      {/* Part 1: Nmap Scan Technique Identification */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-purple-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Pregunta 1: Identificación de la Técnica de Escaneo Nmap
          </h4>
        </div>
        <p className="text-xs text-slate-300">
          En la consola se observa la flag utilizada para sondear los puertos enviando paquetes SYN sin completar el saludo TCP 3-way (los puertos cerrados responden con RST). ¿Cuál es la técnica evaluada?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {shuffled([
            { id: 'sS', label: '-sS (SYN Stealth Scan)', desc: 'Envía paquete SYN; si recibe SYN/ACK responde con RST para no completar la conexión (Half-open).' },
            { id: 'sT', label: '-sT (TCP Connect Scan)', desc: 'Completa todo el handshake TCP de 3 vías (SYN, SYN/ACK, ACK). Es más ruidoso y queda en logs.' },
            { id: 'sU', label: '-sU (UDP Scan)', desc: 'Envía paquetes UDP vacíos hacia puertos UDP (como 53 DNS o 161 SNMP) esperando ICMP unreachable.' },
            { id: 'sX', label: '-sX (Xmas Scan)', desc: 'Activa los flags FIN, PSH y URG encendidos al mismo tiempo (como un árbol de navidad).' },
          ]).map((opt) => (
            <button
              key={opt.id}
              onClick={() => updateScanFlag(opt.id)}
              className={`p-3 rounded-lg border text-left transition ${
                state.scanFlagAnswer === opt.id
                  ? 'bg-purple-950/80 border-purple-500 ring-1 ring-purple-500'
                  : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <div className="font-mono text-xs font-bold text-purple-300">{opt.label}</div>
              {hints && <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>}
            </button>
          ))}
        </div>
      </div>

      {/* Part 2: Port Findings Remediation Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Pregunta 2: Análisis de Vulnerabilidades y Remediación por Puerto Descubierto
          </h4>
        </div>

        <div className="space-y-4">
          {state.portFindings.map((finding) => (
            <div
              key={finding.id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-purple-950 text-purple-300 font-mono font-bold text-sm rounded-lg border border-purple-800/60">
                    {finding.portSpec}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{finding.serviceBanner}</div>
                    <div className="text-xs text-rose-400 font-mono mt-0.5">{finding.discoveredRisk}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vulnerability Analysis */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Clasificación de Riesgo CompTIA
                  </label>
                  <select
                    value={finding.selectedAnalysis}
                    onChange={(e) => updateFinding(finding.id, 'selectedAnalysis', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">-- Selecciona el riesgo técnico --</option>
                    <option value="exposed_remote_access">
                      Servicio de escritorio remoto RDP expuesto directamente a Internet sin intermediación segura
                    </option>
                    <option value="eternalblue_rce_risk">
                      SMBv1 vulnerable a ejecución remota de código EternalBlue (MS17-010 / WannaCry)
                    </option>
                    <option value="backdoor_compromise">
                      Backdoor malicioso (CVE-2011-2523 en vsftpd 2.3.4 abre shell root en puerto 6200 con smiley ':)')
                    </option>
                    <option value="insecure_cleartext_cli">
                      Servicio Telnet sin cifrado; contraseñas administrativas viajan en texto plano RFC 854
                    </option>
                  </select>
                </div>

                {/* Remediation Action */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Acción de Remediación Obligatoria
                  </label>
                  <select
                    value={finding.selectedRemediation}
                    onChange={(e) => updateFinding(finding.id, 'selectedRemediation', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">-- Selecciona la acción de remediación --</option>
                    <option value="disable_smbv1_enforce_smbv3_signing">
                      Deshabilitar SMBv1 por GPO/PowerShell, actualizar parches y exigir SMBv3 con cifrado y firma
                    </option>
                    <option value="shutdown_telnet_allow_ssh_22">
                      Detener y deshabilitar daemon telnetd; exigir autenticación por clave pública en OpenSSH (puerto 22)
                    </option>
                    <option value="remove_backdoor_replace_sftp">
                      Eliminar paquete vsftpd comprometido, aislar host y habilitar SFTP sobre SSH (puerto 22)
                    </option>
                    <option value="isolate_rdp_behind_bastion_mfa">
                      Bloquear acceso perimetral a 3389; canalizar RDP detrás de un Bastion Host / VPN con MFA y NLA
                    </option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
