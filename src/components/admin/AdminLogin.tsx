import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { validateAdminLogin, getStoredAdminCredentials } from '../../lib/storage';

interface AdminLoginProps {
  onLogin: (email: string) => void;
  onBackToParticipant: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBackToParticipant }) => {
  const storedCreds = getStoredAdminCredentials();
  const [email, setEmail] = useState(storedCreds.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    // Validate against stored admin credentials
    if (validateAdminLogin(email, password)) {
      setError(null);
      onLogin(email.trim());
    } else {
      setError('Invalid admin credentials. Please check your email and password.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-6">
      <div className="bg-slate-900 rounded-3xl p-8 text-white border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Admin Portal Access</h2>
          <p className="text-xs text-slate-400">Authenticated Research Principal Investigators & Data Managers</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@research.edu"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-300 mb-0.5">Admin Security Note:</p>
            <p>You can change your login email and password anytime inside <strong>Admin Settings</strong>.</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Authenticate Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToParticipant}
            className="text-xs text-slate-400 hover:text-slate-200 underline transition-colors cursor-pointer"
          >
            Return to Participant Questionnaire Side
          </button>
        </div>
      </div>
    </div>
  );
};
