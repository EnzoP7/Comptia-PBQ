import React from 'react';
import {
  Cloud,
  Server,
  Layers,
  Database,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Building
} from 'lucide-react';
import { CloudParty, CloudSharedResponsibilityState } from '../../types/pbq';

interface CloudSharedResponsibilityPBQProps {
  state: CloudSharedResponsibilityState;
  onChange: (newState: CloudSharedResponsibilityState) => void;
  onReset: () => void;
}

export const CloudSharedResponsibilityPBQ: React.FC<CloudSharedResponsibilityPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleAssign = (layerId: string, model: 'iaas' | 'paas' | 'saas', party: CloudParty) => {
    const updated = state.layers.map((layer) => {
      if (layer.layerId === layerId) {
        return {
          ...layer,
          [`${model}Party`]: party,
        };
      }
      return layer;
    });
    onChange({ layers: updated });
  };

  const getPartyBadge = (party: CloudParty | '') => {
    if (party === 'customer') {
      return (
        <span className="px-2 py-1 rounded text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60 flex items-center gap-1 justify-center">
          <Building className="w-3 h-3" />
          <span>Cliente</span>
        </span>
      );
    }
    if (party === 'csp') {
      return (
        <span className="px-2 py-1 rounded text-[11px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 flex items-center gap-1 justify-center">
          <Cloud className="w-3 h-3" />
          <span>CSP (Nube)</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700 text-center block">
        Sin asignar
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Context banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400 text-sm font-bold">
            <Cloud className="w-4 h-4" />
            <span>Modelo de Responsabilidad Compartida en la Nube (IaaS, PaaS, SaaS) - CompTIA SY0-701</span>
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
          En el examen CompTIA Security+, la matriz de responsabilidad compartida entre el Cliente corporativo y el Proveedor de Servicios en la Nube (CSP - Cloud Service Provider) es evaluada con alta rigurosidad. Asigna quién tiene la responsabilidad primaria de seguridad (<span className="text-amber-400 font-semibold">Cliente</span> o <span className="text-cyan-400 font-semibold">CSP</span>) en cada una de las 6 capas tecnológicas a través de los tres modelos de servicio: <span className="text-white font-mono">IaaS (Infraestructura)</span>, <span className="text-white font-mono">PaaS (Plataforma)</span> y <span className="text-white font-mono">SaaS (Software)</span>.
        </p>
      </div>

      {/* Shared Responsibility Interactive Matrix Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden shadow-xl">
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Matriz de Asignación de Controles por Capa</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Haz clic en los botones para alternar entre Cliente y CSP
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 min-w-[240px]">Capa de Seguridad Operativa</th>
                <th className="py-3 px-4 min-w-[170px] text-center bg-slate-900/60">
                  <div className="font-bold text-white">IaaS</div>
                  <div className="text-[10px] text-slate-400">(ej. AWS EC2, Azure VM)</div>
                </th>
                <th className="py-3 px-4 min-w-[170px] text-center bg-slate-900/30">
                  <div className="font-bold text-white">PaaS</div>
                  <div className="text-[10px] text-slate-400">(ej. Azure App Service, Elastic Beanstalk)</div>
                </th>
                <th className="py-3 px-4 min-w-[170px] text-center bg-slate-900/60">
                  <div className="font-bold text-white">SaaS</div>
                  <div className="text-[10px] text-slate-400">(ej. M365, Salesforce, Google Workspace)</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {state.layers.map((layer) => (
                <tr key={layer.layerId} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 space-y-1">
                    <div className="font-bold text-white text-xs flex items-center gap-2">
                      {layer.layerId === 'data_and_iam' && <Database className="w-3.5 h-3.5 text-amber-400" />}
                      {layer.layerId === 'physical_datacenter' && <Building className="w-3.5 h-3.5 text-cyan-400" />}
                      {layer.layerId === 'os_patching' && <Server className="w-3.5 h-3.5 text-indigo-400" />}
                      {layer.layerId === 'network_controls' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{layer.layerName}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {layer.description}
                    </p>
                  </td>

                  {/* IaaS selector */}
                  <td className="py-3.5 px-4 text-center bg-slate-900/30 align-middle">
                    <div className="space-y-1.5 flex flex-col items-center">
                      <div className="w-full max-w-[130px]">{getPartyBadge(layer.iaasParty)}</div>
                      <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleAssign(layer.layerId, 'iaas', 'customer')}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                            layer.iaasParty === 'customer'
                              ? 'bg-amber-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Cliente
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAssign(layer.layerId, 'iaas', 'csp')}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                            layer.iaasParty === 'csp'
                              ? 'bg-cyan-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          CSP
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* PaaS selector */}
                  <td className="py-3.5 px-4 text-center align-middle">
                    <div className="space-y-1.5 flex flex-col items-center">
                      <div className="w-full max-w-[130px]">{getPartyBadge(layer.paasParty)}</div>
                      <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleAssign(layer.layerId, 'paas', 'customer')}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                            layer.paasParty === 'customer'
                              ? 'bg-amber-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Cliente
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAssign(layer.layerId, 'paas', 'csp')}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                            layer.paasParty === 'csp'
                              ? 'bg-cyan-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          CSP
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* SaaS selector */}
                  <td className="py-3.5 px-4 text-center bg-slate-900/30 align-middle">
                    <div className="space-y-1.5 flex flex-col items-center">
                      <div className="w-full max-w-[130px]">{getPartyBadge(layer.saasParty)}</div>
                      <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleAssign(layer.layerId, 'saas', 'customer')}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                            layer.saasParty === 'customer'
                              ? 'bg-amber-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Cliente
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAssign(layer.layerId, 'saas', 'csp')}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                            layer.saasParty === 'csp'
                              ? 'bg-cyan-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          CSP
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CyberKraft Exam Tip Box */}
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/40 flex items-start gap-3">
        <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
            Regla Nemotécnica CompTIA SY0-701: Los Datos NUNCA se delegan
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Sin importar si contratas IaaS, PaaS o SaaS, la propiedad de los <strong className="text-white">Datos</strong>, su clasificación, el cifrado de datos sensibles y las directivas de <strong className="text-white">Gestión de Acceso e Identidades (IAM)</strong> permanecen siempre como responsabilidad incondicional del <span className="text-amber-300 font-semibold">Cliente</span>. En contraste, la <strong className="text-white">Seguridad Física de las Instalaciones</strong> es siempre 100% responsabilidad del <span className="text-cyan-300 font-semibold">CSP</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
