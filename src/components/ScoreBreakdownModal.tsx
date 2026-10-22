import React, { useState } from 'react';
import { EvaluationResult, PBQItem } from '../types/pbq';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Search,
  Sparkles,
  ShieldCheck,
  Tag,
  Info,
  BookMarked,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Target,
  FileText
} from 'lucide-react';
import { sound } from '../utils/audio';
import { getPBQExplanation } from '../data/pbqExplanations';
import { getPedagogicalExplanationForItem, ContextualPedagogicalExplanation } from '../utils/pedagogicalExplanations';

interface Props {
  result: EvaluationResult | null;
  isOpen: boolean;
  onClose: () => void;
  onNextPBQ?: () => void;
  onRetry?: () => void;
  hasNextPBQ?: boolean;
  currentPBQ?: PBQItem;
}

export const ScoreBreakdownModal: React.FC<Props> = ({
  result,
  isOpen,
  onClose,
  onNextPBQ,
  onRetry,
  hasNextPBQ = false,
  currentPBQ,
}) => {
  const [activeTab, setActiveTab] = useState<'score' | 'explanation'>('score');
  const [criteriaFilter, setCriteriaFilter] = useState<'all' | 'failed' | 'passed'>('all');
  const [glossaryFilter, setGlossaryFilter] = useState('');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  if (!isOpen || !result) return null;

  const explanation = currentPBQ ? getPBQExplanation(currentPBQ.id, currentPBQ) : null;

  const toggleItemExpanded = (id: string) => {
    sound.playClick();
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter items in criteria breakdown
  const failedCriteriaCount = result.partialCreditBreakdown.filter(
    (item) => !item.achieved || item.points < item.maxPoints
  ).length;
  const passedCriteriaCount = result.partialCreditBreakdown.length - failedCriteriaCount;

  const displayedCriteria = result.partialCreditBreakdown.filter((item) => {
    const isSuccess = item.achieved && item.points === item.maxPoints;
    if (criteriaFilter === 'failed') return !isSuccess;
    if (criteriaFilter === 'passed') return isSuccess;
    return true;
  });

  const filteredGlossaryItems = (explanation?.itemsGlossary || []).filter(
    (item) =>
      item.name.toLowerCase().includes(glossaryFilter.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossaryFilter.toLowerCase()) ||
      item.whyCorrectOrRole.toLowerCase().includes(glossaryFilter.toLowerCase()) ||
      (item.badge && item.badge.toLowerCase().includes(glossaryFilter.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border ${
                result.passed
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border-amber-800'
              }`}
            >
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Revisión Táctica CompTIA SY0-701
                </h3>
                {currentPBQ && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                    PBQ {currentPBQ.number}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono line-clamp-1">
                {result.sy0701Objective}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              [Esc] Cerrar
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Deck */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('score');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'score'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Diagnóstico de Criterios & Errores</span>
              {failedCriteriaCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold">
                  {failedCriteriaCount} a corregir
                </span>
              )}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('explanation');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'explanation'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Justificación Global & Glosario de Opciones</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] bg-slate-950 text-cyan-300 font-mono">
                {explanation?.itemsGlossary.length || 0}
              </span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Puntuación: <strong className="text-white font-bold">{result.totalScore}%</strong></span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'score' && (
            <>
              {/* Score Summary Card */}
              <div
                className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
                  result.totalScore >= 75
                    ? 'bg-emerald-950/20 border-emerald-800/80'
                    : result.totalScore >= 50
                    ? 'bg-amber-950/20 border-amber-800/80'
                    : 'bg-rose-950/20 border-rose-800/80'
                }`}
              >
                <div className="space-y-1 text-center md:text-left">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Puntuación CompTIA Obtenida
                  </div>
                  <div className="text-2xl font-extrabold text-white">
                    {result.totalScore >= 75 ? (
                      <span className="text-emerald-400">¡Aprobado con Crédito!</span>
                    ) : (
                      <span className="text-amber-400">Requiere Ajustes</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    {result.detailedFeedback}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 min-w-[130px]">
                  <div className="text-3xl font-black text-cyan-400 font-mono tabular-nums">
                    {result.totalScore}%
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">
                    Umbral: 75%
                  </span>
                </div>
              </div>

              {/* Quick Jump to Glossary Banner */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/60 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <p className="text-xs text-cyan-200">
                    Revisa las explicaciones pedagógicas detalladas de cada elemento a continuación para comprender por qué fue la elección correcta o un distractor en el examen.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('explanation');
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shrink-0"
                >
                  Ver Glosario Completo
                </button>
              </div>

              {/* Criteria Section Header & Filters */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span>Diagnóstico Pedagógico y Desglose Criterio por Criterio</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Análisis contextual detallado de cada componente, su justificación y su alineación con los objetivos de CompTIA Security+.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setCriteriaFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        criteriaFilter === 'all'
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Todos ({result.partialCreditBreakdown.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCriteriaFilter('failed')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                        criteriaFilter === 'failed'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'text-slate-400 hover:text-rose-400'
                      }`}
                    >
                      <span>Errores ({failedCriteriaCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCriteriaFilter('passed')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                        criteriaFilter === 'passed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'text-slate-400 hover:text-emerald-400'
                      }`}
                    >
                      <span>Aciertos ({passedCriteriaCount})</span>
                    </button>
                  </div>
                </div>

                {/* Criteria Cards with Pedagogical Analysis */}
                <div className="space-y-3">
                  {displayedCriteria.map((item) => {
                    const isSuccess = item.achieved && item.points === item.maxPoints;
                    const pedagogical = getPedagogicalExplanationForItem(item, currentPBQ, explanation);
                    const isExpanded = expandedItems[item.id] ?? !isSuccess; // Default open for errors!

                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border transition-all overflow-hidden ${
                          isSuccess
                            ? 'border-emerald-800/40 bg-slate-950/70 hover:border-emerald-700/60'
                            : 'border-rose-800/60 bg-rose-950/10 hover:border-rose-700/80'
                        }`}
                      >
                        {/* Top Summary Bar */}
                        <div
                          onClick={() => toggleItemExpanded(item.id)}
                          className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isSuccess ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white block truncate">
                                {item.label}
                              </span>
                              <span className="text-[11px] text-slate-400 line-clamp-1">
                                {item.explanation}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                                isSuccess
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}
                            >
                              {item.points} / {item.maxPoints} pts
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Contextual Pedagogical Deep-Dive */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800/60 bg-slate-950/90 text-xs">
                            {/* Definition */}
                            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                                <BookMarked className="w-3.5 h-3.5" />
                                <span>Definición Técnica en CompTIA Security+</span>
                              </div>
                              <p className="text-slate-300 leading-relaxed font-sans">
                                {pedagogical.conceptDefinition}
                              </p>
                            </div>

                            {/* Why Failed & Correct Choice */}
                            <div
                              className={`p-3 rounded-lg border space-y-1 ${
                                isSuccess
                                  ? 'bg-emerald-950/20 border-emerald-800/50'
                                  : 'bg-rose-950/20 border-rose-800/50'
                              }`}
                            >
                              <div
                                className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                  isSuccess ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {isSuccess ? (
                                  <>
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Justificación de la Configuración Correcta</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Diagnóstico del Fallo & Elección Correcta Requerida</span>
                                  </>
                                )}
                              </div>
                              <p className="text-slate-300 leading-relaxed font-sans">
                                {pedagogical.whyFailedAndCorrectChoice}
                              </p>
                            </div>

                            {/* Syllabus & Exam Relevance */}
                            <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-800/40 space-y-1">
                              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5" />
                                <span>Relevancia para el Objetivo Oficial CompTIA SY0-701</span>
                              </div>
                              <p className="text-slate-300 leading-relaxed font-sans">
                                {pedagogical.sy0701Relevance}
                              </p>
                            </div>

                            {/* Distractor Warning / Exam Trap */}
                            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 space-y-1">
                              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Trampa Común de Examen / Análisis de Distractores</span>
                              </div>
                              <p className="text-slate-300 leading-relaxed font-sans">
                                {pedagogical.examTrapWarning}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {displayedCriteria.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No hay criterios que coincidan con el filtro seleccionado.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'explanation' && explanation && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Technical Overview & Rationale */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Info className="w-4 h-4" />
                  <span>Justificación Técnica y Fundamento CompTIA SY0-701</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {explanation.overviewRationale}
                </p>
              </div>

              {/* Key Exam Rules & Takeaways */}
              {explanation.keyTakeaways.length > 0 && (
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Reglas de Oro y Puntos Clave para el Examen Real</span>
                  </div>
                  <ul className="space-y-1.5 pl-1">
                    {explanation.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-cyan-400 font-mono font-bold shrink-0 mt-0.5">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Items / Options Glossary Header & Search */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-400" />
                      <span>Glosario y Desglose de Cada Ítem / Tarjeta / Opción ({explanation.itemsGlossary.length})</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Explicación exhaustiva de qué es cada componente y por qué fue correcto o distractor en este escenario.
                    </p>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filtrar componentes u opciones..."
                      value={glossaryFilter}
                      onChange={(e) => setGlossaryFilter(e.target.value)}
                      className="w-full sm:w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Items Glossary Cards */}
                <div className="space-y-3">
                  {filteredGlossaryItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-cyan-400 font-mono font-bold">
                            {idx + 1}
                          </span>
                          {item.name}
                        </span>

                        {item.badge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* What is it */}
                      <div className="space-y-1 pl-7">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                          ¿Qué es en CompTIA Security+?
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {item.definition}
                        </p>
                      </div>

                      {/* Why is it correct in this role */}
                      <div className="space-y-1 pl-7 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
                        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                          Justificación de su Ubicación / Elección:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {item.whyCorrectOrRole}
                        </p>
                      </div>

                      {/* Distractor warning / Common traps */}
                      {item.distractorWarning && (
                        <div className="space-y-1 pl-7 p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40">
                          <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Trampa Común de Examen / Por qué falla como distractor:
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {item.distractorWarning}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {filteredGlossaryItems.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No se encontraron elementos que coincidan con "{glossaryFilter}".
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>{result.domainName}</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline text-slate-400">
              Atajos: <kbd className="px-1 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">Esc</kbd> cerrar · <kbd className="px-1 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">Ctrl + →</kbd> siguiente
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onRetry && (
              <button
                onClick={() => {
                  sound.playToggle();
                  onRetry();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar</span>
              </button>
            )}

            {hasNextPBQ && onNextPBQ && (
              <button
                onClick={() => {
                  sound.playSuccess();
                  onNextPBQ();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors shadow-md shadow-cyan-950"
              >
                <span>Siguiente PBQ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
