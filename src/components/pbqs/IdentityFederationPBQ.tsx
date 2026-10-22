import React from 'react';
import { FederationState } from '../../types/pbq';
import {
  Users,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Key,
  ShieldCheck,
  FileCode,
  UserCheck,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: FederationState;
  onChange: (state: FederationState) => void;
  onReset: () => void;
}

export const IdentityFederationPBQ: React.FC<Props> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof FederationState, value: string) => {
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
            <UserCheck className="w-4 h-4 text-cyan-400" />
            Gestión de Identidades Federadas, Tokens y Single Sign-On (SSO)
          </div>
          <p className="text-xs text-slate-400">
            En CompTIA SY0-701, es crucial diferenciar la función de <strong>SAML 2.0</strong> (Autenticación Web empresarial), <strong>OAuth 2.0</strong> (Autorización API), <strong>OpenID Connect</strong> (Identidad moderna JWT) y <strong>SCIM</strong> (Aprovisionamiento de usuarios).
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Enterprise SSO */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-cyan-400" />
            1. Single Sign-On Empresarial (IdP a Proveedor SaaS)
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Permitir que los empleados inicien sesión en Salesforce y Workday usando su cuenta corporativa centralizada (Okta / Azure AD) mediante aserciones XML firmadas digitalmente.
          </p>
          <select
            value={state.enterpriseSsoProtocol}
            onChange={(e) => handleChange('enterpriseSsoProtocol', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="">-- Seleccionar Protocolo --</option>
            <option value="kerberos_local">Kerberos (tickets del dominio Active Directory)</option>
            <option value="ldap_clear">LDAPS (LDAP sobre TLS, puerto 636)</option>
            <option value="saml_20">SAML 2.0 (Security Assertion Markup Language basado en XML para Web SSO)</option>
            <option value="radius">RADIUS (Autenticación de acceso a redes y VPNs)</option>
          </select>
        </div>

        {/* 2. API Authorization */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-4 h-4 text-cyan-400" />
            2. Autorización Granular para APIs y Microservicios
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Otorgar a una aplicación móvil acceso de solo lectura (scope: read_calendar) a la API de correo del usuario sin conocer su contraseña maestra mediante tokens Bearer.
          </p>
          <select
            value={state.apiAuthorizationProtocol}
            onChange={(e) => handleChange('apiAuthorizationProtocol', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="">-- Seleccionar Protocolo --</option>
            <option value="shared_db_password">API keys estáticas por aplicación</option>
            <option value="oauth_20">OAuth 2.0 (Framework de Autorización basado en Scopes y Access Tokens)</option>
            <option value="basic_auth">HTTP Basic Authentication sobre TLS</option>
            <option value="ftp_auth">Kerberos con delegación restringida</option>
          </select>
        </div>

        {/* 3. Modern Web & Mobile Identity Layer */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            3. Capa de Identidad para Apps Móviles / SPAs (ID Tokens)
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Construido sobre OAuth 2.0 para añadir verificación de identidad de usuario y perfiles mediante tokens JWT (JSON Web Tokens) estructurados y ligeros.
          </p>
          <select
            value={state.modernMobileAuthProtocol}
            onChange={(e) => handleChange('modernMobileAuthProtocol', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="">-- Seleccionar Protocolo --</option>
            <option value="ntlm_v1">NTLMv2 (desafío-respuesta)</option>
            <option value="tacacs_plus">TACACS+ (Protocolo de gestión de routers y switches Cisco)</option>
            <option value="cookie_unencrypted">OAuth 2.0 solo con access token (sin capa de identidad)</option>
            <option value="oidc_jwt">OpenID Connect (OIDC - Capa de identidad con ID Token firmado JWT)</option>
          </select>
        </div>

        {/* 4. Automated User Provisioning */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-cyan-400" />
            4. Aprovisionamiento y Desaprovisionamiento Automático
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cuando Recursos Humanos da de baja a un empleado, sus cuentas y licencias en todas las aplicaciones en la nube conectadas deben eliminarse de forma sincronizada y automática.
          </p>
          <select
            value={state.automatedProvisioningProtocol}
            onChange={(e) => handleChange('automatedProvisioningProtocol', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="">-- Seleccionar Protocolo --</option>
            <option value="keep_accounts_active">Script nocturno de sincronización LDAP personalizado</option>
            <option value="scim_standard">SCIM (System for Cross-domain Identity Management - RFC 7643/7644)</option>
            <option value="email_helpdesk">JIT provisioning con la aserción SAML del primer login</option>
            <option value="manual_csv_upload">Exportación CSV programada semanalmente</option>
          </select>
        </div>
      </div>
    </div>
  );
};
