import React from 'react';
import { ArrowRight, ShieldCheck, Clock, FileText, CheckCircle2, Award } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onAdminClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onAdminClick }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Hero Card */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-800 text-teal-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Academic Research Data Collection</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Ergonomic & Psychometric Health Assessment System
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Welcome to the standardized clinical research questionnaire. This study evaluates neck disability, ergonomic risk factors, and psychological strain (Depression, Anxiety, and Stress) among academic students and healthcare professionals.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-base shadow-lg shadow-teal-900/40 hover:shadow-teal-500/20 transition-all duration-200 group transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Begin Research Questionnaire</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onAdminClick}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Admin Dashboard Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Neck Disability Index (NDI)</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            10 validated clinical sections measuring how neck pain impacts daily living, sleep, concentration, and physical work.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">DASS-21 Scale</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            21-item self-report instrument measuring Depression, Anxiety, and Stress levels scaled for clinical research comparison.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Ergonomic Risk Matrix</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Quantitative assessment of workstation setup, screen elevation, posture habits, micro-break frequency, and seating ergonomics.
          </p>
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 space-y-4">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-600" />
          <span>Participant Guidelines & Confidentiality</span>
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>Takes approximately 5–8 minutes to complete.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>All calculations happen automatically upon submission.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>Generates an encrypted Participant Research ID for data privacy.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>You can review and edit all answers prior to final submission.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
