/**
 * Study glossaries for the hand-built PBQs that had none. Each concept lists the breakdown
 * criteria it explains (`criteria`, ids from the evaluators; a trailing * matches a prefix).
 */
import { PBQExplanationData } from '../types/pbq';

export const PBQ_EXPLANATIONS_EXTRA: Record<string, PBQExplanationData> = {
  // Replace earlier glossaries whose items did not match what these PBQs grade.
  'pbq-1': {
    pbqId: 'pbq-1',
    overviewRationale:
      'La ubicación de un control depende del tráfico que debe ver y de lo que debe proteger. Se piensa como capas desde Internet hacia adentro: el borde filtra ataques de red, la DMZ protege a los servidores públicos a nivel de aplicación, una frontera separa la DMZ de la LAN, y los servicios críticos (autenticación, administración) quedan en zonas internas y controladas.',
    keyTakeaways: [
      'IPS en línea = puede bloquear; IDS pasivo (por SPAN/TAP) = solo detecta.',
      'El WAF protege aplicaciones web (capa 7) y va inmediatamente delante de los servidores web.',
      'Un firewall stateful entre DMZ y LAN evita que un servidor público comprometido sea un puente hacia la red interna.',
      'Jump server / bastion host: único punto endurecido y auditado para administrar sistemas internos.',
      'Los servicios de autenticación (RADIUS, AD) nunca se exponen a Internet.',
    ],
    itemsGlossary: [
      { name: 'IPS en línea (inline)', badge: '3.2 Dispositivos', definition: 'Sensor que analiza el tráfico en el camino de los paquetes y puede descartarlos en tiempo real.', whyCorrectOrRole: 'Va en el borde, entre Internet y la red, para detener ataques antes de que entren.', distractorWarning: 'Un IDS pasivo recibe una copia del tráfico: alerta, pero no puede bloquear.', criteria: ['edge-ips'] },
      { name: 'WAF (Web Application Firewall)', badge: 'Capa 7', definition: 'Inspecciona peticiones HTTP/HTTPS contra ataques web: SQLi, XSS, inclusión de archivos, etc.', whyCorrectOrRole: 'Se coloca delante de los servidores web de la DMZ.', distractorWarning: 'Un balanceador distribuye carga, pero no inspecciona el contenido de las peticiones en busca de ataques.', criteria: ['dmz-waf'] },
      { name: 'Firewall stateful de segmentación', badge: 'Segmentación', definition: 'Firewall que lleva registro del estado de cada conexión y aplica reglas entre zonas.', whyCorrectOrRole: 'Separa la DMZ de la LAN: un compromiso en la DMZ no da acceso libre a la red interna.', criteria: ['boundary-fw'] },
      { name: 'Bastion host / jump server', badge: 'Administración', definition: 'Servidor endurecido, con MFA y registro de sesiones, desde el que se administran los sistemas internos.', whyCorrectOrRole: 'Centraliza y audita el acceso SSH/RDP en lugar de exponer cada servidor.', criteria: ['mgmt-bastion'] },
      { name: 'Servidor RADIUS (AAA)', badge: 'Autenticación', definition: 'Servicio centralizado de autenticación, autorización y registro de accesos de red.', whyCorrectOrRole: 'Reside en la LAN interna protegida: maneja credenciales corporativas.', criteria: ['lan-radius'] },
    ],
  },

  'pbq-2': {
    pbqId: 'pbq-2',
    overviewRationale:
      'Una tabla de reglas se evalúa de arriba hacia abajo y el firewall aplica la primera regla que coincide con el paquete. Auditarla implica dos preguntas: ¿cada regla es lo más específica posible (origen, destino, puerto)? ¿El orden produce el resultado esperado para cada flujo?',
    keyTakeaways: [
      'Las reglas específicas van arriba; las generales (DENY ANY ANY) al final.',
      'Los puertos de administración (22, 3389) nunca se abren a 0.0.0.0/0: solo a la subred de administración o al bastion.',
      'Los protocolos en texto claro (HTTP 80, Telnet 23) no se permiten hacia servidores que manejan datos.',
      'Lo que no está permitido explícitamente se deniega (implicit deny).',
    ],
    itemsGlossary: [
      { name: 'Restringir el origen de la administración SSH', badge: 'Least privilege', definition: 'Una regla de administración debe limitar el origen a las IP que realmente administran el sistema.', whyCorrectOrRole: 'SSH al 192.168.1.10 se permite solo desde 10.1.0.0/24.', distractorWarning: 'Cambiar el puerto de SSH a uno no estándar es seguridad por oscuridad: no restringe quién puede conectarse.', criteria: ['fw-ssh'] },
      { name: 'Orden first-match', badge: 'Orden de reglas', definition: 'La primera regla que coincide decide. Una regla DENY ANY ANY al principio bloquea todo lo que está debajo.', whyCorrectOrRole: 'La denegación general va en la última posición, después de todas las reglas PERMIT específicas.', criteria: ['fw-order', 'traffic-*'] },
      { name: 'Servicios publicados en la DMZ', badge: 'DMZ', definition: 'Solo se publican los servicios necesarios hacia los servidores exactos que los prestan.', whyCorrectOrRole: 'HTTPS (TCP 443) hacia el web server y DNS (UDP 53) hacia el servidor DNS.', distractorWarning: 'DNS usa UDP 53 para consultas; TCP 53 se usa para transferencias de zona y respuestas grandes.', criteria: ['fw-dmz'] },
      { name: 'Protocolos en texto claro', badge: 'HTTP 80', definition: 'HTTP transmite todo sin cifrar, incluidas cookies y credenciales.', whyCorrectOrRole: 'Se elimina o deniega la regla que permite HTTP; el servidor sirve solo HTTPS.', criteria: ['fw-http'] },
    ],
  },

  'pbq-3': {
    pbqId: 'pbq-3',
    overviewRationale:
      'Reconstruir un ataque desde el SIEM consiste en ordenar los eventos de distintas fuentes en una línea de tiempo y buscar el primer evento de compromiso. Los registros web, del sistema y de autenticación cuentan partes distintas de la misma historia.',
    keyTakeaways: [
      'Paciente cero = el PRIMER sistema interno comprometido, no la IP del atacante externo.',
      'La explotación inicial es el momento en que el atacante logra ejecutar código (subida de la web shell), no el primer escaneo.',
      'Patrón típico: SQLi → web shell → comandos del sistema → robo de credenciales (4625 → 4624) → movimiento lateral por SMB 445.',
      'Contención preferida: aislar el host de la red (EDR o puerto) preservando la memoria; no apagarlo.',
    ],
    itemsGlossary: [
      { name: 'Paciente cero', badge: '4.9 Investigación', definition: 'Primer host de la organización comprometido, desde el cual el atacante continúa el ataque.', whyCorrectOrRole: 'El servidor web 192.168.1.105 recibe la SQLi, aloja la web shell y desde él se barre la red interna.', distractorWarning: 'La IP externa es el origen del ataque, no el paciente cero; la base de datos y el DC son víctimas posteriores.', criteria: ['siem-patient-zero'] },
      { name: 'Cadena de ataque SQLi → RCE → SMB', badge: 'Kill chain', definition: 'Secuencia de pasos del atacante, desde el acceso inicial hasta el movimiento lateral.', whyCorrectOrRole: 'Los logs muestran inyección SQL, ejecución de comandos y barrido SMB: no hay phishing, DDoS ni RDP.', criteria: ['siem-vector'] },
      { name: 'Timestamp de la explotación inicial', badge: 'Línea de tiempo', definition: 'Momento en que el atacante obtiene ejecución en el sistema.', whyCorrectOrRole: 'Es el evento de la subida exitosa de la web shell (cmd.php). La conexión TCP y el sondeo SQL son anteriores, pero todavía no hay compromiso.', criteria: ['siem-timestamp'] },
      { name: 'Event ID 4625 / 4624', badge: 'Windows', definition: '4625 = inicio de sesión fallido; 4624 = inicio de sesión exitoso. Muchos 4625 seguidos de un 4624 indican fuerza bruta o uso de credenciales robadas.', whyCorrectOrRole: 'Indican que el atacante pasó del servidor web a credenciales privilegiadas.', criteria: ['siem-vector'] },
      { name: 'Contención por aislamiento de red', badge: '4.8 IR', definition: 'Aislar el host (cuarentena EDR, VLAN o puerto) corta al atacante sin destruir evidencia.', whyCorrectOrRole: 'Detiene el movimiento lateral y preserva la memoria para el análisis forense.', distractorWarning: 'Apagar el equipo destruye la evidencia volátil (procesos, conexiones, claves en memoria).', criteria: ['siem-containment'] },
    ],
  },

  'pbq-4': {
    pbqId: 'pbq-4',
    overviewRationale:
      'Endurecer un servidor según una línea base (CIS, STIG) consiste en reducir la superficie de ataque: apagar lo que no se necesita, reemplazar los protocolos inseguros por sus equivalentes cifrados y aplicar directivas de cuenta que frenen el robo y la adivinación de credenciales.',
    keyTakeaways: [
      'Telnet (23) → SSH (22). FTP (21) → SFTP (22) o FTPS (990). SMBv1 → SMBv3.',
      'Deshabilitar servicios innecesarios es el control de hardening más eficaz: lo que no corre no se puede explotar.',
      'UAC limita los privilegios de administrador hasta que se confirman explícitamente.',
      'Contraseñas largas (14+) y bloqueo tras pocos intentos fallidos frenan la fuerza bruta.',
      'NLA exige autenticarse antes de abrir la sesión RDP y reduce la exposición a ataques previos al login.',
    ],
    itemsGlossary: [
      { name: 'Telnet (TCP 23)', badge: 'Texto claro', definition: 'Protocolo de terminal remota que envía usuario, contraseña y comandos sin cifrar.', whyCorrectOrRole: 'Se detiene y se usa SSH en su lugar.', criteria: ['hard-telnet'] },
      { name: 'FTP (TCP 20/21)', badge: 'Texto claro', definition: 'Transferencia de archivos con credenciales y datos sin cifrar.', whyCorrectOrRole: 'Se detiene; se usa SFTP (sobre SSH) o FTPS.', distractorWarning: 'SFTP y FTPS son distintos: SFTP usa SSH (22); FTPS es FTP sobre TLS (990 implícito).', criteria: ['hard-ftp'] },
      { name: 'SMBv1', badge: 'MS17-010', definition: 'Versión heredada de SMB explotada por EternalBlue y por gusanos como WannaCry.', whyCorrectOrRole: 'Se deshabilita; SMBv3 admite cifrado y firma.', criteria: ['hard-smbv1'] },
      { name: 'SSH / HTTPS', badge: 'Servicios seguros', definition: 'Equivalentes cifrados para la administración remota y la publicación web.', whyCorrectOrRole: 'Deben quedar activos: el servidor los necesita para funcionar y administrarse.', distractorWarning: 'Endurecer no significa apagarlo todo: detener SSH o HTTPS rompe el servicio que se quiere proteger.', criteria: ['hard-ssh'] },
      { name: 'UAC (User Account Control)', badge: 'Privilegios', definition: 'Ejecuta las sesiones de administrador con un token limitado hasta que se aprueba una elevación.', whyCorrectOrRole: 'Evita que el malware obtenga privilegios de administrador en silencio.', criteria: ['hard-uac'] },
      { name: 'Longitud mínima de contraseña', badge: 'Directiva', definition: 'La longitud es el factor que más aumenta el costo de un ataque de fuerza bruta.', whyCorrectOrRole: 'La línea base exige al menos 14 caracteres.', criteria: ['hard-pwd'] },
      { name: 'Bloqueo de cuenta', badge: 'Directiva', definition: 'Bloquea la cuenta durante un tiempo tras N intentos fallidos.', whyCorrectOrRole: 'Un umbral de 5 intentos frena la fuerza bruta en línea.', distractorWarning: 'El bloqueo por cuenta no detiene el password spraying (un intento por cuenta); para eso hacen falta MFA y detección por origen.', criteria: ['hard-lockout'] },
    ],
  },

  'pbq-6': {
    pbqId: 'pbq-6',
    overviewRationale:
      'Una VPN IPsec se negocia en dos fases: la fase 1 (IKE) crea un canal seguro para negociar, y la fase 2 (IPsec SA) protege el tráfico real. Cada parámetro tiene una opción moderna y opciones heredadas que el examen usa como distractores.',
    keyTakeaways: [
      'IKEv2 es más robusto y eficiente que IKEv1 (menos mensajes, mejor resistencia a DoS, soporte de MOBIKE).',
      'Diffie-Hellman: grupo 14 (2048 bits) o superior, o grupos de curva elíptica (19/20). Los grupos 1, 2 y 5 son débiles.',
      'ESP cifra e integra el payload; AH solo autentica (no cifra).',
      'PFS: cada sesión usa claves efímeras, así que el robo de una clave no descifra el tráfico pasado.',
      'AES-GCM es cifrado autenticado (AEAD): confidencialidad e integridad en una sola operación.',
    ],
    itemsGlossary: [
      { name: 'IKEv2', badge: 'Fase 1', definition: 'Protocolo de intercambio de claves que establece la asociación de seguridad IKE.', whyCorrectOrRole: 'Es la versión actual y recomendada.', criteria: ['crypto-ike-version'] },
      { name: 'Grupo Diffie-Hellman', badge: 'Intercambio de claves', definition: 'Define el tamaño del módulo o la curva con la que los extremos acuerdan una clave secreta.', whyCorrectOrRole: 'Grupo 14 (2048 bits) o 19/20 (ECDH) cumplen los estándares actuales.', distractorWarning: 'Group 2 (1024) y Group 5 (1536) se consideran insuficientes.', criteria: ['crypto-dh-group'] },
      { name: 'Cifrado y hash de fase 1', badge: 'AES / SHA-2', definition: 'Algoritmos que protegen la negociación IKE.', whyCorrectOrRole: 'AES-256 con SHA-256/384.', distractorWarning: 'MD5 y SHA-1 tienen colisiones prácticas; DES y 3DES tienen bloques o claves demasiado cortos.', criteria: ['crypto-ike-ciphers'] },
      { name: 'ESP vs AH', badge: 'Fase 2', definition: 'ESP cifra y autentica el payload. AH autentica el paquete, incluida la cabecera IP, pero no cifra.', whyCorrectOrRole: 'Se necesita confidencialidad: ESP.', distractorWarning: 'AH no ofrece confidencialidad y además rompe con NAT.', criteria: ['crypto-ipsec-esp'] },
      { name: 'AES-GCM-256 + PFS', badge: 'AEAD', definition: 'Cifrado autenticado para el tráfico del túnel, con claves efímeras por sesión.', whyCorrectOrRole: 'Ofrece confidencialidad, integridad y secreto hacia adelante.', criteria: ['crypto-ipsec-suite'] },
      { name: 'AES-256 en reposo y TLS 1.3 en tránsito', badge: '1.4 Cripto', definition: 'AES-256 para almacenamiento; TLS 1.3 elimina suites heredadas y exige PFS.', whyCorrectOrRole: 'Son las opciones actuales para cada estado del dato.', distractorWarning: 'RC4 tiene sesgos estadísticos; SSL 3.0 es vulnerable a POODLE.', criteria: ['crypto-storage-tls'] },
    ],
  },

  'pbq-22': {
    pbqId: 'pbq-22',
    overviewRationale:
      'La adquisición forense empieza por lo que se pierde primero (orden de volatilidad) y se hace de forma que se pueda demostrar ante un tribunal que la evidencia no fue alterada: bloqueador de escritura, hash y cadena de custodia.',
    keyTakeaways: [
      'RFC 3227: registros y caché → memoria (tablas de rutas, ARP, procesos) → archivos temporales/swap → disco → logs remotos → medios de archivo (cintas).',
      'Un write blocker de hardware impide cualquier escritura en el disco original.',
      'El hash (SHA-256) se calcula antes y después de la copia: si coinciden, la copia es idéntica.',
      'La cadena de custodia registra quién tuvo la evidencia, cuándo y para qué.',
    ],
    itemsGlossary: [
      { name: 'Orden de volatilidad (RFC 3227)', badge: '4.8 Forense', definition: 'Prioridad de adquisición según lo rápido que se pierde cada tipo de evidencia.', whyCorrectOrRole: 'Registros/caché → RAM → swap/temporales → disco → logs remotos → cintas.', distractorWarning: 'Los backups en cinta son lo menos volátil: van al final, no al principio.', criteria: ['forensic-order'] },
      { name: 'Write blocker de hardware', badge: 'Integridad', definition: 'Dispositivo entre el disco y la estación forense que solo permite lectura.', whyCorrectOrRole: 'Garantiza que la adquisición no modifique la evidencia (ni siquiera las marcas de tiempo de acceso).', criteria: ['forensic-write-blocker'] },
      { name: 'Hash de verificación', badge: 'SHA-256', definition: 'Huella criptográfica del contenido completo de la evidencia.', whyCorrectOrRole: 'SHA-256 demuestra que la imagen es idéntica al original.', distractorWarning: 'MD5 y SHA-1 tienen colisiones conocidas: un abogado podría impugnar la integridad.', criteria: ['forensic-hash'] },
      { name: 'Cadena de custodia', badge: 'Admisibilidad', definition: 'Registro documentado de cada persona que manipuló la evidencia, cuándo y con qué propósito.', whyCorrectOrRole: 'Sin ella la evidencia puede ser inadmisible.', criteria: ['forensic-chain'] },
    ],
  },

  'pbq-5': {
    pbqId: 'pbq-5',
    overviewRationale:
      'El acceso efectivo en Windows es la combinación de permisos de recurso compartido y NTFS, heredados y explícitos, de todos los grupos del usuario. Para corregir un exceso de acceso hay que revisar tanto la pertenencia a grupos como las ACL de cada carpeta, y aplicar el mínimo privilegio: el permiso más bajo que permite hacer el trabajo.',
    keyTakeaways: [
      'Los permisos se asignan a grupos, no a usuarios individuales (RBAC simplificado y auditable).',
      'Un Deny explícito gana sobre un Allow; un permiso explícito gana sobre uno heredado.',
      'Modify = leer, escribir, crear y borrar. Full Control además permite cambiar permisos y tomar posesión: casi nunca es necesario.',
      'Las carpetas con datos sensibles deben romper la herencia para no recibir permisos amplios de la carpeta padre.',
    ],
    itemsGlossary: [
      {
        name: 'Pertenencia a grupos y acumulación de privilegios (privilege creep)',
        badge: '4.6 IAM',
        definition: 'Cada grupo al que pertenece un usuario le suma permisos. Cuando alguien cambia de rol y no se le retiran los grupos anteriores, acumula accesos que no necesita.',
        whyCorrectOrRole: 'El practicante de IT solo debe estar en IT_Helpdesk. Estar en HR_Admins le daría acceso a nóminas, algo totalmente ajeno a su función.',
        distractorWarning: 'Quitar el permiso en la carpeta pero dejar al usuario en el grupo no resuelve nada: el grupo sigue otorgando el acceso. Se corrige la pertenencia.',
        criteria: ['iam-intern-group', 'iam-auditor-group'],
      },
      {
        name: 'Herencia de permisos NTFS',
        badge: 'NTFS',
        definition: 'Por defecto las subcarpetas heredan las ACL de la carpeta padre. Deshabilitar la herencia permite definir una ACL propia, eliminando las entradas heredadas.',
        whyCorrectOrRole: 'Payroll_Confidential heredaba acceso para Domain Users/Everyone. Hay que deshabilitar la herencia y dejar solo a RRHH.',
        distractorWarning: 'Agregar un Deny a Everyone parece rápido, pero Everyone incluye a RRHH y les bloquearía el acceso. Lo correcto es quitar la entrada amplia, no denegarla.',
        criteria: ['iam-hr-acl'],
      },
      {
        name: 'Modify vs Full Control (mínimo privilegio)',
        badge: 'Least Privilege',
        definition: 'Modify permite leer, escribir, crear y eliminar contenido. Full Control añade cambiar permisos y tomar posesión del objeto.',
        whyCorrectOrRole: 'Los auditores necesitan actualizar informes: Modify alcanza. Full Control les permitiría otorgarse más acceso o quitárselo a otros.',
        distractorWarning: 'En el examen, "Full Control" casi siempre es el distractor cuando el requisito habla de leer y modificar.',
        criteria: ['iam-fin-least-privilege'],
      },
    ],
  },

  'pbq-7': {
    pbqId: 'pbq-7',
    overviewRationale:
      'Una red Wi-Fi corporativa debe autenticar a cada usuario de forma individual (802.1X contra RADIUS), cifrar con la suite más fuerte disponible y eliminar las funciones de conveniencia que abren vectores de ataque (WPS) o dejan a los clientes expuestos (sin PMF ni aislamiento).',
    keyTakeaways: [
      'Personal (PSK/SAE) = una clave compartida; Enterprise = 802.1X con credenciales o certificados por usuario.',
      'RADIUS usa UDP 1812 (autenticación) y 1813 (accounting); 1645/1646 son puertos heredados.',
      'WPS por PIN es vulnerable a fuerza bruta: siempre deshabilitado.',
      'PMF (802.11w) protege las tramas de gestión y evita la desautenticación forzada; es obligatorio en WPA3.',
    ],
    itemsGlossary: [
      {
        name: 'WPA3-Enterprise (802.1X / EAP)',
        badge: '4.1 Wireless',
        definition: 'Modo en el que el AP delega la autenticación de cada usuario a un servidor RADIUS mediante 802.1X/EAP, en lugar de usar una clave compartida.',
        whyCorrectOrRole: 'Cada empleado se autentica con sus propias credenciales; dar de baja a una persona no obliga a cambiar la clave de toda la red.',
        distractorWarning: 'WPA3-Personal (SAE) es más seguro que WPA2-PSK, pero sigue siendo una clave compartida: no cumple "credenciales individuales".',
        criteria: ['wifi-wpa3-ent'],
      },
      {
        name: 'RADIUS (AAA)',
        badge: 'UDP 1812/1813',
        definition: 'Protocolo AAA que autentica, autoriza y registra accesos de red. El AP (autenticador) y el servidor RADIUS comparten un secreto para proteger sus mensajes.',
        whyCorrectOrRole: 'Se configura la IP del servidor (10.0.10.25), el puerto de autenticación 1812 y el secreto compartido.',
        distractorWarning: '1813 es accounting, no autenticación. TACACS+ usa TCP 49 y se usa para administrar dispositivos de red, no para Wi-Fi.',
        criteria: ['wifi-radius-config'],
      },
      {
        name: 'AES-GCMP-256',
        badge: 'Cifrado',
        definition: 'Cifrado autenticado AES en modo Galois/Counter con clave de 256 bits, usado por WPA3-Enterprise en su modo de 192 bits.',
        whyCorrectOrRole: 'Es la opción más robusta disponible. Ofrece confidencialidad e integridad en una sola operación.',
        distractorWarning: 'TKIP (basado en RC4) está obsoleto y no está permitido en WPA3.',
        criteria: ['wifi-cipher'],
      },
      {
        name: 'Aislamiento de clientes (client isolation)',
        badge: 'Segmentación',
        definition: 'Impide que los dispositivos conectados al mismo SSID se comuniquen directamente entre sí; solo hablan con el gateway.',
        whyCorrectOrRole: 'Evita que un equipo comprometido ataque a los demás clientes inalámbricos.',
        criteria: ['wifi-client-isolation'],
      },
      {
        name: 'WPS y PMF (802.11w)',
        badge: 'Hardening',
        definition: 'WPS permite unirse a la red con un PIN de 8 dígitos (que se valida en dos mitades, por eso es fácil de forzar). PMF cifra y autentica las tramas de gestión.',
        whyCorrectOrRole: 'Se desactiva WPS para eliminar el ataque de fuerza bruta (Reaver) y se exige PMF para impedir que un atacante desconecte clientes con tramas deauth falsas, paso previo típico de un evil twin.',
        criteria: ['wifi-wps-pmf'],
      },
    ],
  },

  'pbq-8': {
    pbqId: 'pbq-8',
    overviewRationale:
      'En una arquitectura híbrida cada control se ubica donde ve el tráfico que debe filtrar: en el borde de la nube contra ataques web, en el punto de interconexión para el tráfico entre nubes y on-prem, y con acceso Zero Trust para administradores en lugar de una VPN plana.',
    keyTakeaways: [
      'WAF/DDoS se ubica ANTES de los recursos que protege (ingress de la VPC).',
      'Un Transit Gateway actúa como hub central entre múltiples VPC y el data center (topología hub-and-spoke).',
      'ZTNA da acceso a aplicaciones concretas tras verificar identidad y postura; una VPN tradicional da acceso a la red completa.',
      'Los sistemas de identidad son críticos: nunca en zonas expuestas.',
    ],
    itemsGlossary: [
      { name: 'Cloud WAF + protección DDoS', badge: 'Capa 7', definition: 'Servicio que inspecciona peticiones HTTP/HTTPS y absorbe ataques volumétricos en el borde de la nube.', whyCorrectOrRole: 'Va en la entrada de la VPC para filtrar SQLi, XSS y DDoS antes de los balanceadores.', distractorWarning: 'Un NGFW on-prem no ve el tráfico que llega directamente a la nube.', criteria: ['cloud-waf'] },
      { name: 'Transit Gateway', badge: 'Hub híbrido', definition: 'Router gestionado que interconecta varias VPC y enlaces VPN/Direct Connect en un único punto.', whyCorrectOrRole: 'Centraliza la conectividad cifrada nube ⟷ data center y simplifica el control del tráfico.', criteria: ['transit-gw'] },
      { name: 'ZTNA (Zero Trust Network Access)', badge: '1.2 Zero Trust', definition: 'Broker que concede acceso a aplicaciones específicas tras verificar identidad, dispositivo y contexto en cada sesión.', whyCorrectOrRole: 'Los ingenieros DevOps acceden solo a los servidores autorizados, sin visibilidad del resto de la red.', distractorWarning: 'Una VPN de acceso remoto coloca al usuario "dentro" de la red: contradice el mínimo privilegio.', criteria: ['ztna-broker'] },
      { name: 'NGFW en el borde on-prem', badge: 'Inspección', definition: 'Firewall de nueva generación con inspección de aplicaciones, IPS y filtrado por identidad.', whyCorrectOrRole: 'El túnel híbrido termina en el data center: el NGFW inspecciona ese tráfico antes de que llegue a la red interna.', criteria: ['onprem-ngfw'] },
      { name: 'IdP / ADFS federado', badge: 'Identidad', definition: 'Proveedor de identidad que emite aserciones (SAML/OIDC) para el SSO con la nube.', whyCorrectOrRole: 'Se protege en la zona interna porque comprometerlo equivale a comprometer todas las aplicaciones federadas.', criteria: ['onprem-idp'] },
    ],
  },

  'pbq-9': {
    pbqId: 'pbq-9',
    overviewRationale:
      'El filtrado de salida (egress) limita qué puede salir de la red. Es la defensa contra exfiltración y canales de comando y control: aunque un equipo se infecte, el malware no debería poder comunicarse con el atacante.',
    keyTakeaways: [
      'El DNS solo debe salir hacia los resolvers internos; si los equipos consultan cualquier servidor DNS de Internet, el DNS tunneling es trivial.',
      'Por defecto se deniega todo y se permite solo lo necesario (allow list), también en salida.',
      'Puertos como 4444 (Metasploit) o 6667 (IRC) son indicadores clásicos de reverse shells y C2.',
      'El firewall aplica la primera regla que coincide: el orden importa tanto como el contenido.',
    ],
    itemsGlossary: [
      { name: 'DNS tunneling', badge: 'Exfiltración', definition: 'Técnica que codifica datos dentro de consultas y respuestas DNS hacia un dominio controlado por el atacante.', whyCorrectOrRole: 'Si solo se permite UDP 53 hacia 10.0.0.53/54, los equipos no pueden hablar directamente con servidores DNS externos; el resolver interno puede filtrar y registrar.', distractorWarning: 'Bloquear todo el DNS rompe la red. La solución es restringir el destino, no el protocolo.', criteria: ['egress-dns'] },
      { name: 'Reverse shell y C2 por puertos no estándar', badge: 'C2', definition: 'El equipo comprometido inicia una conexión saliente hacia el atacante (por ejemplo TCP 4444), que así evita las reglas de entrada.', whyCorrectOrRole: 'Se eliminan o deniegan las reglas que permiten 4444 y 6667: no existe ninguna necesidad de negocio para esos puertos.', criteria: ['egress-c2-ports'] },
      { name: 'Navegación HTTPS saliente', badge: 'TCP 443', definition: 'Tráfico web cifrado de los usuarios hacia Internet.', whyCorrectOrRole: 'Es el único servicio saliente que el negocio necesita.', criteria: ['egress-https'] },
      { name: 'Denegación implícita y first-match', badge: 'Orden de reglas', definition: 'El firewall evalúa las reglas de arriba hacia abajo y aplica la primera que coincide. Lo que no coincide con ninguna regla se deniega.', whyCorrectOrRole: 'La regla DENY ANY ANY va al final; las reglas específicas van arriba. Las pruebas de tráfico verifican el resultado real de esa secuencia.', distractorWarning: 'Una regla amplia (PERMIT a 0.0.0.0/0 en el 53) colocada antes de una específica hace que la específica nunca se aplique.', criteria: ['egress-implicit-deny', 'traffic-*'] },
    ],
  },

  'pbq-10': {
    pbqId: 'pbq-10',
    overviewRationale:
      'La investigación encadena tres fuentes: el gateway de correo (cómo entró), el proxy (cómo se comunica el malware) y los eventos del controlador de dominio (qué está haciendo dentro). La contención debe atacar tanto el host como la credencial expuesta.',
    keyTakeaways: [
      'DMARC=fail con SPF/DKIM fallidos indica un remitente suplantado.',
      'Beaconing: conexiones a intervalos regulares (por ejemplo cada 60 s) hacia dominios de aspecto aleatorio (DGA).',
      'Event ID 4769 con tipo de cifrado 0x17 (RC4) para una cuenta de servicio = Kerberoasting.',
      'Contra Kerberoasting: contraseñas largas o gMSA para cuentas de servicio y forzar AES.',
    ],
    itemsGlossary: [
      { name: 'Suplantación de correo y DMARC', badge: 'Correo', definition: 'DMARC verifica que el dominio del remitente visible esté alineado con SPF o DKIM y define qué hacer si falla.', whyCorrectOrRole: 'El log muestra DMARC=fail: el remitente fue falsificado, ese es el vector inicial.', distractorWarning: 'Un zero-day en un PDF o un MITM en SMTP no explican un fallo de autenticación del remitente.', criteria: ['siem10-q1'] },
      { name: 'C2 beaconing y DGA', badge: 'C2', definition: 'El malware contacta periódicamente a su servidor de control; los dominios generados por algoritmo (DGA) cambian constantemente para evadir listas de bloqueo.', whyCorrectOrRole: 'Las peticiones del proxy cada 60 s exactos hacia dominios aleatorios son el patrón de beaconing.', criteria: ['siem10-q2'] },
      { name: 'Kerberoasting', badge: 'T1558.003', definition: 'Un usuario del dominio solicita tickets de servicio (TGS) para cuentas con SPN y los crackea offline; con RC4 el hash es mucho más fácil de romper.', whyCorrectOrRole: 'Event ID 4769 con cifrado 0x17 para MSSQL_Svc es la firma de Kerberoasting.', distractorWarning: 'Golden Ticket falsifica un TGT (se usa sin un 4768 previo) y requiere el hash de KRBTGT; no es lo que muestran estos logs.', criteria: ['siem10-q3'] },
      { name: 'Contención y remediación', badge: '4.8 IR', definition: 'Aislar el equipo comprometido y eliminar la debilidad explotada.', whyCorrectOrRole: 'Se aísla la estación, se rota la contraseña de la cuenta de servicio forzando AES-256 y se investiga la memoria.', distractorWarning: 'Resetear KRBTGT es la respuesta a un Golden Ticket, no a Kerberoasting. Reiniciar servidores destruye evidencia volátil.', criteria: ['siem10-q4'] },
    ],
  },

  'pbq-11': {
    pbqId: 'pbq-11',
    overviewRationale:
      'La línea base de una estación Windows apunta a las técnicas más usadas tras el acceso inicial: capturar hashes en la red local, volcar credenciales de memoria y ejecutar código mediante macros o scripts.',
    keyTakeaways: [
      'LLMNR y NBT-NS responden a cualquiera en la red: Responder los usa para robar hashes NTLM.',
      'Credential Guard aísla los secretos de LSASS mediante virtualización (VBS).',
      'AllSigned exige firma en todos los scripts; RemoteSigned solo en los descargados; Unrestricted no protege.',
      'Las macros con Mark of the Web (descargadas de Internet) deben bloquearse por GPO.',
    ],
    itemsGlossary: [
      { name: 'LLMNR / NetBIOS (NBT-NS) poisoning', badge: 'T1557.001', definition: 'Cuando DNS falla, Windows pregunta por broadcast; un atacante responde haciéndose pasar por el recurso y recibe el hash NTLM del usuario.', whyCorrectOrRole: 'Deshabilitar LLMNR y NetBIOS sobre TCP/IP elimina el vector.', criteria: ['hard11-llmnr', 'hard11-netbios'] },
      { name: 'Credential Guard', badge: 'VBS', definition: 'Protege los secretos de LSASS en un entorno aislado por el hipervisor, inaccesible incluso para procesos con privilegios de administrador.', whyCorrectOrRole: 'Impide que herramientas como Mimikatz extraigan hashes y tickets de memoria.', criteria: ['hard11-cred-guard'] },
      { name: 'Directiva de ejecución de PowerShell', badge: 'Scripts', definition: 'Controla qué scripts pueden ejecutarse: Restricted (ninguno), AllSigned (solo firmados), RemoteSigned (firma solo para descargados), Unrestricted (todos).', whyCorrectOrRole: 'AllSigned o Restricted impiden ejecutar scripts no firmados.', distractorWarning: 'La directiva de ejecución no es un límite de seguridad absoluto (se puede eludir); en el examen se combina con AppLocker/WDAC.', criteria: ['hard11-ps-policy'] },
      { name: 'Bloqueo de macros (Mark of the Web)', badge: 'Office', definition: 'Windows marca los archivos descargados; una GPO puede impedir que Office ejecute macros en esos archivos.', whyCorrectOrRole: 'Elimina uno de los vectores de malware por correo más comunes.', criteria: ['hard11-vba-macros'] },
    ],
  },

  'pbq-12': {
    pbqId: 'pbq-12',
    overviewRationale:
      'El acceso condicional evalúa señales (usuario, dispositivo, ubicación, riesgo) en cada intento de acceso y decide si permitir, exigir más verificación o bloquear. Es la implementación práctica de Zero Trust en la identidad.',
    keyTakeaways: [
      'MFA resistente a phishing = FIDO2/WebAuthn o certificados. SMS y TOTP pueden ser capturados por un proxy AiTM.',
      'Las ubicaciones con nombre permiten bloquear países donde la empresa no opera.',
      'Exigir un dispositivo conforme (MDM) evita que datos sensibles se abran en equipos no gestionados.',
      'PIM/JIT elimina los privilegios permanentes: se activan bajo demanda, con aprobación y caducidad.',
    ],
    itemsGlossary: [
      { name: 'MFA resistente a phishing (FIDO2)', badge: 'Autenticación', definition: 'La llave FIDO2 firma un desafío ligado al dominio real; un sitio falso no puede reutilizar esa firma.', whyCorrectOrRole: 'Es la única opción que resiste ataques adversary-in-the-middle.', distractorWarning: 'SMS es vulnerable a SIM swapping; TOTP y push pueden ser retransmitidos por un proxy de phishing.', criteria: ['ca-mfa'] },
      { name: 'Geobloqueo / ubicaciones con nombre', badge: 'Contexto', definition: 'Regla que permite o bloquea según la ubicación de la IP de origen.', whyCorrectOrRole: 'Reduce la superficie de ataque bloqueando países sin operaciones.', criteria: ['ca-geo'] },
      { name: 'Dispositivo conforme (MDM)', badge: 'Postura', definition: 'El acceso se concede solo si el dispositivo está inscrito y cumple políticas (cifrado, parches, sin jailbreak).', whyCorrectOrRole: 'Los datos de pacientes solo se abren en dispositivos controlados por la organización.', criteria: ['ca-mdm'] },
      { name: 'PIM / Just-in-Time', badge: 'Privilegios', definition: 'Los roles privilegiados son elegibles, no permanentes: se activan por tiempo limitado con justificación y aprobación.', whyCorrectOrRole: 'Elimina el acceso permanente de Administrador Global.', criteria: ['ca-pim'] },
      { name: 'Acceso basado en riesgo', badge: 'Identity Protection', definition: 'El IdP calcula el riesgo del inicio de sesión (viaje imposible, IP anónima, credenciales filtradas) y actúa en consecuencia.', whyCorrectOrRole: 'Un riesgo alto se bloquea automáticamente; ignorarlo o revisarlo días después llega tarde.', criteria: ['ca-risk'] },
    ],
  },

  'pbq-13': {
    pbqId: 'pbq-13',
    overviewRationale:
      'Los errores de certificados casi siempre se reducen a cuatro causas: emisor no confiable, algoritmo de firma rechazado, cadena incompleta o nombre que no coincide. Cada síntoma del escenario apunta a una de ellas.',
    keyTakeaways: [
      'Un certificado autofirmado no es confiable para clientes externos.',
      'SHA-1 ya no es aceptado por los navegadores: firma SHA-256 o ECDSA.',
      '"Emisor desconocido" = falta la CA intermedia en el bundle del servidor.',
      'Los navegadores validan el nombre contra el SAN; el CN por sí solo ya no basta.',
      'OCSP stapling: el servidor entrega la respuesta de revocación, más rápido y privado.',
    ],
    itemsGlossary: [
      { name: 'CA pública vs autofirmado', badge: 'Confianza', definition: 'Una CA pública está en los almacenes de confianza de los sistemas; un autofirmado solo es confiable si se instala manualmente.', whyCorrectOrRole: 'Para clientes externos se necesita un certificado de una CA pública.', criteria: ['pki-ca-type'] },
      { name: 'Algoritmo de firma', badge: 'Hash', definition: 'El algoritmo con el que la CA firma el certificado.', whyCorrectOrRole: 'SHA-256 con RSA 2048+ o ECDSA P-256 son aceptados; SHA-1 y MD5 tienen colisiones prácticas.', criteria: ['pki-sig-alg'] },
      { name: 'Cadena de confianza (CA intermedia)', badge: 'Chain', definition: 'Raíz → intermedia → certificado del servidor. El servidor debe enviar su certificado y los intermedios.', whyCorrectOrRole: 'Sin la intermedia, el cliente no puede construir la ruta hasta la raíz y muestra "emisor desconocido".', criteria: ['pki-intermediate'] },
      { name: 'Subject Alternative Name (SAN)', badge: 'Nombres', definition: 'Extensión que lista todos los nombres (FQDN e IP) válidos del certificado.', whyCorrectOrRole: 'Debe incluir portal.corp.com y www.portal.corp.com.', distractorWarning: 'Un wildcard *.corp.com cubre portal.corp.com, pero no www.portal.corp.com: solo abarca un nivel de subdominio.', criteria: ['pki-san'] },
      { name: 'OCSP stapling', badge: 'Revocación', definition: 'El servidor consulta periódicamente a la CA y adjunta la respuesta OCSP firmada en el handshake TLS.', whyCorrectOrRole: 'El cliente no necesita contactar a la CA: más rápido y sin revelar qué sitios visita.', distractorWarning: 'Las CRL son listas grandes que se descargan periódicamente; OCSP directo expone la navegación del cliente a la CA.', criteria: ['pki-ocsp'] },
    ],
  },

  'pbq-14': {
    pbqId: 'pbq-14',
    overviewRationale:
      'Un rogue AP conectado a la red cableada es un puente no autorizado hacia la LAN; un evil twin imita el SSID corporativo para robar credenciales. La respuesta combina contención inalámbrica, corte del puerto físico y una autenticación que los clientes no puedan entregar a un AP falso.',
    keyTakeaways: [
      'Rogue AP: no autorizado y conectado a tu red. Evil twin: imita tu SSID. Neighbor: AP legítimo de un vecino, no requiere acción.',
      'El WIPS puede contener el AP enviando desautenticaciones a sus clientes.',
      'El puerto del switch donde está conectado se apaga o se protege con port security / 802.1X.',
      'EAP-TLS con validación del certificado del servidor impide que el cliente se autentique ante un AP falso.',
    ],
    itemsGlossary: [
      { name: 'Rogue AP / evil twin', badge: '2.4 Indicadores', definition: 'AP no autorizado; si además clona el SSID corporativo se le llama evil twin.', whyCorrectOrRole: 'Un BSSID desconocido que anuncia el SSID corporativo y está conectado a un puerto interno se clasifica como rogue/evil twin.', criteria: ['wips-classification'] },
      { name: 'Contención en el puerto del switch', badge: 'Cableado', definition: 'Apagar o restringir el puerto físico al que está conectado el AP.', whyCorrectOrRole: 'Elimina el puente hacia la LAN aunque el AP siga emitiendo.', criteria: ['wips-switch-port'] },
      { name: 'Contención inalámbrica (WIPS)', badge: 'RF', definition: 'El WIPS envía tramas de desautenticación a los clientes que intentan asociarse al rogue AP.', whyCorrectOrRole: 'Protege a los usuarios mientras se localiza físicamente el dispositivo.', criteria: ['wips-containment'] },
      { name: 'EAP-TLS y validación del certificado del servidor', badge: '802.1X', definition: 'Autenticación mutua con certificados: el cliente verifica que el servidor RADIUS tenga un certificado de la CA corporativa.', whyCorrectOrRole: 'Un evil twin no tiene ese certificado, así que el cliente se niega a enviarle credenciales.', distractorWarning: 'PEAP con validación de certificado desactivada es el escenario clásico de robo de credenciales con un evil twin.', criteria: ['wips-eap-tls', 'wips-cert-val'] },
    ],
  },

  'pbq-15': {
    pbqId: 'pbq-15',
    overviewRationale:
      'La gestión de vulnerabilidades prioriza por severidad (CVSS), explotabilidad y exposición, y remedia la causa raíz. Los controles compensatorios (WAF, bloqueo de IP) ganan tiempo pero no sustituyen al parche.',
    keyTakeaways: [
      'CVSS 9.0–10.0 = crítico: remediación inmediata, sobre todo si es explotable remotamente.',
      'Parche + control compensatorio (virtual patching) mientras se despliega es la respuesta más completa.',
      'Las vulnerabilidades de protocolo (POODLE) se corrigen deshabilitando versiones, no renovando certificados.',
      'Cambiar el puerto de un servicio es seguridad por oscuridad: no corrige nada.',
    ],
    itemsGlossary: [
      { name: 'Log4Shell (CVE-2021-44228)', badge: 'CVSS 10.0', definition: 'RCE en Log4j 2 mediante lookups JNDI (${jndi:ldap://...}) en datos que la aplicación registra.', whyCorrectOrRole: 'Se actualiza a Log4j 2.17.1+ y, mientras tanto, se aplica una regla WAF contra patrones ${jndi:.', distractorWarning: 'Bloquear solo las IP atacantes no sirve: cualquier dato registrado puede contener el payload.', criteria: ['f1-log4j'] },
      { name: 'Path traversal en Apache (CVE-2021-41773)', badge: 'Traversal', definition: 'Permite leer archivos fuera del DocumentRoot (y RCE con CGI) en Apache 2.4.49.', whyCorrectOrRole: 'Se actualiza Apache y se aplica "Require all denied" en el directorio raíz.', distractorWarning: 'Options -Indexes solo oculta los listados de directorio; no impide el traversal.', criteria: ['f2-traversal'] },
      { name: 'POODLE (SSLv3)', badge: 'Protocolo', definition: 'Ataque de padding oracle contra el modo CBC de SSLv3, facilitado por downgrade.', whyCorrectOrRole: 'Se deshabilitan SSLv2/SSLv3 y TLS 1.0 y se deja solo TLS 1.2/1.3.', distractorWarning: 'HSTS fuerza HTTPS pero no elimina versiones antiguas del protocolo; renovar el certificado tampoco.', criteria: ['f3-poodle'] },
      { name: 'Cifrados débiles en OpenSSH', badge: 'SSH', definition: 'Suites CBC y 3DES son vulnerables (SWEET32 y ataques a CBC).', whyCorrectOrRole: 'Se editan los Ciphers de sshd_config para permitir solo AEAD (chacha20-poly1305, aes-gcm).', distractorWarning: 'Exigir claves SSH mejora la autenticación pero no cambia el cifrado del canal.', criteria: ['f4-openssh'] },
    ],
  },

  'pbq-16': {
    pbqId: 'pbq-16',
    overviewRationale:
      'Los datos se protegen según su estado: en reposo (almacenados), en tránsito (viajando por la red) y en uso (procesándose o visibles en pantalla). Cada estado tiene controles distintos; un control de un estado no protege los otros.',
    keyTakeaways: [
      'En reposo: cifrado de disco/base de datos (TDE, BitLocker) con claves gestionadas en KMS/HSM.',
      'En tránsito: TLS 1.3/IPsec; mTLS cuando ambos extremos deben autenticarse.',
      'En uso: DLP de endpoint, controles de pantalla y portapapeles; computación confidencial en servidores.',
      'SaaS: un CASB da visibilidad y control sobre lo que se comparte en la nube.',
    ],
    itemsGlossary: [
      { name: 'Datos en reposo: TDE con KMS/HSM', badge: 'At rest', definition: 'Transparent Data Encryption cifra los archivos de la base de datos; las claves viven fuera del servidor, en un KMS o HSM.', whyCorrectOrRole: 'Un disco o backup robado es ilegible sin la clave.', distractorWarning: 'Un hash verifica integridad, no da confidencialidad; RBAC controla quién consulta, pero no protege el archivo robado.', criteria: ['dlp-at-rest'] },
      { name: 'Datos en tránsito: TLS 1.3 con mTLS', badge: 'In transit', definition: 'Canal cifrado y autenticado en el que tanto cliente como servidor presentan certificados.', whyCorrectOrRole: 'Protege la API entre servicios y garantiza que cada extremo es quien dice ser.', distractorWarning: 'HMAC da integridad pero no confidencialidad; Base64 es solo codificación.', criteria: ['dlp-in-transit'] },
      { name: 'Datos en uso: DLP de endpoint', badge: 'In use', definition: 'Agente que controla copias a USB, portapapeles, impresión y capturas de pantalla según la clasificación del dato.', whyCorrectOrRole: 'Es lo único que actúa cuando el dato ya está descifrado en la estación.', distractorWarning: 'BitLocker protege el disco apagado: no impide que un usuario copie PII a un USB.', criteria: ['dlp-in-use'] },
      { name: 'CASB en modo API', badge: 'SaaS', definition: 'Se conecta a las API del proveedor SaaS para escanear contenido, detectar enlaces públicos y aplicar políticas.', whyCorrectOrRole: 'Detecta y revoca la PII compartida en el almacenamiento SaaS.', criteria: ['dlp-casb'] },
    ],
  },

  'pbq-17': {
    pbqId: 'pbq-17',
    overviewRationale:
      'El ciclo de respuesta a incidentes define qué hacer y en qué orden. CompTIA SY0-701 lo describe como: preparación, detección, análisis, contención, erradicación, recuperación y lecciones aprendidas (NIST SP 800-61 agrupa algunas fases, pero el orden es el mismo).',
    keyTakeaways: [
      'Preparación ocurre antes del incidente; lecciones aprendidas, después de cerrarlo.',
      'Contener (limitar el daño) siempre va antes de erradicar (eliminar la causa).',
      'Reinstalar desde una imagen limpia es erradicación; volver a producción y monitorear es recuperación.',
      'La reunión post-incidente alimenta la preparación del próximo ciclo.',
    ],
    itemsGlossary: [
      { name: 'Preparación', badge: 'Fase 1', definition: 'Playbooks, entrenamiento, herramientas, contactos y backups verificados antes de que ocurra un incidente.', whyCorrectOrRole: 'Actualizar playbooks y validar backups offline es preparación.', criteria: ['act-backup-playbook'] },
      { name: 'Detección y análisis', badge: 'Fase 2', definition: 'Confirmar el incidente, determinar alcance, vector inicial y sistemas afectados.', whyCorrectOrRole: 'Correlacionar alertas del SIEM y analizar hashes en sandbox.', criteria: ['act-correlate-siem'] },
      { name: 'Contención', badge: 'Fase 3', definition: 'Detener la propagación preservando evidencia.', whyCorrectOrRole: 'Aislar el host en una VLAN de cuarentena y deshabilitar cuentas.', distractorWarning: 'Apagar el equipo también contiene, pero destruye la memoria volátil: el examen prefiere aislar de la red.', criteria: ['act-isolate-vlan'] },
      { name: 'Erradicación', badge: 'Fase 4', definition: 'Eliminar la causa raíz: malware, persistencia, cuentas y credenciales comprometidas.', whyCorrectOrRole: 'Limpiar registro, matar procesos C2, revocar credenciales y reinstalar.', criteria: ['act-wipe-malware'] },
      { name: 'Recuperación', badge: 'Fase 5', definition: 'Restaurar servicios a producción de forma controlada y vigilada.', whyCorrectOrRole: 'Restaurar desde backups limpios, reconectar por fases y monitorear 72 h.', criteria: ['act-restore-backup'] },
      { name: 'Lecciones aprendidas', badge: 'Fase 6', definition: 'Análisis post-incidente: línea de tiempo, causa raíz y mejoras.', whyCorrectOrRole: 'Reunión con la dirección y actualización de directivas.', criteria: ['act-post-mortem'] },
    ],
  },

  'pbq-18': {
    pbqId: 'pbq-18',
    overviewRationale:
      'Endurecer contenedores significa reducir lo que un atacante puede hacer si compromete la aplicación: menos binarios en la imagen, sin privilegios de root, sin secretos expuestos, sin comunicación libre con otros pods y sin poder modificar el sistema de archivos.',
    keyTakeaways: [
      'Imágenes mínimas (distroless): sin shell ni gestor de paquetes = menos herramientas para el atacante y menos CVE.',
      'runAsNonRoot / runAsUser distinto de 0.',
      'Los Secrets de Kubernetes solo están codificados en base64: se necesita cifrado en etcd o un gestor externo (Vault/KMS).',
      'Kubernetes permite todo el tráfico entre pods por defecto: hace falta una NetworkPolicy default-deny.',
    ],
    itemsGlossary: [
      { name: 'Imagen base mínima (distroless)', badge: 'Superficie', definition: 'Imagen que solo contiene la aplicación y sus dependencias de ejecución.', whyCorrectOrRole: 'Sin bash, curl ni apt, un atacante no tiene herramientas para moverse.', criteria: ['k8s-image'] },
      { name: 'Usuario no root', badge: 'SecurityContext', definition: 'El proceso del contenedor se ejecuta con un UID sin privilegios.', whyCorrectOrRole: 'Limita el impacto de una fuga del contenedor hacia el host.', criteria: ['k8s-user'] },
      { name: 'Gestión de secretos (Vault / CSI)', badge: 'Secrets', definition: 'Los secretos se inyectan en tiempo de ejecución desde una bóveda externa, montados en memoria.', whyCorrectOrRole: 'No quedan en la imagen, en variables de entorno ni en etcd sin cifrar.', distractorWarning: 'Un Secret de Kubernetes "estándar" NO está cifrado: base64 es solo codificación.', criteria: ['k8s-secrets'] },
      { name: 'NetworkPolicy default-deny', badge: 'Microsegmentación', definition: 'Política que bloquea todo el tráfico de entrada y salida del pod salvo lo permitido explícitamente por etiquetas.', whyCorrectOrRole: 'Un pod comprometido no puede alcanzar a los demás.', criteria: ['k8s-network'] },
      { name: 'readOnlyRootFilesystem', badge: 'Inmutabilidad', definition: 'Monta el sistema de archivos raíz en solo lectura; las escrituras temporales van a un volumen emptyDir.', whyCorrectOrRole: 'El atacante no puede reemplazar binarios ni dejar persistencia.', criteria: ['k8s-fs'] },
    ],
  },

  'pbq-19': {
    pbqId: 'pbq-19',
    overviewRationale:
      'La seguridad física se diseña en capas, desde el perímetro hasta el rack, y además debe proteger los equipos del entorno (fuego, calor, emanaciones).',
    keyTakeaways: [
      'Bolardos crash-rated detienen vehículos; las cercas y barreras levadizas no.',
      'El vestíbulo de control de acceso (mantrap) es el control específico contra tailgating/piggybacking.',
      'En salas de servidores se usan agentes limpios (FM-200, Novec 1230): no conducen electricidad ni dejan residuos.',
      'Pasillos fríos/calientes separan el aire de entrada del de salida.',
      'La jaula de Faraday bloquea emisiones electromagnéticas (TEMPEST).',
    ],
    itemsGlossary: [
      { name: 'Bolardos certificados anti-impacto', badge: '1.2 Física', definition: 'Postes de acero diseñados y probados para detener un vehículo a una velocidad determinada.', whyCorrectOrRole: 'Es el único control que detiene una embestida vehicular.', distractorWarning: 'Una barrera levadiza controla el paso de vehículos autorizados, pero no detiene uno que la embiste.', criteria: ['phys-bollard'] },
      { name: 'Vestíbulo de control de acceso (mantrap)', badge: 'Anti-tailgating', definition: 'Espacio con dos puertas: la segunda no abre hasta que la primera se cierra y la persona se autentica.', whyCorrectOrRole: 'Impide que alguien entre detrás de un empleado.', distractorWarning: 'Un lector biométrico en una sola puerta sigue permitiendo el tailgating: autentica a una persona, pero entran dos.', criteria: ['phys-mantrap'] },
      { name: 'Supresión por agente limpio', badge: 'Incendio', definition: 'Gases como FM-200 o Novec 1230 extinguen el fuego sin agua y sin residuos.', whyCorrectOrRole: 'Protege los equipos energizados.', distractorWarning: 'Dry pipe y pre-action siguen descargando agua; solo retrasan su llegada a las tuberías.', criteria: ['phys-gas'] },
      { name: 'Contención de pasillos fríos y calientes', badge: 'HVAC', definition: 'Los racks se enfrentan en filas alternas: el frente toma aire frío y la parte trasera expulsa aire caliente a pasillos separados.', whyCorrectOrRole: 'Evita mezclar aire caliente con la entrada de los equipos.', criteria: ['phys-thermal'] },
      { name: 'Jaula de Faraday / TEMPEST', badge: 'EMI', definition: 'Recinto conductor conectado a tierra que bloquea campos electromagnéticos.', whyCorrectOrRole: 'Impide capturar las emanaciones de los equipos desde fuera.', distractorWarning: 'El hormigón grueso atenúa algunas señales pero no es un apantallamiento electromagnético.', criteria: ['phys-faraday'] },
    ],
  },

  'pbq-20': {
    pbqId: 'pbq-20',
    overviewRationale:
      'El análisis de impacto al negocio (BIA) fija cuánto tiempo puede estar caído un servicio (RTO) y cuántos datos se pueden perder (RPO). Esas métricas determinan el tipo de sitio alternativo y la estrategia de copias.',
    keyTakeaways: [
      'RTO = tiempo máximo de recuperación del servicio. RPO = pérdida máxima de datos, medida en tiempo.',
      'Hot site: listo en minutos/horas. Warm: hardware sin datos actuales (horas/días). Cold: solo instalaciones (días/semanas).',
      'Regla 3-2-1: 3 copias, 2 medios distintos, 1 fuera del sitio.',
      'Las copias inmutables (WORM) o offline resisten a un ransomware con credenciales de administrador.',
    ],
    itemsGlossary: [
      { name: 'RTO (Recovery Time Objective)', badge: '5.2 BIA', definition: 'Tiempo máximo aceptable para restaurar un servicio tras una interrupción.', whyCorrectOrRole: 'El SLA tolera 2 horas: RTO < 2 h.', criteria: ['dr-rto'] },
      { name: 'RPO (Recovery Point Objective)', badge: '5.2 BIA', definition: 'Cantidad máxima de datos que se puede perder, medida como tiempo desde la última copia.', whyCorrectOrRole: 'No se pueden perder más de 15 minutos: se necesita replicación cada 15 minutos o continua.', distractorWarning: 'Confundir RPO con RTO es la trampa más común: RPO habla de datos, RTO de tiempo de caída.', criteria: ['dr-rpo'] },
      { name: 'Hot site', badge: '3.4 Resiliencia', definition: 'Sitio alternativo con infraestructura duplicada y datos replicados, listo para conmutar.', whyCorrectOrRole: 'Es el único que cumple un RTO de menos de 2 horas.', distractorWarning: 'Un warm site requiere restaurar datos desde backup: tarda horas o días.', criteria: ['dr-site'] },
      { name: 'Regla 3-2-1', badge: 'Backups', definition: 'Tres copias de los datos en dos tipos de medio distintos, con una fuera del sitio.', whyCorrectOrRole: 'Sobrevive a la pérdida del sitio principal y a la falla de un medio.', distractorWarning: 'La replicación síncrona copia también los borrados y el cifrado del ransomware: no es un backup.', criteria: ['dr-backup'] },
      { name: 'Almacenamiento inmutable (WORM)', badge: 'Ransomware', definition: 'Las copias no pueden modificarse ni borrarse hasta que expire el bloqueo de retención, ni siquiera por un administrador.', whyCorrectOrRole: 'Un ransomware con credenciales robadas no puede destruirlas.', distractorWarning: 'Cifrar los backups protege su confidencialidad, no impide que el atacante los borre.', criteria: ['dr-worm'] },
    ],
  },

  'pbq-21': {
    pbqId: 'pbq-21',
    overviewRationale:
      'Para clasificar un ataque de ingeniería social se identifican tres cosas: el canal (SMS, voz, correo dirigido, objeto físico), la emoción o principio que explota el atacante y el control que lo neutraliza (técnico, procedimental o de concienciación).',
    keyTakeaways: [
      'Phishing = correo masivo; spear phishing = dirigido; whaling = dirigido a altos ejecutivos; smishing = SMS; vishing = voz.',
      'BEC (Business Email Compromise) busca desviar pagos suplantando a un ejecutivo o proveedor.',
      'Principios de influencia: autoridad, intimidación, consenso, escasez, familiaridad, confianza y urgencia.',
      'Los controles procedimentales (verificación fuera de banda, doble autorización) frenan lo que la tecnología no detecta.',
    ],
    itemsGlossary: [
      { name: 'Smishing + urgencia', badge: '2.2 Vectores', definition: 'Phishing por SMS que presiona para actuar de inmediato.', whyCorrectOrRole: 'Se combate con concienciación: no abrir enlaces de SMS y entrar por la app oficial.', criteria: ['case-1-smishing'] },
      { name: 'Vishing + autoridad', badge: 'Voz', definition: 'Llamada que suplanta a un superior o a soporte técnico.', whyCorrectOrRole: 'Se verifica llamando al número oficial registrado (fuera de banda).', distractorWarning: 'Devolver la llamada al número que dio el atacante no es verificación fuera de banda.', criteria: ['case-2-vishing'] },
      { name: 'Whaling / BEC + confianza', badge: 'Fraude', definition: 'Correo dirigido a un ejecutivo con autoridad financiera para desviar un pago.', whyCorrectOrRole: 'Se exige doble autorización y verificación de cualquier cambio de cuenta bancaria.', criteria: ['case-3-whaling'] },
      { name: 'Baiting + curiosidad/escasez', badge: 'Físico', definition: 'Dejar un medio atractivo (USB) para que la víctima lo conecte.', whyCorrectOrRole: 'Se bloquea el almacenamiento USB masivo y AutoRun por GPO.', criteria: ['case-4-baiting'] },
    ],
  },

  'pbq-23': {
    pbqId: 'pbq-23',
    overviewRationale:
      'El análisis cuantitativo expresa el riesgo en dinero: cuánto se pierde por incidente (SLE) y por año (ALE). El ALE permite comparar el costo de un control con la pérdida que evita y elegir la estrategia de tratamiento.',
    keyTakeaways: [
      'SLE = AV × EF (el EF va en decimal: 40% = 0,40).',
      'ALE = SLE × ARO. Una vez cada 4 años → ARO = 0,25.',
      'Si el costo anual del control < reducción del ALE, el control se justifica.',
      'Mitigar (control), transferir (seguro), aceptar (documentado) o evitar (dejar la actividad).',
    ],
    itemsGlossary: [
      { name: 'SLE (Single Loss Expectancy)', badge: 'AV × EF', definition: 'Pérdida esperada por un único incidente: valor del activo por porcentaje de pérdida.', whyCorrectOrRole: 'Multiplica el AV por el EF expresado en decimal.', distractorWarning: 'Multiplicar por 40 en lugar de 0,40 da un valor 100 veces mayor.', criteria: ['risk-sle'] },
      { name: 'ALE (Annualized Loss Expectancy)', badge: 'SLE × ARO', definition: 'Pérdida esperada por año.', whyCorrectOrRole: 'Multiplica el SLE por la cantidad de veces que se espera el evento por año.', criteria: ['risk-ale'] },
      { name: 'Mitigar', badge: 'Tratamiento', definition: 'Aplicar controles que reducen la probabilidad o el impacto.', whyCorrectOrRole: 'UPS/generador ante cortes eléctricos.', criteria: ['risk-treatment-1'] },
      { name: 'Transferir', badge: 'Tratamiento', definition: 'Trasladar el impacto financiero a un tercero (seguro, contrato).', whyCorrectOrRole: 'Ciberseguro ante demandas tras una brecha.', distractorWarning: 'La responsabilidad legal y reputacional no se transfiere, solo el costo.', criteria: ['risk-treatment-2'] },
      { name: 'Aceptar', badge: 'Tratamiento', definition: 'Asumir formalmente el riesgo porque mitigarlo cuesta más que la pérdida.', whyCorrectOrRole: 'Error estético cuyo arreglo cuesta más que su impacto.', criteria: ['risk-treatment-3'] },
      { name: 'Evitar', badge: 'Tratamiento', definition: 'Eliminar la actividad que genera el riesgo.', whyCorrectOrRole: 'Desmantelar un servicio legado sin uso de negocio.', criteria: ['risk-treatment-4'] },
    ],
  },

  'pbq-24': {
    pbqId: 'pbq-24',
    overviewRationale:
      'La autenticación de correo se apoya en tres registros DNS que trabajan juntos: SPF dice qué servidores pueden enviar, DKIM firma los mensajes y DMARC define qué hacer cuando fallan y a quién informar. El cifrado del transporte y el de extremo a extremo son problemas distintos.',
    keyTakeaways: [
      'SPF "-all" = hard fail (rechazar); "~all" = soft fail (marcar); "+all" = cualquiera puede enviar.',
      'DKIM: la clave privada firma en el servidor; en DNS solo se publica la pública.',
      'DMARC p=none (monitorear) → p=quarantine (spam) → p=reject (rechazar). rua = informes agregados.',
      'Submission de clientes: TCP 587 con STARTTLS (465 = SMTPS implícito). Entre MTAs: 25.',
      'S/MIME o PGP para confidencialidad y no repudio de extremo a extremo.',
    ],
    itemsGlossary: [
      { name: 'SPF', badge: 'TXT', definition: 'Lista de servidores autorizados a enviar correo del dominio.', whyCorrectOrRole: '"-all" hace que los receptores rechacen a los no autorizados.', criteria: ['email-spf'] },
      { name: 'DKIM', badge: 'Firma', definition: 'Firma digital de cabeceras y cuerpo; el receptor la verifica con la clave pública publicada en DNS.', whyCorrectOrRole: 'Se publica la clave pública con un algoritmo actual (RSA-SHA256).', distractorWarning: 'Publicar la clave privada en DNS permitiría a cualquiera firmar como tu dominio.', criteria: ['email-dkim'] },
      { name: 'DMARC', badge: 'Política', definition: 'Política que exige alineación con SPF/DKIM, indica la acción ante un fallo y solicita informes.', whyCorrectOrRole: 'p=reject con rua=mailto: rechaza la suplantación y envía informes.', distractorWarning: 'p=none solo monitorea: no protege nada.', criteria: ['email-dmarc-policy'] },
      { name: 'Submission cifrado (587 + STARTTLS)', badge: 'Transporte', definition: 'Puerto en el que los clientes envían correo al servidor, con autenticación y cifrado.', whyCorrectOrRole: 'Protege las credenciales y el contenido entre el cliente y el servidor.', distractorWarning: 'POP3 (110) es para recibir, no para enviar.', criteria: ['email-starttls'] },
      { name: 'S/MIME', badge: 'E2E', definition: 'Cifrado y firma del mensaje con certificados X.509 del remitente y del destinatario.', whyCorrectOrRole: 'El mensaje queda protegido incluso almacenado en los servidores intermedios.', distractorWarning: 'TLS solo protege cada salto entre servidores; el mensaje queda en claro en cada servidor.', criteria: ['email-smime'] },
    ],
  },

  'pbq-25': {
    pbqId: 'pbq-25',
    overviewRationale:
      'En las PBQs de línea de comandos la clave es asociar cada herramienta con la pregunta que responde. Muchas opciones distractoras son comandos reales y útiles, pero para otra cosa.',
    keyTakeaways: [
      '¿Qué está escuchando y qué proceso lo abrió? → netstat -tulpn / ss -tulpn.',
      '¿Qué tráfico pasa por la interfaz? → tcpdump (Wireshark en modo gráfico).',
      '¿Fue modificado un archivo? → comparar su hash (sha256sum / Get-FileHash).',
      '¿Quién puede leerlo? → ls -l para ver, chmod/chown para corregir.',
    ],
    itemsGlossary: [
      { name: 'netstat -tulpn / ss -tulpn', badge: 'Puertos', definition: 'Lista sockets TCP/UDP en escucha con el PID y el programa, sin resolver nombres.', whyCorrectOrRole: 'Responde exactamente "qué proceso escucha en qué puerto".', criteria: ['cli-ports'] },
      { name: 'tcpdump', badge: 'Captura', definition: 'Captura paquetes de una interfaz; puede guardarlos en .pcap para analizarlos con Wireshark.', whyCorrectOrRole: '-i eth0 elige la interfaz, -nn no resuelve nombres ni puertos y -s0 captura el paquete completo.', distractorWarning: 'nmap escanea hosts; netstat muestra conexiones, no su contenido.', criteria: ['cli-sniff'] },
      { name: 'Verificación de integridad por hash', badge: 'Integridad', definition: 'Un cambio de un solo bit cambia completamente el hash.', whyCorrectOrRole: 'Se compara el SHA-256 del binario con el de una fuente confiable.', distractorWarning: 'Las fechas de ls -la se falsifican fácilmente (timestomping).', criteria: ['cli-hash'] },
      { name: 'Permisos de /etc/shadow', badge: 'chmod/chown', definition: '/etc/shadow guarda los hashes de contraseñas.', whyCorrectOrRole: '600 (rw-------) con dueño root: solo root puede leerlo.', distractorWarning: '644 lo deja legible para todos los usuarios, que podrían crackear los hashes offline.', criteria: ['cli-permissions'] },
    ],
  },

  'pbq-26': {
    pbqId: 'pbq-26',
    overviewRationale:
      'Las reglas de detección combinan una acción con condiciones. Una buena regla es específica (pocos falsos positivos), resistente a evasiones triviales y realiza la acción adecuada según dónde esté el sensor: en línea puede bloquear, pasivo solo alertar.',
    keyTakeaways: [
      'Snort: alert (registra), drop (bloquea y registra, solo en línea), pass (ignora).',
      'El modificador nocase hace que el contenido coincida sin distinguir mayúsculas y minúsculas.',
      'YARA: la condición uint16(0) == 0x5A4D limita la regla a ejecutables PE ("MZ").',
      'Firmas demasiado genéricas ("GET /", "admin") generan falsos positivos masivos.',
    ],
    itemsGlossary: [
      { name: 'Acción drop (IPS en línea)', badge: 'Snort', definition: 'Descarta el paquete y lo registra. Solo es posible si el sensor está en línea.', whyCorrectOrRole: 'El requisito es detener el ataque, no solo verlo.', distractorWarning: 'alert solo registra; pass ignora el tráfico.', criteria: ['snort-action'] },
      { name: 'Contenido + nocase', badge: 'Firma', definition: 'content define el patrón a buscar en el payload y nocase ignora mayúsculas y minúsculas.', whyCorrectOrRole: '"UNION SELECT" con nocase detecta también "uNiOn SeLeCt".', criteria: ['snort-content'] },
      { name: 'Magic number MZ (0x5A4D)', badge: 'YARA', definition: 'Los ejecutables de Windows comienzan con los bytes "MZ"; leídos como uint16 little-endian dan 0x5A4D.', whyCorrectOrRole: 'Restringe la regla a archivos PE.', distractorWarning: '0x2550 corresponde a "%P" (inicio de "%PDF").', criteria: ['yara-magic'] },
      { name: 'Cadena de ejecución ofuscada', badge: 'Strings', definition: 'Las cadenas de la regla describen artefactos característicos del malware.', whyCorrectOrRole: '"cmd.exe /c powershell -enc" indica ejecución de PowerShell codificado en Base64, típica de droppers.', criteria: ['yara-string'] },
    ],
  },

  'pbq-27': {
    pbqId: 'pbq-27',
    overviewRationale:
      'Shift-left significa ubicar cada control lo antes posible en el pipeline, en la etapa en la que puede actuar: secretos al hacer commit, análisis del código y de las dependencias al compilar, pruebas dinámicas con la aplicación en ejecución e integridad de artefactos al desplegar.',
    keyTakeaways: [
      'SAST analiza el código fuente sin ejecutarlo (build). DAST ataca la aplicación en ejecución (test/staging).',
      'SCA/SBOM inventaría las dependencias de terceros y sus CVE.',
      'Pre-commit hooks y secret scanning evitan que tokens lleguen al repositorio.',
      'Firmar imágenes (Cosign) y verificarlas al desplegar garantiza que se ejecuta lo que se construyó.',
    ],
    itemsGlossary: [
      { name: 'Secret scanning en pre-commit', badge: 'Commit', definition: 'Hooks que bloquean el commit si detectan claves, tokens o contraseñas.', whyCorrectOrRole: 'Un secreto que llega a Git queda en el historial aunque se borre después.', criteria: ['pipe-commit'] },
      { name: 'SAST + SCA', badge: 'Build', definition: 'Análisis estático del código propio y de las dependencias de terceros.', whyCorrectOrRole: 'Detecta inyecciones, secretos y librerías vulnerables antes de generar el artefacto.', criteria: ['pipe-build'] },
      { name: 'DAST / IAST', badge: 'Test', definition: 'Pruebas contra la aplicación desplegada en staging, como lo haría un atacante.', whyCorrectOrRole: 'Encuentra fallas de configuración y de ejecución que el análisis estático no ve.', distractorWarning: 'DAST necesita la aplicación en ejecución: no puede ir en commit ni en build.', criteria: ['pipe-test'] },
      { name: 'Firma de imágenes + RASP', badge: 'Deploy', definition: 'Se verifica la firma del contenedor antes de admitirlo y se protege la aplicación en tiempo de ejecución.', whyCorrectOrRole: 'Impide desplegar imágenes alteradas o no confiables.', criteria: ['pipe-deploy'] },
    ],
  },

  'pbq-28': {
    pbqId: 'pbq-28',
    overviewRationale:
      'Cada ataque criptográfico explota una debilidad concreta, y la contramedida elimina esa debilidad. Por eso la pregunta clave es: ¿qué se está aprovechando el atacante?',
    keyTakeaways: [
      'Rainbow table → precálculo → salt único por usuario + key stretching.',
      'Colisión / birthday → hash con poco espacio de salida → SHA-256 o superior.',
      'Replay → token reutilizable → nonce, timestamp y expiración.',
      'Downgrade → protocolo antiguo habilitado → deshabilitarlo + HSTS.',
    ],
    itemsGlossary: [
      { name: 'Rainbow tables', badge: 'Hashes', definition: 'Tablas precalculadas de hash → contraseña.', whyCorrectOrRole: 'El salt hace que cada hash sea único, así que una tabla precalculada no sirve.', criteria: ['c1-rainbow'] },
      { name: 'Birthday attack (colisiones)', badge: 'Hash', definition: 'Encontrar dos entradas distintas con el mismo hash; la paradoja del cumpleaños reduce el esfuerzo a la raíz cuadrada del espacio.', whyCorrectOrRole: 'SHA-1 tiene colisiones prácticas: se migra a SHA-256/512.', criteria: ['c2-birthday'] },
      { name: 'Replay', badge: 'Sesión', definition: 'Reenviar un mensaje de autenticación válido capturado.', whyCorrectOrRole: 'Los nonces y timestamps hacen que cada mensaje sirva una sola vez.', distractorWarning: 'Cifrar el canal no impide que se reenvíe un token que sigue siendo válido.', criteria: ['c3-replay'] },
      { name: 'Downgrade', badge: 'Protocolo', definition: 'Forzar la negociación hacia una versión o suite débil.', whyCorrectOrRole: 'Se deshabilitan SSLv3/TLS 1.0 en el servidor y se exige HSTS.', criteria: ['c4-downgrade'] },
    ],
  },

  'pbq-29': {
    pbqId: 'pbq-29',
    overviewRationale:
      'Los protocolos de identidad federada resuelven problemas distintos: autenticar (¿quién eres?), autorizar (¿a qué puedes acceder?) y aprovisionar (crear y borrar cuentas). Elegir el protocolo correcto depende de cuál de esos problemas plantea el escenario.',
    keyTakeaways: [
      'SAML 2.0: aserciones XML, SSO web empresarial.',
      'OAuth 2.0: autorización delegada con access tokens; no autentica por sí mismo.',
      'OpenID Connect: capa de identidad sobre OAuth 2.0, ID token JWT firmado; ideal para móvil y SPA.',
      'SCIM: API estándar para crear, actualizar y eliminar cuentas entre dominios.',
    ],
    itemsGlossary: [
      { name: 'SAML 2.0', badge: 'SSO web', definition: 'El IdP emite una aserción XML firmada que el proveedor de servicio confía.', whyCorrectOrRole: 'Es el estándar de SSO con SaaS empresariales como Salesforce o Workday.', criteria: ['fed-saml'] },
      { name: 'OAuth 2.0', badge: 'Autorización', definition: 'El usuario concede a una aplicación un token con alcance limitado (scopes) sin compartir su contraseña.', whyCorrectOrRole: 'Resuelve el acceso delegado a una API de terceros.', distractorWarning: 'Las API keys estáticas no expresan el consentimiento del usuario ni caducan.', criteria: ['fed-oauth'] },
      { name: 'OpenID Connect', badge: 'Identidad', definition: 'Agrega un ID token (JWT firmado) con los datos del usuario a un flujo OAuth 2.0.', whyCorrectOrRole: 'Las apps móviles y SPA obtienen así una identidad verificable.', distractorWarning: 'OAuth 2.0 solo, sin OIDC, autoriza pero no dice quién es el usuario.', criteria: ['fed-oidc'] },
      { name: 'SCIM', badge: 'Provisioning', definition: 'Protocolo REST estándar para el ciclo de vida de cuentas entre sistemas.', whyCorrectOrRole: 'Crea y elimina cuentas en la nube automáticamente cuando cambian en AD.', distractorWarning: 'El JIT provisioning de SAML crea cuentas al primer login, pero no las elimina cuando el usuario se va.', criteria: ['fed-scim'] },
    ],
  },

  'pbq-30': {
    pbqId: 'pbq-30',
    overviewRationale:
      'En BYOD el dispositivo es del empleado: la organización protege sus datos y aplicaciones, no el teléfono entero. MDM gestiona el dispositivo; MAM gestiona las aplicaciones y los datos corporativos dentro de él.',
    keyTakeaways: [
      'BYOD → selective wipe (solo datos corporativos). COPE/corporativo → full wipe.',
      'MAM con contenedor: impide copiar o compartir datos corporativos hacia aplicaciones personales.',
      'Jailbreak/root anula los controles del sistema operativo: bloquear y poner en cuarentena.',
      'Geofencing: aplicar políticas automáticamente según la ubicación física.',
    ],
    itemsGlossary: [
      { name: 'Selective wipe', badge: 'BYOD', definition: 'Borrado remoto solo del contenedor, cuentas y aplicaciones corporativas.', whyCorrectOrRole: 'Protege los datos de la empresa sin destruir fotos ni datos personales.', distractorWarning: 'Un full wipe en un dispositivo personal tiene implicaciones legales y de privacidad.', criteria: ['mob-wipe'] },
      { name: 'MAM y contenedorización', badge: 'Apps', definition: 'Políticas a nivel de aplicación: cifrado del contenedor, bloqueo de copiar/pegar y de "compartir con" hacia apps no gestionadas.', whyCorrectOrRole: 'Evita la fuga entre apps corporativas y personales.', distractorWarning: 'El cifrado completo del dispositivo protege contra robo, no contra copiar datos a una app personal.', criteria: ['mob-mam'] },
      { name: 'Detección de jailbreak/root', badge: 'Cumplimiento', definition: 'El MDM detecta que se eliminaron las protecciones del sistema operativo.', whyCorrectOrRole: 'Se bloquea el acceso y se pone en cuarentena automáticamente.', criteria: ['mob-root'] },
      { name: 'Geofencing', badge: 'Ubicación', definition: 'Aplicar o retirar políticas cuando el dispositivo entra en un área geográfica definida.', whyCorrectOrRole: 'Desactiva cámara y micrófono al entrar a salas restringidas.', criteria: ['mob-geo'] },
    ],
  },
};
