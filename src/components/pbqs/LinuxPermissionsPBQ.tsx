import React from 'react';
import { Terminal, RotateCcw, Folder, FileText } from 'lucide-react';
import { LinuxPermissionsState } from '../../types/pbq';
import { LINUX_QUESTIONS } from '../../data/linuxPermissionsPbq';
import { SPECIAL, toOctal, toSymbolic } from '../../utils/linuxPermissions';
import { useHints } from '../../context/HintsContext';
import { shuffled } from '../../utils/shuffle';
import { sound } from '../../utils/audio';

interface Props {
  state: LinuxPermissionsState;
  onChange: (state: LinuxPermissionsState) => void;
  onReset: () => void;
}

const WHO = [
  { label: 'u (dueño)', shift: 6 },
  { label: 'g (grupo)', shift: 3 },
  { label: 'o (otros)', shift: 0 },
];
const BITS = [
  { label: 'r', value: 4 },
  { label: 'w', value: 2 },
  { label: 'x', value: 1 },
];
const SPECIAL_BITS = [
  { label: 'SUID', value: SPECIAL.suid },
  { label: 'SGID', value: SPECIAL.sgid },
  { label: 'Sticky', value: SPECIAL.sticky },
];

export const LinuxPermissionsPBQ: React.FC<Props> = ({ state, onChange, onReset }) => {
  const hints = useHints();

  const toggleBit = (fileId: string, bit: number) => {
    sound.playToggle();
    onChange({ ...state, files: state.files.map((f) => (f.id === fileId ? { ...f, mode: f.mode ^ bit } : f)) });
  };

  const answer = (questionId: string, value: string) => {
    sound.playClick();
    onChange({ ...state, answers: { ...state.answers, [questionId]: value } });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <Terminal className="w-4 h-4" />
            <span>root@prod-web01:~# ls -ld &lt;ruta&gt;</span>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Marca los bits de cada ruta. La columna de modo muestra el resultado tal como lo listaría <code>ls -l</code>.
        </p>
      </div>

      <div className="space-y-3">
        {state.files.map((file) => (
          <div key={file.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
              {file.isDirectory ? <Folder className="w-4 h-4 text-amber-400" /> : <FileText className="w-4 h-4 text-cyan-400" />}
              <span className="text-emerald-300 font-bold tracking-wider">{toSymbolic(file.mode, file.isDirectory)}</span>
              <span className="text-slate-400">
                {file.owner} {file.group}
              </span>
              <span className="text-white">{file.path}</span>
              {hints && <span className="text-slate-500">(octal {toOctal(file.mode)})</span>}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{file.requirement}</p>

            <div className="flex flex-wrap gap-3">
              {WHO.map((who) => (
                <div key={who.label} className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold w-16">{who.label}</span>
                  {BITS.map((bit) => {
                    const mask = bit.value << who.shift;
                    const on = (file.mode & mask) !== 0;
                    return (
                      <button
                        key={bit.label}
                        onClick={() => toggleBit(file.id, mask)}
                        aria-pressed={on}
                        className={`w-7 h-7 rounded-md font-mono text-xs font-bold border transition-colors ${
                          on ? 'bg-emerald-900 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-700 text-slate-500 hover:text-white'
                        }`}
                      >
                        {bit.label}
                      </button>
                    );
                  })}
                </div>
              ))}
              <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold">Especiales</span>
                {SPECIAL_BITS.map((bit) => {
                  const on = (file.mode & bit.value) !== 0;
                  return (
                    <button
                      key={bit.label}
                      onClick={() => toggleBit(file.id, bit.value)}
                      aria-pressed={on}
                      className={`px-2 h-7 rounded-md font-mono text-[11px] font-bold border transition-colors ${
                        on ? 'bg-amber-900 border-amber-500 text-amber-200' : 'bg-slate-950 border-slate-700 text-slate-500 hover:text-white'
                      }`}
                    >
                      {bit.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Ticket de operaciones: comandos</h4>
        {LINUX_QUESTIONS.map((q, idx) => (
          <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <p className="text-sm text-slate-100">
              <span className="font-mono text-cyan-400 mr-2">{idx + 1}.</span>
              {q.prompt}
            </p>
            {q.evidence && (
              <pre className="text-[11px] font-mono text-amber-200 bg-slate-900 border border-slate-800 rounded-lg p-2.5 whitespace-pre-wrap">{q.evidence}</pre>
            )}
            <select
              value={state.answers[q.id] ?? ''}
              onChange={(e) => answer(q.id, e.target.value)}
              className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- Seleccionar --</option>
              {shuffled(q.options, (o) => `${q.id}:${o.value}`).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};
