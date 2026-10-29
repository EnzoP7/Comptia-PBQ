import React, { useState } from 'react';
import { Timer, X, Play, Target, Gauge } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStart: (count: number, minutes: number, prioritizeWeak: boolean, realisticOnly: boolean) => void;
  totalAvailable: number;
}

const COUNT_OPTIONS = [3, 5, 8, 12];

/**
 * The real SY0-701 exam has up to 90 questions in 90 minutes and PBQs usually come first
 * (commonly 3-6 of them). Budgeting ~6 minutes per PBQ leaves time for the MCQs.
 */
export const ExamSetupModal: React.FC<Props> = ({ isOpen, onClose, onStart, totalAvailable }) => {
  const [count, setCount] = useState(5);
  const [minutesPerPbq, setMinutesPerPbq] = useState(6);
  const [prioritizeWeak, setPrioritizeWeak] = useState(true);
  const [realisticOnly, setRealisticOnly] = useState(true);

  if (!isOpen) return null;
  const minutes = count * minutesPerPbq;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Timer className="w-5 h-5 text-cyan-400" /> Nuevo simulacro con tiempo
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm text-slate-300">
          <p className="text-xs leading-relaxed text-slate-400">
            Las PBQs se eligen al azar respetando el peso oficial de cada dominio. Durante el simulacro no hay pistas,
            cheat sheet ni corrección: todo se califica al finalizar o cuando se acaba el tiempo, como en el examen real.
          </p>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-200">Cantidad de PBQs</div>
            <div className="flex gap-2">
              {COUNT_OPTIONS.filter((n) => n <= totalAvailable).map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold font-mono ${
                    count === n ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-200">
              Minutos por PBQ: <span className="font-mono text-cyan-300">{minutesPerPbq}</span>
              <span className="text-slate-500"> · total {minutes} min</span>
            </div>
            <input
              type="range"
              min={3}
              max={10}
              value={minutesPerPbq}
              onChange={(e) => setMinutesPerPbq(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
            <div className="text-[11px] text-slate-500">
              Recomendado: 5–6 min. Si en el examen real gastas más, te quedará poco tiempo para el resto de preguntas.
            </div>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={prioritizeWeak}
              onChange={(e) => setPrioritizeWeak(e.target.checked)}
              className="mt-0.5 accent-cyan-500"
            />
            <span className="text-xs space-y-0.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" /> Priorizar mis puntos débiles
              </span>
              <span className="text-slate-400 block">Elige primero PBQs que nunca hiciste o en las que sacaste menos nota.</span>
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={realisticOnly}
              onChange={(e) => setRealisticOnly(e.target.checked)}
              className="mt-0.5 accent-cyan-500"
            />
            <span className="text-xs space-y-0.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Dificultad como el examen real
              </span>
              <span className="text-slate-400 block">Solo PBQs básicas e intermedias del temario oficial. Desactívalo para incluir las avanzadas y las extra, que pueden no aparecer.</span>
            </span>
          </label>
        </div>

        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl">
            Cancelar
          </button>
          <button
            onClick={() => {
              sound.playSuccess();
              onStart(count, minutes, prioritizeWeak, realisticOnly);
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Comenzar
          </button>
        </div>
      </div>
    </div>
  );
};
