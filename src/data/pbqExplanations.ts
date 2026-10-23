import { PBQExplanationData } from '../types/pbq';

export const PBQ_EXPLANATIONS: Record<string, PBQExplanationData> = {
  // ==========================================
  // PBQ 1: Network Architecture & Defense-in-Depth
  // ==========================================
  'pbq-1': {
    pbqId: 'pbq-1',
    overviewRationale:
      'La arquitectura de red de defensa en profundidad exige una segmentación estricta en tres zonas principales: Perímetro Externo (borde sin confianza), DMZ (Zona Desmilitarizada para servicios de cara a Internet con riesgo calculado) y LAN Interna (Zona de Confianza donde residen datos corporativos). Los controles de seguridad deben colocarse donde su visibilidad e inspección sean máximas: el NGFW filtra el tráfico no deseado en la frontera, el WAF inspecciona exclusivamente peticiones HTTP/S de Capa 7 antes de alcanzar a los servidores web en la DMZ, el Mail Gateway filtra spam y phishing antes del relay interno, y la Base de Datos reside estrictamente en la LAN aislada de Internet directo.',
    keyTakeaways: [
      'El WAF (Web Application Firewall) opera exclusivamente en Capa 7 (HTTP/S) y debe colocarse en la DMZ o delante de los Web Servers, NUNCA en el borde puro reemplazando al NGFW.',
      'Los servidores de Base de Datos contienen PII/activos críticos y NUNCA deben ubicarse en la DMZ; requieren estar en la LAN interna con acceso restringido solo desde la DMZ.',
      'El VPN Concentrator se ubica en el perímetro/DMZ para terminar túneles cifrados IPsec/TLS y autenticar usuarios remotos antes de otorgar acceso a la red interna.',
      'El SIEM recopila telemetría de todas las zonas pero su consola y almacenamiento central residen en la red segura de gestión/LAN interna.'
    ],
    itemsGlossary: [
      {
        name: 'NGFW / UTM (Next-Generation Firewall / Unified Threat Management)',
        badge: 'Perímetro Externo',
        definition:
          'Dispositivo de seguridad perimetral que combina filtrado de paquetes con inspección de estado, prevención de intrusiones (IPS), control de aplicaciones y análisis antivirus a velocidad de cable.',
        whyCorrectOrRole:
          'Es la primera línea de defensa perimetral. Controla el flujo entre la WAN pública no confiable y las zonas protegidas (DMZ y LAN interna), denegando tráfico no autorizado por defecto.',
        distractorWarning:
          'Ubicar un WAF en lugar del NGFW en el perímetro exterior dejaría desprotegidos todos los protocolos no-web (DNS, SSH, VPN, ICMP) ante ataques volumétricos.'
      },
      {
        name: 'WAF (Web Application Firewall)',
        badge: 'DMZ / Capa 7',
        definition:
          'Dispositivo o módulo que inspecciona el contenido de peticiones y respuestas HTTP y HTTPS (Capa de Aplicación OSI), buscando patrones de inyección SQL, Cross-Site Scripting (XSS), CSRF y violaciones OWASP Top 10.',
        whyCorrectOrRole:
          'Se coloca en la DMZ inmediatamente delante de los servidores Web. Termina o analiza TLS para descifrar e inspeccionar la carga útil HTTP antes de que alcance el backend.',
        distractorWarning:
          'Un firewall tradicional de Capa 4 no puede detectar ataques de inyección SQL dentro de un paquete TCP 443 legítimo. Solo el WAF tiene visibilidad de Capa 7.'
      },
      {
        name: 'Servidor Web (Web Server / Reverse Proxy)',
        badge: 'DMZ',
        definition:
          'Host que entrega contenido y servicios web públicos a clientes externos a través de los puertos 80 y 443.',
        whyCorrectOrRole:
          'Debe residir en la DMZ porque está directamente expuesto a peticiones externas no autenticadas. Si es comprometido, la DMZ impide que el atacante pivote libremente a la LAN interna.',
        distractorWarning:
          'Colocar el Web Server en la LAN interna violaría el principio de segmentación de zonas y expondría toda la intranet corporativa si el servidor web sufre una brecha.'
      },
      {
        name: 'Servidor de Base de Datos (Database Server)',
        badge: 'LAN Interna',
        definition:
          'Sistema que almacena y gestiona datos estructurados confidenciales (SQL/NoSQL) como registros de clientes, tarjetas de pago o contraseñas con hash.',
        whyCorrectOrRole:
          'Debe residir en la LAN interna protegida detrás de un firewall interno. Solo debe aceptar conexiones en su puerto específico (ej. MySQL 3306 o PostgreSQL 5432) originadas exclusivamente desde el Web Server de la DMZ.',
        distractorWarning:
          'Colocar una base de datos en la DMZ es una falta grave en CompTIA, ya que expone los datos confidenciales al mismo segmento de riesgo que los servidores públicos.'
      },
      {
        name: 'Mail Gateway / Secure Email Gateway (SEG)',
        badge: 'DMZ',
        definition:
          'Dispositivo de filtrado de correo que procesa correo entrante y saliente (SMTP) aplicando antispam, antivirus, validación SPF/DKIM/DMARC y protección contra phishing.',
        whyCorrectOrRole:
          'Recibe tráfico SMTP entrante (puerto 25) desde Internet, lo sanea y lo reenvía al servidor de correo interno por un canal controlado.',
        distractorWarning:
          'No debe colocarse en la LAN sin filtrado previo, ya que un adjunto malicioso infectaría el servidor interno antes de ser evaluado.'
      },
      {
        name: 'VPN Concentrator',
        badge: 'Perímetro / DMZ',
        definition:
          'Dispositivo de red especializado en la creación, cifrado, autenticación y terminación de túneles VPN de acceso remoto y sitio a sitio (IPsec o TLS).',
        whyCorrectOrRole:
          'Permite a empleados remotos conectarse de forma segura. Autentica las credenciales con MFA antes de rutear el tráfico cifrado a la red corporativa.',
        distractorWarning:
          'Ubicar el terminador VPN detrás de la LAN interna obligaría a abrir puertos hacia la LAN profunda desde Internet, aumentando drásticamente la superficie de ataque.'
      }
    ]
  },

  // ==========================================
  // PBQ 2: Stateful Firewall ACL Rules Configuration
  // ==========================================
  'pbq-2': {
    pbqId: 'pbq-2',
    overviewRationale:
      'Las listas de control de acceso (ACL) de firewalls con estado deben seguir el principio de privilegio mínimo (Least Privilege) e inspección secuencial "top-to-bottom". Cada regla especifica Origen, Destino, Protocolo, Puerto y Acción (PERMIT o DENY). La última regla obligatoria en cualquier firewall seguro es el Deny All implícito (Implicit Deny / Drop Any Any), asegurando que cualquier tráfico no autorizado explícitamente sea bloqueado y registrado.',
    keyTakeaways: [
      'Las ACL se procesan en orden numérico estricto; una vez que un paquete coincide con una regla, se aplica y se detiene la evaluación.',
      'El tráfico legítimo de usuarios a servidores web requiere puerto 443 (HTTPS) o 80 (HTTP) permitido desde la WAN a la DMZ.',
      'La administración de servidores (SSH puerto 22, RDP puerto 3389) NUNCA debe permitirse desde "Any" (Internet); debe restringirse a la IP de la estación del administrador o Bastion Host.',
      'Toda regla que bloquee o permita tráfico sensible debe tener activado el registro (Logging) para auditoría SIEM.'
    ],
    itemsGlossary: [
      {
        name: 'Regla 10: Permitir HTTPS WAN -> Web DMZ (TCP 443)',
        badge: 'Regla PERMIT',
        definition:
          'Regla que autoriza peticiones web seguras mediante TLS desde cualquier dirección IP externa hacia la IP estática del servidor web en la DMZ.',
        whyCorrectOrRole:
          'Permite la operación del negocio público mientras restringe el destino estrictamente al puerto 443 del servidor web, sin exponer otros servicios del host.',
        distractorWarning:
          'Permitir puerto 80 sin forzar redirección o permitir "Any Port" hacia el servidor web abriría vectores de ataque a servicios auxiliares no auditados.'
      },
      {
        name: 'Regla 20: Permitir SSH desde Bastion/Admin IP a Servidores (TCP 22)',
        badge: 'Regla PERMIT Restringida',
        definition:
          'Regla de gestión remota mediante Secure Shell que autoriza tráfico administrativo únicamente desde la IP fija de la estación de trabajo de administración.',
        whyCorrectOrRole:
          'Garantiza que la administración de sistemas esté encriptada y que solo hosts autorizados dentro del segmento de seguridad puedan negociar sesiones SSH.',
        distractorWarning:
          'Permitir SSH desde origen "Any" expondría los servidores a ataques automatizados de fuerza bruta e intentos de explotación de credenciales.'
      },
      {
        name: 'Regla 30: Bloquear Tráfico no Solicitado WAN -> LAN (TCP/UDP Any)',
        badge: 'Regla DENY Perimétrico',
        definition:
          'Regla explícita de bloqueo que impide el paso de paquetes originados en Internet con destino a las subredes privadas internas (RFC 1918).',
        whyCorrectOrRole:
          'Aísla completamente los puestos de trabajo y servidores de la LAN interna de accesos externos directos.',
        distractorWarning:
          'Confiar únicamente en NAT sin reglas de firewall explícitas es una vulnerabilidad conceptual en los exámenes CompTIA.'
      },
      {
        name: 'Regla 99: Deny All Implícito (Drop / Reject Any Any)',
        badge: 'Regla por Defecto',
        definition:
          'Regla final que descarta silenciosamente (Drop) o rechaza (Reject) cualquier paquete que no haya coincidido con ninguna de las reglas permisivas anteriores.',
        whyCorrectOrRole:
          'Es el estándar de seguridad fundamental de CompTIA: arquitectura de confianza cero a nivel de red ("Default Deny").',
        distractorWarning:
          'Omitir la regla Deny All o colocar una regla Permit All al final convertiría al firewall en un simple router, permitiendo el ingreso indiscriminado de atacantes.'
      }
    ]
  },

  // ==========================================
  // PBQ 3: SIEM Log Analysis & Incident Identification
  // ==========================================
  'pbq-3': {
    pbqId: 'pbq-3',
    overviewRationale:
      'El análisis de registros en un SIEM (Security Information and Event Management) permite correlacionar eventos de múltiples fuentes (Active Directory, firewalls, servidores web y EDR). Los identificadores de eventos de Windows (Event ID) son estándares en CompTIA: Event ID 4625 representa un inicio de sesión fallido, Event ID 4624 representa un inicio de sesión exitoso, y Event ID 4740 indica un bloqueo de cuenta por exceso de intentos erróneos. Cientos de eventos 4625 seguidos en segundos señalan un ataque de fuerza bruta o Password Spraying.',
    keyTakeaways: [
      'Event ID 4625 = Error de autenticación (Failed Logon). Múltiples eventos consecutivos en segundos indican Fuerza Bruta.',
      'Event ID 4624 = Autenticación exitosa (Successful Logon). Si ocurre inmediatamente tras múltiples 4625, la cuenta fue comprometida.',
      'Event ID 4740 = Cuenta bloqueada (Account Locked Out) por exceder el umbral de intentos fallidos.',
      'Acción de mitigación inmediata: Aislar el host comprometido de la red (Network Quarantine/Containment) y restablecer credenciales con revocación de tokens.'
    ],
    itemsGlossary: [
      {
        name: 'Windows Event ID 4625 (Logon Failure)',
        badge: 'Log de Auditoría AD',
        definition:
          'Evento generado en el controlador de dominio o equipo local cuando un intento de inicio de sesión falla debido a contraseña incorrecta, usuario inexistente o cuenta deshabilitada.',
        whyCorrectOrRole:
          'Identifica el vector de ataque inicial. Un volumen alto de este evento confirma un ataque de diccionario o fuerza bruta en curso.',
        distractorWarning:
          'Confundirlo con el Event ID 4624 provocaría no advertir la ráfaga de ataques fallidos previos a la brecha.'
      },
      {
        name: 'Windows Event ID 4624 (Logon Success)',
        badge: 'Log de Auditoría AD',
        definition:
          'Evento generado cuando una sesión de usuario se establece exitosamente. El tipo de inicio de sesión (Logon Type 3 = Red/SMB, Logon Type 10 = RDP) revela el método de conexión.',
        whyCorrectOrRole:
          'Permite identificar el momento exacto en que el atacante tuvo éxito y la IP desde la cual se autenticó.',
        distractorWarning:
          'Un 4624 aislado es tráfico normal; solo es malicioso cuando va precedido de ráfagas 4625 o proviene de IPs anómalas fuera del horario laboral.'
      },
      {
        name: 'Event ID 4740 (Account Lockout)',
        badge: 'Alerta de Política',
        definition:
          'Evento que indica que una cuenta ha sido bloqueada automáticamente por la política de bloqueo de cuentas tras superar el umbral de intentos fallidos permitidos.',
        whyCorrectOrRole:
          'Demuestra que el mecanismo de contención por políticas de grupo (GPO) se disparó para frenar el ataque continuo.',
        distractorWarning:
          'Si la política de bloqueo no existe, el atacante puede seguir adivinando contraseñas indefinidamente sin ser bloqueado.'
      },
      {
        name: 'Contención: Aislamiento de Red del Host (EDR Host Isolation)',
        badge: 'Fase de Respuesta',
        definition:
          'Medida ejecutada mediante el agente EDR que bloquea todo el tráfico de red del equipo excepto la comunicación de telemetría con la consola de seguridad.',
        whyCorrectOrRole:
          'Detiene de inmediato el movimiento lateral del atacante hacia otros equipos de la empresa sin perder la memoria RAM para el análisis forense.',
        distractorWarning:
          'Apagar el equipo o desenchufar la corriente borra la memoria RAM volátil, destruyendo artefactos forenses vitales según el Orden de Volatilidad.'
      }
    ]
  },

  // ==========================================
  // PBQ 4: Incident Response Lifecycle (NIST SP 800-61 Rev 2)
  // ==========================================
  'pbq-4': {
    pbqId: 'pbq-4',
    overviewRationale:
      'NIST SP 800-61 define el ciclo de vida de respuesta a incidentes en 4 fases principales: 1. Preparación, 2. Detección y Análisis, 3. Contención, Erradicación y Recuperación, y 4. Actividad Post-Incidente (Lecciones Aprendidas). CompTIA evalúa la estricta secuencia lógica de estas fases: nunca se erradica una amenaza antes de contener su propagación, y nunca se restauran servicios sin haber eliminado la persistencia y la causa raíz.',
    keyTakeaways: [
      'Preparación: Crear políticas, entrenar al CSIRT y desplegar herramientas antes de que ocurra cualquier incidente.',
      'Detección y Análisis: Triaje de alertas, validación de falsos positivos y determinación del alcance del ataque.',
      'Contención: Aislar hosts y revocar credenciales comprometidas para frenar la propagación antes de modificar los sistemas.',
      'Erradicación: Eliminar artefactos de malware, puertas traseras y cuentas ilícitas creadas por el atacante.',
      'Recuperación: Restaurar sistemas desde copias de seguridad limpias probadas y monitorear el retorno a producción.',
      'Lecciones Aprendidas: Reunión post-mortem para documentar fallos, actualizar playbooks y calcular el impacto total.'
    ],
    itemsGlossary: [
      {
        name: 'Fase 1: Preparación (Preparation)',
        badge: 'Fase Preventiva',
        definition:
          'Fase en la que se establecen las capacidades de respuesta: redacción de playbooks, formación del CSIRT, configuración de copias de seguridad inmutables y hardening.',
        whyCorrectOrRole:
          'Sin preparación previa, los analistas no disponen de procedimientos claros ni herramientas para actuar bajo presión.',
        distractorWarning:
          'No puede ser posterior al incidente. Intentar preparar procedimientos durante un ataque activo conduce al caos organizativo.'
      },
      {
        name: 'Fase 2: Detección y Análisis (Detection & Analysis)',
        badge: 'Triaje y Scope',
        definition:
          'Identificación de anomalías mediante SIEM, EDR o IDS, seguida de la verificación técnica para confirmar si se trata de un incidente real y evaluar su severidad.',
        whyCorrectOrRole:
          'Permite categorizar la amenaza y entender qué activos han sido comprometidos antes de tomar medidas precipitadas.',
        distractorWarning:
          'Saltar directo a la contención sin analizar el alcance puede provocar que se aísle un host mientras el atacante mantiene persistencia en otros tres.'
      },
      {
        name: 'Fase 3: Contención (Containment)',
        badge: 'Frenado de Fuga',
        definition:
          'Medidas tácticas a corto y largo plazo para limitar el daño y prevenir la propagación del ataque (ej. aislamiento de red, bloqueo de IPs, desconexión de VLANs).',
        whyCorrectOrRole:
          'Garantiza que la fuga de datos o el cifrado por ransomware se detenga mientras se preserva la evidencia forense.',
        distractorWarning:
          'Erradicar el malware antes de contener permite al atacante detectar que ha sido descubierto y desplegar mecanismos destructivos o wipers.'
      },
      {
        name: 'Fase 4: Erradicación (Eradication)',
        badge: 'Eliminación',
        definition:
          'Proceso de eliminar completamente la causa raíz y cualquier componente malicioso introducido (código malicioso, cuentas backdoor, tareas programadas).',
        whyCorrectOrRole:
          'Asegura que el entorno esté 100% limpio antes de intentar restaurar los servicios a su estado normal.',
        distractorWarning:
          'Recuperar copias de seguridad sin erradicar la puerta trasera resultará en una reinfección inmediata.'
      },
      {
        name: 'Fase 5: Recuperación (Recovery)',
        badge: 'Restauración',
        definition:
          'Restauración de sistemas y servicios afectados a operación productiva normal, validando la integridad del sistema e implementando monitoreo reforzado.',
        whyCorrectOrRole:
          'Devuelve la continuidad del negocio con garantías de que la vulnerabilidad explotada ha sido parcheada.',
        distractorWarning:
          'Acelerar la recuperación sin monitoreo posterior puede dejar pasar amenazas durmientes.'
      },
      {
        name: 'Fase 6: Lecciones Aprendidas (Lessons Learned)',
        badge: 'Post-Mortem',
        definition:
          'Reunión y reporte formal celebrado dentro de las 2 semanas posteriores al cierre del incidente para evaluar qué funcionó, qué falló y cómo mejorar.',
        whyCorrectOrRole:
          'Cierra el ciclo de retroalimentación continua exigido por NIST y CompTIA para elevar la madurez de seguridad.',
        distractorWarning:
          'Omitir esta fase garantiza que la organización vuelva a cometer los mismos errores en futuros incidentes.'
      }
    ]
  },

  // ==========================================
  // PBQ 6: Cryptographic Algorithms & PKI Primitives
  // ==========================================
  'pbq-6': {
    pbqId: 'pbq-6',
    overviewRationale:
      'La criptografía moderna en CompTIA SY0-701 se divide en tres dominios matemáticos: 1. Cifrado Simétrico (misma clave para cifrar y descifrar, alta velocidad para datos en reposo y en tránsito: AES-GCM, ChaCha20), 2. Cifrado Asimétrico (par de claves pública/privada para intercambio de claves y no repudio: RSA, ECC, Diffie-Hellman), y 3. Funciones Hash Criptográficas (resumen unidireccional de longitud fija para integridad: SHA-256, SHA-3). Los algoritmos obsoletos y vulnerables (MD5, SHA-1, DES, RC4) están estrictamente prohibidos.',
    keyTakeaways: [
      'AES-256 (GCM): El estándar de oro para confidencialidad e integridad autenticada (AEAD) en datos en reposo y sesiones TLS.',
      'RSA (mínimo 2048 o 4096 bits) y ECC (Curvas Elípticas como ECDSA/Ed25519): Algoritmos asimétricos usados para firmas digitales e intercambio de claves.',
      'ECC ofrece la misma seguridad que RSA con claves mucho más cortas (ECC 256 bits equivale a RSA 3072 bits), ideal para dispositivos móviles y IoT.',
      'MD5 y SHA-1 son vulnerables a ataques de colisión y están descartados para cualquier uso de seguridad en el examen.'
    ],
    itemsGlossary: [
      {
        name: 'AES-256 GCM (Galois/Counter Mode)',
        badge: 'Simétrico / AEAD',
        definition:
          'Algoritmo de cifrado por bloques simétrico de 256 bits que proporciona simultáneamente confidencialidad y autenticación de integridad (Authenticated Encryption).',
        whyCorrectOrRole:
          'Es el estándar aprobado por NIST y CompTIA para cifrado de almacenamiento masivo, bases de datos y transporte seguro.',
        distractorWarning:
          'Usar modo ECB (Electronic Codebook) en lugar de GCM revela patrones en el texto cifrado ("el pingüino de Tux") y es un error común en exámenes.'
      },
      {
        name: 'ECC (Elliptic Curve Cryptography / ECDSA)',
        badge: 'Asimétrico de Alta Eficiencia',
        definition:
          'Criptografía asimétrica basada en la estructura algebraica de curvas elípticas sobre campos finitos.',
        whyCorrectOrRole:
          'Proporciona una seguridad equivalente a RSA pero con menor tamaño de clave, reduciendo drásticamente el consumo de CPU y ancho de banda.',
        distractorWarning:
          'No se utiliza para cifrado masivo de gigabytes de datos debido a que los algoritmos asimétricos son miles de veces más lentos que AES.'
      },
      {
        name: 'SHA-256 / SHA-3',
        badge: 'Función Hash Segura',
        definition:
          'Algoritmo matemático unidireccional que toma una entrada de cualquier tamaño y produce un valor hash de longitud fija de 256 bits, resistente a colisiones y preimágenes.',
        whyCorrectOrRole:
          'Garantiza la integridad de archivos, firmas digitales y almacenamiento seguro de contraseñas (combinado con sal y algoritmos lentos como bcrypt/Argon2).',
        distractorWarning:
          'Un hash no es cifrado: no se puede "descifrar" un hash porque es una función de un solo sentido (One-Way).'
      },
      {
        name: 'MD5 y SHA-1 (Algoritmos Obsoletos)',
        badge: 'Inseguros / Prohibidos',
        definition:
          'Funciones hash legadas que han demostrado debilidades matemáticas críticas, permitiendo generar colisiones artificiales con facilidad.',
        whyCorrectOrRole:
          'En el examen CompTIA, seleccionar MD5 o SHA-1 para integridad en sistemas nuevos siempre penaliza el puntaje.',
        distractorWarning:
          'Solo se aceptan en casos de compatibilidad con software legado sin valor probatorio legal.'
      }
    ]
  },

  // ==========================================
  // PBQ 22: Order of Volatility & Digital Forensics Acquisition
  // ==========================================
  'pbq-22': {
    pbqId: 'pbq-22',
    overviewRationale:
      'El Orden de Volatilidad (RFC 3227) dicta que la evidencia digital debe recolectarse comenzando por los componentes cuya información se pierde más rápido al cortar la energía. La secuencia obligatoria es: 1. Registros de CPU y Memoria Caché, 2. Memoria RAM principal (Routing tables, ARP cache, procesos en ejecución, conexiones de red activas), 3. Archivos de intercambio / Paging file / Hibernación, 4. Medios de almacenamiento local (Disco duro / SSD), 5. Medios extraíbles (USB/cintas) y 6. Registros remotos / Medios de respaldo en la nube.',
    keyTakeaways: [
      'Primer paso ante un equipo encendido: Volcar la memoria RAM activa antes de desenchufar o apagar el equipo.',
      'Usar un Bloqueador de Escritura (Hardware Write Blocker) antes de conectar cualquier medio de almacenamiento físico a la estación forense.',
      'Generar una copia Bit-a-Bit (Bit-stream Image con herramientas como dd o FTK Imager), NUNCA un simple copiar/pegar de archivos.',
      'Calcular el hash criptográfico (SHA-256) antes y después de la clonación para garantizar la integridad probatoria y la Cadena de Custodia.'
    ],
    itemsGlossary: [
      {
        name: '1. Registros de CPU y Memoria Caché L1/L2/L3',
        badge: 'Máxima Volatilidad',
        definition:
          'Almacenamiento ultra-rápido dentro del microprocesador que contiene las instrucciones en ejecución inmediata y datos de registros.',
        whyCorrectOrRole:
          'Se desvanece en nanosegundos tras la desconexión eléctrica; es la evidencia más efímera de todo el sistema informático.',
        distractorWarning:
          'Aunque es la más volátil, en la práctica técnica se captura indirectamente con herramientas especializadas o se prioriza la RAM.'
      },
      {
        name: '2. Memoria RAM (Memoria Principal Volátil)',
        badge: 'Alta Volatilidad Crítica',
        definition:
          'Memoria de acceso aleatorio que contiene procesos de malware inyectados directamente en memoria (Fileless Malware), claves de cifrado en uso, contraseñas en claro y sockets de red abiertos.',
        whyCorrectOrRole:
          'Debe capturarse en vivo mediante herramientas como DumpIt o WinPmem antes de realizar cualquier reinicio o apagado.',
        distractorWarning:
          'Apagar el equipo "a la fuerza" para evitar que el ransomware cifre el disco destruye irreversiblemente la RAM y cualquier clave para descifrar los archivos.'
      },
      {
        name: '3. Archivo de Paginación y Espacio de Swap',
        badge: 'Media Volatilidad',
        definition:
          'Archivos en disco (pagefile.sys, swapfile.sys, hiberfil.sys) que el sistema operativo utiliza como extensión de la memoria RAM.',
        whyCorrectOrRole:
          'Conserva fragmentos de memoria RAM que fueron descargados a disco, sobreviviendo a veces a reinicios controlados.',
        distractorWarning:
          'No reemplaza la captura de RAM activa pero es una fuente complementaria esencial en investigaciones.'
      },
      {
        name: '4. Disco Duro Local / Almacenamiento No Volátil (HDD / SSD / NVMe)',
        badge: 'Baja Volatilidad',
        definition:
          'Medios magnéticos o de estado sólido donde residen el sistema de archivos, particiones, archivos borrados (Unallocated space) y metadatos.',
        whyCorrectOrRole:
          'Conserva la información permanentemente aún sin energía eléctrica. Requiere clonación bit-a-bit con bloqueador de escritura.',
        distractorWarning:
          'Nunca debe conectarse directamente a un PC sin bloqueador de escritura, ya que el sistema operativo montará la partición y alterará timestamps de acceso (MACB).'
      },
      {
        name: '5. Logs Remotos y Almacenamiento en la Nube',
        badge: 'Mínima Volatilidad',
        definition:
          'Registros centralizados en SIEMs, servidores de backup o depósitos S3 custodiados por terceros con retención prolongada.',
        whyCorrectOrRole:
          'Es la evidencia menos volátil y con menor probabilidad de alteración inmediata por el atacante local.',
        distractorWarning:
          'Priorizar la recolección de logs remotos antes de la RAM del servidor local activo resultará en la pérdida irreparable de la memoria del equipo.'
      }
    ]
  },

  // ==========================================
  // PBQ 31: Port Security & Critical Protocol Hardening
  // ==========================================
  'pbq-31': {
    pbqId: 'pbq-31',
    overviewRationale:
      'CompTIA SY0-701 exige un conocimiento exhaustivo de los números de puerto IANA y sus protocolos asociados, distinguiendo taxativamente entre protocolos inseguros (en texto claro, vulnerables a sniffing, spoofing y Man-in-the-Middle) y sus sustitutos criptográficos seguros. La regla fundamental es deshabilitar o bloquear el puerto inseguro y forzar la migración hacia el protocolo cifrado sobre TLS o SSH con autenticación robusta.',
    keyTakeaways: [
      '23 (Telnet) -> Migrar a 22 (SSH): Telnet envía contraseñas en texto claro; SSH usa criptografía asimétrica y AES simétrico.',
      '80 (HTTP) -> Migrar a 443 (HTTPS): HTTPS implementa TLS 1.3 con secreto perfecto hacia adelante (PFS) y certificados X.509.',
      '389 (LDAP) -> Migrar a 636 (LDAPS): LDAP en claro expone consultas de usuarios de Active Directory; LDAPS cifra la sesión bajo TLS.',
      '20/21 (FTP) -> Migrar a 22 (SFTP) o 989/990 (FTPS): FTP transmite credenciales en claro; SFTP opera sobre SSH en puerto 22.',
      '161 (SNMPv1/v2) -> Actualizar a SNMPv3 en modo authPriv: v1/v2 usa cadenas de comunidad (Community Strings) en texto plano; v3 cifra con AES.',
      '514 (Syslog UDP) -> Migrar a 6514 (Syslog-over-TLS TCP): 514 UDP no garantiza entrega ni confidencialidad; 6514 TLS garantiza cifrado e integridad.'
    ],
    itemsGlossary: [
      {
        name: 'Puerto 23 (Telnet)',
        badge: 'Inseguro / Texto Claro',
        definition:
          'Protocolo de emulación de terminal para administración remota de routers y servidores desarrollado en los años 60 sin capacidades criptográficas.',
        whyCorrectOrRole:
          'Vulnerabilidad: Transmite nombres de usuario y contraseñas sin cifrar, permitiendo a cualquier sniffer en la red capturar credenciales de root/administrador.',
        distractorWarning:
          'Sustituto obligatorio: SSH (Secure Shell) en puerto 22. Bloquear puerto 23 en firewalls perimetrales e internos.'
      },
      {
        name: 'Puerto 22 (SSH / SFTP)',
        badge: 'Criptográfico / Seguro',
        definition:
          'Protocolo de comunicación segura que utiliza criptografía asimétrica para intercambio de claves y cifrado simétrico AES para el canal de datos.',
        whyCorrectOrRole:
          'Sustituye tanto a Telnet (para acceso a consola) como a FTP (mediante SFTP - SSH File Transfer Protocol) garantizando confidencialidad e integridad.',
        distractorWarning:
          'No confundir SFTP (puerto 22 sobre SSH) con FTPS (puerto 989/990 o FTP explícito con TLS), son tecnologías completamente distintas en CompTIA.'
      },
      {
        name: 'Puerto 80 (HTTP)',
        badge: 'Inseguro / Texto Claro',
        definition:
          'Protocolo de transferencia de hipertexto que transmite páginas web y formularios en texto plano sin autenticación del servidor.',
        whyCorrectOrRole:
          'Vulnerabilidad: Susceptible a escuchas no autorizadas, alteración de contenido en tránsito e inyección de sesiones.',
        distractorWarning:
          'Sustituto obligatorio: HTTPS en puerto 443 con certificado TLS y redirección permanente HTTP 301.'
      },
      {
        name: 'Puerto 443 (HTTPS / DoH)',
        badge: 'Criptográfico / Seguro',
        definition:
          'HTTP encapsulado dentro de un túnel cifrado TLS (Transport Layer Security). También utilizado por DoH (DNS over HTTPS).',
        whyCorrectOrRole:
          'Autentica la identidad del servidor mediante certificados digitales X.509 emitidos por una Autoridad Certificadora (CA) y cifra todo el tráfico.',
        distractorWarning:
          'Tener HTTPS no evita vulnerabilidades de aplicación web (SQLi o XSS) en la Capa 7; para eso se requiere un WAF.'
      },
      {
        name: 'Puerto 389 (LDAP)',
        badge: 'Inseguro / Texto Claro',
        definition:
          'Lightweight Directory Access Protocol: protocolo usado para consultar y modificar servicios de directorio como Microsoft Active Directory y OpenLDAP.',
        whyCorrectOrRole:
          'Vulnerabilidad: Los enlaces simples (Simple Bind) transmiten credenciales de cuentas de dominio en texto plano por la red interna.',
        distractorWarning:
          'Sustituto obligatorio: LDAPS en puerto 636 con certificados TLS y autenticación mutua de cliente/servidor.'
      },
      {
        name: 'Puerto 636 (LDAPS)',
        badge: 'Criptográfico / Seguro',
        definition:
          'LDAP encapsulado sobre TLS. Cifra todas las consultas y respuestas del directorio corporativo.',
        whyCorrectOrRole:
          'Protege la confidencialidad de la base de datos de identidades y credenciales de la empresa.',
        distractorWarning:
          'StartTLS sobre el puerto 389 también existe, pero CompTIA estandariza el puerto 636 como el puerto seguro dedicado para LDAPS.'
      },
      {
        name: 'Puerto 161 (SNMPv1/v2c)',
        badge: 'Inseguro / Texto Claro',
        definition:
          'Simple Network Management Protocol usado para monitorear el estado y métricas de routers, switches, servidores y firewalls.',
        whyCorrectOrRole:
          'Vulnerabilidad: Utiliza "Community Strings" (como public/private) enviadas en texto plano, permitiendo a atacantes modificar configuraciones de red.',
        distractorWarning:
          'Sustituto obligatorio: SNMPv3 configurado en nivel de seguridad "authPriv" (autenticación HMAC con SHA y cifrado AES).'
      },
      {
        name: 'Puerto 514 UDP (Syslog Legado)',
        badge: 'Inseguro / Sin Garantía',
        definition:
          'Protocolo tradicional de envío de registros y eventos de auditoría hacia servidores de logs centrales.',
        whyCorrectOrRole:
          'Vulnerabilidad: UDP no tiene acuse de recibo (paquetes pueden perderse o ser interceptados) y los mensajes viajan en texto plano sin firmar.',
        distractorWarning:
          'Sustituto obligatorio: Syslog-over-TLS en puerto 6514 TCP con certificados PKI para garantizar entrega e inmutabilidad.'
      },
      {
        name: 'Puerto 3389 (RDP - Remote Desktop Protocol)',
        badge: 'Servicio Sensible Expuesto',
        definition:
          'Protocolo propietario de Microsoft para administración gráfica de escritorios y servidores Windows.',
        whyCorrectOrRole:
          'Vulnerabilidad: Exponer el puerto 3389 directamente a Internet es una de las causas número 1 de intrusiones de ransomware (BlueKeep, ataques de fuerza bruta).',
        distractorWarning:
          'Remediación: Bloquear el puerto 3389 en el firewall perimetral y exigir acceso exclusivo a través de VPN corporativa con MFA y NLA (Network Level Authentication).'
      },
      {
        name: 'Puerto 53 (DNS UDP/TCP) vs Puerto 853 (DoT)',
        badge: 'Resolución de Nombres',
        definition:
          'DNS en puerto 53 opera en texto plano, permitiendo envenenamiento de caché (DNS Poisoning) y espionaje de dominios consultados.',
        whyCorrectOrRole:
          'DoT (DNS over TLS) en puerto 853 o DoH en puerto 443 cifran las consultas del usuario, mientras que DNSSEC firma criptográficamente las respuestas con registros RRSIG.',
        distractorWarning:
          'DNSSEC no cifra el tráfico de nombres, solo valida la autenticidad e integridad de los registros; el cifrado lo aportan DoT y DoH.'
      }
    ]
  },

  // ==========================================
  // PBQ 32: Nmap Port Scanning & Reconnaissance Analysis
  // ==========================================
  'pbq-32': {
    pbqId: 'pbq-32',
    overviewRationale:
      'Nmap es la herramienta de referencia de escaneo de puertos evaluada en CompTIA. La flag "-sS" ejecuta un escaneo SYN Stealth (Half-open Scan), enviando paquetes SYN y respondiendo con RST tan pronto el servidor devuelve un SYN/ACK, sin completar el saludo de 3 vías de TCP para evitar generar registros de conexión en aplicaciones legadas. El análisis de vulnerabilidades sobre puertos descubiertos exige reconocer fallos emblemáticos: vsftpd 2.3.4 (backdoor en puerto 21), Telnet (puerto 23 sin cifrar), SMBv1 (puerto 445 vulnerable a EternalBlue MS17-010) y RDP expuesto (puerto 3389).',
    keyTakeaways: [
      '-sS (SYN Stealth Scan): El tipo de escaneo por defecto más común; no completa la conexión TCP (Half-Open), enviando RST tras recibir SYN-ACK.',
      '-sT (Connect Scan): Completa el handshake de 3 vías de TCP; más ruidoso y registrado en logs de aplicaciones.',
      '-sU (UDP Scan): Envía paquetes UDP y espera ICMP Port Unreachable; es lento debido a la limitación de tasa de ICMP en los sistemas operativos.',
      'vsftpd 2.3.4 contiene una puerta trasera histórica (CVE-2011-2523) que abre una shell en el puerto 6200.',
      'SMBv1 en puerto 445 fue el vector de propagación de WannaCry y NotPetya a través de la vulnerabilidad EternalBlue.',
      'RDP en puerto 3389 expuesto a WAN debe restringirse tras VPN con MFA y NLA.'
    ],
    itemsGlossary: [
      {
        name: 'Flag de Escaneo "-sS" (SYN Stealth / Half-Open Scan)',
        badge: 'Técnica de Reconocimiento',
        definition:
          'Envía un paquete TCP SYN. Si recibe SYN/ACK, deduce que el puerto está ABIERTO y envía inmediatamente un paquete RST (Reset) para romper la sesión sin completarla.',
        whyCorrectOrRole:
          'Es el método preferido por analistas de seguridad por su rapidez y menor probabilidad de colapsar servicios frágiles.',
        distractorWarning:
          '-sT realiza la llamada connect() del sistema operativo completando la conexión, lo cual deja huellas visibles en los logs del servidor objetivo.'
      },
      {
        name: 'Puerto 21: vsftpd 2.3.4 Backdoor (CVE-2011-2523)',
        badge: 'Hallazgo Crítico',
        definition:
          'Versión maliciosa de vsftpd que fue introducida en los repositorios oficiales en 2011. Si un usuario envía un smiley ":)" en el nombre de usuario, se activa un listener root en el puerto TCP 6200.',
        whyCorrectOrRole:
          'Remediación urgente: Desinstalar vsftpd 2.3.4 inmediatamente y migrar la transferencia de archivos a SFTP (puerto 22) o FTPS moderno.',
        distractorWarning:
          'Intentar "parchear" o ignorar el servicio permite al atacante obtener control total del servidor con privilegios de superusuario.'
      },
      {
        name: 'Puerto 445: Microsoft-DS / SMBv1 (EternalBlue MS17-010)',
        badge: 'Vulnerabilidad Crítica de Red',
        definition:
          'Protocolo Server Message Block versión 1. Vulnerabilidad en el manejo de paquetes SMB que permite ejecución remota de código arbitrario sin autenticación (RCE).',
        whyCorrectOrRole:
          'Remediación oficial CompTIA: Deshabilitar completamente SMBv1 en todo el dominio y forzar SMBv3 con firma de paquetes (SMB Signing) y cifrado obligatorio.',
        distractorWarning:
          'Dejar SMBv1 habilitado en la red interna permite a cualquier malware tipo gusano autopropagarse por todos los controladores de dominio en minutos.'
      },
      {
        name: 'Puerto 3389: RDP Expuesto Directamente',
        badge: 'Riesgo Perimetral',
        definition:
          'Servicio de Terminal Server expuesto a Internet sin capas intermedias de protección.',
        whyCorrectOrRole:
          'Remediación: Deshabilitar el acceso perimetral directo en el firewall de borde, canalizar el tráfico a través de una VPN con MFA y exigir Network Level Authentication (NLA).',
        distractorWarning:
          'Cambiar el puerto 3389 a un puerto aleatorio (Security through Obscurity) no protege contra escaneos de Nmap y está desaconsejado en CompTIA.'
      }
    ]
  },

  // ==========================================
  // PBQ 33: DNS Security, DoT/DoH & DNSSEC Hardening
  // ==========================================
  'pbq-33': {
    pbqId: 'pbq-33',
    overviewRationale:
      'El sistema DNS tradicional carece de autenticación e integridad intrínseca. DNSSEC (Domain Name System Security Extensions) resuelve esto agregando firmas criptográficas a los registros DNS mediante una jerarquía de confianza (Trust Anchor). Los registros RRSIG almacenan la firma digital de los conjuntos de registros, los registros DNSKEY publican las claves públicas del servidor DNS, y el registro DS (Delegation Signer) vincula la zona hija con la zona padre en el registrador. Para proteger la privacidad del usuario frente a intermediarios, DoT (DNS over TLS en puerto 853) o DoH (DNS over HTTPS en puerto 443) cifran las consultas, mientras que la restricción de transferencias de zona (AXFR sobre TCP 53) y la mitigación de recursión abierta previenen ataques de reconocimiento y amplificación.',
    keyTakeaways: [
      'DNSSEC proporciona Integridad y Autenticación de origen, pero NO cifra el contenido de las consultas DNS.',
      'RRSIG (Resource Record Signature): La firma criptográfica generada con la clave privada de la zona que valida la autenticidad de un registro.',
      'DNSKEY: Contiene la clave pública (Zone Signing Key - ZSK o Key Signing Key - KSK) utilizada para verificar las firmas RRSIG.',
      'DS (Delegation Signer): Hash del DNSKEY ubicado en la zona padre (ej. .com) que establece la cadena de confianza criptográfica.',
      'DoT opera en puerto 853 usando TLS estricto; DoH opera en puerto 443 mezclándose con el tráfico web HTTPS.',
      'Transferencia de zona (AXFR): Debe restringirse a direcciones IP secundarias autorizadas para evitar que atacantes descarguen el mapa completo de servidores.'
    ],
    itemsGlossary: [
      {
        name: 'Registro RRSIG (Resource Record Signature)',
        badge: 'Registro DNSSEC',
        definition:
          'Firma criptográfica digital adjunta a un grupo de registros DNS idénticos (RRset). Los clientes validadores utilizan la clave pública para comprobar que el registro no fue modificado.',
        whyCorrectOrRole:
          'Protege contra ataques de DNS Spoofing y envenenamiento de caché (Kaminsky attack) garantizando que la IP devuelta proviene del propietario legítimo.',
        distractorWarning:
          'RRSIG no almacena la clave pública, sino la firma resultante del cifrado asimétrico del registro con la clave privada.'
      },
      {
        name: 'Registro DNSKEY',
        badge: 'Registro DNSSEC',
        definition:
          'Registro que publica las claves públicas de la zona: la Zone Signing Key (ZSK) para firmar registros habituales y la Key Signing Key (KSK) para firmar la ZSK.',
        whyCorrectOrRole:
          'Permite a los resolvers DNS comprobar matemáticamente la validez de los registros RRSIG.',
        distractorWarning:
          'Si la clave privada correspondiente a este registro se filtra, el atacante puede firmar registros falsos a voluntad.'
      },
      {
        name: 'Registro DS (Delegation Signer)',
        badge: 'Cadena de Confianza',
        definition:
          'Registro publicado en la zona padre (ej. TLD .org) que contiene el hash criptográfico del registro DNSKEY KSK de la zona hija.',
        whyCorrectOrRole:
          'Es el puente criptográfico que permite a los validadores confiar en la zona hija verificando la firma de la zona superior hasta la raíz (Root Anchor).',
        distractorWarning:
          'Configurar DNSSEC en tu servidor sin subir el registro DS al registrador de dominios deja la cadena rota y los resolvers rechazarán la zona.'
      },
      {
        name: 'DoT (DNS over TLS en Puerto 853)',
        badge: 'Cifrado de Transporte',
        definition:
          'Estándar que encapsula las consultas DNS directamente dentro de una sesión TLS en el puerto 853.',
        whyCorrectOrRole:
          'Oculta las consultas DNS ante espías en la red local o proveedores de Internet, garantizando la privacidad de los usuarios.',
        distractorWarning:
          'A diferencia de DoH (puerto 443), el tráfico DoT viaja por un puerto dedicado (853) que puede ser fácilmente identificado y bloqueado por firewalls empresariales.'
      },
      {
        name: 'Restricción de Transferencia de Zona AXFR (TCP 53)',
        badge: 'Hardening de DNS',
        definition:
          'Mecanismo por el cual un servidor DNS secundario replica la base de datos completa de un servidor DNS primario mediante el comando AXFR en el puerto TCP 53.',
        whyCorrectOrRole:
          'Debe restringirse estrictamente a las IPs secundarias conocidas mediante ACLs o claves TSIG; de lo contrario, un atacante puede descargar toda la topología de la empresa.',
        distractorWarning:
          'Bloquear TCP 53 completamente impediría a los clientes resolver respuestas DNS grandes que superen los 512 bytes del buffer UDP.'
      }
    ]
  },

  // ==========================================
  // PBQ 34: Zero Trust Architecture (NIST SP 800-207)
  // ==========================================
  'pbq-34': {
    pbqId: 'pbq-34',
    overviewRationale:
      'NIST SP 800-207 define los principios fundamentales de la Arquitectura de Confianza Cero (Zero Trust Architecture - ZTA): "Nunca confiar, siempre verificar". Se eliminan los perímetros implícitos basados en la ubicación de la red. La arquitectura consta del Plano de Control (Policy Decision Point / Policy Engine - PDP/PE) que evalúa dinámicamente el contexto de la identidad, estado de salud del dispositivo y riesgo, y el Plano de Datos (Policy Enforcement Point - PEP) que aplica el acceso a nivel de microperímetro. El tráfico lateral Este-Oeste se restringe mediante microsegmentación.',
    keyTakeaways: [
      'PDP / PE (Policy Decision Point / Policy Engine): El cerebro analítico que aprueba o deniega cada solicitud de acceso evaluando políticas y señales de riesgo en tiempo real.',
      'PEP (Policy Enforcement Point): El guardia de seguridad perimetral que interrumpe, habilita y monitorea la sesión entre el sujeto y el recurso corporativo.',
      'Microsegmentación: Creación de zonas de seguridad granulares que aíslan cargas de trabajo individuales, impidiendo el movimiento lateral Este-Oeste.',
      'Evaluación Continua y Adaptativa del Riesgo: La confianza no es estática; si el dispositivo pierde cumplimiento (ej. desactiva su antivirus durante la sesión), el acceso se revoca de inmediato.'
    ],
    itemsGlossary: [
      {
        name: 'PDP / Policy Engine (Punto de Decisión de Políticas)',
        badge: 'Plano de Control ZTA',
        definition:
          'Componente lógico responsable de la decisión final de otorgar, denegar o revocar el acceso a un recurso basándose en políticas empresariales y fuentes de telemetría de riesgo.',
        whyCorrectOrRole:
          'Evalúa la postura de seguridad (autenticación MFA del usuario, geolocalización, estado del EDR en el endpoint y comportamiento anómalo) antes de emitir un veredicto.',
        distractorWarning:
          'El PDP nunca procesa el tráfico de datos de la aplicación directamente; solo emite directivas de autorización al PEP.'
      },
      {
        name: 'PEP (Policy Enforcement Point / Punto de Aplicación de Políticas)',
        badge: 'Plano de Datos ZTA',
        definition:
          'Componente que se ubica directamente en la ruta de comunicación entre el usuario y el recurso protegido para ejecutar las órdenes del PDP.',
        whyCorrectOrRole:
          'Abre túneles mTLS efímeros y termina las sesiones inmediatamente si el PDP detecta un cambio adverso en la postura del dispositivo.',
        distractorWarning:
          'Un PEP que tome decisiones de autorización de forma aislada sin consultar al PDP centralizado viola el principio de orquestación Zero Trust.'
      },
      {
        name: 'Microsegmentación (Control de Tráfico Este-Oeste)',
        badge: 'Aislamiento de Cargas',
        definition:
          'Técnica que divide centros de datos y nubes en segmentos de seguridad minúsculos hasta el nivel de carga de trabajo o contenedor individual.',
        whyCorrectOrRole:
          'Si un atacante compromete un servidor web, la microsegmentación le impide realizar escaneos o explotar vulnerabilidades en bases de datos adyacentes en la misma subred.',
        distractorWarning:
          'La segmentación tradicional por VLANs a nivel de switches de Capa 2 es demasiado gruesa y no detiene el movimiento lateral dentro del mismo broadcast domain.'
      },
      {
        name: 'Validación Continua de Riesgo (Continuous Adaptive Trust)',
        badge: 'Postura Dinámica',
        definition:
          'Supervisión ininterrumpida de las sesiones activas, reevaluando la confianza cada minuto frente a cambios de IP, inyección de procesos extraños o comportamiento errático.',
        whyCorrectOrRole:
          'Garantiza que una autenticación MFA inicial exitosa no otorgue un cheque en blanco para operar maliciosamente durante horas.',
        distractorWarning:
          'Confiar en una sesión abierta durante 8 horas sin reevaluar la postura del endpoint permite ataques de robo de tokens y secuestro de sesiones.'
      }
    ]
  },

  // ==========================================
  // PBQ 35: Web Server Hardening & HTTP Security Headers
  // ==========================================
  'pbq-35': {
    pbqId: 'pbq-35',
    overviewRationale:
      'El bastionado de servidores web (Web Server Hardening) exige configurar cabeceras de respuesta HTTP de seguridad para mitigar ataques comunes en el navegador del cliente. HSTS (HTTP Strict Transport Security) con directivas "includeSubDomains" y "preload" fuerza a los navegadores a utilizar exclusivamente HTTPS, previniendo ataques de degradación SSL Stripping. CSP (Content Security Policy) restringe el origen de scripts y hojas de estilo mediante nonces criptográficos, neutralizando inyecciones XSS. X-Frame-Options en modo DENY previene ataques de Clickjacking. TLS 1.3 con conjuntos de cifrado PFS garantiza la máxima confidencialidad.',
    keyTakeaways: [
      'HSTS con "preload" asegura que el navegador jamás intente una conexión HTTP inicial en texto claro.',
      'Content-Security-Policy (CSP) es la defensa técnica más poderosa contra Cross-Site Scripting (XSS) y exfiltración de datos en navegadores.',
      'X-Frame-Options: DENY impide que la página sea embebida en elementos <frame>, <iframe> o <object>, erradicando el Clickjacking.',
      'TLS 1.3 elimina suites de cifrado débiles heredadas y ofrece Perfect Forward Secrecy (PFS) obligatorio por diseño.'
    ],
    itemsGlossary: [
      {
        name: 'HSTS (HTTP Strict Transport Security) con Preload',
        badge: 'Cabecera HTTP Anti-MitM',
        definition:
          'Cabecera que instruye al navegador del usuario a comunicarse con el sitio únicamente mediante HTTPS durante un período prolongado (max-age=31536000), rechazando certificados inválidos.',
        whyCorrectOrRole:
          'La directiva "preload" inscribe el dominio en la lista dura compilada en navegadores Chrome/Firefox/Safari, impidiendo el primer ataque de SSL Stripping.',
        distractorWarning:
          'Si se habilita HSTS sin certificar todos los subdominios (includeSubDomains), los subdominios de la empresa que usen HTTP dejarán de cargar para los clientes.'
      },
      {
        name: 'CSP (Content Security Policy) con Directiva Nonce',
        badge: 'Cabecera Anti-XSS',
        definition:
          'Cabecera que define una lista blanca de orígenes válidos desde donde el navegador puede cargar y ejecutar scripts, imágenes, fuentes y conexiones de red.',
        whyCorrectOrRole:
          'Al exigir un "nonce" criptográfico único por cada petición, cualquier script malicioso inyectado por un atacante (Stored o Reflected XSS) será bloqueado por el navegador.',
        distractorWarning:
          'Utilizar directivas permisivas como "unsafe-inline" o "unsafe-eval" en la directiva script-src anula por completo la protección de CSP.'
      },
      {
        name: 'X-Frame-Options: DENY',
        badge: 'Cabecera Anti-Clickjacking',
        definition:
          'Cabecera que prohíbe taxativamente al navegador renderizar la página dentro de un iframe, marco o ventana embebida de otro sitio web.',
        whyCorrectOrRole:
          'Previene que un atacante superponga una interfaz invisible sobre el portal bancario o de autenticación para engañar al usuario y hacer clic en botones sensibles.',
        distractorWarning:
          'La opción "SAMEORIGIN" permite embebido dentro del mismo dominio; si se requiere aislamiento total, la recomendación CompTIA es DENY.'
      },
      {
        name: 'TLS 1.3 con Perfect Forward Secrecy (PFS)',
        badge: 'Criptografía de Transporte',
        definition:
          'La versión más moderna del protocolo TLS. Utiliza intercambio de claves Diffie-Hellman efímero (ECDHE), garantizando que si la clave privada del servidor se compromete en el futuro, las sesiones pasadas no puedan ser descifradas.',
        whyCorrectOrRole:
          'Reduce la latencia de negociación a 1-RTT (o 0-RTT) y prohíbe el uso de algoritmos obsoletos como RSA para intercambio estático de claves.',
        distractorWarning:
          'Permitir TLS 1.0, TLS 1.1 o SSL 3.0 en el servidor web expone la infraestructura a ataques como POODLE, BEAST y Heartbleed.'
      }
    ]
  },

  // ==========================================
  // PBQ 36: Forensic Legal Hold & Evidence Chain of Custody
  // ==========================================
  'pbq-36': {
    pbqId: 'pbq-36',
    overviewRationale:
      'La informática forense en procedimientos judiciales está gobernada por la estricta preservación de la integridad probatoria y la trazabilidad. La primera acción legal obligatoria ante un litigio es la emisión del Legal Hold (Retención Judicial), que ordena suspender cualquier política de rotación o purga programada de datos. Seguidamente, cada dispositivo se registra en el formulario de Cadena de Custodia (Chain of Custody). La adquisición física se efectúa utilizando un Bloqueador de Escritura de Hardware (Write Blocker) para garantizar que el sistema operativo no modifique los metadatos MACB (Modified, Accessed, Created, Born). Se calcula el hash SHA-256 de origen y destino, y los análisis se ejecutan siempre sobre una copia forense de trabajo en entorno aislado (Sandbox).',
    keyTakeaways: [
      'Legal Hold: Primer paso legal para detener la destrucción rutinaria de archivos y registros.',
      'Cadena de Custodia (Chain of Custody): Registro exhaustivo de quién manipuló la evidencia, cuándo, dónde y con qué propósito.',
      'Hardware Write Blocker: Dispositivo físico que intercepta comandos de escritura SATA/NVMe/USB, permitiendo únicamente lecturas.',
      'Best Evidence Rule (Regla de la Mejor Evidencia): El tribunal exige presentar el original o un duplicado bit-a-bit auténtico con hash verificado.',
      'NUNCA se analiza el disco original: los peritos siempre trabajan sobre una copia forense clonada bit-stream.'
    ],
    itemsGlossary: [
      {
        name: '1. Notificación de Legal Hold (Retención Judicial)',
        badge: 'Fase 1 / Legal',
        definition:
          'Directiva formal emitida por el departamento legal o tribunal que prohíbe la destrucción, sobreescritura o alteración rutinaria de datos y logs potencialmente relevantes para un juicio.',
        whyCorrectOrRole:
          'Si no se emite inmediatamente, los sistemas automatizados de backup o retención de correo destruirán evidencia clave, incurriendo en destrucción punible de pruebas (Spoliation).',
        distractorWarning:
          'Iniciar la adquisición forense sin notificar el Legal Hold permite que otros administradores purguen buzones o bases de datos durante el proceso.'
      },
      {
        name: '2. Registro en Cadena de Custodia (Chain of Custody Log)',
        badge: 'Fase 2 / Trazabilidad',
        definition:
          'Documento legal cronológico que registra cada individuo que recolectó, manipuló, transfirió, analizó o custodió un elemento de evidencia física o digital.',
        whyCorrectOrRole:
          'Cualquier lapso o vacío de tiempo no justificado en la custodia permite a la defensa impugnar la prueba y lograr su inadmisibilidad judicial.',
        distractorWarning:
          'Confiar en notas informales o recuerdos verbales destruye la validez procesal de la prueba ante el juez.'
      },
      {
        name: '3. Adquisición Bit-a-Bit con Hardware Write Blocker',
        badge: 'Fase 3 / Adquisición Física',
        definition:
          'Copia forense exacta sector a sector (incluyendo espacio no asignado y slack space) protegiendo el soporte original con un bloqueador físico de escritura.',
        whyCorrectOrRole:
          'Garantiza que el sistema forense no escriba ni un solo bit en el disco de origen ni modifique los timestamps de último acceso (MACB).',
        distractorWarning:
          'Un copiar y pegar estándar desde el explorador de archivos altera los metadatos y no captura archivos borrados ni particiones ocultas.'
      },
      {
        name: '4. Cálculo y Verificación de Hash Criptográfico (SHA-256)',
        badge: 'Fase 4 / Integridad',
        definition:
          'Generación de un resumen matemático del disco original y de la imagen clonada para demostrar que ambos son matemáticamente idénticos.',
        whyCorrectOrRole:
          'Si los hashes coinciden, se demuestra ante el tribunal que la imagen forense no sufrió la más mínima modificación ni corrupción.',
        distractorWarning:
          'Usar MD5 o SHA-1 en auditorías forenses modernas está desaconsejado debido a la posibilidad teórica de colisiones inducidas.'
      },
      {
        name: '5. Análisis Forense en Copia de Trabajo (Isolated Sandbox)',
        badge: 'Fase 5 / Análisis',
        definition:
          'Ejecución de herramientas periciales (Autopsy, EnCase, FTK) sobre una copia secundaria montada en un laboratorio aislado de la red.',
        whyCorrectOrRole:
          'Preserva intacta la imagen forense maestra original y evita que malware latente intente comunicarse con servidores de Command & Control (C2).',
        distractorWarning:
          'Conectar el disco analizado a una máquina con acceso a Internet puede activar detonadores de autodestrucción remota programados por atacantes.'
      },
      {
        name: '6. Custodia en Caja Fuerte Ignífuga con Doble Custodio',
        badge: 'Fase 6 / Preservación Física',
        definition:
          'Almacenamiento seguro del disco original sellado en bolsa antiestática con precinto numerado dentro de una caja de seguridad con control de acceso biométrico o doble llave.',
        whyCorrectOrRole:
          'Protege la evidencia física contra incendios, robos o accesos no autorizados hasta la celebración de la vista judicial.',
        distractorWarning:
          'Dejar discos con evidencia sobre escritorios o en armarios comunes rompe la cadena de custodia física.'
      }
    ]
  },

  // ==========================================
  // PBQ 37: PKI Lifecycle, OCSP Stapling, X.509 Formats & Key Escrow
  // ==========================================
  'pbq-37': {
    pbqId: 'pbq-37',
    overviewRationale:
      'La infraestructura de clave pública (PKI) y la gestión de certificados X.509 constituyen el núcleo de la confianza digital en CompTIA SY0-701. El proceso de revocación de certificados debe equilibrar seguridad y rendimiento: las Listas de Revocación de Certificados (CRL) tradicionales son archivos voluminosos descargados periódicamente, mientras que OCSP (Online Certificate Status Protocol) consulta a la CA en tiempo real pero puede sufrir latencia y filtrar la privacidad del usuario; por ello, la solución óptima es OCSP Stapling (RFC 6066), donde el servidor web consulta y cachea la respuesta sellada de la CA y la envía en el handshake TLS. En cuanto a formatos: .PFX/.P12 es binario y almacena la clave privada con contraseña; .PEM es Base64 ASCII; .DER es binario puro; y la extensión SAN permite proteger múltiples nombres de dominio (FQDNs) bajo un solo certificado. Para la recuperación de claves cifradas, Key Escrow con control M-de-N garantiza que ningún custodio individual pueda descifrar datos unilateralmente.',
    keyTakeaways: [
      'OCSP Stapling: El servidor web adjunta la respuesta de revocación de la CA en el handshake TLS, eliminando latencia de red y protegiendo la privacidad del cliente.',
      '.PFX / PKCS#12: Formato binario obligatorio cuando se necesita exportar o importar el certificado junto a la clave privada protegida con contraseña.',
      '.PEM: Formato estándar en Base64 delimitado por cabeceras "-----BEGIN CERTIFICATE-----", universal en servidores Linux/Apache/Nginx.',
      'SAN (Subject Alternative Name): Extensión X.509 esencial para asegurar múltiples FQDNs o subdominios diferentes en un único certificado.',
      'Key Escrow con M-de-N (Split Knowledge): Permite recuperar claves de cifrado corporativas garantizando control dual y evitando abusos de privilegios.'
    ],
    itemsGlossary: [
      {
        name: 'OCSP Stapling (RFC 6066)',
        badge: 'Revocación TLS en Tiempo Real',
        definition:
          'Mecanismo de optimización donde el servidor web descarga periódicamente de la CA una respuesta OCSP firmada y con marca de tiempo, "grapándola" directamente en el saludo TLS con el navegador.',
        whyCorrectOrRole:
          'Evita que cada navegador de cliente deba consultar directamente a la CA (lo que generaría latencia y revelaría a la CA qué sitios web visita el usuario).',
        distractorWarning:
          'CRL (Certificate Revocation List) es una lista pesada que genera lentitud y queda desactualizada entre publicaciones periódicas.'
      },
      {
        name: 'Formato .PFX / .P12 (PKCS#12)',
        badge: 'Contenedor Binario con Clave Privada',
        definition:
          'Estándar criptográfico binario protegido por contraseña diseñado específicamente para almacenar el par de claves (pública y privada) junto a la cadena de certificados.',
        whyCorrectOrRole:
          'Es el formato exigido por Microsoft IIS y Windows Server para exportar e importar certificados de servidor que requieran su clave privada correspondiente.',
        distractorWarning:
          '.P7B (PKCS#7) almacena certificados pero NUNCA almacena la clave privada. Usar .P7B para migrar un servidor web fallará porque no transferirá la clave privada.'
      },
      {
        name: 'Formato .PEM / .CRT (Base64 ASCII)',
        badge: 'Formato Estándar Linux / Apache',
        definition:
          'Codificación en texto plano ASCII de datos binarios ASN.1 mediante Base64, delimitada por líneas legibles como "-----BEGIN CERTIFICATE-----" y "-----END CERTIFICATE-----".',
        whyCorrectOrRole:
          'Es el estándar universal en entornos UNIX/Linux, servidores Apache, Nginx y balanceadores de carga Cloud para configurar certificados y claves.',
        distractorWarning:
          '.DER es el formato binario puro sin codificar; abrir un archivo .DER en un editor de texto muestra caracteres ilegibles y no puede pegarse en paneles web que requieran texto Base64.'
      },
      {
        name: 'SAN (Subject Alternative Name)',
        badge: 'Extensión X.509 Multidominio',
        definition:
          'Extensión del estándar X.509 que permite especificar una lista de nombres de host adicionales (DNS names, direcciones IP, URIs) asegurados por el mismo certificado.',
        whyCorrectOrRole:
          'Permite que un único certificado proteja simultáneamente "empresa.com", "api.empresa.com", "portal-socios.es" y "198.51.100.10" con total compatibilidad.',
        distractorWarning:
          'Un certificado Wildcard (*.empresa.com) solo cubre un único nivel de subdominio en el mismo dominio base y no cubre dominios con diferente TLD.'
      },
      {
        name: 'Key Escrow con Esquema M-de-N (Split Knowledge)',
        badge: 'Custodia y Recuperación de Claves',
        definition:
          'Almacenamiento seguro de claves privadas de cifrado en un tercero confiable o bóveda de seguridad, donde se divide la clave de recuperación entre N custodios y se requiere la presencia de al menos M de ellos para reconstruirla.',
        whyCorrectOrRole:
          'Garantiza que la empresa pueda recuperar datos cifrados por un empleado fallecido o despedido, impidiendo que un solo administrador deshonesto descifre comunicaciones a espaldas del resto.',
        distractorWarning:
          'Confiar la clave de recuperación a un único administrador de sistemas anula el principio de separación de funciones y crea un punto único de fallo y extorsión.'
      }
    ]
  },

  // ==========================================
  // PBQ 38: Wireless WPA3-Enterprise, 802.1X & WIPS
  // ==========================================
  'pbq-38': {
    pbqId: 'pbq-38',
    overviewRationale:
      'La seguridad de redes inalámbricas corporativas exige erradicar el uso de contraseñas precompartidas (PSK) debido a su vulnerabilidad frente a ataques de captura de 4-way handshake y ataques de diccionario fuera de línea. La solución estándar en CompTIA SY0-701 es WPA3-Enterprise modo 192 bits (Suite-B) con autenticación 802.1X EAP-TLS, donde tanto el servidor RADIUS (puertos UDP 1812/1813) como el cliente se autentican mutuamente mediante certificados digitales X.509 sin depender de contraseñas. Para redes personales, WPA3 sustituye el handshake por SAE (Dragonfly). La presencia de Gemelos Malvados (Evil Twins) se neutraliza activamente mediante sistemas de prevención de intrusiones inalámbricas (WIPS).',
    keyTakeaways: [
      'WPA3-Enterprise (Suite-B 192-bit): El estándar criptográfico más avanzado para entornos gubernamentales y corporativos.',
      'EAP-TLS: El método 802.1X más seguro; exige certificados digitales mutuos en servidor y dispositivo cliente.',
      'RADIUS: Protocolo AAA estándar que opera en puertos UDP 1812 (Autenticación) y UDP 1813 (Accounting).',
      'SAE (Dragonfly Handshake): En WPA3-Personal reemplaza a PSK, eliminando el riesgo de ataques de diccionario offline.',
      'WIPS: Monitoreo continuo del espectro de radiofrecuencia (RF) con supresión automática de Rogue APs mediante desautenticación.'
    ],
    itemsGlossary: [
      {
        name: 'WPA3-Enterprise Suite-B 192 bits',
        badge: 'Cifrado Inalámbrico',
        definition:
          'Estándar Wi-Fi Alliance alineado con la Commercial National Security Algorithm (CNSA) Suite, que implementa cifrado AES-256 en modo GCM y firmas SHA-384.',
        whyCorrectOrRole:
          'Protege las comunicaciones frente a ataques criptoanalíticos avanzados y elimina totalmente cifrados débiles legados como TKIP.',
        distractorWarning:
          'WPA2-PSK utiliza una clave compartida común para todos los usuarios: si un empleado se marcha o se filtra la clave, toda la red queda expuesta.'
      },
      {
        name: '802.1X con EAP-TLS',
        badge: 'Autenticación Mutua',
        definition:
          'Protocolo de control de acceso a redes basado en puertos que utiliza Transport Layer Security (TLS) para autenticación mutua mediante certificados X.509.',
        whyCorrectOrRole:
          'Al exigir certificados en el dispositivo cliente, un atacante no puede conectarse a la red incluso si roba las credenciales de usuario de Active Directory.',
        distractorWarning:
          'PEAP o EAP-TTLS solo requieren certificado en el servidor y validan al cliente mediante contraseñas (MS-CHAPv2), vulnerables a ataques de phishing de credenciales.'
      },
      {
        name: 'Servidor RADIUS (Puertos UDP 1812 y 1813)',
        badge: 'Servidor AAA',
        definition:
          'Remote Authentication Dial-In User Service: servidor centralizado que valida credenciales y políticas de acceso para switches y puntos de acceso inalámbricos.',
        whyCorrectOrRole:
          'El puerto UDP 1812 gestiona la autenticación y autorización; el puerto UDP 1813 gestiona la contabilidad (Accounting) registrando inicios y cierres de sesión.',
        distractorWarning:
          'Los puertos 1645 y 1646 son puertos obsoletos y no estándar que no deben utilizarse en despliegues modernos.'
      },
      {
        name: 'SAE (Simultaneous Authentication of Equals / Dragonfly)',
        badge: 'Handshake Anti-Fuerza Bruta',
        definition:
          'Mecanismo de intercambio de claves basado en Zero-Knowledge Proof utilizado en WPA3-Personal para sustituir la clave precompartida (PSK).',
        whyCorrectOrRole:
          'Aporta secreto perfecto hacia adelante (PFS) y hace inútil la captura de paquetes por atacantes, ya que no permite ataques de diccionario fuera de línea.',
        distractorWarning:
          'WPS (Wi-Fi Protected Setup) es un protocolo vulnerable con PIN de 8 dígitos que puede ser hackeado en pocas horas mediante herramientas como Reaver.'
      },
      {
        name: 'WIPS (Wireless Intrusion Prevention System)',
        badge: 'Defensa Activa RF',
        definition:
          'Sistema que analiza continuamente el espacio radioeléctrico en busca de puntos de acceso no autorizados (Rogue APs), Gemelos Malvados (Evil Twins) y desautenticaciones.',
        whyCorrectOrRole:
          'Al detectar un AP impostor emitiendo el SSID corporativo, el WIPS emite tramas de desautenticación automáticas para aislar a los clientes y evitar que caigan en la trampa.',
        distractorWarning:
          'Ocultar el SSID (SSID Cloaking) o el filtrado por dirección MAC no ofrecen seguridad real, ya que cualquier escáner de red gratuito detecta el SSID y las MACs se falsifican fácilmente.'
      }
    ]
  },

  // ==========================================
  // PBQ 39: Cloud Storage DLP & CASB Data Classification
  // ==========================================
  'pbq-39': {
    pbqId: 'pbq-39',
    overviewRationale:
      'La protección de datos en la nube (Cloud Data Protection) exige clasificar los repositorios de información según su sensibilidad legal y de negocio, y vincularlos a políticas activas de DLP (Data Loss Prevention) y CASB (Cloud Access Security Broker). Los números de tarjeta de crédito (PAN) caen estrictamente bajo la normativa PCI-DSS y requieren clasificación Restringido/PII. La información de nóminas de empleados (SSN, DNI) es Confidencial/PII, mientras que los activos estáticos de páginas web son Públicos. Un CASB en modo Reverse Proxy Inline inspecciona el tráfico en tiempo real y bloquea subidas no conformes antes de guardarse. El cifrado en reposo debe gestionarse con Customer-Managed Keys (CMK) respaldadas en HSM.',
    keyTakeaways: [
      'Clasificación de Datos: Público (sin daño), Interno (operativo), Confidencial (propiedad intelectual), Restringido/PII (multas regulatorias GDPR/PCI-DSS).',
      'DLP (Data Loss Prevention): Detección mediante expresiones regulares de números de tarjeta (PCI-DSS), SSN y credenciales de acceso.',
      'CASB Inline (Reverse Proxy): Único modo que previene fugas de datos en tiempo real al interceptar activamente el tráfico.',
      'CASB Modo API: Auditoría asíncrona; detecta violaciones después de que los datos ya fueron subidos al repositorio.',
      'Customer-Managed Keys (CMK / BYOK): Las claves residen en un módulo HSM FIPS 140-2 controlado por la empresa, impidiendo el acceso del proveedor cloud.'
    ],
    itemsGlossary: [
      {
        name: 'Depósito Público (Web Assets)',
        badge: 'Clasificación Pública',
        definition:
          'Datos autorizados para divulgación general sin restricciones de acceso ni confidencialidad.',
        whyCorrectOrRole:
          'No requiere inspección DLP ni cifrado estricto de acceso ya que contiene logos, hojas de estilo e imágenes de acceso abierto.',
        distractorWarning:
          'Aplicar reglas restrictivas de DLP o bloqueo de IPs a recursos estáticos públicos bloquearía la visualización de la web corporativa a clientes legítimos.'
      },
      {
        name: 'Depósito Pasarela de Pagos (PAN / Tarjetas)',
        badge: 'Restringido / PCI-DSS',
        definition:
          'Datos sujetos al estándar Payment Card Industry Data Security Standard (PCI-DSS) que contienen Números de Cuenta Primarios (PAN), fechas de caducidad y códigos de seguridad.',
        whyCorrectOrRole:
          'Exige la clasificación más restrictiva (Restringido/PII) y reglas DLP especializadas con el algoritmo de Luhn para detectar y enmascarar números de tarjeta.',
        distractorWarning:
          'Clasificar datos de pago como simplemente "Interno" expone a la empresa a revocación de la capacidad de procesar tarjetas y cuantiosas multas bancarias.'
      },
      {
        name: 'Depósito Recursos Humanos (Nóminas / SSN)',
        badge: 'Confidencial / PII',
        definition:
          'Información de identificación personal de los empleados de la organización regulada por normativas de privacidad.',
        whyCorrectOrRole:
          'Requiere filtros DLP específicos para patrones de Número de Seguro Social (SSN de 9 dígitos) o DNI para evitar exfiltraciones internas.',
        distractorWarning:
          'Dejar estos depósitos sin control DLP permitiría a atacantes o empleados descontentos exfiltrar nóminas masivamente.'
      },
      {
        name: 'CASB Inline (Reverse Proxy)',
        badge: 'Prevención Activa en Tránsito',
        definition:
          'Dispositivo o servicio que se coloca directamente en el flujo de tráfico entre el usuario y la aplicación cloud.',
        whyCorrectOrRole:
          'Puede inspeccionar el contenido del archivo mientras se sube y bloquear la transferencia de forma inmediata si detecta datos no autorizados.',
        distractorWarning:
          'El modo CASB basado en APIs opera de forma asíncrona: detecta el archivo sensible minutos después de haberse subido, lo que no evita la fuga inicial.'
      },
      {
        name: 'Customer-Managed Keys (CMK / BYOK en Cloud HSM)',
        badge: 'Criptografía HSM',
        definition:
          'Esquema donde las claves maestras de cifrado son generadas y controladas por el cliente dentro de un Hardware Security Module (HSM) certificado FIPS 140-2.',
        whyCorrectOrRole:
          'Garantiza que la organización sea la única poseedora de las claves, impidiendo que el proveedor de la nube o terceros accedan a los datos en reposo.',
        distractorWarning:
          'Usar claves gestionadas por el proveedor permite al personal del proveedor de la nube descifrar datos ante requerimientos judiciales sin intervención de la empresa.'
      }
    ]
  },

  // ==========================================
  // PBQ 40: Social Engineering Attacks, Psychological Triggers & Defenses
  // ==========================================
  'pbq-40': {
    pbqId: 'pbq-40',
    overviewRationale:
      'La ingeniería social explota vulnerabilidades en la psicología humana en lugar de fallos de software. En CompTIA SY0-701, se evalúan rigurosamente los seis principios de persuasión identificados por Robert Cialdini: Autoridad (suplantar a figuras de poder como el CEO o la policía), Urgencia (presión temporal para impedir el razonamiento crítico), Escasez (oportunidad exclusiva o limitada), Familiaridad/Simpatía (establecer rapport o fingir ser un compañero), Consenso/Prueba Social (hacer creer que todos los demás ya lo hicieron) e Intimidación (amenazas de castigo o despido). Para cada vector de ataque, existe una contramedida técnica y procedimental oficial.',
    keyTakeaways: [
      'Autoridad: El atacante finge ser el CEO o un auditor gubernamental. Mitigación: Verificación fuera de banda (Out-of-band call).',
      'Urgencia: "Debe transferirse antes de las 12:00 o perderemos el contrato". Mitigación: Procedimientos estrictos de doble autorización.',
      'Escasez / Curiosidad: "Lista confidencial de salarios y bonos" en USBs abandonados. Mitigación: Deshabilitar puertos USB masivos mediante GPO.',
      'Familiaridad: Pretexting de un proveedor habitual. Mitigación: Formación continua y verificación de cambios de cuenta bancaria.',
      'Consenso: "Todos los ingenieros del sector usan este portal" (Watering Hole). Mitigación: Aislamiento de navegación web (RBI) y EDR.'
    ],
    itemsGlossary: [
      {
        name: 'Spear Phishing / Business Email Compromise (BEC)',
        badge: 'Ataque Dirigido / Autoridad',
        definition:
          'Ataque de phishing personalizado dirigido a un individuo específico con acceso financiero o privilegios elevados, a menudo suplantando a ejecutivos de la empresa.',
        whyCorrectOrRole:
          'Disparador: Autoridad (el CFO no cuestiona una orden que parece venir del CEO). Contramedida: Protocolo obligatorio de llamada fuera de banda a un número verificado antes de emitir transferencias.',
        distractorWarning:
          'Confiar en el correo electrónico como único canal de autorización de pagos viola los controles internos de segregación de funciones.'
      },
      {
        name: 'Vishing (Voice Phishing al Helpdesk)',
        badge: 'Llamada Telefónica / Urgencia',
        definition:
          'Ataque telefónico donde el agresor finge ser un empleado en apuros para manipular al personal de soporte y obtener contraseñas temporales o códigos MFA.',
        whyCorrectOrRole:
          'Disparador: Urgencia e Intimidación ("estoy con un cliente importante, restablece mi clave ahora o hablaré con tu jefe"). Contramedida: Procedimiento de devolución de llamada al teléfono oficial registrado del empleado.',
        distractorWarning:
          'Permitir que el Helpdesk restablezca contraseñas basándose en la insistencia verbal es una de las brechas más comunes de ingeniería social.'
      },
      {
        name: 'USB Baiting (Cebo USB en el Estacionamiento)',
        badge: 'Ingeniería Social Física / Escasez',
        definition:
          'Técnica en la que se dejan memorias USB infectadas con malware en lugares transitados por empleados con etiquetas atractivas ("Bonos 2026").',
        whyCorrectOrRole:
          'Disparador: Curiosidad y Escasez. Contramedida primaria: Deshabilitar el almacenamiento masivo USB en todos los puestos de trabajo mediante Directivas de Grupo (GPO) o control de dispositivos EDR.',
        distractorWarning:
          'Confiar únicamente en que "los empleados no conectarán USBs desconocidos" es ineficaz sin un bloqueo tecnológico preventivo.'
      },
      {
        name: 'Pretexting de Proveedor Estratégico',
        badge: 'Falsificación de Identidad / Familiaridad',
        definition:
          'Creación de una historia falsa detallada (pretexto) utilizando información pública de la empresa para ganarse la confianza de empleados y solicitar cambios de cuentas bancarias.',
        whyCorrectOrRole:
          'Disparador: Familiaridad y Confianza. Contramedida: Política formal que prohíba modificar datos bancarios de proveedores sin confirmación telefónica directa con los apoderados habituales.',
        distractorWarning:
          'Un filtro antispam no siempre detecta el pretexting si el atacante envía el correo desde una cuenta legítima comprometida del proveedor.'
      },
      {
        name: 'Watering Hole (Ataque de Pozo de Agua)',
        badge: 'Compromiso Web / Consenso',
        definition:
          'Ataque donde el agresor identifica y compromete un sitio web legítimo frecuentado regularmente por un grupo objetivo específico (ej. foro de la industria).',
        whyCorrectOrRole:
          'Disparador: Consenso y Prueba Social (los usuarios confían en la web porque todos en la profesión la visitan). Contramedida: Aislamiento del navegador web (Remote Browser Isolation - RBI) y EDR con detección de exploits en el navegador.',
        distractorWarning:
          'Bloquear URLs maliciosas por reputación falla con Watering Hole porque el sitio web atacado es legítimo y de buena reputación histórica.'
      }
    ]
  },

  // ==========================================
  // PBQ 41: Cloud Shared Responsibility Model (IaaS, PaaS, SaaS)
  // ==========================================
  'pbq-41': {
    pbqId: 'pbq-41',
    overviewRationale:
      'El Modelo de Responsabilidad Compartida en la Nube (Shared Responsibility Model) delimita qué controles de seguridad son obligación del Proveedor Cloud (CSP) y cuáles corresponden al Cliente en cada uno de los tres modelos de servicio: IaaS (Infraestructura como Servicio, ej. AWS EC2), PaaS (Plataforma como Servicio, ej. Azure App Services) y SaaS (Software como Servicio, ej. Microsoft 365). La regla suprema de CompTIA SY0-701 es: la Seguridad Física es SIEMPRE del CSP, y la Clasificación de Datos y Gestión de Identidades (IAM) son SIEMPRE del Cliente.',
    keyTakeaways: [
      'Seguridad Física del Datacenter: 100% CSP en todos los modelos (IaaS, PaaS, SaaS).',
      'Datos, Cuentas e Identidades (IAM): 100% Cliente en todos los modelos (IaaS, PaaS, SaaS). El CSP nunca gestiona tus contraseñas ni clasifica tus archivos.',
      'Parches de Sistema Operativo: Cliente en IaaS (gestiona la VM invitada); CSP en PaaS y SaaS.',
      'Configuración de Red / Firewall: Cliente en IaaS y PaaS (Security Groups y endpoints); CSP en SaaS.',
      'Código de Aplicación y APIs: Cliente en IaaS y PaaS; CSP en SaaS (proveedor entrega el software terminado).'
    ],
    itemsGlossary: [
      {
        name: 'Seguridad Física del Data Center & Hardware',
        badge: 'Infraestructura Física',
        definition:
          'Control de acceso perimetral a las instalaciones del centro de datos, cerraduras biométricas, cámaras CCTV, extintores y reemplazo de discos y servidores físicos.',
        whyCorrectOrRole:
          'En cualquier nube pública, el CSP es el único custodio con acceso físico a los servidores.',
        distractorWarning:
          'Asignar seguridad física al cliente en la nube pública es un fallo grave: el cliente no tiene llaves ni acceso físico a las instalaciones de AWS, Azure o GCP.'
      },
      {
        name: 'Hipervisor y Red Subyacente (SDN / Virtualización)',
        badge: 'Capa de Aislamiento',
        definition:
          'Software de virtualización (KVM, Xen, Hyper-V) que orquesta el multi-tenancy y las tarjetas de red físicas de los hosts.',
        whyCorrectOrRole:
          'Responsabilidad 100% del CSP en IaaS, PaaS y SaaS. El cliente no tiene visibilidad ni privilegios sobre el kernel del hipervisor físico.',
        distractorWarning:
          'El cliente configura interfaces virtuales en su VPC, pero el hipervisor y el hardware de conmutación son administrados por el CSP.'
      },
      {
        name: 'Parches del Sistema Operativo de la Instancia',
        badge: 'Capa de Sistema Operativo',
        definition:
          'Instalación de parches de seguridad del kernel de Linux o Windows Server, mitigación de vulnerabilidades CVE del SO y hardening de servicios locales.',
        whyCorrectOrRole:
          'En IaaS, el cliente tiene privilegios de root/administrador y es responsable de actualizar su SO. En PaaS y SaaS, el CSP mantiene el runtime y el SO automáticamente.',
        distractorWarning:
          'Pensar que AWS o Azure parchan el Windows Server de tu EC2/VM por ti es una causa común de brechas de seguridad.'
      },
      {
        name: 'Configuración de Reglas de Firewall / Security Groups',
        badge: 'Capa de Red Lógica',
        definition:
          'Listas de control de acceso de subred (NACLs) y reglas de inspección con estado (Security Groups) que limitan puertos entrantes y salientes.',
        whyCorrectOrRole:
          'El cliente define qué puertos se abren hacia sus aplicaciones en IaaS y PaaS.',
        distractorWarning:
          'En SaaS el cliente no configura puertos de firewall; el CSP expone únicamente endpoints web seguros HTTPS.'
      },
      {
        name: 'Código de Aplicación, APIs y Lógica de Negocio',
        badge: 'Capa de Aplicación',
        definition:
          'Desarrollo seguro del software, gestión de dependencias de terceros, validación de entradas contra SQLi/XSS y gestión de tokens.',
        whyCorrectOrRole:
          'El cliente escribe y despliega su propio código en IaaS y PaaS.',
        distractorWarning:
          'En SaaS el proveedor (ej. Salesforce o Microsoft) escribe el código; el cliente solo lo consume.'
      },
      {
        name: 'Clasificación de Datos, Control de Acceso IAM y Gestión de Cuentas',
        badge: 'Capa de Información e Identidad',
        definition:
          'Determinación de qué usuarios acceden a qué información confidencial, forzado de MFA, políticas de contraseñas y cifrado de datos.',
        whyCorrectOrRole:
          'Es la responsabilidad sagrada del cliente en IaaS, PaaS y SaaS sin excepción.',
        distractorWarning:
          'El CSP provee las herramientas de cifrado e IAM, pero el cliente es quien decide a quién otorga permisos y qué datos sube a la plataforma.'
      }
    ]
  },

  // ==========================================
  // PBQ 42: MITRE ATT&CK Threat Hunting, Windows Events & Active Directory
  // ==========================================
  'pbq-42': {
    pbqId: 'pbq-42',
    overviewRationale:
      'La correlación forense entre tácticas, técnicas y procedimientos (TTPs) de MITRE ATT&CK, los registros de eventos de Windows (Windows Security Event IDs) y los controles de mitigación empresarial es uno de los temas más evaluados en CompTIA SY0-701. El Threat Hunter debe saber asociar de inmediato los Event IDs 4769 (Kerberoasting), 4768 (Golden Ticket / KRBTGT), 4624 Tipo 9 (LSASS / Mimikatz), 4625 / UDP 5355 (LLMNR / Responder) y 4104 (PowerShell Script Block Logging) con sus contramedidas definitivas.',
    keyTakeaways: [
      'Event ID 4769 con cifrado 0x17 (RC4-HMAC) = Kerberoasting. Mitigación: gMSA (Group Managed Service Accounts) forzando AES-256.',
      'T1003 (OS Credential Dumping: LSASS) con Event ID 4624 Tipo 9 = Mimikatz. Mitigación: Windows Defender Credential Guard con VBS.',
      'T1557.001 con tráfico UDP 5355 = Responder / LLMNR Poisoning. Mitigación: Deshabilitar LLMNR y NetBIOS vía GPO y activar SMB Signing.',
      'T1558.001 con TGT forjado de 10 años = Golden Ticket. Mitigación: Resetear la contraseña de la cuenta de dominio KRBTGT dos veces consecutivas.',
      'T1059.001 con Event ID 4104 = PowerShell ScriptBlock ofuscado. Mitigación: Constrained Language Mode (CLM) y WDAC/AppLocker.'
    ],
    itemsGlossary: [
      {
        name: 'T1558.003: Kerberoasting & Event ID 4769 (RC4)',
        badge: 'Ataque a Tickets Kerberos',
        definition:
          'Técnica en la que un usuario autenticado solicita tickets de servicio Kerberos (TGS) para Service Principal Names (SPNs) y los crackea offline por fuerza bruta.',
        whyCorrectOrRole:
          'Telemetría clave: Windows Security Event ID 4769 con Ticket Options sospechosos y cifrado 0x17 (RC4-HMAC). Contramedida: Cuentas de servicio administradas por grupo (gMSA) con contraseñas aleatorias de 128 caracteres forzando AES-256.',
        distractorWarning:
          'Cambiar la contraseña del usuario atacante no detiene el crackeo del ticket TGS que ya fue extraído a la máquina local del atacante.'
      },
      {
        name: 'T1003: LSASS Memory Dumping & Event ID 4624 Tipo 9',
        badge: 'Extracción de Credenciales',
        definition:
          'Uso de herramientas como Mimikatz para inyectar código en el proceso Local Security Authority Subsystem Service (lsass.exe) y volcar hashes NTLM y contraseñas en claro.',
        whyCorrectOrRole:
          'Telemetría: Sysmon Event 10 o Event 4624 Logon Type 9 (NewCredentials). Contramedida: Credential Guard con Virtualization-Based Security (VBS), aislando los secretos en un micro-hipervisor inaccesible para procesos con privilegios de SYSTEM.',
        distractorWarning:
          'Tener antivirus tradicional es insuficiente si el atacante utiliza volcados de memoria nativos mediante comsvcs.dll o ProcDump.'
      },
      {
        name: 'T1557.001: LLMNR / NBT-NS Poisoning & Event ID 4625',
        badge: 'Adversary-in-the-Middle',
        definition:
          'Ataque donde herramientas como Responder escuchan peticiones multicast/broadcast UDP 5355 o UDP 137 cuando un usuario escribe mal el nombre de un recurso de red, respondiendo con la IP del atacante para capturar hashes NTLMv2.',
        whyCorrectOrRole:
          'Telemetría: Ráfagas de fallos Event 4625 y tráfico broadcast anómalo. Contramedida: Deshabilitar LLMNR y NetBIOS vía GPO en toda la red corporativa y exigir firma digital SMB Signing.',
        distractorWarning:
          'Filtrar puertos perimetrales no detiene Responder, ya que el ataque ocurre íntegramente dentro del segmento de difusión local de Capa 2.'
      },
      {
        name: 'T1558.001: Golden Ticket Kerberos Forgery & KRBTGT',
        badge: 'Persistencia Total de Dominio',
        definition:
          'Ataque de persistencia donde el adversario compromete el hash NTLM o clave AES de la cuenta del sistema KRBTGT en el Controlador de Dominio y forja un Ticket Granting Ticket (TGT) con validez de 10 años y permisos de Enterprise Admin.',
        whyCorrectOrRole:
          'Telemetría: Event ID 4768 con tiempos de expiración desorbitados sin autenticación previa. Mitigación obligatoria: Cambiar dos veces consecutivas la contraseña de la cuenta KRBTGT para invalidar el historial de tickets anteriores.',
        distractorWarning:
          'Cambiar solo una vez la contraseña de KRBTGT permite al atacante seguir usando el ticket debido a la compatibilidad con el valor de contraseña anterior en Active Directory.'
      },
      {
        name: 'T1059.001: PowerShell Ofuscado Base64 & Event ID 4104',
        badge: 'Malware Sin Archivos (Fileless)',
        definition:
          'Ejecución de scripts PowerShell en memoria utilizando el parámetro "-EncodedCommand" para evadir escaneos en disco y reglas antivirus estándar.',
        whyCorrectOrRole:
          'Telemetría: Event ID 4104 (Script Block Logging), que desofusca y registra el código exacto ejecutado. Mitigación: Forzar Constrained Language Mode (CLM) y políticas de control de aplicaciones como AppLocker o WDAC.',
        distractorWarning:
          'Configurar la Execution Policy en "Restricted" no detiene el malware porque el parámetro "-ExecutionPolicy Bypass" puede pasarse en la línea de comando.'
      }
    ]
  },

  // ==========================================
  // PBQ 43: Data Governance, Roles & Sanitization (NIST SP 800-88)
  // ==========================================
  'pbq-43': {
    pbqId: 'pbq-43',
    overviewRationale:
      'La Gobernanza de Datos y el ciclo de vida de la información (Objetivo 1.2 del syllabus SY0-701) exige una separación estricta de responsabilidades organizacionales y la aplicación de salvaguardas técnicas acordes al estado del dato y su fase final de sanitización bajo el estándar NIST SP 800-88 Rev 1. Los datos deben protegerse en reposo (cifrado de volumen AES-256), en tránsito (protocolos de transporte seguro TLS 1.3 / IPsec) y en uso (enclaves aislados de CPU mediante Computación Confidencial). Para el desmantelamiento de medios, se debe aplicar la jerarquía: Clearing para reutilización interna, Purging (desmagnetización HDD) para impedir análisis forense, Destrucción Física para fin de vida, y Crypto-shredding para almacenamiento en la nube donde no se posee control del hardware.',
    keyTakeaways: [
      'El Data Owner (propietario del negocio) es el responsable legal de definir el nivel de clasificación y autorizar los accesos. El Data Custodian (TI) es quien ejecuta técnicamente los respaldos, almacenamiento y cifrado.',
      'El Data Steward vela por la calidad, metadata y coherencia de los datos para asegurar que cumplan las políticas de la organización.',
      'Los datos "En Uso" residen en RAM y registros de procesador; la Computación Confidencial (Trusted Execution Environments - TEE) es la única técnica que impide que un administrador del hipervisor o malware con privilegios lea la memoria.',
      'NIST SP 800-88 Rev 1: Clear = sobreescritura de sectores para reutilizar el disco dentro de la organización; Purge = desmagnetización (Degaussing) o sanitización a nivel de firmware para impedir recuperación forense en laboratorio; Destroy = trituración mecánica o incineración con certificado formal de destrucción.',
      'En entornos Cloud (IaaS/PaaS/SaaS), la sanitización certificada se realiza mediante Crypto-shredding: destruir la clave DEK/KEK en el KMS hace que los datos cifrados sean matemáticamente irrecuperables al instante.'
    ],
    itemsGlossary: [
      {
        name: 'Data Owner (Propietario del Dato)',
        badge: 'Gobernanza / Negocio',
        definition:
          'Líder o ejecutivo del área de negocio que genera o utiliza los datos. Tiene la responsabilidad legal y final sobre su confidencialidad, integridad y disponibilidad.',
        whyCorrectOrRole:
          'Es el único rol facultado para clasificar la información (Pública, Interna, Confidencial, Restringida) y aprobar quién tiene autorización de acceso.',
        distractorWarning:
          'Confundir con Data Custodian: el departamento de TI no decide quién tiene acceso; solo implementa las decisiones del Data Owner.'
      },
      {
        name: 'Data Custodian (Custodio del Dato)',
        badge: 'Operaciones TI',
        definition:
          'Personal técnico (ingenieros de sistemas, administradores de bases de datos) encargado del mantenimiento diario y seguridad física/lógica de los repositorios de datos.',
        whyCorrectOrRole:
          'Implementa los controles de seguridad dictados por el Data Owner: ejecución de backups periódicos, gestión de parches, cifrado y restauración ante desastres.',
        distractorWarning:
          'El Custodian no asigna la clasificación de los datos; únicamente aplica los controles acordes a la etiqueta ya asignada.'
      },
      {
        name: 'Data Steward (Administrador de Calidad del Dato)',
        badge: 'Calidad & Metadatos',
        definition:
          'Especialista responsable de supervisar la calidad, precisión, consistencia y adhesión a estándares normativos del contenido de los datos a nivel corporativo.',
        whyCorrectOrRole:
          'Garantiza que los metadatos y etiquetado sigan la taxonomía corporativa y que los datos conserven su integridad operativa para el negocio.',
        distractorWarning:
          'No se encarga de la infraestructura de hardware ni de las copias de seguridad (tarea del Custodian).'
      },
      {
        name: 'Data Protection Officer / DPO (Oficial de Privacidad)',
        badge: 'Legal & Cumplimiento',
        definition:
          'Rol de supervisión independiente exigido por regulaciones como GDPR encargado de vigilar el cumplimiento de las leyes de privacidad y servir de contacto con las autoridades.',
        whyCorrectOrRole:
          'Audita el tratamiento de datos personales, asesora en Evaluaciones de Impacto en la Privacidad (DPIA) y asegura los derechos de los titulares (ARCO/GDPR).',
        distractorWarning:
          'El DPO no define la arquitectura técnica ni ejecuta los respaldos operativos del sistema.'
      },
      {
        name: 'Protección de Datos En Uso (Data in Use) - Computación Confidencial',
        badge: 'Criptografía & Hardware',
        definition:
          'Tecnología basada en hardware (enclaves seguros de CPU / TEE como AMD SEV o Intel SGX) que cifra la memoria RAM activa durante el procesamiento en la CPU.',
        whyCorrectOrRole:
          'Es la única defensa eficaz contra volcados de memoria, ataques DMA, malware en anillo 0 y espionaje por parte del administrador del hipervisor o proveedor de la nube.',
        distractorWarning:
          'El cifrado AES en disco (BitLocker) solo protege datos en reposo; cuando el sistema arranca y procesa en RAM, los datos quedan expuestos sin Computación Confidencial.'
      },
      {
        name: 'Purging / Degaussing (NIST SP 800-88)',
        badge: 'Sanitización Certificada',
        definition:
          'Técnica que expone discos magnéticos (HDD tradicionales o cintas) a un potente campo electromagnético que desordena permanentemente los dominios magnéticos.',
        whyCorrectOrRole:
          'Rinde el disco completamente inoperable y destruye la información al punto de imposibilitar la reconstrucción incluso en laboratorios forenses especializados.',
        distractorWarning:
          'El Degaussing NO funciona en unidades de estado sólido (SSD, NVMe o memorias Flash) porque carecen de platos magnéticos.'
      },
      {
        name: 'Crypto-shredding (Borrado Criptográfico)',
        badge: 'Sanitización en Nube',
        definition:
          'Destrucción deliberada e irreversible de las claves de cifrado (DEK/KEK) utilizadas para proteger un volumen de datos con cifrado robusto (AES-256).',
        whyCorrectOrRole:
          'Es el estándar de facto para desinfectar volúmenes en la nube pública (AWS EBS, Azure Managed Disks), donde el cliente no tiene acceso físico al disco para triturarlo.',
        distractorWarning:
          'Solo es válido si los datos fueron previamente cifrados con un algoritmo robusto y la clave fue destruida de forma certificada en el KMS o HSM.'
      }
    ]
  },

  // ==========================================
  // PBQ 44: Privacy Enhancing Technologies (PETs) & Data Obfuscation
  // ==========================================
  'pbq-44': {
    pbqId: 'pbq-44',
    overviewRationale:
      'Las Tecnologías de Mejora de la Privacidad (PETs) permiten a las organizaciones utilizar y compartir información valiosa mientras minimizan la exposición de datos personales sensibles (PII/PHI). En CompTIA Security+ SY0-701, es vital comprender el grado de reversibilidad y el mecanismo de cada técnica: la Tokenización sustituye datos críticos por tokens aleatorios mediante un almacén seguro (Token Vault) para reducir el alcance PCI-DSS; el Enmascaramiento Estático sustituye irreversiblemente los datos en entornos de no producción (Dev/QA); el Enmascaramiento Dinámico altera la visualización al vuelo en consultas de usuarios sin alterar el almacenamiento real; la Anonimización desvincula permanentemente los datos eliminando identificadores directos e indirectos sin posibilidad de re-identificación (liberándolos de GDPR); y la Seudonimización reemplaza identificadores pero conserva una clave separada para re-identificación en emergencias clínicas.',
    keyTakeaways: [
      'Tokenización: Sustituye el dato (PAN de tarjeta) por un token sin correlación matemática ni algoritmo de cifrado. Solo el Token Vault autenticado puede revertirlo.',
      'Static Data Masking: Modifica de manera permanente e irreversible los datos en una base de datos clonada. Ideal para transferir datos a desarrolladores y probadores externos.',
      'Dynamic Data Masking: Se aplica en tiempo real en la capa de base de datos o presentación (ej. SQL Server DDM) en función del rol del usuario; en el disco, el dato permanece completo.',
      'Anonimización vs Seudonimización: La Anonimización es completamente irreversible por diseño; bajo GDPR Recital 26, los datos anonimizados ya NO son considerados datos personales. La Seudonimización permite re-identificación usando una clave separada y protegida, por lo que SIGUE estando dentro del alcance de GDPR.',
      'PCI-DSS Scope: La tokenización permite que las tiendas online y servidores de aplicaciones no almacenen nunca datos de titulares de tarjetas (PAN), delegando el cumplimiento estricto a la pasarela de pagos.'
    ],
    itemsGlossary: [
      {
        name: 'Tokenización (Tokenization) con Token Vault',
        badge: 'PCI-DSS & Pagos',
        definition:
          'Proceso que intercambia un dato confidencial (como el PAN de 16 dígitos de una tarjeta de crédito) por un valor aleatorio generado por software denominado "token".',
        whyCorrectOrRole:
          'El token no tiene relación matemática con el valor original (a diferencia del cifrado, que puede descifrarse matemáticamente con la clave). Solo el servidor de bóveda (Vault) puede consultar la correspondencia.',
        distractorWarning:
          'No confundir con cifrado simétrico: si un atacante roba una base de datos con tokens sin acceder a la bóveda de tokens, no puede obtener ningún dato de tarjeta.'
      },
      {
        name: 'Static Data Masking (Enmascaramiento Estático)',
        badge: 'DevOps & QA',
        definition:
          'Técnica que reescribe de forma permanente el contenido de una base de datos sustituyendo los datos sensibles reales por datos ficticios pero coherentes.',
        whyCorrectOrRole:
          'Es irreversible en la base de datos de destino. Permite a los equipos de desarrollo y aseguramiento de calidad (QA) probar aplicaciones con estructuras reales sin riesgo de fuga de PII.',
        distractorWarning:
          'Nunca debe aplicarse directamente sobre la base de datos de producción original, ya que destruiría permanentemente los datos legítimos de los clientes.'
      },
      {
        name: 'Dynamic Data Masking (Enmascaramiento Dinámico)',
        badge: 'Help Desk / Call Center',
        definition:
          'Regla de visualización en tiempo real aplicada por el motor de base de datos o middleware que oculta caracteres sensibles (ej. ************5678) según los privilegios del usuario consultor.',
        whyCorrectOrRole:
          'El dato en reposo en disco permanece intacto y completo. Los operadores telefónicos pueden confirmar transacciones sin tener acceso al número completo de cuenta.',
        distractorWarning:
          'No protege contra un atacante que obtenga acceso directo a nivel de almacenamiento o realice copias de seguridad directas del archivo de base de datos (.mdf/.ibd).'
      },
      {
        name: 'Anonimización (Anonymization) Irreversible',
        badge: 'Investigación & GDPR Exento',
        definition:
          'Técnica que desvincula permanentemente los datos personales de tal forma que el sujeto no puede ser identificado directa ni indirectamente, ni siquiera por el custodio original.',
        whyCorrectOrRole:
          'Bajo el Reglamento General de Protección de Datos (GDPR, Considerando 26), los principios de protección de datos NO se aplican a la información anónima.',
        distractorWarning:
          'Si existe alguna clave, algoritmo o tabla que permita volver a identificar al paciente, el proceso es Seudonimización, no Anonimización.'
      },
      {
        name: 'Seudonimización (Pseudonymization)',
        badge: 'Ensayos Clínicos & Salud',
        definition:
          'Tratamiento de datos personales de manera que ya no puedan atribuirse a un interesado sin utilizar información adicional guardada por separado bajo medidas técnicas de seguridad.',
        whyCorrectOrRole:
          'Esencial en ensayos médicos farmacéuticos: los científicos analizan resultados sin conocer al paciente, pero el médico de cabecera puede re-identificarlo con la clave en caso de reacción adversa crítica.',
        distractorWarning:
          'A diferencia de la anonimización, los datos seudonimizados continúan estando legalmente sujetos a las obligaciones y multas de GDPR.'
      }
    ]
  },

  // ==========================================
  // PBQ 45: Comprehensive Malware Triage - Parte 1 (Endpoints & Criptografía)
  // ==========================================
  'pbq-45': {
    pbqId: 'pbq-45',
    overviewRationale:
      'El análisis de malware y la identificación de indicadores de compromiso (IoC) en endpoints es una de las competencias más evaluadas en el Dominio 2 de CompTIA Security+ (SY0-701, Objetivo 2.2). Las amenazas modernas combinan técnicas de evasión complejas: el Ransomware destruye las instantáneas de sombra de Windows (vssadmin delete shadows) antes de cifrar con criptografía robusta (AES/RSA) para forzar el pago; los Troyanos de Acceso Remoto (RAT) se camuflan en utilidades legítimas y abren un canal inverso C2 interactivo; los Rootkits de Kernel (Ring 0) interceptan la tabla de despacho de servicios (SSDT) para volverse invisibles ante el Administrador de Tareas y herramientas de usuario; el Spyware/InfoStealer extrae pulsaciones (GetAsyncKeyState) y bases de datos SQLite de navegadores; y el Malware Sin Archivos (Fileless/LotL) inyecta scripts codificados en Base64 en procesos nativos del sistema sin tocar el disco duro.',
    keyTakeaways: [
      'Ransomware: La directiva oficial de CompTIA y NIST es aislar inmediatamente el host infectado y NUNCA pagar el rescate. Restaurar siempre desde copias de seguridad inmutables o desconectadas siguiendo la regla 3-2-1.',
      'Rootkit de Kernel / UEFI: Al ejecutarse en Ring 0, altera las llamadas al sistema del propio SO para ocultar sus procesos y archivos. Los antivirus estándar en modo usuario quedan inutilizados; la única solución aceptable en CompTIA es el Clean Reimaging desde cero y forzar UEFI Secure Boot con TPM.',
      'Fileless Malware (Living-off-the-Land): No escribe binarios .exe en disco; reside exclusivamente en la RAM. Reiniciar el host vacía la memoria activa, pero para mitigar la persistencia se debe forzar PowerShell Constrained Language Mode (CLM) y políticas de control de aplicaciones como WDAC o AppLocker.',
      'Spyware / InfoStealers: Roban silenciosamente tokens de sesión (Cookies) y credenciales. La respuesta no es solo cambiar la contraseña: se deben invalidar inmediatamente los tokens de sesión activos y forzar MFA resistente a phishing (FIDO2 / WebAuthn).',
      'Remote Access Trojans (RAT): Abren sockets TCP inversos que permiten a un atacante remoto controlar la pantalla, el mouse y la cámara web. Requieren finalizar el proceso malicioso en memoria, eliminar la persistencia en el registro y revocar credenciales de inmediato.'
    ],
    itemsGlossary: [
      {
        name: 'Ransomware / Criptomalware (Cifrado Extorsivo)',
        badge: 'Amenaza Criptográfica',
        definition:
          'Malware que cifra masivamente los archivos del usuario o del sistema con cifrado asimétrico/simétrico robusto, exigiendo un rescate en criptomonedas no rastreables para entregar la clave privada de descifrado.',
        whyCorrectOrRole:
          'Se identifica por la alteración masiva de extensiones (ej. .locked), notas de rescate (HOW_TO_DECRYPT) y la ejecución de "vssadmin.exe delete shadows /all /quiet" para evitar la recuperación local.',
        distractorWarning:
          'Pagar el rescate es una opción incorrecta en CompTIA porque no garantiza la entrega de la clave y financia actividades delictivas.'
      },
      {
        name: 'Remote Access Trojan (RAT)',
        badge: 'Backdoor & C2',
        definition:
          'Software malicioso que se hace pasar por un programa benigno (troyano) y abre un canal de comunicación inverso hacia el atacante, otorgándole control remoto total del equipo.',
        whyCorrectOrRole:
          'Permite control interactivo de mouse/teclado, streaming de cámara web y micrófono, transferencia de archivos y ejecución de comandos remotos a través de puertos no estándar.',
        distractorWarning:
          'Difiere de un software de soporte legítimo (como TeamViewer o AnyDesk) en que se instala y ejecuta sin consentimiento ni interfaz visible para el usuario.'
      },
      {
        name: 'Rootkit de Modo Kernel / UEFI',
        badge: 'Persistencia en Ring 0',
        definition:
          'Colección de herramientas que opera con los máximos privilegios del sistema operativo (Ring 0 / Kernel) o a nivel de firmware UEFI, diseñada para ocultar la presencia de malware y procesos.',
        whyCorrectOrRole:
          'Engancha la SSDT (System Service Descriptor Table) o el VFS para que comandos como "ps aux", "netstat" o el Administrador de Tareas filtren y oculten los procesos y puertos del atacante.',
        distractorWarning:
          'Un escaneo antivirus estándar desde el propio sistema infectado no puede detectar un rootkit de kernel porque el rootkit engaña a la API del antivirus.'
      },
      {
        name: 'Spyware / InfoStealer & Keylogger',
        badge: 'Exfiltración de Credenciales',
        definition:
          'Programa espía que monitoriza silenciosamente la actividad del usuario, interceptando pulsaciones de teclado, capturas de pantalla y bases de datos de cookies/contraseñas de navegadores web.',
        whyCorrectOrRole:
          'Utiliza llamadas como GetAsyncKeyState y SetWindowsHookExW para capturar contraseñas antes de que sean cifradas por el navegador o la aplicación.',
        distractorWarning:
          'A diferencia del ransomware o los cryptominers, el spyware busca deliberadamente pasar desapercibido sin degradar el rendimiento del hardware.'
      },
      {
        name: 'Fileless Malware / Living-off-the-Land (LotL)',
        badge: 'Ejecución en Memoria',
        definition:
          'Malware que no escribe archivos ejecutables en el disco duro; se ejecuta directamente en la memoria RAM aprovechando herramientas legítimas del sistema operativo (PowerShell, WMI, mshta).',
        whyCorrectOrRole:
          'Evade completamente los escáneres antivirus tradicionales basados en firmas de archivos en disco. Se detecta analizando la memoria o mediante PowerShell Script Block Logging (Event ID 4104).',
        distractorWarning:
          'Creer que el equipo está limpio solo porque el antivirus informa "0 archivos infectados" es un error grave: el malware reside en la memoria de procesos legítimos como explorer.exe.'
      }
    ]
  },

  // ==========================================
  // PBQ 46: Comprehensive Malware Triage - Parte 2 (Amenazas de Red, Lógica y Evasión Avanzada)
  // ==========================================
  'pbq-46': {
    pbqId: 'pbq-46',
    overviewRationale:
      'En las amenazas de red, lógica y evasión avanzada (Dominio 2 de CompTIA Security+ SY0-701), los atacantes explotan la conectividad entre sistemas y la confianza interna. Un Gusano de Red (Network Worm) es completamente autónomo y no requiere que un usuario abra ningún archivo para propagarse a través de puertos de red como SMB (TCP 445); las Botnets reclutan miles de equipos infectados (zombies) que reciben instrucciones vía balizas (beaconing) para lanzar ataques DDoS coordinados; las Bombas Lógicas (Logic Bombs) son implantadas típicamente por amenazas internas (insiders) y se activan al cumplirse una condición específica; el Cryptojacking secuestra ciclos de CPU/GPU para enriquecer al atacante; y el Malware Polimórfico muta continuamente su estructura de código y cifrado para anular las firmas estáticas basadas en hashes.',
    keyTakeaways: [
      'Gusano de Red (Worm) vs Virus: El gusano se auto-propaga a través de la red sin necesidad de interacción humana ni archivo anfitrión. Se mitiga aislando la VLAN, aplicando parches críticos (MS17-010) y deshabilitando SMBv1.',
      'Botnet / Zombie C2: Los hosts infectados realizan llamadas de baliza periódicas (beaconing) a intervalos constantes hacia dominios DGA. La contención perimetral se logra con DNS Sinkholing y bloqueo de IPs en el NGFW.',
      'Bomba Lógica (Logic Bomb): No es un malware con propagación en red; es código insertado deliberadamente por una amenaza interna que permanece latente. Se previene con separación de deberes, revisión por pares de código y revocación inmediata de cuentas al despedir empleados (offboarding).',
      'Cryptojacking / Cryptominer: Provoca lentitud extrema y uso de procesador estancado en el 99-100%. Se remedia matando los procesos no autorizados y bloqueando puertos de minería (TCP 3333 / protocolo Stratum) en el firewall perimetral.',
      'Malware Polimórfico: Cambia su firma hash (SHA-256) en cada máquina infectada mediante motores de mutación y rutinas variables de descifrado. Requiere obligatoriamente EDR con análisis de comportamiento y detonación en Sandboxing.'
    ],
    itemsGlossary: [
      {
        name: 'Gusano de Red (Network Worm)',
        badge: 'Propagación Autónoma',
        definition:
          'Malware auto-replicante que se desplaza y propaga a través de redes informáticas sin requerir intervención humana ni acoplarse a un programa anfitrión existente.',
        whyCorrectOrRole:
          'Explota activamente vulnerabilidades en servicios de red escuchando en puertos abiertos (ej. SMB TCP 445 en EternalBlue o RPC TCP 135) para infectar subredes completas en minutos.',
        distractorWarning:
          'Un virus requiere que un usuario ejecute un archivo infectado para activarse y propagarse; un gusano se propaga solo.'
      },
      {
        name: 'Botnet / Agente Zombi de Comando y Control (C2)',
        badge: 'Ataques Distribuidos',
        definition:
          'Red de dispositivos comprometidos controlados remotamente por un atacante (botmaster) mediante servidores de Comando y Control (C2).',
        whyCorrectOrRole:
          'Mantiene tráfico de baliza periódico (beaconing) para recibir órdenes coordinadas de lanzar ataques volumétricos de Denegación de Servicio Distribuido (DDoS) o envío masivo de spam.',
        distractorWarning:
          'El DNS Sinkholing es la contención perimetral estándar para capturar las peticiones DGA de los bots y redirigirlas a una dirección segura para su análisis.'
      },
      {
        name: 'Bomba Lógica (Logic Bomb)',
        badge: 'Amenaza Interna (Insider)',
        definition:
          'Código malicioso incrustado intencionadamente en un programa o script que permanece inactivo hasta que se cumple una condición o evento específico.',
        whyCorrectOrRole:
          'Típica represalia de administradores o programadores descontentos: se programa para disparar el borrado de bases de datos si el usuario es dado de baja en Active Directory o tras una fecha límite.',
        distractorWarning:
          'Las bombas lógicas no se replican por sí mismas ni infectan otros equipos; su daño se limita al entorno donde fueron plantadas.'
      },
      {
        name: 'Cryptojacking / Malware de Minería',
        badge: 'Secuestro de Recursos',
        definition:
          'Uso no autorizado de los recursos de hardware (CPU, GPU, memoria) de una víctima para realizar cálculos criptográficos y minar criptomonedas (como Monero XMR).',
        whyCorrectOrRole:
          'Se detecta por el consumo continuo del 100% de CPU, sobrecalentamiento de equipos y conexiones salientes en puertos específicos de minería como TCP 3333 o 4444 (protocolo Stratum).',
        distractorWarning:
          'A diferencia del ransomware, los cryptominers no buscan destruir ni cifrar datos, sino permanecer ocultos consumiendo electricidad y procesamiento el mayor tiempo posible.'
      },
      {
        name: 'Malware Polimórfico / Metamórfico',
        badge: 'Evasión de Firmas',
        definition:
          'Malware equipado con un motor de mutación que altera su código binario, rutina de descifrado, clave y estructura en cada infección, conservando la misma función maliciosa básica.',
        whyCorrectOrRole:
          'Rinde inútiles las bases de datos de firmas antivirus basadas en hashes estáticos (MD5 o SHA-256), ya que cada muestra descargada genera un hash completamente diferente.',
        distractorWarning:
          'El análisis de comportamiento en tiempo real (EDR) y la emulación en Sandbox son indispensables para detectar este malware cuando se ejecuta en memoria.'
      }
    ]
  },

  // ==========================================
  // PBQ 47: Secure Software Development & OWASP API Top 10
  // ==========================================
  'pbq-47': {
    pbqId: 'pbq-47',
    overviewRationale:
      'La seguridad en el desarrollo de software (SDLC) y la protección de microservicios y APIs REST son temas centrales en el Dominio 3 de CompTIA Security+ (SY0-701, Objetivo 3.4). Las APIs modernas representan la principal superficie de ataque en aplicaciones en la nube, donde los controles de frontend son completamente inútiles. CompTIA evalúa la capacidad de analizar peticiones HTTP/cURL, payloads JSON y fragmentos de código para identificar vulnerabilidades del OWASP API Security Top 10: Broken Object Level Authorization (BOLA/IDOR), Server-Side Request Forgery (SSRF) dirigido contra servicios de metadatos de instancias cloud (169.254.169.254), falsificación de tokens JSON Web Token (JWT) aceptando el algoritmo "none", inyección SQL a través de parámetros REST desprotegidos y ausencia de limitación de tasa (Rate Limiting) permitiendo ataques masivos de Credential Stuffing y denegación de servicio.',
    keyTakeaways: [
      'BOLA / IDOR (API1:2023): Ocurre cuando un atacante autenticado sustituye un identificador de objeto en la URI (ej. /users/502) para acceder a registros de otro usuario sin que el backend valide si el objeto pertenece a la sesión activa. La remediación obligatoria es aplicar RBAC con verificación de pertenencia a nivel de objeto en el backend.',
      'SSRF en la Nube (API7:2023): Si un endpoint backend realiza peticiones HTTP a URLs suministradas por el cliente sin filtrar, un atacante puede forzar al servidor a consultar "http://169.254.169.254/latest/meta-data/", exfiltrando credenciales de IAM de la máquina virtual. Se mitiga implementando listas blancas estrictas de dominios, bloqueando rangos link-local (169.254.0.0/16) y migrando a IMDSv2.',
      'JWT Algoritmo "none" Tampering (API2:2023): Las bibliotecas JWT mal configuradas permiten que un atacante modifique el header a {"alg": "none"}, elimine la firma criptográfica y modifique el payload a {"role": "superadmin"}. El backend NUNCA debe aceptar tokens sin firma ni con "alg: none"; debe forzar algoritmos asimétricos robustos (RS256/ES256) validados contra claves públicas en un JWKS.',
      'Inyección SQL en APIs REST: Concatenar parámetros de URI o del body JSON directamente en cadenas SQL permite eludir la autenticación y volcar bases de datos completas. La remediación fundamental y única aceptada por CompTIA es el uso estricto de Consultas Preparadas (Prepared Statements) o un ORM parametrizado.',
      'Falta de Limitación de Recursos / Rate Limiting (API4:2023): La ausencia de límites de peticiones por segundo en endpoints críticos como /auth/token permite a botnets realizar ataques de Credential Stuffing con miles de combinaciones por minuto. Se remedia configurando Rate Limiting basado en Token Bucket en el API Gateway, reglas perimetrales en WAF y desafíos CAPTCHA adaptativos.'
    ],
    itemsGlossary: [
      {
        name: 'Broken Object Level Authorization (BOLA / IDOR)',
        badge: 'OWASP API1:2023',
        definition:
          'Fallo de control de acceso en el backend donde la API expone un identificador de objeto interno en la URI y confía ciegamente en él sin verificar si el usuario autenticado tiene permisos legítimos para acceder a dicho objeto.',
        whyCorrectOrRole:
          'Permite a un usuario autenticado ver y modificar perfiles, extractos bancarios o información privada de cualquier otro cliente simplemente alterando el número de ID en la petición HTTP.',
        distractorWarning:
          'Ocultar el ID en el frontend o usar UUIDs ofuscados sin validación del lado del servidor no soluciona BOLA; solo ofrece seguridad por oscuridad.'
      },
      {
        name: 'Server-Side Request Forgery (SSRF) vs Cloud Metadata',
        badge: 'OWASP API7:2023',
        definition:
          'Vulnerabilidad en la que un servidor web o API realiza peticiones de red hacia un destino arbitrario especificado por el usuario, permitiendo atacar recursos internos o el servicio de metadatos de la instancia cloud (169.254.169.254).',
        whyCorrectOrRole:
          'En entornos AWS/GCP/Azure, consultar la IP link-local de metadatos permite al atacante extraer tokens temporales de rol del IAM para tomar el control total de la infraestructura en la nube.',
        distractorWarning:
          'Un firewall perimetral estándar no mitiga SSRF, ya que la petición maliciosa se origina desde el propio servidor legítimo hacia su interfaz local.'
      },
      {
        name: 'Falsificación de Tokens JWT / Algoritmo "none"',
        badge: 'OWASP API2:2023',
        definition:
          'Fallo criptográfico en el que la biblioteca de validación de tokens acepta la especificación "alg": "none" en el encabezado del JWT, omitiendo por completo la verificación de la firma criptográfica.',
        whyCorrectOrRole:
          'Permite a cualquier usuario forjar tokens arbitrarios con roles de administrador máximo ("superadmin") simplemente editando el JSON y eliminando los bytes de la firma.',
        distractorWarning:
          'Verificar la expiración del token (exp) es inútil si la firma en sí misma no es validada contra una clave pública confiable.'
      },
      {
        name: 'Prepared Statements & Parametrización SQL',
        badge: 'Defensa SDLC',
        definition:
          'Mecanismo de base de datos que precompila la estructura de la consulta SQL y trata los datos de entrada del usuario estrictamente como literales o parámetros, nunca como código ejecutable.',
        whyCorrectOrRole:
          'Es el estándar de oro de CompTIA y OWASP para inmunizar cualquier endpoint o aplicación web contra inyecciones SQL de primer y segundo orden.',
        distractorWarning:
          'Limpiar caracteres o usar listas negras de palabras clave (como OR, UNION, SELECT) siempre es vulnerable a técnicas avanzadas de ofuscación y codificación.'
      },
      {
        name: 'Rate Limiting en API Gateway & WAF',
        badge: 'Protección Perimetral API',
        definition:
          'Control que restringe el número de peticiones que un cliente o dirección IP puede realizar a un endpoint específico dentro de una ventana de tiempo predefinida (ej. algoritmo Token Bucket o Leaky Bucket).',
        whyCorrectOrRole:
          'Imprescindible para neutralizar ataques de fuerza bruta distribuida, Credential Stuffing automatizado, raspado de datos (scraping) y ataques DoS a nivel de aplicación (Capa 7).',
        distractorWarning:
          'Aumentar los recursos de CPU o memoria de las máquinas virtuales no remedia el problema; solo encarece la factura cloud mientras los atacantes siguen comprometiendo cuentas.'
      }
    ]
  },

  // ==========================================
  // PBQ 48: SIEM Correlation Rules & SOAR Playbook Automation
  // ==========================================
  'pbq-48': {
    pbqId: 'pbq-48',
    overviewRationale:
      'Las Operaciones de Seguridad modernas (SOC), la ingeniería de detección en SIEM y la orquestación y respuesta automatizada de seguridad (SOAR) constituyen el núcleo del Dominio 4 de CompTIA Security+ (SY0-701, Objetivo 4.2). Ante volúmenes masivos de telemetría de eventos (logs de Active Directory, Sysmon, EDR, NGFW, Cloud IdP y proxies), la intervención manual es demasiado lenta para frenar ataques destructivos en tiempo real. CompTIA evalúa cómo formular reglas de correlación SIEM efectivas (basadas en umbrales de tiempo, secuencias de eventos y anomalías geográficas) y cómo vincularlas a playbooks de SOAR pre-aprobados que ejecutan acciones correctivas automáticas mediante APIs (aislamiento de red, revocación de tokens, bloqueo perimetral dinámico y remediación de cuentas) reduciendo drásticamente el Tiempo Medio de Detección (MTTD) y Respuesta (MTTR).',
    keyTakeaways: [
      'Impossible Travel Anomaly: Dos autenticaciones exitosas para la misma cuenta con una separación temporal físicamente imposible para la distancia entre las ubicaciones geográficas (ej. Frankfurt y Tokio en 8 minutos) indica compromiso de credenciales o robo de cookies de sesión. La acción SOAR inmediata debe revocar todos los tokens de sesión en el IdP cloud, forzar restablecimiento de credenciales y exigir autenticación FIDO2.',
      'Detección de Ransomware y Borrado de Copias de Sombra: Una tasa anormal de I/O de archivos combinada con la invocación de herramientas legítimas del sistema como "vssadmin.exe delete shadows" o "bcdedit" para eliminar puntos de restauración es el patrón de comportamiento definitivo del Ransomware. El playbook SOAR debe aislar de inmediato el endpoint infectado mediante el agente EDR y bloquear el dominio/IP C2 en el NGFW perimetral.',
      'Phishing con Macros que Spawnan Shells Reversas: Un proceso de oficina (WINWORD.EXE o EXCEL.EXE) creando un proceso hijo interactivo (powershell.exe o cmd.exe) con parámetros codificados (-Enc) y sockets de red abiertos hacia la WAN es un indicador crítico de compromiso (IoC). La respuesta SOAR debe matar el árbol de procesos, aislar el host y buscar por API el hash del archivo adjunto en todos los buzones de correo de la organización para purgarlo automáticamente.',
      'Ráfagas de Fuerza Bruta SSH / RDP: Cientos de fallos de autenticación en cuestión de segundos contra servicios expuestos en el perímetro (puerto 22 o 3389) requieren contención perimetral dinámica. El SOAR debe comunicarse con la API del Firewall de Próxima Generación (NGFW) e insertar la IP atacante en un grupo de bloqueo temporal dinámico (Dynamic Address Group / IP Ban).',
      'Escalamiento de Privilegios No Autorizado en Active Directory: La adición de cuentas a grupos de máxima administración (Domain Admins, Enterprise Admins) fuera de horario laboral (Event ID 4728) sin una ventana de cambio autorizada en el ITSM representa una intrusión crítica. El playbook de SOAR debe revertir automáticamente la membresía del grupo, deshabilitar la cuenta sospechosa y generar una alerta de severidad crítica (Page on-call) para el analista de guardia.'
    ],
    itemsGlossary: [
      {
        name: 'Viaje Imposible (Impossible Travel Anomaly)',
        badge: 'SIEM Anomaly Detection',
        definition:
          'Regla de correlación en SIEM/UEBA que compara las coordenadas geográficas de dos eventos de autenticación exitosos sucesivos con el intervalo de tiempo transcurrido entre ambos, detectando velocidades de desplazamiento humanamente imposibles.',
        whyCorrectOrRole:
          'Demuestra fehacientemente que las credenciales o los tokens de sesión han sido robados y están siendo explotados por un atacante en otra región geográfica.',
        distractorWarning:
          'No debe confundirse con una alerta de "nuevo dispositivo"; aquí el factor clave e inequívoco es la imposibilidad física de la distancia versus el tiempo.'
      },
      {
        name: 'Aislamiento de Red Automatizado por EDR',
        badge: 'SOAR Endpoint Playbook',
        definition:
          'Acción ejecutada por el agente EDR a través de comandos orquestados por SOAR que corta todo el tráfico de red del host infectado a nivel del kernel, excepto la conexión de gestión segura con la consola del SOC.',
        whyCorrectOrRole:
          'Es la contención más rápida y efectiva ante un brote de Ransomware, impidiendo que el malware se propague por SMB (puerto 445) a otros servidores o recursos compartidos.',
        distractorWarning:
          'Apagar la máquina físicamente o desconectar la corriente borra la memoria RAM volátil, destruyendo evidencias forenses vitales y claves temporales.'
      },
      {
        name: 'Purgado de Correo Masivo vía API (Email Purge Playbook)',
        badge: 'SOAR Email Security',
        definition:
          'Capacidad del playbook SOAR para consultar el servicio de mensajería empresarial (Microsoft Graph / Google Workspace API) utilizando el Message-ID o hash del adjunto malicioso y eliminarlo de todos los buzones de correo de la organización.',
        whyCorrectOrRole:
          'Evita que otros empleados abran el mismo correo de phishing mientras los analistas están investigando el primer incidente notificado.',
        distractorWarning:
          'Enviar un correo global advirtiendo a los empleados es una medida informativa lenta; no sustituye la erradicación técnica automatizada.'
      },
      {
        name: 'Bloqueo Dinámico en NGFW (Dynamic IP Ban)',
        badge: 'SOAR Perimeter Integration',
        definition:
          'Inserción automatizada mediante API de direcciones IP de origen maliciosas en listas de direcciones dinámicas (Dynamic Address Lists) de los firewalls perimetrales con una política de descarte inmediato (Drop/Drop reset).',
        whyCorrectOrRole:
          'Neutraliza ataques de fuerza bruta y escaneos automatizados en segundos sin requerir que un administrador de red inicie sesión manualmente en la interfaz del firewall.',
        distractorWarning:
          'El bloqueo manual en tablas locales de hosts (iptables del propio servidor) no protege al resto de los servidores de la misma subred ni alivia la carga de la interfaz.'
      },
      {
        name: 'Reversión Automática de Membresías en Active Directory',
        badge: 'SOAR Identity Governance',
        definition:
          'Acción de playbook SOAR que, tras detectar la asignación anómala de privilegios (Event ID 4728), invoca PowerShell / LDAP para remover de inmediato la cuenta del grupo Domain Admins y deshabilitarla.',
        whyCorrectOrRole:
          'Corta de raíz el movimiento lateral y el escalamiento de privilegios de adversarios o insiders deshonestos antes de que puedan desplegar persistencia o herramientas de robo de credenciales como Mimikatz.',
        distractorWarning:
          'Esperar a la confirmación telefónica con el gerente antes de revertir el acceso otorga a los atacantes una ventana crítica para completar el compromiso del dominio.'
      }
    ]
  },

  // ==========================================
  // PBQ 49: Advanced Stateful Firewall ACLs & DMZ Multi-Tier Filtering
  // ==========================================
  'pbq-49': {
    pbqId: 'pbq-49',
    overviewRationale:
      'La configuración de tablas de reglas en Firewalls de Próxima Generación (NGFW) y la microsegmentación de zonas (WAN, DMZ, LAN interna y Base de Datos PCI-DSS) es el escenario con mayor tasa de aparición histórica en CompTIA Security+ (Tier S, ~95% de probabilidad). En entornos de producción regulados, la arquitectura perimetral debe evitar el movimiento lateral de atacantes que logran comprometer un servicio público en la DMZ. CompTIA evalúa la aplicación rigurosa de tres pilares: 1) First-Match (evaluación secuencial de arriba hacia abajo), 2) Menor Privilegio (Least Privilege, limitando orígenes y destinos a IPs concretas en vez de subredes completas para bases de datos), y 3) Aislamiento Estricto de la DMZ (bloqueando de forma tajante que los servidores de la DMZ puedan iniciar conexiones hacia las estaciones de trabajo de la red corporativa o hacia la WAN en puertos no autorizados).',
    keyTakeaways: [
      'First-Match Rulebase Order: El firewall procesa las reglas en orden numérico estricto y se detiene en la primera regla coincidente. Si se coloca una regla "DENY ALL" antes de las reglas permisivas, todo el tráfico legítimo será descartado. La regla de denegación implícita debe ser SIEMPRE la última línea.',
      'Least Privilege para Bases de Datos: La base de datos (PostgreSQL 5432 o MySQL 3306) nunca debe exponerse a WAN (0.0.0.0/0) ni a toda la subred de la DMZ. Únicamente la IP fija del servidor de aplicaciones web (172.16.10.10) debe tener permiso de consulta.',
      'Aislamiento DMZ -> LAN: La zona desmilitarizada está diseñada para asumir un compromiso. Por ello, una directiva de seguridad vital es denegar cualquier conexión originada en la DMZ hacia la LAN interna (10.0.20.0/24), impidiendo que un atacante salte hacia los equipos de empleados o use SMB (445).',
      'Salida Web Controlada: La LAN corporativa debe poder navegar hacia Internet únicamente por HTTPS (TCP 443) o a través de un proxy/Secure Web Gateway (8080), bloqueando puertos no esenciales como Telnet (23) o IRC (6667).',
      'Bloqueo Explícito de Acceso Directo WAN -> DB: En auditorías PCI-DSS se exige una regla explícita que descarte todo intento de conexión externa hacia la subred de datos de tarjetahabientes, acompañada de alertas de seguridad.'
    ],
    itemsGlossary: [
      {
        name: 'First-Match Rulebase Principle',
        badge: 'Arquitectura Firewall',
        definition:
          'Mecanismo de evaluación en firewalls con y sin estado donde el paquete se compara regla por regla de arriba abajo hasta encontrar la primera coincidencia, ignorando las reglas subsiguientes.',
        whyCorrectOrRole:
          'Es el concepto más evaluado por CompTIA: las reglas más específicas (puerto 443 a IP web) van al inicio, y las generales o denegaciones amplias van al final.',
        distractorWarning:
          'Reordenar una regla general permisiva (ej. Permit Any Any) antes de las reglas de bloqueo invalida todos los controles de seguridad.'
      },
      {
        name: 'Aislamiento DMZ (DMZ Containment)',
        badge: 'Defensa en Profundidad',
        definition:
          'Control de microsegmentación que impide el tráfico de red originado en la DMZ hacia la red LAN interna corporativa, limitando el radio de explosión de una brecha.',
        whyCorrectOrRole:
          'Si un servidor web Apache/Nginx sufre un Remote Code Execution (RCE), el atacante queda confinado en la DMZ sin poder realizar escaneos laterales a la LAN.',
        distractorWarning:
          'Permitir que la DMZ se comunique bidireccionalmente con la LAN destruye el propósito de seguridad de tener una zona desmilitarizada.'
      },
      {
        name: 'PostgreSQL (Puerto TCP 5432) & Cifrado TLS',
        badge: 'Seguridad en Bases de Datos',
        definition:
          'Puerto de red estándar para bases de datos relacionales PostgreSQL que almacena registros transaccionales confidenciales.',
        whyCorrectOrRole:
          'En el examen CompTIA se exige recordar los puertos de BD más comunes (PostgreSQL 5432, MySQL 3306, MS SQL 1433, Oracle 1521) y restringir su acceso exclusivamente al backend web.',
        distractorWarning:
          'Colocar la base de datos en la misma subred DMZ que el servidor web es un fallo grave de arquitectura en el examen.'
      },
      {
        name: 'Implicit Deny All (Denegación por Defecto)',
        badge: 'Regla Base de Oro',
        definition:
          'Directiva final implícita o explícita en listas de control de acceso que descarta y registra todo el tráfico que no haya coincidido con ninguna regla permisiva previa.',
        whyCorrectOrRole:
          'Garantiza el modelo de seguridad "Default Deny" (todo lo no explícitamente permitido está prohibido).',
        distractorWarning:
          'Dejar un firewall sin regla de denegación final o permitir Any Any por omisión permite el ingreso de vectores de ataque no previstos.'
      }
    ]
  },

  // ==========================================
  // PBQ 50: Endpoint & Network Port Hardening + Protocol Migration Audit
  // ==========================================
  'pbq-50': {
    pbqId: 'pbq-50',
    overviewRationale:
      'El conocimiento exhaustivo de los puertos y protocolos de red (Objetivo 1.2 y 3.2 de CompTIA Security+ SY0-701) es una competencia evaluada en prácticamente el 100% de los exámenes de certificación. CompTIA no solo pregunta el número de puerto, sino la razón exacta de su inseguridad (falta de cifrado en tránsito, credenciales en texto claro RFC 959, ausencia de firmas criptográficas, o community strings legibles) y exige al candidato migrar al protocolo seguro estándar de la industria (Telnet a SSHv2, HTTP a HTTPS TLS 1.3, LDAP a LDAPS con Channel Binding, FTP a SFTP, DNS a DNSSEC/DoT, SNMPv2 a SNMPv3 authPriv, y VNC a RDP con NLA). Esta PBQ simula una auditoría completa de cumplimiento normativo (SOC 2 Type II y CIS Controls).',
    keyTakeaways: [
      'Telnet (23) vs SSH (22): Telnet transmite todo en texto claro (incluyendo contraseñas de enable). SSHv2 usa cifrado simétrico (AES-GCM/ChaCha20) autenticado con pares de claves asimétricas (Ed25519/RSA-4096).',
      'LDAP (389) vs LDAPS (636): LDAP en claro expone consultas de usuarios, grupos y hashes en la red interna. LDAPS encapsula la sesión en TLS 1.3 con certificados de servidor y exige LDAP Channel Binding para mitigar ataques de retransmisión.',
      'FTP (20/21) & TFTP (69) vs SFTP (22): FTP envía usuario y clave en texto plano. TFTP no tiene autenticación ni cifrado. SFTP corre sobre el subsistema SSH en puerto 22, utilizando un único puerto para comandos y datos.',
      'DNS Tradicional (53) vs DNSSEC & DoT (853): DNS tradicional por UDP 53 no tiene integridad ni autenticidad, permitiendo envenenamiento de caché (Kaminsky Attack). DNSSEC valida firmas criptográficas (RRSIG/DNSKEY) y DoT (DNS over TLS en TCP 853) cifra las consultas para privacidad.',
      'SNMPv1/v2c (161) vs SNMPv3 (161 authPriv): SNMPv1 y v2c dependen de "community strings" (ej. "public") en claro. SNMPv3 en nivel authPriv proporciona autenticación mediante hash (SHA-256) y privacidad mediante cifrado simétrico (AES-256) bajo el modelo USM.',
      'VNC (5900) vs RDP con NLA (3389): VNC transmite pantallas y pulsaciones de teclas sin cifrado robusto. RDP debe exigir Autenticación a Nivel de Red (NLA con CredSSP) para autenticar al usuario ANTES de iniciar la sesión de escritorio remoto, bloqueando ataques MITM y mitigando DoS.'
    ],
    itemsGlossary: [
      {
        name: 'SNMPv3 Modelo USM (authPriv)',
        badge: 'Monitoreo Seguro',
        definition:
          'User-based Security Model de SNMPv3 que provee tres niveles de seguridad: noAuthNoPriv (sin auth ni cifrado), authNoPriv (con hash pero sin cifrado), y authPriv (autenticación con SHA/MD5 y cifrado de payload con AES/DES).',
        whyCorrectOrRole:
          'En el examen CompTIA, si preguntan cómo asegurar la telemetría y configuración de switches, la respuesta correcta SIEMPRE es SNMPv3 authPriv.',
        distractorWarning:
          'Cambiar la comunidad a una más larga en SNMPv2c no soluciona el problema porque sigue viajando en texto plano por el cable.'
      },
      {
        name: 'LDAP Channel Binding & LDAPS',
        badge: 'Seguridad en Identidad',
        definition:
          'Técnica que vincula criptográficamente el canal TLS externo con la autenticación Kerberos/NTLM interna, impidiendo ataques de Relay y Man-in-the-Middle.',
        whyCorrectOrRole:
          'Es el estándar corporativo obligatorio exigido por Microsoft y CIS Benchmarks para Active Directory en puerto TCP 636.',
        distractorWarning:
          'StartTLS en puerto 389 es vulnerable a ataques de degradación (downgrade attacks) si el servidor no fuerza la negociación TLS obligatoria.'
      },
      {
        name: 'DoT (DNS over TLS - Puerto TCP 853)',
        badge: 'Privacidad de Red',
        definition:
          'Estándar RFC 7858 que encapsula las consultas del protocolo DNS tradicional dentro de una sesión TLS en un puerto exclusivo y dedicado (TCP 853).',
        whyCorrectOrRole:
          'Diferencia clave con DoH (puerto 443): DoT tiene un puerto dedicado que permite a los firewalls corporativos inspeccionar y filtrar el tráfico DNS empresarial.',
        distractorWarning:
          'DNSSEC proporciona integridad y autenticidad pero NO cifra el contenido de la consulta; para privacidad se requiere DoT o DoH.'
      },
      {
        name: 'Network Level Authentication (NLA) en RDP',
        badge: 'Acceso Remoto Seguro',
        definition:
          'Mecanismo de seguridad de Microsoft RDP que autentica las credenciales del usuario con el controlador de dominio (vía CredSSP) antes de instanciar el proceso de interfaz gráfica en el servidor.',
        whyCorrectOrRole:
          'Previene vulnerabilidades de ejecución remota de código en RDP (como BlueKeep CVE-2019-0708) y protege al servidor contra denegación de servicio por sesiones colgadas.',
        distractorWarning:
          'Usar RDP con contraseñas complejas pero sin NLA sigue siendo vulnerable a exploits a nivel del kernel antes de la pantalla de login.'
      }
    ]
  }
};
