import React from 'react';
import {
  BookOpen,
  X,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  FileSearch,
  Key,
  Shield,
  Layers,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pbqTitle?: string;
  pbqTacticalTip?: string;
}

export const CyberKraftModal: React.FC<Props> = ({
  isOpen,
  onClose,
  pbqTitle,
  pbqTacticalTip,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                CyberKraft Test Strategy Guide (Metodología Táctica CompTIA)
              </h3>
              <p className="text-xs text-slate-400">
                Estrategias comprobadas para abordar y maximizar puntos en PBQs del SY0-701
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
          {/* Current Question Context Tip */}
          {pbqTacticalTip && (
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Consejo Clave para esta PBQ ({pbqTitle})</span>
              </div>
              <p className="text-xs text-cyan-100 leading-relaxed font-sans">
                {pbqTacticalTip}
              </p>
            </div>
          )}

          {/* Core Pillar 1: Time Management */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>1. La Regla de los 3 Minutos (Gestión del Tiempo en el Examen)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              En el examen real de CompTIA Security+ (SY0-701), las PBQs aparecen siempre al principio (Preguntas 1 a 5). Muchos aspirantes se bloquean y gastan 30 minutos aquí.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="font-semibold text-amber-300">
                Estrategia CyberKraft:
              </div>
              <p className="text-slate-300">
                Si no tienes clara la solución de una PBQ en menos de <strong>3 minutos</strong>, márcala de inmediato con <em>"Flag for Review"</em> y salta directo a las preguntas de opción múltiple (MCQs). Resuelve todas las preguntas teóricas primero y vuelve a las PBQs al final con el tiempo restante.
              </p>
            </div>
          </div>

          {/* Core Pillar 2: Reverse Reading */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <FileSearch className="w-4 h-4 text-sky-400" />
              <span>2. Metodología de Lectura Inversa (Reverse Engineering)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No empieces leyendo párrafos densos de contexto en el escenario. Haz ingeniería inversa:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-cyan-400 block mb-1">Paso A</span>
                Abre los menús desplegables o mira las ranuras interactivas. Esto te revela de antemano qué tecnologías busca el examen.
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-cyan-400 block mb-1">Paso B</span>
                Lee los requerimientos numerados o la pregunta final antes del texto de introducción.
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-cyan-400 block mb-1">Paso C</span>
                Regresa al escenario buscando únicamente las palabras clave que diferencian las opciones.
              </div>
            </div>
          </div>

          {/* Core Pillar 3: High-Yield Traps */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>3. Matriz de Conceptos Trampa en CompTIA SY0-701</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-semibold text-rose-300">WAF vs IPS Tradicional:</span>
                <p className="text-slate-400">
                  El WAF inspecciona Capa 7 (HTTP/HTTPS) contra SQLi y XSS. El IPS es de Capa 3/4/7 general de red. No confundas sus posiciones en la DMZ.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-semibold text-rose-300">Least Privilege vs Full Control:</span>
                <p className="text-slate-400">
                  Si un usuario necesita editar documentos, dale permiso de <em>Modify / Write</em>. Otorgar <em>Full Control</em> otorga permisos para cambiar la propiedad y es calificado como error en CompTIA.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-semibold text-rose-300">Cifrado Obsoleto Prohibido:</span>
                <p className="text-slate-400">
                  DES, 3DES, RC4, MD5, SHA-1, WEP, SSLv3 y TLS 1.0 están desaprobados. Siempre selecciona AES-256 (GCM), SHA-256/512 y TLS 1.3.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-semibold text-rose-300">Orden de Volatilidad (Forense):</span>
                <p className="text-slate-400">
                  Al contener un ataque, aísla la red pero <strong>NUNCA apagues de golpe el servidor</strong>, ya que destruirías la memoria RAM volátil.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 md:col-span-2">
                <span className="font-semibold text-amber-300">Puertos Inseguros vs Sustitutos Oficiales CompTIA:</span>
                <p className="text-slate-400">
                  CompTIA penaliza el uso de protocolos en texto claro: Telnet (23) → <strong>SSH (22)</strong>; HTTP (80) → <strong>HTTPS (443)</strong>; LDAP (389) → <strong>LDAPS (636)</strong>; FTP (20/21) → <strong>SFTP (22) / FTPS (989/990)</strong>; SNMPv1/v2c (161) → <strong>SNMPv3 (161 authPriv)</strong>; Syslog UDP (514) → <strong>Syslog TLS TCP (6514)</strong>; DNS (53) → <strong>DoT (853) / DoH (443)</strong>; RDP (3389) → <strong>detrás de VPN + MFA y NLA</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors"
          >
            Entendido, Continuar con la PBQ
          </button>
        </div>
      </div>
    </div>
  );
};
