import React from 'react';
import { ContainerHardeningState } from '../../types/pbq';
import {
  Boxes,
  RotateCcw,
  CheckCircle2,
  Lock,
  Layers,
  Cpu,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: ContainerHardeningState;
  onChange: (state: ContainerHardeningState) => void;
  onReset: () => void;
}

export const ContainerSecurityPBQ: React.FC<Props> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (field: keyof ContainerHardeningState, value: string) => {
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
            <Boxes className="w-4 h-4 text-cyan-400" />
            Consola de Endurecimiento de Contenedores y Kubernetes Pod Security
          </div>
          <p className="text-xs text-slate-400">
            Aplica los estándares de seguridad CIS Docker / K8s Benchmark para mitigar escapes de contenedor (Container Breakout) y elevación de privilegios.
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

      {/* Grid of Security Directives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Base Image Selection */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              1. Selección de Imagen Base (Container Image)
            </label>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">CIS 4.1</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Las imágenes con gestores de paquetes completos (apt/yum) o shells bash aumentan la superficie de ataque para los atacantes.
          </p>
          <select
            value={state.baseImage}
            onChange={(e) => handleChange('baseImage', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ubuntu_full">ubuntu:latest (Imagen completa con curl, bash, python y apt)</option>
            <option value="node_slim">node:18-slim (Imagen estándar con librerías de sistema)</option>
            <option value="distroless_minimal">gcr.io/distroless/static:nonroot (Minimalista, sin shell ni package manager)</option>
          </select>
        </div>

        {/* 2. Run As User */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              2. Usuario de Ejecución (SecurityContext / RunAsUser)
            </label>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">CIS 4.2</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ejecutar contenedores como root (UID 0) permite al atacante comprometer el host subyacente si ocurre un escape de contenedor.
          </p>
          <select
            value={state.runAsUser}
            onChange={(e) => handleChange('runAsUser', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="root_uid_0">root (UID 0 - Privilegios completos de superusuario)</option>
            <option value="non_root_uid_10001">nonroot (UID 10001 - Usuario sin privilegios en el host)</option>
          </select>
        </div>

        {/* 3. Secrets Management */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              3. Gestión de Secretos y API Keys (Secrets Management)
            </label>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">CIS 5.4</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Incrustar tokens y credenciales en texto claro en Dockerfiles o variables de entorno ordinarias provoca fugas en registros de contenedor.
          </p>
          <select
            value={state.secretsManagement}
            onChange={(e) => handleChange('secretsManagement', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="env_vars_plain">ENV DB_PASS=Secret123 en Dockerfile (Texto claro en imagen)</option>
            <option value="configmap_unencrypted">ConfigMap plano sin cifrado en etcd</option>
            <option value="vault_csi_kms">HashiCorp Vault / AWS Secrets Manager inyectado en memoria vía CSI Driver</option>
          </select>
        </div>

        {/* 4. Network Policy */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              4. Política de Red Kubernetes (NetworkPolicy)
            </label>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">CIS 5.3</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Por defecto, Kubernetes permite comunicación plana entre todos los Pods (Flat Network), facilitando el movimiento lateral este-oeste.
          </p>
          <select
            value={state.networkPolicy}
            onChange={(e) => handleChange('networkPolicy', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="allow_all_flat">Default Allow-All (Comunicación irrestricta entre todos los namespaces)</option>
            <option value="default_deny_ingress_egress">Default-Deny Ingress & Egress con lista blanca explícita por etiquetas (Zero Trust)</option>
          </select>
        </div>

        {/* 5. Root Filesystem Immutability */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              5. Inmutabilidad del Sistema de Archivos Raíz
            </label>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">CIS 5.2</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Permitir escritura en el contenedor permite a un atacante descargar herramientas de explotación o modificar binarios del sistema.
          </p>
          <select
            value={state.rootFilesystem}
            onChange={(e) => handleChange('rootFilesystem', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="read_write">readOnlyRootFilesystem: false (Lectura y Escritura permitidas)</option>
            <option value="readonly_true">readOnlyRootFilesystem: true (Solo Lectura, con volúmenes temporales emptyDir en memoria)</option>
          </select>
        </div>

        {/* 6. CPU & Memory Limits */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              6. Cuotas y Límites de Recursos (DoS Prevention)
            </label>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">CIS 5.1</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Contenedores sin límites de recursos pueden provocar denegación de servicio a otros pods mediante ataques de agotamiento o malware de minería.
          </p>
          <select
            value={state.cpuMemoryLimits}
            onChange={(e) => handleChange('cpuMemoryLimits', e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="no_limits">Sin límites de CPU/RAM configurados (Consumo ilimitado)</option>
            <option value="enforce_limits">Configurar limits & requests explícitos (500m CPU, 512Mi RAM) para evitar Noisy Neighbors</option>
          </select>
        </div>
      </div>
    </div>
  );
};
