import type { ErgoAnswer, ErgoResult, ErgoRiskLevel } from '../../types/assessment';

/**
 * Calculates Ergonomic Risk score, max score, percentage, and risk level.
 * 
 * Formula: Total Ergonomic Risk Score = LAPTOP + POSTURE + BREAKS + CHAIR
 * Maximum score = 6
 * Percentage = (Total Score / 6) * 100
 * 
 * Classification:
 * - 0–2 = Low Ergonomic Risk
 * - 3–4 = Moderate Ergonomic Risk
 * - 5–6 = High Ergonomic Risk
 */
export function calculateErgonomicRisk(answers: ErgoAnswer): ErgoResult {
  const laptopScore = answers.laptop || 0;
  const postureScore = answers.posture || 0;
  const breaksScore = answers.breaks || 0;
  const chairScore = answers.chair || 0;

  const totalScore = laptopScore + postureScore + breaksScore + chairScore;
  const maxPossibleScore = 6;
  const percentage = Math.round((totalScore / maxPossibleScore) * 100 * 10) / 10;

  let riskLevel: ErgoRiskLevel = 'Low Ergonomic Risk';
  if (totalScore >= 5) {
    riskLevel = 'High Ergonomic Risk';
  } else if (totalScore >= 3) {
    riskLevel = 'Moderate Ergonomic Risk';
  } else {
    riskLevel = 'Low Ergonomic Risk';
  }

  return {
    totalScore,
    maxPossibleScore,
    percentage,
    riskLevel,
    laptopScore,
    postureScore,
    breaksScore,
    chairScore,
  };
}
