import { EvaluationResult, MatrixAnswers, MatrixColumn, MatrixPbqConfig, PartialCreditItem } from '../types/pbq';

const normalizeTyped = (v: string) => v.trim().toLowerCase().replace(/\s+/g, '');

/** Typed answers accept any of the alternatives listed as "a|b"; list answers must match exactly. */
function cellCorrect(col: MatrixColumn, given: string | undefined, expected: string): boolean {
  if (!given) return false;
  if (!col.freeText) return given === expected;
  return expected.split('|').some((alt) => normalizeTyped(alt) === normalizeTyped(given));
}

/** Partial credit per cell: every correctly classified cell is worth the same. */
export function evaluateMatrix(config: MatrixPbqConfig, answers: MatrixAnswers): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];
  const cellCount = config.sections.reduce((acc, s) => acc + s.rows.length * s.columns.length, 0) || 1;
  const perCell = 100 / cellCount;
  let correctCells = 0;
  let totalCells = 0;

  for (const section of config.sections) {
    section.rows.forEach((row, idx) => {
      const missed: string[] = [];
      let rowCorrect = 0;
      for (const col of section.columns) {
        totalCells++;
        if (cellCorrect(col, answers[row.id]?.[col.id], row.answers[col.id])) {
          rowCorrect++;
        } else {
          const labelOf = (v: string | undefined) => col.options.find((o) => o.value === v)?.label ?? (col.freeText ? v?.split('|')[0] : v);
          const chosen = answers[row.id]?.[col.id];
          missed.push(`${col.label}: elegiste "${chosen ? labelOf(chosen) : 'sin respuesta'}" — correcto: "${labelOf(row.answers[col.id])}"`);
        }
      }
      correctCells += rowCorrect;
      breakdown.push({
        id: row.id,
        label: `${section.title} #${idx + 1}: ${row.prompt}`,
        achieved: missed.length === 0,
        points: rowCorrect * perCell,
        maxPoints: section.columns.length * perCell,
        explanation: missed.length === 0
          ? `Correcto. ${row.explanation}`
          : `${missed.join(' · ')}. ${row.explanation}`,
      });
    });
  }

  const totalScore = totalCells ? Math.round((correctCells / totalCells) * 100) : 0;
  return {
    totalScore,
    passed: totalScore >= 75,
    partialCreditBreakdown: breakdown,
    detailedFeedback:
      totalScore === 100
        ? 'Clasificación perfecta. Dominas la terminología exacta que CompTIA usa en este objetivo.'
        : `Clasificaste correctamente ${correctCells} de ${totalCells} casillas. Revisa las explicaciones: en el examen las opciones incorrectas suelen ser conceptos vecinos del mismo objetivo.`,
    sy0701Objective: '',
    domainName: '',
  };
}
