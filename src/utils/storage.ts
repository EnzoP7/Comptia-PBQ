/**
 * localStorage persistence for progress. Bump STORAGE_VERSION whenever the shape of a
 * PBQ answer state changes, so stale saved answers are discarded instead of crashing.
 */
const STORAGE_KEY = 'secplus-pbq-progress';
const STORAGE_VERSION = 3;

export function loadProgress<T>(): Partial<T> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.version === STORAGE_VERSION ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveProgress<T>(data: T) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, data }));
  } catch {
    // Storage full or blocked (private mode): progress simply won't survive a reload.
  }
}
