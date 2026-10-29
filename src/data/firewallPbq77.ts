/**
 * PBQ 77: exam-style firewall rules for a small office. The candidate builds the rulebase
 * above a final DENY; grading runs every test packet through the first-match simulator.
 */
import { EvaluationResult, FirewallPacketTest, FirewallRule, FirewallTokenBank, PartialCreditItem, PBQItem } from '../types/pbq';
import { simulatePacket, withTrafficTests } from '../utils/firewallSim';
import { domainNameFor, formatObjective } from './sy0701Objectives';

export const FIREWALL_ITEM_PBQ77: PBQItem = {
  id: 'pbq-77',
  number: 77,
  category: 'firewall-acl',
  categoryTitle: 'Reglas de Firewall y ACLs',
  title: 'Reglas de Firewall de una Oficina: Servidores Publicados, Administración y Navegación',
  estimatedMinutes: 6,
  domain: domainNameFor('4.5'),
  sy0701Objective: formatObjective('4.5', ['3.2']),
  scenario:
    'Una oficina tiene su LAN en 10.10.1.0/24 y dos servidores en la DMZ: el web 172.16.1.10 y el de correo 172.16.1.25. El firewall solo tiene la regla final que lo deniega todo. Agrega las reglas necesarias ARRIBA de esa regla para cumplir los requisitos, sin abrir nada de más.',
  requirements: [
    'Desde Internet, el servidor web solo debe aceptar HTTPS.',
    'El servidor de correo debe recibir correo de otros servidores de Internet (SMTP).',
    'Solo la estación del administrador (10.10.1.50) puede conectarse por SSH al servidor web.',
    'Los equipos de la LAN deben poder navegar por HTTPS hacia Internet.',
    'Todo lo demás debe quedar bloqueado por la regla final.',
  ],
  tacticalTip:
    'El firewall aplica la PRIMERA regla que coincide, de arriba hacia abajo: las reglas PERMIT van encima del DENY final. Usa la dirección más específica posible (una IP en lugar de una subred, una subred en lugar de 0.0.0.0/0). Correo entre servidores = SMTP TCP 25; HTTPS = TCP 443; SSH = TCP 22.',
};

export const INITIAL_FIREWALL_RULES_PBQ77: FirewallRule[] = [
  {
    id: 'rule-deny',
    ruleNumber: 100,
    action: 'DENY',
    protocol: 'ANY',
    sourceIp: '0.0.0.0/0',
    sourcePort: 'ANY',
    destIp: '0.0.0.0/0',
    destPort: 'ANY',
    description: 'Denegar todo lo demás',
    enabled: true,
  },
];

const t = (id: string, name: string, sourceIp: string, destIp: string, destPort: string, expectedAction: 'PERMIT' | 'DENY', description: string): FirewallPacketTest => ({
  id,
  name,
  sourceIp,
  protocol: 'TCP',
  destIp,
  destPort,
  expectedAction,
  description,
});

export const FIREWALL_PACKET_TESTS_PBQ77: FirewallPacketTest[] = [
  t('w-https', 'Cliente de Internet → web HTTPS (203.0.113.7)', '203.0.113.7', '172.16.1.10', '443', 'PERMIT', 'El sitio público debe responder por HTTPS.'),
  t('w-http', 'Cliente de Internet → web HTTP sin cifrar', '203.0.113.7', '172.16.1.10', '80', 'DENY', 'El web solo debe aceptar HTTPS.'),
  t('m-smtp', 'Servidor de correo externo → correo SMTP (198.51.100.20)', '198.51.100.20', '172.16.1.25', '25', 'PERMIT', 'El servidor de correo debe recibir correo de Internet.'),
  t('a-ssh', 'Administrador 10.10.1.50 → web SSH', '10.10.1.50', '172.16.1.10', '22', 'PERMIT', 'Solo el administrador puede administrar el web por SSH.'),
  t('u-ssh', 'Otro equipo de la LAN 10.10.1.77 → web SSH', '10.10.1.77', '172.16.1.10', '22', 'DENY', 'Los demás equipos no deben administrar el servidor.'),
  t('i-ssh', 'Internet → web SSH (198.51.100.66)', '198.51.100.66', '172.16.1.10', '22', 'DENY', 'SSH nunca debe quedar abierto a Internet.'),
  t('l-web', 'Equipo de la LAN → sitio externo HTTPS', '10.10.1.77', '93.184.216.34', '443', 'PERMIT', 'Los usuarios deben poder navegar por HTTPS.'),
  t('i-rdp', 'Internet → equipo de la LAN RDP', '198.51.100.66', '10.10.1.77', '3389', 'DENY', 'Nada de Internet debe llegar a la LAN.'),
];

export const FIREWALL_TOKENS_PBQ77: FirewallTokenBank = {
  addresses: ['0.0.0.0/0', '10.10.1.0/24', '10.10.1.50', '10.10.1.77', '172.16.1.0/24', '172.16.1.10', '172.16.1.25'],
  ports: ['22', '23', '25', '53', '80', '110', '443', '3389', 'ANY'],
};

/** Each requirement is met only when all of its packets get the expected decision. */
const REQUIREMENTS: { id: string; label: string; tests: string[]; good: string; bad: string }[] = [
  {
    id: 'fw77-web',
    label: 'El web acepta solo HTTPS desde Internet',
    tests: ['w-https', 'w-http'],
    good: 'Hay un PERMIT TCP 443 hacia 172.16.1.10 y el puerto 80 queda bloqueado.',
    bad: 'Necesitas PERMIT TCP 0.0.0.0/0 → 172.16.1.10 puerto 443, y nada que abra el 80 (no uses ANY como puerto).',
  },
  {
    id: 'fw77-mail',
    label: 'El servidor de correo recibe SMTP',
    tests: ['m-smtp'],
    good: 'El correo entre servidores llega por TCP 25.',
    bad: 'Necesitas PERMIT TCP 0.0.0.0/0 → 172.16.1.25 puerto 25. El correo entre servidores usa SMTP 25 (587 es para clientes; 110 es POP3).',
  },
  {
    id: 'fw77-ssh',
    label: 'SSH al web solo desde 10.10.1.50',
    tests: ['a-ssh', 'u-ssh', 'i-ssh'],
    good: 'El origen de la regla SSH es la IP exacta del administrador.',
    bad: 'Necesitas PERMIT TCP 10.10.1.50 → 172.16.1.10 puerto 22. Si el origen es 10.10.1.0/24 o 0.0.0.0/0, otros equipos también podrían administrar el servidor.',
  },
  {
    id: 'fw77-lan',
    label: 'La LAN navega por HTTPS',
    tests: ['l-web'],
    good: 'Los equipos de 10.10.1.0/24 salen a Internet por TCP 443.',
    bad: 'Necesitas PERMIT TCP 10.10.1.0/24 → 0.0.0.0/0 puerto 443.',
  },
  {
    id: 'fw77-deny',
    label: 'Todo lo demás queda bloqueado',
    tests: ['i-rdp'],
    good: 'Las reglas PERMIT están encima del DENY final y ninguna abre de más.',
    bad: 'Algo que debía bloquearse pasa: revisa que no haya reglas con ANY o 0.0.0.0/0 de más y que el DENY final siga al final.',
  },
];

export function evaluateFirewallPBQ77(rules: FirewallRule[]): EvaluationResult {
  const ok = (id: string) => {
    const test = FIREWALL_PACKET_TESTS_PBQ77.find((x) => x.id === id)!;
    return simulatePacket(rules, test).action === test.expectedAction;
  };
  const max = 100 / REQUIREMENTS.length;
  const requirementItems: PartialCreditItem[] = REQUIREMENTS.map((r) => {
    const achieved = r.tests.every(ok);
    return { id: r.id, label: r.label, achieved, points: achieved ? max : 0, maxPoints: max, explanation: achieved ? `Correcto. ${r.good}` : r.bad };
  });
  // Packet-by-packet detail (no points) so the review shows which flow failed and why.
  const traffic = withTrafficTests({ totalScore: 0, passed: false, partialCreditBreakdown: [], detailedFeedback: '', sy0701Objective: '', domainName: '' }, rules, FIREWALL_PACKET_TESTS_PBQ77, 100)
    .partialCreditBreakdown.map((b) => ({ ...b, points: 0, maxPoints: 0 }));
  const totalScore = Math.round(requirementItems.reduce((a, b) => a + b.points, 0));
  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: [...requirementItems, ...traffic],
    detailedFeedback:
      totalScore === 100
        ? 'Reglas correctas: cada flujo obtiene el resultado esperado y no abriste nada de más.'
        : `Puntuación: ${totalScore}/100. Revisa en las pruebas de tráfico qué regla coincide primero con cada paquete.`,
    sy0701Objective: '',
    domainName: '',
  };
}
