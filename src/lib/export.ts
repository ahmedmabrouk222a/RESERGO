import type { ParticipantSubmission } from '../types/assessment';

/**
 * Converts array of participant submissions into a CSV blob for download.
 * Formats columns matching standard clinical research data matrices.
 */
export function exportToCSV(submissions: ParticipantSubmission[], filename: string = 'research_assessment_data.csv') {
  if (!submissions || submissions.length === 0) return;

  const headers = [
    'Participant ID',
    'Full Name',
    'Age',
    'Sex',
    'Academic Major',
    'Year of Study',
    'Average Daily Screen Time (hrs)',
    'Average Weekly Lab/Clinical Hours',
    'VAS Pain Score (0-10)',
    'NDI Raw Score',
    'NDI Max Score',
    'NDI Percentage (%)',
    'NDI Severity Level',
    'DASS Stress Raw',
    'DASS Stress Final Score (0-42)',
    'DASS Stress Percentage (%)',
    'DASS Stress Severity',
    'DASS Depression Raw',
    'DASS Depression Final Score (0-42)',
    'DASS Depression Percentage (%)',
    'DASS Depression Severity',
    'DASS Anxiety Raw',
    'DASS Anxiety Final Score (0-42)',
    'DASS Anxiety Percentage (%)',
    'DASS Anxiety Severity',
    'Ergonomic Risk Raw Score (0-6)',
    'Ergonomic Risk Max',
    'Ergonomic Risk Percentage (%)',
    'Ergonomic Risk Level',
    'Laptop Score',
    'Posture Score',
    'Breaks Score',
    'Chair Score',
    'Submission Date/Time'
  ];

  const rows = submissions.map((sub) => [
    `"${sub.participantId}"`,
    `"${sub.demographics.fullName.replace(/"/g, '""')}"`,
    sub.demographics.age,
    `"${sub.demographics.sex}"`,
    `"${sub.demographics.academicMajor.replace(/"/g, '""')}"`,
    `"${sub.demographics.yearOfStudy}"`,
    sub.demographics.dailyScreenTime,
    sub.demographics.weeklyLabHours,
    sub.demographics.vasScore,
    sub.ndiResult.totalScore,
    sub.ndiResult.maxPossibleScore,
    sub.ndiResult.percentage,
    `"${sub.ndiResult.severity}"`,
    sub.dassResult.stress.rawScore,
    sub.dassResult.stress.finalScore,
    sub.dassResult.stress.percentage,
    `"${sub.dassResult.stress.severity}"`,
    sub.dassResult.depression.rawScore,
    sub.dassResult.depression.finalScore,
    sub.dassResult.depression.percentage,
    `"${sub.dassResult.depression.severity}"`,
    sub.dassResult.anxiety.rawScore,
    sub.dassResult.anxiety.finalScore,
    sub.dassResult.anxiety.percentage,
    `"${sub.dassResult.anxiety.severity}"`,
    sub.ergoResult.totalScore,
    sub.ergoResult.maxPossibleScore,
    sub.ergoResult.percentage,
    `"${sub.ergoResult.riskLevel}"`,
    sub.ergoResult.laptopScore,
    sub.ergoResult.postureScore,
    sub.ergoResult.breaksScore,
    sub.ergoResult.chairScore,
    `"${new Date(sub.submittedAt).toLocaleString()}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads data in Excel-compatible tab-separated format (.xls)
 */
export function exportToExcel(submissions: ParticipantSubmission[], filename: string = 'research_assessment_data.xls') {
  if (!submissions || submissions.length === 0) return;

  const headers = [
    'Participant ID', 'Full Name', 'Age', 'Sex', 'Academic Major', 'Year of Study',
    'Daily Screen Time (hrs)', 'Weekly Lab/Clinical Hours', 'VAS Pain Score',
    'NDI Score', 'NDI Max', 'NDI %', 'NDI Severity',
    'Stress Score', 'Stress %', 'Stress Severity',
    'Depression Score', 'Depression %', 'Depression Severity',
    'Anxiety Score', 'Anxiety %', 'Anxiety Severity',
    'Ergonomic Score', 'Ergonomic %', 'Ergonomic Risk Level',
    'Laptop Score', 'Posture Score', 'Breaks Score', 'Chair Score',
    'Submitted At'
  ];

  const rows = submissions.map(sub => [
    sub.participantId,
    sub.demographics.fullName,
    sub.demographics.age,
    sub.demographics.sex,
    sub.demographics.academicMajor,
    sub.demographics.yearOfStudy,
    sub.demographics.dailyScreenTime,
    sub.demographics.weeklyLabHours,
    sub.demographics.vasScore,
    `${sub.ndiResult.totalScore}/${sub.ndiResult.maxPossibleScore}`,
    sub.ndiResult.maxPossibleScore,
    `${sub.ndiResult.percentage}%`,
    sub.ndiResult.severity,
    `${sub.dassResult.stress.finalScore}/42`,
    `${sub.dassResult.stress.percentage}%`,
    sub.dassResult.stress.severity,
    `${sub.dassResult.depression.finalScore}/42`,
    `${sub.dassResult.depression.percentage}%`,
    sub.dassResult.depression.severity,
    `${sub.dassResult.anxiety.finalScore}/42`,
    `${sub.dassResult.anxiety.percentage}%`,
    sub.dassResult.anxiety.severity,
    `${sub.ergoResult.totalScore}/6`,
    `${sub.ergoResult.percentage}%`,
    sub.ergoResult.riskLevel,
    sub.ergoResult.laptopScore,
    sub.ergoResult.postureScore,
    sub.ergoResult.breaksScore,
    sub.ergoResult.chairScore,
    new Date(sub.submittedAt).toLocaleString()
  ]);

  const tsvContent = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
  const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
