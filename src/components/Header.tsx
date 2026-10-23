import React from 'react';
import {
  Shield,
  Clock,
  Flag,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Award,
  Keyboard,
  BookMarked,
  Lightbulb,
  LightbulbOff,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  mode: 'practice' | 'exam';
  onModeChange: (mode: 'practice' | 'exam') => void;
  secondsLeft: number;
  timerActive: boolean;
  onToggleTimer: () => void;
  isFlagged: boolean;
  onToggleFlag: () => void;
  onOpenStrategy?: () => void;
  onOpenExamSummary: () => void;
  onOpenCheatSheet?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenShortcuts?: () => void;
  canPauseTimer?: boolean;
  /** Overrides the default "less than 5 minutes left" warning colour. */
  timerWarning?: boolean;
  hintsEnabled?: boolean;
  onToggleHints?: () => void;
}

export const Header: React.FC<Props> = ({
  mode,
  onModeChange,
  secondsLeft,
  timerActive,
  onToggleTimer,
  isFlagged,
  onToggleFlag,
  onOpenStrategy,
  onOpenExamSummary,
  onOpenCheatSheet,
  isMuted,
  onToggleMute,
  onOpenShortcuts,
  canPauseTimer = true,
  timerWarning,
  hintsEnabled,
  onToggleHints,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-3 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap min-w-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-950">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-base font-bold tracking-tight text-white font-sans">
            <span className="hidden sm:inline">Security+ </span><span className="text-cyan-400 font-mono">SY0-701</span> PBQ<span className="hidden sm:inline"> Simulator</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={() => onModeChange('practice')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              mode === 'practice' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            Práctica Libre
          </button>
          <button
            onClick={() => onModeChange('exam')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              mode === 'exam' ? 'text-cyan-400 font-bold' : ''
            }`}
          >
            Simulacro con Tiempo
          </button>
          {onOpenCheatSheet && (
            <button
              onClick={onOpenCheatSheet}
              className="transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5"
            >
              <BookMarked className="w-3.5 h-3.5 text-amber-400" />
              <span>Cheat Sheet & Puertos</span>
            </button>
          )}
          {onOpenStrategy && (
            <button
              onClick={onOpenStrategy}
              className="transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Guía de estrategia</span>
            </button>
          )}
          <button
            onClick={onOpenExamSummary}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mi progreso</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              sound.playToggle();
              onToggleMute();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 transition-colors"
            title={isMuted ? 'Activar Sonidos' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {onOpenCheatSheet && (
            <button
              onClick={onOpenCheatSheet}
              className="hidden px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
              title="Guía Rápida & Puertos Críticos (Alt+P)"
            >
              <BookMarked className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Cheat Sheet</span>
            </button>
          )}

          {onOpenStrategy && <button
            onClick={onOpenStrategy}
            className="lg:hidden px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-md shadow-cyan-950 flex items-center gap-2"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Estrategia</span>
            <span className="sm:hidden">Guía</span>
          </button>}
        </div>
      </div>

      {/* Workspace Secondary Toolbar below header */}
      <div className="border-t border-slate-800/80 bg-slate-900/40 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Modo:</span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => onModeChange('practice')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  mode === 'practice'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Práctica Libre
              </button>
              <button
                onClick={() => onModeChange('exam')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  mode === 'exam'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Simulacro
              </button>
            </div>
          </div>

          {/* Timer & Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono">
              <Clock
                className={`w-3.5 h-3.5 ${
                  (timerWarning ?? secondsLeft < 300) ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
                }`}
              />
              <span
                className={`text-xs font-bold tabular-nums ${
                  (timerWarning ?? secondsLeft < 300) ? 'text-rose-400' : 'text-slate-200'
                }`}
              >
                {formatTime(secondsLeft)}
              </span>
              {canPauseTimer && <button
                onClick={onToggleTimer}
                className="text-slate-400 hover:text-white ml-1 p-0.5"
                title={timerActive ? 'Pausar Temporizador' : 'Iniciar Temporizador'}
              >
                {timerActive ? (
                  <Pause className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3 text-emerald-400" />
                )}
              </button>}
            </div>

            {onToggleHints && (
              <button
                onClick={() => {
                  sound.playToggle();
                  onToggleHints();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs font-semibold ${
                  hintsEnabled
                    ? 'bg-amber-950/60 text-amber-300 border-amber-700'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Las pistas muestran feedback en vivo (medidores, explicaciones de opciones, simulador). En el examen real no existen."
              >
                {hintsEnabled ? <Lightbulb className="w-3.5 h-3.5" /> : <LightbulbOff className="w-3.5 h-3.5" />}
                <span>{hintsEnabled ? 'Pistas: ON' : 'Pistas: OFF'}</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playClick();
                onOpenExamSummary();
              }}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white text-xs font-semibold"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Progreso</span>
            </button>

            {/* Flag for Review Button */}
            <button
              onClick={() => {
                sound.playToggle();
                onToggleFlag();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs font-semibold ${
                isFlagged
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Flag
                className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-400 text-amber-400' : ''}`}
              />
              <span>{isFlagged ? 'Marcada para Revisar' : 'Marcar (Flag)'}</span>
            </button>

            {/* Cheat Sheet Button */}
            {onOpenCheatSheet && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenCheatSheet();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-xs font-semibold"
                title="Guía Rápida de Puertos & Cheat Sheet CompTIA (Alt+P)"
              >
                <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Cheat Sheet</span>
                <kbd className="hidden lg:inline text-[10px] font-mono px-1 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-400">Alt+P</kbd>
              </button>
            )}

            {/* Keyboard Shortcuts Button */}
            {onOpenShortcuts && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenShortcuts();
                }}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-xs font-semibold"
                title="Atajos de teclado rápidos (Ctrl+/)"
              >
                <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Atajos</span>
                <kbd className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-400">Ctrl+/</kbd>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
