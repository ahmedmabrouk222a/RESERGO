import type { NDIAnswer, NDIResult, NDISeverity } from '../../types/assessment';

/**
 * Calculates the Neck Disability Index (NDI) raw score, max score, percentage, and severity.
 * 
 * Rules:
 * - 10 sections total, each scored 0-5.
 * - Standard max score = 50.
 * - If 1 section is missing/not applicable, the maximum possible score becomes 45.
 * - Percentage = (Total Score / Max Score) * 100
 * 
 * Severities:
 * - 0–8% = No Disability
 * - 10–28% = Mild
 * - 30–48% = Moderate
 * - 50–68% = Severe
 * - 70–100% = Complete
 */
export function calculateNDI(answers: NDIAnswer[]): NDIResult {
  let totalScore = 0;
  let applicableSections = 0;

  answers.forEach((ans) => {
    if (ans.isApplicable && ans.selectedOptionIndex !== null && ans.selectedOptionIndex >= 0) {
      totalScore += ans.selectedOptionIndex;
      applicableSections += 1;
    }
  });

  // Default max is 50 for 10 sections, or (applicableSections * 5)
  const maxPossibleScore = applicableSections > 0 ? applicableSections * 5 : 50;
  const rawPercentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  const percentage = Math.round(rawPercentage * 10) / 10; // 1 decimal place

  let severity: NDISeverity = 'No Disability';
  if (percentage >= 70) {
    severity = 'Complete';
  } else if (percentage >= 50) {
    severity = 'Severe';
  } else if (percentage >= 30) {
    severity = 'Moderate';
  } else if (percentage >= 9) {
    severity = 'Mild';
  } else {
    severity = 'No Disability';
  }

  return {
    totalScore,
    maxPossibleScore,
    percentage,
    severity,
  };
}
