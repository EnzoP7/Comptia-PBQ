import React from 'react';
import { DevSecOpsState } from '../../types/pbq';
import {
  GitBranch,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  ShieldCheck,
  Code,
  PackageCheck,
  Zap,
  Lock,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: DevSecOpsState;
  onChange: (state: DevSecOpsState) => void;
  onReset: () => void;
}

export const DevSecOpsPBQ: React.FC<Props> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof DevSecOpsState, value: string) => {
    sound.playClick();
    onChange({
      ...state,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            Integración de Seguridad en el Pipeline CI/CD (DevSecOps Shift-Left)
          </div>
          <p className="text-xs text-slate-400">
            Aplica el principio <strong>Shift-Left</strong> asignando la herramienta de seguridad adecuada (Secret Scanning, SAST, SCA, DAST, Firma de Contenedores) en la fase precisa del ciclo de entrega continua.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playToggle();
            onReset();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer</span>
        </button>
      </div>

      {/* Visual Pipeline Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stage 1: Code / Commit */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-sky-400" />
                Fase 1: Code / Commit
              </span>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                Shift-Left
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Interceptar credenciales, API keys y contraseñas incrustadas por error en el código antes de que lleguen a GitHub/GitLab.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Control de Seguridad:
            </label>
            <select
              value={state.codeCommitControl}
              onChange={(e) => handleChange('codeCommitControl', e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="">-- Seleccionar Control --</option>
              <option value="manual_code_review_annual">Revisión manual anual de código</option>
              <option value="dast_running">DAST en servidor web productivo</option>
              <option value="secret_scanning_hooks">Pre-commit Hooks & Secret Scanning (TruffleHog / GitGuardian)</option>
              <option value="firewall_perimeter">Reglas de Firewall perimetral</option>
            </select>
          </div>
        </div>

        {/* Stage 2: Build / Compile */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span className="flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-indigo-400" />
                Fase 2: Build / Compile
              </span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                SAST & SCA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Analizar código fuente sin ejecutarlo (Static Analysis) y auditar librerías npm/pip de terceros (SBOM / Dependencias).
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Control de Seguridad:
            </label>
            <select
              value={state.buildStageControl}
              onChange={(e) => handleChange('buildStageControl', e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="">-- Seleccionar Control --</option>
              <option value="pentest_external">Pruebas de intrusión físicas externas</option>
              <option value="biometric_access">Autenticación biométrica de desarrolladores</option>
              <option value="antivirus_endpoint">Antivirus tradicional en la estación</option>
              <option value="sast_sca_analysis">SAST (SonarQube) & SCA / SBOM (Snyk / Dependabot)</option>
            </select>
          </div>
        </div>

        {/* Stage 3: Test / Staging */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Fase 3: Test / Staging
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                DAST / IAST
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Escanear la aplicación en tiempo de ejecución (Caja Negra) enviando payloads web para detectar XSS y SQLi activos.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Control de Seguridad:
            </label>
            <select
              value={state.testStageControl}
              onChange={(e) => handleChange('testStageControl', e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="">-- Seleccionar Control --</option>
              <option value="email_notification">Envío de correo al cliente final</option>
              <option value="disable_waf">Apagar el WAF durante las pruebas</option>
              <option value="dast_runtime_scan">DAST (Dynamic Analysis - OWASP ZAP) & IAST interactivo</option>
              <option value="git_commit">Git Commit simple sin pruebas</option>
            </select>
          </div>
        </div>

        {/* Stage 4: Deploy / Production */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                Fase 4: Deploy / Release
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Firma & RASP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Verificar la firma criptográfica de los artefactos de contenedor e instrumentar protección en tiempo real ante exploits.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Control de Seguridad:
            </label>
            <select
              value={state.deployStageControl}
              onChange={(e) => handleChange('deployStageControl', e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="">-- Seleccionar Control --</option>
              <option value="unverified_docker_hub">Descargar imágenes públicas no verificadas</option>
              <option value="image_signing_rasp">Firma Criptográfica de Imágenes (Cosign) & RASP en Producción</option>
              <option value="root_deploy">Desplegar con privilegios sudo root irrestrictos</option>
              <option value="clear_logs">Limpiar logs de auditoría para liberar disco</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
