import React, { useState } from 'react';
import type { ParticipantDemographics, NDIAnswer, ErgoAnswer, DASSAnswer } from '../../types/assessment';
import { NDI_SECTIONS } from '../../data/ndiQuestions';
import { ERGO_QUESTIONS } from '../../data/ergoQuestions';
import { ClipboardCheck, Edit3, ArrowLeft, Send, CheckCircle2, User, Activity, Monitor, Brain, Loader2 } from 'lucide-react';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';

interface ReviewFormProps {
  demographics: ParticipantDemographics;
  ndiAnswers: NDIAnswer[];
  ergoAnswers: ErgoAnswer;
  dassAnswers: DASSAnswer[];
  participantId: string;
  onEditDemographics: () => void;
  onEditNDI: () => void;
  onEditErgo: () => void;
  onEditDASS: () => void;
  onSubmit: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  demographics,
  ndiAnswers,
  ergoAnswers,
  dassAnswers,
  participantId,
  onEditDemographics,
  onEditNDI,
  onEditErgo,
  onEditDASS,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit();
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-teal-600" />
              <span>Review Your Answers Before Submission</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Please verify your responses. You can click "Edit" on any section to make adjustments before final submission.
            </p>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
            ID: {participantId}
          </div>
        </div>

        <MedicalDisclaimer compact />

        {/* 1. Demographics Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              <span>Participant Demographic Information</span>
            </h3>
            <button
              onClick={onEditDemographics}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Full Name:</span>
              <span className="font-semibold text-slate-900">{demographics.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Age & Sex:</span>
              <span className="font-semibold text-slate-900">{demographics.age} yrs • {demographics.sex}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Academic Major:</span>
              <span className="font-semibold text-slate-900">{demographics.academicMajor} ({demographics.yearOfStudy})</span>
            </div>
            <div>
              <span className="text-slate-500 block">Screen & Lab Time:</span>
              <span className="font-semibold text-slate-900">{demographics.dailyScreenTime}h screen/day • {demographics.weeklyLabHours}h lab/wk</span>
            </div>
            <div>
              <span className="text-slate-500 block">VAS Pain Score:</span>
              <span className="font-bold text-teal-700">{demographics.vasScore} / 10</span>
            </div>
          </div>
        </div>

        {/* 2. NDI Summary Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Neck Disability Index (NDI) - {ndiAnswers.filter(a => a.isApplicable && a.selectedOptionIndex !== null).length} / 10 Sections</span>
            </h3>
            <button
              onClick={onEditNDI}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {NDI_SECTIONS.map((sec) => {
              const ans = ndiAnswers.find(a => a.sectionId === sec.id);
              const optLabel = ans?.isApplicable && ans.selectedOptionIndex !== null
                ? sec.options.find(o => o.score === ans.selectedOptionIndex)?.label
                : 'Section Excluded (N/A)';

              return (
                <div key={sec.id} className="p-2.5 rounded-xl bg-white border border-slate-200/70 space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold text-slate-800 truncate">{sec.title.split(': ')[1]}</span>
                    <span className="font-bold text-teal-700 shrink-0 text-[11px]">
                      {ans?.isApplicable ? `Score: ${ans.selectedOptionIndex}` : 'N/A'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{optLabel}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Ergonomic Summary Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Monitor className="w-4 h-4 text-teal-600" />
              <span>Ergonomic Risk Components</span>
            </h3>
            <button
              onClick={onEditErgo}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {ERGO_QUESTIONS.map((q) => (
              <div key={q.key} className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-500 block text-[11px] font-medium">{q.title.split('. ')[1]}</span>
                <span className="font-bold text-slate-900">Score: {ergoAnswers[q.key]} / 2</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. DASS-21 Summary Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span>DASS-21 Psychometric Scale - {dassAnswers.filter(a => a.score >= 0).length} / 21 Questions Complete</span>
            </h3>
            <button
              onClick={onEditDASS}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All 21 DASS-21 questions have been answered. Automatically ready for score calculation.</span>
          </div>
        </div>

        {/* Final Actions */}
        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
          <button
            type="button"
            onClick={onEditDASS}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to DASS-21</span>
          </button>
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-base shadow-lg shadow-teal-900/30 hover:shadow-teal-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing & Scoring...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>[Submit Assessment]</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
