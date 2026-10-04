import type { ParticipantSubmission } from '../types/assessment';
import { calculateNDI } from '../lib/scoring/ndi';
import { calculateDASS21 } from '../lib/scoring/dass21';
import { calculateErgonomicRisk } from '../lib/scoring/ergonomic';

// Helper to create valid submission with exact scoring
function createDemoSubmission(
  idNum: number,
  name: string,
  age: number,
  sex: 'Male' | 'Female' | 'Other',
  major: string,
  year: string,
  screenTime: number,
  labHours: number,
  vas: number,
  ndiScores: number[],
  dassScores: Record<number, number>, // qNum -> score
  ergo: { laptop: number; posture: number; breaks: number; chair: number },
  dateStr: string
): ParticipantSubmission {
  const ndiAnswers = ndiScores.map((score, idx) => ({
    sectionId: idx + 1,
    sectionName: `Section ${idx + 1}`,
    selectedOptionIndex: score,
    isApplicable: true,
  }));

  const dassAnswers = Array.from({ length: 21 }, (_, idx) => {
    const qNum = idx + 1;
    let cat: 'depression' | 'anxiety' | 'stress' = 'stress';
    if ([3, 5, 10, 13, 16, 17, 21].includes(qNum)) cat = 'depression';
    else if ([2, 4, 7, 9, 15, 19, 20].includes(qNum)) cat = 'anxiety';
    
    return {
      questionNumber: qNum,
      score: dassScores[qNum] ?? 1,
      category: cat,
    };
  });

  const ndiResult = calculateNDI(ndiAnswers);
  const dassResult = calculateDASS21(dassAnswers);
  const ergoResult = calculateErgonomicRisk(ergo);

  return {
    id: `demo-uuid-${idNum}`,
    participantId: `RES-2026-${1000 + idNum}`,
    demographics: {
      fullName: name,
      age,
      sex,
      academicMajor: major,
      yearOfStudy: year,
      dailyScreenTime: screenTime,
      weeklyLabHours: labHours,
      vasScore: vas,
    },
    ndiAnswers,
    dassAnswers,
    ergoAnswers: ergo,
    ndiResult,
    dassResult,
    ergoResult,
    submittedAt: dateStr,
    isDemo: true,
  };
}

export const INITIAL_DEMO_PARTICIPANTS: ParticipantSubmission[] = [
  createDemoSubmission(
    1,
    "Sarah Al-Mansoor",
    23,
    "Female",
    "Physical Therapy",
    "Year 4",
    9.5,
    18,
    7,
    [3, 2, 4, 3, 3, 2, 3, 2, 4, 3], // Total 29/50 (58% Severe)
    { 1:2, 2:1, 3:3, 4:2, 5:2, 6:3, 7:1, 8:3, 9:2, 10:3, 11:2, 12:3, 13:3, 14:2, 15:2, 16:2, 17:2, 18:2, 19:1, 20:1, 21:2 },
    { laptop: 2, posture: 2, breaks: 1, chair: 1 }, // Ergo 6/6 (High)
    "2026-10-01T09:30:00.000Z"
  ),
  createDemoSubmission(
    2,
    "Marcus Chen",
    21,
    "Male",
    "Medicine (MD)",
    "Year 3",
    11.0,
    24,
    5,
    [2, 1, 2, 2, 2, 2, 1, 2, 2, 2], // Total 18/50 (36% Moderate)
    { 1:3, 2:2, 3:1, 4:1, 5:2, 6:2, 7:1, 8:3, 9:1, 10:1, 11:2, 12:3, 13:2, 14:2, 15:1, 16:1, 17:1, 18:2, 19:2, 20:1, 21:1 },
    { laptop: 1, posture: 2, breaks: 2, chair: 1 }, // Ergo 6/6 (High)
    "2026-10-01T14:15:00.000Z"
  ),
  createDemoSubmission(
    3,
    "Elena Rostova",
    22,
    "Female",
    "Nursing",
    "Year 3",
    6.5,
    14,
    2,
    [1, 0, 1, 1, 0, 1, 0, 0, 1, 1], // Total 6/50 (12% Mild)
    { 1:1, 2:0, 3:0, 4:0, 5:1, 6:1, 7:0, 8:1, 9:0, 10:0, 11:1, 12:1, 13:0, 14:0, 15:0, 16:0, 17:0, 18:1, 19:0, 20:0, 21:0 },
    { laptop: 0, posture: 1, breaks: 0, chair: 1 }, // Ergo 2/6 (Low)
    "2026-10-02T10:05:00.000Z"
  ),
  createDemoSubmission(
    4,
    "Tariq Al-Farsi",
    25,
    "Male",
    "Dentistry",
    "Year 5",
    8.0,
    28,
    8,
    [4, 3, 4, 3, 4, 3, 4, 3, 4, 3], // Total 35/50 (70% Complete)
    { 1:3, 2:3, 3:2, 4:3, 5:3, 6:3, 7:2, 8:3, 9:3, 10:2, 11:3, 12:3, 13:3, 14:3, 15:2, 16:3, 17:2, 18:3, 19:2, 20:2, 21:3 },
    { laptop: 2, posture: 2, breaks: 2, chair: 2 }, // Ergo 6/6 (High)
    "2026-10-02T16:45:00.000Z"
  ),
  createDemoSubmission(
    5,
    "Aisha Patel",
    20,
    "Female",
    "Pharmacy",
    "Year 2",
    7.5,
    10,
    1,
    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0], // Total 2/50 (4% No Disability)
    { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0, 12:0, 13:0, 14:0, 15:0, 16:0, 17:0, 18:0, 19:0, 20:0, 21:0 },
    { laptop: 0, posture: 0, breaks: 0, chair: 0 }, // Ergo 0/6 (Low)
    "2026-10-03T11:20:00.000Z"
  ),
  createDemoSubmission(
    6,
    "David Miller",
    24,
    "Male",
    "Biomedical Engineering",
    "Year 4",
    12.0,
    15,
    6,
    [2, 2, 3, 2, 3, 2, 2, 2, 3, 2], // Total 23/50 (46% Moderate)
    { 1:2, 2:1, 3:2, 4:1, 5:2, 6:2, 7:1, 8:2, 9:1, 10:2, 11:2, 12:2, 13:2, 14:2, 15:1, 16:2, 17:1, 18:2, 19:1, 20:1, 21:2 },
    { laptop: 2, posture: 1, breaks: 2, chair: 1 }, // Ergo 6/6 (High)
    "2026-10-03T15:30:00.000Z"
  ),
  createDemoSubmission(
    7,
    "Noura Ibrahim",
    22,
    "Female",
    "Medicine (MD)",
    "Year 4",
    10.0,
    22,
    4,
    [1, 1, 2, 1, 2, 1, 1, 1, 2, 1], // Total 13/50 (26% Mild)
    { 1:3, 2:1, 3:1, 4:1, 5:2, 6:3, 7:0, 8:2, 9:1, 10:1, 11:3, 12:3, 13:1, 14:2, 15:1, 16:1, 17:1, 18:2, 19:1, 20:0, 21:1 },
    { laptop: 1, posture: 1, breaks: 1, chair: 1 }, // Ergo 4/6 (Moderate)
    "2026-10-04T08:50:00.000Z"
  ),
  createDemoSubmission(
    8,
    "James Wilson",
    21,
    "Male",
    "Physical Therapy",
    "Year 2",
    8.5,
    12,
    3,
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Total 10/50 (20% Mild)
    { 1:1, 2:1, 3:0, 4:0, 5:1, 6:1, 7:0, 8:1, 9:1, 10:0, 11:1, 12:1, 13:0, 14:1, 15:0, 16:0, 17:0, 18:1, 19:0, 20:0, 21:0 },
    { laptop: 1, posture: 1, breaks: 0, chair: 1 }, // Ergo 3/6 (Moderate)
    "2026-10-04T12:00:00.000Z"
  ),
  createDemoSubmission(
    9,
    "Fatima Al-Hassan",
    23,
    "Female",
    "Occupational Therapy",
    "Year 4",
    9.0,
    16,
    6,
    [3, 2, 3, 2, 3, 2, 2, 2, 3, 2], // Total 24/50 (48% Moderate)
    { 1:2, 2:2, 3:2, 4:2, 5:2, 6:2, 7:2, 8:2, 9:2, 10:2, 11:2, 12:2, 13:2, 14:2, 15:2, 16:2, 17:2, 18:2, 19:2, 20:2, 21:2 },
    { laptop: 2, posture: 2, breaks: 1, chair: 1 }, // Ergo 6/6 (High)
    "2026-10-04T14:40:00.000Z"
  ),
  createDemoSubmission(
    10,
    "Lucas Schmidt",
    26,
    "Male",
    "Medicine (MD)",
    "Year 5",
    13.0,
    30,
    9,
    [4, 4, 3, 4, 3, 4, 4, 3, 4, 3], // Total 36/50 (72% Complete)
    { 1:3, 2:3, 3:3, 4:3, 5:3, 6:3, 7:3, 8:3, 9:3, 10:3, 11:3, 12:3, 13:3, 14:3, 15:3, 16:3, 17:3, 18:3, 19:3, 20:3, 21:3 },
    { laptop: 2, posture: 2, breaks: 2, chair: 2 }, // Ergo 6/6 (High)
    "2026-10-04T17:10:00.000Z"
  )
];
