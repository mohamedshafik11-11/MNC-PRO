import { useState } from 'react';
import {
  Video,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Calendar,
  Building2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MockInterviewSession } from '../types';

interface InterviewReviewViewProps {
  sessions: MockInterviewSession[];
  onStartNewMock: () => void;
}

export function InterviewReviewView({ sessions, onStartNewMock }: InterviewReviewViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(sessions[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-600" />
            Interview Performance & Bar Raiser Reviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Comprehensive audit reports, transcripts, confidence metrics, and Tier-1 MNC hiring decisions.
          </p>
        </div>

        <button
          id="btn-start-new-mock-review"
          onClick={onStartNewMock}
          className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition"
        >
          <Video className="h-4 w-4" />
          <span>Launch AI Video Mock</span>
        </button>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {sessions.map((session) => {
          const isExpanded = expandedId === session.id;

          return (
            <div
              key={session.id}
              id={`session-card-${session.id}`}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition dark:border-slate-800 dark:bg-slate-850 space-y-4"
            >
              {/* Header */}
              <div
                onClick={() => toggleExpand(session.id)}
                className="cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 font-black text-blue-700 dark:bg-slate-800 dark:text-white">
                    {session.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{session.role}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          session.verdict === 'Strong Hire' || session.verdict === 'Hire'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {session.verdict.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{session.company}</span>
                      <span>•</span>
                      <span>{session.roundType || session.type}</span>
                      <span>•</span>
                      <span>{session.date}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">{session.overallScore || session.score || 90}%</span>
                    <p className="text-[10px] text-slate-400">Bar Raiser Score</p>
                  </div>

                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Detailed Breakdown when expanded */}
              {isExpanded && (
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
                  {/* Feedback summary */}
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      "{session.feedbackSummary || session.keyFeedback}"
                    </p>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        Demonstrated Strengths
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        {session.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-500">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-2">
                      <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4" />
                        Targeted Growth Areas
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        {session.improvements.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-500">•</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={onStartNewMock}
                      className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Retake Similar Round Drill</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
