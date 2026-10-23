/**
 * CompTIA Security+ (SY0-701) PBQ Tactical Simulator
 *
 * Practice mode: every PBQ, optional hints, immediate grading with explanations.
 * Exam mode: a timed, domain-weighted random set graded only at the end, with no hints.
 * All PBQ behaviour lives in pbqRegistry.tsx; progress is persisted in localStorage.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EvaluationResult, PBQItem } from './types/pbq';
import { ALL_PBQS, PBQ_REGISTRY, initialAnswersFor } from './pbqRegistry';
import { sound } from './utils/audio';
import { setShuffleSeed } from './utils/shuffle';
import { loadProgress, saveProgress } from './utils/storage';
import { AttemptHistory, bestScore, buildExamSet } from './utils/examBuilder';
import { HintsContext } from './context/HintsContext';

import { Header } from './components/Header';
import { PBQNav } from './components/PBQNav';
import { StrategyGuideModal } from './components/StrategyGuideModal';
import { ScoreBreakdownModal } from './components/ScoreBreakdownModal';
import { ExamSummaryModal } from './components/ExamSummaryModal';
import { ExamSetupModal } from './components/ExamSetupModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { CompTIACheatSheetModal } from './components/CompTIACheatSheetModal';
import { SimulatorErrorBoundary } from './components/SimulatorErrorBoundary';
import { WelcomeModal } from './components/WelcomeModal';

import { ArrowLeft, ArrowRight, FileCheck, Target, Award, ListChecks, FileText, Lightbulb, Flag, ChevronDown, ChevronUp } from 'lucide-react';

type Mode = 'practice' | 'exam';
type FontSize = 'normal' | 'large' | 'xlarge';

interface ExamSession {
  pbqIds: string[];
  endsAt: number;
  durationSec: number;
  submitted: boolean;
}

interface PersistedState {
  answers: Record<string, any>;
  evaluations: Record<string, EvaluationResult>;
  flagged: string[];
  history: AttemptHistory;
  mode: Mode;
  examSession: ExamSession | null;
  currentPbqId: string;
  fontSize: FontSize;
  hintsEnabled: boolean;
  seed: number;
  seenWelcome: boolean;
}

const ALL_IDS = ALL_PBQS.map((p) => p.id);
const PBQ_BY_ID = new Map(ALL_PBQS.map((p) => [p.id, p]));
const newSeed = () => Math.floor(Math.random() * 1_000_000) + 1;

/** Grades a PBQ and stamps the official objective/domain from the PBQ catalog. */
function gradePbq(pbq: PBQItem, state: any): EvaluationResult {
  const result = PBQ_REGISTRY[pbq.id].evaluate(state);
  return { ...result, sy0701Objective: pbq.sy0701Objective, domainName: pbq.domain };
}

function isAnswered(id: string, state: any): boolean {
  const def = PBQ_REGISTRY[id];
  if (def.isPristine) return !def.isPristine(state);
  return JSON.stringify(state) !== JSON.stringify(def.initial());
}

export default function App() {
  const saved = useMemo(() => loadProgress<PersistedState>() ?? {}, []);

  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const restored = Object.fromEntries(Object.entries(saved.answers ?? {}).filter(([id]) => PBQ_REGISTRY[id]));
    return { ...initialAnswersFor(ALL_IDS), ...restored };
  });
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationResult>>(saved.evaluations ?? {});
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(() => new Set(saved.flagged ?? []));
  const [history, setHistory] = useState<AttemptHistory>(saved.history ?? {});
  const [mode, setMode] = useState<Mode>(saved.mode === 'exam' && saved.examSession ? 'exam' : 'practice');
  const [examSession, setExamSession] = useState<ExamSession | null>(saved.examSession ?? null);
  const [currentPbqId, setCurrentPbqId] = useState<string>(saved.currentPbqId ?? ALL_IDS[0]);
  const [fontSize, setFontSize] = useState<FontSize>(saved.fontSize ?? 'large');
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(saved.hintsEnabled ?? false);
  const [seed, setSeed] = useState<number>(saved.seed ?? newSeed());

  const [isMuted, setIsMuted] = useState(false);
  const [briefCollapsed, setBriefCollapsed] = useState(false);
  const [tipRevealed, setTipRevealed] = useState(false);
  const [practiceElapsed, setPracticeElapsed] = useState(0);
  const [practiceTimerActive, setPracticeTimerActive] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isExamSummaryOpen, setIsExamSummaryOpen] = useState(false);
  const [isExamSetupOpen, setIsExamSetupOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(!saved.seenWelcome);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);

  // Option order must be decided before any simulator renders.
  setShuffleSeed(seed);

  const inExamView = mode === 'exam' && examSession !== null;
  const examInProgress = inExamView && !examSession.submitted;
  const hints = hintsEnabled && mode === 'practice';

  const visiblePbqs = useMemo(
    () => (inExamView ? examSession!.pbqIds.map((id) => PBQ_BY_ID.get(id)!).filter(Boolean) : ALL_PBQS),
    [inExamView, examSession]
  );
  const foundIndex = visiblePbqs.findIndex((p) => p.id === currentPbqId);
  const currentIndex = foundIndex === -1 ? 0 : foundIndex;
  const currentPBQ = visiblePbqs[currentIndex];
  const currentEvalResult = examInProgress ? null : evaluations[currentPBQ.id] ?? null;
  const answeredIds = useMemo(
    () => new Set(visiblePbqs.filter((p) => isAnswered(p.id, answers[p.id])).map((p) => p.id)),
    [visiblePbqs, answers]
  );

  // Persist everything except transient UI state.
  useEffect(() => {
    saveProgress<PersistedState>({
      answers,
      evaluations,
      flagged: [...flaggedIds],
      history,
      mode,
      examSession,
      currentPbqId,
      fontSize,
      hintsEnabled,
      seed,
      seenWelcome: !isWelcomeOpen || !!saved.seenWelcome,
    });
  }, [answers, evaluations, flaggedIds, history, mode, examSession, currentPbqId, fontSize, hintsEnabled, seed, isWelcomeOpen]);

  // Per-PBQ stopwatch in practice mode, to train the ~5-6 min budget per PBQ.
  useEffect(() => {
    setPracticeElapsed(0);
    setTipRevealed(false);
  }, [currentPBQ.id]);

  useEffect(() => {
    if (mode !== 'practice' || !practiceTimerActive) return;
    const interval = setInterval(() => setPracticeElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [mode, practiceTimerActive]);

  // Exam clock is wall-clock based so it survives reloads and cannot be paused.
  useEffect(() => {
    if (!examInProgress) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [examInProgress]);

  const examSecondsLeft = examSession ? Math.max(0, Math.round((examSession.endsAt - now) / 1000)) : 0;

  const goTo = (id: string) => {
    sound.playClick();
    setCurrentPbqId(id);
  };
  const goNext = () => currentIndex < visiblePbqs.length - 1 && goTo(visiblePbqs[currentIndex + 1].id);
  const goPrev = () => currentIndex > 0 && goTo(visiblePbqs[currentIndex - 1].id);

  const recordAttempts = (results: Record<string, EvaluationResult>, attemptMode: Mode) => {
    const at = Date.now();
    setHistory((prev) => {
      const next = { ...prev };
      for (const [id, r] of Object.entries(results)) next[id] = [...(next[id] ?? []), { score: r.totalScore, at, mode: attemptMode }];
      return next;
    });
  };

  const handleEvaluateCurrentPBQ = () => {
    if (mode !== 'practice') return;
    const result = gradePbq(currentPBQ, answers[currentPBQ.id]);
    result.passed ? sound.playSuccess() : sound.playWarning();
    setEvaluations((prev) => ({ ...prev, [currentPBQ.id]: result }));
    recordAttempts({ [currentPBQ.id]: result }, 'practice');
    setIsBreakdownOpen(true);
  };

  const handleResetCurrentPBQ = () => {
    sound.playToggle();
    setAnswers((prev) => ({ ...prev, [currentPBQ.id]: PBQ_REGISTRY[currentPBQ.id].initial() }));
    setEvaluations((prev) => {
      const { [currentPBQ.id]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const finishExam = (timeUp: boolean) => {
    if (!examSession || examSession.submitted) return;
    if (!timeUp) {
      const pending = examSession.pbqIds.filter((id) => !answeredIds.has(id)).length;
      const message = pending
        ? `Quedan ${pending} PBQ(s) sin tocar. ¿Finalizar y calificar el simulacro igualmente?`
        : '¿Finalizar y calificar el simulacro?';
      if (!window.confirm(message)) return;
    }
    const results = Object.fromEntries(examSession.pbqIds.map((id) => [id, gradePbq(PBQ_BY_ID.get(id)!, answers[id])]));
    setEvaluations((prev) => ({ ...prev, ...results }));
    recordAttempts(results, 'exam');
    setExamSession({ ...examSession, submitted: true });
    sound.playSuccess();
    setIsExamSummaryOpen(true);
  };

  useEffect(() => {
    if (examInProgress && examSecondsLeft === 0) finishExam(true);
  }, [examInProgress, examSecondsLeft]);

  const startExam = (count: number, minutes: number, prioritizeWeak: boolean) => {
    const ids = buildExamSet(ALL_PBQS, count, history, prioritizeWeak);
    setAnswers((prev) => ({ ...prev, ...initialAnswersFor(ids) }));
    setEvaluations((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => !ids.includes(id))));
    setFlaggedIds((prev) => new Set([...prev].filter((id) => !ids.includes(id))));
    setSeed(newSeed());
    setExamSession({ pbqIds: ids, endsAt: Date.now() + minutes * 60_000, durationSec: minutes * 60, submitted: false });
    setNow(Date.now());
    setMode('exam');
    setCurrentPbqId(ids[0]);
    setIsExamSetupOpen(false);
    setIsExamSummaryOpen(false);
  };

  const handleModeChange = (newMode: Mode) => {
    sound.playToggle();
    if (newMode === 'practice') {
      if (examInProgress && !window.confirm('¿Abandonar el simulacro en curso? No se calificará.')) return;
      if (examInProgress) setExamSession(null);
      setMode('practice');
      return;
    }
    if (examSession && !examSession.submitted) setMode('exam');
    else setIsExamSetupOpen(true);
  };

  const handleResetAllProgress = () => {
    if (!window.confirm('Esto borra todas tus respuestas, notas, marcas e historial de intentos. ¿Continuar?')) return;
    sound.playToggle();
    setAnswers(initialAnswersFor(ALL_IDS));
    setEvaluations({});
    setFlaggedIds(new Set());
    setHistory({});
    setExamSession(null);
    setMode('practice');
    setSeed(newSeed());
    setCurrentPbqId(ALL_IDS[0]);
  };

  const handleToggleFlag = () => {
    setFlaggedIds((prev) => {
      const updated = new Set(prev);
      updated.has(currentPBQ.id) ? updated.delete(currentPBQ.id) : updated.add(currentPBQ.id);
      return updated;
    });
  };

  // Keyboard shortcuts read the latest handlers through a ref, so the listener is attached once.
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {});
  keyHandler.current = (e: KeyboardEvent) => {
    const isCmdOrCtrl = e.ctrlKey || e.metaKey;
    const target = e.target as HTMLElement | null;
    const isInput = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
    const anyModalOpen = isBreakdownOpen || isStrategyOpen || isExamSummaryOpen || isShortcutsModalOpen || isCheatSheetOpen || isExamSetupOpen || isWelcomeOpen;

    if (e.key === 'Escape' && anyModalOpen) {
      e.preventDefault();
      setIsBreakdownOpen(false);
      setIsStrategyOpen(false);
      setIsExamSummaryOpen(false);
      setIsShortcutsModalOpen(false);
      setIsCheatSheetOpen(false);
      setIsExamSetupOpen(false);
      setIsWelcomeOpen(false);
      return;
    }
    if (isCmdOrCtrl && e.key === 'Enter') {
      e.preventDefault();
      handleEvaluateCurrentPBQ();
      return;
    }
    if (isCmdOrCtrl && (e.key === '/' || e.key === '?')) {
      e.preventDefault();
      setIsShortcutsModalOpen((prev) => !prev);
      return;
    }
    if (e.altKey && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      if (currentEvalResult) setIsBreakdownOpen((prev) => !prev);
      return;
    }
    if (e.altKey && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      if (mode === 'practice') setIsCheatSheetOpen((prev) => !prev);
      return;
    }
    if (e.altKey && e.key.toLowerCase() === 's') {
      e.preventDefault();
      if (!examInProgress) setIsExamSummaryOpen((prev) => !prev);
      return;
    }
    if (e.altKey && e.key.toLowerCase() === 'r') {
      if (isInput) return;
      e.preventDefault();
      handleResetCurrentPBQ();
      return;
    }
    if ((isCmdOrCtrl || e.altKey) && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && (!isInput || e.altKey)) {
      e.preventDefault();
      e.key === 'ArrowLeft' ? goPrev() : goNext();
    }
  };
  useEffect(() => {
    const listener = (e: KeyboardEvent) => keyHandler.current(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const best = bestScore(history, currentPBQ.id);
  const attemptCount = history[currentPBQ.id]?.length ?? 0;
  const isLast = currentIndex === visiblePbqs.length - 1;
  const textSize = (xl: string, lg: string, normal: string) => (fontSize === 'xlarge' ? xl : fontSize === 'large' ? lg : normal);

  return (
    <HintsContext.Provider value={hints}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Header
          mode={mode}
          onModeChange={handleModeChange}
          secondsLeft={examInProgress ? examSecondsLeft : practiceElapsed}
          timerWarning={examInProgress ? examSecondsLeft < 300 : practiceElapsed > currentPBQ.estimatedMinutes * 60}
          timerActive={examInProgress || practiceTimerActive}
          onToggleTimer={() => setPracticeTimerActive((a) => !a)}
          canPauseTimer={!examInProgress}
          isFlagged={flaggedIds.has(currentPBQ.id)}
          onToggleFlag={handleToggleFlag}
          onOpenStrategy={mode === 'practice' ? () => setIsStrategyOpen(true) : undefined}
          onOpenExamSummary={() => !examInProgress && setIsExamSummaryOpen(true)}
          onOpenCheatSheet={mode === 'practice' ? () => setIsCheatSheetOpen(true) : undefined}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(sound.toggleMute())}
          onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
          hintsEnabled={hints}
          onToggleHints={mode === 'practice' ? () => setHintsEnabled((h) => !h) : undefined}
        />

        <PBQNav
          pbqs={visiblePbqs}
          currentIndex={currentIndex}
          onSelectIndex={(idx) => setCurrentPbqId(visiblePbqs[idx].id)}
          flaggedIds={flaggedIds}
          evaluations={evaluations}
          hideScores={examInProgress}
          answeredIds={answeredIds}
          numberByPosition={inExamView}
        />

        {inExamView && (
          <div className={`border-b text-xs ${examInProgress ? 'bg-cyan-950/40 border-cyan-900' : 'bg-emerald-950/40 border-emerald-900'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-slate-200">
                {examInProgress
                  ? `Simulacro en curso · ${answeredIds.size}/${visiblePbqs.length} PBQs con respuesta · sin pistas ni corrección hasta finalizar`
                  : 'Simulacro calificado · revisa cada PBQ con "Ver desglose" o vuelve a Práctica Libre'}
              </span>
              {examInProgress ? (
                <button onClick={() => finishExam(false)} className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                  Finalizar simulacro
                </button>
              ) : (
                <button onClick={() => setIsExamSummaryOpen(true)} className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold">
                  Ver resultado
                </button>
              )}
            </div>
          </div>
        )}

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
          {/* Question brief: full width on top, so the simulator below gets the whole screen */}
          <section className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-4 sm:p-5 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1.5">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  PBQ {inExamView ? currentIndex + 1 : currentPBQ.number} de {visiblePbqs.length} • {currentPBQ.categoryTitle}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">{currentPBQ.title}</h1>
                <div className="text-[11px] text-slate-400 font-mono">
                  <span className="text-slate-300">{currentPBQ.domain}</span> · {currentPBQ.sy0701Objective}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono bg-slate-800 px-2 py-1 rounded-md">{currentPBQ.estimatedMinutes} min aprox</span>
                {!examInProgress && attemptCount > 0 && (
                  <span className="font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded-md">
                    Intentos {attemptCount} · Mejor{' '}
                    <span className={best !== null && best >= 75 ? 'text-emerald-400' : 'text-amber-400'}>{best}%</span>
                  </span>
                )}
                {currentEvalResult && (
                  <button
                    onClick={() => setIsBreakdownOpen(true)}
                    className={`font-mono font-bold px-2.5 py-1 rounded-md border ${
                      currentEvalResult.totalScore >= 75 ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-amber-950/40 border-amber-800 text-amber-300'
                    }`}
                    title="Ver corrección"
                  >
                    {currentEvalResult.totalScore}% · Ver desglose
                  </button>
                )}
                <div className="flex items-center gap-0.5 bg-slate-950/60 p-0.5 rounded-lg border border-slate-800" aria-label="Tamaño de letra">
                  {(
                    [
                      ['normal', 'A', 'Normal'],
                      ['large', 'A+', 'Grande'],
                      ['xlarge', 'A++', 'Extra grande'],
                    ] as const
                  ).map(([value, label, title]) => (
                    <button
                      key={value}
                      onClick={() => {
                        sound.playClick();
                        setFontSize(value);
                      }}
                      className={`px-2 py-0.5 rounded-md font-semibold ${fontSize === value ? 'bg-cyan-950 text-cyan-300' : 'text-slate-400 hover:text-white'}`}
                      title={title}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    setBriefCollapsed((c) => !c);
                  }}
                  aria-expanded={!briefCollapsed}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                >
                  {briefCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  {briefCollapsed ? 'Ver enunciado' : 'Contraer enunciado'}
                </button>
              </div>
            </div>

            {!briefCollapsed && (
              <div className="grid lg:grid-cols-5 border-t border-slate-800">
                <div className="lg:col-span-3 p-4 sm:p-5 space-y-2.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Escenario
                  </h2>
                  <p
                    className={`text-slate-100 select-text ${textSize(
                      'text-lg leading-8',
                      'text-base leading-7',
                      'text-sm leading-6'
                    )}`}
                  >
                    {currentPBQ.scenario}
                  </p>
                </div>

                <div className="lg:col-span-2 p-4 sm:p-5 space-y-3 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-950/40">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-cyan-400" /> Requerimientos
                  </h2>
                  <ol className="space-y-2">
                    {currentPBQ.requirements.map((req, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-2.5 text-slate-200 ${textSize('text-base leading-relaxed', 'text-sm leading-relaxed', 'text-xs leading-normal')}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ol>

                  {/* Tactical tip: a hint, so it is hidden in exams and opt-in when hints are off */}
                  {mode === 'practice' &&
                    (hints || tipRevealed ? (
                      <button
                        onClick={() => setIsStrategyOpen(true)}
                        className="w-full p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/80 text-left hover:bg-cyan-950/60 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold mb-1">
                          <Target className="w-4 h-4 text-cyan-400" /> Tip táctico
                        </div>
                        <p className="text-cyan-100 text-xs leading-relaxed">{currentPBQ.tacticalTip}</p>
                      </button>
                    ) : (
                      <button
                        onClick={() => setTipRevealed(true)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-dashed border-slate-700 text-xs text-slate-400 hover:text-white hover:border-slate-500 flex items-center gap-2"
                      >
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        Mostrar tip táctico (intenta resolverla antes sin ayuda)
                      </button>
                    ))}
                </div>
              </div>
            )}
          </section>

          {/* Interactive simulator, full width */}
          <section className="space-y-6">
            <div className="min-h-[520px]">
              <SimulatorErrorBoundary resetKey={currentPBQ.id} onReset={handleResetCurrentPBQ}>
                {PBQ_REGISTRY[currentPBQ.id].render(
                  answers[currentPBQ.id],
                  (state) => setAnswers((prev) => ({ ...prev, [currentPBQ.id]: state })),
                  handleResetCurrentPBQ
                )}
              </SimulatorErrorBoundary>
            </div>

            <div className="p-2.5 sm:p-4 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl flex items-center justify-between gap-2 sm:gap-4 sticky bottom-2 sm:bottom-4 z-30">
              <button
                disabled={currentIndex === 0}
                onClick={goPrev}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-slate-800"
                title="PBQ anterior (Ctrl + ←)"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              <div className="flex items-center gap-3">
                {mode === 'practice' && (
                  <button
                    onClick={handleEvaluateCurrentPBQ}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 rounded-xl transition-all shadow-lg shadow-cyan-950 ring-1 ring-cyan-400/40"
                    title="Enviar y validar solución (Ctrl + Enter)"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span className="sm:hidden">Validar</span>
                    <span className="hidden sm:inline">Enviar y Validar PBQ</span>
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/50 text-[10px] font-mono text-cyan-200">
                      Ctrl+↵
                    </kbd>
                  </button>
                )}
                {examInProgress && (
                  <button
                    onClick={handleToggleFlag}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl border ${
                      flaggedIds.has(currentPBQ.id) ? 'bg-amber-950/80 text-amber-300 border-amber-600' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    {flaggedIds.has(currentPBQ.id) ? 'Marcada para revisar' : 'Marcar para revisar'}
                  </button>
                )}
                {currentEvalResult && (
                  <button
                    onClick={() => setIsBreakdownOpen(true)}
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                    title="Diagnóstico y glosario (Alt + E)"
                  >
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>Explicación Detallada</span>
                  </button>
                )}
              </div>

              {!isLast ? (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors shadow-md shadow-cyan-950"
                  title="Siguiente PBQ (Ctrl + →)"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => (examInProgress ? finishExam(false) : setIsExamSummaryOpen(true))}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-lg shadow-emerald-950"
                >
                  <Award className="w-4 h-4" />
                  <span>{examInProgress ? 'Finalizar' : 'Reporte'}</span>
                </button>
              )}
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-800 bg-slate-950 px-4 sm:px-6 py-4 pb-24 sm:pb-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>
              Proyecto independiente de estudio, sin afiliación con CompTIA. CompTIA y Security+ son marcas registradas de CompTIA, Inc. Las
              preguntas son originales.
            </p>
            <button onClick={() => setIsWelcomeOpen(true)} className="text-slate-300 hover:text-white underline underline-offset-2 shrink-0">
              ¿Cómo funciona?
            </button>
          </div>
        </footer>

        <StrategyGuideModal
          isOpen={isStrategyOpen && mode === 'practice'}
          onClose={() => setIsStrategyOpen(false)}
          pbqTitle={`PBQ ${currentPBQ.number}: ${currentPBQ.title}`}
          pbqTacticalTip={currentPBQ.tacticalTip}
        />

        <ScoreBreakdownModal
          key={currentPBQ.id}
          result={currentEvalResult}
          isOpen={isBreakdownOpen && !!currentEvalResult}
          onClose={() => setIsBreakdownOpen(false)}
          hasNextPBQ={!isLast}
          onNextPBQ={goNext}
          onRetry={mode === 'practice' ? handleResetCurrentPBQ : undefined}
          currentPBQ={currentPBQ}
        />

        <ExamSummaryModal
          isOpen={isExamSummaryOpen && !examInProgress}
          onClose={() => setIsExamSummaryOpen(false)}
          pbqs={visiblePbqs}
          scores={evaluations}
          flaggedIds={flaggedIds}
          onReviewPBQ={(idx) => {
            const id = visiblePbqs[idx].id;
            setCurrentPbqId(id);
            if (evaluations[id]) setIsBreakdownOpen(true);
          }}
          onRestartExam={
            inExamView
              ? () => {
                  setExamSession(null);
                  setMode('practice');
                }
              : handleResetAllProgress
          }
          restartLabel={inExamView ? 'Volver a Práctica Libre' : 'Borrar todo el progreso'}
          title={inExamView ? 'Resultado del Simulacro PBQ — SY0-701' : undefined}
          onStartMiniDrill={() => setIsExamSetupOpen(true)}
        />

        <ExamSetupModal
          isOpen={isExamSetupOpen}
          onClose={() => setIsExamSetupOpen(false)}
          onStart={startExam}
          totalAvailable={ALL_PBQS.length}
        />

        <CompTIACheatSheetModal isOpen={isCheatSheetOpen && mode === 'practice'} onClose={() => setIsCheatSheetOpen(false)} />

        <KeyboardShortcutsModal isOpen={isShortcutsModalOpen} onClose={() => setIsShortcutsModalOpen(false)} />

        <WelcomeModal
          isOpen={isWelcomeOpen}
          onClose={() => setIsWelcomeOpen(false)}
          onStartExam={() => {
            setIsWelcomeOpen(false);
            setIsExamSetupOpen(true);
          }}
          totalPbqs={ALL_PBQS.length}
        />
      </div>
    </HintsContext.Provider>
  );
}
