/**
 * PBQ 60 — Linux file permissions: rwx triads, octal notation, chown, umask and the
 * SUID / SGID / sticky special bits (SY0-701 4.6 filesystem permissions, 2.5 hardening).
 */
import { EvaluationResult, LinuxPermissionsState, MatrixOption, PartialCreditItem, PBQItem } from '../types/pbq';
import { domainNameFor, formatObjective } from './sy0701Objectives';
import { toOctal, toSymbolic } from '../utils/linuxPermissions';

export const LINUX_PERMS_ITEM: PBQItem = {
  id: 'pbq-60',
  number: 60,
  category: 'linux-permissions',
  categoryTitle: 'Permisos de Archivos Linux',
  title: 'Permisos Linux: rwx, Notación Octal, chown, umask y Bits SUID/SGID/Sticky',
  estimatedMinutes: 7,
  domain: domainNameFor('4.6'),
  sy0701Objective: formatObjective('4.6', ['2.5']),
  scenario:
    'Un servidor Linux de producción falló la auditoría de mínimo privilegio: varios archivos y directorios tienen permisos excesivos o mal configurados. Como administrador de seguridad debes corregir el modo de cada ruta según el requisito de negocio, sin dar más acceso del necesario, y responder las preguntas del ticket sobre los comandos que usará el equipo de operaciones.',
  requirements: [
    'Ajusta los permisos de lectura (r), escritura (w) y ejecución (x) del dueño (u), grupo (g) y otros (o) de cada ruta.',
    'Activa o desactiva los bits especiales SUID, SGID y sticky solo cuando el requisito lo justifique.',
    'Responde las preguntas sobre chmod, chown, umask y búsqueda de binarios SUID.',
  ],
  tacticalTip:
    'r=4, w=2, x=1: suma por tríada (u, g, o). rwx=7, rw-=6, r-x=5, r--=4. En directorios: r = listar, w = crear/borrar, x = entrar (cd). Bits especiales como primer dígito: SUID=4 (se ejecuta como el dueño), SGID=2 (en directorios, los archivos nuevos heredan el grupo), sticky=1 (solo el dueño puede borrar sus archivos, como /tmp).',
};

export interface LinuxPermTarget {
  mode: number;
  why: string;
}

export const LINUX_PERM_TARGETS: Record<string, LinuxPermTarget> = {
  deploy: { mode: 0o750, why: 'Dueño rwx (7), grupo r-x (5), otros --- (0).' },
  dbconf: { mode: 0o600, why: 'Un archivo con secretos solo debe ser legible por su dueño. No necesita x: no es ejecutable.' },
  index: { mode: 0o644, why: 'Contenido público: dueño rw- (6), grupo y otros solo r-- (4). Nunca w para "otros" (666/777).' },
  projects: { mode: 0o2770, why: 'rwx para dueño y grupo, nada para otros (770) + SGID (2) para que los archivos nuevos hereden el grupo del directorio.' },
  uploads: { mode: 0o1777, why: 'Todos pueden crear (777) y el sticky bit (1) impide borrar archivos de otros usuarios. Es el modo de /tmp: drwxrwxrwt.' },
  ssh: { mode: 0o700, why: 'Solo el dueño entra al directorio. OpenSSH (StrictModes) rechaza claves si ~/.ssh es accesible por grupo u otros.' },
  backup: { mode: 0o755, why: 'Se elimina el SUID (4755 → 755): un binario SUID de root sin justificación es un vector clásico de escalada de privilegios.' },
};

export const INITIAL_LINUX_PERMS_PBQ60: LinuxPermissionsState = {
  files: [
    {
      id: 'deploy',
      path: '/opt/app/deploy.sh',
      isDirectory: false,
      owner: 'devops',
      group: 'devops',
      requirement: 'El dueño debe poder leer, modificar y ejecutar el script; el grupo devops solo leerlo y ejecutarlo; el resto de usuarios, ningún acceso.',
      mode: 0o777,
    },
    {
      id: 'dbconf',
      path: '/etc/app/db.conf',
      isDirectory: false,
      owner: 'app',
      group: 'app',
      requirement: 'Contiene la contraseña de la base de datos. Solo la cuenta de servicio dueña debe poder leerlo y modificarlo.',
      mode: 0o644,
    },
    {
      id: 'index',
      path: '/var/www/html/index.html',
      isDirectory: false,
      owner: 'www-data',
      group: 'www-data',
      requirement: 'Página pública: el dueño la edita; el grupo y el resto de usuarios solo pueden leerla.',
      mode: 0o666,
    },
    {
      id: 'projects',
      path: '/srv/proyectos',
      isDirectory: true,
      owner: 'root',
      group: 'ingenieria',
      requirement: 'Carpeta del equipo: dueño y miembros del grupo pueden entrar, listar, crear y borrar archivos; el resto no tiene acceso. Los archivos nuevos deben heredar automáticamente el grupo "ingenieria".',
      mode: 0o777,
    },
    {
      id: 'uploads',
      path: '/srv/uploads',
      isDirectory: true,
      owner: 'root',
      group: 'root',
      requirement: 'Cualquier usuario debe poder entrar y crear archivos aquí, pero nadie debe poder borrar ni renombrar los archivos de otro usuario.',
      mode: 0o777,
    },
    {
      id: 'ssh',
      path: '/home/ana/.ssh',
      isDirectory: true,
      owner: 'ana',
      group: 'ana',
      requirement: 'Directorio de claves SSH de ana: solo ella puede entrar, listar y crear archivos.',
      mode: 0o755,
    },
    {
      id: 'backup',
      path: '/usr/local/bin/backup',
      isDirectory: false,
      owner: 'root',
      group: 'root',
      requirement: 'Binario de respaldo: todos los usuarios deben poder ejecutarlo, solo root modificarlo, y no debe ejecutarse con los privilegios de su dueño.',
      mode: 0o4755,
    },
  ],
  answers: {},
};

export interface LinuxQuestion {
  id: string;
  prompt: string;
  evidence?: string;
  options: MatrixOption[];
  answer: string;
  explanation: string;
}

export const LINUX_QUESTIONS: LinuxQuestion[] = [
  {
    id: 'q_chmod',
    prompt: '¿Qué comando deja /opt/app/deploy.sh exactamente como -rwxr-x--- ?',
    options: [
      { value: 'chmod_750', label: 'chmod 750 /opt/app/deploy.sh' },
      { value: 'chmod_755', label: 'chmod 755 /opt/app/deploy.sh' },
      { value: 'chmod_570', label: 'chmod 570 /opt/app/deploy.sh' },
      { value: 'chmod_sym', label: 'chmod u+x,g+r /opt/app/deploy.sh' },
    ],
    answer: 'chmod_750',
    explanation: 'rwx=7, r-x=5, ---=0 → 750. "u+x,g+r" solo AGREGA bits: no quita los permisos que ya tuvieran grupo u otros.',
  },
  {
    id: 'q_chown',
    prompt: 'El contenido web debe pertenecer al usuario y al grupo www-data, incluyendo todos los archivos y subdirectorios. ¿Qué comando lo hace?',
    options: [
      { value: 'chown_r', label: 'chown -R www-data:www-data /var/www/html' },
      { value: 'chmod_r', label: 'chmod -R www-data /var/www/html' },
      { value: 'chgrp', label: 'chgrp www-data /var/www/html' },
      { value: 'chown_file', label: 'chown www-data /var/www/html/index.html' },
    ],
    answer: 'chown_r',
    explanation: 'chown cambia dueño:grupo y -R lo aplica recursivamente. chmod cambia permisos (no dueños) y chgrp solo cambia el grupo, sin -R no es recursivo.',
  },
  {
    id: 'q_symbolic',
    prompt: 'Debes quitar el permiso de escritura a "otros" en un archivo sin modificar ningún otro bit. ¿Qué comando usas?',
    options: [
      { value: 'o_minus_w', label: 'chmod o-w archivo' },
      { value: 'o_eq_w', label: 'chmod o=w archivo' },
      { value: 'oct_004', label: 'chmod 004 archivo' },
      { value: 'a_minus_w', label: 'chmod a-w archivo' },
    ],
    answer: 'o_minus_w',
    explanation: '"-" quita solo el bit indicado. "o=w" REEMPLAZA los permisos de otros por solo escritura, "004" reescribe todos los permisos y "a-w" quita la escritura también al dueño y al grupo.',
  },
  {
    id: 'q_umask',
    prompt: 'La cuenta de servicio tiene umask 027. ¿Con qué permisos se crea un archivo nuevo?',
    evidence: '$ umask\n0027\n$ touch informe.txt',
    options: [
      { value: 'p640', label: '640 (rw-r-----)' },
      { value: 'p750', label: '750 (rwxr-x---)' },
      { value: 'p027', label: '027 (----w-rwx)' },
      { value: 'p644', label: '644 (rw-r--r--)' },
    ],
    answer: 'p640',
    explanation: 'Los archivos parten de 666 y los directorios de 777; umask QUITA bits. 666 − 027 → 640 (un directorio nuevo quedaría 750). Los archivos nunca reciben x por defecto.',
  },
  {
    id: 'q_find_suid',
    prompt: 'Para la auditoría debes listar todos los binarios con SUID del sistema. ¿Qué comando usas?',
    options: [
      { value: 'find_4000', label: 'find / -perm -4000 -type f 2>/dev/null' },
      { value: 'find_777', label: 'find / -perm 777 -type f' },
      { value: 'ls_grep', label: 'ls -l /usr/bin | grep x' },
      { value: 'chmod_us', label: 'chmod -R u-s /' },
    ],
    answer: 'find_4000',
    explanation: '-perm -4000 encuentra archivos con el bit SUID activo (también -perm -u=s). chmod -R u-s / no audita: quitaría SUID a binarios que lo necesitan (passwd, sudo) y rompería el sistema.',
  },
];

const FILE_POINTS = 10;
const QUESTION_POINTS = 6;

export function evaluateLinuxPermissionsPBQ60(state: LinuxPermissionsState): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];

  for (const file of state.files) {
    const target = LINUX_PERM_TARGETS[file.id];
    const ok = (file.mode & 0o7777) === target.mode;
    const expected = `${toSymbolic(target.mode, file.isDirectory)} (${toOctal(target.mode)})`;
    breakdown.push({
      id: `perm-${file.id}`,
      label: `${file.path} → ${expected}`,
      achieved: ok,
      points: ok ? FILE_POINTS : 0,
      maxPoints: FILE_POINTS,
      explanation: ok
        ? `Correcto: ${target.why}`
        : `Configuraste ${toSymbolic(file.mode, file.isDirectory)} (${toOctal(file.mode)}); lo correcto es ${expected}. ${target.why}`,
    });
  }

  for (const q of LINUX_QUESTIONS) {
    const ok = state.answers[q.id] === q.answer;
    const correctLabel = q.options.find((o) => o.value === q.answer)!.label;
    breakdown.push({
      id: q.id,
      label: q.prompt,
      achieved: ok,
      points: ok ? QUESTION_POINTS : 0,
      maxPoints: QUESTION_POINTS,
      explanation: ok ? `Correcto: ${q.explanation}` : `Respuesta correcta: ${correctLabel}. ${q.explanation}`,
    });
  }

  const totalScore = breakdown.reduce((acc, b) => acc + b.points, 0);
  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? 'Permisos perfectos: aplicaste mínimo privilegio con notación octal y bits especiales correctos.'
        : `Puntuación: ${totalScore}/100. Repasa la suma r=4/w=2/x=1 por tríada y cuándo se justifican SUID, SGID y sticky.`,
    sy0701Objective: '',
    domainName: '',
  };
}
