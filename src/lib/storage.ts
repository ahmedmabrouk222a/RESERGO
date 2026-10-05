import type { ParticipantSubmission } from '../types/assessment';
import { calculateNDI } from './scoring/ndi';

const STORAGE_KEY = 'academic_research_submissions_v1';
const ADMIN_CREDS_KEY = 'academic_research_admin_creds_v1';

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

// --- PARTICIPANT SUBMISSIONS MANAGERS ---

export function getStoredSubmissions(): ParticipantSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const list: ParticipantSubmission[] = JSON.parse(raw);
    return list.map(sub => {
      if (sub.ndiAnswers && sub.ndiAnswers.length > 0) {
        return {
          ...sub,
          ndiResult: calculateNDI(sub.ndiAnswers)
        };
      }
      return sub;
    });
  } catch (err) {
    console.error('Failed to parse stored submissions:', err);
    return [];
  }
}

export function saveSubmission(submission: ParticipantSubmission): void {
  try {
    const current = getStoredSubmissions();
    // Avoid duplicate insertions
    const exists = current.some(s => s.id === submission.id);
    const updated = exists ? current : [submission, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Trigger storage event for multi-tab sync in same browser
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save submission to local storage:', err);
  }
}

export function clearAllSubmissions(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to clear submissions:', err);
  }
}

export function generateParticipantId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `RES-${year}-${randomNum}`;
}
