<div align="center">

<a href="https://comptia-pbq.vercel.app/"><img src="docs/images/banner.png" alt="Security+ SY0-701 PBQ Simulator" width="100%" /></a>

# Security+ SY0-701 PBQ Simulator

**Free, hands-on practice for the performance-based questions of the CompTIA Security+ SY0-701 exam, in English or Spanish.**<br />
Interactive scenarios, criterion-by-criterion grading and timed mock exams that feel like exam day.

<a href="https://comptia-pbq.vercel.app/"><img src="https://img.shields.io/badge/%E2%96%B6%20Practice%20now-online-c8102e?style=for-the-badge" alt="Practice now" /></a>

**No need to clone anything: use it online at [comptia-pbq.vercel.app](https://comptia-pbq.vercel.app).** Nothing to install, no account.

![PBQs](https://img.shields.io/badge/PBQs-96-1f2937?style=flat-square)
![Domains](https://img.shields.io/badge/domains-5%2F5-1f2937?style=flat-square)
![Exam](https://img.shields.io/badge/exam-SY0--701-c8102e?style=flat-square)
![Languages](https://img.shields.io/badge/languages-English%20%7C%20Espa%C3%B1ol-1f2937?style=flat-square)
![Price](https://img.shields.io/badge/price-free-1f2937?style=flat-square)
![License](https://img.shields.io/badge/no%20account-required-1f2937?style=flat-square)

</div>

---

> **Just studying?** Open the simulator at **[comptia-pbq.vercel.app](https://comptia-pbq.vercel.app)**, or jump to the [free study material](#free-study-material) below: ports, the most commonly confused concepts and exam-day strategy, readable right here.

## Why practice PBQs?

**Performance-based questions (PBQs)** are the hands-on items of the Security+ exam. Instead of picking an answer, you **do** something: order firewall rules, place controls on a network diagram, read SIEM logs, assign permissions or match attacks to evidence. They usually come first, take the most time, and are where unprepared candidates lose the most points.

This simulator contains **96 original PBQs** covering all five domains and all 28 SY0-701 objectives (every objective is the primary target of at least one PBQ), using the same mechanics you will meet on the exam.

<p align="center"><img src="docs/images/app-practice.png" alt="Practice view: firewall rule table" width="90%" /></p>

## Highlights

| | |
|---|---|
| **Partial-credit grading** | Every criterion scores on its own; 75% passes. You see what you chose, the right answer, why, and the classic exam trap. |
| **Exam-like difficulty** | Each PBQ is labeled *Basic*, *Intermediate* or *Advanced*, calibrated against what SY0-701 candidates report. |
| **Timed mock exams** | 3, 5, 8 or 12 PBQs drawn by official domain weight, with an option to prioritize your weak spots. No hints, no pause. |
| **Trap review** | 100+ spaced-repetition flashcards for the concept pairs candidates confuse most. |
| **Bilingual** | Every scenario, option, terminal message and explanation is available in English and Spanish. |
| **Exam-room design** | A light screen like exam day, or a charcoal theme for night study, switched with the sun/moon button. |
| **Private by design** | No accounts. Answers, notes, flags and history stay in your browser. |

## How it works

### 1. Free practice
Pick any PBQ from the top bar (filter by domain, by difficulty, by the ones you have not done or by the ones you failed), solve it, and press **Submit and Validate**. Grading uses **partial credit**: every criterion adds points and 75% passes.

### 2. Grading that teaches
After validating you see, **criterion by criterion**:
- **what you chose and what the right answer was**;
- **why** that answer is right in this scenario;
- the **concepts** to master, with their definition and the **typical exam trap**;
- a **"What to review"** block with your mistakes, plus a **study guide** for every PBQ.

<p align="center"><img src="docs/images/app-review.png" alt="Criterion-by-criterion grading with concepts and exam traps" width="90%" /></p>

### 3. Difficulty that matches the real exam
Each PBQ shows its level. **Basic** and **Intermediate** match what SY0-701 candidates report: two to five short PBQs (firewall rules, spotting attacks or compromised hosts in logs, matching concepts, configuring a VPN or a certificate). **Advanced** goes beyond the exam (free-form terminal, many zones or services at once) and is meant for reinforcement. Mock exams use only Basic and Intermediate PBQs by default.

PBQs labeled **Extra: may not appear** (25, 32, 42, 60, 62, 63, 64 and 76) cover topics that are not in the SY0-701 objectives: command-line work, Nmap, `chmod` and Active Directory attacks. The SY0-701 dropped the list of command-line tools the SY0-601 had. They sit at the end of the list for a general look and are left out of the exam-like mock exam.

### 4. Hints off by default
The real exam has no help, so neither does this simulator unless you turn it on. **Hints** enables compliance meters, per-option explanations, the firewall traffic simulator and a tactical tip. Use them to learn, not to measure yourself.

### 5. Timed mock exam
Choose **how many PBQs** (3, 5, 8 or 12) and **how many minutes per PBQ**. Questions are drawn at random following the **official domain weights**, and you can **prioritize your weak spots** (PBQs you never tried or scored lowest on). During the mock exam there are no hints, cheat sheet, pause or grading: everything is scored when you finish or when time runs out. Afterwards you can review every PBQ.

<p align="center"><img src="docs/images/app-exam-setup.png" alt="Timed mock exam setup" width="80%" /></p>

### 6. Trap review
More than 100 flashcards with the concept pairs most often confused on the exam (PEP vs. policy engine, reflected vs. amplified DDoS, journaling vs. replication, risk tolerance vs. threshold…). You choose between two options, and the app shows the keyword that tells them apart and the PBQ where you can practice it. Cards use spaced repetition: misses come back in the same round and the next day; correct answers are spaced out up to 30 days. Open it with the **Trap review** button or <kbd>Alt</kbd> + <kbd>T</kbd>.

### 7. Your progress stays private
No accounts, no sign-up. Answers, notes, flags and attempt history are stored **only in your browser**. The progress report shows your performance per official domain.

## PBQ formats

| Format | Examples |
|---|---|
| **Firewall rules / ACLs** | Drag actions, protocols, IPs and ports into each rule (or tap and place on mobile), order *first-match* rules, egress filtering, multi-zone DMZ. Graded by sending real test packets through your rule table. |
| **Network diagrams** | Place a WAF, IPS, bastion host, RADIUS, ZTNA or transit gateway. |
| **Log and SIEM analysis** | Patient zero, timelines, beaconing C2, compromised hosts from network logs. |
| **Configuration** | WPA3-Enterprise Wi-Fi, IPsec VPN, PKI and certificates, SPF/DKIM/DMARC, HTTP headers, containers, MDM. |
| **Classification (drag and drop)** | Control categories and types, application attacks from logs, threat actors, third-party agreements, penetration testing, risk and BIA, data roles, governance structures. |
| **Ordering and calculation** | Incident response lifecycle, order of volatility, SLE/ALE with different values on every attempt. |
| **Interactive Linux terminal** *(extra)* | A simulated console: investigate `auth.log`, `ps aux`, `ss -tunap` and `crontab`; block with `iptables`/`ufw`; fix permissions and SUID with `find`/`chmod`; verify integrity with `sha256sum`; analyze logs with `grep \| sort \| uniq -c`. Graded by the final state of the server. |

<p align="center"><img src="docs/images/app-terminal.png" alt="PBQ with an interactive Linux terminal" width="90%" /></p>

## PBQ catalog by domain

<details>
<summary><b>Domain 1: General Security Concepts</b> — 12% of the exam · 11 PBQs</summary>

| # | PBQ | Objective |
|---|---|---|
| 6 | Site-to-Site IPSec Connection and Data-at-Rest Encryption | 1.4 |
| 13 | Diagnosing PKI Certificate Chain and Web TLS Errors | 1.4 |
| 19 | Physical Security Design and Data Center Protection | 1.2 |
| 34 | Implementing Zero Trust Architecture (ZTA) per NIST SP 800-207 | 1.2 |
| 37 | PKI Lifecycle Management, X.509 Formats (.PFX/.PEM), OCSP Stapling and Key Escrow | 1.4 |
| 51 | Security Control Classification: Category × Type | 1.1 |
| 52 | Change Management Process: Business Elements and Technical Implications | 1.3 |
| 61 | Hashing, Salting, Key Stretching, Digital Signatures and Key Protection | 1.4 |
| 71 | Digital Certificates and PKI: Wildcard, SAN, CSR and Revocation | 1.4 |
| 78 | Zero Trust: Control Plane, Data Plane, PEP and Deception Technologies | 1.2 |
| 79 | Encryption Levels, Algorithms and Key Tools | 1.4 |

</details>

<details>
<summary><b>Domain 2: Threats, Vulnerabilities, and Mitigations</b> — 22% of the exam · 17 PBQs</summary>

| # | PBQ | Objective |
|---|---|---|
| 4 | Web Server Hardening and Security Baselines | 2.5 |
| 11 | Workstation Hardening (VBA, Credential Guard & LLMNR) | 2.5 |
| 14 | Detecting and Mitigating Rogue APs and Evil Twin Attacks (WIPS) | 2.4 |
| 21 | Identifying Social Engineering Vectors and Human Factors | 2.2 |
| 28 | Identifying Cryptographic Attacks and Selecting Countermeasures | 2.4 |
| 40 | Matrix of Social Engineering Attacks, Psychological Triggers and Defenses | 2.2 |
| 42 | Investigating Active Directory Attacks, SIEM Telemetry and MITRE ATT&CK *(extra)* | 2.4 |
| 45 | Malware Triage: Endpoint Threats, Cryptography and In-Memory Persistence | 2.4 |
| 46 | Malware Triage: Network Threats, Dormant Code and Polymorphic Evasion | 2.4 |
| 47 | REST API Security Audit: BOLA, SSRF, JWT Tampering and Rate Limiting | 2.3 |
| 55 | Identifying Application Attacks from Logs and Payloads | 2.3 |
| 56 | Profiling Threat Actors, Motivations and Deception Technologies | 2.1 |
| 63 | Linux Terminal: Hardening, SUID and Binary Integrity Audit *(extra)* | 2.5 |
| 80 | Threat Vectors and Vulnerability Types | 2.2 |
| 81 | Indicators of Malicious Activity: Telling Similar Attacks Apart | 2.4 |
| 92 | Log Indicators and Remaining SY0-701 Topics | 2.4 |
| 94 | Identify the Malware Type and Choose the Remediation | 2.4 |

</details>

<details>
<summary><b>Domain 3: Security Architecture</b> — 18% of the exam · 15 PBQs</summary>

| # | PBQ | Objective |
|---|---|---|
| 1 | Secure Perimeter Design and Micro-Segmentation | 3.2 |
| 8 | Hybrid Cloud Architecture (AWS/Azure) and Zero Trust Ingress | 3.1 |
| 16 | Classifying Sensitive Information and DLP Controls in 3 States | 3.3 |
| 18 | Hardening Docker Containers and Kubernetes Pods | 3.1 |
| 20 | Business Continuity, RTO/RPO Calculation and Resilience | 3.4 |
| 39 | Data Classification in Cloud Storage, DLP Regex Rules and Inline CASB | 3.3 |
| 41 | Cloud Shared Responsibility Matrix (IaaS vs PaaS vs SaaS) | 3.1 |
| 44 | Data Obfuscation Techniques, PETs and Reversibility Levels | 3.3 |
| 49 | Multi-Interface Traffic Filtering: WAN, Public DMZ, Internal LAN and PCI-DSS Database | 3.2 |
| 68 | Remote Access VPN: Full Tunnel, Split Tunnel and Site-to-Site | 3.2 |
| 83 | Network Appliances and Attributes: Proxy, NGFW, WAF, IDS, Inline and Fail-Open | 3.2 |
| 84 | Architecture Models and Their Security Considerations | 3.1 |
| 85 | Backups, Replication, Journaling and Resilience Testing | 3.4 |
| 95 | IPsec: AH vs ESP and Tunnel Mode vs Transport Mode | 3.2 |
| 96 | High Availability and Power: UPS, Generator, Load Balancing and Clustering | 3.4 |

</details>

<details>
<summary><b>Domain 4: Security Operations</b> — 28% of the exam · 40 PBQs</summary>

| # | PBQ | Objective |
|---|---|---|
| 2 | Corporate Firewall Rule Hardening | 4.5 |
| 3 | Patient Zero and Attack Chain Investigation | 4.9 |
| 5 | Resolving a File Share Permission Conflict | 4.6 |
| 7 | Corporate WPA3 Enterprise Wi-Fi Deployment | 4.1 |
| 9 | Data Exfiltration Mitigation and Egress Filtering | 4.5 |
| 10 | Investigating Phishing, C2 Beaconing and a Kerberos Attack | 4.9 |
| 12 | Conditional Access Policies and Zero Trust | 4.6 |
| 15 | CVSS v3.1 Vulnerability Prioritization and Tactical Remediation | 4.3 |
| 17 | NIST Incident Response Lifecycle Sequence | 4.8 |
| 22 | Forensic Order of Volatility (RFC 3227) and Integrity Verification | 4.8 |
| 24 | Email Defense: SPF, DKIM and DMARC DNS Records | 4.5 |
| 25 | Tactical Threat Diagnosis with Console Commands (Linux / Windows) *(extra)* | 4.9 |
| 26 | Detection Engineering: Snort NIPS Rules and YARA Rules for Malware | 4.5 |
| 27 | Shift-Left Security Integration in the CI/CD Pipeline | 4.1 |
| 29 | Federated Authentication Architecture, Tokens and Single Sign-On (SSO) | 4.6 |
| 30 | Enterprise Mobile Device Policy Console (MDM / MAM / BYOD) | 4.1 |
| 31 | Plaintext Port Audit and Network Cryptographic Migration | 4.5 |
| 32 | Nmap Scan Interpretation and Tactical Hardening of Open Ports *(extra)* | 4.3 |
| 33 | DNS Infrastructure Hardening, DoT Encryption and Attack Mitigation | 4.5 |
| 35 | Web Application Hardening: Security Headers and TLS 1.3 | 4.1 |
| 36 | Legal Hold Procedure, Bit-by-Bit Acquisition and Admissibility | 4.8 |
| 38 | Corporate Wi-Fi Architecture: WPA3-Enterprise, 802.1X EAP-TLS and WIPS | 4.1 |
| 48 | SIEM Detection Engineering and Automated SOAR Playbooks | 4.7 |
| 50 | Infrastructure Hardening and Legacy Protocol Migration (SOC 2 / ISO 27001) | 4.5 |
| 57 | Access Control Models, Authentication Factors and PAM | 4.6 |
| 60 | Linux Permissions: rwx, Octal Notation, chown, umask and SUID/SGID/Sticky Bits *(extra)* | 4.6 |
| 62 | Linux Terminal: Incident Response on a Compromised Web Server *(extra)* | 4.8 |
| 64 | Linux Terminal: Web Log Analysis with Pipes and Attacker Blocking *(extra)* | 4.9 |
| 65 | Asset Lifecycle: Procurement, Inventory, Secure Disposal and Retention | 4.2 |
| 66 | Security Monitoring Tools and SOC Activities | 4.4 |
| 69 | Identifying Compromised Hosts from Network Logs | 4.9 |
| 70 | Secure Protocols and Their Ports | 4.5 |
| 75 | Write the Port: Services and Port Numbers by Scenario | 4.5 |
| 76 | Linux Terminal: Permissions with chmod and chown in Octal Notation *(extra)* | 4.6 |
| 77 | Office Firewall Rules: Published Servers, Administration and Browsing | 4.5 |
| 82 | Mitigation Techniques and Enterprise Security Capabilities | 4.5 |
| 86 | Automation, Orchestration and Change Management | 4.7 |
| 87 | Access Models, Authentication and Mobile Deployment Models | 4.6 |
| 88 | Incident Response, Forensics, Data Sources and Monitoring | 4.8 |
| 93 | EAP and Its Variants: EAP-TLS, PEAP, EAP-TTLS and EAP-FAST | 4.1 |

</details>

<details>
<summary><b>Domain 5: Security Program Management and Oversight</b> — 20% of the exam · 13 PBQs</summary>

| # | PBQ | Objective |
|---|---|---|
| 23 | Quantitative Risk Analysis (SLE, ARO, ALE Formulas) and Treatment | 5.2 |
| 43 | Data Governance, Custody Roles, Data States and Sanitization | 5.1 |
| 53 | Third-Party Agreements and Governance Document Hierarchy | 5.3 |
| 54 | Penetration Test Types, Reconnaissance and Audits | 5.5 |
| 58 | Risk Management Terminology and Business Impact Analysis (BIA) | 5.2 |
| 59 | Regulatory Compliance, Privacy and Awareness Program | 5.4 |
| 67 | Awareness Program: Training Topics and Program Lifecycle | 5.6 |
| 72 | Data Roles: Owner, Controller, Processor, Custodian, Steward and DPO | 5.1 |
| 73 | Governance Structures: Centralized, Decentralized, Board and Committees | 5.1 |
| 74 | Agreement Types (SLA, MOU, MOA, MSA, SOW, NDA, BPA) and Vendor Assessment | 5.3 |
| 89 | Risk Terminology and Vulnerability Management | 5.2 |
| 90 | Laws, Frameworks and Compliance Concepts | 5.1 |
| 91 | Vendors, Audits, Roles and Awareness | 5.3 |

</details>

## Free study material

Everything below is free and readable right here on GitHub, whether or not you use the simulator. Use it as a quick review before practicing or the night before the exam.

### Ports you are expected to know

| Port | Service | Port | Service |
|---|---|---|---|
| 20/21 | FTP (data / control) | 389 | LDAP |
| 22 | SSH, SFTP, SCP | 443 | HTTPS |
| 23 | Telnet (insecure) | 445 | SMB |
| 25 | SMTP | 514 | Syslog |
| 53 | DNS (UDP queries, TCP zone transfers) | 587 | SMTP submission (STARTTLS) |
| 67/68 | DHCP | 636 | LDAPS |
| 69 | TFTP | 853 | DNS over TLS |
| 80 | HTTP | 993 | IMAPS |
| 88 | Kerberos | 995 | POP3S |
| 110 | POP3 | 1433 | Microsoft SQL Server |
| 123 | NTP | 1812/1813 | RADIUS (authentication / accounting) |
| 143 | IMAP | 3306 | MySQL |
| 161/162 | SNMP (queries / traps) | 3389 | RDP |
| 500 | IKE (IPsec) | 5060/5061 | SIP / SIP over TLS |

### Commonly confused concepts

Most wrong answers on the exam are a neighboring concept, not a random one. These 111 pairs come from real practice-exam mistakes; each row gives the keyword that separates them. In the simulator they are flashcards with spaced repetition (**Trap review**, <kbd>Alt</kbd> + <kbd>T</kbd>).

<details>
<summary><b>Domain 1: General Security Concepts</b> · 16 pairs</summary>

| Objective | Right answer | Often confused with | How to tell them apart |
|---|---|---|---|
| 1.2 | Policy Enforcement Point (PEP) | Policy engine | The engine DECIDES; the PEP ENFORCES the decision on the traffic. |
| 1.2 | Policy engine | Policy Enforcement Point (PEP) | Deciding = policy engine (control plane). Enforcing = PEP. |
| 1.2 | Data plane | Control plane | Control = decides with policies. Data = moves the already-authorized traffic. |
| 1.2 | Honeyfile | Honeytoken | Decoy FILE = honeyfile. Fake DATA or credential = honeytoken. |
| 1.2 | Honeytoken | Honeyfile | A fake credential or record is a honeytoken, even if it sits inside a file. |
| 1.3 | Stakeholders | Change advisory board (CAB) | The CAB APPROVES; stakeholders are the AFFECTED people who get consulted. |
| 1.3 | Downtime | Maintenance window | The window is WHEN the change happens; downtime is the service being down. |
| 1.3 | Backout plan (rollback) | Impact analysis | Impact analysis happens BEFORE; rollback is the way out when the change already failed. |
| 1.4 | File-level encryption | Partition encryption | Choosing specific documents = file. Partition/volume encrypts EVERYTHING it contains. |
| 1.4 | Record-level encryption | Database encryption | Each row or field = record. The whole database as a unit = database. |
| 1.4 | Key management system (KMS) | HSM | KMS = manages the LIFECYCLE. HSM = hardware that stores and uses the keys. |
| 1.4 | HSM | TPM | HSM = dedicated external appliance. TPM = chip built into each computer. |
| 1.4 | ECC | Diffie-Hellman | Short, efficient keys = ECC. Diffie-Hellman is a key exchange method. |
| 1.4 | Stream cipher | Block cipher | Byte by byte = stream. Fixed-size blocks = block cipher (AES). |
| 1.4 | Recipient's public key | Your private key | Confidentiality = recipient's public key. Your private key is for SIGNING. |
| 1.4 | Certificate from a third-party CA | Wildcard certificate | Who SIGNS it (external CA) is not the same as how many names it COVERS (wildcard). |

</details>

<details>
<summary><b>Domain 2: Threats, Vulnerabilities, and Mitigations</b> · 25 pairs</summary>

| Objective | Right answer | Often confused with | How to tell them apart |
|---|---|---|---|
| 2.2 | File-based | Email | If they ask about the malicious OBJECT (document, executable) = file-based. |
| 2.2 | Removable device | File-based | The physical medium wins: USB = removable device, even if it contains files. |
| 2.2 | Instant messaging | SMS | Chat apps = instant messaging. SMS = the carrier's text message. |
| 2.2 | Business email compromise (BEC) | Pretexting | Payment fraud posing as an executive = BEC. Pretexting is only the invented story. |
| 2.2 | Impersonation | Vishing | If they ask about the TECHNIQUE (pretending to be someone) = impersonation. If they ask about the voice CHANNEL = vishing. |
| 2.2 | Wiretapping | On-path attack | PHYSICAL connection to the cable = wiretapping. On-path is the logical position in the middle. |
| 2.2 | Malicious peripheral | Bluejacking | A tampered peripheral attacks. Bluejacking only sends unsolicited messages. |
| 2.2 | Unsupported system | Vulnerable software | The vendor no longer updates it = unsupported (more specific than "vulnerable software"). |
| 2.3 | Misconfiguration | Data exposure | They ask for the CAUSE (the bad configuration), not the CONSEQUENCE (the leak). |
| 2.3 | Time-of-check (TOCTOU) | Buffer overflow | The window between CHECK and USE = TOCTOU (a type of race condition). |
| 2.3 | Virtual machine escape | Resource reuse | Breaking isolation = escape. Reading residual data from shared resources = reuse. |
| 2.3 | Firmware vulnerability | Sideloading | Software for the hardware = firmware. Sideloading = installing apps outside the official store. |
| 2.4 | Reflected DDoS | Amplified DDoS | Responses that BOUNCE off third parties toward the spoofed IP = reflected. |
| 2.4 | Amplified DDoS | Reflected DDoS | If the question stresses that the response is MUCH LARGER than the request = amplified. |
| 2.4 | Brute force | Password spraying | Many passwords → ONE account = brute force. |
| 2.4 | Password spraying | Brute force | ONE password → many accounts (horizontal) = spraying; it avoids lockouts. |
| 2.4 | CSRF | Session hijacking | The VICTIM'S BROWSER sends the request = CSRF. The attacker uses the stolen session = hijacking. |
| 2.4 | Code injection | Command injection | Code in the app's language = code injection. OS commands (; \| &&) = command injection. |
| 2.4 | On-path attack | MAC spoofing | ARP poisoning puts the attacker IN THE MIDDLE. MAC spoofing only changes one's own address. |
| 2.4 | Rootkit | Fileless malware | HIDES from the OS = rootkit. Lives in memory using legitimate tools = fileless. |
| 2.4 | Concurrent sessions | Impossible travel | AT THE SAME TIME = concurrent. |
| 2.4 | Impossible travel | Concurrent sessions | Two SUCCESSIVE logins made impossible by distance = impossible travel. |
| 2.5 | Isolation | Segmentation | Isolation = no communication. Segmentation = zones that keep communicating under rules. |
| 2.5 | Configuration enforcement | Least privilege | Locking the configuration = configuration enforcement. Least privilege limits permissions. |
| 2.5 | Network access control (NAC) | EDR | Controlling ENTRY to the network = NAC. EDR protects already-managed endpoints. |

</details>

<details>
<summary><b>Domain 3: Security Architecture</b> · 20 pairs</summary>

| Objective | Right answer | Often confused with | How to tell them apart |
|---|---|---|---|
| 3.2 | Proxy server | Load balancer | Intermediating and hiding = (reverse) proxy. Spreading load = load balancer. |
| 3.2 | WAF | IPS | Protecting a web app while there is no patch (virtual patching) = WAF. |
| 3.2 | Inline device | Tap / monitor mode | To block you must be IN the path. Tap/monitor only receives a copy. |
| 3.2 | IDS | IPS | Detects = IDS (passive). Blocks = IPS (inline). |
| 3.2 | Fail-closed | Fail-open | Prioritizes SECURITY on failure = fail-closed. |
| 3.2 | Fail-open | Fail-closed | Prioritizes AVAILABILITY on failure = fail-open. |
| 3.2 | EAP | RADIUS | EAP is the FRAMEWORK of methods; RADIUS is the AAA SERVER that uses it. |
| 3.2 | VPN | SD-WAN | Requirement of ENCRYPTED communication = VPN. SD-WAN optimizes and manages links. |
| 3.2 | Layer 7 firewall | Layer 4 firewall | Understanding the application = layer 7. Layer 4 only sees IPs and ports. |
| 3.1 | Serverless | Infrastructure as code (IaC) | Serverless = you do not manage infrastructure. IaC = you still manage it, but with code. |
| 3.1 | Consistency across all environments | Reducing manual work | Consistency is the core goal of IaC; saving work is secondary. |
| 3.4 | Replication | Journaling | Continuous copy to ANOTHER location = replication. |
| 3.4 | Journaling | Replication | History of EVERY CHANGE = journaling. Replication copies the state, not the history. |
| 3.4 | Failover | Clustering | Switching to the backup on failure = failover. Clustering = several nodes working at once. |
| 3.4 | Simulation | Tabletop exercise | EXECUTED in practice = simulation. Only DISCUSSED = tabletop. |
| 3.4 | Offsite backup | Onsite backup | Risk to the BUILDING = offsite. |
| 3.4 | Onsite backup | Offsite backup | Restore SPEED = onsite backup. |
| 3.4 | Continuous backup | Daily incremental backup | Near-zero RPO = continuous. A daily incremental could lose up to a day. |
| 3.4 | Full backup | Snapshot | A full backup restores on its own, without chains of changes. |
| 3.3 | Regulated data | Confidential data | Regulated = LEGAL obligation. Confidential = the company's internal decision. |

</details>

<details>
<summary><b>Domain 4: Security Operations</b> · 25 pairs</summary>

| Objective | Right answer | Often confused with | How to tell them apart |
|---|---|---|---|
| 4.7 | User provisioning | Resource provisioning | PEOPLE's accounts = users. |
| 4.7 | Resource provisioning | User provisioning | Servers, VMs, storage = resources. |
| 4.7 | Total cost of ownership (TCO) | Return on investment (ROI) | What it COSTS in total = TCO. What it RETURNS = ROI. |
| 4.7 | Technical debt | Single point of failure | Shortcuts paid for later = technical debt. |
| 4.6 | Rule-based | Attribute-based (ABAC) | One GLOBAL rule, the same for everyone = rule-based. Several user attributes = ABAC. |
| 4.6 | Attribute-based (ABAC) | Role-based (RBAC) | MANY combined characteristics = ABAC. Only the job title = RBAC. |
| 4.6 | Mandatory (MAC) | Rule-based | Imposed levels and labels = MAC. |
| 4.6 | Passkey | OTP | A passkey (FIDO2) removes the typed secret. An OTP is typed and can be stolen. |
| 4.6 | Password reuse policy | More frequent expiration | Changing it more often does not stop them repeating it everywhere. |
| 4.6 | Access attestation | Regulatory audit | Periodic INTERNAL review by the owners = attestation. |
| 4.1 | COPE | CYOD | Corporate + personal use enabled = COPE. |
| 4.1 | CYOD | COPE | PICKS from a catalog = CYOD. |
| 4.1 | TKIP | CCMP (AES) | Compatibility with old hardware = TKIP (weak, for compatibility only). |
| 4.8 | Electronic discovery (e-discovery) | Forensic analysis | For a LEGAL case = e-discovery. Recovering deleted files = forensics. |
| 4.8 | Evidence preservation | Acquisition | Acquisition = making the copy. Preservation = keeping it intact afterwards. |
| 4.8 | Detection | Analysis | Detect and classify = detection. Find the root cause = analysis. |
| 4.9 | IPS/IDS logs | Firewall logs | What is SUSPICIOUS = IPS/IDS. ALL connections (IP, port, action) = firewall. |
| 4.9 | Packet capture | Firewall logs | Packet contents = capture. The firewall only records metadata. |
| 4.5 | DKIM | SPF | Cryptographic signature = DKIM. List of authorized servers = SPF. |
| 4.5 | Secure Web Gateway (SWG) | NGFW | WEB security proxy = SWG. |
| 4.5 | Behavior-based IPS | Signature tuning | The UNKNOWN = behavior. |
| 4.5 | Signature tuning | Behavior-based IPS | False positives = TUNE the signatures. |
| 4.5 | GPO linked to the organizational unit | Local policy on each computer | Central management by department = GPO on the OU. |
| 4.3 | High (7.0–8.9) | Critical (9.0–10.0) | Critical starts at 9.0. From 7.0 to 8.9 is High. |
| 4.3 | CVE-2024-12345 | AV:N/AC:L/PR:N | CVE-YEAR-NUMBER. "AV:N/AC:L…" is a CVSS vector. |

</details>

<details>
<summary><b>Domain 5: Security Program Management and Oversight</b> · 25 pairs</summary>

| Objective | Right answer | Often confused with | How to tell them apart |
|---|---|---|---|
| 5.2 | Probability | Likelihood | Statistical NUMBER = probability. |
| 5.2 | Likelihood | Probability | QUALITATIVE rating (high/medium/low) = likelihood. |
| 5.2 | Risk tolerance | Risk appetite | Appetite = how much risk is PURSUED to grow. Tolerance = how much is ACCEPTED. |
| 5.2 | Risk threshold | Risk tolerance | The point that TRIGGERS action = threshold. |
| 5.2 | Exposure factor (EF) | SLE | EF is the PERCENTAGE. SLE = AV × EF, in money. |
| 5.2 | Risk report | Risk register | Register = the LIST. Report = what gets COMMUNICATED. |
| 5.2 | One-time assessment | Ad hoc assessment | Ad hoc = reaction to an EVENT. One-time = planned, done once. |
| 5.2 | Recurring assessment | Continuous assessment | With intervals = recurring. Without pause = continuous. |
| 5.1 | SOX | FISMA | Finances of public companies = SOX. Federal agencies = FISMA. |
| 5.1 | CCPA | FISMA | Horizontal (all sectors) = CCPA. FISMA only applies to the federal government. |
| 5.1 | ISO/IEC 27001 | ISO/IEC 27002 | 27001 = certifiable ISMS. 27002 = controls guide. |
| 5.1 | Business continuity policy | Disaster recovery policy | Continuity = the whole business keeps running. Recovery = restoring IT. |
| 5.4 | Sensitive data (special categories) | Ordinary personal data | Religion, health, politics, biometrics = special categories. |
| 5.4 | Fine | Sanction | Fine = money. Sanction = general term. |
| 5.4 | External compliance reporting | Internal compliance reporting | OUTWARD = external. To leadership = internal. |
| 5.1 | Data owner | Data controller | Owner = classifies and decides access. Controller = decides what it is processed for. |
| 5.1 | Data processor | Data controller | The one who DECIDES = controller. The one who EXECUTES on another's behalf = processor. |
| 5.3 | Vendor monitoring | Vendor assessment | Before contracting = assessment. After = monitoring. |
| 5.3 | SOW | MSA | MSA = general terms of the relationship. SOW = a specific piece of work. |
| 5.3 | Independent assessment | Right-to-audit clause | The clause only grants PERMISSION; the independent assessment is the review itself. |
| 5.5 | Third-party audit | Attestation | Audit = the EXAMINATION. Attestation = the resulting STATEMENT. |
| 5.5 | Regulatory examination | Attestation | Done by the REGULATOR = regulatory examination. |
| 5.6 | Initial report | Forensic report | First report of the finding = initial. The forensic one comes after investigating. |
| 5.6 | Operational security | DLP | The PRACTICE = OPSEC. The technical tool = DLP. |
| 5.6 | Spear phishing | Phishing | Aimed at a specific person and personalized = spear phishing. |

</details>

### Exam-day strategy for PBQs

- **PBQs usually come first.** You can flag them and come back after the multiple-choice questions so a hard one does not eat your time.
- **Budget the time:** 90 minutes for up to 90 questions. Give each PBQ about 5 to 7 minutes, then move on.
- **Partial credit is likely.** Fill in every field you can; an empty field is a guaranteed zero.
- **Read the requirements, not just the scenario.** The grading follows the stated requirements line by line.
- **Firewall rules are evaluated top to bottom, first match wins.** Put specific allow rules before broad denies and finish with an implicit or explicit deny.
- **When two answers look right, pick the one the question's keyword points to** (see the table above).

### Official and free resources

- [CompTIA Security+ certification page](https://www.comptia.org/certifications/security) and the official SY0-701 exam objectives, available from it. The objectives list every topic that can appear.
- [Professor Messer's free SY0-701 course](https://www.professormesser.com/sy0-701-certification-course/): complete free video course mapped to the objectives.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Validate the current PBQ (free practice) |
| <kbd>Ctrl</kbd> + <kbd>→</kbd> · <kbd>Alt</kbd> + <kbd>→</kbd> | Next PBQ |
| <kbd>Ctrl</kbd> + <kbd>←</kbd> · <kbd>Alt</kbd> + <kbd>←</kbd> | Previous PBQ |
| <kbd>Alt</kbd> + <kbd>E</kbd> | Open the grading and study guide of the current PBQ |
| <kbd>Alt</kbd> + <kbd>R</kbd> | Reset the answers of the current PBQ |
| <kbd>Alt</kbd> + <kbd>P</kbd> | Ports and concepts cheat sheet (practice only) |
| <kbd>Alt</kbd> + <kbd>T</kbd> | Trap review flashcards (practice only) |
| <kbd>Alt</kbd> + <kbd>S</kbd> | Progress report by domain |
| <kbd>Ctrl</kbd> + <kbd>/</kbd> | Show or hide the shortcuts help |
| <kbd>Esc</kbd> | Close any dialog |

> On macOS, <kbd>Cmd</kbd> works like <kbd>Ctrl</kbd>.

## On mobile too

<p align="center"><img src="docs/images/app-mobile.png" alt="Mobile view" width="260" /></p>

## Run locally

Only needed if you want to change the code; to practice, use [the online version](https://comptia-pbq.vercel.app).


Requires [Node.js](https://nodejs.org/) 20 or later.

```bash
git clone https://github.com/EnzoP7/Comptia-PBQ.git
cd Comptia-PBQ
npm install
npm run dev      # http://localhost:3000
```

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build in `dist/` |
| `npm run lint` | Type check |
| `npm run i18n:check` | List strings missing an English translation |

The live site is deployed on Vercel. GitHub Actions (`.github/workflows/deploy.yml`) checks every push and pull request: type check, missing translations and production build.

<details>
<summary><b>Project structure and adding PBQs</b></summary>

| File | Role |
|---|---|
| `src/pbqRegistry.tsx` | For every PBQ: initial state, evaluator and simulator. |
| `src/data/pbqsData.ts` | Catalog of PBQs 1–50 and their initial data. |
| `src/data/matrixPbqs.ts` | Classification PBQs 51–59, 61, 65–75 and 92–96 (including typed-answer columns such as port numbers). |
| `src/data/reviewPbqs.ts` | PBQs 78–91: the concept pairs most often confused in practice exams, each row naming the trap. |
| `src/data/linuxPermissionsPbq.ts` | PBQ 60: Linux permissions. |
| `src/data/firewallPbq77.ts` | PBQ 77: firewall rules graded per requirement with the packet simulator. |
| `src/data/terminalPbqs.ts` | PBQs 62–64 and 76: Linux terminal scenarios graded by server state. |
| `src/terminal/engine.ts` | Simulated shell (file system, processes, network, firewall, cron, services). |
| `src/data/difficulty.ts` | Difficulty levels and the list of *Extra* PBQs outside the objectives. |
| `src/data/sy0701Objectives.ts` | Official SY0-701 objectives and domain weights. |
| `src/data/studyGuide.ts` | Study guide: concepts linked to every graded criterion. |
| `src/data/trapCards.ts` · `src/utils/trapProgress.ts` | Trap review cards and their spaced repetition (stored in the browser). |
| `src/utils/evaluator.ts` | Partial-credit evaluators for PBQs 1–50. |
| `src/i18n/` | Language switch, page translator and the `en.json` dictionary (Spanish → English). |

**Adding a classification PBQ:** add an entry to `MATRIX_PBQS` in `src/data/matrixPbqs.ts` (rows, columns with options, correct answer and per-row explanation). It is registered, graded, rendered and gets its study guide automatically. If you change the shape of an existing PBQ's state, bump `STORAGE_VERSION` in `src/utils/storage.ts`.

**English translation:** content is authored in Spanish and the English text lives in `src/i18n/en.json`. After adding or changing text, run `npm run i18n:check` to list untranslated strings. To translate them in bulk, `node scripts/i18n.mjs export missing.tsv` writes an `id<TAB>text` file; write the translations as `id|English text` (or `id|=` when the text is already English) and apply them with `node scripts/i18n.mjs merge missing.tsv translations.tsv`.

</details>

## Contributing

Found a technical error, a debatable answer, or want to propose a PBQ? Open an *issue* or a *pull request*. Content fixes backed by a source (official objectives, NIST, an RFC) are especially welcome.

## Disclaimer

Independent study project, **not affiliated with, endorsed by or sponsored by CompTIA**. CompTIA and Security+ are registered trademarks of CompTIA, Inc. All questions are original and do not come from the real exam. Use it as a complement to official study material.

<sub>Keywords: CompTIA Security+ SY0-701, PBQ, performance-based questions, simulator, practice exam, cybersecurity, Security+ practice questions in English and Spanish.</sub>
