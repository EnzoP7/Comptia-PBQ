import React from 'react';
import { MobileSecurityState } from '../../types/pbq';
import {
  Smartphone,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: MobileSecurityState;
  onChange: (state: MobileSecurityState) => void;
  onReset: () => void;
}

export const MobileSecurityPBQ: React.FC<Props> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof MobileSecurityState, value: string) => {
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
            <Smartphone className="w-4 h-4 text-cyan-400" />
            Consola de Políticas de Seguridad Móvil Empresarial (MDM / MAM / BYOD)
          </div>
          <p className="text-xs text-slate-400">
            Configura las directivas de gestión de movilidad corporativa para proteger datos confidenciales en smartphones y tablets personales (BYOD) y corporativos (COPE).
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
        {/* 1. BYOD Wipe Policy */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-cyan-400" />
            1. Directiva de Borrado Remoto para Dispositivos BYOD
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Un empleado renuncia a la empresa y tiene su teléfono móvil personal configurado con correos y documentos confidenciales.
          </p>
          <select
            value={state.byodWipePolicy}
            onChange={(e) => handleChange('byodWipePolicy', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="">-- Seleccionar Directiva --</option>
            <option value="no_wipe">Revocar la contraseña del correo y mantener el dispositivo inscrito</option>
            <option value="full_device_wipe">Full Device Wipe (restablecimiento de fábrica del dispositivo)</option>
            <option value="selective_wipe">Enterprise Selective Wipe (Borra exclusivamente el contenedor y datos corporativos respetando la privacidad)</option>
          </select>
        </div>

        {/* 2. Containerization MAM */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            2. Contenedorización y Prevención de Fugas (MAM)
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evitar que los usuarios copien información de correos corporativos hacia aplicaciones personales como WhatsApp, redes sociales o portapapeles.
          </p>
          <select
            value={state.applicationContainerization}
            onChange={(e) => handleChange('applicationContainerization', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="">-- Seleccionar Directiva --</option>
            <option value="allow_open_clipboard">Cifrado completo del dispositivo + PIN obligatorio vía MDM</option>
            <option value="screenshot_allowed_unrestricted">VPN por aplicación (per-app VPN) para las apps corporativas</option>
            <option value="mam_container_sandbox">MAM Sandboxing (Contenedor seguro cifrado que bloquea copiar/pegar y compartir hacia apps no corporativas)</option>
          </select>
        </div>

        {/* 3. Jailbreak & Root Policy */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            3. Detección de Dispositivos Roteados o con Jailbreak
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dispositivos móviles donde se han eludido los controles de seguridad del fabricante (Android Root / iOS Jailbreak), desactivando el sandboxing del SO.
          </p>
          <select
            value={state.jailbreakRootPolicy}
            onChange={(e) => handleChange('jailbreakRootPolicy', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="">-- Seleccionar Directiva --</option>
            <option value="block_and_quarantine">Bloqueo Inmediato y Cuarentena (Revocar tokens de acceso corporativo automáticamente)</option>
            <option value="allow_custom_rom">Permitir acceso y forzar un análisis antimalware del dispositivo</option>
            <option value="ignore_warning_only">Notificar al usuario y bloquear solo si no corrige en 7 días</option>
          </select>
        </div>

        {/* 4. Geofencing Policy */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-cyan-400" />
            4. Control por Geocerca (Geofencing en Instalaciones Seguras)
          </label>
          <p className="text-xs text-slate-400 leading-relaxed">
            Directiva ambiental cuando los dispositivos móviles ingresan físicamente al centro de datos confidencial (SCIF / Data Center).
          </p>
          <select
            value={state.geofencingPolicy}
            onChange={(e) => handleChange('geofencingPolicy', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="">-- Seleccionar Directiva --</option>
            <option value="auto_play_audio">Forzar bloqueo de pantalla cada 1 minuto dentro de la zona</option>
            <option value="disable_camera_microphone">Deshabilitar cámara, micrófono y Wi-Fi ad-hoc automáticamente mediante Geofencing</option>
            <option value="max_brightness">Deshabilitar la cámara con un perfil estático permanente (sin geofencing)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
