/**
 * Deterministic per-session shuffling so the correct option is never in a fixed position.
 * The seed changes when a new exam session starts, so the order is stable while answering
 * (no jumping on re-render) but differs between attempts.
 */
let sessionSeed = 1;

export function setShuffleSeed(seed: number) {
  sessionSeed = seed;
}

function hash(str: string): number {
  let h = 2166136261 ^ sessionSeed;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function shuffled<T>(items: T[], keyOf: (item: T) => string = (item: any) => String(item.id ?? item.value)): T[] {
  return [...items].sort((a, b) => hash(keyOf(a)) - hash(keyOf(b)));
}
