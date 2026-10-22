import React from 'react';
import { ForensicVerificationState, ForensicEvidenceItem } from '../../types/pbq';
import {
  FileSearch,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  HardDrive,
  Hash,
  FileCheck,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: ForensicVerificationState;
  onChange: (state: ForensicVerificationState) => void;
  onReset: () => void;
}

export const DigitalForensicsPBQ: React.FC<Props> = ({
  state,
  onChange,
  onReset,
}) => {
  const moveItem = (index: number, direction: 'up' | 'down') => {
    sound.playClick();
    const newItems = [...state.evidenceItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Update currentOrder to reflect new array order (1-indexed)
    const updated = newItems.map((item, idx) => ({
      ...item,
      currentOrder: idx + 1,
    }));

    onChange({
      ...state,
      evidenceItems: updated,
    });
  };

  const handleToggle = (field: 'chainOfCustodySignoff' | 'writeBlockerUsed') => {
    sound.playToggle();
    onChange({
      ...state,
      [field]: !state[field],
    });
  };

  const handleHashChange = (hash: string) => {
    sound.playClick();
    onChange({
      ...state,
      selectedHashAlgorithm: hash,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <FileSearch className="w-4 h-4 text-cyan-400" />
            Consola de Análisis Forense Digital y Cadena de Custodia (RFC 3227)
          </div>
          <p className="text-xs text-slate-400">
            Ordena las evidencias según el <strong>Orden de Volatilidad</strong> (de la más volátil que desaparece primero al reiniciar, a la menos volátil) y asegura los controles de integridad forense.
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

      {/* Main Interactive Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Reorderable Evidence List */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            <span>Prioridad de Adquisición Forense</span>
            <span className="font-mono text-cyan-400 text-[11px]">RFC 3227 Guidelines</span>
          </div>

          <div className="space-y-2">
            {state.evidenceItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 shadow-md hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 font-mono font-bold text-xs text-cyan-400 flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white leading-snug">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-tight mt-0.5 font-sans">
                      {item.description}
                    </div>
                  </div>
                </div>

                {/* Move buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, 'up')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-20 transition-colors"
                    title="Mover hacia arriba (Más volátil)"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === state.evidenceItems.length - 1}
                    onClick={() => moveItem(idx, 'down')}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-20 transition-colors"
                    title="Mover hacia abajo (Menos volátil)"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Integrity & Chain of Custody Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Controles de Integridad Forense
            </h3>

            {/* Hardware Write Blocker */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                  Bloqueador de Escritura Físico (Write Blocker)
                </label>
                <input
                  type="checkbox"
                  checked={state.writeBlockerUsed}
                  onChange={() => handleToggle('writeBlockerUsed')}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Previene que el SO forense modifique marcas de tiempo o metadatos en el disco bajo investigación.
              </p>
            </div>

            {/* Hash Algorithm Selector */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                Algoritmo Criptográfico de Integridad
              </label>
              <select
                value={state.selectedHashAlgorithm}
                onChange={(e) => handleHashChange(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="md5">MD5 (128 bits)</option>
                <option value="crc32">CRC32 (Checksum sin propiedades criptográficas)</option>
                <option value="sha1">SHA-1 (160 bits)</option>
                <option value="sha256">SHA-256 (256 bits)</option>
              </select>
            </div>

            {/* Chain of Custody */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Registro de Cadena de Custodia
                </label>
                <input
                  type="checkbox"
                  checked={state.chainOfCustodySignoff}
                  onChange={() => handleToggle('chainOfCustodySignoff')}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Documenta fecha, hora, responsable, número de caso y firmas en cada traspaso de evidencia para validez legal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
