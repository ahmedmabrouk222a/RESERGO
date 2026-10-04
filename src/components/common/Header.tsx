import React from 'react';
import { Activity, Shield, LogOut, BookOpen } from 'lucide-react';
import type { AdminUser } from '../../types/assessment';

interface HeaderProps {
  currentSide: 'participant' | 'admin';
  adminUser: AdminUser | null;
  onNavigateToAdmin: () => void;
  onNavigateToParticipant: () => void;
  onAdminLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSide,
  adminUser,
  onNavigateToAdmin,
  onNavigateToParticipant,
  onAdminLogout
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onNavigateToParticipant}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-teal-500/20">
              <Activity className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">RESERGO</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-950 text-teal-400 border border-teal-800/60 uppercase tracking-wider">
                  Research Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Clinical Ergonomic & Psychometric Assessment System</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            {currentSide === 'participant' ? (
              <button
                onClick={onNavigateToAdmin}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all duration-150 shadow-xs"
              >
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span>Admin Portal</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={onNavigateToParticipant}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Participant View</span>
                </button>
                {adminUser?.isAuthenticated && (
                  <button
                    onClick={onAdminLogout}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
