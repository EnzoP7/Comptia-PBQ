import React from 'react';
import { DlpPolicyItem } from '../../types/pbq';
import { shuffled } from '../../utils/shuffle';
import {
  ShieldCheck,
  Lock,
  RotateCcw,
  CheckCircle2,
  Database,
  ArrowRightLeft,
  Monitor,
  FileSpreadsheet,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  items: DlpPolicyItem[];
  onChange: (items: DlpPolicyItem[]) => void;
  onReset: () => void;
}

export const DlpDataProtectionPBQ: React.FC<Props> = ({
  items,
  onChange,
  onReset,
}) => {
  const handleSelectControl = (itemId: string, controlValue: string) => {
    sound.playClick();
    const updated = items.map((item) =>
      item.id === itemId ? { ...item, selectedControl: controlValue } : item
    );
    onChange(updated);
  };

  const answeredCount = items.filter((i) => i.selectedControl !== '').length;

  const getStateIcon = (state: DlpPolicyItem['dataState']) => {
    switch (state) {
      case 'At-Rest':
        return <Database className="w-3.5 h-3.5 text-amber-400" />;
      case 'In-Transit':
        return <ArrowRightLeft className="w-3.5 h-3.5 text-sky-400" />;
      case 'In-Use':
        return <Monitor className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Matriz de Prevención de Pérdida de Datos (DLP) y Estados de los Datos
          </div>
          <p className="text-xs text-slate-400">
            Asigna el control criptográfico y de DLP adecuado según el estado del dato (At-Rest, In-Transit, In-Use) y su nivel de confidencialidad.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
            Asignados:{' '}
            <strong className={answeredCount === items.length ? 'text-emerald-400' : 'text-cyan-400'}>
              {answeredCount} / {items.length}
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

      {/* Grid of DLP items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const isConfigured = item.selectedControl !== '';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isConfigured
                  ? 'bg-slate-900/90 border-slate-700 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-slate-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center border border-slate-700">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white">{item.dataType}</span>
                  </div>

                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300">
                    {getStateIcon(item.dataState)}
                    <span>{item.dataState}</span>
                  </span>
                </div>

                <div className="text-[11px] font-mono text-cyan-400 mb-2">
                  Categoría: {item.categoryName}
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/70 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Control DLP / Criptográfico Recomendado:
                </label>
                {shuffled(item.controlOptions).map((opt) => {
                  const isSelected = item.selectedControl === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectControl(item.id, opt.value)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 text-white font-medium ring-1 ring-cyan-500/40'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-500 text-white'
                            : 'border-slate-600 bg-slate-900'
                        }`}
                      >
                        {isSelected && <div className="w-1 h-1 rounded-full bg-slate-950" />}
                      </div>
                      <span className="leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
