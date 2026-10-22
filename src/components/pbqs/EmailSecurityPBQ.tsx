import React from 'react';
import {
  Mail,
  ShieldCheck,
  Lock,
  Globe,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { EmailSecurityState } from '../../types/pbq';

interface EmailSecurityPBQProps {
  state: EmailSecurityState;
  onChange: (newState: EmailSecurityState) => void;
  onReset: () => void;
}

export const EmailSecurityPBQ: React.FC<EmailSecurityPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof EmailSecurityState, val: string) => {
    onChange({
      ...state,
      [field]: val,
    });
  };

  return (
    <div className="space-y-6">
      {/* Scenario Context Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
            <Mail className="w-4 h-4" />
            <span>Escenario de Seguridad de Correo y Anti-Spoofing CompTIA SY0-701</span>
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
          Ciberdelincuentes están enviando correos de phishing suplantando la identidad del dominio corporativo (<span className="text-cyan-300 font-mono">@empresa.com</span>) en ataques de <span className="text-amber-300 font-semibold">Business Email Compromise (BEC)</span>. Debes configurar los registros DNS de autenticación de dominio (<span className="text-cyan-300 font-semibold">SPF, DKIM, DMARC</span>), el cifrado de transporte en el puerto de submission y la solución de firma digital para usuarios finales.
        </p>
      </div>

      {/* DNS Records Configuration Panel */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Configuración de Registros DNS de Autenticación de Dominio</span>
        </h3>

        {/* SPF */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                TXT: empresa.com
              </span>
              1. SPF (Sender Policy Framework) - Servidores de Envío Autorizados
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Define la lista de direcciones IP y hosts autorizados para originar correos en nombre del dominio.
          </p>
          <select
            value={state.spfPolicy}
            onChange={(e) => handleChange('spfPolicy', e.target.value)}
            className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="unselected">-- Seleccionar Sintaxis de Registro SPF --</option>
            <option value="spf_soft_fail_tilde_all">
              v=spf1 ip4:198.51.100.25 include:_spf.google.com ~all (Soft Fail: Aceptar y marcar en spam)
            </option>
            <option value="spf_plus_all_insecure">
              v=spf1 +all (Permite a cualquier servidor de Internet enviar correos a tu nombre)
            </option>
            <option value="spf_hard_fail_dash_all">
              v=spf1 ip4:198.51.100.25 include:_spf.google.com -all (Hard Fail: Rechazo estricto inmediato de no autorizados)
            </option>
          </select>
        </div>

        {/* DKIM */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                TXT: mail2026._domainkey.empresa.com
              </span>
              2. DKIM (DomainKeys Identified Mail) - Firma Criptográfica de Mensajes
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Firma criptográfica asimétrica que garantiza que el cuerpo y cabeceras del correo no fueron alterados en tránsito.
          </p>
          <select
            value={state.dkimSelector}
            onChange={(e) => handleChange('dkimSelector', e.target.value)}
            className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="unselected">-- Seleccionar Configuración DKIM --</option>
            <option value="dkim_private_key_leak">
              v=DKIM1; k=rsa; private_key=MIIEvgIBADANBgk... (Publicar clave privada en DNS)
            </option>
            <option value="dkim_rsa_sha256_public_key">
              v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA... (Publicar Clave Pública RSA para verificar firmas)
            </option>
            <option value="dkim_md5_deprecated">
              v=DKIM1; k=rsa-md5; p=MIGfMA0GCSq... (Firma con hash MD5)
            </option>
          </select>
        </div>

        {/* DMARC */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                TXT: _dmarc.empresa.com
              </span>
              3. DMARC (Domain-based Message Authentication, Reporting & Conformance)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Indica a los servidores receptores qué hacer con los correos que fallen SPF o DKIM y a dónde enviar los informes de auditoría.
          </p>
          <select
            value={state.dmarcAction}
            onChange={(e) => handleChange('dmarcAction', e.target.value)}
            className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="unselected">-- Seleccionar Política DMARC --</option>
            <option value="dmarc_reject_aggregate_rua">
              v=DMARC1; p=reject; rua=mailto:dmarc-reports@empresa.com; pct=100 (Rechazo total 100% y reporte XML)
            </option>
            <option value="dmarc_none_monitoring_only">
              v=DMARC1; p=none (Solo monitoreo: permite el paso de correos falsificados sin bloquear)
            </option>
            <option value="dmarc_quarantine">
              v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@empresa.com (Mover a cuarentena/spam)
            </option>
          </select>
        </div>
      </div>

      {/* Transport & End-User Mail Security */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Cifrado de Transporte y Criptografía Extremo a Extremo (E2E)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Puerto y Protocolo Seguro de Envío de Correo (Mail Submission):
            </label>
            <select
              value={state.mailTransportEncryption}
              onChange={(e) => handleChange('mailTransportEncryption', e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="unselected">-- Seleccionar Puerto y Cifrado --</option>
              <option value="starttls_port_587">
                Puerto 587 con STARTTLS y autenticación obligatoria de cliente
              </option>
              <option value="pop3_port_110">
                Puerto 110 POP3 en texto plano (Protocolo de recepción, no de envío)
              </option>
              <option value="plain_smtp_port_25">
                Puerto 25 SMTP tradicional sin cifrado (Vulnerable a sniffing en texto claro)
              </option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Estándar de Cifrado y Firma Digital E2E de Usuario en Clientes (Outlook):
            </label>
            <select
              value={state.endUserMailCrypto}
              onChange={(e) => handleChange('endUserMailCrypto', e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="unselected">-- Seleccionar Estándar de Cifrado E2E --</option>
              <option value="tls_only">
                Confiar únicamente en TLS de servidor a servidor (No proporciona no-repudio ni cifrado E2E)
              </option>
              <option value="smime_x509_certificates">
                S/MIME con certificados digitales X.509 de usuario emitidos por la CA corporativa
              </option>
              <option value="plain_base64">
                Codificación Base64 en el cuerpo del correo (Ofuscación sin seguridad criptográfica)
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
