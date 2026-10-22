import React from 'react';
import {
  Server,
  Shield,
  Lock,
  Code,
  RotateCcw,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { WebServerHardeningState } from '../../types/pbq';
import { useHints } from '../../context/HintsContext';
import { shuffled } from '../../utils/shuffle';

interface WebServerHardeningPBQProps {
  state: WebServerHardeningState;
  onChange: (state: WebServerHardeningState) => void;
  onReset: () => void;
}

export const WebServerHardeningPBQ: React.FC<WebServerHardeningPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const hints = useHints();
  const updateField = (field: keyof WebServerHardeningState, value: string) => {
    onChange({ ...state, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                CompTIA Security+ • Seguridad de Aplicaciones Web
              </span>
              <span className="text-slate-400 text-xs">Hardening NGINX / Apache & Cabeceras HTTP</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-rose-400" />
              Hardening de Servidor Web y Cabeceras de Seguridad HTTP
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              Un informe de escaneo DAST y auditoría web reportó vulnerabilidades críticas de degradación SSL (SSL Stripping), inyección Cross-Site Scripting (XSS), secuestro de clics (Clickjacking) y suites de cifrado legadas obsoletas.
              Configura las directivas de cabeceras HTTP y la versión de TLS para blindar el servidor.
            </p>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-xs font-semibold transition self-start md:self-center"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* 4 Interactive Header Hardening Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: HSTS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-950/80 border border-rose-800/80 rounded-lg text-rose-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">Cabecera 1: Prevención SSL Stripping</div>
              <h4 className="text-base font-bold text-white">HTTP Strict Transport Security (HSTS)</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ¿Cuál directiva HSTS debe inyectar el servidor web en todas las respuestas para forzar conexiones HTTPS irreversibles en navegadores?
          </p>

          <div className="space-y-2">
            {shuffled([
              { id: 'hsts_max_age_includesubdomains_preload', label: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload', desc: 'Obliga a HTTPS durante 1 año, cubre todos los subdominios y califica para la lista de precarga global de navegadores.' },
              { id: 'hsts_short_no_sub', label: 'Strict-Transport-Security: max-age=300', desc: 'Duración de solo 5 minutos sin subdominios; deja desprotegidos dominios hijos.' },
              { id: 'hsts_disabled', label: 'Sin cabecera HSTS (permitir degradación a HTTP puerto 80)', desc: 'Permite a un atacante ejecutar sslstrip y capturar credenciales en texto claro.' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateField('hstsHeaderConfig', opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  state.hstsHeaderConfig === opt.id
                    ? 'bg-rose-950/80 border-rose-500 ring-1 ring-rose-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="text-xs font-bold font-mono text-rose-300">{opt.label}</div>
                {hints && <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Module 2: CSP */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-950/80 border border-amber-800/80 rounded-lg text-amber-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Cabecera 2: Prevención de XSS</div>
              <h4 className="text-base font-bold text-white">Content Security Policy (CSP)</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ¿Qué configuración de Content-Security-Policy mitiga eficazmente la inyección y ejecución de scripts maliciosos (XSS) externos e inline?
          </p>

          <div className="space-y-2">
            {shuffled([
              { id: 'csp_default_src_self_nonce', label: "Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-rAnd0m';", desc: 'Solo permite scripts del mismo origen o que posean un nonce criptográfico único generado por el servidor.' },
              { id: 'csp_unsafe_eval', label: "Content-Security-Policy: default-src * 'unsafe-inline' 'unsafe-eval';", desc: 'Insegura: permite ejecución de cualquier script arbitrario en el DOM.' },
              { id: 'csp_none', label: 'Sin política CSP', desc: 'Permite cargar JavaScript desde dominios externos de atacantes sin restricción.' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateField('cspHeaderConfig', opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  state.cspHeaderConfig === opt.id
                    ? 'bg-amber-950/80 border-amber-500 ring-1 ring-amber-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="text-xs font-bold font-mono text-amber-300">{opt.label}</div>
                {hints && <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Module 3: X-Frame-Options */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-950/80 border border-purple-800/80 rounded-lg text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Cabecera 3: Prevención de Clickjacking</div>
              <h4 className="text-base font-bold text-white">X-Frame-Options / Frame Ancestors</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ¿Cómo evitar que un atacante cargue el portal bancario dentro de un <code className="text-purple-300">&lt;iframe&gt;</code> transparente para secuestrar clics del usuario?
          </p>

          <div className="space-y-2">
            {shuffled([
              { id: 'x_frame_options_deny', label: 'X-Frame-Options: DENY (o frame-ancestors: none)', desc: 'Prohíbe totalmente que la página sea renderizada dentro de cualquier iframe, sin importar el origen.' },
              { id: 'x_frame_allow_all', label: 'X-Frame-Options: ALLOW-FROM *', desc: 'Permite a cualquier sitio malicioso superponer botones invisibles sobre la aplicación corporativa.' },
              { id: 'x_frame_missing', label: 'No enviar cabecera de control de frames', desc: 'Deja la aplicación completamente expuesta a ataques de UI Redressing / Clickjacking.' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateField('frameOptionsConfig', opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  state.frameOptionsConfig === opt.id
                    ? 'bg-purple-950/80 border-purple-500 ring-1 ring-purple-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="text-xs font-bold font-mono text-purple-300">{opt.label}</div>
                {hints && <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Module 4: TLS Configuration */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950/80 border border-cyan-800/80 rounded-lg text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Protocolo de Red: Cifrado en Tránsito</div>
              <h4 className="text-base font-bold text-white">Versión de Protocolo Criptográfico</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ¿Qué versión y conjunto de suites criptográficas debe aplicarse en el servidor web para garantizar Perfect Forward Secrecy (PFS) y eliminar vulnerabilidades históricas?
          </p>

          <div className="space-y-2">
            {shuffled([
              { id: 'tls_1_3_only', label: 'TLS 1.3 Exclusivo (Suites AEAD con ECDHE obligatorias)', desc: 'Elimina algoritmos inseguros (RC4, 3DES, CBC) y handshake de 1-RTT con secreto perfecto hacia adelante (PFS).' },
              { id: 'tls_1_0_compatible', label: 'Permitir TLS 1.0, 1.1 y SSLv3 por compatibilidad', desc: 'Vulnerable a ataques POODLE, BEAST y degradación de cifrado.' },
              { id: 'clear_http_only', label: 'HTTP sin cifrar (puerto 80)', desc: 'Totalmente inseguro para cualquier entorno de producción moderno.' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateField('tlsProtocolVersion', opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  state.tlsProtocolVersion === opt.id
                    ? 'bg-cyan-950/80 border-cyan-500 ring-1 ring-cyan-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="text-xs font-bold font-mono text-cyan-300">{opt.label}</div>
                {hints && <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
