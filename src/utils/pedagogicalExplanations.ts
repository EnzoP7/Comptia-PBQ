import { PartialCreditItem, PBQItem, PBQExplanationData, ItemExplanation } from '../types/pbq';

export interface ContextualPedagogicalExplanation {
  itemId: string;
  itemLabel: string;
  pointsObtained: number;
  maxPoints: number;
  isFullyAchieved: boolean;
  conceptDefinition: string;
  whyFailedAndCorrectChoice: string;
  sy0701Relevance: string;
  examTrapWarning: string;
}

/**
 * Normalizes strings for keyword matching.
 */
function cleanText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

/**
 * Generates or extracts a contextual pedagogical explanation for an evaluated item,
 * specifically emphasizing what went wrong, what the right configuration is,
 * and how it links to CompTIA Security+ SY0-701 objectives.
 */
export function getPedagogicalExplanationForItem(
  item: PartialCreditItem,
  currentPBQ?: PBQItem,
  explanationData?: PBQExplanationData | null
): ContextualPedagogicalExplanation {
  const isFullyAchieved = item.achieved && item.points === item.maxPoints;
  const labelWords = cleanText(item.label).split(/\s+/).filter((w) => w.length > 3);

  // Try to find matching item in the PBQ explanation glossary
  let matchedGlossaryItem: ItemExplanation | undefined;
  if (explanationData?.itemsGlossary && explanationData.itemsGlossary.length > 0) {
    matchedGlossaryItem = explanationData.itemsGlossary.find((glossaryItem) => {
      const gName = cleanText(glossaryItem.name);
      const gDef = cleanText(glossaryItem.definition);
      // Check if any significant word of the item label is in the glossary name
      return labelWords.some((w) => gName.includes(w) || gDef.includes(w));
    });
  }

  // 1. Concept Definition
  let conceptDefinition = '';
  if (matchedGlossaryItem?.definition) {
    conceptDefinition = matchedGlossaryItem.definition;
  } else {
    conceptDefinition = `Control o directiva de seguridad evaluada en "${item.label}". Representa una configuración estándar dentro de las líneas base de endurecimiento de CompTIA Security+.`;
  }

  // 2. Why failed and correct choice
  let whyFailedAndCorrectChoice = '';
  if (isFullyAchieved) {
    whyFailedAndCorrectChoice = item.explanation.startsWith('Correcto')
      ? item.explanation
      : `Configuración correcta: Cumple con la directiva requerida para "${item.label}". ${item.explanation}`;
  } else {
    if (matchedGlossaryItem?.whyCorrectOrRole) {
      whyFailedAndCorrectChoice = `${item.explanation} Solución correcta esperada: ${matchedGlossaryItem.whyCorrectOrRole}`;
    } else {
      whyFailedAndCorrectChoice = item.explanation.startsWith('Incorrecto') || item.explanation.startsWith('Parcial')
        ? item.explanation
        : `Acción incorrecta o incompleta: Se requería aplicar la directiva estricta para "${item.label}". ${item.explanation}`;
    }
  }

  // 3. CompTIA SY0-701 Relevance
  let sy0701Relevance = '';
  const objective = currentPBQ?.sy0701Objective || 'CompTIA Security+ SY0-701';
  const domain = currentPBQ?.domain || 'Arquitectura y Operaciones de Seguridad';

  sy0701Relevance = `${objective} (${domain}). CompTIA evalúa esta competencia para verificar que el candidato no implemente protocolos permisivos ni asuma configuraciones por defecto, exigiendo la aplicación estricta de defensa en profundidad y menor privilegio (Least Privilege).`;

  // 4. Exam Trap Warning
  let examTrapWarning = '';
  if (matchedGlossaryItem?.distractorWarning) {
    examTrapWarning = matchedGlossaryItem.distractorWarning;
  } else if (currentPBQ?.tacticalTip) {
    examTrapWarning = currentPBQ.tacticalTip;
  } else {
    examTrapWarning = 'Trampa común en el examen: CompTIA frecuentemente incluye opciones con protocolos heredados en texto claro (ej. HTTP, Telnet, SNMPv1/v2) o permisos "Full Control" como distractores plausibles.';
  }

  return {
    itemId: item.id,
    itemLabel: item.label,
    pointsObtained: item.points,
    maxPoints: item.maxPoints,
    isFullyAchieved,
    conceptDefinition,
    whyFailedAndCorrectChoice,
    sy0701Relevance,
    examTrapWarning,
  };
}
