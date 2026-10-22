import React from 'react';
import {
  Cloud,
  ShieldAlert,
  Database,
  Lock,
  RotateCcw,
  CheckCircle2,
  Filter,
  KeyRound
} from 'lucide-react';
import { CloudDlpState } from '../../types/pbq';

interface CloudDlpPBQProps {
  state: CloudDlpState;
  onChange: (newState: CloudDlpState) => void;
  onReset: () => void;
}

export const CloudDlpPBQ: React.FC<CloudDlpPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleBucketChange = (
    bucketId: string,
    field: 'assignedTier' | 'dlpPattern',
    val: string
  ) => {
    const updated = state.buckets.map((b) =>
      b.id === bucketId ? { ...b, [field]: val } : b
    );
    onChange({
      ...state,
      buckets: updated,
    });
  };

  const handleGlobalChange = (field: 'casbInspectionMode' | 'cloudKeyManagement', val: string) => {
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
          <div className="flex items-center gap-2 text-sky-400 text-sm font-bold">
            <Cloud className="w-4 h-4" />
            <span>Escenario Cloud Storage DLP & CASB CompTIA SY0-701</span>
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
          La organización ha migrado sus depósitos de objetos a la nube (AWS S3 / Azure Blob). Como arquitecto de seguridad cloud, debes catalogar cada depósito según la clasificación de información de la empresa (<span className="text-cyan-300 font-semibold">Público, Interno, Confidencial, Restringido/PII</span>), aplicar las reglas regex de inspección <span className="text-amber-300 font-semibold">DLP (Data Loss Prevention)</span> correspondientes y configurar el broker <span className="text-emerald-300 font-semibold">CASB</span> y la gestión de claves de cifrado.
        </p>
      </div>

      {/* Cloud Buckets DLP Classification Matrix */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Matriz de Clasificación de Datos y Reglas de Inspección DLP</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.buckets.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-sky-400" />
                    {b.bucketName}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    ID: {b.id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-tight">
                  {b.contentsDescription}
                </p>
              </div>

              {/* Sensitivity Tier */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-300">
                  Nivel de Clasificación de Datos (Data Tier):
                </label>
                <select
                  value={b.assignedTier}
                  onChange={(e) => handleBucketChange(b.id, 'assignedTier', e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="unselected">-- Seleccionar Clasificación --</option>
                  <option value="public">Público (Public: Sin impacto reputacional ni legal si se divulga)</option>
                  <option value="internal">Interno (Internal: Solo para empleados, sin datos regulados)</option>
                  <option value="confidential">Confidencial (Confidential: Propiedad intelectual y datos de negocio)</option>
                  <option value="restricted_pii">Restringido / PII (Restricted: Sujeto a multas regulatorias GDPR/PCI-DSS)</option>
                </select>
              </div>

              {/* DLP Inspection Pattern */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-300">
                  Filtro Regex / Patrón de Inspección DLP:
                </label>
                <select
                  value={b.dlpPattern}
                  onChange={(e) => handleBucketChange(b.id, 'dlpPattern', e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="unselected">-- Seleccionar Patrón DLP --</option>
                  <option value="none">Sin inspección DLP (Archivos públicos de libre descarga)</option>
                  <option value="pci_dss_credit_card">DLP PCI-DSS: Detección de números de tarjeta de crédito (PAN) y CVV</option>
                  <option value="ssn_pii">DLP PII: Detección de Número de Seguro Social (SSN), DNI y fechas de nacimiento</option>
                  <option value="api_secrets">DLP Secretos: Detección de tokens AWS/GitHub, claves privadas RSA y contraseñas</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CASB & Key Management */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-emerald-400" />
          <span>Arquitectura CASB (Cloud Access Security Broker) y Claves Criptográficas</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Modo de Operación CASB para Prevención de Fugas en Tiempo Real:
            </label>
            <select
              value={state.casbInspectionMode}
              onChange={(e) => handleGlobalChange('casbInspectionMode', e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="unselected">-- Seleccionar Modo CASB --</option>
              <option value="casb_reverse_proxy_inline">
                CASB Inline (Reverse Proxy): Inspecciona cargas en tiempo real y bloquea activamente archivos no autorizados
              </option>
              <option value="casb_api_offline">
                CASB Modo API (Asíncrono): Escanea depósitos tras la subida (No previene la fuga inicial de datos)
              </option>
              <option value="no_casb">
                Sin CASB: Confiar únicamente en los permisos manuales asignados por los usuarios
              </option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              Gestión Criptográfica de Claves de Cifrado en Reposo (Cloud KMS):
            </label>
            <select
              value={state.cloudKeyManagement}
              onChange={(e) => handleGlobalChange('cloudKeyManagement', e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="unselected">-- Seleccionar Gestión de Claves --</option>
              <option value="customer_managed_hsm_kms">
                Customer-Managed Keys (CMK / BYOK) alojadas en módulo HSM FIPS 140-2 Nivel 3 (Máximo control del cliente)
              </option>
              <option value="cloud_provider_default_keys">
                Claves por defecto administradas por el proveedor cloud (El proveedor puede descifrar los datos)
              </option>
              <option value="unencrypted_plaintext">
                Deshabilitar cifrado en reposo para optimizar la velocidad de lectura y escritura
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
