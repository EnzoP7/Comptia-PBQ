import React from 'react';
import { Emblem } from './Emblem';
import { PlayCircle, Timer, Lightbulb, Save, X } from 'lucide-react';
import { LanguageSwitch } from './LanguageSwitch';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStartExam: () => void;
  totalPbqs: number;
}

const STEPS = [
  {
    icon: PlayCircle,
    title: 'Práctica libre',
    text: 'Elige cualquier PBQ en la barra superior, resuélvela y pulsa "Enviar y validar". Verás la corrección criterio por criterio: qué elegiste, cuál era la respuesta y por qué, además de una guía de estudio con los conceptos.',
  },
  {
    icon: Lightbulb,
    title: 'Pistas apagadas por defecto',
    text: 'En el examen real no hay ayudas. El botón "Pistas" activa medidores, explicaciones de cada opción y el simulador de tráfico. Úsalo para aprender, no para medirte.',
  },
  {
    icon: Timer,
    title: 'Simulacro con tiempo',
    text: 'Elige cuántas PBQs y cuánto tiempo. Salen al azar según el peso oficial de cada dominio, sin pistas ni corrección hasta el final. Al terminar puedes revisar cada una.',
  },
  {
    icon: Save,
    title: 'Tu progreso es privado',
    text: 'No hay cuentas ni registro. Las respuestas, notas e historial se guardan solo en este navegador.',
  },
];

export const WelcomeModal: React.FC<Props> = ({ isOpen, onClose, onStartExam, totalPbqs }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="w-full max-w-2xl max-h-[94vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
        <div className="px-5 sm:px-6 py-5 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Emblem variant="full" className="w-20 h-20 shrink-0 rounded-full ring-1 ring-slate-800" />
            <div>
              <h2 id="welcome-title" className="text-lg font-bold text-white">Simulador de PBQs de Security+ (SY0-701)</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Las PBQs (Performance-Based Questions) son las preguntas prácticas del examen: configurar un firewall, ubicar
                controles en un diagrama, analizar logs o clasificar conceptos. Aquí tienes {totalPbqs} PBQs que cubren los cinco dominios.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 shrink-0" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/60">
            <div translate="no" className="text-sm font-semibold text-white">Idioma · Language</div>
            <LanguageSwitch large />
          </div>
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <Icon className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-white">{title}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
          <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
            Proyecto independiente de estudio, sin afiliación con CompTIA. CompTIA y Security+ son marcas registradas de CompTIA, Inc.
            Las preguntas son originales y no provienen del examen real.
          </p>
        </div>

        <div className="px-5 sm:px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col-reverse sm:flex-row justify-end gap-2">
          <button onClick={onStartExam} className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl">
            Hacer un simulacro
          </button>
          <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-on-accent bg-cyan-600 hover:bg-cyan-500 rounded-xl">
            Empezar a practicar
          </button>
        </div>
      </div>
    </div>
  );
};
