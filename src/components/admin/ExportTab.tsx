import React from 'react';
import type { ParticipantSubmission } from '../../types/assessment';
import { Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

interface ExportTabProps {
  submissions: ParticipantSubmission[];
  onExportCSV: () => void;
  onExportExcel: () => void;
}

export const ExportTab: React.FC<ExportTabProps> = ({
  submissions,
  onExportCSV,
  onExportExcel,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Research Data Export Center</h1>
        <p className="text-xs text-slate-500 mt-1">
          Export raw questionnaire responses and calculated metrics in standardized research data structures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Export Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Export CSV Matrix</h3>
            <p className="text-slate-500 text-xs mt-1">
              Comma-separated data matrix containing all participant demographics, raw item responses, and calculated NDI, Ergo, and DASS scores.
            </p>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Compatible with SPSS, R, Python, and Stata</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>UTF-8 encoded for international character sets</span>
            </li>
          </ul>
          <button
            onClick={onExportCSV}
            disabled={submissions.length === 0}
            className="w-full py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download Research CSV ({submissions.length} Records)</span>
          </button>
        </div>

        {/* Excel Export Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Export Excel Workbook</h3>
            <p className="text-slate-500 text-xs mt-1">
              Formatted tabular spreadsheet workbook matching standard clinical research data matrices.
            </p>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Includes raw response columns & calculated percentages</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tabular header structure ready for manuscript reporting</span>
            </li>
          </ul>
          <button
            onClick={onExportExcel}
            disabled={submissions.length === 0}
            className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download Excel Workbook (.xls)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
