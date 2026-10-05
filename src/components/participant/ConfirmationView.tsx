import React, { useState } from 'react';
import type { ParticipantSubmission } from '../../types/assessment';
import { CheckCircle2, Hash, Eye, EyeOff, RefreshCw, FileCheck2, Activity, Monitor, Brain, Table } from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';
import { ProgressBar } from '../common/ProgressBar';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';

interface ConfirmationViewProps {
  submission: ParticipantSubmission;
  onRestart: () => void;
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  submission,
  onRestart,
}) => {
  const [showSummary, setShowSummary] = useState(false);
  const [showCutoffs, setShowCutoffs] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Success Card */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10 text-teal-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assessment Submitted Successfully
          </h1>
          <p className="text-slate-600 text-sm max-w-lg mx-auto">
            Your questionnaire responses have been encrypted, scored, and securely recorded into the research database.
          </p>
        </div>

        {/* Auto Generated Participant ID Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 text-white font-mono text-base font-bold shadow-md">
          <Hash className="w-5 h-5 text-teal-400" />
          <span>Participant ID: {submission.participantId}</span>
        </div>

        <MedicalDisclaimer />

        {/* Toggle View Results Summary */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            {showSummary ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-teal-600" />}
            <span>{showSummary ? 'Hide Results Summary' : 'View Basic Results Summary'}</span>
          </button>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Submit Another Assessment</span>
          </button>
        </div>

        {/* Basic Participant Result Summary */}
        {showSummary && (
          <div className="pt-6 border-t border-slate-200 text-left space-y-6 animate-in fade-in duration-300">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-teal-600" />
              <span>Assessment Results Summary</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* NDI */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-teal-600" />
                      <span>NDI Index</span>
                    </h4>
                    <p className="text-slate-500 text-[11px] mt-0.5 font-semibold">
                      {submission.ndiResult.totalScore} / {submission.ndiResult.maxPossibleScore} ({submission.ndiResult.percentage}%)
                    </p>
                  </div>
                  <SeverityBadge type="ndi" level={submission.ndiResult.severity} size="sm" />
                </div>
                <ProgressBar value={submission.ndiResult.percentage} colorVariant="teal" showPercentage={false} height="sm" />
              </div>

              {/* Ergonomic */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-teal-600" />
                      <span>Ergonomic Risk</span>
                    </h4>
                    <p className="text-slate-500 text-[11px] mt-0.5 font-semibold">
                      {submission.ergoResult.totalScore} / {submission.ergoResult.maxPossibleScore} ({submission.ergoResult.percentage}%)
                    </p>
                  </div>
                  <SeverityBadge type="ergo" level={submission.ergoResult.riskLevel} size="sm" />
                </div>
                <ProgressBar value={submission.ergoResult.percentage} colorVariant="emerald" showPercentage={false} height="sm" />
              </div>

              {/* DASS-21 Summary with Numerical Scores (No division or percentage) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-600" />
                  <span>DASS-21 Scales</span>
                </h4>
                <div className="space-y-2 text-[11px]">
                  {/* Depression */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-700">Depression: </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {submission.dassResult.depression.finalScore}
                      </span>
                    </div>
                    <SeverityBadge type="depression" level={submission.dassResult.depression.severity} size="sm" />
                  </div>

                  {/* Anxiety */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-700">Anxiety: </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {submission.dassResult.anxiety.finalScore}
                      </span>
                    </div>
                    <SeverityBadge type="anxiety" level={submission.dassResult.anxiety.severity} size="sm" />
                  </div>

                  {/* Stress */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-700">Stress: </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {submission.dassResult.stress.finalScore}
                      </span>
                    </div>
                    <SeverityBadge type="stress" level={submission.dassResult.stress.severity} size="sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable DASS-21 Cut-Off Ranges Reference Table */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowCutoffs(!showCutoffs)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                <Table className="w-3.5 h-3.5 text-indigo-600" />
                <span>{showCutoffs ? 'Hide DASS-21 Cut-off Ranges Table' : 'Show DASS-21 Cut-off Ranges Table (Reference)'}</span>
              </button>

              {showCutoffs && (
                <div className="mt-3 overflow-x-auto bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-xs">
                  <p className="text-[11px] text-slate-400 mb-2 font-medium">
                    * Final DASS-21 score = Raw sum × 2 (Maximum score = 42). Recommended cut-off scores:
                  </p>
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-700 text-teal-400">
                        <th className="py-1.5 px-3">Severity Rating</th>
                        <th className="py-1.5 px-3">Depression</th>
                        <th className="py-1.5 px-3">Anxiety</th>
                        <th className="py-1.5 px-3">Stress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-emerald-400">Normal</td>
                        <td className="py-1.5 px-3">0 – 9</td>
                        <td className="py-1.5 px-3">0 – 7</td>
                        <td className="py-1.5 px-3">0 – 14</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-amber-400">Mild</td>
                        <td className="py-1.5 px-3">10 – 13</td>
                        <td className="py-1.5 px-3">8 – 9</td>
                        <td className="py-1.5 px-3">15 – 18</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-orange-400">Moderate</td>
                        <td className="py-1.5 px-3">14 – 20</td>
                        <td className="py-1.5 px-3">10 – 14</td>
                        <td className="py-1.5 px-3">19 – 25</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-rose-400">Severe</td>
                        <td className="py-1.5 px-3">21 – 27</td>
                        <td className="py-1.5 px-3">15 – 19</td>
                        <td className="py-1.5 px-3">26 – 33</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 px-3 font-semibold text-red-500">Extremely Severe</td>
                        <td className="py-1.5 px-3">28+</td>
                        <td className="py-1.5 px-3">20+</td>
                        <td className="py-1.5 px-3">34+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
