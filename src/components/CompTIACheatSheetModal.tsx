import React, { useState } from 'react';
import {
  BookMarked,
  X,
  Search,
  Shield,
  Radio,
  FileText,
  Calculator,
  Lock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { sound } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CompTIACheatSheetModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ports' | 'nist' | 'formulas' | 'crypto'>('ports');
  const [portFilter, setPortFilter] = useState('');

  if (!isOpen) return null;

  const PORTS_DATA = [
    { port: 20, proto: 'TCP', name: 'FTP Data', secure: 'SFTP (22) / FTPS (989)', risk: 'Alto - Texto plano' },
    { port: 21, proto: 'TCP', name: 'FTP Control', secure: 'SFTP (22) / FTPS (990)', risk: 'Alto - Credenciales en claro' },
    { port: 22, proto: 'TCP', name: 'SSH / SFTP / SCP', secure: 'Estándar Seguro', risk: 'Seguro (Cifrado asimétrico/simétrico)' },
    { port: 23, proto: 'TCP', name: 'Telnet', secure: 'SSH (22)', risk: 'Crítico - Texto plano, vulnerable a sniffing' },
    { port: 25, proto: 'TCP', name: 'SMTP (Relay)', secure: 'SMTPS (465) / STARTTLS (587)', risk: 'Sin cifrado por defecto' },
    { port: 53, proto: 'UDP/TCP', name: 'DNS', secure: 'DNSSEC / DoT (853) / DoH (443)', risk: 'Vulnerable a spoofing, cache poisoning, tunneling' },
    { port: 67, proto: 'UDP', name: 'DHCP Server', secure: 'DHCP Snooping', risk: 'Vulnerable a Rogue DHCP y Starvation' },
    { port: 68, proto: 'UDP', name: 'DHCP Client', secure: 'DHCP Snooping', risk: 'Intercambio de broadcast inicial' },
    { port: 69, proto: 'UDP', name: 'TFTP', secure: 'SFTP (22) / HTTPS (443)', risk: 'Sin autenticación ni cifrado' },
    { port: 80, proto: 'TCP', name: 'HTTP', secure: 'HTTPS (443 - TLS 1.3)', risk: 'Crítico - Tráfico web no cifrado' },
    { port: 88, proto: 'TCP/UDP', name: 'Kerberos KDC', secure: 'Cifrado AES-256 forzado', risk: 'Kerberoasting (T1558.003), Golden/Silver Tickets' },
    { port: 110, proto: 'TCP', name: 'POP3', secure: 'POP3S (995 con SSL/TLS)', risk: 'Descarga correos con credenciales en texto plano' },
    { port: 123, proto: 'UDP', name: 'NTP', secure: 'NTPsec', risk: 'Vulnerable a ataques de amplificación DDoS y desincronización' },
    { port: 137, proto: 'UDP', name: 'NetBIOS Name Service', secure: 'DNS Corporativo', risk: 'Vulnerable a envenenamiento con Responder' },
    { port: 138, proto: 'UDP', name: 'NetBIOS Datagram', secure: 'Deshabilitar por GPO', risk: 'Protocolo legado no seguro' },
    { port: 139, proto: 'TCP', name: 'NetBIOS Session', secure: 'SMBv3 (445)', risk: 'Permite enumeración anónima (Null sessions)' },
    { port: 143, proto: 'TCP', name: 'IMAP', secure: 'IMAPS (993 con TLS)', risk: 'Lectura de buzón sin cifrar' },
    { port: 161, proto: 'UDP', name: 'SNMP (Queries)', secure: 'SNMPv3 (AuthPriv con SHA/AES)', risk: 'v1/v2c usa community strings en claro ("public")' },
    { port: 162, proto: 'UDP', name: 'SNMP Trap', secure: 'SNMPv3 Trap', risk: 'Recepción de alertas no autenticadas en v1/v2c' },
    { port: 389, proto: 'TCP/UDP', name: 'LDAP', secure: 'LDAPS (636 con TLS)', risk: 'Consultas de directorio Active Directory sin cifrar' },
    { port: 443, proto: 'TCP', name: 'HTTPS (TLS)', secure: 'TLS 1.3 con PFS', risk: 'Estándar Seguro para comunicaciones web y APIs' },
    { port: 445, proto: 'TCP', name: 'SMB (Direct Host)', secure: 'SMB 3.1.1 con Cifrado y Firma (SMB Signing)', risk: 'EternalBlue (MS17-010), WannaCry, SMB Relay' },
    { port: 500, proto: 'UDP', name: 'IPsec IKE', secure: 'IKEv2 con AES-GCM', risk: 'Negociación de asociación de seguridad (SA)' },
    { port: 587, proto: 'TCP', name: 'SMTP Client Submission', secure: 'STARTTLS obligatorio', risk: 'Envío de correo con autenticación previa' },
    { port: 636, proto: 'TCP', name: 'LDAPS (LDAP sobre TLS)', secure: 'Certificado X.509 de CA', risk: 'Estándar Seguro para consultas a directorio' },
    { port: 853, proto: 'TCP', name: 'DNS over TLS (DoT)', secure: 'Cifrado TLS dedicado', risk: 'Estándar Seguro de resolución DNS' },
    { port: 993, proto: 'TCP', name: 'IMAPS', secure: 'TLS 1.2 / 1.3', risk: 'Estándar Seguro de sincronización de correo' },
    { port: 995, proto: 'TCP', name: 'POP3S', secure: 'TLS 1.2 / 1.3', risk: 'Estándar Seguro de descarga de correo' },
    { port: 1812, proto: 'UDP', name: 'RADIUS Authentication', secure: 'RADIUS sobre TLS (RadSec) o 802.1X', risk: 'Tráfico de autenticación corporativa AAA' },
    { port: 1813, proto: 'UDP', name: 'RADIUS Accounting', secure: 'RadSec', risk: 'Tráfico de auditoría y contabilidad AAA' },
    { port: 3389, proto: 'TCP/UDP', name: 'RDP (Remote Desktop)', secure: 'RDP con NLA y Gateway HTTPS/VPN', risk: 'Vulnerable a BlueKeep (CVE-2019-0708) y ataques de fuerza bruta' },
    { port: 4500, proto: 'UDP', name: 'IPsec NAT-Traversal', secure: 'Encapsulación UDP para atravesar NAT', risk: 'Túneles VPN sitio a sitio o de acceso remoto' },
    { port: 5355, proto: 'UDP', name: 'LLMNR', secure: 'Deshabilitar por GPO', risk: 'Envenenamiento MITM y captura de hashes NTLMv2' }
  ];

  const filteredPorts = PORTS_DATA.filter((p) =>
    p.port.toString().includes(portFilter) ||
    p.name.toLowerCase().includes(portFilter.toLowerCase()) ||
    p.proto.toLowerCase().includes(portFilter.toLowerCase()) ||
    p.secure.toLowerCase().includes(portFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Guía Rápida & Cheat Sheet CompTIA Security+ SY0-701</span>
                <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded-full">
                  Examen Real Reference
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Puertos críticos, estándares NIST, fórmulas cuantitativas y algoritmos evaluados en Pearson VUE.
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

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => {
              sound.playToggle();
              setActiveTab('ports');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'ports'
                ? 'bg-cyan-600 text-on-accent shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Puertos y Protocolos Críticos</span>
          </button>
          <button
            onClick={() => {
              sound.playToggle();
              setActiveTab('nist');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'nist'
                ? 'bg-cyan-600 text-on-accent shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Estándares NIST & RFC 3227</span>
          </button>
          <button
            onClick={() => {
              sound.playToggle();
              setActiveTab('formulas');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'formulas'
                ? 'bg-cyan-600 text-on-accent shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Fórmulas de Riesgo & Métricas</span>
          </button>
          <button
            onClick={() => {
              sound.playToggle();
              setActiveTab('crypto');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'crypto'
                ? 'bg-cyan-600 text-on-accent shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Criptografía, PKI & X.509</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs">
          {/* TAB 1: PORTS MATRIX */}
          {activeTab === 'ports' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={portFilter}
                    onChange={(e) => setPortFilter(e.target.value)}
                    placeholder="Filtrar por puerto, nombre o protocolo (ej. 445, LDAP, Kerberos, SSH)..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="text-[11px] text-slate-400 font-mono shrink-0">
                  {filteredPorts.length} puertos listados
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/70">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      <th className="p-3 w-16 text-center">Puerto</th>
                      <th className="p-3 w-20">Tipo</th>
                      <th className="p-3">Servicio / Nombre</th>
                      <th className="p-3">Sustituto Seguro (CompTIA Target)</th>
                      <th className="p-3">Riesgo en SY0-701</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredPorts.map((row) => (
                      <tr key={row.port} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-cyan-400 text-center bg-slate-900/40">
                          {row.port}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-400">
                          {row.proto}
                        </td>
                        <td className="p-3 font-semibold text-white">
                          {row.name}
                        </td>
                        <td className="p-3 text-emerald-300 font-mono text-[11px]">
                          {row.secure}
                        </td>
                        <td className="p-3 text-slate-400 text-[11px]">
                          {row.risk}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: NIST & RFC STANDARDS */}
          {activeTab === 'nist' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Shield className="w-4 h-4" />
                  <span>NIST CSF 2.0 (Cybersecurity Framework)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  En SY0-701 se evalúan las <strong className="text-white">6 funciones fundamentales</strong> de NIST CSF 2.0:
                </p>
                <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-300">
                  <li><strong className="text-amber-400">Govern (Gobernar - Nueva función en 2.0):</strong> Políticas corporativas, roles y supervisión.</li>
                  <li><strong className="text-white">Identify (Identificar):</strong> Gestión de activos, evaluación de riesgos.</li>
                  <li><strong className="text-white">Protect (Proteger):</strong> Control de accesos, cifrado, concientización.</li>
                  <li><strong className="text-white">Detect (Detectar):</strong> Monitorización continua de anomalías e incidentes (SIEM/IDS).</li>
                  <li><strong className="text-white">Respond (Responder):</strong> Planes de contención y mitigación de incidentes.</li>
                  <li><strong className="text-white">Recover (Recuperar):</strong> Restauración de operaciones y lecciones aprendidas.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <FileText className="w-4 h-4" />
                  <span>NIST SP 800-61r2 (Incident Response Lifecycle)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Fases ordenadas para gestionar una brecha de seguridad:
                </p>
                <ol className="space-y-1 text-[11px] list-decimal list-inside text-slate-300">
                  <li><strong className="text-white">Preparación:</strong> Playbooks, herramientas forenses y entrenamiento.</li>
                  <li><strong className="text-white">Detección y Análisis:</strong> Triage de alertas, correlación de logs e IoCs.</li>
                  <li><strong className="text-white">Contención:</strong> Aislamiento de red (VLAN de cuarentena) para evitar propagación.</li>
                  <li><strong className="text-white">Erradicación:</strong> Eliminación de malware, remoción de persistencia.</li>
                  <li><strong className="text-white">Recuperación:</strong> Restauración segura desde backups validados.</li>
                  <li><strong className="text-white">Lecciones Aprendidas:</strong> Reunión post-mortem e informe final.</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <Layers className="w-4 h-4" />
                  <span>RFC 3227: Orden de Volatilidad Forense</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Regla de oro: recolectar primero la evidencia que desaparece más rápido al apagar el equipo:
                </p>
                <ol className="space-y-1 text-[11px] list-decimal list-inside text-slate-300 font-mono">
                  <li>Registros de CPU y Memoria Caché de procesador</li>
                  <li>Memoria RAM activa y caché de enrutamiento / ARP / Conexiones activas</li>
                  <li>Archivos temporales del sistema y archivo de paginación (Swap/Pagefile)</li>
                  <li>Disco duro / Almacenamiento local no volátil</li>
                  <li>Configuración física del sistema y topología de red</li>
                  <li>Logs remotos centralizados y registros de auditoría</li>
                  <li>Soportes de copia de seguridad (cintas de backup / DVDs)</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Shield className="w-4 h-4" />
                  <span>NIST SP 800-88 Rev 1 (Sanitización de Medios)</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  <li>
                    <strong className="text-cyan-300">Clear (Limpieza):</strong> Sobreescribe sectores con ceros/patrones para permitir reutilización interna dentro de la organización.
                  </li>
                  <li>
                    <strong className="text-purple-300">Purge (Purga):</strong> Desmagnetización (*Degaussing*) para HDD magnéticos o comandos ATA Secure Erase; imposibilita la recuperación en laboratorios forenses.
                  </li>
                  <li>
                    <strong className="text-rose-300">Destroy (Destrucción):</strong> Trituración mecánica (*Shredding*), pulverización o incineración. Obligatorio para fin de ciclo de vida de SSD/NVMe.
                  </li>
                  <li>
                    <strong className="text-emerald-300">Crypto-shredding:</strong> Destruir la clave de descifrado (DEK/KEK) de un volumen cifrado en la nube pública.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: RISK FORMULAS */}
          {activeTab === 'formulas' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-cyan-400">
                  Evaluación Cuantitativa del Riesgo (Fórmulas Clave)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="font-mono font-bold text-white mb-1">SLE = AV × EF</div>
                    <p className="text-slate-400">
                      <strong>Single Loss Expectancy (SLE):</strong> Pérdida monetaria esperada en un solo evento. <em>AV = Asset Value (Valor del Activo)</em>, <em>EF = Exposure Factor (% de daño estimado)</em>.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="font-mono font-bold text-white mb-1">ALE = SLE × ARO</div>
                    <p className="text-slate-400">
                      <strong>Annualized Loss Expectancy (ALE):</strong> Costo anual proyectado del riesgo. <em>ARO = Annualized Rate of Occurrence (Frecuencia de veces por año)</em>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-emerald-400">
                  Métricas de Continuidad de Negocio (BCP / DRP)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="font-mono font-bold text-white mb-1">RTO (Recovery Time Objective)</div>
                    <p className="text-slate-400">
                      Tiempo máximo tolerable para que el sistema vuelva a estar en línea tras una caída.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="font-mono font-bold text-white mb-1">RPO (Recovery Point Objective)</div>
                    <p className="text-slate-400">
                      Pérdida máxima de datos tolerable medida en tiempo (ej. backups cada 4 horas = RPO de 4 horas).
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="font-mono font-bold text-white mb-1">MTTR / MTBF</div>
                    <p className="text-slate-400">
                      <em>MTTR</em>: Tiempo medio de reparación. <em>MTBF</em>: Tiempo medio entre fallas de hardware.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CRYPTOGRAPHY & PKI */}
          {activeTab === 'crypto' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-sm font-bold text-cyan-400">Cifrado Simétrico vs Asimétrico</div>
                  <div className="space-y-2 text-[11px]">
                    <div>
                      <strong className="text-white">Simétrico (Una sola clave compartida):</strong>
                      <p className="text-slate-400">Muy rápido, ideal para datos masivos en reposo (AES-128/256, ChaCha20, 3DES - desaconsejado).</p>
                    </div>
                    <div>
                      <strong className="text-white">Asimétrico (Par de claves Pública/Privada):</strong>
                      <p className="text-slate-400">Más lento, ideal para intercambio de claves, firmas digitales y autenticación (RSA 2048/4096, ECC, Diffie-Hellman / ECDH).</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-sm font-bold text-emerald-400">Formatos de Certificado X.509</div>
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div>
                      <span className="text-cyan-300 font-bold">.PEM / .CRT / .CER:</span> Texto ASCII en Base64 delimitado por <code className="text-slate-400">-----BEGIN CERTIFICATE-----</code>.
                    </div>
                    <div>
                      <span className="text-purple-300 font-bold">.PFX / .P12 (PKCS#12):</span> Formato binario que almacena la Clave Privada, el Certificado y la cadena de CA protegidos con contraseña.
                    </div>
                    <div>
                      <span className="text-amber-300 font-bold">.DER:</span> Certificado en binario puro (común en Java y Windows).
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-sm font-bold text-amber-400">Revocación de Certificados: CRL vs OCSP vs OCSP Stapling</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-1">CRL (Certificate Revocation List)</strong>
                    <span className="text-slate-400">Lista completa descargada periódicamente. Ineficiente y pesada con muchas revocaciones.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-1">OCSP (Online Certificate Status Protocol)</strong>
                    <span className="text-slate-400">Consulta en tiempo real al respondedor de la CA. Puede filtrar la privacidad del usuario a la CA.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <strong className="text-white block mb-1">OCSP Stapling (Recomendado)</strong>
                    <span className="text-slate-400">El servidor web solicita la respuesta con firma de tiempo a la CA y la entrega ("engrapa") en el handshake TLS al cliente.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            Atajo rápido: Presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">Alt + P</kbd> en cualquier pantalla
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};
