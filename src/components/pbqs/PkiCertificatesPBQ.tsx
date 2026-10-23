import React from 'react';
import { PkiCertConfigState } from '../../types/pbq';
import { useHints } from '../../context/HintsContext';
import {
  FileKey,
  ShieldCheck,
  ShieldAlert,
  Globe,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Key,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: PkiCertConfigState;
  onChange: (newState: PkiCertConfigState) => void;
  onReset: () => void;
}

export const PkiCertificatesPBQ: React.FC<Props> = ({ state, onChange, onReset }) => {
  const hints = useHints();
  const handleFieldChange = (field: keyof PkiCertConfigState, value: any) => {
    sound.playClick();
    onChange({
      ...state,
      [field]: value,
    });
  };

  // Browser simulation evaluation
  const isPublicCa = state.certificateType.includes('Public CA');
  const isSha256 = state.signatureAlgorithm.includes('SHA-256');
  const isIntermediate = state.intermediateIncluded;
  const isSanConfigured = state.sanDomains.includes('portal.corp.com');
  const isOcspStapled = state.revocationCheckMethod.includes('OCSP Stapling');

  let browserStatusMessage = '';
  let browserAlertLevel: 'error' | 'warn' | 'success' = 'error';

  if (!isPublicCa) {
    browserStatusMessage = 'Error del Navegador: MOZILLA_PKIX_ERROR_SELF_SIGNED_CERT (Certificado Autofirmado no confiable)';
    browserAlertLevel = 'error';
  } else if (!isIntermediate) {
    browserStatusMessage = 'Error del Navegador: SEC_ERROR_UNKNOWN_ISSUER (Falta la CA Intermedia en la cadena de confianza)';
    browserAlertLevel = 'error';
  } else if (!isSha256) {
    browserStatusMessage = 'Advertencia de Criptografía: ERR_CERT_WEAK_SIGNATURE_ALGORITHM (SHA-1 está deprecado y vulnerable a colisiones)';
    browserAlertLevel = 'warn';
  } else if (!isSanConfigured) {
    browserStatusMessage = 'Error del Navegador: SSL_ERROR_BAD_CERT_DOMAIN (El nombre de dominio no coincide con el certificado - Falta SAN)';
    browserAlertLevel = 'error';
  } else {
    browserStatusMessage = 'Conexión Cifrada Segura y Confiable (Validación de Cadena TLS 1.3 Completa)';
    browserAlertLevel = 'success';
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400">
            <FileKey className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Inspector de Certificados Digitales X.509 y Cadena de Confianza PKI
            </h4>
            <p className="text-xs text-slate-400">
              Diagnostica fallos en la cadena de confianza (Root CA ➔ Intermediate CA ➔ Leaf Certificate) y configura extensiones SAN y OCSP.
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer Certificado
        </button>
      </div>

      {/* Live Client Browser Handshake Reaction Simulator */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          browserAlertLevel === 'success'
            ? 'bg-emerald-950/25 border-emerald-700 text-emerald-300'
            : browserAlertLevel === 'warn'
            ? 'bg-amber-950/25 border-amber-700 text-amber-300'
            : 'bg-rose-950/25 border-rose-700 text-rose-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 shrink-0" />
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold opacity-75">
              Simulador de Handshake TLS del Navegador Cliente
            </div>
            <div className="text-xs font-bold font-mono">
              {hints ? browserStatusMessage : 'Valida tu configuración para ver el resultado.'}
            </div>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800">
          https://portal.corp.com
        </span>
      </div>

      {/* Certificate Parameters Form */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 1. Certificate Issuer Authority */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                1. Autoridad Emisora del Certificado (Issuer):
              </label>
              {!hints ? null : isPublicCa ? (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Confiable
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> No Confiable
                </span>
              )}
            </div>
            <select
              value={state.certificateType}
              onChange={(e) => handleFieldChange('certificateType', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
            >
              <option value="Self-Signed (Autofirmado por el servidor)">
                Autofirmado local (generado con openssl req)
              </option>
              <option value="Public CA (CA Raíz de Confianza Pública)">
                Emitido por CA Raíz de Confianza Pública (DigiCert / Let's Encrypt / Sectigo)
              </option>
            </select>
          </div>

          {/* 2. Cryptographic Signature Algorithm */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                2. Algoritmo de Firma Criptográfica del Certificado:
              </label>
              {!hints ? null : isSha256 ? (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Seguro
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Deprecado
                </span>
              )}
            </div>
            <select
              value={state.signatureAlgorithm}
              onChange={(e) => handleFieldChange('signatureAlgorithm', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
            >
              <option value="SHA-256 with RSA 2048/4096">
                SHA-256 with RSA 2048 o 4096
              </option>
              <option value="ECDSA with P-256">
                ECDSA con curva P-256
              </option>
              <option value="SHA-1 with RSA 1024">
                SHA-1 with RSA 1024
              </option>
              <option value="MD5 with RSA 512">
                MD5 with RSA 2048
              </option>
            </select>
          </div>

          {/* 3. Intermediate Certificate Bundle */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">
                3. Incluir Bundle de CA Intermedia (Intermediate CA)
              </div>
              <div className="text-[11px] text-slate-400">
                Empaqueta el certificado intermedio junto al certificado del servidor para que el cliente pueda reconstruir la cadena.
              </div>
            </div>
            <button
              onClick={() =>
                handleFieldChange('intermediateIncluded', !state.intermediateIncluded)
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                state.intermediateIncluded
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {state.intermediateIncluded ? 'INCLUIDO (Cadena Completa)' : 'OMITIDO (Cadena Rota)'}
            </button>
          </div>

          {/* 4. Revocation Method */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                4. Método de Verificación de Estado de Revocación:
              </label>
              {!hints ? null : isOcspStapled ? (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Óptimo
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">Legado</span>
              )}
            </div>
            <select
              value={state.revocationCheckMethod}
              onChange={(e) => handleFieldChange('revocationCheckMethod', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
            >
              <option value="OCSP Stapling (RFC 6066 - Grapado en el handshake)">
                OCSP Stapling RFC 6066 (el servidor adjunta la respuesta OCSP en el handshake)
              </option>
              <option value="CRL (Descarga periódica lenta)">
                CRL - Listas de Revocación de Certificados
              </option>
              <option value="OCSP Directo (Online Certificate Status Protocol)">
                OCSP en línea tradicional (consulta del cliente a la CA)
              </option>
            </select>
          </div>

          {/* 5. Subject Alternative Name (SAN) Extension */}
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                5. Extensión Subject Alternative Name (SAN):
              </label>
              {!hints ? null : isSanConfigured ? (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Válido para portal.corp.com
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> FQDN Faltante
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={state.sanDomains}
                onChange={(e) => handleFieldChange('sanDomains', e.target.value)}
                placeholder="e.g. DNS:portal.corp.com, DNS:www.portal.corp.com"
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
              />
              <button
                onClick={() =>
                  handleFieldChange(
                    'sanDomains',
                    'DNS:portal.corp.com, DNS:www.portal.corp.com'
                  )
                }
                className="px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl border border-slate-700 whitespace-nowrap"
              >
                Insertar FQDN Requerido
              </button>
            </div>
            <span className="text-[11px] text-slate-500">
              {hints && "Los navegadores modernos ignoran el atributo Common Name (CN) y exigen que los FQDNs figuren en la extensión SAN."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
