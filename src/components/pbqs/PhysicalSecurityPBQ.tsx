import React from 'react';
import { PhysicalSecurityState } from '../../types/pbq';
import {
  Building2,
  RotateCcw,
  CheckCircle2,
  Flame,
  Thermometer,
  Shield,
  KeyRound,
  Radio,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: PhysicalSecurityState;
  onChange: (state: PhysicalSecurityState) => void;
  onReset: () => void;
}

export const PhysicalSecurityPBQ: React.FC<Props> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof PhysicalSecurityState, value: string) => {
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
            <Building2 className="w-4 h-4 text-cyan-400" />
            Diseño de Seguridad Física y Protección de Centro de Datos (Tier III / NIST)
          </div>
          <p className="text-xs text-slate-400">
            Diseña los controles de defensa en profundidad física: barrera perimetral, vestíbulo de acceso mantrap, supresión de incendios y apantallamiento electromagnético.
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
        {/* 1. Perimeter Barrier */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400" />
            1. Barrera Perimetral Anti-Intrusión Vehicular
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Se requiere detener intentos de acceso forzado mediante vehículos pesados contra las paredes del datacenter.
          </p>
          <select
            value={state.perimeterBarrier}
            onChange={(e) => handleChange('perimeterBarrier', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="chain_link_fence">Cerca de alambre de púas tradicional (Sin resistencia a impactos)</option>
            <option value="wooden_barrier">Barrera de madera con señal de prohibido el paso</option>
            <option value="bollards_k12_reinforced">Bolardos reforzados de acero con certificación anti-impacto (Crash-rated K12)</option>
          </select>
        </div>

        {/* 2. Datacenter Entrance */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            2. Control de Acceso a Sala de Servidores (Anti-Tailgating)
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Prevenir que personas no autorizadas sigan a un empleado autenticado (Tailgating / Piggybacking).
          </p>
          <select
            value={state.datacenterEntrance}
            onChange={(e) => handleChange('datacenterEntrance', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="single_door_badge">Puerta simple con lector de tarjeta RFID (Sin control de tailgating)</option>
            <option value="manual_key">Cerradura con llave física estándar</option>
            <option value="mantrap_biometric_weight">Mantrap / Esclusa de Seguridad con Biometría + Tarjeta y Sensor de Peso por Presión</option>
          </select>
        </div>

        {/* 3. Fire Suppression */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-400" />
            3. Sistema de Extinción y Supresión de Incendios
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extinguir conatos de incendio sin arruinar componentes electrónicos ni conducir electricidad en la sala de racks.
          </p>
          <select
            value={state.fireSuppression}
            onChange={(e) => handleChange('fireSuppression', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="wet_pipe_water">Rociadores de tubería húmeda con agua presurizada (Wet Pipe Sprinklers)</option>
            <option value="dry_powder">Extintor de polvo químico seco (Corrosivo para circuitos impresos)</option>
            <option value="clean_agent_gas">Sistema de gas limpio no conductor (Clean Agent FM-200 / Novec 1230)</option>
          </select>
        </div>

        {/* 4. Thermal Management */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-amber-400" />
            4. Climatización y Gestión Térmica (HVAC)
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Optimizar la disipación de calor y evitar puntos calientes (Hot Spots) que degraden el hardware.
          </p>
          <select
            value={state.thermalManagement}
            onChange={(e) => handleChange('thermalManagement', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="fans_ambient">Ventiladores de techo y ventanas abiertas</option>
            <option value="mixed_aisles">Disposición aleatoria de racks sin separación de flujo de aire</option>
            <option value="hot_cold_aisle_containment">Confinamiento de Pasillos Fríos y Pasillos Calientes (Hot Aisle / Cold Aisle)</option>
          </select>
        </div>

        {/* 5. RF Shielding */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 md:col-span-2">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-purple-400" />
            5. Protección Contra Emanaciones Electromagnéticas (TEMPEST)
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evitar que señales de radiofrecuencia o espionaje electromagnético salgan de la sala de servidores de alta seguridad.
          </p>
          <select
            value={state.rfShielding}
            onChange={(e) => handleChange('rfShielding', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="none_sheetrock">Paredes estándar de yeso / drywall sin protección</option>
            <option value="soundproof_foam">Espuma acústica insonorizante ordinaria</option>
            <option value="faraday_cage_tempest">Jaula de Faraday con apantallamiento de cobre/malla metálica conectada a tierra (TEMPEST)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
