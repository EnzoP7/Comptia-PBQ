/**
 * Leitner-style spaced repetition for the trap review cards. A right answer moves the card up one
 * box and pushes its next review further away; a wrong answer sends it back to box 1, due now.
 */
import { TRAP_CARDS, TrapCard } from '../data/trapCards';

const STORAGE_KEY = 'secplus_traps_v1';
const DAY = 24 * 60 * 60 * 1000;
/** Days until the next review once a card reaches each box (index = box). */
const INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];
export const MASTERED_BOX = 3;
export const SESSION_SIZE = 15;

export interface CardProgress {
  box: number;
  due: number;
  misses: number;
}
export type TrapProgress = Record<string, CardProgress>;

export function loadTrapProgress(): TrapProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveTrapProgress(progress: TrapProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage blocked (private mode): progress lasts only for this visit.
  }
}

export function recordAnswer(progress: TrapProgress, id: string, correct: boolean, now = Date.now()): TrapProgress {
  const prev = progress[id];
  const box = correct ? Math.min((prev?.box ?? 0) + 1, INTERVAL_DAYS.length - 1) : 1;
  return { ...progress, [id]: { box, due: now + INTERVAL_DAYS[box] * DAY, misses: (prev?.misses ?? 0) + (correct ? 0 : 1) } };
}

export const isDue = (p: CardProgress | undefined, now = Date.now()) => !!p && p.due <= now;
export const isMastered = (p: CardProgress | undefined) => !!p && p.box >= MASTERED_BOX;

export function dueCount(progress: TrapProgress, now = Date.now()) {
  return TRAP_CARDS.filter((c) => !progress[c.id] || isDue(progress[c.id], now)).length;
}

/** Due cards first (weakest box, then most missed), then unseen ones; `ahead` also takes cards not yet due. */
export function buildSession(cards: TrapCard[], progress: TrapProgress, ahead = false, now = Date.now()): string[] {
  const seen = cards.filter((c) => progress[c.id]);
  const weakest = (a: TrapCard, b: TrapCard) =>
    progress[a.id].box - progress[b.id].box || progress[b.id].misses - progress[a.id].misses || progress[a.id].due - progress[b.id].due;
  const due = seen.filter((c) => isDue(progress[c.id], now)).sort(weakest);
  const unseen = cards.filter((c) => !progress[c.id]);
  const pool = [...due, ...unseen];
  if (ahead) pool.push(...seen.filter((c) => !isDue(progress[c.id], now)).sort(weakest));
  return pool.slice(0, SESSION_SIZE).map((c) => c.id);
}
