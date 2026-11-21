import { useState } from 'react';
import {
  Briefcase,
  Video,
  Mic,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { UserProfile, JobListing, WeeklyTask } from '../types';

export interface DashboardHomeProps {
  user: UserProfile;
  jobs: JobListing[];
  weeklyTasks?: WeeklyTask[];
  tasks?: WeeklyTask[];
  onToggleTask?: (id: string) => void;
  onSelectJob?: (job: JobListing) => void;
  onOpenVideoCall: () => void;
  onOpenVoiceCall: () => void;
  onOpenAptitudeTest?: () => void;
  onOpenAptitude?: () => void;
  onOpenPromptAccelerator?: () => void;
  onOpenMasterPrompt?: () => void;
  onOpenLinkedInAi?: () => void;
  onNavigateTab?: (tab: string) => void;
  onViewAllJobs?: () => void;
  onViewAllTasks?: () => void;
  onOpenStabilityProof?: () => void;
}

export function DashboardHome({
  user,
  jobs,
  weeklyTasks,
  tasks,
  onToggleTask,
  onSelectJob,
  onOpenVideoCall,
  onOpenVoiceCall,
  onOpenAptitudeTest,
  onOpenAptitude,
  onOpenPromptAccelerator,
  onOpenMasterPrompt,
  onOpenLinkedInAi,
  onNavigateTab,
  onViewAllJobs,
  onViewAllTasks,
  onOpenStabilityProof,
}: DashboardHomeProps) {
  const currentTasks = weeklyTasks || tasks || [];
  const handleAptitude = onOpenAptitudeTest || onOpenAptitude || (() => {});
  const handlePrompt = onOpenPromptAccelerator || onOpenMasterPrompt || (() => {});
  const handleJobsNav = onViewAllJobs || (() => onNavigateTab && onNavigateTab('jobs'));
  const handleTasksNav = onViewAllTasks || (() => onNavigateTab && onNavigateTab('weekly-tasks'));
  const handleLinkedInNav = onOpenLinkedInAi || (() => onNavigateTab && onNavigateTab('linkedin-influence'));

  return (
    <div className="space-y-6 pb-12">
      {/* Data Stability & Persistence Proof Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-300/80 bg-emerald-50/80 p-4 dark:border-emerald-800/50 dark:bg-emerald-950/30">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-950 dark:text-emerald-100">
                Persistent Data Stability & Auto-Sync Engine
              </span>
              <span className="rounded-full bg-emerald-200/80 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                Proof Active
              </span>
            </div>
            <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
              Profile changes, skills, applied jobs ({jobs.filter((j) => j.isApplied).length}), and aptitude scores are permanently stored in browser disk storage. Zero data loss across reloads.
            </p>
          </div>
        </div>

        {onOpenStabilityProof && (
          <button
            id="btn-dashboard-verify-proof"
            onClick={onOpenStabilityProof}
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition active:scale-95"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verify Stability Proof</span>
          </button>
        )}
      </div>
      {/* 1. Hero Welcome & Summary Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-sm border border-blue-400/30 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Targeting {user.targetCompany} • {user.targetRole}
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-400/30">
                ATS {user.atsScore}%
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ready for your next Tier-1 MNC interview, {user.name.split(' ')[0]}?
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your profile is optimized for Google, Amazon, and Microsoft hiring bars. Master high-scale system design and rapid aptitude shortcuts today.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                id="btn-hero-master-prompt"
                onClick={handlePrompt}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition hover:from-amber-400 hover:to-orange-400 active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>10-Minute Master Prompt</span>
              </button>

              <button
                id="btn-hero-video-call"
                onClick={onOpenVideoCall}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20 border border-white/15"
              >
                <Video className="h-4 w-4 text-blue-400" />
                <span>Start Video Mock</span>
              </button>

              <button
                id="btn-hero-aptitude"
                onClick={handleAptitude}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20 border border-white/15"
              >
                <BrainCircuit className="h-4 w-4 text-purple-400" />
                <span>Rapid Aptitude Test</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <p className="text-[11px] text-slate-400 font-medium">Applied MNCs</p>
              <p className="text-xl font-bold text-white mt-0.5">{user.stats.appliedJobs}</p>
              <p className="text-[10px] text-blue-300 mt-0.5">3 Under Review</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <p className="text-[11px] text-slate-400 font-medium">Interviews Set</p>
              <p className="text-xl font-bold text-white mt-0.5">{user.stats.interviewsScheduled}</p>
              <p className="text-[10px] text-emerald-300 mt-0.5">Google & AWS</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <p className="text-[11px] text-slate-400 font-medium">Aptitude Avg</p>
              <p className="text-xl font-bold text-white mt-0.5">{user.stats.aptitudeScoreAvg}%</p>
              <p className="text-[10px] text-purple-300 mt-0.5">Top 2% Percentile</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
              <p className="text-[11px] text-slate-400 font-medium">Daily Streak</p>
              <p className="text-xl font-bold text-amber-400 mt-0.5">{user.stats.streakDays} Days 🔥</p>
              <p className="text-[10px] text-amber-300/80 mt-0.5">Active Sprint</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Feature Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Video Call */}
        <div
          id="card-action-video-call"
          onClick={onOpenVideoCall}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4.5 shadow-sm transition hover:shadow-md hover:border-blue-400 dark:border-blue-900/40 dark:from-slate-800 dark:to-slate-850"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Video className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Live AI Screen
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
            AI Video Mock Call
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real webcam video interview with AI hiring manager, live facial confidence & speech grading.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span>Launch Video Studio</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Voice Call AI */}
        <div
          id="card-action-voice-call"
          onClick={onOpenVoiceCall}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-4.5 shadow-sm transition hover:shadow-md hover:border-indigo-400 dark:border-indigo-900/40 dark:from-slate-800 dark:to-slate-850"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
              <Mic className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Voice AI Studio
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
            Voice AI Coach Call
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Two-way real-time audio phone simulation. Practice STAR answers with instant feedback.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Start Voice Call</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Aptitude Test */}
        <div
          id="card-action-aptitude-test"
          onClick={handleAptitude}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4.5 shadow-sm transition hover:shadow-md hover:border-purple-400 dark:border-purple-900/40 dark:from-slate-800 dark:to-slate-850"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Timed Screening
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition">
            MNC Aptitude Exam
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Quant, logical reasoning, and verbal tests with step-by-step AI speed math shortcuts.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <span>Take Test Now</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* LinkedIn AI Influence */}
        <div
          id="card-action-linkedin-ai"
          onClick={handleLinkedInNav}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white p-4.5 shadow-sm transition hover:shadow-md hover:border-cyan-400 dark:border-cyan-900/40 dark:from-slate-800 dark:to-slate-850"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A66C2] text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Personal Brand
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
            AI Influence & LinkedIn
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Generate viral tech thought leadership posts & optimize profile to attract MNC recruiters.
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            <span>Open Influencer Hub</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tier-1 MNC Jobs & Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                Featured Tier-1 MNC Openings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Matched with your skills and ATS-verified resume score ({user.atsScore}%)
              </p>
            </div>

            <button
              id="btn-view-all-jobs"
              onClick={handleJobsNav}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
            >
              <span>View All ({jobs.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                id={`job-card-${job.id}`}
                onClick={() => onSelectJob && onSelectJob(job)}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-850"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 p-1.5 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                        {job.company.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                          {job.title}
                        </h4>
                        {job.featured && (
                          <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300">
                            HOT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {job.company} • {job.location} • <span className="font-semibold text-slate-700 dark:text-slate-300">{job.salary}</span>
                      </p>
                    </div>
                  </div>

                  {/* ATS Match Gauge */}
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      <Zap className="h-3 w-3" />
                      {job.atsMatchScore}% ATS
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {job.tags.slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-400 ml-auto">
                    {job.applicantsCount} Applicants • {job.postedAgo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Weekly Tasks & Sprints */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Weekly Sprint Tasks
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentTasks.filter((t) => t.completed).length} of {currentTasks.length} tasks completed
              </p>
            </div>

            <button
              id="btn-view-all-tasks"
              onClick={handleTasksNav}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Manage
            </button>
          </div>

          <div className="space-y-2">
            {currentTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                onClick={() => onToggleTask && onToggleTask(task.id)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                  task.completed
                    ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-800 dark:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                      task.completed
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        task.completed
                          ? 'text-slate-400 line-through'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {task.title}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {task.category} • +{task.points} pts
                    </span>
                  </div>
                </div>

                <span
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                    task.priority === 'High'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Mock History Highlight */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4 dark:border-slate-800 dark:from-slate-800 dark:to-slate-850">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-blue-600" />
                Latest Mock Review
              </span>
              <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                Strong Hire (93%)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Google Staff SDE Mock: "Exceptional distributed write-ahead log & Raft consensus answers."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
