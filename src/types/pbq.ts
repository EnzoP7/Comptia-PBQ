/**
 * CompTIA Security+ (SY0-701) PBQ Data Types and Interfaces
 * Covers every SY0-701 domain; see src/data/sy0701Objectives.ts.
 */

export type PBQCategory =
  | 'network-diagram'
  | 'firewall-acl'
  | 'log-siem'
  | 'endpoint-hardening'
  | 'iam-permissions'
  | 'cryptography-vpn'
  | 'wireless-security'
  | 'vulnerability-management'
  | 'dlp-data-protection'
  | 'incident-response'
  | 'container-security'
  | 'physical-security'
  | 'disaster-recovery'
  | 'social-engineering'
  | 'digital-forensics'
  | 'risk-management'
  | 'email-security'
  | 'security-cli'
  | 'ids-yara-rules'
  | 'devsecops-pipeline'
  | 'crypto-attacks'
  | 'identity-federation'
  | 'mobile-security'
  | 'port-security'
  | 'nmap-recon'
  | 'dns-security'
  | 'zero-trust'
  | 'web-hardening'
  | 'forensic-hold'
  | 'wireless-hardening'
  | 'cloud-dlp'
  | 'cloud-shared-responsibility'
  | 'mitre-threat-hunting'
  | 'data-governance'
  | 'privacy-pets'
  | 'malware-triage'
  | 'api-security'
  | 'soar-automation'
  | 'security-controls'
  | 'change-management'
  | 'third-party-governance'
  | 'pentest-audit'
  | 'app-attacks'
  | 'threat-actors'
  | 'access-control-models'
  | 'risk-concepts'
  | 'compliance-awareness'
  | 'linux-permissions'
  | 'crypto-concepts';

export interface PartialCreditItem {
  id: string;
  label: string;
  achieved: boolean;
  points: number;
  maxPoints: number;
  explanation: string;
}

export interface EvaluationResult {
  totalScore: number; // 0 - 100
  passed: boolean;
  partialCreditBreakdown: PartialCreditItem[];
  detailedFeedback: string;
  sy0701Objective: string;
  domainName: string;
}

export interface PBQItem {
  id: string;
  number: number;
  category: PBQCategory;
  categoryTitle: string;
  title: string;
  estimatedMinutes: number;
  domain: string;
  sy0701Objective: string;
  scenario: string;
  requirements: string[];
  tacticalTip: string;
}

// Category 1 & 8: Network Diagram Types
export type NetworkControlId = string;

export interface NetworkControlItem {
  id: NetworkControlId;
  name: string;
  acronym: string;
  layer: string;
  description: string;
  iconType: string;
}

export interface NetworkZoneSlot {
  slotId: string;
  zone: string;
  title: string;
  currentPlacedId: NetworkControlId | null;
  allowedRoleHint: string;
}

// Category 2 & 9: Firewall Rule Types
export type RuleAction = 'PERMIT' | 'DENY';
export type RuleProtocol = 'TCP' | 'UDP' | 'ICMP' | 'ANY';

export interface FirewallRule {
  id: string;
  ruleNumber: number;
  action: RuleAction;
  protocol: RuleProtocol;
  sourceIp: string;
  sourcePort: string;
  destIp: string;
  destPort: string;
  description: string;
  enabled: boolean;
}

export interface FirewallPacketTest {
  id: string;
  name: string;
  sourceIp: string;
  protocol: RuleProtocol;
  destIp: string;
  destPort: string;
  expectedAction: RuleAction;
  description: string;
}

// Category 3 & 10: SIEM Log Types
export interface SiemLogEntry {
  id: string;
  timestamp: string;
  source: 'Syslog' | 'Apache' | 'WinEvent' | 'Firewall' | 'EmailGateway' | 'Proxy';
  level: 'INFO' | 'WARN' | 'ALERT' | 'ERROR';
  sourceIp: string;
  destIp: string;
  eventSummary: string;
  rawPayload: string;
}

export interface SiemAnswers {
  patientZeroIp: string;
  initialAttackVector: string;
  initialCompromiseTimestamp: string;
  immediateContainmentAction: string;
}

export interface SiemQuestionOption {
  value: string;
  label: string;
}

export interface SiemQuestionsConfig {
  q1Label: string;
  q1Options: SiemQuestionOption[];
  q2Label: string;
  q2Options: SiemQuestionOption[];
  q3Label: string;
  q3Options: SiemQuestionOption[];
  q4Label: string;
  q4Options: SiemQuestionOption[];
}

// Category 4 & 11: Endpoint Hardening Types
export interface ServiceItem {
  id: string;
  name: string;
  port: number;
  protocol: string;
  currentStatus: 'running' | 'stopped';
  targetStatus: 'running' | 'stopped';
  description: string;
  isVulnerable: boolean;
}

export interface SecurityPolicyItem {
  id: string;
  name: string;
  type: 'toggle' | 'number_slider' | 'select';
  currentValue: any;
  targetValue: any;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: any; label: string }[];
  description: string;
}

// Category 5: IAM & Permissions Types
export interface FolderAclEntry {
  principalName: string;
  type: 'user' | 'group';
  read: boolean;
  write: boolean;
  modify: boolean;
  fullControl: boolean;
  inherited: boolean;
}

export interface FolderPermissionNode {
  path: string;
  name: string;
  inheritanceEnabled: boolean;
  currentAcl: FolderAclEntry[];
  description: string;
}

export interface IamUserGroupConfig {
  username: string;
  role: string;
  assignedGroups: string[];
}

// Category 12: Conditional Access & Zero Trust
export interface ConditionalAccessState {
  requireMfa: string;
  geoBlockingPolicy: string;
  deviceCompliance: string;
  adminJustInTime: string;
  riskBasedAuth: string;
}

// Category 6: Cryptography & VPN Types
export interface CryptoConfigState {
  ikeVersion: string;
  dhGroup: string;
  ikeEncryption: string;
  ikeHash: string;
  ipsecProtocol: string;
  ipsecCipher: string;
  ipsecPfs: boolean;
  storageCipher: string;
  webTlsVersion: string;
}

// Category 13: PKI Certificate Chain Types
export interface PkiCertConfigState {
  certificateType: string;
  issuerAuthority: string;
  signatureAlgorithm: string;
  intermediateIncluded: boolean;
  revocationCheckMethod: string;
  sanDomains: string;
  keyUsage: string;
}

// Category 7: Wireless Security Types
export interface WirelessApConfigState {
  ssidName: string;
  broadcastSsid: boolean;
  securityMode: string;
  cipherSuite: string;
  radiusIp: string;
  radiusPort: number;
  radiusSecret: string;
  clientIsolation: boolean;
  wpsEnabled: boolean;
  pmfRequired: boolean;
  frequencyBand: string;
}

// Category 14: Wireless WIPS & Rogue AP
export interface WipsRogueApConfigState {
  detectedBssid: string;
  threatClassification: string;
  switchPortAction: string;
  wirelessContainment: boolean;
  clientAuthProtocol: string;
  certificateValidationEnforced: boolean;
}

// Category 15: Vulnerability Management (Nessus / OpenVAS Report)
export interface VulnerabilityFinding {
  id: string;
  cveId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  port: string;
  host: string;
  description: string;
  selectedRemediation: string;
  remediationOptions: { value: string; label: string }[];
}

// Category 16: DLP & Data Lifecycle
export interface DlpPolicyItem {
  id: string;
  dataType: string;
  categoryName: string;
  dataState: 'In-Transit' | 'At-Rest' | 'In-Use';
  description: string;
  selectedControl: string;
  controlOptions: { value: string; label: string }[];
}

// Category 17: Incident Response Playbook Lifecycle
export interface IncidentResponseActionItem {
  id: string;
  actionText: string;
  assignedPhase: string;
}

// Category 18: Container & Kubernetes Hardening
export interface ContainerHardeningState {
  baseImage: string;
  runAsUser: string;
  secretsManagement: string;
  networkPolicy: string;
  rootFilesystem: string;
  cpuMemoryLimits: string;
}

// Category 19: Physical Security & Datacenter Design
export interface PhysicalSecurityState {
  perimeterBarrier: string;
  datacenterEntrance: string;
  fireSuppression: string;
  thermalManagement: string;
  rfShielding: string;
}

// Category 20: Disaster Recovery & Continuity
export interface DisasterRecoveryState {
  backupRule: string;
  targetRto: string;
  targetRpo: string;
  recoverySiteType: string;
  immutabilityControl: string;
}

// Category 21: Social Engineering & Human Factors
export interface SocialEngineeringCase {
  id: string;
  title: string;
  scenarioText: string;
  selectedAttackType: string;
  selectedInfluencePrinciple: string;
  selectedMitigation: string;
}

// Category 22: Digital Forensics & Order of Volatility (RFC 3227)
export interface ForensicEvidenceItem {
  id: string;
  name: string;
  description: string;
  currentOrder: number; // 1 to 6
  targetOrder: number;
}

export interface ForensicVerificationState {
  evidenceItems: ForensicEvidenceItem[];
  selectedHashAlgorithm: string;
  chainOfCustodySignoff: boolean;
  writeBlockerUsed: boolean;
}

// Category 23: Quantitative Risk Assessment & Treatment
export interface RiskManagementState {
  assetValue: number; // e.g. 200000
  exposureFactorPercent: number; // e.g. 40
  aroValue: number; // e.g. 0.5
  calculatedSleInput: number; // user input for SLE
  calculatedAleInput: number; // user input for ALE
  treatmentThreat1: string; // Mitigate
  treatmentThreat2: string; // Transfer
  treatmentThreat3: string; // Accept
  treatmentThreat4: string; // Avoid
}

// Category 24: Email Security (SPF, DKIM, DMARC, STARTTLS & S/MIME)
export interface EmailSecurityState {
  spfPolicy: string; // 'spf_hard_fail_dash_all'
  dkimSelector: string; // 'dkim_rsa_sha256_public_key'
  dmarcAction: string; // 'dmarc_reject_aggregate_rua'
  mailTransportEncryption: string; // 'starttls_port_587'
  endUserMailCrypto: string; // 'smime_x509_certificates'
}

// Category 25: Security CLI & Terminal Diagnostics
export interface SecurityCliScenario {
  id: string;
  investigationGoal: string;
  systemType: 'Linux' | 'Windows';
  detectedSymptom: string;
  selectedCommand: string;
  expectedOutputHint: string;
}

// Category 26: IDS/IPS & YARA Rule Engineering
export interface IdsYaraState {
  snortAction: string; // 'alert' or 'drop'
  snortProtocol: string; // 'tcp'
  snortContentMatch: string; // 'UNION SELECT'
  snortNocase: boolean; // true
  yaraMagicHeader: string; // '0x5A4D' (MZ PE header)
  yaraStringMatch: string; // '$malware_str'
}

// Category 27: DevSecOps CI/CD Pipeline
export interface DevSecOpsState {
  codeCommitControl: string; // Pre-commit hook & Secret Scanning (TruffleHog / GitGuardian)
  buildStageControl: string; // SAST (SonarQube) & SCA / SBOM (Snyk)
  testStageControl: string; // DAST (OWASP ZAP) & IAST
  deployStageControl: string; // Container Image Signature (Cosign) & RASP
}

// Category 28: Cryptographic Attacks & Countermeasures
export interface CryptoAttackCase {
  id: string;
  attackName: string;
  symptomText: string;
  selectedAttackType: string;
  selectedCountermeasure: string;
}

// Category 29: Federated Identity, SSO & Tokens
export interface FederationState {
  enterpriseSsoProtocol: string; // SAML 2.0 (XML Assertion)
  apiAuthorizationProtocol: string; // OAuth 2.0 (Bearer Token)
  modernMobileAuthProtocol: string; // OpenID Connect / OIDC (JWT ID Token)
  automatedProvisioningProtocol: string; // SCIM (System for Cross-domain Identity Management)
}

// Category 30: Mobile Security & MDM/MAM Policies
export interface MobileSecurityState {
  byodWipePolicy: string; // Enterprise Selective Wipe (solo datos corporativos)
  applicationContainerization: string; // MAM (Mobile Application Management)
  jailbreakRootPolicy: string; // Block access & Quarantine device
  geofencingPolicy: string; // Disable camera & mics inside restricted geofence
}

// Category 31: Port Security & Protocol Hardening (CompTIA Port Mastery)
export interface PortAuditItem {
  id: string;
  serviceName: string;
  legacyPort: number;
  legacyProtocol: string;
  vulnerabilityDescription: string;
  selectedInsecurityReason: string;
  selectedSecurePort: number | null;
  selectedSecureProtocol: string;
  selectedRemediationAction: string;
}

// Category 32: Nmap Port Scanning & Reconnaissance Analysis
export interface NmapFindingItem {
  id: string;
  portSpec: string;
  serviceBanner: string;
  discoveredRisk: string;
  selectedAnalysis: string;
  selectedRemediation: string;
}

export interface NmapScanState {
  scanFlagAnswer: string; // e.g. 'sS' (SYN Stealth Scan)
  portFindings: NmapFindingItem[];
}

// Category 33: DNS Security, DoT/DoH & DNSSEC Hardening
export interface DnsSecurityState {
  dnssecRecordType: string; // 'RRSIG' (Firma criptográfica de registros)
  dnsEncryptionStandard: string; // 'DoT_853' (DNS over TLS en puerto 853) o DoH 443
  zoneTransferRestriction: string; // 'restrict_tcp_53_authorized_secondaries'
  openRecursionMitigation: string; // 'disable_open_recursion_internal_only'
}

// Category 34: Zero Trust Architecture (ZTA) & Microsegmentation (NIST SP 800-207)
export interface ZeroTrustState {
  policyDecisionEngine: string; // 'pdp_pe_continuous' (Policy Decision Point / Policy Engine)
  policyEnforcementLocation: string; // 'pep_edge_microperimeter' (Policy Enforcement Point)
  networkTrafficControl: string; // 'microsegmentation_least_privilege' (Microsegmentación East-West)
  continuousTrustEvaluation: string; // 'continuous_adaptive_risk_validation'
}

// Category 35: Web Server Hardening & HTTP Security Headers
export interface WebServerHardeningState {
  hstsHeaderConfig: string; // 'hsts_max_age_includesubdomains_preload'
  cspHeaderConfig: string; // 'csp_default_src_self_nonce'
  frameOptionsConfig: string; // 'x_frame_options_deny'
  tlsProtocolVersion: string; // 'tls_1_3_only'
}

// ==========================================
// Item Explanation & Solution Breakdown Types
// ==========================================
export interface ItemExplanation {
  name: string;
  badge?: string; // e.g. 'Capa 7', 'Puerto 22', 'Fase 2', 'NIST 800-207'
  definition: string; // Qué es este componente o concepto según CompTIA SY0-701
  whyCorrectOrRole: string; // Por qué es la respuesta correcta en este escenario
  distractorWarning?: string; // Trampa común o por qué sería incorrecto ubicarlo en otro lugar
}

export interface PBQExplanationData {
  pbqId: string;
  overviewRationale: string;
  keyTakeaways: string[];
  itemsGlossary: ItemExplanation[];
}

// Category 36: Forensic Legal Hold & Evidence Chain of Custody
export interface ForensicHoldState {
  phase1: string; // legal_hold_notice
  phase2: string; // chain_of_custody_log
  phase3: string; // write_blocker_bitstream_image
  phase4: string; // cryptographic_hash_sha256
  phase5: string; // isolated_forensic_analysis
  phase6: string; // secure_vault_storage
  volatilityConcept: string; // ram_before_disk
  admissibilityStandard: string; // best_evidence_rule
}

// Category 37: PKI Lifecycle, OCSP Stapling, X.509 Formats & Key Escrow
export interface PkiLifecycleState {
  revocationProtocol: string; // 'ocsp_stapling'
  certFormatBundle: string; // 'pfx_pkcs12_password'
  certFormatAscii: string; // 'pem_base64_ascii'
  subjectAltNameConfig: string; // 'san_multi_domain'
  privateKeyRecovery: string; // 'key_escrow_m_of_n'
}

// Category 38: Wireless WPA3-Enterprise, 802.1X & WIPS
export interface WirelessSecurityState {
  wpaStandard: string; // wpa3_enterprise_192bit
  eapMethod: string; // eap_tls_mutual_certificates
  radiusPorts: string; // radius_1812_1813
  wpaPersonalHandshake: string; // sae_dragonfly
  rogueApDetection: string; // wips_rf_monitoring_auto_suppress
}

// Category 39: Cloud Storage DLP & CASB Data Classification
export interface CloudDlpBucketItem {
  id: string;
  bucketName: string;
  contentsDescription: string;
  assignedTier: string; // 'public' | 'internal' | 'confidential' | 'restricted_pii'
  dlpPattern: string; // 'none' | 'pci_dss_credit_card' | 'ssn_pii' | 'api_secrets'
}

export interface CloudDlpState {
  buckets: CloudDlpBucketItem[];
  casbInspectionMode: string; // casb_reverse_proxy_inline
  cloudKeyManagement: string; // customer_managed_hsm_kms
}

// Category 40: Social Engineering Attacks, Psychological Triggers & Defenses
export interface SocialEngAttackItem {
  id: string;
  techniqueName: string;
  scenarioText: string;
  identifiedTrigger: string; // 'authority' | 'urgency' | 'scarcity' | 'consensus' | 'familiarity' | 'intimidation'
  primaryDefense: string; // 'security_awareness_training' | 'dmarc_out_of_band' | 'disable_usb_mass_storage' | 'anti_vishing_call_back'
}

export interface SocialEngState {
  cases: SocialEngAttackItem[];
}

// Category 41: Cloud Shared Responsibility Model (IaaS, PaaS, SaaS)
export type CloudParty = 'customer' | 'csp' | 'shared';

export interface CloudLayerResponsibility {
  layerId: string;
  layerName: string;
  description: string;
  iaasParty: CloudParty | '';
  paasParty: CloudParty | '';
  saasParty: CloudParty | '';
}

export interface CloudSharedResponsibilityState {
  layers: CloudLayerResponsibility[];
}

// Category 42: MITRE ATT&CK Threat Hunting, Windows Events & Active Directory
export interface MitreThreatHuntingItem {
  id: string;
  techniqueName: string;
  mitreCode: string; // 'T1003' | 'T1058' | 'T1558.001' | 'T1557.001' | 'T1059.001'
  telemetrySource: string; // 'event_4769_rc4' | 'event_4624_type9_lsass' | 'event_4768_forged_tgt' | 'event_4625_responder' | 'event_4104_scriptblock'
  remediationControl: string; // 'credential_guard_lsa' | 'gmsa_aes256' | 'krbtgt_double_reset' | 'disable_llmnr_smb_signing' | 'clm_wdac_applocker'
}

export interface MitreThreatHuntingState {
  scenarios: MitreThreatHuntingItem[];
}

// Category 43: Data Governance, Roles, Lifecycle & Sanitization
export interface DataGovernanceState {
  // Roles
  ownerRoleAssignment: string; // 'data_owner'
  stewardRoleAssignment: string; // 'data_steward'
  custodianRoleAssignment: string; // 'data_custodian'
  privacyOfficerAssignment: string; // 'data_privacy_officer'
  // Data States
  inTransitProtection: string; // 'tls_13_ipsec'
  atRestProtection: string; // 'aes_256_bitlocker'
  inUseProtection: string; // 'confidential_computing_enclaves'
  // Sanitization Methods
  clearingMethod: string; // 'logical_overwrite_zero_fill'
  purgingMethod: string; // 'degaussing_magnetic'
  destructionMethod: string; // 'physical_shredding_incineration'
  cryptoShreddingMethod: string; // 'cryptographic_erasure_key_destruction'
}

// Category 44: Privacy Enhancing Technologies (PETs) & Data Obfuscation
export interface PrivacyPetScenario {
  id: string;
  useCaseName: string;
  description: string;
  selectedTechnique: string; // 'tokenization' | 'dynamic_masking' | 'static_masking' | 'anonymization' | 'pseudonymization'
  reversibility: string; // 'reversible_with_vault' | 'reversible_with_key' | 'irreversible' | 'on_the_fly_display'
}

export interface PrivacyPetsState {
  scenarios: PrivacyPetScenario[];
}

// Category 45 & 46: Comprehensive Malware Classification, Indicators of Compromise & Remediation
export interface MalwareScenarioItem {
  id: string;
  scenarioTitle: string;
  observedIndicators: string;
  technicalTelemetry: string;
  selectedMalwareType: string;
  selectedRemediation: string;
}

export interface MalwareTriageState {
  scenarios: MalwareScenarioItem[];
}

// Category 47: Secure Software Development & OWASP API Top 10
export interface ApiSecurityScenarioItem {
  id: string;
  endpointTitle: string;
  httpPayloadOrCode: string;
  identifiedVulnerability: string;
  secureRemediation: string;
}

export interface ApiSecurityState {
  scenarios: ApiSecurityScenarioItem[];
}

// Category 48: SIEM Correlation Rules & SOAR Playbook Automation
export interface SoarPlaybookScenarioItem {
  id: string;
  incidentTitle: string;
  siemLogPattern: string;
  correlationTrigger: string;
  automatedSoarAction: string;
}

export interface SoarAutomationState {
  scenarios: SoarPlaybookScenarioItem[];
}








// ==========================================
// Generic classification matrix PBQs (drag-and-drop style)
// ==========================================
export interface MatrixOption {
  value: string;
  label: string;
}

export interface MatrixColumn {
  id: string;
  label: string;
  options: MatrixOption[];
}

export interface MatrixRow {
  id: string;
  prompt: string;
  /** Optional log line, payload or code snippet shown in monospace. */
  evidence?: string;
  /** Correct option value per column id. */
  answers: Record<string, string>;
  /** Shown after grading: why this is the answer and the usual exam trap. */
  explanation: string;
}

export interface MatrixSection {
  id: string;
  title: string;
  columns: MatrixColumn[];
  rows: MatrixRow[];
}

export interface MatrixPbqConfig {
  pbqId: string;
  consoleTitle: string;
  instructions: string;
  sections: MatrixSection[];
}

/** rowId -> columnId -> selected option value */
export type MatrixAnswers = Record<string, Record<string, string>>;

// ==========================================
// Linux file permissions (chmod / chown / umask / special bits)
// ==========================================
export interface LinuxPermFile {
  id: string;
  path: string;
  isDirectory: boolean;
  owner: string;
  group: string;
  /** Business requirement shown to the candidate. */
  requirement: string;
  /** Current mode, e.g. 0o755. */
  mode: number;
}

export interface LinuxPermissionsState {
  files: LinuxPermFile[];
  /** questionId -> selected option value */
  answers: Record<string, string>;
}
