import React from 'react';
import type { ParticipantSubmission } from '../../types/assessment';
import { Users, Activity, Monitor, Brain, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';
import { ProgressBar } from '../common/ProgressBar';

interface OverviewTabProps {
  submissions: ParticipantSubmission[];
  onViewParticipant: (sub: ParticipantSubmission) => void;
  onNavigateToParticipants: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  submissions,
  onViewParticipant,
  onNavigateToParticipants,
}) => {
  const total = submissions.length;

  if (total === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
        <Users className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">No Participant Submissions Yet</h3>
        <p className="text-slate-500 text-xs max-w-sm mx-auto">
          Submissions will appear here automatically once participants complete the research questionnaire.
        </p>
      </div>
    );
  }

  // Calculate Averages
  const avgNDI = Math.round((submissions.reduce((acc, s) => acc + s.ndiResult.percentage, 0) / total) * 10) / 10;
  const avgErgo = Math.round((submissions.reduce((acc, s) => acc + s.ergoResult.percentage, 0) / total) * 10) / 10;
  const avgDepression = Math.round((submissions.reduce((acc, s) => acc + s.dassResult.depression.finalScore, 0) / total) * 10) / 10;
  const avgAnxiety = Math.round((submissions.reduce((acc, s) => acc + s.dassResult.anxiety.finalScore, 0) / total) * 10) / 10;
  const avgStress = Math.round((submissions.reduce((acc, s) => acc + s.dassResult.stress.finalScore, 0) / total) * 10) / 10;

  // High Risk Participants count
  const highRiskCount = submissions.filter(s =>
    s.ergoResult.riskLevel === 'High Ergonomic Risk' ||
    ['Severe', 'Complete'].includes(s.ndiResult.severity) ||
    ['Severe', 'Extremely Severe'].includes(s.dassResult.depression.severity) ||
    ['Severe', 'Extremely Severe'].includes(s.dassResult.anxiety.severity) ||
    ['Severe', 'Extremely Severe'].includes(s.dassResult.stress.severity)
  ).length;

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Research Analytics Overview</h1>
          <p className="text-xs text-slate-500 mt-1">Aggregate cohort performance metrics across NDI, Ergonomics, and DASS-21 scales.</p>
        </div>
        <button
          onClick={onNavigateToParticipants}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>View All {total} Participants</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Participants */}
        <div
          onClick={onNavigateToParticipants}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>Total Participants</span>
            <Users className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{total}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Enrolled
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Validated research submissions</p>
        </div>

        {/* Avg NDI */}
        <div
          onClick={onNavigateToParticipants}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>Average NDI Index</span>
            <Activity className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{avgNDI}%</span>
            <span className="text-xs text-slate-500 font-medium">Score</span>
          </div>
          <ProgressBar value={avgNDI} colorVariant="teal" showPercentage={false} height="sm" />
        </div>

        {/* Avg Ergo Risk */}
        <div
          onClick={onNavigateToParticipants}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>Avg Ergonomic Risk</span>
            <Monitor className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{avgErgo}%</span>
            <span className="text-xs text-slate-500 font-medium">Index</span>
          </div>
          <ProgressBar value={avgErgo} colorVariant="emerald" showPercentage={false} height="sm" />
        </div>

        {/* High Risk Participants */}
        <div
          onClick={onNavigateToParticipants}
          className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-card hover:shadow-card-hover transition-all cursor-pointer space-y-2 group bg-gradient-to-br from-white to-rose-50/30"
        >
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
            <span className="font-semibold text-rose-900">High Risk Cohort</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-700">{highRiskCount}</span>
            <span className="text-xs text-rose-600 font-semibold">
              ({Math.round((highRiskCount / total) * 100)}% of cohort)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Requires ergonomics/clinical review</p>
        </div>
      </div>

      {/* DASS-21 Subscale Cohort Mean Scores */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-600" />
          <span>DASS-21 Subscale Cohort Mean Scores</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Depression */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800">Depression Mean</span>
              <span className="font-extrabold text-indigo-700 text-base">{avgDepression}</span>
            </div>
            <p className="text-[11px] text-slate-500">Cohort mean score (Scale 0–42)</p>
          </div>

          {/* Anxiety */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800">Anxiety Mean</span>
              <span className="font-extrabold text-amber-700 text-base">{avgAnxiety}</span>
            </div>
            <p className="text-[11px] text-slate-500">Cohort mean score (Scale 0–42)</p>
          </div>

          {/* Stress */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800">Stress Mean</span>
              <span className="font-extrabold text-rose-700 text-base">{avgStress}</span>
            </div>
            <p className="text-[11px] text-slate-500">Cohort mean score (Scale 0–42)</p>
          </div>
        </div>
      </div>

      {/* Recent Submissions List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Recent Research Submissions</h3>
          <span className="text-xs text-slate-500">Showing latest {Math.min(5, total)} entries</span>
        </div>

        <div className="divide-y divide-slate-100">
          {submissions.slice(0, 5).map((sub) => (
            <div
              key={sub.id}
              onClick={() => onViewParticipant(sub)}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                  {sub.participantId.split('-')[2]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{sub.demographics.fullName}</h4>
                  <p className="text-xs text-slate-500">
                    {sub.demographics.academicMajor} • {sub.demographics.yearOfStudy} • {sub.demographics.sex}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">NDI Index</span>
                  <SeverityBadge type="ndi" level={sub.ndiResult.severity} size="sm" />
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Ergonomic</span>
                  <SeverityBadge type="ergo" level={sub.ergoResult.riskLevel} size="sm" />
                </div>

                <div className="text-right hidden md:block">
                  <span className="text-[11px] text-slate-400 block">Stress</span>
                  <SeverityBadge type="stress" level={sub.dassResult.stress.severity} size="sm" />
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewParticipant(sub);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
