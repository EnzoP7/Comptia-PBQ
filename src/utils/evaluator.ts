/**
 * CompTIA Security+ (SY0-701) Tactical Evaluation & Partial Credit Engine
 * 
 * Supports all 14 PBQs with comprehensive rubric scoring and explanations.
 */

import {
  EvaluationResult,
  PartialCreditItem,
  NetworkZoneSlot,
  FirewallRule,
  SiemAnswers,
  ServiceItem,
  SecurityPolicyItem,
  IamUserGroupConfig,
  FolderPermissionNode,
  ConditionalAccessState,
  CryptoConfigState,
  PkiCertConfigState,
  WirelessApConfigState,
  WipsRogueApConfigState,
  VulnerabilityFinding,
  DlpPolicyItem,
  IncidentResponseActionItem,
  ContainerHardeningState,
  PhysicalSecurityState,
  DisasterRecoveryState,
  SocialEngineeringCase,
  ForensicVerificationState,
  RiskManagementState,
  EmailSecurityState,
  SecurityCliScenario,
  IdsYaraState,
  DevSecOpsState,
  CryptoAttackCase,
  FederationState,
  MobileSecurityState,
  PortAuditItem,
  NmapScanState,
  DnsSecurityState,
  ZeroTrustState,
  WebServerHardeningState,
  ForensicHoldState,
  PkiLifecycleState,
  WirelessSecurityState,
  CloudDlpState,
  SocialEngState,
  CloudSharedResponsibilityState,
  MitreThreatHuntingState,
  DataGovernanceState,
  PrivacyPetsState,
  MalwareTriageState,
  ApiSecurityState,
  SoarAutomationState,
} from '../types/pbq';

// ==========================================
// PBQ 1: Perímetro Tradicional
// ==========================================
export function evaluateNetworkDiagram(slots: NetworkZoneSlot[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const edgeSlot = slots.find((s) => s.slotId === 'slot-edge');
  const edgeCorrect = edgeSlot?.currentPlacedId === 'inline_ips';
  breakdown.push({
    id: 'edge-ips',
    label: 'Ubicación del IPS en Línea (Edge Filter)',
    achieved: edgeCorrect,
    points: edgeCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: edgeCorrect
      ? 'Correcto: El IPS en línea (Inline IPS) inspecciona y bloquea anomalías y tráfico malicioso directamente en el perímetro exterior.'
      : 'Incorrecto: Para mitigar ataques en tiempo real en el borde perimetral antes de que alcancen zonas internas, debe colocarse un IPS en línea.'
  });

  const dmzFrontSlot = slots.find((s) => s.slotId === 'slot-dmz-front');
  const wafCorrect = dmzFrontSlot?.currentPlacedId === 'waf';
  breakdown.push({
    id: 'dmz-waf',
    label: 'Ubicación del WAF (Web Application Firewall)',
    achieved: wafCorrect,
    points: wafCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: wafCorrect
      ? 'Correcto: El WAF inspecciona tráfico Capa 7 (HTTP/HTTPS) antes de los servidores web en la DMZ para mitigar inyecciones SQL, XSS y ataques web.'
      : 'Incorrecto: El WAF debe posicionarse para filtrar peticiones web Capa 7 antes de que lleguen a los servidores web expuestos en la DMZ.'
  });

  const boundarySlot = slots.find((s) => s.slotId === 'slot-boundary');
  const fwCorrect = boundarySlot?.currentPlacedId === 'stateful_fw';
  breakdown.push({
    id: 'boundary-fw',
    label: 'Firewall Stateful de Segmentación DMZ ⟷ LAN',
    achieved: fwCorrect,
    points: fwCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: fwCorrect
      ? 'Correcto: El Firewall Stateful mantiene tablas de estado e impide que un compromiso en la DMZ pase libremente a la red interna (LAN).'
      : 'Incorrecto: La frontera entre la DMZ y la LAN corporativa debe estar custodiada por un Firewall Stateful de microsegmentación.'
  });

  const mgmtSlot = slots.find((s) => s.slotId === 'slot-mgmt');
  const bastionCorrect = mgmtSlot?.currentPlacedId === 'bastion_host';
  breakdown.push({
    id: 'mgmt-bastion',
    label: 'Bastion Host / Jump Server para Administración',
    achieved: bastionCorrect,
    points: bastionCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: bastionCorrect
      ? 'Correcto: El Bastion Host actúa como punto de salto seguro, endurecido y auditado para sesiones remotas (SSH/RDP) hacia sistemas internos.'
      : 'Incorrecto: Se requiere un Bastion Host (Jump Box) como punto único de acceso seguro para administración de sistemas.'
  });

  const authSlot = slots.find((s) => s.slotId === 'slot-lan-auth');
  const radiusCorrect = authSlot?.currentPlacedId === 'radius_server';
  breakdown.push({
    id: 'lan-radius',
    label: 'Servidor RADIUS Centralizado en LAN',
    achieved: radiusCorrect,
    points: radiusCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: radiusCorrect
      ? 'Correcto: El servidor de autenticación AAA (RADIUS) reside en la red interna protegida, nunca expuesto directamente a Internet.'
      : 'Incorrecto: El Servidor RADIUS contiene credenciales y debe ubicarse en la red interna segura (LAN Core).'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Excelente diseño de arquitectura perimetral! Has cumplido al 100% las directivas de microsegmentación y defensa en profundidad de CompTIA SY0-701.'
        : `Puntuación obtenida: ${totalScore}/100. Revisa los componentes no alineados para asegurar la defensa en profundidad en las zonas de red.`,
    sy0701Objective: 'Objetivo 3.2: Aplicar conceptos de seguridad a la arquitectura y diseño de redes.',
    domainName: 'Dominio 3: Arquitectura de Seguridad'
  };
}

// ==========================================
// PBQ 8: Cloud Híbrida & Zero Trust
// ==========================================
export function evaluateNetworkDiagramPBQ8(slots: NetworkZoneSlot[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const cloudEdge = slots.find((s) => s.slotId === 'slot-cloud-edge');
  const cloudEdgeCorrect = cloudEdge?.currentPlacedId === 'cloud_waf';
  breakdown.push({
    id: 'cloud-waf',
    label: 'Cloud WAF & DDoS Shield en Entrada VPC',
    achieved: cloudEdgeCorrect,
    points: cloudEdgeCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: cloudEdgeCorrect
      ? 'Correcto: El Cloud WAF protege la frontera elástica de la nube pública contra ataques web y volumétricos.'
      : 'Incorrecto: El Cloud WAF debe posicionarse en el Ingress de la VPC para inspeccionar el tráfico antes de los balanceadores.'
  });

  const transitGw = slots.find((s) => s.slotId === 'slot-cloud-transit');
  const transitCorrect = transitGw?.currentPlacedId === 'transit_gw';
  breakdown.push({
    id: 'transit-gw',
    label: 'Transit Gateway como Concentrador Híbrido',
    achieved: transitCorrect,
    points: transitCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: transitCorrect
      ? 'Correcto: Transit Gateway actúa como hub de enrutamiento central y punto de terminación de túneles VPN entre VPC y On-Prem.'
      : 'Incorrecto: Para centralizar la conectividad híbrida entre múltiples subredes de nube y centros de datos se utiliza un Transit Gateway.'
  });

  const ztnaBroker = slots.find((s) => s.slotId === 'slot-cloud-ztna');
  const ztnaCorrect = ztnaBroker?.currentPlacedId === 'ztna_broker';
  breakdown.push({
    id: 'ztna-broker',
    label: 'Broker de Acceso Zero Trust (ZTNA)',
    achieved: ztnaCorrect,
    points: ztnaCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: ztnaCorrect
      ? 'Correcto: El broker ZTNA concede acceso contextual por aplicación a los desarrolladores sin exponer la red interna completa.'
      : 'Incorrecto: Se debe colocar el ZTNA Broker para gobernar el acceso de administradores bajo el principio de verificación continua.'
  });

  const onpremEdge = slots.find((s) => s.slotId === 'slot-onprem-edge');
  const ngfwCorrect = onpremEdge?.currentPlacedId === 'ngfw_onprem';
  breakdown.push({
    id: 'onprem-ngfw',
    label: 'Firewall Next-Gen (NGFW) en Borde On-Premises',
    achieved: ngfwCorrect,
    points: ngfwCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: ngfwCorrect
      ? 'Correcto: El NGFW local inspecciona profundamente todo el tráfico procedente del enlace híbrido antes de ingresar al Data Center.'
      : 'Incorrecto: El enlace que llega al centro de datos local debe terminar en un Firewall Next-Gen (NGFW).'
  });

  const onpremIdp = slots.find((s) => s.slotId === 'slot-onprem-idp');
  const idpCorrect = onpremIdp?.currentPlacedId === 'idp_adfs';
  breakdown.push({
    id: 'onprem-idp',
    label: 'Proveedor de Identidad Federada (ADFS/SAML) Protegido',
    achieved: idpCorrect,
    points: idpCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: idpCorrect
      ? 'Correcto: El Identity Provider (ADFS) reside en el núcleo protegido on-premises para emitir aserciones SAML/OIDC hacia la nube.'
      : 'Incorrecto: El IdP corporativo debe alojarse en la zona protegida interna on-premises.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Arquitectura híbrida Zero Trust excepcional! Has demostrado dominio en interconexión de nube, transit gateways y brokers ZTNA.'
        : `Puntuación obtenida: ${totalScore}/100. Verifica la posición del Transit Gateway y del broker ZTNA.`,
    sy0701Objective: 'Objetivo 3.1: Comparar y contrastar conceptos de seguridad en la nube e híbridos.',
    domainName: 'Dominio 3: Arquitectura de Seguridad'
  };
}

// ==========================================
// PBQ 2: Firewall Inbound ACL
// ==========================================
export function evaluateFirewallAcl(rules: FirewallRule[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const sshRule = rules.find((r) => r.destPort === '22' && r.action === 'PERMIT' && r.enabled);
  const sshRestricted =
    sshRule !== undefined &&
    sshRule.sourceIp.trim() === '10.1.0.0/24' &&
    sshRule.protocol === 'TCP';

  breakdown.push({
    id: 'fw-ssh',
    label: 'Restricción de Administración SSH a Subred de Admins',
    achieved: sshRestricted,
    points: sshRestricted ? 30 : 0,
    maxPoints: 30,
    explanation: sshRestricted
      ? 'Correcto: El puerto SSH 22 está estrictamente limitado a la subred de administración 10.1.0.0/24.'
      : 'Incorrecto: El acceso SSH debe permitirse ÚNICAMENTE desde la subred administrativa 10.1.0.0/24. Dejar 0.0.0.0/0 es una vulnerabilidad crítica.'
  });

  const denyAllIndex = rules.findIndex(
    (r) =>
      r.action === 'DENY' &&
      r.enabled &&
      (r.sourceIp === '0.0.0.0/0' || r.sourceIp === 'ANY') &&
      (r.destIp === '0.0.0.0/0' || r.destIp === 'ANY') &&
      (r.destPort === 'ANY' || r.destPort === '')
  );

  const httpsRuleIndex = rules.findIndex((r) => r.destPort === '443' && r.action === 'PERMIT' && r.enabled);
  const dnsRuleIndex = rules.findIndex((r) => r.destPort === '53' && r.action === 'PERMIT' && r.enabled);
  const sshRuleIndex = rules.findIndex((r) => r.destPort === '22' && r.action === 'PERMIT' && r.enabled);

  const orderCorrect =
    denyAllIndex === -1 ||
    (denyAllIndex > httpsRuleIndex &&
      denyAllIndex > dnsRuleIndex &&
      (sshRuleIndex === -1 || denyAllIndex > sshRuleIndex));

  breakdown.push({
    id: 'fw-order',
    label: 'Orden de Ejecución Secuencial (First-Match Rulebase)',
    achieved: orderCorrect,
    points: orderCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: orderCorrect
      ? 'Correcto: Las reglas permisivas se evalúan antes de la denegación implícita final.'
      : 'Incorrecto: Una regla "DENY ALL" situada antes de las reglas PERMIT bloqueará todo el tráfico legítimo antes de llegar a ellas.'
  });

  const dmzHttpsPermitted = rules.some(
    (r) =>
      r.action === 'PERMIT' &&
      r.enabled &&
      r.protocol === 'TCP' &&
      r.destPort === '443' &&
      r.destIp === '192.168.2.10'
  );

  const dmzDnsPermitted = rules.some(
    (r) =>
      r.action === 'PERMIT' &&
      r.enabled &&
      r.protocol === 'UDP' &&
      r.destPort === '53' &&
      r.destIp === '192.168.2.53'
  );

  const dmzCorrect = dmzHttpsPermitted && dmzDnsPermitted;
  breakdown.push({
    id: 'fw-dmz',
    label: 'Habilitación de Servicios DMZ (HTTPS:443 y DNS:53)',
    achieved: dmzCorrect,
    points: dmzCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: dmzCorrect
      ? 'Correcto: Se permite HTTPS al servidor web de la DMZ y DNS UDP/53 al resolvedor de la DMZ.'
      : 'Incorrecto: Debe haber reglas PERMIT para HTTPS (TCP 443 a 192.168.2.10) y DNS (UDP 53 a 192.168.2.53).'
  });

  const httpPermitted = rules.some((r) => r.destPort === '80' && r.action === 'PERMIT' && r.enabled);
  const httpSecured = !httpPermitted;

  breakdown.push({
    id: 'fw-http',
    label: 'Mitigación de Protocolo en Texto Plano (HTTP 80)',
    achieved: httpSecured,
    points: httpSecured ? 20 : 0,
    maxPoints: 20,
    explanation: httpSecured
      ? 'Correcto: El protocolo HTTP en texto claro ha sido eliminado o deshabilitado en favor de HTTPS seguro.'
      : 'Incorrecto: Se debe deshabilitar o eliminar la regla que permite HTTP 80 sin cifrar en texto plano.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Configuración de ACL impecable! Has eliminado las trampas clásicas de CompTIA: SSH expuesto a 0.0.0.0/0 y la regla Deny All mal posicionada.'
        : `Puntuación obtenida: ${totalScore}/100. Verifica el orden de evaluación y que los accesos administrativos tengan origen restringido.`,
    sy0701Objective: 'Objetivo 3.3: Configurar e interpretar reglas de filtrado de paquetes y listas de control de acceso (ACLs).',
    domainName: 'Dominio 3: Arquitectura de Seguridad'
  };
}

// ==========================================
// PBQ 9: Firewall Egress Filtering (Exfiltración)
// ==========================================
export function evaluateFirewallAclPBQ9(rules: FirewallRule[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  // Check 1: DNS UDP 53 restricted to corporate DNS (10.0.0.53 / 10.0.0.54) NOT 0.0.0.0/0
  const openDnsRule = rules.find(
    (r) => r.destPort === '53' && r.action === 'PERMIT' && r.enabled && (r.destIp === '0.0.0.0/0' || r.destIp === 'ANY')
  );
  const legitDnsRule = rules.find(
    (r) => r.destPort === '53' && r.action === 'PERMIT' && r.enabled && (r.destIp.includes('10.0.0.53') || r.destIp.includes('10.0.0.'))
  );

  const dnsEgressSecured = !openDnsRule && legitDnsRule !== undefined;
  breakdown.push({
    id: 'egress-dns',
    label: 'Restricción de DNS Saliente a Servidores Corporativos (Anti-Tunneling)',
    achieved: dnsEgressSecured,
    points: dnsEgressSecured ? 35 : 0,
    maxPoints: 35,
    explanation: dnsEgressSecured
      ? 'Correcto: Se bloqueó el DNS saliente indiscriminado a Internet y se limitó a 10.0.0.53/54, mitigando túneles de exfiltración DNS.'
      : 'Incorrecto: Permitir DNS UDP 53 a 0.0.0.0/0 facilita la exfiltración encubierta de datos (DNS Tunneling). Debe limitarse a los DNS corporativos internos.'
  });

  // Check 2: Port 4444 and Port 6667 blocked
  const reverseShellAllowed = rules.some((r) => r.destPort === '4444' && r.action === 'PERMIT' && r.enabled);
  const ircAllowed = rules.some((r) => r.destPort === '6667' && r.action === 'PERMIT' && r.enabled);
  const c2Blocked = !reverseShellAllowed && !ircAllowed;

  breakdown.push({
    id: 'egress-c2-ports',
    label: 'Bloqueo de Puertos de Reverse Shell (4444) e IRC C2 (6667)',
    achieved: c2Blocked,
    points: c2Blocked ? 35 : 0,
    maxPoints: 35,
    explanation: c2Blocked
      ? 'Correcto: Los puertos 4444 (Reverse Shells) y 6667 (Canales IRC de Botnets) han sido bloqueados en salida.'
      : 'Incorrecto: Se debe denegar o eliminar cualquier regla que permita tráfico saliente en puertos de alto riesgo como 4444 o 6667.'
  });

  // Check 3: Legitimate HTTPS 443 permitted
  const httpsPermitted = rules.some((r) => r.destPort === '443' && r.action === 'PERMIT' && r.enabled);
  breakdown.push({
    id: 'egress-https',
    label: 'Permitir Navegación Web Saliente HTTPS (Puerto 443)',
    achieved: httpsPermitted,
    points: httpsPermitted ? 15 : 0,
    maxPoints: 15,
    explanation: httpsPermitted
      ? 'Correcto: El tráfico legítimo de navegación web segura HTTPS hacia Internet está habilitado.'
      : 'Incorrecto: Debe haber una regla que permita tráfico saliente TCP 443 para navegación web legítima.'
  });

  // Check 4: Implicit Deny Egress at the end
  const lastRule = rules[rules.length - 1];
  const denyAllAtEnd = lastRule && lastRule.action === 'DENY' && lastRule.enabled;
  breakdown.push({
    id: 'egress-implicit-deny',
    label: 'Regla Implícita de Denegación al Final (Egress Deny All)',
    achieved: denyAllAtEnd,
    points: denyAllAtEnd ? 15 : 0,
    maxPoints: 15,
    explanation: denyAllAtEnd
      ? 'Correcto: La regla final es un DENY que bloquea cualquier otro tráfico de salida no explícitamente autorizado.'
      : 'Incorrecto: La última regla del firewall debe ser DENY ALL para cumplir la política de seguridad por defecto.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Filtrado de salida impecable! Has neutralizado canales encubiertos de DNS tunneling y reverse shells C2.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda restringir el destino de las consultas DNS a IPs internas autorizadas.`,
    sy0701Objective: 'Objetivo 3.3: Configurar e interpretar reglas de filtrado de paquetes y listas de control de acceso.',
    domainName: 'Dominio 3: Arquitectura de Seguridad'
  };
}

// ==========================================
// PBQ 3: SIEM Log Viewer (SQLi)
// ==========================================
export function evaluateLogSiem(answers: SiemAnswers): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const pzCorrect = answers.patientZeroIp === '192.168.1.105';
  breakdown.push({
    id: 'siem-patient-zero',
    label: 'Identificación de la IP del Paciente Cero Interno',
    achieved: pzCorrect,
    points: pzCorrect ? 30 : 0,
    maxPoints: 30,
    explanation: pzCorrect
      ? 'Correcto: El host 192.168.1.105 fue el primer equipo vulnerado desde el cual se lanzó la actividad maliciosa interna y el escaneo de puertos.'
      : 'Incorrecto: El Paciente Cero interno es 192.168.1.105 (servidor web explotado). 198.51.100.42 es la IP del atacante externo.'
  });

  const vectorCorrect = answers.initialAttackVector.includes('sqli_rce_smb');
  breakdown.push({
    id: 'siem-vector',
    label: 'Reconstrucción de la Cadena de Ataque (Attack Chain)',
    achieved: vectorCorrect,
    points: vectorCorrect ? 30 : 0,
    maxPoints: 30,
    explanation: vectorCorrect
      ? 'Correcto: La secuencia fue: Inyección SQL en Apache -> Carga de Web Shell cmd.php -> Ejecución de comandos EDR -> Escaneo SMB 445 para movimiento lateral.'
      : 'Incorrecto: Los registros de Apache muestran primero inyección SQL en item.php, seguida de POST de web shell cmd.php y escaneo de puertos SMB 445.'
  });

  const timestampCorrect =
    answers.initialCompromiseTimestamp.includes('14:22:15') ||
    answers.initialCompromiseTimestamp.includes('14:22');

  breakdown.push({
    id: 'siem-timestamp',
    label: 'Timestamp Exacto de Explotación Inicial',
    achieved: timestampCorrect,
    points: timestampCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: timestampCorrect
      ? 'Correcto: A las 14:22:15 el atacante completó con éxito el POST para subir la web shell cmd.php.'
      : 'Incorrecto: La explotación inicial exitosa ocurrió a las 14:22:15 con la subida del web shell.'
  });

  const containmentCorrect = answers.immediateContainmentAction.includes('isolate');
  breakdown.push({
    id: 'siem-containment',
    label: 'Acción Inmediata de Contención (Incident Response)',
    achieved: containmentCorrect,
    points: containmentCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: containmentCorrect
      ? 'Correcto: El primer paso en la fase de contención de NIST/CompTIA es aislar de la red el host comprometido para detener el movimiento lateral sin destruir evidencia forense en RAM.'
      : 'Incorrecto: Según CompTIA y NIST SP 800-61, se debe aislar el host infectado inmediatamente. Apagar o formatear destruiría la memoria RAM volátil necesaria para la investigación forense.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Análisis forense y SIEM impecable! Correlacionaste con precisión los eventos de Apache, Syslog, Windows 4624/4625 y Firewall.'
        : `Puntuación obtenida: ${totalScore}/100. En el examen CompTIA, presta especial atención al orden cronológico de los registros y a la preservación del estado volátil en contención.`,
    sy0701Objective: 'Objetivo 4.3: Analizar e investigar indicadores de compromiso (IoC) y actividades sospechosas.',
    domainName: 'Dominio 4: Operaciones de Seguridad'
  };
}

// ==========================================
// PBQ 10: SIEM Logs (Phishing, Beaconing & Kerberoasting)
// ==========================================
export function evaluateLogSiemPBQ10(answers: SiemAnswers): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const q1Correct = answers.patientZeroIp === 'dmarc_fail_spoof';
  breakdown.push({
    id: 'siem10-q1',
    label: 'Diagnóstico de Suplantación en Correo (DMARC=Fail & Spoofing)',
    achieved: q1Correct,
    points: q1Correct ? 25 : 0,
    maxPoints: 25,
    explanation: q1Correct
      ? 'Correcto: El registro del Email Gateway muestra SPF=softfail, DKIM=none y DMARC=fail, confirmando suplantación del remitente.'
      : 'Incorrecto: La causa raíz fue la falta de alineación DMARC en el remitente falsificado.'
  });

  const q2Correct = answers.initialCompromiseTimestamp === 'c2_beaconing_60s';
  breakdown.push({
    id: 'siem10-q2',
    label: 'Identificación de C2 Beaconing Periódico (Intervalo 60s)',
    achieved: q2Correct,
    points: q2Correct ? 25 : 0,
    maxPoints: 25,
    explanation: q2Correct
      ? 'Correcto: Los registros del Proxy demuestran balizamiento periódico (Beaconing) en un intervalo exacto de 60 segundos hacia un dominio DGA.'
      : 'Incorrecto: El tráfico proxy revela balizamiento C2 programado a intervalos regulares de 60 segundos.'
  });

  const q3Correct = answers.initialAttackVector === 'kerberoasting_rc4';
  breakdown.push({
    id: 'siem10-q3',
    label: 'Detección de Ataque Kerberoasting (Event ID 4769 con RC4)',
    achieved: q3Correct,
    points: q3Correct ? 30 : 0,
    maxPoints: 30,
    explanation: q3Correct
      ? 'Correcto: El Event ID 4769 con tipo de cifrado 0x17 (RC4-HMAC) para una cuenta de servicio SPN (MSSQL_Svc) es la firma clásica de Kerberoasting.'
      : 'Incorrecto: La solicitud de ticket de servicio TGS con cifrado débil 0x17 para un SPN corresponde a Kerberoasting.'
  });

  const q4Correct = answers.immediateContainmentAction === 'isolate_and_reset_svc_aes';
  breakdown.push({
    id: 'siem10-q4',
    label: 'Contención de Endpoint y Endurecimiento Kerberos con AES-256',
    achieved: q4Correct,
    points: q4Correct ? 20 : 0,
    maxPoints: 20,
    explanation: q4Correct
      ? 'Correcto: Se debe aislar el host comprometido y forzar una contraseña compleja con cifrado AES-256 en la cuenta de servicio para neutralizar el crackeo offline.'
      : 'Incorrecto: Se debe aislar el equipo afectado y actualizar la cuenta de servicio a AES-256.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Excelente investigación de incidentes complejos! Has correlacionado Phishing, persistencia C2 y Kerberoasting en Active Directory.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda que el Event ID 4769 con cifrado RC4 (0x17) es el indicador clave de Kerberoasting en CompTIA.`,
    sy0701Objective: 'Objetivo 4.3: Analizar e investigar indicadores de compromiso (IoC) y actividades sospechosas.',
    domainName: 'Dominio 4: Operaciones de Seguridad'
  };
}

// ==========================================
// PBQ 4: Endpoint Hardening (Server)
// ==========================================
export function evaluateEndpointHardening(
  services: ServiceItem[],
  policies: SecurityPolicyItem[]
): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const telnetStopped = services.find((s) => s.id === 'svc-telnet')?.currentStatus === 'stopped';
  breakdown.push({
    id: 'hard-telnet',
    label: 'Deshabilitar Telnet (Puerto 23)',
    achieved: telnetStopped,
    points: telnetStopped ? 15 : 0,
    maxPoints: 15,
    explanation: telnetStopped
      ? 'Correcto: Telnet envía credenciales en texto plano sin cifrar; debe estar deshabilitado.'
      : 'Incorrecto: Telnet debe detenerse y deshabilitarse de inmediato.'
  });

  const ftpStopped = services.find((s) => s.id === 'svc-ftp')?.currentStatus === 'stopped';
  breakdown.push({
    id: 'hard-ftp',
    label: 'Deshabilitar FTP (Puerto 21)',
    achieved: ftpStopped,
    points: ftpStopped ? 15 : 0,
    maxPoints: 15,
    explanation: ftpStopped
      ? 'Correcto: FTP es inseguro y debe reemplazarse por SFTP cifrado.'
      : 'Incorrecto: El servicio FTP tradicional no ofrece cifrado y debe ser detenido.'
  });

  const smbv1Stopped = services.find((s) => s.id === 'svc-smbv1')?.currentStatus === 'stopped';
  breakdown.push({
    id: 'hard-smbv1',
    label: 'Deshabilitar protocolo heredado SMBv1',
    achieved: smbv1Stopped,
    points: smbv1Stopped ? 15 : 0,
    maxPoints: 15,
    explanation: smbv1Stopped
      ? 'Correcto: SMBv1 es susceptible a EternalBlue y no soporta cifrado moderno.'
      : 'Incorrecto: SMBv1 es un protocolo crítico obsoleto que debe deshabilitarse en todo el parque de servidores.'
  });

  const sshRunning = services.find((s) => s.id === 'svc-ssh')?.currentStatus === 'running';
  breakdown.push({
    id: 'hard-ssh',
    label: 'Habilitar Servicio SSH/SFTP Seguro',
    achieved: sshRunning,
    points: sshRunning ? 15 : 0,
    maxPoints: 15,
    explanation: sshRunning
      ? 'Correcto: SSH/SFTP proporciona administración y transferencia cifrada de archivos.'
      : 'Incorrecto: SSH/SFTP debe estar activo para permitir administración remota segura.'
  });

  const uacEnabled = policies.find((p) => p.id === 'policy-uac')?.currentValue === true;
  breakdown.push({
    id: 'hard-uac',
    label: 'Activar Control de Cuentas de Usuario (UAC)',
    achieved: uacEnabled,
    points: uacEnabled ? 10 : 0,
    maxPoints: 10,
    explanation: uacEnabled
      ? 'Correcto: UAC previene la ejecución silenciosa de malware con privilegios administrativos.'
      : 'Incorrecto: UAC debe estar activado en servidores de producción.'
  });

  const pwdLen = Number(policies.find((p) => p.id === 'policy-pwd-len')?.currentValue || 0);
  const pwdLenCorrect = pwdLen >= 14;
  breakdown.push({
    id: 'hard-pwd',
    label: 'Longitud Mínima de Contraseña (≥ 14 caracteres)',
    achieved: pwdLenCorrect,
    points: pwdLenCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: pwdLenCorrect
      ? 'Correcto: La directiva exige al menos 14 caracteres según NIST SP 800-63B y CompTIA SY0-701.'
      : 'Incorrecto: La longitud mínima requerida por las directivas actuales de CompTIA SY0-701 es de 14 caracteres.'
  });

  const lockoutVal = Number(policies.find((p) => p.id === 'policy-lockout')?.currentValue || 0);
  const lockoutCorrect = lockoutVal === 5;
  breakdown.push({
    id: 'hard-lockout',
    label: 'Bloqueo de Cuenta tras Intentos Fallidos (Umbral = 5)',
    achieved: lockoutCorrect,
    points: lockoutCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: lockoutCorrect
      ? 'Correcto: 5 intentos fallidos mitiga ataques de fuerza bruta en línea manteniendo la operatividad.'
      : 'Incorrecto: El umbral de bloqueo debe configurarse en 5 intentos fallidos.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Línea base de endurecimiento aplicada a la perfección! Servidor protegido contra protocolos claros y ataques de diccionario.'
        : `Puntuación obtenida: ${totalScore}/100. Asegura deshabilitar todos los servicios inseguros y configurar la longitud de clave a 14.`,
    sy0701Objective: 'Objetivo 2.4: Aplicar técnicas de endurecimiento (hardening) en sistemas operativos y servicios de red.',
    domainName: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones'
  };
}

// ==========================================
// PBQ 11: Endpoint Hardening (Workstations)
// ==========================================
export function evaluateEndpointHardeningPBQ11(
  services: ServiceItem[],
  policies: SecurityPolicyItem[]
): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const llmnrStopped = services.find((s) => s.id === 'svc-llmnr')?.currentStatus === 'stopped';
  breakdown.push({
    id: 'hard11-llmnr',
    label: 'Deshabilitar LLMNR (Mitigación de Responder/Poisoning)',
    achieved: llmnrStopped,
    points: llmnrStopped ? 20 : 0,
    maxPoints: 20,
    explanation: llmnrStopped
      ? 'Correcto: Deshabilitar LLMNR impide que un atacante capture hashes NTLMv2 respondiendo a peticiones de nombres fallidas.'
      : 'Incorrecto: LLMNR debe detenerse para neutralizar ataques de envenenamiento en red local (Responder).'
  });

  const netbiosStopped = services.find((s) => s.id === 'svc-netbios')?.currentStatus === 'stopped';
  breakdown.push({
    id: 'hard11-netbios',
    label: 'Deshabilitar NetBIOS sobre TCP/IP',
    achieved: netbiosStopped,
    points: netbiosStopped ? 15 : 0,
    maxPoints: 15,
    explanation: netbiosStopped
      ? 'Correcto: Se cerró el vector de difusión NBT-NS.'
      : 'Incorrecto: NetBIOS sobre TCP/IP es un protocolo de broadcast obsoleto que debe deshabilitarse.'
  });

  const credGuardOn = policies.find((p) => p.id === 'policy-cred-guard')?.currentValue === true;
  breakdown.push({
    id: 'hard11-cred-guard',
    label: 'Habilitar Windows Defender Credential Guard (VBS)',
    achieved: credGuardOn,
    points: credGuardOn ? 25 : 0,
    maxPoints: 25,
    explanation: credGuardOn
      ? 'Correcto: Credential Guard utiliza seguridad basada en virtualización (VBS) aislando los secretos de LSASS contra Mimikatz.'
      : 'Incorrecto: Se debe activar Credential Guard para prevenir la extracción de credenciales de la memoria.'
  });

  const psPolicy = policies.find((p) => p.id === 'policy-ps-execution')?.currentValue;
  const psCorrect = psPolicy === 'AllSigned' || psPolicy === 'Restricted';
  breakdown.push({
    id: 'hard11-ps-policy',
    label: 'Directiva de Ejecución de PowerShell (AllSigned / Restricted)',
    achieved: psCorrect,
    points: psCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: psCorrect
      ? 'Correcto: Exigir firma digital (AllSigned) bloquea scripts descargados maliciosos.'
      : 'Incorrecto: La directiva de ejecución debe ser AllSigned o Restricted, nunca Unrestricted.'
  });

  const vbaMacrosBlocked = policies.find((p) => p.id === 'policy-vba-macros')?.currentValue === true;
  breakdown.push({
    id: 'hard11-vba-macros',
    label: 'Bloquear Macros de Office de Internet (Mark of the Web)',
    achieved: vbaMacrosBlocked,
    points: vbaMacrosBlocked ? 20 : 0,
    maxPoints: 20,
    explanation: vbaMacrosBlocked
      ? 'Correcto: Bloquear macros con atributo MOTW mitiga el vector principal de distribución de malware por correo.'
      : 'Incorrecto: Las macros provenientes de archivos de Internet deben bloquearse por directiva GPO.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Endurecimiento de estaciones de trabajo completado con éxito! Has mitigado envenenamiento de red local y robo de credenciales en memoria.'
        : `Puntuación obtenida: ${totalScore}/100. Asegura deshabilitar LLMNR y activar Credential Guard.`,
    sy0701Objective: 'Objetivo 2.4: Aplicar técnicas de endurecimiento (hardening) en sistemas operativos.',
    domainName: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones'
  };
}

// ==========================================
// PBQ 5: IAM Permissions (NTFS)
// ==========================================
export function evaluateIamPermissions(
  userGroups: IamUserGroupConfig[],
  folderNodes: FolderPermissionNode[]
): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const intern = userGroups.find((u) => u.username === 'intern_marcos');
  const internPrivilegeRevoked =
    intern !== undefined &&
    !intern.assignedGroups.includes('HR_Confidential_Admins') &&
    intern.assignedGroups.includes('IT_Helpdesk');

  breakdown.push({
    id: 'iam-intern-group',
    label: 'Revocar Privilegios de RRHH al Practicante de IT',
    achieved: internPrivilegeRevoked,
    points: internPrivilegeRevoked ? 25 : 0,
    maxPoints: 25,
    explanation: internPrivilegeRevoked
      ? 'Correcto: Se removió a intern_marcos del grupo HR_Confidential_Admins, cumpliendo el principio de Mínimo Privilegio.'
      : 'Incorrecto: Un practicante de TI jamás debe tener pertenencia al grupo de administradores de nóminas y RRHH.'
  });

  const auditor = userGroups.find((u) => u.username === 'auditor_valeria');
  const auditorGroupAssigned =
    auditor !== undefined && auditor.assignedGroups.includes('Finance_Auditors');

  breakdown.push({
    id: 'iam-auditor-group',
    label: 'Asignar Grupo Correcto a Auditora de Finanzas',
    achieved: auditorGroupAssigned,
    points: auditorGroupAssigned ? 20 : 0,
    maxPoints: 20,
    explanation: auditorGroupAssigned
      ? 'Correcto: La auditora fue agregada al grupo Finance_Auditors para heredar los permisos de rol correspondientes (RBAC).'
      : 'Incorrecto: auditor_valeria debe pertenecer al grupo Finance_Auditors para acceder a las carpetas de auditoría.'
  });

  const hrFolder = folderNodes.find((f) => f.path.includes('HR/Payroll_Confidential'));
  const hrInheritanceBroken = hrFolder?.inheritanceEnabled === false;
  const domainUsersRemoved = !hrFolder?.currentAcl.some(
    (a) => a.principalName.includes('Domain Users') || a.principalName.includes('Todos')
  );

  const hrSecurityCorrect = hrInheritanceBroken && domainUsersRemoved;
  breakdown.push({
    id: 'iam-hr-acl',
    label: 'Bloquear Herencia y Acceso Público en Carpeta Confidencial',
    achieved: hrSecurityCorrect,
    points: hrSecurityCorrect ? 30 : 0,
    maxPoints: 30,
    explanation: hrSecurityCorrect
      ? 'Correcto: Se deshabilitó la herencia en Nómina Confidencial y se revocó el acceso al grupo Domain Users.'
      : 'Incorrecto: En datos de nómina sensibles se debe romper la herencia de permisos y retirar Domain Users.'
  });

  const finFolder = folderNodes.find((f) => f.path.includes('Finance/Reports'));
  const finAuditorsAcl = finFolder?.currentAcl.find((a) => a.principalName === 'Finance_Auditors');
  const finPermissionsCorrect =
    finAuditorsAcl !== undefined &&
    finAuditorsAcl.modify === true &&
    finAuditorsAcl.read === true &&
    finAuditorsAcl.fullControl === false;

  breakdown.push({
    id: 'iam-fin-least-privilege',
    label: 'Permiso de Modificar a Auditores (Sin Full Control)',
    achieved: finPermissionsCorrect,
    points: finPermissionsCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: finPermissionsCorrect
      ? 'Correcto: Se otorgó permiso Modify (Lectura y Escritura de datos) sin conceder Full Control (Mínimo Privilegio).'
      : 'Incorrecto: Para actualizar informes se requiere Modify (Lectura + Escritura). Otorgar Full Control viola el principio de mínimo privilegio.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Gestión de identidades y permisos impecable! Has aplicado estrictamente RBAC, Mínimo Privilegio y control de herencia.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda: otorgar Full Control para modificar archivos es un fallo recurrente de mínimo privilegio.`,
    sy0701Objective: 'Objetivo 1.3: Explicar la importancia del control de acceso y el principio de mínimo privilegio.',
    domainName: 'Dominio 1: Conceptos Generales de Seguridad'
  };
}

// ==========================================
// PBQ 12: Conditional Access & Zero Trust
// ==========================================
export function evaluateConditionalAccessPBQ12(state: ConditionalAccessState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const mfaCorrect = state.requireMfa === 'fido2_phishing_resistant';
  breakdown.push({
    id: 'ca-mfa',
    label: 'Exigir MFA Resistente a Phishing (FIDO2 / Hardware Keys)',
    achieved: mfaCorrect,
    points: mfaCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: mfaCorrect
      ? 'Correcto: FIDO2/WebAuthn proporciona autenticación multifactor resistente a ataques de Proxy Inverso y SIM Swapping.'
      : 'Incorrecto: Para cumplir Zero Trust y normativas de salud se debe exigir MFA resistente a phishing (FIDO2).'
  });

  const geoCorrect = state.geoBlockingPolicy === 'block_untrusted_geos';
  breakdown.push({
    id: 'ca-geo',
    label: 'Geobloqueo de Ubicaciones No Autorizadas (Named Locations)',
    achieved: geoCorrect,
    points: geoCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: geoCorrect
      ? 'Correcto: Se bloquean intentos de acceso originados fuera del área operativa autorizada.'
      : 'Incorrecto: Se debe restringir el acceso geográfico a países autorizados por directiva corporativa.'
  });

  const mdmCorrect = state.deviceCompliance === 'require_mdm_compliant';
  breakdown.push({
    id: 'ca-mdm',
    label: 'Exigir Dispositivo Corporativo Conforme (MDM / Intune Compliant)',
    achieved: mdmCorrect,
    points: mdmCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: mdmCorrect
      ? 'Correcto: Solo dispositivos administrados y conformes con el antivirus y cifrado pueden consultar registros médicos (EHR).'
      : 'Incorrecto: Los registros confidenciales requieren dispositivos corporativos conformes (Compliant Devices).'
  });

  const pimCorrect = state.adminJustInTime === 'enforce_pim_jit';
  breakdown.push({
    id: 'ca-pim',
    label: 'Gestión de Identidades Privilegiadas Just-In-Time (PIM / JIT)',
    achieved: pimCorrect,
    points: pimCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: pimCorrect
      ? 'Correcto: PIM elimina el acceso permanente de administradores, exigiendo activación temporal justificada y auditada.'
      : 'Incorrecto: El principio de Mínimo Privilegio prohíbe privilegios administrativos permanentes (Standing Access).'
  });

  const riskCorrect = state.riskBasedAuth === 'block_high_risk_signin';
  breakdown.push({
    id: 'ca-risk',
    label: 'Protección de Identidad Basada en Riesgo (Bloqueo en Alto Riesgo)',
    achieved: riskCorrect,
    points: riskCorrect ? 10 : 0,
    maxPoints: 10,
    explanation: riskCorrect
      ? 'Correcto: Inicios de sesión con viajes imposibles o credenciales filtradas son bloqueados automáticamente.'
      : 'Incorrecto: Se debe bloquear el inicio de sesión ante detección de riesgo elevado de identidad.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Políticas de Acceso Condicional Zero Trust impecables! Has protegido datos clínicos con MFA resistente a phishing y dispositivos conformes.'
        : `Puntuación obtenida: ${totalScore}/100. Verifica que el acceso de administrador sea Just-In-Time (PIM).`,
    sy0701Objective: 'Objetivo 1.3: Explicar la importancia del control de acceso y el principio de mínimo privilegio.',
    domainName: 'Dominio 1: Conceptos Generales de Seguridad'
  };
}

// ==========================================
// PBQ 6: Cryptography & VPN (IPSec)
// ==========================================
export function evaluateCryptoVpn(state: CryptoConfigState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const ikev2Correct = state.ikeVersion === 'IKEv2';
  breakdown.push({
    id: 'crypto-ike-version',
    label: 'Protocolo de Intercambio de Claves Fase 1 (IKEv2)',
    achieved: ikev2Correct,
    points: ikev2Correct ? 15 : 0,
    maxPoints: 15,
    explanation: ikev2Correct
      ? 'Correcto: IKEv2 soporta EAP, es más eficiente, resistente a DoS y reemplaza al obsoleto IKEv1.'
      : 'Incorrecto: IKEv1 está obsoleto en SY0-701; se debe seleccionar IKEv2.'
  });

  const dhCorrect = state.dhGroup.includes('Group 14') || state.dhGroup.includes('Group 19');
  breakdown.push({
    id: 'crypto-dh-group',
    label: 'Grupo Diffie-Hellman Seguro (Group 14 / Group 19 ECDH)',
    achieved: dhCorrect,
    points: dhCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: dhCorrect
      ? 'Correcto: DH Group 14 (2048-bit) o Group 19 (ECDH 256-bit) proporcionan niveles de seguridad NIST recomendados.'
      : 'Incorrecto: Los grupos DH 1 y 2 (1024-bit o menores) son vulnerables a ataques computacionales masivos.'
  });

  const ikeCryptoCorrect =
    state.ikeEncryption.includes('AES-256') &&
    (state.ikeHash === 'SHA-256' || state.ikeHash === 'SHA-384' || state.ikeHash === 'SHA-512');

  breakdown.push({
    id: 'crypto-ike-ciphers',
    label: 'Cifrado y Hash de Fase 1 (AES-256 y SHA-256/384)',
    achieved: ikeCryptoCorrect,
    points: ikeCryptoCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: ikeCryptoCorrect
      ? 'Correcto: AES-256 y la familia SHA-2 eliminan los riesgos de colisión de MD5 y SHA-1.'
      : 'Incorrecto: DES, 3DES, MD5 y SHA-1 son algoritmos criptográficos rotos u obsoletos.'
  });

  const espCorrect = state.ipsecProtocol === 'ESP (Encapsulating Security Payload)';
  breakdown.push({
    id: 'crypto-ipsec-esp',
    label: 'Protocolo IPSec de Fase 2: ESP (Cifrado de Payload)',
    achieved: espCorrect,
    points: espCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: espCorrect
      ? 'Correcto: ESP proporciona confidencialidad (cifrado del payload) e integridad. AH solo ofrece integridad sin cifrado.'
      : 'Incorrecto: AH (Authentication Header) NO cifra los datos del paquete. Para confidencialidad se debe usar ESP.'
  });

  const ipsecCipherCorrect = state.ipsecCipher.includes('AES-GCM-256') && state.ipsecPfs === true;
  breakdown.push({
    id: 'crypto-ipsec-suite',
    label: 'Suite AES-GCM-256 y Perfect Forward Secrecy (PFS)',
    achieved: ipsecCipherCorrect,
    points: ipsecCipherCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: ipsecCipherCorrect
      ? 'Correcto: AES-GCM ofrece cifrado autenticado (AEAD) de alto rendimiento y PFS protege sesiones pasadas ante filtración de claves.'
      : 'Incorrecto: Se debe seleccionar AES-GCM-256 y habilitar PFS.'
  });

  const storageCorrect = state.storageCipher.includes('AES-256');
  const tlsCorrect = state.webTlsVersion === 'TLS 1.3';
  const standardsCorrect = storageCorrect && tlsCorrect;

  breakdown.push({
    id: 'crypto-storage-tls',
    label: 'Cifrado en Reposo (AES-256) y Transporte Web (TLS 1.3)',
    achieved: standardsCorrect,
    points: standardsCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: standardsCorrect
      ? 'Correcto: AES-256 es el estándar de oro para datos en reposo y TLS 1.3 elimina suites de cifrado débiles.'
      : 'Incorrecto: Se debe usar AES-256 para almacenamiento en reposo (nunca RC4 o DES) y TLS 1.3 para transporte.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Arquitectura criptográfica perfecta! Has demostrado dominio absoluto de suites modernas, eliminando por completo algoritmos obsoletos.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda que AH no ofrece cifrado, y MD5/SHA-1/3DES están vetados en SY0-701.`,
    sy0701Objective: 'Objetivo 1.4: Seleccionar e implementar soluciones criptográficas para datos en tránsito y en reposo.',
    domainName: 'Dominio 1: Conceptos Generales de Seguridad'
  };
}

// ==========================================
// PBQ 13: PKI Certificate Chain Diagnostics
// ==========================================
export function evaluatePkiCertificatesPBQ13(state: PkiCertConfigState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const caTypeCorrect = state.certificateType.includes('Public CA') || state.certificateType.includes('CA Raíz de Confianza');
  breakdown.push({
    id: 'pki-ca-type',
    label: 'Emisor Confiable (CA Pública de Confianza vs Autofirmado)',
    achieved: caTypeCorrect,
    points: caTypeCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: caTypeCorrect
      ? 'Correcto: Para servicios web públicos se requiere una CA pública reconocida en los almacenes de confianza de los navegadores.'
      : 'Incorrecto: Los certificados autofirmados generan advertencias de seguridad graves en navegadores clientes.'
  });

  const sigAlgCorrect = state.signatureAlgorithm.includes('SHA-256') || state.signatureAlgorithm.includes('ECDSA');
  breakdown.push({
    id: 'pki-sig-alg',
    label: 'Algoritmo de Firma Criptográfico Robusto (SHA-256 / ECDSA)',
    achieved: sigAlgCorrect,
    points: sigAlgCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: sigAlgCorrect
      ? 'Correcto: SHA-256withRSA o ECDSA P-256 eliminan los riesgos de falsificación por colisión de SHA-1.'
      : 'Incorrecto: SHA-1 está vetado y es rechazado por todos los navegadores modernos.'
  });

  const intermediateCorrect = state.intermediateIncluded === true;
  breakdown.push({
    id: 'pki-intermediate',
    label: 'Inclusión del Bundle de la CA Intermedia (Cadena Completa)',
    achieved: intermediateCorrect,
    points: intermediateCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: intermediateCorrect
      ? 'Correcto: Incluir el certificado de la CA Intermedia en el bundle del servidor permite al cliente validar la cadena hasta la Root CA.'
      : 'Incorrecto: Si falta la CA intermedia en el bundle del servidor web, los clientes reportarán error de emisor desconocido (SEC_ERROR_UNKNOWN_ISSUER).'
  });

  const sanCorrect = state.sanDomains.includes('portal.corp.com');
  breakdown.push({
    id: 'pki-san',
    label: 'Extensión Subject Alternative Name (SAN) para FQDNs',
    achieved: sanCorrect,
    points: sanCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: sanCorrect
      ? 'Correcto: El estándar RFC 5280 y los navegadores modernos exigen SAN para emparejar el FQDN del sitio web.'
      : 'Incorrecto: La extensión SAN debe incluir los nombres de dominio completos del portal (e.g. portal.corp.com).'
  });

  const ocspCorrect = state.revocationCheckMethod.includes('OCSP Stapling');
  breakdown.push({
    id: 'pki-ocsp',
    label: 'Mecanismo de Revocación Rápida: OCSP Stapling (RFC 6066)',
    achieved: ocspCorrect,
    points: ocspCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: ocspCorrect
      ? 'Correcto: OCSP Stapling adjunta la prueba de validez firmada por la CA en el handshake TLS, mejorando privacidad y velocidad.'
      : 'Incorrecto: Se debe preferir OCSP Stapling sobre CRL tradicionales para reducir latencia y preservar la privacidad del cliente.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Diagnóstico y configuración de PKI perfecto! Has completado la cadena de confianza y optimizado el handshake TLS con OCSP Stapling.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda que la omisión de la CA intermedia es la causa más común de certificados no confiables en servidores.`,
    sy0701Objective: 'Objetivo 1.4: Seleccionar e implementar soluciones criptográficas para datos en tránsito.',
    domainName: 'Dominio 1: Conceptos Generales de Seguridad'
  };
}

// ==========================================
// PBQ 7: Wireless Security (AP WPA3)
// ==========================================
export function evaluateWirelessAp(state: WirelessApConfigState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const enterpriseCorrect = state.securityMode.includes('WPA3-Enterprise');
  breakdown.push({
    id: 'wifi-wpa3-ent',
    label: 'Modo de Seguridad WPA3-Enterprise (802.1X)',
    achieved: enterpriseCorrect,
    points: enterpriseCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: enterpriseCorrect
      ? 'Correcto: WPA3-Enterprise utiliza autenticación basada en identidades individuales y servidor RADIUS (evita claves compartidas PSK).'
      : 'Incorrecto: Para entornos corporativos se debe utilizar WPA3-Enterprise con 802.1X, no WPA2/WPA3 Personal (PSK).'
  });

  const radiusCorrect =
    state.radiusIp.trim() === '10.0.10.25' &&
    Number(state.radiusPort) === 1812 &&
    state.radiusSecret.length >= 8;

  breakdown.push({
    id: 'wifi-radius-config',
    label: 'Configuración de Servidor RADIUS (10.0.10.25:1812)',
    achieved: radiusCorrect,
    points: radiusCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: radiusCorrect
      ? 'Correcto: La IP del servidor AAA es 10.0.10.25, el puerto de autenticación es 1812 y la clave secreta es robusta.'
      : 'Incorrecto: El servidor RADIUS debe configurarse en 10.0.10.25 en el puerto estándar UDP 1812 con un secreto compartido seguro.'
  });

  const cipherCorrect = state.cipherSuite.includes('GCMP-256') || state.cipherSuite.includes('AES-GCMP');
  breakdown.push({
    id: 'wifi-cipher',
    label: 'Cifrado Robusto WPA3 (AES-GCMP-256 Suite B)',
    achieved: cipherCorrect,
    points: cipherCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: cipherCorrect
      ? 'Correcto: AES-GCMP-256 es el algoritmo de cifrado autenticado de grado militar para WPA3 Enterprise 192-bit.'
      : 'Incorrecto: TKIP está obsoleto y vulnerable; para WPA3 Enterprise se debe seleccionar AES-GCMP-256.'
  });

  const isolationCorrect = state.clientIsolation === true;
  breakdown.push({
    id: 'wifi-client-isolation',
    label: 'Aislamiento de Clientes (Client Isolation)',
    achieved: isolationCorrect,
    points: isolationCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: isolationCorrect
      ? 'Correcto: Client Isolation impide que clientes en la misma red inalámbrica se comuniquen directamente entre sí, bloqueando ataques MITM y movimiento lateral.'
      : 'Incorrecto: El aislamiento de clientes debe estar habilitado para mitigar ataques directos entre endpoints Wi-Fi.'
  });

  const wpsDisabled = state.wpsEnabled === false;
  const pmfEnabled = state.pmfRequired === true;
  const hardeningCorrect = wpsDisabled && pmfEnabled;

  breakdown.push({
    id: 'wifi-wps-pmf',
    label: 'Desactivar WPS y Requerir PMF (802.11w)',
    achieved: hardeningCorrect,
    points: hardeningCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: hardeningCorrect
      ? 'Correcto: WPS está deshabilitado (elimina ataques de PIN por fuerza bruta) y PMF previene ataques de desautenticación.'
      : 'Incorrecto: Se debe apagar WPS (Wi-Fi Protected Setup) y exigir Protected Management Frames (802.11w PMF).'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Punto de acceso asegurado al estándar empresarial! Has implementado WPA3-Enterprise con RADIUS, aislamiento de clientes y mitigación contra ataques de desautenticación.'
        : `Puntuación obtenida: ${totalScore}/100. Verifica el puerto RADIUS (1812) y asegúrate de haber apagado WPS y activado PMF.`,
    sy0701Objective: 'Objetivo 3.2: Configurar parámetros y controles de seguridad para redes inalámbricas empresariales.',
    domainName: 'Dominio 3: Arquitectura de Seguridad'
  };
}

// ==========================================
// PBQ 14: Wireless WIPS & Rogue AP Mitigation
// ==========================================
export function evaluateWirelessWipsPBQ14(state: WipsRogueApConfigState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const classCorrect = state.threatClassification.includes('Rogue AP / Evil Twin');
  breakdown.push({
    id: 'wips-classification',
    label: 'Clasificación Correcta de la Amenaza (Rogue AP / Evil Twin)',
    achieved: classCorrect,
    points: classCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: classCorrect
      ? 'Correcto: Se identificó el dispositivo como un Evil Twin que clona el SSID corporativo para capturar credenciales de usuarios.'
      : 'Incorrecto: La amenaza debe ser clasificada como Rogue AP / Evil Twin.'
  });

  const switchCorrect = state.switchPortAction.includes('Shutdown') || state.switchPortAction.includes('Bloquear');
  breakdown.push({
    id: 'wips-switch-port',
    label: 'Bloqueo del Puerto de Red Físico del Switch (Port Security)',
    achieved: switchCorrect,
    points: switchCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: switchCorrect
      ? 'Correcto: Se deshabilitó el puerto físico del switch al que estaba conectado el AP no autorizado, cortándole el acceso a la red.'
      : 'Incorrecto: Se debe apagar o aislar el puerto del switch (Shutdown / Port Security) para neutralizar la conexión física del Rogue AP.'
  });

  const containCorrect = state.wirelessContainment === true;
  breakdown.push({
    id: 'wips-containment',
    label: 'Activación de Contención Inalámbrica en el WIPS (Deauth Containment)',
    achieved: containCorrect,
    points: containCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: containCorrect
      ? 'Correcto: El sensor WIPS transmite tramas de desasociación dirigidas hacia el BSSID del Evil Twin para evitar que clientes se conecten a él.'
      : 'Incorrecto: La contención inalámbrica en el WIPS debe estar activada.'
  });

  const authCorrect = state.clientAuthProtocol.includes('EAP-TLS');
  breakdown.push({
    id: 'wips-eap-tls',
    label: 'Directiva de Autenticación Mutua por Certificados (EAP-TLS)',
    achieved: authCorrect,
    points: authCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: authCorrect
      ? 'Correcto: EAP-TLS exige autenticación mutua; los clientes validan la CA del servidor RADIUS y nunca se conectan a APs falsificados.'
      : 'Incorrecto: Se debe exigir EAP-TLS para prevenir que los clientes entreguen credenciales a puntos de acceso no autorizados.'
  });

  const certValCorrect = state.certificateValidationEnforced === true;
  breakdown.push({
    id: 'wips-cert-val',
    label: 'Validación Estricta del Certificado de Servidor en Clientes',
    achieved: certValCorrect,
    points: certValCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: certValCorrect
      ? 'Correcto: Los suplicantes 802.1X tienen habilitada la verificación del certificado de la CA raíz, bloqueando el ataque de Rogue AP.'
      : 'Incorrecto: Se debe forzar la validación del certificado del servidor en los perfiles Wi-Fi corporativos.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Respuesta WIPS impecable! Has neutralizado el Evil Twin en la capa física e inalámbrica e implementado EAP-TLS para inmunizar a los clientes.'
        : `Puntuación obtenida: ${totalScore}/100. Asegura deshabilitar el puerto del switch y forzar EAP-TLS con validación de certificado.`,
    sy0701Objective: 'Objetivo 3.2: Configurar parámetros y controles de seguridad para redes inalámbricas empresariales.',
    domainName: 'Dominio 3: Arquitectura de Seguridad'
  };
}

// ==========================================
// PBQ 15: Vulnerability Management & CVSS Remediation
// ==========================================
export function evaluateVulnerabilityManagementPBQ15(findings: VulnerabilityFinding[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const f1 = findings.find((f) => f.id === 'vuln-log4j');
  const f1Correct = f1?.selectedRemediation === 'patch_log4j_waf';
  breakdown.push({
    id: 'f1-log4j',
    label: 'Remediación Log4j RCE (CVE-2021-44228 - CVSS 10.0)',
    achieved: f1Correct,
    points: f1Correct ? 25 : 0,
    maxPoints: 25,
    explanation: f1Correct
      ? 'Correcto: Se aplicó actualización a log4j 2.17.1+ y regla virtual de WAF bloqueando cadenas JNDI (${jndi:ldap/rmi}).'
      : 'Incorrecto: Log4j requiere actualización inmediata de la biblioteca y mitigación virtual en WAF contra inyecciones JNDI.'
  });

  const f2 = findings.find((f) => f.id === 'vuln-traversal');
  const f2Correct = f2?.selectedRemediation === 'upgrade_apache_deny';
  breakdown.push({
    id: 'f2-traversal',
    label: 'Remediación Apache Path Traversal (CVE-2021-41773)',
    achieved: f2Correct,
    points: f2Correct ? 25 : 0,
    maxPoints: 25,
    explanation: f2Correct
      ? 'Correcto: Se actualizó el daemon Apache HTTP Server y se forzó Require all denied en el directorio raíz.'
      : 'Incorrecto: Debe actualizarse el servidor web y restringir el control de acceso a directorios mediante directiva Require all denied.'
  });

  const f3 = findings.find((f) => f.id === 'vuln-ssl-poodle');
  const f3Correct = f3?.selectedRemediation === 'disable_sslv3_tls10';
  breakdown.push({
    id: 'f3-poodle',
    label: 'Mitigación de Cifrado Débil SSLv3 POODLE',
    achieved: f3Correct,
    points: f3Correct ? 25 : 0,
    maxPoints: 25,
    explanation: f3Correct
      ? 'Correcto: Se deshabilitaron completamente los protocolos vulnerables SSLv2, SSLv3 y TLS 1.0, exigiendo TLS 1.2/1.3.'
      : 'Incorrecto: POODLE explota el modo CBC de SSLv3; la solución definitiva es deshabilitar protocolos obsoletos SSLv3/TLS 1.0.'
  });

  const f4 = findings.find((f) => f.id === 'vuln-openssh');
  const f4Correct = f4?.selectedRemediation === 'disable_weak_ciphers_upgrade';
  breakdown.push({
    id: 'f4-openssh',
    label: 'Endurecimiento de Algoritmos OpenSSH',
    achieved: f4Correct,
    points: f4Correct ? 25 : 0,
    maxPoints: 25,
    explanation: f4Correct
      ? 'Correcto: Se deshabilitaron ciphers débiles (3DES, CBC) en sshd_config forzando ChaCha20-Poly1305 o AES-GCM.'
      : 'Incorrecto: Se debe restringir sshd_config eliminando ciphers CBC/3DES y exigiendo suites modernas.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Excelente gestión de vulnerabilidades! Has priorizado según criticidad CVSS y aplicado las remediaciones técnicas adecuadas según CompTIA.'
        : `Puntuación obtenida: ${totalScore}/100. Revisa la mitigación de protocolos legados (POODLE) y la actualización de librerías críticas (Log4j).`,
    sy0701Objective: 'Objetivo 2.3: Analizar reportes de vulnerabilidades y priorizar acciones tácticas de mitigación y parcheo.',
    domainName: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones'
  };
}

// ==========================================
// PBQ 16: DLP & Data Protection
// ==========================================
export function evaluateDlpDataProtectionPBQ16(items: DlpPolicyItem[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const atRest = items.find((i) => i.id === 'dlp-at-rest-db');
  const atRestCorrect = atRest?.selectedControl === 'aes_256_tde_kms';
  breakdown.push({
    id: 'dlp-at-rest',
    label: 'Protección de Datos en Reposo (At-Rest: Base de Datos PII)',
    achieved: atRestCorrect,
    points: atRestCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: atRestCorrect
      ? 'Correcto: Se seleccionó cifrado transparente de base de datos (TDE) AES-256 gestionado mediante KMS con rotación de claves.'
      : 'Incorrecto: Los datos en reposo requieren cifrado robusto de almacenamiento (AES-256 TDE / BitLocker con KMS).'
  });

  const inTransit = items.find((i) => i.id === 'dlp-in-transit-api');
  const inTransitCorrect = inTransit?.selectedControl === 'tls_13_mtls_pfs';
  breakdown.push({
    id: 'dlp-in-transit',
    label: 'Protección de Datos en Tránsito (In-Transit: API Transaccional)',
    achieved: inTransitCorrect,
    points: inTransitCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: inTransitCorrect
      ? 'Correcto: Se implementó TLS 1.3 con autenticación mutua (mTLS) y Perfect Forward Secrecy (PFS).'
      : 'Incorrecto: Para datos en tránsito se exige TLS 1.3 con suites de cifrado autenticado y certificados mutuos.'
  });

  const inUse = items.find((i) => i.id === 'dlp-in-use-workstation');
  const inUseCorrect = inUse?.selectedControl === 'endpoint_dlp_usb_clip';
  breakdown.push({
    id: 'dlp-in-use',
    label: 'Protección de Datos en Uso (In-Use: Estaciones de Trabajo)',
    achieved: inUseCorrect,
    points: inUseCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: inUseCorrect
      ? 'Correcto: El agente Endpoint DLP bloquea copiado al portapapeles, capturas de pantalla y dispositivos USB masivos.'
      : 'Incorrecto: Los datos en uso se protegen mediante agentes DLP de endpoint (bloqueo de impresión, USB y clipboard).'
  });

  const cloudCasb = items.find((i) => i.id === 'dlp-cloud-casb');
  const casbCorrect = cloudCasb?.selectedControl === 'casb_api_watermark';
  breakdown.push({
    id: 'dlp-casb',
    label: 'Control de Fugas en la Nube (SaaS Storage CASB)',
    achieved: casbCorrect,
    points: casbCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: casbCorrect
      ? 'Correcto: Se configuró CASB en modo API para inspección continua de repositorios SaaS y marca de agua digital forense.'
      : 'Incorrecto: Se debe utilizar un Cloud Access Security Broker (CASB) para escanear y revocar enlaces públicos no autorizados.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Matriz de protección de datos impecable! Has cubierto la confidencialidad en los 3 estados del ciclo de vida del dato.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda la distinción entre At-Rest (almacenamiento), In-Transit (red) e In-Use (memoria/pantalla).`,
    sy0701Objective: 'Objetivo 1.4: Seleccionar e implementar conceptos y soluciones criptográficas y de DLP para proteger datos en tránsito, en reposo y en uso.',
    domainName: 'Dominio 1: Conceptos Generales de Seguridad'
  };
}

// ==========================================
// PBQ 17: Incident Response (NIST SP 800-61r2)
// ==========================================
export function evaluateIncidentResponsePBQ17(actions: IncidentResponseActionItem[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const phaseMap: Record<string, string> = {
    'act-backup-playbook': '1_preparation',
    'act-correlate-siem': '2_detection',
    'act-isolate-vlan': '3_containment',
    'act-wipe-malware': '4_eradication',
    'act-restore-backup': '5_recovery',
    'act-post-mortem': '6_lessons_learned'
  };

  const labelsMap: Record<string, string> = {
    'act-backup-playbook': 'Fase 1: Preparación (Playbooks & Entrenamientos)',
    'act-correlate-siem': 'Fase 2: Detección y Análisis (Correlación SIEM & Triage)',
    'act-isolate-vlan': 'Fase 3: Contención (Aislamiento de Red & Quarentena)',
    'act-wipe-malware': 'Fase 4: Erradicación (Eliminación de Malware & Limpieza)',
    'act-restore-backup': 'Fase 5: Recuperación (Restauración de Copias & Pruebas)',
    'act-post-mortem': 'Fase 6: Lecciones Aprendidas (Reunión Post-Mortem & Informe)'
  };

  let pointsPerItem = Math.floor(100 / actions.length); // ~16 or 17

  actions.forEach((act) => {
    const expected = phaseMap[act.id];
    const isCorrect = act.assignedPhase === expected;
    breakdown.push({
      id: act.id,
      label: labelsMap[act.id] || act.id,
      achieved: isCorrect,
      points: isCorrect ? 16 : 0,
      maxPoints: 16,
      explanation: isCorrect
        ? `Correcto: Esta acción corresponde exactamente a la fase de ${expected.replace(/^[0-9]_/, '').toUpperCase()} según NIST SP 800-61r2.`
        : `Incorrecto: Se esperaba la fase de ${expected?.replace(/^[0-9]_/, '').toUpperCase()}. Revisa el orden secuencial de NIST.`
    });
  });

  const totalScore = Math.min(100, breakdown.reduce((acc, curr) => acc + curr.points, 0) + (breakdown.filter(b => b.achieved).length === 6 ? 4 : 0));

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Ciclo de vida de respuesta a incidentes NIST dominado al 100%! La secuencia y asignación de acciones es tácticamente perfecta.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda el orden: Preparación -> Detección -> Contención -> Erradicación -> Recuperación -> Lecciones Aprendidas.`,
    sy0701Objective: 'Objetivo 4.4: Aplicar técnicas apropiadas de respuesta a incidentes según el ciclo de vida oficial (NIST SP 800-61 / ISO 27035).',
    domainName: 'Dominio 4: Operaciones de Seguridad'
  };
}

// ==========================================
// PBQ 18: Container & Pod Security
// ==========================================
export function evaluateContainerSecurityPBQ18(state: ContainerHardeningState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const imgCorrect = state.baseImage === 'distroless_minimal';
  breakdown.push({
    id: 'k8s-image',
    label: 'Imagen Base Minimalista (Distroless sin Shell)',
    achieved: imgCorrect,
    points: imgCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: imgCorrect
      ? 'Correcto: Se utilizó una imagen distroless sin gestor de paquetes ni shells de sistema operativo, reduciendo drásticamente la superficie de explotación.'
      : 'Incorrecto: Se debe utilizar una imagen base mínima / distroless para eliminar binarios innecesarios como apt, curl o bash.'
  });

  const userCorrect = state.runAsUser === 'non_root_uid_10001';
  breakdown.push({
    id: 'k8s-user',
    label: 'Usuario No-Root (SecurityContext runAsUser 10001)',
    achieved: userCorrect,
    points: userCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: userCorrect
      ? 'Correcto: El contenedor se ejecuta como un usuario no privilegiado (UID 10001), previniendo privilegios de root en el nodo en caso de escape.'
      : 'Incorrecto: Nunca se debe ejecutar contenedores como root (UID 0) en producción.'
  });

  const secretsCorrect = state.secretsManagement === 'vault_csi_kms';
  breakdown.push({
    id: 'k8s-secrets',
    label: 'Gestión Cifrada de Secretos (Vault / KMS CSI Driver)',
    achieved: secretsCorrect,
    points: secretsCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: secretsCorrect
      ? 'Correcto: Los secretos se inyectan en memoria temporal mediante Vault/KMS CSI Driver sin persistir en texto plano en la imagen o etcd.'
      : 'Incorrecto: Los secretos deben gestionarse con un KMS o bóveda externa inyectada dinámicamente.'
  });

  const netCorrect = state.networkPolicy === 'default_deny_ingress_egress';
  breakdown.push({
    id: 'k8s-network',
    label: 'Política de Red Default-Deny (Microsegmentación K8s)',
    achieved: netCorrect,
    points: netCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: netCorrect
      ? 'Correcto: Se aplicó NetworkPolicy con denegación por defecto (Default-Deny Ingress & Egress), mitigando el movimiento lateral.'
      : 'Incorrecto: Se debe aplicar NetworkPolicy con denegación por defecto y permitir únicamente tráfico explícito entre microservicios.'
  });

  const fsCorrect = state.rootFilesystem === 'readonly_true';
  breakdown.push({
    id: 'k8s-fs',
    label: 'Sistema de Archivos de Solo Lectura (readOnlyRootFilesystem)',
    achieved: fsCorrect,
    points: fsCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: fsCorrect
      ? 'Correcto: El sistema de archivos raíz es inmutable (Read-Only), impidiendo al atacante escribir malware o modificar binarios.'
      : 'Incorrecto: Se debe activar readOnlyRootFilesystem: true para endurecer el contenedor.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Pod endurecido según CIS Benchmark! Has implementado el principio de mínimo privilegio en contenedores e inmutabilidad de ejecución.'
        : `Puntuación obtenida: ${totalScore}/100. Asegura imagen distroless, usuario no-root y readOnlyRootFilesystem activado.`,
    sy0701Objective: 'Objetivo 2.4: Aplicar técnicas de endurecimiento (hardening) en contenedores, microservicios y plataformas en la nube.',
    domainName: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones'
  };
}

// ==========================================
// PBQ 19: Physical Security & Datacenter Design
// ==========================================
export function evaluatePhysicalSecurityPBQ19(state: PhysicalSecurityState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const bollardCorrect = state.perimeterBarrier === 'bollards_k12_reinforced';
  breakdown.push({
    id: 'phys-bollard',
    label: 'Barrera Perimetral Anti-Vehicular (Crash-Rated Bollards K12)',
    achieved: bollardCorrect,
    points: bollardCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: bollardCorrect
      ? 'Correcto: Los bolardos con certificación de impacto K12 detienen ataques vehiculares dirigidos al edificio del datacenter.'
      : 'Incorrecto: Las cercas simples no detienen colisiones vehiculares forzadas; se requieren bolardos reforzados.'
  });

  const mantrapCorrect = state.datacenterEntrance === 'mantrap_biometric_weight';
  breakdown.push({
    id: 'phys-mantrap',
    label: 'Esclusa de Seguridad Mantrap Anti-Tailgating',
    achieved: mantrapCorrect,
    points: mantrapCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: mantrapCorrect
      ? 'Correcto: El mantrap con esclusa de dos puertas, autenticación biométrica y sensor de peso elimina el piggybacking y tailgating.'
      : 'Incorrecto: Se debe utilizar un mantrap (Access Control Vestibule) con control de peso para evitar que pasen dos personas a la vez.'
  });

  const gasCorrect = state.fireSuppression === 'clean_agent_gas';
  breakdown.push({
    id: 'phys-gas',
    label: 'Sistema de Supresión de Incendio por Gas Limpio (FM-200 / Novec)',
    achieved: gasCorrect,
    points: gasCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: gasCorrect
      ? 'Correcto: El gas limpio no conductor extingue el fuego por enfriamiento e interrupción química sin dañar servidores ni dejar residuos.'
      : 'Incorrecto: Cualquier sistema de rociadores (húmedo o seco) descarga agua sobre equipos energizados. En salas de servidores se prefiere un agente limpio (FM-200 / Novec 1230), no conductor y sin residuos.'
  });

  const thermalCorrect = state.thermalManagement === 'hot_cold_aisle_containment';
  breakdown.push({
    id: 'phys-thermal',
    label: 'Confinamiento de Pasillos Fríos y Calientes (Hot/Cold Aisle)',
    achieved: thermalCorrect,
    points: thermalCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: thermalCorrect
      ? 'Correcto: La separación de pasillos fríos y calientes maximiza la eficiencia energética del HVAC y previene puntos calientes.'
      : 'Incorrecto: Se debe implementar la disposición estándar de pasillos fríos y calientes.'
  });

  const faradayCorrect = state.rfShielding === 'faraday_cage_tempest';
  breakdown.push({
    id: 'phys-faraday',
    label: 'Blindaje Electromagnético TEMPEST (Jaula de Faraday)',
    achieved: faradayCorrect,
    points: faradayCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: faradayCorrect
      ? 'Correcto: El blindaje metálico con toma a tierra atenúa radiaciones electromagnéticas impidiendo escuchas remotas no autorizadas.'
      : 'Incorrecto: La protección contra emisiones TEMPEST requiere una jaula de Faraday apantallada.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Centro de datos protegido al máximo estándar Tier III/IV! Has implementado defensa física en profundidad, supresión limpia y control anti-tailgating.'
        : `Puntuación obtenida: ${totalScore}/100. Asegura mantrap con biometría, supresión por gas limpio y bolardos de impacto.`,
    sy0701Objective: 'Objetivo 3.4: Explicar la importancia de la seguridad física de las instalaciones y aplicar controles ambientales apropiados.',
    domainName: 'Dominio 3: Arquitectura de Seguridad'
  };
}

// ==========================================
// PBQ 20: Disaster Recovery & Continuity
// ==========================================
export function evaluateDisasterRecoveryPBQ20(state: DisasterRecoveryState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const rtoCorrect = state.targetRto === 'rto_under_2_hours';
  breakdown.push({
    id: 'dr-rto',
    label: 'Métrica RTO (Recovery Time Objective < 2 Horas)',
    achieved: rtoCorrect,
    points: rtoCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: rtoCorrect
      ? 'Correcto: Para cumplir con un SLA de alta disponibilidad 99.99%, el RTO no puede superar las 2 horas de caída.'
      : 'Incorrecto: Para servicios transaccionales críticos el RTO debe ser menor a 2 horas.'
  });

  const rpoCorrect = state.targetRpo === 'rpo_15_minutes';
  breakdown.push({
    id: 'dr-rpo',
    label: 'Métrica RPO (Recovery Point Objective <= 15 Minutos)',
    achieved: rpoCorrect,
    points: rpoCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: rpoCorrect
      ? 'Correcto: Un RPO de 15 minutos garantiza que ante un fallo de disco no se pierdan más de 15 minutos de transacciones financieras.'
      : 'Incorrecto: El RPO define la tolerancia de pérdida de datos; 24 horas implicaría perder un día entero de clientes.'
  });

  const siteCorrect = state.recoverySiteType === 'hot_site_mirrored';
  breakdown.push({
    id: 'dr-site',
    label: 'Sitio Alternativo Hot Site con Replicación Síncrona',
    achieved: siteCorrect,
    points: siteCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: siteCorrect
      ? 'Correcto: Un Hot Site activo con datos sincronizados permite failover casi instantáneo con mínimo downtime.'
      : 'Incorrecto: Un Cold Site tarda días en activarse y un Warm Site horas; solo el Hot Site cumple RTO < 2h.'
  });

  const backupCorrect = state.backupRule === 'rule_3_2_1';
  breakdown.push({
    id: 'dr-backup',
    label: 'Metodología de Respaldos Regla 3-2-1',
    achieved: backupCorrect,
    points: backupCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: backupCorrect
      ? 'Correcto: 3 copias de datos en 2 medios distintos con 1 copia offsite es el estándar indiscutible de resiliencia.'
      : 'Incorrecto: Se debe aplicar la regla estándar 3-2-1 para evitar pérdida total por fallos locales.'
  });

  const wormCorrect = state.immutabilityControl === 'worm_immutable_lock';
  breakdown.push({
    id: 'dr-worm',
    label: 'Almacenamiento Inmutable WORM contra Ransomware',
    achieved: wormCorrect,
    points: wormCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: wormCorrect
      ? 'Correcto: La tecnología Write Once Read Many (WORM) bloquea la sobrescritura y borrado de respaldos por malware.'
      : 'Incorrecto: Se debe exigir almacenamiento inmutable WORM con air-gap para que el ransomware no pueda destruir las copias de seguridad.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Estrategia de resiliencia y DRP perfecta! Cumple plenamente con RTO/RPO exigentes, Hot Site redundante e inmutabilidad contra ransomware.'
        : `Puntuación obtenida: ${totalScore}/100. Asegura seleccionar Hot Site, regla 3-2-1 e inmutabilidad WORM.`,
    sy0701Objective: 'Objetivo 5.3: Explicar conceptos de continuidad del negocio, recuperación ante desastres y cálculos de resiliencia operacional.',
    domainName: 'Dominio 5: Gestión y Supervisión de Programas de Seguridad'
  };
}

// ==========================================
// PBQ 21: Social Engineering & Human Factors
// ==========================================
export function evaluateSocialEngineeringPBQ21(cases: SocialEngineeringCase[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const c1 = cases.find((c) => c.id === 'case-smishing');
  const c1Correct =
    c1?.selectedAttackType === 'smishing' &&
    c1?.selectedInfluencePrinciple === 'urgency' &&
    c1?.selectedMitigation === 'security_awareness_smishing';
  breakdown.push({
    id: 'case-1-smishing',
    label: 'Caso 1: Alerta SMS Falsa de Banco (Smishing + Urgencia)',
    achieved: c1Correct,
    points: c1Correct ? 25 : 0,
    maxPoints: 25,
    explanation: c1Correct
      ? 'Correcto: Se identificó Smishing (SMS phishing) con principio de urgencia y concientización para no pulsar enlaces móviles.'
      : 'Incorrecto: Mensajes SMS maliciosos corresponden a Smishing y explotan el principio de Urgencia.'
  });

  const c2 = cases.find((c) => c.id === 'case-vishing');
  const c2Correct =
    c2?.selectedAttackType === 'vishing' &&
    c2?.selectedInfluencePrinciple === 'authority' &&
    c2?.selectedMitigation === 'verify_out_of_band';
  breakdown.push({
    id: 'case-2-vishing',
    label: 'Caso 2: Llamada del "CEO" para Tarjetas de Regalo (Vishing + Autoridad)',
    achieved: c2Correct,
    points: c2Correct ? 25 : 0,
    maxPoints: 25,
    explanation: c2Correct
      ? 'Correcto: Es un ataque de Vishing que explota el principio de Autoridad; la mitigación es verificación fuera de banda al teléfono oficial.'
      : 'Incorrecto: Una llamada telefónica fingiendo ser un superior es Vishing bajo el principio de Autoridad.'
  });

  const c3 = cases.find((c) => c.id === 'case-whaling');
  const c3Correct =
    c3?.selectedAttackType === 'whaling_bec' &&
    c3?.selectedInfluencePrinciple === 'trust_consensus' &&
    c3?.selectedMitigation === 'dual_authorization_wire';
  breakdown.push({
    id: 'case-3-whaling',
    label: 'Caso 3: Fraude de Cuenta Proveedor a Finanzas (Whaling / BEC + Confianza)',
    achieved: c3Correct,
    points: c3Correct ? 25 : 0,
    maxPoints: 25,
    explanation: c3Correct
      ? 'Correcto: Ataque dirigido Business Email Compromise (BEC / Whaling) mitigado con doble autorización para cambios de cuentas bancarias.'
      : 'Incorrecto: El fraude por suplantación de proveedores en transferencias es Business Email Compromise (BEC).'
  });

  const c4 = cases.find((c) => c.id === 'case-baiting');
  const c4Correct =
    c4?.selectedAttackType === 'baiting_usb' &&
    c4?.selectedInfluencePrinciple === 'scarcity_curiosity' &&
    c4?.selectedMitigation === 'disable_autorun_usb_blocking';
  breakdown.push({
    id: 'case-4-baiting',
    label: 'Caso 4: USB en Estacionamiento "Bonos" (Baiting + Curiosidad)',
    achieved: c4Correct,
    points: c4Correct ? 25 : 0,
    maxPoints: 25,
    explanation: c4Correct
      ? 'Correcto: Se catalogó como Baiting (señuelo físico) explotando la curiosidad, mitigado mediante bloqueo por GPO de puertos USB y AutoRun.'
      : 'Incorrecto: Dejar dispositivos USB con etiquetas atractivas es Baiting y se neutraliza deshabilitando AutoRun y bloqueando USBs.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Análisis de ingeniería social impecable! Has correlacionado el vector técnico con el factor psicológico humano de influencia de CompTIA SY0-701.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda: SMS=Smishing, Voz=Vishing, Alta dirección=Whaling/BEC, USB en suelo=Baiting.`,
    sy0701Objective: 'Objetivo 2.1: Comparar y contrastar tipos comunes de amenazas de ingeniería social y principios humanos de influencia.',
    domainName: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones'
  };
}

// ==========================================
// PBQ 22: Digital Forensics & Order of Volatility (RFC 3227)
// ==========================================
export function evaluateDigitalForensicsPBQ22(state: ForensicVerificationState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  // Expected Volatility Sequence (RFC 3227):
  // 1. ev-cpu (CPU registers, cache)
  // 2. ev-ram (RAM, routing table, ARP cache, active process table)
  // 3. ev-swap (Swap space / pagefile, temp filesystem)
  // 4. ev-disk (Local hard drive / non-volatile SSD)
  // 5. ev-remote (Remote logs, SIEM, firewall logs)
  // 6. ev-tapes (Physical backup tapes / archival media)
  const expectedOrder = ['ev-cpu', 'ev-ram', 'ev-swap', 'ev-disk', 'ev-remote', 'ev-tapes'];
  const actualOrder = state.evidenceItems.map((e) => e.id);

  let orderCorrectCount = 0;
  for (let i = 0; i < expectedOrder.length; i++) {
    if (actualOrder[i] === expectedOrder[i]) {
      orderCorrectCount++;
    }
  }

  const orderScore = Math.round((orderCorrectCount / 6) * 60);
  breakdown.push({
    id: 'forensic-order',
    label: `Secuencia del Orden de Volatilidad RFC 3227 (${orderCorrectCount}/6 correctos)`,
    achieved: orderCorrectCount >= 5,
    points: orderScore,
    maxPoints: 60,
    explanation:
      orderCorrectCount === 6
        ? 'Correcto: La secuencia cumple exactamente con RFC 3227: Registros CPU -> Memoria RAM -> Espacio Swap -> Disco Local -> Logs Remotos -> Cintas de Archivo.'
        : `Incorrecto: Obtuviste ${orderCorrectCount}/6 posiciones correctas. Recuerda que la información en memoria volátil (CPU/RAM) se pierde de inmediato si se apaga el servidor.`
  });

  const writeBlockerCorrect = state.writeBlockerUsed === true;
  breakdown.push({
    id: 'forensic-write-blocker',
    label: 'Uso de Bloqueador de Escritura Físico (Write Blocker)',
    achieved: writeBlockerCorrect,
    points: writeBlockerCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: writeBlockerCorrect
      ? 'Correcto: Se utilizó un bloqueador de hardware para impedir la alteración de metadatos o marcas de tiempo en el disco incautado.'
      : 'Incorrecto: Se debe activar el uso de un Hardware Write Blocker antes de adquirir imágenes de disco.'
  });

  const hashCorrect = state.selectedHashAlgorithm === 'sha256';
  breakdown.push({
    id: 'forensic-hash',
    label: 'Algoritmo Criptográfico de Integridad (SHA-256)',
    achieved: hashCorrect,
    points: hashCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: hashCorrect
      ? 'Correcto: SHA-256 es el algoritmo de hash criptográfico estándar para validar que la imagen forense no sufrió modificaciones.'
      : 'Incorrecto: MD5 y SHA-1 son vulnerables a colisiones; se debe seleccionar SHA-256 para integridad judicial.'
  });

  const chainCorrect = state.chainOfCustodySignoff === true;
  breakdown.push({
    id: 'forensic-chain',
    label: 'Registro y Firma de Cadena de Custodia',
    achieved: chainCorrect,
    points: chainCorrect ? 10 : 0,
    maxPoints: 10,
    explanation: chainCorrect
      ? 'Correcto: El formulario de cadena de custodia fue firmado y documentado, garantizando admisibilidad judicial.'
      : 'Incorrecto: Sin cadena de custodia documentada, la evidencia queda invalidada ante un tribunal.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Procedimiento forense impecable! Has respetado el orden de volatilidad RFC 3227 y garantizado la integridad criptográfica y cadena de custodia.'
        : `Puntuación obtenida: ${totalScore}/100. Revisa la secuencia de volatilidad (CPU -> RAM -> Swap -> Disco -> Logs) y el uso de SHA-256.`,
    sy0701Objective: 'Objetivo 4.5: Explicar aspectos clave de la informática forense digital y aplicar la cadena de custodia y orden de volatilidad.',
    domainName: 'Dominio 4: Operaciones de Seguridad'
  };
}

// ==========================================
// PBQ 23: Quantitative Risk Assessment
// ==========================================
export function evaluateRiskManagementPBQ23(state: RiskManagementState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  // SLE = AV × EF, ALE = SLE × ARO (values are randomized per attempt)
  const ef = state.exposureFactorPercent / 100;
  const expectedSle = Math.round(state.assetValue * ef);
  const expectedAle = Math.round(expectedSle * state.aroValue);
  const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

  const sleCorrect = Math.abs(state.calculatedSleInput - expectedSle) < 1;
  breakdown.push({
    id: 'risk-sle',
    label: `Cálculo de Expectativa de Pérdida Única (SLE = ${usd(expectedSle)})`,
    achieved: sleCorrect,
    points: sleCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: sleCorrect
      ? `Correcto: SLE = Valor del Activo (${usd(state.assetValue)}) × Factor de Exposición (${ef}) = ${usd(expectedSle)}.`
      : `Incorrecto: Ingresaste ${usd(state.calculatedSleInput || 0)}. El valor exacto es ${usd(expectedSle)} (${usd(state.assetValue)} × ${ef}). Error típico: usar el EF como porcentaje entero en lugar de decimal.`
  });

  const aleCorrect = Math.abs(state.calculatedAleInput - expectedAle) < 1;
  breakdown.push({
    id: 'risk-ale',
    label: `Cálculo de Expectativa de Pérdida Anualizada (ALE = ${usd(expectedAle)})`,
    achieved: aleCorrect,
    points: aleCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: aleCorrect
      ? `Correcto: ALE = SLE (${usd(expectedSle)}) × ARO (${state.aroValue}) = ${usd(expectedAle)} anuales.`
      : `Incorrecto: Ingresaste ${usd(state.calculatedAleInput || 0)}. El valor exacto es ${usd(expectedAle)} (${usd(expectedSle)} × ${state.aroValue}). Si el evento ocurre una vez cada N años, ARO = 1/N.`
  });

  const treat1Correct = state.treatmentThreat1 === 'mitigate';
  const treat2Correct = state.treatmentThreat2 === 'transfer';
  const treat3Correct = state.treatmentThreat3 === 'accept';
  const treat4Correct = state.treatmentThreat4 === 'avoid';

  const treatmentCorrectCount =
    (treat1Correct ? 1 : 0) +
    (treat2Correct ? 1 : 0) +
    (treat3Correct ? 1 : 0) +
    (treat4Correct ? 1 : 0);

  breakdown.push({
    id: 'risk-treatments',
    label: `Estrategias de Tratamiento de Riesgo (${treatmentCorrectCount}/4 correctas)`,
    achieved: treatmentCorrectCount >= 3,
    points: treatmentCorrectCount * 12.5,
    maxPoints: 50,
    explanation:
      treatmentCorrectCount === 4
        ? 'Correcto: 1. Energía = Mitigar (UPS/Generador); 2. Demandas = Transferir (Seguro); 3. Error menor = Aceptar (Tolerancia); 4. FTP inseguro = Evitar (Apagar servicio).'
        : `Incorrecto: Tuviste ${treatmentCorrectCount} de 4 estrategias correctas. Revisa cuándo se debe mitigar, transferir, aceptar o evitar.`
  });

  const totalScore = Math.round(breakdown.reduce((acc, curr) => acc + curr.points, 0));

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Dominio completo de análisis cuantitativo de riesgos! Has aplicado las fórmulas SLE = AV × EF y ALE = SLE × ARO y seleccionado los tratamientos correctos.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda: SLE = AV × EF = ${usd(expectedSle)}; ALE = SLE × ARO = ${usd(expectedAle)}. Seguros = Transferir; controles = Mitigar.`,
    sy0701Objective: 'Objetivo 5.2: Explicar elementos clave de la gestión del riesgo de seguridad e interpretar fórmulas de riesgo cuantitativo.',
    domainName: 'Dominio 5: Gestión y Supervisión de Programas de Seguridad'
  };
}

// ==========================================
// PBQ 24: Email Security (SPF, DKIM, DMARC, STARTTLS & S/MIME)
// ==========================================
export function evaluateEmailSecurityPBQ24(state: EmailSecurityState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const spfCorrect = state.spfPolicy === 'spf_hard_fail_dash_all';
  breakdown.push({
    id: 'email-spf',
    label: 'Directiva Estricta SPF con HardFail (-all)',
    achieved: spfCorrect,
    points: spfCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: spfCorrect
      ? 'Correcto: Se utilizó el calificador estricto "-all" (HardFail), garantizando que correos enviados por servidores no autorizados sean rechazados.'
      : 'Incorrecto: Para frenar el spoofing se requiere terminación "-all" (HardFail) en el registro TXT de SPF.'
  });

  const dkimCorrect = state.dkimSelector === 'dkim_rsa_sha256_public_key';
  breakdown.push({
    id: 'email-dkim',
    label: 'Publicación de Clave Pública DKIM para Firma Asimétrica',
    achieved: dkimCorrect,
    points: dkimCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: dkimCorrect
      ? 'Correcto: Se publicó la clave pública RSA en el registro TXT de DKIM para que los servidores destinatarios verifiquen la firma criptográfica del cuerpo y cabeceras.'
      : 'Incorrecto: En el DNS público solo se publica la clave pública DKIM (nunca la clave privada ni algoritmos obsoletos como MD5).'
  });

  const dmarcPolicyCorrect = state.dmarcAction === 'dmarc_reject_aggregate_rua';
  breakdown.push({
    id: 'email-dmarc-policy',
    label: 'Directiva DMARC Estricta (p=reject con rua)',
    achieved: dmarcPolicyCorrect,
    points: dmarcPolicyCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: dmarcPolicyCorrect
      ? 'Correcto: La política "p=reject" ordena a los servidores de correo del mundo descartar inmediatamente cualquier mensaje que falle SPF/DKIM y enviar informes agregados (rua).'
      : 'Incorrecto: "p=none" solo observa y "p=quarantine" lo envía a spam; para mitigar ataques de spoofing y BEC se debe configurar "p=reject".'
  });

  const starttlsCorrect = state.mailTransportEncryption === 'starttls_port_587';
  breakdown.push({
    id: 'email-starttls',
    label: 'Puerto de Submission Seguro con STARTTLS (Puerto 587)',
    achieved: starttlsCorrect,
    points: starttlsCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: starttlsCorrect
      ? 'Correcto: El puerto 587 con STARTTLS y autenticación obligatoria es el estándar IANA/CompTIA para envío seguro de correos por clientes autenticados.'
      : 'Incorrecto: El puerto 25 tradicional transmite en texto plano y está restringido entre MTAs; los clientes deben usar puerto 587 con STARTTLS.'
  });

  const smimeCorrect = state.endUserMailCrypto === 'smime_x509_certificates';
  breakdown.push({
    id: 'email-smime',
    label: 'Cifrado y Firma Digital E2E de Usuario con S/MIME',
    achieved: smimeCorrect,
    points: smimeCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: smimeCorrect
      ? 'Correcto: S/MIME utiliza certificados digitales X.509 de usuario para cifrar el mensaje extremo a extremo y garantizar no-repudio mediante firma digital.'
      : 'Incorrecto: TLS solo cifra el tránsito entre saltos de servidores; para confidencialidad de extremo a extremo y no-repudio de usuario se exige S/MIME.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Defensa de correo electrónico impenetrable! Has blindado el dominio corporativo con SPF HardFail (-all), DKIM con clave pública RSA, DMARC p=reject con reportes rua, Submission STARTTLS en puerto 587 y S/MIME con certificados X.509.'
        : `Puntuación obtenida: ${totalScore}/100. En CompTIA: SPF usa -all; DKIM publica la clave pública; DMARC usa p=reject; el puerto de envío seguro es 587 STARTTLS; y el cifrado E2E es S/MIME.`,
    sy0701Objective: 'Objetivo 3.3: Configurar e interpretar controles de seguridad para la autenticación y protección del correo electrónico.',
    domainName: 'Dominio 3: Arquitectura de Seguridad'
  };
}

// ==========================================
// PBQ 25: Security CLI & Terminal Diagnostics
// ==========================================
export function evaluateSecurityCliPBQ25(scenarios: SecurityCliScenario[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const answersMap: Record<string, string> = {
    'cli-ports': 'netstat_tulpn',
    'cli-sniff': 'tcpdump_eth0',
    'cli-hash': 'sha256sum',
    'cli-permissions': 'chmod_600_root',
  };

  const labelsMap: Record<string, string> = {
    'cli-ports': 'Identificación de Puertos y Procesos Escuchando (netstat -tulpn / ss)',
    'cli-sniff': 'Captura y Análisis de Paquetes en Vivo (tcpdump -i eth0 -nn -s0)',
    'cli-hash': 'Verificación de Integridad de Binarios del Sistema (sha256sum)',
    'cli-permissions': 'Endurecimiento de Permisos Críticos en Archivos (chmod 600 /etc/shadow)',
  };

  scenarios.forEach((sc) => {
    const expected = answersMap[sc.id];
    const isCorrect = sc.selectedCommand === expected;
    breakdown.push({
      id: sc.id,
      label: labelsMap[sc.id] || sc.investigationGoal,
      achieved: isCorrect,
      points: isCorrect ? 25 : 0,
      maxPoints: 25,
      explanation: isCorrect
        ? 'Correcto: Se seleccionó el comando exacto con los flags apropiados de auditoría de seguridad.'
        : `Incorrecto: Se esperaba el comando ${expected}. Revisa la utilidad de netstat, tcpdump, sha256sum y permisos chmod/chown.`
    });
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Habilidades de consola y terminal de seguridad perfectas! Has utilizado netstat, tcpdump, sha256sum y chmod/chown con precisión técnica de examen.'
        : `Puntuación obtenida: ${totalScore}/100. Asegura identificar los flags de netstat (-tulpn) y la sintaxis de tcpdump y chmod 600.`,
    sy0701Objective: 'Objetivo 4.2: Dados un escenario, usar las herramientas de software y comandos de terminal apropiados para evaluar la seguridad de la organización.',
    domainName: 'Dominio 4: Operaciones de Seguridad'
  };
}

// ==========================================
// PBQ 26: IDS Snort & YARA Rule Engineering
// ==========================================
export function evaluateIdsYaraRulesPBQ26(state: IdsYaraState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const snortActionCorrect = state.snortAction === 'drop';
  breakdown.push({
    id: 'snort-action',
    label: 'Acción de Prevención NIPS Snort (drop)',
    achieved: snortActionCorrect,
    points: snortActionCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: snortActionCorrect
      ? 'Correcto: Se configuró la acción "drop" en el sensor en línea para bloquear activamente paquetes que contengan inyecciones SQL.'
      : 'Incorrecto: La acción "alert" solo registra el ataque sin detenerlo; en un IPS perimetral se requiere "drop".'
  });

  const snortContentCorrect = state.snortContentMatch === 'UNION SELECT' && state.snortNocase === true;
  breakdown.push({
    id: 'snort-content',
    label: 'Patrón de Detección de Contenido y Modificador nocase',
    achieved: snortContentCorrect,
    points: snortContentCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: snortContentCorrect
      ? 'Correcto: Se seleccionó "UNION SELECT" con el flag nocase para detectar cualquier variante de mayúsculas/minúsculas.'
      : 'Incorrecto: Se debe buscar la firma "UNION SELECT" acompañada del modificador nocase para evitar evasiones.'
  });

  const yaraMagicCorrect = state.yaraMagicHeader === '0x5A4D';
  breakdown.push({
    id: 'yara-magic',
    label: 'Encabezado de Ejecutable Windows PE en YARA (0x5A4D / MZ)',
    achieved: yaraMagicCorrect,
    points: yaraMagicCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: yaraMagicCorrect
      ? 'Correcto: 0x5A4D corresponde a los dos primeros bytes "MZ" que identifican a todos los binarios ejecutables PE de Windows.'
      : 'Incorrecto: El magic number estándar de ejecutables Windows en reglas YARA es uint16(0) == 0x5A4D.'
  });

  const yaraStringCorrect = state.yaraStringMatch === 'cmd.exe /c powershell -enc';
  breakdown.push({
    id: 'yara-string',
    label: 'Cadena de Invocación Maliciosa en YARA',
    achieved: yaraStringCorrect,
    points: yaraStringCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: yaraStringCorrect
      ? 'Correcto: La invocación de cmd.exe para ejecutar PowerShell con payloads en Base64 (-enc) es un IoC crítico de malware.'
      : 'Incorrecto: Se debe buscar la cadena sospechosa "cmd.exe /c powershell -enc".'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Reglas de detección impecables! Has construido una firma Snort de bloqueo NIPS efectiva y una regla YARA precisa para binarios PE.'
        : `Puntuación obtenida: ${totalScore}/100. Asegura acción "drop", flag nocase y magic header 0x5A4D (MZ).`,
    sy0701Objective: 'Objetivo 4.3: Configurar e interpretar reglas de detección basadas en firmas y heurísticas para IDS/IPS y análisis de malware.',
    domainName: 'Dominio 4: Operaciones de Seguridad'
  };
}

// ==========================================
// PBQ 27: DevSecOps CI/CD Pipeline
// ==========================================
export function evaluateDevSecOpsPBQ27(state: DevSecOpsState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const codeCorrect = state.codeCommitControl === 'secret_scanning_hooks';
  breakdown.push({
    id: 'pipe-commit',
    label: 'Fase Code/Commit: Pre-commit Hooks & Secret Scanning',
    achieved: codeCorrect,
    points: codeCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: codeCorrect
      ? 'Correcto: El escaneo de secretos local en hooks pre-commit evita que credenciales y API keys se suban al repositorio Git.'
      : 'Incorrecto: En la fase de Commit se aplican hooks pre-commit y herramientas de Secret Scanning (TruffleHog/GitGuardian).'
  });

  const buildCorrect = state.buildStageControl === 'sast_sca_analysis';
  breakdown.push({
    id: 'pipe-build',
    label: 'Fase Build: Análisis Estático SAST y Dependencias SCA (SBOM)',
    achieved: buildCorrect,
    points: buildCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: buildCorrect
      ? 'Correcto: SAST examina el código fuente compilado y SCA analiza vulnerabilidades conocidas en librerías de terceros (Software Bill of Materials).'
      : 'Incorrecto: Durante la compilación (Build) se ejecutan SAST (SonarQube) y SCA (Snyk/Dependabot).'
  });

  const testCorrect = state.testStageControl === 'dast_runtime_scan';
  breakdown.push({
    id: 'pipe-test',
    label: 'Fase Test: Análisis Dinámico en Tiempo de Ejecución (DAST)',
    achieved: testCorrect,
    points: testCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: testCorrect
      ? 'Correcto: DAST evalúa la aplicación web en ejecución activa en entorno de staging simulando ataques reales (Caja Negra).'
      : 'Incorrecto: En la fase de pruebas y staging se aplica DAST (Dynamic Application Security Testing - OWASP ZAP).'
  });

  const deployCorrect = state.deployStageControl === 'image_signing_rasp';
  breakdown.push({
    id: 'pipe-deploy',
    label: 'Fase Deploy/Release: Firma Criptográfica de Contenedores & RASP',
    achieved: deployCorrect,
    points: deployCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: deployCorrect
      ? 'Correcto: Se verifica la firma de imágenes (Cosign) para evitar manipulación en el registro y se activa RASP en producción.'
      : 'Incorrecto: En la fase de despliegue se exige firma criptográfica de contenedores y protección RASP en tiempo de ejecución.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Pipeline DevSecOps alineado al 100% con Shift-Left! Has posicionado Secret Scanning, SAST, SCA, DAST y firma de contenedores en sus fases exactas.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda: Commit=Secret Scanning, Build=SAST/SCA, Test=DAST, Deploy=Firma de imágenes.`,
    sy0701Objective: 'Objetivo 2.4 / 3.1: Explicar conceptos de seguridad en el ciclo de vida de desarrollo de software (SDLC) y pipelines DevSecOps.',
    domainName: 'Dominio 3: Arquitectura de Seguridad'
  };
}

// ==========================================
// PBQ 28: Cryptographic Attacks & Countermeasures
// ==========================================
export function evaluateCryptoAttacksPBQ28(cases: CryptoAttackCase[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const c1 = cases.find((c) => c.id === 'atk-rainbow');
  const c1Correct =
    c1?.selectedAttackType === 'rainbow_table' &&
    c1?.selectedCountermeasure === 'salting_key_stretching';
  breakdown.push({
    id: 'c1-rainbow',
    label: 'Caso 1: Craqueo por Tablas Precomputadas (Rainbow Tables + Salting)',
    achieved: c1Correct,
    points: c1Correct ? 25 : 0,
    maxPoints: 25,
    explanation: c1Correct
      ? 'Correcto: Se identificó Rainbow Tables y se mitigó con Salting aleatorio único y algoritmos lentos de Key Stretching (bcrypt / Argon2).'
      : 'Incorrecto: Las tablas precomputadas de hashes son Rainbow Tables y se inutilizan añadiendo Salt a cada contraseña.'
  });

  const c2 = cases.find((c) => c.id === 'atk-birthday');
  const c2Correct =
    c2?.selectedAttackType === 'birthday_collision' &&
    c2?.selectedCountermeasure === 'sha256_larger_space';
  breakdown.push({
    id: 'c2-birthday',
    label: 'Caso 2: Colisión de Dos Mensajes Distintos (Birthday Attack + SHA-256)',
    achieved: c2Correct,
    points: c2Correct ? 25 : 0,
    maxPoints: 25,
    explanation: c2Correct
      ? 'Correcto: La paradoja del cumpleaños explota colisiones de hash (h(m1) == h(m2)) en SHA-1; la solución es migrar a SHA-256 (espacio 2^256).'
      : 'Incorrecto: Generar el mismo hash con dos textos distintos es un Birthday/Collision Attack y se mitiga usando familias SHA-256/512.'
  });

  const c3 = cases.find((c) => c.id === 'atk-replay');
  const c3Correct =
    c3?.selectedAttackType === 'replay_attack' &&
    c3?.selectedCountermeasure === 'session_nonces_timestamp';
  breakdown.push({
    id: 'c3-replay',
    label: 'Caso 3: Retransmisión de Tokens de Sesión (Replay Attack + Nonces)',
    achieved: c3Correct,
    points: c3Correct ? 25 : 0,
    maxPoints: 25,
    explanation: c3Correct
      ? 'Correcto: El atacante reenvía una trama capturada; se neutraliza con Nonces de un solo uso, Timestamps y tickets con expiración (Kerberos).'
      : 'Incorrecto: La retransmisión de paquetes válidos es un Replay Attack y se mitiga con Nonces y marcas de tiempo.'
  });

  const c4 = cases.find((c) => c.id === 'atk-downgrade');
  const c4Correct =
    c4?.selectedAttackType === 'downgrade_attack' &&
    c4?.selectedCountermeasure === 'hsts_disable_legacy';
  breakdown.push({
    id: 'c4-downgrade',
    label: 'Caso 4: Forzado de Negociación Débil (Downgrade Attack + HSTS)',
    achieved: c4Correct,
    points: c4Correct ? 25 : 0,
    maxPoints: 25,
    explanation: c4Correct
      ? 'Correcto: Forzar la negociación a suites obsoletas (POODLE / SSLv3) es un Downgrade Attack; se mitiga con HSTS y deshabilitando protocolos legados.'
      : 'Incorrecto: Degradar la conexión a versiones vulnerables es un Downgrade Attack y se frena exigiendo HSTS y apagando SSLv3/TLS 1.0.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Criptoanálisis y mitigaciones dominados al 100%! Has identificado correctamente Rainbow Tables, Birthday Collision, Replay y Downgrade attacks.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda asociar Salting a Rainbow Tables, SHA-256 a Colisiones y Nonces a Replay attacks.`,
    sy0701Objective: 'Objetivo 1.4 / 2.2: Comparar y contrastar tipos comunes de ataques criptográficos y seleccionar las contramedidas adecuadas.',
    domainName: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones'
  };
}

// ==========================================
// PBQ 29: Federated Identity, SSO & Tokens
// ==========================================
export function evaluateIdentityFederationPBQ29(state: FederationState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const samlCorrect = state.enterpriseSsoProtocol === 'saml_20';
  breakdown.push({
    id: 'fed-saml',
    label: 'Single Sign-On Empresarial Web (SAML 2.0 XML Assertions)',
    achieved: samlCorrect,
    points: samlCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: samlCorrect
      ? 'Correcto: SAML 2.0 es el estándar empresarial por excelencia para federación web entre Identity Providers (IdP) y Service Providers (SP).'
      : 'Incorrecto: Para SSO corporativo en aplicaciones SaaS (Salesforce/Workday) se utiliza SAML 2.0.'
  });

  const oauthCorrect = state.apiAuthorizationProtocol === 'oauth_20';
  breakdown.push({
    id: 'fed-oauth',
    label: 'Autorización Granular de APIs (OAuth 2.0 Bearer Tokens)',
    achieved: oauthCorrect,
    points: oauthCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: oauthCorrect
      ? 'Correcto: OAuth 2.0 es el estándar de autorización que emite Access Tokens con alcances (scopes) específicos sin exponer credenciales.'
      : 'Incorrecto: Para delegación y autorización de APIs de terceros se utiliza OAuth 2.0.'
  });

  const oidcCorrect = state.modernMobileAuthProtocol === 'oidc_jwt';
  breakdown.push({
    id: 'fed-oidc',
    label: 'Capa de Identidad Móvil / SPA (OpenID Connect JWT)',
    achieved: oidcCorrect,
    points: oidcCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: oidcCorrect
      ? 'Correcto: OIDC añade una capa de autenticación sobre OAuth 2.0 proporcionando ID Tokens firmados en formato JSON Web Token (JWT).'
      : 'Incorrecto: Para autenticación e identidad moderna en aplicaciones móviles y SPAs se utiliza OpenID Connect (OIDC).'
  });

  const scimCorrect = state.automatedProvisioningProtocol === 'scim_standard';
  breakdown.push({
    id: 'fed-scim',
    label: 'Aprovisionamiento Automático de Cuentas (SCIM RFC 7643)',
    achieved: scimCorrect,
    points: scimCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: scimCorrect
      ? 'Correcto: SCIM estandariza el alta, modificación y revocación inmediata de identidades a través de múltiples nubes cuando un empleado es desvinculado.'
      : 'Incorrecto: El protocolo estándar para aprovisionamiento automatizado entre dominios es SCIM (System for Cross-domain Identity Management).'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Arquitectura de identidades federadas impecable! Has diferenciado con precisión SAML 2.0, OAuth 2.0, OIDC y SCIM según CompTIA SY0-701.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda: SAML=SSO Web XML, OAuth=Autorización API, OIDC=Identidad JWT, SCIM=Aprovisionamiento.`,
    sy0701Objective: 'Objetivo 1.3: Explicar soluciones comunes de autenticación, autorización e identidad federada en la nube.',
    domainName: 'Dominio 1: Conceptos Generales de Seguridad'
  };
}

// ==========================================
// PBQ 30: Mobile Security & MDM/MAM Policies
// ==========================================
export function evaluateMobileSecurityPBQ30(state: MobileSecurityState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const wipeCorrect = state.byodWipePolicy === 'selective_wipe';
  breakdown.push({
    id: 'mob-wipe',
    label: 'Borrado Remoto Selectivo en BYOD (Enterprise Selective Wipe)',
    achieved: wipeCorrect,
    points: wipeCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: wipeCorrect
      ? 'Correcto: El borrado selectivo elimina únicamente los correos y documentos corporativos sin violar la privacidad ni borrar fotos del usuario.'
      : 'Incorrecto: En dispositivos personales (BYOD) se aplica Enterprise Selective Wipe; el borrado completo de fábrica (Full Wipe) solo es para equipos corporativos (COPE).'
  });

  const mamCorrect = state.applicationContainerization === 'mam_container_sandbox';
  breakdown.push({
    id: 'mob-mam',
    label: 'Contenedorización y Sandboxing de Aplicaciones (MAM)',
    achieved: mamCorrect,
    points: mamCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: mamCorrect
      ? 'Correcto: MAM aisla las aplicaciones de la empresa en un sandbox cifrado impidiendo copiar datos corporativos hacia aplicaciones personales.'
      : 'Incorrecto: Para prevenir fugas de datos entre apps se debe aplicar MAM (Mobile Application Management) con sandboxing.'
  });

  const rootCorrect = state.jailbreakRootPolicy === 'block_and_quarantine';
  breakdown.push({
    id: 'mob-root',
    label: 'Detección de Jailbreak / Root y Cuarentena Inmediata',
    achieved: rootCorrect,
    points: rootCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: rootCorrect
      ? 'Correcto: Los dispositivos con root o jailbreak eluden las protecciones del kernel y deben ser bloqueados y puestos en cuarentena de inmediato.'
      : 'Incorrecto: Dispositivos modificados (Root/Jailbreak) representan un riesgo crítico y deben ser puestos en cuarentena automática.'
  });

  const geoCorrect = state.geofencingPolicy === 'disable_camera_microphone';
  breakdown.push({
    id: 'mob-geo',
    label: 'Control por Geocerca (Geofencing en Instalaciones Seguras)',
    achieved: geoCorrect,
    points: geoCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: geoCorrect
      ? 'Correcto: El geofencing desactiva automáticamente las cámaras y micrófonos cuando el dispositivo entra físicamente a un centro de datos seguro.'
      : 'Incorrecto: Dentro de instalaciones críticas se utiliza Geofencing para deshabilitar automáticamente cámaras y micrófonos.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Políticas de movilidad corporativa blindadas! Has implementado borrado selectivo BYOD, MAM sandboxing, mitigación de Root y Geofencing.'
        : `Puntuación obtenida: ${totalScore}/100. Asegura Selective Wipe para BYOD, MAM para sandboxing y Geofencing para desactivar cámaras.`,
    sy0701Objective: 'Objetivo 3.2: Configurar directivas y controles de seguridad para dispositivos móviles (MDM/MAM/BYOD).',
    domainName: 'Dominio 3: Arquitectura de Seguridad'
  };
}

// ==========================================
// PBQ 31: Port Security & Protocol Hardening (CompTIA Port Mastery)
// ==========================================
export function evaluatePortSecurityPBQ31(items: PortAuditItem[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const expectedMap: Record<
    string,
    {
      label: string;
      insecurity: string;
      port: number;
      protocol: string;
      remediation: string;
      insecurityExp: string;
      solutionExp: string;
    }
  > = {
    'port-telnet': {
      label: 'Servicio Telnet (Puerto 23)',
      insecurity: 'cleartext_credentials',
      port: 22,
      protocol: 'SSH',
      remediation: 'block_legacy_enforce_ssh',
      insecurityExp: 'Telnet envía usuario y contraseña en texto plano por el cable.',
      solutionExp: 'Migrar a SSH (puerto 22) con cifrado simétrico y asimétrico.'
    },
    'port-http': {
      label: 'Servicio Web HTTP (Puerto 80)',
      insecurity: 'unencrypted_web_traffic',
      port: 443,
      protocol: 'HTTPS',
      remediation: 'redirect_301_to_https',
      insecurityExp: 'HTTP no cifra las comunicaciones ni cookies de sesión.',
      solutionExp: 'Forzar HTTPS (puerto 443) con TLS 1.3 y redirección 301.'
    },
    'port-ldap': {
      label: 'Servicio de Directorio LDAP (Puerto 389)',
      insecurity: 'unencrypted_directory_queries',
      port: 636,
      protocol: 'LDAPS',
      remediation: 'enforce_ldaps_channel_binding',
      insecurityExp: 'LDAP sin cifrar expone consultas y credenciales del directorio.',
      solutionExp: 'Exigir LDAPS (puerto 636) con Channel Binding y certificados TLS.'
    },
    'port-ftp': {
      label: 'Transferencia de Archivos FTP (Puertos 20/21)',
      insecurity: 'cleartext_ftp_credentials',
      port: 22,
      protocol: 'SFTP',
      remediation: 'disable_ftp_enable_sftp',
      insecurityExp: 'FTP transmite credenciales y archivos en claro RFC 959.',
      solutionExp: 'Reemplazar por SFTP (puerto 22 basado en SSH) o FTPS (puerto 989/990).'
    },
    'port-snmp': {
      label: 'Gestión y Monitoreo SNMP (Puerto 161)',
      insecurity: 'cleartext_community_strings',
      port: 161,
      protocol: 'SNMPv3',
      remediation: 'upgrade_to_snmpv3_authpriv',
      insecurityExp: 'SNMPv1 y SNMPv2c usan community strings en texto plano sin integridad.',
      solutionExp: 'Actualizar a SNMPv3 en modo authPriv con autenticación SHA y cifrado AES.'
    },
    'port-syslog': {
      label: 'Recolección de Logs Syslog (Puerto UDP 514)',
      insecurity: 'unencrypted_udp_tampering',
      port: 6514,
      protocol: 'Syslog-TLS',
      remediation: 'enforce_tls_syslog_6514',
      insecurityExp: 'Syslog UDP 514 permite spoofing de logs, eavesdropping y no garantiza entrega.',
      solutionExp: 'Configurar Syslog-over-TLS sobre TCP en puerto 6514 con certificados mutuos.'
    },
    'port-rdp': {
      label: 'Escritorio Remoto RDP (Puerto 3389 expuesto a WAN)',
      insecurity: 'wan_exposed_bruteforce',
      port: 3389,
      protocol: 'VPN_NLA',
      remediation: 'block_wan_access_require_vpn',
      insecurityExp: 'RDP directo a Internet es susceptible a ataques de fuerza bruta masiva y exploits.',
      solutionExp: 'Bloquear 3389 en firewall perimetral y canalizar mediante VPN con MFA y NLA.'
    },
    'port-dns': {
      label: 'Resolución de Nombres DNS (Puerto 53)',
      insecurity: 'cleartext_dns_eavesdropping',
      port: 853,
      protocol: 'DoT_DoH',
      remediation: 'enforce_dot_dnssec',
      insecurityExp: 'Consultas DNS estándar en texto claro permiten rastreo y DNS Cache Poisoning.',
      solutionExp: 'Implementar DoT (puerto 853) o DoH (puerto 443) junto con validación DNSSEC.'
    }
  };

  items.forEach((item) => {
    const expected = expectedMap[item.id];
    if (!expected) return;

    const insecCorrect = item.selectedInsecurityReason === expected.insecurity;
    const portCorrect = item.selectedSecurePort === expected.port;
    const protoCorrect = item.selectedSecureProtocol === expected.protocol;
    const remCorrect = item.selectedRemediationAction === expected.remediation;

    const allCorrect = insecCorrect && portCorrect && protoCorrect && remCorrect;
    const achievedPoints =
      (insecCorrect ? 3 : 0) +
      (portCorrect ? 3.5 : 0) +
      (protoCorrect ? 3 : 0) +
      (remCorrect ? 3 : 0);

    breakdown.push({
      id: item.id,
      label: `${expected.label} -> Puerto Seguro y Remediación`,
      achieved: allCorrect,
      points: achievedPoints,
      maxPoints: 12.5,
      explanation: allCorrect
        ? `Correcto: ${expected.insecurityExp} Solución: ${expected.solutionExp}`
        : `Parcial (${achievedPoints}/12.5): ${expected.insecurityExp} Remediación esperada: ${expected.solutionExp}`
    });
  });

  const totalScore = Math.round(breakdown.reduce((acc, curr) => acc + curr.points, 0));

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Dominio absoluto de puertos y protocolos de red! Has identificado con maestría cada vulnerabilidad de texto plano y su reemplazo seguro (SSH:22, HTTPS:443, LDAPS:636, SFTP:22, SNMPv3:161, Syslog-TLS:6514, DoT:853, RDP/VPN:3389).'
        : `Puntuación obtenida: ${totalScore}/100. Repasa la tabla de puertos oficiales de CompTIA: Telnet=23->SSH=22, HTTP=80->HTTPS=443, LDAP=389->LDAPS=636, Syslog=514->6514, DoT=853.`,
    sy0701Objective: 'Objetivo 3.3: Explicar conceptos de seguridad de redes y puertos de comunicación bien conocidos y seguros.',
    domainName: 'Dominio 3: Arquitectura de Seguridad (Puertos y Protocolos)'
  };
}

// ==========================================
// PBQ 32: Nmap Port Scanning & Reconnaissance Analysis
// ==========================================
export function evaluateNmapScanPBQ32(state: NmapScanState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const flagCorrect = state.scanFlagAnswer === 'sS';
  breakdown.push({
    id: 'nmap-flag',
    label: 'Identificación de la Técnica de Escaneo Nmap (-sS)',
    achieved: flagCorrect,
    points: flagCorrect ? 20 : 0,
    maxPoints: 20,
    explanation: flagCorrect
      ? 'Correcto: El flag -sS realiza un SYN Stealth Scan (Half-Open Scan), enviando paquetes SYN sin completar el handshake 3-way (no envía ACK final), reduciendo detección en logs.'
      : 'Incorrecto: El escaneo mostrado con estados OPEN / RESET sin completar el saludo 3-way corresponde a -sS (TCP SYN Stealth Scan).'
  });

  const expectedFindings: Record<
    string,
    { label: string; analysis: string; remediation: string; explanation: string }
  > = {
    'nmap-21': {
      label: 'Puerto 21/tcp: vsftpd 2.3.4 Backdoor',
      analysis: 'backdoor_compromise',
      remediation: 'remove_backdoor_replace_sftp',
      explanation: 'vsftpd 2.3.4 contiene una puerta trasera histórica (CVE-2011-2523) que abre shell root en puerto 6200 ante un smiley ":)". Debe removerse y usar SFTP (22).'
    },
    'nmap-23': {
      label: 'Puerto 23/tcp: Telnet Activo',
      analysis: 'insecure_cleartext_cli',
      remediation: 'shutdown_telnet_allow_ssh_22',
      explanation: 'Telnet transmite contraseñas en claro. Debe deshabilitarse el servicio telnetd y permitir exclusivamente SSH (22).'
    },
    'nmap-445': {
      label: 'Puerto 445/tcp: SMBv1 Vulnerable (EternalBlue)',
      analysis: 'eternalblue_rce_risk',
      remediation: 'disable_smbv1_enforce_smbv3_signing',
      explanation: 'SMBv1 es vulnerable a EternalBlue / WannaCry. Se debe desactivar SMBv1 por directiva y forzar SMBv3 con firma y cifrado obligatorio.'
    },
    'nmap-3389': {
      label: 'Puerto 3389/tcp: RDP Expuesto en Perímetro',
      analysis: 'exposed_remote_access',
      remediation: 'isolate_rdp_behind_bastion_mfa',
      explanation: 'RDP no debe exponerse a Internet por riesgo de fuerza bruta y exploits como BlueKeep. Debe aislarse tras un Bastion Host / VPN con MFA.'
    }
  };

  state.portFindings.forEach((finding) => {
    const exp = expectedFindings[finding.id];
    if (!exp) return;

    const aCorrect = finding.selectedAnalysis === exp.analysis;
    const rCorrect = finding.selectedRemediation === exp.remediation;
    const full = aCorrect && rCorrect;
    const pts = (aCorrect ? 10 : 0) + (rCorrect ? 10 : 0);

    breakdown.push({
      id: finding.id,
      label: exp.label,
      achieved: full,
      points: pts,
      maxPoints: 20,
      explanation: full
        ? `Correcto: ${exp.explanation}`
        : `Parcial (${pts}/20): ${exp.explanation}`
    });
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Análisis forense de Nmap impecable! Has interpretado el escaneo SYN Stealth (-sS), neutralizado la puerta trasera de vsftpd, cerrado Telnet, bloqueado SMBv1 y protegido RDP.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda: -sS es SYN scan; SMBv1 se mitiga migrando a SMBv3; vsftpd 2.3.4 es un backdoor histórico; Telnet se reemplaza por SSH.`,
    sy0701Objective: 'Objetivo 4.2: Analizar los resultados de herramientas de escaneo de vulnerabilidades y reconocimiento de puertos de red.',
    domainName: 'Dominio 4: Operaciones de Seguridad (Nmap Port Reconnaissance)'
  };
}

// ==========================================
// PBQ 33: DNS Security, DoT/DoH & DNSSEC Hardening
// ==========================================
export function evaluateDnsSecurityPBQ33(state: DnsSecurityState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const dnssecCorrect = state.dnssecRecordType === 'RRSIG';
  breakdown.push({
    id: 'dns-sec',
    label: 'Autenticación Criptográfica de Registros DNS (DNSSEC RRSIG)',
    achieved: dnssecCorrect,
    points: dnssecCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: dnssecCorrect
      ? 'Correcto: El registro RRSIG contiene la firma digital criptográfica de los Resource Records, impidiendo el envenenamiento de caché (DNS Poisoning).'
      : 'Incorrecto: DNSSEC utiliza el registro RRSIG para firmar criptográficamente los conjuntos de registros DNS y validar su procedencia auténtica.'
  });

  const dotCorrect = state.dnsEncryptionStandard === 'DoT_853';
  breakdown.push({
    id: 'dns-enc',
    label: 'Cifrado de Consultas DNS de Red (DNS over TLS en Puerto 853)',
    achieved: dotCorrect,
    points: dotCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: dotCorrect
      ? 'Correcto: DNS over TLS (DoT) corre sobre el puerto dedicado TCP 853, encapsulando y cifrando todas las consultas del resolver para privacidad total.'
      : 'Incorrecto: El estándar IETF para DNS cifrado a nivel de red e infraestructura sobre puerto dedicado es DoT (DNS over TLS, puerto TCP 853).'
  });

  const axfrCorrect = state.zoneTransferRestriction === 'restrict_tcp_53_authorized_secondaries';
  breakdown.push({
    id: 'dns-axfr',
    label: 'Restricción de Transferencia de Zona AXFR (Puerto TCP 53)',
    achieved: axfrCorrect,
    points: axfrCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: axfrCorrect
      ? 'Correcto: Las transferencias de zona (AXFR sobre TCP 53) exponen el mapa completo de hosts y deben restringirse por ACL exclusivamente a los servidores secundarios autorizados.'
      : 'Incorrecto: Las solicitudes de transferencia de zona DNS (AXFR) usan TCP 53 y deben permitirse únicamente hacia IPs de servidores DNS secundarios legítimos.'
  });

  const recurCorrect = state.openRecursionMitigation === 'disable_open_recursion_internal_only';
  breakdown.push({
    id: 'dns-recur',
    label: 'Deshabilitación de Recursión Abierta (Prevenir Amplificación DDoS)',
    achieved: recurCorrect,
    points: recurCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: recurCorrect
      ? 'Correcto: Desactivar la recursión DNS abierta previene que los servidores corporativos sean explotados como reflectores y amplificadores en ataques DDoS DNS.'
      : 'Incorrecto: Para mitigar ataques de amplificación DNS hacia terceros, se debe deshabilitar la recursión abierta para clientes externos no autorizados.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Infraestructura DNS blindada contra envenenamiento y spoofing! Has configurado RRSIG en DNSSEC, DoT en puerto 853, restricción AXFR en TCP 53 y mitigado recursión abierta.'
        : `Puntuación obtenida: ${totalScore}/100. En CompTIA: DNSSEC firma con RRSIG; DoT usa puerto 853; transferencias de zona AXFR usan TCP 53; la recursión abierta debe apagarse.`,
    sy0701Objective: 'Objetivo 3.3: Implementar protocolos seguros de resolución de nombres y controles de seguridad DNS.',
    domainName: 'Dominio 3: Arquitectura de Seguridad (DNS Security)'
  };
}

// ==========================================
// PBQ 34: Zero Trust Architecture (ZTA) & Microsegmentation (NIST SP 800-207)
// ==========================================
export function evaluateZeroTrustPBQ34(state: ZeroTrustState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const peCorrect = state.policyDecisionEngine === 'pdp_pe_continuous';
  breakdown.push({
    id: 'zta-pdp',
    label: 'Motor de Decisión de Políticas ZTA (PDP / Policy Engine NIST 800-207)',
    achieved: peCorrect,
    points: peCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: peCorrect
      ? 'Correcto: El Policy Decision Point (PDP) compuesto por el Policy Engine (PE) es el cerebro lógico que aprueba o deniega accesos evaluando señales de riesgo en tiempo real.'
      : 'Incorrecto: En la arquitectura Zero Trust de NIST SP 800-207, la decisión de otorgar acceso corresponde al Policy Decision Point (PDP) / Policy Engine (PE).'
  });

  const pepCorrect = state.policyEnforcementLocation === 'pep_edge_microperimeter';
  breakdown.push({
    id: 'zta-pep',
    label: 'Punto de Aplicación de Políticas (PEP / Policy Enforcement Point)',
    achieved: pepCorrect,
    points: pepCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: pepCorrect
      ? 'Correcto: El PEP (Policy Enforcement Point) actúa como guardia en el microperímetro, interceptando, autorizando y terminando las conexiones según ordene el PDP.'
      : 'Incorrecto: El componente responsable de habilitar o bloquear físicamente la conexión entre el sujeto y el recurso es el Policy Enforcement Point (PEP).'
  });

  const microCorrect = state.networkTrafficControl === 'microsegmentation_least_privilege';
  breakdown.push({
    id: 'zta-micro',
    label: 'Microsegmentación de Tráfico Lateral Este-Oeste (East-West Traffic)',
    achieved: microCorrect,
    points: microCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: microCorrect
      ? 'Correcto: La microsegmentación a nivel de software divide las cargas de trabajo en zonas aisladas, impidiendo el movimiento lateral de un atacante dentro de la red corporativa.'
      : 'Incorrecto: El principio fundamental de ZTA para evitar que un atacante salte de un servidor comprometido a otro es la Microsegmentación de tráfico lateral (East-West).'
  });

  const evalCorrect = state.continuousTrustEvaluation === 'continuous_adaptive_risk_validation';
  breakdown.push({
    id: 'zta-eval',
    label: 'Validación Continua Adaptativa de Postura y Riesgo (Never Trust, Always Verify)',
    achieved: evalCorrect,
    points: evalCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: evalCorrect
      ? 'Correcto: Zero Trust descarta la confianza implícita por estar en la LAN; requiere reevaluación continua adaptativa de la postura del dispositivo y contexto durante toda la sesión.'
      : 'Incorrecto: El axioma "Nunca confiar, siempre verificar" exige validación continua adaptativa de riesgo, no solo una autenticación estática en el inicio de sesión.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Diseño Zero Trust impecable bajo estándar NIST SP 800-207! Has alineado el Policy Engine (PDP), Policy Enforcement Point (PEP), microsegmentación Este-Oeste y validación continua adaptativa.'
        : `Puntuación obtenida: ${totalScore}/100. Componentes clave en CompTIA: PDP (decide), PEP (aplica), Microsegmentación (detiene movimiento lateral), Validación Continua (elimina confianza implícita).`,
    sy0701Objective: 'Objetivo 1.4: Explicar la importancia de la Arquitectura Zero Trust (ZTA) y sus principios rectores según NIST SP 800-207.',
    domainName: 'Dominio 1: Conceptos Generales de Seguridad (Zero Trust Architecture)'
  };
}

// ==========================================
// PBQ 35: Web Server Hardening & HTTP Security Headers
// ==========================================
export function evaluateWebServerHardeningPBQ35(state: WebServerHardeningState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const hstsCorrect = state.hstsHeaderConfig === 'hsts_max_age_includesubdomains_preload';
  breakdown.push({
    id: 'web-hsts',
    label: 'Cabecera HTTP Strict Transport Security (HSTS Preload)',
    achieved: hstsCorrect,
    points: hstsCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: hstsCorrect
      ? 'Correcto: HSTS con max-age largo, includeSubDomains y preload obliga a los navegadores a conectarse exclusivamente mediante HTTPS, previniendo ataques SSL Stripping.'
      : 'Incorrecto: Para eliminar cualquier posibilidad de degradación o intercepción no cifrada se configura HSTS con max-age >= 31536000, includeSubDomains y preload.'
  });

  const cspCorrect = state.cspHeaderConfig === 'csp_default_src_self_nonce';
  breakdown.push({
    id: 'web-csp',
    label: 'Content Security Policy (CSP con Nonces Criptográficos)',
    achieved: cspCorrect,
    points: cspCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: cspCorrect
      ? 'Correcto: Una política CSP estricta que restrinja default-src a self y use nonces aleatorios bloquea la inyección y ejecución de scripts maliciosos (Cross-Site Scripting / XSS).'
      : 'Incorrecto: La mitigación de defensa en profundidad más efectiva contra Cross-Site Scripting (XSS) e inyección de recursos externos es Content-Security-Policy (CSP).'
  });

  const frameCorrect = state.frameOptionsConfig === 'x_frame_options_deny';
  breakdown.push({
    id: 'web-frame',
    label: 'Protección contra Clickjacking (X-Frame-Options: DENY)',
    achieved: frameCorrect,
    points: frameCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: frameCorrect
      ? 'Correcto: X-Frame-Options: DENY impide que la aplicación sea embebida dentro de elementos <iframe> o <frame> en sitios de atacantes, neutralizando el Clickjacking (UI Redressing).'
      : 'Incorrecto: Para prevenir que usuarios sean engañados haciendo clics sobre elementos transparentes superpuestos (Clickjacking), se debe configurar X-Frame-Options: DENY.'
  });

  const tlsCorrect = state.tlsProtocolVersion === 'tls_1_3_only';
  breakdown.push({
    id: 'web-tls',
    label: 'Configuración Criptográfica del Servidor Web (TLS 1.3 con PFS)',
    achieved: tlsCorrect,
    points: tlsCorrect ? 25 : 0,
    maxPoints: 25,
    explanation: tlsCorrect
      ? 'Correcto: TLS 1.3 elimina suites de cifrado vulnerables legadas (RC4, 3DES, CBC) y exige Perfect Forward Secrecy (PFS) mediante intercambio de claves ECDHE.'
      : 'Incorrecto: El servidor web debe configurarse exclusivamente con TLS 1.3 para garantizar confidencialidad perfecta hacia adelante (PFS) y cifrado autenticado AEAD.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Hardening web de nivel militar completado! Has configurado HSTS con preload para evitar SSL Stripping, CSP con nonces contra XSS, X-Frame-Options: DENY contra Clickjacking y TLS 1.3 con Perfect Forward Secrecy.'
        : `Puntuación obtenida: ${totalScore}/100. En el examen CompTIA: HSTS combate SSL Stripping, CSP combate XSS, X-Frame-Options combate Clickjacking, y TLS 1.3 garantiza Perfect Forward Secrecy.`,
    sy0701Objective: 'Objetivo 2.4: Implementar configuraciones seguras de servidores web y cabeceras de respuesta HTTP para mitigar ataques a aplicaciones web.',
    domainName: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones (Web Server Hardening)'
  };
}

// ==========================================
// PBQ 36: Forensic Legal Hold & Chain of Custody
// ==========================================
export function evaluateForensicHoldPBQ36(state: ForensicHoldState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const phases = [
    { key: state.phase1, exp: 'legal_hold_notice', id: 'p1', label: 'Fase 1: Notificación Legal Hold (Retención Judicial)', pts: 15, expl: 'La primera acción legal obligatoria es emitir el aviso de Legal Hold para detener la destrucción programada de evidencias.' },
    { key: state.phase2, exp: 'chain_of_custody_log', id: 'p2', label: 'Fase 2: Registro en Cadena de Custodia', pts: 15, expl: 'Cada artefacto debe documentarse en el formulario de cadena de custodia con quién lo recolectó, fecha, hora y ubicación.' },
    { key: state.phase3, exp: 'write_blocker_bitstream_image', id: 'p3', label: 'Fase 3: Adquisición Bit-a-Bit con Bloqueador de Escritura', pts: 15, expl: 'Debe usarse un hardware write blocker para evitar alterar timestamps MACB durante la copia forense bit a bit.' },
    { key: state.phase4, exp: 'cryptographic_hash_sha256', id: 'p4', label: 'Fase 4: Verificación de Hash Criptográfico (SHA-256)', pts: 15, expl: 'El hash calculado en el origen debe coincidir exactamente con el hash de la copia forense para validar su inalterabilidad.' },
    { key: state.phase5, exp: 'isolated_forensic_analysis', id: 'p5', label: 'Fase 5: Análisis en Entorno Aislado (Copia de Trabajo)', pts: 15, expl: 'El perito forense analiza únicamente una copia de trabajo aislada de la red, nunca la imagen maestra original.' },
    { key: state.phase6, exp: 'secure_vault_storage', id: 'p6', label: 'Fase 6: Almacenamiento en Caja Fuerte de Seguridad', pts: 10, expl: 'La evidencia física original se almacena en caja fuerte ignífuga con control de acceso y bitácora física.' },
  ];

  phases.forEach((p) => {
    const ok = p.key === p.exp;
    breakdown.push({
      id: p.id,
      label: p.label,
      achieved: ok,
      points: ok ? p.pts : 0,
      maxPoints: p.pts,
      explanation: ok ? `Correcto: ${p.expl}` : `Incorrecto: Se esperaba la acción ${p.label}. ${p.expl}`
    });
  });

  const volOk = state.volatilityConcept === 'ram_before_disk';
  breakdown.push({
    id: 'p-vol',
    label: 'Orden de Volatilidad (RAM antes que Disco Duro)',
    achieved: volOk,
    points: volOk ? 8 : 0,
    maxPoints: 8,
    explanation: volOk
      ? 'Correcto: Según RFC 3227, la memoria RAM volátil se pierde al apagar el equipo y debe adquirirse antes que el almacenamiento secundario.'
      : 'Incorrecto: La memoria RAM es volátil y debe volcarse antes de desconectar o clonar el disco duro.'
  });

  const admOk = state.admissibilityStandard === 'best_evidence_rule';
  breakdown.push({
    id: 'p-adm',
    label: 'Estándar de Admisibilidad Judicial (Best Evidence Rule)',
    achieved: admOk,
    points: admOk ? 7 : 0,
    maxPoints: 7,
    explanation: admOk
      ? 'Correcto: La Regla de la Mejor Evidencia (Best Evidence Rule) exige presentar el original o una copia forense bit-stream exacta con hash verificado en tribunal.'
      : 'Incorrecto: Para admisibilidad judicial de evidencias electrónicas, el tribunal exige cumplimiento de la Best Evidence Rule y cadena de custodia inquebrantable.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Procedimiento forense judicial perfecto! Cumples con Legal Hold, Cadena de Custodia, Bloqueadores de escritura, hashes SHA-256, orden de volatilidad y la Best Evidence Rule.'
        : `Puntuación obtenida: ${totalScore}/100. En CompTIA Forensics: Legal Hold precede la adquisición; se usa Write Blocker y se analiza la copia, no el disco original.`,
    sy0701Objective: 'Objetivo 4.5: Aplicar técnicas forenses digitales apropiadas y mitigar la contaminación de la evidencia.',
    domainName: 'Dominio 4: Operaciones de Seguridad (Digital Forensics & Legal Hold)'
  };
}

// ==========================================
// PBQ 37: PKI Lifecycle, OCSP Stapling, X.509 Formats & Key Escrow
// ==========================================
export function evaluatePkiLifecyclePBQ37(state: PkiLifecycleState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const ocspOk = state.revocationProtocol === 'ocsp_stapling';
  breakdown.push({
    id: 'pki-revoc',
    label: 'Protocolo de Revocación de Baja Latencia y Privacidad (OCSP Stapling)',
    achieved: ocspOk,
    points: ocspOk ? 20 : 0,
    maxPoints: 20,
    explanation: ocspOk
      ? 'Correcto: OCSP Stapling (RFC 6066) descarga a la CA al permitir que el servidor web cachee la respuesta sellada en el handshake TLS, eliminando la latencia del cliente y fugas de privacidad.'
      : 'Incorrecto: OCSP Stapling es la solución recomendada por CompTIA para evitar descargas pesadas de CRL y proteger la privacidad de navegación del usuario ante la CA.'
  });

  const pfxOk = state.certFormatBundle === 'pfx_pkcs12_password';
  breakdown.push({
    id: 'pki-pfx',
    label: 'Formato Binario de Paquete con Clave Privada (.PFX / PKCS#12)',
    achieved: pfxOk,
    points: pfxOk ? 20 : 0,
    maxPoints: 20,
    explanation: pfxOk
      ? 'Correcto: .PFX / .P12 (PKCS#12) es el único formato estándar diseñado para empaquetar tanto el certificado público como la clave privada cifrada con contraseña.'
      : 'Incorrecto: .P7B contiene solo la cadena de certificados públicos y .DER es un cert individual; el paquete con clave privada es .PFX / PKCS#12.'
  });

  const pemOk = state.certFormatAscii === 'pem_base64_ascii';
  breakdown.push({
    id: 'pki-pem',
    label: 'Formato Estándar ASCII Base64 para Linux/Apache (.PEM / .CRT)',
    achieved: pemOk,
    points: pemOk ? 20 : 0,
    maxPoints: 20,
    explanation: pemOk
      ? 'Correcto: .PEM es el formato estándar codificado en Base64 ASCII delimitado por cabeceras "-----BEGIN CERTIFICATE-----", universal en servidores Linux y Apache/Nginx.'
      : 'Incorrecto: El formato ASCII Base64 con cabeceras de texto es .PEM (o .CRT), a diferencia de .DER que es binario puro no legible.'
  });

  const sanOk = state.subjectAltNameConfig === 'san_multi_domain';
  breakdown.push({
    id: 'pki-san',
    label: 'Extensión X.509 para Múltiples FQDNs / Subdominios (SAN - Subject Alternative Name)',
    achieved: sanOk,
    points: sanOk ? 20 : 0,
    maxPoints: 20,
    explanation: sanOk
      ? 'Correcto: La extensión SAN (Subject Alternative Name) permite registrar múltiples nombres de host y dominios completamente diferentes en un solo certificado X.509.'
      : 'Incorrecto: Los certificados Wildcard (*.dominio.com) solo cubren un nivel del mismo dominio; para múltiples dominios y nombres específicos se exige SAN.'
  });

  const escrowOk = state.privateKeyRecovery === 'key_escrow_m_of_n';
  breakdown.push({
    id: 'pki-escrow',
    label: 'Recuperación de Claves Privadas Corporativas (Key Escrow con M-de-N)',
    achieved: escrowOk,
    points: escrowOk ? 20 : 0,
    maxPoints: 20,
    explanation: escrowOk
      ? 'Correcto: Key Escrow con esquema de control compartido M-de-N (Split Knowledge / Dual Control) garantiza que ningún administrador solitario pueda abusar del descifrado de datos.'
      : 'Incorrecto: Para recuperar datos cifrados sin vulnerar la segregación de funciones, CompTIA prescribe Key Escrow con esquema multipartito M-de-N.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Maestría en PKI y Certificados X.509 demostrada! Has implementado OCSP Stapling, identificado el contenedor .PFX/PKCS#12, el formato Base64 .PEM, la extensión SAN y Key Escrow con M-de-N.'
        : `Puntuación obtenida: ${totalScore}/100. En CompTIA: OCSP Stapling ahorra latencia TLS; .PFX lleva clave privada con contraseña; .PEM es Base64 ASCII; SAN permite multidominio; Key Escrow usa M-de-N.`,
    sy0701Objective: 'Objetivo 3.4: Explicar la importancia de las soluciones de criptografía y la infraestructura de clave pública (PKI).',
    domainName: 'Dominio 3: Arquitectura de Seguridad (PKI Lifecycle & X.509)'
  };
}

// ==========================================
// PBQ 38: Wireless WPA3-Enterprise, 802.1X & WIPS
// ==========================================
export function evaluateWirelessSecurityPBQ38(state: WirelessSecurityState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const wpaOk = state.wpaStandard === 'wpa3_enterprise_192bit';
  breakdown.push({
    id: 'wifi-wpa',
    label: 'Estándar Inalámbrico Empresarial (WPA3-Enterprise Suite-B 192-bit)',
    achieved: wpaOk,
    points: wpaOk ? 20 : 0,
    maxPoints: 20,
    explanation: wpaOk
      ? 'Correcto: WPA3-Enterprise en modo 192 bits (Suite-B) proporciona la máxima seguridad criptográfica eliminando cifrados obsoletos como TKIP o WEP.'
      : 'Incorrecto: WPA3-Enterprise es el estándar corporativo exigido en SY0-701, superando a WPA2 por su resistencia ante ataques de renegociación de clave.'
  });

  const eapOk = state.eapMethod === 'eap_tls_mutual_certificates';
  breakdown.push({
    id: 'wifi-eap',
    label: 'Método de Autenticación 802.1X (EAP-TLS con Certificados Mutuos)',
    achieved: eapOk,
    points: eapOk ? 25 : 0,
    maxPoints: 25,
    explanation: eapOk
      ? 'Correcto: EAP-TLS es el método EAP más seguro en CompTIA porque exige certificados digitales mutuos (tanto en el servidor RADIUS como en el dispositivo cliente).'
      : 'Incorrecto: PEAP o EAP-TTLS solo requieren certificado en el servidor; EAP-TLS exige certificados en ambos extremos eliminando la dependencia de contraseñas.'
  });

  const radOk = state.radiusPorts === 'radius_1812_1813';
  breakdown.push({
    id: 'wifi-rad',
    label: 'Puertos Estándar del Servidor RADIUS (1812 Autenticación / 1813 Accounting)',
    achieved: radOk,
    points: radOk ? 20 : 0,
    maxPoints: 20,
    explanation: radOk
      ? 'Correcto: RADIUS utiliza el puerto UDP 1812 para autenticación/autorización y UDP 1813 para contabilidad (Accounting).'
      : 'Incorrecto: Los puertos oficiales IANA para RADIUS son UDP 1812 (Auth) y UDP 1813 (Acct). (Los puertos legados 1645/1646 están en desuso).'
  });

  const saeOk = state.wpaPersonalHandshake === 'sae_dragonfly';
  breakdown.push({
    id: 'wifi-sae',
    label: 'Mecanismo Anti-Fuerza Bruta en WPA3-Personal (SAE / Dragonfly Handshake)',
    achieved: saeOk,
    points: saeOk ? 15 : 0,
    maxPoints: 15,
    explanation: saeOk
      ? 'Correcto: SAE (Simultaneous Authentication of Equals / Dragonfly) reemplaza la clave precompartida (PSK) en WPA3-Personal, haciendo invulnerables las capturas a ataques de diccionario offline.'
      : 'Incorrecto: SAE es el protocolo de handshake que reemplaza a PSK en WPA3-Personal impidiendo el crackeo de claves fuera de línea.'
  });

  const wipsOk = state.rogueApDetection === 'wips_rf_monitoring_auto_suppress';
  breakdown.push({
    id: 'wifi-wips',
    label: 'Defensa Activa ante Rogue AP y Evil Twin (WIPS con Supresión RF Automática)',
    achieved: wipsOk,
    points: wipsOk ? 20 : 0,
    maxPoints: 20,
    explanation: wipsOk
      ? 'Correcto: Un WIPS (Wireless Intrusion Prevention System) monitorea el espectro RF continuamente y envía paquetes de desautenticación para contener APs no autorizados.'
      : 'Incorrecto: Se requiere un WIPS con capacidad de contención activa y monitorización del espectro de radiofrecuencia (RF) para neutralizar Gemelos Malvados (Evil Twins).'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Seguridad WiFi empresarial impenetrable! Has configurado WPA3-Enterprise 192 bits, autenticación EAP-TLS con certificados mutuos, RADIUS en 1812/1813, SAE Dragonfly y WIPS contra Rogue APs.'
        : `Puntuación obtenida: ${totalScore}/100. En CompTIA: EAP-TLS = certificados mutuos; RADIUS = puertos 1812/1813; SAE combate ataques de diccionario; WIPS neutraliza Rogue APs.`,
    sy0701Objective: 'Objetivo 3.3: Implementar protocolos y configuraciones de seguridad para redes inalámbricas corporativas.',
    domainName: 'Dominio 3: Arquitectura de Seguridad (Wireless Hardening & 802.1X)'
  };
}

// ==========================================
// PBQ 39: Cloud Storage DLP & CASB Data Classification
// ==========================================
export function evaluateCloudDlpPBQ39(state: CloudDlpState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const expectedBuckets: Record<string, { tier: string; pattern: string; label: string; desc: string }> = {
    'bucket-web-assets': {
      tier: 'public',
      pattern: 'none',
      label: 'Depósito 1: Assets Web Públicos (Logos/CSS)',
      desc: 'Contenido público sin datos sensibles ni PII.'
    },
    'bucket-cardholder': {
      tier: 'restricted_pii',
      pattern: 'pci_dss_credit_card',
      label: 'Depósito 2: Pasarela de Pagos (PAN / Tarjetas de Crédito)',
      desc: 'Datos de tarjeta de pago sujetos a PCI-DSS (Restringido / PII con regex de tarjetas).'
    },
    'bucket-hr-payroll': {
      tier: 'confidential',
      pattern: 'ssn_pii',
      label: 'Depósito 3: Recursos Humanos (Nóminas y Números de Seguro Social)',
      desc: 'Datos internos confidenciales con identificación de empleados (SSN / PII).'
    },
    'bucket-dev-api': {
      tier: 'confidential',
      pattern: 'api_secrets',
      label: 'Depósito 4: Configuración DevOps (API Keys y Secretos de Cloud)',
      desc: 'Claves criptográficas y tokens de acceso de servicios en la nube.'
    }
  };

  state.buckets.forEach((b) => {
    const exp = expectedBuckets[b.id];
    if (!exp) return;

    const tOk = b.assignedTier === exp.tier;
    const pOk = b.dlpPattern === exp.pattern;
    const full = tOk && pOk;
    const pts = (tOk ? 10 : 0) + (pOk ? 7.5 : 0);

    breakdown.push({
      id: b.id,
      label: exp.label,
      achieved: full,
      points: pts,
      maxPoints: 17.5,
      explanation: full
        ? `Correcto: Clasificación "${exp.tier}" y patrón DLP "${exp.pattern}". ${exp.desc}`
        : `Parcial (${pts}/17.5): ${exp.desc} Nivel esperado: ${exp.tier}, Patrón: ${exp.pattern}.`
    });
  });

  const casbOk = state.casbInspectionMode === 'casb_reverse_proxy_inline';
  breakdown.push({
    id: 'cloud-casb',
    label: 'Modo de Inspección CASB (Inline Reverse Proxy con Prevención Activa)',
    achieved: casbOk,
    points: casbOk ? 15 : 0,
    maxPoints: 15,
    explanation: casbOk
      ? 'Correcto: El modo CASB Inline (Reverse Proxy) inspecciona el tráfico de subida en tiempo real y bloquea activamente archivos que contengan números de tarjeta o credenciales antes de ser guardados.'
      : 'Incorrecto: El modo API asíncrono solo detecta fugas después de que el archivo fue subido; para prevención activa de fugas en tiempo real se requiere CASB Inline (Proxy).'
  });

  const keyOk = state.cloudKeyManagement === 'customer_managed_hsm_kms';
  breakdown.push({
    id: 'cloud-kms',
    label: 'Gestión Criptográfica de Claves (Customer-Managed Keys en Cloud HSM)',
    achieved: keyOk,
    points: keyOk ? 15 : 0,
    maxPoints: 15,
    explanation: keyOk
      ? 'Correcto: Las claves gestionadas por el cliente (Customer-Managed Keys - CMK) respaldadas en un HSM FIPS 140-2 Nivel 3 garantizan que ni siquiera el proveedor de la nube pueda acceder a los datos sin autorización.'
      : 'Incorrecto: Para el cumplimiento normativo estricto de datos sensibles, la empresa debe mantener el control de sus propias claves criptográficas mediante CMK/HSM.'
  });

  const totalScore = Math.round(breakdown.reduce((acc, curr) => acc + curr.points, 0));

  return {
    totalScore: Math.min(100, totalScore),
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore >= 95
        ? '¡Gobernanza y DLP en Cloud impecable! Has catalogado correctamente la sensibilidad de cada bucket, activado las firmas regex de DLP para PCI-DSS y SSN, y configurado CASB Inline con CMK en Cloud HSM.'
        : `Puntuación obtenida: ${totalScore}/100. En CompTIA: los números de tarjeta son PCI-DSS (Restringido); CASB Inline bloquea fugas en tiempo real; Customer-Managed Keys protegen contra el acceso no autorizado del proveedor cloud.`,
    sy0701Objective: 'Objetivo 1.2: Clasificar la información y aplicar controles de protección y prevención de fuga de datos en la nube.',
    domainName: 'Dominio 1: Conceptos Generales de Seguridad (Cloud DLP & CASB Architecture)'
  };
}

// ==========================================
// PBQ 40: Social Engineering Attacks & Defenses
// ==========================================
export function evaluateSocialEngPBQ40(state: SocialEngState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const expectedCases: Record<string, { trigger: string; defense: string; label: string; desc: string }> = {
    'case-spear-cfo': {
      trigger: 'authority',
      defense: 'dmarc_out_of_band',
      label: 'Caso 1: Spear Phishing / BEC dirigido al Director Financiero',
      desc: 'El atacante finge ser el CEO exigiendo una transferencia confidencial urgente utilizando el principio de Autoridad.'
    },
    'case-vishing-helpdesk': {
      trigger: 'urgency',
      defense: 'anti_vishing_call_back',
      label: 'Caso 2: Vishing telefónico de soporte técnico exigiendo restablecimiento',
      desc: 'El atacante presiona con corte inminente de servicio si no se le entrega la contraseña temporal, invocando Urgencia.'
    },
    'case-usb-baiting': {
      trigger: 'scarcity',
      defense: 'disable_usb_mass_storage',
      label: 'Caso 3: USB Baiting con etiqueta "Bonos Ejecutivos 2026"',
      desc: 'Se dejan unidades flash USB en el estacionamiento apelando a la Curiosidad y Escasez.'
    },
    'case-pretexting-vendor': {
      trigger: 'familiarity',
      defense: 'security_awareness_training',
      label: 'Caso 4: Pretexting de un proveedor habitual solicitando cambio de cuenta IBAN',
      desc: 'El atacante construye un escenario falso usando nombres de empleados reales apelando a la Familiaridad.'
    },
    'case-watering-hole': {
      trigger: 'consensus',
      defense: 'security_awareness_training',
      label: 'Caso 5: Watering Hole infectando la web de una asociación del sector',
      desc: 'El atacante compromete un sitio web legítimo y de confianza que todos los empleados del sector visitan habitualmente (Consenso).'
    }
  };

  state.cases.forEach((c) => {
    const exp = expectedCases[c.id];
    if (!exp) return;

    const tOk = c.identifiedTrigger === exp.trigger;
    const dOk = c.primaryDefense === exp.defense;
    const full = tOk && dOk;
    const pts = (tOk ? 10 : 0) + (dOk ? 10 : 0);

    breakdown.push({
      id: c.id,
      label: exp.label,
      achieved: full,
      points: pts,
      maxPoints: 20,
      explanation: full
        ? `Correcto: Disparador "${exp.trigger}" y defensa "${exp.defense}". ${exp.desc}`
        : `Parcial (${pts}/20): ${exp.desc} Disparador esperado: ${exp.trigger}, Defensa esperada: ${exp.defense}.`
    });
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Matriz de Ingeniería Social dominada! Has neutralizado BEC/Spear Phishing con verificación fuera de banda, Vishing con devolución de llamada verificada, USB Baiting deshabilitando USBs por GPO, y Watering Hole mediante concienciación y aislamiento.'
        : `Puntuación obtenida: ${totalScore}/100. En el examen CompTIA: el CEO representa Autoridad; transferencias urgentes requieren verificación fuera de banda; USB Baiting se mitiga deshabilitando puertos USB.`,
    sy0701Objective: 'Objetivo 2.1: Analizar técnicas de ataque basadas en ingeniería social y factores humanos de persuasión.',
    domainName: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones (Social Engineering)'
  };
}

// ==========================================
// PBQ 41: Cloud Shared Responsibility Model (IaaS, PaaS, SaaS)
// ==========================================
export function evaluateCloudSharedResponsibilityPBQ41(state: CloudSharedResponsibilityState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const expectedMatrix: Record<string, { iaas: string; paas: string; saas: string; name: string }> = {
    'physical_datacenter': {
      name: 'Seguridad Física del Data Center & Hardware',
      iaas: 'csp',
      paas: 'csp',
      saas: 'csp'
    },
    'hypervisor_network': {
      name: 'Hipervisor y Red Física Subyacente (SDN)',
      iaas: 'csp',
      paas: 'csp',
      saas: 'csp'
    },
    'os_patching': {
      name: 'Parches del Sistema Operativo de la Instancia / Host',
      iaas: 'customer',
      paas: 'csp',
      saas: 'csp'
    },
    'network_controls': {
      name: 'Configuración de Reglas de Firewall / Security Groups',
      iaas: 'customer',
      paas: 'customer',
      saas: 'csp'
    },
    'application_code': {
      name: 'Código de Aplicación, APIs y Lógica de Negocio',
      iaas: 'customer',
      paas: 'customer',
      saas: 'csp'
    },
    'data_and_iam': {
      name: 'Clasificación de Datos, Control de Acceso IAM y Gestión de Cuentas',
      iaas: 'customer',
      paas: 'customer',
      saas: 'customer'
    }
  };

  let totalPoints = 0;

  state.layers.forEach((layer) => {
    const exp = expectedMatrix[layer.layerId];
    if (!exp) return;

    const iaasOk = layer.iaasParty === exp.iaas;
    const paasOk = layer.paasParty === exp.paas;
    const saasOk = layer.saasParty === exp.saas;

    const correctCount = (iaasOk ? 1 : 0) + (paasOk ? 1 : 0) + (saasOk ? 1 : 0);
    // 6 layers, each layer ~16-17 points (total 100)
    const layerMax = layer.layerId === 'data_and_iam' || layer.layerId === 'os_patching' ? 18 : 16;
    const layerPts = Math.round((correctCount / 3) * layerMax);

    totalPoints += layerPts;

    breakdown.push({
      id: layer.layerId,
      label: exp.name,
      achieved: correctCount === 3,
      points: layerPts,
      maxPoints: layerMax,
      explanation: correctCount === 3
        ? `Correcto: IaaS (${exp.iaas.toUpperCase()}), PaaS (${exp.paas.toUpperCase()}), SaaS (${exp.saas.toUpperCase()}).`
        : `Parcial (${correctCount}/3): Se esperaba IaaS: ${exp.iaas.toUpperCase()}, PaaS: ${exp.paas.toUpperCase()}, SaaS: ${exp.saas.toUpperCase()}.`
    });
  });

  const finalScore = Math.min(100, totalPoints);

  return {
    totalScore: finalScore,
    passed: finalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      finalScore === 100
        ? '¡Matriz de Responsabilidad Compartida en la Nube perfecta! Has recordado la regla de oro de CompTIA: la Seguridad Física es SIEMPRE del CSP en la nube pública, y los Datos y la Gestión IAM son SIEMPRE responsabilidad del Cliente en los tres modelos.'
        : `Puntuación obtenida: ${finalScore}/100. Regla CompTIA: En SaaS el CSP gestiona la aplicación; en PaaS el cliente gestiona su código; en IaaS el cliente parcha el SO; y los DATOS son siempre del cliente.`,
    sy0701Objective: 'Objetivo 3.1: Comparar y contrastar conceptos de seguridad aplicados a entornos en la nube (Shared Responsibility Model).',
    domainName: 'Dominio 3: Arquitectura de Seguridad (Cloud Security)'
  };
}

// ==========================================
// PBQ 42: MITRE ATT&CK Threat Hunting, Windows Events & Active Directory
// ==========================================
export function evaluateMitreThreatHuntingPBQ42(state: MitreThreatHuntingState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const expectedCases: Record<string, { code: string; telemetry: string; remediation: string; title: string; rationale: string }> = {
    'case-kerberoasting': {
      code: 'T1058',
      telemetry: 'event_4769_rc4',
      remediation: 'gmsa_aes256',
      title: 'Ataque Kerberoasting (Ticket Granting Service Request)',
      rationale: 'Event ID 4769 con cifrado 0x17 (RC4) indica extracción de tickets TGS para crackeo offline. Mitigación: gMSA con AES-256.'
    },
    'case-lsass-dumping': {
      code: 'T1003',
      telemetry: 'event_4624_type9_lsass',
      remediation: 'credential_guard_lsa',
      title: 'Robo de Credenciales en Memoria LSASS (Mimikatz / Pass-the-Hash)',
      rationale: 'T1003: Acceso indebido a lsass.exe y Logon Type 9. Mitigación: Windows Defender Credential Guard con VBS.'
    },
    'case-llmnr-poisoning': {
      code: 'T1557.001',
      telemetry: 'event_4625_responder',
      remediation: 'disable_llmnr_smb_signing',
      title: 'Envenenamiento LLMNR / NBT-NS (Responder / Relay NTLM)',
      rationale: 'T1557.001: Tráfico multicast UDP 5355 anómalo con fallos 4625. Mitigación: Deshabilitar LLMNR/NetBIOS por GPO y SMB Signing.'
    },
    'case-golden-ticket': {
      code: 'T1558.001',
      telemetry: 'event_4768_forged_tgt',
      remediation: 'krbtgt_double_reset',
      title: 'Falsificación de Kerberos Golden Ticket (Compromiso KRBTGT)',
      rationale: 'T1558.001: TGT forjado con validez de 10 años sin evento de autenticación previo. Mitigación: Resetear la cuenta KRBTGT dos veces.'
    },
    'case-powershell-fileless': {
      code: 'T1059.001',
      telemetry: 'event_4104_scriptblock',
      remediation: 'clm_wdac_applocker',
      title: 'Ejecución de PowerShell Ofuscado / Malware Sin Archivos',
      rationale: 'T1059.001: Event 4104 Script Block Logging con comandos Base64 -enc. Mitigación: Constrained Language Mode y AppLocker/WDAC.'
    }
  };

  state.scenarios.forEach((sc) => {
    const exp = expectedCases[sc.id];
    if (!exp) return;

    const codeOk = sc.mitreCode === exp.code;
    const telemOk = sc.telemetrySource === exp.telemetry;
    const remedOk = sc.remediationControl === exp.remediation;

    const pts = (codeOk ? 6 : 0) + (telemOk ? 7 : 0) + (remedOk ? 7 : 0);
    const fullyCorrect = codeOk && telemOk && remedOk;

    breakdown.push({
      id: sc.id,
      label: exp.title,
      achieved: fullyCorrect,
      points: pts,
      maxPoints: 20,
      explanation: fullyCorrect
        ? `Correcto (20/20): ${exp.rationale}`
        : `Parcial (${pts}/20): Se esperaba Código MITRE ${exp.code}, Telemetría ${exp.telemetry} y Remediación ${exp.remediation}. ${exp.rationale}`
    });
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Maestría en Threat Hunting y MITRE ATT&CK demostrada! Has identificado los Event IDs forenses de Active Directory y aplicado las remediaciones oficiales de CompTIA: gMSA para Kerberoasting, Credential Guard para LSASS, doble reset de KRBTGT para Golden Ticket y CLM para PowerShell.'
        : `Puntuación obtenida: ${totalScore}/100. En el examen CompTIA: Event 4769 RC4 es Kerberoasting; T1003 es volcado de LSASS mitigado por Credential Guard; Golden Ticket requiere doble reseteo de KRBTGT.`,
    sy0701Objective: 'Objetivo 4.3: Analizar e investigar indicadores de compromiso (IoC) y actividades sospechosas mediante telemetría SIEM.',
    domainName: 'Dominio 4: Operaciones de Seguridad (Threat Hunting & SIEM)'
  };
}

// ==========================================
// PBQ 43: Data Governance, Roles, Lifecycle & Sanitization
// ==========================================
export function evaluateDataGovernancePBQ43(state: DataGovernanceState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  // 1. Roles
  const ownerOk = state.ownerRoleAssignment === 'data_owner';
  breakdown.push({
    id: 'gov-role-owner',
    label: 'Rol de Negocio Responsable Final y Clasificación (Data Owner / Propietario)',
    achieved: ownerOk,
    points: ownerOk ? 9 : 0,
    maxPoints: 9,
    explanation: ownerOk
      ? 'Correcto: El Data Owner es el ejecutivo o gerente de línea de negocio que determina el valor de los datos, aprueba la clasificación de seguridad y decide quién tiene derecho a acceder a ellos.'
      : 'Incorrecto: El Data Owner es la persona de negocios con la responsabilidad última sobre la información (no el administrador técnico).'
  });

  const stewardOk = state.stewardRoleAssignment === 'data_steward';
  breakdown.push({
    id: 'gov-role-steward',
    label: 'Gobernanza de Calidad, Etiquetado y Cumplimiento de Políticas (Data Steward)',
    achieved: stewardOk,
    points: stewardOk ? 9 : 0,
    maxPoints: 9,
    explanation: stewardOk
      ? 'Correcto: El Data Steward se encarga del gobierno operativo de datos: precisión, calidad, etiquetado formal y supervisar que se cumplan las políticas de retención y privacidad.'
      : 'Incorrecto: El Data Steward vela por la calidad, formato y cumplimiento normativo del ciclo de vida del dato.'
  });

  const custodianOk = state.custodianRoleAssignment === 'data_custodian';
  breakdown.push({
    id: 'gov-role-custodian',
    label: 'Administración Técnica, Backups y Almacenamiento (Data Custodian / Custodio)',
    achieved: custodianOk,
    points: custodianOk ? 9 : 0,
    maxPoints: 9,
    explanation: custodianOk
      ? 'Correcto: El Data Custodian (generalmente el equipo de TI / DBAs) implementa los controles técnicos dictados por el Owner: backups, cifrado, mantenimiento de hardware y recuperación ante desastres.'
      : 'Incorrecto: El Data Custodian gestiona la infraestructura técnica y los backups donde residen los datos.'
  });

  const dpoOk = state.privacyOfficerAssignment === 'data_privacy_officer';
  breakdown.push({
    id: 'gov-role-dpo',
    label: 'Oficial de Privacidad de Datos y Cumplimiento Normativo (DPO / Privacy Officer)',
    achieved: dpoOk,
    points: dpoOk ? 9 : 0,
    maxPoints: 9,
    explanation: dpoOk
      ? 'Correcto: El Data Privacy Officer (DPO) garantiza el cumplimiento de leyes como GDPR, HIPAA y CCPA, audita las evaluaciones de impacto de privacidad (DPIA) y atiende solicitudes ARCO.'
      : 'Incorrecto: El DPO supervisa el cumplimiento legal de privacidad y los derechos de los titulares de datos.'
  });

  // 2. Data States
  const transitOk = state.inTransitProtection === 'tls_13_ipsec';
  breakdown.push({
    id: 'gov-state-transit',
    label: 'Protección de Datos en Tránsito (Data in Transit - TLS 1.3 / IPsec)',
    achieved: transitOk,
    points: transitOk ? 10 : 0,
    maxPoints: 10,
    explanation: transitOk
      ? 'Correcto: Los datos que viajan a través de redes públicas o privadas se protegen mediante TLS 1.3 con secreto perfecto hacia adelante (PFS) o túneles cifrados IPsec ESP.'
      : 'Incorrecto: Datos en tránsito requiere cifrado de transporte como TLS o IPsec.'
  });

  const restOk = state.atRestProtection === 'aes_256_bitlocker';
  breakdown.push({
    id: 'gov-state-rest',
    label: 'Protección de Datos en Reposo (Data at Rest - AES-256 / BitLocker / TDE)',
    achieved: restOk,
    points: restOk ? 10 : 0,
    maxPoints: 10,
    explanation: restOk
      ? 'Correcto: Los datos en reposo (bases de datos, discos duros, almacenamiento cloud) se protegen mediante cifrado simétrico AES-256 (BitLocker, LUKS o TDE).'
      : 'Incorrecto: Datos en reposo requiere cifrado de almacenamiento como AES-256.'
  });

  const useOk = state.inUseProtection === 'confidential_computing_enclaves';
  breakdown.push({
    id: 'gov-state-use',
    label: 'Protección de Datos en Uso (Data in Use - Enclaves Seguros / Memoria Cifrada)',
    achieved: useOk,
    points: useOk ? 10 : 0,
    maxPoints: 10,
    explanation: useOk
      ? 'Correcto: Los datos en memoria RAM durante el procesamiento activo por la CPU se protegen mediante Computación Confidencial (enclaves aislados por hardware como Intel SGX o AMD SEV).'
      : 'Incorrecto: Para datos en uso (memoria activa), CompTIA prescribe Computación Confidencial y enclaves de memoria cifrada.'
  });

  // 3. Sanitization
  const clearOk = state.clearingMethod === 'logical_overwrite_zero_fill';
  breakdown.push({
    id: 'gov-sanit-clearing',
    label: 'Sanitización: Clearing (Sobreescritura Lógica para Reutilización Interna)',
    achieved: clearOk,
    points: clearOk ? 8 : 0,
    maxPoints: 8,
    explanation: clearOk
      ? 'Correcto: Clearing escribe ceros o patrones aleatorios en todos los sectores lógicos para que los datos no puedan recuperarse con herramientas de software comunes, permitiendo reutilizar el disco dentro de la misma empresa.'
      : 'Incorrecto: Clearing es la sobreescritura de sectores para reutilización interna bajo el estándar NIST SP 800-88.'
  });

  const purgeOk = state.purgingMethod === 'degaussing_magnetic';
  breakdown.push({
    id: 'gov-sanit-purging',
    label: 'Sanitización: Purging (Desmagnetización / Degaussing para HDD Magnéticos)',
    achieved: purgeOk,
    points: purgeOk ? 9 : 0,
    maxPoints: 9,
    explanation: purgeOk
      ? 'Correcto: Purging/Degaussing expone el medio magnético a un campo magnético de alta intensidad que destruye permanentemente los dominios magnéticos, impidiendo la recuperación incluso en laboratorios forenses.'
      : 'Incorrecto: Purging mediante Degaussing desmagnetiza platos de HDD magnéticos para evitar recuperación forense.'
  });

  const destOk = state.destructionMethod === 'physical_shredding_incineration';
  breakdown.push({
    id: 'gov-sanit-destruction',
    label: 'Sanitización: Destrucción Física (Trituración / Shredding para Fin de Vida)',
    achieved: destOk,
    points: destOk ? 9 : 0,
    maxPoints: 9,
    explanation: destOk
      ? 'Correcto: La destrucción física mediante trituración mecánica (Shredding), incineración o desintegración es el único método definitivo para medios de estado sólido (SSD/NVMe) o fin de vida que entrega un Certificado de Destrucción.'
      : 'Incorrecto: La destrucción física (trituración mecánica / incineración) se utiliza para fin de vida con certificado.'
  });

  const cryptoShredOk = state.cryptoShreddingMethod === 'cryptographic_erasure_key_destruction';
  breakdown.push({
    id: 'gov-sanit-crypto',
    label: 'Sanitización Cloud: Cryptographic Erasure (Crypto-shredding / Destrucción de Clave)',
    achieved: cryptoShredOk,
    points: cryptoShredOk ? 8 : 0,
    maxPoints: 8,
    explanation: cryptoShredOk
      ? 'Correcto: Crypto-shredding (Borrado Criptográfico) destruye deliberadamente la clave de descifrado (DEK/KEK) de un volumen cifrado con AES-256, volviendo los datos matemáticamente irrecuperables de forma instantánea en entornos de nube.'
      : 'Incorrecto: En la nube pública donde no hay acceso físico a los discos, se aplica Crypto-shredding destruyendo las claves KMS.'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Maestría en Gobernanza de Datos y NIST SP 800-88 demostrada! Has diferenciado con exactitud los roles (Owner, Steward, Custodian, DPO), los tres estados del dato (Transit, Rest, Use) y las técnicas de sanitización (Clearing, Purging, Destruction y Crypto-shredding).'
        : `Puntuación obtenida: ${totalScore}/100. En CompTIA: el Data Owner clasifica y autoriza accesos; Computación Confidencial protege datos en uso; Degaussing es Purging para HDD; Crypto-shredding destruye claves en la nube.`,
    sy0701Objective: 'Objetivo 1.2: Explicar la importancia de la clasificación, gobernanza de datos, privacidad y cumplimiento normativo.',
    domainName: 'Dominio 1: Conceptos Generales de Seguridad (Data Governance & Privacy)'
  };
}

// ==========================================
// PBQ 44: Privacy Enhancing Technologies (PETs) & Data Obfuscation
// ==========================================
export function evaluatePrivacyPetsPBQ44(state: PrivacyPetsState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const expectedScenarios: Record<string, { tech: string; rev: string; title: string; rationale: string }> = {
    'pet-pci-dss': {
      tech: 'tokenization',
      rev: 'reversible_with_vault',
      title: 'Pasarela de Pagos de Tarjetas de Crédito (Cumplimiento PCI-DSS)',
      rationale: 'Tokenization sustituye el número PAN por un token aleatorio sin valor matemático, reduciendo el alcance (scope) de la auditoría PCI-DSS a un vault seguro.'
    },
    'pet-dev-qa': {
      tech: 'static_masking',
      rev: 'irreversible',
      title: 'Base de Datos para Entornos de Pruebas y Desarrollo (Dev/QA)',
      rationale: 'Static Data Masking ofusca de forma permanente e irreversible los datos sensibles antes de clonar la base de datos hacia entornos de desarrollo no seguros.'
    },
    'pet-call-center': {
      tech: 'dynamic_masking',
      rev: 'on_the_fly_display',
      title: 'Atención Telefónica al Cliente en Tiempo Real (Call Center)',
      rationale: 'Dynamic Data Masking altera los datos al vuelo en la capa de presentación (ej. ************1234), sin modificar el dato real subyacente en el disco de la base de datos.'
    },
    'pet-epidemiology': {
      tech: 'anonymization',
      rev: 'irreversible',
      title: 'Investigación Médica y Analítica Epidemiológica (GDPR Recital 26)',
      rationale: 'Anonymization elimina irreversiblemente cualquier identificador directo e indirecto sin conservar tabla de mapeo, dejando los datos fuera del alcance restrictivo de GDPR.'
    },
    'pet-clinical-trials': {
      tech: 'pseudonymization',
      rev: 'reversible_with_key',
      title: 'Ensayos Clínicos Farmacéuticos con Re-identificación Médica',
      rationale: 'Pseudonymization sustituye los datos personales por un código identificador, conservando una clave de correspondencia separada y cifrada para emergencias médicas.'
    }
  };

  state.scenarios.forEach((sc) => {
    const exp = expectedScenarios[sc.id];
    if (!exp) return;

    const techOk = sc.selectedTechnique === exp.tech;
    const revOk = sc.reversibility === exp.rev;
    const fullyCorrect = techOk && revOk;
    const pts = (techOk ? 10 : 0) + (revOk ? 10 : 0);

    breakdown.push({
      id: sc.id,
      label: exp.title,
      achieved: fullyCorrect,
      points: pts,
      maxPoints: 20,
      explanation: fullyCorrect
        ? `Correcto (20/20): Técnica "${exp.tech}" y reversibilidad "${exp.rev}". ${exp.rationale}`
        : `Parcial (${pts}/20): Se esperaba técnica ${exp.tech.toUpperCase()} y reversibilidad ${exp.rev}. ${exp.rationale}`
    });
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Dominio absoluto de Tecnologías de Protección de Privacidad (PETs)! Has implementado Tokenización para PCI-DSS, Enmascaramiento Estático para Dev/QA, Enmascaramiento Dinámico para Call Center, Anonimización para investigación y Seudonimización para ensayos clínicos.'
        : `Puntuación obtenida: ${totalScore}/100. En CompTIA: Tokenization usa un vault para pagos; Anonimización es irreversible (sin clave); Seudonimización permite re-identificación con clave separada; Dynamic Masking es solo visual al vuelo.`,
    sy0701Objective: 'Objetivo 1.2: Clasificar la información y aplicar conceptos de privacidad y tecnologías de mejora de la privacidad (PETs).',
    domainName: 'Dominio 1: Conceptos Generales de Seguridad (Privacy Enhancing Technologies)'
  };
}

// ==========================================
// PBQ 45: Malware Triage Parte 1 (Endpoints & Criptografía)
// ==========================================
export function evaluateMalwareTriagePBQ45(state: MalwareTriageState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const expectedCases: Record<string, { type: string; remediation: string; title: string; rationale: string }> = {
    'mw-ransomware': {
      type: 'ransomware_crypto',
      remediation: 'isolate_restore_offline_backups',
      title: 'Caso 1: Cifrado Masivo de Archivos y Borrado de Volume Shadows (vssadmin)',
      rationale: 'El cifrado masivo con notas de rescate y la eliminación de shadow copies identifica a un Ransomware. La remediación obligatoria es el aislamiento inmediato de red y restauración desde backups inmutables/offline 3-2-1.'
    },
    'mw-rat': {
      type: 'remote_access_trojan_rat',
      remediation: 'isolate_terminate_rat_revoke_creds',
      title: 'Caso 2: Utilidad Descargada, Backdoor Inverso y Control Remoto de Cámara/Mouse',
      rationale: 'Un troyano de acceso remoto (RAT) abre un canal de control C2 interactivo. Se debe aislar el host, finalizar el proceso malicioso en memoria, limpiar la persistencia en el registro y revocar credenciales de inmediato.'
    },
    'mw-rootkit': {
      type: 'kernel_rootkit',
      remediation: 'clean_reimage_uefi_secureboot',
      title: 'Caso 3: Ocultamiento de Procesos y Conexiones en Nivel Kernel (Ring 0 / UEFI)',
      rationale: 'La invisibilidad ante comandos estándar de SO (ps, top, netstat) y la evasión de antivirus en modo usuario indica un Rootkit de Kernel. Requiere reinstalación completa (Clean Reimaging) y forzar UEFI Secure Boot con TPM.'
    },
    'mw-spyware-keylogger': {
      type: 'spyware_infostealer',
      remediation: 'edr_clean_rotate_creds_fido2_mfa',
      title: 'Caso 4: Robo de Pulsaciones (GetAsyncKeyState) y Extracción de Cookies de Navegador',
      rationale: 'El espionaje pasivo de credenciales y cookies de sesión corresponde a Spyware / InfoStealer & Keylogger. Requiere limpieza con EDR, invalidación de tokens de sesión, rotación de contraseñas y MFA resistente a phishing (FIDO2).'
    },
    'mw-fileless-lotl': {
      type: 'fileless_living_off_the_land',
      remediation: 'reboot_clm_applocker_wdac',
      title: 'Caso 5: Inyección en Memoria y Scripts PowerShell Base64 Living-off-the-Land (LotL)',
      rationale: 'La ausencia de binarios en disco y la ejecución en memoria mediante PowerShell con scripts Base64 define al Malware Sin Archivos (Fileless/LotL). Se remedia reiniciando el host para vaciar RAM y aplicando Constrained Language Mode y WDAC/AppLocker.'
    }
  };

  state.scenarios.forEach((sc) => {
    const exp = expectedCases[sc.id];
    if (!exp) return;

    const typeOk = sc.selectedMalwareType === exp.type;
    const remOk = sc.selectedRemediation === exp.remediation;
    const fullyCorrect = typeOk && remOk;
    const pts = (typeOk ? 10 : 0) + (remOk ? 10 : 0);

    breakdown.push({
      id: sc.id,
      label: exp.title,
      achieved: fullyCorrect,
      points: pts,
      maxPoints: 20,
      explanation: fullyCorrect
        ? `Correcto (20/20): Tipo "${exp.type}" y Remediación "${exp.remediation}". ${exp.rationale}`
        : `Parcial (${pts}/20): Se esperaba tipo ${exp.type} y remediación ${exp.remediation}. ${exp.rationale}`
    });
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Triage forense de malware impecable! Has identificado con precisión Ransomware, RAT, Rootkit de Kernel, Spyware/InfoStealer y Fileless Malware, aplicando la remediación oficial prescrita por CompTIA.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda: Ransomware se remedia con backups offline; Rootkit requiere re-imaging limpio; Fileless requiere purga de memoria y políticas WDAC/AppLocker.`,
    sy0701Objective: 'Objetivo 2.2: Analizar indicadores asociados con ataques de malware y seleccionar la mitigación técnica adecuada.',
    domainName: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones (Malware Triage)'
  };
}

// ==========================================
// PBQ 46: Malware Triage Parte 2 (Red, Lógica y Evasión Avanzada)
// ==========================================
export function evaluateMalwareTriagePBQ46(state: MalwareTriageState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const expectedCases: Record<string, { type: string; remediation: string; title: string; rationale: string }> = {
    'mw-worm': {
      type: 'network_worm',
      remediation: 'segment_vlan_patch_smb_disable_v1',
      title: 'Caso 1: Propagación Lateral Autónoma en Red por Puerto SMB (TCP 445)',
      rationale: 'La infección masiva sin interacción humana explotando puertos de red (445 SMB) es la firma clásica de un Gusano de Red (Worm). Requiere aislamiento de VLAN, deshabilitar SMBv1 por GPO, parchear el sistema operativo y microsegmentación.'
    },
    'mw-botnet': {
      type: 'botnet_zombie_c2',
      remediation: 'dns_sinkhole_block_c2_edr_quarantine',
      title: 'Caso 2: Red de Hosts Zombi con Balizas C2 Periódicas y Ataques DDoS Coordinados',
      rationale: 'Las balizas periódicas sincronizadas hacia dominios DGA para lanzar ataques coordinados identifican una Botnet. Se remedia implementando DNS Sinkholing para redirigir el tráfico malicioso, bloqueando el C2 en el firewall y desinfectando con EDR.'
    },
    'mw-logic-bomb': {
      type: 'logic_bomb_insider',
      remediation: 'restore_immutable_code_review_separation_duties',
      title: 'Caso 3: Código Latente Condicional Implantado por Amenaza Interna (Insider)',
      rationale: 'La ejecución destructiva condicionada al despido del administrador es una Bomba Lógica (Logic Bomb). Requiere restauración de datos desde copias inmutables, revisión de código por pares, separación de deberes y protocolos estrictos de offboarding.'
    },
    'mw-cryptominer': {
      type: 'cryptojacking_cryptominer',
      remediation: 'kill_process_block_mining_pools_audit_cron',
      title: 'Caso 4: Secuestro de CPU al 100% y Tráfico hacia Mining Pools (Puerto 3333)',
      rationale: 'El uso permanente de CPU/GPU al límite y conexiones con protocolo Stratum/puerto 3333 hacia pools de minería indica Cryptojacking. Requiere finalizar el proceso malicioso, bloquear pools de minería en NGFW/DNS y auditar tareas programadas.'
    },
    'mw-polymorphic': {
      type: 'polymorphic_metamorphic',
      remediation: 'behavioral_edr_ai_heuristics_sandboxing',
      title: 'Caso 5: Mutación Continua de Binarios que Invalida Listas Negras de Hashes',
      rationale: 'Un malware que muta su firma hash en cada copia mediante cifrado variable es Malware Polimórfico. Las firmas hash estáticas son inútiles; se debe implementar EDR con análisis heurístico de comportamiento y detonación en Sandbox.'
    }
  };

  state.scenarios.forEach((sc) => {
    const exp = expectedCases[sc.id];
    if (!exp) return;

    const typeOk = sc.selectedMalwareType === exp.type;
    const remOk = sc.selectedRemediation === exp.remediation;
    const fullyCorrect = typeOk && remOk;
    const pts = (typeOk ? 10 : 0) + (remOk ? 10 : 0);

    breakdown.push({
      id: sc.id,
      label: exp.title,
      achieved: fullyCorrect,
      points: pts,
      maxPoints: 20,
      explanation: fullyCorrect
        ? `Correcto (20/20): Tipo "${exp.type}" y Remediación "${exp.remediation}". ${exp.rationale}`
        : `Parcial (${pts}/20): Se esperaba tipo ${exp.type} y remediación ${exp.remediation}. ${exp.rationale}`
    });
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Excelente triage de amenazas avanzadas y de red! Has clasificado Gusanos de Red, Botnets, Bombas Lógicas, Cryptojacking y Malware Polimórfico con sus contramedidas oficiales.'
        : `Puntuación obtenida: ${totalScore}/100. Recuerda: Gusanos se propagan solos por red; Botnets usan C2 y DNS Sinkhole; Cryptominers saturan CPU; Polimórfico requiere EDR heurístico/comportamental.`,
    sy0701Objective: 'Objetivo 2.2: Comparar y contrastar tipos de malware y aplicar controles de remediación basados en telemetría de red y endpoint.',
    domainName: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones (Network & Advanced Malware)'
  };
}

// ==========================================
// PBQ 47: Secure Software Development & OWASP API Top 10
// ==========================================
export function evaluateApiSecurityPBQ47(state: ApiSecurityState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const expectedCases: Record<string, { vuln: string; rem: string; title: string; rationale: string }> = {
    'api-bola': {
      vuln: 'bola_idor',
      rem: 'contextual_rbac_object_ownership',
      title: 'Caso 1: Broken Object Level Authorization (BOLA / IDOR) en Endpoint de Facturación',
      rationale: 'Modificar el identificador de usuario en la URI para acceder a registros ajenos es BOLA (OWASP API1). Se remedia validando la propiedad del objeto contra la sesión autenticada con RBAC en el backend.'
    },
    'api-ssrf': {
      vuln: 'ssrf_cloud_metadata',
      rem: 'url_whitelist_disable_metadata_v1',
      title: 'Caso 2: Server-Side Request Forgery (SSRF) contra Metadatos Cloud (169.254.169.254)',
      rationale: 'Forzar al servidor a consultar la IP de enlace local 169.254.169.254 para robar credenciales IAM temporales es SSRF (OWASP API7). Requiere listas blancas de URLs, bloquear link-local y forzar IMDSv2 con tokens de sesión.'
    },
    'api-jwt': {
      vuln: 'jwt_alg_none_tampering',
      rem: 'enforce_asymmetric_jwt_verify_reject_none',
      title: 'Caso 3: Manipulación de Token JWT por Aceptación de Algoritmo "none" (Broken Authentication)',
      rationale: 'Permitir tokens JWT con alg: "none" sin firma criptográfica permite escalamiento arbitrario de privilegios. Se remedia rechazando tokens "none", forzando RS256/ES256 y validando firmas contra JWKS público.'
    },
    'api-sqli': {
      vuln: 'sqli_api_unparameterized',
      rem: 'prepared_statements_orm_parameterized',
      title: 'Caso 4: Inyección SQL en Parámetros de Filtro de API REST (Falta de Sanitización)',
      rationale: 'Concatenar cadenas SQL en endpoints REST permite extracción no autorizada de tablas. La remediación obligatoria son consultas parametrizadas (Prepared Statements) u ORMs seguros.'
    },
    'api-rate-limit': {
      vuln: 'lack_of_rate_limiting_stuffing',
      rem: 'api_gateway_rate_limiting_waf_captcha',
      title: 'Caso 5: Falta de Limitación de Recursos y Rate Limiting (Credential Stuffing Masivo)',
      rationale: 'Permitir miles de intentos de login por segundo sin restricción facilita ataques de fuerza bruta y DDoS. Se remedia implementando Rate Limiting en API Gateway (Token Bucket), WAF y CAPTCHA adaptativo.'
    }
  };

  state.scenarios.forEach((sc) => {
    const exp = expectedCases[sc.id];
    if (!exp) return;

    const vulnOk = sc.identifiedVulnerability === exp.vuln;
    const remOk = sc.secureRemediation === exp.rem;
    const fullyCorrect = vulnOk && remOk;
    const pts = (vulnOk ? 10 : 0) + (remOk ? 10 : 0);

    breakdown.push({
      id: sc.id,
      label: exp.title,
      achieved: fullyCorrect,
      points: pts,
      maxPoints: 20,
      explanation: fullyCorrect
        ? `Correcto (20/20): Vulnerabilidad "${exp.vuln}" y Remediación "${exp.rem}". ${exp.rationale}`
        : `Parcial (${pts}/20): Se esperaba vulnerabilidad ${exp.vuln} y remediación ${exp.rem}. ${exp.rationale}`
    });
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Maestría en Seguridad de APIs y Desarrollo Seguro (SDLC)! Has mitigado BOLA, SSRF contra metadatos en la nube, falsificación de JWT "alg: none", inyecciones SQL en APIs y ataques de Credential Stuffing.'
        : `Puntuación obtenida: ${totalScore}/100. En CompTIA: BOLA requiere validación a nivel de objeto; SSRF contra 169.254.169.254 requiere listas blancas y migración a IMDSv2; JWT debe rechazar "none"; SQLi se mitiga con Prepared Statements.`,
    sy0701Objective: 'Objetivo 3.4: Aplicar conceptos de seguridad al ciclo de vida del desarrollo de software (SDLC) y arquitectura de APIs seguras.',
    domainName: 'Dominio 3: Arquitectura de Seguridad (Application & API Security)'
  };
}

// ==========================================
// PBQ 48: SIEM Correlation Rules & SOAR Playbook Automation
// ==========================================
export function evaluateSoarAutomationPBQ48(state: SoarAutomationState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const expectedCases: Record<string, { trigger: string; action: string; title: string; rationale: string }> = {
    'soar-impossible-travel': {
      trigger: 'impossible_travel_anomaly',
      action: 'revoke_session_prompt_mfa_disable',
      title: 'Caso 1: Detección de Viaje Imposible (Impossible Travel Anomaly) en IdP Cloud',
      rationale: 'Autenticaciones exitosas simultáneas desde ubicaciones geográficas distantes en minutos indica robo de credenciales. El playbook SOAR debe revocar tokens de sesión activos inmediatamente y forzar MFA FIDO2.'
    },
    'soar-ransomware-mass-io': {
      trigger: 'mass_file_entropy_vss_wipe',
      action: 'quarantine_host_edr_block_c2_perimeter',
      title: 'Caso 2: Detección de Pico Masivo de I/O y Cifrado + Borrado de Copias de Sombra',
      rationale: 'El cifrado acelerado y la ejecución de vssadmin es un brote de Ransomware activo. La acción automática prioritaria es el aislamiento de red del host en el EDR y el bloqueo perimetral del C2.'
    },
    'soar-phishing-macro-shell': {
      trigger: 'office_child_process_powershell_network',
      action: 'kill_tree_quarantine_attachment_purge_mailboxes',
      title: 'Caso 3: Documento de Office Generando Proceso Hijo PowerShell con Conexión Externa',
      rationale: 'Una macro de Office invocando PowerShell hacia la WAN es una shell reversa maliciosa. El SOAR debe terminar el árbol de procesos, aislar el endpoint y purgar el correo de todos los buzones corporativos.'
    },
    'soar-ssh-brute-burst': {
      trigger: 'ssh_failed_auth_threshold_burst',
      action: 'push_temporary_block_ngfw_ban',
      title: 'Caso 4: Ataque de Fuerza Bruta Masivo contra Servidor Bastión SSH (Puerto 22)',
      rationale: 'Cientos de autenticaciones fallidas en segundos es un ataque de fuerza bruta automatizado. La acción SOAR óptima es insertar una regla de bloqueo dinámico temporal en el NGFW perimetral.'
    },
    'soar-domain-admin-offhours': {
      trigger: 'unauthorized_domain_admin_escalation_offhours',
      action: 'remove_member_disable_account_page_oncall',
      title: 'Caso 5: Adición No Autorizada al Grupo "Domain Admins" Fuera de Horario Comercial',
      rationale: 'Agregar una cuenta a Domain Admins en la madrugada sin ticket de cambio es un intento de persistencia o escalamiento de privilegios. El SOAR debe revertir la membresía, suspender la cuenta y alertar al analista de guardia.'
    }
  };

  state.scenarios.forEach((sc) => {
    const exp = expectedCases[sc.id];
    if (!exp) return;

    const trigOk = sc.correlationTrigger === exp.trigger;
    const actOk = sc.automatedSoarAction === exp.action;
    const fullyCorrect = trigOk && actOk;
    const pts = (trigOk ? 10 : 0) + (actOk ? 10 : 0);

    breakdown.push({
      id: sc.id,
      label: exp.title,
      achieved: fullyCorrect,
      points: pts,
      maxPoints: 20,
      explanation: fullyCorrect
        ? `Correcto (20/20): Disparador "${exp.trigger}" y Acción SOAR "${exp.action}". ${exp.rationale}`
        : `Parcial (${pts}/20): Se esperaba disparador ${exp.trigger} y acción ${exp.action}. ${exp.rationale}`
    });
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Excelencia en Operaciones de SOC, SIEM y Automatización SOAR! Has configurado reglas de correlación precisas y playbooks automatizados para Viaje Imposible, Ransomware, Phishing, Fuerza Bruta y Escalamiento de Privilegios.'
        : `Puntuación obtenida: ${totalScore}/100. En CompTIA: Impossible Travel revoca tokens de sesión; Ransomware aisla el host en EDR; Macros maliciosas purgan los correos; Fuerza bruta inserta reglas dinámicas en el firewall; Escalamiento revierte membresía en AD.`,
    sy0701Objective: 'Objetivo 4.2: Explicar las características de la automatización y orquestación de la seguridad (SOAR) y la correlación de eventos en el SIEM.',
    domainName: 'Dominio 4: Operaciones de Seguridad (SIEM Correlation & SOAR Automation)'
  };
}

// ==========================================
// PBQ 49: Advanced Stateful Firewall ACLs & DMZ Multi-Tier Filtering
// ==========================================
export function evaluateFirewallAclPBQ49(rules: FirewallRule[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  // Helper matching
  const isAnyIp = (ip: string) => {
    const s = ip.trim().toUpperCase();
    return s === '0.0.0.0/0' || s === 'ANY' || s === '*';
  };

  // 1. Inbound Web HTTPS to DMZ Web Server (172.16.10.10)
  const httpsRule = rules.find(
    (r) =>
      r.enabled &&
      r.action === 'PERMIT' &&
      r.destPort.trim() === '443' &&
      r.destIp.trim() === '172.16.10.10' &&
      isAnyIp(r.sourceIp)
  );
  breakdown.push({
    id: 'fw49-https',
    label: 'Regla 1: Tráfico Web HTTPS Inbound (WAN -> DMZ Web Server 172.16.10.10:443)',
    achieved: !!httpsRule,
    points: httpsRule ? 15 : 0,
    maxPoints: 15,
    explanation: httpsRule
      ? 'Correcto: Se permite tráfico HTTPS TCP 443 desde WAN hacia el servidor web en la DMZ.'
      : 'Incorrecto: Debe permitirse tráfico TCP 443 desde WAN (0.0.0.0/0) hacia el servidor web específico 172.16.10.10.'
  });

  // 2. Inbound Mail SMTPS to DMZ Mail Gateway (172.16.10.20)
  const mailRule = rules.find(
    (r) =>
      r.enabled &&
      r.action === 'PERMIT' &&
      (r.destPort.trim() === '465' || r.destPort.trim() === '587' || r.destPort.trim() === '25') &&
      r.destIp.trim() === '172.16.10.20' &&
      isAnyIp(r.sourceIp)
  );
  breakdown.push({
    id: 'fw49-mail',
    label: 'Regla 2: Pasarela de Correo SMTPS Inbound (WAN -> DMZ Mail Gateway 172.16.10.20)',
    achieved: !!mailRule,
    points: mailRule ? 15 : 0,
    maxPoints: 15,
    explanation: mailRule
      ? 'Correcto: Se autoriza la recepción de correo seguro SMTPS hacia la pasarela perimetral en la DMZ.'
      : 'Incorrecto: La pasarela de correo 172.16.10.20 debe recibir correo seguro (puertos 465/587/25).'
  });

  // 3. Web Server DMZ to Database PostgreSQL (10.0.30.50)
  const dbRule = rules.find(
    (r) =>
      r.enabled &&
      r.action === 'PERMIT' &&
      (r.destPort.trim() === '5432' || r.destPort.trim() === '3306') &&
      r.destIp.trim() === '10.0.30.50'
  );
  const dbStrictSource = dbRule && dbRule.sourceIp.trim() === '172.16.10.10';
  const dbAchieved = !!dbStrictSource;
  breakdown.push({
    id: 'fw49-db',
    label: 'Regla 3: Menor Privilegio BD (ÚNICAMENTE DMZ Web Server 172.16.10.10 -> DB 10.0.30.50:5432)',
    achieved: dbAchieved,
    points: dbStrictSource ? 15 : dbRule ? 5 : 0,
    maxPoints: 15,
    explanation: dbStrictSource
      ? 'Correcto (Least Privilege): Solo el servidor web 172.16.10.10 puede conectarse al puerto 5432 de la BD.'
      : dbRule
      ? 'Parcial: La regla permite acceso a la BD pero el origen es demasiado permisivo. Debe limitarse estrictamente a 172.16.10.10.'
      : 'Incorrecto: Se debe permitir tráfico TCP 5432 hacia 10.0.30.50 originado exclusivamente en 172.16.10.10.'
  });

  // 4. DMZ to LAN Isolation Block
  const dmzLanBlock = rules.find(
    (r) =>
      r.enabled &&
      r.action === 'DENY' &&
      (r.sourceIp.includes('172.16.10') || isAnyIp(r.sourceIp)) &&
      (r.destIp.includes('10.0.20') || r.destIp.includes('10.0.'))
  );
  breakdown.push({
    id: 'fw49-dmz-lan',
    label: 'Regla 4: Aislamiento DMZ (Bloqueo Estricto de Tráfico DMZ -> LAN Interna 10.0.20.0/24)',
    achieved: !!dmzLanBlock,
    points: dmzLanBlock ? 15 : 0,
    maxPoints: 15,
    explanation: dmzLanBlock
      ? 'Correcto: Se bloquea el tráfico de la DMZ hacia la LAN interna, previniendo movimiento lateral de atacantes.'
      : 'Incorrecto: La DMZ nunca debe tener acceso a las estaciones de trabajo de la LAN interna (10.0.20.0/24).'
  });

  // 5. Outbound Web from LAN to WAN
  const lanOutRule = rules.find(
    (r) =>
      r.enabled &&
      r.action === 'PERMIT' &&
      r.sourceIp.includes('10.0.20') &&
      isAnyIp(r.destIp) &&
      (r.destPort.trim() === '443' || isAnyIp(r.destPort))
  );
  breakdown.push({
    id: 'fw49-lan-web',
    label: 'Regla 5: Salida Web Segura (LAN Corporativa 10.0.20.0/24 -> WAN HTTPS:443)',
    achieved: !!lanOutRule,
    points: lanOutRule ? 15 : 0,
    maxPoints: 15,
    explanation: lanOutRule
      ? 'Correcto: Los empleados de la LAN pueden navegar hacia Internet de forma segura por HTTPS.'
      : 'Incorrecto: Debe permitirse la salida web HTTPS (TCP 443) desde la LAN corporativa 10.0.20.0/24 hacia WAN.'
  });

  // 6. Block direct WAN to DB PCI-DSS
  const wanDbBlock = rules.find(
    (r) =>
      r.enabled &&
      r.action === 'DENY' &&
      isAnyIp(r.sourceIp) &&
      (r.destIp.includes('10.0.30') || r.destIp.trim() === '10.0.30.50')
  );
  breakdown.push({
    id: 'fw49-wan-db',
    label: 'Regla 6: Bloqueo de Acceso Directo WAN -> Base de Datos PCI-DSS (10.0.30.0/24)',
    achieved: !!wanDbBlock,
    points: wanDbBlock ? 10 : 0,
    maxPoints: 10,
    explanation: wanDbBlock
      ? 'Correcto: Se previene categóricamente cualquier intento de conexión directa desde Internet a la subred de base de datos.'
      : 'Incorrecto: La subred de tarjetas y base de datos PCI-DSS nunca debe recibir conexiones directas desde WAN.'
  });

  // 7. Rule Order & Implicit Deny All
  const denyAllIndex = rules.findIndex(
    (r) =>
      r.enabled &&
      r.action === 'DENY' &&
      isAnyIp(r.sourceIp) &&
      isAnyIp(r.destIp) &&
      (isAnyIp(r.destPort) || r.destPort === '')
  );

  const lastPermitIndex = rules
    .map((r, i) => (r.enabled && r.action === 'PERMIT' ? i : -1))
    .reduce((max, cur) => Math.max(max, cur), -1);

  const orderCorrect = denyAllIndex !== -1 && denyAllIndex > lastPermitIndex;

  breakdown.push({
    id: 'fw49-order',
    label: 'Regla 7: First-Match & Denegación Implícita Final (Implicit Deny Any Any)',
    achieved: orderCorrect,
    points: orderCorrect ? 15 : 0,
    maxPoints: 15,
    explanation: orderCorrect
      ? 'Correcto: La regla "DENY ANY ANY" se ubica al final de la tabla, garantizando que las reglas permisivas específicas se evalúen primero.'
      : 'Incorrecto: Se debe colocar una regla "DENY ANY ANY" al final absoluto de la tabla de reglas (First-Match).'
  });

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Configuración de Firewall NGFW perfecta! Has aplicado First-Match, Least Privilege para la Base de Datos PCI-DSS y Aislamiento estricto de la DMZ.'
        : `Puntuación obtenida: ${totalScore}/100. En CompTIA: La BD solo debe aceptar a 172.16.10.10, la DMZ no debe entrar a la LAN y Deny All va al final.`,
    sy0701Objective: 'Objetivo 3.2: Aplicar conceptos de seguridad al diseño y segmentación de redes perimetrales e internas.',
    domainName: 'Dominio 3: Arquitectura de Seguridad (Firewall ACL & Microsegmentation)'
  };
}

// ==========================================
// PBQ 50: Endpoint & Network Port Hardening + Protocol Migration Audit
// ==========================================
export function evaluateProtocolMigrationPBQ50(items: PortAuditItem[]): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  const expectedMap: Record<
    string,
    {
      label: string;
      insecurity: string;
      port: number;
      protocol: string;
      remediation: string;
      insecurityExp: string;
      solutionExp: string;
    }
  > = {
    'port50-core-switch': {
      label: 'Servicio 1: Switches & Routers Core (Telnet/HTTP)',
      insecurity: 'cleartext_vty_credentials',
      port: 22,
      protocol: 'SSH',
      remediation: 'disable_telnet_enforce_ssh_vty',
      insecurityExp: 'Telnet (puerto 23) y HTTP (puerto 80) transmiten credenciales de enable y sesiones de gestión en texto plano.',
      solutionExp: 'Migrar a SSHv2 (puerto 22) con par de claves Ed25519/RSA-4096 y HTTPS (puerto 443) con TLS 1.3.'
    },
    'port50-identity-directory': {
      label: 'Servicio 2: Directorio Activo & Autenticación (LDAP)',
      insecurity: 'unencrypted_directory_queries',
      port: 636,
      protocol: 'LDAPS',
      remediation: 'enforce_ldaps_channel_binding',
      insecurityExp: 'LDAP sin cifrar (puerto 389) expone consultas de usuarios, grupos y hashes NTLM en la red corporativa.',
      solutionExp: 'Exigir LDAPS (puerto 636) con firma de canal (Channel Binding) y certificados emitidos por la CA privada.'
    },
    'port50-financial-ftp': {
      label: 'Servicio 3: Pasarela Financiera y Nóminas (FTP/TFTP)',
      insecurity: 'cleartext_ftp_credentials',
      port: 22,
      protocol: 'SFTP',
      remediation: 'disable_ftp_enable_sftp',
      insecurityExp: 'FTP (20/21) transmite transferencias bancarias en texto claro y TFTP (69) carece de autenticación.',
      solutionExp: 'Migrar a SFTP (puerto 22 basado en SSH) o FTPS (989/990 con TLS) y deshabilitar puertos 20, 21 y 69.'
    },
    'port50-corporate-dns': {
      label: 'Servicio 4: Servidores DNS Corporativos (DNS UDP 53)',
      insecurity: 'unauthenticated_dns_poisoning',
      port: 853,
      protocol: 'DoT_853',
      remediation: 'deploy_dnssec_and_dot',
      insecurityExp: 'DNS UDP 53 carece de autenticidad criptográfica, siendo vulnerable a Kaminsky cache poisoning y MITM.',
      solutionExp: 'Desplegar DNSSEC (RRSIG/DNSKEY) para integridad y DoT (DNS over TLS en puerto 853) para privacidad.'
    },
    'port50-network-monitoring': {
      label: 'Servicio 5: Monitoreo de Infraestructura (SNMPv1/v2c)',
      insecurity: 'cleartext_community_strings',
      port: 161,
      protocol: 'SNMPv3',
      remediation: 'upgrade_to_snmpv3_authpriv',
      insecurityExp: 'SNMPv1 y SNMPv2c usan "community strings" (public/private) en texto claro sin autenticación robusta.',
      solutionExp: 'Migrar a SNMPv3 en modo authPriv con autenticación SHA-256 y privacidad/cifrado de datos AES-256 (USM).'
    },
    'port50-remote-desktop': {
      label: 'Servicio 6: Acceso Remoto de Servidores (VNC/RDP)',
      insecurity: 'unencrypted_vnc_exposed_rdp',
      port: 3389,
      protocol: 'RDP_NLA',
      remediation: 'disable_vnc_enforce_nla_bastion',
      insecurityExp: 'VNC en puerto 5900 no cifra la sesión y RDP sin NLA permite ataques Man-in-the-Middle y fuerza bruta.',
      solutionExp: 'Deshabilitar VNC (5900), exigir Autenticación a Nivel de Red (NLA) en RDP (3389) y canalizar vía Bastion Host con MFA.'
    }
  };

  const pointsPerItem = [17, 17, 17, 17, 16, 16];
  let itemIdx = 0;

  for (const [id, exp] of Object.entries(expectedMap)) {
    const item = items.find((i) => i.id === id);
    const assignedPoints = pointsPerItem[itemIdx++] || 16;

    if (!item) {
      breakdown.push({
        id,
        label: exp.label,
        achieved: false,
        points: 0,
        maxPoints: assignedPoints,
        explanation: `No completado. Se esperaba: ${exp.solutionExp}`
      });
      continue;
    }

    const insecCorrect = item.selectedInsecurityReason === exp.insecurity;
    const portCorrect = item.selectedSecurePort === exp.port;
    const protoCorrect = item.selectedSecureProtocol === exp.protocol;
    const remCorrect = item.selectedRemediationAction === exp.remediation;

    const allCorrect = insecCorrect && portCorrect && protoCorrect && remCorrect;

    let pts = 0;
    if (insecCorrect) pts += 4;
    if (portCorrect) pts += 4;
    if (protoCorrect) pts += 4;
    if (remCorrect) pts += assignedPoints - 12;

    breakdown.push({
      id,
      label: exp.label,
      achieved: allCorrect,
      points: pts,
      maxPoints: assignedPoints,
      explanation: allCorrect
        ? `Correcto (${assignedPoints}/${assignedPoints}): Protocolo ${exp.protocol} en puerto ${exp.port}. ${exp.solutionExp}`
        : `Parcial (${pts}/${assignedPoints}): ${exp.insecurityExp} Remediación: ${exp.solutionExp}`
    });
  }

  const totalScore = breakdown.reduce((acc, curr) => acc + curr.points, 0);

  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? '¡Hardening de puertos y migración de protocolos excepcional! Has erradicado Telnet, HTTP, LDAP plano, FTP, DNS sin autenticar, SNMPv1/v2c y VNC, migrando a sus alternativas cifradas según CompTIA.'
        : `Puntuación obtenida: ${totalScore}/100. En CompTIA: Telnet->SSH (22), LDAP->LDAPS (636), FTP->SFTP (22), DNS->DNSSEC/DoT (853), SNMPv2->SNMPv3 (161 authPriv), y RDP requiere NLA.`,
    sy0701Objective: 'Objetivo 1.2: Comparar y contrastar protocolos de red seguros e inseguros y aplicar técnicas de remediación.',
    domainName: 'Dominio 1: Conceptos Generales de Seguridad (Port & Protocol Hardening)'
  };
}









