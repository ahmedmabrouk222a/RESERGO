import React, { useState } from 'react';
import type { NDIAnswer } from '../../types/assessment';
import { NDI_SECTIONS } from '../../data/ndiQuestions';
import { Activity, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Info, Slash } from 'lucide-react';
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

  const handleSetNotApplicable = (sectionId: number) => {
    setValidationError(null);
    setAnswers(prev => prev.map(a => {
      if (a.sectionId === sectionId) {
        return {
          ...a,
          isApplicable: false,
          selectedOptionIndex: null
        };
      }
      return a;
    }));

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

  // Count sections answered or explicitly marked N/A
  const answeredApplicableCount = answers.filter(a => a.isApplicable && a.selectedOptionIndex !== null).length;
  const explicitNACount = answers.filter(a => !a.isApplicable).length;

  // Max Possible Score Denominator (e.g. 50 if 10 answered, 45 if 9 answered, 40 if 8 answered)
  const calculatedMaxScore = answeredApplicableCount > 0 ? answeredApplicableCount * 5 : 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Automatically convert any unselected sections to isApplicable = false (N/A)
    // so denominator automatically drops to 45 (if 1 skipped) or 40 (if 2 skipped)
    const processedAnswers = answers.map(a => {
      if (a.isApplicable && a.selectedOptionIndex === null) {
        return { ...a, isApplicable: false };
      }
      return a;
    });

    onNext(processedAnswers);
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

          {/* Live Calculated Denominator Banner */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">NDI Max Score:</span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-teal-700 text-white shadow-2xs">
                {calculatedMaxScore} Points ({answeredApplicableCount}/10 Sections)
              </span>
            </div>
            {explicitNACount > 0 && (
              <span className="text-[11px] font-semibold text-amber-700">
                ({explicitNACount} {explicitNACount === 1 ? 'Section' : 'Sections'} Excluded → Denominator: {calculatedMaxScore})
              </span>
            )}
          </div>
        </div>

        {/* NDI Scoring Rule Helper Notice */}
        <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200/80 text-teal-900 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Standard Clinical NDI Scoring Rule:</p>
            <p className="text-[11px] text-teal-800 leading-snug">
              If an activity does not apply to you (e.g., <strong>Section 8: Driving</strong> if you do not drive, or <strong>Section 10: Recreation</strong> if you do not practice sports), mark it as <strong>Does Not Apply (N/A)</strong>. The scoring denominator automatically adjusts from <strong>50 to 45</strong> (or <strong>40</strong> if both are excluded).
            </p>
          </div>
        </div>

        {/* Quick Jump Bar UX */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider shrink-0 mr-1">Sections:</span>
          {NDI_SECTIONS.map((sec) => {
            const ans = answers.find(a => a.sectionId === sec.id);
            const isAnswered = ans && ans.isApplicable && ans.selectedOptionIndex !== null;
            const isNA = ans && !ans.isApplicable;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className={`w-7 h-7 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
                  isNA
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : isAnswered
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
            const isAnswered = currentAnswer && currentAnswer.isApplicable && currentAnswer.selectedOptionIndex !== null;
            const isNA = currentAnswer && !currentAnswer.isApplicable;

            return (
              <div
                key={section.id}
                id={`ndi-section-${section.id}`}
                className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                  isNA
                    ? 'bg-amber-50/60 border-amber-200'
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
                      {isNA && <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-amber-200 text-amber-900">N/A (Excluded)</span>}
                    </h3>
                    <p className="text-xs text-slate-500">{section.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleApplicable(section.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors self-start sm:self-auto cursor-pointer ${
                      isNA
                        ? 'bg-amber-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {isNA ? 'Re-enable Section' : 'Mark Does Not Apply (N/A)'}
                  </button>
                </div>

                {isNA ? (
                  <div className="p-4 rounded-xl bg-amber-100/60 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Slash className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>This section is marked <strong>Not Applicable</strong> (Excluded from calculation). Denominator decreases by 5.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleApplicable(section.id)}
                      className="font-bold underline text-amber-900 hover:text-amber-950 ml-2 cursor-pointer"
                    >
                      Undo N/A
                    </button>
                  </div>
                ) : (
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

                    {/* Dedicated N/A Card inside choices for maximum clarity */}
                    <div
                      onClick={() => handleSetNotApplicable(section.id)}
                      className="p-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 text-amber-900 text-xs font-semibold cursor-pointer transition-all flex items-center gap-2"
                    >
                      <Slash className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>This activity does not apply to me at all (e.g. I do not drive or do sports) — Exclude Section</span>
                    </div>
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
