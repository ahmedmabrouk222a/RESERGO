export type SexType = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type NDISeverity = 'No Disability' | 'Mild' | 'Moderate' | 'Severe' | 'Complete';
export type DASSSeverity = 'Normal' | 'Mild' | 'Moderate' | 'Severe' | 'Extremely Severe';
export type ErgoRiskLevel = 'Low Ergonomic Risk' | 'Moderate Ergonomic Risk' | 'High Ergonomic Risk';

export interface ParticipantDemographics {
  fullName: string;
  age: number | '';
  sex: SexType | '';
  academicMajor: string;
  yearOfStudy: string;
  dailyScreenTime: number | ''; // in hours
  weeklyLabHours: number | '';   // in hours
  vasScore: number;              // 0 to 10 Visual Analog Scale
}

export interface NDIAnswer {
  sectionId: number; // 1 to 10
  sectionName: string;
  selectedOptionIndex: number | null; // 0 to 5, or null if N/A
  isApplicable: boolean; // default true, false if section skipped/N/A
}

export interface DASSAnswer {
  questionNumber: number; // 1 to 21
  score: number; // 0, 1, 2, 3
  category: 'depression' | 'anxiety' | 'stress';
}

export interface ErgoAnswer {
  laptop: number;  // 0, 1, or 2
  posture: number; // 0, 1, or 2
  breaks: number;  // 0, 1, or 2
  chair: number;   // 0, 1, or 2
}

export interface NDIResult {
  totalScore: number;
  maxPossibleScore: number; // 50 normally, or 45 if 1 section N/A
  percentage: number;
  severity: NDISeverity;
}

export interface DASSScaleResult {
  rawScore: number;
  finalScore: number; // rawScore * 2
  maxPossibleScore: number; // 42
  percentage: number;
  severity: DASSSeverity;
}

export interface DASSResult {
  depression: DASSScaleResult;
  anxiety: DASSScaleResult;
  stress: DASSScaleResult;
}

export interface ErgoResult {
  totalScore: number;
  maxPossibleScore: number; // 6
  percentage: number;
  riskLevel: ErgoRiskLevel;
  laptopScore: number;
  postureScore: number;
  breaksScore: number;
  chairScore: number;
}

export interface ParticipantSubmission {
  id: string; // UUID or database key
  participantId: string; // Auto-generated ID (e.g. RES-2026-8812)
  demographics: ParticipantDemographics;
  ndiAnswers: NDIAnswer[];
  dassAnswers: DASSAnswer[];
  ergoAnswers: ErgoAnswer;
  ndiResult: NDIResult;
  dassResult: DASSResult;
  ergoResult: ErgoResult;
  submittedAt: string; // ISO string
  isDemo?: boolean;
}

export type SurveyStep = 'landing' | 'demographics' | 'ndi' | 'ergo' | 'dass' | 'review' | 'confirmation';

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
}
