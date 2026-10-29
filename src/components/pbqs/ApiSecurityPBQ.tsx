import React from 'react';
import {
  Code2,
  ShieldAlert,
  Terminal,
  RotateCcw,
  CheckCircle2,
  Lock,
  Globe,
  Server,
  FileCode,
  Zap,
  Layers
} from 'lucide-react';
import { ApiSecurityState } from '../../types/pbq';
import { shuffled } from '../../utils/shuffle';

interface Props {
  state: ApiSecurityState;
  onChange: (newState: ApiSecurityState) => void;
  onReset: () => void;
}

export const ApiSecurityPBQ: React.FC<Props> = ({ state, onChange, onReset }) => {
  const handleChange = (
    scenarioId: string,
    field: 'identifiedVulnerability' | 'secureRemediation',
    val: string
  ) => {
    const updated = state.scenarios.map((sc) => {
      if (sc.id === scenarioId) {
        return {
          ...sc,
          [field]: val,
        };
      }
      return sc;
    });
    onChange({ scenarios: updated });
  };

  const vulnOptions = [
    { value: '', label: '-- Seleccionar Vulnerabilidad de API (OWASP API Top 10) --' },
    { value: 'bola_idor', label: 'Broken Object Level Authorization - BOLA / IDOR (OWASP API1)' },
    { value: 'ssrf_cloud_metadata', label: 'Server-Side Request Forgery - SSRF contra Metadatos Cloud (OWASP API7)' },
    { value: 'jwt_alg_none_tampering', label: 'Falsificación de Tokens JWT / Algoritmo "none" Aceptado (OWASP API2)' },
    { value: 'sqli_api_unparameterized', label: 'Inyección SQL en Parámetros de Endpoint REST (OWASP API8:2019)' },
    { value: 'lack_of_rate_limiting_stuffing', label: 'Falta de Limitación de Recursos y Rate Limiting / DoS (OWASP API4)' },
    // Distractors
    { value: 'xss_stored', label: 'Stored Cross-Site Scripting (XSS)' },
    { value: 'csrf_cookie_missing', label: 'Cross-Site Request Forgery (CSRF)' }
  ];

  const remediationOptions = [
    { value: '', label: '-- Seleccionar Control Técnico de Mitigación --' },
    { value: 'contextual_rbac_object_ownership', label: 'Validar propiedad del objeto contra la sesión autenticada con RBAC en el backend' },
    { value: 'url_whitelist_disable_metadata_v1', label: 'Lista blanca de URLs, bloquear 169.254.0.0/16 y forzar IMDSv2 con tokens de sesión' },
    { value: 'enforce_asymmetric_jwt_verify_reject_none', label: 'Rechazar tokens con "alg: none", forzar RS256/ES256 y validar firma contra JWKS público' },
    { value: 'prepared_statements_orm_parameterized', label: 'Uso obligatorio de Consultas Preparadas (Prepared Statements) u ORM parametrizado' },
    { value: 'api_gateway_rate_limiting_waf_captcha', label: 'Configurar Rate Limiting (Token Bucket) en API Gateway, reglas WAF y CAPTCHA adaptativo' },
    // Distractors
    { value: 'client_side_javascript_validation', label: 'Implementar validación de parámetros en el frontend de JavaScript en el navegador' },
    { value: 'increase_cloud_vm_ram', label: 'Forzar TLS 1.3 en todos los endpoints de la API' }
  ];

  return (
    <div className="space-y-6">
      {/* Context Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
            <Code2 className="w-4 h-4" />
            <span>Seguridad en Desarrollo de Software (SDLC) & OWASP API Top 10 — SY0-701</span>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          En los <strong className="text-white">Dominios 2 y 4 de CompTIA Security+ SY0-701</strong>, la arquitectura de microservicios y APIs REST exige identificar vulnerabilidades específicas de lógica de negocio y transporte (OWASP API Top 10) e implementar contramedidas de código seguro y controles perimetrales a nivel de API Gateway.
        </p>
      </div>

      {/* Scenarios List */}
      <div className="space-y-5">
        {state.scenarios.map((sc, index) => (
          <div
            key={sc.id}
            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700/80 transition-colors space-y-4 shadow-lg"
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-cyan-400 flex items-center justify-center shrink-0">
                #{index + 1}
              </span>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white tracking-wide">
                  {sc.endpointTitle}
                </h4>
              </div>
            </div>

            {/* HTTP Request Payload / Code Snippet */}
            <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-800/80 font-mono text-[11px] text-cyan-300 flex items-start gap-2.5">
              <Terminal className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-slate-300 w-full">
                <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px] mb-1">
                  Petición HTTP / Fragmento de Código Interceptado:
                </span>
                <pre className="text-cyan-200 font-mono text-[11px] leading-relaxed">
                  {sc.httpPayloadOrCode}
                </pre>
              </div>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Vulnerabilidad OWASP API Identificada:</span>
                </label>
                <select
                  value={sc.identifiedVulnerability}
                  onChange={(e) => handleChange(sc.id, 'identifiedVulnerability', e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500 font-sans"
                >
                  {shuffled(vulnOptions).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Control Técnico / Remediación de Código:</span>
                </label>
                <select
                  value={sc.secureRemediation}
                  onChange={(e) => handleChange(sc.id, 'secureRemediation', e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 font-sans"
                >
                  {shuffled(remediationOptions).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
