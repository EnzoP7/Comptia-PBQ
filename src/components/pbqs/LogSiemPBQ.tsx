import React, { useState } from 'react';
import { SiemAnswers, SiemLogEntry, SiemQuestionsConfig } from '../../types/pbq';
import { SIEM_LOGS_PBQ3, SIEM_QUESTIONS_PBQ3 } from '../../data/pbqsData';
import {
  Search,
  Filter,
  Terminal,
  FileCode,
  ShieldAlert,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  answers: SiemAnswers;
  onAnswersChange: (newAnswers: SiemAnswers) => void;
  logs?: SiemLogEntry[];
  questionsConfig?: SiemQuestionsConfig;
}

export const LogSiemPBQ: React.FC<Props> = ({
  answers,
  onAnswersChange,
  logs = SIEM_LOGS_PBQ3,
  questionsConfig = SIEM_QUESTIONS_PBQ3,
}) => {
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(logs[2]?.id || null);

  const availableSources = ['ALL', ...Array.from(new Set(logs.map((l) => l.source)))];

  const filteredLogs = logs.filter((log) => {
    const matchesSource =
      selectedSourceFilter === 'ALL' || log.source === selectedSourceFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      log.rawPayload.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.eventSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.sourceIp.includes(searchQuery) ||
      log.destIp.includes(searchQuery);

    return matchesSource && matchesSearch;
  });

  const handleFieldChange = (field: keyof SiemAnswers, value: string) => {
    sound.playClick();
    onAnswersChange({
      ...answers,
      [field]: value,
    });
  };

  const getSourceBadgeColor = (source: SiemLogEntry['source']) => {
    switch (source) {
      case 'Apache':
        return 'text-amber-400 bg-amber-950/80 border-amber-800';
      case 'Syslog':
        return 'text-sky-400 bg-sky-950/80 border-sky-800';
      case 'WinEvent':
        return 'text-purple-400 bg-purple-950/80 border-purple-800';
      case 'Firewall':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
      case 'EmailGateway':
        return 'text-rose-400 bg-rose-950/80 border-rose-800';
      case 'Proxy':
        return 'text-cyan-400 bg-cyan-950/80 border-cyan-800';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getLevelBadge = (level: SiemLogEntry['level']) => {
    switch (level) {
      case 'ALERT':
      case 'ERROR':
        return 'text-rose-400 bg-rose-950/80 border border-rose-800 font-bold';
      case 'WARN':
        return 'text-amber-400 bg-amber-950/80 border border-amber-800';
      default:
        return 'text-slate-400 bg-slate-900 border border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* SIEM Top Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por IP, código de evento (e.g. 4769, 4625), payload o texto..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
            />
          </div>

          {/* Source Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0 overflow-x-auto">
            {availableSources.map((src) => (
              <button
                key={src}
                onClick={() => {
                  sound.playToggle();
                  setSelectedSourceFilter(src);
                }}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedSourceFilter === src
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {src === 'ALL' ? 'Todos los Logs' : src}
              </button>
            ))}
          </div>
        </div>

        {/* Count indicators */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
          <span>
            Mostrando {filteredLogs.length} de {logs.length} eventos correlacionados
          </span>
          <span className="text-cyan-400">SIEM Index: corp-soc-indexes-2026</span>
        </div>
      </div>

      {/* SIEM Log Console Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Correlación de Registros de Seguridad (SIEM Events)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Haz clic en un registro para inspeccionar la carga útil cruda (Raw Payload)
          </span>
        </div>

        <div className="divide-y divide-slate-800/80 font-mono text-xs max-h-[380px] overflow-y-auto">
          {filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id}
                onClick={() => {
                  sound.playClick();
                  setExpandedLogId(isExpanded ? null : log.id);
                }}
                className={`p-3 cursor-pointer transition-colors hover:bg-slate-900/60 ${
                  isExpanded ? 'bg-slate-900/40' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {log.timestamp}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border ${getSourceBadgeColor(
                        log.source
                      )}`}
                    >
                      {log.source}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${getLevelBadge(log.level)}`}>
                      {log.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="text-slate-300 font-semibold">{log.sourceIp}</span>
                    <span className="text-slate-600">➔</span>
                    <span className="text-slate-300 font-semibold">{log.destIp}</span>
                  </div>
                </div>

                <div className="text-slate-200 font-sans text-xs mb-1">
                  {log.eventSummary}
                </div>

                {isExpanded && (
                  <div className="mt-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-emerald-400 overflow-x-auto">
                    <div className="text-[10px] uppercase text-slate-500 font-sans mb-1 font-semibold">
                      Raw Event Payload / Syslog Audit:
                    </div>
                    <code>{log.rawPayload}</code>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive SOC Incident Investigation Form */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-cyan-900/40 shadow-xl space-y-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300 pb-3 border-b border-slate-800">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <span>Informe de Conclusiones del Incidente (SOC Triage Submission)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Question 1 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              {questionsConfig.q1Label}
            </label>
            <select
              value={answers.patientZeroIp}
              onChange={(e) => handleFieldChange('patientZeroIp', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
            >
              <option value="">-- Seleccionar opción --</option>
              {questionsConfig.q1Options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Question 2 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              {questionsConfig.q2Label}
            </label>
            <select
              value={answers.initialCompromiseTimestamp}
              onChange={(e) => handleFieldChange('initialCompromiseTimestamp', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
            >
              <option value="">-- Seleccionar opción --</option>
              {questionsConfig.q2Options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Question 3 */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300">
              {questionsConfig.q3Label}
            </label>
            <select
              value={answers.initialAttackVector}
              onChange={(e) => handleFieldChange('initialAttackVector', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500"
            >
              <option value="">-- Seleccionar opción --</option>
              {questionsConfig.q3Options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Question 4 */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300">
              {questionsConfig.q4Label}
            </label>
            <select
              value={answers.immediateContainmentAction}
              onChange={(e) => handleFieldChange('immediateContainmentAction', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500"
            >
              <option value="">-- Seleccionar opción --</option>
              {questionsConfig.q4Options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
