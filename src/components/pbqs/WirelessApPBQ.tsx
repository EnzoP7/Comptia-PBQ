import React from 'react';
import {
  Wifi,
  ShieldCheck,
  Server,
  Lock,
  Radio,
  RotateCcw,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { WirelessApConfigState } from '../../types/pbq';

interface WirelessApPBQProps {
  state: WirelessApConfigState;
  onChange: (newState: WirelessApConfigState) => void;
  onReset: () => void;
}

export const WirelessApPBQ: React.FC<WirelessApPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof WirelessApConfigState, val: any) => {
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
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
            <Wifi className="w-4 h-4" />
            <span>Configuración de Punto de Acceso Inalámbrico (WPA3-Enterprise / RADIUS) - PBQ 7</span>
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
          Configura el punto de acceso inalámbrico corporativo para dar soporte a la red de gestión segura. Exige autenticación <span className="text-cyan-300 font-semibold">WPA3-Enterprise (802.1X)</span> con el servidor RADIUS en <span className="text-amber-300 font-mono">10.0.10.25:1812</span>, cifrado <span className="text-emerald-300 font-semibold">AES-GCMP-256</span>, Aislamiento de Clientes, deshabilitación de WPS y requerimiento de tramas de administración protegidas (<span className="text-indigo-300 font-semibold">PMF</span>).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Security Mode */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="block text-xs font-bold text-white">Modo de Seguridad:</label>
          <select
            value={state.securityMode}
            onChange={(e) => handleChange('securityMode', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="WPA2-PSK (Pre-Shared Key)">WPA2-PSK (Pre-Shared Key - Débil / Compartido)</option>
            <option value="Open (Sin Seguridad)">Open (Sin Seguridad / Abierta)</option>
            <option value="WPA3-Enterprise (802.1X RADIUS)">WPA3-Enterprise (802.1X con RADIUS Server)</option>
            <option value="WPA3-Personal (SAE Dragonfly)">WPA3-Personal (SAE Dragonfly para hogar)</option>
          </select>
        </div>

        {/* Cipher Suite */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="block text-xs font-bold text-white">Suite de Cifrado:</label>
          <select
            value={state.cipherSuite}
            onChange={(e) => handleChange('cipherSuite', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="AES-GCMP-256 (Suite-B)">AES-GCMP-256 (Suite-B 192 bits - Máxima Seguridad)</option>
            <option value="TKIP">TKIP</option>
            <option value="AES-CCMP">AES-CCMP (Estándar WPA2)</option>
          </select>
        </div>

        {/* RADIUS Server IP */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="block text-xs font-bold text-white">Dirección IP del Servidor RADIUS:</label>
          <input
            type="text"
            value={state.radiusIp}
            onChange={(e) => handleChange('radiusIp', e.target.value)}
            placeholder="10.0.10.25"
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* RADIUS Port */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="block text-xs font-bold text-white">Puerto RADIUS (Autenticación):</label>
          <input
            type="number"
            value={state.radiusPort}
            onChange={(e) => handleChange('radiusPort', parseInt(e.target.value) || 0)}
            placeholder="1812"
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* RADIUS Secret */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <label className="block text-xs font-bold text-white">Secreto Compartido RADIUS (Secret Key):</label>
          <input
            type="text"
            value={state.radiusSecret}
            onChange={(e) => handleChange('radiusSecret', e.target.value)}
            placeholder="Mínimo 8 caracteres robustos"
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Hardening Toggles */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <span className="block text-xs font-bold text-white">Directivas de Hardening AP:</span>
          
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={state.clientIsolation}
              onChange={(e) => handleChange('clientIsolation', e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-0"
            />
            <span>Aislamiento de Clientes (Client Isolation: impide ataques entre clientes)</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={!state.wpsEnabled}
              onChange={(e) => handleChange('wpsEnabled', !e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-0"
            />
            <span>Deshabilitar WPS (Wi-Fi Protected Setup contra fuerza bruta Reaver)</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={state.pmfRequired}
              onChange={(e) => handleChange('pmfRequired', e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-0"
            />
            <span>Exigir PMF (Protected Management Frames contra desautenticación)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
