export * from './ndi';
export * from './dass21';
export * from './ergonomic';

import { calculateNDI } from './ndi';
import { calculateDASS21 } from './dass21';
import { calculateErgonomicRisk } from './ergonomic';
import type { NDIAnswer, DASSAnswer, ErgoAnswer, NDIResult, DASSResult, ErgoResult } from '../../types/assessment';

export interface CompleteAssessmentResults {
  ndiResult: NDIResult;
  dassResult: DASSResult;
  ergoResult: ErgoResult;
}

export function calculateAllResults(
  ndiAnswers: NDIAnswer[],
  dassAnswers: DASSAnswer[],
  ergoAnswers: ErgoAnswer
): CompleteAssessmentResults {
  return {
    ndiResult: calculateNDI(ndiAnswers),
    dassResult: calculateDASS21(dassAnswers),
    ergoResult: calculateErgonomicRisk(ergoAnswers),
  };
}
