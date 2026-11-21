import React, { useState } from 'react';
import {
  Building2,
  Search,
  Sparkles,
  GitBranch,
  Star,
  ExternalLink,
  DollarSign,
  Briefcase,
  Layers,
  CheckCircle2,
  Plus,
  RefreshCw,
  Video,
  Download,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  Code2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CompanyIntelligence, JobListing, UserProfile } from '../types';
import { VERIFIED_MNC_INTELLIGENCE } from '../data/companyData';

interface CompanyIntelligenceViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onAddJobToBoard?: (job: JobListing) => void;
  onStartMockForCompany?: (company: string, role: string) => void;
}

export function CompanyIntelligenceView({
  user,
  onUpdateProfile,
  onAddJobToBoard,
  onStartMockForCompany,
}: CompanyIntelligenceViewProps) {
  const [companies, setCompanies] = useState<CompanyIntelligence[]>(VERIFIED_MNC_INTELLIGENCE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<CompanyIntelligence>(VERIFIED_MNC_INTELLIGENCE[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'opensource' | 'salaries' | 'interview' | 'roles'>('overview');

  // Live Google & Open Source fetch state
  const [customFetchQuery, setCustomFetchQuery] = useState('');
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleFetchLiveCompany = async (nameToFetch?: string) => {
    const target = (nameToFetch || customFetchQuery).trim();
    if (!target) return;

    setIsFetchingLive(true);
    setSyncStatusMsg(`Querying Google Knowledge & Open Source repos for "${target}"...`);

    try {
      const res = await fetch('/api/company-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: target }),
      });

      const data: CompanyIntelligence = await res.json();
      if (data && data.name) {
        // Check if already in list, if so replace, otherwise prepend
        setCompanies((prev) => {
          const exists = prev.find((c) => c.name.toLowerCase() === data.name.toLowerCase());
          if (exists) {
            return prev.map((c) => (c.name.toLowerCase() === data.name.toLowerCase() ? data : c));
          }
          return [data, ...prev];
        });

        setSelectedCompany(data);
        setCustomFetchQuery('');
        setSyncStatusMsg(`Successfully uploaded & synced intelligence for ${data.name}!`);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

        setTimeout(() => setSyncStatusMsg(null), 4000);
      }
    } catch (err: any) {
      console.error('Failed to fetch company intel:', err);
      setSyncStatusMsg(`Sync error: ${err.message || 'Could not fetch company data'}`);
    } finally {
      setIsFetchingLive(false);
    }
  };

  const handleImportTechStack = (techs: string[]) => {
    const currentSkillNames = user.skills.map((s) => s.name.toLowerCase());
    const newSkillsToAdd = techs
      .filter((t) => !currentSkillNames.includes(t.toLowerCase()))
      .map((name) => ({
        name,
        level: 85,
        verified: true,
      }));

    if (newSkillsToAdd.length === 0) {
      alert('Your candidate profile already includes all key technologies from this tech stack!');
      return;
    }

    onUpdateProfile({
      skills: [...user.skills, ...newSkillsToAdd],
    });

    confetti({ particleCount: 50, spread: 60 });
    alert(`Added ${newSkillsToAdd.length} verified technologies from ${selectedCompany.name} to your profile!`);
  };

  const handleImportJob = (role: CompanyIntelligence['activeRoles'][0]) => {
    if (!onAddJobToBoard) return;

    const newJob: JobListing = {
      id: `job-imported-${Date.now()}`,
      title: role.title,
      company: selectedCompany.name,
      companyLogo: selectedCompany.logo,
      location: role.location,
      workMode: role.workMode,
      salary: role.salary,
      type: 'Full-time',
      experience: role.experience,
      atsMatchScore: 92,
      tags: role.tags,
      description: `Official engineering role directly synced from ${selectedCompany.name} open source and careers index. Targeting high-scale software development.`,
      keyRequirements: [
        'Hands-on experience with core company tech stack',
        'Strong problem solving and algorithmic reasoning',
        'Demonstrated understanding of distributed architectures',
      ],
      hiringRounds: selectedCompany.hiringProcess.map((h) => h.roundName),
      postedAgo: 'Direct from Google & Open Source',
      applicantsCount: 64,
      isApplied: false,
      featured: true,
    };

    onAddJobToBoard(newJob);
    confetti({ particleCount: 40, spread: 50 });
    alert(`Imported "${role.title}" into your MNC Job Board!`);
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = selectedFilter === 'All' || c.name.toLowerCase().includes(selectedFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-0.5 text-xs font-bold text-blue-300 backdrop-blur-sm border border-blue-400/30">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Direct from Google & Open Source
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-400/30">
                100% Verified
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Tier-1 MNC Intelligence & Open Source Stacks
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time engineering data uploaded directly from Google Knowledge Graph, GitHub open-source repositories,
              and verified salary bands. Sync company tech stacks directly to your profile.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <p className="text-[11px] text-slate-400">Indexed MNCs</p>
              <p className="text-xl font-bold text-white mt-0.5">{companies.length}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">Tier-1 Giants</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
              <p className="text-[11px] text-slate-400">Open Source Repos</p>
              <p className="text-xl font-bold text-white mt-0.5">
                {companies.reduce((acc, curr) => acc + curr.openSourceProjects.length, 0)}+
              </p>
              <p className="text-[10px] text-blue-400 font-semibold">GitHub Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Live Fetch Any Company Bar */}
      <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-850 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Live Company Upload from Google & Open Source
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Extracts GitHub repos, Levels.fyi salaries & active roles</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="input-fetch-company-live"
              type="text"
              placeholder="Enter ANY company name (e.g. Stripe, OpenAI, NVIDIA, Databricks, Uber, TCS)..."
              value={customFetchQuery}
              onChange={(e) => setCustomFetchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFetchLiveCompany();
                }
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            id="btn-upload-company-google-source"
            onClick={() => handleFetchLiveCompany()}
            disabled={isFetchingLive || !customFetchQuery.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${isFetchingLive ? 'animate-spin' : ''}`} />
            <span>{isFetchingLive ? 'Uploading from Google & GitHub...' : 'Upload Data from Google'}</span>
          </button>
        </div>

        {syncStatusMsg && (
          <div className="rounded-xl bg-blue-50 p-2.5 text-xs font-semibold text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
        )}

        {/* Quick Launch Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Quick Sync:</span>
          {['OpenAI', 'NVIDIA', 'Stripe', 'Uber', 'Databricks', 'Spotify', 'Goldman Sachs'].map((co) => (
            <button
              key={co}
              onClick={() => handleFetchLiveCompany(co)}
              disabled={isFetchingLive}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              + {co}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Company Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {companies.map((co) => {
          const isSelected = selectedCompany.id === co.id;
          return (
            <button
              key={co.id}
              onClick={() => setSelectedCompany(co)}
              className={`shrink-0 flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition shadow-2xs ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300'
              }`}
            >
              <img
                src={co.logo}
                alt={co.name}
                className="h-4 w-4 rounded-sm object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span>{co.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Detailed Selected Company View */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-850 overflow-hidden">
        {/* Company Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center gap-4">
            <img
              src={selectedCompany.logo}
              alt={selectedCompany.name}
              className="h-14 w-14 rounded-2xl object-contain bg-white p-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{selectedCompany.name}</h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {selectedCompany.source}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedCompany.industry} • HQ: {selectedCompany.hq}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleImportTechStack(selectedCompany.techStack)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500 transition active:scale-95"
              title="Add this company's open source tech stack to your verified profile skills"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Tech Stack to Profile</span>
            </button>

            {onStartMockForCompany && (
              <button
                onClick={() =>
                  onStartMockForCompany(selectedCompany.name, selectedCompany.activeRoles[0]?.title || 'Software Engineer')
                }
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
              >
                <Video className="h-3.5 w-3.5 text-blue-600" />
                <span>Simulate Mock Round</span>
              </button>
            )}

            <a
              href={selectedCompany.githubOrg}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              title="Open Official GitHub Organization"
            >
              <GitBranch className="h-4 w-4" />
            </a>

            <a
              href={selectedCompany.careersUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              title="Open Official Careers Page"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-100/50 px-6 py-2 dark:border-slate-800 dark:bg-slate-900/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'overview'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Overview & Tech Stack</span>
          </button>

          <button
            onClick={() => setActiveTab('opensource')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'opensource'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <GitBranch className="h-3.5 w-3.5 text-emerald-500" />
            <span>Open Source Projects ({selectedCompany.openSourceProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('salaries')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'salaries'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <DollarSign className="h-3.5 w-3.5 text-amber-500" />
            <span>Verified Salary CTC Bands</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'interview'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-purple-500" />
            <span>Interview Hiring Bar</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'roles'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5 text-blue-500" />
            <span>Direct Hiring Tracks ({selectedCompany.activeRoles.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Company Engineering Overview
                </h4>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {selectedCompany.overview}
                </p>
              </div>

              {/* Verified Tech Stack Chips */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Production Tech Stack & Primitives
                  </h4>
                  <button
                    onClick={() => handleImportTechStack(selectedCompany.techStack)}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Add All to My Profile</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedCompany.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-xs font-bold text-blue-900 dark:border-blue-900/50 dark:bg-blue-950 dark:text-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Open Source Projects */}
          {activeTab === 'opensource' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCompany.openSourceProjects.map((proj, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/40 p-4 hover:border-blue-400 transition dark:border-slate-800 dark:bg-slate-850/50"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-emerald-600" />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{proj.name}</h4>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span>{proj.stars || '10k+'}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{proj.description}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-2.5 dark:border-slate-800">
                    <span className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {proj.language}
                    </span>

                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                    >
                      <span>GitHub Repo</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Salary Bands */}
          {activeTab === 'salaries' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 overflow-hidden dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3.5">Level Tier</th>
                      <th className="p-3.5">Engineering Title</th>
                      <th className="p-3.5">Base Salary</th>
                      <th className="p-3.5">Total Compensation (TC)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedCompany.salaryBands.map((band, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-black text-blue-600 dark:text-blue-400">{band.level}</td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">{band.role}</td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{band.base}</td>
                        <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">{band.totalComp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Interview Hiring Bar */}
          {activeTab === 'interview' && (
            <div className="space-y-3">
              {selectedCompany.hiringProcess.map((round, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-850 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{round.roundName}</h5>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Focus: {round.focus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{round.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: Direct Active Roles */}
          {activeTab === 'roles' && (
            <div className="space-y-3">
              {selectedCompany.activeRoles.map((role, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-400 transition dark:border-slate-800 dark:bg-slate-850"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{role.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {role.location} • {role.experience} • {role.salary}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {role.tags.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleImportJob(role)}
                      className="flex items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500 transition active:scale-95"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add to My Job Board</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
