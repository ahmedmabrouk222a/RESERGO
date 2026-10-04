import React, { useState } from 'react';
import { Database, RefreshCw, Trash2, CheckCircle2, AlertCircle, KeyRound, Lock, Mail, ShieldCheck, Check } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { getStoredAdminCredentials, saveAdminCredentials, isProductionMode, setProductionMode } from '../../lib/storage';

interface SettingsTabProps {
  onResetDemoData: () => void;
  onClearAllData: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  onResetDemoData,
  onClearAllData,
}) => {
  const currentCreds = getStoredAdminCredentials();
  const [adminEmail, setAdminEmail] = useState(currentCreds.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [credsSuccess, setCredsSuccess] = useState<string | null>(null);
  const [credsError, setCredsError] = useState<string | null>(null);

  const [prodMode, setProdMode] = useState<boolean>(isProductionMode());

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredsSuccess(null);
    setCredsError(null);

    if (!adminEmail.trim()) {
      setCredsError('Admin email address cannot be empty.');
      return;
    }

    if (currentPassword !== currentCreds.passwordHash) {
      setCredsError('Current admin password is incorrect.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setCredsError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setCredsError('New password and confirmation do not match.');
      return;
    }

    saveAdminCredentials(adminEmail.trim(), newPassword);
    setCredsSuccess('Admin credentials updated successfully! Use your new email/password for future logins.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleToggleProdMode = (enabled: boolean) => {
    setProductionMode(enabled);
    setProdMode(enabled);
    if (enabled) {
      // Clear demo data when switching to pure live real data mode
      onClearAllData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Settings & Admin Security</h1>
        <p className="text-xs text-slate-500 mt-1">Manage admin login credentials, database deployment status, and real participant data modes.</p>
      </div>

      {/* 1. CHANGE ADMIN USERNAME & PASSWORD CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Change Admin Login & Password</h3>
            <p className="text-xs text-slate-500">Update your principal investigator login credentials</p>
          </div>
        </div>

        {credsSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{credsSuccess}</span>
          </div>
        )}

        {credsError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{credsError}</span>
          </div>
        )}

        <form onSubmit={handleSaveCredentials} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Admin Email / Username</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2 pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Update Admin Credentials
            </button>
          </div>
        </form>
      </div>

      {/* 2. REAL LIVE PARTICIPANT DATA MODE CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Production Mode (Real Data Only)</h3>
              <p className="text-xs text-slate-500">Ensure only actual live participants who fill out the survey are stored</p>
            </div>
          </div>
          <button
            onClick={() => handleToggleProdMode(!prodMode)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              prodMode ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {prodMode ? 'Active (Real Data)' : 'Demo Mode Active'}
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          When <strong>Real Data Mode</strong> is enabled, all sample demo participants are removed and the system exclusively records submissions from real participants who take your questionnaire online.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={() => handleToggleProdMode(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Enable Real Participant Live Mode</span>
          </button>
          <button
            onClick={onResetDemoData}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Load Demo Data Cohort (10 Participants)</span>
          </button>
          <button
            onClick={onClearAllData}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Purge All Submissions</span>
          </button>
        </div>
      </div>

      {/* 3. Supabase Connection Status Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-card space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Supabase Cloud Database Status</h3>
              <p className="text-xs text-slate-500">PostgreSQL Row Level Security (RLS)</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {isSupabaseConfigured ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase Live Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>LocalStorage Mode (Ready for Supabase ENVs)</span>
              </>
            )}
          </div>
        </div>

        <div className="text-xs text-slate-600 space-y-2">
          <p>
            When deployed to hosting (Vercel, Netlify, Hostinger, Render), add these environment variables in your hosting dashboard for live cloud database synchronization:
          </p>
          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1 border border-slate-800 shadow-inner">
            <p className="text-teal-400">VITE_SUPABASE_URL=https://your-project.supabase.co</p>
            <p className="text-teal-400">VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
