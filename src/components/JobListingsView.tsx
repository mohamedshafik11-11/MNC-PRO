import { useState } from 'react';
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  DollarSign,
  Zap,
  CheckCircle2,
  Video,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JobListing, UserProfile } from '../types';

interface JobListingsViewProps {
  jobs: JobListing[];
  user: UserProfile;
  onApplyJob: (jobId: string) => void;
  onStartMockForJob: (job: JobListing) => void;
  onNavigateToCompanyIntel?: () => void;
}

export function JobListingsView({
  jobs,
  user,
  onApplyJob,
  onStartMockForJob,
  onNavigateToCompanyIntel,
}: JobListingsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  // Helper to calculate dynamic ATS match between user verified skills and job requirements
  const getDynamicMatchScore = (job: JobListing): number => {
    if (!user.skills || user.skills.length === 0) return job.atsMatchScore;
    const userSkillNames = user.skills.map((s) => s.name.toLowerCase());

    let matches = 0;
    job.tags.forEach((tag) => {
      const tagLower = tag.toLowerCase();
      if (userSkillNames.some((sn) => sn.includes(tagLower) || tagLower.includes(sn))) {
        matches += 1;
      }
    });

    const matchRatio = job.tags.length > 0 ? matches / job.tags.length : 0.8;
    const dynamicScore = Math.round(75 + matchRatio * 23);
    return Math.min(99, Math.max(72, dynamicScore));
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMode =
      selectedWorkMode === 'All' ||
      (selectedWorkMode === 'Remote' && j.workMode === 'Remote') ||
      (selectedWorkMode === 'Hybrid' && j.workMode === 'Hybrid') ||
      (selectedWorkMode === 'Tier-1 Tech' &&
        ['Google', 'Amazon Web Services (AWS)', 'Microsoft', 'Apple', 'Meta'].includes(j.company));

    return matchesSearch && matchesMode;
  });

  const handleApply = (job: JobListing) => {
    if (job.isApplied) return;
    onApplyJob(job.id);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-blue-600" />
              Tier-1 MNC Job Board
            </h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Matched to {user.targetRole}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Verified hiring tracks with real-time profile ATS alignment and company-specific AI mock interview simulators.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Remote', 'Hybrid', 'Tier-1 Tech'].map((mode) => (
            <button
              key={mode}
              id={`btn-filter-job-${mode.toLowerCase()}`}
              onClick={() => setSelectedWorkMode(mode)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedWorkMode === mode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Google & Open Source Sync Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white p-4 dark:border-blue-900/40 dark:bg-slate-850">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Live MNC Company Intelligence (Google & Open Source)
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Directly upload company intelligence, levels.fyi salary bands, and GitHub open-source stacks for Google, Microsoft, Amazon, Meta, Apple, and Netflix.
            </p>
          </div>
        </div>

        {onNavigateToCompanyIntel && (
          <button
            id="btn-jobs-open-company-hub"
            onClick={onNavigateToCompanyIntel}
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500 transition active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Open Company Hub</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id="input-jobs-search"
          type="text"
          placeholder="Filter by company, role (SDE III, Cloud Architect), or tech stack (React, Go, AWS)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-850 dark:text-white"
        />
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredJobs.map((job) => {
          const matchScore = getDynamicMatchScore(job);

          return (
            <div
              key={job.id}
              id={`job-card-${job.id}`}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-400 hover:shadow-md transition dark:border-slate-800 dark:bg-slate-850 space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Company & ATS Match */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="h-10 w-10 rounded-xl object-contain bg-slate-50 p-1.5 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{job.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{job.company}</span>
                        <span>•</span>
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{job.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        matchScore >= 90
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      ATS {matchScore}%
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{job.salary}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{job.postedAgo}</span>
                  <span>•</span>
                  <span>{job.applicantsCount} applicants</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartMockForJob(job)}
                    className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
                    title={`Practice AI Interview for ${job.company}`}
                  >
                    <Video className="h-3.5 w-3.5 text-blue-600" />
                    <span>Mock Prep</span>
                  </button>

                  <button
                    id={`btn-apply-job-${job.id}`}
                    onClick={() => handleApply(job)}
                    disabled={job.isApplied}
                    className={`flex items-center gap-1 rounded-xl px-4 py-1.5 text-xs font-bold transition shadow-xs ${
                      job.isApplied
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95'
                    }`}
                  >
                    {job.isApplied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <span>1-Click Apply</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
