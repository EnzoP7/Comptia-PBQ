import React from 'react';
import { SecurityCliScenario } from '../../types/pbq';
import {
  Terminal,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  HelpCircle,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  scenarios: SecurityCliScenario[];
  onChange: (scenarios: SecurityCliScenario[]) => void;
  onReset: () => void;
}

export const SecurityCliPBQ: React.FC<Props> = ({
  scenarios,
  onChange,
  onReset,
}) => {
  const handleSelectCommand = (id: string, command: string) => {
    sound.playClick();
    const updated = scenarios.map((s) =>
      s.id === id ? { ...s, selectedCommand: command } : s
    );
    onChange(updated);
  };

  const answeredCount = scenarios.filter((s) => s.selectedCommand !== '').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Consola Táctica de Diagnóstico por Comandos CLI de Seguridad (Linux / Windows)
          </div>
          <p className="text-xs text-slate-400">
            En el examen CompTIA Security+, se evalúa la capacidad de seleccionar la sintaxis exacta de comandos de terminal (con sus flags correctos) para investigar síntomas de intrusión.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
            Completados:{' '}
            <strong className={answeredCount === scenarios.length ? 'text-emerald-400' : 'text-cyan-400'}>
              {answeredCount} / {scenarios.length}
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

      {/* Scenarios Grid */}
      <div className="space-y-4">
        {scenarios.map((sc, idx) => {
          const isConfigured = sc.selectedCommand !== '';

          return (
            <div
              key={sc.id}
              className={`p-5 rounded-2xl border transition-all ${
                isConfigured
                  ? 'bg-slate-900/90 border-slate-700 shadow-md'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center border border-slate-700">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-white">{sc.investigationGoal}</span>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-cyan-300">
                  {sc.systemType} CLI
                </span>
              </div>

              {/* Symptom Terminal Block */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-300 mb-3 space-y-1">
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                  Síntoma Reportado por el SOC:
                </div>
                <div className="text-slate-200">{sc.detectedSymptom}</div>
              </div>

              {/* Command Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Selecciona el comando CLI exacto con sus flags de auditoría:
                </label>
                <select
                  value={sc.selectedCommand}
                  onChange={(e) => handleSelectCommand(sc.id, e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="">-- Seleccionar Comando CLI --</option>
                  {sc.id === 'cli-ports' && (
                    <>
                      <option value="ping_localhost">ping 127.0.0.1</option>
                      <option value="netstat_tulpn">netstat -tulpn (o ss -tulpn en Linux moderno)</option>
                      <option value="ipconfig">ipconfig /all</option>
                      <option value="traceroute">traceroute 8.8.8.8</option>
                    </>
                  )}
                  {sc.id === 'cli-sniff' && (
                    <>
                      <option value="tcpdump_eth0">tcpdump -i eth0 -nn -s0</option>
                      <option value="curl_google">curl -v http://google.com</option>
                      <option value="cat_network">cat /etc/network/interfaces</option>
                      <option value="nslookup">nslookup localhost</option>
                    </>
                  )}
                  {sc.id === 'cli-hash' && (
                    <>
                      <option value="ls_la">ls -la /bin/login</option>
                      <option value="sha256sum">sha256sum /bin/login (o Get-FileHash -Algorithm SHA256)</option>
                      <option value="chmod_777">chmod 777 /bin/login</option>
                      <option value="grep_root">grep root /etc/passwd</option>
                    </>
                  )}
                  {sc.id === 'cli-permissions' && (
                    <>
                      <option value="chmod_777">chmod 777 /etc/shadow</option>
                      <option value="chmod_600_root">chmod 600 /etc/shadow && chown root:root /etc/shadow</option>
                      <option value="rm_shadow">rm -rf /etc/shadow</option>
                      <option value="touch_shadow">touch /etc/shadow</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
