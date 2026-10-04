import React, { useState } from 'react';
import type { ErgoAnswer } from '../../types/assessment';
import { ERGO_QUESTIONS } from '../../data/ergoQuestions';
import { Monitor, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface ErgoFormProps {
  initialAnswers: ErgoAnswer;
  onBack: () => void;
  onNext: (answers: ErgoAnswer) => void;
}

export const ErgoForm: React.FC<ErgoFormProps> = ({
  initialAnswers,
  onBack,
  onNext,
}) => {
  const [answers, setAnswers] = useState<ErgoAnswer>(initialAnswers);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSelect = (key: 'laptop' | 'posture' | 'breaks' | 'chair', score: number) => {
    setValidationError(null);
    setAnswers(prev => ({
      ...prev,
      [key]: score
    }));
  };

  const isComplete = (
    answers.laptop !== undefined &&
    answers.posture !== undefined &&
    answers.breaks !== undefined &&
    answers.chair !== undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      setValidationError("Please complete all 4 ergonomic risk sections before proceeding.");
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
              <Monitor className="w-5 h-5 text-teal-600" />
              <span>Ergonomic Risk Assessment</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select the option that best reflects your workstation ergonomics and physical work habits.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Completed:</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              4 / 4 components
            </span>
          </div>
        </div>

        {validationError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="space-y-8">
          {ERGO_QUESTIONS.map((q) => {
            const currentScore = answers[q.key];

            return (
              <div key={q.key} className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <span>{q.title}</span>
                      {currentScore !== undefined && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{q.question}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {q.options.map((opt) => {
                    const isSelected = currentScore === opt.score;

                    return (
                      <div
                        key={opt.score}
                        onClick={() => handleSelect(q.key, opt.score)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-950 font-semibold shadow-xs ring-1 ring-teal-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            opt.score === 0 ? 'bg-emerald-100 text-emerald-800' : opt.score === 1 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            Score: {opt.score}
                          </span>
                        </div>
                        {opt.description && (
                          <p className="text-[11px] text-slate-500 leading-snug font-normal">{opt.description}</p>
                        )}
                      </div>
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <span>Proceed to DASS-21</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
