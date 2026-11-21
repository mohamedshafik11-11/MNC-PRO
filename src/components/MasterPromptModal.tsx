import { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Zap,
  Terminal,
  FileText,
  Linkedin,
  Video,
  BrainCircuit,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MasterPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunPromptInChat?: (promptText: string) => void;
}

export function MasterPromptModal({ isOpen, onClose, onRunPromptInChat }: MasterPromptModalProps) {
  const [targetCompany, setTargetCompany] = useState('Google & Amazon');
  const [targetRole, setTargetRole] = useState('Senior Software Engineer (SDE III / Staff)');
  const [sprintDuration, setSprintDuration] = useState('10-Minute Fast-Track');
  const [focusArea, setFocusArea] = useState('System Design & Behavioral STAR Bar Raiser');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const generatedMasterPrompt = `Act as an elite Principal Hiring Bar Raiser and Technical Recruiter for ${targetCompany}.
You are conducting a high-stakes ${sprintDuration} interview drill for a ${targetRole} candidate focusing on ${focusArea}.

Execute the following 4-step assessment protocol:
1. [SYSTEM DESIGN CRUCIBLE]: Give me 1 high-concurrency architecture problem (e.g. distributed rate limiter, multi-datacenter cache consistency, or fault-tolerant event broker) handling 500k+ RPS with sub-5ms P99 latency.
2. [BEHAVIORAL STAR DRILL]: Probe on 1 high-conflict engineering leadership scenario requiring blameless post-mortem and executive consensus.
3. [EVALUATION MATRIX]: Grade my answer across Scalability (O(1) memory & IOPS bounds), Trade-off Nuance, and Communication Confidence.
4. [MNC HIRING DECISION]: Conclude with an unambiguous Hiring Bar verdict (Strong Hire / Hire / Lean No / No Hire) with 3 precise architectural bullet optimizations.`;

  const curatedPrompts = [
    {
      id: 'p-10min',
      title: '⚡ 10-Minute Rapid MNC Interview Drill Prompt',
      tag: 'Fast-Track',
      prompt: generatedMasterPrompt,
    },
    {
      id: 'p-linkedin',
      title: '🚀 Viral LinkedIn Tech Thought-Leadership Prompt',
      tag: 'Influence',
      prompt: `Act as a Top 1% Tech Influencer on LinkedIn. Write a high-engagement, viral technical breakdown on "Why distributed rate limiters fail under thundering herd traffic in Tier-1 MNCs". Use the hook-problem-solution-code-callout structure with bullet points, zero fluff, and targeted hashtags (#SystemDesign #SoftwareEngineering #${targetCompany.replace(/\s+/g, '')}).`,
    },
    {
      id: 'p-ats',
      title: '🎯 Google XYZ Formula Resume Bullet Transformer',
      tag: 'ATS 95%+',
      prompt: `Transform my engineering bullet points into high-impact Google XYZ format ("Accomplished [X] as measured by [Y], by doing [Z]"). Ensure strong verbs, quantified latency/RPS/dollar metrics, and high-density keywords for ${targetRole} at ${targetCompany}.`,
    },
    {
      id: 'p-aptitude',
      title: '🧠 10-Second Mental Math Aptitude Shortcut Engine',
      tag: 'Aptitude',
      prompt: `Explain the top 5 speed-math shortcuts and algebraic mental models used to solve Tier-1 MNC quantitative aptitude questions under 20 seconds each. Include real sample problems for Work-Time, Permutations, and Probability.`,
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="master-prompt-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div id="master-prompt-window" className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-slate-800 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 font-bold text-white shadow-sm shadow-amber-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  10-Minute Master Prompt Accelerator Kit
                </h3>
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  Ready to Deploy
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customized high-precision prompt templates for Gemini, Claude, and MNC Pro AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customizer Controls */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Customize Your 10-Minute Strategy Variables
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target MNC
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Time Budget
                </label>
                <input
                  type="text"
                  value={sprintDuration}
                  onChange={(e) => setSprintDuration(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Focus Drill
                </label>
                <input
                  type="text"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Curated Prompts Cards */}
          <div className="space-y-4">
            {curatedPrompts.map((cp) => (
              <div
                key={cp.id}
                className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-850 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{cp.title}</h4>
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {cp.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onRunPromptInChat && (
                      <button
                        onClick={() => {
                          onRunPromptInChat(cp.prompt);
                          onClose();
                        }}
                        className="flex items-center gap-1 rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300"
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>Run in AI Coach</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleCopy(cp.id, cp.prompt)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {copiedId === cp.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedId === cp.id ? 'Copied!' : 'Copy Prompt'}</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-900 p-3.5 font-mono text-[11px] leading-relaxed text-slate-200 whitespace-pre-line border border-slate-800">
                  {cp.prompt}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">MNC Pro • Prompt Engineering Accelerator</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
