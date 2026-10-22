import React, { useState } from 'react';
import { PBQItem, EvaluationResult } from '../types/pbq';
import {
  Network,
  Layers,
  Terminal,
  Server,
  Users,
  Lock,
  Wifi,
  Flag,
  CheckCircle2,
  Filter,
  Bug,
  ShieldCheck,
  LifeBuoy,
  Boxes,
  Building2,
  Activity,
  Search,
  X,
  FileSearch,
  Calculator,
  Mail,
  Code2,
  GitBranch,
  Key,
  UserCheck,
  Smartphone,
  Globe,
  Shield,
  Radio,
  Cloud,
  AlertTriangle,
  Database,
  EyeOff,
  Zap,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  pbqs: PBQItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  flaggedIds: Set<string>;
  evaluations: { [pbqId: string]: EvaluationResult };
}

export const PBQNav: React.FC<Props> = ({
  pbqs,
  currentIndex,
  onSelectIndex,
  flaggedIds,
  evaluations,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getCategoryIcon = (category: PBQItem['category'], className = 'w-3.5 h-3.5') => {
    switch (category) {
      case 'network-diagram':
        return <Network className={className} />;
      case 'firewall-acl':
        return <Layers className={className} />;
      case 'log-siem':
        return <Terminal className={className} />;
      case 'endpoint-hardening':
        return <Server className={className} />;
      case 'iam-permissions':
        return <Users className={className} />;
      case 'cryptography-vpn':
        return <Lock className={className} />;
      case 'wireless-security':
        return <Wifi className={className} />;
      case 'vulnerability-management':
        return <Bug className={className} />;
      case 'dlp-data-protection':
        return <ShieldCheck className={className} />;
      case 'incident-response':
        return <LifeBuoy className={className} />;
      case 'container-security':
        return <Boxes className={className} />;
      case 'physical-security':
        return <Building2 className={className} />;
      case 'disaster-recovery':
        return <Activity className={className} />;
      case 'social-engineering':
        return <Users className={className} />;
      case 'digital-forensics':
        return <FileSearch className={className} />;
      case 'risk-management':
        return <Calculator className={className} />;
      case 'email-security':
        return <Mail className={className} />;
      case 'security-cli':
        return <Terminal className={className} />;
      case 'ids-yara-rules':
        return <Code2 className={className} />;
      case 'devsecops-pipeline':
        return <GitBranch className={className} />;
      case 'crypto-attacks':
        return <Key className={className} />;
      case 'identity-federation':
        return <UserCheck className={className} />;
      case 'mobile-security':
        return <Smartphone className={className} />;
      case 'port-security':
        return <Radio className={className} />;
      case 'nmap-recon':
        return <Terminal className={className} />;
      case 'dns-security':
        return <Globe className={className} />;
      case 'zero-trust':
        return <Shield className={className} />;
      case 'web-hardening':
        return <Server className={className} />;
      case 'forensic-hold':
        return <FileSearch className={className} />;
      case 'wireless-hardening':
        return <Wifi className={className} />;
      case 'cloud-dlp':
      case 'cloud-shared-responsibility':
        return <Cloud className={className} />;
      case 'mitre-threat-hunting':
        return <AlertTriangle className={className} />;
      case 'data-governance':
        return <Database className={className} />;
      case 'privacy-pets':
        return <EyeOff className={className} />;
      case 'malware-triage':
        return <Bug className={className} />;
      case 'api-security':
        return <Code2 className={className} />;
      case 'soar-automation':
        return <Zap className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  const categories = [
    { id: 'all', label: 'Todas las PBQs', count: pbqs.length },
    { id: 'api-security', label: 'Seguridad APIs / OWASP', count: pbqs.filter((p) => p.category === 'api-security').length },
    { id: 'soar-automation', label: 'SIEM & SOAR', count: pbqs.filter((p) => p.category === 'soar-automation').length },
    { id: 'malware-triage', label: 'Triage Malware', count: pbqs.filter((p) => p.category === 'malware-triage').length },
    { id: 'data-governance', label: 'Gobernanza Datos', count: pbqs.filter((p) => p.category === 'data-governance').length },
    { id: 'privacy-pets', label: 'Privacidad & PETs', count: pbqs.filter((p) => p.category === 'privacy-pets').length },
    { id: 'cloud-shared-responsibility', label: 'Cloud Shared Resp.', count: pbqs.filter((p) => p.category === 'cloud-shared-responsibility').length },
    { id: 'mitre-threat-hunting', label: 'MITRE / Threat Hunt', count: pbqs.filter((p) => p.category === 'mitre-threat-hunting').length },
    { id: 'port-security', label: 'Puertos & Protocolos', count: pbqs.filter((p) => p.category === 'port-security').length },
    { id: 'nmap-recon', label: 'Nmap / Escaneo', count: pbqs.filter((p) => p.category === 'nmap-recon').length },
    { id: 'dns-security', label: 'DNS & DNSSEC', count: pbqs.filter((p) => p.category === 'dns-security').length },
    { id: 'zero-trust', label: 'Zero Trust ZTA', count: pbqs.filter((p) => p.category === 'zero-trust').length },
    { id: 'web-hardening', label: 'Hardening Web', count: pbqs.filter((p) => p.category === 'web-hardening').length },
    { id: 'forensic-hold', label: 'Forense & Custodia', count: pbqs.filter((p) => p.category === 'forensic-hold').length },
    { id: 'email-security', label: 'Seguridad Correo', count: pbqs.filter((p) => p.category === 'email-security').length },
    { id: 'wireless-hardening', label: 'WiFi 802.1X WPA3', count: pbqs.filter((p) => p.category === 'wireless-hardening').length },
    { id: 'cloud-dlp', label: 'Cloud DLP & CASB', count: pbqs.filter((p) => p.category === 'cloud-dlp').length },
    { id: 'social-engineering', label: 'Ing. Social', count: pbqs.filter((p) => p.category === 'social-engineering').length },
    { id: 'network-diagram', label: 'Redes / Cloud', count: pbqs.filter((p) => p.category === 'network-diagram').length },
    { id: 'firewall-acl', label: 'Firewall ACL', count: pbqs.filter((p) => p.category === 'firewall-acl').length },
    { id: 'log-siem', label: 'SIEM Logs', count: pbqs.filter((p) => p.category === 'log-siem').length },
    { id: 'endpoint-hardening', label: 'Hardening', count: pbqs.filter((p) => p.category === 'endpoint-hardening').length },
    { id: 'iam-permissions', label: 'IAM / RBAC', count: pbqs.filter((p) => p.category === 'iam-permissions').length },
    { id: 'cryptography-vpn', label: 'Cripto / PKI', count: pbqs.filter((p) => p.category === 'cryptography-vpn').length },
    { id: 'wireless-security', label: 'Wi-Fi / WIPS', count: pbqs.filter((p) => p.category === 'wireless-security').length },
    { id: 'vulnerability-management', label: 'Vulnerabilidades', count: pbqs.filter((p) => p.category === 'vulnerability-management').length },
    { id: 'dlp-data-protection', label: 'DLP / Datos', count: pbqs.filter((p) => p.category === 'dlp-data-protection').length },
    { id: 'incident-response', label: 'Resp. Incidentes', count: pbqs.filter((p) => p.category === 'incident-response').length },
    { id: 'container-security', label: 'Contenedores', count: pbqs.filter((p) => p.category === 'container-security').length },
    { id: 'physical-security', label: 'Seguridad Física', count: pbqs.filter((p) => p.category === 'physical-security').length },
    { id: 'disaster-recovery', label: 'DRP / Resiliencia', count: pbqs.filter((p) => p.category === 'disaster-recovery').length },
    { id: 'digital-forensics', label: 'Forense / RFC 3227', count: pbqs.filter((p) => p.category === 'digital-forensics').length },
    { id: 'risk-management', label: 'Gestión de Riesgo', count: pbqs.filter((p) => p.category === 'risk-management').length },
    { id: 'security-cli', label: 'Comandos CLI', count: pbqs.filter((p) => p.category === 'security-cli').length },
    { id: 'ids-yara-rules', label: 'IDS & Reglas YARA', count: pbqs.filter((p) => p.category === 'ids-yara-rules').length },
    { id: 'devsecops-pipeline', label: 'Pipeline DevSecOps', count: pbqs.filter((p) => p.category === 'devsecops-pipeline').length },
    { id: 'crypto-attacks', label: 'Ataques Cripto', count: pbqs.filter((p) => p.category === 'crypto-attacks').length },
    { id: 'identity-federation', label: 'SSO & Identidad', count: pbqs.filter((p) => p.category === 'identity-federation').length },
    { id: 'mobile-security', label: 'Seguridad Móvil MDM', count: pbqs.filter((p) => p.category === 'mobile-security').length },
  ];

  const filteredPbqs = pbqs.filter((p) => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.number.toString() === searchQuery.trim();
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-slate-950/95 border-b border-slate-800/80 py-2.5 px-4 sm:px-6 space-y-2.5">
      {/* Category filter pills and Search bar */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs shrink-0 max-w-full sm:max-w-3xl">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 hidden sm:inline shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playToggle();
                setCategoryFilter(cat.id);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === cat.id
                  ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>{cat.label}</span>{' '}
              <span className="font-mono text-[10px] text-cyan-400">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Search input and Quick Stats */}
        <div className="flex items-center gap-2.5 ml-auto text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar PBQ (ej. WAF, RAID, NIST)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 py-1 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-500 font-mono hidden lg:flex items-center gap-2.5 shrink-0">
            <span>Evaluadas: <strong className="text-white">{Object.keys(evaluations).length}</strong>/{pbqs.length}</span>
            <span>Marcadas: <strong className="text-amber-400">{flaggedIds.size}</strong></span>
          </div>
        </div>
      </div>

      {/* PBQ selector horizontal scrolling items */}
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto pb-1">
        {filteredPbqs.length === 0 ? (
          <div className="text-xs text-slate-500 py-1 font-mono">
            No se encontraron PBQs con el filtro &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredPbqs.map((pbq) => {
            const actualIndex = pbqs.findIndex((p) => p.id === pbq.id);
            const isSelected = currentIndex === actualIndex;
            const isFlagged = flaggedIds.has(pbq.id);
            const evalResult = evaluations[pbq.id];
            const hasEvaluated = evalResult !== undefined;

            return (
              <button
                key={pbq.id}
                onClick={() => {
                  sound.playClick();
                  onSelectIndex(actualIndex);
                }}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {/* Category Icon */}
                <span
                  className={
                    isSelected
                      ? 'text-cyan-400'
                      : hasEvaluated
                      ? evalResult.passed
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                      : 'text-slate-500'
                  }
                >
                  {getCategoryIcon(pbq.category)}
                </span>

                {/* PBQ Number & Mini Title */}
                <span className="font-mono font-bold">PBQ {pbq.number}</span>
                <span className="text-[11px] text-slate-400 max-w-[110px] truncate hidden md:inline">
                  {pbq.title}
                </span>

                {/* Score Pill if Evaluated */}
                {hasEvaluated && (
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      evalResult.passed
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {evalResult.totalScore}%
                  </span>
                )}

                {/* Flag indicator icon */}
                {isFlagged && (
                  <Flag className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
