import { useState } from 'react';
import {
  Share2,
  Sparkles,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  Linkedin,
  Zap,
  Users,
  Eye,
  Award,
  Send,
  MessageSquare,
  Bookmark,
} from 'lucide-react';
import { UserProfile } from '../types';

interface LinkedInAIInfluenceViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export function LinkedInAIInfluenceView({ user, onUpdateProfile }: LinkedInAIInfluenceViewProps) {
  const [topic, setTopic] = useState('Why distributed rate limiters fail under extreme thundering herd traffic in Tier-1 MNCs');
  const [tone, setTone] = useState<'Thought Leader' | 'Technical Breakdown' | 'Storytelling' | 'Recruiter Magnet'>('Technical Breakdown');
  const [targetMNC, setTargetMNC] = useState('Google & AWS');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    postContent: string;
    estimatedImpressions: string;
    viralHookScore: number;
    recommendedHashtags: string[];
  }>({
    postContent: `🚀 Most engineers think caching is simple until a thundering herd takes down production.

Here is how Tier-1 MNCs like Google & AWS architect distributed rate limiters for 500,000+ RPS:

1️⃣ Token Bucket with Atomic Redis Lua Scripts:
Never read-then-write across network hops. Execute token decrement logic server-side in Redis in a single atomic cycle to eliminate race conditions.

2️⃣ Sliding Window Log vs Sliding Window Counter:
Logs give 100% precision but consume heavy memory. Counters offer 99.8% precision with O(1) memory overhead. Always pick Counter for multi-tenant systems.

3️⃣ Edge Decentralization:
Push rate limiting to Cloudflare Workers / AWS CloudFront edge nodes before traffic even touches your core API gateways.

Scale is about anticipating failure modes before they happen.

What rate-limiting architecture do you swear by? Let's discuss in the comments! 👇

#SystemDesign #SoftwareEngineering #CloudArchitecture #TechCareers #Google #AWS #DistributedSystems`,
    estimatedImpressions: '6.2k - 11.5k',
    viralHookScore: 94,
    recommendedHashtags: ['#SystemDesign', '#SoftwareEngineering', '#Google', '#TechCareers'],
  });

  const handleGeneratePost = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/linkedin-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          tone,
          targetMNC,
          goal: 'Attract tech recruiters and build high-authority developer influence',
        }),
      });
      const data = await res.json();
      setGeneratedResult({
        postContent: data.postContent || generatedResult.postContent,
        estimatedImpressions: data.estimatedImpressions || '5.5k - 9.0k',
        viralHookScore: data.viralHookScore || 92,
        recommendedHashtags: data.recommendedHashtags || ['#TechLeadership', '#SystemDesign'],
      });
    } catch (err) {
      console.error('LinkedIn gen error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPost = () => {
    navigator.clipboard.writeText(generatedResult.postContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0A66C2] via-blue-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 fill-current" />
                LinkedIn AI Influence Sync
              </span>
              <span className="rounded-full bg-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-400/40">
                Top 3% Tech Creator
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Build Authority & Attract Tier-1 MNC Recruiters
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Generate viral tech breakdowns, optimize your profile headline, and showcase system design authority on LinkedIn.
            </p>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1 text-[11px] text-blue-200">
                <Users className="h-3.5 w-3.5" />
                <span>Followers</span>
              </div>
              <p className="text-lg font-black text-white mt-0.5">8,420</p>
              <p className="text-[10px] text-emerald-300">+340 this week</p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1 text-[11px] text-blue-200">
                <Eye className="h-3.5 w-3.5" />
                <span>Profile Views</span>
              </div>
              <p className="text-lg font-black text-white mt-0.5">1,890</p>
              <p className="text-[10px] text-emerald-300">42 Recruiters</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1 text-[11px] text-blue-200">
                <Zap className="h-3.5 w-3.5 text-amber-300" />
                <span>Influence Rank</span>
              </div>
              <p className="text-lg font-black text-amber-300 mt-0.5">94 / 100</p>
              <p className="text-[10px] text-blue-200">High Authority</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Generator & Profile Sync Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Post Creator */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0A66C2]" />
                AI Viral Tech Post Generator
              </h2>
              <span className="text-xs text-slate-400">Powered by Gemini 3.7</span>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Audience / MNC
                </label>
                <input
                  id="input-linkedin-target-mnc"
                  type="text"
                  value={targetMNC}
                  onChange={(e) => setTargetMNC(e.target.value)}
                  placeholder="e.g. Google, Amazon, Microsoft, Apple"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Writing Tone & Style
                </label>
                <select
                  id="select-linkedin-tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Technical Breakdown">Technical Breakdown (Architectural Deep-Dive)</option>
                  <option value="Thought Leader">Thought Leader (Inspiring & High-Scale)</option>
                  <option value="Storytelling">Storytelling (Overcoming Hard Tech Bug)</option>
                  <option value="Recruiter Magnet">Recruiter Magnet (Project Wins & Scale)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Post Topic or Engineering Concept
              </label>
              <textarea
                id="textarea-linkedin-topic"
                rows={2}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What engineering insight or interview learning would you like to share?"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <button
              id="btn-generate-linkedin-post"
              onClick={handleGeneratePost}
              disabled={isGenerating || !topic.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0A66C2] to-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGenerating ? 'Drafting High-Impact Post...' : 'Generate High-Engagement Post'}</span>
            </button>
          </div>

          {/* Generated Post Preview Box */}
          <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-[#0A66C2] fill-current" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">LinkedIn Post Preview</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <Zap className="h-3 w-3" />
                  <span>Viral Hook Score: {generatedResult.viralHookScore}/100</span>
                </div>

                <button
                  id="btn-copy-linkedin-post"
                  onClick={handleCopyPost}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Post'}</span>
                </button>
              </div>
            </div>

            {/* Author Header */}
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/30"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md">{user.title}</p>
                <span className="text-[10px] text-slate-400">Just now • 🌐</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-800 whitespace-pre-line dark:bg-slate-900 dark:text-slate-200 border border-slate-100 dark:border-slate-800">
              {generatedResult.postContent}
            </div>

            {/* Projected Stats */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
              <span>Estimated Reach: <strong className="text-blue-600 dark:text-blue-400">{generatedResult.estimatedImpressions} impressions</strong></span>
              <a
                href={user.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#0A66C2] font-semibold hover:underline"
              >
                <span>Open LinkedIn Profile</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Profile Headline & Optimization */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              MNC Recruiter Headline Audit
            </h3>

            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 dark:border-blue-900/40 dark:bg-blue-950/20 space-y-1">
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase">Recommended Headline</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Senior SDE @ Top Tier Tech | Distributed Systems (500k RPS) | React 19 • TypeScript • Go • AWS | Ex-Fintech
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Keyword Match (Google/Amazon)</span>
                <span className="font-bold text-emerald-600">96%</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Recruiter InMail Conversion</span>
                <span className="font-bold text-blue-600">High (Top 5%)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Search Appearance Rank</span>
                <span className="font-bold text-indigo-600">#4 for "Staff SDE"</span>
              </div>
            </div>
          </div>

          {/* Quick Connection URL */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-850">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Connected LinkedIn Profile</h4>
            <div className="flex items-center gap-2">
              <input
                id="input-profile-linkedin-url"
                type="text"
                value={user.linkedinUrl}
                onChange={(e) => onUpdateProfile({ linkedinUrl: e.target.value })}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Check className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
