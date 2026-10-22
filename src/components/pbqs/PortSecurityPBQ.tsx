import React, { useState } from 'react';
import {
  Network,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Search,
  Lock,
  Unlock,
  Radio
} from 'lucide-react';
import { PortAuditItem } from '../../types/pbq';

interface PortSecurityPBQProps {
  items: PortAuditItem[];
  onChange: (items: PortAuditItem[]) => void;
  onReset: () => void;
}

export const PortSecurityPBQ: React.FC<PortSecurityPBQProps> = ({
  items,
  onChange,
  onReset,
}) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(true);

  const activeItem = items[activeItemIndex] || items[0];

  const updateActiveItem = (field: keyof PortAuditItem, value: any) => {
    const updated = items.map((item, idx) => {
      if (idx === activeItemIndex) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const COMPTIA_PORTS_REFERENCE = [
    { port: '20 / 21', name: 'FTP', secure: 'SFTP (22) / FTPS (989/990)', type: 'Inseguro (Claro)', tip: 'Transmite contraseñas y datos en claro.' },
    { port: '22', name: 'SSH / SFTP', secure: 'SSH / SCP / SFTP', type: 'Seguro (Cifrado)', tip: 'Cifrado asimétrico y simétrico con integridad.' },
    { port: '23', name: 'Telnet', secure: 'SSH (22)', type: 'Inseguro (Claro)', tip: 'Terminal remota sin cifrar; sustituir siempre por SSH.' },
    { port: '25', name: 'SMTP', secure: 'SMTPS (465) / Submission (587)', type: 'Inseguro (Claro)', tip: 'Transferencia de correo entre servidores.' },
    { port: '49', name: 'TACACS+', secure: 'TACACS+ (Cifra todo)', type: 'Seguro (Cifra payload)', tip: 'AAA para switches/routers (cifra todo el paquete, a diferencia de RADIUS).' },
    { port: '53', name: 'DNS', secure: 'DoT (853) / DoH (443) / DNSSEC', type: 'Sin cifrar (UDP/TCP)', tip: 'Resolución de nombres. AXFR de transferencia usa TCP 53.' },
    { port: '67 / 68', name: 'DHCP', secure: 'DHCP Snooping', type: 'Sin cifrar (UDP)', tip: 'Asignación de IPs. Requiere DHCP Snooping en switches L2.' },
    { port: '69', name: 'TFTP', secure: 'SFTP (22) / HTTPS', type: 'Inseguro (Sin auth)', tip: 'UDP sin autenticación ni cifrado; usado para firmware local.' },
    { port: '80', name: 'HTTP', secure: 'HTTPS (443)', type: 'Inseguro (Claro)', tip: 'Tráfico web no cifrado; susceptible a Man-in-the-Middle.' },
    { port: '88', name: 'Kerberos', secure: 'Kerberos v5 (Tickets TGT/TGS)', type: 'Seguro (Auth)', tip: 'Protocolo de autenticación en Active Directory usando KDC.' },
    { port: '110', name: 'POP3', secure: 'POP3S (995)', type: 'Inseguro (Claro)', tip: 'Descarga de correo; credenciales en texto plano.' },
    { port: '123', name: 'NTP', secure: 'NTPsec', type: 'Sincronización (UDP)', tip: 'Sincronización de reloj crucial para Kerberos y correlación de logs.' },
    { port: '137-139', name: 'NetBIOS', secure: 'Deshabilitar en LAN', type: 'Legado inseguro', tip: 'Resolución de nombres en Windows antiguos; vulnerable a LLMNR spoofing.' },
    { port: '143', name: 'IMAP', secure: 'IMAPS (993)', type: 'Inseguro (Claro)', tip: 'Acceso a buzón de correo sin cifrar.' },
    { port: '161 / 162', name: 'SNMP', secure: 'SNMPv3 (161 authPriv)', type: 'v1/v2c Inseguro', tip: 'SNMPv1/v2c usa community strings legibles. SNMPv3 añade SHA y AES.' },
    { port: '389', name: 'LDAP', secure: 'LDAPS (636)', type: 'Inseguro (Claro)', tip: 'Consultas a Active Directory sin cifrar; sustituir por LDAPS.' },
    { port: '443', name: 'HTTPS', secure: 'TLS 1.3', type: 'Seguro (Cifrado)', tip: 'HTTP encapsulado en TLS; estándar para tráfico web seguro.' },
    { port: '445', name: 'SMB', secure: 'SMBv3 (Cifrado & Firma)', type: 'Vulnerable en v1', tip: 'Compartición de archivos Windows. SMBv1 causó WannaCry (EternalBlue).' },
    { port: '514', name: 'Syslog', secure: 'Syslog TLS (6514 TCP)', type: 'Inseguro (UDP)', tip: 'Envío de logs en claro sin acuse de recibo; migrar a TLS 6514.' },
    { port: '636', name: 'LDAPS', secure: 'TLS sobre LDAP', type: 'Seguro (Cifrado)', tip: 'Consultas Active Directory sobre canal seguro TLS.' },
    { port: '853', name: 'DoT (DNS over TLS)', secure: 'TLS TCP 853', type: 'Seguro (Cifrado)', tip: 'Estándar dedicado para cifrado de consultas DNS de red.' },
    { port: '993', name: 'IMAPS', secure: 'TLS sobre IMAP', type: 'Seguro (Cifrado)', tip: 'Recepción segura de correo con sincronización bidireccional.' },
    { port: '995', name: 'POP3S', secure: 'TLS sobre POP3', type: 'Seguro (Cifrado)', tip: 'Descarga segura de correos electrónicos con TLS.' },
    { port: '1433', name: 'Microsoft SQL', secure: 'TDS Cifrado TLS', type: 'Base de datos', tip: 'Servidor MS SQL Server; no exponer nunca a Internet.' },
    { port: '1812 / 1813', name: 'RADIUS', secure: '802.1X / EAP-TLS', type: 'AAA Auth / Acct', tip: 'Solo cifra la contraseña (no el paquete entero a diferencia de TACACS+).' },
    { port: '3306', name: 'MySQL / MariaDB', secure: 'MySQL SSL/TLS', type: 'Base de datos', tip: 'Puerto estándar de base de datos relacional MySQL.' },
    { port: '3389', name: 'RDP', secure: 'RDP + NLA tras VPN/Bastion', type: 'Escritorio Remoto', tip: 'Exponer 3389 a WAN es crítico; requiere VPN, MFA y NLA.' },
    { port: '6514', name: 'Syslog-over-TLS', secure: 'TLS RFC 5425', type: 'Seguro (Cifrado TCP)', tip: 'Envío de logs de eventos auditados garantizado y cifrado con TLS.' }
  ];

  const filteredReference = COMPTIA_PORTS_REFERENCE.filter(
    (p) =>
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.port.includes(filterQuery) ||
      p.tip.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* PBQ Instructions Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                CompTIA High-Yield PBQ • Puertos y Protocolos Críticos
              </span>
              <span className="text-slate-400 text-xs">8 Servicios Auditados</span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-400" />
              Auditoría y Remediación de Puertos y Protocolos de Red
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              Un escaneo de seguridad en los servidores perimetrales e internos reveló 8 servicios con protocolos obsoletos o expuestos.
              Para cada hallazgo, identifica la debilidad inherente de seguridad, selecciona el puerto y protocolo seguro de reemplazo, y define la regla de remediación.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => setShowCheatSheet(!showCheatSheet)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/60 rounded-lg text-indigo-300 text-xs font-semibold transition"
            >
              <BookOpen className="w-4 h-4" />
              {showCheatSheet ? 'Ocultar Chuleta de Puertos' : 'Ver Matriz Oficial CompTIA'}
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-xs font-semibold transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </button>
          </div>
        </div>

        {/* Tactical Cheat Sheet Toggleable Panel */}
        {showCheatSheet && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Matriz Rápida CompTIA Security+ SY0-701: Puertos Inseguros vs Seguros
              </div>
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar puerto o servicio..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-lg pl-8 pr-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/70">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="py-1.5 px-3">Puerto Estándar</th>
                    <th className="py-1.5 px-3">Protocolo</th>
                    <th className="py-1.5 px-3">Tipo / Estado</th>
                    <th className="py-1.5 px-3">Sustituto Seguro Oficial</th>
                    <th className="py-1.5 px-3">Regla CompTIA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {filteredReference.map((ref, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition">
                      <td className="py-1.5 px-3 font-bold text-amber-400">{ref.port}</td>
                      <td className="py-1.5 px-3 font-semibold text-white">{ref.name}</td>
                      <td className="py-1.5 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            ref.type.includes('Inseguro') || ref.type.includes('Vulnerable')
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          }`}
                        >
                          {ref.type}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 text-cyan-300 font-bold">{ref.secure}</td>
                      <td className="py-1.5 px-3 text-slate-400 font-sans">{ref.tip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of 8 Services */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2 flex items-center justify-between">
            <span>Servicios a Auditar ({items.length})</span>
            <span className="text-[10px] text-indigo-400">Selecciona para configurar</span>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => {
              const isActive = idx === activeItemIndex;
              const isFilled =
                item.selectedInsecurityReason !== '' &&
                item.selectedSecurePort !== null &&
                item.selectedSecureProtocol !== '' &&
                item.selectedRemediationAction !== '';

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItemIndex(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-950/70 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-amber-400 border border-slate-700'
                      }`}
                    >
                      {item.legacyPort}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        {item.serviceName}
                        {isFilled && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        Protocolo Legado: <span className="text-amber-400">{item.legacyProtocol}</span>
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-indigo-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Configuration Form for Active Service */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            {/* Header of Active Service */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-950/70 border border-rose-800/70 rounded-xl text-rose-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    Hallazgo #{activeItemIndex + 1} • Puerto Activo {activeItem.legacyPort}/TCP
                  </div>
                  <h4 className="text-lg font-bold text-white">{activeItem.serviceName}</h4>
                </div>
              </div>

              <div className="px-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-xs font-mono text-slate-300">
                Puerto Legado: <span className="text-rose-400 font-bold">{activeItem.legacyPort}</span> ({activeItem.legacyProtocol})
              </div>
            </div>

            {/* Vulnerability Alert Box */}
            <div className="bg-rose-950/30 border border-rose-800/40 rounded-lg p-3 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-rose-300">Diagnóstico preliminar:</span>{' '}
                {activeItem.vulnerabilityDescription}
              </div>
            </div>

            {/* Question 1: Insecurity Reason */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. ¿Cuál es el riesgo de seguridad intrínseco del puerto {activeItem.legacyPort} ({activeItem.legacyProtocol})?
              </label>
              <select
                value={activeItem.selectedInsecurityReason}
                onChange={(e) => updateActiveItem('selectedInsecurityReason', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              >
                <option value="">-- Selecciona el riesgo o vulnerabilidad del protocolo --</option>
                <option value="unencrypted_directory_queries">
                  Consultas y credenciales de Active Directory viajan sin cifrar por la red
                </option>
                <option value="cleartext_community_strings">
                  Usa cadenas de comunidad ('community strings') en texto claro sin autenticación criptográfica
                </option>
                <option value="unencrypted_udp_tampering">
                  UDP no cifrado permite spoofing de logs, alteración de registros y carece de integridad
                </option>
                <option value="wan_exposed_bruteforce">
                  Expuesto directamente a Internet, susceptible a ataques de fuerza bruta masiva y exploits
                </option>
                <option value="cleartext_credentials">
                  Transmite credenciales y comandos en texto plano sin cifrar (vulnerable a sniffing/MITM)
                </option>
                <option value="cleartext_ftp_credentials">
                  Autenticación RFC 959 y transferencia de archivos confidenciales en texto plano
                </option>
                <option value="cleartext_dns_eavesdropping">
                  Consultas en texto claro permiten rastreo de navegación, espionaje y envenenamiento de caché
                </option>
                <option value="unencrypted_web_traffic">
                  Navegación web y cookies de sesión viajan en claro sin TLS (vulnerable a session hijacking)
                </option>
              </select>
            </div>

            {/* Question 2: Secure Replacement Port & Protocol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  2. Puerto Seguro de Destino
                </label>
                <select
                  value={activeItem.selectedSecurePort ?? ''}
                  onChange={(e) =>
                    updateActiveItem('selectedSecurePort', e.target.value ? parseInt(e.target.value) : null)
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm font-mono text-emerald-400 font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                >
                  <option value="">-- Puerto Seguro --</option>
                  <option value="636">Puerto 636 (LDAPS)</option>
                  <option value="443">Puerto 443 (HTTPS / TLS)</option>
                  <option value="161">Puerto 161 (SNMPv3 authPriv)</option>
                  <option value="22">Puerto 22 (SSH / SFTP)</option>
                  <option value="853">Puerto 853 (DoT - DNS over TLS)</option>
                  <option value="990">Puerto 990 (FTPS)</option>
                  <option value="995">Puerto 995 (POP3S)</option>
                  <option value="6514">Puerto 6514 (Syslog-over-TLS)</option>
                  <option value="993">Puerto 993 (IMAPS)</option>
                  <option value="3389">Puerto 3389 (RDP tras VPN/NLA)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  3. Protocolo Seguro Recomendado
                </label>
                <select
                  value={activeItem.selectedSecureProtocol}
                  onChange={(e) => updateActiveItem('selectedSecureProtocol', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-cyan-300 font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                >
                  <option value="">-- Protocolo Seguro --</option>
                  <option value="LDAPS">LDAPS (LDAP sobre TLS con Channel Binding)</option>
                  <option value="SNMPv3">SNMPv3 (authPriv con SHA + AES)</option>
                  <option value="SFTP">SFTP (SSH File Transfer Protocol)</option>
                  <option value="DoT_DoH">DoT (DNS over TLS) / DoH con DNSSEC</option>
                  <option value="HTTPS">HTTPS (TLS 1.3)</option>
                  <option value="VPN_NLA">VPN con MFA + NLA (Network Level Authentication)</option>
                  <option value="Syslog-TLS">Syslog-over-TLS (TCP 6514)</option>
                  <option value="SSH">SSH (Secure Shell)</option>
                </select>
              </div>
            </div>

            {/* Question 3: Remediation / Firewall Action */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                4. Acción de Remediación en Firewall / Configuración de Host
              </label>
              <select
                value={activeItem.selectedRemediationAction}
                onChange={(e) => updateActiveItem('selectedRemediationAction', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              >
                <option value="">-- Selecciona la directiva de remediación exacta --</option>
                <option value="enforce_ldaps_channel_binding">
                  Exigir LDAPS en puerto 636 y habilitar LDAP Channel Binding y firma obligatoria en Domain Controllers
                </option>
                <option value="enforce_tls_syslog_6514">
                  Reconfigurar rsyslog hacia el SIEM en TCP puerto 6514 exigiendo verificación mutua de certificados TLS
                </option>
                <option value="enforce_dot_dnssec">
                  Habilitar DNS over TLS (DoT) en puerto 853 en servidores reenviadores y activar validación DNSSEC
                </option>
                <option value="block_wan_access_require_vpn">
                  Cerrar puerto 3389 en firewall perimetral WAN; exigir acceso mediante túnel VPN corporativo con MFA y NLA
                </option>
                <option value="disable_ftp_enable_sftp">
                  Detener y deshabilitar daemon FTP, cerrar puertos 20/21 y habilitar SFTP mediante subsistema OpenSSH
                </option>
                <option value="upgrade_to_snmpv3_authpriv">
                  Reconfigurar agentes a SNMPv3 en modo authPriv con hashing SHA-256 y cifrado AES-256; rechazar v1/v2c
                </option>
                <option value="redirect_301_to_https">
                  Configurar redirección permanente HTTP 301 hacia HTTPS (443) y deshabilitar métodos HTTP inseguros
                </option>
                <option value="block_legacy_enforce_ssh">
                  Bloquear puerto 23 en firewall, desinstalar paquete telnet-server y habilitar OpenSSH en puerto 22
                </option>
              </select>
            </div>

            {/* Navigation buttons between the 8 findings */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                disabled={activeItemIndex === 0}
                onClick={() => setActiveItemIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-semibold text-white rounded-lg transition"
              >
                ← Servicio Anterior
              </button>

              <span className="text-xs text-slate-400">
                Servicio {activeItemIndex + 1} de {items.length}
              </span>

              <button
                disabled={activeItemIndex === items.length - 1}
                onClick={() => setActiveItemIndex((prev) => Math.min(items.length - 1, prev + 1))}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-xs font-semibold text-white rounded-lg transition"
              >
                Siguiente Servicio →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
