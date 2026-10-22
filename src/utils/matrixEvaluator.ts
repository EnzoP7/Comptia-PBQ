import { EvaluationResult, MatrixAnswers, MatrixPbqConfig, PartialCreditItem } from '../types/pbq';

const truncate = (text: string, max = 70) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

/** Partial credit per cell: every correctly classified cell is worth the same. */
export function evaluateMatrix(config: MatrixPbqConfig, answers: MatrixAnswers): EvaluationResult {
  const breakdown: PartialCreditItem[] = [];
  let correctCells = 0;
  let totalCells = 0;

  for (const section of config.sections) {
    section.rows.forEach((row, idx) => {
      const missed: string[] = [];
      let rowCorrect = 0;
      for (const col of section.columns) {
        totalCells++;
        if (answers[row.id]?.[col.id] === row.answers[col.id]) {
          rowCorrect++;
        } else {
          const label = col.options.find((o) => o.value === row.answers[col.id])?.label ?? row.answers[col.id];
          missed.push(`${col.label}: ${label}`);
        }
      }
      correctCells += rowCorrect;
      breakdown.push({
        id: row.id,
        label: `${section.title} #${idx + 1}: ${truncate(row.prompt)}`,
        achieved: missed.length === 0,
        points: rowCorrect,
        maxPoints: section.columns.length,
        explanation: missed.length === 0
          ? `Correcto. ${row.explanation}`
          : `Respuesta correcta → ${missed.join(' | ')}. ${row.explanation}`,
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
