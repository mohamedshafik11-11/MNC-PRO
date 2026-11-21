import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { DashboardHome } from './components/DashboardHome';
import { JobListingsView } from './components/JobListingsView';
import { DocumentsCloudView } from './components/DocumentsCloudView';
import { SkillsCoursesView } from './components/SkillsCoursesView';
import { WeeklyTasksView } from './components/WeeklyTasksView';
import { InterviewReviewView } from './components/InterviewReviewView';
import { LinkedInAIInfluenceView } from './components/LinkedInAIInfluenceView';

// Modals
import { AuthModal } from './components/AuthModal';
import { VideoCallModal } from './components/VideoCallModal';
import { VoiceCallModal } from './components/VoiceCallModal';
import { AptitudeTestModal } from './components/AptitudeTestModal';
import { MasterPromptModal } from './components/MasterPromptModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { DataStabilityProofModal } from './components/DataStabilityProofModal';
import { CompanyIntelligenceView } from './components/CompanyIntelligenceView';
import { AvatarUploadModal } from './components/AvatarUploadModal';

// Types & Data
import {
  UserProfile,
  JobListing,
  WeeklyTask,
  DocumentItem,
  CourseItem,
  MockInterviewSession,
} from './types';
import {
  DEFAULT_USER_PROFILE,
  MOCK_JOB_LISTINGS,
  MOCK_WEEKLY_TASKS,
  MOCK_DOCUMENTS,
  MOCK_COURSES,
  MOCK_INTERVIEW_SESSIONS,
} from './data/mockData';

// Storage Engine
import {
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
  calculateAtsScore,
  calculateMncReadiness,
} from './utils/storage';

import { ShieldCheck, CheckCircle2, Sparkles, BrainCircuit } from 'lucide-react';

export default function App() {
  // Global User State (Persistent)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() =>
    loadFromStorage(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER_PROFILE)
  );

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchGlobalQuery, setSearchGlobalQuery] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Persistent Collections State
  const [jobs, setJobs] = useState<JobListing[]>(() =>
    loadFromStorage(STORAGE_KEYS.JOBS, MOCK_JOB_LISTINGS)
  );
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>(() =>
    loadFromStorage(STORAGE_KEYS.TASKS, MOCK_WEEKLY_TASKS)
  );
  const [documents, setDocuments] = useState<DocumentItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.DOCUMENTS, MOCK_DOCUMENTS)
  );
  const [courses, setCourses] = useState<CourseItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.COURSES, MOCK_COURSES)
  );
  const [interviewSessions, setInterviewSessions] = useState<MockInterviewSession[]>(() =>
    loadFromStorage(STORAGE_KEYS.INTERVIEWS, MOCK_INTERVIEW_SESSIONS)
  );

  // Modal Visibility States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState<boolean>(false);
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState<boolean>(false);
  const [isAptitudeOpen, setIsAptitudeOpen] = useState<boolean>(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState<boolean>(false);
  const [isStabilityProofOpen, setIsStabilityProofOpen] = useState<boolean>(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);

  // Live Toast Notification for Persistence
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showPersistenceToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Dynamic Call Config (customized when launched from a job card)
  const [activeCallTarget, setActiveCallTarget] = useState<{ company: string; role: string }>({
    company: currentUser.targetCompany || 'Google',
    role: currentUser.targetRole || 'Senior Software Development Engineer (SDE III)',
  });

  // Handle Dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Reactive Multi-Tab & Event Listener for Storage Sync
  useEffect(() => {
    const handleStorageSync = () => {
      const freshUser = loadFromStorage(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER_PROFILE);
      const freshJobs = loadFromStorage(STORAGE_KEYS.JOBS, MOCK_JOB_LISTINGS);
      const freshTasks = loadFromStorage(STORAGE_KEYS.TASKS, MOCK_WEEKLY_TASKS);
      const freshDocs = loadFromStorage(STORAGE_KEYS.DOCUMENTS, MOCK_DOCUMENTS);
      const freshCourses = loadFromStorage(STORAGE_KEYS.COURSES, MOCK_COURSES);
      const freshInterviews = loadFromStorage(STORAGE_KEYS.INTERVIEWS, MOCK_INTERVIEW_SESSIONS);

      setCurrentUser(freshUser);
      setJobs(freshJobs);
      setWeeklyTasks(freshTasks);
      setDocuments(freshDocs);
      setCourses(freshCourses);
      setInterviewSessions(freshInterviews);
    };

    window.addEventListener('mnc_pro_dataset_sync', handleStorageSync);
    window.addEventListener('storage', handleStorageSync);

    return () => {
      window.removeEventListener('mnc_pro_dataset_sync', handleStorageSync);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  // 1. Profile Update Handler
  const handleUpdateProfile = (updatedData: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const merged: UserProfile = {
        ...prev,
        ...updatedData,
        stats: {
          ...prev.stats,
          ...(updatedData.stats || {}),
        },
      };

      // Recalculate derived ATS score & Readiness
      const ats = calculateAtsScore(merged);
      merged.atsScore = ats;
      merged.stats.mncReadinessPercentage = calculateMncReadiness(merged, weeklyTasks, interviewSessions);

      saveToStorage(STORAGE_KEYS.USER_PROFILE, merged);
      showPersistenceToast(`Profile saved for ${merged.name} (${ats}% ATS)`);
      return merged;
    });
  };

  // 2. Auth Handler
  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setCurrentUser(authenticatedUser);
    saveToStorage(STORAGE_KEYS.USER_PROFILE, authenticatedUser);
    showPersistenceToast(`Authenticated as ${authenticatedUser.name} via ${authenticatedUser.verifiedAuthMethod}`);
  };

  // 3. Job Application Handler
  const handleApplyJob = (jobId: string) => {
    const updatedJobs = jobs.map((j) => (j.id === jobId ? { ...j, isApplied: true } : j));
    setJobs(updatedJobs);
    saveToStorage(STORAGE_KEYS.JOBS, updatedJobs);

    // Update user stats
    const appliedCount = updatedJobs.filter((j) => j.isApplied).length;
    setCurrentUser((prev) => {
      const updatedUser: UserProfile = {
        ...prev,
        stats: {
          ...prev.stats,
          appliedJobs: appliedCount,
        },
      };
      saveToStorage(STORAGE_KEYS.USER_PROFILE, updatedUser);
      return updatedUser;
    });

    const targetJob = jobs.find((j) => j.id === jobId);
    showPersistenceToast(`Applied to ${targetJob?.company || 'MNC'} • Total: ${appliedCount} applied`);
  };

  const handleStartMockForJob = (job: JobListing) => {
    setActiveCallTarget({
      company: job.company,
      role: job.title,
    });
    setIsVideoCallOpen(true);
  };

  const handleAddNewJob = (newJob: JobListing) => {
    setJobs((prev) => {
      const updated = [newJob, ...prev];
      saveToStorage(STORAGE_KEYS.JOBS, updated);
      return updated;
    });
    showPersistenceToast(`Added "${newJob.title}" to Job Board`);
  };

  // 4. Task Toggle Handler
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = weeklyTasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    setWeeklyTasks(updatedTasks);
    saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);

    // Update user stats
    const doneCount = updatedTasks.filter((t) => t.completed).length;
    setCurrentUser((prev) => {
      const updatedUser: UserProfile = {
        ...prev,
        stats: {
          ...prev.stats,
          weeklyTasksDone: doneCount,
          mncReadinessPercentage: calculateMncReadiness(prev, updatedTasks, interviewSessions),
        },
      };
      saveToStorage(STORAGE_KEYS.USER_PROFILE, updatedUser);
      return updatedUser;
    });

    showPersistenceToast(`Task checklist updated (${doneCount}/${updatedTasks.length} done)`);
  };

  // 5. Add Task Handler
  const handleAddTask = (task: WeeklyTask) => {
    const updated = [task, ...weeklyTasks];
    setWeeklyTasks(updated);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    showPersistenceToast(`New task added: "${task.title.slice(0, 30)}..."`);
  };

  // 6. Documents Handlers
  const handleAddDocument = (doc: DocumentItem) => {
    const updated = [doc, ...documents];
    setDocuments(updated);
    saveToStorage(STORAGE_KEYS.DOCUMENTS, updated);
    showPersistenceToast(`Uploaded document: ${doc.title}`);
  };

  const handleDeleteDocument = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    saveToStorage(STORAGE_KEYS.DOCUMENTS, updated);
    showPersistenceToast(`Document removed from cloud drive`);
  };

  // 7. Aptitude Score Handler
  const handleAptitudeScoreSaved = (scorePercentage: number) => {
    // Record in user stats
    setCurrentUser((prev) => {
      const updatedUser: UserProfile = {
        ...prev,
        stats: {
          ...prev.stats,
          aptitudeScoreAvg: Math.round((prev.stats.aptitudeScoreAvg + scorePercentage) / 2),
          mncReadinessPercentage: Math.min(
            98,
            Math.round((prev.stats.mncReadinessPercentage * 0.7 + scorePercentage * 0.3))
          ),
        },
      };
      saveToStorage(STORAGE_KEYS.USER_PROFILE, updatedUser);
      return updatedUser;
    });

    // Add session record into interviewSessions
    const newSession: MockInterviewSession = {
      id: `aptitude-session-${Date.now()}`,
      company: currentUser.targetCompany || 'Tier-1 MNC Bank',
      role: 'Online Aptitude & Logic Assessment',
      date: 'Today',
      roundType: 'Aptitude Round',
      score: scorePercentage,
      overallScore: scorePercentage,
      verdict: scorePercentage >= 70 ? 'Strong Hire' : 'Needs Practice',
      feedbackSummary: `Scored ${scorePercentage}% on quantitative speed math, reasoning, and CS fundamentals.`,
      strengths: ['Analytical logic', 'Speed arithmetic'],
      improvements: ['Double-check boundary constraints under time limit'],
      durationMinutes: 10,
    };

    const updatedSessions = [newSession, ...interviewSessions];
    setInterviewSessions(updatedSessions);
    saveToStorage(STORAGE_KEYS.INTERVIEWS, updatedSessions);

    showPersistenceToast(`Aptitude Score ${scorePercentage}% saved & recorded in Reviews!`);
  };

  // 8. Mock Interview Session Completed Handler
  const handleInterviewSessionCompleted = (session: MockInterviewSession) => {
    const updatedSessions = [session, ...interviewSessions];
    setInterviewSessions(updatedSessions);
    saveToStorage(STORAGE_KEYS.INTERVIEWS, updatedSessions);

    // Update scheduled / completed count
    setCurrentUser((prev) => {
      const updatedUser: UserProfile = {
        ...prev,
        stats: {
          ...prev.stats,
          interviewsScheduled: (prev.stats.interviewsScheduled || 0) + 1,
          mncReadinessPercentage: calculateMncReadiness(prev, weeklyTasks, updatedSessions),
        },
      };
      saveToStorage(STORAGE_KEYS.USER_PROFILE, updatedUser);
      return updatedUser;
    });

    showPersistenceToast(`Interview with ${session.company} evaluated (${session.verdict})`);
  };

  // 9. Reset / Restore Trigger Callbacks
  const handleDataReset = () => {
    const defaultUser = loadFromStorage(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER_PROFILE);
    const defaultJobs = loadFromStorage(STORAGE_KEYS.JOBS, MOCK_JOB_LISTINGS);
    const defaultTasks = loadFromStorage(STORAGE_KEYS.TASKS, MOCK_WEEKLY_TASKS);
    const defaultDocs = loadFromStorage(STORAGE_KEYS.DOCUMENTS, MOCK_DOCUMENTS);
    const defaultInterviews = loadFromStorage(STORAGE_KEYS.INTERVIEWS, MOCK_INTERVIEW_SESSIONS);

    setCurrentUser(defaultUser);
    setJobs(defaultJobs);
    setWeeklyTasks(defaultTasks);
    setDocuments(defaultDocs);
    setInterviewSessions(defaultInterviews);
    showPersistenceToast('All dataset partitions reset to factory defaults!');
  };

  // Render view router based on activeTab
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'home':
        return (
          <DashboardHome
            user={currentUser}
            jobs={jobs}
            weeklyTasks={weeklyTasks}
            onOpenVideoCall={() => {
              setActiveCallTarget({ company: currentUser.targetCompany, role: currentUser.targetRole });
              setIsVideoCallOpen(true);
            }}
            onOpenVoiceCall={() => setIsVoiceCallOpen(true)}
            onOpenAptitudeTest={() => setIsAptitudeOpen(true)}
            onOpenPromptAccelerator={() => setIsPromptModalOpen(true)}
            onNavigateTab={setActiveTab}
            onOpenStabilityProof={() => setIsStabilityProofOpen(true)}
          />
        );

      case 'jobs':
      case 'search':
        return (
          <JobListingsView
            jobs={jobs}
            user={currentUser}
            onApplyJob={handleApplyJob}
            onStartMockForJob={handleStartMockForJob}
            onNavigateToCompanyIntel={() => setActiveTab('company-intel')}
          />
        );

      case 'company-intel':
      case 'company':
        return (
          <CompanyIntelligenceView
            user={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onAddJobToBoard={handleAddNewJob}
            onStartMockForCompany={(company, role) => {
              setActiveCallTarget({ company, role });
              setIsVideoCallOpen(true);
            }}
          />
        );

      case 'storage':
        return (
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  <h2 className="text-xl font-bold">MNC Pro Local Storage & Stability Hub</h2>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    Active & Quota-Safe
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Real-time client-side local storage with quota checks, auto-compaction, and verifiable JSON export/import.
                </p>
              </div>
              <button
                onClick={() => setIsStabilityProofOpen(true)}
                className="rounded-2xl bg-emerald-500 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md hover:bg-emerald-400 transition active:scale-95"
              >
                Launch Storage & Proof Inspector
              </button>
            </div>
            <CompanyIntelligenceView
              user={currentUser}
              onUpdateProfile={handleUpdateProfile}
              onAddJobToBoard={handleAddNewJob}
              onStartMockForCompany={(company, role) => {
                setActiveCallTarget({ company, role });
                setIsVideoCallOpen(true);
              }}
            />
          </div>
        );

      case 'documents':
        return (
          <DocumentsCloudView
            documents={documents}
            user={currentUser}
            initialSubTab="documents"
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        );

      case 'cloud':
        return (
          <DocumentsCloudView
            documents={documents}
            user={currentUser}
            initialSubTab="cloud"
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        );

      case 'upload':
        return (
          <DocumentsCloudView
            documents={documents}
            user={currentUser}
            initialSubTab="upload"
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        );

      case 'skills':
      case 'courses':
      case 'course':
        return <SkillsCoursesView courses={courses} user={currentUser} />;

      case 'weekly-tasks':
      case 'tasks':
        return (
          <WeeklyTasksView
            tasks={weeklyTasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
          />
        );

      case 'interview-review':
      case 'activity':
        return (
          <InterviewReviewView
            sessions={interviewSessions}
            onStartNewMock={() => setIsVideoCallOpen(true)}
          />
        );

      case 'linkedin-influence':
      case 'influence':
        return (
          <LinkedInAIInfluenceView
            user={currentUser}
            onUpdateProfile={handleUpdateProfile}
          />
        );

      case 'aptitude':
        return (
          <div className="space-y-6">
            <div className="rounded-3xl bg-purple-600 p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BrainCircuit className="h-6 w-6" />
                  MNC Quantitative & Logic Aptitude Suite
                </h2>
                <p className="text-xs text-purple-100 mt-1">
                  10-minute speed math, permutations, probability, and core CS reasoning bank. Results persist to your career profile.
                </p>
              </div>
              <button
                onClick={() => setIsAptitudeOpen(true)}
                className="rounded-2xl bg-white px-5 py-2.5 text-xs font-black text-purple-700 shadow-md hover:bg-purple-50 transition active:scale-95"
              >
                Launch 10-Min Test Sprint
              </button>
            </div>
            <SkillsCoursesView courses={courses} user={currentUser} />
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="rounded-3xl bg-blue-600 p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Candidate Career Profile & ATS Matrix</h2>
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/30">
                    100% Persisted
                  </span>
                </div>
                <p className="text-xs text-blue-100 mt-1">
                  Target: {currentUser.targetRole} @ {currentUser.targetCompany} • CTC: {currentUser.targetCtc}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsStabilityProofOpen(true)}
                  className="rounded-2xl border border-white/40 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  Verify Data Proof
                </button>
                <button
                  id="btn-edit-profile-view"
                  onClick={() => setIsProfileEditOpen(true)}
                  className="rounded-2xl bg-white px-5 py-2 text-xs font-black text-blue-700 shadow-md hover:bg-blue-50 transition active:scale-95"
                >
                  Edit Candidate Profile
                </button>
              </div>
            </div>
            <LinkedInAIInfluenceView
              user={currentUser}
              onUpdateProfile={handleUpdateProfile}
            />
          </div>
        );

      default:
        return (
          <DashboardHome
            user={currentUser}
            jobs={jobs}
            weeklyTasks={weeklyTasks}
            onOpenVideoCall={() => setIsVideoCallOpen(true)}
            onOpenVoiceCall={() => setIsVoiceCallOpen(true)}
            onOpenAptitudeTest={() => setIsAptitudeOpen(true)}
            onOpenPromptAccelerator={() => setIsPromptModalOpen(true)}
            onNavigateTab={setActiveTab}
            onOpenStabilityProof={() => setIsStabilityProofOpen(true)}
          />
        );
    }
  };

  return (
    <div
      id="mnc-pro-app"
      className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased dark:bg-slate-950 dark:text-white flex flex-col font-sans selection:bg-blue-600 selection:text-white"
    >
      {/* Top Navigation Bar */}
      <Navbar
        user={currentUser}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileEdit={() => setIsProfileEditOpen(true)}
        onOpenPromptAccelerator={() => setIsPromptModalOpen(true)}
        onOpenStabilityProof={() => setIsStabilityProofOpen(true)}
        onOpenAvatarUpload={() => setIsAvatarModalOpen(true)}
        onSearchChange={(query) => {
          setSearchGlobalQuery(query);
          if (query.trim() && activeTab !== 'jobs') {
            setActiveTab('jobs');
          }
        }}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Persistence Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl ring-1 ring-white/10 dark:bg-slate-800 animate-in slide-in-from-bottom-3 duration-200">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
          <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-black uppercase text-emerald-400 border border-emerald-500/40">
            Persisted
          </span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          onOpenVideoCall={() => setIsVideoCallOpen(true)}
          onOpenVoiceCall={() => setIsVoiceCallOpen(true)}
          onOpenAptitudeTest={() => setIsAptitudeOpen(true)}
          onOpenPromptAccelerator={() => setIsPromptModalOpen(true)}
          user={currentUser}
        />

        {/* Center Main Dynamic View */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>

        {/* Right Corner: Progress Bar & AI Career Coach Chat */}
        <RightPanel
          user={currentUser}
          onOpenPromptAccelerator={() => setIsPromptModalOpen(true)}
          onOpenVideoCall={() => setIsVideoCallOpen(true)}
          onOpenAptitudeTest={() => setIsAptitudeOpen(true)}
        />
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
      />

      <VideoCallModal
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        targetCompany={activeCallTarget.company}
        targetRole={activeCallTarget.role}
        onSessionCompleted={handleInterviewSessionCompleted}
      />

      <VoiceCallModal
        isOpen={isVoiceCallOpen}
        onClose={() => setIsVoiceCallOpen(false)}
        targetCompany={currentUser.targetCompany}
        targetRole={currentUser.targetRole}
      />

      <AptitudeTestModal
        isOpen={isAptitudeOpen}
        onClose={() => setIsAptitudeOpen(false)}
        onScoreSaved={handleAptitudeScoreSaved}
      />

      <MasterPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />

      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
        user={currentUser}
        onSave={handleUpdateProfile}
      />

      {/* Dedicated Avatar Picture Upload Modal */}
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={currentUser.avatar}
        onSaveAvatar={(newUrl) => handleUpdateProfile({ avatar: newUrl })}
      />

      {/* Data Stability & Persistence Proof Modal */}
      <DataStabilityProofModal
        isOpen={isStabilityProofOpen}
        onClose={() => setIsStabilityProofOpen(false)}
        currentUser={currentUser}
        jobs={jobs}
        tasks={weeklyTasks}
        documents={documents}
        onDataReset={handleDataReset}
        onDataRestored={handleDataReset}
      />
    </div>
  );
}
