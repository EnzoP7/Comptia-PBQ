import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, SquareTerminal, Lightbulb, ClipboardList } from 'lucide-react';
import { TerminalQuestion, TerminalState } from '../../terminal/types';
import { complete, prompt, runCommand } from '../../terminal/engine';
import { useHints } from '../../context/HintsContext';
import { sound } from '../../utils/audio';

interface Props {
  state: TerminalState;
  onChange: (state: TerminalState) => void;
  onReset: () => void;
  questions: TerminalQuestion[];
  hintCommands: string[];
}

/** Simulated root shell: type commands, the server state changes, answers go below. */
export const TerminalPBQ: React.FC<Props> = ({ state, onChange, onReset, questions, hintCommands }) => {
  const hints = useHints();
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [state.lines.length]);

  const submit = () => {
    onChange(runCommand(state, input));
    setInput('');
    setHistoryIndex(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!state.history.length) return;
      const next = historyIndex === null ? state.history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(state.history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= state.history.length) {
        setHistoryIndex(null);
        setInput('');
      } else {
        setHistoryIndex(next);
        setInput(state.history[next]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setInput(complete(state, input));
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      onChange({ ...state, lines: [] });
    }
  };

  const setAnswer = (id: string, value: string) => onChange({ ...state, answers: { ...state.answers, [id]: value } });

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-700 bg-[#05070d] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <span className="flex gap-1.5" aria-hidden>
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
            </span>
            <SquareTerminal className="w-4 h-4 text-emerald-400 ml-2" />
            <span className="font-mono">root@{state.host}</span>
          </div>
          <button
            onClick={() => {
              if (window.confirm('¿Reiniciar el servidor a su estado inicial? Se pierden los cambios y respuestas de esta PBQ.')) {
                sound.playToggle();
                onReset();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reiniciar servidor
          </button>
        </div>

        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className="h-[min(60vh,520px)] overflow-y-auto px-4 py-3 font-mono text-[13px] sm:text-sm leading-relaxed cursor-text"
          role="log"
          aria-live="polite"
          aria-label="Salida de la terminal"
        >
          {state.lines.map((l, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap break-words ${l.kind === 'in' ? 'text-emerald-300' : l.kind === 'err' ? 'text-rose-300' : 'text-slate-200'}`}
            >
              {l.text || ' '}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <span className="text-emerald-300 shrink-0">{prompt(state)}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest' })}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Comando"
              className="flex-1 min-w-0 bg-transparent outline-none text-slate-100 caret-emerald-400 scroll-mb-36"
            />
          </div>
        </div>
        <div className="px-4 py-2 bg-slate-900/70 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex flex-wrap gap-x-4 gap-y-1">
          <span>Enter ejecuta</span>
          <span>↑/↓ historial</span>
          <span>Tab autocompleta</span>
          <span>Ctrl+L limpia</span>
          <span>"help" lista los comandos</span>
        </div>
      </div>

      {hints && (
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/50 space-y-2">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4" /> Comandos útiles para esta PBQ
          </div>
          <div className="flex flex-wrap gap-2">
            {hintCommands.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setInput(c);
                  inputRef.current?.focus();
                }}
                className="font-mono text-xs px-2 py-1 rounded-md bg-slate-950 border border-slate-700 text-amber-100 hover:border-amber-500"
                title="Copiar a la terminal"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-cyan-400" /> Respuestas del informe
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {questions.map((q) => (
              <label key={q.id} className="space-y-1 block">
                <span className="text-xs font-semibold text-slate-300">{q.label}</span>
                <input
                  value={state.answers[q.id] ?? ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  spellCheck={false}
                  autoCapitalize="off"
                  className="w-full font-mono text-sm px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
