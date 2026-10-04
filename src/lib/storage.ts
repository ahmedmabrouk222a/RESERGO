import type { ParticipantSubmission } from '../types/assessment';
import { INITIAL_DEMO_PARTICIPANTS } from '../data/demoData';

const STORAGE_KEY = 'academic_research_submissions_v1';
const ADMIN_CREDS_KEY = 'academic_research_admin_creds_v1';
const PROD_MODE_KEY = 'academic_research_prod_mode_v1';

export interface AdminCredentials {
  email: string;
  passwordHash: string; // stored credentials
}

const DEFAULT_ADMIN_CREDS: AdminCredentials = {
  email: 'admin@research.edu',
  passwordHash: 'admin123',
};

// --- ADMIN CREDENTIALS MANAGERS ---

export function getStoredAdminCredentials(): AdminCredentials {
  try {
    const raw = localStorage.getItem(ADMIN_CREDS_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(DEFAULT_ADMIN_CREDS));
      return DEFAULT_ADMIN_CREDS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse admin credentials:', err);
    return DEFAULT_ADMIN_CREDS;
  }
}

export function saveAdminCredentials(email: string, passwordHash: string): void {
  try {
    const newCreds: AdminCredentials = { email, passwordHash };
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(newCreds));
  } catch (err) {
    console.error('Failed to save admin credentials:', err);
  }
}

export function validateAdminLogin(inputEmail: string, inputPassword: string): boolean {
  const creds = getStoredAdminCredentials();
  return (
    inputEmail.trim().toLowerCase() === creds.email.toLowerCase() &&
    inputPassword === creds.passwordHash
  );
}

// --- PRODUCTION MODE & LIVE REAL DATA MANAGERS ---

export function isProductionMode(): boolean {
  try {
    const val = localStorage.getItem(PROD_MODE_KEY);
    return val === 'true';
  } catch (err) {
    return false;
  }
}

export function setProductionMode(enabled: boolean): void {
  try {
    localStorage.setItem(PROD_MODE_KEY, enabled ? 'true' : 'false');
  } catch (err) {
    console.error('Failed to toggle production mode:', err);
  }
}

// --- PARTICIPANT SUBMISSIONS MANAGERS ---

export function getStoredSubmissions(): ParticipantSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // If production mode is enabled, start with an empty array for 100% real live data
      const prod = isProductionMode();
      const initial = prod ? [] : INITIAL_DEMO_PARTICIPANTS;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored submissions:', err);
    return [];
  }
}

export function saveSubmission(submission: ParticipantSubmission): void {
  try {
    const current = getStoredSubmissions();
    const updated = [submission, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save submission to local storage:', err);
  }
}

export function resetDemoData(): ParticipantSubmission[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_PARTICIPANTS));
    setProductionMode(false);
    return INITIAL_DEMO_PARTICIPANTS;
  } catch (err) {
    console.error('Failed to reset demo data:', err);
    return INITIAL_DEMO_PARTICIPANTS;
  }
}

export function clearAllSubmissions(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear submissions:', err);
  }
}

export function generateParticipantId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `RES-${year}-${randomNum}`;
}
