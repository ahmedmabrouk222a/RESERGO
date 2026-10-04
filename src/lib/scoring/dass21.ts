import type { DASSAnswer, DASSResult, DASSScaleResult, DASSSeverity } from '../../types/assessment';

// Standard DASS-21 Question Mappings
export const DEPRESSION_QUESTIONS = [3, 5, 10, 13, 16, 17, 21];
export const ANXIETY_QUESTIONS = [2, 4, 7, 9, 15, 19, 20];
export const STRESS_QUESTIONS = [1, 6, 8, 11, 12, 14, 18];

/**
 * Calculates DASS-21 subscale scores and severity levels.
 * 
 * Rules:
 * - Each item scored 0 to 3.
 * - Raw sum of 7 items per scale (range 0 to 21).
 * - Final Score = Raw Score * 2 (range 0 to 42).
 * - Percentage = (Final Score / 42) * 100.
 */

function calculateDepressionSeverity(score: number): DASSSeverity {
  if (score >= 28) return 'Extremely Severe';
  if (score >= 21) return 'Severe';
  if (score >= 14) return 'Moderate';
  if (score >= 10) return 'Mild';
  return 'Normal';
}

function calculateAnxietySeverity(score: number): DASSSeverity {
  if (score >= 20) return 'Extremely Severe';
  if (score >= 15) return 'Severe';
  if (score >= 10) return 'Moderate';
  if (score >= 8) return 'Mild';
  return 'Normal';
}

function calculateStressSeverity(score: number): DASSSeverity {
  if (score >= 34) return 'Extremely Severe';
  if (score >= 26) return 'Severe';
  if (score >= 19) return 'Moderate';
  if (score >= 15) return 'Mild';
  return 'Normal';
}

export function calculateDASS21(answers: DASSAnswer[]): DASSResult {
  let depRaw = 0;
  let anxRaw = 0;
  let strRaw = 0;

  const answerMap = new Map<number, number>();
  answers.forEach((ans) => {
    answerMap.set(ans.questionNumber, ans.score);
  });

  DEPRESSION_QUESTIONS.forEach((qNum) => {
    depRaw += answerMap.get(qNum) || 0;
  });

  ANXIETY_QUESTIONS.forEach((qNum) => {
    anxRaw += answerMap.get(qNum) || 0;
  });

  STRESS_QUESTIONS.forEach((qNum) => {
    strRaw += answerMap.get(qNum) || 0;
  });

  const depFinal = depRaw * 2;
  const anxFinal = anxRaw * 2;
  const strFinal = strRaw * 2;

  const depPercentage = Math.round((depFinal / 42) * 100 * 10) / 10;
  const anxPercentage = Math.round((anxFinal / 42) * 100 * 10) / 10;
  const strPercentage = Math.round((strFinal / 42) * 100 * 10) / 10;

  const depression: DASSScaleResult = {
    rawScore: depRaw,
    finalScore: depFinal,
    maxPossibleScore: 42,
    percentage: depPercentage,
    severity: calculateDepressionSeverity(depFinal),
  };

  const anxiety: DASSScaleResult = {
    rawScore: anxRaw,
    finalScore: anxFinal,
    maxPossibleScore: 42,
    percentage: anxPercentage,
    severity: calculateAnxietySeverity(anxFinal),
  };

  const stress: DASSScaleResult = {
    rawScore: strRaw,
    finalScore: strFinal,
    maxPossibleScore: 42,
    percentage: strPercentage,
    severity: calculateStressSeverity(strFinal),
  };

  return {
    depression,
    anxiety,
    stress,
  };
}
