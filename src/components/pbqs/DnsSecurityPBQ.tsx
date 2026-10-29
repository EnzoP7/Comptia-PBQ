import React from 'react';
import {
  Globe,
  ShieldCheck,
  Lock,
  RotateCcw,
  Server,
  Zap,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { DnsSecurityState } from '../../types/pbq';
import { useHints } from '../../context/HintsContext';
import { shuffled } from '../../utils/shuffle';

interface DnsSecurityPBQProps {
  state: DnsSecurityState;
  onChange: (state: DnsSecurityState) => void;
  onReset: () => void;
}

export const DnsSecurityPBQ: React.FC<DnsSecurityPBQProps> = ({
  state,
  onChange,
  onReset,
}) => {
  const hints = useHints();
  const updateField = (field: keyof DnsSecurityState, value: string) => {
    onChange({ ...state, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                CompTIA Security+ • Infraestructura DNS Segura
              </span>
              <span className="text-slate-400 text-xs">Resolución Cifrada y DNSSEC</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Hardening de Infraestructura DNS, DNSSEC y Puertos Seguros
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              Un atacante intentó envenenar la memoria caché DNS (DNS Poisoning) del resolver corporativo e intentó descargar la zona completa mediante una transferencia no autorizada.
              Configura los controles criptográficos y de red para asegurar la resolución de nombres de la organización.
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

      {/* 4 Cards Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: DNSSEC Signature Record */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950/80 border border-cyan-800/80 rounded-lg text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Control 1: Integridad Criptográfica</div>
              <h4 className="text-base font-bold text-white">Registro de Firma DNSSEC</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ¿Qué tipo de registro DNSSEC contiene la firma digital criptográfica de los Resource Records para que los resolvers validen que la respuesta no fue alterada en tránsito?
          </p>

          <div className="space-y-2">
            {shuffled([
              { id: 'RRSIG', label: 'RRSIG (Resource Record Signature)', desc: 'Contiene la firma digital del conjunto de registros (RRset) firmada con la Zone-Signing Key (ZSK).' },
              { id: 'DNSKEY', label: 'DNSKEY (Public Key Record)', desc: 'Almacena las claves públicas (ZSK y KSK) utilizadas para verificar las firmas.' },
              { id: 'DS', label: 'DS (Delegation Signer)', desc: 'Hash de la KSK ubicado en la zona padre para establecer la cadena de confianza.' },
              { id: 'NSEC', label: 'NSEC / NSEC3', desc: 'Demuestra criptográficamente la no existencia de un nombre de dominio consultado.' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateField('dnssecRecordType', opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  state.dnssecRecordType === opt.id
                    ? 'bg-cyan-950/80 border-cyan-500 ring-1 ring-cyan-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="text-xs font-bold text-cyan-300">{opt.label}</div>
                {hints && <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Module 2: DNS Encryption Protocol & Port */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-950/80 border border-indigo-800/80 rounded-lg text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Control 2: Cifrado de Consultas</div>
              <h4 className="text-base font-bold text-white">Protocolo y Puerto de DNS Cifrado</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ¿Cuál es el estándar dedicado de red IETF recomendado para cifrar todas las consultas del resolver corporativo sobre un puerto dedicado específico?
          </p>

          <div className="space-y-2">
            {shuffled([
              { id: 'DoT_853', label: 'DNS over TLS (DoT) en Puerto TCP 853', desc: 'Encapsula DNS en una sesión TLS dedicada en el puerto 853; optimizado para infraestructura y resolvers de red.' },
              { id: 'DoH_443', label: 'DNS over HTTPS (DoH) en Puerto TCP 443', desc: 'Oculta consultas DNS dentro de tráfico web HTTPS en el puerto 443 (usado principalmente por navegadores).' },
              { id: 'DNS_53_Clear', label: 'DNS Tradicional en Puerto UDP/TCP 53', desc: 'Tráfico en texto plano sin cifrar, vulnerable a espionaje en la ruta del ISP.' },
              { id: 'DNS_VPN', label: 'DNS a través de GRE no cifrado', desc: 'Túnel sin encriptación que no protege la confidencialidad de los paquetes.' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateField('dnsEncryptionStandard', opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  state.dnsEncryptionStandard === opt.id
                    ? 'bg-indigo-950/80 border-indigo-500 ring-1 ring-indigo-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="text-xs font-bold text-indigo-300">{opt.label}</div>
                {hints && <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Module 3: Zone Transfer AXFR */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-950/80 border border-amber-800/80 rounded-lg text-amber-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Control 3: Fuga de Mapa de Red</div>
              <h4 className="text-base font-bold text-white">Transferencias de Zona (AXFR)</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Los atacantes usan comandos como <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded">dig axfr @dns.corp.com</code> para volcar todos los subdominios. ¿Cómo mitigar este riesgo?
          </p>

          <div className="space-y-2">
            {shuffled([
              { id: 'restrict_tcp_53_authorized_secondaries', label: 'Restringir AXFR (TCP 53) solo a IPs de secundarios autorizados', desc: 'Configurar ACL en named.conf / Windows DNS limitando transferencias a IPs conocidas de Nameservers autorizados.' },
              { id: 'allow_any_tcp_53', label: 'Permitir transferencias desde cualquier IP de Internet', desc: 'Permite a cualquier atacante listar todos los servidores y servicios internos.' },
              { id: 'disable_tcp_completely', label: 'Bloquear todo el tráfico TCP en puerto 53', desc: 'Rompe respuestas DNS mayores a 512 bytes y la sincronización legítima entre servidores.' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateField('zoneTransferRestriction', opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  state.zoneTransferRestriction === opt.id
                    ? 'bg-amber-950/80 border-amber-500 ring-1 ring-amber-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="text-xs font-bold text-amber-300">{opt.label}</div>
                {hints && <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Module 4: Open Recursion Mitigation */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-950/80 border border-rose-800/80 rounded-lg text-rose-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">Control 4: Mitigación DDoS Amplificación</div>
              <h4 className="text-base font-bold text-white">Configuración de Recursión de Servidor</h4>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Un servidor con recursión abierta resuelve dominios de Internet para cualquier cliente del mundo, permitiendo ataques de amplificación DNS hacia terceras víctimas. ¿Qué directiva aplicar?
          </p>

          <div className="space-y-2">
            {shuffled([
              { id: 'disable_open_recursion_internal_only', label: 'Deshabilitar recursión abierta y limitar a subredes internas autorizadas', desc: 'El servidor autoritativo público no resuelve dominios externos; los resolvers internos solo atienden a clientes locales.' },
              { id: 'enable_recursion_all', label: 'Habilitar recursión global abierta a cualquier IP pública', desc: 'Convierte el servidor en un reflector para ataques DDoS masivos de amplificación.' },
              { id: 'rate_limit_only', label: 'Dejar recursión abierta y solo aplicar rate limiting temporal', desc: 'No elimina la vulnerabilidad de base exigida por CompTIA y las mejores prácticas CIS.' },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => updateField('openRecursionMitigation', opt.id)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  state.openRecursionMitigation === opt.id
                    ? 'bg-rose-950/80 border-rose-500 ring-1 ring-rose-500'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="text-xs font-bold text-rose-300">{opt.label}</div>
                {hints && <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
