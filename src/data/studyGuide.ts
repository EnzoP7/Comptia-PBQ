/**
 * Study guide per PBQ: overview, key takeaways and a concept glossary whose entries are
 * linked to the exact breakdown criteria they explain, so the review never shows the
 * definition of an unrelated concept.
 */
import { ItemExplanation, PBQExplanationData, PBQItem } from '../types/pbq';
import { PBQ_EXPLANATIONS } from './pbqExplanations';
import { PBQ_EXPLANATIONS_EXTRA } from './pbqExplanationsExtra';
import { MATRIX_PBQS } from './matrixPbqs';
import { TERMINAL_PBQS } from './terminalPbqs';

/** Criteria linked to each item of the original glossaries, by item index. */
const CRITERIA_BY_INDEX: Record<string, string[][]> = {
  'pbq-31': [['port-telnet'], ['port-telnet', 'port-ftp'], ['port-http'], ['port-http', 'port-dns'], ['port-ldap'], ['port-ldap'], ['port-snmp'], ['port-syslog'], ['port-rdp'], ['port-dns']],
  'pbq-32': [['nmap-flag'], ['nmap-21'], ['nmap-445'], ['nmap-3389']],
  'pbq-33': [['dns-sec'], ['dns-sec'], ['dns-sec'], ['dns-enc'], ['dns-axfr']],
  'pbq-34': [['zta-pdp'], ['zta-pep'], ['zta-micro'], ['zta-eval']],
  'pbq-35': [['web-hsts'], ['web-csp'], ['web-frame'], ['web-tls']],
  'pbq-36': [['p1'], ['p2'], ['p3'], ['p4'], ['p5'], ['p6']],
  'pbq-37': [['pki-revoc'], ['pki-pfx'], ['pki-pem'], ['pki-san'], ['pki-escrow']],
  'pbq-38': [['wifi-wpa'], ['wifi-eap'], ['wifi-rad'], ['wifi-sae'], ['wifi-wips']],
  'pbq-39': [['bucket-web-assets'], ['bucket-cardholder'], ['bucket-hr-payroll'], ['cloud-casb'], ['cloud-kms']],
  'pbq-40': [['case-spear-cfo'], ['case-vishing-helpdesk'], ['case-usb-baiting'], ['case-pretexting-vendor'], ['case-watering-hole']],
  'pbq-41': [['physical_datacenter'], ['hypervisor_network'], ['os_patching'], ['network_controls'], ['application_code'], ['data_and_iam']],
  'pbq-42': [['case-kerberoasting'], ['case-lsass-dumping'], ['case-llmnr-poisoning'], ['case-golden-ticket'], ['case-powershell-fileless']],
  'pbq-43': [['gov-role-owner'], ['gov-role-custodian'], ['gov-role-steward'], ['gov-role-dpo'], ['gov-state-use'], ['gov-sanit-purging'], ['gov-sanit-crypto']],
  'pbq-44': [['pet-pci-dss'], ['pet-dev-qa'], ['pet-call-center'], ['pet-epidemiology'], ['pet-clinical-trials']],
  'pbq-45': [['mw-ransomware'], ['mw-rat'], ['mw-rootkit'], ['mw-spyware-keylogger'], ['mw-fileless-lotl']],
  'pbq-46': [['mw-worm'], ['mw-botnet'], ['mw-logic-bomb'], ['mw-cryptominer'], ['mw-polymorphic']],
  'pbq-47': [['api-bola-user-profile'], ['api-ssrf-metadata'], ['api-jwt-alg-none'], ['api-sqli-rest'], ['api-rate-limiting-stuffing']],
  'pbq-48': [['soar-impossible-travel'], ['soar-ransomware-mass-io'], ['soar-phishing-macro-shell'], ['soar-ssh-brute-burst'], ['soar-domain-admin-offhours']],
  'pbq-49': [['fw49-order', 'traffic-*'], ['fw49-dmz-lan'], ['fw49-db'], ['fw49-order']],
  'pbq-50': [['port50-network-monitoring'], ['port50-identity-directory'], ['port50-corporate-dns'], ['port50-remote-desktop']],
};

/** Concepts added to the original glossaries for criteria they did not cover. */
const SUPPLEMENTS: Record<string, ItemExplanation[]> = {
  'pbq-32': [
    { name: 'Puerto 23: Telnet', badge: 'Texto claro', definition: 'Administración remota sin cifrado: usuario, contraseña y comandos viajan legibles.', whyCorrectOrRole: 'Se deshabilita y se reemplaza por SSH (TCP 22).', distractorWarning: 'Restringir Telnet por IP reduce la exposición, pero las credenciales siguen viajando en claro.', criteria: ['nmap-23'] },
  ],
  'pbq-33': [
    { name: 'Recursión abierta y amplificación', badge: 'DDoS', definition: 'Un resolver que responde consultas recursivas de cualquier IP puede usarse para reflejar respuestas grandes contra una víctima con la IP falsificada.', whyCorrectOrRole: 'La recursión se limita a los clientes internos.', distractorWarning: 'El rate limiting reduce el abuso, pero no elimina la causa: el resolver sigue abierto a Internet.', criteria: ['dns-recur'] },
  ],
  'pbq-36': [
    { name: 'Orden de volatilidad en un equipo encendido', badge: 'RFC 3227', definition: 'La memoria RAM se pierde al apagar el equipo; el disco no.', whyCorrectOrRole: 'Primero se vuelca la RAM (procesos, conexiones, claves de cifrado) y después se adquiere el disco.', distractorWarning: 'Desenchufar el equipo para clonar el disco destruye la evidencia volátil y puede dejar el disco cifrado inaccesible.', criteria: ['p-vol'] },
    { name: 'Best Evidence Rule', badge: 'Admisibilidad', definition: 'Regla legal que prefiere el original; una copia es admisible si se demuestra que es idéntica.', whyCorrectOrRole: 'Una imagen bit a bit con hash coincidente cumple esa exigencia.', distractorWarning: 'La exclusionary rule excluye evidencia obtenida ilegalmente; hearsay es testimonio de oídas: ninguna valida una copia.', criteria: ['p-adm'] },
  ],
  'pbq-39': [
    { name: 'Secretos de DevOps (API keys, claves privadas)', badge: 'DLP secretos', definition: 'Tokens de nube, claves privadas y credenciales en repositorios o buckets de configuración.', whyCorrectOrRole: 'Se clasifican como confidenciales y se usa un patrón DLP de secretos (formato de claves AWS/GitHub, bloques PRIVATE KEY).', criteria: ['bucket-dev-api'] },
  ],
  'pbq-43': [
    { name: 'Datos en tránsito', badge: 'TLS / IPsec', definition: 'Datos que viajan por una red.', whyCorrectOrRole: 'Se protegen con TLS 1.3 o túneles IPsec.', distractorWarning: 'TLS 1.0 y SSL 3.0 tienen vulnerabilidades conocidas; WPA2-TKIP solo protege el enlace inalámbrico.', criteria: ['gov-state-transit'] },
    { name: 'Datos en reposo', badge: 'AES-256', definition: 'Datos almacenados en discos, bases de datos o backups.', whyCorrectOrRole: 'Se cifran con AES-256 (BitLocker, LUKS, TDE).', distractorWarning: 'Los permisos NTFS no protegen un disco extraído y conectado en otro equipo; Base64 no es cifrado.', criteria: ['gov-state-rest'] },
    { name: 'Clearing (NIST SP 800-88)', badge: 'Sanitización', definition: 'Sobrescritura lógica que protege contra recuperación con herramientas normales.', whyCorrectOrRole: 'Adecuado para reutilizar el medio dentro de la organización.', distractorWarning: 'Un formateo rápido o la papelera solo borran referencias: los datos siguen recuperables.', criteria: ['gov-sanit-clearing'] },
    { name: 'Destrucción física', badge: 'Sanitización', definition: 'Trituración, desintegración o incineración del medio.', whyCorrectOrRole: 'Para SSD/NVMe al final de su vida útil, cuando el medio no se reutilizará.', distractorWarning: 'El degaussing no sirve en SSD: la memoria flash no es magnética.', criteria: ['gov-sanit-destruction'] },
  ],
  'pbq-49': [
    { name: 'Publicar servicios de la DMZ', badge: 'Inbound', definition: 'Las reglas de entrada apuntan a la IP exacta del servidor y al puerto exacto del servicio.', whyCorrectOrRole: 'HTTPS (443) hacia 172.16.10.10 y SMTPS (465) hacia 172.16.10.20.', distractorWarning: 'POP3 (110) es para que los clientes descarguen correo, no para recibir correo de otros servidores.', criteria: ['fw49-https', 'fw49-mail'] },
    { name: 'Salida web de la LAN', badge: 'Outbound', definition: 'Los usuarios internos necesitan navegar, pero solo por los puertos requeridos.', whyCorrectOrRole: 'Se permite TCP 443 desde 10.0.20.0/24 hacia Internet.', distractorWarning: 'Permitir HTTP (80) en lugar de HTTPS no cumple el requisito de navegación segura.', criteria: ['fw49-lan-web'] },
    { name: 'Aislamiento de la zona PCI-DSS', badge: 'Segmentación', definition: 'El entorno con datos de tarjetas debe estar segmentado y no ser accesible desde Internet.', whyCorrectOrRole: 'Una regla DENY explícita bloquea WAN → 10.0.30.0/24.', criteria: ['fw49-wan-db'] },
  ],
  'pbq-50': [
    { name: 'Administración de equipos de red', badge: 'SSH / HTTPS', definition: 'Routers y switches se administran por CLI o interfaz web.', whyCorrectOrRole: 'Telnet → SSH (22) y HTTP → HTTPS (443); se deshabilita Telnet en las líneas VTY.', criteria: ['port50-core-switch'] },
    { name: 'Transferencia de archivos financieros', badge: 'SFTP', definition: 'FTP y TFTP transfieren credenciales y archivos sin cifrar (TFTP ni siquiera autentica).', whyCorrectOrRole: 'Se migra a SFTP (TCP 22) con autenticación por clave.', distractorWarning: 'FTPS también cifra, pero usa otros puertos (990) y no se basa en SSH.', criteria: ['port50-financial-ftp'] },
  ],
};

const LINUX_GUIDE: PBQExplanationData = {
  pbqId: 'pbq-60',
  overviewRationale:
    'Cada archivo tiene tres tríadas de permisos (dueño, grupo, otros) con lectura, escritura y ejecución, más tres bits especiales. Aplicar mínimo privilegio en Linux es elegir, para cada ruta, la combinación más restrictiva que todavía permite el trabajo descrito.',
  keyTakeaways: [
    'r = 4, w = 2, x = 1. Se suman por tríada: rwx = 7, rw- = 6, r-x = 5, r-- = 4.',
    'En directorios: r = listar, w = crear/borrar/renombrar, x = entrar (cd). Sin x no se puede acceder aunque haya r.',
    'Bits especiales (primer dígito): SUID 4, SGID 2, sticky 1. Ejemplos: 4755 (passwd), 2770 (carpeta de equipo), 1777 (/tmp).',
    'umask resta permisos a los valores base (666 en archivos, 777 en directorios).',
    'chmod cambia permisos; chown cambia dueño:grupo; -R aplica recursivamente.',
  ],
  itemsGlossary: [
    { name: 'Notación octal y simbólica', badge: 'chmod', definition: 'El modo -rwxr-x--- equivale a 750: dueño 7 (rwx), grupo 5 (r-x), otros 0 (---).', whyCorrectOrRole: 'Convertir cada tríada sumando 4/2/1 permite verificar cualquier permiso pedido.', distractorWarning: 'Cuidado con el orden de las tríadas: 570 no es lo mismo que 750.', criteria: ['perm-deploy', 'perm-index', 'q_chmod'] },
    { name: 'Archivos con secretos (600)', badge: 'Least privilege', definition: 'Los archivos con contraseñas o claves solo deben ser legibles y modificables por su dueño.', whyCorrectOrRole: 'db.conf queda en 600 (rw-------).', distractorWarning: '644 es el valor por defecto de muchos archivos y deja el secreto legible para todos los usuarios.', criteria: ['perm-dbconf'] },
    { name: 'Directorio privado (700)', badge: 'SSH', definition: 'Solo el dueño puede entrar, listar y crear archivos.', whyCorrectOrRole: 'OpenSSH rechaza las claves si ~/.ssh es accesible por grupo u otros.', criteria: ['perm-ssh'] },
    { name: 'SGID en directorios', badge: '2xxx', definition: 'Los archivos creados dentro del directorio heredan su grupo, en vez del grupo principal de quien los crea.', whyCorrectOrRole: 'Una carpeta de equipo usa 2770 para que todo lo que crean sus miembros siga perteneciendo al grupo.', criteria: ['perm-projects'] },
    { name: 'Sticky bit', badge: '1xxx', definition: 'En un directorio con escritura para todos, solo el dueño de cada archivo (o root) puede borrarlo o renombrarlo.', whyCorrectOrRole: '1777 permite que todos suban archivos sin poder borrar los de otros (como /tmp: drwxrwxrwt).', criteria: ['perm-uploads'] },
    { name: 'SUID', badge: '4xxx', definition: 'El programa se ejecuta con los privilegios de su dueño, no de quien lo lanza. En el listado aparece como "s" en la tríada del dueño.', whyCorrectOrRole: 'Un binario SUID de root sin justificación permite escalar privilegios: se elimina el bit (4755 → 755).', distractorWarning: 'Una "S" mayúscula indica SUID activo sin permiso de ejecución: es una configuración rota.', criteria: ['perm-backup', 'q_find_suid'] },
    { name: 'chown / chgrp', badge: 'Propiedad', definition: 'chown usuario:grupo cambia dueño y grupo; chgrp solo el grupo. -R aplica recursivamente.', whyCorrectOrRole: 'chown -R www-data:www-data /var/www/html asigna todo el contenido web al usuario del servidor.', criteria: ['q_chown'] },
    { name: 'Modo simbólico (+, -, =)', badge: 'chmod', definition: '+ agrega bits, - los quita y = reemplaza la tríada completa. u/g/o/a indican a quién se aplica.', whyCorrectOrRole: 'chmod o-w quita solo la escritura a otros sin tocar el resto.', criteria: ['q_symbolic'] },
    { name: 'umask', badge: 'Valores por defecto', definition: 'Máscara que se resta a los permisos base al crear archivos (666) o directorios (777).', whyCorrectOrRole: 'umask 027 → archivos 640 y directorios 750.', criteria: ['q_umask'] },
  ],
};

function matrixGuide(pbqId: string): PBQExplanationData | null {
  const def = MATRIX_PBQS.find((m) => m.config.pbqId === pbqId);
  if (!def) return null;
  const items: ItemExplanation[] = [];
  for (const section of def.config.sections) {
    for (const col of section.columns) {
      for (const opt of col.options) {
        const rows = section.rows.filter((r) => r.answers[col.id] === opt.value);
        if (!rows.length) continue;
        items.push({
          name: opt.label,
          badge: section.title,
          definition: rows[0].explanation,
          whyCorrectOrRole: `En este escenario: ${rows.map((r) => `"${r.prompt}"`).join(' · ')}`,
          criteria: rows.map((r) => r.id),
        });
      }
    }
  }
  return { pbqId, overviewRationale: def.item.tacticalTip, keyTakeaways: [], itemsGlossary: items };
}

export function getStudyGuide(pbq: PBQItem): PBQExplanationData {
  if (PBQ_EXPLANATIONS_EXTRA[pbq.id]) return PBQ_EXPLANATIONS_EXTRA[pbq.id];
  if (pbq.id === 'pbq-60') return LINUX_GUIDE;
  const terminal = TERMINAL_PBQS.find((t) => t.item.id === pbq.id);
  if (terminal) return terminal.guide;
  const matrix = matrixGuide(pbq.id);
  if (matrix) return matrix;
  const base = PBQ_EXPLANATIONS[pbq.id];
  if (base) {
    const links = CRITERIA_BY_INDEX[pbq.id] ?? [];
    return {
      ...base,
      itemsGlossary: [...base.itemsGlossary.map((g, i) => ({ ...g, criteria: g.criteria ?? links[i] })), ...(SUPPLEMENTS[pbq.id] ?? [])],
    };
  }
  return { pbqId: pbq.id, overviewRationale: pbq.tacticalTip, keyTakeaways: [], itemsGlossary: [] };
}

/** Concepts linked to a breakdown criterion (exact id, or a "prefix*" link). */
export function conceptsFor(guide: PBQExplanationData, criterionId: string): ItemExplanation[] {
  return guide.itemsGlossary.filter((g) =>
    (g.criteria ?? []).some((c) => (c.endsWith('*') ? criterionId.startsWith(c.slice(0, -1)) : c === criterionId))
  );
}
