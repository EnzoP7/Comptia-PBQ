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
import { WirelessSecurityState } from '../../types/pbq';

interface WirelessSecurityPBQProps {
  state: WirelessSecurityState;
  onChange: (newState: WirelessSecurityState) => void;
  onReset: () => void;
}

export const WirelessSecurityPBQ: React.FC<WirelessSecurityPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof WirelessSecurityState, val: string) => {
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
            <span>Escenario de Seguridad Inalámbrica Empresarial CompTIA SY0-701</span>
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
          La sede corporativa ha sufrido un ataque de <span className="text-rose-400 font-semibold">Evil Twin (Gemelo Malvado)</span> y ataques de desautenticación en la red inalámbrica de empleados. El CISO ha ordenado el despliegue inmediato de una arquitectura <span className="text-cyan-300 font-semibold">WPA3-Enterprise con 802.1X</span>, autenticación basada en certificados mutuos sin contraseñas, servidor <span className="text-emerald-300 font-semibold">RADIUS</span> y sensores <span className="text-indigo-300 font-semibold">WIPS</span> para contención automática de puntos de acceso no autorizados.
        </p>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WPA Standard */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              1. Estándar de Cifrado WiFi
            </span>
            <span className="text-[10px] font-mono text-slate-500">Suite Criptográfica</span>
          </div>
          <label className="block text-xs text-slate-300">Modo de Operación:</label>
          <select
            value={state.wpaStandard}
            onChange={(e) => handleChange('wpaStandard', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="unselected">-- Seleccionar Estándar WPA --</option>
            <option value="wpa2_psk_legacy">
              WPA2-PSK con Clave Precompartida (Vulnerable a ataques de captura 4-way handshake)
            </option>
            <option value="wep_open">
              WEP Open con clave RC4 estática
            </option>
            <option value="wpa3_enterprise_192bit">
              WPA3-Enterprise modo 192 bits (Suite-B: CNSA con AES-256 GCM y SHA-384)
            </option>
          </select>
        </div>

        {/* 802.1X EAP Method */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              2. Método EAP (Extensible Authentication Protocol)
            </span>
            <span className="text-[10px] font-mono text-slate-500">802.1X Enterprise</span>
          </div>
          <label className="block text-xs text-slate-300">Tipo de Autenticación EAP:</label>
          <select
            value={state.eapMethod}
            onChange={(e) => handleChange('eapMethod', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="unselected">-- Seleccionar Método EAP --</option>
            <option value="eap_md5_deprecated">
              EAP-MD5 (Solo hash MD5 de un sentido, sin túnel TLS ni autenticación mutua)
            </option>
            <option value="eap_tls_mutual_certificates">
              EAP-TLS (Certificados digitales X.509 mutuos en servidor y cliente - Máxima seguridad)
            </option>
            <option value="peap_mschapv2">
              PEAPv0 / EAP-MSCHAPv2 (Solo certificado en servidor, cliente usa usuario/contraseña)
            </option>
          </select>
        </div>

        {/* RADIUS Ports */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-indigo-400" />
              3. Servidor de Autenticación AAA (RADIUS)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Puertos Oficiales IANA</span>
          </div>
          <label className="block text-xs text-slate-300">Puertos de Autenticación y Accounting:</label>
          <select
            value={state.radiusPorts}
            onChange={(e) => handleChange('radiusPorts', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="unselected">-- Seleccionar Puertos RADIUS --</option>
            <option value="tacacs_tcp_49">
              TCP 49 (Puerto de TACACS+, protocolo propietario distinto de RADIUS)
            </option>
            <option value="radius_legacy_1645_1646">
              UDP 1645 y UDP 1646
            </option>
            <option value="radius_1812_1813">
              UDP 1812 (Autenticación/Autorización) y UDP 1813 (Accounting/Contabilidad)
            </option>
          </select>
        </div>

        {/* SAE Dragonfly */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              4. Mecanismo de Handshake WPA3-Personal
            </span>
            <span className="text-[10px] font-mono text-slate-500">Anti-Diccionario</span>
          </div>
          <label className="block text-xs text-slate-300">Protocolo de Intercambio de Claves:</label>
          <select
            value={state.wpaPersonalHandshake}
            onChange={(e) => handleChange('wpaPersonalHandshake', e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="unselected">-- Seleccionar Handshake --</option>
            <option value="wps_pin_attack">
              WPS PIN (Vulnerable a ataque de fuerza bruta Reaver en pocas horas)
            </option>
            <option value="sae_dragonfly">
              SAE (Simultaneous Authentication of Equals / Dragonfly - Resistente a fuerza bruta offline)
            </option>
            <option value="four_way_handshake_psk">
              4-Way Handshake clásico WPA2 (Vulnerable a ataques de diccionario offline capturando el EAPOL)
            </option>
          </select>
        </div>
      </div>

      {/* WIPS Defense against Rogue AP & Evil Twin */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            5. Detección y Contención de Puntos de Acceso Ilegales (Rogue AP / Evil Twin)
          </span>
          <span className="text-[10px] font-mono text-slate-500">Defensa Activa en Capa Física</span>
        </div>
        <p className="text-xs text-slate-400">
          ¿Qué sistema de contención en tiempo real debe implementarse en la empresa para neutralizar de inmediato cualquier punto de acceso inalámbrico impostor?
        </p>
        <select
          value={state.rogueApDetection}
          onChange={(e) => handleChange('rogueApDetection', e.target.value)}
          className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="unselected">-- Seleccionar Sistema de Prevención Inalámbrico --</option>
          <option value="hide_ssid_only">
            Ocultar el SSID (SSID Cloaking) para que los usuarios no vean la red (No previene escaneo por analizadores)
          </option>
          <option value="mac_filtering_only">
            Filtrado de direcciones MAC en el router (Fácilmente evadible falsificando la MAC con spoofing)
          </option>
          <option value="wips_rf_monitoring_auto_suppress">
            WIPS (Wireless Intrusion Prevention System) con monitoreo continuo de radiofrecuencia y supresión automática por desautenticación
          </option>
        </select>
      </div>
    </div>
  );
};
