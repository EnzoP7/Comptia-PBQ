/**
 * "Trap review" flashcards: one card per pair of concepts that was confused in the Dion practice
 * exams. Each card shows a situation and two options — the right concept and the one that was
 * picked by mistake — plus the rule that tells them apart. `pbq` points to the PBQ that drills it.
 */
export interface TrapCard {
  id: string;
  obj: string;
  pbq: number;
  q: string;
  right: string;
  wrong: string;
  rule: string;
}

const c = (id: string, obj: string, pbq: number, q: string, right: string, wrong: string, rule: string): TrapCard => ({ id, obj, pbq, q, right, wrong, rule });

export const TRAP_CARDS: TrapCard[] = [
  // Domain 1
  c('pep', '1.2', 78, 'En Zero Trust, ¿qué componente está en el camino del tráfico y corta la sesión si la política lo indica?', 'Punto de aplicación de políticas (PEP)', 'Motor de políticas', 'El motor DECIDE; el PEP APLICA la decisión sobre el tráfico.'),
  c('pe', '1.2', 78, '¿Qué componente de Zero Trust evalúa la identidad, el dispositivo y las amenazas para decidir si concede el acceso?', 'Motor de políticas', 'Punto de aplicación de políticas (PEP)', 'Decidir = motor de políticas (plano de control). Hacer cumplir = PEP.'),
  c('dataplane', '1.2', 78, 'Capa de Zero Trust que transporta y procesa los datos una vez aprobado el acceso.', 'Plano de datos', 'Plano de control', 'Control = decide con políticas. Datos = mueve el tráfico ya autorizado.'),
  c('honeyfile', '1.2', 78, 'Un documento falso "contraseñas.docx" en un recurso compartido alerta al SOC cuando alguien lo abre.', 'Honeyfile', 'Honeytoken', 'ARCHIVO señuelo = honeyfile. DATO o credencial falsa = honeytoken.'),
  c('honeytoken', '1.2', 78, 'Una clave de acceso de AWS falsa dejada en un repositorio dispara una alerta cuando alguien intenta usarla.', 'Honeytoken', 'Honeyfile', 'Una credencial o registro falso es un honeytoken, aunque esté dentro de un archivo.'),
  c('stakeholders', '1.3', 86, 'Antes de un cambio, se consulta a los representantes de cada departamento que se verá afectado.', 'Partes interesadas', 'Junta de aprobación de cambios (CAB)', 'El CAB APRUEBA; las partes interesadas son los AFECTADOS a quienes se consulta.'),
  c('downtime', '1.3', 86, 'La actualización exigió una interrupción programada del servicio de tres horas. ¿Qué implicación técnica es?', 'Tiempo de inactividad', 'Ventana de mantenimiento', 'La ventana es CUÁNDO se hace el cambio; el tiempo de inactividad es el servicio caído.'),
  c('rollback', '1.3', 86, 'La actualización rompió el cálculo de inventario y hay que volver de inmediato a la versión anterior.', 'Plan de reversión (rollback)', 'Análisis de impacto', 'El análisis de impacto se hace ANTES; la reversión es la salida cuando el cambio ya falló.'),
  c('file-enc', '1.4', 79, 'Solo algunos documentos confidenciales deben ir cifrados; el resto de la unidad queda en texto plano.', 'Cifrado a nivel de archivo', 'Cifrado de partición', 'Elegir documentos concretos = archivo. Partición/volumen cifra TODO lo que contiene.'),
  c('record-enc', '1.4', 79, 'Cada número de tarjeta de la tabla se cifra por separado con su propia clave.', 'Cifrado a nivel de registro', 'Cifrado de base de datos', 'Cada fila o campo = registro. La base entera como unidad = base de datos.'),
  c('kms', '1.4', 79, 'Automatizar la generación, rotación, revocación y destrucción de las claves de toda la empresa.', 'Sistema de gestión de claves (KMS)', 'HSM', 'KMS = gestiona el CICLO DE VIDA. HSM = hardware que guarda y usa las claves.'),
  c('hsm', '1.4', 79, 'La CA interna necesita un dispositivo externo, dedicado y resistente a manipulaciones para su clave privada.', 'HSM', 'TPM', 'HSM = aparato dedicado y externo. TPM = chip soldado en cada equipo.'),
  c('ecc', '1.4', 79, 'Algoritmo asimétrico que da la misma seguridad que RSA con claves mucho más cortas (ideal para móviles).', 'ECC', 'Diffie-Hellman', 'Claves cortas y eficientes = ECC. Diffie-Hellman es un método de intercambio de claves.'),
  c('stream', '1.4', 79, 'Cifrado simétrico para datos de longitud desconocida que se cifran byte a byte, como una transmisión en vivo.', 'Cifrado de flujo', 'Cifrado por bloques', 'Byte a byte = flujo. Bloques de tamaño fijo = por bloques (AES).'),
  c('pubkey', '1.4', 79, 'Quieres que SOLO el destinatario pueda leer tu mensaje. ¿Con qué clave lo cifras?', 'Clave pública del destinatario', 'Tu clave privada', 'Confidencialidad = clave pública del destinatario. Tu clave privada sirve para FIRMAR.'),
  c('thirdparty-cert', '1.4', 79, 'El sitio público necesita un certificado en el que confíen todos los navegadores.', 'Certificado de una CA de terceros', 'Certificado wildcard', 'Quién lo FIRMA (CA externa) no es lo mismo que cuántos nombres CUBRE (wildcard).'),
  // Domain 2
  c('filebased', '2.2', 80, 'El malware llega dentro de un PDF o un ejecutable descargado. ¿Qué vector de amenaza es?', 'Basado en archivos', 'Correo electrónico', 'Si preguntan por el OBJETO malicioso (documento, ejecutable) = basado en archivos.'),
  c('removable', '2.2', 80, 'Un empleado conecta una memoria USB encontrada en el estacionamiento.', 'Dispositivo extraíble', 'Basado en archivos', 'El medio físico manda: USB = dispositivo extraíble, aunque contenga archivos.'),
  c('im', '2.2', 80, 'Llega por Messenger o WhatsApp un enlace a un falso video que pide tu contraseña.', 'Mensajería instantánea', 'SMS', 'Apps de chat = mensajería instantánea. SMS = mensaje de texto del operador.'),
  c('bec', '2.2', 80, 'El "CEO" escribe a finanzas para que pague con urgencia una factura a una cuenta nueva.', 'Compromiso de correo empresarial (BEC)', 'Pretexting', 'Fraude de pagos haciéndose pasar por un ejecutivo = BEC. Pretexting es solo la historia inventada.'),
  c('impersonation', '2.2', 80, 'Alguien llama diciendo ser "Enrique de soporte técnico" para que le des acceso remoto. ¿Qué técnica usa?', 'Suplantación de identidad (impersonation)', 'Vishing', 'Si preguntan la TÉCNICA (hacerse pasar por alguien) = impersonation. Si preguntan el CANAL de voz = vishing.'),
  c('wiretap', '2.2', 80, 'El atacante conecta físicamente su equipo al cableado para escuchar el tráfico.', 'Intervención de la línea (wiretapping)', 'Ataque en ruta (on-path)', 'Conexión FÍSICA al cable = wiretapping. On-path es la posición lógica en medio.'),
  c('peripheral', '2.2', 80, 'Unos auriculares Bluetooth con firmware modificado lanzan ataques contra el teléfono.', 'Periférico malicioso', 'Bluejacking', 'Un periférico manipulado ataca. Bluejacking solo envía mensajes no solicitados.'),
  c('unsupported', '2.2', 80, 'Un portátil con Windows XP que no recibe parches desde hace años.', 'Sistema sin soporte', 'Software vulnerable', 'El fabricante ya no lo actualiza = sin soporte (más específico que "software vulnerable").'),
  c('misconfig', '2.3', 80, 'Un bucket marcado como público por error expuso datos. ¿Cuál es la causa raíz?', 'Configuración incorrecta', 'Exposición de datos', 'Te piden la CAUSA (la mala configuración), no la CONSECUENCIA (la filtración).'),
  c('toctou', '2.3', 80, 'El atacante cambia el archivo después de que la aplicación lo verificó y antes de que lo use.', 'Time-of-check (TOCTOU)', 'Desbordamiento de búfer', 'La ventana entre COMPROBAR y USAR = TOCTOU (un tipo de condición de carrera).'),
  c('vmescape', '2.3', 80, 'El atacante sale de su máquina virtual y accede a la memoria del hipervisor.', 'Escape de máquina virtual', 'Reutilización de recursos', 'Romper el aislamiento = escape. Leer datos residuales de recursos compartidos = reutilización.'),
  c('firmware', '2.3', 80, 'Se puede modificar el software embebido que controla el hardware del router.', 'Vulnerabilidad de firmware', 'Carga lateral (sideloading)', 'Software del hardware = firmware. Sideloading = instalar apps fuera de la tienda oficial.'),
  c('reflected', '2.4', 81, 'La víctima recibe miles de respuestas DNS a consultas que nunca hizo; las enviaron con su IP falsificada.', 'DDoS reflejado', 'DDoS amplificado', 'Respuestas que REBOTAN en terceros hacia la IP falsificada = reflejado.'),
  c('amplified', '2.4', 81, 'Peticiones de 60 bytes producen respuestas de 4.000 bytes dirigidas a la víctima.', 'DDoS amplificado', 'DDoS reflejado', 'Si el enunciado destaca que la respuesta es MUCHO MÁS GRANDE que la petición = amplificado.'),
  c('brute', '2.4', 81, '900 contraseñas distintas contra la cuenta "admin" desde una misma IP.', 'Fuerza bruta', 'Password spraying', 'Muchas contraseñas → UNA cuenta = fuerza bruta.'),
  c('spray', '2.4', 81, 'Un solo intento con "Verano2026!" en cada una de 400 cuentas distintas.', 'Password spraying', 'Fuerza bruta', 'UNA contraseña → muchas cuentas (horizontal) = spraying; evita los bloqueos.'),
  c('csrf', '2.4', 81, 'Tras visitar un foro, los usuarios ven cambios en su cuenta que no hicieron; su navegador envió las peticiones.', 'CSRF', 'Secuestro de sesión', 'El NAVEGADOR DE LA VÍCTIMA envía la petición = CSRF. El atacante usa la sesión robada = secuestro.'),
  c('codeinj', '2.4', 81, 'El campo de usuario contiene JavaScript que el servidor interpreta.', 'Inyección de código', 'Inyección de comandos', 'Código del lenguaje de la app = inyección de código. Comandos del SO (; | &&) = inyección de comandos.'),
  c('arp', '2.4', 81, 'Cientos de respuestas ARP no solicitadas asocian la IP del gateway a la MAC de otro equipo.', 'Ataque en ruta (on-path)', 'Suplantación de MAC', 'El envenenamiento ARP pone al atacante EN MEDIO. Suplantar MAC solo cambia la propia dirección.'),
  c('rootkit', '2.4', 81, 'Las herramientas del propio sistema no muestran nada raro, pero hay accesos no autorizados.', 'Rootkit', 'Malware sin archivos', 'Se OCULTA del SO = rootkit. Vive en memoria con herramientas legítimas = sin archivos.'),
  c('concurrent', '2.4', 81, 'La cuenta tiene dos sesiones activas a la vez en dos ciudades mientras el usuario trabaja.', 'Sesiones concurrentes', 'Viaje imposible', 'AL MISMO TIEMPO = concurrentes.'),
  c('impossible', '2.4', 81, 'Inicio de sesión en Madrid y, 20 minutos después, otro en Tokio.', 'Viaje imposible', 'Sesiones concurrentes', 'Dos inicios SUCESIVOS que la distancia hace imposibles = viaje imposible.'),
  c('isolation', '2.5', 82, 'Cortar por completo la comunicación de un sistema infectado con los demás.', 'Aislamiento', 'Segmentación', 'Aislamiento = sin comunicación. Segmentación = zonas que se siguen comunicando con reglas.'),
  c('config-enf', '2.5', 82, 'Los usuarios desactivan funciones de seguridad; hay que imponer y mantener una configuración estándar.', 'Aplicación de la configuración', 'Mínimo privilegio', 'Fijar la configuración = aplicación de la configuración. Mínimo privilegio limita permisos.'),
  c('nac', '2.5', 82, 'Verificar el estado de los dispositivos personales antes de dejarlos entrar a la red.', 'Control de acceso a la red (NAC)', 'EDR', 'Controlar la ENTRADA a la red = NAC. EDR protege equipos ya gestionados.'),
  // Domain 3
  c('proxy', '3.2', 83, 'Un equipo recibe las solicitudes de Internet y las reenvía a los servidores internos en su nombre, ocultándolos.', 'Servidor proxy', 'Balanceador de carga', 'Intermediar y ocultar = proxy (inverso). Repartir la carga = balanceador.'),
  c('waf', '3.2', 83, 'Una aplicación web tiene una vulnerabilidad que aún no se puede parchear.', 'WAF', 'IPS', 'Proteger una app web mientras no hay parche (virtual patching) = WAF.'),
  c('inline', '3.2', 83, 'El dispositivo debe poder BLOQUEAR el malware que atraviesa la red.', 'Dispositivo en línea (inline)', 'Modo tap / monitor', 'Para bloquear hay que estar EN el camino. Tap/monitor solo recibe una copia.'),
  c('ids', '3.2', 83, 'El sistema no interactúa con el tráfico; solo detecta y genera alertas.', 'IDS', 'IPS', 'Detecta = IDS (pasivo). Bloquea = IPS (en línea).'),
  c('failclosed', '3.2', 83, 'Si el firewall de la sala de servidores falla, no debe pasar ningún tráfico.', 'Falla cerrada (fail-closed)', 'Falla abierta (fail-open)', 'Prioriza la SEGURIDAD ante la falla = fail-closed.'),
  c('failopen', '3.2', 83, 'Si el filtro de contenido falla, la tienda online debe seguir vendiendo.', 'Falla abierta (fail-open)', 'Falla cerrada (fail-closed)', 'Prioriza la DISPONIBILIDAD ante la falla = fail-open.'),
  c('eap', '3.2', 83, 'Marco de autenticación que admite varios métodos (TLS, PEAP) en redes cableadas e inalámbricas.', 'EAP', 'RADIUS', 'EAP es el MARCO de métodos; RADIUS es el SERVIDOR AAA que lo usa.'),
  c('vpn', '3.2', 83, 'Conectar de forma cifrada las redes de varias sucursales a través de Internet.', 'VPN', 'SD-WAN', 'Requisito de comunicación CIFRADA = VPN. SD-WAN optimiza y gestiona enlaces.'),
  c('l7', '3.2', 83, 'Permitir o bloquear según la aplicación (por ejemplo, Facebook), no solo el puerto.', 'Firewall de capa 7', 'Firewall de capa 4', 'Entender la aplicación = capa 7. Capa 4 solo ve IP y puertos.'),
  c('serverless', '3.1', 84, 'Ejecutar funciones sin gestionar ningún servidor ni el escalado.', 'Sin servidor (serverless)', 'Infraestructura como código (IaC)', 'Serverless = no gestionas infraestructura. IaC = la sigues gestionando, pero con código.'),
  c('iac', '3.1', 84, '¿Cuál es el objetivo PRINCIPAL de definir la infraestructura en archivos versionados?', 'Consistencia en todos los entornos', 'Reducir el trabajo manual', 'La consistencia es el objetivo central de IaC; ahorrar trabajo es secundario.'),
  c('replication', '3.4', 85, 'Duplicar los datos en tiempo casi real a un segundo centro de datos.', 'Replicación', 'Journaling', 'Copia continua a OTRO lugar = replicación.'),
  c('journaling', '3.4', 85, 'Registrar cada transacción para recuperar la base hasta el instante exacto de la falla.', 'Journaling', 'Replicación', 'Historial de CADA CAMBIO = journaling. La replicación copia el estado, no el historial.'),
  c('failover', '3.4', 85, 'Probar que el servicio pasa automáticamente al servidor de respaldo cuando el principal cae.', 'Conmutación por error (failover)', 'Clustering', 'Cambiar al respaldo ante la falla = failover. Clustering = varios nodos trabajando a la vez.'),
  c('simulation', '3.4', 85, 'Un equipo ataca y otro defiende en un escenario práctico para probar el plan.', 'Simulación', 'Ejercicio de mesa (tabletop)', 'Se EJECUTA en la práctica = simulación. Solo se DISCUTE = tabletop.'),
  c('offsite', '3.4', 85, 'La oficina está en zona de inundaciones: las copias deben sobrevivir a la pérdida del edificio.', 'Copia fuera del sitio', 'Copia local (en el sitio)', 'Riesgo para el EDIFICIO = fuera del sitio.'),
  c('onsite', '3.4', 85, 'Se necesita la recuperación más rápida posible de un archivo borrado en el centro de datos.', 'Copia local (en el sitio)', 'Copia fuera del sitio', 'VELOCIDAD de restauración = copia local.'),
  c('continuous', '3.4', 85, 'Un banco no puede perder casi ninguna transacción del día.', 'Copia continua', 'Copia incremental diaria', 'RPO casi cero = continua. Una incremental diaria perdería hasta un día.'),
  c('full', '3.4', 85, 'Restaurar usando la menor cantidad posible de conjuntos de copia.', 'Copia completa', 'Snapshot', 'Una copia completa se restaura sola, sin cadenas de cambios.'),
  c('regulated', '3.3', 90, 'Datos que por ley requieren un manejo específico.', 'Datos regulados', 'Datos confidenciales', 'Regulado = obligación LEGAL. Confidencial = decisión interna de la empresa.'),
  // Domain 4
  c('userprov', '4.7', 86, 'Las cuentas se crean al contratar a alguien y se eliminan cuando se va.', 'Aprovisionamiento de usuarios', 'Aprovisionamiento de recursos', 'Cuentas de PERSONAS = usuarios.'),
  c('resprov', '4.7', 86, 'Las máquinas virtuales se crean o ajustan automáticamente según la demanda.', 'Aprovisionamiento de recursos', 'Aprovisionamiento de usuarios', 'Servidores, VMs, almacenamiento = recursos.'),
  c('tco', '4.7', 86, 'Evaluar el costo de la herramienta durante toda su vida útil: licencias, soporte y personal.', 'Costo total de propiedad (TCO)', 'Retorno de la inversión (ROI)', 'Lo que CUESTA en total = TCO. Lo que DEVUELVE = ROI.'),
  c('techdebt', '4.7', 86, 'Atajos acumulados en sistemas viejos que complican la seguridad y la automatización.', 'Deuda técnica', 'Punto único de fallo', 'Atajos que se pagan después = deuda técnica.'),
  c('rule', '4.6', 87, 'El acceso solo se permite en horario laboral, para todos por igual.', 'Basado en reglas', 'Basado en atributos (ABAC)', 'Una regla GLOBAL igual para todos = basado en reglas. Varios atributos del usuario = ABAC.'),
  c('abac', '4.6', 87, 'Se evalúan juntos el puesto, el departamento, la ubicación y el dispositivo del usuario.', 'Basado en atributos (ABAC)', 'Basado en roles (RBAC)', 'MUCHAS características combinadas = ABAC. Solo el puesto = RBAC.'),
  c('mac', '4.6', 87, 'Instalación militar: cada persona accede según su nivel de autorización y nadie puede cambiar las etiquetas.', 'Obligatorio (MAC)', 'Basado en reglas', 'Niveles y etiquetas impuestos = MAC.'),
  c('passkey', '4.6', 87, 'Inicio de sesión resistente a phishing, sin que el usuario escriba ni recuerde nada.', 'Passkey', 'OTP', 'Passkey (FIDO2) elimina el secreto escrito. Un OTP se escribe y puede robarse.'),
  c('reuse', '4.6', 87, 'Los empleados usan la misma contraseña en todas las plataformas.', 'Política contra la reutilización de contraseñas', 'Caducidad más frecuente', 'Cambiarla más seguido no evita que la repitan en todos lados.'),
  c('attest', '4.6', 87, 'Los propietarios de los datos revisan y confirman periódicamente quién tiene acceso.', 'Certificación de accesos (attestation)', 'Auditoría regulatoria', 'Revisión periódica INTERNA por los owners = attestation.'),
  c('cope', '4.1', 87, 'La empresa compra el teléfono y permite usarlo también para fines personales.', 'COPE', 'CYOD', 'Corporativo + uso personal habilitado = COPE.'),
  c('cyod', '4.1', 87, 'El empleado elige un modelo de una lista aprobada y la empresa lo compra.', 'CYOD', 'COPE', 'ELIGE de un catálogo = CYOD.'),
  c('tkip', '4.1', 87, 'Equipos antiguos de la fábrica no soportan AES. ¿Qué cifrado inalámbrico es compatible?', 'TKIP', 'CCMP (AES)', 'Compatibilidad con hardware viejo = TKIP (débil, solo por compatibilidad).'),
  c('ediscovery', '4.8', 88, 'Buscar y entregar los correos y documentos relevantes para un juicio.', 'Descubrimiento electrónico (e-discovery)', 'Análisis forense', 'Para un caso LEGAL = e-discovery. Recuperar archivos borrados = forense.'),
  c('preservation', '4.8', 88, 'Mantener la integridad de la evidencia a lo largo del tiempo.', 'Preservación de la evidencia', 'Adquisición', 'Adquisición = hacer la copia. Preservación = que siga íntegra después.'),
  c('detection', '4.8', 88, 'Identificar el incidente y clasificarlo por gravedad.', 'Detección', 'Análisis', 'Detectar y clasificar = detección. Buscar la causa raíz = análisis.'),
  c('ipslogs', '4.9', 88, 'Ver el detalle de las actividades sospechosas detectadas en las últimas semanas.', 'Registros del IPS/IDS', 'Registros del firewall', 'Lo SOSPECHOSO = IPS/IDS. TODAS las conexiones (IP, puerto, acción) = firewall.'),
  c('pcap', '4.9', 88, 'Ver el handshake TLS y las respuestas DNS de una IP externa.', 'Captura de paquetes', 'Registros del firewall', 'Contenido de los paquetes = captura. El firewall solo registra metadatos.'),
  c('dkim', '4.5', 82, 'Los receptores deben comprobar con una firma que el correo no fue alterado.', 'DKIM', 'SPF', 'Firma criptográfica = DKIM. Lista de servidores autorizados = SPF.'),
  c('swg', '4.5', 82, 'Inspeccionar la navegación de los usuarios, incluido el tráfico cifrado, contra malware y fuga de datos.', 'Secure Web Gateway (SWG)', 'NGFW', 'Proxy de seguridad WEB = SWG.'),
  c('behavior', '4.5', 82, 'Aumentan los ataques nuevos que ninguna firma conoce.', 'IPS basado en comportamiento', 'Ajuste de firmas', 'Lo DESCONOCIDO = comportamiento.'),
  c('tuning', '4.5', 82, 'El IPS genera muchos falsos positivos.', 'Ajuste de firmas', 'IPS basado en comportamiento', 'Falsos positivos = AJUSTAR (tuning) las firmas.'),
  c('gpo', '4.5', 82, 'Aplicar una política solo al departamento de marketing en un dominio de Windows.', 'GPO vinculada a la unidad organizativa', 'Política local en cada equipo', 'Administración central por departamento = GPO en la OU.'),
  c('high', '4.3', 89, 'Una vulnerabilidad obtiene un CVSS de 8,1. ¿Qué severidad tiene?', 'High (7.0–8.9)', 'Critical (9.0–10.0)', 'Critical empieza en 9.0. De 7.0 a 8.9 es High.'),
  c('cve', '4.3', 89, '¿Cuál es un identificador CVE válido?', 'CVE-2024-12345', 'AV:N/AC:L/PR:N', 'CVE-AÑO-NÚMERO. "AV:N/AC:L…" es un vector CVSS.'),
  // Domain 5
  c('probability', '5.2', 89, 'Según datos estadísticos, hay un 7 % de posibilidades de que falle el hardware este año.', 'Probabilidad (probability)', 'Verosimilitud (likelihood)', 'NÚMERO estadístico = probability.'),
  c('likelihood', '5.2', 89, 'Un experto califica como "alta" la posibilidad de una filtración.', 'Verosimilitud (likelihood)', 'Probabilidad (probability)', 'Valoración CUALITATIVA (alta/media/baja) = likelihood.'),
  c('tolerance', '5.2', 89, 'El nivel de desviación o exposición que la organización acepta.', 'Tolerancia al riesgo', 'Apetito de riesgo', 'Apetito = cuánto riesgo se PERSIGUE para crecer. Tolerancia = cuánto se ACEPTA.'),
  c('threshold', '5.2', 89, 'El nivel de riesgo a partir del cual la organización debe actuar.', 'Umbral de riesgo', 'Tolerancia al riesgo', 'El punto que DISPARA la acción = umbral.'),
  c('ef', '5.2', 89, 'El porcentaje del valor del activo que se pierde en un incidente.', 'Factor de exposición (EF)', 'SLE', 'EF es el PORCENTAJE. SLE = AV × EF, en dinero.'),
  c('report', '5.2', 89, 'Se presenta a la dirección el estado trimestral de los riesgos y sus cambios.', 'Informe de riesgos', 'Registro de riesgos', 'Registro = la LISTA. Informe = lo que se COMUNICA.'),
  c('onetime', '5.2', 89, 'Evaluación integral en un momento concreto, antes de implementar un sistema nuevo.', 'Evaluación única (one-time)', 'Evaluación ad hoc', 'Ad hoc = reacción ante un EVENTO. One-time = planificada, una sola vez.'),
  c('recurring', '5.2', 89, 'Evaluaciones a intervalos regulares, por ejemplo cada trimestre.', 'Evaluación recurrente', 'Evaluación continua', 'Con intervalos = recurrente. Sin pausa = continua.'),
  c('sox', '5.1', 90, 'Exige controles internos y auditorías sobre la información financiera de empresas que cotizan.', 'SOX', 'FISMA', 'Finanzas de empresas públicas = SOX. Agencias federales = FISMA.'),
  c('ccpa', '5.1', 90, 'Ley de EE. UU. "horizontal" que protege datos personales en todos los sectores, parecida al GDPR.', 'CCPA', 'FISMA', 'Horizontal (todos los sectores) = CCPA. FISMA solo aplica al gobierno federal.'),
  c('iso27001', '5.1', 90, 'Norma CERTIFICABLE para un sistema de gestión de la seguridad de la información.', 'ISO/IEC 27001', 'ISO/IEC 27002', '27001 = SGSI certificable. 27002 = guía de controles.'),
  c('bcp', '5.1', 90, 'Política para mantener TODAS las funciones críticas del negocio durante un desastre.', 'Política de continuidad del negocio', 'Política de recuperación ante desastres', 'Continuidad = el negocio entero sigue funcionando. Recuperación = restaurar TI.'),
  c('sensitive', '5.4', 90, 'Según el GDPR, ¿qué son las creencias religiosas y las opiniones políticas?', 'Datos sensibles (categorías especiales)', 'Datos personales comunes', 'Religión, salud, política, biometría = categorías especiales.'),
  c('fine', '5.4', 90, 'Sanción monetaria por incumplir una norma.', 'Multa', 'Sanción', 'Multa = dinero. Sanción = término general.'),
  c('external', '5.4', 90, 'Informar a reguladores y al público sobre el estado de cumplimiento.', 'Informe de cumplimiento externo', 'Informe de cumplimiento interno', 'Hacia FUERA = externo. A la dirección = interno.'),
  c('owner', '5.1', 91, '¿Quién determina la clasificación de los datos?', 'Propietario de los datos', 'Responsable del tratamiento (controller)', 'Owner = clasifica y decide el acceso. Controller = decide para qué se tratan.'),
  c('processor', '5.1', 91, 'Una empresa procesa nóminas siguiendo las instrucciones de su cliente.', 'Encargado del tratamiento (processor)', 'Responsable del tratamiento (controller)', 'Quien DECIDE = controller. Quien EJECUTA por cuenta de otro = processor.'),
  c('monitoring', '5.3', 91, 'Revisar periódicamente a los proveedores YA contratados.', 'Monitoreo de proveedores', 'Evaluación de proveedores', 'Antes de contratar = evaluación. Después = monitoreo.'),
  c('sow', '5.3', 91, 'Documento con los servicios concretos, plazos y costos de un proyecto del proveedor.', 'SOW', 'MSA', 'MSA = términos generales de la relación. SOW = un trabajo concreto.'),
  c('independent', '5.3', 91, 'Un tercero ajeno a ambas partes revisa la seguridad del proveedor.', 'Evaluación independiente', 'Cláusula de derecho a auditoría', 'La cláusula solo da PERMISO; la evaluación independiente es la revisión en sí.'),
  c('audit', '5.5', 91, 'Una firma externa examina a fondo los controles de la empresa.', 'Auditoría de terceros', 'Atestación', 'Auditoría = el EXAMEN. Atestación = la DECLARACIÓN que resulta.'),
  c('regexam', '5.5', 91, 'Un organismo del gobierno revisa que la empresa cumpla la ley.', 'Examen regulatorio', 'Atestación', 'Lo hace el REGULADOR = examen regulatorio.'),
  c('initialreport', '5.6', 91, 'Apenas detecta tráfico extraño, el analista anota la hora, el origen y el destino.', 'Informe inicial', 'Informe forense', 'Primer reporte del hallazgo = inicial. El forense llega después de investigar.'),
  c('opsec', '5.6', 91, 'Los detalles del lanzamiento solo se comparten con quien necesita saberlos.', 'Seguridad operacional', 'DLP', 'La PRÁCTICA = OPSEC. La herramienta técnica = DLP.'),
  c('spear', '5.6', 91, 'Un correo dirigido al director financiero menciona su nombre y su proyecto actual.', 'Spear phishing', 'Phishing', 'Dirigido a una persona concreta y personalizado = spear phishing.'),
];

export const TRAP_DOMAINS: Record<number, string> = {
  1: 'Conceptos Generales',
  2: 'Amenazas y Mitigaciones',
  3: 'Arquitectura',
  4: 'Operaciones',
  5: 'Gobernanza y Riesgo',
};

export const domainOfCard = (card: TrapCard) => Number(card.obj[0]);
