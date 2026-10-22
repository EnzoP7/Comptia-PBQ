/**
 * CompTIA Security+ (SY0-701) PBQ Tactical Simulator
 * 
 * Interactive Performance-Based Questions simulation application.
 * Contains 25 comprehensive, realistic PBQ scenarios across all SY0-701 domains.
 */

import React, { useState, useEffect } from 'react';
import {
  PBQ_LIST,
  AVAILABLE_NETWORK_CONTROLS_PBQ1,
  INITIAL_NETWORK_SLOTS_PBQ1,
  AVAILABLE_NETWORK_CONTROLS_PBQ8,
  INITIAL_NETWORK_SLOTS_PBQ8,
  INITIAL_FIREWALL_RULES_PBQ2,
  FIREWALL_PACKET_TESTS_PBQ2,
  INITIAL_FIREWALL_RULES_PBQ9,
  FIREWALL_PACKET_TESTS_PBQ9,
  SIEM_LOGS_PBQ3,
  SIEM_QUESTIONS_PBQ3,
  SIEM_LOGS_PBQ10,
  SIEM_QUESTIONS_PBQ10,
  INITIAL_SERVICES_PBQ4,
  INITIAL_SECURITY_POLICIES_PBQ4,
  INITIAL_SERVICES_PBQ11,
  INITIAL_SECURITY_POLICIES_PBQ11,
  INITIAL_USER_GROUPS_PBQ5,
  INITIAL_FOLDER_PERMISSIONS_PBQ5,
  INITIAL_CONDITIONAL_ACCESS_STATE,
  INITIAL_CRYPTO_STATE_PBQ6,
  INITIAL_PKI_CERT_STATE,
  INITIAL_WIRELESS_STATE_PBQ7,
  INITIAL_WIPS_ROGUE_STATE,
  INITIAL_FINDINGS_PBQ15,
  INITIAL_DLP_ITEMS_PBQ16,
  INITIAL_IR_ACTIONS_PBQ17,
  INITIAL_CONTAINER_STATE_PBQ18,
  INITIAL_PHYSICAL_STATE_PBQ19,
  INITIAL_DISASTER_RECOVERY_STATE_PBQ20,
  INITIAL_SOCIAL_CASES_PBQ21,
  INITIAL_FORENSIC_STATE_PBQ22,
  INITIAL_RISK_STATE_PBQ23,
  INITIAL_EMAIL_STATE_PBQ24,
  INITIAL_CLI_SCENARIOS_PBQ25,
  INITIAL_IDS_YARA_STATE_PBQ26,
  INITIAL_DEVSECOPS_STATE_PBQ27,
  INITIAL_CRYPTO_CASES_PBQ28,
  INITIAL_FEDERATION_STATE_PBQ29,
  INITIAL_MOBILE_STATE_PBQ30,
  INITIAL_PORT_AUDIT_PBQ31,
  INITIAL_NMAP_STATE_PBQ32,
  INITIAL_DNS_STATE_PBQ33,
  INITIAL_ZERO_TRUST_STATE_PBQ34,
  INITIAL_WEB_HARDENING_STATE_PBQ35,
  INITIAL_FORENSIC_HOLD_PBQ36,
  INITIAL_PKI_LIFECYCLE_PBQ37,
  INITIAL_WIRELESS_SECURITY_PBQ38,
  INITIAL_CLOUD_DLP_PBQ39,
  INITIAL_SOCIAL_ENG_PBQ40,
  INITIAL_CLOUD_SHARED_RESPONSIBILITY_PBQ41,
  INITIAL_MITRE_THREAT_HUNTING_PBQ42,
  INITIAL_DATA_GOVERNANCE_PBQ43,
  INITIAL_PRIVACY_PETS_PBQ44,
  INITIAL_MALWARE_TRIAGE_PBQ45,
  INITIAL_MALWARE_TRIAGE_PBQ46,
  INITIAL_API_SECURITY_PBQ47,
  INITIAL_SOAR_AUTOMATION_PBQ48,
  INITIAL_FIREWALL_RULES_PBQ49,
  FIREWALL_PACKET_TESTS_PBQ49,
  INITIAL_PORT_AUDIT_PBQ50,
} from './data/pbqsData';
import {
  PBQItem,
  EvaluationResult,
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
} from './types/pbq';
import {
  evaluateNetworkDiagram,
  evaluateNetworkDiagramPBQ8,
  evaluateFirewallAcl,
  evaluateFirewallAclPBQ9,
  evaluateLogSiem,
  evaluateLogSiemPBQ10,
  evaluateEndpointHardening,
  evaluateEndpointHardeningPBQ11,
  evaluateIamPermissions,
  evaluateConditionalAccessPBQ12,
  evaluateCryptoVpn,
  evaluatePkiCertificatesPBQ13,
  evaluateWirelessAp,
  evaluateWirelessWipsPBQ14,
  evaluateVulnerabilityManagementPBQ15,
  evaluateDlpDataProtectionPBQ16,
  evaluateIncidentResponsePBQ17,
  evaluateContainerSecurityPBQ18,
  evaluatePhysicalSecurityPBQ19,
  evaluateDisasterRecoveryPBQ20,
  evaluateSocialEngineeringPBQ21,
  evaluateDigitalForensicsPBQ22,
  evaluateRiskManagementPBQ23,
  evaluateEmailSecurityPBQ24,
  evaluateSecurityCliPBQ25,
  evaluateIdsYaraRulesPBQ26,
  evaluateDevSecOpsPBQ27,
  evaluateCryptoAttacksPBQ28,
  evaluateIdentityFederationPBQ29,
  evaluateMobileSecurityPBQ30,
  evaluatePortSecurityPBQ31,
  evaluateNmapScanPBQ32,
  evaluateDnsSecurityPBQ33,
  evaluateZeroTrustPBQ34,
  evaluateWebServerHardeningPBQ35,
  evaluateForensicHoldPBQ36,
  evaluatePkiLifecyclePBQ37,
  evaluateWirelessSecurityPBQ38,
  evaluateCloudDlpPBQ39,
  evaluateSocialEngPBQ40,
  evaluateCloudSharedResponsibilityPBQ41,
  evaluateMitreThreatHuntingPBQ42,
  evaluateDataGovernancePBQ43,
  evaluatePrivacyPetsPBQ44,
  evaluateMalwareTriagePBQ45,
  evaluateMalwareTriagePBQ46,
  evaluateApiSecurityPBQ47,
  evaluateSoarAutomationPBQ48,
  evaluateFirewallAclPBQ49,
  evaluateProtocolMigrationPBQ50,
} from './utils/evaluator';
import { sound } from './utils/audio';

// Modals
import { Header } from './components/Header';
import { PBQNav } from './components/PBQNav';
import { CyberKraftModal } from './components/CyberKraftModal';
import { ScoreBreakdownModal } from './components/ScoreBreakdownModal';
import { ExamSummaryModal } from './components/ExamSummaryModal';

// PBQ Simulators
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
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { CompTIACheatSheetModal } from './components/CompTIACheatSheetModal';

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  BookOpen,
  RotateCcw,
  Target,
  Award,
  HelpCircle,
  Clock,
  Sparkles,
  ListChecks,
  FileText,
  Tag,
  AlertCircle,
  Type,
  ZoomIn,
  ZoomOut,
  Keyboard,
} from 'lucide-react';

export default function App() {
  const [currentPbqIndex, setCurrentPbqIndex] = useState<number>(0);
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [timerSeconds, setTimerSeconds] = useState<number>(90 * 60); // 90 mins
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [readingMode, setReadingMode] = useState<'scenario' | 'checklist'>('scenario');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large'); // default to larger readable font as requested

  // Modals state
  const [isCyberKraftOpen, setIsCyberKraftOpen] = useState<boolean>(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState<boolean>(false);
  const [isExamSummaryOpen, setIsExamSummaryOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);

  // PBQ 1 & 8 States (Network)
  const [pbq1Slots, setPbq1Slots] = useState<NetworkZoneSlot[]>(INITIAL_NETWORK_SLOTS_PBQ1);
  const [pbq8Slots, setPbq8Slots] = useState<NetworkZoneSlot[]>(INITIAL_NETWORK_SLOTS_PBQ8);

  // PBQ 2 & 9 States (Firewall ACL)
  const [pbq2Rules, setPbq2Rules] = useState<FirewallRule[]>(INITIAL_FIREWALL_RULES_PBQ2);
  const [pbq9Rules, setPbq9Rules] = useState<FirewallRule[]>(INITIAL_FIREWALL_RULES_PBQ9);

  // PBQ 3 & 10 States (SIEM)
  const [pbq3Siem, setPbq3Siem] = useState<SiemAnswers>({
    patientZeroIp: '',
    initialAttackVector: '',
    initialCompromiseTimestamp: '',
    immediateContainmentAction: '',
  });
  const [pbq10Siem, setPbq10Siem] = useState<SiemAnswers>({
    patientZeroIp: '',
    initialAttackVector: '',
    initialCompromiseTimestamp: '',
    immediateContainmentAction: '',
  });

  // PBQ 4 & 11 States (Endpoint Hardening)
  const [pbq4Services, setPbq4Services] = useState<ServiceItem[]>(INITIAL_SERVICES_PBQ4);
  const [pbq4Policies, setPbq4Policies] = useState<SecurityPolicyItem[]>(INITIAL_SECURITY_POLICIES_PBQ4);
  const [pbq11Services, setPbq11Services] = useState<ServiceItem[]>(INITIAL_SERVICES_PBQ11);
  const [pbq11Policies, setPbq11Policies] = useState<SecurityPolicyItem[]>(INITIAL_SECURITY_POLICIES_PBQ11);

  // PBQ 5 & 12 States (IAM & Permissions)
  const [pbq5UserGroups, setPbq5UserGroups] = useState<IamUserGroupConfig[]>(INITIAL_USER_GROUPS_PBQ5);
  const [pbq5FolderNodes, setPbq5FolderNodes] = useState<FolderPermissionNode[]>(INITIAL_FOLDER_PERMISSIONS_PBQ5);
  const [pbq12Ca, setPbq12Ca] = useState<ConditionalAccessState>(INITIAL_CONDITIONAL_ACCESS_STATE);

  // PBQ 6 & 13 States (Crypto & PKI)
  const [pbq6Crypto, setPbq6Crypto] = useState<CryptoConfigState>(INITIAL_CRYPTO_STATE_PBQ6);
  const [pbq13Pki, setPbq13Pki] = useState<PkiCertConfigState>(INITIAL_PKI_CERT_STATE);

  // PBQ 7 & 14 States (Wireless AP & WIPS)
  const [pbq7Wireless, setPbq7Wireless] = useState<WirelessApConfigState>(INITIAL_WIRELESS_STATE_PBQ7);
  const [pbq14Wips, setPbq14Wips] = useState<WipsRogueApConfigState>(INITIAL_WIPS_ROGUE_STATE);

  // PBQ 15 to 21 States
  const [pbq15Findings, setPbq15Findings] = useState<VulnerabilityFinding[]>(INITIAL_FINDINGS_PBQ15);
  const [pbq16Dlp, setPbq16Dlp] = useState<DlpPolicyItem[]>(INITIAL_DLP_ITEMS_PBQ16);
  const [pbq17Actions, setPbq17Actions] = useState<IncidentResponseActionItem[]>(INITIAL_IR_ACTIONS_PBQ17);
  const [pbq18Container, setPbq18Container] = useState<ContainerHardeningState>(INITIAL_CONTAINER_STATE_PBQ18);
  const [pbq19Physical, setPbq19Physical] = useState<PhysicalSecurityState>(INITIAL_PHYSICAL_STATE_PBQ19);
  const [pbq20Dr, setPbq20Dr] = useState<DisasterRecoveryState>(INITIAL_DISASTER_RECOVERY_STATE_PBQ20);
  const [pbq21Social, setPbq21Social] = useState<SocialEngineeringCase[]>(INITIAL_SOCIAL_CASES_PBQ21);

  // PBQ 22 to 25 States (New Exam-focused Scenarios)
  const [pbq22Forensic, setPbq22Forensic] = useState<ForensicVerificationState>(INITIAL_FORENSIC_STATE_PBQ22);
  const [pbq23Risk, setPbq23Risk] = useState<RiskManagementState>(INITIAL_RISK_STATE_PBQ23);
  const [pbq24Email, setPbq24Email] = useState<EmailSecurityState>(INITIAL_EMAIL_STATE_PBQ24);
  const [pbq25Cli, setPbq25Cli] = useState<SecurityCliScenario[]>(INITIAL_CLI_SCENARIOS_PBQ25);
  const [pbq26IdsYara, setPbq26IdsYara] = useState<IdsYaraState>(INITIAL_IDS_YARA_STATE_PBQ26);
  const [pbq27DevSecOps, setPbq27DevSecOps] = useState<DevSecOpsState>(INITIAL_DEVSECOPS_STATE_PBQ27);
  const [pbq28Crypto, setPbq28Crypto] = useState<CryptoAttackCase[]>(INITIAL_CRYPTO_CASES_PBQ28);
  const [pbq29Federation, setPbq29Federation] = useState<FederationState>(INITIAL_FEDERATION_STATE_PBQ29);
  const [pbq30Mobile, setPbq30Mobile] = useState<MobileSecurityState>(INITIAL_MOBILE_STATE_PBQ30);
  const [pbq31PortAudit, setPbq31PortAudit] = useState<PortAuditItem[]>(INITIAL_PORT_AUDIT_PBQ31);
  const [pbq32Nmap, setPbq32Nmap] = useState<NmapScanState>(INITIAL_NMAP_STATE_PBQ32);
  const [pbq33Dns, setPbq33Dns] = useState<DnsSecurityState>(INITIAL_DNS_STATE_PBQ33);
  const [pbq34ZeroTrust, setPbq34ZeroTrust] = useState<ZeroTrustState>(INITIAL_ZERO_TRUST_STATE_PBQ34);
  const [pbq35WebHardening, setPbq35WebHardening] = useState<WebServerHardeningState>(INITIAL_WEB_HARDENING_STATE_PBQ35);
  const [pbq36ForensicHold, setPbq36ForensicHold] = useState<ForensicHoldState>(INITIAL_FORENSIC_HOLD_PBQ36);
  const [pbq37PkiLifecycle, setPbq37PkiLifecycle] = useState<PkiLifecycleState>(INITIAL_PKI_LIFECYCLE_PBQ37);
  const [pbq38WirelessSecurity, setPbq38WirelessSecurity] = useState<WirelessSecurityState>(INITIAL_WIRELESS_SECURITY_PBQ38);
  const [pbq39CloudDlp, setPbq39CloudDlp] = useState<CloudDlpState>(INITIAL_CLOUD_DLP_PBQ39);
  const [pbq40SocialEng, setPbq40SocialEng] = useState<SocialEngState>(INITIAL_SOCIAL_ENG_PBQ40);
  const [pbq41CloudShared, setPbq41CloudShared] = useState<CloudSharedResponsibilityState>(INITIAL_CLOUD_SHARED_RESPONSIBILITY_PBQ41);
  const [pbq42Mitre, setPbq42Mitre] = useState<MitreThreatHuntingState>(INITIAL_MITRE_THREAT_HUNTING_PBQ42);
  const [pbq43DataGov, setPbq43DataGov] = useState<DataGovernanceState>(INITIAL_DATA_GOVERNANCE_PBQ43);
  const [pbq44PrivacyPets, setPbq44PrivacyPets] = useState<PrivacyPetsState>(INITIAL_PRIVACY_PETS_PBQ44);
  const [pbq45Malware, setPbq45Malware] = useState<MalwareTriageState>(INITIAL_MALWARE_TRIAGE_PBQ45);
  const [pbq46Malware, setPbq46Malware] = useState<MalwareTriageState>(INITIAL_MALWARE_TRIAGE_PBQ46);
  const [pbq47ApiSec, setPbq47ApiSec] = useState<ApiSecurityState>(INITIAL_API_SECURITY_PBQ47);
  const [pbq48Soar, setPbq48Soar] = useState<SoarAutomationState>(INITIAL_SOAR_AUTOMATION_PBQ48);
  const [pbq49Fw, setPbq49Fw] = useState<FirewallRule[]>(INITIAL_FIREWALL_RULES_PBQ49);
  const [pbq50Ports, setPbq50Ports] = useState<PortAuditItem[]>(INITIAL_PORT_AUDIT_PBQ50);

  // Evaluations cache
  const [evaluations, setEvaluations] = useState<{ [pbqId: string]: EvaluationResult }>({});

  const currentPBQ = PBQ_LIST[currentPbqIndex];

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds]);

  // Mode Change
  const handleModeChange = (newMode: 'practice' | 'exam') => {
    sound.playToggle();
    setMode(newMode);
    if (newMode === 'exam') {
      setTimerSeconds(90 * 60);
      setTimerActive(true);
    }
  };

  // Flag Toggle
  const handleToggleFlag = () => {
    const updated = new Set(flaggedIds);
    if (updated.has(currentPBQ.id)) {
      updated.delete(currentPBQ.id);
    } else {
      updated.add(currentPBQ.id);
    }
    setFlaggedIds(updated);
  };

  // Evaluation Dispatcher
  const handleEvaluateCurrentPBQ = () => {
    let result: EvaluationResult;

    switch (currentPBQ.id) {
      case 'pbq-1':
        result = evaluateNetworkDiagram(pbq1Slots);
        break;
      case 'pbq-2':
        result = evaluateFirewallAcl(pbq2Rules);
        break;
      case 'pbq-3':
        result = evaluateLogSiem(pbq3Siem);
        break;
      case 'pbq-4':
        result = evaluateEndpointHardening(pbq4Services, pbq4Policies);
        break;
      case 'pbq-5':
        result = evaluateIamPermissions(pbq5UserGroups, pbq5FolderNodes);
        break;
      case 'pbq-6':
        result = evaluateCryptoVpn(pbq6Crypto);
        break;
      case 'pbq-7':
        result = evaluateWirelessAp(pbq7Wireless);
        break;
      case 'pbq-8':
        result = evaluateNetworkDiagramPBQ8(pbq8Slots);
        break;
      case 'pbq-9':
        result = evaluateFirewallAclPBQ9(pbq9Rules);
        break;
      case 'pbq-10':
        result = evaluateLogSiemPBQ10(pbq10Siem);
        break;
      case 'pbq-11':
        result = evaluateEndpointHardeningPBQ11(pbq11Services, pbq11Policies);
        break;
      case 'pbq-12':
        result = evaluateConditionalAccessPBQ12(pbq12Ca);
        break;
      case 'pbq-13':
        result = evaluatePkiCertificatesPBQ13(pbq13Pki);
        break;
      case 'pbq-14':
        result = evaluateWirelessWipsPBQ14(pbq14Wips);
        break;
      case 'pbq-15':
        result = evaluateVulnerabilityManagementPBQ15(pbq15Findings);
        break;
      case 'pbq-16':
        result = evaluateDlpDataProtectionPBQ16(pbq16Dlp);
        break;
      case 'pbq-17':
        result = evaluateIncidentResponsePBQ17(pbq17Actions);
        break;
      case 'pbq-18':
        result = evaluateContainerSecurityPBQ18(pbq18Container);
        break;
      case 'pbq-19':
        result = evaluatePhysicalSecurityPBQ19(pbq19Physical);
        break;
      case 'pbq-20':
        result = evaluateDisasterRecoveryPBQ20(pbq20Dr);
        break;
      case 'pbq-21':
        result = evaluateSocialEngineeringPBQ21(pbq21Social);
        break;
      case 'pbq-22':
        result = evaluateDigitalForensicsPBQ22(pbq22Forensic);
        break;
      case 'pbq-23':
        result = evaluateRiskManagementPBQ23(pbq23Risk);
        break;
      case 'pbq-24':
        result = evaluateEmailSecurityPBQ24(pbq24Email);
        break;
      case 'pbq-25':
        result = evaluateSecurityCliPBQ25(pbq25Cli);
        break;
      case 'pbq-26':
        result = evaluateIdsYaraRulesPBQ26(pbq26IdsYara);
        break;
      case 'pbq-27':
        result = evaluateDevSecOpsPBQ27(pbq27DevSecOps);
        break;
      case 'pbq-28':
        result = evaluateCryptoAttacksPBQ28(pbq28Crypto);
        break;
      case 'pbq-29':
        result = evaluateIdentityFederationPBQ29(pbq29Federation);
        break;
      case 'pbq-30':
        result = evaluateMobileSecurityPBQ30(pbq30Mobile);
        break;
      case 'pbq-31':
        result = evaluatePortSecurityPBQ31(pbq31PortAudit);
        break;
      case 'pbq-32':
        result = evaluateNmapScanPBQ32(pbq32Nmap);
        break;
      case 'pbq-33':
        result = evaluateDnsSecurityPBQ33(pbq33Dns);
        break;
      case 'pbq-34':
        result = evaluateZeroTrustPBQ34(pbq34ZeroTrust);
        break;
      case 'pbq-35':
        result = evaluateWebServerHardeningPBQ35(pbq35WebHardening);
        break;
      case 'pbq-36':
        result = evaluateForensicHoldPBQ36(pbq36ForensicHold);
        break;
      case 'pbq-37':
        result = evaluatePkiLifecyclePBQ37(pbq37PkiLifecycle);
        break;
      case 'pbq-38':
        result = evaluateWirelessSecurityPBQ38(pbq38WirelessSecurity);
        break;
      case 'pbq-39':
        result = evaluateCloudDlpPBQ39(pbq39CloudDlp);
        break;
      case 'pbq-40':
        result = evaluateSocialEngPBQ40(pbq40SocialEng);
        break;
      case 'pbq-41':
        result = evaluateCloudSharedResponsibilityPBQ41(pbq41CloudShared);
        break;
      case 'pbq-42':
        result = evaluateMitreThreatHuntingPBQ42(pbq42Mitre);
        break;
      case 'pbq-43':
        result = evaluateDataGovernancePBQ43(pbq43DataGov);
        break;
      case 'pbq-44':
        result = evaluatePrivacyPetsPBQ44(pbq44PrivacyPets);
        break;
      case 'pbq-45':
        result = evaluateMalwareTriagePBQ45(pbq45Malware);
        break;
      case 'pbq-46':
        result = evaluateMalwareTriagePBQ46(pbq46Malware);
        break;
      case 'pbq-47':
        result = evaluateApiSecurityPBQ47(pbq47ApiSec);
        break;
      case 'pbq-48':
        result = evaluateSoarAutomationPBQ48(pbq48Soar);
        break;
      case 'pbq-49':
        result = evaluateFirewallAclPBQ49(pbq49Fw);
        break;
      case 'pbq-50':
        result = evaluateProtocolMigrationPBQ50(pbq50Ports);
        break;
      default:
        result = {
          totalScore: 0,
          passed: false,
          partialCreditBreakdown: [],
          detailedFeedback: '',
          sy0701Objective: '',
          domainName: '',
        };
    }

    if (result.passed) {
      sound.playSuccess();
    } else {
      sound.playWarning();
    }

    setEvaluations((prev) => ({
      ...prev,
      [currentPBQ.id]: result,
    }));

    setIsBreakdownOpen(true);
  };

  // Reset Current PBQ Dispatcher
  const handleResetCurrentPBQ = () => {
    sound.playToggle();
    switch (currentPBQ.id) {
      case 'pbq-1':
        setPbq1Slots(INITIAL_NETWORK_SLOTS_PBQ1);
        break;
      case 'pbq-2':
        setPbq2Rules(INITIAL_FIREWALL_RULES_PBQ2);
        break;
      case 'pbq-3':
        setPbq3Siem({
          patientZeroIp: '',
          initialAttackVector: '',
          initialCompromiseTimestamp: '',
          immediateContainmentAction: '',
        });
        break;
      case 'pbq-4':
        setPbq4Services(INITIAL_SERVICES_PBQ4);
        setPbq4Policies(INITIAL_SECURITY_POLICIES_PBQ4);
        break;
      case 'pbq-5':
        setPbq5UserGroups(INITIAL_USER_GROUPS_PBQ5);
        setPbq5FolderNodes(INITIAL_FOLDER_PERMISSIONS_PBQ5);
        break;
      case 'pbq-6':
        setPbq6Crypto(INITIAL_CRYPTO_STATE_PBQ6);
        break;
      case 'pbq-7':
        setPbq7Wireless(INITIAL_WIRELESS_STATE_PBQ7);
        break;
      case 'pbq-8':
        setPbq8Slots(INITIAL_NETWORK_SLOTS_PBQ8);
        break;
      case 'pbq-9':
        setPbq9Rules(INITIAL_FIREWALL_RULES_PBQ9);
        break;
      case 'pbq-10':
        setPbq10Siem({
          patientZeroIp: '',
          initialAttackVector: '',
          initialCompromiseTimestamp: '',
          immediateContainmentAction: '',
        });
        break;
      case 'pbq-11':
        setPbq11Services(INITIAL_SERVICES_PBQ11);
        setPbq11Policies(INITIAL_SECURITY_POLICIES_PBQ11);
        break;
      case 'pbq-12':
        setPbq12Ca(INITIAL_CONDITIONAL_ACCESS_STATE);
        break;
      case 'pbq-13':
        setPbq13Pki(INITIAL_PKI_CERT_STATE);
        break;
      case 'pbq-14':
        setPbq14Wips(INITIAL_WIPS_ROGUE_STATE);
        break;
      case 'pbq-15':
        setPbq15Findings(INITIAL_FINDINGS_PBQ15);
        break;
      case 'pbq-16':
        setPbq16Dlp(INITIAL_DLP_ITEMS_PBQ16);
        break;
      case 'pbq-17':
        setPbq17Actions(INITIAL_IR_ACTIONS_PBQ17);
        break;
      case 'pbq-18':
        setPbq18Container(INITIAL_CONTAINER_STATE_PBQ18);
        break;
      case 'pbq-19':
        setPbq19Physical(INITIAL_PHYSICAL_STATE_PBQ19);
        break;
      case 'pbq-20':
        setPbq20Dr(INITIAL_DISASTER_RECOVERY_STATE_PBQ20);
        break;
      case 'pbq-21':
        setPbq21Social(INITIAL_SOCIAL_CASES_PBQ21);
        break;
      case 'pbq-22':
        setPbq22Forensic(INITIAL_FORENSIC_STATE_PBQ22);
        break;
      case 'pbq-23':
        setPbq23Risk(INITIAL_RISK_STATE_PBQ23);
        break;
      case 'pbq-24':
        setPbq24Email(INITIAL_EMAIL_STATE_PBQ24);
        break;
      case 'pbq-25':
        setPbq25Cli(INITIAL_CLI_SCENARIOS_PBQ25);
        break;
      case 'pbq-26':
        setPbq26IdsYara(INITIAL_IDS_YARA_STATE_PBQ26);
        break;
      case 'pbq-27':
        setPbq27DevSecOps(INITIAL_DEVSECOPS_STATE_PBQ27);
        break;
      case 'pbq-28':
        setPbq28Crypto(INITIAL_CRYPTO_CASES_PBQ28);
        break;
      case 'pbq-29':
        setPbq29Federation(INITIAL_FEDERATION_STATE_PBQ29);
        break;
      case 'pbq-30':
        setPbq30Mobile(INITIAL_MOBILE_STATE_PBQ30);
        break;
      case 'pbq-31':
        setPbq31PortAudit(INITIAL_PORT_AUDIT_PBQ31);
        break;
      case 'pbq-32':
        setPbq32Nmap(INITIAL_NMAP_STATE_PBQ32);
        break;
      case 'pbq-33':
        setPbq33Dns(INITIAL_DNS_STATE_PBQ33);
        break;
      case 'pbq-34':
        setPbq34ZeroTrust(INITIAL_ZERO_TRUST_STATE_PBQ34);
        break;
      case 'pbq-35':
        setPbq35WebHardening(INITIAL_WEB_HARDENING_STATE_PBQ35);
        break;
      case 'pbq-36':
        setPbq36ForensicHold(INITIAL_FORENSIC_HOLD_PBQ36);
        break;
      case 'pbq-37':
        setPbq37PkiLifecycle(INITIAL_PKI_LIFECYCLE_PBQ37);
        break;
      case 'pbq-38':
        setPbq38WirelessSecurity(INITIAL_WIRELESS_SECURITY_PBQ38);
        break;
      case 'pbq-39':
        setPbq39CloudDlp(INITIAL_CLOUD_DLP_PBQ39);
        break;
      case 'pbq-40':
        setPbq40SocialEng(INITIAL_SOCIAL_ENG_PBQ40);
        break;
      case 'pbq-41':
        setPbq41CloudShared(INITIAL_CLOUD_SHARED_RESPONSIBILITY_PBQ41);
        break;
      case 'pbq-42':
        setPbq42Mitre(INITIAL_MITRE_THREAT_HUNTING_PBQ42);
        break;
      case 'pbq-43':
        setPbq43DataGov(INITIAL_DATA_GOVERNANCE_PBQ43);
        break;
      case 'pbq-44':
        setPbq44PrivacyPets(INITIAL_PRIVACY_PETS_PBQ44);
        break;
      case 'pbq-45':
        setPbq45Malware(INITIAL_MALWARE_TRIAGE_PBQ45);
        break;
      case 'pbq-46':
        setPbq46Malware(INITIAL_MALWARE_TRIAGE_PBQ46);
        break;
      case 'pbq-47':
        setPbq47ApiSec(INITIAL_API_SECURITY_PBQ47);
        break;
      case 'pbq-48':
        setPbq48Soar(INITIAL_SOAR_AUTOMATION_PBQ48);
        break;
      case 'pbq-49':
        setPbq49Fw(INITIAL_FIREWALL_RULES_PBQ49);
        break;
      case 'pbq-50':
        setPbq50Ports(INITIAL_PORT_AUDIT_PBQ50);
        break;
    }
  };

  const handleRestartFullExam = () => {
    sound.playToggle();
    setPbq1Slots(INITIAL_NETWORK_SLOTS_PBQ1);
    setPbq8Slots(INITIAL_NETWORK_SLOTS_PBQ8);
    setPbq2Rules(INITIAL_FIREWALL_RULES_PBQ2);
    setPbq9Rules(INITIAL_FIREWALL_RULES_PBQ9);
    setPbq3Siem({
      patientZeroIp: '',
      initialAttackVector: '',
      initialCompromiseTimestamp: '',
      immediateContainmentAction: '',
    });
    setPbq10Siem({
      patientZeroIp: '',
      initialAttackVector: '',
      initialCompromiseTimestamp: '',
      immediateContainmentAction: '',
    });
    setPbq4Services(INITIAL_SERVICES_PBQ4);
    setPbq4Policies(INITIAL_SECURITY_POLICIES_PBQ4);
    setPbq11Services(INITIAL_SERVICES_PBQ11);
    setPbq11Policies(INITIAL_SECURITY_POLICIES_PBQ11);
    setPbq5UserGroups(INITIAL_USER_GROUPS_PBQ5);
    setPbq5FolderNodes(INITIAL_FOLDER_PERMISSIONS_PBQ5);
    setPbq12Ca(INITIAL_CONDITIONAL_ACCESS_STATE);
    setPbq6Crypto(INITIAL_CRYPTO_STATE_PBQ6);
    setPbq13Pki(INITIAL_PKI_CERT_STATE);
    setPbq7Wireless(INITIAL_WIRELESS_STATE_PBQ7);
    setPbq14Wips(INITIAL_WIPS_ROGUE_STATE);
    setPbq15Findings(INITIAL_FINDINGS_PBQ15);
    setPbq16Dlp(INITIAL_DLP_ITEMS_PBQ16);
    setPbq17Actions(INITIAL_IR_ACTIONS_PBQ17);
    setPbq18Container(INITIAL_CONTAINER_STATE_PBQ18);
    setPbq19Physical(INITIAL_PHYSICAL_STATE_PBQ19);
    setPbq20Dr(INITIAL_DISASTER_RECOVERY_STATE_PBQ20);
    setPbq21Social(INITIAL_SOCIAL_CASES_PBQ21);
    setPbq22Forensic(INITIAL_FORENSIC_STATE_PBQ22);
    setPbq23Risk(INITIAL_RISK_STATE_PBQ23);
    setPbq24Email(INITIAL_EMAIL_STATE_PBQ24);
    setPbq25Cli(INITIAL_CLI_SCENARIOS_PBQ25);
    setPbq26IdsYara(INITIAL_IDS_YARA_STATE_PBQ26);
    setPbq27DevSecOps(INITIAL_DEVSECOPS_STATE_PBQ27);
    setPbq28Crypto(INITIAL_CRYPTO_CASES_PBQ28);
    setPbq29Federation(INITIAL_FEDERATION_STATE_PBQ29);
    setPbq30Mobile(INITIAL_MOBILE_STATE_PBQ30);
    setPbq31PortAudit(INITIAL_PORT_AUDIT_PBQ31);
    setPbq32Nmap(INITIAL_NMAP_STATE_PBQ32);
    setPbq33Dns(INITIAL_DNS_STATE_PBQ33);
    setPbq34ZeroTrust(INITIAL_ZERO_TRUST_STATE_PBQ34);
    setPbq35WebHardening(INITIAL_WEB_HARDENING_STATE_PBQ35);
    setPbq36ForensicHold(INITIAL_FORENSIC_HOLD_PBQ36);
    setPbq37PkiLifecycle(INITIAL_PKI_LIFECYCLE_PBQ37);
    setPbq38WirelessSecurity(INITIAL_WIRELESS_SECURITY_PBQ38);
    setPbq39CloudDlp(INITIAL_CLOUD_DLP_PBQ39);
    setPbq40SocialEng(INITIAL_SOCIAL_ENG_PBQ40);
    setPbq41CloudShared(INITIAL_CLOUD_SHARED_RESPONSIBILITY_PBQ41);
    setPbq42Mitre(INITIAL_MITRE_THREAT_HUNTING_PBQ42);
    setPbq43DataGov(INITIAL_DATA_GOVERNANCE_PBQ43);
    setPbq44PrivacyPets(INITIAL_PRIVACY_PETS_PBQ44);
    setPbq45Malware(INITIAL_MALWARE_TRIAGE_PBQ45);
    setPbq46Malware(INITIAL_MALWARE_TRIAGE_PBQ46);
    setPbq47ApiSec(INITIAL_API_SECURITY_PBQ47);
    setPbq48Soar(INITIAL_SOAR_AUTOMATION_PBQ48);
    setPbq49Fw(INITIAL_FIREWALL_RULES_PBQ49);
    setPbq50Ports(INITIAL_PORT_AUDIT_PBQ50);

    setEvaluations({});
    setFlaggedIds(new Set());
    setTimerSeconds(90 * 60);
    setTimerActive(true);
    setCurrentPbqIndex(0);
  };

  const handleStartMiniDrill = () => {
    sound.playSuccess();
    setPbq45Malware(INITIAL_MALWARE_TRIAGE_PBQ45);
    setPbq46Malware(INITIAL_MALWARE_TRIAGE_PBQ46);
    setPbq47ApiSec(INITIAL_API_SECURITY_PBQ47);
    setPbq48Soar(INITIAL_SOAR_AUTOMATION_PBQ48);
    setPbq49Fw(INITIAL_FIREWALL_RULES_PBQ49);
    setPbq50Ports(INITIAL_PORT_AUDIT_PBQ50);
    setEvaluations({});
    setFlaggedIds(new Set());
    setMode('exam');
    setTimerSeconds(25 * 60); // 25 minutos para simulación rápida de PBQs
    setTimerActive(true);
    setCurrentPbqIndex(0);
  };

  // Global Keyboard Shortcuts for Power Users & Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement | null;
      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      // 1. Submit/Validate PBQ: Ctrl+Enter or Cmd+Enter
      if (isCmdOrCtrl && e.key === 'Enter') {
        e.preventDefault();
        handleEvaluateCurrentPBQ();
        return;
      }

      // 2. Escape: Close any open modal
      if (e.key === 'Escape') {
        if (isBreakdownOpen || isCyberKraftOpen || isExamSummaryOpen || isShortcutsModalOpen || isCheatSheetOpen) {
          e.preventDefault();
          setIsBreakdownOpen(false);
          setIsCyberKraftOpen(false);
          setIsExamSummaryOpen(false);
          setIsShortcutsModalOpen(false);
          setIsCheatSheetOpen(false);
          return;
        }
      }

      // 3. Toggle Shortcuts Cheatsheet: Ctrl+/ or Cmd+/
      if (isCmdOrCtrl && (e.key === '/' || e.key === '?')) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
        return;
      }

      // 4. Toggle Detailed Explanation Modal: Alt+E
      if (e.altKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        if (evaluations[currentPBQ.id]) {
          setIsBreakdownOpen((prev) => !prev);
        }
        return;
      }

      // 5. Toggle Cheat Sheet Modal: Alt+P
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setIsCheatSheetOpen((prev) => !prev);
        return;
      }

      // 6. Toggle Exam Summary Modal: Alt+S
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setIsExamSummaryOpen((prev) => !prev);
        return;
      }

      // 7. Reset PBQ: Alt+R
      if (e.altKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        handleResetCurrentPBQ();
        return;
      }

      // 8. Navigate Previous PBQ: Ctrl+ArrowLeft or Alt+ArrowLeft
      if ((isCmdOrCtrl || e.altKey) && e.key === 'ArrowLeft') {
        if (!isInput || e.altKey) {
          e.preventDefault();
          if (currentPbqIndex > 0) {
            sound.playClick();
            setCurrentPbqIndex((prev) => Math.max(0, prev - 1));
          }
        }
        return;
      }

      // 9. Navigate Next PBQ: Ctrl+ArrowRight or Alt+ArrowRight
      if ((isCmdOrCtrl || e.altKey) && e.key === 'ArrowRight') {
        if (!isInput || e.altKey) {
          e.preventDefault();
          if (currentPbqIndex < PBQ_LIST.length - 1) {
            sound.playClick();
            setCurrentPbqIndex((prev) => Math.min(PBQ_LIST.length - 1, prev + 1));
          } else {
            sound.playSuccess();
            setIsExamSummaryOpen(true);
          }
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentPbqIndex,
    currentPBQ,
    isBreakdownOpen,
    isCyberKraftOpen,
    isExamSummaryOpen,
    isShortcutsModalOpen,
    isCheatSheetOpen,
    evaluations,
    pbq1Slots,
    pbq2Rules,
    pbq3Siem,
    pbq4Services,
    pbq4Policies,
    pbq5UserGroups,
    pbq5FolderNodes,
    pbq6Crypto,
    pbq7Wireless,
    pbq8Slots,
    pbq9Rules,
    pbq10Siem,
    pbq11Services,
    pbq11Policies,
    pbq12Ca,
    pbq13Pki,
    pbq14Wips,
    pbq15Findings,
    pbq16Dlp,
    pbq17Actions,
    pbq18Container,
    pbq19Physical,
    pbq20Dr,
    pbq21Social,
    pbq22Forensic,
    pbq23Risk,
    pbq24Email,
    pbq25Cli,
    pbq26IdsYara,
    pbq27DevSecOps,
    pbq28Crypto,
    pbq29Federation,
    pbq30Mobile,
    pbq31PortAudit,
    pbq32Nmap,
    pbq33Dns,
    pbq34ZeroTrust,
    pbq35WebHardening,
    pbq36ForensicHold,
    pbq37PkiLifecycle,
    pbq38WirelessSecurity,
    pbq39CloudDlp,
    pbq40SocialEng,
    pbq41CloudShared,
    pbq42Mitre,
    pbq43DataGov,
    pbq44PrivacyPets,
    pbq45Malware,
    pbq46Malware,
    pbq47ApiSec,
    pbq48Soar,
    pbq49Fw,
    pbq50Ports,
  ]);

  const currentEvalResult = evaluations[currentPBQ.id] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header and Workspace Toolbar */}
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        secondsLeft={timerSeconds}
        timerActive={timerActive}
        onToggleTimer={() => setTimerActive(!timerActive)}
        isFlagged={flaggedIds.has(currentPBQ.id)}
        onToggleFlag={handleToggleFlag}
        onOpenCyberKraft={() => setIsCyberKraftOpen(true)}
        onOpenExamSummary={() => setIsExamSummaryOpen(true)}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(sound.toggleMute())}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      {/* PBQ Navigation Ribbon with Category Filters and Search */}
      <PBQNav
        pbqs={PBQ_LIST}
        currentIndex={currentPbqIndex}
        onSelectIndex={(idx) => setCurrentPbqIndex(idx)}
        flaggedIds={flaggedIds}
        evaluations={evaluations}
      />

      {/* Main Dual-Panel Simulation Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Scenario & Tactical Instructions (Extended width lg:col-span-5 for superior reading comfort) */}
        <section className="lg:col-span-5 space-y-4">
          {/* PBQ Identification Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                PBQ {currentPBQ.number} de {PBQ_LIST.length} • {currentPBQ.categoryTitle}
              </span>
              <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-md">
                {currentPBQ.estimatedMinutes} min aprox
              </span>
            </div>

            <h1 className="text-xl font-bold text-white tracking-tight leading-snug">
              {currentPBQ.title}
            </h1>

            <div className="text-xs text-slate-400 font-mono space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="font-semibold text-slate-300">{currentPBQ.domain}</div>
              <div className="text-slate-400 text-[11px]">{currentPBQ.sy0701Objective}</div>
            </div>
          </div>

          {/* Reading Mode Switcher and Font Size Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {/* View tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  sound.playClick();
                  setReadingMode('scenario');
                }}
                className={`py-1.5 px-3 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                  readingMode === 'scenario'
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Escenario Completo</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setReadingMode('checklist');
                }}
                className={`py-1.5 px-3 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                  readingMode === 'checklist'
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5 text-cyan-400" />
                <span>Paso a Paso ({currentPBQ.requirements.length})</span>
              </button>
            </div>

            {/* Font Size Toggle for comfortable reading */}
            <div className="flex items-center gap-1 pr-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium px-1 hidden sm:inline">Letra:</span>
              <button
                onClick={() => {
                  sound.playClick();
                  setFontSize('normal');
                }}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  fontSize === 'normal'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Normal (14px)"
              >
                A
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setFontSize('large');
                }}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  fontSize === 'large'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grande (16px - Recomendado)"
              >
                A+
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setFontSize('xlarge');
                }}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                  fontSize === 'xlarge'
                    ? 'bg-cyan-900 text-cyan-200 border border-cyan-700 shadow-sm ring-1 ring-cyan-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Extra Grande (18px - Máxima Lectura)"
              >
                A++
              </button>
            </div>
          </div>

          {/* Scenario Description / Checklist (Enlarged High-Contrast Text for effortless reading) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-4 shadow-xl">
            {readingMode === 'scenario' ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>Escenario Oficial del Examen CompTIA</span>
                    </h2>
                    <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60">
                      SY0-701
                    </span>
                  </div>
                  
                  {/* High contrast, large and comfortable text */}
                  <div
                    className={`rounded-2xl p-5 bg-slate-950 border border-slate-800/90 text-slate-100 font-sans tracking-normal select-text shadow-inner ${
                      fontSize === 'xlarge'
                        ? 'text-lg sm:text-[18px] leading-8 font-normal text-slate-50'
                        : fontSize === 'large'
                        ? 'text-base sm:text-[16px] leading-7 font-normal text-slate-100'
                        : 'text-sm sm:text-[14px] leading-6 font-normal text-slate-200'
                    }`}
                  >
                    {currentPBQ.scenario}
                  </div>
                </div>

                {/* Sub-requirements summary */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ListChecks className="w-4 h-4 text-cyan-400" />
                    Instrucciones y Requerimientos a Cumplir:
                  </div>
                  <ul className="space-y-2 font-sans">
                    {currentPBQ.requirements.map((req, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-slate-200 transition-colors hover:border-slate-700 ${
                          fontSize === 'xlarge'
                            ? 'text-base leading-relaxed'
                            : fontSize === 'large'
                            ? 'text-sm leading-relaxed'
                            : 'text-xs leading-normal'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          {i + 1}
                        </span>
                        <span className="leading-snug">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-cyan-400" />
                  Instrucciones Tácticas Paso a Paso:
                </h2>
                <div className="space-y-3">
                  {currentPBQ.requirements.map((req, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 flex items-start gap-3 shadow-sm hover:border-slate-700 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p
                        className={`text-slate-100 leading-relaxed font-sans ${
                          fontSize === 'xlarge'
                            ? 'text-base sm:text-[16px]'
                            : fontSize === 'large'
                            ? 'text-sm sm:text-[15px]'
                            : 'text-xs'
                        }`}
                      >
                        {req}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick CyberKraft Tip Callout */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsCyberKraftOpen(true)}
                className="w-full p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/80 text-left hover:bg-cyan-950/60 transition-colors group"
              >
                <div className="flex items-center justify-between text-cyan-300 text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-cyan-400" />
                    CyberKraft Tip para esta PBQ
                  </span>
                  <BookOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <p
                  className={`text-cyan-100 font-sans leading-relaxed ${
                    fontSize === 'large' ? 'text-xs sm:text-[13px]' : 'text-xs'
                  }`}
                >
                  {currentPBQ.tacticalTip}
                </p>
              </button>
            </div>
          </div>

          {/* Current Evaluation Score Badge (if evaluated) */}
          {currentEvalResult && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                currentEvalResult.totalScore >= 75
                  ? 'bg-emerald-950/30 border-emerald-800'
                  : 'bg-amber-950/30 border-amber-800'
              }`}
            >
              <div>
                <div className="text-[11px] font-semibold text-slate-400">
                  Última Calificación Parcial
                </div>
                <div className="text-xl font-black text-white font-mono tabular-nums">
                  {currentEvalResult.totalScore}%
                </div>
              </div>
              <button
                onClick={() => setIsBreakdownOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500 transition-colors"
              >
                Ver Desglose
              </button>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: Interactive Simulator Area (lg:col-span-7) */}
        <section className="lg:col-span-7 space-y-6">
          <div className="min-h-[520px]">
            {/* PBQ 1: Traditional Perimeter Diagram */}
            {currentPBQ.id === 'pbq-1' && (
              <NetworkDiagramPBQ
                slots={pbq1Slots}
                onSlotsChange={setPbq1Slots}
                availableControls={AVAILABLE_NETWORK_CONTROLS_PBQ1}
                initialSlots={INITIAL_NETWORK_SLOTS_PBQ1}
                variant="traditional"
              />
            )}

            {/* PBQ 2: Inbound Firewall ACL */}
            {currentPBQ.id === 'pbq-2' && (
              <FirewallAclPBQ
                rules={pbq2Rules}
                onRulesChange={setPbq2Rules}
                packetTests={FIREWALL_PACKET_TESTS_PBQ2}
                initialRules={INITIAL_FIREWALL_RULES_PBQ2}
                helperText="Audita el orden y parámetros de la tabla ACL. Recuerda que la evaluación es First-Match (de arriba hacia abajo)."
              />
            )}

            {/* PBQ 3: SIEM Log SQLi */}
            {currentPBQ.id === 'pbq-3' && (
              <LogSiemPBQ
                answers={pbq3Siem}
                onAnswersChange={setPbq3Siem}
                logs={SIEM_LOGS_PBQ3}
                questionsConfig={SIEM_QUESTIONS_PBQ3}
              />
            )}

            {/* PBQ 4: Server Web Hardening */}
            {currentPBQ.id === 'pbq-4' && (
              <EndpointHardeningPBQ
                services={pbq4Services}
                policies={pbq4Policies}
                onServicesChange={setPbq4Services}
                onPoliciesChange={setPbq4Policies}
                onReset={handleResetCurrentPBQ}
                title="Consola de Endurecimiento de Servidor Web (Server 2025 Baseline)"
                subtitle="Aplica el principio de deshabilitación de servicios innecesarios y directivas de seguridad CIS/NIST."
              />
            )}

            {/* PBQ 5: IAM Permissions NTFS */}
            {currentPBQ.id === 'pbq-5' && (
              <IamPermissionsPBQ
                userGroups={pbq5UserGroups}
                folderNodes={pbq5FolderNodes}
                onUserGroupsChange={setPbq5UserGroups}
                onFoldersChange={setPbq5FolderNodes}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 6: Cryptography & VPN */}
            {currentPBQ.id === 'pbq-6' && (
              <CryptographyVpnPBQ
                state={pbq6Crypto}
                onChange={setPbq6Crypto}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 7: Wireless AP WPA3 Enterprise */}
            {currentPBQ.id === 'pbq-7' && (
              <WirelessApPBQ
                state={pbq7Wireless}
                onChange={setPbq7Wireless}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 8: Hybrid Cloud & Zero Trust Ingress */}
            {currentPBQ.id === 'pbq-8' && (
              <NetworkDiagramPBQ
                slots={pbq8Slots}
                onSlotsChange={setPbq8Slots}
                availableControls={AVAILABLE_NETWORK_CONTROLS_PBQ8}
                initialSlots={INITIAL_NETWORK_SLOTS_PBQ8}
                variant="cloud"
              />
            )}

            {/* PBQ 9: Egress Filtering & Anti-Exfiltration ACL */}
            {currentPBQ.id === 'pbq-9' && (
              <FirewallAclPBQ
                rules={pbq9Rules}
                onRulesChange={setPbq9Rules}
                packetTests={FIREWALL_PACKET_TESTS_PBQ9}
                initialRules={INITIAL_FIREWALL_RULES_PBQ9}
                helperText="Configura directivas de filtrado de salida (Egress Filtering) para bloquear exfiltración por túneles DNS y reverse shells C2."
              />
            )}

            {/* PBQ 10: SIEM Phishing, Beaconing & Kerberoasting */}
            {currentPBQ.id === 'pbq-10' && (
              <LogSiemPBQ
                answers={pbq10Siem}
                onAnswersChange={setPbq10Siem}
                logs={SIEM_LOGS_PBQ10}
                questionsConfig={SIEM_QUESTIONS_PBQ10}
              />
            )}

            {/* PBQ 11: Workstation Hardening (LLMNR, Cred Guard & Macros) */}
            {currentPBQ.id === 'pbq-11' && (
              <EndpointHardeningPBQ
                services={pbq11Services}
                policies={pbq11Policies}
                onServicesChange={setPbq11Services}
                onPoliciesChange={setPbq11Policies}
                onReset={handleResetCurrentPBQ}
                title="Línea Base de Estaciones de Trabajo Windows 11 (Workstation Baseline)"
                subtitle="Mitigación de LLMNR/Responder, Credential Guard contra Mimikatz y bloqueo de macros de Internet."
              />
            )}

            {/* PBQ 12: Conditional Access & Zero Trust */}
            {currentPBQ.id === 'pbq-12' && (
              <ConditionalAccessPBQ
                state={pbq12Ca}
                onChange={setPbq12Ca}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 13: PKI Certificate Chain Diagnostics */}
            {currentPBQ.id === 'pbq-13' && (
              <PkiCertificatesPBQ
                state={pbq13Pki}
                onChange={setPbq13Pki}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 14: Wireless WIPS Rogue AP / Evil Twin */}
            {currentPBQ.id === 'pbq-14' && (
              <WipsRogueApPBQ
                state={pbq14Wips}
                onChange={setPbq14Wips}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 15: Vulnerability Management & CVSS Remediation */}
            {currentPBQ.id === 'pbq-15' && (
              <VulnerabilityManagementPBQ
                findings={pbq15Findings}
                onChange={setPbq15Findings}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 16: DLP & Data Protection in 3 States */}
            {currentPBQ.id === 'pbq-16' && (
              <DlpDataProtectionPBQ
                items={pbq16Dlp}
                onChange={setPbq16Dlp}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 17: Incident Response Playbook (NIST SP 800-61r2) */}
            {currentPBQ.id === 'pbq-17' && (
              <IncidentResponsePBQ
                actions={pbq17Actions}
                onChange={setPbq17Actions}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 18: Container & Pod Security (CIS Docker / K8s) */}
            {currentPBQ.id === 'pbq-18' && (
              <ContainerSecurityPBQ
                state={pbq18Container}
                onChange={setPbq18Container}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 19: Physical Security & Datacenter Design */}
            {currentPBQ.id === 'pbq-19' && (
              <PhysicalSecurityPBQ
                state={pbq19Physical}
                onChange={setPbq19Physical}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 20: Disaster Recovery & Business Continuity (SLA 99.99%) */}
            {currentPBQ.id === 'pbq-20' && (
              <DisasterRecoveryPBQ
                state={pbq20Dr}
                onChange={setPbq20Dr}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 21: Social Engineering & Human Factors */}
            {currentPBQ.id === 'pbq-21' && (
              <SocialEngineeringPBQ
                cases={pbq21Social}
                onChange={setPbq21Social}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 22: Digital Forensics & Order of Volatility (RFC 3227) */}
            {currentPBQ.id === 'pbq-22' && (
              <DigitalForensicsPBQ
                state={pbq22Forensic}
                onChange={setPbq22Forensic}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 23: Quantitative Risk Assessment (SLE, ARO, ALE) */}
            {currentPBQ.id === 'pbq-23' && (
              <RiskManagementPBQ
                state={pbq23Risk}
                onChange={setPbq23Risk}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 24: Email Security (SPF, DKIM, DMARC) */}
            {currentPBQ.id === 'pbq-24' && (
              <EmailSecurityPBQ
                state={pbq24Email}
                onChange={setPbq24Email}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 25: Security CLI & Terminal Diagnostics */}
            {currentPBQ.id === 'pbq-25' && (
              <SecurityCliPBQ
                scenarios={pbq25Cli}
                onChange={setPbq25Cli}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 26: IDS/IPS Snort & YARA Rule Engineering */}
            {currentPBQ.id === 'pbq-26' && (
              <IdsYaraRulesPBQ
                state={pbq26IdsYara}
                onChange={setPbq26IdsYara}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 27: DevSecOps CI/CD Pipeline */}
            {currentPBQ.id === 'pbq-27' && (
              <DevSecOpsPBQ
                state={pbq27DevSecOps}
                onChange={setPbq27DevSecOps}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 28: Cryptographic Attacks & Countermeasures */}
            {currentPBQ.id === 'pbq-28' && (
              <CryptoAttacksPBQ
                cases={pbq28Crypto}
                onChange={setPbq28Crypto}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 29: Federated Identity, SSO & Tokens */}
            {currentPBQ.id === 'pbq-29' && (
              <IdentityFederationPBQ
                state={pbq29Federation}
                onChange={setPbq29Federation}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 30: Mobile Security & MDM/MAM Policies */}
            {currentPBQ.id === 'pbq-30' && (
              <MobileSecurityPBQ
                state={pbq30Mobile}
                onChange={setPbq30Mobile}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 31: Port Security & Protocol Hardening (CompTIA Port Mastery) */}
            {currentPBQ.id === 'pbq-31' && (
              <PortSecurityPBQ
                items={pbq31PortAudit}
                onChange={setPbq31PortAudit}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 32: Nmap Port Scanning & Reconnaissance Analysis */}
            {currentPBQ.id === 'pbq-32' && (
              <NmapScanPBQ
                state={pbq32Nmap}
                onChange={setPbq32Nmap}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 33: DNS Security, DoT/DoH & DNSSEC Hardening */}
            {currentPBQ.id === 'pbq-33' && (
              <DnsSecurityPBQ
                state={pbq33Dns}
                onChange={setPbq33Dns}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 34: Zero Trust Architecture (ZTA) & Microsegmentation */}
            {currentPBQ.id === 'pbq-34' && (
              <ZeroTrustPBQ
                state={pbq34ZeroTrust}
                onChange={setPbq34ZeroTrust}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 35: Web Server Hardening & HTTP Security Headers */}
            {currentPBQ.id === 'pbq-35' && (
              <WebServerHardeningPBQ
                state={pbq35WebHardening}
                onChange={setPbq35WebHardening}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 36: Forensic Legal Hold & Evidence Chain of Custody */}
            {currentPBQ.id === 'pbq-36' && (
              <ForensicHoldPBQ
                state={pbq36ForensicHold}
                onChange={setPbq36ForensicHold}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 37: PKI Lifecycle, OCSP Stapling, X.509 Formats & Key Escrow */}
            {currentPBQ.id === 'pbq-37' && (
              <PkiLifecyclePBQ
                state={pbq37PkiLifecycle}
                onChange={setPbq37PkiLifecycle}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 38: Wireless WPA3-Enterprise, 802.1X & WIPS */}
            {currentPBQ.id === 'pbq-38' && (
              <WirelessSecurityPBQ
                state={pbq38WirelessSecurity}
                onChange={setPbq38WirelessSecurity}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 39: Cloud Storage DLP & CASB Data Classification */}
            {currentPBQ.id === 'pbq-39' && (
              <CloudDlpPBQ
                state={pbq39CloudDlp}
                onChange={setPbq39CloudDlp}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 40: Social Engineering Attacks, Psychological Triggers & Defenses */}
            {currentPBQ.id === 'pbq-40' && (
              <SocialEngPBQ
                state={pbq40SocialEng}
                onChange={setPbq40SocialEng}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 41: Cloud Shared Responsibility Model (IaaS, PaaS, SaaS) */}
            {currentPBQ.id === 'pbq-41' && (
              <CloudSharedResponsibilityPBQ
                state={pbq41CloudShared}
                onChange={setPbq41CloudShared}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 42: MITRE ATT&CK Threat Hunting, Windows Events & Active Directory */}
            {currentPBQ.id === 'pbq-42' && (
              <MitreThreatHuntingPBQ
                state={pbq42Mitre}
                onChange={setPbq42Mitre}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 43: Data Governance, Roles, Lifecycle & NIST SP 800-88 Sanitization */}
            {currentPBQ.id === 'pbq-43' && (
              <DataGovernancePBQ
                state={pbq43DataGov}
                onChange={setPbq43DataGov}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 44: Privacy Enhancing Technologies (PETs) & Data Obfuscation */}
            {currentPBQ.id === 'pbq-44' && (
              <PrivacyPetsPBQ
                state={pbq44PrivacyPets}
                onChange={setPbq44PrivacyPets}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 45: Comprehensive Malware Triage - Parte 1 (Endpoints & Criptografía) */}
            {currentPBQ.id === 'pbq-45' && (
              <MalwareTriagePBQ
                state={pbq45Malware}
                onChange={setPbq45Malware}
                onReset={handleResetCurrentPBQ}
                pbqNumber={45}
                partTitle="Parte 1: Endpoints, Criptografía y Persistencia en Memoria"
              />
            )}

            {/* PBQ 46: Comprehensive Malware Triage - Parte 2 (Amenazas de Red, Lógica y Evasión Avanzada) */}
            {currentPBQ.id === 'pbq-46' && (
              <MalwareTriagePBQ
                state={pbq46Malware}
                onChange={setPbq46Malware}
                onReset={handleResetCurrentPBQ}
                pbqNumber={46}
                partTitle="Parte 2: Amenazas de Red, Código Latente y Evasión Polimórfica"
              />
            )}

            {/* PBQ 47: Secure Software Development & OWASP API Top 10 */}
            {currentPBQ.id === 'pbq-47' && (
              <ApiSecurityPBQ
                state={pbq47ApiSec}
                onChange={setPbq47ApiSec}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 48: SIEM Correlation Rules & SOAR Playbook Automation */}
            {currentPBQ.id === 'pbq-48' && (
              <SoarAutomationPBQ
                state={pbq48Soar}
                onChange={setPbq48Soar}
                onReset={handleResetCurrentPBQ}
              />
            )}

            {/* PBQ 49: Advanced Stateful Firewall ACLs & DMZ Multi-Tier Filtering (Tier S) */}
            {currentPBQ.id === 'pbq-49' && (
              <FirewallAclPBQ
                rules={pbq49Fw}
                onRulesChange={setPbq49Fw}
                packetTests={FIREWALL_PACKET_TESTS_PBQ49}
                initialRules={INITIAL_FIREWALL_RULES_PBQ49}
                helperText="NGFW Multi-Zona: Aplica First-Match (de arriba hacia abajo), Least Privilege para la Base de Datos PCI-DSS y Aislamiento total de la DMZ."
              />
            )}

            {/* PBQ 50: Endpoint & Network Port Hardening + Protocol Migration Audit (Tier S) */}
            {currentPBQ.id === 'pbq-50' && (
              <PortSecurityPBQ
                items={pbq50Ports}
                onChange={setPbq50Ports}
                onReset={handleResetCurrentPBQ}
              />
            )}
          </div>


          {/* Bottom Action Control Deck */}
          <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4 sticky bottom-4 z-30">
            {/* Left Nav (Previous PBQ) */}
            <button
              disabled={currentPbqIndex === 0}
              onClick={() => {
                sound.playClick();
                setCurrentPbqIndex(currentPbqIndex - 1);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-slate-800"
              title="Ir a PBQ anterior (Ctrl + ←)"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior PBQ</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400">
                Ctrl+←
              </kbd>
            </button>

            {/* Center Primary Evaluation Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleEvaluateCurrentPBQ}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 rounded-xl transition-all shadow-lg shadow-cyan-950 ring-1 ring-cyan-400/40"
                title="Enviar y validar solución (Ctrl + Enter)"
              >
                <FileCheck className="w-4 h-4" />
                <span>Enviar y Validar PBQ</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/50 text-[10px] font-mono text-cyan-200">
                  Ctrl+↵
                </kbd>
              </button>

              {currentEvalResult && (
                <button
                  onClick={() => setIsBreakdownOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                  title="Abrir diagnóstico pedagógico y glosario (Alt + E)"
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Explicación Detallada</span>
                  <kbd className="hidden md:inline-block px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-400">
                    Alt+E
                  </kbd>
                </button>
              )}
            </div>

            {/* Right Nav (Next PBQ or Finalize Exam) */}
            {currentPbqIndex < PBQ_LIST.length - 1 ? (
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentPbqIndex(currentPbqIndex + 1);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors shadow-md shadow-cyan-950"
                title="Avanzar a siguiente PBQ (Ctrl + →)"
              >
                <span>Siguiente PBQ</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-cyan-800/80 border border-cyan-400/50 text-[10px] font-mono text-cyan-100">
                  Ctrl+→
                </kbd>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playSuccess();
                  setIsExamSummaryOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-lg shadow-emerald-950"
              >
                <Award className="w-4 h-4" />
                <span>Finalizar Examen</span>
              </button>
            )}
          </div>
        </section>
      </main>

      {/* CyberKraft Test Strategy Guide Modal */}
      <CyberKraftModal
        isOpen={isCyberKraftOpen}
        onClose={() => setIsCyberKraftOpen(false)}
        pbqTitle={`PBQ ${currentPBQ.number}: ${currentPBQ.title}`}
        pbqTacticalTip={currentPBQ.tacticalTip}
      />

      {/* Score Breakdown Modal */}
      <ScoreBreakdownModal
        result={currentEvalResult}
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        hasNextPBQ={currentPbqIndex < PBQ_LIST.length - 1}
        onNextPBQ={() => setCurrentPbqIndex(currentPbqIndex + 1)}
        onRetry={handleResetCurrentPBQ}
        currentPBQ={currentPBQ}
      />

      {/* Full Simulated Exam Report Modal */}
      <ExamSummaryModal
        isOpen={isExamSummaryOpen}
        onClose={() => setIsExamSummaryOpen(false)}
        pbqs={PBQ_LIST}
        scores={evaluations}
        flaggedIds={flaggedIds}
        onReviewPBQ={(idx) => setCurrentPbqIndex(idx)}
        onRestartExam={handleRestartFullExam}
        onStartMiniDrill={handleStartMiniDrill}
      />

      {/* CompTIA Cheat Sheet & Critical Ports Modal */}
      <CompTIACheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
}
