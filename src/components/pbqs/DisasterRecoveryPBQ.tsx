import React from 'react';
import { DisasterRecoveryState } from '../../types/pbq';
import {
  RotateCcw,
  CheckCircle2,
  Clock,
  HardDrive,
  Building,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: DisasterRecoveryState;
  onChange: (state: DisasterRecoveryState) => void;
  onReset: () => void;
}

export const DisasterRecoveryPBQ: React.FC<Props> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof DisasterRecoveryState, value: string) => {
    sound.playClick();
    onChange({
      ...state,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            Plan de Continuidad de Negocio (BCP) y Recuperación ante Desastres (DRP)
          </div>
          <p className="text-xs text-slate-400">
            Define los objetivos de recuperación métricos (RTO / RPO), sitio alterno de contingencia y estrategia de almacenamiento para cumplir un SLA 99.99%.
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
        {/* 1. Target RTO */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            1. Recovery Time Objective (RTO)
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tiempo máximo tolerable desde el desastre hasta que las operaciones del sistema estén restauradas y en línea.
          </p>
          <select
            value={state.targetRto}
            onChange={(e) => handleChange('targetRto', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="rto_7_days">7 Días (Aceptable para empresas sin servicios web críticos)</option>
            <option value="rto_24_hours">24 Horas</option>
            <option value="rto_under_2_hours">Menos de 2 Horas (Requerido para cumplir SLA transaccional 99.99%)</option>
          </select>
        </div>

        {/* 2. Target RPO */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            2. Recovery Point Objective (RPO)
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cantidad máxima tolerable de pérdida de datos medida en tiempo (antigüedad de la última copia de seguridad transaccional).
          </p>
          <select
            value={state.targetRpo}
            onChange={(e) => handleChange('targetRpo', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="rpo_1_week">1 Semana (Copia semanal básica)</option>
            <option value="rpo_24_hours">24 Horas (Pérdida de un día completo de transacciones)</option>
            <option value="rpo_15_minutes">15 Minutos (Replicación continua / síncrona de base de datos)</option>
          </select>
        </div>

        {/* 3. Site Redundancy */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4 text-cyan-400" />
            3. Tipo de Sitio Alternativo de Recuperación (Disaster Recovery Site)
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instalación secundaria para conmutación por error (Failover) en caso de caída del centro de datos principal.
          </p>
          <select
            value={state.recoverySiteType}
            onChange={(e) => handleChange('recoverySiteType', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="cold_site">Cold Site (Espacio físico sin equipos configurados ni datos cargados)</option>
            <option value="warm_site">Warm Site (Equipos instalados pero requiere restauración manual de respaldos)</option>
            <option value="hot_site_mirrored">Hot Site / Mirrored Active-Active (Equipos duplicados con datos replicados en tiempo real)</option>
          </select>
        </div>

        {/* 4. Backup Rule 3-2-1 */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            4. Metodología de Respaldo de Datos (Backup Architecture)
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Estándar de la industria para asegurar que un ataque de ransomware no pueda destruir todas las copias.
          </p>
          <select
            value={state.backupRule}
            onChange={(e) => handleChange('backupRule', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="single_usb">Copia manual en un único disco duro USB conectado al servidor</option>
            <option value="nas_same_subnet">Respaldo exclusivo a un NAS en la misma subred local</option>
            <option value="rule_3_2_1">Regla 3-2-1: 3 Copias de datos, en 2 medios distintos, con 1 copia fuera de sitio (Off-site)</option>
          </select>
        </div>

        {/* 5. Immutability Control */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 md:col-span-2">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            5. Protección Contra Ransomware e Inmutabilidad de Respaldos
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Garantizar que una vez escritos los respaldos no puedan ser borrados ni sobrescritos por un atacante con credenciales de administrador comprometidas.
          </p>
          <select
            value={state.immutabilityControl}
            onChange={(e) => handleChange('immutabilityControl', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="no_lock">Sin bloqueo de retención (Los respaldos pueden ser borrados en cualquier momento)</option>
            <option value="shared_smb_folder">Carpeta compartida SMB con permisos de escritura abiertos</option>
            <option value="worm_immutable_lock">WORM (Write Once, Read Many) / Almacenamiento Inmutable con Bloqueo de Retención y Air-Gap</option>
          </select>
        </div>
      </div>
    </div>
  );
};
