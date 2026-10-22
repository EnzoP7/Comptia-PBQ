/**
 * Official CompTIA Security+ SY0-701 exam objectives (v5.0) and domain weights.
 * Single source of truth for domain statistics and PBQ objective labels.
 */

export type DomainId = 1 | 2 | 3 | 4 | 5;

export interface DomainInfo {
  id: DomainId;
  name: string;
  shortName: string;
  weight: number;
}

export const SY0701_DOMAINS: DomainInfo[] = [
  { id: 1, name: 'Dominio 1: Conceptos Generales de Seguridad', shortName: 'D1: Conceptos Generales', weight: 0.12 },
  { id: 2, name: 'Dominio 2: Amenazas, Vulnerabilidades y Mitigaciones', shortName: 'D2: Amenazas & Mitigaciones', weight: 0.22 },
  { id: 3, name: 'Dominio 3: Arquitectura de Seguridad', shortName: 'D3: Arquitectura', weight: 0.18 },
  { id: 4, name: 'Dominio 4: Operaciones de Seguridad', shortName: 'D4: Operaciones', weight: 0.28 },
  { id: 5, name: 'Dominio 5: Gestión y Supervisión del Programa de Seguridad', shortName: 'D5: Gestión del Programa', weight: 0.2 },
];

export const SY0701_OBJECTIVES: Record<string, string> = {
  '1.1': 'Comparar y contrastar varios tipos de controles de seguridad.',
  '1.2': 'Resumir conceptos fundamentales de seguridad.',
  '1.3': 'Explicar la importancia de los procesos de gestión de cambios y su impacto en la seguridad.',
  '1.4': 'Explicar la importancia de usar soluciones criptográficas apropiadas.',
  '2.1': 'Comparar y contrastar actores de amenaza y motivaciones comunes.',
  '2.2': 'Explicar vectores de amenaza y superficies de ataque comunes.',
  '2.3': 'Explicar varios tipos de vulnerabilidades.',
  '2.4': 'Dado un escenario, analizar indicadores de actividad maliciosa.',
  '2.5': 'Explicar el propósito de las técnicas de mitigación usadas para asegurar la empresa.',
  '3.1': 'Comparar y contrastar las implicaciones de seguridad de distintos modelos de arquitectura.',
  '3.2': 'Dado un escenario, aplicar principios de seguridad para asegurar la infraestructura empresarial.',
  '3.3': 'Comparar y contrastar conceptos y estrategias para proteger los datos.',
  '3.4': 'Explicar la importancia de la resiliencia y la recuperación en la arquitectura de seguridad.',
  '4.1': 'Dado un escenario, aplicar técnicas de seguridad comunes a los recursos informáticos.',
  '4.2': 'Explicar las implicaciones de seguridad de la gestión de activos de hardware, software y datos.',
  '4.3': 'Explicar las actividades asociadas con la gestión de vulnerabilidades.',
  '4.4': 'Explicar conceptos y herramientas de alertas y monitoreo de seguridad.',
  '4.5': 'Dado un escenario, modificar las capacidades empresariales para mejorar la seguridad.',
  '4.6': 'Dado un escenario, implementar y mantener la gestión de identidades y accesos.',
  '4.7': 'Explicar la importancia de la automatización y orquestación en las operaciones seguras.',
  '4.8': 'Explicar las actividades apropiadas de respuesta a incidentes.',
  '4.9': 'Dado un escenario, usar fuentes de datos para apoyar una investigación.',
  '5.1': 'Resumir los elementos de una gobernanza de seguridad eficaz.',
  '5.2': 'Explicar los elementos del proceso de gestión de riesgos.',
  '5.3': 'Explicar los procesos de evaluación y gestión de riesgos de terceros.',
  '5.4': 'Resumir los elementos de un cumplimiento de seguridad eficaz.',
  '5.5': 'Explicar los tipos y propósitos de auditorías y evaluaciones.',
  '5.6': 'Dado un escenario, implementar prácticas de concienciación en seguridad.',
};

export function formatObjective(primary: string, secondary: string[] = []): string {
  const base = `Objetivo ${primary}: ${SY0701_OBJECTIVES[primary]}`;
  return secondary.length ? `${base} (relacionado: ${secondary.join(', ')})` : base;
}

export function domainNameFor(objective: string): string {
  const id = Number(objective.split('.')[0]) as DomainId;
  return SY0701_DOMAINS.find((d) => d.id === id)!.name;
}

/** Extracts the primary domain id from a PBQ domain label ("Dominio N: ..."). */
export function getDomainId(domainLabel: string): DomainId {
  const match = domainLabel.match(/Dominio (\d)/);
  return (match ? Number(match[1]) : 4) as DomainId;
}
