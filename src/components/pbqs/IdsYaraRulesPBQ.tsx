import React from 'react';
import { IdsYaraState } from '../../types/pbq';
import {
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  FileCode,
  Terminal,
  Code2,
  Sliders,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: IdsYaraState;
  onChange: (state: IdsYaraState) => void;
  onReset: () => void;
}

export const IdsYaraRulesPBQ: React.FC<Props> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof IdsYaraState, value: any) => {
    sound.playClick();
    onChange({
      ...state,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Code2 className="w-4 h-4 text-cyan-400" />
            Ingeniería de Reglas de Detección: Snort (NIDS) y Reglas YARA (Malware)
          </div>
          <p className="text-xs text-slate-400">
            Construye la sintaxis exacta de una regla de Snort para bloquear inyecciones SQL en tránsito y configura la condición de una regla YARA para detectar ejecutables maliciosos PE en disco.
          </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section 1: Snort Rule Builder */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              1. Constructor de Regla Snort (NIDS/NIPS)
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">SQL Injection Rule</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800">
            <code>
              {state.snortAction} {state.snortProtocol} any any -&gt; $HOME_NET 80 (msg:&quot;SQLi Union Attack&quot;; content:&quot;{state.snortContentMatch}&quot;; {state.snortNocase ? 'nocase; ' : ''}sid:1000001; rev:1;)
            </code>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                Acción de la Regla (Rule Action):
              </label>
              <select
                value={state.snortAction}
                onChange={(e) => handleChange('snortAction', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="drop">drop (IPS en línea: descarta activamente el paquete y bloquea el ataque)</option>
                <option value="alert">alert (Solo genera alerta en el log sin bloquear)</option>
                <option value="pass">pass (Ignora el tráfico silenciosamente)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                Patrón de Contenido Malicioso (content:&quot;...&quot;):
              </label>
              <select
                value={state.snortContentMatch}
                onChange={(e) => handleChange('snortContentMatch', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="admin">admin</option>
                <option value="UNION SELECT">UNION SELECT</option>
                <option value="GET /">GET /</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">Modificador nocase (Case-Insensitive)</span>
                <span className="text-[11px] text-slate-400">Detecta &quot;union select&quot;, &quot;UnIoN SeLeCt&quot; y variantes</span>
              </div>
              <input
                type="checkbox"
                checked={state.snortNocase}
                onChange={(e) => handleChange('snortNocase', e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Section 2: YARA Rule Builder */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyan-400" />
              2. Definición de Regla YARA (Detección de Malware)
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">PE Trojan Rule</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800 space-y-0.5">
            <div>rule Suspicious_Backdoor &#123;</div>
            <div className="pl-3 text-slate-400">strings:</div>
            <div className="pl-6 text-emerald-400">$str = &quot;{state.yaraStringMatch}&quot;</div>
            <div className="pl-3 text-slate-400">condition:</div>
            <div className="pl-6 text-amber-300">uint16(0) == {state.yaraMagicHeader} and $str</div>
            <div>&#125;</div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                Magic Number Header (uint16(0)):
              </label>
              <select
                value={state.yaraMagicHeader}
                onChange={(e) => handleChange('yaraMagicHeader', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="0x5A4D">0x5A4D</option>
                <option value="0x2550">0x2550</option>
                <option value="0x0000">0x0000</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                Cadena Maliciosa de Comando Embebido ($str):
              </label>
              <select
                value={state.yaraStringMatch}
                onChange={(e) => handleChange('yaraStringMatch', e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="notepad.exe">notepad.exe</option>
                <option value="cmd.exe /c powershell -enc">cmd.exe /c powershell -enc</option>
                <option value="Hello World">Hello World</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
