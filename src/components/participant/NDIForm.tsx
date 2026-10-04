import React, { useState } from 'react';
import type { NDIAnswer } from '../../types/assessment';
import { NDI_SECTIONS } from '../../data/ndiQuestions';
import { Activity, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';

interface NDIFormProps {
  initialAnswers: NDIAnswer[];
  onBack: () => void;
  onNext: (answers: NDIAnswer[]) => void;
}

export const NDIForm: React.FC<NDIFormProps> = ({
  initialAnswers,
  onBack,
  onNext,
}) => {
  const [answers, setAnswers] = useState<NDIAnswer[]>(() => {
    return NDI_SECTIONS.map((sec) => {
      const existing = initialAnswers.find(a => a.sectionId === sec.id);
      return existing || {
        sectionId: sec.id,
        sectionName: sec.title,
        selectedOptionIndex: null,
        isApplicable: true,
      };
    });
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSelectOption = (sectionId: number, optionIndex: number) => {
    setValidationError(null);
    setAnswers(prev => prev.map(a => {
      if (a.sectionId === sectionId) {
        return {
          ...a,
          selectedOptionIndex: optionIndex,
          isApplicable: true
        };
      }
      return a;
    }));

    // Auto-scroll to next section for effortless questionnaire flow UX
    if (sectionId < 10) {
      const nextElem = document.getElementById(`ndi-section-${sectionId + 1}`);
      if (nextElem) {
        nextElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleToggleApplicable = (sectionId: number) => {
    setValidationError(null);
    setAnswers(prev => prev.map(a => {
      if (a.sectionId === sectionId) {
        const nextApplicable = !a.isApplicable;
        return {
          ...a,
          isApplicable: nextApplicable,
          selectedOptionIndex: nextApplicable ? a.selectedOptionIndex : null
        };
      }
      return a;
    }));
  };

  const scrollToSection = (secId: number) => {
    const elem = document.getElementById(`ndi-section-${secId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const answeredCount = answers.filter(
    a => !a.isApplicable || (a.selectedOptionIndex !== null && a.selectedOptionIndex >= 0)
  ).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = answers.find(a => a.isApplicable && (a.selectedOptionIndex === null || a.selectedOptionIndex < 0));
    if (missing) {
      setValidationError(`Please select an answer for ${missing.sectionName} or mark it as not applicable before continuing.`);
      scrollToSection(missing.sectionId);
      return;
    }
    onNext(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Questionnaire Card Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <span>Neck Disability Index (NDI) Questionnaire</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select ONE choice in each section that best describes your condition.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Progress:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              answeredCount === 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-50 text-teal-800 border border-teal-200'
            }`}>
              {answeredCount} / 10 sections
            </span>
          </div>
        </div>

        {/* Quick Jump Bar UX */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider shrink-0 mr-1">Sections:</span>
          {NDI_SECTIONS.map((sec) => {
            const ans = answers.find(a => a.sectionId === sec.id);
            const isDone = ans && (!ans.isApplicable || (ans.selectedOptionIndex !== null && ans.selectedOptionIndex >= 0));

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className={`w-7 h-7 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
                  isDone
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
                title={sec.title}
              >
                {sec.id}
              </button>
            );
          })}
        </div>

        <MedicalDisclaimer compact />

        {validationError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* List of 10 NDI Sections */}
        <div className="space-y-8 pt-2">
          {NDI_SECTIONS.map((section) => {
            const currentAnswer = answers.find(a => a.sectionId === section.id);
            const isAnswered = currentAnswer && currentAnswer.selectedOptionIndex !== null;
            const isNA = currentAnswer && !currentAnswer.isApplicable;

            return (
              <div
                key={section.id}
                id={`ndi-section-${section.id}`}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isNA
                    ? 'bg-slate-50 border-slate-200/80 opacity-75'
                    : isAnswered
                    ? 'bg-white border-teal-200 shadow-xs ring-1 ring-teal-500/10'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <span>{section.title}</span>
                      {isAnswered && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                    </h3>
                    <p className="text-xs text-slate-500">{section.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleApplicable(section.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors self-start sm:self-auto cursor-pointer ${
                      isNA
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isNA ? 'Section Excluded (N/A)' : 'Mark N/A / Skip'}
                  </button>
                </div>

                {!isNA && (
                  <div className="grid grid-cols-1 gap-2.5">
                    {section.options.map((opt) => {
                      const isSelected = currentAnswer?.selectedOptionIndex === opt.score;

                      return (
                        <div
                          key={opt.score}
                          onClick={() => handleSelectOption(section.id, opt.score)}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-teal-50 border-teal-500 text-teal-950 font-semibold shadow-xs ring-1 ring-teal-500/20'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold transition-all ${
                            isSelected ? 'bg-teal-600 border-teal-600 text-white scale-105' : 'border-slate-300 text-slate-500'
                          }`}>
                            {opt.score}
                          </div>
                          <span className="leading-snug">{opt.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>Proceed to Ergonomic Risk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
