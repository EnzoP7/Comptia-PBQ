import React from 'react';
import {
  EyeOff,
  Shield,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { PrivacyPetsState } from '../../types/pbq';
import { shuffled } from '../../utils/shuffle';

interface PrivacyPetsPBQProps {
  state: PrivacyPetsState;
  onChange: (newState: PrivacyPetsState) => void;
  onReset: () => void;
}

export const PrivacyPetsPBQ: React.FC<PrivacyPetsPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const handleChange = (
    scenarioId: string,
    field: 'selectedTechnique' | 'reversibility',
    val: string
  ) => {
    const updated = state.scenarios.map((sc) => {
      if (sc.id === scenarioId) {
        return {
          ...sc,
          [field]: val,
        };
      }
      return sc;
    });
    onChange({ scenarios: updated });
  };

  const techniqueOptions = [
    { value: '', label: '-- Seleccionar Tecnología de Privacidad (PET) --' },
    { value: 'tokenization', label: 'Tokenización' },
    { value: 'dynamic_masking', label: 'Enmascaramiento Dinámico' },
    { value: 'static_masking', label: 'Enmascaramiento Estático' },
    { value: 'anonymization', label: 'Anonimización' },
    { value: 'pseudonymization', label: 'Seudonimización' },
  ];

  const reversibilityOptions = [
    { value: '', label: '-- Nivel de Reversibilidad --' },
    { value: 'reversible_with_vault', label: 'Reversible únicamente mediante consulta autenticada al Token Vault' },
    { value: 'reversible_with_key', label: 'Reversible mediante clave de descifrado / tabla de correspondencia separada' },
    { value: 'on_the_fly_display', label: 'No destructiva en disco; solo oculta visualmente caracteres en la consulta' },
    { value: 'irreversible', label: 'Completamente irreversible; el dato original no puede reconstruirse de ningún modo' },
  ];

  return (
    <div className="space-y-6">
      {/* Context banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-violet-400 text-sm font-bold">
            <EyeOff className="w-4 h-4" />
            <span>Tecnologías de Mejora de Privacidad (PETs) y Ofuscación de Datos - SY0-701</span>
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
          Las directivas de cumplimiento normativo (GDPR, PCI-DSS, HIPAA) exigen aplicar la técnica exacta de preservación de privacidad según el caso de uso corporativo. Para cada uno de los 5 escenarios a continuación, selecciona la <strong className="text-white">Tecnología de Privacidad (PET)</strong> correspondiente y define su grado de <strong className="text-cyan-300">Reversibilidad</strong> según el syllabus oficial de CompTIA Security+.
        </p>
      </div>

      {/* Scenarios Cards */}
      <div className="space-y-4">
        {state.scenarios.map((sc, index) => (
          <div
            key={sc.id}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700/80 transition-colors space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-violet-400 shrink-0">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {sc.useCaseName}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                    {sc.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {/* Technique Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider block">
                  Tecnología de Privacidad (PET):
                </label>
                <select
                  value={sc.selectedTechnique}
                  onChange={(e) => handleChange(sc.id, 'selectedTechnique', e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-violet-500 font-sans"
                >
                  {shuffled(techniqueOptions).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reversibility Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                  Mecanismo y Grado de Reversibilidad:
                </label>
                <select
                  value={sc.reversibility}
                  onChange={(e) => handleChange(sc.id, 'reversibility', e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-sans"
                >
                  {shuffled(reversibilityOptions).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CyberKraft Exam Tip Banner */}
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/40 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
            Diferencias Críticas para el Examen Real CompTIA SY0-701
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">Tokenización:</strong> Reemplaza el dato por un token aleatorio almacenado en una bóveda (Token Vault); el token no es una función matemática ni un hash. <br />
            <strong className="text-white">Seudonimización:</strong> Reversible si se posee la clave o tabla de mapeo (sigue estando dentro del alcance de GDPR). <br />
            <strong className="text-white">Anonimización:</strong> 100% irreversible; destruye cualquier enlace identificable, quedando fuera del alcance de leyes de protección de datos personales. <br />
            <strong className="text-white">Dynamic Masking:</strong> Solo transforma la visualización para el operador (ej. asteriscos en la pantalla del Call Center), los datos en la base de datos no se alteran.
          </p>
        </div>
      </div>
    </div>
  );
};
