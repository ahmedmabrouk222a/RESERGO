import React from 'react';
import { ShieldCheck, Database, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200 text-sm">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Academic Data Governance</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Standardized data collection system integrating the Neck Disability Index (NDI), Depression Anxiety Stress Scales (DASS-21), and Ergonomic Risk Metrics.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200 text-sm">
              <Database className="w-4 h-4 text-teal-400" />
              <span>Validated Standardized Scales</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              NDI scored on 0-50 percentage index; DASS-21 scaled x2 for full 42-point clinical comparison; Ergonomic score evaluated across 4 physical domain factors.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200 text-sm">
              <Award className="w-4 h-4 text-teal-400" />
              <span>Research Ethics Compliance</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Participant data is securely tokenized with auto-generated research identifiers for confidential aggregate analysis.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Clinical Research & Academic Ergonomics Group. All rights reserved.</p>
          <p>Version 2.4.0 • Built with React, TypeScript & Supabase</p>
        </div>
      </div>
    </footer>
  );
};
