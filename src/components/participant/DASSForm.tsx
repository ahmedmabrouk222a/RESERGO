import React, { useState } from 'react';
import type { DASSAnswer } from '../../types/assessment';
import { DASS_QUESTIONS, DASS_RATING_OPTIONS } from '../../data/dassQuestions';
import { Brain, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { MedicalDisclaimer } from '../common/MedicalDisclaimer';

interface DASSFormProps {
  initialAnswers: DASSAnswer[];
  onBack: () => void;
  onNext: (answers: DASSAnswer[]) => void;
}

export const DASSForm: React.FC<DASSFormProps> = ({
  initialAnswers,
  onBack,
  onNext,
}) => {
  const [answers, setAnswers] = useState<DASSAnswer[]>(() => {
    return DASS_QUESTIONS.map((q) => {
      const existing = initialAnswers.find(a => a.questionNumber === q.id);
      return existing || {
        questionNumber: q.id,
        score: -1, // -1 means unselected
        category: q.category,
      };
    });
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSelect = (questionNumber: number, score: number) => {
    setValidationError(null);
    setAnswers(prev => prev.map(a => {
      if (a.questionNumber === questionNumber) {
        return { ...a, score };
      }
      return a;
    }));
  };

  const answeredCount = answers.filter(a => a.score >= 0).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const firstUnanswered = answers.find(a => a.score < 0);
    if (firstUnanswered) {
      setValidationError(`Please answer question #${firstUnanswered.questionNumber} before proceeding.`);
      return;
    }
    onNext(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              <span>DASS-21 Psychometric Questionnaire</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Please read each statement and select a rating indicating how much the statement applied to you <strong>over the past week</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Progress:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              answeredCount === 21 ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
            }`}>
              {answeredCount} / 21 questions
            </span>
          </div>
        </div>

        {/* Subscale Indicators Legend Banner */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 font-semibold">
          <span className="text-indigo-900 font-bold">Subscale Key:</span>
          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-mono font-bold">(S) = Stress</span>
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono font-bold">(A) = Anxiety</span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-mono font-bold">(D) = Depression</span>
        </div>

        <MedicalDisclaimer compact />

        {validationError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* 21 Questions */}
        <div className="space-y-6">
          {DASS_QUESTIONS.map((q) => {
            const currentAns = answers.find(a => a.questionNumber === q.id);
            const isAnswered = currentAns && currentAns.score >= 0;

            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isAnswered ? 'bg-white border-indigo-200 shadow-xs' : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isAnswered ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {q.id}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    {q.text}
                  </p>
                </div>

                {/* Rating options 0, 1, 2, 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pl-9">
                  {DASS_RATING_OPTIONS.map((opt) => {
                    const isSelected = currentAns?.score === opt.value;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(q.id, opt.value)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-1 ring-indigo-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block font-bold text-indigo-700 text-xs mb-0.5">{opt.value}</span>
                        <span className="text-[11px] text-slate-600 leading-tight block">
                          {opt.label.split('= ')[1]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Proceed to Answer Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
