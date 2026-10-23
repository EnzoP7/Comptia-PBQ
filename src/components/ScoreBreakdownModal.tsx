import React, { useMemo, useState } from 'react';
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
  ShieldCheck,
  Tag,
  Info,
  BookMarked,
  ChevronDown,
  ChevronUp,
  Target,
  GraduationCap,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { conceptsFor, getStudyGuide } from '../data/studyGuide';

interface Props {
  result: EvaluationResult | null;
  isOpen: boolean;
  onClose: () => void;
  onNextPBQ?: () => void;
  onRetry?: () => void;
  hasNextPBQ?: boolean;
  currentPBQ?: PBQItem;
}

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

export const ScoreBreakdownModal: React.FC<Props> = ({ result, isOpen, onClose, onNextPBQ, onRetry, hasNextPBQ = false, currentPBQ }) => {
  const [activeTab, setActiveTab] = useState<'review' | 'guide'>('review');
  const [criteriaFilter, setCriteriaFilter] = useState<'all' | 'failed' | 'passed'>('all');
  const [glossaryFilter, setGlossaryFilter] = useState('');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const guide = useMemo(() => (currentPBQ ? getStudyGuide(currentPBQ) : null), [currentPBQ]);

  if (!isOpen || !result) return null;

  const isFullCredit = (item: EvaluationResult['partialCreditBreakdown'][number]) => item.achieved && item.points >= item.maxPoints;
  const failed = result.partialCreditBreakdown.filter((i) => !isFullCredit(i));
  const displayed = result.partialCreditBreakdown.filter((item) =>
    criteriaFilter === 'failed' ? !isFullCredit(item) : criteriaFilter === 'passed' ? isFullCredit(item) : true
  );

  // Concepts to review: those linked to any criterion that did not get full credit.
  const conceptsToReview = guide
    ? [...new Map(failed.flatMap((i) => conceptsFor(guide, i.id)).map((c) => [c.name, c])).values()]
    : [];

  const filteredGlossary = (guide?.itemsGlossary ?? []).filter((item) => {
    const q = glossaryFilter.toLowerCase();
    return [item.name, item.definition, item.whyCorrectOrRole, item.badge ?? '', item.distractorWarning ?? ''].some((t) => t.toLowerCase().includes(q));
  });

  const toggle = (id: string, current: boolean) => {
    sound.playClick();
    setExpandedItems((prev) => ({ ...prev, [id]: !current }));
  };

  const goToCriterion = (id: string) => {
    setActiveTab('review');
    setCriteriaFilter('all');
    setExpandedItems((prev) => ({ ...prev, [id]: true }));
    requestAnimationFrame(() => document.getElementById(`criterion-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="breakdown-title">
      <div className="relative w-full max-w-4xl max-h-[94vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-xl border shrink-0 ${result.passed ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'}`}>
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 id="breakdown-title" className="text-sm sm:text-base font-bold text-white tracking-tight">
                Revisión {currentPBQ ? `de la PBQ ${currentPBQ.number}` : ''}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono line-clamp-1">{result.sy0701Objective}</p>
            </div>
          </div>
          <button onClick={() => { sound.playClick(); onClose(); }} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800" role="tablist">
            {([
              ['review', 'Corrección', <Target key="i" className="w-3.5 h-3.5" />, failed.length ? `${failed.length} a repasar` : null],
              ['guide', 'Guía de estudio', <BookOpen key="i" className="w-3.5 h-3.5" />, guide?.itemsGlossary.length ? `${guide.itemsGlossary.length}` : null],
            ] as const).map(([tab, label, icon, badge]) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => { sound.playClick(); setActiveTab(tab); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
              >
                {icon}
                <span>{label}</span>
                {badge && <span className="px-1.5 rounded-full text-[10px] bg-slate-950/70 font-mono">{badge}</span>}
              </button>
            ))}
          </div>
          <div className="text-xs font-mono text-slate-400">
            Puntuación: <strong className="text-white">{result.totalScore}%</strong>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'review' && (
            <>
              {/* Score summary */}
              <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${result.totalScore >= 75 ? 'bg-emerald-950/20 border-emerald-800/80' : result.totalScore >= 50 ? 'bg-amber-950/20 border-amber-800/80' : 'bg-rose-950/20 border-rose-800/80'}`}>
                <div className="space-y-1 text-center md:text-left">
                  <div className="text-xl font-extrabold">
                    {result.totalScore >= 75 ? <span className="text-emerald-400">Aprobada</span> : <span className="text-amber-400">Para repasar</span>}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">{result.detailedFeedback}</p>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0 min-w-[120px]">
                  <div className="text-3xl font-black text-cyan-400 font-mono tabular-nums">{result.totalScore}%</div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Aprobación: 75%</span>
                </div>
              </div>

              {/* What to study */}
              {failed.length > 0 && (
                <div className="p-4 rounded-xl bg-indigo-950/25 border border-indigo-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4" /> Qué repasar
                  </div>
                  <ul className="space-y-1.5">
                    {failed.map((item) => (
                      <li key={item.id}>
                        <button onClick={() => goToCriterion(item.id)} className="text-left text-xs text-slate-200 hover:text-white flex items-start gap-2">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span className="underline decoration-slate-600 underline-offset-2">{item.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {conceptsToReview.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 mr-1">Conceptos:</span>
                      {conceptsToReview.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => { setActiveTab('guide'); setGlossaryFilter(c.name); }}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900 border border-indigo-800/70 text-indigo-200 hover:text-white"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Criterio por criterio</h4>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  {([
                    ['all', `Todos (${result.partialCreditBreakdown.length})`],
                    ['failed', `Errores (${failed.length})`],
                    ['passed', `Aciertos (${result.partialCreditBreakdown.length - failed.length})`],
                  ] as const).map(([value, label]) => (
                    <button key={value} onClick={() => setCriteriaFilter(value)} className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${criteriaFilter === value ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Criteria */}
              <div className="space-y-3">
                {displayed.map((item) => {
                  const ok = isFullCredit(item);
                  const expanded = expandedItems[item.id] ?? !ok;
                  const concepts = guide ? conceptsFor(guide, item.id).filter((c) => !item.explanation.includes(c.definition)) : [];
                  return (
                    <div key={item.id} id={`criterion-${item.id}`} className={`rounded-xl border overflow-hidden scroll-mt-4 ${ok ? 'border-emerald-800/40 bg-slate-950/70' : 'border-rose-800/60 bg-rose-950/10'}`}>
                      <button onClick={() => toggle(item.id, expanded)} aria-expanded={expanded} className="w-full p-3.5 flex items-center justify-between gap-3 text-left">
                        <div className="flex items-start gap-2.5 min-w-0">
                          {ok ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                          <span className="text-xs font-bold text-white">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${ok ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                            {fmt(item.points)} / {fmt(item.maxPoints)}
                          </span>
                          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>

                      {expanded && (
                        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800/60 bg-slate-950/90 text-xs">
                          <div className={`p-3 rounded-lg border ${ok ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-rose-950/20 border-rose-800/50'}`}>
                            <div className={`text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {ok ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                              {ok ? 'Por qué es correcto' : 'Qué falló y cuál es la respuesta'}
                            </div>
                            <p className="text-slate-200 leading-relaxed">{item.explanation}</p>
                          </div>

                          {concepts.map((c) => (
                            <div key={c.name} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <BookMarked className="w-3.5 h-3.5" /> {c.name}
                                </span>
                                {c.badge && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">{c.badge}</span>}
                              </div>
                              <p className="text-slate-300 leading-relaxed">{c.definition}</p>
                              <p className="text-slate-300 leading-relaxed"><span className="text-emerald-400 font-semibold">En este escenario: </span>{c.whyCorrectOrRole}</p>
                              {c.distractorWarning && (
                                <p className="text-slate-300 leading-relaxed"><span className="text-amber-400 font-semibold">Trampa de examen: </span>{c.distractorWarning}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {displayed.length === 0 && <div className="text-center py-6 text-xs text-slate-500">No hay criterios con este filtro.</div>}
              </div>
            </>
          )}

          {activeTab === 'guide' && guide && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Info className="w-4 h-4" /> Fundamento
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{guide.overviewRationale}</p>
              </div>

              {guide.keyTakeaways.length > 0 && (
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/60 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" /> Para recordar en el examen
                  </div>
                  <ul className="space-y-1.5">
                    {guide.keyTakeaways.map((t, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-cyan-400 font-bold shrink-0">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {guide.itemsGlossary.length > 0 && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-400" /> Conceptos ({guide.itemsGlossary.length})
                    </h4>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Buscar concepto..."
                        aria-label="Buscar concepto"
                        value={glossaryFilter}
                        onChange={(e) => setGlossaryFilter(e.target.value)}
                        className="w-full sm:w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  {filteredGlossary.map((c, idx) => (
                    <div key={`${c.name}-${idx}`} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white">{c.name}</span>
                        {c.badge && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">{c.badge}</span>}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{c.definition}</p>
                      <p className="text-xs text-slate-300 leading-relaxed"><span className="text-emerald-400 font-semibold">En este escenario: </span>{c.whyCorrectOrRole}</p>
                      {c.distractorWarning && (
                        <p className="text-xs text-slate-300 leading-relaxed"><span className="text-amber-400 font-semibold">Trampa de examen: </span>{c.distractorWarning}</p>
                      )}
                    </div>
                  ))}
                  {filteredGlossary.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-500">
                      Ningún concepto coincide con "{glossaryFilter}".{' '}
                      <button onClick={() => setGlossaryFilter('')} className="underline text-slate-300">Ver todos</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-mono">{result.domainName}</span>
          <div className="flex items-center gap-2">
            {onRetry && (
              <button onClick={() => { sound.playToggle(); onRetry(); onClose(); }} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl">
                <RotateCcw className="w-3.5 h-3.5" /> Reintentar
              </button>
            )}
            {hasNextPBQ && onNextPBQ && (
              <button onClick={() => { sound.playSuccess(); onNextPBQ(); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl">
                Siguiente PBQ <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
