import React from 'react';
import { Languages } from 'lucide-react';
import { Lang, setLang, useLang } from '../i18n/language';
import { sound } from '../utils/audio';

const OPTIONS: { value: Lang; short: string; label: string }[] = [
  { value: 'es', short: 'ES', label: 'Español' },
  { value: 'en', short: 'EN', label: 'English' },
];

/** ES / EN segmented control. `large` shows full language names (welcome screen). */
export const LanguageSwitch: React.FC<{ large?: boolean }> = ({ large }) => {
  const lang = useLang();
  return (
    <div
      translate="no"
      role="radiogroup"
      aria-label="Idioma / Language"
      className={`flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 ${large ? 'w-full sm:w-auto' : ''}`}
    >
      {!large && <Languages className="hidden sm:block w-3.5 h-3.5 text-slate-500 mx-1" aria-hidden />}
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={lang === o.value}
          onClick={() => {
            sound.playToggle();
            void setLang(o.value);
          }}
          className={`rounded-md font-semibold transition-colors ${large ? 'flex-1 px-4 py-2 text-sm' : 'px-2 py-1 text-[11px]'} ${
            lang === o.value ? 'bg-cyan-600 text-on-accent shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
          title={o.label}
        >
          {large ? o.label : o.short}
        </button>
      ))}
    </div>
  );
};
