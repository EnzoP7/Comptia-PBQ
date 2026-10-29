/**
 * Difficulty of each PBQ compared with the real exam. Candidates who passed SY0-701 report
 * 2–5 short PBQs, mostly drag-and-drop matching, simple firewall rules, identifying attacks or
 * compromised hosts from a few log lines, and short VPN / certificate / control placement
 * configurations. "Básica" and "Intermedia" are in that range; "Avanzada" goes deeper than the
 * exam (free-form terminal, many zones or services at once) and is meant for reinforcement.
 */
export type Difficulty = 'basic' | 'intermediate' | 'advanced';

const BASIC = [16, 17, 19, 20, 21, 22, 28, 40, 41, 51, 52, 53, 54, 56, 57, 58, 59, 61, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93];
const ADVANCED = [42, 49, 50, 62, 63, 64];

/**
 * PBQs whose core skill is not in the SY0-701 objectives (command-line work, Nmap, Active
 * Directory attacks). The 701 dropped the 601's list of command-line tools, so these are kept for
 * a quick look at the end of the list, but left out of the exam-like simulation.
 */
const EXTRA = [25, 32, 42, 60, 62, 63, 64, 76];

export const isExtra = (pbqNumber: number) => EXTRA.includes(pbqNumber);

export const EXTRA_INFO = {
  label: 'Extra: puede no aparecer',
  hint: 'Su tema central no figura en los objetivos del SY0-701. Dale una mirada general, sin estudiarla a fondo.',
  className: 'text-slate-300 bg-slate-800/80 border-slate-600',
};

export function difficultyOf(pbqNumber: number): Difficulty {
  if (BASIC.includes(pbqNumber)) return 'basic';
  if (ADVANCED.includes(pbqNumber)) return 'advanced';
  return 'intermediate';
}

export const DIFFICULTY_INFO: Record<Difficulty, { label: string; hint: string; className: string }> = {
  basic: {
    label: 'Básica',
    hint: 'Como la mayoría de las PBQs del examen: emparejar o clasificar con pocos elementos.',
    className: 'text-emerald-300 bg-emerald-950/60 border-emerald-800',
  },
  intermediate: {
    label: 'Intermedia',
    hint: 'Como las PBQs más largas del examen: configurar varios parámetros o analizar logs.',
    className: 'text-amber-300 bg-amber-950/60 border-amber-800',
  },
  advanced: {
    label: 'Avanzada',
    hint: 'Más exigente que el examen real: sirve para reforzar, no para medir si estás listo.',
    className: 'text-rose-300 bg-rose-950/60 border-rose-800',
  },
};
