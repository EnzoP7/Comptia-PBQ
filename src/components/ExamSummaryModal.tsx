import React, { useState } from 'react';
import { PBQItem, EvaluationResult } from '../types/pbq';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  X,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Flag,
  Filter,
  BarChart3,
  Sparkles,
  Zap
} from 'lucide-react';
import { sound } from '../utils/audio';
import { SY0701_DOMAINS, getDomainId } from '../data/sy0701Objectives';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pbqs: PBQItem[];
  scores: { [pbqId: string]: EvaluationResult };
  flaggedIds?: Set<string>;
  onReviewPBQ: (index: number) => void;
  onRestartExam: () => void;
  onStartMiniDrill?: () => void;
  title?: string;
  restartLabel?: string;
}

export const ExamSummaryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  pbqs,
  scores,
  flaggedIds = new Set(),
  onReviewPBQ,
  onRestartExam,
  onStartMiniDrill,
  title = 'Reporte de Preparación PBQ — CompTIA Security+ SY0-701',
  restartLabel = 'Borrar todo el progreso',
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'flagged' | 'unevaluated' | 'failed'>('all');

  if (!isOpen) return null;


  // Calculate stats per domain
  const domainStats = SY0701_DOMAINS.map((d) => {
    const domainPbqs = pbqs.filter((p) => getDomainId(p.domain) === d.id);
    const evaluatedInDomain = domainPbqs.filter((p) => scores[p.id]);
    const scoreSum = evaluatedInDomain.reduce((acc, p) => acc + (scores[p.id]?.totalScore || 0), 0);
    const domainPercentage = domainPbqs.length > 0
      ? Math.round(scoreSum / domainPbqs.length)
      : 0;

    return {
      ...d,
      totalCount: domainPbqs.length,
      evaluatedCount: evaluatedInDomain.length,
      percentage: domainPercentage,
      passedCount: evaluatedInDomain.filter((p) => (scores[p.id]?.totalScore || 0) >= 75).length
    };
  });

  // Weighted estimate over the domains present in this set (a 5-PBQ session never covers all five)
  const presentDomains = domainStats.filter((d) => d.totalCount > 0);
  const presentWeight = presentDomains.reduce((acc, d) => acc + d.weight, 0) || 1;
  const weightedSum = presentDomains.reduce((acc, d) => acc + d.percentage * (d.weight / presentWeight), 0);
  const comptiaScaleScore = Math.min(900, Math.max(100, Math.round(100 + weightedSum * 8)));
  const isPassed = comptiaScaleScore >= 750;

  // Filtered PBQ list
  const filteredPbqs = pbqs.map((p, idx) => ({ ...p, originalIndex: idx })).filter((p) => {
    const evalRes = scores[p.id];
    const score = evalRes?.totalScore ?? 0;
    const isEvaluated = !!evalRes;
    const isFlagged = flaggedIds.has(p.id);

    if (filterMode === 'flagged') return isFlagged;
    if (filterMode === 'unevaluated') return !isEvaluated;
    if (filterMode === 'failed') return isEvaluated && score < 75;
    return true;
  });

  const unevaluatedCount = pbqs.filter((p) => !scores[p.id]).length;
  const flaggedCount = pbqs.filter((p) => flaggedIds.has(p.id)).length;
  const failedCount = pbqs.filter((p) => scores[p.id] && scores[p.id].totalScore < 75).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl border ${
                isPassed
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  : 'bg-rose-950 text-rose-400 border-rose-800'
              }`}
            >
              {isPassed ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>{title}</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Estimación en escala 100-900 ponderada por dominio • Corte orientativo: 750
              </p>
            </div>
          </div>

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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300">
          {/* Certificate / Result Card */}
          <div
            className={`p-5 rounded-2xl border ${
              isPassed
                ? 'bg-gradient-to-b from-emerald-950/30 to-slate-950 border-emerald-800/80'
                : 'bg-gradient-to-b from-rose-950/30 to-slate-950 border-rose-800/80'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 text-center sm:text-left">
                <div>
                  <div
                    className={`text-5xl font-black font-mono tracking-tight tabular-nums ${
                      isPassed ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {comptiaScaleScore}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">de 900 puntos posibles</div>
                </div>

                <div className="h-12 w-px bg-slate-800 hidden sm:block" />

                <div>
                  <div
                    className={`text-xl font-black uppercase ${
                      isPassed ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {isPassed ? 'NIVEL DE APROBACIÓN' : 'POR DEBAJO DEL CORTE'}
                  </div>
                  <div className="text-xs text-slate-400">
                    Corte orientativo: <span className="font-mono font-bold text-white">750</span>
                  </div>
                </div>
              </div>

              {onStartMiniDrill && (
                <button
                  onClick={() => {
                    sound.playSuccess();
                    onStartMiniDrill();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950 ring-1 ring-cyan-400/40 shrink-0"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Nuevo Simulacro con Tiempo</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed border-t border-slate-800/60 pt-3">
              {isPassed
                ? 'Buen nivel en PBQs. Para confirmar que estás listo, repite simulacros con PBQs que no hayas visto recientemente y con las pistas desactivadas: memorizar una PBQ no es lo mismo que dominar el objetivo.'
                : 'Por debajo del corte orientativo. Esta estimación solo considera PBQs (el examen real combina PBQs y preguntas de opción múltiple, y CompTIA no publica cómo pondera cada ítem). Usa el diagnóstico por dominio para enfocar el estudio.'}
            </p>
          </div>

          {/* Official 5 Domains Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Desempeño por Dominios Oficiales CompTIA SY0-701</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                Peso oficial de cada dominio en el examen
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {domainStats.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">
                      {d.shortName}
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">
                      {d.percentage}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        d.percentage >= 75
                          ? 'bg-emerald-500'
                          : d.percentage >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.max(4, d.percentage)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Peso Examen: {Math.round(d.weight * 100)}%</span>
                    <span>
                      {d.evaluatedCount}/{d.totalCount} PBQs resueltas ({d.passedCount} aprobadas)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pearson VUE Style Review Deck with Filter Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pantalla de Revisión de Reactivos (Pearson VUE Review Deck)</span>
              </h4>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterMode === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todas ({pbqs.length})
                </button>
                <button
                  onClick={() => setFilterMode('flagged')}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                    filterMode === 'flagged'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flag className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Marcadas ({flaggedCount})</span>
                </button>
                <button
                  onClick={() => setFilterMode('unevaluated')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterMode === 'unevaluated'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sin Evaluar ({unevaluatedCount})
                </button>
                <button
                  onClick={() => setFilterMode('failed')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterMode === 'failed'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Puntaje Bajo ({failedCount})
                </button>
              </div>
            </div>

            {/* PBQ List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredPbqs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 rounded-xl border border-slate-800 bg-slate-950/40">
                  No hay reactivos que coincidan con este filtro.
                </div>
              ) : (
                filteredPbqs.map((pbq) => {
                  const evalResult = scores[pbq.id];
                  const score = evalResult ? evalResult.totalScore : 0;
                  const evaluated = !!evalResult;
                  const isFlagged = flaggedIds.has(pbq.id);

                  return (
                    <div
                      key={pbq.id}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-cyan-400 flex items-center justify-center shrink-0">
                          #{pbq.number}
                        </span>

                        {isFlagged && (
                          <span title="Marcada para revisión">
                            <Flag className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                          </span>
                        )}

                        <div>
                          <div className="text-xs font-semibold text-white">
                            {pbq.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {pbq.domain}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 font-mono">
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded ${
                              !evaluated
                                ? 'text-slate-500 bg-slate-900'
                                : score >= 75
                                ? 'text-emerald-400 bg-emerald-950 border border-emerald-800'
                                : 'text-rose-400 bg-rose-950 border border-rose-800'
                            }`}
                          >
                            {evaluated ? `${score}%` : 'Sin Evaluar'}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            sound.playClick();
                            onReviewPBQ(pbq.originalIndex);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans border border-slate-800 transition-colors"
                        >
                          <span>Revisar</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              sound.playToggle();
              onRestartExam();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {restartLabel}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors"
          >
            Cerrar Reporte
          </button>
        </div>
      </div>
    </div>
  );
};
