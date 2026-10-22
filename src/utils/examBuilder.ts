import { PBQItem } from '../types/pbq';
import { SY0701_DOMAINS, getDomainId } from '../data/sy0701Objectives';

export interface AttemptRecord {
  score: number;
  at: number;
  mode: 'practice' | 'exam';
}

export type AttemptHistory = Record<string, AttemptRecord[]>;

/** Lower is weaker: never attempted first, then lowest best score. */
export function bestScore(history: AttemptHistory, id: string): number | null {
  const attempts = history[id];
  return attempts?.length ? Math.max(...attempts.map((a) => a.score)) : null;
}

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * Picks `count` PBQs distributed by the official domain weights (largest remainder method),
 * random within each domain, optionally favouring never-attempted / low-scoring PBQs.
 */
export function buildExamSet(pbqs: PBQItem[], count: number, history: AttemptHistory, prioritizeWeak: boolean): string[] {
  const quotas = SY0701_DOMAINS.map((d) => ({ id: d.id, exact: d.weight * count, take: Math.floor(d.weight * count) }));
  let remaining = count - quotas.reduce((a, q) => a + q.take, 0);
  [...quotas]
    .sort((a, b) => b.exact - b.take - (a.exact - a.take))
    .forEach((q) => {
      if (remaining > 0) {
        q.take++;
        remaining--;
      }
    });

  const pick = (pool: PBQItem[], n: number) => {
    const randomized = shuffleInPlace([...pool]);
    if (prioritizeWeak) randomized.sort((a, b) => (bestScore(history, a.id) ?? -1) - (bestScore(history, b.id) ?? -1));
    return randomized.slice(0, n);
  };

  const chosen: PBQItem[] = [];
  for (const q of quotas) chosen.push(...pick(pbqs.filter((p) => getDomainId(p.domain) === q.id), q.take));
  // Top up if a domain had fewer PBQs than its quota.
  if (chosen.length < count) chosen.push(...pick(pbqs.filter((p) => !chosen.includes(p)), count - chosen.length));
  return shuffleInPlace(chosen).map((p) => p.id);
}
