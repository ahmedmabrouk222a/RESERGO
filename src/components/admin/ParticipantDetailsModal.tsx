import React, { useState } from 'react';
import type { ParticipantSubmission } from '../../types/assessment';
import { NDI_SECTIONS } from '../../data/ndiQuestions';
import { ERGO_QUESTIONS } from '../../data/ergoQuestions';
import { DASS_QUESTIONS, DASS_RATING_OPTIONS } from '../../data/dassQuestions';
import { X, User, Activity, Monitor, Brain, Printer } from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';
import { ProgressBar } from '../common/ProgressBar';

interface ParticipantDetailsModalProps {
  submission: ParticipantSubmission | null;
  onClose: () => void;
}

export const ParticipantDetailsModal: React.FC<ParticipantDetailsModalProps> = ({
  submission,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ndi' | 'ergo' | 'dass'>('overview');

  if (!submission) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold font-mono">
              <User className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">{submission.demographics.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-950 text-teal-300 border border-teal-800">
                  {submission.participantId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {submission.demographics.academicMajor} • {submission.demographics.yearOfStudy} • {submission.demographics.sex} ({submission.demographics.age} yrs)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors no-print"
              title="Print Participant Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors no-print"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Inner Tabs Header */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex gap-2 shrink-0 no-print">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Summary
          </button>
          <button
            onClick={() => setActiveTab('ndi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ndi' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NDI Sections (10)
          </button>
          <button
            onClick={() => setActiveTab('ergo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ergo' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ergonomic Factors (4)
          </button>
          <button
            onClick={() => setActiveTab('dass')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dass' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            DASS-21 Items (21)
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: OVERVIEW & SUMMARY */}
          {(activeTab === 'overview' || activeTab === 'ndi') && (
            <div className="space-y-6">
              {/* Demographics Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-200 pb-2">
                  <User className="w-4 h-4 text-teal-600" />
                  <span>Personal Demographic Profile</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Participant ID</span>
                    <span className="font-mono font-bold text-slate-900">{submission.participantId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Full Name</span>
                    <span className="font-bold text-slate-900">{submission.demographics.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Age & Sex</span>
                    <span className="font-semibold text-slate-900">{submission.demographics.age} yrs • {submission.demographics.sex}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Academic Major</span>
                    <span className="font-semibold text-slate-900">{submission.demographics.academicMajor}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Year of Study</span>
                    <span className="font-semibold text-slate-900">{submission.demographics.yearOfStudy}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Daily Screen Time</span>
                    <span className="font-semibold text-slate-900">{submission.demographics.dailyScreenTime} Hours / Day</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Lab / Clinical Hours</span>
                    <span className="font-semibold text-slate-900">{submission.demographics.weeklyLabHours} Hours / Week</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">VAS Pain Score</span>
                    <span className="font-extrabold text-teal-700 text-sm">{submission.demographics.vasScore} / 10</span>
                  </div>
                </div>
              </div>

              {/* Assessment Score Results Header Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* NDI Result Card */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-teal-600" />
                        <span>NDI Index</span>
                      </h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Score: <strong>{submission.ndiResult.totalScore}</strong> / {submission.ndiResult.maxPossibleScore}
                      </p>
                    </div>
                    <SeverityBadge type="ndi" level={submission.ndiResult.severity} />
                  </div>
                  <ProgressBar value={submission.ndiResult.percentage} colorVariant="teal" />
                </div>

                {/* Ergonomic Result Card */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Monitor className="w-4 h-4 text-emerald-600" />
                        <span>Ergonomic Risk</span>
                      </h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Score: <strong>{submission.ergoResult.totalScore}</strong> / {submission.ergoResult.maxPossibleScore}
                      </p>
                    </div>
                    <SeverityBadge type="ergo" level={submission.ergoResult.riskLevel} />
                  </div>
                  <ProgressBar value={submission.ergoResult.percentage} colorVariant="emerald" />
                </div>

                {/* DASS Summary Overview */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-indigo-600" />
                    <span>DASS-21 Summary</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Depression (Score: <strong>{submission.dassResult.depression.finalScore}</strong>):</span>
                      <SeverityBadge type="depression" level={submission.dassResult.depression.severity} size="sm" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Anxiety (Score: <strong>{submission.dassResult.anxiety.finalScore}</strong>):</span>
                      <SeverityBadge type="anxiety" level={submission.dassResult.anxiety.severity} size="sm" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Stress (Score: <strong>{submission.dassResult.stress.finalScore}</strong>):</span>
                      <SeverityBadge type="stress" level={submission.dassResult.stress.severity} size="sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* DASS-21 3 Separate Cards (Requirement 14) */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <span>DASS-21 Subscale Detailed Calculations</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Depression Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Depression</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Score: <strong className="text-sm text-slate-900">{submission.dassResult.depression.finalScore}</strong>
                        </p>
                      </div>
                      <SeverityBadge type="depression" level={submission.dassResult.depression.severity} size="sm" />
                    </div>
                  </div>

                  {/* Anxiety Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Anxiety</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Score: <strong className="text-sm text-slate-900">{submission.dassResult.anxiety.finalScore}</strong>
                        </p>
                      </div>
                      <SeverityBadge type="anxiety" level={submission.dassResult.anxiety.severity} size="sm" />
                    </div>
                  </div>

                  {/* Stress Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Stress</h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Score: <strong className="text-sm text-slate-900">{submission.dassResult.stress.finalScore}</strong>
                        </p>
                      </div>
                      <SeverityBadge type="stress" level={submission.dassResult.stress.severity} size="sm" />
                    </div>
                  </div>
                </div>

                {/* DASS-21 Cut-Off Scores Reference Table */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2 text-xs">
                  <h4 className="font-bold text-teal-400 text-xs uppercase tracking-wider">
                    DASS-21 Clinical Severity Cut-Off Scores Reference Table (Multiply Raw x2)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="py-1 px-3">Severity Category</th>
                          <th className="py-1 px-3">Depression (0-42)</th>
                          <th className="py-1 px-3">Anxiety (0-42)</th>
                          <th className="py-1 px-3">Stress (0-42)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200">
                        <tr>
                          <td className="py-1 px-3 font-semibold text-emerald-400">Normal</td>
                          <td className="py-1 px-3">0 – 9</td>
                          <td className="py-1 px-3">0 – 7</td>
                          <td className="py-1 px-3">0 – 14</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-3 font-semibold text-amber-400">Mild</td>
                          <td className="py-1 px-3">10 – 13</td>
                          <td className="py-1 px-3">8 – 9</td>
                          <td className="py-1 px-3">15 – 18</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-3 font-semibold text-orange-400">Moderate</td>
                          <td className="py-1 px-3">14 – 20</td>
                          <td className="py-1 px-3">10 – 14</td>
                          <td className="py-1 px-3">19 – 25</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-3 font-semibold text-rose-400">Severe</td>
                          <td className="py-1 px-3">21 – 27</td>
                          <td className="py-1 px-3">15 – 19</td>
                          <td className="py-1 px-3">26 – 33</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-3 font-semibold text-red-500">Extremely Severe</td>
                          <td className="py-1 px-3">28+</td>
                          <td className="py-1 px-3">20+</td>
                          <td className="py-1 px-3">34+</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NDI Granular Breakdown */}
          {activeTab === 'ndi' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>NDI Section Answers & Ratings</span>
                <span className="text-xs text-slate-500">
                  Total Score: {submission.ndiResult.totalScore} / {submission.ndiResult.maxPossibleScore} ({submission.ndiResult.percentage}%)
                </span>
              </h3>

              <div className="space-y-3">
                {NDI_SECTIONS.map((sec) => {
                  const ans = submission.ndiAnswers.find(a => a.sectionId === sec.id);
                  const selectedOpt = ans?.isApplicable && ans.selectedOptionIndex !== null
                    ? sec.options.find(o => o.score === ans.selectedOptionIndex)
                    : null;

                  return (
                    <div key={sec.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-xs">{sec.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ans?.isApplicable ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {ans?.isApplicable ? `Score: ${ans.selectedOptionIndex}` : 'Section N/A'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                        {selectedOpt ? selectedOpt.label : 'Section excluded by participant (Not applicable)'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ERGONOMIC Granular Breakdown */}
          {activeTab === 'ergo' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Ergonomic Risk Factor Ratings</span>
                <span className="text-xs text-slate-500">
                  Total Risk Score: {submission.ergoResult.totalScore} / 6 ({submission.ergoResult.percentage}%)
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ERGO_QUESTIONS.map((q) => {
                  const score = submission.ergoAnswers[q.key];
                  const opt = q.options.find(o => o.score === score);

                  return (
                    <div key={q.key} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-slate-900 text-xs">{q.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          score === 0 ? 'bg-emerald-100 text-emerald-800' : score === 1 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          Score: {score} / 2
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800">{opt?.label}</p>
                      <p className="text-[11px] text-slate-500">{opt?.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: DASS-21 Granular Item List */}
          {activeTab === 'dass' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">All 21 DASS-21 Individual Item Responses</h3>

              <div className="space-y-2">
                {DASS_QUESTIONS.map((q) => {
                  const ans = submission.dassAnswers.find(a => a.questionNumber === q.id);
                  const score = ans ? ans.score : 0;
                  const label = DASS_RATING_OPTIONS.find(o => o.value === score)?.label.split('= ')[1];

                  return (
                    <div key={q.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center shrink-0">
                          {q.id}
                        </span>
                        <span className="font-medium text-slate-800">{q.text}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {q.category}
                        </span>
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                          Rating {score}: {label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
