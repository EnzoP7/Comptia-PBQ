/**
 * Central registry: for every PBQ id, how to build its initial answer state, how to grade
 * it and how to render its simulator. App.tsx keeps a single `answers` record keyed by
 * PBQ id, which makes reset, persistence and exam sessions generic.
 */
import React from 'react';
import * as D from './data/pbqsData';
import * as E from './utils/evaluator';
import { MATRIX_PBQS } from './data/matrixPbqs';
import { isExtra } from './data/difficulty';
import { evaluateMatrix } from './utils/matrixEvaluator';
import { withTrafficTests } from './utils/firewallSim';
import { LINUX_PERMS_ITEM, INITIAL_LINUX_PERMS_PBQ60, evaluateLinuxPermissionsPBQ60 } from './data/linuxPermissionsPbq';
import { EvaluationResult, MatrixAnswers, PBQItem, RiskManagementState, SiemAnswers } from './types/pbq';

import { NetworkDiagramPBQ } from './components/pbqs/NetworkDiagramPBQ';
import { FirewallAclPBQ } from './components/pbqs/FirewallAclPBQ';
import { LogSiemPBQ } from './components/pbqs/LogSiemPBQ';
import { EndpointHardeningPBQ } from './components/pbqs/EndpointHardeningPBQ';
import { IamPermissionsPBQ } from './components/pbqs/IamPermissionsPBQ';
import { CryptographyVpnPBQ } from './components/pbqs/CryptographyVpnPBQ';
import { WirelessApPBQ } from './components/pbqs/WirelessApPBQ';
import { ConditionalAccessPBQ } from './components/pbqs/ConditionalAccessPBQ';
import { PkiCertificatesPBQ } from './components/pbqs/PkiCertificatesPBQ';
import { WipsRogueApPBQ } from './components/pbqs/WipsRogueApPBQ';
import { VulnerabilityManagementPBQ } from './components/pbqs/VulnerabilityManagementPBQ';
import { DlpDataProtectionPBQ } from './components/pbqs/DlpDataProtectionPBQ';
import { IncidentResponsePBQ } from './components/pbqs/IncidentResponsePBQ';
import { ContainerSecurityPBQ } from './components/pbqs/ContainerSecurityPBQ';
import { PhysicalSecurityPBQ } from './components/pbqs/PhysicalSecurityPBQ';
import { DisasterRecoveryPBQ } from './components/pbqs/DisasterRecoveryPBQ';
import { SocialEngineeringPBQ } from './components/pbqs/SocialEngineeringPBQ';
import { DigitalForensicsPBQ } from './components/pbqs/DigitalForensicsPBQ';
import { RiskManagementPBQ } from './components/pbqs/RiskManagementPBQ';
import { EmailSecurityPBQ } from './components/pbqs/EmailSecurityPBQ';
import { SecurityCliPBQ } from './components/pbqs/SecurityCliPBQ';
import { IdsYaraRulesPBQ } from './components/pbqs/IdsYaraRulesPBQ';
import { DevSecOpsPBQ } from './components/pbqs/DevSecOpsPBQ';
import { CryptoAttacksPBQ } from './components/pbqs/CryptoAttacksPBQ';
import { IdentityFederationPBQ } from './components/pbqs/IdentityFederationPBQ';
import { MobileSecurityPBQ } from './components/pbqs/MobileSecurityPBQ';
import { PortSecurityPBQ } from './components/pbqs/PortSecurityPBQ';
import { NmapScanPBQ } from './components/pbqs/NmapScanPBQ';
import { DnsSecurityPBQ } from './components/pbqs/DnsSecurityPBQ';
import { ZeroTrustPBQ } from './components/pbqs/ZeroTrustPBQ';
import { WebServerHardeningPBQ } from './components/pbqs/WebServerHardeningPBQ';
import { ForensicHoldPBQ } from './components/pbqs/ForensicHoldPBQ';
import { PkiLifecyclePBQ } from './components/pbqs/PkiLifecyclePBQ';
import { WirelessSecurityPBQ } from './components/pbqs/WirelessSecurityPBQ';
import { CloudDlpPBQ } from './components/pbqs/CloudDlpPBQ';
import { SocialEngPBQ } from './components/pbqs/SocialEngPBQ';
import { CloudSharedResponsibilityPBQ } from './components/pbqs/CloudSharedResponsibilityPBQ';
import { MitreThreatHuntingPBQ } from './components/pbqs/MitreThreatHuntingPBQ';
import { DataGovernancePBQ } from './components/pbqs/DataGovernancePBQ';
import { PrivacyPetsPBQ } from './components/pbqs/PrivacyPetsPBQ';
import { MalwareTriagePBQ } from './components/pbqs/MalwareTriagePBQ';
import { ApiSecurityPBQ } from './components/pbqs/ApiSecurityPBQ';
import { SoarAutomationPBQ } from './components/pbqs/SoarAutomationPBQ';
import { MatrixClassificationPBQ } from './components/pbqs/MatrixClassificationPBQ';
import { LinuxPermissionsPBQ } from './components/pbqs/LinuxPermissionsPBQ';
import { TerminalPBQ } from './components/pbqs/TerminalPBQ';
import { TERMINAL_PBQS } from './data/terminalPbqs';
import { TerminalState } from './terminal/types';
import { FIREWALL_ITEM_PBQ77, FIREWALL_PACKET_TESTS_PBQ77, FIREWALL_TOKENS_PBQ77, INITIAL_FIREWALL_RULES_PBQ77, evaluateFirewallPBQ77 } from './data/firewallPbq77';

export interface PBQDefinition<S = any> {
  initial: () => S;
  evaluate: (state: S) => EvaluationResult;
  render: (state: S, onChange: (state: S) => void, onReset: () => void) => React.ReactNode;
  /** For PBQs whose initial state is randomized: true while the candidate has not answered yet. */
  isPristine?: (state: S) => boolean;
}

const emptySiem = (): SiemAnswers => ({
  patientZeroIp: '',
  initialAttackVector: '',
  initialCompromiseTimestamp: '',
  immediateContainmentAction: '',
});

/** Shorthand for the many simulators with the `state / onChange / onReset` signature. */
function simple<S>(
  initial: S,
  evaluate: (state: S) => EvaluationResult,
  Component: React.ComponentType<{ state: S; onChange: (s: S) => void; onReset: () => void }>
): PBQDefinition<S> {
  return {
    initial: () => initial,
    evaluate,
    render: (state, onChange, onReset) => <Component state={state} onChange={onChange} onReset={onReset} />,
  };
}

type HardeningState = { services: typeof D.INITIAL_SERVICES_PBQ4; policies: typeof D.INITIAL_SECURITY_POLICIES_PBQ4 };

function hardening(
  services: HardeningState['services'],
  policies: HardeningState['policies'],
  evaluate: (s: HardeningState['services'], p: HardeningState['policies']) => EvaluationResult,
  title: string,
  subtitle: string
): PBQDefinition<HardeningState> {
  return {
    initial: () => ({ services, policies }),
    evaluate: (s) => evaluate(s.services, s.policies),
    render: (s, onChange, onReset) => (
      <EndpointHardeningPBQ
        services={s.services}
        policies={s.policies}
        onServicesChange={(services) => onChange({ ...s, services })}
        onPoliciesChange={(policies) => onChange({ ...s, policies })}
        onReset={onReset}
        title={title}
        subtitle={subtitle}
      />
    ),
  };
}

const pickOne = <T,>(values: T[]): T => values[Math.floor(Math.random() * values.length)];

/** New numbers on every attempt so the SLE/ALE formulas are practised, not memorized. */
function randomRiskState(): RiskManagementState {
  return {
    ...D.INITIAL_RISK_STATE_PBQ23,
    assetValue: pickOne([50, 75, 120, 150, 200, 250, 320, 400, 500]) * 1000,
    exposureFactorPercent: pickOne([10, 20, 25, 30, 40, 50, 60, 75]),
    aroValue: pickOne([0.1, 0.2, 0.25, 0.5, 1, 2, 3]),
  };
}

const HAND_BUILT: Record<string, PBQDefinition> = {
  'pbq-1': {
    initial: () => D.INITIAL_NETWORK_SLOTS_PBQ1,
    evaluate: E.evaluateNetworkDiagram,
    render: (s, onChange) => (
      <NetworkDiagramPBQ slots={s} onSlotsChange={onChange} availableControls={D.AVAILABLE_NETWORK_CONTROLS_PBQ1} initialSlots={D.INITIAL_NETWORK_SLOTS_PBQ1} variant="traditional" />
    ),
  },
  'pbq-2': {
    initial: () => D.INITIAL_FIREWALL_RULES_PBQ2,
    evaluate: (s) => withTrafficTests(E.evaluateFirewallAcl(s), s, D.FIREWALL_PACKET_TESTS_PBQ2),
    render: (s, onChange) => (
      <FirewallAclPBQ
        rules={s}
        onRulesChange={onChange}
        packetTests={D.FIREWALL_PACKET_TESTS_PBQ2}
        tokens={D.FIREWALL_TOKENS_PBQ2}
        initialRules={D.INITIAL_FIREWALL_RULES_PBQ2}
      />
    ),
  },
  'pbq-3': {
    initial: emptySiem,
    evaluate: E.evaluateLogSiem,
    render: (s, onChange) => <LogSiemPBQ answers={s} onAnswersChange={onChange} logs={D.SIEM_LOGS_PBQ3} questionsConfig={D.SIEM_QUESTIONS_PBQ3} />,
  },
  'pbq-4': hardening(
    D.INITIAL_SERVICES_PBQ4,
    D.INITIAL_SECURITY_POLICIES_PBQ4,
    E.evaluateEndpointHardening,
    'Consola de Endurecimiento de Servidor Web (Server 2025 Baseline)',
    'Ajusta los servicios y las directivas según la línea base corporativa.'
  ),
  'pbq-5': {
    initial: () => ({ userGroups: D.INITIAL_USER_GROUPS_PBQ5, folderNodes: D.INITIAL_FOLDER_PERMISSIONS_PBQ5 }),
    evaluate: (s) => E.evaluateIamPermissions(s.userGroups, s.folderNodes),
    render: (s, onChange, onReset) => (
      <IamPermissionsPBQ
        userGroups={s.userGroups}
        folderNodes={s.folderNodes}
        onUserGroupsChange={(userGroups) => onChange({ ...s, userGroups })}
        onFoldersChange={(folderNodes) => onChange({ ...s, folderNodes })}
        onReset={onReset}
      />
    ),
  },
  'pbq-6': simple(D.INITIAL_CRYPTO_STATE_PBQ6, E.evaluateCryptoVpn, CryptographyVpnPBQ),
  'pbq-7': simple(D.INITIAL_WIRELESS_STATE_PBQ7, E.evaluateWirelessAp, WirelessApPBQ),
  'pbq-8': {
    initial: () => D.INITIAL_NETWORK_SLOTS_PBQ8,
    evaluate: E.evaluateNetworkDiagramPBQ8,
    render: (s, onChange) => (
      <NetworkDiagramPBQ slots={s} onSlotsChange={onChange} availableControls={D.AVAILABLE_NETWORK_CONTROLS_PBQ8} initialSlots={D.INITIAL_NETWORK_SLOTS_PBQ8} variant="cloud" />
    ),
  },
  'pbq-9': {
    initial: () => D.INITIAL_FIREWALL_RULES_PBQ9,
    evaluate: (s) => withTrafficTests(E.evaluateFirewallAclPBQ9(s), s, D.FIREWALL_PACKET_TESTS_PBQ9),
    render: (s, onChange) => (
      <FirewallAclPBQ
        rules={s}
        onRulesChange={onChange}
        packetTests={D.FIREWALL_PACKET_TESTS_PBQ9}
        tokens={D.FIREWALL_TOKENS_PBQ9}
        initialRules={D.INITIAL_FIREWALL_RULES_PBQ9}
      />
    ),
  },
  'pbq-10': {
    initial: emptySiem,
    evaluate: E.evaluateLogSiemPBQ10,
    render: (s, onChange) => <LogSiemPBQ answers={s} onAnswersChange={onChange} logs={D.SIEM_LOGS_PBQ10} questionsConfig={D.SIEM_QUESTIONS_PBQ10} />,
  },
  'pbq-11': hardening(
    D.INITIAL_SERVICES_PBQ11,
    D.INITIAL_SECURITY_POLICIES_PBQ11,
    E.evaluateEndpointHardeningPBQ11,
    'Línea Base de Estaciones de Trabajo Windows 11 (Workstation Baseline)',
    'Endurece la estación de trabajo según la línea base corporativa: servicios de resolución de nombres, protección de credenciales y ejecución de código.'
  ),
  'pbq-12': simple(D.INITIAL_CONDITIONAL_ACCESS_STATE, E.evaluateConditionalAccessPBQ12, ConditionalAccessPBQ),
  'pbq-13': simple(D.INITIAL_PKI_CERT_STATE, E.evaluatePkiCertificatesPBQ13, PkiCertificatesPBQ),
  'pbq-14': simple(D.INITIAL_WIPS_ROGUE_STATE, E.evaluateWirelessWipsPBQ14, WipsRogueApPBQ),
  'pbq-15': {
    initial: () => D.INITIAL_FINDINGS_PBQ15,
    evaluate: E.evaluateVulnerabilityManagementPBQ15,
    render: (s, onChange, onReset) => <VulnerabilityManagementPBQ findings={s} onChange={onChange} onReset={onReset} />,
  },
  'pbq-16': {
    initial: () => D.INITIAL_DLP_ITEMS_PBQ16,
    evaluate: E.evaluateDlpDataProtectionPBQ16,
    render: (s, onChange, onReset) => <DlpDataProtectionPBQ items={s} onChange={onChange} onReset={onReset} />,
  },
  'pbq-17': {
    initial: () => D.INITIAL_IR_ACTIONS_PBQ17,
    evaluate: E.evaluateIncidentResponsePBQ17,
    render: (s, onChange, onReset) => <IncidentResponsePBQ actions={s} onChange={onChange} onReset={onReset} />,
  },
  'pbq-18': simple(D.INITIAL_CONTAINER_STATE_PBQ18, E.evaluateContainerSecurityPBQ18, ContainerSecurityPBQ),
  'pbq-19': simple(D.INITIAL_PHYSICAL_STATE_PBQ19, E.evaluatePhysicalSecurityPBQ19, PhysicalSecurityPBQ),
  'pbq-20': simple(D.INITIAL_DISASTER_RECOVERY_STATE_PBQ20, E.evaluateDisasterRecoveryPBQ20, DisasterRecoveryPBQ),
  'pbq-21': {
    initial: () => D.INITIAL_SOCIAL_CASES_PBQ21,
    evaluate: E.evaluateSocialEngineeringPBQ21,
    render: (s, onChange, onReset) => <SocialEngineeringPBQ cases={s} onChange={onChange} onReset={onReset} />,
  },
  'pbq-22': simple(D.INITIAL_FORENSIC_STATE_PBQ22, E.evaluateDigitalForensicsPBQ22, DigitalForensicsPBQ),
  'pbq-23': {
    ...simple(D.INITIAL_RISK_STATE_PBQ23, E.evaluateRiskManagementPBQ23, RiskManagementPBQ),
    initial: randomRiskState,
    isPristine: (s: RiskManagementState) =>
      !s.calculatedSleInput && !s.calculatedAleInput && !s.treatmentThreat1 && !s.treatmentThreat2 && !s.treatmentThreat3 && !s.treatmentThreat4,
  },
  'pbq-24': simple(D.INITIAL_EMAIL_STATE_PBQ24, E.evaluateEmailSecurityPBQ24, EmailSecurityPBQ),
  'pbq-25': {
    initial: () => D.INITIAL_CLI_SCENARIOS_PBQ25,
    evaluate: E.evaluateSecurityCliPBQ25,
    render: (s, onChange, onReset) => <SecurityCliPBQ scenarios={s} onChange={onChange} onReset={onReset} />,
  },
  'pbq-26': simple(D.INITIAL_IDS_YARA_STATE_PBQ26, E.evaluateIdsYaraRulesPBQ26, IdsYaraRulesPBQ),
  'pbq-27': simple(D.INITIAL_DEVSECOPS_STATE_PBQ27, E.evaluateDevSecOpsPBQ27, DevSecOpsPBQ),
  'pbq-28': {
    initial: () => D.INITIAL_CRYPTO_CASES_PBQ28,
    evaluate: E.evaluateCryptoAttacksPBQ28,
    render: (s, onChange, onReset) => <CryptoAttacksPBQ cases={s} onChange={onChange} onReset={onReset} />,
  },
  'pbq-29': simple(D.INITIAL_FEDERATION_STATE_PBQ29, E.evaluateIdentityFederationPBQ29, IdentityFederationPBQ),
  'pbq-30': simple(D.INITIAL_MOBILE_STATE_PBQ30, E.evaluateMobileSecurityPBQ30, MobileSecurityPBQ),
  'pbq-31': {
    initial: () => D.INITIAL_PORT_AUDIT_PBQ31,
    evaluate: E.evaluatePortSecurityPBQ31,
    render: (s, onChange, onReset) => <PortSecurityPBQ items={s} onChange={onChange} onReset={onReset} />,
  },
  'pbq-32': simple(D.INITIAL_NMAP_STATE_PBQ32, E.evaluateNmapScanPBQ32, NmapScanPBQ),
  'pbq-33': simple(D.INITIAL_DNS_STATE_PBQ33, E.evaluateDnsSecurityPBQ33, DnsSecurityPBQ),
  'pbq-34': simple(D.INITIAL_ZERO_TRUST_STATE_PBQ34, E.evaluateZeroTrustPBQ34, ZeroTrustPBQ),
  'pbq-35': simple(D.INITIAL_WEB_HARDENING_STATE_PBQ35, E.evaluateWebServerHardeningPBQ35, WebServerHardeningPBQ),
  'pbq-36': simple(D.INITIAL_FORENSIC_HOLD_PBQ36, E.evaluateForensicHoldPBQ36, ForensicHoldPBQ),
  'pbq-37': simple(D.INITIAL_PKI_LIFECYCLE_PBQ37, E.evaluatePkiLifecyclePBQ37, PkiLifecyclePBQ),
  'pbq-38': simple(D.INITIAL_WIRELESS_SECURITY_PBQ38, E.evaluateWirelessSecurityPBQ38, WirelessSecurityPBQ),
  'pbq-39': simple(D.INITIAL_CLOUD_DLP_PBQ39, E.evaluateCloudDlpPBQ39, CloudDlpPBQ),
  'pbq-40': simple(D.INITIAL_SOCIAL_ENG_PBQ40, E.evaluateSocialEngPBQ40, SocialEngPBQ),
  'pbq-41': simple(D.INITIAL_CLOUD_SHARED_RESPONSIBILITY_PBQ41, E.evaluateCloudSharedResponsibilityPBQ41, CloudSharedResponsibilityPBQ),
  'pbq-42': simple(D.INITIAL_MITRE_THREAT_HUNTING_PBQ42, E.evaluateMitreThreatHuntingPBQ42, MitreThreatHuntingPBQ),
  'pbq-43': simple(D.INITIAL_DATA_GOVERNANCE_PBQ43, E.evaluateDataGovernancePBQ43, DataGovernancePBQ),
  'pbq-44': simple(D.INITIAL_PRIVACY_PETS_PBQ44, E.evaluatePrivacyPetsPBQ44, PrivacyPetsPBQ),
  'pbq-45': {
    initial: () => D.INITIAL_MALWARE_TRIAGE_PBQ45,
    evaluate: E.evaluateMalwareTriagePBQ45,
    render: (s, onChange, onReset) => (
      <MalwareTriagePBQ state={s} onChange={onChange} onReset={onReset} pbqNumber={45} partTitle="Parte 1: Endpoints, Criptografía y Persistencia en Memoria" />
    ),
  },
  'pbq-46': {
    initial: () => D.INITIAL_MALWARE_TRIAGE_PBQ46,
    evaluate: E.evaluateMalwareTriagePBQ46,
    render: (s, onChange, onReset) => (
      <MalwareTriagePBQ state={s} onChange={onChange} onReset={onReset} pbqNumber={46} partTitle="Parte 2: Amenazas de Red, Código Latente y Evasión Polimórfica" />
    ),
  },
  'pbq-47': simple(D.INITIAL_API_SECURITY_PBQ47, E.evaluateApiSecurityPBQ47, ApiSecurityPBQ),
  'pbq-48': simple(D.INITIAL_SOAR_AUTOMATION_PBQ48, E.evaluateSoarAutomationPBQ48, SoarAutomationPBQ),
  'pbq-49': {
    initial: () => D.INITIAL_FIREWALL_RULES_PBQ49,
    evaluate: (s) => withTrafficTests(E.evaluateFirewallAclPBQ49(s), s, D.FIREWALL_PACKET_TESTS_PBQ49),
    render: (s, onChange) => (
      <FirewallAclPBQ
        rules={s}
        onRulesChange={onChange}
        packetTests={D.FIREWALL_PACKET_TESTS_PBQ49}
        tokens={D.FIREWALL_TOKENS_PBQ49}
        initialRules={D.INITIAL_FIREWALL_RULES_PBQ49}
      />
    ),
  },
  'pbq-60': simple(INITIAL_LINUX_PERMS_PBQ60, evaluateLinuxPermissionsPBQ60, LinuxPermissionsPBQ),
  'pbq-77': {
    initial: () => INITIAL_FIREWALL_RULES_PBQ77,
    evaluate: evaluateFirewallPBQ77,
    render: (s, onChange) => (
      <FirewallAclPBQ
        rules={s}
        onRulesChange={onChange}
        packetTests={FIREWALL_PACKET_TESTS_PBQ77}
        tokens={FIREWALL_TOKENS_PBQ77}
        initialRules={INITIAL_FIREWALL_RULES_PBQ77}
      />
    ),
  },
  'pbq-50': {
    initial: () => D.INITIAL_PORT_AUDIT_PBQ50,
    evaluate: E.evaluateProtocolMigrationPBQ50,
    render: (s, onChange, onReset) => <PortSecurityPBQ items={s} onChange={onChange} onReset={onReset} />,
  },
};

const MATRIX_DEFS: Record<string, PBQDefinition<MatrixAnswers>> = Object.fromEntries(
  MATRIX_PBQS.map(({ config }) => [
    config.pbqId,
    {
      initial: () => ({}),
      evaluate: (answers: MatrixAnswers) => evaluateMatrix(config, answers),
      render: (answers: MatrixAnswers, onChange: (a: MatrixAnswers) => void, onReset: () => void) => (
        <MatrixClassificationPBQ config={config} answers={answers} onChange={onChange} onReset={onReset} />
      ),
    },
  ])
);

const TERMINAL_DEFS: Record<string, PBQDefinition<TerminalState>> = Object.fromEntries(
  TERMINAL_PBQS.map((t) => [
    t.item.id,
    {
      initial: t.initial,
      evaluate: t.evaluate,
      isPristine: (s: TerminalState) => s.history.length === 0 && !Object.values(s.answers).some((v) => v.trim()),
      render: (s: TerminalState, onChange: (s: TerminalState) => void, onReset: () => void) => (
        <TerminalPBQ state={s} onChange={onChange} onReset={onReset} questions={t.questions} hintCommands={t.hintCommands} />
      ),
    },
  ])
);

export const PBQ_REGISTRY: Record<string, PBQDefinition> = { ...HAND_BUILT, ...MATRIX_DEFS, ...TERMINAL_DEFS };

export const ALL_PBQS: PBQItem[] = [...D.PBQ_LIST, ...MATRIX_PBQS.map((m) => m.item), LINUX_PERMS_ITEM, FIREWALL_ITEM_PBQ77, ...TERMINAL_PBQS.map((t) => t.item)].sort((a, b) => Number(isExtra(a.number)) - Number(isExtra(b.number)) || a.number - b.number);

export function initialAnswersFor(ids: string[]): Record<string, any> {
  return Object.fromEntries(ids.map((id) => [id, PBQ_REGISTRY[id].initial()]));
}
