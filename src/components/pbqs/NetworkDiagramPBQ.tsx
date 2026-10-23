import React, { useState } from 'react';
import {
  NetworkZoneSlot,
  NetworkControlId,
  NetworkControlItem,
} from '../../types/pbq';
import {
  AVAILABLE_NETWORK_CONTROLS_PBQ1,
  INITIAL_NETWORK_SLOTS_PBQ1,
} from '../../data/pbqsData';
import {
  ShieldAlert,
  Shield,
  Eye,
  Layers,
  Network,
  Server,
  Key,
  Globe,
  Database,
  Monitor,
  RotateCcw,
  CheckCircle2,
  Info,
  Cloud,
  Lock,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { useHints } from '../../context/HintsContext';

interface Props {
  slots: NetworkZoneSlot[];
  onSlotsChange: (newSlots: NetworkZoneSlot[]) => void;
  availableControls?: NetworkControlItem[];
  variant?: 'traditional' | 'cloud';
  initialSlots?: NetworkZoneSlot[];
}

export const NetworkDiagramPBQ: React.FC<Props> = ({
  slots,
  onSlotsChange,
  availableControls = AVAILABLE_NETWORK_CONTROLS_PBQ1,
  variant = 'traditional',
  initialSlots = INITIAL_NETWORK_SLOTS_PBQ1,
}) => {
  const hints = useHints();
  const [selectedControl, setSelectedControl] = useState<NetworkControlId | null>(null);

  const getIcon = (type: string, className = 'w-5 h-5') => {
    switch (type) {
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'Eye':
        return <Eye className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Network':
        return <Network className={className} />;
      case 'Server':
        return <Server className={className} />;
      case 'Key':
        return <Key className={className} />;
      case 'Cloud':
        return <Cloud className={className} />;
      default:
        return <Shield className={className} />;
    }
  };

  const handlePlaceInSlot = (slotId: string, controlId: NetworkControlId) => {
    sound.playClick();
    const updated = slots.map((s) => {
      if (s.slotId === slotId) {
        return { ...s, currentPlacedId: controlId };
      }
      if (s.currentPlacedId === controlId) {
        return { ...s, currentPlacedId: null };
      }
      return s;
    });
    onSlotsChange(updated);
    setSelectedControl(null);
  };

  const handleRemoveFromSlot = (slotId: string) => {
    sound.playToggle();
    const updated = slots.map((s) =>
      s.slotId === slotId ? { ...s, currentPlacedId: null } : s
    );
    onSlotsChange(updated);
  };

  const handleReset = () => {
    sound.playToggle();
    onSlotsChange(initialSlots);
    setSelectedControl(null);
  };

  const placedControlIds = new Set(
    slots.map((s) => s.currentPlacedId).filter(Boolean) as NetworkControlId[]
  );

  return (
    <div className="space-y-6">
      {/* Top action helper */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-300">
            Haz clic en un <strong>Control de Seguridad</strong> de la bandeja y colócalo en su <strong>Ranura (Slot)</strong> en el diagrama {variant === 'cloud' ? 'híbrido cloud' : 'perimetral'}.
          </span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar Ubicaciones
        </button>
      </div>

      {/* Network Topology Visualizer Canvas */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {variant === 'traditional' ? (
          /* TRADITIONAL TOPOLOGY (PBQ 1) */
          <div className="relative z-10 flex flex-col gap-6">
            {/* Zone 1: Internet & Edge */}
            <div className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/40 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-2 text-cyan-400">
                  <Globe className="w-4 h-4" /> Zona Externa (Internet Pública & Gateway)
                </span>
                <span className="text-slate-500">Untrusted Edge</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 text-xs">
                  <Globe className="w-7 h-7 text-sky-400 p-1.5 rounded-md bg-sky-950/50 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-200">Tráfico Público Entrante</div>
                    <div className="text-slate-400 text-[11px]">Peticiones web públicas y potenciales ataques</div>
                  </div>
                </div>
                {renderSlotCard(slots.find((s) => s.slotId === 'slot-edge'))}
              </div>
            </div>

            <div className="flex justify-center -my-3">
              <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-500/40 to-cyan-500/10" />
            </div>

            {/* Zone 2: DMZ */}
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider text-amber-300">
                <span className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-amber-400" /> DMZ (Demilitarized Zone - Zona Semi-Confiable)
                </span>
                <span className="text-slate-500 text-[11px]">Servicios Expuestos</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                {renderSlotCard(slots.find((s) => s.slotId === 'slot-dmz-front'))}
                <div className="flex flex-col justify-center p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold mb-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span>Servidores Web DMZ</span>
                  </div>
                  <div className="space-y-1.5 text-slate-400 text-[11px]">
                    <div className="flex items-center justify-between px-2 py-1 rounded bg-slate-900 border border-slate-800">
                      <span>Web-Node-01</span>
                      <span className="font-mono text-emerald-400 text-[10px]">192.168.2.11:443</span>
                    </div>
                  </div>
                </div>
                {renderSlotCard(slots.find((s) => s.slotId === 'slot-mgmt'))}
              </div>
            </div>

            <div className="flex justify-center -my-3">
              <div className="w-0.5 h-6 bg-gradient-to-b from-amber-500/40 to-emerald-500/40" />
            </div>

            {/* Zone 3: Boundary & LAN */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                <span className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" /> Red Interna Segura (LAN Corporativa - Trusted)
                </span>
                <span className="text-slate-500 text-[11px]">Datos Transaccionales</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                {renderSlotCard(slots.find((s) => s.slotId === 'slot-boundary'))}
                <div className="flex flex-col justify-center p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>Base de Datos SQL</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-1">
                    Almacén PII aislado de accesos directos desde Internet.
                  </p>
                  <div className="px-2 py-1 rounded bg-slate-900 text-slate-300 font-mono text-[10px] border border-slate-800">
                    SQL-CLUSTER (10.0.4.50)
                  </div>
                </div>
                {renderSlotCard(slots.find((s) => s.slotId === 'slot-lan-auth'))}
              </div>
            </div>
          </div>
        ) : (
          /* CLOUD HYBRID & ZERO TRUST TOPOLOGY (PBQ 8) */
          <div className="relative z-10 flex flex-col gap-6">
            {/* Zone A: AWS / Azure Public Cloud VPC */}
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                <span className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-cyan-400" /> Nube Pública (AWS / Azure VPC - Cloud Microservices)
                </span>
                <span className="text-slate-500 text-[11px]">Subred Elástica de Producción</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                {renderSlotCard(slots.find((s) => s.slotId === 'slot-cloud-edge'))}
                <div className="flex flex-col justify-center p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
                    <Server className="w-4 h-4 text-sky-400" />
                    <span>Microservicios Kubernetes / ECS</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-1">
                    Contenedores de backend escalables en subred privada.
                  </p>
                  <div className="px-2 py-1 rounded bg-slate-900 text-cyan-300 font-mono text-[10px] border border-slate-800">
                    VPC: 172.16.0.0/16
                  </div>
                </div>
                {renderSlotCard(slots.find((s) => s.slotId === 'slot-cloud-ztna'))}
              </div>
            </div>

            {/* Hybrid Transit Gateway Hub */}
            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2 text-xs font-semibold uppercase tracking-wider text-purple-300">
                <span className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-purple-400" /> Enlace Híbrido Cifrado (Interconexión Cloud ⟷ On-Prem)
                </span>
                <span className="text-slate-500 text-[11px]">Túnel VPN IPSec / Direct Connect</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                  <div className="font-semibold text-white mb-1">Hub de Tráfico Centralizado</div>
                  <p className="text-[11px] text-slate-400">
                    Interconecta múltiples VPCs de producción con los routers del centro de datos corporativo.
                  </p>
                </div>
                {renderSlotCard(slots.find((s) => s.slotId === 'slot-cloud-transit'))}
              </div>
            </div>

            {/* Zone B: On-Premises Data Center */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                <span className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" /> Centro de Datos Privado On-Premises (Legacy Core)
                </span>
                <span className="text-slate-500 text-[11px]">Trusted Data Center</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                {renderSlotCard(slots.find((s) => s.slotId === 'slot-onprem-edge'))}
                <div className="flex flex-col justify-center p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Base de Datos Central Bancaria</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-1">
                    Core bancario transaccional on-premises de máxima seguridad.
                  </p>
                  <div className="px-2 py-1 rounded bg-slate-900 text-emerald-400 font-mono text-[10px] border border-slate-800">
                    Core-DB (10.0.1.10)
                  </div>
                </div>
                {renderSlotCard(slots.find((s) => s.slotId === 'slot-onprem-idp'))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Available Controls Palette / Drawer */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Bandeja de Controles de Seguridad Disponibles
            </h4>
            <p className="text-xs text-slate-400">
              Haz clic en un control para seleccionarlo y luego en la ranura vacía correspondiente en el diagrama.
            </p>
          </div>
          {selectedControl && (
            <div className="text-xs text-cyan-400 font-medium px-2.5 py-1 rounded-md bg-cyan-950/70 border border-cyan-800">
              Seleccionado: {availableControls.find((c) => c.id === selectedControl)?.name}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
          {availableControls.map((control) => {
            const isPlaced = placedControlIds.has(control.id);
            const isSelected = selectedControl === control.id;

            return (
              <button
                key={control.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedControl(isSelected ? null : control.id);
                }}
                className={`relative flex flex-col text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-md shadow-cyan-950'
                    : isPlaced
                    ? 'border-slate-800/80 bg-slate-950/50 opacity-70 hover:opacity-100 hover:border-slate-700'
                    : 'border-slate-800 bg-slate-950/90 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                      {getIcon(control.iconType)}
                    </span>
                    <span className="text-xs font-bold text-slate-200 tracking-wide font-mono">
                      {control.acronym}
                    </span>
                  </div>
                  {isPlaced && (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Asignado
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-200 mb-1">
                  {control.name}
                </div>
                {hints && <div className="text-[11px] text-slate-400 line-clamp-2">{control.description}</div>}
                {hints && <div className="mt-2 text-[10px] text-slate-500 font-mono">{control.layer}</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  function renderSlotCard(slot?: NetworkZoneSlot) {
    if (!slot) return null;

    const placedControl = availableControls.find(
      (c) => c.id === slot.currentPlacedId
    );

    return (
      <div
        key={slot.slotId}
        onClick={() => {
          if (selectedControl) {
            handlePlaceInSlot(slot.slotId, selectedControl);
          }
        }}
        className={`relative flex flex-col justify-between p-3.5 rounded-xl border-2 transition-all cursor-pointer min-h-[110px] ${
          selectedControl
            ? 'border-dashed border-cyan-400/80 bg-cyan-950/20 hover:bg-cyan-950/40 hover:border-cyan-400'
            : placedControl
            ? 'border-slate-700 bg-slate-900/90'
            : 'border-dashed border-slate-800 bg-slate-950/60 hover:border-slate-700'
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-semibold text-slate-300">
              {slot.title}
            </span>
            {placedControl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromSlot(slot.slotId);
                }}
                className="text-[10px] text-red-400 hover:text-red-300 underline font-mono"
              >
                Quitar
              </button>
            )}
          </div>
          {hints && (<div className="text-[10px] text-slate-500 leading-tight mb-2">
            {slot.allowedRoleHint}
          </div>)}
        </div>

        {placedControl ? (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300">
            {getIcon(placedControl.iconType, 'w-4 h-4 text-cyan-400 shrink-0')}
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">
                {placedControl.name}
              </div>
              {hints && <div className="text-[10px] text-slate-400 font-mono">{placedControl.layer}</div>}
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-slate-500 font-medium">
            {selectedControl ? (
              <span className="text-cyan-400 animate-pulse">
                Click aquí para colocar control
              </span>
            ) : (
              <span>[ Ranura Disponible ]</span>
            )}
          </div>
        )}
      </div>
    );
  }
};
