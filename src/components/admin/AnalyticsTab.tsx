import React from 'react';
import type { ParticipantSubmission } from '../../types/assessment';
import { Activity, Monitor, Brain, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

interface AnalyticsTabProps {
  submissions: ParticipantSubmission[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ submissions }) => {
  const total = submissions.length;

  if (total === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
        <BarChart3 className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">No Analytics Available Yet</h3>
        <p className="text-slate-500 text-xs">Analytics will automatically populate once participant submissions are recorded.</p>
      </div>
    );
  }

  // 1. Calculate Mean Averages
  const avgNDI = Math.round((submissions.reduce((acc, s) => acc + s.ndiResult.percentage, 0) / total) * 10) / 10;
  const avgErgo = Math.round((submissions.reduce((acc, s) => acc + s.ergoResult.percentage, 0) / total) * 10) / 10;
  const avgDepression = Math.round((submissions.reduce((acc, s) => acc + s.dassResult.depression.percentage, 0) / total) * 10) / 10;
  const avgAnxiety = Math.round((submissions.reduce((acc, s) => acc + s.dassResult.anxiety.percentage, 0) / total) * 10) / 10;
  const avgStress = Math.round((submissions.reduce((acc, s) => acc + s.dassResult.stress.percentage, 0) / total) * 10) / 10;

  // 2. NDI Severity Distribution Data
  const ndiDistMap: Record<string, number> = { 'No Disability': 0, 'Mild': 0, 'Moderate': 0, 'Severe': 0, 'Complete': 0 };
  submissions.forEach(s => { ndiDistMap[s.ndiResult.severity] = (ndiDistMap[s.ndiResult.severity] || 0) + 1; });
  const ndiChartData = Object.keys(ndiDistMap).map(k => ({ name: k, count: ndiDistMap[k] }));

  // 3. Ergonomic Risk Distribution Data
  const ergoDistMap: Record<string, number> = { 'Low Ergonomic Risk': 0, 'Moderate Ergonomic Risk': 0, 'High Ergonomic Risk': 0 };
  submissions.forEach(s => { ergoDistMap[s.ergoResult.riskLevel] = (ergoDistMap[s.ergoResult.riskLevel] || 0) + 1; });
  const ergoChartData = Object.keys(ergoDistMap).map(k => ({ name: k.replace(' Ergonomic Risk', ''), count: ergoDistMap[k] }));

  // 4-6. DASS Subscales Severity Distribution Data
  const stressDistMap: Record<string, number> = { 'Normal': 0, 'Mild': 0, 'Moderate': 0, 'Severe': 0, 'Extremely Severe': 0 };
  submissions.forEach(s => { stressDistMap[s.dassResult.stress.severity] = (stressDistMap[s.dassResult.stress.severity] || 0) + 1; });

  const depDistMap: Record<string, number> = { 'Normal': 0, 'Mild': 0, 'Moderate': 0, 'Severe': 0, 'Extremely Severe': 0 };
  submissions.forEach(s => { depDistMap[s.dassResult.depression.severity] = (depDistMap[s.dassResult.depression.severity] || 0) + 1; });

  const anxDistMap: Record<string, number> = { 'Normal': 0, 'Mild': 0, 'Moderate': 0, 'Severe': 0, 'Extremely Severe': 0 };
  submissions.forEach(s => { anxDistMap[s.dassResult.anxiety.severity] = (anxDistMap[s.dassResult.anxiety.severity] || 0) + 1; });

  // 7. Average Scores by Academic Major
  const majorStats: Record<string, { totalNDI: number; totalErgo: number; count: number }> = {};
  submissions.forEach(s => {
    const m = s.demographics.academicMajor;
    if (!majorStats[m]) majorStats[m] = { totalNDI: 0, totalErgo: 0, count: 0 };
    majorStats[m].totalNDI += s.ndiResult.percentage;
    majorStats[m].totalErgo += s.ergoResult.percentage;
    majorStats[m].count += 1;
  });
  const majorChartData = Object.keys(majorStats).map(m => ({
    major: m.length > 18 ? m.substring(0, 15) + '...' : m,
    avgNDI: Math.round((majorStats[m].totalNDI / majorStats[m].count) * 10) / 10,
    avgErgo: Math.round((majorStats[m].totalErgo / majorStats[m].count) * 10) / 10,
  }));

  // 8. Average Scores by Year of Study
  const yearStats: Record<string, { totalNDI: number; totalStress: number; count: number }> = {};
  submissions.forEach(s => {
    const y = s.demographics.yearOfStudy;
    if (!yearStats[y]) yearStats[y] = { totalNDI: 0, totalStress: 0, count: 0 };
    yearStats[y].totalNDI += s.ndiResult.percentage;
    yearStats[y].totalStress += s.dassResult.stress.percentage;
    yearStats[y].count += 1;
  });
  const yearChartData = Object.keys(yearStats).map(y => ({
    year: y,
    avgNDI: Math.round((yearStats[y].totalNDI / yearStats[y].count) * 10) / 10,
    avgStress: Math.round((yearStats[y].totalStress / yearStats[y].count) * 10) / 10,
  }));

  // 9. Screen Time vs NDI Correlation Data
  const screenVsNDIData = submissions.map(s => ({
    screenTime: s.demographics.dailyScreenTime,
    ndiPercentage: s.ndiResult.percentage,
    name: s.demographics.fullName
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clinical & Psychometric Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">Cross-sectional analysis, severity distributions, and variable correlation charts.</p>
      </div>

      {/* 5 Averages Header Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card">
          <span className="text-[11px] font-semibold text-slate-500 block">Avg NDI Index</span>
          <span className="text-2xl font-extrabold text-teal-700">{avgNDI}%</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card">
          <span className="text-[11px] font-semibold text-slate-500 block">Avg Ergonomic Risk</span>
          <span className="text-2xl font-extrabold text-emerald-700">{avgErgo}%</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card">
          <span className="text-[11px] font-semibold text-slate-500 block">Avg Depression</span>
          <span className="text-2xl font-extrabold text-indigo-700">{avgDepression}%</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card">
          <span className="text-[11px] font-semibold text-slate-500 block">Avg Anxiety</span>
          <span className="text-2xl font-extrabold text-amber-700">{avgAnxiety}%</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-card">
          <span className="text-[11px] font-semibold text-slate-500 block">Avg Stress</span>
          <span className="text-2xl font-extrabold text-rose-700">{avgStress}%</span>
        </div>
      </div>

      {/* Chart Grid Row 1: NDI & Ergonomic Risk Severity Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NDI Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>1. NDI Severity Distribution</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ndiChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ergonomic Risk Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Monitor className="w-4 h-4 text-emerald-600" />
            <span>2. Ergonomic Risk Classification</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ergoChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f97316" />
                  <Cell fill="#e11d48" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Grid Row 2: DASS-21 Subscales Severity Distributions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Brain className="w-4 h-4 text-indigo-600" />
          <span>3-5. DASS-21 Subscales Severity Breakdown (Stress vs Depression vs Anxiety)</span>
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { category: 'Normal', Stress: stressDistMap['Normal'], Depression: depDistMap['Normal'], Anxiety: anxDistMap['Normal'] },
                { category: 'Mild', Stress: stressDistMap['Mild'], Depression: depDistMap['Mild'], Anxiety: anxDistMap['Mild'] },
                { category: 'Moderate', Stress: stressDistMap['Moderate'], Depression: depDistMap['Moderate'], Anxiety: anxDistMap['Moderate'] },
                { category: 'Severe', Stress: stressDistMap['Severe'], Depression: depDistMap['Severe'], Anxiety: anxDistMap['Severe'] },
                { category: 'Extremely Severe', Stress: stressDistMap['Extremely Severe'], Depression: depDistMap['Extremely Severe'], Anxiety: anxDistMap['Extremely Severe'] },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Stress" fill="#e11d48" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Depression" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Anxiety" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Grid Row 3: Scores by Major & Year of Study */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scores by Academic Major */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">6. Average NDI & Ergonomic Risk by Academic Major</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={majorChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="major" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgNDI" name="NDI (%)" fill="#0f766e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgErgo" name="Ergonomic Risk (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scores by Year of Study */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">7. Average NDI & Stress Score by Year of Study</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgNDI" name="NDI (%)" fill="#0f766e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgStress" name="Stress (%)" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Grid Row 4: Correlations (Screen Time vs NDI & Ergo Risk vs NDI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Screen Time vs NDI */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">8. Daily Screen Time (hrs) vs NDI Percentage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={screenVsNDIData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="screenTime" name="Screen Time (hrs)" tick={{ fontSize: 11 }} />
                <YAxis dataKey="ndiPercentage" name="NDI %" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="ndiPercentage" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ergonomic Risk vs NDI */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">9. Ergonomic Risk Classification vs Average NDI Disability</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { riskLevel: 'Low Ergo', avgNDI: Math.round((submissions.filter(s => s.ergoResult.riskLevel === 'Low Ergonomic Risk').reduce((a, b) => a + b.ndiResult.percentage, 0) / (submissions.filter(s => s.ergoResult.riskLevel === 'Low Ergonomic Risk').length || 1)) * 10) / 10 },
                { riskLevel: 'Moderate Ergo', avgNDI: Math.round((submissions.filter(s => s.ergoResult.riskLevel === 'Moderate Ergonomic Risk').reduce((a, b) => a + b.ndiResult.percentage, 0) / (submissions.filter(s => s.ergoResult.riskLevel === 'Moderate Ergonomic Risk').length || 1)) * 10) / 10 },
                { riskLevel: 'High Ergo', avgNDI: Math.round((submissions.filter(s => s.ergoResult.riskLevel === 'High Ergonomic Risk').reduce((a, b) => a + b.ndiResult.percentage, 0) / (submissions.filter(s => s.ergoResult.riskLevel === 'High Ergonomic Risk').length || 1)) * 10) / 10 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="riskLevel" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="avgNDI" name="Avg NDI (%)" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
