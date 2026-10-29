import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { setTheme, useTheme } from '../utils/theme';
import { sound } from '../utils/audio';

/** Sun / moon toggle between the light exam screen and the charcoal theme. */
export const ThemeSwitch: React.FC = () => {
  const theme = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      onClick={() => {
        sound.playToggle();
        setTheme(dark ? 'light' : 'dark');
      }}
      className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 transition-colors"
      aria-label={dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};
