import React, { useEffect, useMemo, useState } from 'react';
import { Brain, X, Check, ArrowRight, RotateCcw, Target } from 'lucide-react';
import { sound } from '../utils/audio';
import { t } from '../i18n/language';
import { TRAP_CARDS, TRAP_DOMAINS, TrapCard, domainOfCard } from '../data/trapCards';
import { TrapProgress, buildSession, isDue, isMastered, loadTrapProgress, recordAnswer, saveTrapProgress } from '../utils/trapProgress';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGoToPbq: (pbqNumber: number) => void;
}

type View = 'home' | 'session' | 'done';

const CARD_BY_ID = new Map(TRAP_CARDS.map((c) => [c.id, c]));

export const TrapReviewModal: React.FC<Props> = ({ isOpen, onClose, onGoToPbq }) => {
  const [progress, setProgress] = useState<TrapProgress>(() => loadTrapProgress());
  const [domain, setDomain] = useState(0);
  const [view, setView] = useState<View>('home');
  const [queue, setQueue] = useState<string[]>([]);
  const [pos, setPos] = useState(0);
  const [picked, setPicked] = useState<'right' | 'wrong' | null>(null);
  const [rightFirst, setRightFirst] = useState(true);
  const [requeued, setRequeued] = useState<Set<string>>(new Set());
  const [missed, setMissed] = useState<string[]>([]);
  const [hits, setHits] = useState(0);

  const cards = useMemo(() => (domain ? TRAP_CARDS.filter((c) => domainOfCard(c) === domain) : TRAP_CARDS), [domain]);
  const now = Date.now();
  const stats = useMemo(() => {
    const unseen = cards.filter((c) => !progress[c.id]).length;
    const due = cards.filter((c) => isDue(progress[c.id], now)).length;
    const mastered = cards.filter((c) => isMastered(progress[c.id])).length;
    return { unseen, due, mastered, learning: cards.length - unseen - mastered };
  }, [cards, progress, now]);

  const card: TrapCard | undefined = view === 'session' ? CARD_BY_ID.get(queue[pos]) : undefined;

  const start = (ahead: boolean) => {
    const ids = buildSession(cards, progress, ahead);
    if (!ids.length) return;
    sound.playClick();
    setQueue(ids);
    setPos(0);
    setPicked(null);
    setRightFirst(Math.random() < 0.5);
    setRequeued(new Set());
    setMissed([]);
    setHits(0);
    setView('session');
  };

  const answer = (choice: 'right' | 'wrong') => {
    if (!card || picked) return;
    const correct = choice === 'right';
    correct ? sound.playSuccess() : sound.playWarning();
    setPicked(choice);
    const next = recordAnswer(progress, card.id, correct);
    setProgress(next);
    saveTrapProgress(next);
    if (correct) {
      if (!requeued.has(card.id)) setHits((h) => h + 1);
    } else {
      setMissed((m) => (m.includes(card.id) ? m : [...m, card.id]));
      // A missed card comes back once at the end of the round.
      if (!requeued.has(card.id)) {
        setRequeued((r) => new Set(r).add(card.id));
        setQueue((q) => [...q, card.id]);
      }
    }
  };

  const advance = () => {
    if (!picked) return;
    sound.playClick();
    if (pos + 1 >= queue.length) {
      setView('done');
      return;
    }
    setPos(pos + 1);
    setPicked(null);
    setRightFirst(Math.random() < 0.5);
  };

  useEffect(() => {
    if (!isOpen || view !== 'session') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!picked && (e.key === '1' || e.key === '2')) {
        e.preventDefault();
        answer((e.key === '1') === rightFirst ? 'right' : 'wrong');
      } else if (picked && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight')) {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!isOpen) return null;

  const close = () => {
    sound.playClick();
    setView('home');
    onClose();
  };

  const resetAll = () => {
    if (!window.confirm(t('¿Borrar el progreso del repaso de trampas? Todas las tarjetas vuelven a ser nuevas.'))) return;
    setProgress({});
    saveTrapProgress({});
  };

  const pending = stats.due + stats.unseen;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-violet-400">
            <Brain className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white tracking-tight">Repaso de trampas</h3>
          </div>
          <button onClick={close} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors" aria-label="Cerrar">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {view === 'home' && (
            <>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cada tarjeta enfrenta dos conceptos que se confunden en el examen. Elige el correcto y aprende la palabra clave que los diferencia. Las que fallas vuelven pronto; las que aciertas se espacian (1, 3, 7, 14 y 30 días).
              </p>

              <div className="flex flex-wrap gap-1.5">
                {[0, 1, 2, 3, 4, 5].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDomain(d)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                      domain === d ? 'bg-violet-950/70 border-violet-600 text-violet-200' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d === 0 ? 'Todos los dominios' : `Dominio ${d}: ${TRAP_DOMAINS[d]}`}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Para repasar hoy', value: stats.due, color: 'text-amber-300' },
                  { label: 'Nuevas', value: stats.unseen, color: 'text-cyan-300' },
                  { label: 'Aprendiendo', value: stats.learning, color: 'text-slate-200' },
                  { label: 'Dominadas', value: stats.mastered, color: 'text-emerald-300' },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className={`text-xl font-bold tabular-nums ${s.color}`}>{s.value}</div>
                    <div className="text-[11px] text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5">
                {[1, 2, 3, 4, 5].map((d) => {
                  const inDomain = TRAP_CARDS.filter((c) => domainOfCard(c) === d);
                  const done = inDomain.filter((c) => isMastered(progress[c.id])).length;
                  return (
                    <div key={d} className="flex items-center gap-3 text-[11px]">
                      <span className="w-44 sm:w-56 shrink-0 text-slate-300 truncate">{`Dominio ${d}: ${TRAP_DOMAINS[d]}`}</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(done / inDomain.length) * 100}%` }} />
                      </div>
                      <span className="w-12 text-right tabular-nums text-slate-400">{`${done}/${inDomain.length}`}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {pending > 0 ? (
                  <button onClick={() => start(false)} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" />
                    <span>{`Empezar repaso (${Math.min(pending, 15)} tarjetas)`}</span>
                  </button>
                ) : (
                  <>
                    <span className="text-xs text-emerald-300">No tienes tarjetas pendientes por hoy en esta selección.</span>
                    <button onClick={() => start(true)} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold">
                      Repasar igual
                    </button>
                  </>
                )}
                <button onClick={resetAll} className="ml-auto px-3 py-2 rounded-xl text-[11px] text-slate-500 hover:text-rose-300 flex items-center gap-1.5">
                  <RotateCcw className="w-3 h-3" />
                  <span>Reiniciar progreso</span>
                </button>
              </div>
            </>
          )}

          {view === 'session' && card && (
            <>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{`Tarjeta ${pos + 1} de ${queue.length}`}</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono">{`Objetivo ${card.obj}`}</span>
              </div>
              <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-violet-500 transition-all" style={{ width: `${(pos / queue.length) * 100}%` }} />
              </div>

              <p className="text-sm sm:text-base text-white leading-relaxed font-medium">{card.q}</p>

              <div className="grid gap-2">
                {(rightFirst ? (['right', 'wrong'] as const) : (['wrong', 'right'] as const)).map((kind, i) => {
                  const label = kind === 'right' ? card.right : card.wrong;
                  const state = !picked ? 'idle' : kind === 'right' ? 'correct' : picked === 'wrong' ? 'chosen-wrong' : 'other';
                  return (
                    <button
                      key={kind}
                      onClick={() => answer(kind)}
                      disabled={!!picked}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-semibold flex items-center gap-3 transition-colors ${
                        state === 'idle'
                          ? 'bg-slate-950 border-slate-700 text-slate-100 hover:border-violet-500'
                          : state === 'correct'
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100'
                            : state === 'chosen-wrong'
                              ? 'bg-rose-950/60 border-rose-500 text-rose-100'
                              : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <kbd className="shrink-0 w-6 h-6 rounded bg-slate-900 border border-slate-700 text-[11px] font-mono flex items-center justify-center text-slate-300">{i + 1}</kbd>
                      <span className="flex-1">{label}</span>
                      {state === 'correct' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {state === 'chosen-wrong' && <X className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {picked && (
                <div className={`p-4 rounded-xl border space-y-2 ${picked === 'right' ? 'bg-emerald-950/30 border-emerald-800' : 'bg-rose-950/30 border-rose-800'}`}>
                  <div className={`text-xs font-bold ${picked === 'right' ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {picked === 'right' ? '¡Correcto!' : 'Era la otra opción. Esta tarjeta vuelve al final de la ronda.'}
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed">
                    <span className="font-bold text-violet-300">Cómo diferenciarlos: </span>
                    <span>{card.rule}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setView('home');
                        onGoToPbq(card.pbq);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-[11px] font-semibold text-slate-300 hover:text-white"
                    >
                      {`Practicar en la PBQ ${card.pbq}`}
                    </button>
                    <button onClick={advance} className="ml-auto px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2">
                      <span>Siguiente</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-slate-500">Teclas: 1 o 2 para responder · Enter para seguir</p>
            </>
          )}

          {view === 'done' && (
            <>
              <div className="text-center space-y-1 py-2">
                <div className="text-3xl font-bold text-white tabular-nums">{`${hits}/${hits + missed.length}`}</div>
                <div className="text-xs text-slate-400">aciertos a la primera en esta ronda</div>
              </div>
              {missed.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-rose-300">Pares que confundiste (vuelven mañana):</div>
                  {missed.map((id) => {
                    const m = CARD_BY_ID.get(id)!;
                    return (
                      <div key={id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                        <div className="text-slate-100 font-semibold">
                          <span className="text-emerald-300">{m.right}</span>
                          <span className="text-slate-500"> vs. </span>
                          <span className="text-rose-300">{m.wrong}</span>
                        </div>
                        <div className="text-slate-400">{m.rule}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex flex-wrap gap-2 justify-end">
                <button onClick={() => setView('home')} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold">
                  Volver al resumen
                </button>
                <button onClick={() => start(stats.due + stats.unseen === 0)} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold">
                  Otra ronda
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
