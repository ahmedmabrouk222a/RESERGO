import type { ParticipantSubmission } from '../types/assessment';

/**
 * Builds standard column headers and row data matrix for research export.
 */
function buildDataMatrix(submissions: ParticipantSubmission[]) {
  const headers = [
    // Demographics
    'Participant ID',
    'Full Name',
    'Age',
    'Sex',
    'Academic Major',
    'Year of Study',
    'Daily Screen Time (hrs)',
    'Weekly Lab/Clinical Hours',
    'VAS Pain Score (0-10)',

    // NDI Summary
    'NDI Total Score',
    'NDI Max Possible (Denominator)',
    'NDI Percentage (%)',
    'NDI Severity Level',

    // NDI Section Breakdown (1-10)
    'NDI Q1 (Pain Intensity)',
    'NDI Q2 (Personal Care)',
    'NDI Q3 (Lifting)',
    'NDI Q4 (Reading)',
    'NDI Q5 (Headaches)',
    'NDI Q6 (Concentration)',
    'NDI Q7 (Work)',
    'NDI Q8 (Driving)',
    'NDI Q9 (Sleeping)',
    'NDI Q10 (Recreation)',

    // Ergonomic Summary & Breakdown
    'Ergonomic Score (0-6)',
    'Ergonomic Risk Percentage (%)',
    'Ergonomic Risk Level',
    'Laptop/Monitor Setup (0-2)',
    'Sitting Posture (0-2)',
    'Work Breaks (0-2)',
    'Chair/Desk (0-2)',

    // DASS-21 Subscales Summary
    'DASS Stress Raw Score (0-21)',
    'DASS Stress Final Score (0-42)',
    'DASS Stress Severity',
    'DASS Depression Raw Score (0-21)',
    'DASS Depression Final Score (0-42)',
    'DASS Depression Severity',
    'DASS Anxiety Raw Score (0-21)',
    'DASS Anxiety Final Score (0-42)',
    'DASS Anxiety Severity',

    // DASS-21 Item Breakdown (1-21)
    'DASS Q1 (S)',
    'DASS Q2 (A)',
    'DASS Q3 (D)',
    'DASS Q4 (A)',
    'DASS Q5 (D)',
    'DASS Q6 (S)',
    'DASS Q7 (A)',
    'DASS Q8 (S)',
    'DASS Q9 (A)',
    'DASS Q10 (D)',
    'DASS Q11 (S)',
    'DASS Q12 (S)',
    'DASS Q13 (D)',
    'DASS Q14 (S)',
    'DASS Q15 (A)',
    'DASS Q16 (D)',
    'DASS Q17 (D)',
    'DASS Q18 (S)',
    'DASS Q19 (A)',
    'DASS Q20 (A)',
    'DASS Q21 (D)',

    // Metadata
    'Submission Date/Time'
  ];

  const rows = submissions.map((sub) => {
    // Helper to extract NDI section scores
    const getNdiScore = (secId: number) => {
      if (!sub.ndiAnswers) return 'N/A';
      const ans = sub.ndiAnswers.find(a => a.sectionId === secId);
      if (!ans || !ans.isApplicable || ans.selectedOptionIndex === null) return 'N/A';
      return ans.selectedOptionIndex;
    };

    // Helper to extract DASS item score
    const getDassScore = (qNum: number) => {
      if (!sub.dassAnswers) return 0;
      const ans = sub.dassAnswers.find(a => a.questionNumber === qNum);
      return ans ? ans.score : 0;
    };

    return [
      sub.participantId,
      sub.demographics?.fullName || '',
      sub.demographics?.age ?? '',
      sub.demographics?.sex || '',
      sub.demographics?.academicMajor || '',
      sub.demographics?.yearOfStudy || '',
      sub.demographics?.dailyScreenTime ?? '',
      sub.demographics?.weeklyLabHours ?? '',
      sub.demographics?.vasScore ?? 0,

      // NDI
      sub.ndiResult?.totalScore ?? 0,
      sub.ndiResult?.maxPossibleScore ?? 50,
      sub.ndiResult?.percentage ?? 0,
      sub.ndiResult?.severity || 'No Disability',

      // NDI Q1-Q10
      getNdiScore(1),
      getNdiScore(2),
      getNdiScore(3),
      getNdiScore(4),
      getNdiScore(5),
      getNdiScore(6),
      getNdiScore(7),
      getNdiScore(8),
      getNdiScore(9),
      getNdiScore(10),

      // Ergonomics
      sub.ergoResult?.totalScore ?? 0,
      sub.ergoResult?.percentage ?? 0,
      sub.ergoResult?.riskLevel || 'Low Ergonomic Risk',
      sub.ergoResult?.laptopScore ?? sub.ergoAnswers?.laptop ?? 0,
      sub.ergoResult?.postureScore ?? sub.ergoAnswers?.posture ?? 0,
      sub.ergoResult?.breaksScore ?? sub.ergoAnswers?.breaks ?? 0,
      sub.ergoResult?.chairScore ?? sub.ergoAnswers?.chair ?? 0,

      // DASS-21 Subscales
      sub.dassResult?.stress?.rawScore ?? 0,
      sub.dassResult?.stress?.finalScore ?? 0,
      sub.dassResult?.stress?.severity || 'Normal',

      sub.dassResult?.depression?.rawScore ?? 0,
      sub.dassResult?.depression?.finalScore ?? 0,
      sub.dassResult?.depression?.severity || 'Normal',

      sub.dassResult?.anxiety?.rawScore ?? 0,
      sub.dassResult?.anxiety?.finalScore ?? 0,
      sub.dassResult?.anxiety?.severity || 'Normal',

      // DASS Q1-Q21
      getDassScore(1),
      getDassScore(2),
      getDassScore(3),
      getDassScore(4),
      getDassScore(5),
      getDassScore(6),
      getDassScore(7),
      getDassScore(8),
      getDassScore(9),
      getDassScore(10),
      getDassScore(11),
      getDassScore(12),
      getDassScore(13),
      getDassScore(14),
      getDassScore(15),
      getDassScore(16),
      getDassScore(17),
      getDassScore(18),
      getDassScore(19),
      getDassScore(20),
      getDassScore(21),

      // Submission time
      sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : ''
    ];
  });

  return { headers, rows };
}

/**
 * Converts array of participant submissions into a CSV blob for download.
 * Embedded with UTF-8 BOM (\uFEFF) to guarantee proper Arabic display in Excel.
 */
export function exportToCSV(submissions: ParticipantSubmission[], filename: string = 'research_assessment_data.csv') {
  if (!submissions || submissions.length === 0) return;

  const { headers, rows } = buildDataMatrix(submissions);

  const formattedRows = rows.map(row => 
    row.map(cell => {
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(',')
  );

  const csvContent = [headers.join(','), ...formattedRows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads data in formatted Excel (.xls) format with styled headers and UTF-8 encoding.
 */
export function exportToExcel(submissions: ParticipantSubmission[], filename: string = 'research_assessment_data.xls') {
  if (!submissions || submissions.length === 0) return;

  const { headers, rows } = buildDataMatrix(submissions);

  const htmlContent = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8"/>
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>Assessment Data</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    body { font-family: Calibri, Arial, sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    th { background-color: #0f766e; color: #ffffff; font-weight: bold; border: 1px solid #0d9488; padding: 8px 12px; text-align: left; }
    td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 12px; }
    tr:nth-child(even) { background-color: #f8fafc; }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>
        ${headers.map(h => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows.map(row => `
        <tr>
          ${row.map(cell => `<td>${cell !== null && cell !== undefined ? String(cell) : ''}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
`;

  const blob = new Blob(['\uFEFF' + htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.xls') ? filename : `${filename}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

