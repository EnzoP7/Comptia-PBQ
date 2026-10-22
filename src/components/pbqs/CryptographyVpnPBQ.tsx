import React from 'react';
import { CryptoConfigState } from '../../types/pbq';
import { INITIAL_CRYPTO_STATE } from '../../data/pbqsData';
import {
  Lock,
  Key,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileKey,
  Database,
  Globe,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: CryptoConfigState;
  onChange: (newState: CryptoConfigState) => void;
  onReset: () => void;
}

export const CryptographyVpnPBQ: React.FC<Props> = ({ state, onChange, onReset }) => {
  const handleFieldChange = (field: keyof CryptoConfigState, value: any) => {
    sound.playClick();
    onChange({
      ...state,
      [field]: value,
    });
  };

  const getSecurityTierBadge = (isGood: boolean, isLegacy = false) => {
    if (isGood) {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold flex items-center gap-1 font-mono">
          <CheckCircle2 className="w-3 h-3" /> NIST / SY0-701 Aprobado
        </span>
      );
    }
    if (isLegacy) {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-semibold flex items-center gap-1 font-mono">
          <AlertTriangle className="w-3 h-3" /> Legado / Débil
        </span>
      );
    }
    return (
      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-semibold flex items-center gap-1 font-mono">
        <ShieldAlert className="w-3 h-3" /> Obsoleto / Vulnerable
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
              Configurador Criptográfico de VPN IPSec Sitio a Sitio y Cifrado de Almacenamiento
            </h4>
            <p className="text-xs text-slate-400">
              Selecciona algoritmos modernos que garanticen confidencialidad, autenticación e integridad según NIST y CompTIA SY0-701.
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PHASE 1 (IKE SA) */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>IPSec Fase 1: Intercambio de Claves (IKE SA)</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Túnel de Gestión</span>
          </div>

          <div className="space-y-4">
            {/* IKE Version */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Versión del Protocolo IKE:
                </label>
                {getSecurityTierBadge(state.ikeVersion === 'IKEv2')}
              </div>
              <select
                value={state.ikeVersion}
                onChange={(e) => handleFieldChange('ikeVersion', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
              >
                <option value="IKEv1">IKEv1 (Protocolo legado, susceptible a DoS, más intercambios)</option>
                <option value="IKEv2">IKEv2 (Moderno, soporta EAP, menor sobrecarga, anti-DoS)</option>
              </select>
            </div>

            {/* Diffie-Hellman Group */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Grupo Diffie-Hellman (DH Key Exchange):
                </label>
                {getSecurityTierBadge(
                  state.dhGroup.includes('Group 14') || state.dhGroup.includes('Group 19'),
                  state.dhGroup.includes('Group 5')
                )}
              </div>
              <select
                value={state.dhGroup}
                onChange={(e) => handleFieldChange('dhGroup', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
              >
                <option value="Group 19 (ECDH 256-bit)">Group 19 (Curvas Elípticas ECDH 256-bit - Alta Eficiencia)</option>
                <option value="Group 14 (2048-bit)">Group 14 (MODP 2048-bit - Estándar NIST)</option>
                <option value="Group 2 (1024-bit)">Group 2 (1024-bit - Débil / Obsoleto)</option>
                <option value="Group 5 (1536-bit)">Group 5 (1536-bit - Legado insuficiente)</option>
              </select>
            </div>

            {/* IKE Encryption */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Cifrado Simétrico Fase 1:
                </label>
                {getSecurityTierBadge(state.ikeEncryption.includes('AES-256'))}
              </div>
              <select
                value={state.ikeEncryption}
                onChange={(e) => handleFieldChange('ikeEncryption', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
              >
                <option value="3DES">3DES (Triple DES - Vulnerabilidad Sweet32, bloque de 64-bit)</option>
                <option value="DES">DES (56-bit - Vulnerable a fuerza bruta en minutos)</option>
                <option value="AES-256">AES-256 CBC</option>
                <option value="AES-128">AES-128 CBC</option>
              </select>
            </div>

            {/* IKE Hash */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Algoritmo de Integridad / Hash Fase 1:
                </label>
                {getSecurityTierBadge(
                  state.ikeHash === 'SHA-256' || state.ikeHash === 'SHA-384'
                )}
              </div>
              <select
                value={state.ikeHash}
                onChange={(e) => handleFieldChange('ikeHash', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
              >
                <option value="SHA-384">SHA-384 (Familia SHA-2 - Suite B de alta seguridad)</option>
                <option value="SHA-1">SHA-1 (Ataques de colisión prácticos SHAttered - OBSOLETO)</option>
                <option value="SHA-256">SHA-256 (Familia SHA-2 - Estándar seguro)</option>
                <option value="MD5">MD5 (Colisiones criptográficas demostradas - PROHIBIDO)</option>
              </select>
            </div>
          </div>
        </div>

        {/* PHASE 2 (IPSec SA) */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>IPSec Fase 2: Túnel de Datos (IPSec SA)</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Cifrado de Payload</span>
          </div>

          <div className="space-y-4">
            {/* IPSec Protocol */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Protocolo de Seguridad IPSec:
                </label>
                {getSecurityTierBadge(state.ipsecProtocol.includes('ESP'))}
              </div>
              <select
                value={state.ipsecProtocol}
                onChange={(e) => handleFieldChange('ipsecProtocol', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
              >
                <option value="AH">AH (Authentication Header - Solo integridad, ¡NO CIFRA EL PAYLOAD!)</option>
                <option value="ESP (Encapsulating Security Payload)">
                  ESP (Encapsulating Security Payload - Cifrado + Integridad + Autenticación)
                </option>
              </select>
            </div>

            {/* IPSec Cipher Suite */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Suite de Cifrado de Carga Útil (Payload Cipher):
                </label>
                {getSecurityTierBadge(state.ipsecCipher.includes('AES-GCM-256'))}
              </div>
              <select
                value={state.ipsecCipher}
                onChange={(e) => handleFieldChange('ipsecCipher', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
              >
                <option value="AES-GCM-256">AES-GCM-256 (Cifrado Autenticado AEAD - Alto rendimiento hardware)</option>
                <option value="DES">DES (56 bits)</option>
                <option value="AES-CBC-256">AES-CBC-256 (Requiere HMAC separado)</option>
                <option value="3DES">3DES (Vulnerable a colisiones en 64-bit)</option>
              </select>
            </div>

            {/* PFS Switch */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">
                  Perfect Forward Secrecy (PFS)
                </div>
                <div className="text-[11px] text-slate-400">
                  Genera claves de sesión independientes evitando comprometer sesiones anteriores.
                </div>
              </div>
              <button
                onClick={() => handleFieldChange('ipsecPfs', !state.ipsecPfs)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                  state.ipsecPfs
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {state.ipsecPfs ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: Data-at-Rest & Web Transport Standards */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-semibold text-slate-200">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Estándares de Cifrado en Reposo (At-Rest) y Transporte Web (In-Transit)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Storage Cipher */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Cifrado de Base de Datos en Reposo (Data-at-Rest):
                </label>
                {getSecurityTierBadge(state.storageCipher.includes('AES-256'))}
              </div>
              <select
                value={state.storageCipher}
                onChange={(e) => handleFieldChange('storageCipher', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
              >
                <option value="AES-256 (XTS/CBC)">AES-256 XTS / CBC (Estándar FIPS 140-3 y CompTIA)</option>
                <option value="Blowfish">Blowfish (Bloque pequeño de 64-bit)</option>
                <option value="RC4">RC4 (Cifrador de flujo con sesgos estadísticos)</option>
              </select>
            </div>

            {/* Web TLS */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Protocolo de Transporte Seguro para Portales Web:
                </label>
                {getSecurityTierBadge(state.webTlsVersion === 'TLS 1.3')}
              </div>
              <select
                value={state.webTlsVersion}
                onChange={(e) => handleFieldChange('webTlsVersion', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
              >
                <option value="TLS 1.0">TLS 1.0 / 1.1 (Deprecado por RFC 8996 y PCI-DSS)</option>
                <option value="SSL 3.0">SSL 3.0 (Vulnerable a POODLE - DESACTIVADO)</option>
                <option value="TLS 1.2">TLS 1.2 (Aceptable legado pero con ciphers débiles posibles)</option>
                <option value="TLS 1.3">TLS 1.3 (1-RTT handshake, suites modernas únicamente)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
