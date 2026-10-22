import React from 'react';
import { ConditionalAccessState } from '../../types/pbq';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Globe,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  Layers,
  KeyRound,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: ConditionalAccessState;
  onChange: (newState: ConditionalAccessState) => void;
  onReset: () => void;
}

export const ConditionalAccessPBQ: React.FC<Props> = ({ state, onChange, onReset }) => {
  const handleFieldChange = (field: keyof ConditionalAccessState, value: string) => {
    sound.playClick();
    onChange({
      ...state,
      [field]: value,
    });
  };

  const getStatusBadge = (isCompliant: boolean) => {
    if (isCompliant) {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Zero Trust Aprobado
        </span>
      );
    }
    return (
      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono font-semibold flex items-center gap-1">
        <ShieldAlert className="w-3 h-3" /> No Conforme / Inseguro
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Motor de Directivas de Acceso Condicional Zero Trust (Conditional Access Engine)
            </h4>
            <p className="text-xs text-slate-400">
              Aplica el principio de "Nunca Confiar, Siempre Verificar" gobernando autenticación, estado del dispositivo y ubicaciones.
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer Directivas
        </button>
      </div>

      {/* Main Grid of 5 Zero Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Policy 1: Phishing-Resistant MFA */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>1. Directiva de Autenticación Multifactor (MFA)</span>
            </div>
            {getStatusBadge(state.requireMfa === 'fido2_phishing_resistant')}
          </div>
          <p className="text-[11px] text-slate-400">
            Exige factores de autenticación resistentes a ataques de adversary-in-the-middle (AiTM) y SIM swap.
          </p>
          <select
            value={state.requireMfa}
            onChange={(e) => handleFieldChange('requireMfa', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
          >
            <option value="disabled">MFA Deshabilitado (Solo contraseña estática - INSEGURO)</option>
            <option value="sms_otp">MFA basado en SMS / Llamada telefónica (Vulnerable a SIM Swapping)</option>
            <option value="totp_app">MFA con Aplicación Autenticadora TOTP estándar (Vulnerable a AiTM)</option>
            <option value="fido2_phishing_resistant">
              MFA Resistente a Phishing (FIDO2 WebAuthn / Llave de Seguridad FIPS)
            </option>
          </select>
        </div>

        {/* Policy 2: Geoblocking Named Locations */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>2. Filtrado por Ubicación Geográfica (Named Locations)</span>
            </div>
            {getStatusBadge(state.geoBlockingPolicy === 'block_untrusted_geos')}
          </div>
          <p className="text-[11px] text-slate-400">
            Restringe el acceso de usuarios a países y regiones donde la empresa opera legítimamente.
          </p>
          <select
            value={state.geoBlockingPolicy}
            onChange={(e) => handleFieldChange('geoBlockingPolicy', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
          >
            <option value="allow_all">Permitir inicios de sesión desde cualquier país del mundo</option>
            <option value="warn_only">Solo alertar en el SIEM sin bloquear conexiones remotas</option>
            <option value="block_untrusted_geos">
              Bloquear acceso desde países no autorizados (Geoblocking estricto)
            </option>
          </select>
        </div>

        {/* Policy 3: Device Compliance (MDM) */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>3. Cumplimiento de Dispositivo (Device Compliance / MDM)</span>
            </div>
            {getStatusBadge(state.deviceCompliance === 'require_mdm_compliant')}
          </div>
          <p className="text-[11px] text-slate-400">
            Verifica que el endpoint tenga disco cifrado, parche al día y agente EDR antes de permitir acceso a datos clínicos/EHR.
          </p>
          <select
            value={state.deviceCompliance}
            onChange={(e) => handleFieldChange('deviceCompliance', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
          >
            <option value="any_device">Permitir acceso desde cualquier dispositivo personal (BYOD sin gestión)</option>
            <option value="browser_only">Permitir solo mediante navegador sin validar salud del endpoint</option>
            <option value="require_mdm_compliant">
              Exigir dispositivo corporativo registrado y conforme (MDM / Intune Compliant)
            </option>
          </select>
        </div>

        {/* Policy 4: Just-In-Time (PIM) for Admins */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>4. Gestión de Acceso Privilegiado (PIM / JIT Access)</span>
            </div>
            {getStatusBadge(state.adminJustInTime === 'enforce_pim_jit')}
          </div>
          <p className="text-[11px] text-slate-400">
            Elimina el acceso permanente de Administrador Global aplicando el principio de privilegios Just-In-Time (JIT).
          </p>
          <select
            value={state.adminJustInTime}
            onChange={(e) => handleFieldChange('adminJustInTime', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
          >
            <option value="standing_admin_access">
              Privilegios permanentes de Administrador Global (Standing Access - Alto Riesgo)
            </option>
            <option value="enforce_pim_jit">
              Exigir PIM Just-In-Time con aprobación justificada y expiración automática (Recomendado)
            </option>
          </select>
        </div>

        {/* Policy 5: Risk-Based Conditional Access */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>5. Respuesta a Riesgos de Identidad en Tiempo Real (Identity Protection)</span>
            </div>
            {getStatusBadge(state.riskBasedAuth === 'block_high_risk_signin')}
          </div>
          <p className="text-[11px] text-slate-400">
            Detección de anomalías como viajes imposibles (Impossible Travel) o credenciales encontradas en la Dark Web.
          </p>
          <select
            value={state.riskBasedAuth}
            onChange={(e) => handleFieldChange('riskBasedAuth', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
          >
            <option value="ignore_risk">Ignorar alertas automáticas de riesgo de inicio de sesión</option>
            <option value="block_high_risk_signin">
              Bloquear acceso automáticamente cuando el nivel de riesgo de la sesión sea ALTO
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};
