import type { ParticipantSubmission } from '../types/assessment';

/**
 * Builds standard column headers and row data matrix matching DOC-20261003-WA0009.xlsx layout.
 */
function buildDataMatrix(submissions: ParticipantSubmission[]) {
  const headers = [
    // Demographics (matching DOC-20261003-WA0009.xlsx exact headers)
    'Participant ID',
    'Name',
    'Age',
    'Sex',
    'Academic Magor',
    'Year OF Study',
    'Average daily screen time ',
    'Average weakly hours spent in lab/clinicals rotations ',
    'VAS',

    // Main Assessment Summaries
    'NDI',
    'DASS21 - Stress',
    'DASS21 - Depression',
    'DASS21 - Anxiety',
    'Ergonomics and behavioral ',

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

    // Ergonomic Items
    'Laptop/Monitor Setup (0-2)',
    'Sitting Posture (0-2)',
    'Work Breaks (0-2)',
    'Chair/Desk (0-2)',

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
    const getNdiScore = (secId: number) => {
      if (!sub.ndiAnswers) return 'N/A';
      const ans = sub.ndiAnswers.find(a => a.sectionId === secId);
      if (!ans || !ans.isApplicable || ans.selectedOptionIndex === null) return 'N/A';
      return ans.selectedOptionIndex;
    };

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

      // Summaries matching DOC-20261003-WA0009.xlsx
      `${sub.ndiResult?.totalScore ?? 0}/${sub.ndiResult?.maxPossibleScore ?? 50} (${sub.ndiResult?.percentage ?? 0}%) - ${sub.ndiResult?.severity || 'No Disability'}`,
      `${sub.dassResult?.stress?.finalScore ?? 0} [${sub.dassResult?.stress?.severity || 'Normal'}]`,
      `${sub.dassResult?.depression?.finalScore ?? 0} [${sub.dassResult?.depression?.severity || 'Normal'}]`,
      `${sub.dassResult?.anxiety?.finalScore ?? 0} [${sub.dassResult?.anxiety?.severity || 'Normal'}]`,
      `${sub.ergoResult?.totalScore ?? 0}/6 (${sub.ergoResult?.percentage ?? 0}%) - ${sub.ergoResult?.riskLevel || 'Low Ergonomic Risk'}`,

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

      // Ergonomics items
      sub.ergoResult?.laptopScore ?? sub.ergoAnswers?.laptop ?? 0,
      sub.ergoResult?.postureScore ?? sub.ergoAnswers?.posture ?? 0,
      sub.ergoResult?.breaksScore ?? sub.ergoAnswers?.breaks ?? 0,
      sub.ergoResult?.chairScore ?? sub.ergoAnswers?.chair ?? 0,

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
export function exportToCSV(submissions: ParticipantSubmission[], filename: string = 'DOC-20261003-WA0009_export.csv') {
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
 * Downloads data in formatted Excel (.xls) format matching DOC-20261003-WA0009.xlsx
 * with 2-tier styled headers and UTF-8 encoding.
 */
export function exportToExcel(submissions: ParticipantSubmission[], filename: string = 'DOC-20261003-WA0009_export.xls') {
  if (!submissions || submissions.length === 0) return;

  const getNdiScore = (sub: ParticipantSubmission, secId: number) => {
    if (!sub.ndiAnswers) return 'N/A';
    const ans = sub.ndiAnswers.find(a => a.sectionId === secId);
    if (!ans || !ans.isApplicable || ans.selectedOptionIndex === null) return 'N/A';
    return ans.selectedOptionIndex;
  };

  const getDassScore = (sub: ParticipantSubmission, qNum: number) => {
    if (!sub.dassAnswers) return 0;
    const ans = sub.dassAnswers.find(a => a.questionNumber === qNum);
    return ans ? ans.score : 0;
  };

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
    th { background-color: #0f766e; color: #ffffff; font-weight: bold; border: 1px solid #0d9488; padding: 8px 12px; text-align: center; vertical-align: middle; }
    th.sub-header { background-color: #14b8a6; color: #ffffff; font-weight: bold; border: 1px solid #0d9488; padding: 6px 10px; font-size: 11px; }
    td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 12px; text-align: left; }
    tr:nth-child(even) { background-color: #f8fafc; }
  </style>
</head>
<body>
  <table>
    <thead>
      <!-- Tier 1 Header matching DOC-20261003-WA0009.xlsx -->
      <tr>
        <th rowspan="2">Participant ID</th>
        <th rowspan="2">Name</th>
        <th rowspan="2">Age</th>
        <th rowspan="2">Sex</th>
        <th rowspan="2">Academic Magor</th>
        <th rowspan="2">Year OF Study</th>
        <th rowspan="2">Average daily screen time</th>
        <th rowspan="2">Average weakly hours spent in lab/clinicals rotations</th>
        <th rowspan="2">VAS</th>
        <th rowspan="2">NDI</th>
        <th colspan="3" style="text-align: center;">DASS21</th>
        <th rowspan="2">Ergonomics and behavioral</th>
        <th colspan="10" style="text-align: center;">NDI Section Scores (1-10)</th>
        <th colspan="4" style="text-align: center;">Ergonomics Items (0-2)</th>
        <th colspan="21" style="text-align: center;">DASS21 Question Items (Q1-Q21)</th>
        <th rowspan="2">Submission Date/Time</th>
      </tr>

      <!-- Tier 2 Sub-headers -->
      <tr>
        <th class="sub-header">Stress</th>
        <th class="sub-header">Depression</th>
        <th class="sub-header">Anxiety</th>

        <!-- NDI Q1-Q10 -->
        <th class="sub-header">Q1 (Pain)</th>
        <th class="sub-header">Q2 (Care)</th>
        <th class="sub-header">Q3 (Lifting)</th>
        <th class="sub-header">Q4 (Reading)</th>
        <th class="sub-header">Q5 (Headache)</th>
        <th class="sub-header">Q6 (Concentration)</th>
        <th class="sub-header">Q7 (Work)</th>
        <th class="sub-header">Q8 (Driving)</th>
        <th class="sub-header">Q9 (Sleeping)</th>
        <th class="sub-header">Q10 (Recreation)</th>

        <!-- Ergo -->
        <th class="sub-header">Laptop</th>
        <th class="sub-header">Posture</th>
        <th class="sub-header">Breaks</th>
        <th class="sub-header">Chair</th>

        <!-- DASS Q1-Q21 -->
        <th class="sub-header">Q1 (S)</th>
        <th class="sub-header">Q2 (A)</th>
        <th class="sub-header">Q3 (D)</th>
        <th class="sub-header">Q4 (A)</th>
        <th class="sub-header">Q5 (D)</th>
        <th class="sub-header">Q6 (S)</th>
        <th class="sub-header">Q7 (A)</th>
        <th class="sub-header">Q8 (S)</th>
        <th class="sub-header">Q9 (A)</th>
        <th class="sub-header">Q10 (D)</th>
        <th class="sub-header">Q11 (S)</th>
        <th class="sub-header">Q12 (S)</th>
        <th class="sub-header">Q13 (D)</th>
        <th class="sub-header">Q14 (S)</th>
        <th class="sub-header">Q15 (A)</th>
        <th class="sub-header">Q16 (D)</th>
        <th class="sub-header">Q17 (D)</th>
        <th class="sub-header">Q18 (S)</th>
        <th class="sub-header">Q19 (A)</th>
        <th class="sub-header">Q20 (A)</th>
        <th class="sub-header">Q21 (D)</th>
      </tr>
    </thead>
    <tbody>
      ${submissions.map(sub => `
        <tr>
          <td>${sub.participantId}</td>
          <td>${sub.demographics?.fullName || ''}</td>
          <td>${sub.demographics?.age ?? ''}</td>
          <td>${sub.demographics?.sex || ''}</td>
          <td>${sub.demographics?.academicMajor || ''}</td>
          <td>${sub.demographics?.yearOfStudy || ''}</td>
          <td>${sub.demographics?.dailyScreenTime ?? ''}</td>
          <td>${sub.demographics?.weeklyLabHours ?? ''}</td>
          <td>${sub.demographics?.vasScore ?? 0}</td>

          <!-- Main Assessment Summaries -->
          <td>${sub.ndiResult?.totalScore ?? 0}/${sub.ndiResult?.maxPossibleScore ?? 50} (${sub.ndiResult?.percentage ?? 0}%) - ${sub.ndiResult?.severity || 'No Disability'}</td>
          <td>${sub.dassResult?.stress?.finalScore ?? 0} [${sub.dassResult?.stress?.severity || 'Normal'}]</td>
          <td>${sub.dassResult?.depression?.finalScore ?? 0} [${sub.dassResult?.depression?.severity || 'Normal'}]</td>
          <td>${sub.dassResult?.anxiety?.finalScore ?? 0} [${sub.dassResult?.anxiety?.severity || 'Normal'}]</td>
          <td>${sub.ergoResult?.totalScore ?? 0}/6 (${sub.ergoResult?.percentage ?? 0}%) - ${sub.ergoResult?.riskLevel || 'Low Ergonomic Risk'}</td>

          <!-- NDI Section Scores -->
          <td>${getNdiScore(sub, 1)}</td>
          <td>${getNdiScore(sub, 2)}</td>
          <td>${getNdiScore(sub, 3)}</td>
          <td>${getNdiScore(sub, 4)}</td>
          <td>${getNdiScore(sub, 5)}</td>
          <td>${getNdiScore(sub, 6)}</td>
          <td>${getNdiScore(sub, 7)}</td>
          <td>${getNdiScore(sub, 8)}</td>
          <td>${getNdiScore(sub, 9)}</td>
          <td>${getNdiScore(sub, 10)}</td>

          <!-- Ergonomics items -->
          <td>${sub.ergoResult?.laptopScore ?? sub.ergoAnswers?.laptop ?? 0}</td>
          <td>${sub.ergoResult?.postureScore ?? sub.ergoAnswers?.posture ?? 0}</td>
          <td>${sub.ergoResult?.breaksScore ?? sub.ergoAnswers?.breaks ?? 0}</td>
          <td>${sub.ergoResult?.chairScore ?? sub.ergoAnswers?.chair ?? 0}</td>

          <!-- DASS Q1-Q21 -->
          <td>${getDassScore(sub, 1)}</td>
          <td>${getDassScore(sub, 2)}</td>
          <td>${getDassScore(sub, 3)}</td>
          <td>${getDassScore(sub, 4)}</td>
          <td>${getDassScore(sub, 5)}</td>
          <td>${getDassScore(sub, 6)}</td>
          <td>${getDassScore(sub, 7)}</td>
          <td>${getDassScore(sub, 8)}</td>
          <td>${getDassScore(sub, 9)}</td>
          <td>${getDassScore(sub, 10)}</td>
          <td>${getDassScore(sub, 11)}</td>
          <td>${getDassScore(sub, 12)}</td>
          <td>${getDassScore(sub, 13)}</td>
          <td>${getDassScore(sub, 14)}</td>
          <td>${getDassScore(sub, 15)}</td>
          <td>${getDassScore(sub, 16)}</td>
          <td>${getDassScore(sub, 17)}</td>
          <td>${getDassScore(sub, 18)}</td>
          <td>${getDassScore(sub, 19)}</td>
          <td>${getDassScore(sub, 20)}</td>
          <td>${getDassScore(sub, 21)}</td>

          <!-- Submission time -->
          <td>${sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : ''}</td>
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


