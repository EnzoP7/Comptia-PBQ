import React from 'react';
import {
  KeyRound,
  FileCode,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileCheck2,
  Server
} from 'lucide-react';
import { PkiLifecycleState } from '../../types/pbq';

interface PkiLifecyclePBQProps {
  state: PkiLifecycleState;
  onChange: (newState: PkiLifecycleState) => void;
  onReset: () => void;
}

export const PkiLifecyclePBQ: React.FC<PkiLifecyclePBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof PkiLifecycleState, val: string) => {
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
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
            <KeyRound className="w-4 h-4" />
            <span>Escenario PKI X.509, Formatos y Ciclo de Vida de Certificados CompTIA SY0-701</span>
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
          Como administrador de la infraestructura de clave pública (PKI) corporativa, debes resolver requerimientos críticos: optimizar la validación de revocación eliminando la latencia del cliente (<span className="text-cyan-300 font-semibold">OCSP Stapling</span>), seleccionar los formatos de archivo exactos (<span className="text-amber-300 font-mono">.PFX/PKCS#12</span> para exportar con clave privada y <span className="text-amber-300 font-mono">.PEM</span> para servidores Linux), soportar múltiples subdominios con extensiones <span className="text-emerald-300 font-semibold">SAN</span> y configurar la custodia de claves (<span className="text-indigo-300 font-semibold">Key Escrow con control M-de-N</span>).
        </p>
      </div>

      {/* Grid of PKI Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revocation Protocol */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              1. Verificación de Revocación de Certificados
            </span>
            <span className="text-[10px] font-mono text-slate-500">Baja Latencia & Privacidad</span>
          </div>
          <label className="block text-xs text-slate-300">
            ¿Qué método permite al servidor web adjuntar la respuesta sellada por la CA en el handshake TLS?
          </label>
          <select
            value={state.revocationProtocol}
            onChange={(e) => handleChange('revocationProtocol', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="unselected">-- Seleccionar Método de Revocación --</option>
            <option value="ocsp_stapling">
              OCSP Stapling (RFC 6066: el servidor web consulta a la CA, cachea la respuesta y la envía al cliente)
            </option>
            <option value="crl_offline">
              CRL tradicional (Certificate Revocation List: lista estática grande que el cliente debe descargar entera)
            </option>
            <option value="direct_ocsp_client">
              OCSP Directo del Cliente (El navegador del cliente contacta a la CA en cada visita, filtrando su navegación)
            </option>
          </select>
        </div>

        {/* Certificate Bundle Format */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              2. Formato de Paquete con Clave Privada
            </span>
            <span className="text-[10px] font-mono text-slate-500">Migración Windows / IIS</span>
          </div>
          <label className="block text-xs text-slate-300">
            ¿Qué formato de archivo binario empaqueta el certificado Y la clave privada protegida con contraseña?
          </label>
          <select
            value={state.certFormatBundle}
            onChange={(e) => handleChange('certFormatBundle', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="unselected">-- Seleccionar Formato PKI --</option>
            <option value="pfx_pkcs12_password">
              .PFX / .P12 (PKCS#12: formato binario protegido con password que almacena certificado y clave privada)
            </option>
            <option value="p7b_pkcs7_public_only">
              .P7B / PKCS#7 (Formato Base64 que contiene la cadena de certificados pero NUNCA la clave privada)
            </option>
            <option value="der_binary_single">
              .DER (Formato binario X.509 de certificado único sin clave privada)
            </option>
          </select>
        </div>

        {/* ASCII Base64 Format */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-amber-400" />
              3. Formato Estándar ASCII Base64 para Linux/Apache
            </span>
            <span className="text-[10px] font-mono text-slate-500">Cabeceras -----BEGIN-----</span>
          </div>
          <label className="block text-xs text-slate-300">
            ¿Qué extensión y codificación utiliza texto ASCII entre líneas de encabezado y pie?
          </label>
          <select
            value={state.certFormatAscii}
            onChange={(e) => handleChange('certFormatAscii', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="unselected">-- Seleccionar Formato ASCII --</option>
            <option value="pem_base64_ascii">
              .PEM / .CRT (Base64 ASCII codificado delimitado por "-----BEGIN CERTIFICATE-----")
            </option>
            <option value="der_raw_binary">
              .DER (Codificación binaria ASN.1 no legible en texto plano)
            </option>
            <option value="pkcs10_csr">
              .CSR (Certificate Signing Request: solicitud de firma, no un certificado emitido)
            </option>
          </select>
        </div>

        {/* Multi-Domain Extension */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-indigo-400" />
              4. Extensión X.509 para Múltiples Nombres de Host
            </span>
            <span className="text-[10px] font-mono text-slate-500">Soporte FQDN</span>
          </div>
          <label className="block text-xs text-slate-300">
            ¿Qué campo del certificado asegura varios dominios distintos (ej. portal.com, vpn.com, api.com) en un solo cert?
          </label>
          <select
            value={state.subjectAltNameConfig}
            onChange={(e) => handleChange('subjectAltNameConfig', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="unselected">-- Seleccionar Extensión X.509 --</option>
            <option value="san_multi_domain">
              SAN (Subject Alternative Name: lista explícita de múltiples dominios y direcciones IP en el certificado)
            </option>
            <option value="wildcard_cert">
              Wildcard *.dominio.com (Solo cubre subdominios de un mismo nivel en un único dominio base)
            </option>
            <option value="common_name_only">
              CN tradicional (Common Name: limitado a un único FQDN heredado en desuso por navegadores modernos)
            </option>
          </select>
        </div>
      </div>

      {/* Key Recovery / Key Escrow */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            5. Recuperación de Claves Privadas Corporativas (Key Escrow / M-de-N)
          </span>
          <span className="text-[10px] font-mono text-slate-500">Mitigación de Pérdida de Datos</span>
        </div>
        <p className="text-xs text-slate-400">
          Si un empleado que cifra correos corporativos confidenciales fallece o pierde su clave privada, ¿qué control administrativo y técnico permite recuperar los datos cifrados sin otorgar poder ilimitado a un único administrador?
        </p>
        <select
          value={state.privateKeyRecovery}
          onChange={(e) => handleChange('privateKeyRecovery', e.target.value)}
          className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="unselected">-- Seleccionar Mecanismo de Custodia --</option>
          <option value="key_escrow_m_of_n">
            Key Escrow respaldado por un Agente de Recuperación con esquema de secreto dividido M-de-N (se requieren M custodios de un total de N)
          </option>
          <option value="single_admin_password">
            Guardar todas las claves privadas en un bloc de notas protegido con contraseña por el Administrador de Dominio
          </option>
          <option value="never_recover">
            Prohibir cualquier recuperación (Si la clave se pierde, los datos se consideran irrecuperables por diseño)
          </option>
        </select>
      </div>
    </div>
  );
};
