import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface MedicalDisclaimerProps {
  compact?: boolean;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
        <p>
          <strong>Research Disclaimer:</strong> This questionnaire is for academic research & assessment purposes and is not a substitute for professional medical or psychological diagnosis.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-slate-800 text-teal-400 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="text-xs leading-relaxed space-y-1">
          <h4 className="font-semibold text-slate-200 text-sm">Medical & Psychological Research Notice</h4>
          <p className="text-slate-300">
            This questionnaire is intended strictly for research and self-assessment purposes. It is <strong>not a substitute for professional medical advice, clinical diagnosis, or treatment</strong>.
          </p>
          <p className="text-slate-400">
            Specifically, the DASS-21 is a standardized self-report scale designed to measure state emotional distress and does not replace a formal clinical interview by a licensed health professional.
          </p>
        </div>
      </div>
    </div>
  );
};
