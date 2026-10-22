import React from 'react';
import { RiskManagementState } from '../../types/pbq';
import {
  Calculator,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface Props {
  state: RiskManagementState;
  onChange: (state: RiskManagementState) => void;
  onReset: () => void;
}

export const RiskManagementPBQ: React.FC<Props> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleInputChange = (field: keyof RiskManagementState, value: any) => {
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
            <Calculator className="w-4 h-4 text-cyan-400" />
            Evaluación Cuantitativa de Riesgos y Estrategias de Tratamiento (CompTIA SY0-701)
          </div>
          <p className="text-xs text-slate-400">
            Calcula la expectativa de pérdida única (SLE) y la expectativa de pérdida anualizada (ALE) para el servidor principal, y asigna la estrategia de tratamiento adecuada para cada escenario de riesgo.
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

      {/* Grid: Formulas & Calculations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Financial Variables and SLE */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            1. Cálculo de SLE (Single Loss Expectancy)
          </h3>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Valor del Activo (Asset Value - AV):</span>
              <strong className="text-white">${state.assetValue.toLocaleString()} USD</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Factor de Exposición (Exposure Factor - EF):</span>
              <strong className="text-amber-400">{state.exposureFactorPercent}% (0.40)</strong>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800 font-sans">
              Fórmula Oficial CompTIA: <code>SLE = AV × EF</code>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Ingresa el SLE calculado (en USD):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
              <input
                type="number"
                placeholder="Ej. 80000"
                value={state.calculatedSleInput || ''}
                onChange={(e) => handleInputChange('calculatedSleInput', parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Right: ARO and ALE */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            2. Cálculo de ALE (Annualized Loss Expectancy)
          </h3>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Frecuencia Anualizada (ARO):</span>
              <strong className="text-cyan-400">{state.aroValue} (1 vez cada 2 años)</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Expectativa de Pérdida por Incidente (SLE):</span>
              <strong className="text-white">${(state.calculatedSleInput || 0).toLocaleString()} USD</strong>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800 font-sans">
              Fórmula Oficial CompTIA: <code>ALE = SLE × ARO</code>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Ingresa el ALE anualizado calculado (en USD):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">$</span>
              <input
                type="number"
                placeholder="Ej. 40000"
                value={state.calculatedAleInput || ''}
                onChange={(e) => handleInputChange('calculatedAleInput', parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Risk Treatment Strategies */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          3. Selección de Estrategias de Tratamiento del Riesgo (Risk Treatment Options)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Threat 1 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white">Amenaza 1: Caída de Energía en Datacenter</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              El ALE es de $40,000 USD. Se puede implementar un generador diésel y UPS redundante por $6,000 USD anuales que reduce el riesgo al mínimo.
            </p>
            <select
              value={state.treatmentThreat1}
              onChange={(e) => handleInputChange('treatmentThreat1', e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="">-- Seleccionar Estrategia --</option>
              <option value="mitigate">Mitigar (Mitigate / Implementar Control de Seguridad)</option>
              <option value="transfer">Transferir (Transfer / Seguro de ciberriesgo)</option>
              <option value="accept">Aceptar (Accept / Tolerancia formal por escrito)</option>
              <option value="avoid">Evitar (Avoid / Cancelar la actividad de riesgo)</option>
            </select>
          </div>

          {/* Threat 2 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white">Amenaza 2: Demandas Millonarias por Brecha de Datos</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Riesgo financiero impredecible por compensaciones a clientes ante una filtración. Se contrata una póliza de seguro contra ciberataques.
            </p>
            <select
              value={state.treatmentThreat2}
              onChange={(e) => handleInputChange('treatmentThreat2', e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="">-- Seleccionar Estrategia --</option>
              <option value="mitigate">Mitigar (Mitigate / Implementar Control)</option>
              <option value="transfer">Transferir (Transfer / Póliza de Ciberseguridad)</option>
              <option value="accept">Aceptar (Accept / Tolerancia formal)</option>
              <option value="avoid">Evitar (Avoid / Cancelar actividad)</option>
            </select>
          </div>

          {/* Threat 3 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white">Amenaza 3: Error Gráfico Menor en Portal Secundario</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              El costo de corregir el error estético es de $25,000 USD, mientras que la pérdida esperada anual es de apenas $50 USD. La dirección firma la tolerancia.
            </p>
            <select
              value={state.treatmentThreat3}
              onChange={(e) => handleInputChange('treatmentThreat3', e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="">-- Seleccionar Estrategia --</option>
              <option value="mitigate">Mitigar (Mitigate / Implementar Control)</option>
              <option value="transfer">Transferir (Transfer / Seguro)</option>
              <option value="accept">Aceptar (Accept / Aceptación formal de riesgo residual)</option>
              <option value="avoid">Evitar (Avoid / Cancelar actividad)</option>
            </select>
          </div>

          {/* Threat 4 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white">Amenaza 4: Servicio Inseguro No Utilizado (FTP Público Antiguo)</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Un servidor FTP legado expone al negocio a intrusiones y ya nadie lo utiliza. La empresa decide apagarlo y desmantelarlo por completo.
            </p>
            <select
              value={state.treatmentThreat4}
              onChange={(e) => handleInputChange('treatmentThreat4', e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="">-- Seleccionar Estrategia --</option>
              <option value="mitigate">Mitigar (Mitigate / Implementar Control)</option>
              <option value="transfer">Transferir (Transfer / Seguro)</option>
              <option value="accept">Aceptar (Accept / Tolerancia formal)</option>
              <option value="avoid">Evitar (Avoid / Descontinuar y apagar el servicio)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
