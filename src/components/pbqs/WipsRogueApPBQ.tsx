import React from 'react';
import { WipsRogueApConfigState } from '../../types/pbq';
import {
  Radio,
  Wifi,
  ShieldAlert,
  ShieldCheck,
  Server,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Zap,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: WipsRogueApConfigState;
  onChange: (newState: WipsRogueApConfigState) => void;
  onReset: () => void;
}

export const WipsRogueApPBQ: React.FC<Props> = ({ state, onChange, onReset }) => {
  const handleFieldChange = (field: keyof WipsRogueApConfigState, value: any) => {
    sound.playClick();
    onChange({
      ...state,
      [field]: value,
    });
  };

  const isEvilTwinClassified = state.threatClassification.includes('Rogue AP / Evil Twin');
  const isPortShutdown = state.switchPortAction.includes('Shutdown');
  const isContainmentActive = state.wirelessContainment;
  const isEapTls = state.clientAuthProtocol.includes('EAP-TLS');
  const isCertValidationEnforced = state.certificateValidationEnforced;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-rose-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-200">
                Consola Central de WIPS (Wireless Intrusion Prevention System)
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold">
                ALERTA ROJA: Invasión RF Detectada
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Dispositivo no autorizado emitiendo el SSID corporativo legítimo. Neutraliza la amenaza en capa física y RF.
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Restablecer Contramedidas
        </button>
      </div>

      {/* Sensor Detection Report Card */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-2 text-cyan-400">
            <Radio className="w-4 h-4" /> Telemetría del Sensor WIPS (Sensor AP-Floor2)
          </span>
          <span className="text-slate-500 font-mono text-[11px]">Canal 6 (2.4 GHz) / RSSI: -42 dBm (Muy cercana)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">SSID Falsificado:</span>
            <span className="font-bold text-rose-400">CORP-STAFF (Clonado)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">BSSID Sospechoso:</span>
            <span className="text-white">00:11:22:33:44:55</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Conexión Física Detectada:</span>
            <span className="text-amber-400">Switch-Core-02 / Puerto Gi1/0/24</span>
          </div>
        </div>
      </div>

      {/* WIPS Containment & Policy Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Threat Classification */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              1. Clasificación Táctica de la Amenaza en el WIPS:
            </label>
            {isEvilTwinClassified ? (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Correcto
              </span>
            ) : (
              <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Inadecuado
              </span>
            )}
          </div>
          <select
            value={state.threatClassification}
            onChange={(e) => handleFieldChange('threatClassification', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
          >
            <option value="Interfering AP (Vecino inofensivo)">AP interferente común de empresa vecina</option>
            <option value="Rogue AP / Evil Twin (Gemelo Malicioso Activo)">
              Rogue AP / Evil Twin (Gemelo Malicioso que suplanta red corporativa)
            </option>
            <option value="Unclassified / Ignore">No clasificado / Ignorar evento</option>
          </select>
        </div>

        {/* 2. Switch Physical Port Action */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              2. Acción en el Puerto del Switch Ethernet (Gi1/0/24):
            </label>
            {isPortShutdown ? (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Puerto Aislado
              </span>
            ) : (
              <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Puerto Activo
              </span>
            )}
          </div>
          <select
            value={state.switchPortAction}
            onChange={(e) => handleFieldChange('switchPortAction', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
          >
            <option value="Shutdown Switch Port (Bloquear y apagar Gi1/0/24 via Port Security)">
              Shutdown Switch Port (Apagar inmediatamente el puerto Gi1/0/24 por Port Security)
            </option>
            <option value="Lower Speed (Bajar velocidad a 10 Mbps)">Reducir velocidad del puerto a 10 Mbps</option>
            <option value="Monitor Only (Dejar puerto activo)">Dejar puerto activo y solo registrar tráfico</option>
          </select>
        </div>

        {/* 3. WIPS Wireless Containment Switch */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between md:col-span-2">
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>3. Contención Inalámbrica en el WIPS (Wireless Containment)</span>
            </div>
            <div className="text-[11px] text-slate-400">
              El sensor WIPS emite tramas de desasociación dirigidas hacia el BSSID del Rogue AP para impedir que clientes corporativos se conecten a él.
            </div>
          </div>
          <button
            onClick={() =>
              handleFieldChange('wirelessContainment', !state.wirelessContainment)
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
              state.wirelessContainment
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}
          >
            {state.wirelessContainment ? 'CONTAINMENT ACTIVADO' : 'DESACTIVADO'}
          </button>
        </div>

        {/* 4. Client Authentication Protocol */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              4. Protocolo de Autenticación de Clientes Corporativos:
            </label>
            {isEapTls ? (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3" /> EAP-TLS Seguro
              </span>
            ) : (
              <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Vulnerable
              </span>
            )}
          </div>
          <select
            value={state.clientAuthProtocol}
            onChange={(e) => handleFieldChange('clientAuthProtocol', e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-cyan-500 font-mono"
          >
            <option value="802.1X EAP-TLS (Certificados Mutuos Cliente y Servidor)">
              802.1X EAP-TLS (Autenticación mutua con certificados digitales en ambos extremos)
            </option>
            <option value="WPA2-PSK (Clave compartida)">WPA2-Personal PSK (Vulnerable a Evil Twin y captura de handshake)</option>
            <option value="PEAP-MSCHAPv2 (Sin validación de CA)">PEAP-MSCHAPv2 sin validación (El cliente entrega hash NTLMv2 al Rogue AP)</option>
          </select>
        </div>

        {/* 5. Client Server Certificate Validation */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white">
              5. Validación Estricta de la CA del Servidor en Suplicantes
            </div>
            <div className="text-[11px] text-slate-400">
              Fuerza a las laptops corporativas a rechazar cualquier AP cuya CA raíz no coincida con la PKI corporativa.
            </div>
          </div>
          <button
            onClick={() =>
              handleFieldChange(
                'certificateValidationEnforced',
                !state.certificateValidationEnforced
              )
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
              state.certificateValidationEnforced
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {state.certificateValidationEnforced ? 'ENFORCED' : 'DISABLED'}
          </button>
        </div>
      </div>
    </div>
  );
};
