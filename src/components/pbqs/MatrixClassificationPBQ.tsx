import React from 'react';
import { Grid3x3, RotateCcw } from 'lucide-react';
import { MatrixAnswers, MatrixPbqConfig } from '../../types/pbq';
import { shuffled } from '../../utils/shuffle';
import { sound } from '../../utils/audio';

interface Props {
  config: MatrixPbqConfig;
  answers: MatrixAnswers;
  onChange: (answers: MatrixAnswers) => void;
  onReset: () => void;
}

/**
 * Generic "match each item to its category" simulator, the most common PBQ format on
 * SY0-701 (drag-and-drop classification). Options are shared per column and shuffled.
 */
export const MatrixClassificationPBQ: React.FC<Props> = ({ config, answers, onChange, onReset }) => {
  const handleSelect = (rowId: string, columnId: string, value: string) => {
    sound.playClick();
    onChange({ ...answers, [rowId]: { ...answers[rowId], [columnId]: value } });
  };

  const totalCells = config.sections.reduce((acc, s) => acc + s.rows.length * s.columns.length, 0);
  const filledCells = config.sections.reduce(
    (acc, s) => acc + s.rows.reduce((a, r) => a + s.columns.filter((c) => answers[r.id]?.[c.id]).length, 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
            <Grid3x3 className="w-4 h-4" />
            <span>{config.consoleTitle}</span>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{config.instructions}</p>
        <div className="text-[11px] font-mono text-slate-500">
          Casillas completadas: <span className="text-white font-bold">{filledCells}</span>/{totalCells}
        </div>
      </div>

      {config.sections.map((section) => (
        <div key={section.id} className="space-y-3">
          {config.sections.length > 1 && (
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">{section.title}</h4>
          )}
          {section.rows.map((row, idx) => (
            <div key={row.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-cyan-400 border border-slate-700 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="space-y-2 min-w-0 flex-1">
                  <p className="text-sm text-slate-100 leading-relaxed">{row.prompt}</p>
                  {row.evidence && (
                    <pre className="text-[11px] font-mono text-amber-200 bg-slate-900 border border-slate-800 rounded-lg p-2.5 whitespace-pre-wrap break-all">
                      {row.evidence}
                    </pre>
                  )}
                </div>
              </div>
              <div className={`grid gap-3 ${section.columns.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                {section.columns.map((col) => (
                  <label key={col.id} className="space-y-1 block">
                    <span className="text-[11px] font-semibold text-slate-400">{col.label}</span>
                    {col.freeText ? (
                      <input
                        value={answers[row.id]?.[col.id] ?? ''}
                        onChange={(e) => onChange({ ...answers, [row.id]: { ...answers[row.id], [col.id]: e.target.value } })}
                        placeholder={col.freeText.placeholder}
                        spellCheck={false}
                        autoComplete="off"
                        className="w-full text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                      />
                    ) : (
                    <select
                      value={answers[row.id]?.[col.id] ?? ''}
                      onChange={(e) => handleSelect(row.id, col.id, e.target.value)}
                      className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">-- Seleccionar --</option>
                      {shuffled(col.options, (o) => `${section.id}:${col.id}:${o.value}`).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
