import { createClient } from '@supabase/supabase-js';
import type { ParticipantSubmission } from '../types/assessment';

// Read from environment variables if present
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
      ])
      .select();

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
