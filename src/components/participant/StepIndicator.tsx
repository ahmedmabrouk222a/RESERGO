import React from 'react';
import { Check, User, Activity, Monitor, Brain, ClipboardCheck } from 'lucide-react';
import type { SurveyStep } from '../../types/assessment';

interface StepIndicatorProps {
  currentStep: SurveyStep;
  ndiCompletedCount: number;
  dassCompletedCount: number;
  ergoCompletedCount: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  ndiCompletedCount,
  dassCompletedCount,
  ergoCompletedCount,
}) => {
  if (currentStep === 'landing' || currentStep === 'confirmation') {
    return null;
  }

  const steps = [
    { key: 'demographics', label: 'Participant Info', icon: User },
    { key: 'ndi', label: 'NDI (Neck)', icon: Activity, subtext: `${ndiCompletedCount}/10` },
    { key: 'ergo', label: 'Ergonomic Risk', icon: Monitor, subtext: `${ergoCompletedCount}/4` },
    { key: 'dass', label: 'DASS-21', icon: Brain, subtext: `${dassCompletedCount}/21` },
    { key: 'review', label: 'Review & Submit', icon: ClipboardCheck },
  ];

  const getStepIndex = (stepKey: string) => steps.findIndex(s => s.key === stepKey);
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full mb-8 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-card">
      <div className="flex items-center justify-between relative max-w-4xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-100 z-0 rounded-full" />
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-teal-600 z-0 rounded-full transition-all duration-300"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                  isCompleted
                    ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20 ring-4 ring-teal-50'
                    : isCurrent
                    ? 'bg-slate-900 text-teal-400 ring-4 ring-slate-100 shadow-md'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-semibold ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                  {step.label}
                </p>
                {step.subtext && (
                  <p className="text-[10px] text-teal-700 font-medium">{step.subtext}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
