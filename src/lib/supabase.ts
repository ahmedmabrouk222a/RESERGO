import { createClient } from '@supabase/supabase-js';
import type { ParticipantSubmission } from '../types/assessment';
import { calculateNDI } from './scoring/ndi';

const DEFAULT_SUPABASE_URL = 'https://mwuhvkzmxrymayecsfee.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_A--Wk5UBKiE0RmSVGzgzKw_KUDGxk56';

// Read from environment variables if present, or fallback to stored browser config or project defaults
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const getStoredSupabaseConfig = () => {
  try {
    const url = localStorage.getItem('research_supabase_url') || '';
    const key = localStorage.getItem('research_supabase_key') || '';
    return { url, key };
  } catch {
    return { url: '', key: '' };
  }
};

const stored = getStoredSupabaseConfig();
export const supabaseUrl = envUrl || stored.url || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey = envAnonKey || stored.key || DEFAULT_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function saveCustomSupabaseConfig(url: string, key: string): void {
  try {
    localStorage.setItem('research_supabase_url', url.trim());
    localStorage.setItem('research_supabase_key', key.trim());
    window.location.reload();
  } catch (err) {
    console.error('Failed to save Supabase config:', err);
  }
}

/**
 * Saves submission to Supabase PostgreSQL database if configured.
 * Stores both raw questionnaire responses AND calculated scores (Rule 26).
 */
export async function syncSubmissionToSupabase(submission: ParticipantSubmission): Promise<boolean> {
  if (!supabase) return false;

  try {
    // 1. Insert Participant & Demographics
    const { error: partError } = await supabase
      .from('participants')
      .insert([
        {
          id: submission.id,
          participant_id: submission.participantId,
          full_name: submission.demographics.fullName,
          age: submission.demographics.age,
          sex: submission.demographics.sex,
          academic_major: submission.demographics.academicMajor,
          year_of_study: submission.demographics.yearOfStudy,
          daily_screen_time: submission.demographics.dailyScreenTime,
          weekly_lab_clinical_hours: submission.demographics.weeklyLabHours,
          vas_score: submission.demographics.vasScore,
          created_at: submission.submittedAt,
        }
      ]);

    if (partError) {
      console.error('Supabase participant insert error:', partError);
      return false;
    }

    // 2. Insert NDI Responses
    const ndiInserts = submission.ndiAnswers.map(ans => ({
      participant_id: submission.id,
      section_number: ans.sectionId,
      section_name: ans.sectionName,
      selected_option_index: ans.selectedOptionIndex,
      is_applicable: ans.isApplicable
    }));
    await supabase.from('ndi_responses').insert(ndiInserts);

    // 3. Insert DASS Responses
    const dassInserts = submission.dassAnswers.map(ans => ({
      participant_id: submission.id,
      question_number: ans.questionNumber,
      score: ans.score,
      category: ans.category
    }));
    await supabase.from('dass_responses').insert(dassInserts);

    // 4. Insert Ergonomic Responses
    await supabase.from('ergonomic_responses').insert([{
      participant_id: submission.id,
      laptop_score: submission.ergoAnswers.laptop,
      posture_score: submission.ergoAnswers.posture,
      breaks_score: submission.ergoAnswers.breaks,
      chair_score: submission.ergoAnswers.chair
    }]);

    // 5. Insert Calculated Results
    await supabase.from('assessment_results').insert([{
      participant_id: submission.id,
      ndi_score: submission.ndiResult.totalScore,
      ndi_max_score: submission.ndiResult.maxPossibleScore,
      ndi_percentage: submission.ndiResult.percentage,
      ndi_severity: submission.ndiResult.severity,

      depression_raw: submission.dassResult.depression.rawScore,
      depression_score: submission.dassResult.depression.finalScore,
      depression_percentage: submission.dassResult.depression.percentage,
      depression_severity: submission.dassResult.depression.severity,

      anxiety_raw: submission.dassResult.anxiety.rawScore,
      anxiety_score: submission.dassResult.anxiety.finalScore,
      anxiety_percentage: submission.dassResult.anxiety.percentage,
      anxiety_severity: submission.dassResult.anxiety.severity,

      stress_raw: submission.dassResult.stress.rawScore,
      stress_score: submission.dassResult.stress.finalScore,
      stress_percentage: submission.dassResult.stress.percentage,
      stress_severity: submission.dassResult.stress.severity,

      ergo_score: submission.ergoResult.totalScore,
      ergo_max_score: submission.ergoResult.maxPossibleScore,
      ergo_percentage: submission.ergoResult.percentage,
      ergo_severity: submission.ergoResult.riskLevel
    }]);

    return true;
  } catch (err) {
    console.error('Failed to sync to Supabase:', err);
    return false;
  }
}

/**
 * Fetches all live participant submissions recorded in Supabase cloud database.
 */
export async function fetchSubmissionsFromSupabase(): Promise<ParticipantSubmission[] | null> {
  if (!supabase) return null;

  try {
    const { data: participants, error: pErr } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: false });

    if (pErr || !participants) return null;

    const { data: results } = await supabase.from('assessment_results').select('*');
    const { data: ndiResp } = await supabase.from('ndi_responses').select('*');
    const { data: dassResp } = await supabase.from('dass_responses').select('*');
    const { data: ergoResp } = await supabase.from('ergonomic_responses').select('*');

    const resMap = new Map((results || []).map(r => [r.participant_id, r]));
    const ergoMap = new Map((ergoResp || []).map(e => [e.participant_id, e]));

    return participants.map((p) => {
      const r = resMap.get(p.id) || {};
      const e = ergoMap.get(p.id) || {};
      const ndiList = (ndiResp || []).filter(n => n.participant_id === p.id);
      const dassList = (dassResp || []).filter(d => d.participant_id === p.id);

      const parsedNdiAnswers = ndiList.map(n => ({
        sectionId: n.section_number,
        sectionName: n.section_name,
        selectedOptionIndex: n.selected_option_index,
        isApplicable: n.is_applicable
      }));

      const calculatedNDI = calculateNDI(parsedNdiAnswers);

      return {
        id: p.id,
        participantId: p.participant_id,
        demographics: {
          fullName: p.full_name,
          age: p.age,
          sex: p.sex,
          academicMajor: p.academic_major,
          yearOfStudy: p.year_of_study,
          dailyScreenTime: Number(p.daily_screen_time),
          weeklyLabHours: Number(p.weekly_lab_clinical_hours),
          vasScore: p.vas_score,
        },
        ndiAnswers: parsedNdiAnswers,
        dassAnswers: dassList.map(d => ({
          questionNumber: d.question_number,
          score: d.score,
          category: d.category as any
        })),
        ergoAnswers: {
          laptop: e.laptop_score ?? 0,
          posture: e.posture_score ?? 0,
          breaks: e.breaks_score ?? 0,
          chair: e.chair_score ?? 0,
        },
        ndiResult: calculatedNDI,
        dassResult: {
          depression: {
            rawScore: r.depression_raw ?? 0,
            finalScore: r.depression_score ?? 0,
            maxPossibleScore: 42,
            percentage: Number(r.depression_percentage ?? 0),
            severity: r.depression_severity ?? 'Normal'
          },
          anxiety: {
            rawScore: r.anxiety_raw ?? 0,
            finalScore: r.anxiety_score ?? 0,
            maxPossibleScore: 42,
            percentage: Number(r.anxiety_percentage ?? 0),
            severity: r.anxiety_severity ?? 'Normal'
          },
          stress: {
            rawScore: r.stress_raw ?? 0,
            finalScore: r.stress_score ?? 0,
            maxPossibleScore: 42,
            percentage: Number(r.stress_percentage ?? 0),
            severity: r.stress_severity ?? 'Normal'
          }
        },
        ergoResult: {
          totalScore: r.ergo_score ?? 0,
          maxPossibleScore: r.ergo_max_score ?? 6,
          percentage: Number(r.ergo_percentage ?? 0),
          riskLevel: r.ergo_severity ?? 'Low Ergonomic Risk',
          laptopScore: e.laptop_score ?? 0,
          postureScore: e.posture_score ?? 0,
          breaksScore: e.breaks_score ?? 0,
          chairScore: e.chair_score ?? 0,
        },
        submittedAt: p.created_at,
      };
    });
  } catch (err) {
    console.error('Failed to fetch from Supabase:', err);
    return null;
  }
}
