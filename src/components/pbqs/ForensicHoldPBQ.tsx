import React from 'react';
import {
  Scale,
  FileCheck2,
  HardDrive,
  Hash,
  ShieldCheck,
  Vault,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { ForensicHoldState } from '../../types/pbq';

interface ForensicHoldPBQProps {
  state: ForensicHoldState;
  onChange: (newState: ForensicHoldState) => void;
  onReset: () => void;
}

const PHASE_OPTIONS = [
  { value: 'unselected', label: '-- Seleccionar Acción Forense Obligatoria --' },
  { value: 'legal_hold_notice', label: 'Notificación de Legal Hold (Retención Legal para suspender purga)' },
  { value: 'chain_of_custody_log', label: 'Apertura de Cadena de Custodia (Identificación, sellos y registro)' },
  { value: 'write_blocker_bitstream_image', label: 'Adquisición Bit-a-Bit con Bloqueador de Escritura de Hardware' },
  { value: 'cryptographic_hash_sha256', label: 'Cálculo y Verificación de Hash Criptográfico SHA-256' },
  { value: 'isolated_forensic_analysis', label: 'Análisis Forense en Copia de Trabajo (Red Aislada/Sandbox)' },
  { value: 'secure_vault_storage', label: 'Custodia de Evidencia Primaria en Caja Fuerte Ignífuga con Doble Custodio' },
  // Distractor options
  { value: 'reboot_safe_mode', label: 'Reiniciar equipo en Modo Seguro para limpiar temporales (Distractor Inseguro)' },
  { value: 'copy_paste_explorer', label: 'Copiar y pegar carpetas sensibles a una memoria USB (Distractor No Válido)' }
];

export const ForensicHoldPBQ: React.FC<ForensicHoldPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const handlePhaseChange = (phaseKey: keyof ForensicHoldState, val: string) => {
    onChange({
      ...state,
      [phaseKey]: val,
    });
  };

  return (
    <div className="space-y-6">
      {/* Scenario Context Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
            <Scale className="w-4 h-4" />
            <span>Escenario Forense Judicial CompTIA SY0-701: E-Discovery y Admisibilidad</span>
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
          El departamento legal de la empresa ha recibido una orden judicial de retención de pruebas (<span className="text-amber-300 font-semibold">Legal Hold</span>) tras detectarse una fuga de propiedad intelectual hacia un competidor. Como perito forense en ciberseguridad, debes establecer la secuencia rigurosa de las <span className="text-cyan-300 font-semibold">6 fases procesales</span> para garantizar que la evidencia sea admitida en el tribunal bajo la <span className="text-emerald-300 font-semibold">Best Evidence Rule</span>.
        </p>
      </div>

      {/* Sequential Phase Ordering Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-cyan-400" />
          <span>Fases Cronológicas de Preservación y Cadena de Custodia</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phase 1 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[10px]">1</span>
                Paso Inicial Legal
              </span>
              <span className="text-[10px] font-mono text-slate-500">Obligatorio pre-adquisición</span>
            </div>
            <label className="block text-xs text-slate-300">Medida de Inicio:</label>
            <select
              value={state.phase1}
              onChange={(e) => handlePhaseChange('phase1', e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              {PHASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Phase 2 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[10px]">2</span>
                Documentación de Custodia
              </span>
              <span className="text-[10px] font-mono text-slate-500">Trazabilidad ininterrumpida</span>
            </div>
            <label className="block text-xs text-slate-300">Registro Formal:</label>
            <select
              value={state.phase2}
              onChange={(e) => handlePhaseChange('phase2', e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              {PHASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Phase 3 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[10px]">3</span>
                Duplicación de Evidencia
              </span>
              <span className="text-[10px] font-mono text-slate-500">Hardware Write Blocker</span>
            </div>
            <label className="block text-xs text-slate-300">Técnica de Clonación:</label>
            <select
              value={state.phase3}
              onChange={(e) => handlePhaseChange('phase3', e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              {PHASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Phase 4 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[10px]">4</span>
                Garantía de Integridad
              </span>
              <span className="text-[10px] font-mono text-slate-500">No Repudio Matemático</span>
            </div>
            <label className="block text-xs text-slate-300">Validación de Firma/Resumen:</label>
            <select
              value={state.phase4}
              onChange={(e) => handlePhaseChange('phase4', e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              {PHASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Phase 5 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[10px]">5</span>
                Investigación Pericial
              </span>
              <span className="text-[10px] font-mono text-slate-500">Copia Forense de Trabajo</span>
            </div>
            <label className="block text-xs text-slate-300">Procedimiento de Análisis:</label>
            <select
              value={state.phase5}
              onChange={(e) => handlePhaseChange('phase5', e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              {PHASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Phase 6 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[10px]">6</span>
                Preservación Física Definitiva
              </span>
              <span className="text-[10px] font-mono text-slate-500">Control de Acceso Físico</span>
            </div>
            <label className="block text-xs text-slate-300">Almacenamiento de Máster:</label>
            <select
              value={state.phase6}
              onChange={(e) => handlePhaseChange('phase6', e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              {PHASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Forensic Legal Principles */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Principios Probatorios Fundamentales (CompTIA Legal Questions)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              ¿Qué principio del Orden de Volatilidad (RFC 3227) debe aplicarse en la estación encendida?
            </label>
            <select
              value={state.volatilityConcept}
              onChange={(e) => handlePhaseChange('volatilityConcept', e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="unselected">-- Seleccionar Orden de Volatilidad --</option>
              <option value="ram_before_disk">
                Volcar la Memoria RAM volátil (DumpIt/WinPmem) ANTES de apagar o extraer el Disco Duro
              </option>
              <option value="disk_before_ram">
                Desenchufar el cable de corriente y clonar primero el Disco Duro para evitar escritura
              </option>
              <option value="backup_cloud_first">
                Iniciar copia de seguridad en la nube de todas las carpetas antes de la intervención
              </option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">
              ¿Qué estándar de admisibilidad exige presentar el original o una copia forense bit-stream exacta en juicio?
            </label>
            <select
              value={state.admissibilityStandard}
              onChange={(e) => handlePhaseChange('admissibilityStandard', e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="unselected">-- Seleccionar Estándar Judicial --</option>
              <option value="best_evidence_rule">
                Best Evidence Rule (Regla de la Mejor Evidencia: duplicado bit-a-bit con hash coincidente)
              </option>
              <option value="parol_evidence_rule">
                Parol Evidence Rule (Testimonio verbal del administrador sobre lo que vio en pantalla)
              </option>
              <option value="exclusionary_rule">
                Exclusionary Rule (Descarte automático de toda evidencia digital no firmada por un notario)
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
