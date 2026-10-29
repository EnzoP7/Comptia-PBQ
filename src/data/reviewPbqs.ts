/**
 * Review PBQs 78-91, built from the questions missed in twelve Dion Training practice exams.
 * Almost every miss was a choice between two close concepts (PEP vs policy engine, reflected
 * vs amplified DDoS, journaling vs replication, risk tolerance vs threshold…). Each row puts the
 * right answer next to the option that was chosen by mistake, and the explanation names the trap.
 */
import { MatrixOption, PBQItem } from '../types/pbq';
import type { MatrixPbqDefinition } from './matrixPbqs';
import { domainNameFor, formatObjective } from './sy0701Objectives';

const o = (value: string, label: string): MatrixOption => ({ value, label });

const review = (
  n: number,
  category: PBQItem['category'],
  topic: string,
  title: string,
  objective: [string, string[]],
  scenario: string,
  requirements: string[],
  tacticalTip: string
): PBQItem => ({
  id: `pbq-${n}`,
  number: n,
  category,
  categoryTitle: `Repaso de errores: ${topic}`,
  title,
  estimatedMinutes: 4,
  domain: domainNameFor(objective[0]),
  sy0701Objective: formatObjective(objective[0], objective[1]),
  scenario,
  requirements,
  tacticalTip,
});

// ---------------------------------------------------------------------------
// 78 — Zero Trust planes and deception (1.2)
// ---------------------------------------------------------------------------
const ZT = [
  o('pe', 'Motor de políticas (Policy Engine)'),
  o('pa', 'Administrador de políticas (Policy Administrator)'),
  o('pep', 'Punto de aplicación de políticas (PEP)'),
  o('control', 'Plano de control'),
  o('data', 'Plano de datos'),
  o('policy_ac', 'Control de acceso basado en políticas'),
  o('threat_scope', 'Reducción del alcance de amenazas'),
  o('adaptive', 'Identidad adaptativa'),
];
const DECEPTION = [o('honeypot', 'Honeypot'), o('honeynet', 'Honeynet'), o('honeyfile', 'Honeyfile'), o('honeytoken', 'Honeytoken')];

const PBQ78: MatrixPbqDefinition = {
  item: review(78, 'zero-trust', 'Zero Trust y engaño', 'Zero Trust: Plano de Control, Plano de Datos, PEP y Tecnologías de Engaño', ['1.2', []],
    'El equipo de arquitectura documenta su modelo Zero Trust y las trampas que desplegó para detectar intrusos. Identifica el componente o concepto que describe cada frase.',
    ['Sección 1: componentes y conceptos de Zero Trust.', 'Sección 2: tecnologías de engaño.'],
    'Plano de CONTROL = decide (motor y administrador de políticas). Plano de DATOS = transporta el tráfico ya autorizado; el PEP vive allí y hace cumplir la decisión. El motor DECIDE; el PEP APLICA. "Basado en políticas" evalúa muchas señales; "basado en roles" solo el puesto.'),
  config: {
    pbqId: 'pbq-78',
    consoleTitle: 'Zero Trust y Engaño (Objetivo 1.2)',
    instructions: 'Elige la opción que corresponde a cada frase. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1', title: 'Zero Trust', columns: [{ id: 'zt', label: 'Componente o concepto', options: ZT }],
        rows: [
          { id: 'z1', prompt: 'Evalúa la identidad, el dispositivo y las amenazas conocidas y decide si se concede el acceso.', answers: { zt: 'pe' }, explanation: 'Decidir es la función del motor de políticas. Trampa: el PEP no decide, solo aplica la decisión.' },
          { id: 'z2', prompt: 'Está en el camino del tráfico y es el MÁS responsable de que el flujo de datos cumpla la política: abre o corta la sesión.', answers: { zt: 'pep' }, explanation: 'Hacer cumplir la decisión sobre el tráfico es el Policy Enforcement Point. Trampa frecuente: elegir el motor de políticas.' },
          { id: 'z3', prompt: 'Recibe la decisión y genera las credenciales o tokens de la sesión para que el PEP la habilite.', answers: { zt: 'pa' }, explanation: 'El Policy Administrator ejecuta la decisión del motor: crea o cierra la ruta de comunicación.' },
          { id: 'z4', prompt: 'Capa que decide sobre el acceso en función de las políticas y las amenazas.', answers: { zt: 'control' }, explanation: 'Plano de control = motor + administrador de políticas. Trampa: "limitar las zonas de daño" es reducción del alcance de amenazas.' },
          { id: 'z5', prompt: 'Capa que procesa y transmite los datos entre sistemas una vez aprobado el acceso.', answers: { zt: 'data' }, explanation: 'El plano de datos transporta el tráfico autorizado. Trampa: gestionar la autenticación es del plano de control.' },
          { id: 'z6', prompt: 'En el plano de control, el acceso se concede según roles, responsabilidades y otras condiciones definidas en reglas.', answers: { zt: 'policy_ac' }, explanation: 'CompTIA lo llama control de acceso basado en políticas (policy-driven). Trampa: elegir RBAC, que no es un componente de Zero Trust.' },
          { id: 'z7', prompt: 'Microsegmentar para que, si un equipo cae, el atacante llegue a la menor cantidad de recursos posible.', answers: { zt: 'threat_scope' }, explanation: 'Limitar el radio de daño es reducción del alcance de amenazas.' },
          { id: 'z8', prompt: 'El nivel de verificación cambia según el riesgo: un acceso desde un país nuevo pide MFA adicional.', answers: { zt: 'adaptive' }, explanation: 'Ajustar la autenticación al contexto es identidad adaptativa.' },
        ],
      },
      {
        id: 's2', title: 'Engaño', columns: [{ id: 'dec', label: 'Tecnología', options: DECEPTION }],
        rows: [
          { id: 'd1', prompt: 'Un documento falso llamado "salarios_2026.xlsx" que alerta cuando alguien lo abre.', answers: { dec: 'honeyfile' }, explanation: 'Un ARCHIVO señuelo es un honeyfile. Trampa: honeytoken es un DATO o credencial falsa, no un documento.' },
          { id: 'd2', prompt: 'Una clave de API falsa dentro del código; si alguien la usa, el SOC recibe una alerta.', answers: { dec: 'honeytoken' }, explanation: 'Un dato o credencial falsa cuyo uso delata al atacante es un honeytoken.' },
          { id: 'd3', prompt: 'Un servidor vulnerable aislado para atraer y estudiar atacantes.', answers: { dec: 'honeypot' }, explanation: 'Un sistema señuelo individual es un honeypot.' },
          { id: 'd4', prompt: 'Una red completa de sistemas señuelo que simula la empresa.', answers: { dec: 'honeynet' }, explanation: 'Varios honeypots en red forman una honeynet.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 79 — Encryption levels, algorithms and key tools (1.4)
// ---------------------------------------------------------------------------
const ENC_LEVEL = [
  o('fde', 'Cifrado de disco completo'),
  o('partition', 'Cifrado de partición'),
  o('volume', 'Cifrado de volumen'),
  o('file', 'Cifrado a nivel de archivo'),
  o('database', 'Cifrado de base de datos'),
  o('record', 'Cifrado a nivel de registro'),
  o('transport', 'Cifrado de transporte'),
];
const CRYPTO_PICK = [
  o('stream', 'Cifrado de flujo'),
  o('block', 'Cifrado por bloques'),
  o('ecc', 'ECC'),
  o('dh', 'Diffie-Hellman'),
  o('recipient_pub', 'Clave pública del destinatario'),
  o('srtp', 'SRTP'),
  o('kms', 'Sistema de gestión de claves (KMS)'),
  o('hsm', 'HSM'),
  o('tpm', 'TPM'),
  o('third_party', 'Certificado de una CA de terceros'),
  o('self_signed', 'Certificado autofirmado'),
  o('blockchain', 'Descentralización (blockchain)'),
];

const PBQ79: MatrixPbqDefinition = {
  item: review(79, 'crypto-concepts', 'Criptografía', 'Niveles de Cifrado, Algoritmos y Herramientas de Claves', ['1.4', []],
    'Cada equipo de la empresa pidió una solución criptográfica distinta. Elige el nivel de cifrado o la herramienta que corresponde a cada pedido.',
    ['Sección 1: el nivel de cifrado que pide cada caso.', 'Sección 2: el algoritmo, protocolo o herramienta adecuada.'],
    'Lee el alcance: TODO el disco → disco completo; una porción → partición/volumen; algunos documentos → archivo; toda la base → base de datos; cada fila o campo → registro. KMS gestiona el CICLO DE VIDA de las claves; HSM es el HARDWARE dedicado y externo; TPM es el chip del propio equipo.'),
  config: {
    pbqId: 'pbq-79',
    consoleTitle: 'Pedidos Criptográficos (Objetivo 1.4)',
    instructions: 'Elige la opción que corresponde a cada caso. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1', title: 'Nivel de cifrado', columns: [{ id: 'level', label: 'Nivel', options: ENC_LEVEL }],
        rows: [
          { id: 'l1', prompt: 'Algunos documentos confidenciales deben quedar cifrados y los demás en texto plano, en la misma unidad.', answers: { level: 'file' }, explanation: 'Cifrar documentos concretos es cifrado a nivel de archivo. Trampa: partición cifraría todo lo que hay en ella.' },
          { id: 'l2', prompt: 'Cada número de tarjeta de la tabla de clientes se cifra de forma individual con su propia clave.', answers: { level: 'record' }, explanation: 'Cifrar cada fila/entrada por separado es cifrado a nivel de registro. Trampa: base de datos cifra el conjunto completo.' },
          { id: 'l3', prompt: 'Toda la colección de registros de estudiantes se cifra y descifra a la vez, como una unidad.', answers: { level: 'database' }, explanation: 'Proteger la base completa como unidad es cifrado de base de datos. Trampa: volumen cifra el almacenamiento, no la base.' },
          { id: 'l4', prompt: 'Aunque roben la base de datos de clientes copiando sus archivos, los datos deben seguir ilegibles.', answers: { level: 'database' }, explanation: 'El cifrado de la base protege sus archivos aunque se copien desde un servidor encendido. Trampa: el disco completo solo protege el equipo apagado o el disco robado.' },
          { id: 'l5', prompt: 'Un portátil perdido no debe permitir leer nada de su almacenamiento, ni siquiera el sistema operativo.', answers: { level: 'fde' }, explanation: 'Todo el dispositivo, incluido el SO: cifrado de disco completo (BitLocker, FileVault).' },
          { id: 'l6', prompt: 'Los datos deben ir cifrados mientras viajan entre la aplicación y la API.', answers: { level: 'transport' }, explanation: 'Proteger los datos en tránsito es cifrado de transporte (TLS).' },
        ],
      },
      {
        id: 's2', title: 'Algoritmo, protocolo o herramienta', columns: [{ id: 'pick', label: 'Elección', options: CRYPTO_PICK }],
        rows: [
          { id: 'c1', prompt: 'Cifrado simétrico para un flujo de longitud desconocida que se cifra byte a byte.', answers: { pick: 'stream' }, explanation: 'Byte a byte y longitud indefinida: cifrado de flujo. Trampa: el de bloques trabaja en bloques de tamaño fijo.' },
          { id: 'c2', prompt: 'Algoritmo asimétrico con seguridad equivalente usando claves mucho más cortas.', answers: { pick: 'ecc' }, explanation: 'ECC (curva elíptica) logra la misma seguridad que RSA con claves más pequeñas. Trampa: Diffie-Hellman es un método de intercambio de claves.' },
          { id: 'c3', prompt: 'Un cliente quiere que solo Dion Training pueda descifrar el mensaje que le envía. ¿Con qué cifra?', answers: { pick: 'recipient_pub' }, explanation: 'Se cifra con la clave PÚBLICA del destinatario; solo su clave privada lo descifra.' },
          { id: 'c4', prompt: 'Cifrar específicamente las llamadas de voz sobre IP entre sucursales.', answers: { pick: 'srtp' }, explanation: 'SRTP (Secure Real-time Transport Protocol) cifra el audio y video VoIP.' },
          { id: 'c5', prompt: 'Definir y automatizar el ciclo de vida de las claves: generación, rotación, revocación y destrucción.', answers: { pick: 'kms' }, explanation: 'Gestionar el ciclo de vida es tarea del KMS. Trampa: el TPM solo guarda claves dentro de un equipo.' },
          { id: 'c6', prompt: 'No confiar solo en el chip integrado de cada equipo: usar un dispositivo externo dedicado y resistente a manipulaciones para las claves.', answers: { pick: 'hsm' }, explanation: 'Hardware externo y dedicado para claves: HSM. Trampa: KMS es el servicio de gestión, no el dispositivo físico.' },
          { id: 'c7', prompt: 'El sitio público necesita un certificado firmado y verificado por una autoridad reconocida.', answers: { pick: 'third_party' }, explanation: 'Firmado por una CA externa de confianza: certificado de terceros. Trampa: wildcard indica cuántos nombres cubre, no quién lo firma.' },
          { id: 'c8', prompt: 'Certificado firmado con la propia clave privada de quien lo emite, para pruebas internas.', answers: { pick: 'self_signed' }, explanation: 'Autofirmado. Trampa: un certificado raíz también se firma a sí mismo, pero pertenece a una CA y sí es de confianza.' },
          { id: 'c9', prompt: 'Característica de blockchain que elimina el punto único de fallo o de vulneración.', answers: { pick: 'blockchain' }, explanation: 'Un libro distribuido sin autoridad central: descentralización.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 80 — Threat vectors and vulnerability types (2.2, 2.3)
// ---------------------------------------------------------------------------
const VECTORS = [
  o('file', 'Basado en archivos'),
  o('removable', 'Dispositivo extraíble'),
  o('im', 'Mensajería instantánea'),
  o('smishing', 'Smishing'),
  o('bec', 'Compromiso de correo empresarial (BEC)'),
  o('impersonation', 'Suplantación de identidad (impersonation)'),
  o('msp', 'Proveedor de servicios gestionados (MSP)'),
  o('wiretap', 'Intervención de la línea (wiretapping)'),
  o('peripheral', 'Periférico malicioso'),
  o('unsupported', 'Sistema sin soporte'),
];
const VULNS = [
  o('firmware', 'Vulnerabilidad de firmware'),
  o('eol', 'Fin de vida (end-of-life)'),
  o('misconfig', 'Configuración incorrecta'),
  o('resource_reuse', 'Reutilización de recursos'),
  o('vm_escape', 'Escape de máquina virtual'),
  o('toctou', 'Time-of-check (TOCTOU)'),
  o('sideload', 'Carga lateral (sideloading)'),
];

const PBQ80: MatrixPbqDefinition = {
  item: review(80, 'social-engineering', 'Vectores y vulnerabilidades', 'Vectores de Amenaza y Tipos de Vulnerabilidad', ['2.2', ['2.3']],
    'El equipo de concienciación reúne casos reales para el próximo taller. Clasifica el vector de amenaza y el tipo de vulnerabilidad de cada caso.',
    ['Sección 1: el vector de amenaza.', 'Sección 2: el tipo de vulnerabilidad.'],
    'Fíjate en el CANAL y en el OBJETO: un USB es "dispositivo extraíble" (aunque traiga archivos); un adjunto o un ejecutable es "basado en archivos". Windows XP sin parches = sistema sin soporte. "Suplantación de identidad" (impersonation) es hacerse pasar por alguien; vishing es solo el canal de voz.'),
  config: {
    pbqId: 'pbq-80',
    consoleTitle: 'Taller de Vectores y Vulnerabilidades (Objetivos 2.2 y 2.3)',
    instructions: 'Elige la opción que corresponde a cada caso.',
    sections: [
      {
        id: 's1', title: 'Vectores', columns: [{ id: 'vector', label: 'Vector', options: VECTORS }],
        rows: [
          { id: 'v1', prompt: 'Malware que llega dentro de un documento de Office o un ejecutable descargado.', answers: { vector: 'file' }, explanation: 'Documentos y ejecutables: vector basado en archivos. Trampa: correo es el canal; el vector que se pregunta es el archivo.' },
          { id: 'v2', prompt: 'Un empleado conecta una memoria USB encontrada en el estacionamiento.', answers: { vector: 'removable' }, explanation: 'El medio es el dispositivo extraíble, aunque contenga archivos.' },
          { id: 'v3', prompt: 'Un amigo te manda por Messenger un enlace a un "video" que imita a YouTube y pide tu contraseña.', answers: { vector: 'im' }, explanation: 'Messenger, WhatsApp o Teams son mensajería instantánea. Trampa: SMS es el mensaje de texto del operador.' },
          { id: 'v4', prompt: 'Un mensaje de texto del "banco" pide confirmar tu PIN en un enlace.', answers: { vector: 'smishing' }, explanation: 'Phishing por SMS: smishing.' },
          { id: 'v5', prompt: 'Un viernes, el "CEO" pide por correo a finanzas transferir con urgencia el pago de una factura adjunta.', answers: { vector: 'bec' }, explanation: 'Fraude de pagos haciéndose pasar por un ejecutivo por correo: BEC. Trampa: pretexting es la historia inventada, BEC es el ataque completo.' },
          { id: 'v6', prompt: 'Alguien llama diciendo ser "Enrique de soporte técnico" para que le des acceso a tu equipo.', answers: { vector: 'impersonation' }, explanation: 'Hacerse pasar por otra persona es suplantación (impersonation); el canal telefónico no cambia la técnica principal.' },
          { id: 'v7', prompt: 'El software de un tercero que administra el mantenimiento rutinario de los equipos se usa para entrar en la red.', answers: { vector: 'msp' }, explanation: 'El acceso de un proveedor de servicios gestionados es un vector de cadena de suministro.' },
          { id: 'v8', prompt: 'El atacante conecta su dispositivo directamente al cableado de la red para interceptar el tráfico.', answers: { vector: 'wiretap' }, explanation: 'Engancharse físicamente al cable es wiretapping. Trampa: on-path es la posición lógica, no la conexión física.' },
          { id: 'v9', prompt: 'Unos auriculares Bluetooth con firmware modificado ejecutan ataques contra el teléfono.', answers: { vector: 'peripheral' }, explanation: 'Un periférico manipulado es un periférico malicioso. Trampa: bluejacking solo envía mensajes no solicitados.' },
          { id: 'v10', prompt: 'Un portátil con Windows XP que no recibe actualizaciones desde hace años.', answers: { vector: 'unsupported' }, explanation: 'Un SO que el fabricante ya no actualiza es un sistema sin soporte. Trampa: "software vulnerable" es más genérico.' },
        ],
      },
      {
        id: 's2', title: 'Vulnerabilidades', columns: [{ id: 'vuln', label: 'Vulnerabilidad', options: VULNS }],
        rows: [
          { id: 'u1', prompt: 'Se puede modificar el software que controla el funcionamiento del hardware del dispositivo.', answers: { vuln: 'firmware' }, explanation: 'El software embebido que controla el hardware es el firmware. Trampa: sideloading es instalar apps fuera de la tienda.' },
          { id: 'u2', prompt: 'Switches que el fabricante ya no soporta ni actualiza.', answers: { vuln: 'eol' }, explanation: 'Sin soporte del fabricante: fin de vida (EOL).' },
          { id: 'u3', prompt: 'Un bucket público por error expone datos confidenciales.', answers: { vuln: 'misconfig' }, explanation: 'La CAUSA es la configuración incorrecta; la filtración es la CONSECUENCIA.' },
          { id: 'u4', prompt: 'Una VM lee datos de otra VM porque comparten la misma CPU y memoria.', answers: { vuln: 'resource_reuse' }, explanation: 'Datos residuales en recursos compartidos: reutilización de recursos.' },
          { id: 'u5', prompt: 'Un atacante sale de su VM y accede a la memoria del servidor físico. La mejor defensa es parchear rápido el hipervisor.', answers: { vuln: 'vm_escape' }, explanation: 'Romper el aislamiento de la VM es escape de máquina virtual; se mitiga manteniendo el hipervisor actualizado.' },
          { id: 'u6', prompt: 'El atacante modifica los datos después de que la aplicación los verificó y antes de que los use.', answers: { vuln: 'toctou' }, explanation: 'La ventana entre la comprobación y el uso es TOCTOU. Trampa: "condición de carrera" es la familia general; la descripción exacta es time-of-check/time-of-use.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 81 — Indicators of malicious activity (2.4)
// ---------------------------------------------------------------------------
const INDICATORS = [
  o('reflected', 'DDoS reflejado'),
  o('amplified', 'DDoS amplificado'),
  o('brute', 'Fuerza bruta'),
  o('spraying', 'Password spraying (ataque horizontal)'),
  o('csrf', 'CSRF'),
  o('hijack', 'Secuestro de sesión'),
  o('code_inj', 'Inyección de código'),
  o('cmd_inj', 'Inyección de comandos'),
  o('onpath', 'Ataque en ruta (on-path)'),
  o('mac_spoof', 'Suplantación de MAC'),
  o('fileless', 'Malware sin archivos'),
  o('rootkit', 'Rootkit'),
  o('concurrent', 'Sesiones concurrentes'),
  o('impossible', 'Viaje imposible'),
  o('blocked', 'Acceso a contenido bloqueado'),
  o('environmental', 'Ataque ambiental'),
];

const PBQ81: MatrixPbqDefinition = {
  item: review(81, 'log-siem', 'Indicadores de ataque', 'Indicadores de Actividad Maliciosa: Distinguir Ataques Parecidos', ['2.4', ['4.9']],
    'El SOC revisa las alertas de la semana. Cada caso tiene un detalle que lo diferencia de un ataque parecido: identifícalo.',
    ['Identifica el ataque o indicador de cada caso.'],
    'Reflejado = la víctima recibe respuestas a peticiones que nunca hizo (IP falsificada). Amplificado = respuestas MUCHO más grandes que la petición. Fuerza bruta = muchas contraseñas contra UNA cuenta; spraying = UNA contraseña contra muchas cuentas. CSRF = acciones que el usuario no pidió usando SU sesión; secuestro = el atacante roba la sesión.'),
  config: {
    pbqId: 'pbq-81',
    consoleTitle: 'Alertas de la Semana (Objetivo 2.4)',
    instructions: 'Elige el ataque o indicador de cada caso. Hay distractores parecidos.',
    sections: [
      {
        id: 's1', title: 'Alertas', columns: [{ id: 'ind', label: 'Ataque o indicador', options: INDICATORS }],
        rows: [
          { id: 'a1', prompt: 'El servicio recibe miles de respuestas DNS a consultas que nunca hizo: alguien envió las consultas falsificando su IP.', evidence: 'src=resolvers públicos → dst=nuestra IP · respuestas sin consulta previa', answers: { ind: 'reflected' }, explanation: 'Las respuestas rebotan en terceros hacia la IP falsificada: DDoS reflejado. Sería amplificado si se destacara que la respuesta es mucho mayor que la petición.' },
          { id: 'a2', prompt: 'Consultas de 60 bytes a servidores NTP generan respuestas de 4.000 bytes dirigidas a la víctima.', evidence: 'monlist request 60 B → response 4.000 B (×66)', answers: { ind: 'amplified' }, explanation: 'La clave es el factor de multiplicación del tamaño: DDoS amplificado.' },
          { id: 'a3', prompt: 'Muchas contraseñas distintas desde una sola IP contra la cuenta "admin".', evidence: 'user=admin · 900 intentos · 900 contraseñas distintas', answers: { ind: 'brute' }, explanation: 'Muchas contraseñas contra una cuenta: fuerza bruta. Trampa: spraying es al revés.' },
          { id: 'a4', prompt: 'Cientos de cuentas tienen un único intento fallido cada una con la misma contraseña común.', evidence: '412 usuarios · 1 intento c/u · password=Verano2026!', answers: { ind: 'spraying' }, explanation: 'Una contraseña contra muchas cuentas (ataque horizontal): password spraying. Trampa: no es un ataque de diccionario.' },
          { id: 'a5', prompt: 'Usuarios reportan cambios en la configuración de su cuenta que no hicieron, tras visitar un foro externo.', answers: { ind: 'csrf' }, explanation: 'El navegador del usuario envió peticiones forjadas con su sesión válida: CSRF. Trampa: en el secuestro el atacante usa la sesión desde su equipo.' },
          { id: 'a6', prompt: 'Los intentos de inicio de sesión contienen fragmentos de JavaScript que el servidor interpreta.', evidence: 'username=<script>…</script> · password=eval(…)', answers: { ind: 'code_inj' }, explanation: 'Inyectar código del lenguaje de la aplicación es inyección de código. Trampa: inyección de comandos usa comandos del SO (; | &&).' },
          { id: 'a7', prompt: 'Un parámetro contiene "; cat /etc/passwd" y el servidor lo ejecuta en la shell.', answers: { ind: 'cmd_inj' }, explanation: 'Comandos del sistema operativo encadenados: inyección de comandos.' },
          { id: 'a8', prompt: 'Gran cantidad de respuestas ARP no solicitadas entre una estación y el gateway.', evidence: 'ARP reply 10.0.0.1 is-at aa:bb:cc… (×300)', answers: { ind: 'onpath' }, explanation: 'El envenenamiento ARP coloca al atacante en medio: ataque on-path. Trampa: la suplantación de MAC solo cambia su propia MAC.' },
          { id: 'a9', prompt: 'El equipo se pone lento y aparecen ventanas de PowerShell que se cierran solas; el antivirus no encuentra archivos.', answers: { ind: 'fileless' }, explanation: 'Ejecución en memoria con herramientas legítimas: malware sin archivos.' },
          { id: 'a10', prompt: 'El servidor parece normal y las herramientas del sistema no muestran nada, pero hay accesos no autorizados a datos.', answers: { ind: 'rootkit' }, explanation: 'Ocultarse de las herramientas del propio SO es la marca del rootkit. Trampa: un virus no se oculta del sistema.' },
          { id: 'a11', prompt: 'La misma cuenta tiene sesiones activas al mismo tiempo desde dos ubicaciones, mientras el usuario legítimo trabaja.', answers: { ind: 'concurrent' }, explanation: 'Uso simultáneo de la cuenta: sesiones concurrentes. Trampa: viaje imposible compara dos inicios SUCESIVOS y su distancia.' },
          { id: 'a12', prompt: 'Múltiples intentos de conectarse a servicios que el firewall bloquea por política.', answers: { ind: 'blocked' }, explanation: 'Intentos repetidos contra puertos o sitios bloqueados son el indicador "contenido bloqueado". Trampa: no hay volumen para ser DDoS.' },
          { id: 'a13', prompt: 'Alguien manipula los sistemas de refrigeración del centro de datos y los servidores se sobrecalientan.', answers: { ind: 'environmental' }, explanation: 'Atacar los controles del entorno (HVAC, energía) es un ataque ambiental.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 82 — Mitigations and enterprise capabilities (2.5, 4.5)
// ---------------------------------------------------------------------------
const MITIGATIONS = [
  o('config_enf', 'Aplicación de la configuración'),
  o('least_priv', 'Mínimo privilegio'),
  o('isolation', 'Aislamiento'),
  o('segmentation', 'Segmentación'),
  o('nac', 'Control de acceso a la red (NAC)'),
  o('patching', 'Parcheo'),
  o('port_5060', 'Supervisar o cerrar el puerto 5060 (SIP)'),
];
const CAPABILITIES = [
  o('agent_filter', 'Filtrado web basado en agente'),
  o('gpo_ou', 'GPO vinculada a la unidad organizativa'),
  o('reputation', 'Puntuación de reputación'),
  o('swg', 'Secure Web Gateway (SWG)'),
  o('url_scan', 'Escaneo de URL'),
  o('ips_behavior', 'IPS basado en comportamiento'),
  o('sig_tuning', 'Ajuste de firmas'),
  o('siem', 'SIEM para correlacionar'),
  o('email_gw', 'Pasarela de correo'),
  o('dkim', 'DKIM'),
  o('spf', 'SPF'),
];

const PBQ82: MatrixPbqDefinition = {
  item: review(82, 'endpoint-hardening', 'Mitigaciones y capacidades', 'Técnicas de Mitigación y Capacidades de Seguridad Empresarial', ['4.5', ['2.5']],
    'El CISO prioriza las mejoras del año. Elige la técnica de mitigación o la capacidad que resuelve cada problema.',
    ['Sección 1: técnica de mitigación (2.5).', 'Sección 2: capacidad empresarial (4.5).'],
    'Aislamiento = el sistema NO se comunica con los demás; segmentación = se divide la red en zonas que sí se comunican con reglas. Aplicación de la configuración = impedir que los usuarios cambien lo definido. DKIM firma el contenido; SPF lista los servidores autorizados.'),
  config: {
    pbqId: 'pbq-82',
    consoleTitle: 'Plan de Mejoras (Objetivos 2.5 y 4.5)',
    instructions: 'Elige la opción que corresponde a cada problema. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1', title: 'Mitigaciones', columns: [{ id: 'mit', label: 'Mitigación', options: MITIGATIONS }],
        rows: [
          { id: 'm1', prompt: 'Los usuarios desactivan funciones de seguridad del equipo; hay que forzar y mantener una configuración estándar.', answers: { mit: 'config_enf' }, explanation: 'Imponer y mantener la configuración definida es aplicación de la configuración. Trampa: mínimo privilegio limita permisos, no fija la configuración.' },
          { id: 'm2', prompt: 'Impedir que el malware se propague de un proceso o sistema a otro limitando por completo su interacción.', answers: { mit: 'isolation' }, explanation: 'Cortar la comunicación es aislamiento. Trampa: la segmentación divide en zonas que siguen comunicándose bajo reglas.' },
          { id: 'm3', prompt: 'Reducir el riesgo de los dispositivos personales (BYOD) verificando su estado antes de dejarlos entrar a la red.', answers: { mit: 'nac' }, explanation: 'NAC evalúa el dispositivo antes de admitirlo. Trampa: EDR protege equipos gestionados, no controla la entrada de los ajenos.' },
          { id: 'm4', prompt: 'Evitar la señalización VoIP no autorizada usada para fraude telefónico.', answers: { mit: 'port_5060' }, explanation: 'SIP usa el puerto 5060. Trampa: 139 es NetBIOS.' },
          { id: 'm5', prompt: 'La base de datos ya tiene cifrado fuerte y TLS; falta corregir las fallas conocidas del software de terceros.', answers: { mit: 'patching' }, explanation: 'Las vulnerabilidades conocidas se cierran con parches y actualizaciones periódicas.' },
        ],
      },
      {
        id: 's2', title: 'Capacidades', columns: [{ id: 'cap', label: 'Capacidad', options: CAPABILITIES }],
        rows: [
          { id: 'c1', prompt: 'Aplicar la misma política de navegación a los empleados remotos sin importar desde dónde se conectan.', answers: { cap: 'agent_filter' }, explanation: 'El agente viaja con el equipo: política coherente en cualquier ubicación.' },
          { id: 'c2', prompt: 'Aplicar permisos solo al departamento de marketing en un dominio de Windows.', answers: { cap: 'gpo_ou' }, explanation: 'Se vincula una GPO a la OU de marketing. Trampa: una política local por equipo no escala ni se administra centralmente.' },
          { id: 'c3', prompt: 'Calificar qué tan confiable es un sitio web según su historial.', answers: { cap: 'reputation' }, explanation: 'La puntuación de reputación mide la confiabilidad, no la popularidad.' },
          { id: 'c4', prompt: 'Inspeccionar el tráfico web de los usuarios contra malware y fuga de datos, incluso cifrado.', answers: { cap: 'swg' }, explanation: 'El SWG es el proxy de seguridad web. Trampa: un NGFW solo no inspecciona el uso web con ese detalle.' },
          { id: 'c5', prompt: 'Revisar en tiempo real cada dirección web antes de permitir el acceso.', answers: { cap: 'url_scan' }, explanation: 'Analizar la URL al momento es escaneo de URL.' },
          { id: 'c6', prompt: 'Aumentan los ataques nuevos que las firmas no conocen.', answers: { cap: 'ips_behavior' }, explanation: 'Detectar lo desconocido requiere análisis de comportamiento en el IPS.' },
          { id: 'c7', prompt: 'El IPS genera muchos falsos positivos con sus firmas.', answers: { cap: 'sig_tuning' }, explanation: 'La causa más probable es que las firmas necesitan ajuste.' },
          { id: 'c8', prompt: 'Tras un ataque multivector, el equipo descubre que los datos de seguridad estaban dispersos en varias herramientas.', answers: { cap: 'siem' }, explanation: 'Centralizar y correlacionar datos dispersos es la función del SIEM.' },
          { id: 'c9', prompt: 'Filtrar y bloquear correos con phishing y adjuntos maliciosos antes de que lleguen al usuario.', answers: { cap: 'email_gw' }, explanation: 'La pasarela de correo filtra. Trampa: no ofrece cifrado de extremo a extremo.' },
          { id: 'c10', prompt: 'Los receptores deben poder comprobar con una firma criptográfica que el correo salió del dominio y no fue alterado.', answers: { cap: 'dkim' }, explanation: 'Firma del contenido y cabeceras: DKIM. SPF solo lista qué servidores pueden enviar.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 83 — Network appliances and attributes (3.2)
// ---------------------------------------------------------------------------
const NET_DEVICES = [
  o('proxy', 'Servidor proxy'),
  o('lb', 'Balanceador de carga'),
  o('ngfw', 'NGFW'),
  o('sdwan', 'SD-WAN'),
  o('waf', 'WAF'),
  o('ips', 'IPS'),
  o('ids', 'IDS'),
  o('inline', 'Dispositivo en línea (inline)'),
  o('tap', 'Modo tap / monitor'),
  o('sensor', 'Sensor de red'),
  o('vpn', 'VPN'),
  o('l7', 'Firewall de capa 7'),
  o('l4', 'Firewall de capa 4'),
  o('eap', 'EAP'),
  o('radius', 'RADIUS'),
  o('fail_closed', 'Falla cerrada (fail-closed)'),
  o('fail_open', 'Falla abierta (fail-open)'),
];

const PBQ83: MatrixPbqDefinition = {
  item: review(83, 'network-diagram', 'Dispositivos de red', 'Dispositivos y Atributos de Red: Proxy, NGFW, WAF, IDS, Inline y Fail-Open', ['3.2', []],
    'El arquitecto de red elige el dispositivo o el atributo adecuado para cada necesidad de la empresa.',
    ['Elige el dispositivo o atributo de cada caso.'],
    'Inline = el tráfico pasa por el dispositivo y puede bloquear; tap/monitor = recibe una copia y solo observa. IDS detecta, IPS bloquea. WAF protege una aplicación web vulnerable mientras no hay parche (virtual patching). Fail-closed bloquea todo si el equipo falla; fail-open deja pasar.'),
  config: {
    pbqId: 'pbq-83',
    consoleTitle: 'Selección de Dispositivos de Red (Objetivo 3.2)',
    instructions: 'Elige la opción que corresponde a cada caso. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1', title: 'Necesidades', columns: [{ id: 'dev', label: 'Dispositivo o atributo', options: NET_DEVICES }],
        rows: [
          { id: 'n1', prompt: 'Reducir la superficie de ataque pública con un equipo que recibe las solicitudes y las reenvía a los servidores en su nombre.', answers: { dev: 'proxy' }, explanation: 'Intermediar y reenviar ocultando los servidores es un proxy (inverso). Trampa: el balanceador reparte carga.' },
          { id: 'n2', prompt: 'Un solo producto con filtrado por aplicación, prevención de intrusiones y antivirus.', answers: { dev: 'ngfw' }, explanation: 'Firewall con conocimiento de aplicaciones e IPS integrado: NGFW. Trampa: SD-WAN gestiona enlaces WAN.' },
          { id: 'n3', prompt: 'Una aplicación web es explotada por una vulnerabilidad que no se puede parchear todavía.', answers: { dev: 'waf' }, explanation: 'El WAF filtra las peticiones HTTP que explotan la falla (virtual patching). Trampa: el IPS de red no entiende la lógica web con ese detalle.' },
          { id: 'n4', prompt: 'Demasiado malware atravesaba la red: el dispositivo debe estar en el camino del tráfico para bloquearlo.', answers: { dev: 'inline' }, explanation: 'Para bloquear hay que estar en línea. Trampa: fail-closed describe qué pasa si el equipo FALLA.' },
          { id: 'n5', prompt: 'El sistema no interactúa con el tráfico; su función principal es detectar y alertar.', answers: { dev: 'ids' }, explanation: 'Detección pasiva: IDS.' },
          { id: 'n6', prompt: 'Capturar una copia del tráfico para analizarlo sin alterar el flujo.', answers: { dev: 'tap' }, explanation: 'Un TAP o puerto en modo monitor (SPAN) entrega una copia.' },
          { id: 'n7', prompt: 'Analizar el tráfico en tiempo real en distintos puntos de la red y enviar la información a la plataforma de monitoreo.', answers: { dev: 'sensor' }, explanation: 'Los sensores recolectan y analizan en cada segmento.' },
          { id: 'n8', prompt: 'Comunicar de forma cifrada las redes de varios bancos recién adquiridos a través de Internet.', answers: { dev: 'vpn' }, explanation: 'Un túnel cifrado entre sitios es una VPN. Trampa: SD-WAN optimiza enlaces, el requisito era la comunicación segura.' },
          { id: 'n9', prompt: 'Permitir o bloquear según la naturaleza de la comunicación (la aplicación), no solo el puerto.', answers: { dev: 'l7' }, explanation: 'Entender la aplicación es capa 7. Trampa: capa 4 solo ve IP y puertos.' },
          { id: 'n10', prompt: 'Marco de autenticación flexible que admite varios métodos para usuarios cableados e inalámbricos.', answers: { dev: 'eap' }, explanation: 'EAP es el marco con múltiples métodos (TLS, PEAP…). Trampa: RADIUS es el servidor AAA que lo usa.' },
          { id: 'n11', prompt: 'Si el firewall de la sala de servidores falla, ningún tráfico debe pasar.', answers: { dev: 'fail_closed' }, explanation: 'Priorizar la seguridad ante la falla es fail-closed.' },
          { id: 'n12', prompt: 'Si el filtro de contenido falla, la navegación de la tienda online debe seguir funcionando.', answers: { dev: 'fail_open' }, explanation: 'Priorizar la disponibilidad ante la falla es fail-open.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 84 — Architecture models and considerations (3.1)
// ---------------------------------------------------------------------------
const ARCH = [
  o('serverless', 'Sin servidor (serverless)'),
  o('iac', 'Infraestructura como código (IaC)'),
  o('hybrid', 'Híbrido'),
  o('microservices', 'Microservicios'),
  o('responsiveness', 'Capacidad de respuesta'),
  o('ease_deploy', 'Facilidad de implementación'),
  o('integration', 'Integración con la seguridad existente'),
  o('patch', 'Disponibilidad de parches'),
  o('power', 'Energía'),
  o('rtos_bof', 'Protección ante desbordamientos de búfer'),
  o('ics_updates', 'Capacidad limitada de actualizarse'),
];

const PBQ84: MatrixPbqDefinition = {
  item: review(84, 'cloud-shared-responsibility', 'Arquitectura', 'Modelos de Arquitectura y sus Consideraciones de Seguridad', ['3.1', []],
    'El comité técnico compara arquitecturas para los nuevos proyectos. Elige el modelo o la consideración que describe cada frase.',
    ['Elige el modelo o la consideración de cada caso.'],
    'Serverless = escribes código, el proveedor gestiona TODO lo de abajo. IaC = la infraestructura se define en archivos para que sea consistente y repetible. En IoT/embebidos, lo crítico suele ser parches, energía y la limitada capacidad de actualizarse.'),
  config: {
    pbqId: 'pbq-84',
    consoleTitle: 'Comparación de Arquitecturas (Objetivo 3.1)',
    instructions: 'Elige la opción que corresponde a cada frase.',
    sections: [
      {
        id: 's1', title: 'Arquitecturas', columns: [{ id: 'arch', label: 'Modelo o consideración', options: ARCH }],
        rows: [
          { id: 'r1', prompt: 'Ejecutar código sin gestionar ninguna infraestructura subyacente.', answers: { arch: 'serverless' }, explanation: 'El proveedor gestiona servidores y escalado: serverless. Trampa: IaC sigue requiriendo gestionar la infraestructura (con código).' },
          { id: 'r2', prompt: 'Definir servidores y redes en archivos versionados para evitar las diferencias manuales que causan problemas de seguridad.', answers: { arch: 'iac' }, explanation: 'El objetivo central de IaC es la consistencia; reducir el trabajo manual es un beneficio secundario.' },
          { id: 'r3', prompt: 'Combinar recursos en la nube y en las instalaciones propias.', answers: { arch: 'hybrid' }, explanation: 'Nube + on-premises = híbrido.' },
          { id: 'r4', prompt: 'Dividir una aplicación monolítica en servicios pequeños exige controles de acceso granulares entre ellos.', answers: { arch: 'microservices' }, explanation: 'Cada microservicio expone una API que hay que autorizar por separado.' },
          { id: 'r5', prompt: 'Que el sistema dé retroalimentación oportuna y precisa a las solicitudes de los usuarios.', answers: { arch: 'responsiveness' }, explanation: 'CompTIA lo llama capacidad de respuesta (responsiveness).' },
          { id: 'r6', prompt: 'Para un CTO cuya prioridad es implementar rápido, lo que más pesa es que encaje con los protocolos de seguridad que ya tiene.', answers: { arch: 'integration' }, explanation: 'La facilidad para integrarse con lo existente es la que más afecta al despliegue.' },
          { id: 'r7', prompt: 'Para que cada microservicio se configure de forma fluida y eficiente.', answers: { arch: 'ease_deploy' }, explanation: 'La consideración es la facilidad de implementación.' },
          { id: 'r8', prompt: 'Lo MÁS crítico para proteger los dispositivos IoT de vulnerabilidades.', answers: { arch: 'patch' }, explanation: 'Muchos IoT no reciben actualizaciones: la disponibilidad de parches es clave.' },
          { id: 'r9', prompt: 'Lo vital para que los dispositivos IoT sigan funcionando de forma continua.', answers: { arch: 'power' }, explanation: 'Sin alimentación confiable el dispositivo deja de operar: energía.' },
          { id: 'r10', prompt: 'Un dron con RTOS optimizado para tiempo real puede descuidar esta protección.', answers: { arch: 'rtos_bof' }, explanation: 'Los RTOS priorizan el rendimiento y a menudo carecen de protecciones de memoria contra desbordamientos.' },
          { id: 'r11', prompt: 'El sistema de control industrial (ICS/SCADA) de una central eléctrica.', answers: { arch: 'ics_updates' }, explanation: 'Los ICS no pueden detenerse para parchear: su riesgo típico es la capacidad limitada de actualizarse.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 85 — Resilience, backups and testing (3.4)
// ---------------------------------------------------------------------------
const RESILIENCE = [
  o('offsite', 'Copia fuera del sitio'),
  o('onsite', 'Copia local (en el sitio)'),
  o('continuous', 'Copia continua'),
  o('replication', 'Replicación'),
  o('journaling', 'Journaling'),
  o('full', 'Copia completa'),
  o('snapshot', 'Snapshot'),
  o('frequency', 'Frecuencia'),
  o('backup_enc', 'Cifrado de las copias'),
  o('hot', 'Sitio caliente (hot site)'),
  o('failover', 'Conmutación por error (failover)'),
  o('clustering', 'Clustering'),
];
const RES_TESTS = [
  o('tabletop', 'Ejercicio de mesa (tabletop)'),
  o('simulation', 'Simulación'),
  o('parallel', 'Procesamiento en paralelo'),
  o('capacity_people', 'Planificación de capacidad: personas'),
  o('capacity_tech', 'Planificación de capacidad: tecnología e infraestructura'),
];

const PBQ85: MatrixPbqDefinition = {
  item: review(85, 'disaster-recovery', 'Resiliencia', 'Copias de Seguridad, Replicación, Journaling y Pruebas de Resiliencia', ['3.4', []],
    'El plan de continuidad necesita decisiones concretas. Elige la estrategia de respaldo o el tipo de prueba de cada caso.',
    ['Sección 1: estrategia de respaldo o recuperación.', 'Sección 2: pruebas y planificación de capacidad.'],
    'Replicación = copia en tiempo (casi) real a OTRO lugar. Journaling = registro de cada transacción para recuperar hasta el instante exacto de la falla. Failover = cambiar al sistema de respaldo; clustering = varios nodos trabajando juntos. Simulación = ataque/escenario práctico; tabletop = discusión.'),
  config: {
    pbqId: 'pbq-85',
    consoleTitle: 'Plan de Continuidad (Objetivo 3.4)',
    instructions: 'Elige la opción que corresponde a cada caso. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1', title: 'Respaldo y recuperación', columns: [{ id: 'res', label: 'Estrategia', options: RESILIENCE }],
        rows: [
          { id: 'b1', prompt: 'La oficina está en una zona de inundaciones: las copias deben sobrevivir a la pérdida del edificio.', answers: { res: 'offsite' }, explanation: 'Fuera del sitio. Trampa: "nube" es una forma de offsite, pero la estrategia que se pide es la ubicación externa.' },
          { id: 'b2', prompt: 'Un banco procesa transacciones todo el día y no puede perder casi ninguna.', answers: { res: 'continuous' }, explanation: 'Copias continuas minimizan el RPO. Trampa: incrementales diarias perderían hasta un día.' },
          { id: 'b3', prompt: 'Duplicar los datos en tiempo casi real a una segunda ubicación para alta disponibilidad.', answers: { res: 'replication' }, explanation: 'Copia continua a otro sitio: replicación.' },
          { id: 'b4', prompt: 'Registrar cada transacción y cambio para recuperar el sistema hasta el punto exacto de la falla.', answers: { res: 'journaling' }, explanation: 'El registro de transacciones es journaling. Trampa: la replicación copia el estado, no el historial de cambios.' },
          { id: 'b5', prompt: 'Restaurar usando la menor cantidad posible de conjuntos de copias.', answers: { res: 'full' }, explanation: 'Una copia completa se restaura sola. Trampa: los snapshots suelen depender de cadenas de cambios.' },
          { id: 'b6', prompt: 'El elemento que define cada cuánto tiempo se hace una copia.', answers: { res: 'frequency' }, explanation: 'Intervalos fijos = frecuencia.' },
          { id: 'b7', prompt: 'Al competidor le robaron las cintas de respaldo y publicaron su contenido: hay que evitar que eso sea útil.', answers: { res: 'backup_enc' }, explanation: 'Si las copias se roban, el cifrado las vuelve ilegibles. Trampa: programarlas no protege su confidencialidad.' },
          { id: 'b8', prompt: 'Recuperación inmediata dentro de las mismas instalaciones del centro de datos.', answers: { res: 'onsite' }, explanation: 'Lo más rápido es la copia local. Trampa: la replicación remota tarda más en traerse.' },
          { id: 'b9', prompt: 'Réplica a escala real de toda la infraestructura que se activa en minutos.', answers: { res: 'hot' }, explanation: 'Sitio caliente.' },
          { id: 'b10', prompt: 'Probar que el servicio cambia automáticamente al sistema de respaldo cuando el principal se cae.', answers: { res: 'failover' }, explanation: 'Cambiar al respaldo ante la falla es failover. Trampa: clustering reparte el trabajo entre nodos activos.' },
        ],
      },
      {
        id: 's2', title: 'Pruebas y capacidad', columns: [{ id: 'test', label: 'Prueba o planificación', options: RES_TESTS }],
        rows: [
          { id: 't1', prompt: 'Un equipo defiende y otro ataca en un escenario práctico para probar los nuevos planes.', answers: { test: 'simulation' }, explanation: 'Ejecutar el escenario en la práctica es simulación. Trampa: tabletop es solo conversar el plan.' },
          { id: 't2', prompt: 'Los responsables recorren el plan en una sala, discutiendo qué haría cada uno.', answers: { test: 'tabletop' }, explanation: 'Discusión sin ejecutar: ejercicio de mesa.' },
          { id: 't3', prompt: 'Evaluar varias estrategias de recuperación al mismo tiempo.', answers: { test: 'parallel' }, explanation: 'Correrlas simultáneamente es procesamiento en paralelo.' },
          { id: 't4', prompt: 'Prever cuánto personal se necesitará para la carga de trabajo y los proyectos futuros.', answers: { test: 'capacity_people' }, explanation: 'Planificación de capacidad de personas. Trampa: la formación es otra cosa.' },
          { id: 't5', prompt: 'Analizar tendencias para que servidores y red soporten la demanda futura.', answers: { test: 'capacity_tech' }, explanation: 'Planificación de capacidad tecnológica. Trampa: redundancia cubre fallas, no crecimiento.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 86 — Automation, orchestration and change management (4.7, 1.3)
// ---------------------------------------------------------------------------
const AUTOMATION = [
  o('user_prov', 'Aprovisionamiento de usuarios'),
  o('resource_prov', 'Aprovisionamiento de recursos'),
  o('ci', 'Integración continua'),
  o('guardrails', 'Líneas base / guardrails'),
  o('ticketing', 'Creación de tickets'),
  o('workforce', 'Multiplicador de la fuerza laboral'),
  o('tech_debt', 'Deuda técnica'),
  o('spof', 'Punto único de fallo'),
  o('tco', 'Costo total de propiedad (TCO)'),
  o('supportability', 'Soporte continuo (personal capacitado)'),
  o('scripting', 'Scripting'),
];
const CHANGE = [
  o('stakeholders', 'Partes interesadas'),
  o('downtime', 'Tiempo de inactividad'),
  o('restart', 'Reinicio de la aplicación'),
  o('rollback', 'Reversión (rollback)'),
  o('test', 'Probar los resultados'),
  o('change_mgmt', 'Gestión de cambios'),
];

const PBQ86: MatrixPbqDefinition = {
  item: review(86, 'soar-automation', 'Automatización y cambios', 'Automatización, Orquestación y Gestión de Cambios', ['4.7', ['1.3']],
    'El equipo de operaciones automatiza tareas y revisa sus últimos cambios. Elige el concepto de cada frase.',
    ['Sección 1: automatización y orquestación (4.7).', 'Sección 2: gestión de cambios (1.3).'],
    'Aprovisionamiento de USUARIOS = cuentas que se crean al ingresar y se eliminan al salir. Aprovisionamiento de RECURSOS = servidores/VMs que se crean o ajustan según la demanda. TCO = costo de toda la vida útil; ROI = retorno. Deuda técnica = atajos que luego complican la seguridad y la automatización.'),
  config: {
    pbqId: 'pbq-86',
    consoleTitle: 'Operaciones Automatizadas (Objetivos 4.7 y 1.3)',
    instructions: 'Elige la opción que corresponde a cada frase.',
    sections: [
      {
        id: 's1', title: 'Automatización', columns: [{ id: 'auto', label: 'Concepto', options: AUTOMATION }],
        rows: [
          { id: 'a1', prompt: 'Las cuentas se crean automáticamente al contratar a alguien y se eliminan cuando se va.', answers: { auto: 'user_prov' }, explanation: 'Cuentas de personas: aprovisionamiento de usuarios. Trampa: no crea VMs.' },
          { id: 'a2', prompt: 'Las máquinas virtuales se crean o ajustan automáticamente según la demanda del negocio.', answers: { auto: 'resource_prov' }, explanation: 'Infraestructura según la demanda: aprovisionamiento de recursos.' },
          { id: 'a3', prompt: 'Cada cambio de código se compila y prueba automáticamente, lo que mejora la productividad.', answers: { auto: 'ci' }, explanation: 'Integración continua. Trampa: no "ralentiza el desarrollo".' },
          { id: 'a4', prompt: 'Configuraciones estándar en todos los sistemas para que la automatización sea eficiente y segura.', answers: { auto: 'guardrails' }, explanation: 'Líneas base y guardrails estandarizan la configuración.' },
          { id: 'a5', prompt: 'Cada alerta genera un registro asignado que permite rendir cuentas y medir el desempeño.', answers: { auto: 'ticketing' }, explanation: 'Creación automática de tickets.' },
          { id: 'a6', prompt: 'Escalar las capacidades de seguridad combinando analistas con automatización.', answers: { auto: 'workforce' }, explanation: 'La automatización multiplica lo que logra cada persona: multiplicador de la fuerza laboral.' },
          { id: 'a7', prompt: 'Atajos acumulados en sistemas viejos que vuelven más compleja la seguridad y difícil la automatización.', answers: { auto: 'tech_debt' }, explanation: 'Deuda técnica.' },
          { id: 'a8', prompt: 'Si el único servidor de orquestación cae, se detienen todas las respuestas automáticas.', answers: { auto: 'spof' }, explanation: 'Punto único de fallo: hay que mitigarlo para mantener la disponibilidad.' },
          { id: 'a9', prompt: 'Evaluar el impacto financiero de la nueva herramienta durante toda su vida útil.', answers: { auto: 'tco' }, explanation: 'TCO. Trampa: ROI mide el retorno, no el costo total.' },
          { id: 'a10', prompt: 'Lo MÁS crucial para que la nueva herramienta de automatización se pueda mantener en el tiempo.', answers: { auto: 'supportability' }, explanation: 'Sin personal capacitado no hay soporte continuo.' },
          { id: 'a11', prompt: 'Modificar en lote los servicios de software según el estado de cada empleado en una transición.', answers: { auto: 'scripting' }, explanation: 'Un script aplica cambios en lote.' },
        ],
      },
      {
        id: 's2', title: 'Gestión de cambios', columns: [{ id: 'chg', label: 'Elemento', options: CHANGE }],
        rows: [
          { id: 'g1', prompt: 'Lisa recaba la opinión de los representantes de cada departamento afectado por el cambio.', answers: { chg: 'stakeholders' }, explanation: 'Los afectados que deben ser consultados son las partes interesadas. Trampa: el proceso de aprobación es la firma del CAB.' },
          { id: 'g2', prompt: 'La actualización del servidor obligó a una interrupción programada de tres horas.', answers: { chg: 'downtime' }, explanation: 'La implicación técnica es el tiempo de inactividad. Trampa: la ventana de mantenimiento es CUÁNDO se hace.' },
          { id: 'g3', prompt: 'La base del CRM se dañó y hay que volver a levantar la aplicación.', answers: { chg: 'restart' }, explanation: 'Reiniciar o recuperar la aplicación.' },
          { id: 'g4', prompt: 'Una actualización reciente rompió el cálculo de inventario: hay que volver a la versión anterior.', answers: { chg: 'rollback' }, explanation: 'Volver a la versión previa es reversión. Trampa: verificar dependencias se hace antes del cambio.' },
          { id: 'g5', prompt: 'Tras aplicar la nueva política de contraseñas, el siguiente paso es comprobar que funciona como se esperaba.', answers: { chg: 'test' }, explanation: 'Validar los resultados del cambio implementado.' },
          { id: 'g6', prompt: 'Toda modificación debe ser revisada por un consejo asesor y aprobada antes de implementarse.', answers: { chg: 'change_mgmt' }, explanation: 'El proceso completo es gestión de cambios. Trampa: el análisis de impacto es solo una parte.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 87 — Access control models, authentication and mobile (4.6, 4.1)
// ---------------------------------------------------------------------------
const AC_PICK = [
  o('rule', 'Basado en reglas'),
  o('abac', 'Basado en atributos (ABAC)'),
  o('mac', 'Obligatorio (MAC)'),
  o('dac', 'Discrecional (DAC)'),
  o('passkey', 'Passkey'),
  o('otp', 'OTP'),
  o('no_reuse', 'Política contra la reutilización de contraseñas'),
  o('expiration', 'Caducidad de contraseñas'),
  o('attestation', 'Certificación de accesos (attestation)'),
];
const MOBILE = [
  o('byod', 'BYOD'),
  o('cope', 'COPE'),
  o('cyod', 'CYOD'),
  o('wipe', 'Borrado remoto'),
  o('tkip', 'TKIP'),
  o('golden', 'Imagen estándar (golden image)'),
];

const PBQ87: MatrixPbqDefinition = {
  item: review(87, 'access-control-models', 'Identidad y dispositivos', 'Modelos de Acceso, Autenticación y Modelos de Dispositivos Móviles', ['4.6', ['4.1']],
    'El equipo de identidad y el de endpoints documentan sus controles. Elige el modelo o la práctica de cada caso.',
    ['Sección 1: control de acceso y autenticación (4.6).', 'Sección 2: dispositivos y configuración (4.1).'],
    'Regla global (hora del día) = rule-based. Varias características combinadas = ABAC. Etiquetas impuestas = MAC. El dueño decide = DAC. COPE = el equipo es de la empresa pero se permite uso personal; CYOD = el empleado elige de una lista y la empresa lo compra; BYOD = el equipo es del empleado.'),
  config: {
    pbqId: 'pbq-87',
    consoleTitle: 'Identidad y Dispositivos (Objetivos 4.6 y 4.1)',
    instructions: 'Elige la opción que corresponde a cada caso.',
    sections: [
      {
        id: 's1', title: 'Acceso y autenticación', columns: [{ id: 'ac', label: 'Modelo o práctica', options: AC_PICK }],
        rows: [
          { id: 'k1', prompt: 'El banco solo permite el acceso en horario laboral; se evalúa la hora de cada solicitud.', answers: { ac: 'rule' }, explanation: 'Una regla global igual para todos: basado en reglas. Trampa: ABAC combina varios atributos del usuario.' },
          { id: 'k2', prompt: 'Se evalúan dinámicamente el puesto, el departamento, la ubicación y la hora del usuario.', answers: { ac: 'abac' }, explanation: 'Muchos atributos combinados: ABAC.' },
          { id: 'k3', prompt: 'Instalación gubernamental: el acceso depende de la autorización de cada persona según reglas predefinidas que nadie puede cambiar.', answers: { ac: 'mac' }, explanation: 'Niveles impuestos por la organización: MAC. Trampa: basado en reglas no usa niveles de autorización.' },
          { id: 'k4', prompt: 'En la startup, cada usuario decide quién puede ver sus archivos y carpetas.', answers: { ac: 'dac' }, explanation: 'El dueño decide: DAC.' },
          { id: 'k5', prompt: 'Autenticación robusta en la app móvil sin que el usuario recuerde ni escriba nada, resistente a phishing.', answers: { ac: 'passkey' }, explanation: 'Las passkeys (FIDO2) eliminan la contraseña. Trampa: un OTP sigue teniendo que escribirse y puede ser robado.' },
          { id: 'k6', prompt: 'Los empleados usan la misma contraseña en varias plataformas de trabajo.', answers: { ac: 'no_reuse' }, explanation: 'El problema es la reutilización. Trampa: caducar más seguido no evita que repitan la misma en todos lados.' },
          { id: 'k7', prompt: 'Muchos empleados llevan más de un año con la misma contraseña y la política exige cambiarla.', answers: { ac: 'expiration' }, explanation: 'Imponer un tiempo máximo de uso es caducidad de contraseñas.' },
          { id: 'k8', prompt: 'Los propietarios de los datos revisan y confirman periódicamente los accesos de cada usuario.', answers: { ac: 'attestation' }, explanation: 'Revisión periódica de accesos por los owners: certificación/attestation. Trampa: no es una auditoría de un regulador.' },
        ],
      },
      {
        id: 's2', title: 'Dispositivos', columns: [{ id: 'mob', label: 'Modelo o práctica', options: MOBILE }],
        rows: [
          { id: 'p1', prompt: 'La empresa compra los teléfonos y permite que los empleados también los usen para fines personales.', answers: { mob: 'cope' }, explanation: 'Propiedad corporativa con uso personal habilitado: COPE.' },
          { id: 'p2', prompt: 'El empleado elige un modelo de una lista aprobada y la empresa lo compra y administra.', answers: { mob: 'cyod' }, explanation: 'Elección dentro de un catálogo: CYOD.' },
          { id: 'p3', prompt: 'Los empleados usan sus propios teléfonos para el correo corporativo.', answers: { mob: 'byod' }, explanation: 'El equipo es del empleado: BYOD.' },
          { id: 'p4', prompt: 'En BYOD, lo más efectivo si un teléfono con datos corporativos se pierde.', answers: { mob: 'wipe' }, explanation: 'El borrado remoto (idealmente selectivo) protege los datos. Trampa: cifrar todo el teléfono no lo recupera ni lo borra.' },
          { id: 'p5', prompt: 'Cifrado inalámbrico compatible con equipos antiguos de la fábrica que no soportan AES.', answers: { mob: 'tkip' }, explanation: 'TKIP es el que soportan los equipos viejos (es débil; solo por compatibilidad). Trampa: AES requiere hardware más nuevo.' },
          { id: 'p6', prompt: 'Una configuración consistente y reproducible para instalar en todas las estaciones.', answers: { mob: 'golden' }, explanation: 'Una imagen estándar del sistema. Trampa: las herramientas de gestión de configuración mantienen, pero la base reproducible es la imagen.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 88 — Incident response, forensics, data sources and monitoring (4.8, 4.9, 4.4)
// ---------------------------------------------------------------------------
const IR_TERMS = [
  o('ediscovery', 'Descubrimiento electrónico (e-discovery)'),
  o('preservation', 'Preservación de la evidencia'),
  o('acquisition', 'Adquisición'),
  o('reporting', 'Informe (según su público)'),
  o('detection', 'Detección'),
  o('analysis', 'Análisis'),
  o('containment', 'Contención'),
  o('training', 'Capacitación'),
];
const DATA_SOURCES = [
  o('linux_auth', 'Registros de autenticación de Linux'),
  o('ips_logs', 'Registros del IPS/IDS'),
  o('fw_logs', 'Registros del firewall'),
  o('pcap', 'Captura de paquetes'),
  o('dashboard', 'Panel (dashboard)'),
  o('aggregation', 'Agregación de logs'),
  o('tuning', 'Ajuste de alertas'),
  o('quarantine', 'Cuarentena'),
  o('infra_mon', 'Monitoreo de infraestructura'),
  o('sys_mon', 'Monitoreo de sistemas'),
];

const PBQ88: MatrixPbqDefinition = {
  item: review(88, 'incident-response', 'Respuesta e investigación', 'Respuesta a Incidentes, Forense, Fuentes de Datos y Monitoreo', ['4.8', ['4.9', '4.4']],
    'El equipo de respuesta repasa cómo actuó en el último incidente. Elige la fase, la actividad o la fuente de datos de cada caso.',
    ['Sección 1: respuesta a incidentes y forense (4.8).', 'Sección 2: fuentes de datos y monitoreo (4.9 y 4.4).'],
    'E-discovery = buscar y entregar información electrónica para un caso LEGAL. Preservación = mantener la integridad en el tiempo. Adquisición = hacer la copia forense. Detección = identificar y clasificar por gravedad; análisis = buscar la causa; contención = evitar que se extienda.'),
  config: {
    pbqId: 'pbq-88',
    consoleTitle: 'Revisión Posterior al Incidente (Objetivos 4.8, 4.9 y 4.4)',
    instructions: 'Elige la opción que corresponde a cada caso.',
    sections: [
      {
        id: 's1', title: 'Respuesta y forense', columns: [{ id: 'ir', label: 'Fase o actividad', options: IR_TERMS }],
        rows: [
          { id: 'i1', prompt: 'Identificar, recopilar y entregar información almacenada electrónicamente para un juicio.', answers: { ir: 'ediscovery' }, explanation: 'E-discovery. Trampa: elegir herramientas forenses no es su propósito.' },
          { id: 'i2', prompt: 'Revisar archivos electrónicos para extraer los documentos relevantes para el caso legal.', answers: { ir: 'ediscovery' }, explanation: 'Buscar y seleccionar documentos para el caso es el núcleo del e-discovery. Trampa: recuperar archivos borrados es análisis forense.' },
          { id: 'i3', prompt: 'Mantener la integridad de la evidencia digital a lo largo del tiempo.', answers: { ir: 'preservation' }, explanation: 'Preservación (cadena de custodia, almacenamiento seguro, hash).' },
          { id: 'i4', prompt: 'Crear una imagen byte a byte del disco para analizarla.', answers: { ir: 'acquisition' }, explanation: 'Obtener la copia limpia del dispositivo es la adquisición. Trampa: no es comprar controles.' },
          { id: 'i5', prompt: 'Lo MÁS importante al decidir el contenido del informe forense.', answers: { ir: 'reporting' }, explanation: 'El público objetivo define el informe (ejecutivo, técnico, legal).' },
          { id: 'i6', prompt: 'Identificar el incidente y clasificarlo por gravedad e impacto.', answers: { ir: 'detection' }, explanation: 'Detección. Trampa: determinar la causa raíz es análisis.' },
          { id: 'i7', prompt: 'Determinar la causa raíz a partir de la evidencia.', answers: { ir: 'analysis' }, explanation: 'Análisis.' },
          { id: 'i8', prompt: 'Evitar que el incidente afecte a otros dispositivos.', answers: { ir: 'containment' }, explanation: 'Contención.' },
          { id: 'i9', prompt: 'Asegurar que el equipo reaccione rápido cuando ocurra un incidente.', answers: { ir: 'training' }, explanation: 'La capacitación prepara al equipo para reaccionar.' },
        ],
      },
      {
        id: 's2', title: 'Fuentes de datos y monitoreo', columns: [{ id: 'src', label: 'Fuente o actividad', options: DATA_SOURCES }],
        rows: [
          { id: 's1r', prompt: 'Ver los inicios de sesión fallidos y exitosos del servidor Linux comprometido.', answers: { src: 'linux_auth' }, explanation: '/var/log/auth.log (o secure) registra la autenticación.' },
          { id: 's2r', prompt: 'Ver el detalle de las actividades sospechosas detectadas en las últimas dos semanas.', answers: { src: 'ips_logs' }, explanation: 'El IPS/IDS registra lo sospechoso. Trampa: IP, puertos y marcas de TODAS las conexiones están en el firewall.' },
          { id: 's3r', prompt: 'Ver origen, destino, puerto y acción de todas las conexiones permitidas y bloqueadas.', answers: { src: 'fw_logs' }, explanation: 'Esos campos para todas las conexiones son el log del firewall.' },
          { id: 's4r', prompt: 'Ver el handshake TLS y las respuestas DNS del tráfico de una IP externa.', answers: { src: 'pcap' }, explanation: 'El contenido de los paquetes está en una captura. Trampa: la caché ARP no muestra eso.' },
          { id: 's5r', prompt: 'Ver datos en tiempo real de actividades sospechosas en un solo lugar.', answers: { src: 'dashboard' }, explanation: 'Los paneles muestran el estado en tiempo real.' },
          { id: 's6r', prompt: 'Recopilar y normalizar los logs de muchas fuentes para facilitar su análisis.', answers: { src: 'aggregation' }, explanation: 'Agregación. Trampa: analizarlos es otra actividad.' },
          { id: 's7r', prompt: 'Reducir los falsos positivos para mejorar la precisión de las alertas.', answers: { src: 'tuning' }, explanation: 'Ajuste de alertas.' },
          { id: 's8r', prompt: 'El usuario pierde el acceso al archivo sospechoso, pero no al resto del directorio.', answers: { src: 'quarantine' }, explanation: 'La cuarentena aísla ese archivo concreto.' },
          { id: 's9r', prompt: 'Una vista integral del estado de redes, nube y servidores.', answers: { src: 'infra_mon' }, explanation: 'Monitoreo de infraestructura: la visión de conjunto.' },
          { id: 's10r', prompt: 'Detectar cambios no autorizados en el hardware, el SO y los servicios de cada equipo.', answers: { src: 'sys_mon' }, explanation: 'Monitoreo de sistemas: cada equipo por dentro.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 89 — Risk terminology and vulnerability management (5.2, 4.3)
// ---------------------------------------------------------------------------
const RISK = [
  o('probability', 'Probabilidad (probability)'),
  o('likelihood', 'Verosimilitud (likelihood)'),
  o('tolerance', 'Tolerancia al riesgo'),
  o('appetite', 'Apetito de riesgo'),
  o('threshold', 'Umbral de riesgo'),
  o('ef', 'Factor de exposición (EF)'),
  o('register', 'Registro de riesgos'),
  o('report', 'Informe de riesgos'),
  o('kri', 'Indicador clave de riesgo (KRI)'),
  o('one_time', 'Evaluación única (one-time)'),
  o('recurring', 'Evaluación recurrente'),
  o('owner', 'Propietario del riesgo'),
];
const VULN_MGMT = [
  o('high', 'Severidad High (7.0–8.9)'),
  o('critical', 'Severidad Critical (9.0–10.0)'),
  o('cve', 'CVE-2022-12345'),
  o('av', 'Vector de ataque (AV)'),
  o('env', 'Variables ambientales'),
  o('scan', 'Escaneo de vulnerabilidades'),
  o('patch', 'Aplicar actualizaciones de seguridad'),
  o('third_party_assess', 'Evaluación de vulnerabilidades por un tercero'),
];

const PBQ89: MatrixPbqDefinition = {
  item: review(89, 'risk-concepts', 'Riesgo y vulnerabilidades', 'Terminología de Riesgo y Gestión de Vulnerabilidades', ['5.2', ['4.3']],
    'El comité de riesgos revisa su vocabulario antes de la auditoría. Elige el término que corresponde a cada frase.',
    ['Sección 1: gestión de riesgos (5.2).', 'Sección 2: gestión de vulnerabilidades (4.3).'],
    'Probability = número estadístico (7 %); likelihood = valoración cualitativa ("alta"). Apetito = cuánto riesgo se busca para crecer; tolerancia = cuánto se acepta; umbral = el nivel en que se dispara una acción. Registro = la lista de riesgos; informe = el documento que se presenta a la dirección.'),
  config: {
    pbqId: 'pbq-89',
    consoleTitle: 'Vocabulario de Riesgo (Objetivos 5.2 y 4.3)',
    instructions: 'Elige el término de cada frase.',
    sections: [
      {
        id: 's1', title: 'Riesgo', columns: [{ id: 'risk', label: 'Término', options: RISK }],
        rows: [
          { id: 'r1', prompt: 'Hay un 7 % de probabilidad de que falle el hardware el próximo año según datos estadísticos.', answers: { risk: 'probability' }, explanation: 'Un valor numérico basado en estadística es probability.' },
          { id: 'r2', prompt: 'Un experto califica como "alta" la posibilidad de una filtración por incidentes recientes del sector.', answers: { risk: 'likelihood' }, explanation: 'Una valoración cualitativa es likelihood. Trampa: no es la calificación final del riesgo.' },
          { id: 'r3', prompt: 'El nivel predeterminado de exposición que la organización considera aceptable.', answers: { risk: 'tolerance' }, explanation: 'Tolerancia. Trampa: apetito es cuánto riesgo se está dispuesto a perseguir para lograr objetivos.' },
          { id: 'r4', prompt: 'El nivel de riesgo a partir del cual la organización toma medidas.', answers: { risk: 'threshold' }, explanation: 'El punto de disparo es el umbral.' },
          { id: 'r5', prompt: 'El porcentaje del valor del activo que se pierde cuando se materializa el riesgo.', answers: { risk: 'ef' }, explanation: 'Exposure Factor. Trampa: SLE es el monto en dinero (AV × EF), no el porcentaje.' },
          { id: 'r6', prompt: 'Documento central donde se listan todos los riesgos para gestionarlos y responder a ellos.', answers: { risk: 'register' }, explanation: 'Registro de riesgos.' },
          { id: 'r7', prompt: 'Jacob presenta a la dirección el estado trimestral y los cambios de los riesgos identificados.', answers: { risk: 'report' }, explanation: 'Comunicar el estado es el informe de riesgos. Trampa: el registro es la base de datos.' },
          { id: 'r8', prompt: 'Métrica predictiva que se monitorea para anticipar riesgos.', answers: { risk: 'kri' }, explanation: 'KRI.' },
          { id: 'r9', prompt: 'Evaluación integral en un momento específico, por ejemplo antes de implementar un sistema nuevo.', answers: { risk: 'one_time' }, explanation: 'One-time. Trampa: ad hoc es reactiva ante un evento.' },
          { id: 'r10', prompt: 'Evaluaciones periódicas a intervalos regulares para seguir el ritmo de las amenazas.', answers: { risk: 'recurring' }, explanation: 'Recurrente = periódica. Trampa: continua es permanente, sin intervalos.' },
          { id: 'r11', prompt: 'Persona responsable de gestionar un riesgo concreto y vigilar sus mitigaciones.', answers: { risk: 'owner' }, explanation: 'Propietario del riesgo.' },
        ],
      },
      {
        id: 's2', title: 'Vulnerabilidades', columns: [{ id: 'vuln', label: 'Término', options: VULN_MGMT }],
        rows: [
          { id: 'v1', prompt: 'Una vulnerabilidad difícil de explotar pero con impacto grave obtiene un CVSS de 8,1.', answers: { vuln: 'high' }, explanation: '7.0–8.9 es High. Trampa: Critical empieza en 9.0.' },
          { id: 'v2', prompt: 'Un identificador CVE con formato válido.', answers: { vuln: 'cve' }, explanation: 'CVE-AÑO-NÚMERO. Trampa: "AV:N/AC:L…" es un vector CVSS, no un CVE.' },
          { id: 'v3', prompt: 'Métrica CVSS que indica si el exploit requiere acceso físico, local o por red.', answers: { vuln: 'av' }, explanation: 'Attack Vector (AV). Trampa: S es Scope.' },
          { id: 'v4', prompt: 'Características propias de la infraestructura de la empresa que cambian la evaluación de una vulnerabilidad.', answers: { vuln: 'env' }, explanation: 'Las variables ambientales ajustan el riesgo al entorno real.' },
          { id: 'v5', prompt: 'Método sistemático y automatizado para detectar vulnerabilidades conocidas públicamente.', answers: { vuln: 'scan' }, explanation: 'Escaneo de vulnerabilidades. Trampa: bug bounty depende de investigadores externos.' },
          { id: 'v6', prompt: 'Lo MÁS crucial para que una vulnerabilidad conocida no llegue a explotarse.', answers: { vuln: 'patch' }, explanation: 'Aplicar las actualizaciones de seguridad. Trampa: la línea base no corrige la falla.' },
          { id: 'v7', prompt: 'Validar que las correcciones de desbordamiento de búfer realmente funcionan.', answers: { vuln: 'third_party_assess' }, explanation: 'Una evaluación de vulnerabilidades específica (por ejemplo, de un tercero) confirma la remediación. Trampa: las métricas de rendimiento no prueban nada sobre la seguridad.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 90 — Laws, frameworks and compliance (5.1, 5.4, 3.3)
// ---------------------------------------------------------------------------
const LAWS = [
  o('gdpr', 'GDPR'),
  o('ccpa', 'CCPA'),
  o('sox', 'SOX'),
  o('fisma', 'FISMA'),
  o('csa87', 'Computer Security Act (1987)'),
  o('glba', 'GLBA'),
  o('hipaa', 'HIPAA'),
  o('fips', 'FIPS 140'),
  o('iso27001', 'ISO/IEC 27001'),
  o('iso27002', 'ISO/IEC 27002'),
];
const COMPLIANCE = [
  o('consent', 'Consentimiento informado'),
  o('sensitive', 'Datos sensibles (categorías especiales)'),
  o('regulated', 'Datos regulados'),
  o('public', 'Datos públicos'),
  o('due_care', 'Diligencia y cuidado debidos'),
  o('fine', 'Multa'),
  o('external_report', 'Informe de cumplimiento externo'),
  o('national', 'Implicaciones legales nacionales'),
  o('forgotten_exception', 'Excepción al derecho al olvido'),
  o('bcp', 'Política de continuidad del negocio'),
];

const PBQ90: MatrixPbqDefinition = {
  item: review(90, 'compliance-awareness', 'Leyes y cumplimiento', 'Leyes, Marcos y Conceptos de Cumplimiento', ['5.1', ['5.4', '3.3']],
    'El área legal prepara una guía rápida de normativas para los nuevos analistas. Elige la ley, el marco o el concepto de cada caso.',
    ['Sección 1: leyes y marcos.', 'Sección 2: conceptos de cumplimiento y datos.'],
    'SOX = informes financieros de empresas que cotizan. GLBA = instituciones financieras y datos de clientes. HIPAA = salud. FISMA = sistemas federales de EE. UU. (ley de 2002); Computer Security Act de 1987 = la ley original que exigió políticas de seguridad a las agencias federales. ISO 27001 = el SGSI certificable; 27002 = la guía de controles.'),
  config: {
    pbqId: 'pbq-90',
    consoleTitle: 'Guía Rápida de Normativas (Objetivos 5.1 y 5.4)',
    instructions: 'Elige la opción que corresponde a cada caso. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1', title: 'Leyes y marcos', columns: [{ id: 'law', label: 'Ley o marco', options: LAWS }],
        rows: [
          { id: 'l1', prompt: 'Exige evaluaciones de riesgos, controles internos y auditorías para la transparencia de la información financiera.', answers: { law: 'sox' }, explanation: 'SOX (Sarbanes-Oxley). Trampa: FISMA es para agencias federales.' },
          { id: 'l2', prompt: 'Ley de EE. UU. de 1987 que exigió a las agencias federales desarrollar políticas de seguridad para sus sistemas.', answers: { law: 'csa87' }, explanation: 'Computer Security Act de 1987. Trampa: GLBA regula instituciones financieras.' },
          { id: 'l3', prompt: 'Ejemplo de regulación "horizontal" de datos personales en EE. UU., parecida al GDPR.', answers: { law: 'ccpa' }, explanation: 'La CCPA de California protege datos personales en todos los sectores. Trampa: FISMA es federal y sectorial.' },
          { id: 'l4', prompt: 'Normas del NIST con los requisitos de los módulos criptográficos de los sistemas federales.', answers: { law: 'fips' }, explanation: 'FIPS 140. Trampa: SP 800-63 trata la identidad digital.' },
          { id: 'l5', prompt: 'Marco certificable de un sistema de gestión de la seguridad de la información (SGSI).', answers: { law: 'iso27001' }, explanation: '27001 define el SGSI; 27002 es la guía de controles.' },
          { id: 'l6', prompt: 'Protección de la información de los clientes en instituciones financieras de EE. UU.', answers: { law: 'glba' }, explanation: 'GLBA (Gramm-Leach-Bliley).' },
          { id: 'l7', prompt: 'Su principio central para recopilar datos personales es el consentimiento informado.', answers: { law: 'gdpr' }, explanation: 'GDPR.' },
          { id: 'l8', prompt: 'Protege la información de salud de los pacientes en EE. UU.', answers: { law: 'hipaa' }, explanation: 'HIPAA.' },
        ],
      },
      {
        id: 's2', title: 'Cumplimiento y datos', columns: [{ id: 'comp', label: 'Concepto', options: COMPLIANCE }],
        rows: [
          { id: 'c1', prompt: 'Según el GDPR, creencias religiosas y opiniones políticas.', answers: { comp: 'sensitive' }, explanation: 'Son categorías especiales (datos sensibles). Trampa: el historial de compras es personal, pero no sensible.' },
          { id: 'c2', prompt: 'Datos que por ley requieren un manejo específico.', answers: { comp: 'regulated' }, explanation: 'Etiqueta "regulado". Trampa: confidencial no implica una obligación legal.' },
          { id: 'c3', prompt: 'Registros judiciales o informes gubernamentales con partes censuradas que cualquiera puede consultar.', answers: { comp: 'public' }, explanation: 'Si se publican, son datos públicos.' },
          { id: 'c4', prompt: 'Tomar las medidas necesarias para cumplir con los requisitos legales y de otra índole.', answers: { comp: 'due_care' }, explanation: 'Diligencia/cuidado debido. Trampa: auditar periódicamente es solo una forma de verificarlo.' },
          { id: 'c5', prompt: 'Sanción monetaria por incumplir normas o acuerdos.', answers: { comp: 'fine' }, explanation: 'Multa. Trampa: "sanción" es el término general, no necesariamente monetario.' },
          { id: 'c6', prompt: 'Informar al público y a las partes interesadas externas sobre el estado de cumplimiento.', answers: { comp: 'external_report' }, explanation: 'Informe externo. Trampa: el interno va a la dirección.' },
          { id: 'c7', prompt: 'Leyes de un país que dictan cómo recopilar, almacenar y procesar datos dentro de él.', answers: { comp: 'national' }, explanation: 'Implicaciones legales nacionales. Trampa: el GDPR es supranacional.' },
          { id: 'c8', prompt: 'El sitio puede negarse a borrar los datos de Samantha porque los necesita para ejercer la libertad de expresión.', answers: { comp: 'forgotten_exception' }, explanation: 'La libertad de expresión es una excepción al derecho al olvido. Trampa: el consentimiento previo no impide pedir el borrado.' },
          { id: 'c9', prompt: 'Política para mantener las funciones críticas del negocio durante desastres y ciberataques.', answers: { comp: 'bcp' }, explanation: 'Continuidad del negocio cubre TODAS las funciones críticas. Trampa: recuperación ante desastres se centra en restaurar TI.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 91 — Vendors, audits, data roles and awareness (5.3, 5.5, 5.1, 5.6)
// ---------------------------------------------------------------------------
const VENDOR_AUDIT = [
  o('sow', 'SOW'),
  o('mou', 'MOU'),
  o('vendor_monitoring', 'Monitoreo de proveedores'),
  o('independent', 'Evaluación independiente'),
  o('internal_audit_evidence', 'Evidencia de auditorías internas'),
  o('personal', 'Conflicto por relaciones personales'),
  o('audit_committee', 'Comité de auditoría'),
  o('regulatory_exam', 'Examen regulatorio'),
  o('third_party_audit', 'Auditoría de terceros'),
];
const ROLES_AWARE = [
  o('owner', 'Propietario de los datos'),
  o('controller_processor', 'Responsable y encargado del tratamiento'),
  o('security_officer', 'Oficial de seguridad'),
  o('insider', 'Amenaza interna'),
  o('initial_report', 'Informe inicial'),
  o('periodic_report', 'Informe periódico'),
  o('opsec', 'Seguridad operacional'),
  o('handbook', 'Manual de políticas'),
];

const PBQ91: MatrixPbqDefinition = {
  item: review(91, 'third-party-governance', 'Proveedores, auditorías y roles', 'Proveedores, Auditorías, Roles y Concienciación', ['5.3', ['5.5', '5.1', '5.6']],
    'El área de gobierno prepara el repaso anual para los responsables de cada equipo. Elige el término de cada caso.',
    ['Sección 1: proveedores y auditorías (5.3 y 5.5).', 'Sección 2: roles y concienciación (5.1 y 5.6).'],
    'Evaluación de proveedores = antes de contratar; monitoreo = de forma continua después. Auditoría de terceros = examen completo por una firma independiente; atestación = la declaración formal que resulta de una auditoría. Owner = clasifica y decide el acceso; controller = decide para qué se tratan los datos.'),
  config: {
    pbqId: 'pbq-91',
    consoleTitle: 'Repaso Anual de Gobierno (Objetivos 5.1, 5.3, 5.5 y 5.6)',
    instructions: 'Elige la opción que corresponde a cada caso. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1', title: 'Proveedores y auditorías', columns: [{ id: 'va', label: 'Término', options: VENDOR_AUDIT }],
        rows: [
          { id: 'v1', prompt: 'Contrato que describe los servicios concretos del proveedor, con plazos y costos.', answers: { va: 'sow' }, explanation: 'Statement of Work. Trampa: el MSA fija los términos generales, no un trabajo concreto.' },
          { id: 'v2', prompt: 'Trent evalúa periódicamente a los proveedores ya contratados para confirmar que mantienen la seguridad pactada.', answers: { va: 'vendor_monitoring' }, explanation: 'Después de contratar, es monitoreo. Trampa: la evaluación es previa a la contratación.' },
          { id: 'v3', prompt: 'Un tercero ajeno a ambas partes analiza la postura de seguridad del proveedor.', answers: { va: 'independent' }, explanation: 'Evaluación independiente. Trampa: la cláusula de derecho a auditoría solo da el permiso.' },
          { id: 'v4', prompt: 'Se pide al proveedor el resultado de sus propias auditorías para verificar que cumple sus normas internas.', answers: { va: 'internal_audit_evidence' }, explanation: 'La evidencia de auditorías internas muestra el cumplimiento de sus propios estándares. Trampa: los certificados prueban una norma externa.' },
          { id: 'v5', prompt: 'El proveedor tiene estrechos vínculos de amistad con quien decide la compra.', answers: { va: 'personal' }, explanation: 'Conflicto de interés por relaciones personales. Trampa: los intereses financieros son otro tipo.' },
          { id: 'v6', prompt: 'Supervisa los riesgos de ciberseguridad y el cumplimiento, sin gestionar directamente a TI.', answers: { va: 'audit_committee' }, explanation: 'El comité de auditoría supervisa; no opera.' },
          { id: 'v7', prompt: 'Un organismo gubernamental revisa que la empresa cumpla las leyes.', answers: { va: 'regulatory_exam' }, explanation: 'Examen regulatorio. Trampa: una atestación la emite un auditor, no el regulador.' },
          { id: 'v8', prompt: 'Una firma de ciberseguridad externa examina a fondo las medidas y procedimientos de la empresa.', answers: { va: 'third_party_audit' }, explanation: 'Auditoría de terceros. Trampa: la atestación es la declaración que se emite, no el examen.' },
        ],
      },
      {
        id: 's2', title: 'Roles y concienciación', columns: [{ id: 'ra', label: 'Término', options: ROLES_AWARE }],
        rows: [
          { id: 'r1', prompt: 'Quien determina la clasificación de los datos y que se ajuste a las políticas.', answers: { ra: 'owner' }, explanation: 'El propietario de los datos. Trampa: el controller decide para qué se usan, no su clasificación.' },
          { id: 'r2', prompt: 'Scherazade decide por qué y cómo se recopilan los datos; Sahra ejecuta lo que ella le indica.', answers: { ra: 'controller_processor' }, explanation: 'Quien decide = controller; quien ejecuta por su cuenta = processor.' },
          { id: 'r3', prompt: 'María desarrolla y gestiona el programa de seguridad de la información y define sus políticas.', answers: { ra: 'security_officer' }, explanation: 'Oficial de seguridad. Trampa: no es un rol de tratamiento de datos.' },
          { id: 'r4', prompt: 'Taller sobre empleados malintencionados con acceso legítimo.', answers: { ra: 'insider' }, explanation: 'Amenaza interna. Trampa: reconocer comportamientos anómalos es un tema más general.' },
          { id: 'r5', prompt: 'David documenta la hora, el origen y el destino del tráfico extraño apenas lo detecta.', answers: { ra: 'initial_report' }, explanation: 'El primer reporte del hallazgo es el informe inicial. Trampa: el forense se hace después de investigar.' },
          { id: 'r6', prompt: 'Cada mes Sasha revisa los logs y resultados de las herramientas y los resume.', answers: { ra: 'periodic_report' }, explanation: 'Informe periódico.' },
          { id: 'r7', prompt: 'Los detalles del próximo lanzamiento solo se comparten con quien necesita saberlos, incluso dentro de la empresa.', answers: { ra: 'opsec' }, explanation: 'Seguridad operacional. Trampa: DLP es la herramienta técnica, no la práctica.' },
          { id: 'r8', prompt: 'Documento que se entrega el primer día con las buenas prácticas y procedimientos de seguridad.', answers: { ra: 'handbook' }, explanation: 'Manual de políticas.' },
        ],
      },
    ],
  },
};

export const REVIEW_PBQS: MatrixPbqDefinition[] = [PBQ78, PBQ79, PBQ80, PBQ81, PBQ82, PBQ83, PBQ84, PBQ85, PBQ86, PBQ87, PBQ88, PBQ89, PBQ90, PBQ91];
