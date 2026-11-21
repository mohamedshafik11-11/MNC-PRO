import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Cloud,
  UploadCloud,
  Award,
  BookOpen,
  CheckSquare,
  MessageSquare,
  Share2,
  Video,
  Mic,
  BrainCircuit,
  Sparkles,
  HelpCircle,
  Globe,
  HardDrive,
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab =
  | 'home'
  | 'jobs'
  | 'company-intel'
  | 'documents'
  | 'cloud'
  | 'upload'
  | 'skills'
  | 'courses'
  | 'tasks'
  | 'weekly-tasks'
  | 'interview-review'
  | 'linkedin-ai'
  | 'linkedin-influence'
  | 'master-prompts'
  | 'storage';

export interface SidebarProps {
  activeTab: NavTab | string;
  onSelectTab: (tab: any) => void;
  onOpenVideoCall: () => void;
  onOpenVoiceCall: () => void;
  onOpenAptitudeTest?: () => void;
  onOpenAptitude?: () => void;
  onOpenPromptAccelerator?: () => void;
  onOpenMasterPrompt?: () => void;
  onOpenHelpChat?: () => void;
  user?: UserProfile;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  onOpenVideoCall,
  onOpenVoiceCall,
  onOpenAptitudeTest,
  onOpenAptitude,
  onOpenPromptAccelerator,
  onOpenMasterPrompt,
  onOpenHelpChat,
  user,
}: SidebarProps) {
  const handleAptitude = onOpenAptitudeTest || onOpenAptitude || (() => {});
  const handleHelp = onOpenHelpChat || (() => onSelectTab('master-prompts'));

  const navItems = [
    { id: 'home', label: 'Dashboard Home', icon: LayoutDashboard, badge: 'Overview' },
    { id: 'jobs', label: 'MNC Job Openings', icon: Briefcase, badge: '6 New' },
    { id: 'company-intel', label: 'Company Open Source', icon: Globe, badge: 'Google Data' },
    { id: 'documents', label: 'Documents & ATS', icon: FileText, badge: '92% ATS' },
    { id: 'cloud', label: 'Cloud Drive', icon: Cloud },
    { id: 'upload', label: 'Upload & Parse', icon: UploadCloud },
    { id: 'skills', label: 'Skill Matrix', icon: Award },
    { id: 'courses', label: 'MNC Courses', icon: BookOpen, badge: '4 Active' },
    { id: 'tasks', label: 'Weekly Tasks', icon: CheckSquare, badge: '6 Tasks' },
    { id: 'interview-review', label: 'Interview Review', icon: MessageSquare },
    { id: 'linkedin-ai', label: 'AI Influence & LinkedIn', icon: Share2, badge: 'Sync' },
    { id: 'master-prompts', label: '10-Min Master Prompts', icon: Sparkles, badge: 'Pro' },
    { id: 'storage', label: 'Storage & Persistence', icon: HardDrive, badge: 'Verified' },
  ];

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/60 overflow-y-auto">
      <div className="space-y-4">
        {/* Navigation Items */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'tasks' && activeTab === 'weekly-tasks') || (item.id === 'linkedin-ai' && activeTab === 'linkedin-influence');
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onSelectTab(item.id as NavTab)}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Live Feature Quick Launchers */}
      <div className="mt-6 space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Live AI Features
        </div>

        {/* Video Call Mock */}
        <button
          id="btn-sidebar-video-call"
          onClick={onOpenVideoCall}
          className="flex w-full items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-2 text-xs font-bold text-blue-800 transition hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200 text-left"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <Video className="h-3.5 w-3.5" />
          </div>
          <div className="text-left flex-1">
            <div className="text-[12px]">Video Call Mock</div>
            <div className="text-[10px] font-normal text-blue-600 dark:text-blue-300">Live AI Camera Screen</div>
          </div>
        </button>

        {/* Voice Call AI Coach */}
        <button
          id="btn-sidebar-voice-call"
          onClick={onOpenVoiceCall}
          className="flex w-full items-center gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-2 text-xs font-bold text-indigo-800 transition hover:bg-indigo-100 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-200 text-left"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
            <Mic className="h-3.5 w-3.5" />
          </div>
          <div className="text-left flex-1">
            <div className="text-[12px]">Voice AI Coach</div>
            <div className="text-[10px] font-normal text-indigo-600 dark:text-indigo-300">Real-time Audio Prep</div>
          </div>
        </button>

        {/* Aptitude Test */}
        <button
          id="btn-sidebar-aptitude-test"
          onClick={handleAptitude}
          className="flex w-full items-center gap-2.5 rounded-xl border border-purple-200 bg-purple-50/70 px-3 py-2 text-xs font-bold text-purple-800 transition hover:bg-purple-100 dark:border-purple-900/40 dark:bg-purple-950/30 dark:text-purple-200 text-left"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-600 text-white shadow-xs">
            <BrainCircuit className="h-3.5 w-3.5" />
          </div>
          <div className="text-left flex-1">
            <div className="text-[12px]">Aptitude Test</div>
            <div className="text-[10px] font-normal text-purple-600 dark:text-purple-300">Quant, Logic & Verbal</div>
          </div>
        </button>

        {/* 24/7 AI Help Desk */}
        <button
          id="btn-sidebar-help-source"
          onClick={handleHelp}
          className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <HelpCircle className="h-4 w-4 text-slate-400" />
          <span>24/7 Help Source</span>
        </button>

        {/* Candidate Profile Widget */}
        {user && (
          <div
            onClick={() => onSelectTab('profile')}
            className="cursor-pointer flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-2xs hover:border-blue-400 dark:border-slate-800 dark:bg-slate-800 transition"
            title="View & Edit Candidate Profile"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-xl object-cover ring-1 ring-blue-500/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.targetCompany}</p>
            </div>
            <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              ATS {user.atsScore}%
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
