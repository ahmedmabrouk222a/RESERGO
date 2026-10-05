import { useState, useEffect, useCallback } from 'react';
import type {
  ParticipantDemographics,
  NDIAnswer,
  ErgoAnswer,
  DASSAnswer,
  ParticipantSubmission,
  SurveyStep,
  AdminUser
} from './types/assessment';
import { calculateAllResults } from './lib/scoring';
import { getStoredSubmissions, saveSubmission, clearAllSubmissions, generateParticipantId } from './lib/storage';
import { fetchSubmissionsFromSupabase, isSupabaseConfigured, syncSubmissionToSupabase } from './lib/supabase';
import { exportToCSV, exportToExcel } from './lib/export';

// Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Participant Components
import { StepIndicator } from './components/participant/StepIndicator';
import { LandingPage } from './components/participant/LandingPage';
import { DemographicForm } from './components/participant/DemographicForm';
import { NDIForm } from './components/participant/NDIForm';
import { ErgoForm } from './components/participant/ErgoForm';
import { DASSForm } from './components/participant/DASSForm';
import { ReviewForm } from './components/participant/ReviewForm';
import { ConfirmationView } from './components/participant/ConfirmationView';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import type { AdminTab } from './components/admin/AdminLayout';
import { OverviewTab } from './components/admin/OverviewTab';
import { ParticipantsTab } from './components/admin/ParticipantsTab';
import { ParticipantDetailsModal } from './components/admin/ParticipantDetailsModal';
import { AnalyticsTab } from './components/admin/AnalyticsTab';
import { ExportTab } from './components/admin/ExportTab';
import { SettingsTab } from './components/admin/SettingsTab';

export function App() {
  // Main Side View State
  const [currentSide, setCurrentSide] = useState<'participant' | 'admin'>('participant');

  // Participant Flow Step State
  const [surveyStep, setSurveyStep] = useState<SurveyStep>('landing');

  // Admin Tab & Auth State
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [adminUser, setAdminUser] = useState<AdminUser>({
    email: '',
    isAuthenticated: false,
  });

  // Database Submissions State
  const [submissions, setSubmissions] = useState<ParticipantSubmission[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Active Selected Participant Modal state
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantSubmission | null>(null);

  // Active Draft Participant Form Data
  const [participantId, setParticipantId] = useState<string>(() => generateParticipantId());
  const [demographics, setDemographics] = useState<ParticipantDemographics>({
    fullName: '',
    age: '',
    sex: '',
    academicMajor: '',
    yearOfStudy: '',
    dailyScreenTime: '',
    weeklyLabHours: '',
    vasScore: 0,
  });

  const [ndiAnswers, setNdiAnswers] = useState<NDIAnswer[]>([]);
  const [ergoAnswers, setErgoAnswers] = useState<ErgoAnswer>({
    laptop: 1,
    posture: 1,
    breaks: 1,
    chair: 1,
  });
  const [dassAnswers, setDassAnswers] = useState<DASSAnswer[]>([]);
  const [lastSubmittedRecord, setLastSubmittedRecord] = useState<ParticipantSubmission | null>(null);

  // Master Data Refresh (Merges local storage & cloud database)
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const local = getStoredSubmissions();
      let merged = [...local];

      if (isSupabaseConfigured) {
        const cloud = await fetchSubmissionsFromSupabase();
        if (cloud && cloud.length > 0) {
          const map = new Map<string, ParticipantSubmission>();
          // Put local first
          local.forEach(s => map.set(s.id, s));
          // Put/overwrite cloud submissions (authoritative)
          cloud.forEach(s => map.set(s.id, s));
          merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          );
        }
      }

      setSubmissions(merged);
    } catch (err) {
      console.error('Error refreshing submissions:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial load and listeners for multi-tab / cloud sync
  useEffect(() => {
    refreshData();

    // Multi-tab local sync listener
    const handleStorageChange = () => {
      refreshData();
    };

    // Window focus listener to pull new submissions when returning to tab
    const handleFocus = () => {
      refreshData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshData]);

  // Periodic polling when admin portal is active
  useEffect(() => {
    if (currentSide !== 'admin') return;
    const interval = setInterval(() => {
      refreshData();
    }, 10000); // refresh every 10 seconds

    return () => clearInterval(interval);
  }, [currentSide, refreshData]);

  // Handlers for Participant Flow
  const handleStartSurvey = () => {
    setParticipantId(generateParticipantId());
    setSurveyStep('demographics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemographicsNext = (data: ParticipantDemographics) => {
    setDemographics(data);
    setSurveyStep('ndi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNDINext = (answers: NDIAnswer[]) => {
    setNdiAnswers(answers);
    setSurveyStep('ergo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleErgoNext = (answers: ErgoAnswer) => {
    setErgoAnswers(answers);
    setSurveyStep('dass');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDASSNext = (answers: DASSAnswer[]) => {
    setDassAnswers(answers);
    setSurveyStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmission = async () => {
    // Perform scoring calculations
    const { ndiResult, dassResult, ergoResult } = calculateAllResults(
      ndiAnswers,
      dassAnswers,
      ergoAnswers
    );

    const newSubmission: ParticipantSubmission = {
      id: crypto.randomUUID(),
      participantId,
      demographics,
      ndiAnswers,
      dassAnswers,
      ergoAnswers,
      ndiResult,
      dassResult,
      ergoResult,
      submittedAt: new Date().toISOString(),
    };

    // 1. Save to LocalStorage
    saveSubmission(newSubmission);

    // 2. Sync to Supabase if configured
    await syncSubmissionToSupabase(newSubmission);

    // 3. Update state & sync
    await refreshData();
    setLastSubmittedRecord(newSubmission);
    setSurveyStep('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestartSurvey = () => {
    setParticipantId(generateParticipantId());
    setDemographics({
      fullName: '',
      age: '',
      sex: '',
      academicMajor: '',
      yearOfStudy: '',
      dailyScreenTime: '',
      weeklyLabHours: '',
      vasScore: 0,
    });
    setNdiAnswers([]);
    setDassAnswers([]);
    setSurveyStep('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Actions
  const handleAdminLogin = (email: string) => {
    setAdminUser({ email, isAuthenticated: true });
    setCurrentSide('admin');
    refreshData();
  };

  const handleAdminLogout = () => {
    setAdminUser({ email: '', isAuthenticated: false });
    setCurrentSide('participant');
  };

  const handleClearData = () => {
    clearAllSubmissions();
    setSubmissions([]);
  };

  // Counts for step indicator
  const ndiCount = ndiAnswers.filter(a => !a.isApplicable || (a.selectedOptionIndex !== null && a.selectedOptionIndex >= 0)).length;
  const ergoCount = Object.values(ergoAnswers).filter(v => v !== undefined).length;
  const dassCount = dassAnswers.filter(a => a.score >= 0).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        currentSide={currentSide}
        adminUser={adminUser}
        onNavigateToAdmin={() => setCurrentSide('admin')}
        onNavigateToParticipant={() => setCurrentSide('participant')}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Body Switch */}
      {currentSide === 'participant' ? (
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Step Wizard Indicator */}
            <StepIndicator
              currentStep={surveyStep}
              ndiCompletedCount={ndiCount}
              ergoCompletedCount={ergoCount}
              dassCompletedCount={dassCount}
            />

            {/* Step Views */}
            {surveyStep === 'landing' && (
              <LandingPage
                onStart={handleStartSurvey}
                onAdminClick={() => setCurrentSide('admin')}
              />
            )}

            {surveyStep === 'demographics' && (
              <DemographicForm
                initialData={demographics}
                participantId={participantId}
                onNext={handleDemographicsNext}
              />
            )}

            {surveyStep === 'ndi' && (
              <NDIForm
                initialAnswers={ndiAnswers}
                onBack={() => setSurveyStep('demographics')}
                onNext={handleNDINext}
              />
            )}

            {surveyStep === 'ergo' && (
              <ErgoForm
                initialAnswers={ergoAnswers}
                onBack={() => setSurveyStep('ndi')}
                onNext={handleErgoNext}
              />
            )}

            {surveyStep === 'dass' && (
              <DASSForm
                initialAnswers={dassAnswers}
                onBack={() => setSurveyStep('ergo')}
                onNext={handleDASSNext}
              />
            )}

            {surveyStep === 'review' && (
              <ReviewForm
                demographics={demographics}
                ndiAnswers={ndiAnswers}
                ergoAnswers={ergoAnswers}
                dassAnswers={dassAnswers}
                participantId={participantId}
                onEditDemographics={() => setSurveyStep('demographics')}
                onEditNDI={() => setSurveyStep('ndi')}
                onEditErgo={() => setSurveyStep('ergo')}
                onEditDASS={() => setSurveyStep('dass')}
                onSubmit={handleFinalSubmission}
              />
            )}

            {surveyStep === 'confirmation' && lastSubmittedRecord && (
              <ConfirmationView
                submission={lastSubmittedRecord}
                onRestart={handleRestartSurvey}
              />
            )}
          </div>
        </main>
      ) : (
        /* ADMIN PORTAL SIDE */
        !adminUser.isAuthenticated ? (
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <AdminLogin
              onLogin={handleAdminLogin}
              onBackToParticipant={() => setCurrentSide('participant')}
            />
          </main>
        ) : (
          <AdminLayout
            activeTab={adminTab}
            onSelectTab={setAdminTab}
            onLogout={handleAdminLogout}
            totalCount={submissions.length}
            onRefreshData={refreshData}
            isRefreshing={isRefreshing}
          >
            {adminTab === 'overview' && (
              <OverviewTab
                submissions={submissions}
                onViewParticipant={(sub) => setSelectedParticipant(sub)}
                onNavigateToParticipants={() => setAdminTab('participants')}
              />
            )}

            {adminTab === 'participants' && (
              <ParticipantsTab
                submissions={submissions}
                onViewParticipant={(sub) => setSelectedParticipant(sub)}
                onExportCSV={() => exportToCSV(submissions)}
                onExportExcel={() => exportToExcel(submissions)}
              />
            )}

            {adminTab === 'analytics' && (
              <AnalyticsTab submissions={submissions} />
            )}

            {adminTab === 'export' && (
              <ExportTab
                submissions={submissions}
                onExportCSV={() => exportToCSV(submissions)}
                onExportExcel={() => exportToExcel(submissions)}
              />
            )}

            {adminTab === 'settings' && (
              <SettingsTab
                onClearAllData={handleClearData}
              />
            )}

            {/* Granular Participant Details Modal */}
            <ParticipantDetailsModal
              submission={selectedParticipant}
              onClose={() => setSelectedParticipant(null)}
            />
          </AdminLayout>
        )
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
