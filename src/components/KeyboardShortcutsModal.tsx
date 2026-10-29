import React from 'react';
import { Keyboard, X, Check, Command, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      keys: ['Ctrl', 'Enter'],
      macKeys: ['⌘', 'Enter'],
      action: 'Enviar y Validar PBQ actual',
      description: 'Valida la PBQ actual y abre la corrección criterio por criterio (solo en práctica libre).',
    },
    {
      keys: ['Ctrl', '→'],
      macKeys: ['⌘', '→'],
      action: 'Siguiente PBQ',
      description: 'Avanza a la siguiente pregunta práctica del examen.',
    },
    {
      keys: ['Ctrl', '←'],
      macKeys: ['⌘', '←'],
      action: 'Anterior PBQ',
      description: 'Retrocede a la pregunta práctica previa.',
    },
    {
      keys: ['Esc'],
      macKeys: ['Esc'],
      action: 'Cerrar Modal / Volver al Examen',
      description: 'Cierra cualquier ventana emergente activa (diagnóstico, tips o resumen).',
    },
    {
      keys: ['Alt', 'E'],
      macKeys: ['⌥', 'E'],
      action: 'Explicación Detallada y Glosario',
      description: 'Abre la corrección y la guía de estudio de la PBQ actual (después de validarla).',
    },
    {
      keys: ['Alt', 'R'],
      macKeys: ['⌥', 'R'],
      action: 'Restablecer PBQ',
      description: 'Reinicia las respuestas del ejercicio actual al estado inicial.',
    },
    {
      keys: ['Alt', 'P'],
      macKeys: ['⌥', 'P'],
      action: 'Guía Rápida & Cheat Sheet de Puertos',
      description: 'Abre la matriz de puertos críticos, estándares NIST y fórmulas de examen.',
    },
    {
      keys: ['Alt', 'T'],
      macKeys: ['⌥', 'T'],
      action: 'Repaso de trampas',
      description: 'Tarjetas con repetición espaciada de los pares de conceptos que más se confunden (solo en práctica).',
    },
    {
      keys: ['Alt', 'S'],
      macKeys: ['⌥', 'S'],
      action: 'Reporte de Evaluación / Revisión',
      description: 'Abre tu reporte de progreso con el desempeño por dominio oficial.',
    },
    {
      keys: ['Ctrl', '/'],
      macKeys: ['⌘', '/'],
      action: 'Ver Atajos de Teclado',
      description: 'Abre o cierra este panel de ayuda de navegación rápida.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-cyan-400">
            <Keyboard className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Atajos de Teclado para Usuarios Avanzados
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-slate-300 leading-relaxed">
            Optimiza tu velocidad y concentración durante la simulación de CompTIA Security+ utilizando la navegación por teclado:
          </p>

          <div className="space-y-2">
            {shortcuts.map((sc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700/80 transition-colors flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="text-xs font-bold text-white block">
                    {sc.action}
                  </span>
                  <span className="text-[11px] text-slate-400 block leading-tight">
                    {sc.description}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {sc.keys.map((k, kIdx) => (
                    <React.Fragment key={kIdx}>
                      <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-[11px] font-bold shadow-sm">
                        {k}
                      </kbd>
                      {kIdx < sc.keys.length - 1 && (
                        <span className="text-slate-500 text-xs">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Presiona <kbd className="px-1 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">Esc</kbd> para volver</span>
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-on-accent font-semibold text-xs transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
