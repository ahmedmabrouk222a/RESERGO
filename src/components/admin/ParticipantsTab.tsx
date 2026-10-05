import React, { useState, useMemo } from 'react';
import type { ParticipantSubmission } from '../../types/assessment';
import { Search, ArrowUpDown, Eye, Download, X } from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';

interface ParticipantsTabProps {
  submissions: ParticipantSubmission[];
  onViewParticipant: (sub: ParticipantSubmission) => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
}

type SortField = 'name' | 'age' | 'ndi' | 'vas' | 'stress' | 'depression' | 'anxiety' | 'ergo' | 'date';

export const ParticipantsTab: React.FC<ParticipantsTabProps> = ({
  submissions,
  onViewParticipant,
  onExportCSV,
  onExportExcel,
}) => {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Filter states
  const [sexFilter, setSexFilter] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [ndiFilter, setNdiFilter] = useState('');
  const [stressFilter, setStressFilter] = useState('');
  const [depFilter, setDepFilter] = useState('');
  const [anxFilter, setAnxFilter] = useState('');
  const [ergoFilter, setErgoFilter] = useState('');

  // Sort state
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Extract unique options for filter dropdowns
  const uniqueMajors = useMemo(() => Array.from(new Set(submissions.map(s => s.demographics.academicMajor))), [submissions]);
  const uniqueYears = useMemo(() => Array.from(new Set(submissions.map(s => s.demographics.yearOfStudy))), [submissions]);

  // Filtering & Searching logic
  const filteredData = useMemo(() => {
    return submissions.filter((sub) => {
      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = sub.demographics.fullName.toLowerCase().includes(term);
        const matchesId = sub.participantId.toLowerCase().includes(term);
        if (!matchesName && !matchesId) return false;
      }

      if (sexFilter && sub.demographics.sex !== sexFilter) return false;
      if (majorFilter && sub.demographics.academicMajor !== majorFilter) return false;
      if (yearFilter && sub.demographics.yearOfStudy !== yearFilter) return false;
      if (ndiFilter && sub.ndiResult.severity !== ndiFilter) return false;
      if (stressFilter && sub.dassResult.stress.severity !== stressFilter) return false;
      if (depFilter && sub.dassResult.depression.severity !== depFilter) return false;
      if (anxFilter && sub.dassResult.anxiety.severity !== anxFilter) return false;
      if (ergoFilter && sub.ergoResult.riskLevel !== ergoFilter) return false;

      return true;
    });
  }, [submissions, searchTerm, sexFilter, majorFilter, yearFilter, ndiFilter, stressFilter, depFilter, anxFilter, ergoFilter]);

  // Sorting logic
  const sortedData = useMemo(() => {
    const data = [...filteredData];
    data.sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (sortField) {
        case 'name':
          valA = a.demographics.fullName.toLowerCase();
          valB = b.demographics.fullName.toLowerCase();
          break;
        case 'age':
          valA = a.demographics.age;
          valB = b.demographics.age;
          break;
        case 'ndi':
          valA = a.ndiResult.percentage;
          valB = b.ndiResult.percentage;
          break;
        case 'vas':
          valA = a.demographics.vasScore;
          valB = b.demographics.vasScore;
          break;
        case 'stress':
          valA = a.dassResult.stress.percentage;
          valB = b.dassResult.stress.percentage;
          break;
        case 'depression':
          valA = a.dassResult.depression.percentage;
          valB = b.dassResult.depression.percentage;
          break;
        case 'anxiety':
          valA = a.dassResult.anxiety.percentage;
          valB = b.dassResult.anxiety.percentage;
          break;
        case 'ergo':
          valA = a.ergoResult.percentage;
          valB = b.ergoResult.percentage;
          break;
        case 'date':
        default:
          valA = new Date(a.submittedAt).getTime();
          valB = new Date(b.submittedAt).getTime();
          break;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [filteredData, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSexFilter('');
    setMajorFilter('');
    setYearFilter('');
    setNdiFilter('');
    setStressFilter('');
    setDepFilter('');
    setAnxFilter('');
    setErgoFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Table Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Participant Data Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Search, filter, sort, and inspect granular questionnaire submissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Search & Multi-Filter Control Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Name or Participant ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
            />
          </div>

          {/* Academic Major Filter */}
          <div>
            <select
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
            >
              <option value="">All Academic Majors</option>
              {uniqueMajors.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year of Study Filter */}
          <div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
            >
              <option value="">All Study Years</option>
              {uniqueYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row Filters: NDI, Ergonomic, DASS severities */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Sex</label>
            <select
              value={sexFilter}
              onChange={(e) => setSexFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
            >
              <option value="">All Sexes</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">NDI Severity</label>
            <select
              value={ndiFilter}
              onChange={(e) => setNdiFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
            >
              <option value="">All NDI Levels</option>
              <option value="No Disability">No Disability</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
              <option value="Complete">Complete</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Ergonomic Risk</label>
            <select
              value={ergoFilter}
              onChange={(e) => setErgoFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
            >
              <option value="">All Risk Levels</option>
              <option value="Low Ergonomic Risk">Low Ergonomic Risk</option>
              <option value="Moderate Ergonomic Risk">Moderate Ergonomic Risk</option>
              <option value="High Ergonomic Risk">High Ergonomic Risk</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Stress Severity</label>
            <select
              value={stressFilter}
              onChange={(e) => setStressFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
            >
              <option value="">All Stress Levels</option>
              <option value="Normal">Normal</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
              <option value="Extremely Severe">Extremely Severe</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1">Depression / Anxiety</label>
            <select
              value={depFilter}
              onChange={(e) => setDepFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
            >
              <option value="">Depression Severity...</option>
              <option value="Normal">Normal</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
              <option value="Extremely Severe">Extremely Severe</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-slate-500">
            Showing <strong>{sortedData.length}</strong> of {submissions.length} participants
          </span>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold"
          >
            <X className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-200 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
                <th className="py-3.5 px-4">Participant ID</th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Name / Age / Sex</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Major / Year</th>
                <th className="py-3.5 px-4">Screen / Lab Hours</th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('vas')}>
                  <div className="flex items-center gap-1">
                    <span>VAS</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('ndi')}>
                  <div className="flex items-center gap-1">
                    <span>NDI Index</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('ergo')}>
                  <div className="flex items-center gap-1">
                    <span>Ergonomic Risk</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('stress')}>
                  <div className="flex items-center gap-1">
                    <span>Stress</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('depression')}>
                  <div className="flex items-center gap-1">
                    <span>Depression</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('anxiety')}>
                  <div className="flex items-center gap-1">
                    <span>Anxiety</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-10 text-center text-slate-400">
                    No participants matched your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedData.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Participant ID */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {sub.participantId}
                    </td>

                    {/* Name / Age / Sex */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 whitespace-nowrap">{sub.demographics.fullName}</div>
                      <div className="text-[11px] text-slate-500">{sub.demographics.age} yrs • {sub.demographics.sex}</div>
                    </td>

                    {/* Major / Year */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{sub.demographics.academicMajor}</div>
                      <div className="text-[11px] text-slate-500">{sub.demographics.yearOfStudy}</div>
                    </td>

                    {/* Hours */}
                    <td className="py-3 px-4 whitespace-nowrap text-[11px]">
                      <div>Screen: <strong>{sub.demographics.dailyScreenTime}h</strong>/day</div>
                      <div>Lab: <strong>{sub.demographics.weeklyLabHours}h</strong>/wk</div>
                    </td>

                    {/* VAS Pain */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-extrabold text-teal-700 text-sm">{sub.demographics.vasScore}</span> / 10
                    </td>

                    {/* NDI Requirement 12: Display raw/max, %, severity badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        {sub.ndiResult.totalScore}/{sub.ndiResult.maxPossibleScore} ({sub.ndiResult.percentage}%)
                      </div>
                      <div className="mt-0.5">
                        <SeverityBadge type="ndi" level={sub.ndiResult.severity} size="sm" />
                      </div>
                    </td>

                    {/* Ergonomic Requirement 12 */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        {sub.ergoResult.totalScore}/6 ({sub.ergoResult.percentage}%)
                      </div>
                      <div className="mt-0.5">
                        <SeverityBadge type="ergo" level={sub.ergoResult.riskLevel} size="sm" />
                      </div>
                    </td>

                    {/* Stress */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {sub.dassResult.stress.finalScore}
                      </div>
                      <div className="mt-0.5">
                        <SeverityBadge type="stress" level={sub.dassResult.stress.severity} size="sm" />
                      </div>
                    </td>

                    {/* Depression */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {sub.dassResult.depression.finalScore}
                      </div>
                      <div className="mt-0.5">
                        <SeverityBadge type="depression" level={sub.dassResult.depression.severity} size="sm" />
                      </div>
                    </td>

                    {/* Anxiety */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {sub.dassResult.anxiety.finalScore}
                      </div>
                      <div className="mt-0.5">
                        <SeverityBadge type="anxiety" level={sub.dassResult.anxiety.severity} size="sm" />
                      </div>
                    </td>

                    {/* Submission Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-[11px] text-slate-500">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onViewParticipant(sub)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <div className="text-slate-500">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({sortedData.length} records)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 font-semibold cursor-pointer"
            >
              Previous
            </button>
            <span className="font-bold text-slate-700 px-2">{currentPage}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 font-semibold cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
