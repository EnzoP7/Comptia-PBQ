/** Helpers for Unix permission modes (e.g. 0o2770) shared by the simulator and its evaluator. */

export const SPECIAL = { suid: 0o4000, sgid: 0o2000, sticky: 0o1000 } as const;

const TRIADS = [
  { shift: 6, special: SPECIAL.suid, specialChar: 's' },
  { shift: 3, special: SPECIAL.sgid, specialChar: 's' },
  { shift: 0, special: SPECIAL.sticky, specialChar: 't' },
];

/** `ls -l` style string, e.g. drwxrws--- or -rwsr-xr-x. */
export function toSymbolic(mode: number, isDirectory: boolean): string {
  let out = isDirectory ? 'd' : '-';
  for (const { shift, special, specialChar } of TRIADS) {
    const bits = (mode >> shift) & 0o7;
    out += bits & 4 ? 'r' : '-';
    out += bits & 2 ? 'w' : '-';
    const exec = (bits & 1) !== 0;
    if (mode & special) out += exec ? specialChar : specialChar.toUpperCase();
    else out += exec ? 'x' : '-';
  }
  return out;
}

/** Octal as chmod expects it: 3 digits, or 4 when a special bit is set. */
export function toOctal(mode: number): string {
  const digits = (mode & 0o7777).toString(8);
  return mode & 0o7000 ? digits.padStart(4, '0') : digits.slice(-3).padStart(3, '0');
}
