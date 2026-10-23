/**
 * First-match packet filter used both by the firewall simulator UI and by grading, so a
 * rulebase only scores if it actually produces the required PERMIT/DENY decisions in order.
 */
import { EvaluationResult, FirewallPacketTest, FirewallRule, PartialCreditItem, RuleAction } from '../types/pbq';

const isAny = (value: string) => ['ANY', '*', '0.0.0.0/0'].includes(value.trim().toUpperCase());

function ipToInt(ip: string): number | null {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    const octet = Number(p);
    if (!/^\d{1,3}$/.test(p) || octet > 255) return null;
    n = n * 256 + octet;
  }
  return n;
}

/** Matches a rule address (ANY, single IP or CIDR of any prefix length) against a packet IP. */
export function ipMatches(ruleIp: string, packetIp: string): boolean {
  if (isAny(ruleIp)) return true;
  const [base, prefixText] = ruleIp.trim().split('/');
  const target = ipToInt(packetIp);
  const network = ipToInt(base);
  if (target === null || network === null) return false;
  const prefix = prefixText === undefined ? 32 : Number(prefixText);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return false;
  const size = 2 ** (32 - prefix);
  return Math.floor(target / size) === Math.floor(network / size);
}

/** Matches ANY, a single port, a comma list ("80,443") or a range ("1024-65535"). */
export function portMatches(rulePort: string, packetPort: string): boolean {
  if (isAny(rulePort)) return true;
  const port = Number(packetPort);
  return rulePort.split(',').some((part) => {
    const [lo, hi] = part.trim().split('-').map(Number);
    return hi === undefined ? lo === port : port >= lo && port <= hi;
  });
}

export interface PacketDecision {
  matchedRule: FirewallRule | null;
  action: RuleAction;
}

export function simulatePacket(rules: FirewallRule[], test: FirewallPacketTest): PacketDecision {
  for (const rule of rules) {
    // Disabled or incomplete rules (an empty drop slot) never match.
    if (!rule.enabled || !rule.sourceIp.trim() || !rule.destIp.trim() || !rule.destPort.trim()) continue;
    const protoOk = rule.protocol === 'ANY' || rule.protocol === test.protocol;
    if (protoOk && ipMatches(rule.sourceIp, test.sourceIp) && ipMatches(rule.destIp, test.destIp) && portMatches(rule.destPort, test.destPort)) {
      return { matchedRule: rule, action: rule.action };
    }
  }
  return { matchedRule: null, action: 'DENY' }; // implicit deny
}

const round1 = (n: number) => Math.round(n * 10) / 10;

/**
 * Blends a configuration rubric with traffic results: `trafficWeight` points are split
 * across the packet tests, the rubric is scaled to the remaining points.
 */
export function withTrafficTests(
  rubric: EvaluationResult,
  rules: FirewallRule[],
  tests: FirewallPacketTest[],
  trafficWeight = 50
): EvaluationResult {
  const rubricMax = rubric.partialCreditBreakdown.reduce((a, b) => a + b.maxPoints, 0) || 1;
  const scale = (100 - trafficWeight) / rubricMax;
  const scaled = rubric.partialCreditBreakdown.map((b) => ({ ...b, points: round1(b.points * scale), maxPoints: round1(b.maxPoints * scale) }));

  const perTest = trafficWeight / tests.length;
  const traffic: PartialCreditItem[] = tests.map((test) => {
    const decision = simulatePacket(rules, test);
    const ok = decision.action === test.expectedAction;
    const matched = decision.matchedRule
      ? `la regla ${decision.matchedRule.ruleNumber} (${decision.matchedRule.action} ${decision.matchedRule.protocol} ${decision.matchedRule.sourceIp} → ${decision.matchedRule.destIp}:${decision.matchedRule.destPort})`
      : 'ninguna regla (denegación implícita)';
    return {
      id: `traffic-${test.id}`,
      label: `Tráfico: ${test.name} → debe ser ${test.expectedAction}`,
      achieved: ok,
      points: ok ? round1(perTest) : 0,
      maxPoints: round1(perTest),
      explanation: ok
        ? `Correcto: el paquete coincide primero con ${matched} y resulta ${decision.action}.`
        : `El paquete coincide primero con ${matched} y resulta ${decision.action}, pero debía ser ${test.expectedAction}. Recuerda: el firewall aplica la PRIMERA regla que coincide, de arriba hacia abajo.`,
    };
  });

  const breakdown = [...scaled, ...traffic];
  const totalScore = Math.round(breakdown.reduce((a, b) => a + b.points, 0));
  const trafficOk = traffic.filter((t) => t.achieved).length;
  const detailedFeedback =
    totalScore === 100
      ? rubric.detailedFeedback
      : `Puntuación: ${totalScore}/100. Configuración de reglas: ${round1(scaled.reduce((a, b) => a + b.points, 0))}/${100 - trafficWeight} · Pruebas de tráfico (first-match): ${trafficOk}/${tests.length} paquetes con el resultado correcto.`;
  return { ...rubric, totalScore, passed: totalScore >= 75, partialCreditBreakdown: breakdown, detailedFeedback };
}
