import { Search, Flame, Video, Sparkles, BookOpen, ShieldCheck, CheckCircle2, Moon, Sun, Menu, Shield, Camera } from 'lucide-react';
import { UserProfile } from '../types';

export interface NavbarProps {
  user: UserProfile;
  searchQuery?: string;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onSearchChange?: (q: string) => void;
  onOpenVideoCall?: () => void;
  onOpenVoiceCall?: () => void;
  onOpenAptitudeTest?: () => void;
  onOpenAptitude?: () => void;
  onOpenPromptAccelerator?: () => void;
  onOpenMasterPrompt?: () => void;
  onOpenAuthModal?: () => void;
  onOpenAuth?: () => void;
  onOpenProfileEdit?: () => void;
  onOpenProfile?: () => void;
  onToggleMobileSidebar?: () => void;
  onOpenStabilityProof?: () => void;
  onOpenAvatarUpload?: () => void;
}

export function Navbar({
  user,
  searchQuery = '',
  isDarkMode = false,
  onToggleTheme,
  onSearchChange = () => {},
  onOpenVideoCall = () => {},
  onOpenAptitudeTest,
  onOpenAptitude,
  onOpenPromptAccelerator,
  onOpenMasterPrompt,
  onOpenAuthModal,
  onOpenAuth,
  onOpenProfileEdit,
  onOpenProfile,
  onToggleMobileSidebar,
  onOpenStabilityProof,
  onOpenAvatarUpload,
}: NavbarProps) {
  const handleAptitude = onOpenAptitudeTest || onOpenAptitude || (() => {});
  const handlePrompt = onOpenPromptAccelerator || onOpenMasterPrompt || (() => {});
  const handleAuth = onOpenAuthModal || onOpenAuth || (() => {});
  const handleProfile = onOpenProfileEdit || onOpenProfile || (() => {});

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 lg:px-6">
      {/* Brand & Search */}
      <div className="flex items-center gap-3 lg:gap-6 flex-1 max-w-2xl">
        {onToggleMobileSidebar && (
          <button
            id="btn-mobile-sidebar-toggle"
            onClick={onToggleMobileSidebar}
            className="lg:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 text-white font-black text-base tracking-tighter">
            M
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-lg">MNC</span>
              <span className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-1.5 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">PRO</span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Tier-1 Career & AI Interview Hub</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="input-global-search"
            type="text"
            placeholder="Search Tier-1 MNC jobs, Google DSA, System Design, Aptitude, Skills..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/75 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
          />
        </div>
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Data Stability & Persistence Proof Button */}
        {onOpenStabilityProof && (
          <button
            id="btn-stability-proof-nav"
            onClick={onOpenStabilityProof}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-300/80 bg-emerald-50/80 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-black text-emerald-800 shadow-2xs transition hover:bg-emerald-100 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300"
            title="Inspect Data Stability, Persistence & Verification Tests"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Data Proof:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">100% Stable</span>
          </button>
        )}

        {/* 10-Min Master Prompt Button */}
        <button
          id="btn-nav-master-prompt"
          onClick={handlePrompt}
          className="hidden md:flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 transition hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
          title="Master 10-Minute MNC Prep Prompt"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
          <span>10-Min Prompt</span>
        </button>

        {/* Video Mock Interview */}
        <button
          id="btn-nav-video-mock"
          onClick={onOpenVideoCall}
          className="hidden sm:flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          <Video className="h-3.5 w-3.5" />
          <span>AI Video Mock</span>
        </button>

        {/* Aptitude Quick Test */}
        <button
          id="btn-nav-aptitude"
          onClick={handleAptitude}
          className="hidden lg:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
          <span>Aptitude Test</span>
        </button>

        {/* Theme Toggle */}
        {onToggleTheme && (
          <button
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>
        )}

        {/* Streak Counter */}
        <div className="flex items-center gap-1 rounded-xl bg-orange-50 px-2.5 py-1.5 text-xs font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
          <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
          <span>{user.stats?.streakDays || 12}d</span>
        </div>

        {/* User Profile Trigger & Quick Avatar Update */}
        <div className="flex items-center gap-1.5 pl-1">
          <div className="flex items-center gap-1 rounded-xl p-1 transition hover:bg-slate-100 dark:hover:bg-slate-800">
            <div
              className="relative group cursor-pointer"
              onClick={onOpenAvatarUpload || handleProfile}
              title="Update profile picture (Upload, Camera, Presets)"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-600 transition"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition text-white">
                <Camera className="h-3 w-3" />
              </span>
            </div>

            <button
              id="btn-user-profile-trigger"
              onClick={handleProfile}
              className="text-left hidden xl:block pl-1"
              title="Edit Full Candidate Profile"
            >
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
                <CheckCircle2 className="h-3 w-3 text-blue-500" />
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.targetCompany}</p>
            </button>
          </div>

          {/* Quick Auth Switch */}
          <button
            id="btn-switch-auth"
            onClick={handleAuth}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            title="Authentication & Social Accounts"
          >
            <ShieldCheck className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
