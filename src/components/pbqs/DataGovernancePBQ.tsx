import React from 'react';
import {
  Database,
  ShieldCheck,
  UserCheck,
  Trash2,
  HardDrive,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Lock,
  Cpu,
  FileText,
  KeyRound,
  FileCheck2
} from 'lucide-react';
import { DataGovernanceState } from '../../types/pbq';

interface DataGovernancePBQProps {
  state: DataGovernanceState;
  onChange: (newState: DataGovernanceState) => void;
  onReset: () => void;
}

export const DataGovernancePBQ: React.FC<DataGovernancePBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof DataGovernanceState, val: string) => {
    onChange({
      ...state,
      [field]: val,
    });
  };

  return (
    <div className="space-y-6">
      {/* Context banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
            <Database className="w-4 h-4" />
            <span>Gobernanza de Datos, Roles de Custodia, Ciclo de Vida y Sanitización NIST SP 800-88</span>
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
          En el dominio 1 de CompTIA Security+ SY0-701, la gobernanza de datos evalúa la separación estricta de <strong className="text-white">Roles de Gestión y Privacidad</strong> (Owner, Steward, Custodian, DPO), la aplicación de criptografía adecuada para cada uno de los <strong className="text-cyan-300">Tres Estados del Dato</strong> (Tránsito, Reposo, Uso), y la selección de la técnica de <strong className="text-amber-300">Sanitización</strong> certificada según el estándar NIST SP 800-88 Rev 1.
        </p>
      </div>

      {/* Grid: 3 Interactive Modules */}
      <div className="space-y-6">
        {/* Module 1: Roles de Gobernanza */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <UserCheck className="w-4 h-4" />
            <span>1. Asignación de Roles de Gobernanza y Privacidad</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Data Owner */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <label className="font-bold text-white block">
                Líder de Negocio con Autoridad Final sobre Acceso y Clasificación:
              </label>
              <p className="text-[11px] text-slate-400">
                Determina el valor económico/operativo de la información y autoriza formalmente quién tiene acceso.
              </p>
              <select
                value={state.ownerRoleAssignment}
                onChange={(e) => handleChange('ownerRoleAssignment', e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Seleccionar Rol Oficial --</option>
                <option value="data_owner">Data Owner (Propietario de la Información - Rol de Negocio)</option>
                <option value="data_custodian">Data Custodian (Custodio Técnico / Sysadmin)</option>
                <option value="data_steward">Data Steward (Gestor de Calidad y Políticas)</option>
                <option value="data_processor">Data Processor (Proveedor externo que procesa datos)</option>
              </select>
            </div>

            {/* Data Steward */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <label className="font-bold text-white block">
                Responsable Operativo de Calidad, Etiquetado y Retención:
              </label>
              <p className="text-[11px] text-slate-400">
                Garantiza que los datos se clasifiquen y etiqueten según directivas y cumplan periodos de retención.
              </p>
              <select
                value={state.stewardRoleAssignment}
                onChange={(e) => handleChange('stewardRoleAssignment', e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Seleccionar Rol Oficial --</option>
                <option value="data_steward">Data Steward (Administrador de Calidad y Etiquetado)</option>
                <option value="data_owner">Data Owner (Propietario Ejecutivo)</option>
                <option value="data_custodian">Data Custodian (Operador de Backups)</option>
                <option value="security_auditor">Security Auditor (Auditor externo)</option>
              </select>
            </div>

            {/* Data Custodian */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <label className="font-bold text-white block">
                Administrador Técnico de Infraestructura, Cifrado y Backups:
              </label>
              <p className="text-[11px] text-slate-400">
                Personal de TI o administradores de base de datos encargados de la implementación técnica y copias de seguridad.
              </p>
              <select
                value={state.custodianRoleAssignment}
                onChange={(e) => handleChange('custodianRoleAssignment', e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Seleccionar Rol Oficial --</option>
                <option value="data_custodian">Data Custodian (Custodio de Sistemas y Almacenamiento)</option>
                <option value="data_owner">Data Owner (Líder Comercial)</option>
                <option value="data_controller">Data Controller (Entidad legal responsable)</option>
                <option value="privacy_officer">Privacy Officer (Abogado de Privacidad)</option>
              </select>
            </div>

            {/* Data Privacy Officer */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <label className="font-bold text-white block">
                Oficial de Cumplimiento Normativo y Privacidad (DPO):
              </label>
              <p className="text-[11px] text-slate-400">
                Supervisa el marco regulatorio (GDPR, HIPAA, CCPA) y audita las Evaluaciones de Impacto de Privacidad (DPIA).
              </p>
              <select
                value={state.privacyOfficerAssignment}
                onChange={(e) => handleChange('privacyOfficerAssignment', e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Seleccionar Rol Oficial --</option>
                <option value="data_privacy_officer">Data Protection Officer (DPO / Oficial de Privacidad)</option>
                <option value="data_steward">Data Steward (Gestor de Calidad)</option>
                <option value="it_director">IT Director (Director de Tecnología)</option>
                <option value="compliance_intern">Compliance Intern (Becario de Auditoría)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Module 2: Tres Estados del Dato */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
            <Lock className="w-4 h-4" />
            <span>2. Protección Criptográfica en los Tres Estados del Dato</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* In Transit */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Datos en Tránsito (In Transit):</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tráfico moviéndose a través de redes locales o enlaces WAN públicos.
              </p>
              <select
                value={state.inTransitProtection}
                onChange={(e) => handleChange('inTransitProtection', e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Control de Tránsito --</option>
                <option value="tls_13_ipsec">TLS 1.3 con PFS / Túneles IPsec ESP cifrados</option>
                <option value="telnet_ftp">Telnet y FTP sin cifrar (Texto claro)</option>
                <option value="wep_tkip">Cifrado legado WEP / TKIP</option>
              </select>
            </div>

            {/* At Rest */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-white flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                <span>Datos en Reposo (At Rest):</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Almacenamiento estático en discos duros, SAN, NAS o depósitos S3.
              </p>
              <select
                value={state.atRestProtection}
                onChange={(e) => handleChange('atRestProtection', e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Control de Reposo --</option>
                <option value="aes_256_bitlocker">AES-256 (BitLocker / LUKS / TDE / Cifrado de disco)</option>
                <option value="base64_obfuscation">Codificación Base64 en archivos locales</option>
                <option value="ntfs_permissions_only">Permisos NTFS sin cifrado de hardware</option>
              </select>
            </div>

            {/* In Use */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Datos en Uso (In Use / Memoria):</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Información activa cargada en memoria RAM y registros durante el cómputo.
              </p>
              <select
                value={state.inUseProtection}
                onChange={(e) => handleChange('inUseProtection', e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Control en Uso --</option>
                <option value="confidential_computing_enclaves">Computación Confidencial (Enclaves por hardware SGX/SEV)</option>
                <option value="os_swap_file">Paginación a disco (pagefile.sys sin cifrar)</option>
                <option value="standard_ram_allocation">Asignación estándar de RAM en memoria compartida</option>
              </select>
            </div>
          </div>
        </div>

        {/* Module 3: Sanitización NIST SP 800-88 */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
            <Trash2 className="w-4 h-4" />
            <span>3. Sanitización y Destrucción de Medios (NIST SP 800-88 Rev 1)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Clearing */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <label className="font-bold text-white block">
                Nivel 1: Clearing (Sobreescritura Lógica para Reutilización Interna)
              </label>
              <p className="text-[11px] text-slate-400">
                El disco será reasignado a otro empleado dentro de la misma organización.
              </p>
              <select
                value={state.clearingMethod}
                onChange={(e) => handleChange('clearingMethod', e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Seleccionar Procedimiento --</option>
                <option value="logical_overwrite_zero_fill">Sobreescritura lógica de sectores con ceros o patrones pseudoaleatorios</option>
                <option value="quick_format">Formateo rápido de Windows (Quick Format - Deja datos recuperables)</option>
                <option value="delete_recycle_bin">Mover a la Papelera de reciclaje</option>
              </select>
            </div>

            {/* Purging */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <label className="font-bold text-white block">
                Nivel 2: Purging / Degaussing (Desmagnetización para Discos HDD Magnéticos)
              </label>
              <p className="text-[11px] text-slate-400">
                Los discos HDD abandonarán la organización; no deben ser recuperables en laboratorio.
              </p>
              <select
                value={state.purgingMethod}
                onChange={(e) => handleChange('purgingMethod', e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Seleccionar Procedimiento --</option>
                <option value="degaussing_magnetic">Degaussing (Desmagnetización electromagnética destructiva de platos HDD)</option>
                <option value="single_pass_overwrite">Sobreescritura simple de 1 pasada (Insuficiente contra análisis de laboratorio)</option>
                <option value="partition_delete">Eliminación de tabla de particiones MBR/GPT</option>
              </select>
            </div>

            {/* Destruction */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <label className="font-bold text-white block">
                Nivel 3: Destrucción Física (Fin de Vida de Discos SSD / NVMe y Cintas)
              </label>
              <p className="text-[11px] text-slate-400">
                Dispositivos obsoletos de estado sólido; se requiere Certificado de Destrucción.
              </p>
              <select
                value={state.destructionMethod}
                onChange={(e) => handleChange('destructionMethod', e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Seleccionar Procedimiento --</option>
                <option value="physical_shredding_incineration">Trituración mecánica en fragmentos &lt; 2mm (Shredding) o Incineración</option>
                <option value="degaussing_ssd">Degaussing en discos SSD (Ineficaz: los chips Flash no son magnéticos)</option>
                <option value="throw_to_dumpster">Desecho en contenedor de basura común (Vulnerable a Dumpster Diving)</option>
              </select>
            </div>

            {/* Crypto Shredding */}
            <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <label className="font-bold text-white block">
                Sanitización en la Nube: Cryptographic Erasure (Crypto-shredding)
              </label>
              <p className="text-[11px] text-slate-400">
                Borrado instantáneo de volúmenes en la nube pública sin acceso al hardware físico.
              </p>
              <select
                value={state.cryptoShreddingMethod}
                onChange={(e) => handleChange('cryptoShreddingMethod', e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Seleccionar Procedimiento --</option>
                <option value="cryptographic_erasure_key_destruction">Destrucción irreversible de la clave de descifrado (DEK/KEK) en el KMS</option>
                <option value="unmount_volume">Desmontar el volumen del sistema operativo de la máquina virtual</option>
                <option value="rename_bucket">Renombrar el depósito de almacenamiento en el panel cloud</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
