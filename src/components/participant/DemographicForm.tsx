import React, { useState } from 'react';
import type { ParticipantDemographics } from '../../types/assessment';
import { User, Clock, Stethoscope, ArrowRight, AlertCircle, Hash, Sparkles, Smile, Meh, Frown, Flame } from 'lucide-react';

interface DemographicFormProps {
  initialData: ParticipantDemographics;
  participantId: string;
  onNext: (data: ParticipantDemographics) => void;
}

export const DemographicForm: React.FC<DemographicFormProps> = ({
  initialData,
  participantId,
  onNext,
}) => {
  const [formData, setFormData] = useState<ParticipantDemographics>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const academicMajors = [
    "Medicine (MD)",
    "Physical Therapy",
    "Nursing",
    "Dentistry",
    "Pharmacy",
    "Biomedical Engineering",
    "Occupational Therapy",
    "Radiology / Medical Imaging",
    "Public Health",
    "Biology / Pre-Med",
    "Other Academic Major"
  ];

  const studyYears = [
    "Year 1",
    "Year 2",
    "Year 3",
    "Year 4",
    "Year 5",
    "Postgraduate / Residency"
  ];

  // Quick Sample Data Autofill helper for ultra-smooth testing UX
  const handleAutofillSample = () => {
    const sampleNames = ["Dr. Layla Mansour", "Omar Al-Khatib", "Sara Al-Hassan", "Youssef Ibrahim"];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    
    setFormData({
      fullName: randomName,
      age: 24,
      sex: 'Female',
      academicMajor: 'Physical Therapy',
      yearOfStudy: 'Year 4',
      dailyScreenTime: 9.0,
      weeklyLabHours: 18,
      vasScore: 6,
    });
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = "Full name is required";
    }
    if (formData.age === '' || Number(formData.age) < 16 || Number(formData.age) > 99) {
      errs.age = "Valid age (16-99) is required";
    }
    if (!formData.sex) {
      errs.sex = "Please select sex";
    }
    if (!formData.academicMajor) {
      errs.academicMajor = "Academic major is required";
    }
    if (!formData.yearOfStudy) {
      errs.yearOfStudy = "Year of study is required";
    }
    if (formData.dailyScreenTime === '' || Number(formData.dailyScreenTime) < 0 || Number(formData.dailyScreenTime) > 24) {
      errs.dailyScreenTime = "Daily screen time (0-24 hrs) is required";
    }
    if (formData.weeklyLabHours === '' || Number(formData.weeklyLabHours) < 0 || Number(formData.weeklyLabHours) > 100) {
      errs.weeklyLabHours = "Weekly lab/clinical hours (0-100 hrs) is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const getVasEmoji = (score: number) => {
    if (score === 0) return { icon: Smile, label: 'No Pain (0)', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' };
    if (score <= 3) return { icon: Smile, label: 'Mild Discomfort (1-3)', color: 'text-teal-600 bg-teal-50 border-teal-200' };
    if (score <= 6) return { icon: Meh, label: 'Moderate Pain (4-6)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (score <= 8) return { icon: Frown, label: 'Severe Pain (7-8)', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { icon: Flame, label: 'Worst Imaginable Pain (9-10)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const vasInfo = getVasEmoji(formData.vasScore);
  const VasIcon = vasInfo.icon;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
        {/* Header with Quick Autofill Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                <span>Participant Demographic Information</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Please provide accurate academic and baseline demographic data.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutofillSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 transition-colors shadow-2xs cursor-pointer"
              title="Autofill sample data for quick testing"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span>Fill Sample Data</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-semibold text-slate-700">
              <Hash className="w-3.5 h-3.5 text-teal-600" />
              <span>{participantId}</span>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              placeholder="e.g. Dr. Sarah Al-Mansoor"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20'
              }`}
            />
            {errors.fullName && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.fullName}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Age (Years) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={16}
              max={99}
              value={formData.age}
              onChange={(e) => {
                setFormData({ ...formData, age: e.target.value === '' ? '' : Number(e.target.value) });
                if (errors.age) setErrors({ ...errors, age: '' });
              }}
              placeholder="e.g. 23"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.age
                  ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20'
              }`}
            />
            {errors.age && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.age}</p>}
          </div>

          {/* Sex */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Sex <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.sex}
              onChange={(e) => {
                setFormData({ ...formData, sex: e.target.value as any });
                if (errors.sex) setErrors({ ...errors, sex: '' });
              }}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.sex
                  ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20'
              }`}
            >
              <option value="">Select Sex...</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            {errors.sex && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.sex}</p>}
          </div>

          {/* Academic Major */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Academic Major <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.academicMajor}
              onChange={(e) => {
                setFormData({ ...formData, academicMajor: e.target.value });
                if (errors.academicMajor) setErrors({ ...errors, academicMajor: '' });
              }}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.academicMajor
                  ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20'
              }`}
            >
              <option value="">Select Major...</option>
              {academicMajors.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.academicMajor && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.academicMajor}</p>}
          </div>

          {/* Year of Study */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Year of Study <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.yearOfStudy}
              onChange={(e) => {
                setFormData({ ...formData, yearOfStudy: e.target.value });
                if (errors.yearOfStudy) setErrors({ ...errors, yearOfStudy: '' });
              }}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.yearOfStudy
                  ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20'
              }`}
            >
              <option value="">Select Year...</option>
              {studyYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {errors.yearOfStudy && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.yearOfStudy}</p>}
          </div>

          {/* Daily Screen Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Average Daily Screen Time (Hours/Day) <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="number"
              step="0.5"
              min={0}
              max={24}
              value={formData.dailyScreenTime}
              onChange={(e) => {
                setFormData({ ...formData, dailyScreenTime: e.target.value === '' ? '' : Number(e.target.value) });
                if (errors.dailyScreenTime) setErrors({ ...errors, dailyScreenTime: '' });
              }}
              placeholder="e.g. 8.5"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.dailyScreenTime
                  ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20'
              }`}
            />
            {errors.dailyScreenTime && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.dailyScreenTime}</p>}
          </div>

          {/* Weekly Lab / Clinical Hours */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Weekly Hours in Lab / Clinical Rotations <span className="text-rose-500">*</span></span>
            </label>
            <input
              type="number"
              step="1"
              min={0}
              max={100}
              value={formData.weeklyLabHours}
              onChange={(e) => {
                setFormData({ ...formData, weeklyLabHours: e.target.value === '' ? '' : Number(e.target.value) });
                if (errors.weeklyLabHours) setErrors({ ...errors, weeklyLabHours: '' });
              }}
              placeholder="e.g. 18"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.weeklyLabHours
                  ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500/20'
              }`}
            />
            {errors.weeklyLabHours && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.weeklyLabHours}</p>}
          </div>
        </div>

        {/* Enhanced Visual Analog Scale (VAS) Pain Score UX */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Visual Analog Scale (VAS) Pain Score
              </label>
              <p className="text-[11px] text-slate-500">Drag the slider or click a score to record your current neck pain level.</p>
            </div>
            <div className={`px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-2 ${vasInfo.color}`}>
              <VasIcon className="w-4 h-4" />
              <span>Score {formData.vasScore}/10: {vasInfo.label}</span>
            </div>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={formData.vasScore}
              onChange={(e) => setFormData({ ...formData, vasScore: Number(e.target.value) })}
              className="w-full h-3 bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-600 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            
            {/* Quick Click Score Pills */}
            <div className="flex justify-between items-center gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({ ...formData, vasScore: num })}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    formData.vasScore === num
                      ? 'bg-slate-900 text-white scale-110 shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>Proceed to NDI Questionnaire</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
